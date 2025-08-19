// PWA Installation Handler
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }

    init() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            this.trackInstall();
        });

        this.createInstallButton();
    }

    createInstallButton() {
        this.installButton = document.createElement('button');
        this.installButton.className = 'pwa-install-btn';
        this.installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
        this.installButton.style.display = 'none';
        this.installButton.addEventListener('click', () => this.installApp());
        
        // Add to hero buttons
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.appendChild(this.installButton);
        }
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'inline-flex';
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
    }

    async installApp() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            this.trackInstall();
        }
        
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    trackInstall() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                'event_category': 'engagement',
                'event_label': 'app_installed'
            });
        }
        
        localStorage.setItem('pwaInstalled', 'true');
    }
}

// Initialize PWA installer
document.addEventListener('DOMContentLoaded', () => {
    new PWAInstaller();
});