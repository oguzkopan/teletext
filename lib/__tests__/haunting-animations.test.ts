/**
 * Tests for Haunting/Kiroween Theme Animations
 * 
 * Verifies that all Haunting theme animations are properly implemented
 * Requirements: 5.2, 7.1, 7.2, 7.3, 7.4, 7.5, 10.3
 */

import { getAnimationEngine, resetAnimationEngine } from '../animation-engine';

describe('Haunting/Kiroween Theme Animations', () => {
  let engine: ReturnType<typeof getAnimationEngine>;
  let mockElement: HTMLElement;

  beforeEach(() => {
    resetAnimationEngine();
    engine = getAnimationEngine();
    engine.setTheme('haunting');
    mockElement = document.createElement('div');
    
    // Mock the Web Animations API
    mockElement.animate = jest.fn().mockReturnValue({
      onfinish: null,
      cancel: jest.fn()
    });
    
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    engine.stopAllAnimations();
    document.body.removeChild(mockElement);
  });

  describe('Glitch Transition Page Animation', () => {
    it('should use JavaScript keyframe animation', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.pageTransition.type).toBe('javascript');
    });

    it('should have 400ms duration with chromatic aberration', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.pageTransition.duration).toBe(400);
      expect(animations?.pageTransition.name).toBe('glitch-transition');
    });

    it('should have correct keyframes for glitch effect', () => {
      const animations = engine.getThemeAnimations('haunting');
      const keyframes = animations?.pageTransition.keyframes;
      
      expect(keyframes).toBeDefined();
      expect(keyframes?.length).toBe(4);
      expect(keyframes?.[1]).toMatchObject({
        transform: 'translateX(-5px)',
        filter: 'hue-rotate(90deg)'
      });
      expect(keyframes?.[2]).toMatchObject({
        transform: 'translateX(5px)',
        filter: 'hue-rotate(-90deg)'
      });
    });

    it('should play glitch transition animation', () => {
      const animationId = engine.playPageTransition(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(engine.getActiveAnimations()).toContain(animationId);
    });
  });

  describe('Pulsing Skull Loading Indicator', () => {
    it('should display emoji frames in sequence', () => {
      const animationId = engine.playLoadingIndicator(mockElement);
      
      expect(animationId).toBeTruthy();
      // First frame should be displayed
      expect(['💀', '👻', '🎃']).toContain(mockElement.textContent);
    });

    it('should have correct emoji frames', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.loadingIndicator.frames).toEqual(['💀', '👻', '💀', '🎃']);
    });

    it('should have 800ms duration', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.loadingIndicator.duration).toBe(800);
    });

    it('should loop continuously', (done) => {
      engine.playLoadingIndicator(mockElement);
      
      // Wait for multiple cycles
      setTimeout(() => {
        expect(['💀', '👻', '🎃']).toContain(mockElement.textContent);
        done();
      }, 1200);
    });
  });

  describe('Horror Flash Button Animation', () => {
    it('should apply horror-flash CSS class', () => {
      const animationId = engine.playButtonPress(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('horror-flash')).toBe(true);
    });

    it('should have 200ms duration with red tint', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.buttonPress.duration).toBe(200);
      expect(animations?.buttonPress.cssClass).toBe('horror-flash');
    });

    it('should remove class after animation completes', (done) => {
      engine.playButtonPress(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('horror-flash')).toBe(false);
        done();
      }, 250);
    });
  });

  describe('Glitch Cursor Text Entry Animation', () => {
    it('should apply glitch-cursor CSS class', () => {
      const animationId = engine.playTextEntry(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(mockElement.classList.contains('glitch-cursor')).toBe(true);
    });

    it('should have 300ms duration', () => {
      const animations = engine.getThemeAnimations('haunting');
      expect(animations?.textEntry.duration).toBe(300);
    });

    it('should loop continuously', (done) => {
      const animationId = engine.playTextEntry(mockElement);
      
      // Wait for multiple cycles
      setTimeout(() => {
        expect(mockElement.classList.contains('glitch-cursor')).toBe(true);
        expect(engine.getActiveAnimations()).toContain(animationId);
        done();
      }, 800);
    });
  });

  describe('Floating Ghosts Background Animation', () => {
    it('should apply ghost-float CSS class', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBeGreaterThan(0);
      expect(mockElement.classList.contains('ghost-float')).toBe(true);
    });

    it('should have 10s loop duration', () => {
      const animations = engine.getThemeAnimations('haunting');
      const ghostFloat = animations?.backgroundEffects.find(e => e.name === 'floating-ghosts');
      
      expect(ghostFloat).toBeDefined();
      expect(ghostFloat?.duration).toBe(10000);
      expect(ghostFloat?.cssClass).toBe('ghost-float');
    });

    it('should remain active continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('ghost-float')).toBe(true);
        done();
      }, 500);
    });
  });

  describe('Screen Flicker Effect', () => {
    it('should apply screen-flicker CSS class', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBeGreaterThan(0);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
    });

    it('should have 5s loop duration', () => {
      const animations = engine.getThemeAnimations('haunting');
      const screenFlicker = animations?.backgroundEffects.find(e => e.name === 'screen-flicker');
      
      expect(screenFlicker).toBeDefined();
      expect(screenFlicker?.duration).toBe(5000);
      expect(screenFlicker?.cssClass).toBe('screen-flicker');
    });

    it('should remain active continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('screen-flicker')).toBe(true);
        done();
      }, 500);
    });
  });

  describe('Chromatic Aberration CSS Effect', () => {
    it('should apply chromatic-aberration CSS class', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBeGreaterThan(0);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
    });

    it('should be continuous (duration 0)', () => {
      const animations = engine.getThemeAnimations('haunting');
      const chromaticAberration = animations?.backgroundEffects.find(e => e.name === 'chromatic-aberration');
      
      expect(chromaticAberration).toBeDefined();
      expect(chromaticAberration?.duration).toBe(0);
      expect(chromaticAberration?.cssClass).toBe('chromatic-aberration');
    });

    it('should remain active continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
        done();
      }, 500);
    });
  });

  describe('Decorative Elements', () => {
    it('should have jack-o-lantern decorative element', () => {
      const animations = engine.getThemeAnimations('haunting');
      const jackOLantern = animations?.decorativeElements?.find(e => e.name === 'jack-o-lantern');
      
      expect(jackOLantern).toBeDefined();
      expect(jackOLantern?.type).toBe('css');
      expect(jackOLantern?.cssClass).toBe('jack-o-lantern-flicker');
      expect(jackOLantern?.duration).toBe(1500);
    });

    it('should have flying-bat decorative element', () => {
      const animations = engine.getThemeAnimations('haunting');
      const flyingBat = animations?.decorativeElements?.find(e => e.name === 'flying-bat');
      
      expect(flyingBat).toBeDefined();
      expect(flyingBat?.type).toBe('css');
      expect(flyingBat?.cssClass).toBe('bat-fly-decoration');
      expect(flyingBat?.duration).toBe(10000);
    });

    it('should play jack-o-lantern animation', () => {
      const animations = engine.getThemeAnimations('haunting');
      const jackOLantern = animations?.decorativeElements?.find(e => e.name === 'jack-o-lantern');
      
      if (jackOLantern) {
        const animationId = engine.playAnimationConfig(jackOLantern, mockElement, { loop: true });
        expect(animationId).toBeTruthy();
        expect(mockElement.classList.contains('jack-o-lantern-flicker')).toBe(true);
      }
    });

    it('should play flying-bat animation', () => {
      const animations = engine.getThemeAnimations('haunting');
      const flyingBat = animations?.decorativeElements?.find(e => e.name === 'flying-bat');
      
      if (flyingBat) {
        const animationId = engine.playAnimationConfig(flyingBat, mockElement, { loop: true });
        expect(animationId).toBeTruthy();
        expect(mockElement.classList.contains('bat-fly-decoration')).toBe(true);
      }
    });
  });

  describe('Complete Haunting Animation Set', () => {
    it('should have all required animations', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations).toBeDefined();
      expect(animations?.pageTransition).toBeDefined();
      expect(animations?.loadingIndicator).toBeDefined();
      expect(animations?.buttonPress).toBeDefined();
      expect(animations?.textEntry).toBeDefined();
      expect(animations?.backgroundEffects).toBeDefined();
      expect(animations?.backgroundEffects.length).toBe(3);
      expect(animations?.decorativeElements).toBeDefined();
      expect(animations?.decorativeElements?.length).toBe(6);
    });

    it('should use correct animation types', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.pageTransition.type).toBe('javascript');
      expect(animations?.loadingIndicator.type).toBe('ascii-frames');
      expect(animations?.buttonPress.type).toBe('css');
      expect(animations?.textEntry.type).toBe('css');
      expect(animations?.backgroundEffects[0].type).toBe('css');
      expect(animations?.backgroundEffects[1].type).toBe('css');
      expect(animations?.backgroundEffects[2].type).toBe('css');
    });

    it('should have correct animation names', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.pageTransition.name).toBe('glitch-transition');
      expect(animations?.loadingIndicator.name).toBe('pulsing-skull');
      expect(animations?.buttonPress.name).toBe('horror-flash');
      expect(animations?.textEntry.name).toBe('glitch-cursor');
      expect(animations?.backgroundEffects[0].name).toBe('floating-ghosts');
      expect(animations?.backgroundEffects[1].name).toBe('screen-flicker');
      expect(animations?.backgroundEffects[2].name).toBe('chromatic-aberration');
    });

    it('should apply all three background effects simultaneously', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBe(3);
      expect(mockElement.classList.contains('ghost-float')).toBe(true);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
    });
  });

  describe('Theme Comparison', () => {
    it('should differ from Ceefax theme animations', () => {
      const hauntingAnimations = engine.getThemeAnimations('haunting');
      const ceefaxAnimations = engine.getThemeAnimations('ceefax');
      
      // Page transitions should differ
      expect(hauntingAnimations?.pageTransition.name).not.toBe(ceefaxAnimations?.pageTransition.name);
      expect(hauntingAnimations?.pageTransition.type).not.toBe(ceefaxAnimations?.pageTransition.type);
      
      // Loading indicators should differ
      expect(hauntingAnimations?.loadingIndicator.name).not.toBe(ceefaxAnimations?.loadingIndicator.name);
      expect(hauntingAnimations?.loadingIndicator.frames).not.toEqual(ceefaxAnimations?.loadingIndicator.frames);
      
      // Background effects should differ
      expect(hauntingAnimations?.backgroundEffects.length).toBeGreaterThan(ceefaxAnimations?.backgroundEffects.length || 0);
    });

    it('should have decorative elements while Ceefax does not', () => {
      const hauntingAnimations = engine.getThemeAnimations('haunting');
      const ceefaxAnimations = engine.getThemeAnimations('ceefax');
      
      expect(hauntingAnimations?.decorativeElements).toBeDefined();
      expect(hauntingAnimations?.decorativeElements?.length).toBeGreaterThan(0);
      expect(ceefaxAnimations?.decorativeElements).toBeUndefined();
    });
  });
});
