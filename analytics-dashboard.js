// Precise Cross-Browser Analytics System
class AnalyticsDashboard {
    constructor() {
        this.storageKey = 'portfolioAnalytics_v2';
        this.sessionKey = 'portfolioSession_v2';
        this.data = this.getDefaultData();
        this.session = this.getSessionData();
        this.startTime = Date.now();
        this.init();
    }

    getDefaultData() {
        return {
            totalVisits: 0,
            uniqueVisitors: 0,
            resumeDownloads: 0,
            portfolioDownloads: 0,
            contactSubmissions: 0,
            projectViews: {
                'Sanitizable Access Control System': 0,
                'Handwritten Digits Classification': 0,
                'News Classification Using NLP': 0
            },
            avgTimeOnSite: 0,
            deviceTypes: { desktop: 0, mobile: 0, tablet: 0 },
            referrers: { direct: 0 },
            browsers: {},
            countries: {},
            dailyVisits: {},
            firstVisit: Date.now(),
            lastUpdated: Date.now()
        };
    }

    getSessionData() {
        return {
            isNewSession: true,
            sessionStart: Date.now(),
            pageViews: 0,
            hasTrackedVisit: false
        };
    }

    init() {
        this.loadStoredData();
        this.initializeSession();
        this.trackPageView();
        this.trackDeviceAndBrowser();
        this.trackReferrer();
        this.setupEventListeners();
        this.startTimeTracking();
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedData = JSON.parse(stored);
                this.data = { ...this.getDefaultData(), ...parsedData };
            }
        } catch (e) {
            console.log('Analytics: Using default data');
            this.data = this.getDefaultData();
        }
    }

    initializeSession() {
        const sessionData = sessionStorage.getItem(this.sessionKey);
        if (!sessionData) {
            this.session.isNewSession = true;
            this.session.hasTrackedVisit = false;
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.session));
        } else {
            this.session = { ...this.session, ...JSON.parse(sessionData) };
            this.session.isNewSession = false;
        }
    }

    saveData() {
        try {
            this.data.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.session));
        } catch (e) {
            console.log('Analytics: Save failed');
        }
    }

    trackPageView() {
        if (!this.session.hasTrackedVisit) {
            this.data.totalVisits++;
            this.session.hasTrackedVisit = true;
            
            // Track unique visitors (simplified)
            const visitorId = this.getVisitorId();
            const visitorsKey = 'portfolioVisitors';
            let visitors = [];
            try {
                visitors = JSON.parse(localStorage.getItem(visitorsKey) || '[]');
            } catch (e) {}
            
            if (!visitors.includes(visitorId)) {
                visitors.push(visitorId);
                this.data.uniqueVisitors = visitors.length;
                localStorage.setItem(visitorsKey, JSON.stringify(visitors));
            }
            
            // Track daily visits
            const today = new Date().toISOString().split('T')[0];
            this.data.dailyVisits[today] = (this.data.dailyVisits[today] || 0) + 1;
        }
        
        this.session.pageViews++;
        this.saveData();
    }

    getVisitorId() {
        let visitorId = localStorage.getItem('portfolioVisitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('portfolioVisitorId', visitorId);
        }
        return visitorId;
    }

    startTimeTracking() {
        // Track time on site with better accuracy
        const trackTime = () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            const totalSessions = this.data.totalVisits || 1;
            this.data.avgTimeOnSite = Math.round(((this.data.avgTimeOnSite * (totalSessions - 1)) + timeSpent) / totalSessions);
            this.saveData();
        };

        // Track on visibility change (tab switch)
        document.addEventListener('visibilitychange', trackTime);
        
        // Track on page unload
        window.addEventListener('beforeunload', trackTime);
        
        // Track periodically for long sessions
        setInterval(trackTime, 30000); // Every 30 seconds
    }

    trackDeviceAndBrowser() {
        if (!this.session.hasTrackedVisit) {
            const ua = navigator.userAgent || '';
            
            // Device detection
            let deviceType = 'desktop';
            if (/iPad/i.test(ua)) deviceType = 'tablet';
            else if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) deviceType = 'mobile';
            
            this.data.deviceTypes[deviceType]++;
            
            // Browser detection
            let browser = 'unknown';
            if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'chrome';
            else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari';
            else if (ua.includes('Firefox')) browser = 'firefox';
            else if (ua.includes('Edg')) browser = 'edge';
            
            this.data.browsers[browser] = (this.data.browsers[browser] || 0) + 1;
        }
    }

    trackReferrer() {
        if (!this.session.hasTrackedVisit) {
            let referrer = 'direct';
            
            if (document.referrer && document.referrer !== '') {
                try {
                    const url = new URL(document.referrer);
                    referrer = url.hostname;
                    
                    // Simplify common referrers
                    if (referrer.includes('google')) referrer = 'google';
                    else if (referrer.includes('linkedin')) referrer = 'linkedin';
                    else if (referrer.includes('github')) referrer = 'github';
                    else if (referrer.includes('facebook')) referrer = 'facebook';
                    else if (referrer.includes('twitter')) referrer = 'twitter';
                } catch (e) {
                    referrer = 'unknown';
                }
            }
            
            this.data.referrers[referrer] = (this.data.referrers[referrer] || 0) + 1;
        }
    }

    setupEventListeners() {
        // Track downloads with precise counting
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (target) {
                const href = target.getAttribute('href') || '';
                if (href.includes('Resume.pdf') || href.includes('resume')) {
                    this.trackResumeDownload();
                } else if (href.includes('Portfolio.zip') || href.includes('portfolio')) {
                    this.trackPortfolioDownload();
                }
            }
        });

        // Track project views with better detection
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card, .project');
            const trackedProjects = new Set();
            
            if ('IntersectionObserver' in window) {
                const projectObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                            const projectName = this.getProjectName(entry.target);
                            if (projectName && !trackedProjects.has(projectName)) {
                                trackedProjects.add(projectName);
                                this.trackProjectView(projectName);
                            }
                        }
                    });
                }, { threshold: 0.3 });

                projectCards.forEach(card => projectObserver.observe(card));
            } else {
                // Fallback: track all visible projects
                projectCards.forEach(card => {
                    const projectName = this.getProjectName(card);
                    if (projectName && !trackedProjects.has(projectName)) {
                        trackedProjects.add(projectName);
                        this.trackProjectView(projectName);
                    }
                });
            }
        }, 1000);

        // Track contact form submissions
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                this.trackContactSubmission();
            });
        }
    }

    getProjectName(element) {
        // Try multiple selectors to find project name
        const selectors = ['h3', 'h4', '.project-title', '[data-project]'];
        
        for (const selector of selectors) {
            const titleElement = element.querySelector(selector);
            if (titleElement) {
                const name = titleElement.textContent || titleElement.getAttribute('data-project');
                if (name && name.trim()) {
                    return name.trim();
                }
            }
        }
        
        // Fallback to known project names
        const text = element.textContent || '';
        if (text.includes('Sanitizable')) return 'Sanitizable Access Control System';
        if (text.includes('Handwritten') || text.includes('Digits')) return 'Handwritten Digits Classification';
        if (text.includes('News') || text.includes('NLP')) return 'News Classification Using NLP';
        
        return null;
    }

    trackResumeDownload() {
        this.data.resumeDownloads++;
        this.saveData();
        
        // Track in Google Analytics if available
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
        if (this.data.projectViews[projectName] !== undefined) {
            this.data.projectViews[projectName]++;
            this.saveData();
        }
    }

    trackContactSubmission() {
        this.data.contactSubmissions++;
        this.saveData();
    }

    generateReport() {
        const totalDownloads = this.data.resumeDownloads + this.data.portfolioDownloads;
        const conversionRate = this.data.totalVisits > 0 ? 
            ((this.data.contactSubmissions / this.data.totalVisits) * 100).toFixed(2) : '0.00';
        
        return {
            totalVisits: this.data.totalVisits,
            uniqueVisitors: this.data.uniqueVisitors,
            resumeDownloads: this.data.resumeDownloads,
            portfolioDownloads: this.data.portfolioDownloads,
            totalDownloads: totalDownloads,
            contactSubmissions: this.data.contactSubmissions,
            avgTimeOnSite: this.data.avgTimeOnSite,
            conversionRate: conversionRate,
            topProjects: Object.entries(this.data.projectViews)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3),
            deviceBreakdown: this.data.deviceTypes,
            browserBreakdown: this.data.browsers,
            topReferrers: Object.entries(this.data.referrers)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            dailyVisits: this.data.dailyVisits,
            dataQuality: {
                firstVisit: new Date(this.data.firstVisit).toLocaleDateString(),
                lastUpdated: new Date(this.data.lastUpdated).toLocaleDateString(),
                totalDataPoints: this.data.totalVisits + totalDownloads + this.data.contactSubmissions
            }
        };
    }

    exportData() {
        const report = this.generateReport();
        const exportData = {
            ...report,
            exportDate: new Date().toISOString(),
            rawData: this.data
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset analytics (for testing)
    resetAnalytics() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('portfolioVisitors');
        localStorage.removeItem('portfolioVisitorId');
        sessionStorage.removeItem(this.sessionKey);
        this.data = this.getDefaultData();
        this.session = this.getSessionData();
        this.saveData();
    }
}

// Initialize analytics dashboard with error handling
try {
    const analytics = new AnalyticsDashboard();
    window.portfolioAnalytics = analytics;
    
    // Debug info for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Portfolio Analytics initialized:', analytics.generateReport());
        window.resetAnalytics = () => analytics.resetAnalytics();
    }
} catch (error) {
    console.error('Analytics initialization failed:', error);
    // Fallback analytics object
    window.portfolioAnalytics = {
        generateReport: () => ({
            totalVisits: 0,
            uniqueVisitors: 0,
            resumeDownloads: 0,
            portfolioDownloads: 0,
            contactSubmissions: 0,
            avgTimeOnSite: 0,
            conversionRate: '0.00',
            topProjects: [],
            deviceBreakdown: {},
            topReferrers: []
        }),
        exportData: () => console.log('Analytics export not available')
    };
}