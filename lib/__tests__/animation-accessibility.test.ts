/**
 * Tests for Animation Accessibility Module
 * 
 * Requirements: 10.5, 12.5
 */

import {
  getAnimationAccessibility,
  resetAnimationAccessibility,
  shouldAnimate,
  shouldAnimateType,
  getAccessibleDuration,
  applyAccessibleAnimation
} from '../animation-accessibility';

describe('Animation Accessibility', () => {
  beforeEach(() => {
    // Reset singleton before each test
    resetAnimationAccessibility();
    
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    // Remove body classes
    if (typeof document !== 'undefined') {
      document.body.className = '';
    }
  });

  afterEach(() => {
    resetAnimationAccessibility();
  });

  describe('AnimationAccessibilityManager', () => {
    it('should initialize with default settings', () => {
      const manager = getAnimationAccessibility();
      const settings = manager.getSettings();

      expect(settings.enabled).toBe(true);
      expect(settings.respectSystemPreference).toBe(true);
      expect(settings.intensity).toBe(100);
      expect(settings.transitionsEnabled).toBe(true);
      expect(settings.decorationsEnabled).toBe(true);
      expect(settings.backgroundEffectsEnabled).toBe(true);
    });

    it('should return same instance (singleton)', () => {
      const manager1 = getAnimationAccessibility();
      const manager2 = getAnimationAccessibility();

      expect(manager1).toBe(manager2);
    });

    it('should update settings', () => {
      const manager = getAnimationAccessibility();
      
      manager.updateSettings({
        enabled: false,
        intensity: 50
      });

      const settings = manager.getSettings();
      expect(settings.enabled).toBe(false);
      expect(settings.intensity).toBe(50);
    });

    it('should clamp intensity to 0-100 range', () => {
      const manager = getAnimationAccessibility();
      
      manager.setIntensity(150);
      expect(manager.getSettings().intensity).toBe(100);
      
      manager.setIntensity(-50);
      expect(manager.getSettings().intensity).toBe(0);
    });

    it('should enable animations', () => {
      const manager = getAnimationAccessibility();
      
      manager.disableAnimations();
      expect(manager.getSettings().enabled).toBe(false);
      
      manager.enableAnimations();
      expect(manager.getSettings().enabled).toBe(true);
    });

    it('should disable animations', () => {
      const manager = getAnimationAccessibility();
      
      manager.disableAnimations();
      expect(manager.getSettings().enabled).toBe(false);
      expect(manager.shouldAnimate()).toBe(false);
    });

    it('should reset to defaults', () => {
      const manager = getAnimationAccessibility();
      
      manager.updateSettings({
        enabled: false,
        intensity: 25,
        transitionsEnabled: false
      });
      
      manager.resetToDefaults();
      
      const settings = manager.getSettings();
      expect(settings.enabled).toBe(true);
      expect(settings.intensity).toBe(100);
      expect(settings.transitionsEnabled).toBe(true);
    });
  });

  describe('Animation Decision Logic', () => {
    it('should not animate when disabled', () => {
      const manager = getAnimationAccessibility();
      manager.disableAnimations();

      expect(manager.shouldAnimate()).toBe(false);
    });

    it('should animate when enabled', () => {
      const manager = getAnimationAccessibility();
      manager.enableAnimations();

      expect(manager.shouldAnimate()).toBe(true);
    });

    it('should not animate when intensity is 0', () => {
      const manager = getAnimationAccessibility();
      manager.setIntensity(0);

      expect(manager.shouldAnimate()).toBe(false);
    });

    it('should check specific animation types', () => {
      const manager = getAnimationAccessibility();
      
      manager.updateSettings({
        transitionsEnabled: false,
        decorationsEnabled: true,
        backgroundEffectsEnabled: true
      });

      expect(manager.shouldAnimateType('transition')).toBe(false);
      expect(manager.shouldAnimateType('decoration')).toBe(true);
      expect(manager.shouldAnimateType('background')).toBe(true);
    });

    it('should not animate any type when animations disabled', () => {
      const manager = getAnimationAccessibility();
      manager.disableAnimations();

      expect(manager.shouldAnimateType('transition')).toBe(false);
      expect(manager.shouldAnimateType('decoration')).toBe(false);
      expect(manager.shouldAnimateType('background')).toBe(false);
    });

    it('should calculate duration multiplier based on intensity', () => {
      const manager = getAnimationAccessibility();
      
      manager.setIntensity(100);
      expect(manager.getAnimationDurationMultiplier()).toBe(1.0);
      
      manager.setIntensity(50);
      expect(manager.getAnimationDurationMultiplier()).toBe(0.5);
      
      manager.setIntensity(0);
      expect(manager.getAnimationDurationMultiplier()).toBe(0);
    });
  });

  describe('Event Listeners', () => {
    it('should notify listeners on settings change', () => {
      const manager = getAnimationAccessibility();
      const listener = jest.fn();
      
      manager.addListener(listener);
      manager.disableAnimations();

      expect(listener).toHaveBeenCalled();
      const state = listener.mock.calls[0][0];
      expect(state.shouldAnimate).toBe(false);
    });

    it('should allow unsubscribing listeners', () => {
      const manager = getAnimationAccessibility();
      const listener = jest.fn();
      
      const unsubscribe = manager.addListener(listener);
      unsubscribe();
      
      manager.disableAnimations();
      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', () => {
      const manager = getAnimationAccessibility();
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();
      
      manager.addListener(errorListener);
      manager.addListener(goodListener);
      
      // Should not throw
      expect(() => {
        manager.disableAnimations();
      }).not.toThrow();
      
      // Good listener should still be called
      expect(goodListener).toHaveBeenCalled();
    });
  });

  describe('CSS Class Management', () => {
    it('should apply animations-enabled class when enabled', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.enableAnimations();
      manager.applyAccessibilityClasses();

      expect(document.body.classList.contains('animations-enabled')).toBe(true);
      expect(document.body.classList.contains('animations-disabled')).toBe(false);
    });

    it('should apply animations-disabled class when disabled', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.disableAnimations();
      manager.applyAccessibilityClasses();

      expect(document.body.classList.contains('animations-disabled')).toBe(true);
      expect(document.body.classList.contains('animations-enabled')).toBe(false);
    });

    it('should apply animations-reduced class when intensity < 100', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.setIntensity(50);
      manager.applyAccessibilityClasses();

      expect(document.body.classList.contains('animations-reduced')).toBe(true);
    });

    it('should apply type-specific classes', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.updateSettings({
        transitionsEnabled: false,
        decorationsEnabled: false,
        backgroundEffectsEnabled: false
      });
      manager.applyAccessibilityClasses();

      expect(document.body.classList.contains('transitions-disabled')).toBe(true);
      expect(document.body.classList.contains('decorations-disabled')).toBe(true);
      expect(document.body.classList.contains('background-effects-disabled')).toBe(true);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save settings to localStorage', () => {
      if (typeof localStorage === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.updateSettings({
        enabled: false,
        intensity: 75
      });
      manager.saveToLocalStorage();

      const stored = localStorage.getItem('animation-accessibility-settings');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.enabled).toBe(false);
      expect(parsed.intensity).toBe(75);
    });

    it('should load settings from localStorage', () => {
      if (typeof localStorage === 'undefined') return;
      
      const testSettings = {
        enabled: false,
        respectSystemPreference: false,
        intensity: 60,
        transitionsEnabled: false,
        decorationsEnabled: true,
        backgroundEffectsEnabled: false
      };
      
      localStorage.setItem('animation-accessibility-settings', JSON.stringify(testSettings));
      
      resetAnimationAccessibility();
      const manager = getAnimationAccessibility();
      manager.loadFromLocalStorage();
      
      const settings = manager.getSettings();
      expect(settings.enabled).toBe(false);
      expect(settings.intensity).toBe(60);
      expect(settings.transitionsEnabled).toBe(false);
    });

    it('should handle localStorage errors gracefully', () => {
      if (typeof localStorage === 'undefined') return;
      
      // Set invalid JSON
      localStorage.setItem('animation-accessibility-settings', 'invalid json');
      
      const manager = getAnimationAccessibility();
      
      // Should not throw
      expect(() => {
        manager.loadFromLocalStorage();
      }).not.toThrow();
      
      // Should use defaults
      expect(manager.getSettings().enabled).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('shouldAnimate() should return correct value', () => {
      const manager = getAnimationAccessibility();
      
      manager.enableAnimations();
      expect(shouldAnimate()).toBe(true);
      
      manager.disableAnimations();
      expect(shouldAnimate()).toBe(false);
    });

    it('shouldAnimateType() should return correct value', () => {
      const manager = getAnimationAccessibility();
      manager.updateSettings({
        transitionsEnabled: false
      });

      expect(shouldAnimateType('transition')).toBe(false);
      expect(shouldAnimateType('decoration')).toBe(true);
    });

    it('getAccessibleDuration() should adjust duration', () => {
      const manager = getAnimationAccessibility();
      
      manager.setIntensity(100);
      expect(getAccessibleDuration(1000)).toBe(1000);
      
      manager.setIntensity(50);
      expect(getAccessibleDuration(1000)).toBe(500);
      
      manager.setIntensity(0);
      expect(getAccessibleDuration(1000)).toBe(0);
    });

    it('applyAccessibleAnimation() should apply animation when enabled', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.enableAnimations();
      
      const element = document.createElement('div');
      const result = applyAccessibleAnimation(element, 'test-animation', 'transition');

      expect(result).toBe(true);
      expect(element.classList.contains('test-animation')).toBe(true);
    });

    it('applyAccessibleAnimation() should skip animation when disabled', () => {
      if (typeof document === 'undefined') return;
      
      const manager = getAnimationAccessibility();
      manager.disableAnimations();
      
      const element = document.createElement('div');
      const result = applyAccessibleAnimation(element, 'test-animation', 'transition');

      expect(result).toBe(false);
      expect(element.classList.contains('test-animation')).toBe(false);
      expect(element.classList.contains('test-animation-final')).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should return complete state', () => {
      const manager = getAnimationAccessibility();
      manager.updateSettings({
        enabled: false,
        intensity: 75
      });

      const state = manager.getState();
      
      expect(state.shouldAnimate).toBe(false);
      expect(state.systemPrefersReduced).toBeDefined();
      expect(state.userSettings.enabled).toBe(false);
      expect(state.userSettings.intensity).toBe(75);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid setting changes', () => {
      const manager = getAnimationAccessibility();
      
      for (let i = 0; i < 100; i++) {
        manager.setIntensity(i);
      }
      
      expect(manager.getSettings().intensity).toBe(99);
    });

    it('should handle cleanup properly', () => {
      const manager = getAnimationAccessibility();
      const listener = jest.fn();
      
      manager.addListener(listener);
      manager.cleanup();
      
      // Listeners should be cleared
      manager.disableAnimations();
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
