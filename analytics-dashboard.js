// Enhanced Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.data = {
            visits: 0,
            resumeDownloads: 0,
            portfolioDownloads: 0,
            contactSubmissions: 0,
            projectViews: {},
            timeOnSite: 0,
            bounceRate: 0,
            deviceTypes: {},
            referrers: {},
            popularPages: {}
        };
        this.startTime = Date.now();
        this.init();
    }

    init() {
        this.loadStoredData();
        this.trackPageView();
        this.trackTimeOnSite();
        this.trackDeviceType();
        this.trackReferrer();
        this.setupEventListeners();
    }

    loadStoredData() {
        const stored = localStorage.getItem('analyticsData');
        if (stored) {
            this.data = { ...this.data, ...JSON.parse(stored) };
        }
    }

    saveData() {
        localStorage.setItem('analyticsData', JSON.stringify(this.data));
    }

    trackPageView() {
        this.data.visits++;
        const page = window.location.pathname || '/';
        this.data.popularPages[page] = (this.data.popularPages[page] || 0) + 1;
        this.saveData();
    }

    trackTimeOnSite() {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            this.data.timeOnSite = Math.round((this.data.timeOnSite + timeSpent) / 2);
            this.saveData();
        });
    }

    trackDeviceType() {
        const ua = navigator.userAgent || '';
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
        
        let deviceType = 'desktop';
        if (isMobile && !isTablet) deviceType = 'mobile';
        else if (isTablet) deviceType = 'tablet';
        
        this.data.deviceTypes[deviceType] = (this.data.deviceTypes[deviceType] || 0) + 1;
        this.saveData();
    }

    trackReferrer() {
        const referrer = document.referrer || 'direct';
        let domain = 'direct';
        
        if (referrer && referrer !== '') {
            try {
                domain = new URL(referrer).hostname;
            } catch (e) {
                domain = 'unknown';
            }
        }
        
        this.data.referrers[domain] = (this.data.referrers[domain] || 0) + 1;
        this.saveData();
    }

    setupEventListeners() {
        // Track resume downloads
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href*="Resume.pdf"]')) {
                this.trackResumeDownload();
            }
            if (e.target.closest('a[href*="Portfolio.zip"]')) {
                this.trackPortfolioDownload();
            }
        });

        // Track project views with Safari compatibility
        const projectCards = document.querySelectorAll('.project-card');
        
        if ('IntersectionObserver' in window) {
            const projectObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const h3Element = entry.target.querySelector('h3');
                        const projectName = h3Element ? h3Element.textContent : 'Unknown';
                        this.trackProjectView(projectName);
                    }
                });
            }, { threshold: 0.5 });

            projectCards.forEach(card => projectObserver.observe(card));
        } else {
            // Fallback for older Safari versions
            projectCards.forEach(card => {
                const h3Element = card.querySelector('h3');
                const projectName = h3Element ? h3Element.textContent : 'Unknown';
                this.trackProjectView(projectName);
            });
        }

        // Track contact form submissions
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                this.trackContactSubmission();
            });
        }
    }

    trackResumeDownload() {
        this.data.resumeDownloads++;
        this.saveData();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                'file_name': 'Mir_Dujanah_Resume.pdf',
                'file_extension': 'pdf'
            });
        }
    }

    trackPortfolioDownload() {
        this.data.portfolioDownloads++;
        this.saveData();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                'file_name': 'Mir_Dujanah_Portfolio.zip',
                'file_extension': 'zip'
            });
        }
    }

    trackProjectView(projectName) {
        this.data.projectViews[projectName] = (this.data.projectViews[projectName] || 0) + 1;
        this.saveData();
    }

    trackContactSubmission() {
        this.data.contactSubmissions++;
        this.saveData();
    }

    generateReport() {
        return {
            totalVisits: this.data.visits,
            resumeDownloads: this.data.resumeDownloads,
            portfolioDownloads: this.data.portfolioDownloads,
            contactSubmissions: this.data.contactSubmissions,
            avgTimeOnSite: this.data.timeOnSite,
            topProjects: Object.entries(this.data.projectViews)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3),
            deviceBreakdown: this.data.deviceTypes,
            topReferrers: Object.entries(this.data.referrers)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            conversionRate: this.data.visits > 0 ? 
                ((this.data.contactSubmissions / this.data.visits) * 100).toFixed(2) : 0
        };
    }

    exportData() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics dashboard
const analytics = new AnalyticsDashboard();

// Make analytics globally available
window.portfolioAnalytics = analytics;