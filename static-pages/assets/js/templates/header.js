// Header Template with Complete Functionality
// Preserves all waitlist modals, mobile menu animations, and premium styling

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('/features/')) return 'features';
    if (path.includes('/guides/')) return 'guides';
    if (path.includes('/transparency/')) return 'transparency';
    if (path.includes('about.html')) return 'about';
    if (path.includes('contact.html')) return 'contact';
    if (path.includes('petition-for-transparency.html')) return 'petition';
    return 'home';
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/features/') || path.includes('/guides/') || path.includes('/transparency/')) {
        return '../';
    }
    return '';
}

function generateBreadcrumbs() {
    const path = window.location.pathname;
    const currentPage = getCurrentPage();
    const basePath = getBasePath();
    
    // Don't show breadcrumbs on home page
    if (currentPage === 'home') return '';
    
    let breadcrumbs = [];
    breadcrumbs.push({ text: 'Home', href: `${basePath}index.html` });
    
    // Add section breadcrumb
    if (path.includes('/features/')) {
        breadcrumbs.push({ text: 'Features', href: `${basePath}features/index.html` });
        
        // Add specific page if not on section index
        if (!path.endsWith('/features/index.html') && !path.endsWith('/features/')) {
            const filename = path.split('/').pop();
            const pageName = filename.replace('.html', '').split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breadcrumbs.push({ text: pageName, href: null }); // Current page, no link
        }
    } else if (path.includes('/guides/')) {
        breadcrumbs.push({ text: 'Guides', href: `${basePath}guides/index.html` });
        
        if (!path.endsWith('/guides/index.html') && !path.endsWith('/guides/')) {
            const filename = path.split('/').pop();
            const pageName = filename.replace('.html', '').split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breadcrumbs.push({ text: pageName, href: null });
        }
    } else if (path.includes('/transparency/')) {
        breadcrumbs.push({ text: 'Transparency', href: `${basePath}transparency/index.html` });
        
        if (!path.endsWith('/transparency/index.html') && !path.endsWith('/transparency/')) {
            const filename = path.split('/').pop();
            const pageName = filename.replace('.html', '').split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breadcrumbs.push({ text: pageName, href: null });
        }
    } else {
        // Single pages (About, Contact, Petition)
        if (currentPage === 'about') breadcrumbs.push({ text: 'About', href: null });
        if (currentPage === 'contact') breadcrumbs.push({ text: 'Contact', href: null });
        if (currentPage === 'petition') breadcrumbs.push({ text: 'Join the Movement', href: null });
    }
    
    // Generate breadcrumb HTML
    if (breadcrumbs.length <= 1) return '';
    
    const breadcrumbItems = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        if (isLast) {
            return `<span class="text-dt-silver font-medium" aria-current="page">${crumb.text}</span>`;
        } else {
            return `<a href="${crumb.href}" class="text-dt-slate hover:text-dt-silver transition-colors">${crumb.text}</a>`;
        }
    }).join('<span class="mx-2 text-dt-slate" aria-hidden="true">/</span>');
    
    return `
    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb">
        <div class="container mx-auto px-6 py-3">
            <ol class="flex items-center space-x-0 text-sm md:text-base">
                ${breadcrumbItems}
            </ol>
        </div>
    </nav>`;
}

function createHeaderHTML() {
    const currentPage = getCurrentPage();
    const basePath = getBasePath();
    
    return `
    <style>
        /* Premium Header Styling */
        
        /* Breadcrumb Styling */
        nav[aria-label="Breadcrumb"] {
            background-color: #F8F9FA !important;
            border-bottom: 1px solid #E9ECEF !important;
        }
        
        nav[aria-label="Breadcrumb"] a {
            color: #6C757D !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
            padding: 0.25rem 0 !important;
            border-radius: 0.25rem !important;
        }
        
        nav[aria-label="Breadcrumb"] a:hover {
            color: #212529 !important;
        }
        
        nav[aria-label="Breadcrumb"] span[aria-current="page"] {
            color: #212529 !important;
            font-weight: 500 !important;
        }
        
        /* Mobile breadcrumb optimizations */
        @media (max-width: 768px) {
            nav[aria-label="Breadcrumb"] {
                padding: 0.5rem 0 !important;
            }
            
            nav[aria-label="Breadcrumb"] ol {
                font-size: 0.875rem !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }
            
            nav[aria-label="Breadcrumb"] ol::-webkit-scrollbar {
                display: none !important;
            }
            
            nav[aria-label="Breadcrumb"] a,
            nav[aria-label="Breadcrumb"] span {
                min-width: max-content !important;
                padding: 0.5rem 0.25rem !important;
            }
        }

        /* Mobile menu specific display rules */
        #mobileMenu.hidden {
            display: none !important;
        }
        
        @media (min-width: 1024px) {
            .lg\\:flex { display: flex !important; }
            .lg\\:block { display: block !important; }
            #mobileMenu { display: none !important; }
        }
        
        @media (max-width: 1023px) {
            #mobileMenu:not(.hidden) {
                display: block !important;
            }
        }
        
        /* Ensure proper spacing and alignment */
        .space-x-8 > * + * { margin-left: 2rem !important; }
        
        /* Header styling fixes */
        header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 50 !important;
            backdrop-filter: blur(4px) !important;
        }
        
        /* Navigation link styling */
        nav a {
            color: #6C757D !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }
        
        nav a:hover {
            color: #212529 !important;
        }
        
        /* Active page styling */
        nav a.active {
            color: #D1D5DB !important;
        }
        
        /* Header button styled to match landing page CTA */
        .get-started-btn {
            background-color: #6EC1E4 !important;
            color: #1F2937 !important;
            font-weight: bold !important;
            font-size: 1rem !important;
            padding: 0.5rem 1.5rem !important;
            border-radius: 0.5rem !important;
            transition: all 0.2s ease !important;
            transform: scale(1) !important;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
            border: none !important;
            white-space: nowrap !important;
        }
        
        .get-started-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
        }

        /* Force mobile menu button to show on mobile */
        .mobile-menu-btn {
            display: block !important;
            padding: 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            min-width: 44px;
            min-height: 44px;
        }
        @media (min-width: 1024px) {
            .mobile-menu-btn {
                display: none !important;
            }
        }

        .mobile-menu-btn:hover {
            background-color: rgba(110, 193, 228, 0.1);
        }

        /* Premium Mobile Menu Design */
        #mobileMenu {
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%,
                rgba(248, 249, 250, 0.9) 50%,
                rgba(240, 242, 245, 0.95) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            border-radius: 0 0 1.5rem 1.5rem;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(110, 193, 228, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(110, 193, 228, 0.2);
            border-top: none;
            overflow: hidden;
            position: relative;
        }

        /* Subtle gradient overlay */
        #mobileMenu::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(110, 193, 228, 0.03) 0%,
                transparent 50%,
                rgba(74, 144, 164, 0.03) 100%);
            pointer-events: none;
            z-index: 1;
        }

        /* GoFundMe-style menu items */
        #mobileMenu a {
            text-decoration: none !important;
            transition: background-color 0.2s ease;
        }

        #mobileMenu a:hover {
            background-color: rgba(0, 0, 0, 0.02);
        }

        /* GoFundMe-style typography */
        #mobileMenu .text-xl {
            font-size: 1.125rem;
            line-height: 1.75rem;
            color: #1f2937;
        }

        #mobileMenu .text-sm {
            color: #6b7280;
            line-height: 1.25rem;
        }

        /* Button styling with our brand colors */
        #mobileMenu button.bg-dt-teal {
            background-color: #6EC1E4 !important;
            font-size: 0.9rem;
            font-weight: 600;
        }

        #mobileMenu button.bg-dt-teal:hover {
            background-color: #5AB3D1 !important;
        }

        #mobileMenu a.border-gray-300 {
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Touch-friendly sizing and enhanced mobile experience */
        @media (max-width: 768px) {
            #mobileMenu a {
                touch-action: manipulation;
                min-height: 60px;
            }
            
            /* Override for CTA buttons to ensure consistent height, font, and centering */
            #mobileMenu .mobile-cta-button {
                height: 48px !important;
                min-height: 48px !important;
                font-size: 0.9rem !important;
                line-height: 1 !important;
            }
            
            #mobileMenu .font-medium {
                font-size: 1.1rem;
            }
            
            #mobileMenu .text-sm {
                font-size: 0.9rem;
            }
        }
    </style>

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-dt-navy bg-opacity-80 backdrop-blur-sm shadow-soft">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <a href="${basePath}index.html">
                    <img src="${basePath}assets/images/DTlogoFinal_W.png" alt="Donation Transparency" class="h-12 cursor-pointer hover:opacity-90 transition-opacity">
                </a>
                
                <!-- Desktop Navigation - Context-Aware -->
                <nav class="hidden lg:flex space-x-8">
                    ${currentPage !== 'home' ? `<a href="${basePath}index.html" class="text-dt-slate hover:text-dt-silver transition">Home</a>` : ''}
                    ${currentPage !== 'features' ? `<a href="${basePath}features/index.html" class="text-dt-slate hover:text-dt-silver transition">Features</a>` : ''}
                    ${currentPage !== 'guides' ? `<a href="${basePath}guides/index.html" class="text-dt-slate hover:text-dt-silver transition">Guides</a>` : ''}
                    ${currentPage !== 'transparency' ? `<a href="${basePath}transparency/index.html" class="text-dt-slate hover:text-dt-silver transition">Transparency</a>` : ''}
                    ${currentPage !== 'about' ? `<a href="${basePath}about.html" class="text-dt-slate hover:text-dt-silver transition">About</a>` : ''}
                    ${currentPage !== 'contact' ? `<a href="${basePath}contact.html" class="text-dt-slate hover:text-dt-silver transition">Contact</a>` : ''}
                </nav>
                
                <!-- Desktop Get Started Button -->
                <button onclick="${currentPage === 'home' ? 'openWaitlistModal()' : `window.location.href='${basePath}index.html'`}" class="hidden lg:block get-started-btn">Start Your Transparent Fundraiser</button>
                
                <!-- Mobile Menu Button -->
                <button onclick="toggleMobileMenu()" class="mobile-menu-btn text-dt-slate hover:text-dt-silver transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Breadcrumbs -->
        ${generateBreadcrumbs()}
        
        <div class="container mx-auto px-6">
            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-6 border-t border-dt-slate pt-6">
                <!-- Navigation Items - Context-Aware -->
                <div class="px-4 space-y-2">
                    ${currentPage !== 'home' ? `
                    <a href="${basePath}index.html" class="block">
                        <div class="flex items-center justify-between py-1">
                            <div>
                                <div class="text-xl font-normal text-gray-800">Home</div>
                                <div class="text-sm text-gray-500 mt-1">Build unshakeable donor trust</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                    ` : ''}
                    
                    ${currentPage !== 'features' ? `
                    <a href="${basePath}features/index.html" class="block">
                        <div class="flex items-center justify-between py-1">
                            <div>
                                <div class="text-xl font-normal text-gray-800">Features</div>
                                <div class="text-sm text-gray-500 mt-1">Real-time tracking and transparency tools</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                    ` : ''}
                    
                    ${currentPage !== 'guides' ? `
                    <a href="${basePath}guides/index.html" class="block">
                        <div class="flex items-center justify-between py-1">
                            <div>
                                <div class="text-xl font-normal text-gray-800">Guides</div>
                                <div class="text-sm text-gray-500 mt-1">Expert fundraising and transparency advice</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                    ` : ''}
                    
                    ${currentPage !== 'transparency' ? `
                    <a href="${basePath}transparency/index.html" class="block">
                        <div class="flex items-center justify-between py-1">
                            <div>
                                <div class="text-xl font-normal text-gray-800">Transparency</div>
                                <div class="text-sm text-gray-500 mt-1">Building trust through accountability</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                    ` : ''}
                    
                    ${currentPage !== 'about' ? `
                    <a href="${basePath}about.html" class="block">
                        <div class="flex items-center justify-between py-1">
                            <div>
                                <div class="text-xl font-normal text-gray-800">About</div>
                                <div class="text-sm text-gray-500 mt-1">Our mission and platform details</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                    ` : ''}
                </div>
                
                <!-- CTA Buttons at Bottom - Centered & Smaller -->
                <div class="flex flex-col items-center mt-8 space-y-3 px-4">
                    <button onclick="${currentPage === 'home' ? 'openWaitlistModal()' : `window.location.href='${basePath}index.html'`}" class="mobile-cta-button w-full h-12 bg-dt-teal text-white font-semibold px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                        Start Your Transparent Fundraiser
                    </button>
                    <a href="${basePath}petition-for-transparency.html" class="mobile-cta-button w-full h-12 text-dt-teal border border-dt-teal font-semibold px-4 rounded-lg hover:bg-dt-teal hover:text-white transition-colors flex items-center justify-center text-center">
                        Join the Movement
                    </a>
                </div>
            </div>
        </div>
    </header>

    ${currentPage === 'home' ? `
    <!-- Waitlist Modal -->
    <div id="waitlistModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 hidden flex items-center justify-center">
        <div class="bg-dt-charcoal rounded-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0" id="modalContent">
            <div class="text-center">
                <div class="w-16 h-16 bg-dt-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-dt-navy" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-dt-silver mb-2">Join the Access Queue</h3>
                <p class="text-dt-slate mb-6">We're carefully rolling out access to ensure every user gets the attention they deserve. Join our queue and we'll reach out personally when it's your turn to transform your fundraising with complete transparency.</p>
                
                <form id="waitlistForm" class="space-y-4">
                    <div>
                        <input type="text" id="firstName" name="firstName" placeholder="First Name" required 
                               class="w-full px-4 py-3 bg-dt-navy border border-dt-slate rounded-lg text-dt-silver placeholder-dt-slate focus:border-dt-teal focus:outline-none transition">
                    </div>
                    <div>
                        <input type="text" id="lastName" name="lastName" placeholder="Last Name" required 
                               class="w-full px-4 py-3 bg-dt-navy border border-dt-slate rounded-lg text-dt-silver placeholder-dt-slate focus:border-dt-teal focus:outline-none transition">
                    </div>
                    <div>
                        <input type="email" id="email" name="email" placeholder="Email Address" required 
                               class="w-full px-4 py-3 bg-dt-navy border border-dt-slate rounded-lg text-dt-silver placeholder-dt-slate focus:border-dt-teal focus:outline-none transition">
                    </div>
                    <div>
                        <select id="organizationType" name="organizationType" required 
                                class="w-full px-4 py-3 bg-dt-navy border border-dt-slate rounded-lg text-dt-silver focus:border-dt-teal focus:outline-none transition">
                            <option value="">What best describes you?</option>
                            <option value="new-charity">New Charity/Nonprofit</option>
                            <option value="established-nonprofit">Established Nonprofit</option>
                            <option value="local-community">Local Community Leader</option>
                            <option value="individual-fundraiser">Individual Fundraiser</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="flex gap-3 mt-6">
                        <button type="button" onclick="closeWaitlistModal()" 
                                class="flex-1 px-4 py-3 bg-transparent border border-dt-slate text-dt-slate rounded-lg hover:bg-dt-slate hover:text-dt-navy transition font-medium">
                            Maybe Later
                        </button>
                        <button type="submit" 
                                class="flex-1 px-4 py-3 bg-dt-teal text-dt-navy rounded-lg hover:bg-opacity-90 transition font-bold">
                            Get In Line
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 hidden flex items-center justify-center">
        <div class="bg-dt-charcoal rounded-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0" id="successModalContent">
            <div class="text-center">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-dt-silver mb-2">You're In The Queue!</h3>
                <p class="text-dt-slate mb-6">Perfect! We've got your spot reserved. We're working through access requests in order, and we'll reach out personally when it's your turn. You'll receive an email confirmation with your queue details shortly.</p>
                <p class="text-dt-teal text-sm mb-6">Watch your inbox - we'll contact you when it's your turn!</p>
                
                <button onclick="closeSuccessModal()" 
                        class="w-full px-4 py-3 bg-dt-teal text-dt-navy rounded-lg hover:bg-opacity-90 transition font-bold">
                    Continue Exploring
                </button>
            </div>
        </div>
    </div>
    ` : ''}`;
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', createHeaderHTML());
});