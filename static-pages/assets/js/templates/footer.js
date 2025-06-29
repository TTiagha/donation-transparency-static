// Footer Template
// Consistent footer across all pages

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/features/') || path.includes('/guides/') || path.includes('/transparency/')) {
        return '../';
    }
    return '';
}

function createFooterHTML() {
    const basePath = getBasePath();
    
    return `
    <!-- Footer -->
    <footer class="bg-dt-charcoal py-8">
        <div class="container mx-auto px-6 text-center text-dt-slate">
            <p>&copy; 2025 Donation Transparency. All Rights Reserved.</p>
            <p class="text-xs mt-2">300 Peachtree Street NE, Suite 24A, Atlanta, GA 30308 | Digital Services Available Globally</p>
            <div class="flex justify-center space-x-6 mt-4">
                <a href="#" class="hover:text-dt-silver transition">Privacy Policy</a>
                <a href="#" class="hover:text-dt-silver transition">Terms of Service</a>
                <a href="${basePath}contact.html" class="hover:text-dt-silver transition">Contact Us</a>
            </div>
            
            <!-- Join Our Movement Button -->
            <div class="flex justify-center mt-6">
                <a href="${basePath}petition-for-transparency.html" class="text-dt-teal border border-dt-teal font-semibold px-6 py-3 rounded-lg hover:bg-dt-teal hover:text-white transition-colors">
                    Join Our Movement
                </a>
            </div>
        </div>
    </footer>`;
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', createFooterHTML());
});