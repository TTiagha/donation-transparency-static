/**
 * Google Analytics 4 Configuration
 * Donation Transparency - SEO & Conversion Tracking
 */

// GA4 Configuration
const GA4_CONFIG = {
    measurement_id: 'G-C83EV6K1D3', // GA4 measurement ID
    enhanced_measurement: true,
    send_page_view: true,
    // Enable Google Signals for enhanced data
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    // Custom dimensions for SEO analysis
    custom_map: {
        'custom_parameter_1': 'traffic_source',
        'custom_parameter_2': 'user_type', 
        'custom_parameter_3': 'campaign_source'
    },
    // Consent mode configuration (GDPR/EEA compliance)
    consent: {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted'
    }
};

// Initialize GA4
function initializeGA4() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    // Set up consent mode first (GDPR compliance)
    gtag('consent', 'default', GA4_CONFIG.consent);
    
    gtag('js', new Date());
    gtag('config', GA4_CONFIG.measurement_id, GA4_CONFIG);
    
    // Mark key events for conversion tracking
    setupKeyEvents();
    
    // Initialize enhanced tracking
    GA4_Enhanced.trackScrollDepth();
    GA4_Enhanced.trackTimeOnPage();
    
    // Enhanced page view tracking with SEO context
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: getContentGroup(),
        traffic_source: getTrafficSource(),
        user_type: getUserType()
    });
}

// Determine content group for analytics segmentation
function getContentGroup() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') return 'Homepage';
    if (path.includes('/guides/')) return 'Guides';
    if (path.includes('/features/')) return 'Features';  
    if (path.includes('/transparency/')) return 'Transparency';
    if (path.includes('/booking/')) return 'Booking';
    if (path.includes('/about')) return 'About';
    if (path.includes('/contact')) return 'Contact';
    
    return 'Other';
}

// Track traffic source for SEO analysis
function getTrafficSource() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    // UTM parameters take priority
    if (urlParams.get('utm_source')) {
        return urlParams.get('utm_source');
    }
    
    // Organic search detection
    if (referrer.includes('google.com')) return 'google-organic';
    if (referrer.includes('bing.com')) return 'bing-organic';
    if (referrer.includes('yahoo.com')) return 'yahoo-organic';
    if (referrer.includes('duckduckgo.com')) return 'duckduckgo-organic';
    
    // Social media detection
    if (referrer.includes('facebook.com')) return 'facebook-social';
    if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter-social';
    if (referrer.includes('linkedin.com')) return 'linkedin-social';
    
    // Direct vs referral
    if (!referrer) return 'direct';
    return 'referral';
}

// Determine user type for segmentation
function getUserType() {
    // Check if returning visitor (simplified - in production, use cookies/localStorage)
    const isReturning = localStorage.getItem('dt_returning_visitor');
    if (isReturning) {
        return 'returning';
    } else {
        localStorage.setItem('dt_returning_visitor', 'true');
        return 'new';
    }
}

// Conversion tracking functions
const GA4_Conversions = {
    
    // Track waitlist signups
    waitlistSignup: function(email, source = 'unknown') {
        gtag('event', 'waitlist_signup', {
            event_category: 'conversion',
            event_label: source,
            user_email: email, // Be careful with PII - consider hashing
            value: 1
        });
    },
    
    // Track contact form submissions
    contactForm: function(formType = 'general') {
        gtag('event', 'contact_form_submit', {
            event_category: 'conversion',
            event_label: formType,
            value: 1
        });
    },
    
    // Track booking requests (high-value conversion)
    bookingRequest: function(meetingType = 'demo') {
        gtag('event', 'booking_request', {
            event_category: 'conversion',
            event_label: meetingType,
            value: 5 // Higher value for qualified leads
        });
    },
    
    // Track key page views (qualified traffic)
    qualifiedPageView: function(pageType) {
        gtag('event', 'qualified_page_view', {
            event_category: 'engagement',
            event_label: pageType,
            value: 1
        });
    },
    
    // Track CTA clicks for optimization
    ctaClick: function(ctaText, ctaLocation) {
        gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: `${ctaLocation}: ${ctaText}`,
            value: 1
        });
    },
    
    // Track search queries (if implemented)
    siteSearch: function(searchTerm, resultCount = 0) {
        gtag('event', 'search', {
            search_term: searchTerm,
            search_results: resultCount
        });
    },
    
    // Track file downloads
    fileDownload: function(fileName, fileType) {
        gtag('event', 'file_download', {
            event_category: 'engagement',
            event_label: `${fileType}: ${fileName}`,
            value: 1
        });
    },
    
    // Track external link clicks
    externalLink: function(destination) {
        gtag('event', 'click', {
            event_category: 'external_link',
            event_label: destination,
            transport_type: 'beacon'
        });
    }
};

// Setup key events for GA4 conversion tracking
function setupKeyEvents() {
    // Define key events that GA4 should track as conversions
    const keyEvents = [
        'waitlist_signup',           // Primary conversion
        'contact_form_submit',       // Lead generation
        'booking_request',          // High-value conversion
        'cta_click',               // Engagement milestone
        'qualified_page_view'       // Interest indicator
    ];
    
    // Mark events as key events in GA4
    keyEvents.forEach(eventName => {
        gtag('event', 'conversion', {
            'send_to': GA4_CONFIG.measurement_id,
            'event_name': eventName
        });
    });
}

// Define audiences for remarketing and analysis
const GA4_Audiences = {
    
    // High-intent visitors (viewed pricing/features pages)
    highIntent: {
        name: 'High Intent Visitors',
        conditions: [
            'content_group1 == "Features"',
            'time_on_page > 60',
            'scroll_depth > 50'
        ]
    },
    
    // Qualified leads (engaged with multiple pages)
    qualifiedLeads: {
        name: 'Qualified Leads',
        conditions: [
            'session_engaged == true',
            'page_views >= 3',
            'traffic_source contains "organic"'
        ]
    },
    
    // Fundraising decision makers (viewed comparison content)
    decisionMakers: {
        name: 'Fundraising Decision Makers',
        conditions: [
            'page_location contains "best-fundraising-platforms"',
            'time_on_page > 120',
            'user_type == "new"'
        ]
    },
    
    // Ready to convert (visited booking or contact pages)
    readyToConvert: {
        name: 'Ready to Convert',
        conditions: [
            'content_group1 == "Booking" OR content_group1 == "Contact"',
            'session_engaged == true'
        ]
    }
};

// Enhanced measurement events (automatic)
const GA4_Enhanced = {
    
    // Track scroll depth for engagement
    trackScrollDepth: function() {
        let maxScroll = 0;
        const trackScroll = () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                gtag('event', 'scroll', {
                    event_category: 'engagement',
                    event_label: `${scrollPercent}%`,
                    value: scrollPercent
                });
            }
        };
        
        window.addEventListener('scroll', trackScroll, { passive: true });
    },
    
    // Track time on page for engagement
    trackTimeOnPage: function() {
        const startTime = Date.now();
        
        // Track at 30 seconds, 1 minute, 3 minutes, 5 minutes
        const timeThresholds = [30000, 60000, 180000, 300000];
        
        timeThresholds.forEach(threshold => {
            setTimeout(() => {
                if (document.visibilityState === 'visible') {
                    gtag('event', 'timing_complete', {
                        name: 'time_on_page',
                        value: threshold / 1000
                    });
                }
            }, threshold);
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGA4);
} else {
    initializeGA4();
}

// Utility functions for manual setup assistant completion
const GA4_Setup = {
    
    // Helper to update consent (for GDPR compliance)
    updateConsent: function(consentSettings) {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', consentSettings);
        }
    },
    
    // Helper to send custom conversion events
    sendConversion: function(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'send_to': GA4_CONFIG.measurement_id,
                ...parameters
            });
        }
    },
    
    // Helper to create custom audience conditions
    trackAudienceCondition: function(audienceName, conditionMet = true) {
        if (typeof gtag !== 'undefined' && conditionMet) {
            gtag('event', 'audience_condition', {
                'audience_name': audienceName,
                'condition_met': conditionMet,
                'timestamp': Date.now()
            });
        }
    },
    
    // Debug helper to verify setup
    verifySetup: function() {
        console.log('GA4 Configuration:', GA4_CONFIG);
        console.log('Defined Audiences:', Object.keys(GA4_Audiences));
        console.log('Available Conversions:', Object.keys(GA4_Conversions));
        console.log('Setup Complete:', typeof gtag !== 'undefined' ? '✅' : '❌');
        
        return {
            config: GA4_CONFIG,
            audiences: Object.keys(GA4_Audiences).length,
            conversions: Object.keys(GA4_Conversions).length,
            initialized: typeof gtag !== 'undefined'
        };
    }
};

// Export for use in other scripts
window.GA4_Conversions = GA4_Conversions;
window.GA4_Enhanced = GA4_Enhanced;
window.GA4_Audiences = GA4_Audiences;
window.GA4_Setup = GA4_Setup;