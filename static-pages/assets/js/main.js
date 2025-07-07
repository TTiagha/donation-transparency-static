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

// Waitlist Modal Functions - make globally accessible
window.openWaitlistModal = function openWaitlistModal() {
    console.log('🔄 Opening waitlist modal...');
    const modal = document.getElementById('waitlistModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Waitlist modal elements not found:', { modal: !!modal, modalContent: !!modalContent });
        return;
    }
    
    console.log('Waitlist modal elements found, showing modal...');
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'items-center', 'justify-center');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        console.log('✅ Waitlist modal animation complete');
    }, 10);
}

window.closeWaitlistModal = function closeWaitlistModal() {
    console.log('🔄 Closing waitlist modal...');
    const modal = document.getElementById('waitlistModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal elements not found:', { modal: !!modal, modalContent: !!modalContent });
        return;
    }
    
    // Animate out
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex', 'items-center', 'justify-center');
        document.body.style.overflow = 'auto';
        console.log('✅ Waitlist modal closed');
    }, 300);
}

window.openSuccessModal = function openSuccessModal() {
    console.log('🎉 Opening success modal...');
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Success modal elements not found:', { modal: !!modal, modalContent: !!modalContent });
        return;
    }
    
    console.log('Success modal elements found, showing modal...');
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'items-center', 'justify-center');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        console.log('✅ Success modal animation complete');
    }, 10);
}

window.closeSuccessModal = function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    
    // Animate out
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex', 'items-center', 'justify-center');
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

// Handle form submission function
async function handleWaitlistFormSubmission(form) {
    console.log('🚀 MANUAL FORM SUBMISSION TRIGGERED!');
    
    const formSubmitButton = form.querySelector('button[type="submit"]');
    const originalText = formSubmitButton.textContent;
    
    // Show loading state
    formSubmitButton.textContent = 'Getting In Line...';
    formSubmitButton.disabled = true;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        // Configuration - easily switch between FormSpree and AWS Lambda
        const USE_AWS_LAMBDA = true; // Set to true when Lambda is deployed
        const LAMBDA_ENDPOINT = 'https://xx6wbeedmowhv5jjhk6ubvx32e0rsidp.lambda-url.us-east-1.on.aws/';
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanywpza';
        
        console.log('Waitlist form submission starting...', data);
        
        let response;
        
        if (USE_AWS_LAMBDA) {
            console.log('Using AWS Lambda endpoint:', LAMBDA_ENDPOINT);
            
            const requestBody = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                organizationType: data.organizationType,
                source: 'homepage-waitlist'
            };
            
            console.log('Sending request with body:', requestBody);
            
            // Use AWS Lambda with SES (preferred - uses your paid AWS SES service)
            response = await fetch(LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Response received:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
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
        
        // Try to get response text for debugging
        let responseText = '';
        try {
            responseText = await response.text();
            console.log('Response text:', responseText);
        } catch (e) {
            console.log('Could not read response text:', e);
        }
        
        if (response.ok) {
            console.log('✅ Success! Showing success modal...');
            // Close waitlist modal and show success modal
            closeWaitlistModal();
            setTimeout(() => {
                openSuccessModal();
                console.log('Success modal should now be visible');
            }, 400);
            
            // Reset form
            form.reset();
        } else {
            console.error('❌ Request failed:', {
                status: response.status,
                statusText: response.statusText,
                responseText: responseText
            });
            throw new Error(`Failed to join waitlist: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Form submission error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        alert(`Sorry, there was an error joining the waitlist: ${error.message}`);
    } finally {
        // Reset button state
        console.log('Resetting button state...');
        formSubmitButton.textContent = originalText;
        formSubmitButton.disabled = false;
    }
}

console.log('🔍 Looking for waitlist form...');
const waitlistForm = document.getElementById('waitlistForm');
console.log('Waitlist form found:', !!waitlistForm);

if (waitlistForm) {
    console.log('✅ Attaching event listener to waitlist form');
    
    // Add multiple ways to catch the form submission
    // Add button click debugging and manual form submission with multiple event capture methods
    const submitButton = waitlistForm.querySelector('button[type="submit"]');
    if (submitButton) {
        console.log('✅ Submit button found, adding multiple click listeners');
        
        // Method 1: Click event with capture
        submitButton.addEventListener('click', function(e) {
            console.log('🖱️ MODAL SUBMIT BUTTON CLICKED (capture phase)!');
            console.log('Preventing default and manually handling submission...');
            
            // Prevent default button behavior
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Manually trigger our form handling
            handleWaitlistFormSubmission(waitlistForm);
            return false;
        }, true); // Use capture phase
        
        // Method 2: Click event without capture
        submitButton.addEventListener('click', function(e) {
            console.log('🖱️ MODAL SUBMIT BUTTON CLICKED (bubble phase)!');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }, false);
        
        // Method 3: Override the button's onclick if it exists
        if (submitButton.onclick) {
            console.log('Found existing onclick, overriding...');
        }
        submitButton.onclick = function(e) {
            console.log('🖱️ MODAL SUBMIT BUTTON ONCLICK!');
            e.preventDefault();
            e.stopPropagation();
            handleWaitlistFormSubmission(waitlistForm);
            return false;
        };
        
    } else {
        console.error('❌ Submit button not found in form');
    }
    
    // Method 4: Aggressive form submit prevention
    waitlistForm.addEventListener('submit', function(e) {
        console.log('🚀 FORM SUBMISSION TRIGGERED - PREVENTING!');
        console.log('Event object:', e);
        
        // Prevent default immediately
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('✅ Default prevented, calling manual handler...');
        handleWaitlistFormSubmission(waitlistForm);
        return false;
    }, true); // Use capture phase
    
    // Additional submit prevention
    waitlistForm.addEventListener('submit', function(e) {
        console.log('🚀 FORM SUBMISSION TRIGGERED (bubble) - PREVENTING!');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }, false);
} else {
    console.error('❌ Waitlist form not found! Available forms:', 
        Array.from(document.querySelectorAll('form')).map(f => ({ id: f.id, innerHTML: f.innerHTML.substring(0, 100) }))
    );
}

// Test modal functions on page load
console.log('🧪 Testing modal elements...');
setTimeout(() => {
    const waitlistModal = document.getElementById('waitlistModal');
    const successModal = document.getElementById('successModal');
    console.log('Modal elements check:', {
        waitlistModal: !!waitlistModal,
        successModal: !!successModal,
        waitlistForm: !!document.getElementById('waitlistForm')
    });
}, 1000);

// Debug function - make it globally available for testing
window.testSuccessModal = function() {
    console.log('🧪 Testing success modal manually...');
    openSuccessModal();
};

window.testWaitlistModal = function() {
    console.log('🧪 Testing waitlist modal manually...');
    openWaitlistModal();
};

// Debug function to manually test form submission
window.testFormSubmission = function() {
    console.log('🧪 Testing form submission manually...');
    const form = document.getElementById('waitlistForm');
    if (form) {
        const formData = new FormData(form);
        console.log('Form data:', Object.fromEntries(formData));
        
        // Fill out form for testing
        form.firstName.value = 'Test';
        form.lastName.value = 'User';  
        form.email.value = 'test@example.com';
        form.organizationType.value = 'individual-fundraiser';
        
        // Trigger submit event
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
        console.error('Form not found');
    }
};

// Add global click monitoring
document.addEventListener('click', function(e) {
    if (e.target.type === 'submit' || e.target.tagName === 'BUTTON') {
        console.log('🖱️ Button/submit clicked:', {
            element: e.target,
            type: e.target.type,
            form: e.target.form,
            id: e.target.id,
            className: e.target.className,
            formId: e.target.form ? e.target.form.id : 'NO_FORM',
            textContent: e.target.textContent.trim()
        });
        
        // Special check for waitlist form submit button
        if (e.target.form && e.target.form.id === 'waitlistForm' && e.target.type === 'submit') {
            console.log('🎯 WAITLIST FORM SUBMIT BUTTON DETECTED!');
            console.log('Form validation state:', {
                firstName: e.target.form.firstName.value,
                lastName: e.target.form.lastName.value,
                email: e.target.form.email.value,
                organizationType: e.target.form.organizationType.value
            });
        }
    }
}, true);

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
