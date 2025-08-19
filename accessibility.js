// Accessibility enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addAriaLabels();
        this.addFocusManagement();
        this.addSkipLinks();
    }

    addKeyboardNavigation() {
        // Hamburger menu keyboard support
        const hamburger = document.getElementById('hamburger');
        if (hamburger) {
            hamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    hamburger.click();
                }
            });
        }

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });

        // Tab navigation for cards
        const cards = document.querySelectorAll('.project-card, .education-card, .stat-card');
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const link = card.querySelector('a');
                    if (link) link.click();
                }
            });
        });
    }

    addAriaLabels() {
        // Update hamburger ARIA attributes
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            
            // Update on menu toggle
            const observer = new MutationObserver(() => {
                const isActive = navMenu.classList.contains('active');
                hamburger.setAttribute('aria-expanded', isActive);
                navMenu.setAttribute('aria-hidden', !isActive);
            });
            
            observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
        }

        // Add live region for typing animation
        const typingText = document.getElementById('typingText');
        if (typingText) {
            typingText.setAttribute('aria-live', 'polite');
        }
    }

    addFocusManagement() {
        // Focus management for mobile menu
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Focus trap for mobile menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = navMenu.querySelectorAll('a, button, input');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    addSkipLinks() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.getElementById('mobileOverlay');

        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});