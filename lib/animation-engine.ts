/**
 * Animation Engine for Modern Teletext
 * 
 * Manages theme-specific animations, CSS class application, JavaScript keyframe animations,
 * and ASCII frame-by-frame animations for the teletext interface.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 10.1, 12.3
 */

import { 
  animationPerformanceManager, 
  type AnimationPerformanceConfig 
} from './animation-performance';
import { 
  getAnimationAccessibility,
  shouldAnimate,
  shouldAnimateType,
  getAccessibleDuration
} from './animation-accessibility';

// ============================================================================
// Type Definitions
// ============================================================================

export type AnimationType = 'css' | 'javascript' | 'ascii-frames';
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;

export interface AnimationConfig {
  name: string;
  type: AnimationType;
  duration: number;  // milliseconds (0 for continuous)
  easing?: AnimationEasing;
  frames?: string[];  // For ASCII art animations
  cssClass?: string;
  keyframes?: Keyframe[];
  loop?: boolean;  // Whether animation should loop
}

export interface ThemeAnimationSet {
  pageTransition: AnimationConfig;
  loadingIndicator: AnimationConfig;
  buttonPress: AnimationConfig;
  textEntry: AnimationConfig;
  backgroundEffects: AnimationConfig[];
  decorativeElements?: AnimationConfig[];
}

export interface ActiveAnimation {
  id: string;
  config: AnimationConfig;
  target: HTMLElement;
  startTime: number;
  animation?: Animation;  // Web Animations API Animation object
  frameIndex?: number;  // For ASCII frame animations
  intervalId?: NodeJS.Timeout;  // For frame-by-frame animations
}

// ============================================================================
// Animation Engine Class
// ============================================================================

export class AnimationEngine {
  private themeAnimations: Map<string, ThemeAnimationSet>;
  private activeAnimations: Map<string, ActiveAnimation>;
  private currentTheme: string;
  private animationIdCounter: number;

  constructor() {
    this.themeAnimations = new Map();
    this.activeAnimations = new Map();
    this.currentTheme = 'ceefax';
    this.animationIdCounter = 0;

    // Register default theme animation sets
    this.registerDefaultThemes();
  }

  // ============================================================================
  // Theme Management
  // ============================================================================

  /**
   * Set the current theme and load its animation set
   */
  setTheme(themeName: string): void {
    if (!this.themeAnimations.has(themeName)) {
      console.warn(`Theme "${themeName}" not found, falling back to ceefax`);
      this.currentTheme = 'ceefax';
      return;
    }
    this.currentTheme = themeName;
  }

  /**
   * Get the current theme name
   */
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * Register a theme animation set
   */
  registerThemeAnimations(themeName: string, animations: ThemeAnimationSet): void {
    this.themeAnimations.set(themeName, animations);
  }

  /**
   * Get animations for a specific theme
   */
  getThemeAnimations(themeName?: string): ThemeAnimationSet | undefined {
    return this.themeAnimations.get(themeName || this.currentTheme);
  }

  // ============================================================================
  // Animation Registration
  // ============================================================================

  /**
   * Register a custom animation configuration
   */
  registerAnimation(name: string, config: AnimationConfig): void {
    // Store custom animations in a special theme
    if (!this.themeAnimations.has('custom')) {
      this.themeAnimations.set('custom', {
        pageTransition: config,
        loadingIndicator: config,
        buttonPress: config,
        textEntry: config,
        backgroundEffects: []
      });
    }
  }

  // ============================================================================
  // Animation Playback
  // ============================================================================

  /**
   * Play an animation by name on a target element
   */
  playAnimation(name: string, target: HTMLElement, options?: { loop?: boolean }): string {
    const animations = this.getThemeAnimations();
    if (!animations) {
      console.warn(`No animations found for theme "${this.currentTheme}"`);
      return '';
    }

    // Find the animation config by name
    let config: AnimationConfig | undefined;
    
    if (animations.pageTransition.name === name) {
      config = animations.pageTransition;
    } else if (animations.loadingIndicator.name === name) {
      config = animations.loadingIndicator;
    } else if (animations.buttonPress.name === name) {
      config = animations.buttonPress;
    } else if (animations.textEntry.name === name) {
      config = animations.textEntry;
    } else {
      // Check background effects and decorative elements
      config = animations.backgroundEffects.find(a => a.name === name);
      if (!config && animations.decorativeElements) {
        config = animations.decorativeElements.find(a => a.name === name);
      }
    }

    if (!config) {
      console.warn(`Animation "${name}" not found in theme "${this.currentTheme}"`);
      return '';
    }

    return this.playAnimationConfig(config, target, options);
  }

  /**
   * Play an animation using a config object
   * Requirements: 10.5, 12.5 - Check accessibility settings before playing
   */
  playAnimationConfig(config: AnimationConfig, target: HTMLElement, options?: { loop?: boolean }): string {
    // Check if animations should be played
    // Requirement: 10.5 - Ensure all functionality works without animations
    if (!shouldAnimate()) {
      console.log('Animation skipped due to accessibility settings');
      // Apply final state without animation
      if (config.cssClass) {
        target.classList.add(`${config.cssClass}-final`);
      }
      return '';
    }

    // Check if specific animation type should be played
    const animationType = this.getAnimationType(config);
    if (!shouldAnimateType(animationType)) {
      console.log(`Animation type "${animationType}" skipped due to accessibility settings`);
      return '';
    }

    const animationId = `anim-${this.animationIdCounter++}`;
    const startTime = Date.now();

    // Adjust duration based on accessibility settings
    // Requirement: 12.5 - Allow users to adjust animation intensity
    const adjustedDuration = getAccessibleDuration(config.duration);
    const adjustedConfig = {
      ...config,
      duration: adjustedDuration
    };

    const activeAnimation: ActiveAnimation = {
      id: animationId,
      config: adjustedConfig,
      target,
      startTime
    };

    // Apply performance optimizations
    // Requirement: 12.3 - Add will-change property for critical animations
    const performanceConfig: AnimationPerformanceConfig = {
      useWillChange: adjustedConfig.duration > 0 && adjustedConfig.duration < 1000, // Only for short animations
      complexity: this.getAnimationComplexity(adjustedConfig),
      degradeOnLowFPS: true
    };

    animationPerformanceManager.optimizeAnimatedElement(target, performanceConfig);

    switch (adjustedConfig.type) {
      case 'css':
        this.playCSSAnimation(activeAnimation, options);
        break;
      case 'javascript':
        this.playJavaScriptAnimation(activeAnimation, options);
        break;
      case 'ascii-frames':
        this.playASCIIFrameAnimation(activeAnimation, options);
        break;
    }

    this.activeAnimations.set(animationId, activeAnimation);
    return animationId;
  }

  /**
   * Determine animation type for accessibility checks
   */
  private getAnimationType(config: AnimationConfig): 'transition' | 'decoration' | 'background' {
    if (config.name.includes('transition') || config.name.includes('page')) {
      return 'transition';
    }
    if (config.name.includes('background') || config.name.includes('scanline') || config.name.includes('flicker')) {
      return 'background';
    }
    return 'decoration';
  }

  /**
   * Determine animation complexity for performance optimization
   */
  private getAnimationComplexity(config: AnimationConfig): 'simple' | 'moderate' | 'complex' {
    // Background effects and decorative elements are complex
    if (config.name.includes('background') || config.name.includes('decoration')) {
      return 'complex';
    }

    // Long-running animations are moderate
    if (config.duration > 1000 || config.loop) {
      return 'moderate';
    }

    // Short animations are simple
    return 'simple';
  }

  /**
   * Stop an animation by ID
   */
  stopAnimation(animationId: string): void {
    const activeAnimation = this.activeAnimations.get(animationId);
    if (!activeAnimation) return;

    // Clean up based on animation type
    if (activeAnimation.animation) {
      activeAnimation.animation.cancel();
    }

    if (activeAnimation.intervalId) {
      clearInterval(activeAnimation.intervalId);
    }

    if (activeAnimation.config.cssClass) {
      activeAnimation.target.classList.remove(activeAnimation.config.cssClass);
    }

    this.activeAnimations.delete(animationId);
  }

  /**
   * Stop all active animations
   */
  stopAllAnimations(): void {
    const animationIds = Array.from(this.activeAnimations.keys());
    animationIds.forEach(id => this.stopAnimation(id));
  }

  /**
   * Get all active animation IDs
   */
  getActiveAnimations(): string[] {
    return Array.from(this.activeAnimations.keys());
  }

  // ============================================================================
  // Animation Type Implementations
  // ============================================================================

  /**
   * Play a CSS-based animation
   */
  private playCSSAnimation(activeAnimation: ActiveAnimation, options?: { loop?: boolean }): void {
    const { config, target } = activeAnimation;
    
    if (!config.cssClass) {
      console.warn('CSS animation requires cssClass property');
      return;
    }

    // Add the CSS class to trigger the animation
    target.classList.add(config.cssClass);

    // Set up cleanup after animation completes (if not continuous)
    if (config.duration > 0 && !options?.loop && !config.loop) {
      setTimeout(() => {
        if (config.cssClass) {
          target.classList.remove(config.cssClass);
        }
        this.activeAnimations.delete(activeAnimation.id);
      }, config.duration);
    }
  }

  /**
   * Play a JavaScript keyframe animation using Web Animations API
   */
  private playJavaScriptAnimation(activeAnimation: ActiveAnimation, options?: { loop?: boolean }): void {
    const { config, target } = activeAnimation;
    
    if (!config.keyframes || config.keyframes.length === 0) {
      console.warn('JavaScript animation requires keyframes property');
      return;
    }

    const animationOptions: KeyframeAnimationOptions = {
      duration: config.duration,
      easing: config.easing || 'ease',
      iterations: (options?.loop || config.loop) ? Infinity : 1,
      fill: 'forwards'
    };

    const animation = target.animate(config.keyframes, animationOptions);
    activeAnimation.animation = animation;

    // Clean up when animation finishes (if not looping)
    if (!options?.loop && !config.loop) {
      animation.onfinish = () => {
        this.activeAnimations.delete(activeAnimation.id);
      };
    }
  }

  /**
   * Play an ASCII frame-by-frame animation
   */
  private playASCIIFrameAnimation(activeAnimation: ActiveAnimation, options?: { loop?: boolean }): void {
    const { config, target } = activeAnimation;
    
    if (!config.frames || config.frames.length === 0) {
      console.warn('ASCII frame animation requires frames property');
      return;
    }

    activeAnimation.frameIndex = 0;
    const frameDelay = config.duration / config.frames.length;

    const updateFrame = () => {
      if (activeAnimation.frameIndex === undefined) return;
      
      const frame = config.frames![activeAnimation.frameIndex];
      target.textContent = frame;

      activeAnimation.frameIndex++;
      
      if (activeAnimation.frameIndex >= config.frames!.length) {
        if (options?.loop || config.loop) {
          activeAnimation.frameIndex = 0;
        } else {
          clearInterval(activeAnimation.intervalId!);
          this.activeAnimations.delete(activeAnimation.id);
        }
      }
    };

    // Display first frame immediately
    updateFrame();

    // Set up interval for subsequent frames
    if (config.frames.length > 1) {
      const intervalId = setInterval(updateFrame, frameDelay);
      activeAnimation.intervalId = intervalId;
    }
  }

  // ============================================================================
  // Convenience Methods
  // ============================================================================

  /**
   * Play the page transition animation for the current theme
   */
  playPageTransition(target: HTMLElement): string {
    const animations = this.getThemeAnimations();
    if (!animations) return '';
    return this.playAnimationConfig(animations.pageTransition, target);
  }

  /**
   * Play the loading indicator animation for the current theme
   */
  playLoadingIndicator(target: HTMLElement): string {
    const animations = this.getThemeAnimations();
    if (!animations) return '';
    return this.playAnimationConfig(animations.loadingIndicator, target, { loop: true });
  }

  /**
   * Play the button press animation for the current theme
   */
  playButtonPress(target: HTMLElement): string {
    const animations = this.getThemeAnimations();
    if (!animations) return '';
    return this.playAnimationConfig(animations.buttonPress, target);
  }

  /**
   * Play the text entry animation for the current theme
   */
  playTextEntry(target: HTMLElement): string {
    const animations = this.getThemeAnimations();
    if (!animations) return '';
    return this.playAnimationConfig(animations.textEntry, target, { loop: true });
  }

  /**
   * Apply all background effects for the current theme
   */
  applyBackgroundEffects(container: HTMLElement): string[] {
    const animations = this.getThemeAnimations();
    if (!animations || !animations.backgroundEffects) return [];

    return animations.backgroundEffects.map(effect => 
      this.playAnimationConfig(effect, container, { loop: true })
    );
  }

  // ============================================================================
  // Default Theme Registrations
  // ============================================================================

  private registerDefaultThemes(): void {
    // Ceefax Theme
    this.registerThemeAnimations('ceefax', {
      pageTransition: {
        name: 'horizontal-wipe',
        type: 'css',
        duration: 300,
        cssClass: 'ceefax-wipe',
        easing: 'ease-in-out'
      },
      loadingIndicator: {
        name: 'rotating-line',
        type: 'ascii-frames',
        duration: 1000,
        frames: ['|', '/', '─', '\\'],
        loop: true
      },
      buttonPress: {
        name: 'flash',
        type: 'css',
        duration: 150,
        cssClass: 'button-flash'
      },
      textEntry: {
        name: 'blink-cursor',
        type: 'css',
        duration: 500,
        cssClass: 'cursor-blink',
        loop: true
      },
      backgroundEffects: [
        {
          name: 'scanlines',
          type: 'css',
          duration: 0,
          cssClass: 'scanlines-overlay',
          loop: true
        }
      ]
    });

    // Haunting/Kiroween Theme
    this.registerThemeAnimations('haunting', {
      pageTransition: {
        name: 'glitch-transition',
        type: 'javascript',
        duration: 400,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        keyframes: [
          { transform: 'translateX(0)', filter: 'none' },
          { transform: 'translateX(-5px)', filter: 'hue-rotate(90deg)' },
          { transform: 'translateX(5px)', filter: 'hue-rotate(-90deg)' },
          { transform: 'translateX(0)', filter: 'none' }
        ]
      },
      loadingIndicator: {
        name: 'pulsing-skull',
        type: 'ascii-frames',
        duration: 800,
        frames: ['💀', '👻', '💀', '🎃'],
        loop: true
      },
      buttonPress: {
        name: 'horror-flash',
        type: 'css',
        duration: 200,
        cssClass: 'horror-flash'
      },
      textEntry: {
        name: 'glitch-cursor',
        type: 'css',
        duration: 300,
        cssClass: 'glitch-cursor',
        loop: true
      },
      backgroundEffects: [
        {
          name: 'floating-ghosts',
          type: 'css',
          duration: 10000,
          cssClass: 'ghost-float',
          loop: true
        },
        {
          name: 'screen-flicker',
          type: 'css',
          duration: 5000,
          cssClass: 'screen-flicker',
          loop: true
        },
        {
          name: 'chromatic-aberration',
          type: 'css',
          duration: 0,
          cssClass: 'chromatic-aberration',
          loop: true
        }
      ],
      decorativeElements: [
        {
          name: 'jack-o-lantern',
          type: 'css',
          duration: 1500,
          cssClass: 'jack-o-lantern-flicker',
          loop: true
        },
        {
          name: 'floating-ghost',
          type: 'css',
          duration: 12000,
          cssClass: 'ghost-float-decoration',
          loop: true
        },
        {
          name: 'flying-bat',
          type: 'css',
          duration: 10000,
          cssClass: 'bat-fly-decoration',
          loop: true
        },
        {
          name: 'ascii-cat',
          type: 'ascii-frames',
          duration: 4000,
          frames: [
            '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
            '  /\\_/\\  \n ( -.o ) \n  > ^ <  ',
            '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
            '  /\\_/\\  \n ( o.- ) \n  > ^ <  ',
            '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
            '  /\\_/\\  \n ( -.- ) \n  > ^ <  ',
            '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
            '  /\\_/\\  \n ( o.o ) \n  > ^ <  '
          ],
          loop: true
        },
        {
          name: 'skull',
          type: 'css',
          duration: 2000,
          cssClass: 'skull-pulse-decoration',
          loop: true
        },
        {
          name: 'spider',
          type: 'css',
          duration: 3000,
          cssClass: 'spider-crawl-decoration',
          loop: true
        }
      ]
    });

    // High Contrast Theme
    this.registerThemeAnimations('high-contrast', {
      pageTransition: {
        name: 'simple-fade',
        type: 'css',
        duration: 250,
        cssClass: 'fade-transition',
        easing: 'ease'
      },
      loadingIndicator: {
        name: 'smooth-loading',
        type: 'ascii-frames',
        duration: 1000,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        loop: true
      },
      buttonPress: {
        name: 'simple-flash',
        type: 'css',
        duration: 150,
        cssClass: 'simple-flash'
      },
      textEntry: {
        name: 'steady-cursor',
        type: 'css',
        duration: 500,
        cssClass: 'steady-cursor',
        loop: true
      },
      backgroundEffects: []
    });

    // ORF Theme
    this.registerThemeAnimations('orf', {
      pageTransition: {
        name: 'slide-transition',
        type: 'css',
        duration: 300,
        cssClass: 'slide-transition',
        easing: 'ease-in-out'
      },
      loadingIndicator: {
        name: 'rotating-dots',
        type: 'ascii-frames',
        duration: 1000,
        frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
        loop: true
      },
      buttonPress: {
        name: 'color-flash',
        type: 'css',
        duration: 150,
        cssClass: 'color-flash'
      },
      textEntry: {
        name: 'color-cursor',
        type: 'css',
        duration: 500,
        cssClass: 'color-cursor',
        loop: true
      },
      backgroundEffects: [
        {
          name: 'color-cycling-header',
          type: 'css',
          duration: 5000,
          cssClass: 'color-cycle',
          loop: true
        }
      ]
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let animationEngineInstance: AnimationEngine | null = null;

/**
 * Get the singleton AnimationEngine instance
 */
export function getAnimationEngine(): AnimationEngine {
  if (!animationEngineInstance) {
    animationEngineInstance = new AnimationEngine();
  }
  return animationEngineInstance;
}

/**
 * Reset the AnimationEngine instance (useful for testing)
 */
export function resetAnimationEngine(): void {
  if (animationEngineInstance) {
    animationEngineInstance.stopAllAnimations();
  }
  animationEngineInstance = null;
}
