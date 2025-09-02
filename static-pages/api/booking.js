/**
 * Booking System Vercel API Handler
 * Handles calendar availability, booking creation, and email notifications
 * Migrated from AWS Lambda to Vercel Functions
 */

const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const ical = require('ical-generator');

// Rate limiting storage (in-memory, resets on deployments)
const rateLimitStorage = new Map();

// Configuration - updated for per-day scheduling
const CONFIG = {
    timezone: 'America/Los_Angeles',
    // Per-day schedule (new format)
    dailySchedule: {
        monday: { start: 9, end: 17, isDayOff: false },
        tuesday: { start: 9, end: 17, isDayOff: false },
        wednesday: { start: 9, end: 17, isDayOff: false },
        thursday: { start: 9, end: 17, isDayOff: false },
        friday: { start: 9, end: 17, isDayOff: false },
        saturday: { start: 9, end: 17, isDayOff: true },
        sunday: { start: 9, end: 17, isDayOff: true }
    },
    // Legacy format for backward compatibility
    workingHours: { start: 9, end: 17 },
    workingDays: [1, 2, 3, 4, 5], // Monday-Friday
    bufferMinutes: 15,
    advanceBookingDays: 14,
    minimumNoticeHours: 6,  // Reduced from 24 for testing
    maxBookingsPerDay: 8,
    profileName: 'Tem Tiagha',
    profileEmail: 'support@donationtransparency.org',
    adminEmail: process.env.ADMIN_EMAIL || 'support@donationtransparency.org'
};

/**
 * Get schedule for a specific day
 * @param {number} dayOfWeek - 0=Sunday, 1=Monday, etc.
 * @param {object} settings - Optional saved settings object
 * @returns {object} { start, end, isDayOff }
 */
function getDaySchedule(dayOfWeek, settings = null) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    // Use saved settings if available
    if (settings && settings.availability && settings.availability.dailySchedule && settings.availability.dailySchedule[dayName]) {
        const daySchedule = settings.availability.dailySchedule[dayName];
        return {
            start: typeof daySchedule.start === 'string' ? parseInt(daySchedule.start.split(':')[0]) : daySchedule.start,
            end: typeof daySchedule.end === 'string' ? parseInt(daySchedule.end.split(':')[0]) : daySchedule.end,
            isDayOff: daySchedule.isDayOff
        };
    }
    
    // Fallback to CONFIG
    if (CONFIG.dailySchedule && CONFIG.dailySchedule[dayName]) {
        return CONFIG.dailySchedule[dayName];
    }
    
    // Legacy fallback
    const isWorkingDay = CONFIG.workingDays.includes(dayOfWeek);
    return {
        start: CONFIG.workingHours.start,
        end: CONFIG.workingHours.end,
        isDayOff: !isWorkingDay
    };
}

/**
 * Rate limiting check
 */
function checkRateLimit(ip, action = 'general') {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const limits = {
        general: 10,
        getAvailability: 30,
        bookAppointment: 5
    };
    const maxRequests = limits[action] || limits.general;
    
    const key = `${ip}:${action}`;
    if (!rateLimitStorage.has(key)) {
        rateLimitStorage.set(key, []);
    }
    
    const requests = rateLimitStorage.get(key);
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitStorage.set(key, recentRequests);
    return true;
}

/**
 * Get Google Calendar credentials from environment variables
 */
function getGoogleCredentials() {
    try {
        return {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            redirect_uris: ['https://donationtransparency.org/booking/auth/callback']
        };
    } catch (error) {
        console.error('Failed to get Google credentials from environment:', error);
        throw new Error('Calendar integration not available');
    }
}

/**
 * Initialize Google Calendar client with proper token refresh
 */
async function getCalendarClient() {
    const credentials = getGoogleCredentials();
    
    const auth = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris[0]
    );
    
    // Set refresh token
    auth.setCredentials({
        refresh_token: credentials.refresh_token
    });
    
    try {
        // Force token refresh to get a valid access token
        const { credentials: tokens } = await auth.refreshAccessToken();
        console.log('Successfully refreshed Google OAuth tokens');
        
        // Set the fresh tokens
        auth.setCredentials(tokens);
        
        return google.calendar({ version: 'v3', auth });
    } catch (error) {
        console.error('Failed to refresh Google OAuth tokens:', error);
        throw new Error('Google Calendar authentication failed. Please check OAuth configuration.');
    }
}

/**
 * Get available time slots for a date range
 */
async function getAvailability(startDate, endDate, settings = null) {
    try {
        const calendar = await getCalendarClient();
        
        // Query free/busy information
        const freeBusyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                timeZone: CONFIG.timezone,
                items: [{ id: 'primary' }]
            }
        });
        
        const busyTimes = freeBusyResponse.data.calendars.primary.busy || [];
        
        // Generate available slots
        const availableSlots = [];
        const currentDate = new Date(startDate);
        
        while (currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            const daySchedule = getDaySchedule(dayOfWeek, settings);
            
            if (!daySchedule.isDayOff) {
                const daySlots = generateDaySlots(currentDate, daySchedule, busyTimes, settings);
                availableSlots.push(...daySlots);
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return availableSlots;
    } catch (error) {
        console.error('Error getting availability:', error);
        
        // Check if it's an authentication error
        if (error.message?.includes('authentication') || error.code === 401 || error.code === 403) {
            console.error('Google Calendar authentication failed - using fallback mode');
        }
        
        // Fallback mode: return open calendar slots
        return generateFallbackAvailability(startDate, endDate, settings);
    }
}

/**
 * Generate fallback availability when Google Calendar is unavailable
 */
function generateFallbackAvailability(startDate, endDate, settings = null) {
    const availableSlots = [];
    const currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
        const dayOfWeek = currentDate.getDay();
        const daySchedule = getDaySchedule(dayOfWeek, settings);
        
        if (!daySchedule.isDayOff) {
            const daySlots = generateDaySlots(currentDate, daySchedule, [], settings, true);
            availableSlots.push(...daySlots);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableSlots;
}

/**
 * Generate time slots for a specific day
 */
function generateDaySlots(date, daySchedule, busyTimes, settings = null, isFallback = false) {
    const slots = [];
    const userTimezone = settings?.availability?.timezone || CONFIG.timezone;
    const meetingTypes = settings?.meetingTypes || [
        { name: '15-minute call', duration: 15 },
        { name: '30-minute call', duration: 30 },
        { name: '60-minute call', duration: 60 }
    ];
    
    // Generate slots for each meeting type
    meetingTypes.forEach(meetingType => {
        const duration = meetingType.duration;
        const startHour = daySchedule.start;
        const endHour = daySchedule.end;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                const slotStart = new Date(date);
                slotStart.setHours(hour, minutes, 0, 0);
                
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + duration);
                
                // Check if slot is in the past
                const now = new Date();
                const minimumNoticeMs = (settings?.availability?.minimumNoticeHours || CONFIG.minimumNoticeHours) * 60 * 60 * 1000;
                if (slotStart.getTime() <= now.getTime() + minimumNoticeMs) {
                    continue;
                }
                
                // Check if slot conflicts with busy times (skip in fallback mode)
                if (!isFallback) {
                    const isConflict = busyTimes.some(busy => {
                        const busyStart = new Date(busy.start);
                        const busyEnd = new Date(busy.end);
                        return slotStart < busyEnd && slotEnd > busyStart;
                    });
                    
                    if (isConflict) {
                        continue;
                    }
                }
                
                // Add buffer time
                const bufferEnd = new Date(slotEnd);
                bufferEnd.setMinutes(bufferEnd.getMinutes() + CONFIG.bufferMinutes);
                
                if (bufferEnd.getHours() <= endHour) {
                    slots.push({
                        start: slotStart.toISOString(),
                        end: slotEnd.toISOString(),
                        duration: duration,
                        meetingType: meetingType.name,
                        available: true,
                        fallbackMode: isFallback || false
                    });
                }
            }
        }
    });
    
    return slots;
}

/**
 * Send confirmation emails using external email service
 */
async function sendConfirmationEmails(bookingData, eventData) {
    try {
        // For now, we'll use a simple email service
        // This can be replaced with SendGrid, Resend, or other services
        console.log('Email would be sent to:', bookingData.email);
        console.log('Admin email would be sent to:', CONFIG.adminEmail);
        console.log('Booking details:', {
            name: bookingData.name,
            email: bookingData.email,
            date: bookingData.date,
            time: bookingData.time,
            meetingType: bookingData.meetingType
        });
        
        // TODO: Implement actual email sending with chosen service
        return true;
    } catch (error) {
        console.error('Error sending confirmation emails:', error);
        return false;
    }
}

/**
 * Create Google Calendar event
 */
async function createCalendarEvent(bookingData) {
    try {
        const calendar = await getCalendarClient();
        
        // Handle both dateTime (ISO string) and separate date/time fields
        const startTime = bookingData.dateTime ? 
            new Date(bookingData.dateTime) : 
            new Date(bookingData.date + 'T' + bookingData.time);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (bookingData.duration || 30));
        
        const event = {
            summary: `Meeting with ${bookingData.name}`,
            description: `Meeting booked through donation transparency booking system\n\nContact: ${bookingData.email}\nType: ${bookingData.meetingType || '30-minute call'}\n\nNotes: ${bookingData.notes || 'No additional notes'}`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: CONFIG.timezone
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: CONFIG.timezone
            },
            attendees: [
                { email: bookingData.email },
                { email: CONFIG.profileEmail }
            ],
            conferenceData: {
                createRequest: {
                    requestId: uuidv4(),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }
        };
        
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            conferenceDataVersion: 1
        });
        
        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        
        // Provide more specific error messaging for authentication issues
        if (error.code === 401 || error.code === 403) {
            throw new Error('Google Calendar authentication failed. Please check OAuth credentials.');
        } else if (error.message?.includes('quota')) {
            throw new Error('Google Calendar API quota exceeded. Please try again later.');
        } else {
            throw new Error(`Failed to create calendar event: ${error.message}`);
        }
    }
}

/**
 * Validate booking request
 */
function validateBookingRequest(body) {
    const errors = [];
    
    if (!body.name || body.name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters');
    }
    
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push('Valid email address is required');
    }
    
    if (!body.dateTime && (!body.date || !body.time)) {
        errors.push('Date and time are required');
    }
    
    return errors;
}

/**
 * Main Vercel API Handler
 */
module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        
        // Only accept POST requests for booking operations
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { action } = req.body;
        
        // Get client IP for rate limiting
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                        req.headers['x-real-ip'] || 
                        req.connection?.remoteAddress || 
                        'unknown';
        
        // Rate limiting
        if (!checkRateLimit(clientIP, action)) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
        
        console.log(`Processing ${action} request from ${clientIP}`);
        
        switch (action) {
            case 'getAvailability': {
                const { startDate, endDate, timezone } = req.body;
                
                // For now, use default settings - can be extended later
                let settings = null;
                
                // Override timezone if provided in request
                if (timezone && (!settings || !settings.availability)) {
                    settings = settings || {};
                    settings.availability = settings.availability || {};
                    settings.availability.timezone = timezone;
                }
                
                const start = startDate ? new Date(startDate) : new Date();
                const advanceBookingDays = (settings?.availability?.advanceBookingDays) || CONFIG.advanceBookingDays;
                
                // Fix: If endDate is provided and same as startDate, extend to end of day
                let end;
                if (endDate) {
                    end = new Date(endDate);
                    // If it's the same date as start, extend to end of that day
                    if (startDate && endDate === startDate) {
                        end.setHours(23, 59, 59, 999);
                    }
                } else {
                    end = new Date(Date.now() + (advanceBookingDays * 24 * 60 * 60 * 1000));
                }
                
                console.log('getAvailability request:', {
                    startDate: start.toISOString(),
                    endDate: end.toISOString(),
                    timezone: settings?.availability?.timezone || timezone || CONFIG.timezone,
                    settings: settings?.availability
                });
                
                const availability = await getAvailability(start, end, settings);
                
                console.log(`Generated ${availability.length} available slots`);
                
                return res.status(200).json({
                    success: true,
                    availability,
                    timezone: settings?.availability?.timezone || CONFIG.timezone
                });
            }
            
            case 'bookAppointment': {
                // Validate request
                const validationErrors = validateBookingRequest(req.body);
                if (validationErrors.length > 0) {
                    return res.status(400).json({
                        error: 'Validation failed',
                        details: validationErrors
                    });
                }
                
                // Create calendar event
                const eventData = await createCalendarEvent(req.body);
                
                // Send confirmation emails
                await sendConfirmationEmails(req.body, eventData);
                
                console.log(`Booking created successfully for ${req.body.email}`);
                
                return res.status(200).json({
                    success: true,
                    message: 'Meeting booked successfully',
                    eventId: eventData.id,
                    eventLink: eventData.htmlLink,
                    meetingLink: eventData.hangoutLink
                });
            }
            
            case 'getProfile': {
                return res.status(200).json({
                    success: true,
                    profile: {
                        name: CONFIG.profileName,
                        email: CONFIG.profileEmail,
                        timezone: CONFIG.timezone,
                        bio: 'Founder of Donation Transparency',
                        avatar: 'https://donationtransparency.org/assets/images/team/tem-tiagha.jpg'
                    }
                });
            }
            
            case 'debugAuth': {
                const credentials = getGoogleCredentials();
                return res.status(200).json({
                    success: true,
                    debug: {
                        hasClientId: !!credentials.client_id,
                        hasClientSecret: !!credentials.client_secret,
                        hasRefreshToken: !!credentials.refresh_token,
                        clientIdPrefix: credentials.client_id ? credentials.client_id.substring(0, 10) + '...' : 'missing',
                        redirectUri: credentials.redirect_uris[0]
                    }
                });
            }
            
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}