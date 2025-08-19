// Lazy loading implementation for images
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create a new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        imageLoader.onerror = () => {
            img.classList.add('error');
        };

        imageLoader.src = src;
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});

// CSS for lazy loading effects
const lazyLoadingCSS = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    img.loaded {
        opacity: 1;
        background: none;
        animation: none;
    }

    img.error {
        opacity: 0.5;
        background: #f5f5f5;
        animation: none;
    }

    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = lazyLoadingCSS;
document.head.appendChild(style);