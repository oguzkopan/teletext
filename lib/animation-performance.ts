/**
 * Animation Performance Optimization Utilities
 * 
 * Provides utilities for optimizing CSS animations for GPU acceleration,
 * managing will-change properties, throttling complex animations, and
 * degrading animations when frame rate drops below 30fps.
 * 
 * Requirements: 12.3 - Use CSS animations for background effects to maintain performance
 */

import { performanceMonitor } from './performance-monitor';

// ============================================================================
// Type Definitions
// ============================================================================

export type AnimationComplexity = 'simple' | 'moderate' | 'complex';

export interface AnimationPerformanceConfig {
  useWillChange: boolean;
  complexity: AnimationComplexity;
  throttleFrames?: number; // Throttle to every N frames
  degradeOnLowFPS: boolean;
}

// ============================================================================
// Animation Performance Manager
// ============================================================================

class AnimationPerformanceManager {
  private willChangeElements: Set<HTMLElement> = new Set();
  private degradedMode = false;
  private monitoringStarted = false;

  /**
   * Initialize performance monitoring
   * Requirement: 12.3 - Monitor frame rate and degrade animations if below 30fps
   */
  initialize() {
    if (this.monitoringStarted) return;
    if (typeof window === 'undefined') return;

    this.monitoringStarted = true;

    // Start frame rate monitoring with degradation callback
    performanceMonitor.startFrameRateMonitoring(() => {
      this.degradeAnimations();
    });

    // Check frame rate periodically
    setInterval(() => {
      const fps = performanceMonitor.getRecentFPS();
      
      if (fps < 30 && !this.degradedMode) {
        this.degradeAnimations();
      } else if (fps >= 45 && this.degradedMode) {
        // Restore animations if FPS improves significantly
        this.restoreAnimations();
      }
    }, 2000); // Check every 2 seconds
  }

  /**
   * Degrade animations when frame rate drops below 30fps
   */
  private degradeAnimations() {
    if (this.degradedMode) return;
    
    console.warn('Degrading animations due to low frame rate');
    this.degradedMode = true;

    if (typeof document === 'undefined') return;

    // Add degraded mode class to body
    document.body.classList.add('animations-degraded');

    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('animationsDegraded'));
  }

  /**
   * Restore animations when frame rate improves
   */
  private restoreAnimations() {
    if (!this.degradedMode) return;
    
    console.log('Restoring animations - frame rate improved');
    this.degradedMode = false;

    if (typeof document === 'undefined') return;

    // Remove degraded mode class
    document.body.classList.remove('animations-degraded');

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('animationsRestored'));
  }

  /**
   * Check if animations are currently degraded
   */
  isDegraded(): boolean {
    return this.degradedMode;
  }

  /**
   * Add will-change property to element for critical animations
   * Requirement: 12.3 - Add will-change property for critical animations
   * 
   * Note: will-change should be used sparingly and removed after animation completes
   */
  addWillChange(element: HTMLElement, properties: string[]) {
    if (typeof window === 'undefined') return;

    element.style.willChange = properties.join(', ');
    this.willChangeElements.add(element);

    // Log warning if too many elements have will-change
    if (this.willChangeElements.size > 10) {
      console.warn(
        `High number of elements with will-change (${this.willChangeElements.size}). ` +
        'This may impact performance. Consider removing will-change after animations complete.'
      );
    }
  }

  /**
   * Remove will-change property from element
   */
  removeWillChange(element: HTMLElement) {
    if (typeof window === 'undefined') return;

    element.style.willChange = 'auto';
    this.willChangeElements.delete(element);
  }

  /**
   * Remove will-change from all tracked elements
   */
  clearAllWillChange() {
    this.willChangeElements.forEach(element => {
      element.style.willChange = 'auto';
    });
    this.willChangeElements.clear();
  }

  /**
   * Optimize element for GPU-accelerated animations
   * Requirement: 12.3 - Use transform and opacity for all animations (GPU-accelerated)
   */
  optimizeForGPU(element: HTMLElement) {
    if (typeof window === 'undefined') return;

    // Force GPU acceleration by adding translateZ(0)
    // This creates a new composite layer
    element.style.transform = element.style.transform 
      ? `${element.style.transform} translateZ(0)`
      : 'translateZ(0)';
  }

  /**
   * Create a throttled animation frame callback
   * Requirement: 12.3 - Implement animation frame throttling for complex effects
   */
  createThrottledAnimation(
    callback: (timestamp: number) => void,
    throttleFrames: number = 2
  ): () => void {
    let frameCount = 0;
    let animationId: number | null = null;
    let isRunning = false;

    const throttledCallback = (timestamp: number) => {
      if (!isRunning) return;

      frameCount++;

      // Only execute callback every N frames
      if (frameCount >= throttleFrames) {
        callback(timestamp);
        frameCount = 0;
      }

      animationId = requestAnimationFrame(throttledCallback);
    };

    // Return start function
    return () => {
      if (isRunning) return;
      
      isRunning = true;
      frameCount = 0;
      animationId = requestAnimationFrame(throttledCallback);

      // Return stop function
      return () => {
        isRunning = false;
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      };
    };
  }

  /**
   * Apply performance optimizations to an animated element
   */
  optimizeAnimatedElement(
    element: HTMLElement,
    config: AnimationPerformanceConfig
  ) {
    if (typeof window === 'undefined') return;

    // Add will-change for critical animations
    if (config.useWillChange) {
      // Determine properties based on complexity
      const properties = ['transform', 'opacity'];
      this.addWillChange(element, properties);

      // Remove will-change after animation completes
      const removeWillChange = () => {
        this.removeWillChange(element);
        element.removeEventListener('animationend', removeWillChange);
        element.removeEventListener('transitionend', removeWillChange);
      };

      element.addEventListener('animationend', removeWillChange);
      element.addEventListener('transitionend', removeWillChange);
    }

    // Optimize for GPU
    this.optimizeForGPU(element);

    // Add complexity class for CSS-based degradation
    element.classList.add(`animation-complexity-${config.complexity}`);
  }

  /**
   * Validate that animation uses GPU-accelerated properties
   * Requirement: 12.3 - Avoid animating width, height, top, left (causes reflow)
   */
  validateAnimationProperties(animationName: string): boolean {
    if (typeof window === 'undefined') return true;

    // Get computed styles for the animation
    const styleSheets = Array.from(document.styleSheets);
    
    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        
        for (const rule of rules) {
          if (rule instanceof CSSKeyframesRule && rule.name === animationName) {
            const keyframes = Array.from(rule.cssRules);
            
            for (const keyframe of keyframes) {
              if (keyframe instanceof CSSKeyframeRule) {
                const style = keyframe.style;
                
                // Check for non-GPU-accelerated properties
                const badProperties = ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'];
                
                for (const prop of badProperties) {
                  if (style.getPropertyValue(prop)) {
                    console.warn(
                      `Animation "${animationName}" uses non-GPU-accelerated property "${prop}". ` +
                      'Consider using transform and opacity instead for better performance.'
                    );
                    return false;
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Skip stylesheets we can't access (CORS)
        continue;
      }
    }

    return true;
  }

  /**
   * Get performance recommendations for current state
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const frameRateSummary = performanceMonitor.getFrameRateSummary();

    if (frameRateSummary.averageFPS < 30) {
      recommendations.push('Frame rate is below 30 FPS. Consider reducing animation complexity.');
    }

    if (this.willChangeElements.size > 10) {
      recommendations.push(
        `${this.willChangeElements.size} elements have will-change property. ` +
        'Remove will-change after animations complete to improve performance.'
      );
    }

    if (this.degradedMode) {
      recommendations.push('Animations are currently degraded due to low frame rate.');
    }

    return recommendations;
  }

  /**
   * Cleanup - stop monitoring and clear will-change
   */
  cleanup() {
    performanceMonitor.stopFrameRateMonitoring();
    this.clearAllWillChange();
    this.monitoringStarted = false;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const animationPerformanceManager = new AnimationPerformanceManager();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if an element's animation uses GPU-accelerated properties
 */
export function isGPUAccelerated(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return true;

  const computedStyle = window.getComputedStyle(element);
  const transform = computedStyle.transform;
  
  // Check if element has transform applied (indicates GPU acceleration)
  return transform !== 'none';
}

/**
 * Get recommended animation complexity based on current performance
 */
export function getRecommendedComplexity(): AnimationComplexity {
  const fps = performanceMonitor.getRecentFPS();
  
  if (fps >= 50) return 'complex';
  if (fps >= 35) return 'moderate';
  return 'simple';
}

/**
 * Apply performance-optimized animation to element
 */
export function applyOptimizedAnimation(
  element: HTMLElement,
  animationClass: string,
  config?: Partial<AnimationPerformanceConfig>
) {
  const defaultConfig: AnimationPerformanceConfig = {
    useWillChange: true,
    complexity: 'moderate',
    degradeOnLowFPS: true,
    ...config
  };

  // Optimize element
  animationPerformanceManager.optimizeAnimatedElement(element, defaultConfig);

  // Apply animation class
  element.classList.add(animationClass);

  // Return cleanup function
  return () => {
    element.classList.remove(animationClass);
    animationPerformanceManager.removeWillChange(element);
  };
}

/**
 * Create a performance-aware animation loop
 */
export function createPerformanceAwareLoop(
  callback: (timestamp: number, fps: number) => void
): () => void {
  let animationId: number | null = null;
  let isRunning = false;
  let lastTime = 0;

  const loop = (timestamp: number) => {
    if (!isRunning) return;

    const fps = performanceMonitor.getRecentFPS();
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Skip frame if FPS is too low and we're in degraded mode
    if (animationPerformanceManager.isDegraded() && deltaTime < 33) {
      animationId = requestAnimationFrame(loop);
      return;
    }

    callback(timestamp, fps);
    animationId = requestAnimationFrame(loop);
  };

  // Return start function
  return () => {
    if (isRunning) return;
    
    isRunning = true;
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);

    // Return stop function
    return () => {
      isRunning = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };
  };
}

// ============================================================================
// Auto-initialize on client side
// ============================================================================

if (typeof window !== 'undefined') {
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      animationPerformanceManager.initialize();
    });
  } else {
    animationPerformanceManager.initialize();
  }

  // Expose to window for debugging
  if (process.env.NODE_ENV === 'development') {
    (window as any).animationPerformanceManager = animationPerformanceManager;
  }
}
