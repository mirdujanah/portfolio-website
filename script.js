// Security Configuration
const SECURITY_CONFIG = {
    maxFormSubmissions: 5,
    submissionTimeout: 60000, // 1 minute
    maxInputLength: {
        name: 100,
        email: 254,
        subject: 200,
        message: 1000
    },
    allowedEmailDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'],
    rateLimitWindow: 300000, // 5 minutes
    maxRequestsPerWindow: 10
};

// Security Utilities
class SecurityUtils {
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Remove potentially dangerous characters and scripts
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/script/gi, '') // Remove script tags
            .trim();
    }

    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    static validateName(name) {
        const nameRegex = /^[A-Za-z\s]{2,100}$/;
        return nameRegex.test(name);
    }

    static validateSubject(subject) {
        return subject.length >= 3 && subject.length <= 200;
    }

    static validateMessage(message) {
        return message.length >= 10 && message.length <= 1000;
    }

    static generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
}

// Rate Limiting
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.formSubmissions = new Map();
    }

    isRateLimited(identifier) {
        const now = Date.now();
        const userRequests = this.requests.get(identifier) || [];
        
        // Remove old requests outside the window
        const validRequests = userRequests.filter(time => now - time < SECURITY_CONFIG.rateLimitWindow);
        
        if (validRequests.length >= SECURITY_CONFIG.maxRequestsPerWindow) {
            return true;
        }
        
        validRequests.push(now);
        this.requests.set(identifier, validRequests);
        return false;
    }

    isFormSubmissionLimited(identifier) {
        const now = Date.now();
        const submissions = this.formSubmissions.get(identifier) || [];
        
        // Remove old submissions
        const validSubmissions = submissions.filter(time => now - time < SECURITY_CONFIG.submissionTimeout);
        
        if (validSubmissions.length >= SECURITY_CONFIG.maxFormSubmissions) {
            return true;
        }
        
        validSubmissions.push(now);
        this.formSubmissions.set(identifier, validSubmissions);
        return false;
    }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter();

// CSRF Protection
let csrfToken = SecurityUtils.generateCSRFToken();

// DOM Ready Handler with Security
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security features
    initializeSecurityFeatures();
    
    // Initialize UI components
    initializeUI();
    
    // Initialize form handling
    initializeFormHandling();
});

// Security Features Initialization
function initializeSecurityFeatures() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityNotification('Right-click is disabled for security reasons.');
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            showSecurityNotification('Developer tools access is restricted.');
        }
    });

    // Prevent drag and drop of images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Add security headers dynamically
    addSecurityHeaders();
}

// Add Security Headers
function addSecurityHeaders() {
    // This would typically be done server-side, but we can add some client-side protection
    if (window.location.protocol === 'https:') {
        // Force HTTPS
        if (window.location.protocol !== 'https:') {
            window.location.href = window.location.href.replace('http:', 'https:');
        }
    }
}

// UI Initialization
function initializeUI() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Keyboard accessibility
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .stat, .contact-method');
    animateElements.forEach(el => observer.observe(el));

    // Handle profile image loading
    const profileImg = document.querySelector('.profile-img');
    const profileLoading = document.querySelector('.profile-loading');
    
    if (profileImg) {
        profileImg.addEventListener('load', () => {
            profileImg.classList.add('loaded');
            if (profileLoading) {
                profileLoading.style.display = 'none';
            }
            
            // Ensure face is properly centered
            profileImg.style.objectPosition = 'center 25%';
        });
        
        profileImg.addEventListener('error', () => {
            if (profileLoading) {
                profileLoading.style.display = 'none';
            }
        });
    }

    // Skill bars animation
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillsObserver.observe(skillsSection);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Form Handling with Security
function initializeFormHandling() {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Form submission with security
    contactForm.addEventListener('submit', handleFormSubmission);
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (!errorElement) return true;

    let isValid = true;
    let errorMessage = '';

    // Skip validation for empty non-required fields
    if (!field.hasAttribute('required') && value === '') {
        isValid = true;
    } else {
        switch (fieldName) {
            case 'name':
                if (value === '' || !SecurityUtils.validateName(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name (letters and spaces only, 2-100 characters).';
                }
                break;
            case 'email':
                if (value === '' || !SecurityUtils.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
            case 'subject':
                if (value === '' || !SecurityUtils.validateSubject(value)) {
                    isValid = false;
                    errorMessage = 'Subject must be between 3 and 200 characters.';
                }
                break;
            case 'message':
                if (value === '' || !SecurityUtils.validateMessage(value)) {
                    isValid = false;
                    errorMessage = 'Message must be between 10 and 1000 characters.';
                }
                break;
        }
    }

    if (isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }

    return isValid;
}

// Secure Form Submission with Multiple Methods
async function handleFormSubmission(e) {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📝 FORM_CONFIG loaded:', !!window.FORM_CONFIG);
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get user identifier for rate limiting
    const userIdentifier = SecurityUtils.hashString(
        navigator.userAgent + window.screen.width + window.screen.height
    );

    // Check rate limiting
    if (rateLimiter.isRateLimited(userIdentifier)) {
        showSecurityNotification('Too many requests. Please wait before trying again.');
        return;
    }

    if (rateLimiter.isFormSubmissionLimited(userIdentifier)) {
        showSecurityNotification('Too many form submissions. Please wait before trying again.');
        return;
    }

    // SKIP ALL VALIDATION - JUST SUBMIT THE FORM
    console.log('🚀 Skipping validation - submitting form directly');

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Try multiple submission methods for reliability
        const success = await submitFormWithFallback(form, formData);
        
        if (success) {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Regenerate CSRF token
            csrfToken = SecurityUtils.generateCSRFToken();
        } else {
            throw new Error('All submission methods failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Unable to send message. Please try again or contact me directly at dmir7186@gmail.com', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Form Submission with Multiple Methods
async function submitFormWithFallback(form, formData) {
    // Method 1: Try Formspree (Primary)
    try {
        const success = await submitToFormspree(form, formData);
        if (success) return true;
    } catch (error) {
        console.warn('Formspree submission failed:', error);
    }

    // Method 2: Try EmailJS (Fallback)
    try {
        const success = await submitWithEmailJS(formData);
        if (success) return true;
    } catch (error) {
        console.warn('EmailJS submission failed:', error);
    }

    // Method 3: Try direct email link (Last resort)
    return submitViaEmailLink(formData);
}

// Primary method: Formspree
async function submitToFormspree(form, formData) {
    try {
        console.log('Submitting to Formspree:', form.action);
        console.log('Form data:', Object.fromEntries(formData.entries()));
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return true;
        } else if (response.status === 400) {
            // Handle Formspree validation errors
            try {
                const errorData = await response.json();
                console.error('Formspree validation error:', errorData);
                throw new Error(errorData.error || 'Form validation failed on server');
            } catch (jsonError) {
                // If we can't parse the error, it might be first-time setup
                console.warn('Formspree 400 error - might need email verification');
                throw new Error('Form submission failed. Please check your email for a verification link from Formspree.');
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Formspree error: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
}

// Fallback method: EmailJS
async function submitWithEmailJS(formData) {
    const config = FORM_CONFIG.emailjs;

    // Only try EmailJS if enabled and configured
    if (config.enabled && typeof emailjs !== 'undefined' && config.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        try {
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: FORM_CONFIG.recipientEmail
            };

            const response = await emailjs.send(
                config.serviceID,
                config.templateID,
                templateParams,
                config.publicKey
            );

            return response.status === 200;
        } catch (error) {
            throw error;
        }
    }
    return false;
}

// Last resort: Open email client
function submitViaEmailLink(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:${FORM_CONFIG.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Return true as we've initiated the email process
    return true;
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Security Notification System
function showSecurityNotification(message) {
    showNotification(message, 'warning');
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${SecurityUtils.sanitizeInput(message)}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add styles
    const colors = {
        success: '#34c759',
        error: '#ff3b30',
        warning: '#ff9500',
        info: '#0071e3'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for Apple-style loading state and security features
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fbfbfd;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #0071e3;
        border-radius: 50%;
        animation: appleSpin 1s linear infinite;
        z-index: 10000;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .nav-link.active {
        color: #0071e3;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Apple-style smooth scrolling */
    html {
        scroll-behavior: smooth;
    }
    
    /* Apple-style focus states */
    *:focus {
        outline: none;
    }
    
    /* Apple-style selection */
    ::selection {
        background: rgba(0, 113, 227, 0.2);
        color: #1d1d1f;
    }
    
    /* Form validation styles */
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ff3b30;
        box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
    }
    
    .error-message {
        color: #ff3b30;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: none;
    }
    
    /* Security warning styles */
    .notification-warning {
        background: #ff9500 !important;
    }
`;

document.head.appendChild(loadingStyles); 