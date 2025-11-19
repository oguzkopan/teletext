'use client';

import { useEffect, useState } from 'react';
import { performanceMonitor } from '@/lib/performance-monitor';

/**
 * Performance Debug Component
 * 
 * Displays performance metrics in development mode
 * Can be toggled with Ctrl+Shift+P
 */
export default function PerformanceDebug() {
  const [visible, setVisible] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setVisible(prev => !prev);
        if (!visible) {
          setSummary(performanceMonitor.getSummary());
          performanceMonitor.measureBundleSize();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [visible]);

  if (!visible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#00ff00',
        padding: '15px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#ffff00' }}>
        Performance Metrics
      </h3>
      {summary && (
        <div>
          <div>Total Loads: {summary.totalPageLoads}</div>
          <div>Avg Load Time: {summary.averageLoadTime.toFixed(2)}ms</div>
          <div>Cached: {summary.cachedLoadTime.toFixed(2)}ms</div>
          <div>Network: {summary.networkLoadTime.toFixed(2)}ms</div>
          <div>Cache Hit Rate: {summary.cacheHitRate.toFixed(2)}%</div>
        </div>
      )}
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        Press Ctrl+Shift+P to close
      </div>
    </div>
  );
}
