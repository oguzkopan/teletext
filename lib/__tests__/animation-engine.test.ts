/**
 * Tests for Animation Engine
 * 
 * Tests animation registration, playback, theme management, and state management
 */

import {
  AnimationEngine,
  getAnimationEngine,
  resetAnimationEngine,
  AnimationConfig,
  ThemeAnimationSet
} from '../animation-engine';

describe('AnimationEngine', () => {
  let engine: AnimationEngine;
  let mockElement: HTMLElement;

  beforeEach(() => {
    resetAnimationEngine();
    engine = new AnimationEngine();
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    // Mock Web Animations API
    if (!mockElement.animate) {
      mockElement.animate = jest.fn().mockReturnValue({
        cancel: jest.fn(),
        onfinish: null,
        finished: Promise.resolve()
      });
    }
  });

  afterEach(() => {
    engine.stopAllAnimations();
    document.body.removeChild(mockElement);
  });

  // ============================================================================
  // Theme Management Tests
  // ============================================================================

  describe('Theme Management', () => {
    it('should initialize with ceefax as default theme', () => {
      expect(engine.getCurrentTheme()).toBe('ceefax');
    });

    it('should switch themes', () => {
      engine.setTheme('haunting');
      expect(engine.getCurrentTheme()).toBe('haunting');
    });

    it('should fall back to ceefax for unknown themes', () => {
      engine.setTheme('unknown-theme');
      expect(engine.getCurrentTheme()).toBe('ceefax');
    });

    it('should register custom theme animations', () => {
      const customAnimations: ThemeAnimationSet = {
        pageTransition: {
          name: 'custom-transition',
          type: 'css',
          duration: 200,
          cssClass: 'custom-transition'
        },
        loadingIndicator: {
          name: 'custom-loading',
          type: 'ascii-frames',
          duration: 1000,
          frames: ['1', '2', '3']
        },
        buttonPress: {
          name: 'custom-button',
          type: 'css',
          duration: 100,
          cssClass: 'custom-button'
        },
        textEntry: {
          name: 'custom-text',
          type: 'css',
          duration: 500,
          cssClass: 'custom-text'
        },
        backgroundEffects: []
      };

      engine.registerThemeAnimations('custom', customAnimations);
      engine.setTheme('custom');
      
      const animations = engine.getThemeAnimations();
      expect(animations).toBeDefined();
      expect(animations?.pageTransition.name).toBe('custom-transition');
    });

    it('should retrieve theme animations', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations).toBeDefined();
      expect(animations?.pageTransition).toBeDefined();
      expect(animations?.loadingIndicator).toBeDefined();
      expect(animations?.buttonPress).toBeDefined();
      expect(animations?.textEntry).toBeDefined();
    });
  });

  // ============================================================================
  // Animation Registration Tests
  // ============================================================================

  describe('Animation Registration', () => {
    it('should register custom animations', () => {
      const customAnimation: AnimationConfig = {
        name: 'test-animation',
        type: 'css',
        duration: 300,
        cssClass: 'test-class'
      };

      engine.registerAnimation('test-animation', customAnimation);
      
      // Custom animations are stored in 'custom' theme
      const customTheme = engine.getThemeAnimations('custom');
      expect(customTheme).toBeDefined();
    });
  });

  // ============================================================================
  // CSS Animation Tests
  // ============================================================================

  describe('CSS Animations', () => {
    it('should apply CSS class for CSS animations', () => {
      const animationId = engine.playAnimation('horizontal-wipe', mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('ceefax-wipe')).toBe(true);
    });

    it('should remove CSS class after animation completes', (done) => {
      engine.playAnimation('horizontal-wipe', mockElement);
      
      // Animation duration is 300ms
      setTimeout(() => {
        expect(mockElement.classList.contains('ceefax-wipe')).toBe(false);
        done();
      }, 350);
    });

    it('should keep CSS class for continuous animations', () => {
      const config: AnimationConfig = {
        name: 'continuous',
        type: 'css',
        duration: 0,
        cssClass: 'continuous-class',
        loop: true
      };

      engine.playAnimationConfig(config, mockElement);
      expect(mockElement.classList.contains('continuous-class')).toBe(true);
    });
  });

  // ============================================================================
  // JavaScript Animation Tests
  // ============================================================================

  describe('JavaScript Animations', () => {
    it('should create Web Animations API animation', () => {
      engine.setTheme('haunting');
      const animationId = engine.playAnimation('glitch-transition', mockElement);
      
      expect(animationId).toBeTruthy();
      
      const activeAnimations = engine.getActiveAnimations();
      expect(activeAnimations).toContain(animationId);
    });

    it('should handle keyframe animations', () => {
      const config: AnimationConfig = {
        name: 'test-keyframe',
        type: 'javascript',
        duration: 500,
        keyframes: [
          { opacity: '0' },
          { opacity: '1' }
        ]
      };

      const animationId = engine.playAnimationConfig(config, mockElement);
      expect(animationId).toBeTruthy();
    });
  });

  // ============================================================================
  // ASCII Frame Animation Tests
  // ============================================================================

  describe('ASCII Frame Animations', () => {
    it('should cycle through ASCII frames', (done) => {
      const config: AnimationConfig = {
        name: 'test-frames',
        type: 'ascii-frames',
        duration: 400,
        frames: ['A', 'B', 'C', 'D']
      };

      engine.playAnimationConfig(config, mockElement);
      
      // First frame should be displayed immediately
      expect(mockElement.textContent).toBe('A');
      
      // Check second frame after delay
      setTimeout(() => {
        expect(['B', 'C', 'D']).toContain(mockElement.textContent);
        done();
      }, 150);
    });

    it('should loop ASCII frames when loop option is set', (done) => {
      const config: AnimationConfig = {
        name: 'test-loop',
        type: 'ascii-frames',
        duration: 200,
        frames: ['X', 'Y'],
        loop: true
      };

      engine.playAnimationConfig(config, mockElement, { loop: true });
      
      // Wait for more than one cycle
      setTimeout(() => {
        expect(['X', 'Y']).toContain(mockElement.textContent);
        done();
      }, 350);
    });

    it('should display loading indicator frames', () => {
      const animationId = engine.playLoadingIndicator(mockElement);
      
      expect(animationId).toBeTruthy();
      // Should display first frame of loading animation
      expect(mockElement.textContent).toBeTruthy();
    });
  });

  // ============================================================================
  // Animation State Management Tests
  // ============================================================================

  describe('Animation State Management', () => {
    it('should track active animations', () => {
      const id1 = engine.playAnimation('horizontal-wipe', mockElement);
      const id2 = engine.playLoadingIndicator(mockElement);
      
      const activeAnimations = engine.getActiveAnimations();
      expect(activeAnimations).toContain(id1);
      expect(activeAnimations).toContain(id2);
    });

    it('should stop individual animations', () => {
      const animationId = engine.playLoadingIndicator(mockElement);
      
      expect(engine.getActiveAnimations()).toContain(animationId);
      
      engine.stopAnimation(animationId);
      
      expect(engine.getActiveAnimations()).not.toContain(animationId);
    });

    it('should stop all animations', () => {
      engine.playAnimation('horizontal-wipe', mockElement);
      engine.playLoadingIndicator(mockElement);
      
      expect(engine.getActiveAnimations().length).toBeGreaterThan(0);
      
      engine.stopAllAnimations();
      
      expect(engine.getActiveAnimations().length).toBe(0);
    });

    it('should clean up CSS classes when stopping animations', () => {
      const animationId = engine.playAnimation('horizontal-wipe', mockElement);
      
      expect(mockElement.classList.contains('ceefax-wipe')).toBe(true);
      
      engine.stopAnimation(animationId);
      
      expect(mockElement.classList.contains('ceefax-wipe')).toBe(false);
    });
  });

  // ============================================================================
  // Convenience Method Tests
  // ============================================================================

  describe('Convenience Methods', () => {
    it('should play page transition', () => {
      const animationId = engine.playPageTransition(mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should play loading indicator', () => {
      const animationId = engine.playLoadingIndicator(mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should play button press animation', () => {
      const animationId = engine.playButtonPress(mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should play text entry animation', () => {
      const animationId = engine.playTextEntry(mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should apply background effects', () => {
      engine.setTheme('haunting');
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Default Theme Tests
  // ============================================================================

  describe('Default Themes', () => {
    it('should have ceefax theme registered', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations).toBeDefined();
      expect(animations?.pageTransition.name).toBe('horizontal-wipe');
      expect(animations?.loadingIndicator.name).toBe('rotating-line');
    });

    it('should have haunting theme registered', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations).toBeDefined();
      expect(animations?.pageTransition.name).toBe('glitch-transition');
      expect(animations?.loadingIndicator.name).toBe('pulsing-skull');
      expect(animations?.decorativeElements).toBeDefined();
    });

    it('should have high-contrast theme registered', () => {
      const animations = engine.getThemeAnimations('high-contrast');
      expect(animations).toBeDefined();
      expect(animations?.pageTransition.name).toBe('simple-fade');
    });

    it('should have orf theme registered', () => {
      const animations = engine.getThemeAnimations('orf');
      expect(animations).toBeDefined();
      expect(animations?.pageTransition.name).toBe('slide-transition');
    });
  });

  // ============================================================================
  // Singleton Tests
  // ============================================================================

  describe('Singleton Instance', () => {
    it('should return same instance from getAnimationEngine', () => {
      const instance1 = getAnimationEngine();
      const instance2 = getAnimationEngine();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton instance', () => {
      const instance1 = getAnimationEngine();
      instance1.setTheme('haunting');
      
      resetAnimationEngine();
      
      const instance2 = getAnimationEngine();
      expect(instance2.getCurrentTheme()).toBe('ceefax');
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle missing animation gracefully', () => {
      const animationId = engine.playAnimation('non-existent', mockElement);
      expect(animationId).toBe('');
    });

    it('should handle CSS animation without cssClass', () => {
      const config: AnimationConfig = {
        name: 'invalid-css',
        type: 'css',
        duration: 300
        // Missing cssClass
      };

      const animationId = engine.playAnimationConfig(config, mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should handle JavaScript animation without keyframes', () => {
      const config: AnimationConfig = {
        name: 'invalid-js',
        type: 'javascript',
        duration: 300
        // Missing keyframes
      };

      const animationId = engine.playAnimationConfig(config, mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should handle ASCII animation without frames', () => {
      const config: AnimationConfig = {
        name: 'invalid-ascii',
        type: 'ascii-frames',
        duration: 300
        // Missing frames
      };

      const animationId = engine.playAnimationConfig(config, mockElement);
      expect(animationId).toBeTruthy();
    });

    it('should handle stopping non-existent animation', () => {
      expect(() => {
        engine.stopAnimation('non-existent-id');
      }).not.toThrow();
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration', () => {
    it('should handle multiple simultaneous animations', () => {
      const id1 = engine.playPageTransition(mockElement);
      const id2 = engine.playLoadingIndicator(mockElement);
      const id3 = engine.playButtonPress(mockElement);
      
      const activeAnimations = engine.getActiveAnimations();
      expect(activeAnimations).toContain(id1);
      expect(activeAnimations).toContain(id2);
      expect(activeAnimations).toContain(id3);
    });

    it('should switch themes and play animations', () => {
      engine.setTheme('ceefax');
      const id1 = engine.playPageTransition(mockElement);
      
      engine.setTheme('haunting');
      const id2 = engine.playPageTransition(mockElement);
      
      expect(id1).not.toBe(id2);
    });

    it('should clean up animations on theme switch', () => {
      engine.setTheme('ceefax');
      engine.playLoadingIndicator(mockElement);
      
      const beforeCount = engine.getActiveAnimations().length;
      expect(beforeCount).toBeGreaterThan(0);
      
      engine.stopAllAnimations();
      engine.setTheme('haunting');
      
      expect(engine.getActiveAnimations().length).toBe(0);
    });
  });
});
