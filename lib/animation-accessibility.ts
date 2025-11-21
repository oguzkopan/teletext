/**
 * Animation Accessibility Module
 * 
 * Provides utilities for managing animation accessibility, including:
 * - Detection of prefers-reduced-motion media query
 * - User settings for disabling animations
 * - Static alternatives for animated content
 * - Ensuring all functionality works without animations
 * 
 * Requirements: 10.5, 12.5
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface AnimationAccessibilitySettings {
  enabled: boolean;  // Master switch for all animations
  respectSystemPreference: boolean;  // Respect prefers-reduced-motion
  intensity: number;  // 0-100, animation intensity level
  transitionsEnabled: boolean;  // Page transitions
  decorationsEnabled: boolean;  // Decorative elements
  backgroundEffectsEnabled: boolean;  // Background effects
}

export interface AnimationAccessibilityState {
  shouldAnimate: boolean;  // Final decision on whether to animate
  systemPrefersReduced: boolean;  // System preference
  userSettings: AnimationAccessibilitySettings;
}

// ============================================================================
// Animation Accessibility Manager
// ============================================================================

class AnimationAccessibilityManager {
  private settings: AnimationAccessibilitySettings;
  private systemPrefersReduced: boolean = false;
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(state: AnimationAccessibilityState) => void> = new Set();

  constructor() {
    // Default settings - animations enabled by default
    // Requirement: 12.5 - Allow users to adjust animation intensity in settings
    this.settings = {
      enabled: true,
      respectSystemPreference: true,
      intensity: 100,
      transitionsEnabled: true,
      decorationsEnabled: true,
      backgroundEffectsEnabled: true
    };

    // Initialize system preference detection
    this.initializeSystemPreference();
  }

  // ============================================================================
  // System Preference Detection
  // ============================================================================

  /**
   * Initialize detection of prefers-reduced-motion media query
   * Requirement: 10.5 - Respect prefers-reduced-motion media query
   */
  private initializeSystemPreference(): void {
    if (typeof window === 'undefined') return;

    try {
      // Create media query for prefers-reduced-motion
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Get initial value
      this.systemPrefersReduced = this.mediaQuery.matches;

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        this.systemPrefersReduced = e.matches;
        console.log(`System prefers-reduced-motion changed: ${e.matches}`);
        this.notifyListeners();
      };

      // Use addEventListener if available, otherwise use deprecated addListener
      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        this.mediaQuery.addListener(handleChange);
      }

      console.log(`Animation accessibility initialized. System prefers reduced motion: ${this.systemPrefersReduced}`);
    } catch (error) {
      console.error('Error initializing prefers-reduced-motion detection:', error);
      this.systemPrefersReduced = false;
    }
  }

  /**
   * Check if system prefers reduced motion
   */
  getSystemPreference(): boolean {
    return this.systemPrefersReduced;
  }

  // ============================================================================
  // Settings Management
  // ============================================================================

  /**
   * Get current animation accessibility settings
   */
  getSettings(): AnimationAccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Update animation accessibility settings
   * Requirement: 12.5 - Add user setting to disable all animations
   */
  updateSettings(updates: Partial<AnimationAccessibilitySettings>): void {
    this.settings = {
      ...this.settings,
      ...updates
    };

    // Ensure intensity is within valid range
    if (this.settings.intensity < 0) this.settings.intensity = 0;
    if (this.settings.intensity > 100) this.settings.intensity = 100;

    console.log('Animation accessibility settings updated:', this.settings);
    this.notifyListeners();
  }

  /**
   * Enable all animations
   */
  enableAnimations(): void {
    this.updateSettings({ enabled: true });
  }

  /**
   * Disable all animations
   * Requirement: 10.5, 12.5 - Provide setting to disable all animations
   */
  disableAnimations(): void {
    this.updateSettings({ enabled: false });
  }

  /**
   * Set animation intensity (0-100)
   */
  setIntensity(intensity: number): void {
    this.updateSettings({ intensity: Math.max(0, Math.min(100, intensity)) });
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): void {
    this.settings = {
      enabled: true,
      respectSystemPreference: true,
      intensity: 100,
      transitionsEnabled: true,
      decorationsEnabled: true,
      backgroundEffectsEnabled: true
    };
    this.notifyListeners();
  }

  // ============================================================================
  // Animation Decision Logic
  // ============================================================================

  /**
   * Determine if animations should be shown
   * Requirement: 10.5 - Respect prefers-reduced-motion media query
   */
  shouldAnimate(): boolean {
    // If animations are disabled by user, never animate
    if (!this.settings.enabled) {
      return false;
    }

    // If respecting system preference and system prefers reduced motion, don't animate
    if (this.settings.respectSystemPreference && this.systemPrefersReduced) {
      return false;
    }

    // If intensity is 0, don't animate
    if (this.settings.intensity === 0) {
      return false;
    }

    return true;
  }

  /**
   * Check if specific animation type should be shown
   */
  shouldAnimateType(type: 'transition' | 'decoration' | 'background'): boolean {
    if (!this.shouldAnimate()) {
      return false;
    }

    switch (type) {
      case 'transition':
        return this.settings.transitionsEnabled;
      case 'decoration':
        return this.settings.decorationsEnabled;
      case 'background':
        return this.settings.backgroundEffectsEnabled;
      default:
        return true;
    }
  }

  /**
   * Get adjusted animation duration based on intensity
   * Returns duration multiplier (0.0 to 1.0)
   */
  getAnimationDurationMultiplier(): number {
    if (!this.shouldAnimate()) {
      return 0;
    }

    // Convert intensity (0-100) to multiplier (0.0-1.0)
    return this.settings.intensity / 100;
  }

  /**
   * Get current accessibility state
   */
  getState(): AnimationAccessibilityState {
    return {
      shouldAnimate: this.shouldAnimate(),
      systemPrefersReduced: this.systemPrefersReduced,
      userSettings: this.getSettings()
    };
  }

  // ============================================================================
  // Event Listeners
  // ============================================================================

  /**
   * Add listener for accessibility state changes
   */
  addListener(callback: (state: AnimationAccessibilityState) => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in animation accessibility listener:', error);
      }
    });
  }

  // ============================================================================
  // CSS Class Management
  // ============================================================================

  /**
   * Apply accessibility classes to document body
   * Requirement: 10.5 - Ensure all functionality works without animations
   */
  applyAccessibilityClasses(): void {
    if (typeof document === 'undefined') return;

    const body = document.body;

    // Remove all animation-related classes
    body.classList.remove(
      'animations-enabled',
      'animations-disabled',
      'animations-reduced',
      'system-prefers-reduced-motion'
    );

    // Add appropriate classes
    if (this.systemPrefersReduced) {
      body.classList.add('system-prefers-reduced-motion');
    }

    if (!this.shouldAnimate()) {
      body.classList.add('animations-disabled');
    } else if (this.settings.intensity < 100) {
      body.classList.add('animations-reduced');
    } else {
      body.classList.add('animations-enabled');
    }

    // Add specific type classes
    if (!this.settings.transitionsEnabled) {
      body.classList.add('transitions-disabled');
    }
    if (!this.settings.decorationsEnabled) {
      body.classList.add('decorations-disabled');
    }
    if (!this.settings.backgroundEffectsEnabled) {
      body.classList.add('background-effects-disabled');
    }
  }

  // ============================================================================
  // Storage
  // ============================================================================

  /**
   * Save settings to localStorage
   */
  saveToLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('animation-accessibility-settings', JSON.stringify(this.settings));
      console.log('Animation accessibility settings saved to localStorage');
    } catch (error) {
      console.error('Error saving animation accessibility settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  loadFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('animation-accessibility-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = {
          ...this.settings,
          ...parsed
        };
        console.log('Animation accessibility settings loaded from localStorage');
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading animation accessibility settings:', error);
    }
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  /**
   * Cleanup - remove event listeners
   */
  cleanup(): void {
    if (this.mediaQuery) {
      try {
        if (this.mediaQuery.removeEventListener) {
          this.mediaQuery.removeEventListener('change', () => {});
        } else {
          // Fallback for older browsers
          this.mediaQuery.removeListener(() => {});
        }
      } catch (error) {
        console.error('Error cleaning up media query listener:', error);
      }
    }

    this.listeners.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let animationAccessibilityInstance: AnimationAccessibilityManager | null = null;

/**
 * Get the singleton AnimationAccessibilityManager instance
 */
export function getAnimationAccessibility(): AnimationAccessibilityManager {
  if (!animationAccessibilityInstance) {
    animationAccessibilityInstance = new AnimationAccessibilityManager();
    
    // Load saved settings on initialization
    if (typeof window !== 'undefined') {
      animationAccessibilityInstance.loadFromLocalStorage();
      animationAccessibilityInstance.applyAccessibilityClasses();
      
      // Listen for changes and update classes
      animationAccessibilityInstance.addListener(() => {
        animationAccessibilityInstance!.applyAccessibilityClasses();
        animationAccessibilityInstance!.saveToLocalStorage();
      });
    }
  }
  return animationAccessibilityInstance;
}

/**
 * Reset the AnimationAccessibilityManager instance (useful for testing)
 */
export function resetAnimationAccessibility(): void {
  if (animationAccessibilityInstance) {
    animationAccessibilityInstance.cleanup();
  }
  animationAccessibilityInstance = null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if animations should be shown (convenience function)
 */
export function shouldAnimate(): boolean {
  return getAnimationAccessibility().shouldAnimate();
}

/**
 * Check if specific animation type should be shown
 */
export function shouldAnimateType(type: 'transition' | 'decoration' | 'background'): boolean {
  return getAnimationAccessibility().shouldAnimateType(type);
}

/**
 * Get animation duration with accessibility adjustments
 */
export function getAccessibleDuration(baseDuration: number): number {
  const multiplier = getAnimationAccessibility().getAnimationDurationMultiplier();
  return baseDuration * multiplier;
}

/**
 * Apply animation with accessibility check
 * Returns true if animation was applied, false if skipped
 */
export function applyAccessibleAnimation(
  element: HTMLElement,
  animationClass: string,
  type: 'transition' | 'decoration' | 'background' = 'transition'
): boolean {
  if (!shouldAnimateType(type)) {
    // Skip animation but ensure element is in final state
    element.classList.add(`${animationClass}-final`);
    return false;
  }

  element.classList.add(animationClass);
  return true;
}

// ============================================================================
// Auto-initialize on client side
// ============================================================================

if (typeof window !== 'undefined') {
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getAnimationAccessibility();
    });
  } else {
    getAnimationAccessibility();
  }

  // Expose to window for debugging
  if (process.env.NODE_ENV === 'development') {
    (window as any).animationAccessibility = getAnimationAccessibility();
  }
}
