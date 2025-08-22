/**
 * Booking System Lambda Handler
 * Handles calendar availability, booking creation, and email notifications
 */

import { SES, SendEmailCommand } from '@aws-sdk/client-ses';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import ical from 'ical-generator';

// Initialize AWS services
const ses = new SES({
    region: process.env.REGION || 'us-east-1'
});

const secretsManager = new SecretsManagerClient({
    region: process.env.REGION || 'us-east-1'
});

// Rate limiting storage (in-memory, resets on cold starts)
const rateLimitStorage = new Map();

// Configuration
const CONFIG = {
    timezone: 'America/Los_Angeles',
    workingHours: { start: 9, end: 17 },
    workingDays: [1, 2, 3, 4, 5], // Monday-Friday
    bufferMinutes: 15,
    advanceBookingDays: 14,
    minimumNoticeHours: 24,
    maxBookingsPerDay: 8,
    profileName: 'Tem Tiagha',
    profileEmail: 'support@donationtransparency.org',
    adminEmail: process.env.ADMIN_EMAIL || 'support@donationtransparency.org'
};

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
 * Get Google Calendar credentials from AWS Secrets Manager
 */
async function getGoogleCredentials() {
    try {
        const command = new GetSecretValueCommand({
            SecretId: process.env.GOOGLE_CREDENTIALS_SECRET_NAME || 'booking/google-credentials'
        });
        
        const result = await secretsManager.send(command);
        return JSON.parse(result.SecretString);
    } catch (error) {
        console.error('Failed to get Google credentials:', error);
        throw new Error('Calendar integration not available');
    }
}

/**
 * Initialize Google Calendar client
 */
async function getCalendarClient() {
    const credentials = await getGoogleCredentials();
    
    const auth = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris[0]
    );
    
    auth.setCredentials({
        refresh_token: credentials.refresh_token
    });
    
    return google.calendar({ version: 'v3', auth });
}

/**
 * Get available time slots for a date range
 */
async function getAvailability(startDate, endDate) {
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
            // Check if it's a working day
            if (CONFIG.workingDays.includes(currentDate.getDay())) {
                const daySlots = generateDaySlots(currentDate, busyTimes);
                availableSlots.push(...daySlots);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return availableSlots;
    } catch (error) {
        console.error('Failed to get availability:', error);
        throw error;
    }
}

/**
 * Generate available slots for a specific day
 */
function generateDaySlots(date, busyTimes) {
    const slots = [];
    const dayStart = new Date(date);
    dayStart.setHours(CONFIG.workingHours.start, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(CONFIG.workingHours.end, 0, 0, 0);
    
    // Generate 30-minute slots
    const current = new Date(dayStart);
    while (current < dayEnd) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);
        
        // Check if slot conflicts with busy times
        const isAvailable = !busyTimes.some(busy => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return (current < busyEnd && slotEnd > busyStart);
        });
        
        // Check minimum notice period
        const now = new Date();
        const hoursFromNow = (current - now) / (1000 * 60 * 60);
        const hasMinimumNotice = hoursFromNow >= CONFIG.minimumNoticeHours;
        
        if (isAvailable && hasMinimumNotice) {
            slots.push({
                start: current.toISOString(),
                end: slotEnd.toISOString(),
                available: true
            });
        }
        
        current.setMinutes(current.getMinutes() + 30);
    }
    
    return slots;
}

/**
 * Create a calendar event
 */
async function createCalendarEvent(bookingData) {
    try {
        const calendar = await getCalendarClient();
        
        const startTime = new Date(bookingData.dateTime);
        const endTime = new Date(startTime.getTime() + (bookingData.duration * 60 * 1000));
        
        // Determine meeting location/link
        let location = '';
        let description = `Meeting booked through Donation Transparency booking system.\n\nGuest: ${bookingData.name}\nEmail: ${bookingData.email}\n`;
        
        if (bookingData.notes) {
            description += `\nNotes: ${bookingData.notes}`;
        }
        
        switch (bookingData.location) {
            case 'google_meet':
                location = 'Google Meet (link will be generated)';
                break;
            case 'zoom':
                location = 'Zoom (details to be sent)';
                break;
            case 'phone':
                location = `Phone: ${bookingData.phone}`;
                break;
            default:
                location = 'Details to be provided';
        }
        
        const eventData = {
            summary: `${bookingData.meetingType} with ${CONFIG.profileName}`,
            description: description,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: CONFIG.timezone
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: CONFIG.timezone
            },
            location: location,
            attendees: [
                {
                    email: bookingData.email,
                    displayName: bookingData.name,
                    responseStatus: 'accepted'
                }
            ],
            conferenceData: bookingData.location === 'google_meet' ? {
                createRequest: {
                    requestId: uuidv4(),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            } : undefined,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 24 hours
                    { method: 'email', minutes: 60 }       // 1 hour
                ]
            }
        };
        
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: eventData,
            conferenceDataVersion: bookingData.location === 'google_meet' ? 1 : 0,
            sendUpdates: 'all'
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to create calendar event:', error);
        throw error;
    }
}

/**
 * Generate calendar invite (.ics file)
 */
function generateCalendarInvite(bookingData, eventData) {
    const startTime = new Date(bookingData.dateTime);
    const endTime = new Date(startTime.getTime() + (bookingData.duration * 60 * 1000));
    
    const calendar = ical({
        domain: 'donationtransparency.org',
        name: 'Donation Transparency Booking',
        prodId: '//Donation Transparency//Booking System//EN'
    });
    
    calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: `${bookingData.meetingType} with ${CONFIG.profileName}`,
        description: `Meeting details:\n\nType: ${bookingData.meetingType}\nDuration: ${bookingData.duration} minutes\nLocation: ${eventData.location}\n\nNotes: ${bookingData.notes || 'None'}`,
        location: eventData.location,
        url: eventData.htmlLink,
        organizer: {
            name: CONFIG.profileName,
            email: CONFIG.profileEmail
        },
        attendees: [
            {
                name: bookingData.name,
                email: bookingData.email,
                status: 'accepted'
            }
        ]
    });
    
    return calendar.toString();
}

/**
 * Send confirmation emails
 */
async function sendConfirmationEmails(bookingData, eventData) {
    const startTime = new Date(bookingData.dateTime);
    const formattedTime = startTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: bookingData.timezone,
        timeZoneName: 'short'
    });
    
    // Generate calendar invite attachment
    const icsContent = generateCalendarInvite(bookingData, eventData);
    const icsAttachment = {
        filename: 'meeting-invite.ics',
        content: Buffer.from(icsContent).toString('base64'),
        type: 'text/calendar'
    };
    
    // Guest confirmation email
    const guestEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; background: #6EC1E4; color: white; padding: 20px; border-radius: 8px; }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin-bottom: 10px; }
        .detail-label { font-weight: bold; display: inline-block; width: 100px; }
        .actions { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: #6EC1E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Meeting Confirmed!</h1>
            <p>Your meeting with ${CONFIG.profileName} has been scheduled</p>
        </div>
        
        <div class="meeting-details">
            <h3>Meeting Details:</h3>
            <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                ${formattedTime}
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                ${bookingData.duration} minutes
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                ${bookingData.meetingType}
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                ${eventData.location}
            </div>
            ${eventData.hangoutLink ? `
            <div class="detail-row">
                <span class="detail-label">Meeting Link:</span>
                <a href="${eventData.hangoutLink}">${eventData.hangoutLink}</a>
            </div>
            ` : ''}
        </div>
        
        <div class="actions">
            <a href="${eventData.htmlLink}" class="btn">View in Google Calendar</a>
        </div>
        
        <p>This meeting has been added to your calendar. You'll receive reminders 24 hours and 1 hour before the meeting.</p>
        
        <p>Need to reschedule or cancel? Please reply to this email.</p>
        
        <p>Best regards,<br><strong>${CONFIG.profileName}</strong></p>
    </div>
</body>
</html>`;
    
    // Send guest confirmation
    await ses.send(new SendEmailCommand({
        Source: CONFIG.profileEmail,
        Destination: {
            ToAddresses: [bookingData.email]
        },
        Message: {
            Subject: {
                Data: `Meeting Confirmed: ${bookingData.meetingType} with ${CONFIG.profileName}`
            },
            Body: {
                Html: {
                    Data: guestEmailHtml
                },
                Text: {
                    Data: `Meeting Confirmed!\n\nYour ${bookingData.meetingType} with ${CONFIG.profileName} is scheduled for:\n${formattedTime}\n\nDuration: ${bookingData.duration} minutes\nLocation: ${eventData.location}\n\nMeeting link: ${eventData.hangoutLink || 'Details to be provided'}\n\nBest regards,\n${CONFIG.profileName}`
                }
            }
        }
    }));
    
    // Admin notification
    await ses.send(new SendEmailCommand({
        Source: CONFIG.profileEmail,
        Destination: {
            ToAddresses: [CONFIG.adminEmail]
        },
        Message: {
            Subject: {
                Data: `New Booking: ${bookingData.meetingType} with ${bookingData.name}`
            },
            Body: {
                Text: {
                    Data: `New booking confirmed:\n\nGuest: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone || 'Not provided'}\nType: ${bookingData.meetingType}\nDate/Time: ${formattedTime}\nDuration: ${bookingData.duration} minutes\nLocation: ${eventData.location}\nNotes: ${bookingData.notes || 'None'}\n\nGoogle Calendar Event: ${eventData.htmlLink}`
                }
            }
        }
    }));
}

/**
 * Validate booking request
 */
function validateBookingRequest(data) {
    const errors = [];
    
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!/\S+@\S+\.\S+/.test(data.email)) errors.push('Valid email is required');
    if (!data.dateTime) errors.push('Date and time are required');
    if (!data.duration || ![15, 30, 60].includes(data.duration)) errors.push('Valid duration is required');
    if (!data.meetingType) errors.push('Meeting type is required');
    if (!data.location) errors.push('Location is required');
    if (data.location === 'phone' && !data.phone?.trim()) errors.push('Phone number is required for phone meetings');
    
    // Validate datetime
    const meetingTime = new Date(data.dateTime);
    const now = new Date();
    const hoursFromNow = (meetingTime - now) / (1000 * 60 * 60);
    
    if (meetingTime <= now) errors.push('Meeting time must be in the future');
    if (hoursFromNow < CONFIG.minimumNoticeHours) errors.push(`Minimum ${CONFIG.minimumNoticeHours} hours notice required`);
    
    // Anti-spam validation
    if (data.honeypot?.trim()) errors.push('Invalid submission');
    
    const submissionTime = parseInt(data.submissionTime);
    const formLoadTime = parseInt(data.timestamp);
    if (submissionTime && formLoadTime) {
        const timeElapsed = submissionTime - formLoadTime;
        if (timeElapsed < 3000) errors.push('Please take more time to complete the form');
        if (timeElapsed > 1800000) errors.push('Form session expired');
    }
    
    return errors;
}

/**
 * Main Lambda handler
 */
export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': 'https://donationtransparency.org',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    try {
        // Handle preflight requests
        if (event.requestContext?.http?.method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }
        
        // Parse request
        const body = JSON.parse(event.body);
        const { action } = body;
        
        // Get client IP for rate limiting
        const clientIP = event.requestContext?.http?.sourceIp || 
                        event.headers?.['x-forwarded-for']?.split(',')[0] || 
                        'unknown';
        
        // Rate limiting
        if (!checkRateLimit(clientIP, action)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: 'Rate limit exceeded' })
            };
        }
        
        console.log(`Processing ${action} request from ${clientIP}`);
        
        switch (action) {
            case 'getAvailability': {
                const { startDate, endDate } = body;
                const start = startDate ? new Date(startDate) : new Date();
                const end = endDate ? new Date(endDate) : new Date(Date.now() + (CONFIG.advanceBookingDays * 24 * 60 * 60 * 1000));
                
                const availability = await getAvailability(start, end);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        availability,
                        timezone: CONFIG.timezone
                    })
                };
            }
            
            case 'bookAppointment': {
                // Validate request
                const validationErrors = validateBookingRequest(body);
                if (validationErrors.length > 0) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            error: 'Validation failed',
                            details: validationErrors
                        })
                    };
                }
                
                // Create calendar event
                const eventData = await createCalendarEvent(body);
                
                // Send confirmation emails
                await sendConfirmationEmails(body, eventData);
                
                console.log(`Booking created successfully for ${body.email}`);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Meeting booked successfully',
                        eventId: eventData.id,
                        eventLink: eventData.htmlLink,
                        meetingLink: eventData.hangoutLink
                    })
                };
            }
            
            case 'getProfile': {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        profile: {
                            name: CONFIG.profileName,
                            email: CONFIG.profileEmail,
                            timezone: CONFIG.timezone,
                            workingHours: CONFIG.workingHours,
                            workingDays: CONFIG.workingDays
                        }
                    })
                };
            }
            
            default: {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
            }
        }
        
    } catch (error) {
        console.error('Lambda handler error:', {
            error: error.message,
            stack: error.stack,
            event: JSON.stringify(event, null, 2)
        });
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};