/**
 * Kiroween Decorative Elements
 * 
 * Implements Halloween-themed decorative elements for the Haunting/Kiroween theme
 * including jack-o-lanterns, floating ghosts, flying bats, and animated ASCII cat art.
 * 
 * Requirements: 6.2, 7.1, 7.2, 7.3
 */

import { AnimationConfig } from './animation-engine';

// ============================================================================
// Type Definitions
// ============================================================================

export type DecorativeElementType = 'ascii-art' | 'emoji' | 'symbol';
export type DecorativePosition = 'header' | 'footer' | 'corner' | 'floating' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DecorativeElement {
  id: string;
  type: DecorativeElementType;
  content: string | string[];  // String or animation frames
  position: DecorativePosition;
  animation?: AnimationConfig;
  zIndex?: number;
  size?: 'small' | 'medium' | 'large';
}

export interface DecorativeElementConfig {
  element: DecorativeElement;
  cssClass?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// Kiroween Decorative Elements
// ============================================================================

/**
 * Jack-o-lantern with flickering animation
 * Requirement: 7.1
 */
export const JACK_O_LANTERN: DecorativeElement = {
  id: 'jack-o-lantern',
  type: 'emoji',
  content: '🎃',
  position: 'corner',
  size: 'medium',
  zIndex: 10,
  animation: {
    name: 'jack-o-lantern-flicker',
    type: 'ascii-frames',
    duration: 1500,
    frames: [
      '🎃',  // Normal
      '🎃',  // Normal
      '🎃',  // Normal
      '🎃',  // Flicker (same but will have opacity change in CSS)
      '🎃',  // Normal
      '🎃',  // Normal
      '🎃',  // Flicker
      '🎃'   // Normal
    ],
    loop: true
  }
};

/**
 * Floating ghost sprite with CSS animation
 * Requirement: 7.2
 */
export const FLOATING_GHOST: DecorativeElement = {
  id: 'floating-ghost',
  type: 'emoji',
  content: '👻',
  position: 'floating',
  size: 'medium',
  zIndex: 5,
  animation: {
    name: 'ghost-float',
    type: 'css',
    duration: 12000,
    cssClass: 'ghost-float-decoration',
    loop: true
  }
};

/**
 * Flying bat sprite with CSS animation
 * Requirement: 7.3
 */
export const FLYING_BAT: DecorativeElement = {
  id: 'flying-bat',
  type: 'emoji',
  content: '🦇',
  position: 'floating',
  size: 'small',
  zIndex: 5,
  animation: {
    name: 'bat-fly',
    type: 'css',
    duration: 10000,
    cssClass: 'bat-fly-decoration',
    loop: true
  }
};

/**
 * Animated ASCII cat art with blinking eyes
 * Requirement: 7.3
 */
export const ASCII_CAT: DecorativeElement = {
  id: 'ascii-cat',
  type: 'ascii-art',
  content: [
    // Frame 1: Eyes open
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
    // Frame 2: Left eye wink
    '  /\\_/\\  \n ( -.o ) \n  > ^ <  ',
    // Frame 3: Eyes open
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
    // Frame 4: Right eye wink
    '  /\\_/\\  \n ( o.- ) \n  > ^ <  ',
    // Frame 5: Eyes open
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
    // Frame 6: Both eyes closed
    '  /\\_/\\  \n ( -.- ) \n  > ^ <  ',
    // Frame 7: Eyes open
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
    // Frame 8: Eyes open (hold)
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  '
  ],
  position: 'header',
  size: 'small',
  zIndex: 10,
  animation: {
    name: 'cat-blink',
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
  }
};

/**
 * Additional spooky decorations
 */
export const SKULL_DECORATION: DecorativeElement = {
  id: 'skull',
  type: 'emoji',
  content: '💀',
  position: 'corner',
  size: 'small',
  zIndex: 10,
  animation: {
    name: 'skull-pulse',
    type: 'css',
    duration: 2000,
    cssClass: 'skull-pulse-decoration',
    loop: true
  }
};

export const SPIDER_WEB: DecorativeElement = {
  id: 'spider-web',
  type: 'emoji',
  content: '🕸️',
  position: 'top-right',
  size: 'medium',
  zIndex: 8
};

export const SPIDER: DecorativeElement = {
  id: 'spider',
  type: 'emoji',
  content: '🕷️',
  position: 'top-right',
  size: 'small',
  zIndex: 9,
  animation: {
    name: 'spider-crawl',
    type: 'css',
    duration: 3000,
    cssClass: 'spider-crawl-decoration',
    loop: true
  }
};

// ============================================================================
// Decorative Element Collections
// ============================================================================

/**
 * All available Kiroween decorative elements
 */
export const KIROWEEN_DECORATIONS: DecorativeElement[] = [
  JACK_O_LANTERN,
  FLOATING_GHOST,
  FLYING_BAT,
  ASCII_CAT,
  SKULL_DECORATION,
  SPIDER_WEB,
  SPIDER
];

/**
 * Default decorations for Kiroween theme
 */
export const DEFAULT_KIROWEEN_DECORATIONS: DecorativeElement[] = [
  JACK_O_LANTERN,
  FLOATING_GHOST,
  FLYING_BAT,
  ASCII_CAT
];

// ============================================================================
// Positioning System
// ============================================================================

/**
 * Get CSS positioning styles for a decorative element based on its position type
 */
export function getPositionStyles(position: DecorativePosition, size: 'small' | 'medium' | 'large' = 'medium'): React.CSSProperties {
  const sizeMap = {
    small: '1.5rem',
    medium: '2rem',
    large: '3rem'
  };

  const fontSize = sizeMap[size];

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    fontSize,
    pointerEvents: 'none',
    userSelect: 'none'
  };

  switch (position) {
    case 'header':
      return {
        ...baseStyles,
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)'
      };

    case 'footer':
      return {
        ...baseStyles,
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)'
      };

    case 'corner':
    case 'top-left':
      return {
        ...baseStyles,
        top: '10px',
        left: '10px'
      };

    case 'top-right':
      return {
        ...baseStyles,
        top: '10px',
        right: '10px'
      };

    case 'bottom-left':
      return {
        ...baseStyles,
        bottom: '10px',
        left: '10px'
      };

    case 'bottom-right':
      return {
        ...baseStyles,
        bottom: '10px',
        right: '10px'
      };

    case 'floating':
      return {
        ...baseStyles,
        top: '50%',
        left: '0',
        transform: 'translateY(-50%)'
      };

    default:
      return baseStyles;
  }
}

/**
 * Get CSS class name for a decorative element's animation
 */
export function getAnimationClassName(element: DecorativeElement): string {
  if (!element.animation || !element.animation.cssClass) {
    return '';
  }
  return element.animation.cssClass;
}

/**
 * Check if an element should be rendered based on theme
 */
export function shouldRenderDecoration(element: DecorativeElement, theme: string): boolean {
  // Only render Kiroween decorations when haunting theme is active
  return theme === 'haunting' || theme === 'kiroween';
}

/**
 * Get decorations for a specific position
 */
export function getDecorationsForPosition(position: DecorativePosition, decorations: DecorativeElement[] = DEFAULT_KIROWEEN_DECORATIONS): DecorativeElement[] {
  return decorations.filter(d => d.position === position);
}

/**
 * Get all floating decorations
 */
export function getFloatingDecorations(decorations: DecorativeElement[] = DEFAULT_KIROWEEN_DECORATIONS): DecorativeElement[] {
  return decorations.filter(d => d.position === 'floating');
}

/**
 * Get all corner decorations
 */
export function getCornerDecorations(decorations: DecorativeElement[] = DEFAULT_KIROWEEN_DECORATIONS): DecorativeElement[] {
  return decorations.filter(d => 
    d.position === 'corner' || 
    d.position === 'top-left' || 
    d.position === 'top-right' || 
    d.position === 'bottom-left' || 
    d.position === 'bottom-right'
  );
}

// ============================================================================
// React Component Helpers
// ============================================================================

/**
 * Convert decorative element to React-compatible config
 */
export function toReactConfig(element: DecorativeElement): DecorativeElementConfig {
  const style = getPositionStyles(element.position, element.size);
  
  if (element.zIndex) {
    style.zIndex = element.zIndex;
  }

  return {
    element,
    cssClass: getAnimationClassName(element),
    style
  };
}

/**
 * Get all decorations as React configs
 */
export function getAllDecorationsAsConfigs(decorations: DecorativeElement[] = DEFAULT_KIROWEEN_DECORATIONS): DecorativeElementConfig[] {
  return decorations.map(toReactConfig);
}
