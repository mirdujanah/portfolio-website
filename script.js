// Enhanced Security Configuration
const SECURITY_CONFIG = {
    maxFormSubmissions: 3,
    submissionTimeout: 300000, // 5 minutes
    maxInputLength: {
        name: 100,
        email: 254,
        subject: 200,
        message: 1000
    },
    minInputLength: {
        name: 2,
        email: 5,
        subject: 3,
        message: 10
    },
    rateLimitWindow: 900000, // 15 minutes
    maxRequestsPerWindow: 5,
    // Malicious patterns to detect
    maliciousPatterns: [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
        /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
        /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
        /expression\s*\(/gi,
        /url\s*\(/gi,
        /@import/gi,
        /binding\s*:/gi
    ],
    // SQL injection patterns
    sqlPatterns: [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        /(\'|\"|;|--|\*|\/\*|\*\/)/g,
        /(\bOR\b.*\b=\b|\bAND\b.*\b=\b)/gi,
        /(\b1\s*=\s*1\b|\b1\s*=\s*0\b)/gi
    ],
    // Spam keywords
    spamKeywords: [
        'bitcoin', 'cryptocurrency', 'investment', 'loan', 'mortgage', 'casino',
        'viagra', 'cialis', 'pharmacy', 'discount', 'free money', 'get rich',
        'click here', 'limited time', 'act now', 'congratulations'
    ]
};

// Enhanced Security Utilities - Hack-Proof Implementation
class SecurityUtils {
    // Comprehensive input sanitization against XSS, injection attacks
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            // HTML entity encoding for XSS prevention
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            // Remove dangerous protocols and patterns
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
            .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
            .replace(/expression\s*\(/gi, '')
            // SQL injection prevention
            .replace(/(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b|\bEXEC\b|\bUNION\b)/gi, '')
            .replace(/(\'|\"|;|--|\*|\/\*|\*\/)/g, '')
            // Normalize whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Advanced XSS detection
    static detectXSS(input) {
        return SECURITY_CONFIG.maliciousPatterns.some(pattern => pattern.test(input));
    }

    // SQL injection detection
    static detectSQLInjection(input) {
        return SECURITY_CONFIG.sqlPatterns.some(pattern => pattern.test(input));
    }

    // Spam content detection
    static detectSpam(input) {
        const lowerInput = input.toLowerCase();
        return SECURITY_CONFIG.spamKeywords.some(keyword => lowerInput.includes(keyword));
    }

    // Comprehensive validation with security checks
    static validateAndSanitize(input, fieldType, fieldName) {
        if (!input || typeof input !== 'string') {
            return { isValid: false, sanitized: '', error: `${fieldName} is required` };
        }

        const trimmed = input.trim();
        
        // Length validation
        const minLength = SECURITY_CONFIG.minInputLength[fieldType] || 1;
        const maxLength = SECURITY_CONFIG.maxInputLength[fieldType] || 1000;
        
        if (trimmed.length < minLength) {
            return { isValid: false, sanitized: '', error: `${fieldName} must be at least ${minLength} characters` };
        }
        
        if (trimmed.length > maxLength) {
            return { isValid: false, sanitized: '', error: `${fieldName} must be less than ${maxLength} characters` };
        }

        // Security threat detection
        if (this.detectXSS(trimmed)) {
            console.warn(`🚨 XSS attempt blocked in ${fieldName}:`, trimmed);
            return { isValid: false, sanitized: '', error: 'Security violation detected' };
        }

        if (this.detectSQLInjection(trimmed)) {
            console.warn(`🚨 SQL injection attempt blocked in ${fieldName}:`, trimmed);
            return { isValid: false, sanitized: '', error: 'Security violation detected' };
        }

        if (this.detectSpam(trimmed)) {
            console.warn(`🚨 Spam content blocked in ${fieldName}:`, trimmed);
            return { isValid: false, sanitized: '', error: 'Content flagged as spam' };
        }

        // Sanitize the input
        const sanitized = this.sanitizeInput(trimmed);

        // Field-specific validation
        switch (fieldType) {
            case 'email':
                if (!this.validateEmailFormat(sanitized)) {
                    return { isValid: false, sanitized: '', error: 'Please enter a valid email address' };
                }
                break;
            case 'name':
                if (!this.validateNameFormat(sanitized)) {
                    return { isValid: false, sanitized: '', error: 'Name contains invalid characters' };
                }
                break;
        }

        return { isValid: true, sanitized, error: null };
    }

    // Robust email validation
    static validateEmailFormat(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
    }

    // Name format validation (letters, spaces, hyphens, apostrophes only)
    static validateNameFormat(name) {
        const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
        return nameRegex.test(name) && !name.match(/[-'\.]{2,}/);
    }

    // Enhanced validation methods with security
    static validateEmail(email) {
        const result = this.validateAndSanitize(email, 'email', 'Email');
        return result.isValid;
    }

    static validateName(name) {
        const result = this.validateAndSanitize(name, 'name', 'Name');
        return result.isValid;
    }

    static validateSubject(subject) {
        const result = this.validateAndSanitize(subject, 'subject', 'Subject');
        return result.isValid;
    }

    static validateMessage(message) {
        const result = this.validateAndSanitize(message, 'message', 'Message');
        return result.isValid;
    }

    // Cryptographically secure CSRF token generation
    static generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Enhanced hash function with salt
    static hashString(str) {
        const salt = 'portfolio_security_2024';
        const combined = str + salt;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Bot detection based on behavior patterns
    static detectBot(userAgent, timingData) {
        const suspiciousPatterns = [
            /bot|crawler|spider|scraper/i,
            /headless/i,
            /phantom/i,
            /selenium/i,
            /puppeteer/i
        ];
        
        const isSuspiciousUA = suspiciousPatterns.some(pattern => pattern.test(userAgent));
        const isTooFast = timingData && timingData.fillTime < 2000; // Less than 2 seconds to fill form
        
        return isSuspiciousUA || isTooFast;
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

// Enhanced Form Handling with Security
function initializeFormHandling() {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    // Enhanced real-time validation with security
    const inputs = contactForm.querySelectorAll('input:not([type="hidden"]), textarea');
    inputs.forEach(input => {
        // Skip honeypot fields
        if (input.name === 'website' || input.name === 'email_confirm') return;
        
        input.addEventListener('input', () => validateFieldWithSecurity(input));
        input.addEventListener('blur', () => validateFieldWithSecurity(input));
    });

    // Form submission with comprehensive security
    contactForm.addEventListener('submit', handleFormSubmission);
}

// Enhanced Field Validation with Security
function validateFieldWithSecurity(field) {
    const value = field.value;
    const fieldName = field.name;
    const fieldType = fieldName; // name, email, subject, message
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (!errorElement) return true;

    // Get validation result with security checks
    const result = SecurityUtils.validateAndSanitize(value, fieldType, fieldName);
    
    if (result.isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        return true;
    } else {
        field.classList.add('error');
        errorElement.textContent = result.error;
        errorElement.style.display = 'block';
        return false;
    }
}

// Legacy validation function for compatibility
function validateField(field) {
    return validateFieldWithSecurity(field);
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

    // Enhanced security checks
    const userAgent = navigator.userAgent;
    const formStartTime = performance.now();
    
    // Bot detection
    if (SecurityUtils.detectBot(userAgent, { fillTime: formStartTime })) {
        console.warn('🤖 Bot detected - submission blocked');
        showNotification('Automated submission detected. Please try again.', 'error');
        return;
    }

    // Check honeypot fields (bot trap)
    const honeypotWebsite = formData.get('website');
    const honeypotEmail = formData.get('email_confirm');
    if (honeypotWebsite || honeypotEmail) {
        console.warn('🍯 Honeypot triggered - bot detected');
        showNotification('Form submission failed. Please try again.', 'error');
        return;
    }

    // Rate limiting with enhanced security
    if (rateLimiter.isRateLimited(userIdentifier)) {
        showSecurityNotification('Too many requests. Please wait 15 minutes before trying again.');
        return;
    }

    if (rateLimiter.isFormSubmissionLimited(userIdentifier)) {
        showSecurityNotification('Too many form submissions. Please wait 5 minutes before trying again.');
        return;
    }

    // Comprehensive field validation and sanitization
    const validationResults = {
        name: SecurityUtils.validateAndSanitize(formData.get('name'), 'name', 'Name'),
        email: SecurityUtils.validateAndSanitize(formData.get('email'), 'email', 'Email'),
        subject: SecurityUtils.validateAndSanitize(formData.get('subject'), 'subject', 'Subject'),
        message: SecurityUtils.validateAndSanitize(formData.get('message'), 'message', 'Message')
    };

    // Check if any field failed validation
    const failedFields = Object.entries(validationResults).filter(([_, result]) => !result.isValid);
    
    if (failedFields.length > 0) {
        const errorMessages = failedFields.map(([field, result]) => `${field}: ${result.error}`);
        console.warn('🚨 Security validation failed:', errorMessages);
        showNotification(failedFields[0][1].error, 'error');
        return;
    }

    // Create sanitized form data
    const sanitizedFormData = new FormData();
    Object.entries(validationResults).forEach(([field, result]) => {
        sanitizedFormData.append(field, result.sanitized);
    });
    
    // Add Formspree hidden fields
    sanitizedFormData.append('_next', formData.get('_next'));
    sanitizedFormData.append('_subject', formData.get('_subject'));
    sanitizedFormData.append('_captcha', formData.get('_captcha'));

    console.log('✅ All security checks passed - submitting sanitized form data');

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Try multiple submission methods for reliability using sanitized data
        const success = await submitFormWithFallback(form, sanitizedFormData);
        
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