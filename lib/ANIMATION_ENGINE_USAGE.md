# Animation Engine Usage Guide

The Animation Engine provides a comprehensive system for managing theme-specific animations, CSS class application, JavaScript keyframe animations, and ASCII frame-by-frame animations for the Modern Teletext interface.

## Overview

The Animation Engine supports three types of animations:
1. **CSS Animations** - Class-based animations defined in CSS
2. **JavaScript Animations** - Keyframe animations using Web Animations API
3. **ASCII Frame Animations** - Frame-by-frame text animations

## Basic Usage

### Getting the Engine Instance

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';

const engine = getAnimationEngine();
```

### Setting the Theme

```typescript
// Set theme to change animation styles
engine.setTheme('ceefax');    // Classic BBC Ceefax
engine.setTheme('haunting');  // Halloween/Kiroween theme
engine.setTheme('high-contrast'); // Accessibility theme
engine.setTheme('orf');       // ORF Austrian theme
```

### Playing Animations

#### Convenience Methods

```typescript
// Play page transition
const transitionId = engine.playPageTransition(element);

// Play loading indicator (loops automatically)
const loadingId = engine.playLoadingIndicator(element);

// Play button press animation
const buttonId = engine.playButtonPress(element);

// Play text entry cursor animation (loops automatically)
const cursorId = engine.playTextEntry(element);

// Apply all background effects for current theme
const effectIds = engine.applyBackgroundEffects(container);
```

#### Playing by Name

```typescript
// Play a specific animation by name
const animationId = engine.playAnimation('horizontal-wipe', element);

// Play with loop option
const loopingId = engine.playAnimation('rotating-line', element, { loop: true });
```

### Stopping Animations

```typescript
// Stop a specific animation
engine.stopAnimation(animationId);

// Stop all active animations
engine.stopAllAnimations();
```

### Checking Active Animations

```typescript
// Get all active animation IDs
const activeIds = engine.getActiveAnimations();
console.log(`${activeIds.length} animations running`);
```

## Advanced Usage

### Registering Custom Animations

#### CSS Animation

```typescript
import { AnimationConfig } from '@/lib/animation-engine';

const customAnimation: AnimationConfig = {
  name: 'my-fade',
  type: 'css',
  duration: 500,
  cssClass: 'my-fade-class',
  easing: 'ease-in-out'
};

engine.registerAnimation('my-fade', customAnimation);
```

#### JavaScript Keyframe Animation

```typescript
const slideAnimation: AnimationConfig = {
  name: 'slide-in',
  type: 'javascript',
  duration: 400,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  keyframes: [
    { transform: 'translateX(-100%)', opacity: '0' },
    { transform: 'translateX(0)', opacity: '1' }
  ]
};

const animationId = engine.playAnimationConfig(slideAnimation, element);
```

#### ASCII Frame Animation

```typescript
const spinnerAnimation: AnimationConfig = {
  name: 'spinner',
  type: 'ascii-frames',
  duration: 1000,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  loop: true
};

const spinnerId = engine.playAnimationConfig(spinnerAnimation, element, { loop: true });
```

### Registering Custom Theme Animation Sets

```typescript
import { ThemeAnimationSet } from '@/lib/animation-engine';

const myTheme: ThemeAnimationSet = {
  pageTransition: {
    name: 'my-transition',
    type: 'css',
    duration: 300,
    cssClass: 'my-transition'
  },
  loadingIndicator: {
    name: 'my-loader',
    type: 'ascii-frames',
    duration: 800,
    frames: ['◐', '◓', '◑', '◒'],
    loop: true
  },
  buttonPress: {
    name: 'my-button',
    type: 'css',
    duration: 150,
    cssClass: 'my-button-press'
  },
  textEntry: {
    name: 'my-cursor',
    type: 'css',
    duration: 500,
    cssClass: 'my-cursor-blink',
    loop: true
  },
  backgroundEffects: [
    {
      name: 'my-background',
      type: 'css',
      duration: 0,
      cssClass: 'my-bg-effect',
      loop: true
    }
  ],
  decorativeElements: [
    {
      name: 'my-decoration',
      type: 'ascii-frames',
      duration: 2000,
      frames: ['✨', '⭐', '✨'],
      loop: true
    }
  ]
};

engine.registerThemeAnimations('my-theme', myTheme);
engine.setTheme('my-theme');
```

## Built-in Themes

### Ceefax Theme
- **Page Transition**: Horizontal wipe (300ms)
- **Loading**: Rotating line `| / ─ \`
- **Button Press**: Flash effect (150ms)
- **Text Entry**: Blinking cursor (500ms)
- **Background**: Scanlines overlay

### Haunting Theme (Kiroween)
- **Page Transition**: Glitch effect with chromatic aberration (400ms)
- **Loading**: Pulsing skull/ghost `💀 👻 💀 🎃`
- **Button Press**: Horror flash with red tint (200ms)
- **Text Entry**: Glitching cursor (300ms)
- **Background**: Floating ghosts, screen flicker, chromatic aberration
- **Decorations**: Jack-o'-lanterns, floating bats

### High Contrast Theme
- **Page Transition**: Simple fade (250ms)
- **Loading**: Smooth braille spinner
- **Button Press**: Simple flash (150ms)
- **Text Entry**: Steady cursor (500ms)
- **Background**: None (accessibility)

### ORF Theme
- **Page Transition**: Slide transition (300ms)
- **Loading**: Rotating dots
- **Button Press**: Color flash (150ms)
- **Text Entry**: Color cursor (500ms)
- **Background**: Color-cycling header

## React Component Example

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { getAnimationEngine } from '@/lib/animation-engine';

export function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [animationId, setAnimationId] = useState<string>('');

  useEffect(() => {
    const engine = getAnimationEngine();
    engine.setTheme('ceefax');

    if (elementRef.current) {
      // Play page transition on mount
      const id = engine.playPageTransition(elementRef.current);
      setAnimationId(id);
    }

    // Cleanup on unmount
    return () => {
      if (animationId) {
        engine.stopAnimation(animationId);
      }
    };
  }, []);

  const handleButtonClick = () => {
    const engine = getAnimationEngine();
    if (elementRef.current) {
      engine.playButtonPress(elementRef.current);
    }
  };

  return (
    <div ref={elementRef}>
      <button onClick={handleButtonClick}>
        Animated Button
      </button>
    </div>
  );
}
```

## Loading Indicator Example

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { getAnimationEngine } from '@/lib/animation-engine';

export function LoadingSpinner() {
  const spinnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const engine = getAnimationEngine();
    let animationId: string;

    if (spinnerRef.current) {
      animationId = engine.playLoadingIndicator(spinnerRef.current);
    }

    return () => {
      if (animationId) {
        engine.stopAnimation(animationId);
      }
    };
  }, []);

  return (
    <div className="loading-container">
      <span ref={spinnerRef}>Loading...</span>
    </div>
  );
}
```

## Theme Switcher Example

```typescript
'use client';

import { getAnimationEngine } from '@/lib/animation-engine';

export function ThemeSwitcher() {
  const handleThemeChange = (theme: string) => {
    const engine = getAnimationEngine();
    
    // Stop all current animations
    engine.stopAllAnimations();
    
    // Switch theme
    engine.setTheme(theme);
    
    // Apply new theme's background effects
    const container = document.getElementById('main-container');
    if (container) {
      engine.applyBackgroundEffects(container);
    }
  };

  return (
    <div>
      <button onClick={() => handleThemeChange('ceefax')}>Ceefax</button>
      <button onClick={() => handleThemeChange('haunting')}>Haunting</button>
      <button onClick={() => handleThemeChange('high-contrast')}>High Contrast</button>
      <button onClick={() => handleThemeChange('orf')}>ORF</button>
    </div>
  );
}
```

## Performance Considerations

1. **Use CSS animations when possible** - They're GPU-accelerated and more performant
2. **Limit simultaneous animations** - Too many animations can impact performance
3. **Clean up animations** - Always stop animations when components unmount
4. **Use loop option wisely** - Looping animations should be stopped when no longer needed
5. **Avoid animating layout properties** - Stick to `transform` and `opacity` for best performance

## Accessibility

The Animation Engine respects user preferences:

```typescript
// Check for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Use high-contrast theme or disable animations
  engine.setTheme('high-contrast');
}
```

## Testing

```typescript
import { resetAnimationEngine, getAnimationEngine } from '@/lib/animation-engine';

describe('My Component', () => {
  beforeEach(() => {
    resetAnimationEngine();
  });

  it('should play animation', () => {
    const engine = getAnimationEngine();
    const element = document.createElement('div');
    
    const animationId = engine.playPageTransition(element);
    expect(animationId).toBeTruthy();
    
    engine.stopAnimation(animationId);
  });
});
```

## Requirements Satisfied

- **5.1**: Ceefax theme animations (scan-lines, page transitions)
- **5.2**: Haunting Mode animations (glitch effects, floating ghosts/bats)
- **5.3**: High Contrast theme animations (smooth fades)
- **5.4**: ORF theme animations (color-cycling effects)
- **5.5**: Different page transition animations per theme
- **6.1**: Animated elements on every page
- **10.1**: Animated transitions between pages (200-400ms)
