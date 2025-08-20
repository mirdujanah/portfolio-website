// Enhanced animations and page transitions
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.addPageTransitions();
        this.addScrollAnimations();
        this.addHoverEffects();
        this.addLoadingAnimations();
    }

    addPageTransitions() {
        // Page enter animation
        document.body.classList.add('page-transition');
        
        // Stagger animation for project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Button ripple effect
        const buttons = document.querySelectorAll('.animate-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    addScrollAnimations() {
        // Intersection Observer for reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for reveal animation
        const elementsToReveal = document.querySelectorAll('.project-card, .education-card, .stat, .skill-category');
        elementsToReveal.forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    }

    addHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.project-card, .education-card, .stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Icon hover animations
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                link.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                });
                
                link.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                });
            }
        });
    }

    addLoadingAnimations() {
        // Skill bar animations
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);