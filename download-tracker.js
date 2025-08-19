// Download Statistics Tracker
class DownloadTracker {
    constructor() {
        this.downloads = {
            resume: {
                total: 0,
                daily: {},
                monthly: {},
                sources: {},
                userAgents: {}
            },
            portfolio: {
                total: 0,
                daily: {},
                monthly: {},
                sources: {},
                userAgents: {}
            }
        };
        this.init();
    }

    init() {
        this.loadStoredData();
        this.setupDownloadTracking();
    }

    loadStoredData() {
        const stored = localStorage.getItem('downloadStats');
        if (stored) {
            this.downloads = { ...this.downloads, ...JSON.parse(stored) };
        }
    }

    saveData() {
        localStorage.setItem('downloadStats', JSON.stringify(this.downloads));
    }

    setupDownloadTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && href.includes('Resume.pdf')) {
                this.trackDownload('resume', link);
            } else if (href && href.includes('Portfolio.zip')) {
                this.trackDownload('portfolio', link);
            }
        });
    }

    trackDownload(type, element) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const month = now.toISOString().slice(0, 7);
        const source = this.getDownloadSource(element);
        const userAgent = this.getUserAgentInfo();

        // Update totals
        this.downloads[type].total++;

        // Update daily stats
        this.downloads[type].daily[today] = (this.downloads[type].daily[today] || 0) + 1;

        // Update monthly stats
        this.downloads[type].monthly[month] = (this.downloads[type].monthly[month] || 0) + 1;

        // Update source tracking
        this.downloads[type].sources[source] = (this.downloads[type].sources[source] || 0) + 1;

        // Update user agent tracking
        this.downloads[type].userAgents[userAgent] = (this.downloads[type].userAgents[userAgent] || 0) + 1;

        this.saveData();
        this.sendAnalytics(type, source);
    }

    getDownloadSource(element) {
        // Determine where the download was initiated from
        let current = element;
        while (current && current !== document) {
            if (current.tagName === 'SECTION' && current.id) {
                return current.id;
            }
            current = current.parentElement;
        }
        return 'direct-link';
    }

    getUserAgentInfo() {
        const ua = navigator.userAgent || '';
        if (ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1) return 'Chrome';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        return 'Other';
    }

    sendAnalytics(type, source) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                'file_name': type === 'resume' ? 'Mir_Dujanah_Resume.pdf' : 'Mir_Dujanah_Portfolio.zip',
                'file_extension': type === 'resume' ? 'pdf' : 'zip',
                'download_source': source,
                'event_category': 'Downloads',
                'event_label': type
            });
        }
    }

    getStats() {
        return {
            resume: {
                ...this.downloads.resume,
                todayDownloads: this.getTodayDownloads('resume'),
                thisMonthDownloads: this.getThisMonthDownloads('resume'),
                topSource: this.getTopSource('resume'),
                topBrowser: this.getTopBrowser('resume')
            },
            portfolio: {
                ...this.downloads.portfolio,
                todayDownloads: this.getTodayDownloads('portfolio'),
                thisMonthDownloads: this.getThisMonthDownloads('portfolio'),
                topSource: this.getTopSource('portfolio'),
                topBrowser: this.getTopBrowser('portfolio')
            }
        };
    }

    getTodayDownloads(type) {
        const today = new Date().toISOString().split('T')[0];
        return this.downloads[type].daily[today] || 0;
    }

    getThisMonthDownloads(type) {
        const month = new Date().toISOString().slice(0, 7);
        return this.downloads[type].monthly[month] || 0;
    }

    getTopSource(type) {
        const sources = this.downloads[type].sources;
        const entries = Object.entries(sources);
        if (entries.length === 0) return 'None';
        
        return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    getTopBrowser(type) {
        const browsers = this.downloads[type].userAgents;
        const entries = Object.entries(browsers);
        if (entries.length === 0) return 'None';
        
        return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    exportStats() {
        const stats = this.getStats();
        const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `download-stats-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const stats = this.getStats();
        return {
            summary: {
                totalResumeDownloads: stats.resume.total,
                totalPortfolioDownloads: stats.portfolio.total,
                todayTotal: stats.resume.todayDownloads + stats.portfolio.todayDownloads,
                monthTotal: stats.resume.thisMonthDownloads + stats.portfolio.thisMonthDownloads
            },
            resume: {
                total: stats.resume.total,
                today: stats.resume.todayDownloads,
                thisMonth: stats.resume.thisMonthDownloads,
                topSource: stats.resume.topSource,
                topBrowser: stats.resume.topBrowser,
                dailyTrend: this.getDailyTrend('resume'),
                monthlyTrend: this.getMonthlyTrend('resume')
            },
            portfolio: {
                total: stats.portfolio.total,
                today: stats.portfolio.todayDownloads,
                thisMonth: stats.portfolio.thisMonthDownloads,
                topSource: stats.portfolio.topSource,
                topBrowser: stats.portfolio.topBrowser,
                dailyTrend: this.getDailyTrend('portfolio'),
                monthlyTrend: this.getMonthlyTrend('portfolio')
            }
        };
    }

    getDailyTrend(type) {
        const daily = this.downloads[type].daily;
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push({
                date: dateStr,
                downloads: daily[dateStr] || 0
            });
        }
        
        return last7Days;
    }

    getMonthlyTrend(type) {
        const monthly = this.downloads[type].monthly;
        const last6Months = [];
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toISOString().slice(0, 7);
            last6Months.push({
                month: monthStr,
                downloads: monthly[monthStr] || 0
            });
        }
        
        return last6Months;
    }
}

// Initialize download tracker
const downloadTracker = new DownloadTracker();

// Make globally available
window.downloadTracker = downloadTracker;