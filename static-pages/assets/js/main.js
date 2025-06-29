// JS for revealing sections on scroll
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    observer.observe(el);
});

// Premium Mobile Menu Functions with Animations
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenu) {
        console.error('Mobile menu element not found');
        return;
    }
    
    if (mobileMenu.classList.contains('hidden')) {
        // Show menu with staggered animation
        showMobileMenuWithAnimation(mobileMenu);
    } else {
        // Hide menu with reverse animation
        hideMobileMenuWithAnimation(mobileMenu);
    }
}

function showMobileMenuWithAnimation(mobileMenu) {
    // Show the menu container
    mobileMenu.classList.remove('hidden');
    
    // Set initial state for animation
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-20px)';
    mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Animate menu container
    requestAnimationFrame(() => {
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
    });
    
    // Animate menu items with stagger
    const menuItems = mobileMenu.querySelectorAll('a, button');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 80)); // Staggered delay
    });
}

function hideMobileMenuWithAnimation(mobileMenu) {
    const menuItems = mobileMenu.querySelectorAll('a, button');
    
    // Animate items out in reverse order
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        }, index * 60);
    });
    
    // Hide menu container after items animate out
    setTimeout(() => {
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            // Reset styles for next animation
            mobileMenu.style.opacity = '';
            mobileMenu.style.transform = '';
            menuItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
            });
        }, 300);
    }, menuItems.length * 60 + 100);
}

// Waitlist Modal Functions
function openWaitlistModal() {
    const modal = document.getElementById('waitlistModal');
    const modalContent = document.getElementById('modalContent');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeWaitlistModal() {
    const modal = document.getElementById('waitlistModal');
    const modalContent = document.getElementById('modalContent');
    
    // Animate out
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

function openSuccessModal() {
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    
    // Animate out
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside
const waitlistModal = document.getElementById('waitlistModal');
if (waitlistModal) {
    waitlistModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeWaitlistModal();
        }
    });
}

const successModal = document.getElementById('successModal');
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
}

// Handle form submission
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Getting In Line...';
    submitButton.disabled = true;
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        // Configuration - easily switch between FormSpree and AWS Lambda
        const USE_AWS_LAMBDA = true; // Set to true when Lambda is deployed
        const LAMBDA_ENDPOINT = 'https://xx6wbeedmowhv5jjhk6ubvx32e0rsidp.lambda-url.us-east-1.on.aws/';
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanywpza';
        
        let response;
        
        if (USE_AWS_LAMBDA) {
            // Use AWS Lambda with SES (preferred - uses your paid AWS SES service)
            response = await fetch(LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    organizationType: data.organizationType
                })
            });
        } else {
            // Use FormSpree for static hosting (temporary solution)
            response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    organizationType: data.organizationType,
                    timestamp: new Date().toISOString(),
                    _subject: 'New Waitlist Signup - Donation Transparency'
                })
            });
        }
        
        if (response.ok) {
            // Close waitlist modal and show success modal
            closeWaitlistModal();
            setTimeout(() => {
                openSuccessModal();
            }, 400);
            
            // Reset form
            this.reset();
        } else {
            throw new Error('Failed to join waitlist');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error joining the waitlist. Please try again.');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
    });
}

// Escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const waitlistModal = document.getElementById('waitlistModal');
        const successModal = document.getElementById('successModal');
        
        if (waitlistModal && !waitlistModal.classList.contains('hidden')) {
            closeWaitlistModal();
        }
        if (successModal && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    }
});

// Dynamic time and date for phone mockup
function updateTime() {
    const now = new Date();
    
    // Format time (12-hour format)
    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date
    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Update elements if they exist
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// Update time immediately and then every minute
updateTime();
setInterval(updateTime, 60000);
