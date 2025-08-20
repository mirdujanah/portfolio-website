// Performance optimized JavaScript with cached DOM elements
let scrollAnimationFrame = null;
let scrollThrottleTimeout = null;

// Cache DOM elements to avoid repeated queries
const cachedElements = {
    heroContent: null,
    profileImage: null,
    sections: null,
    navLinks: null,
    scrollProgress: null,
    skillBars: null,
    navbar: null,
    hamburger: null,
    navMenu: null,
    mobileOverlay: null,
    typingElement: null,
    themeToggleDesktop: null,
    themeToggleMobile: null,
    filterBtns: null,
    projectCards: null,
    contactForm: null,
    footer: null,
    contactSection: null,
    inputs: null,
    contactTexts: null
};

// Initialize cached elements
function initCachedElements() {
    cachedElements.heroContent = document.querySelector('.hero-content');
    cachedElements.profileImage = document.querySelector('.profile-image-simple');
    cachedElements.sections = document.querySelectorAll('section');
    cachedElements.navLinks = document.querySelectorAll('.nav-link');
    cachedElements.scrollProgress = document.getElementById('scrollProgress');
    cachedElements.skillBars = document.querySelectorAll('.skill-progress');
    cachedElements.navbar = document.querySelector('.navbar');
    cachedElements.hamburger = document.querySelector('.hamburger');
    cachedElements.navMenu = document.querySelector('.nav-menu');
    cachedElements.mobileOverlay = document.getElementById('mobileOverlay');
    cachedElements.typingElement = document.getElementById('typingText');
    cachedElements.themeToggleDesktop = document.getElementById('themeToggle');
    cachedElements.themeToggleMobile = document.getElementById('themeToggleMobile');
    cachedElements.filterBtns = document.querySelectorAll('.filter-btn');
    cachedElements.projectCards = document.querySelectorAll('.project-card');
    cachedElements.contactForm = document.querySelector('.contact-form');
    cachedElements.footer = document.querySelector('.footer');
    cachedElements.contactSection = document.querySelector('.contact');
    cachedElements.inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    cachedElements.contactTexts = document.querySelectorAll('.contact-info h3, .contact-info p, .contact-method h4, .contact-method p');
}

// Optimized scroll animations
function updateScrollAnimations() {
    if (cachedElements.heroContent && cachedElements.profileImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        cachedElements.heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        cachedElements.profileImage.style.transform = `translateY(${rate * 0.2}px) scale(${1 + scrolled * 0.0002})`;
    }
}

function updateActiveNavigation() {
    if (!cachedElements.sections || !cachedElements.navLinks) return;
    
    let current = '';
    cachedElements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    cachedElements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateScrollProgress() {
    if (!cachedElements.scrollProgress) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    cachedElements.scrollProgress.style.width = scrollPercent + '%';
}

function updateNavbarBackground() {
    if (!cachedElements.navbar) return;
    
    if (window.scrollY > 100) {
        cachedElements.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        cachedElements.navbar.style.backdropFilter = 'blur(30px)';
    } else {
        cachedElements.navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        cachedElements.navbar.style.backdropFilter = 'blur(20px)';
    }
}

// Throttled scroll handler
function handleScroll() {
    if (scrollThrottleTimeout) return;
    
    scrollThrottleTimeout = setTimeout(() => {
        updateActiveNavigation();
        updateScrollProgress();
        updateNavbarBackground();
        
        if (scrollAnimationFrame) {
            cancelAnimationFrame(scrollAnimationFrame);
        }
        scrollAnimationFrame = requestAnimationFrame(updateScrollAnimations);
        
        scrollThrottleTimeout = null;
    }, 16); // ~60fps
}

// Cookie functions with performance optimization
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * MS_PER_DAY).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return '';
}

// Optimized smooth scroll with memory leak prevention
let activeScrollInterval = null;
const maxScrollIterations = 100;

function smoothScrollToTop() {
    if (activeScrollInterval) {
        clearInterval(activeScrollInterval);
        activeScrollInterval = null;
    }
    
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        let iterations = 0;
        activeScrollInterval = setInterval(() => {
            if (window.scrollY > 0 && iterations < maxScrollIterations) {
                window.scrollBy(0, -50);
                iterations++;
            } else {
                clearInterval(activeScrollInterval);
                activeScrollInterval = null;
            }
        }, 16);
    }
}

// Optimized typing animation with proper cleanup
let typingInterval = null;
const texts = ['Software Development Engineer', 'Cybersecurity Enthusiast', 'AI/ML Developer', 'Problem Solver'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypingAnimation() {
    if (!cachedElements.typingElement) return;
    
    if (typingInterval) {
        clearInterval(typingInterval);
    }
    
    typingInterval = setInterval(() => {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            cachedElements.typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        } else {
            cachedElements.typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                if (pauseTimeout) clearTimeout(pauseTimeout);
                pauseTimeout = setTimeout(() => { isDeleting = true; }, 2000);
            }
        }
    }, isDeleting ? 50 : 100);
}

function stopTypingAnimation() {
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }
}

// Safari-compatible theme toggle
function updateTheme(isDark, skipToggleUpdate = false) {
    const theme = isDark ? 'dark' : 'light';
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (isSafari) {
        applySafariDarkMode(isDark);
    }
    
    if (!skipToggleUpdate) {
        if (cachedElements.themeToggleDesktop) cachedElements.themeToggleDesktop.checked = isDark;
        if (cachedElements.themeToggleMobile) cachedElements.themeToggleMobile.checked = isDark;
    }
}

function applySafariDarkMode(isDark) {
    if (isDark) {
        document.body.style.background = '#1a1a1a';
        document.body.style.color = '#ffffff';
        
        if (cachedElements.contactSection) cachedElements.contactSection.style.background = '#1a1a1a';
        if (cachedElements.contactForm) {
            cachedElements.contactForm.style.background = '#2d2d2d';
            cachedElements.contactForm.style.border = '1px solid rgba(255,255,255,0.1)';
        }
        if (cachedElements.footer) {
            cachedElements.footer.style.background = '#0d0d0d';
            cachedElements.footer.style.color = '#ffffff';
        }
        if (cachedElements.inputs) {
            cachedElements.inputs.forEach(input => {
                input.style.background = '#1a1a1a';
                input.style.color = '#ffffff';
                input.style.border = '1px solid rgba(255,255,255,0.2)';
            });
        }
        if (cachedElements.contactTexts) {
            cachedElements.contactTexts.forEach(text => {
                text.style.color = '#ffffff';
            });
        }
    } else {
        document.body.style.background = '';
        document.body.style.color = '';
        
        if (cachedElements.contactSection) cachedElements.contactSection.style.background = '';
        if (cachedElements.contactForm) {
            cachedElements.contactForm.style.background = '';
            cachedElements.contactForm.style.border = '';
        }
        if (cachedElements.footer) {
            cachedElements.footer.style.background = '';
            cachedElements.footer.style.color = '';
        }
        if (cachedElements.inputs) {
            cachedElements.inputs.forEach(input => {
                input.style.background = '';
                input.style.color = '';
                input.style.border = '';
            });
        }
        if (cachedElements.contactTexts) {
            cachedElements.contactTexts.forEach(text => {
                text.style.color = '';
            });
        }
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = savedTheme === 'dark';
    
    updateTheme(isDarkMode);
    
    if (cachedElements.themeToggleDesktop) {
        cachedElements.themeToggleDesktop.addEventListener('change', function() {
            updateTheme(this.checked, true);
            if (cachedElements.themeToggleMobile) cachedElements.themeToggleMobile.checked = this.checked;
        });
    }
    
    if (cachedElements.themeToggleMobile) {
        cachedElements.themeToggleMobile.addEventListener('change', function() {
            updateTheme(this.checked, true);
            if (cachedElements.themeToggleDesktop) cachedElements.themeToggleDesktop.checked = this.checked;
        });
    }
}

// Optimized project filtering using cached elements
let skillObserver = null;

function initProjectFilters() {
    if (!cachedElements.filterBtns || !cachedElements.projectCards) return;
    
    cachedElements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cachedElements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            cachedElements.projectCards.forEach(card => {
                const shouldShow = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });
    
    initSkillBarsAnimation();
}

function initSkillBarsAnimation() {
    if (!cachedElements.skillBars) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width + '%';
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    cachedElements.skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Optimized mobile menu
function closeMobileMenu() {
    if (cachedElements.hamburger) cachedElements.hamburger.classList.remove('active');
    if (cachedElements.navMenu) cachedElements.navMenu.classList.remove('active');
    if (cachedElements.mobileOverlay) cachedElements.mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function initMobileMenu() {
    if (cachedElements.hamburger) {
        cachedElements.hamburger.addEventListener('click', () => {
            cachedElements.hamburger.classList.toggle('active');
            cachedElements.navMenu.classList.toggle('active');
            cachedElements.mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    if (cachedElements.mobileOverlay) {
        cachedElements.mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    if (cachedElements.navLinks) {
        cachedElements.navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// Cookie consent with error handling
function initCookieConsent() {
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    const consentBanner = document.getElementById('cookieConsent');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setCookie('cookieConsent', 'accepted', 365);
            if (consentBanner) consentBanner.style.display = 'none';
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            setCookie('cookieConsent', 'declined', 365);
            if (consentBanner) consentBanner.style.display = 'none';
            window['ga-disable-G-9J7MJXMGGW'] = true;
        });
    }
}

function showCookieConsent() {
    if (!getCookie('cookieConsent')) {
        const consentElement = document.getElementById('cookieConsent');
        if (consentElement) {
            consentElement.classList.add('show');
        }
    }
}

// Resume download tracking
function trackResumeDownload() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'resume_download', {
            'event_category': 'engagement',
            'event_label': 'resume_pdf'
        });
    }
    
    let downloads = localStorage.getItem('resumeDownloads') || 0;
    downloads++;
    localStorage.setItem('resumeDownloads', downloads);
}

// Global observers and intervals for cleanup
let revealObserver = null;
let pauseTimeout = null;

// Comprehensive cleanup function
function cleanup() {
    stopTypingAnimation();
    if (activeScrollInterval) {
        clearInterval(activeScrollInterval);
        activeScrollInterval = null;
    }
    if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
    }
    if (scrollThrottleTimeout) {
        clearTimeout(scrollThrottleTimeout);
        scrollThrottleTimeout = null;
    }
    if (pauseTimeout) {
        clearTimeout(pauseTimeout);
        pauseTimeout = null;
    }
    if (skillObserver) {
        skillObserver.disconnect();
        skillObserver = null;
    }
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Single scroll to top on page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
        window.scrollTo(0, 0);
    }
    
    // Initialize all components
    initCachedElements();
    initializeTheme();
    
    // Safari-specific post-load fix
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && localStorage.getItem('theme') === 'dark') {
        setTimeout(() => applySafariDarkMode(true), 100);
    }
    
    startTypingAnimation();
    initProjectFilters();
    initMobileMenu();
    initCookieConsent();
    showCookieConsent();
    
    // Single optimized scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Safari touch support
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Intersection Observer for reveal animations
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.project-card, .stat, .education-card').forEach(el => {
        el.classList.add('reveal-element');
        revealObserver.observe(el);
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Service Worker registration for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw-optimized.js')
            .then(registration => {
                console.log('SW registered');
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available, refresh page
                            window.location.reload();
                        }
                    });
                });
            })
            .catch(error => console.log('SW registration failed'));
    });
}

// Make trackResumeDownload globally available
window.trackResumeDownload = trackResumeDownload;