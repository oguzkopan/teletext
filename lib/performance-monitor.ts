/**
 * Performance monitoring utilities
 * 
 * Tracks page load times, bundle sizes, and other performance metrics
 * to ensure compliance with performance requirements.
 */

interface PerformanceMetrics {
  pageLoadTime: number;
  pageId: string;
  fromCache: boolean;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100; // Keep last 100 metrics

  /**
   * Records a page load time
   * Requirement: 15.1, 15.2 - Track page load performance
   */
  recordPageLoad(pageId: string, loadTime: number, fromCache: boolean) {
    const metric: PerformanceMetrics = {
      pageId,
      pageLoadTime: loadTime,
      fromCache,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log warning if load time exceeds requirements
    const threshold = fromCache ? 100 : 500;
    if (loadTime > threshold) {
      console.warn(
        `Page ${pageId} load time (${loadTime}ms) exceeded ${threshold}ms threshold`
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Page ${pageId} loaded in ${loadTime}ms ${fromCache ? '(cached)' : '(network)'}`
      );
    }
  }

  /**
   * Gets average load time for all pages
   */
  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const total = this.metrics.reduce((sum, m) => sum + m.pageLoadTime, 0);
    return total / this.metrics.length;
  }

  /**
   * Gets average load time for cached vs non-cached pages
   */
  getLoadTimesByCache(): { cached: number; network: number } {
    const cached = this.metrics.filter(m => m.fromCache);
    const network = this.metrics.filter(m => !m.fromCache);

    return {
      cached: cached.length > 0 
        ? cached.reduce((sum, m) => sum + m.pageLoadTime, 0) / cached.length 
        : 0,
      network: network.length > 0
        ? network.reduce((sum, m) => sum + m.pageLoadTime, 0) / network.length
        : 0,
    };
  }

  /**
   * Gets performance summary
   */
  getSummary() {
    const loadTimes = this.getLoadTimesByCache();
    
    return {
      totalPageLoads: this.metrics.length,
      averageLoadTime: this.getAverageLoadTime(),
      cachedLoadTime: loadTimes.cached,
      networkLoadTime: loadTimes.network,
      cacheHitRate: this.metrics.length > 0
        ? (this.metrics.filter(m => m.fromCache).length / this.metrics.length) * 100
        : 0,
    };
  }

  /**
   * Logs performance summary to console
   */
  logSummary() {
    const summary = this.getSummary();
    console.log('Performance Summary:', {
      'Total Page Loads': summary.totalPageLoads,
      'Average Load Time': `${summary.averageLoadTime.toFixed(2)}ms`,
      'Cached Load Time': `${summary.cachedLoadTime.toFixed(2)}ms`,
      'Network Load Time': `${summary.networkLoadTime.toFixed(2)}ms`,
      'Cache Hit Rate': `${summary.cacheHitRate.toFixed(2)}%`,
    });
  }

  /**
   * Measures bundle size (client-side only)
   */
  measureBundleSize() {
    if (typeof window === 'undefined') return;

    // Use Performance API to get resource timing
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.name.endsWith('.js')) {
        jsSize += size;
      } else if (resource.name.endsWith('.css')) {
        cssSize += size;
      }
    });

    const summary = {
      totalSize: (totalSize / 1024).toFixed(2) + ' KB',
      jsSize: (jsSize / 1024).toFixed(2) + ' KB',
      cssSize: (cssSize / 1024).toFixed(2) + ' KB',
    };

    console.log('Bundle Size:', summary);

    // Warn if JS bundle exceeds 200KB
    if (jsSize > 200 * 1024) {
      console.warn(`JS bundle size (${summary.jsSize}) exceeds 200KB target`);
    }

    return summary;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Expose to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).performanceMonitor = performanceMonitor;
}
