/**
 * Tests for Ceefax Theme Animations
 * 
 * Verifies that all Ceefax theme animations are properly implemented
 * Requirements: 5.1, 10.2
 */

import { getAnimationEngine, resetAnimationEngine } from '../animation-engine';

describe('Ceefax Theme Animations', () => {
  let engine: ReturnType<typeof getAnimationEngine>;
  let mockElement: HTMLElement;

  beforeEach(() => {
    resetAnimationEngine();
    engine = getAnimationEngine();
    engine.setTheme('ceefax');
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    engine.stopAllAnimations();
    document.body.removeChild(mockElement);
  });

  describe('Horizontal Wipe Page Transition', () => {
    it('should apply ceefax-wipe CSS class', () => {
      const animationId = engine.playPageTransition(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('ceefax-wipe')).toBe(true);
    });

    it('should have 300ms duration', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations?.pageTransition.duration).toBe(300);
    });

    it('should remove class after animation completes', (done) => {
      engine.playPageTransition(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('ceefax-wipe')).toBe(false);
        done();
      }, 350);
    });
  });

  describe('Rotating Line Loading Indicator', () => {
    it('should display ASCII frames in sequence', () => {
      const animationId = engine.playLoadingIndicator(mockElement);
      
      expect(animationId).toBeTruthy();
      // First frame should be displayed
      expect(['|', '/', '─', '\\']).toContain(mockElement.textContent);
    });

    it('should have correct frames', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations?.loadingIndicator.frames).toEqual(['|', '/', '─', '\\']);
    });

    it('should loop continuously', (done) => {
      engine.playLoadingIndicator(mockElement);
      
      // Wait for multiple cycles
      setTimeout(() => {
        expect(['|', '/', '─', '\\']).toContain(mockElement.textContent);
        done();
      }, 1500);
    });
  });

  describe('Button Flash Animation', () => {
    it('should apply button-flash CSS class', () => {
      const animationId = engine.playButtonPress(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('button-flash')).toBe(true);
    });

    it('should have 150ms duration', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations?.buttonPress.duration).toBe(150);
    });

    it('should remove class after animation completes', (done) => {
      engine.playButtonPress(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('button-flash')).toBe(false);
        done();
      }, 200);
    });
  });

  describe('Blinking Cursor Animation', () => {
    it('should apply cursor-blink CSS class', () => {
      const animationId = engine.playTextEntry(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('cursor-blink')).toBe(true);
    });

    it('should have 500ms duration', () => {
      const animations = engine.getThemeAnimations('ceefax');
      expect(animations?.textEntry.duration).toBe(500);
    });

    it('should loop continuously', (done) => {
      const animationId = engine.playTextEntry(mockElement);
      
      // Wait for multiple cycles
      setTimeout(() => {
        expect(mockElement.classList.contains('cursor-blink')).toBe(true);
        expect(engine.getActiveAnimations()).toContain(animationId);
        done();
      }, 1200);
    });
  });

  describe('Scanlines Background Effect', () => {
    it('should apply scanlines-overlay CSS class', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBeGreaterThan(0);
      expect(mockElement.classList.contains('scanlines-overlay')).toBe(true);
    });

    it('should be continuous (duration 0)', () => {
      const animations = engine.getThemeAnimations('ceefax');
      const scanlines = animations?.backgroundEffects.find(e => e.name === 'scanlines');
      
      expect(scanlines).toBeDefined();
      expect(scanlines?.duration).toBe(0);
    });

    it('should remain active continuously', (done) => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('scanlines-overlay')).toBe(true);
        expect(engine.getActiveAnimations().length).toBeGreaterThan(0);
        done();
      }, 500);
    });
  });

  describe('Complete Ceefax Animation Set', () => {
    it('should have all required animations', () => {
      const animations = engine.getThemeAnimations('ceefax');
      
      expect(animations).toBeDefined();
      expect(animations?.pageTransition).toBeDefined();
      expect(animations?.loadingIndicator).toBeDefined();
      expect(animations?.buttonPress).toBeDefined();
      expect(animations?.textEntry).toBeDefined();
      expect(animations?.backgroundEffects).toBeDefined();
      expect(animations?.backgroundEffects.length).toBeGreaterThan(0);
    });

    it('should use correct animation types', () => {
      const animations = engine.getThemeAnimations('ceefax');
      
      expect(animations?.pageTransition.type).toBe('css');
      expect(animations?.loadingIndicator.type).toBe('ascii-frames');
      expect(animations?.buttonPress.type).toBe('css');
      expect(animations?.textEntry.type).toBe('css');
      expect(animations?.backgroundEffects[0].type).toBe('css');
    });

    it('should have correct animation names', () => {
      const animations = engine.getThemeAnimations('ceefax');
      
      expect(animations?.pageTransition.name).toBe('horizontal-wipe');
      expect(animations?.loadingIndicator.name).toBe('rotating-line');
      expect(animations?.buttonPress.name).toBe('flash');
      expect(animations?.textEntry.name).toBe('blink-cursor');
      expect(animations?.backgroundEffects[0].name).toBe('scanlines');
    });
  });
});
