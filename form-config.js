// Form Submission Configuration
// Update these settings to configure your form submission services

const FORM_CONFIG = {
    // Primary email where form submissions will be sent
    recipientEmail: 'dmir7186@gmail.com',
    
    // Formspree Configuration (Primary method)
    formspree: {
        // Get your form endpoint from https://formspree.io/
        // Form ID: manbpqba
        endpoint: 'https://formspree.io/f/manbpqba',
        enabled: true
    },
    
    // EmailJS Configuration (Disabled - no credentials stored)
    emailjs: {
        enabled: false
    },
    
    // Notification messages
    messages: {
        success: "Message sent successfully! I'll get back to you soon.",
        error: "Unable to send message. Please try again or contact me directly at dmir7186@gmail.com",
        loading: "Sending...",
        rateLimit: "Too many requests. Please wait before trying again.",
        formLimit: "Too many form submissions. Please wait before trying again.",
        validation: "Please fix the errors in the form."
    }
};

// Make config available globally
window.FORM_CONFIG = FORM_CONFIG;