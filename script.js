// Apple-style scroll animations
let ticking = false;

function updateScrollAnimations() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const heroContent = document.querySelector('.hero-content');
    const profileImage = document.querySelector('.profile-image-simple');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${rate * 0.3}px)`;
    }
    if (profileImage) {
        profileImage.style.transform = `translateY(${rate * 0.2}px) scale(${1 + scrolled * 0.0002})`;
    }
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView) {
            const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
            section.style.opacity = progress;
            section.style.transform = `translateY(${(1 - progress) * 30}px)`;
        }
    });
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
}

// Cookie Management
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function showCookieConsent() {
    const consent = getCookie('cookieConsent');
    if (!consent) {
        document.getElementById('cookieConsent').classList.add('show');
    }
}

// Cross-browser smooth scroll to top on page reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Function for smooth scroll with fallback
function smoothScrollToTop() {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Fallback for older browsers
        const scrollStep = -window.scrollY / (500 / 15);
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }
}

// Multiple event listeners for cross-browser compatibility
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('pageshow', (event) => {
    setTimeout(smoothScrollToTop, 100);
});

window.addEventListener('load', () => {
    setTimeout(smoothScrollToTop, 200);
});

// Performance optimized JavaScript
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    setTimeout(smoothScrollToTop, 50);
    
    // Auto-click home menu item on page load
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
        // Remove active from other nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link !== homeLink) link.classList.remove('active');
        });
    }
    const links = document.querySelectorAll('a[href^="#"]');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu after clicking
                if (navMenu && hamburger) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    updateScrollAnimations();
    
    const revealObserver = new IntersectionObserver((entries) => {
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
    
    // Cookie consent handling
    showCookieConsent();
    
    document.getElementById('acceptCookies').addEventListener('click', () => {
        setCookie('cookieConsent', 'accepted', 365);
        const banner = document.getElementById('cookieConsent');
        banner.style.display = 'none';
    });
    
    document.getElementById('declineCookies').addEventListener('click', () => {
        setCookie('cookieConsent', 'declined', 365);
        const banner = document.getElementById('cookieConsent');
        banner.style.display = 'none';
        // Disable Google Analytics if declined
        window['ga-disable-G-9J7MJXMGGW'] = true;
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(30px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
}, { passive: true });

// Service Worker registration for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}