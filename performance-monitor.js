// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });

        // Monitor Core Web Vitals
        this.measureCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResources();
    }

    measurePageLoad() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart,
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnect: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart
            };

            console.log('Page Load Metrics:', this.metrics.pageLoad);
        }
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                console.log('LCP:', this.metrics.lcp);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID:', this.metrics.fid);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                console.log('CLS:', this.metrics.cls);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResources() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) { // Resources taking more than 1 second
                        console.warn('Slow resource:', entry.name, 'Duration:', entry.duration);
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    getMetrics() {
        return this.metrics;
    }

    // Send metrics to analytics (if needed)
    sendMetrics() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', {
                'custom_map': {
                    'metric1': 'lcp',
                    'metric2': 'fid',
                    'metric3': 'cls'
                }
            });
        }
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    const monitor = new PerformanceMonitor();
    
    // Send metrics after 5 seconds
    setTimeout(() => {
        monitor.sendMetrics();
    }, 5000);
});