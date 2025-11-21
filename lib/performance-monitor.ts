/**
 * Performance monitoring utilities
 * 
 * Tracks page load times, bundle sizes, and other performance metrics
 * to ensure compliance with performance requirements.
 * 
 * Requirements: 12.3 - Monitor frame rate and degrade animations if below 30fps
 */

interface PerformanceMetrics {
  pageLoadTime: number;
  pageId: string;
  fromCache: boolean;
  timestamp: number;
}

interface FrameRateMetrics {
  fps: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100; // Keep last 100 metrics
  private frameRateMetrics: FrameRateMetrics[] = [];
  private maxFrameRateMetrics = 60; // Keep last 60 frame rate samples
  private frameRateMonitoringActive = false;
  private lastFrameTime = 0;
  private frameCount = 0;
  private animationFrameId: number | null = null;
  private lowFrameRateCallback: (() => void) | null = null;

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

  /**
   * Start monitoring frame rate
   * Requirement: 12.3 - Monitor frame rate and degrade animations if below 30fps
   */
  startFrameRateMonitoring(onLowFrameRate?: () => void) {
    if (typeof window === 'undefined') return;
    if (this.frameRateMonitoringActive) return;

    this.frameRateMonitoringActive = true;
    this.lowFrameRateCallback = onLowFrameRate || null;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;

    const measureFrame = (currentTime: number) => {
      if (!this.frameRateMonitoringActive) return;

      this.frameCount++;
      const elapsed = currentTime - this.lastFrameTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / elapsed);
        
        this.frameRateMetrics.push({
          fps,
          timestamp: Date.now()
        });

        // Keep only recent metrics
        if (this.frameRateMetrics.length > this.maxFrameRateMetrics) {
          this.frameRateMetrics.shift();
        }

        // Check if FPS is below 30 and trigger callback
        if (fps < 30 && this.lowFrameRateCallback) {
          console.warn(`Low frame rate detected: ${fps} FPS`);
          this.lowFrameRateCallback();
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Current FPS: ${fps}`);
        }

        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(measureFrame);
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  /**
   * Stop monitoring frame rate
   */
  stopFrameRateMonitoring() {
    this.frameRateMonitoringActive = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current average FPS
   */
  getAverageFPS(): number {
    if (this.frameRateMetrics.length === 0) return 60; // Assume 60 if no data
    
    const total = this.frameRateMetrics.reduce((sum, m) => sum + m.fps, 0);
    return Math.round(total / this.frameRateMetrics.length);
  }

  /**
   * Get recent FPS (last 10 samples)
   */
  getRecentFPS(): number {
    if (this.frameRateMetrics.length === 0) return 60;
    
    const recent = this.frameRateMetrics.slice(-10);
    const total = recent.reduce((sum, m) => sum + m.fps, 0);
    return Math.round(total / recent.length);
  }

  /**
   * Check if frame rate is acceptable (>= 30 FPS)
   */
  isFrameRateAcceptable(): boolean {
    return this.getRecentFPS() >= 30;
  }

  /**
   * Get frame rate summary
   */
  getFrameRateSummary() {
    if (this.frameRateMetrics.length === 0) {
      return {
        averageFPS: 60,
        recentFPS: 60,
        minFPS: 60,
        maxFPS: 60,
        samples: 0
      };
    }

    const fps = this.frameRateMetrics.map(m => m.fps);
    
    return {
      averageFPS: this.getAverageFPS(),
      recentFPS: this.getRecentFPS(),
      minFPS: Math.min(...fps),
      maxFPS: Math.max(...fps),
      samples: this.frameRateMetrics.length
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Expose to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).performanceMonitor = performanceMonitor;
}
