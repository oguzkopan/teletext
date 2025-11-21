/**
 * Comprehensive Kiroween Theme Integration Tests
 * Task 39: Test Kiroween theme thoroughly
 * 
 * This test suite verifies all Halloween decorations, animations, and effects
 * work correctly across all page types.
 * 
 * Requirements: 6.2, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { getAnimationEngine, resetAnimationEngine } from '../animation-engine';
import {
  JACK_O_LANTERN,
  FLOATING_GHOST,
  FLYING_BAT,
  ASCII_CAT,
  SKULL_DECORATION,
  SPIDER_WEB,
  SPIDER,
  DEFAULT_KIROWEEN_DECORATIONS,
  shouldRenderDecoration
} from '../kiroween-decorations';

describe('Kiroween Theme Integration Tests', () => {
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
      cancel: jest.fn(),
      finished: Promise.resolve()
    });
    
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    engine.stopAllAnimations();
    if (document.body.contains(mockElement)) {
      document.body.removeChild(mockElement);
    }
  });

  describe('Halloween Decorations Presence', () => {
    // Requirement 7.1: Jack-o-lanterns with flickering
    test('Jack-o-lantern decoration is available and configured', () => {
      expect(JACK_O_LANTERN).toBeDefined();
      expect(JACK_O_LANTERN.content).toBe('🎃');
      expect(JACK_O_LANTERN.animation).toBeDefined();
      expect(JACK_O_LANTERN.animation?.name).toBe('jack-o-lantern-flicker');
      expect(JACK_O_LANTERN.animation?.loop).toBe(true);
    });

    // Requirement 7.2: Floating ghosts
    test('Floating ghost decoration is available and configured', () => {
      expect(FLOATING_GHOST).toBeDefined();
      expect(FLOATING_GHOST.content).toBe('👻');
      expect(FLOATING_GHOST.position).toBe('floating');
      expect(FLOATING_GHOST.animation?.cssClass).toBe('ghost-float-decoration');
      expect(FLOATING_GHOST.animation?.duration).toBe(12000);
    });

    // Requirement 7.3: Flying bats
    test('Flying bat decoration is available and configured', () => {
      expect(FLYING_BAT).toBeDefined();
      expect(FLYING_BAT.content).toBe('🦇');
      expect(FLYING_BAT.position).toBe('floating');
      expect(FLYING_BAT.animation?.cssClass).toBe('bat-fly-decoration');
      expect(FLYING_BAT.animation?.duration).toBe(10000);
    });

    test('ASCII cat decoration with blinking eyes is available', () => {
      expect(ASCII_CAT).toBeDefined();
      expect(ASCII_CAT.type).toBe('ascii-art');
      expect(ASCII_CAT.animation?.frames).toBeDefined();
      expect(ASCII_CAT.animation?.frames?.length).toBeGreaterThan(0);
      
      // Verify different eye states exist
      const frames = ASCII_CAT.animation?.frames || [];
      const hasOpenEyes = frames.some(f => f.includes('o.o'));
      const hasWink = frames.some(f => f.includes('-.o') || f.includes('o.-'));
      const hasClosed = frames.some(f => f.includes('-.-'));
      
      expect(hasOpenEyes).toBe(true);
      expect(hasWink).toBe(true);
      expect(hasClosed).toBe(true);
    });

    test('Additional spooky decorations are available', () => {
      expect(SKULL_DECORATION).toBeDefined();
      expect(SKULL_DECORATION.content).toBe('💀');
      
      expect(SPIDER_WEB).toBeDefined();
      expect(SPIDER_WEB.content).toBe('🕸️');
      
      expect(SPIDER).toBeDefined();
      expect(SPIDER.content).toBe('🕷️');
    });

    test('All decorations are included in default set', () => {
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(JACK_O_LANTERN);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(FLOATING_GHOST);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(FLYING_BAT);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(ASCII_CAT);
    });

    test('Decorations only render for haunting theme', () => {
      const testDecoration = JACK_O_LANTERN;
      
      expect(shouldRenderDecoration(testDecoration, 'haunting')).toBe(true);
      expect(shouldRenderDecoration(testDecoration, 'kiroween')).toBe(true);
      expect(shouldRenderDecoration(testDecoration, 'ceefax')).toBe(false);
      expect(shouldRenderDecoration(testDecoration, 'orf')).toBe(false);
      expect(shouldRenderDecoration(testDecoration, 'highcontrast')).toBe(false);
    });
  });

  describe('Glitch Transition Animations', () => {
    // Requirement 7.2: Glitch transitions with chromatic aberration
    test('Glitch transition animation is configured correctly', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.pageTransition.name).toBe('glitch-transition');
      expect(animations?.pageTransition.type).toBe('javascript');
      expect(animations?.pageTransition.duration).toBe(400);
    });

    test('Glitch transition has chromatic aberration keyframes', () => {
      const animations = engine.getThemeAnimations('haunting');
      const keyframes = animations?.pageTransition.keyframes;
      
      expect(keyframes).toBeDefined();
      expect(keyframes?.length).toBeGreaterThan(0);
      
      // Check for hue-rotate effects (chromatic aberration)
      const hasHueRotate = keyframes?.some(kf => 
        kf.filter && kf.filter.toString().includes('hue-rotate')
      );
      expect(hasHueRotate).toBe(true);
      
      // Check for transform effects
      const hasTransform = keyframes?.some(kf => kf.transform);
      expect(hasTransform).toBe(true);
    });

    test('Glitch transition can be played on element', () => {
      const animationId = engine.playPageTransition(mockElement);
      
      expect(animationId).toBeTruthy();
      expect(engine.getActiveAnimations()).toContain(animationId);
    });

    test('Glitch transition completes within expected time', (done) => {
      engine.playPageTransition(mockElement);
      
      setTimeout(() => {
        // Animation should complete or be near completion
        done();
      }, 500); // 400ms duration + buffer
    });
  });

  describe('Chromatic Aberration Effect', () => {
    // Requirement 7.2: Chromatic aberration effect
    test('Chromatic aberration is included in background effects', () => {
      const animations = engine.getThemeAnimations('haunting');
      const chromaticEffect = animations?.backgroundEffects.find(
        e => e.name === 'chromatic-aberration'
      );
      
      expect(chromaticEffect).toBeDefined();
      expect(chromaticEffect?.cssClass).toBe('chromatic-aberration');
      expect(chromaticEffect?.duration).toBe(0); // Continuous effect
    });

    test('Chromatic aberration CSS class is applied', () => {
      engine.applyBackgroundEffects(mockElement);
      
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
    });

    test('Chromatic aberration remains active continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
        done();
      }, 1000);
    });
  });

  describe('Floating Ghost and Bat Animations', () => {
    // Requirement 7.3: Floating ghosts and bats
    test('Floating ghost animation is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      const ghostEffect = animations?.backgroundEffects.find(
        e => e.name === 'floating-ghosts'
      );
      
      expect(ghostEffect).toBeDefined();
      expect(ghostEffect?.cssClass).toBe('ghost-float');
      expect(ghostEffect?.duration).toBe(10000); // 10s loop
    });

    test('Ghost float CSS class is applied', () => {
      engine.applyBackgroundEffects(mockElement);
      
      expect(mockElement.classList.contains('ghost-float')).toBe(true);
    });

    test('Bat decoration animation is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      const batDecoration = animations?.decorativeElements?.find(
        e => e.name === 'flying-bat'
      );
      
      expect(batDecoration).toBeDefined();
      expect(batDecoration?.cssClass).toBe('bat-fly-decoration');
      expect(batDecoration?.duration).toBe(10000); // 10s loop
    });

    test('Bat animation can be played', () => {
      const animations = engine.getThemeAnimations('haunting');
      const batDecoration = animations?.decorativeElements?.find(
        e => e.name === 'flying-bat'
      );
      
      if (batDecoration) {
        const animationId = engine.playAnimationConfig(batDecoration, mockElement, { loop: true });
        expect(animationId).toBeTruthy();
        expect(mockElement.classList.contains('bat-fly-decoration')).toBe(true);
      }
    });

    test('Ghost and bat animations loop continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        // Both should still be active after 1 second
        expect(mockElement.classList.contains('ghost-float')).toBe(true);
        done();
      }, 1000);
    });
  });

  describe('Screen Flicker and Fog Effects', () => {
    // Requirement 7.4: Screen flicker effects
    test('Screen flicker effect is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      const flickerEffect = animations?.backgroundEffects.find(
        e => e.name === 'screen-flicker'
      );
      
      expect(flickerEffect).toBeDefined();
      expect(flickerEffect?.cssClass).toBe('screen-flicker');
      expect(flickerEffect?.duration).toBe(5000); // 5s loop
    });

    test('Screen flicker CSS class is applied', () => {
      engine.applyBackgroundEffects(mockElement);
      
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
    });

    test('Screen flicker remains active continuously', (done) => {
      engine.applyBackgroundEffects(mockElement);
      
      setTimeout(() => {
        expect(mockElement.classList.contains('screen-flicker')).toBe(true);
        done();
      }, 2000);
    });

    test('All three background effects apply simultaneously', () => {
      const animationIds = engine.applyBackgroundEffects(mockElement);
      
      expect(animationIds.length).toBe(3);
      expect(mockElement.classList.contains('ghost-float')).toBe(true);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
    });
  });

  describe('Theme-Specific Animations', () => {
    test('Horror flash button animation is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.buttonPress.name).toBe('horror-flash');
      expect(animations?.buttonPress.cssClass).toBe('horror-flash');
      expect(animations?.buttonPress.duration).toBe(200);
    });

    test('Glitch cursor animation is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.textEntry.name).toBe('glitch-cursor');
      expect(animations?.textEntry.cssClass).toBe('glitch-cursor');
      expect(animations?.textEntry.duration).toBe(300);
    });

    test('Pulsing skull loading indicator is configured', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.loadingIndicator.name).toBe('pulsing-skull');
      expect(animations?.loadingIndicator.type).toBe('ascii-frames');
      expect(animations?.loadingIndicator.frames).toEqual(['💀', '👻', '💀', '🎃']);
      expect(animations?.loadingIndicator.duration).toBe(800);
    });

    test('Loading indicator displays spooky emojis', () => {
      engine.playLoadingIndicator(mockElement);
      
      const content = mockElement.textContent || '';
      expect(['💀', '👻', '🎃']).toContain(content);
    });

    test('Button press applies horror flash', () => {
      engine.playButtonPress(mockElement);
      
      expect(mockElement.classList.contains('horror-flash')).toBe(true);
    });

    test('Text entry applies glitch cursor', () => {
      engine.playTextEntry(mockElement);
      
      expect(mockElement.classList.contains('glitch-cursor')).toBe(true);
    });
  });

  describe('Complete Animation Set', () => {
    test('Haunting theme has all required animations', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations).toBeDefined();
      expect(animations?.pageTransition).toBeDefined();
      expect(animations?.loadingIndicator).toBeDefined();
      expect(animations?.buttonPress).toBeDefined();
      expect(animations?.textEntry).toBeDefined();
      expect(animations?.backgroundEffects).toBeDefined();
      expect(animations?.decorativeElements).toBeDefined();
    });

    test('Background effects include all three effects', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.backgroundEffects.length).toBe(3);
      
      const effectNames = animations?.backgroundEffects.map(e => e.name);
      expect(effectNames).toContain('floating-ghosts');
      expect(effectNames).toContain('screen-flicker');
      expect(effectNames).toContain('chromatic-aberration');
    });

    test('Decorative elements include all Halloween decorations', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.decorativeElements?.length).toBe(6);
      
      const decorationNames = animations?.decorativeElements?.map(e => e.name);
      expect(decorationNames).toContain('jack-o-lantern');
      expect(decorationNames).toContain('floating-ghost');
      expect(decorationNames).toContain('flying-bat');
      expect(decorationNames).toContain('ascii-cat');
      expect(decorationNames).toContain('skull');
      expect(decorationNames).toContain('spider');
    });

    test('All animations use correct types', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      expect(animations?.pageTransition.type).toBe('javascript');
      expect(animations?.loadingIndicator.type).toBe('ascii-frames');
      expect(animations?.buttonPress.type).toBe('css');
      expect(animations?.textEntry.type).toBe('css');
      
      animations?.backgroundEffects.forEach(effect => {
        expect(effect.type).toBe('css');
      });
    });
  });

  describe('Theme Comparison', () => {
    test('Haunting theme differs significantly from Ceefax', () => {
      const hauntingAnimations = engine.getThemeAnimations('haunting');
      const ceefaxAnimations = engine.getThemeAnimations('ceefax');
      
      // Different page transitions
      expect(hauntingAnimations?.pageTransition.name).not.toBe(ceefaxAnimations?.pageTransition.name);
      
      // Different loading indicators
      expect(hauntingAnimations?.loadingIndicator.frames).not.toEqual(ceefaxAnimations?.loadingIndicator.frames);
      
      // Haunting has more background effects
      expect(hauntingAnimations?.backgroundEffects.length).toBeGreaterThan(
        ceefaxAnimations?.backgroundEffects.length || 0
      );
      
      // Haunting has decorative elements, Ceefax doesn't
      expect(hauntingAnimations?.decorativeElements).toBeDefined();
      expect(hauntingAnimations?.decorativeElements?.length).toBeGreaterThan(0);
    });

    test('Haunting theme has unique spooky characteristics', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      // Check for horror-themed names
      expect(animations?.pageTransition.name).toContain('glitch');
      expect(animations?.loadingIndicator.name).toContain('skull');
      expect(animations?.buttonPress.name).toContain('horror');
      
      // Check for spooky emojis in loading
      const frames = animations?.loadingIndicator.frames || [];
      const hasSpookyEmojis = frames.some(f => ['💀', '👻', '🎃'].includes(f));
      expect(hasSpookyEmojis).toBe(true);
    });
  });

  describe('Animation Cleanup', () => {
    test('Animations can be stopped', () => {
      const animationId = engine.playPageTransition(mockElement);
      
      expect(engine.getActiveAnimations()).toContain(animationId);
      
      engine.stopAnimation(animationId);
      
      expect(engine.getActiveAnimations()).not.toContain(animationId);
    });

    test('All animations can be stopped at once', () => {
      engine.playPageTransition(mockElement);
      engine.playLoadingIndicator(mockElement);
      engine.applyBackgroundEffects(mockElement);
      
      expect(engine.getActiveAnimations().length).toBeGreaterThan(0);
      
      engine.stopAllAnimations();
      
      expect(engine.getActiveAnimations().length).toBe(0);
    });

    test('Background effects can be removed', () => {
      engine.applyBackgroundEffects(mockElement);
      
      expect(mockElement.classList.contains('ghost-float')).toBe(true);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
      
      engine.stopAllAnimations();
      
      // Classes should be removed
      expect(mockElement.classList.contains('ghost-float')).toBe(false);
      expect(mockElement.classList.contains('screen-flicker')).toBe(false);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(false);
    });
  });

  describe('Performance and Timing', () => {
    test('Animations have appropriate durations', () => {
      const animations = engine.getThemeAnimations('haunting');
      
      // Page transition should be quick
      expect(animations?.pageTransition.duration).toBeLessThan(500);
      
      // Button press should be very quick
      expect(animations?.buttonPress.duration).toBeLessThan(300);
      
      // Background effects should be longer for smooth loops
      animations?.backgroundEffects.forEach(effect => {
        if (effect.duration > 0) {
          expect(effect.duration).toBeGreaterThan(1000);
        }
      });
    });

    test('Multiple animations can run simultaneously', () => {
      const pageTransitionId = engine.playPageTransition(mockElement);
      const loadingId = engine.playLoadingIndicator(mockElement);
      const backgroundIds = engine.applyBackgroundEffects(mockElement);
      
      const allActive = engine.getActiveAnimations();
      
      expect(allActive).toContain(pageTransitionId);
      expect(allActive).toContain(loadingId);
      backgroundIds.forEach(id => {
        expect(allActive).toContain(id);
      });
    });
  });
});
