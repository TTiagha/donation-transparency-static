/**
 * Booking Admin Panel JavaScript
 * Handles admin settings, calendar management, and booking overview
 */

const AdminPanel = {
    // Configuration
    config: {
        lambdaEndpoint: 'https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/',
        requiredAdminKey: 'admin2025',
        settings: {
            profile: {
                name: 'Tem Tiagha',
                email: 'support@donationtransparency.org',
                bio: 'Founder of Donation Transparency. Let\'s discuss how radical transparency can transform your fundraising and build unprecedented donor trust.',
                avatarSource: 'google',
                customAvatarUrl: ''
            },
            availability: {
                workStart: '09:00',
                workEnd: '17:00',
                timezone: 'America/Los_Angeles',
                workingDays: [1, 2, 3, 4, 5], // Monday-Friday
                bufferTime: 15,
                advanceBookingDays: 14,
                minimumNoticeHours: 24
            },
            meetingTypes: [
                { name: 'Quick Chat', duration: 15, description: 'Brief discussion' },
                { name: 'Consultation', duration: 30, description: 'Discuss transparency strategy' },
                { name: 'Deep Dive', duration: 60, description: 'In-depth strategic session' }
            ],
            calendar: {
                status: 'connected',
                lastSync: Date.now(),
                inviteCode: 'abc123'
            }
        }
    },

    // State
    state: {
        currentSection: 'profile',
        hasUnsavedChanges: false,
        isLoading: false
    },

    /**
     * Initialize admin panel
     */
    init: function() {
        console.log('Initializing Admin Panel...');
        
        // Check admin access
        if (!this.checkAdminAccess()) {
            this.showAccessDenied();
            return;
        }

        // Load saved settings
        this.loadSettings();
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize sections
        this.initializeSections();
        
        console.log('Admin Panel initialized successfully');
    },

    /**
     * Check admin access
     */
    checkAdminAccess: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const adminKey = urlParams.get('key');
        
        return adminKey === this.config.requiredAdminKey ||
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    },

    /**
     * Show access denied
     */
    showAccessDenied: function() {
        document.getElementById('access-denied').classList.remove('hidden');
        document.getElementById('admin-panel').style.display = 'none';
    },

    /**
     * Load settings from localStorage or defaults
     */
    loadSettings: function() {
        const savedSettings = localStorage.getItem('bookingAdminSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.config.settings = { ...this.config.settings, ...parsed };
            } catch (error) {
                console.error('Failed to parse saved settings:', error);
            }
        }
        
        // Apply settings to form elements
        this.applySettingsToForm();
    },

    /**
     * Apply settings to form elements
     */
    applySettingsToForm: function() {
        const settings = this.config.settings;
        
        // Profile settings
        document.getElementById('profile-name').value = settings.profile.name;
        document.getElementById('profile-email').value = settings.profile.email;
        document.getElementById('profile-bio').value = settings.profile.bio;
        document.querySelector(`input[name="avatar-source"][value="${settings.profile.avatarSource}"]`).checked = true;
        document.getElementById('avatar-url').value = settings.profile.customAvatarUrl;
        
        // Show/hide custom avatar input
        this.toggleCustomAvatar();
        
        // Availability settings
        document.getElementById('work-start').value = settings.availability.workStart;
        document.getElementById('work-end').value = settings.availability.workEnd;
        document.getElementById('timezone').value = settings.availability.timezone;
        document.getElementById('buffer-time').value = settings.availability.bufferTime;
        document.getElementById('advance-booking').value = settings.availability.advanceBookingDays;
        document.getElementById('minimum-notice').value = settings.availability.minimumNoticeHours;
        
        // Working days
        settings.availability.workingDays.forEach(day => {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const checkbox = document.getElementById(`day-${dayNames[day]}`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Calendar settings
        document.getElementById('invite-code').value = settings.calendar.inviteCode;
        this.updateCalendarStatus();
        this.updateBookingUrl();
        
        // Meeting types
        this.renderMeetingTypes();
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.switchSection(e));
        });
        
        // Avatar source selection
        document.querySelectorAll('input[name="avatar-source"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.toggleCustomAvatar();
                this.markUnsavedChanges();
            });
        });
        
        // Form inputs
        document.querySelectorAll('.setting-input').forEach(input => {
            input.addEventListener('change', () => this.markUnsavedChanges());
            input.addEventListener('input', () => this.markUnsavedChanges());
        });
        
        // Special handling for invite code to update URL
        document.getElementById('invite-code').addEventListener('input', () => {
            this.updateBookingUrl();
        });
        
        // Working days checkboxes
        document.querySelectorAll('input[type="checkbox"][id^="day-"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.markUnsavedChanges());
        });
        
        // Calendar actions
        document.getElementById('test-calendar').addEventListener('click', () => this.testCalendar());
        document.getElementById('reconnect-calendar').addEventListener('click', () => this.reconnectCalendar());
        
        // Meeting types
        document.getElementById('add-meeting-type').addEventListener('click', () => this.addMeetingType());
        
        // Save settings
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        
        // Prevent leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.state.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    },

    /**
     * Switch between admin sections
     */
    switchSection: function(event) {
        event.preventDefault();
        
        const sectionName = event.target.getAttribute('href').substring(1);
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.state.currentSection = sectionName;
    },

    /**
     * Toggle custom avatar input
     */
    toggleCustomAvatar: function() {
        const customRadio = document.getElementById('avatar-custom');
        const customGroup = document.getElementById('custom-avatar-group');
        
        if (customRadio.checked) {
            customGroup.style.display = 'block';
        } else {
            customGroup.style.display = 'none';
        }
    },

    /**
     * Initialize sections
     */
    initializeSections: function() {
        this.updateCalendarStatus();
        this.loadRecentBookings();
    },

    /**
     * Update booking URL display
     */
    updateBookingUrl: function() {
        const inviteCode = document.getElementById('invite-code').value;
        const urlDisplay = document.getElementById('booking-url-display');
        const baseUrl = 'https://donationtransparency.org/booking/?invite=';
        
        urlDisplay.textContent = baseUrl + (inviteCode || 'abc123');
    },

    /**
     * Update calendar connection status
     */
    updateCalendarStatus: function() {
        const status = this.config.settings.calendar.status;
        const statusEl = document.getElementById('calendar-status');
        const lastSyncEl = document.getElementById('last-sync');
        
        statusEl.className = 'status-indicator';
        
        switch (status) {
            case 'connected':
                statusEl.classList.add('status-connected');
                statusEl.innerHTML = '<span>🟢</span> Calendar Connected';
                break;
            case 'disconnected':
                statusEl.classList.add('status-disconnected');
                statusEl.innerHTML = '<span>🔴</span> Calendar Disconnected';
                break;
            case 'syncing':
                statusEl.classList.add('status-syncing');
                statusEl.innerHTML = '<span>🟡</span> Syncing...';
                break;
        }
        
        // Update last sync time
        const lastSync = new Date(this.config.settings.calendar.lastSync);
        const now = new Date();
        const diffMinutes = Math.floor((now - lastSync) / (1000 * 60));
        
        if (diffMinutes < 1) {
            lastSyncEl.textContent = 'Just now';
        } else if (diffMinutes < 60) {
            lastSyncEl.textContent = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else {
            const diffHours = Math.floor(diffMinutes / 60);
            lastSyncEl.textContent = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
    },

    /**
     * Test calendar connection
     */
    testCalendar: function() {
        const button = document.getElementById('test-calendar');
        const originalText = button.textContent;
        
        button.textContent = 'Testing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.config.settings.calendar.lastSync = Date.now();
            this.updateCalendarStatus();
            
            button.textContent = 'Test Successful';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 1500);
    },

    /**
     * Reconnect calendar
     */
    reconnectCalendar: function() {
        const button = document.getElementById('reconnect-calendar');
        const originalText = button.textContent;
        
        button.textContent = 'Reconnecting...';
        button.disabled = true;
        
        // Update status to syncing
        this.config.settings.calendar.status = 'syncing';
        this.updateCalendarStatus();
        
        // Simulate reconnection
        setTimeout(() => {
            this.config.settings.calendar.status = 'connected';
            this.config.settings.calendar.lastSync = Date.now();
            this.updateCalendarStatus();
            
            button.textContent = 'Reconnected';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 3000);
    },

    /**
     * Render meeting types
     */
    renderMeetingTypes: function() {
        const container = document.getElementById('meeting-types-list');
        container.innerHTML = '';
        
        this.config.settings.meetingTypes.forEach((type, index) => {
            const typeEl = document.createElement('div');
            typeEl.className = 'meeting-type-config';
            typeEl.innerHTML = `
                <div class="setting-group">
                    <label>${type.name}</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 100px; gap: 10px; align-items: end;">
                        <input type="number" class="setting-input meeting-duration" placeholder="Duration (min)" value="${type.duration}" data-index="${index}">
                        <input type="text" class="setting-input meeting-description" placeholder="Description" value="${type.description}" data-index="${index}">
                        <button class="btn-small btn-cancel remove-meeting-type" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            
            container.appendChild(typeEl);
        });
        
        // Bind events for meeting type inputs
        container.querySelectorAll('.meeting-duration, .meeting-description').forEach(input => {
            input.addEventListener('change', (e) => this.updateMeetingType(e));
        });
        
        container.querySelectorAll('.remove-meeting-type').forEach(button => {
            button.addEventListener('click', (e) => this.removeMeetingType(e));
        });
    },

    /**
     * Update meeting type
     */
    updateMeetingType: function(event) {
        const index = parseInt(event.target.dataset.index);
        const field = event.target.classList.contains('meeting-duration') ? 'duration' : 'description';
        const value = field === 'duration' ? parseInt(event.target.value) : event.target.value;
        
        this.config.settings.meetingTypes[index][field] = value;
        this.markUnsavedChanges();
    },

    /**
     * Remove meeting type
     */
    removeMeetingType: function(event) {
        const index = parseInt(event.target.dataset.index);
        
        if (this.config.settings.meetingTypes.length <= 1) {
            this.showMessage('Error', 'You must have at least one meeting type.', 'error');
            return;
        }
        
        this.config.settings.meetingTypes.splice(index, 1);
        this.renderMeetingTypes();
        this.markUnsavedChanges();
    },

    /**
     * Add new meeting type
     */
    addMeetingType: function() {
        this.config.settings.meetingTypes.push({
            name: 'New Meeting Type',
            duration: 30,
            description: 'Description here'
        });
        
        this.renderMeetingTypes();
        this.markUnsavedChanges();
    },

    /**
     * Load recent bookings (placeholder)
     */
    loadRecentBookings: function() {
        // This would typically load from the API
        // For now, we'll use the static HTML content
        console.log('Loading recent bookings...');
    },

    /**
     * Mark changes as unsaved
     */
    markUnsavedChanges: function() {
        this.state.hasUnsavedChanges = true;
        
        const saveButton = document.getElementById('save-settings');
        saveButton.style.background = '#dc3545';
        saveButton.innerHTML = '⚠️ Save Changes';
    },

    /**
     * Save all settings
     */
    saveSettings: function() {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        const saveButton = document.getElementById('save-settings');
        const originalContent = saveButton.innerHTML;
        
        saveButton.innerHTML = '💾 Saving...';
        saveButton.disabled = true;
        
        // Collect all settings from form
        this.collectSettingsFromForm();
        
        // Save to localStorage (in production, this would save to API)
        localStorage.setItem('bookingAdminSettings', JSON.stringify(this.config.settings));
        
        // Simulate API call
        setTimeout(() => {
            this.state.hasUnsavedChanges = false;
            this.state.isLoading = false;
            
            saveButton.innerHTML = '✅ Saved';
            saveButton.style.background = '#28a745';
            saveButton.disabled = false;
            
            setTimeout(() => {
                saveButton.innerHTML = originalContent;
            }, 3000);
            
            this.showMessage('Success!', 'Your booking settings have been updated successfully.');
        }, 2000);
    },

    /**
     * Collect settings from form elements
     */
    collectSettingsFromForm: function() {
        const settings = this.config.settings;
        
        // Profile settings
        settings.profile.name = document.getElementById('profile-name').value;
        settings.profile.email = document.getElementById('profile-email').value;
        settings.profile.bio = document.getElementById('profile-bio').value;
        settings.profile.avatarSource = document.querySelector('input[name="avatar-source"]:checked').value;
        settings.profile.customAvatarUrl = document.getElementById('avatar-url').value;
        
        // Availability settings
        settings.availability.workStart = document.getElementById('work-start').value;
        settings.availability.workEnd = document.getElementById('work-end').value;
        settings.availability.timezone = document.getElementById('timezone').value;
        settings.availability.bufferTime = parseInt(document.getElementById('buffer-time').value);
        settings.availability.advanceBookingDays = parseInt(document.getElementById('advance-booking').value);
        settings.availability.minimumNoticeHours = parseInt(document.getElementById('minimum-notice').value);
        
        // Working days
        const workingDays = [];
        const dayCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="day-"]:checked');
        dayCheckboxes.forEach(checkbox => {
            workingDays.push(parseInt(checkbox.value));
        });
        settings.availability.workingDays = workingDays;
        
        // Calendar settings
        settings.calendar.inviteCode = document.getElementById('invite-code').value;
        
        console.log('Settings collected:', settings);
    },

    /**
     * Show message to user
     */
    showMessage: function(title, text, type = 'success') {
        const messageEl = document.getElementById('admin-message');
        const titleEl = document.getElementById('message-title');
        const textEl = document.getElementById('message-text');
        
        titleEl.textContent = title;
        textEl.textContent = text;
        
        if (type === 'error') {
            messageEl.classList.add('error-message');
            messageEl.classList.remove('success-message');
        } else {
            messageEl.classList.add('success-message');
            messageEl.classList.remove('error-message');
        }
        
        messageEl.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
        
        // Click to dismiss
        messageEl.addEventListener('click', () => {
            messageEl.classList.add('hidden');
        }, { once: true });
    }
};

// Utility functions
const AdminUtils = {
    formatTime: function(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    formatDate: function(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    generateSecureCode: function(length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Export for use in HTML
window.AdminPanel = AdminPanel;
window.AdminUtils = AdminUtils;