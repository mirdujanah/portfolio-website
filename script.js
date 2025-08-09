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
    
    // Auto-click home button on page reload
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        setTimeout(() => {
            homeLink.click();
        }, 100);
    }
    
    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    // Resume download tracking
    window.trackResumeDownload = function() {
        gtag('event', 'download', {
            'event_category': 'Resume',
            'event_label': 'Mir_Dujanah_Resume.pdf'
        });
        
        let downloads = localStorage.getItem('resumeDownloads') || 0;
        downloads++;
        localStorage.setItem('resumeDownloads', downloads);
        console.log('Resume downloaded:', downloads, 'times');
    };
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
        
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Safari-compatible typing animation
    const texts = ['Software Development Engineer', 'Cybersecurity Enthusiast', 'AI/ML Developer', 'Problem Solver'];
    let textIndex = 0;
    let charIndex = 0;
    const typingElement = document.getElementById('typingText');
    
    function typeText() {
        if (typingElement && charIndex < texts[textIndex].length) {
            typingElement.innerHTML = texts[textIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            setTimeout(eraseText, 2000);
        }
    }
    
    function eraseText() {
        if (typingElement && charIndex > 0) {
            typingElement.innerHTML = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseText, 50);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            charIndex = 0;
            setTimeout(typeText, 500);
        }
    }
    
    if (typingElement) {
        typingElement.innerHTML = '';
        setTimeout(function() {
            typeText();
        }, 1000);
    }
    
    // Safari-compatible project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    for (let i = 0; i < filterBtns.length; i++) {
        const btn = filterBtns[i];
        btn.addEventListener('click', function() {
            const filter = btn.getAttribute('data-filter');
            
            for (let j = 0; j < filterBtns.length; j++) {
                filterBtns[j].classList.remove('active');
            }
            btn.classList.add('active');
            
            for (let k = 0; k < projectCards.length; k++) {
                const card = projectCards[k];
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.webkitAnimation = 'fadeIn 0.5s ease';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        // Safari touch support
        btn.addEventListener('touchstart', function() {
            // Empty function for touch support
        });
    }
    
    // Simple skill bar animation on scroll
    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        const progressBars = document.querySelectorAll('.skill-progress');
        
        if (skillsSection && progressBars.length > 0) {
            const rect = skillsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                for (let i = 0; i < progressBars.length; i++) {
                    const bar = progressBars[i];
                    const width = bar.getAttribute('data-width');
                    if (width && bar.style.width === '0%') {
                        setTimeout(function() {
                            bar.style.width = width + '%';
                        }, i * 100);
                    }
                }
            }
        }
    }
    
    // Trigger animation on scroll and page load
    window.addEventListener('scroll', animateSkillBars, { passive: true });
    setTimeout(animateSkillBars, 1000);
    

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
    
    // Enhanced mobile navigation
    if (hamburger && navMenu) {
        const overlay = document.getElementById('mobileOverlay');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
        
        // Close menu when clicking nav links
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
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