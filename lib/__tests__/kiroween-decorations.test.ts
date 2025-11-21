/**
 * Tests for Kiroween Decorative Elements
 * 
 * Requirements: 6.2, 7.1, 7.2, 7.3
 */

import {
  DecorativeElement,
  JACK_O_LANTERN,
  FLOATING_GHOST,
  FLYING_BAT,
  ASCII_CAT,
  SKULL_DECORATION,
  SPIDER_WEB,
  SPIDER,
  KIROWEEN_DECORATIONS,
  DEFAULT_KIROWEEN_DECORATIONS,
  getPositionStyles,
  getAnimationClassName,
  shouldRenderDecoration,
  getDecorationsForPosition,
  getFloatingDecorations,
  getCornerDecorations,
  toReactConfig,
  getAllDecorationsAsConfigs
} from '../kiroween-decorations';

describe('Kiroween Decorations', () => {
  describe('Decorative Elements', () => {
    // Requirement 7.1: Jack-o-lantern with flickering animation
    test('JACK_O_LANTERN has correct properties', () => {
      expect(JACK_O_LANTERN.id).toBe('jack-o-lantern');
      expect(JACK_O_LANTERN.type).toBe('emoji');
      expect(JACK_O_LANTERN.content).toBe('🎃');
      expect(JACK_O_LANTERN.position).toBe('corner');
      expect(JACK_O_LANTERN.animation).toBeDefined();
      expect(JACK_O_LANTERN.animation?.name).toBe('jack-o-lantern-flicker');
      expect(JACK_O_LANTERN.animation?.loop).toBe(true);
    });

    // Requirement 7.2: Floating ghost sprite with CSS animation
    test('FLOATING_GHOST has correct properties', () => {
      expect(FLOATING_GHOST.id).toBe('floating-ghost');
      expect(FLOATING_GHOST.type).toBe('emoji');
      expect(FLOATING_GHOST.content).toBe('👻');
      expect(FLOATING_GHOST.position).toBe('floating');
      expect(FLOATING_GHOST.animation).toBeDefined();
      expect(FLOATING_GHOST.animation?.type).toBe('css');
      expect(FLOATING_GHOST.animation?.cssClass).toBe('ghost-float-decoration');
      expect(FLOATING_GHOST.animation?.loop).toBe(true);
    });

    // Requirement 7.3: Flying bat sprite with CSS animation
    test('FLYING_BAT has correct properties', () => {
      expect(FLYING_BAT.id).toBe('flying-bat');
      expect(FLYING_BAT.type).toBe('emoji');
      expect(FLYING_BAT.content).toBe('🦇');
      expect(FLYING_BAT.position).toBe('floating');
      expect(FLYING_BAT.animation).toBeDefined();
      expect(FLYING_BAT.animation?.type).toBe('css');
      expect(FLYING_BAT.animation?.cssClass).toBe('bat-fly-decoration');
      expect(FLYING_BAT.animation?.loop).toBe(true);
    });

    // Requirement 7.3: Animated ASCII cat art with blinking eyes
    test('ASCII_CAT has correct properties and animation frames', () => {
      expect(ASCII_CAT.id).toBe('ascii-cat');
      expect(ASCII_CAT.type).toBe('ascii-art');
      expect(ASCII_CAT.position).toBe('header');
      expect(ASCII_CAT.animation).toBeDefined();
      expect(ASCII_CAT.animation?.type).toBe('ascii-frames');
      expect(ASCII_CAT.animation?.frames).toBeDefined();
      expect(ASCII_CAT.animation?.frames?.length).toBeGreaterThan(0);
      expect(ASCII_CAT.animation?.loop).toBe(true);
      
      // Check that frames contain cat ASCII art
      const firstFrame = ASCII_CAT.animation?.frames?.[0] || '';
      expect(firstFrame).toContain('/\\_/\\');
      expect(firstFrame).toContain('o.o');
    });

    test('Additional decorations are defined', () => {
      expect(SKULL_DECORATION.id).toBe('skull');
      expect(SPIDER_WEB.id).toBe('spider-web');
      expect(SPIDER.id).toBe('spider');
    });

    test('KIROWEEN_DECORATIONS contains all decorations', () => {
      expect(KIROWEEN_DECORATIONS).toContain(JACK_O_LANTERN);
      expect(KIROWEEN_DECORATIONS).toContain(FLOATING_GHOST);
      expect(KIROWEEN_DECORATIONS).toContain(FLYING_BAT);
      expect(KIROWEEN_DECORATIONS).toContain(ASCII_CAT);
      expect(KIROWEEN_DECORATIONS).toContain(SKULL_DECORATION);
      expect(KIROWEEN_DECORATIONS).toContain(SPIDER_WEB);
      expect(KIROWEEN_DECORATIONS).toContain(SPIDER);
    });

    test('DEFAULT_KIROWEEN_DECORATIONS contains core decorations', () => {
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(JACK_O_LANTERN);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(FLOATING_GHOST);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(FLYING_BAT);
      expect(DEFAULT_KIROWEEN_DECORATIONS).toContain(ASCII_CAT);
    });
  });

  describe('Positioning System', () => {
    test('getPositionStyles returns correct styles for header position', () => {
      const styles = getPositionStyles('header', 'medium');
      
      expect(styles.position).toBe('absolute');
      expect(styles.top).toBe('10px');
      expect(styles.left).toBe('50%');
      expect(styles.transform).toBe('translateX(-50%)');
      expect(styles.fontSize).toBe('2rem');
    });

    test('getPositionStyles returns correct styles for footer position', () => {
      const styles = getPositionStyles('footer', 'small');
      
      expect(styles.position).toBe('absolute');
      expect(styles.bottom).toBe('10px');
      expect(styles.left).toBe('50%');
      expect(styles.fontSize).toBe('1.5rem');
    });

    test('getPositionStyles returns correct styles for corner positions', () => {
      const topLeft = getPositionStyles('top-left');
      expect(topLeft.top).toBe('10px');
      expect(topLeft.left).toBe('10px');

      const topRight = getPositionStyles('top-right');
      expect(topRight.top).toBe('10px');
      expect(topRight.right).toBe('10px');

      const bottomLeft = getPositionStyles('bottom-left');
      expect(bottomLeft.bottom).toBe('10px');
      expect(bottomLeft.left).toBe('10px');

      const bottomRight = getPositionStyles('bottom-right');
      expect(bottomRight.bottom).toBe('10px');
      expect(bottomRight.right).toBe('10px');
    });

    test('getPositionStyles returns correct styles for floating position', () => {
      const styles = getPositionStyles('floating', 'large');
      
      expect(styles.position).toBe('absolute');
      expect(styles.top).toBe('50%');
      expect(styles.left).toBe('0');
      expect(styles.fontSize).toBe('3rem');
    });

    test('getPositionStyles handles different sizes', () => {
      const small = getPositionStyles('header', 'small');
      const medium = getPositionStyles('header', 'medium');
      const large = getPositionStyles('header', 'large');

      expect(small.fontSize).toBe('1.5rem');
      expect(medium.fontSize).toBe('2rem');
      expect(large.fontSize).toBe('3rem');
    });
  });

  describe('Animation Helpers', () => {
    test('getAnimationClassName returns CSS class when present', () => {
      const className = getAnimationClassName(FLOATING_GHOST);
      expect(className).toBe('ghost-float-decoration');
    });

    test('getAnimationClassName returns empty string when no animation', () => {
      const element: DecorativeElement = {
        id: 'test',
        type: 'emoji',
        content: '🎃',
        position: 'corner'
      };
      
      const className = getAnimationClassName(element);
      expect(className).toBe('');
    });

    test('getAnimationClassName returns empty string when no cssClass', () => {
      const element: DecorativeElement = {
        id: 'test',
        type: 'emoji',
        content: '🎃',
        position: 'corner',
        animation: {
          name: 'test',
          type: 'javascript',
          duration: 1000
        }
      };
      
      const className = getAnimationClassName(element);
      expect(className).toBe('');
    });
  });

  describe('Theme Filtering', () => {
    test('shouldRenderDecoration returns true for haunting theme', () => {
      const element: DecorativeElement = {
        id: 'test',
        type: 'emoji',
        content: '🎃',
        position: 'corner'
      };
      
      expect(shouldRenderDecoration(element, 'haunting')).toBe(true);
      expect(shouldRenderDecoration(element, 'kiroween')).toBe(true);
    });

    test('shouldRenderDecoration returns false for other themes', () => {
      const element: DecorativeElement = {
        id: 'test',
        type: 'emoji',
        content: '🎃',
        position: 'corner'
      };
      
      expect(shouldRenderDecoration(element, 'ceefax')).toBe(false);
      expect(shouldRenderDecoration(element, 'orf')).toBe(false);
      expect(shouldRenderDecoration(element, 'highcontrast')).toBe(false);
    });
  });

  describe('Position Filtering', () => {
    test('getDecorationsForPosition filters by position', () => {
      const headerDecorations = getDecorationsForPosition('header');
      expect(headerDecorations.every(d => d.position === 'header')).toBe(true);
      expect(headerDecorations).toContain(ASCII_CAT);

      const floatingDecorations = getDecorationsForPosition('floating');
      expect(floatingDecorations.every(d => d.position === 'floating')).toBe(true);
    });

    test('getFloatingDecorations returns only floating decorations', () => {
      const floating = getFloatingDecorations();
      expect(floating.every(d => d.position === 'floating')).toBe(true);
      expect(floating).toContain(FLOATING_GHOST);
      expect(floating).toContain(FLYING_BAT);
    });

    test('getCornerDecorations returns corner and corner-like decorations', () => {
      const corners = getCornerDecorations();
      const validPositions = ['corner', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
      
      expect(corners.every(d => validPositions.includes(d.position))).toBe(true);
      expect(corners).toContain(JACK_O_LANTERN);
    });
  });

  describe('React Config Helpers', () => {
    test('toReactConfig converts element to React config', () => {
      const config = toReactConfig(FLOATING_GHOST);
      
      expect(config.element).toBe(FLOATING_GHOST);
      expect(config.cssClass).toBe('ghost-float-decoration');
      expect(config.style).toBeDefined();
      expect(config.style?.position).toBe('absolute');
      expect(config.style?.zIndex).toBe(FLOATING_GHOST.zIndex);
    });

    test('getAllDecorationsAsConfigs converts all decorations', () => {
      const configs = getAllDecorationsAsConfigs();
      
      expect(configs.length).toBe(DEFAULT_KIROWEEN_DECORATIONS.length);
      expect(configs.every(c => c.element && c.style)).toBe(true);
    });

    test('toReactConfig includes zIndex when specified', () => {
      const element: DecorativeElement = {
        id: 'test',
        type: 'emoji',
        content: '🎃',
        position: 'corner',
        zIndex: 99
      };
      
      const config = toReactConfig(element);
      expect(config.style?.zIndex).toBe(99);
    });
  });

  describe('Animation Frame Content', () => {
    test('ASCII_CAT frames show different eye states', () => {
      const frames = ASCII_CAT.animation?.frames || [];
      
      // Should have multiple frames
      expect(frames.length).toBeGreaterThan(1);
      
      // Check for different eye states in frames
      const hasOpenEyes = frames.some(f => f.includes('o.o'));
      const hasWinkLeft = frames.some(f => f.includes('-.o'));
      const hasWinkRight = frames.some(f => f.includes('o.-'));
      const hasClosedEyes = frames.some(f => f.includes('-.-'));
      
      expect(hasOpenEyes).toBe(true);
      expect(hasWinkLeft).toBe(true);
      expect(hasWinkRight).toBe(true);
      expect(hasClosedEyes).toBe(true);
    });

    test('All ASCII frames contain cat structure', () => {
      const frames = ASCII_CAT.animation?.frames || [];
      
      frames.forEach(frame => {
        expect(frame).toContain('/\\_/\\');  // Ears
        expect(frame).toContain('> ^ <');   // Mouth
      });
    });
  });
});
