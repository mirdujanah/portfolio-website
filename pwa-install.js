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
        this.installButton.className = 'pwa-install-btn btn btn-outline';
        this.installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
        this.installButton.style.display = 'none';
        
        // Safari-compatible event listener
        const self = this;
        this.installButton.addEventListener('click', function() {
            self.installApp();
        });
        
        // Add to hero buttons with delay for Safari
        setTimeout(() => {
            const heroButtons = document.querySelector('.hero-buttons');
            if (heroButtons) {
                heroButtons.appendChild(this.installButton);
            }
        }, 100);
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

    installApp() {
        if (!this.deferredPrompt) {
            // Fallback for Safari - show instructions
            alert('To install this app on Safari:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm');
            return;
        }

        this.deferredPrompt.prompt();
        
        // Safari-compatible promise handling
        const self = this;
        this.deferredPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                self.trackInstall();
            }
            self.deferredPrompt = null;
            self.hideInstallButton();
        }).catch(function(error) {
            console.log('Install prompt error:', encodeURIComponent(error.message));
        });
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