/**
 * Booking System JavaScript
 * Handles calendar view, timezone management, and booking flow
 */

const BookingApp = {
    // Configuration
    config: {
        lambdaEndpoint: 'https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/',
        requiredInviteCode: 'abc123',
        profileName: 'Tem Tiagha',
        defaultTimezone: 'America/Los_Angeles',
        workingHours: { start: 9, end: 17 },
        bufferMinutes: 15,
        advanceBookingDays: 14,
        minimumNoticeHours: 24
    },

    // State
    state: {
        currentDate: new Date(),
        selectedDate: null,
        selectedTime: null,
        selectedDuration: 30,
        selectedType: 'consultation',
        userTimezone: null,
        availableSlots: [],
        isLoading: false
    },

    // Timezone utilities
    timezones: [
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'America/Phoenix', label: 'Arizona Time' },
        { value: 'America/Anchorage', label: 'Alaska Time' },
        { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
        { value: 'UTC', label: 'UTC' },
        { value: 'Europe/London', label: 'London Time' },
        { value: 'Europe/Paris', label: 'Central European Time' },
        { value: 'Europe/Berlin', label: 'Berlin Time' },
        { value: 'Asia/Tokyo', label: 'Japan Time' },
        { value: 'Asia/Shanghai', label: 'China Time' },
        { value: 'Australia/Sydney', label: 'Sydney Time' }
    ],

    /**
     * Initialize the booking application
     */
    init: function() {
        console.log('Initializing Booking App...');
        
        // Check access control
        if (!this.checkAccess()) {
            this.showAccessDenied();
            return;
        }

        // Set up event listeners
        this.bindEvents();
        
        // Initialize timezone
        this.initializeTimezone();
        
        // Load profile information
        this.loadProfile();
        
        // Initialize calendar
        this.initializeCalendar();
        
        // Set timestamp for anti-spam
        document.getElementById('booking-timestamp').value = Date.now();

        console.log('Booking App initialized successfully');
    },

    /**
     * Check if user has valid access
     */
    checkAccess: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        
        // Allow access if invite code matches or if in development
        return inviteCode === this.config.requiredInviteCode || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    },

    /**
     * Show access denied page
     */
    showAccessDenied: function() {
        document.getElementById('access-denied').classList.remove('hidden');
        document.getElementById('booking-app').style.display = 'none';
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Meeting type selection
        document.querySelectorAll('.meeting-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMeetingType(e));
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => this.previousMonth());
        document.getElementById('next-month').addEventListener('click', () => this.nextMonth());

        // Timezone selection
        document.getElementById('timezone-select').addEventListener('change', (e) => this.changeTimezone(e));

        // Location selection
        document.querySelectorAll('input[name="location"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleLocationChange(e));
        });

        // Booking form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => this.submitBooking(e));

        // Retry button
        document.getElementById('retry-button').addEventListener('click', () => this.hideError());

        // Add to calendar button
        document.getElementById('add-to-calendar').addEventListener('click', () => this.addToCalendar());
    },

    /**
     * Initialize timezone detection and selector
     */
    initializeTimezone: function() {
        // Detect user timezone
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Check localStorage for saved preference
        const savedTimezone = localStorage.getItem('bookingTimezone');
        this.state.userTimezone = savedTimezone || detectedTimezone;

        // Populate timezone dropdown
        const select = document.getElementById('timezone-select');
        this.timezones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.value;
            option.textContent = tz.label;
            option.selected = tz.value === this.state.userTimezone;
            select.appendChild(option);
        });

        console.log('User timezone:', this.state.userTimezone);
    },

    /**
     * Load profile information
     */
    loadProfile: function() {
        // Use the static profile picture if it exists, otherwise use initials fallback
        const avatarImg = document.getElementById('profile-avatar');
        
        // Only set fallback if no valid image is already set
        if (!avatarImg.src || avatarImg.src.endsWith('/') || avatarImg.src === window.location.href) {
            avatarImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%236EC1E4'%3E%3C/rect%3E%3Ctext x='50%' y='50%' font-family='Inter, sans-serif' font-size='32' font-weight='700' fill='white' text-anchor='middle' dy='.3em'%3ETT%3C/text%3E%3C/svg%3E";
        }
        
        avatarImg.alt = this.config.profileName;

        // Load Google profile picture via API (placeholder for now)
        this.loadGoogleProfile();
    },

    /**
     * Load Google profile picture (placeholder)
     */
    loadGoogleProfile: function() {
        // This will be implemented with actual Google API call
        // For now, use a placeholder
        console.log('Loading Google profile for:', this.config.profileName);
    },

    /**
     * Initialize calendar display
     */
    initializeCalendar: function() {
        this.renderCalendar();
        this.loadAvailability();
    },

    /**
     * Render calendar for current month
     */
    renderCalendar: function() {
        const currentMonth = this.state.currentDate;
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // Update month title
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

        // Clear previous calendar
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + this.config.advanceBookingDays);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = dayDate.toISOString().split('T')[0];

            // Check if day is selectable
            if (dayDate < today || dayDate > maxDate) {
                dayElement.classList.add('disabled');
            } else if (this.isWeekend(dayDate)) {
                dayElement.classList.add('weekend');
            } else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', (e) => this.selectDate(e));
            }

            calendarGrid.appendChild(dayElement);
        }
    },

    /**
     * Check if date is weekend
     */
    isWeekend: function(date) {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    },

    /**
     * Navigate to previous month
     */
    previousMonth: function() {
        this.state.currentDate.setMonth(this.state.currentDate.getMonth() - 1);
        this.renderCalendar();
        this.loadAvailability();
    },

    /**
     * Navigate to next month
     */
    nextMonth: function() {
        this.state.currentDate.setMonth(this.state.currentDate.getMonth() + 1);
        this.renderCalendar();
        this.loadAvailability();
    },

    /**
     * Select a date on the calendar
     */
    selectDate: function(event) {
        const dateStr = event.target.dataset.date;
        const selectedDate = new Date(dateStr + 'T12:00:00');
        
        // Remove previous selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Mark new selection
        event.target.classList.add('selected');
        this.state.selectedDate = selectedDate;

        // Show time slots
        this.showTimeSlots(selectedDate);
    },

    /**
     * Show available time slots for selected date
     */
    showTimeSlots: function(date) {
        const timeSlotsContainer = document.getElementById('time-slots');
        const selectedDateElement = document.getElementById('selected-date');
        const timeSlotsGrid = document.getElementById('time-slots-grid');

        // Format date for display
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: this.state.userTimezone
        };
        selectedDateElement.textContent = date.toLocaleDateString('en-US', options);

        // Show loading state
        timeSlotsGrid.innerHTML = '<div class="loading-slots">Loading available times...</div>';
        timeSlotsContainer.classList.remove('hidden');

        // Generate time slots (placeholder - will be replaced with API call)
        setTimeout(() => {
            this.generateTimeSlots(date);
        }, 500);
    },

    /**
     * Generate time slots for a date (placeholder)
     */
    generateTimeSlots: function(date) {
        const timeSlotsGrid = document.getElementById('time-slots-grid');
        timeSlotsGrid.innerHTML = '';

        const startHour = this.config.workingHours.start;
        const endHour = this.config.workingHours.end;

        for (let hour = startHour; hour < endHour; hour++) {
            // Generate slots every 30 minutes
            for (let minute = 0; minute < 60; minute += 30) {
                const slotTime = new Date(date);
                slotTime.setHours(hour, minute, 0, 0);

                // Convert to user timezone for display
                const displayTime = slotTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: this.state.userTimezone,
                    hour12: true
                });

                // Create time slot button
                const slotButton = document.createElement('button');
                slotButton.className = 'time-slot available';
                slotButton.textContent = displayTime;
                slotButton.dataset.time = slotTime.toISOString();
                slotButton.addEventListener('click', (e) => this.selectTimeSlot(e));

                timeSlotsGrid.appendChild(slotButton);
            }
        }
    },

    /**
     * Select a time slot
     */
    selectTimeSlot: function(event) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Mark new selection
        event.target.classList.add('selected');
        this.state.selectedTime = new Date(event.target.dataset.time);

        // Show location and form sections
        document.getElementById('location-section').style.display = 'block';
        document.getElementById('booking-form-section').style.display = 'block';
        document.getElementById('book-button').disabled = false;

        // Scroll to form
        document.getElementById('location-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    },

    /**
     * Select meeting type
     */
    selectMeetingType: function(event) {
        // Remove previous selection
        document.querySelectorAll('.meeting-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mark new selection
        event.target.classList.add('active');
        this.state.selectedDuration = parseInt(event.target.dataset.duration);
        this.state.selectedType = event.target.dataset.type;

        // Refresh time slots if date is selected
        if (this.state.selectedDate) {
            this.showTimeSlots(this.state.selectedDate);
        }
    },

    /**
     * Change timezone
     */
    changeTimezone: function(event) {
        const newTimezone = event.target.value;
        this.state.userTimezone = newTimezone;
        
        // Save to localStorage
        localStorage.setItem('bookingTimezone', newTimezone);

        // Refresh time slots if date is selected
        if (this.state.selectedDate) {
            this.showTimeSlots(this.state.selectedDate);
        }

        console.log('Timezone changed to:', newTimezone);
    },

    /**
     * Handle location change
     */
    handleLocationChange: function(event) {
        const location = event.target.value;
        const phoneInput = document.getElementById('phone-input');
        
        if (location === 'phone') {
            phoneInput.style.display = 'block';
            document.getElementById('phone-number').required = true;
        } else {
            phoneInput.style.display = 'none';
            document.getElementById('phone-number').required = false;
        }
    },

    /**
     * Load availability from API
     */
    loadAvailability: function() {
        // This will make API call to Lambda function
        // For now, just log the action
        console.log('Loading availability for month:', this.state.currentDate);
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, you'd update the UI based on API response
        }, 1000);
    },

    /**
     * Submit booking
     */
    submitBooking: function(event) {
        event.preventDefault();
        
        if (this.state.isLoading) return;

        // Collect form data
        const formData = {
            name: document.getElementById('guest-name').value,
            email: document.getElementById('guest-email').value,
            notes: document.getElementById('meeting-notes').value,
            phone: document.getElementById('phone-number').value,
            location: document.querySelector('input[name="location"]:checked').value,
            meetingType: this.state.selectedType,
            duration: this.state.selectedDuration,
            dateTime: this.state.selectedTime.toISOString(),
            timezone: this.state.userTimezone,
            timestamp: document.getElementById('booking-timestamp').value,
            honeypot: document.getElementById('booking-honeypot').value
        };

        // Validate form
        if (!this.validateBookingForm(formData)) {
            return;
        }

        // Show loading state
        this.showBookingLoading();

        // Submit to Lambda function
        this.submitToLambda(formData);
    },

    /**
     * Validate booking form
     */
    validateBookingForm: function(data) {
        if (!data.name.trim()) {
            this.showError('Please enter your name');
            return false;
        }

        if (!data.email.trim()) {
            this.showError('Please enter your email');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!this.state.selectedTime) {
            this.showError('Please select a date and time');
            return false;
        }

        if (data.location === 'phone' && !data.phone.trim()) {
            this.showError('Please enter your phone number for phone meetings');
            return false;
        }

        return true;
    },

    /**
     * Show booking loading state
     */
    showBookingLoading: function() {
        this.state.isLoading = true;
        document.getElementById('book-button').disabled = true;
        document.getElementById('book-button-text').textContent = 'Booking...';
        document.getElementById('book-button-loader').classList.remove('hidden');
    },

    /**
     * Submit booking to Lambda function
     */
    submitToLambda: function(formData) {
        // Prepare request
        const requestBody = {
            action: 'bookAppointment',
            ...formData,
            submissionTime: Date.now()
        };

        console.log('Submitting booking:', requestBody);

        // Make API call (placeholder)
        fetch(this.config.lambdaEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showBookingSuccess(formData);
            } else {
                this.showError(data.error || 'Failed to book meeting');
            }
        })
        .catch(error => {
            console.error('Booking error:', error);
            this.showError('Network error. Please try again.');
        })
        .finally(() => {
            this.hideBookingLoading();
        });
    },

    /**
     * Hide booking loading state
     */
    hideBookingLoading: function() {
        this.state.isLoading = false;
        document.getElementById('book-button').disabled = false;
        document.getElementById('book-button-text').textContent = 'Book Meeting';
        document.getElementById('book-button-loader').classList.add('hidden');
    },

    /**
     * Show booking success
     */
    showBookingSuccess: function(formData) {
        const successMessage = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        
        const timeString = this.state.selectedTime.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: this.state.userTimezone,
            timeZoneName: 'short'
        });

        successText.innerHTML = `
            <strong>Meeting Details:</strong><br>
            📅 ${timeString}<br>
            ⏱️ ${this.state.selectedDuration} minutes<br>
            👤 ${formData.name}<br>
            📧 ${formData.email}<br><br>
            You'll receive a confirmation email with calendar invite shortly.
        `;

        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Show error message
     */
    showError: function(message) {
        document.getElementById('error-text').textContent = message;
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-message').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Hide error message
     */
    hideError: function() {
        document.getElementById('error-message').classList.add('hidden');
    },

    /**
     * Add to calendar
     */
    addToCalendar: function() {
        if (!this.state.selectedTime) return;

        // Create calendar event
        const startTime = this.state.selectedTime;
        const endTime = new Date(startTime.getTime() + (this.state.selectedDuration * 60 * 1000));
        
        const event = {
            title: `Meeting with ${this.config.profileName}`,
            start: startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            end: endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            description: `Meeting booked through Donation Transparency booking system`,
            location: 'Details will be sent via email'
        };

        // Google Calendar URL
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        
        window.open(googleUrl, '_blank');
    }
};

// Utility functions
const BookingUtils = {
    formatTime: function(date, timezone) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: timezone,
            hour12: true
        });
    },

    formatDate: function(date, timezone) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timezone
        });
    },

    convertTimezone: function(date, fromTz, toTz) {
        // This is a simplified timezone conversion
        // In production, you'd use a library like moment.js or date-fns-tz
        return new Date(date.toLocaleString('en-US', { timeZone: toTz }));
    }
};

// Export for use in HTML
window.BookingApp = BookingApp;
window.BookingUtils = BookingUtils;