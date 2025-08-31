/**
 * Google Analytics 4 Configuration
 * Donation Transparency - SEO & Conversion Tracking
 */

// GA4 Configuration
const GA4_CONFIG = {
    measurement_id: 'GA_MEASUREMENT_ID', // Replace with actual GA4 measurement ID
    enhanced_measurement: true,
    send_page_view: true,
    // Custom dimensions for SEO analysis
    custom_map: {
        'custom_parameter_1': 'traffic_source',
        'custom_parameter_2': 'user_type', 
        'custom_parameter_3': 'campaign_source'
    }
};

// Initialize GA4
function initializeGA4() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());
    gtag('config', GA4_CONFIG.measurement_id, GA4_CONFIG);
    
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

// Export for use in other scripts
window.GA4_Conversions = GA4_Conversions;
window.GA4_Enhanced = GA4_Enhanced;