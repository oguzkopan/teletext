# Animation Engine API Reference

## Overview

The Animation Engine manages all CSS and JavaScript animations, coordinates theme-specific animation sets, handles frame-by-frame ASCII art animations, and controls transition effects between pages.

**Location**: `lib/animation-engine.ts`

## Class: AnimationEngine

### Constructor

```typescript
constructor()
```

Creates a new AnimationEngine instance with default theme animations loaded.

**Example:**
```typescript
import { AnimationEngine } from '@/lib/animation-engine';

const animationEngine = new AnimationEngine();
```

## Methods

### setTheme

```typescript
setTheme(themeName: string): void
```

Sets the active theme and loads its animation set.

**Parameters:**
- `themeName` (string): Theme name ('ceefax', 'haunting', 'high-contrast', 'orf')

**Example:**
```typescript
animationEngine.setTheme('haunting');
// Loads Haunting theme animations (glitch, pulsing skull, etc.)
```

### playAnimation

```typescript
playAnimation(
  name: string,
  target: HTMLElement,
  options?: AnimationPlayOptions
): string
```

Plays an animation on the specified element.

**Parameters:**
- `name` (string): Animation name (e.g., 'page-transition', 'button-press')
- `target` (HTMLElement): Element to animate
- `options` (AnimationPlayOptions, optional): Animation options

**Returns:** string - Animation ID for tracking/stopping

**Example:**
```typescript
const animationId = animationEngine.playAnimation(
  'page-transition',
  document.querySelector('.teletext-screen'),
  { duration: 300, easing: 'ease-in-out' }
);
```

### stopAnimation

```typescript
stopAnimation(animationId: string): void
```

Stops a running animation.

**Parameters:**
- `animationId` (string): Animation ID returned from playAnimation

**Example:**
```typescript
const animationId = animationEngine.playAnimation('loading', element);

// Later...
animationEngine.stopAnimation(animationId);
```

### registerAnimation

```typescript
registerAnimation(
  name: string,
  config: AnimationConfig
): void
```

Registers a custom animation.

**Parameters:**
- `name` (string): Unique animation name
- `config` (AnimationConfig): Animation configuration

**Example:**
```typescript
animationEngine.registerAnimation('my-custom-animation', {
  name: 'my-custom-animation',
  type: 'css',
  duration: 500,
  cssClass: 'my-animation-class',
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
});
```

### getThemeAnimations

```typescript
getThemeAnimations(themeName: string): ThemeAnimationSet
```

Gets the animation set for a specific theme.

**Parameters:**
- `themeName` (string): Theme name

**Returns:** ThemeAnimationSet - Complete animation set for the theme

**Example:**
```typescript
const animations = animationEngine.getThemeAnimations('ceefax');
console.log(animations.pageTransition);  // Horizontal wipe config
console.log(animations.loadingIndicator); // Rotating line config
```

### playPageTransition

```typescript
playPageTransition(
  element: HTMLElement,
  direction?: 'forward' | 'backward'
): Promise<void>
```

Plays the current theme's page transition animation.

**Parameters:**
- `element` (HTMLElement): Element to animate
- `direction` ('forward' | 'backward', optional): Transition direction

**Returns:** Promise<void> - Resolves when animation completes

**Example:**
```typescript
await animationEngine.playPageTransition(
  document.querySelector('.teletext-screen'),
  'forward'
);
// Page transition complete
```

### playLoadingAnimation

```typescript
playLoadingAnimation(element: HTMLElement): string
```

Plays the current theme's loading animation.

**Parameters:**
- `element` (HTMLElement): Element to show loading animation in

**Returns:** string - Animation ID

**Example:**
```typescript
const loadingId = animationEngine.playLoadingAnimation(
  document.querySelector('.loading-container')
);

// When loading completes
animationEngine.stopAnimation(loadingId);
```

### playButtonPressAnimation

```typescript
playButtonPressAnimation(button: HTMLElement): Promise<void>
```

Plays the current theme's button press animation.

**Parameters:**
- `button` (HTMLElement): Button element to animate

**Returns:** Promise<void> - Resolves when animation completes

**Example:**
```typescript
button.addEventListener('click', async () => {
  await animationEngine.playButtonPressAnimation(button);
  // Handle button action
});
```

## Types

### AnimationConfig

```typescript
interface AnimationConfig {
  name: string;                    // Unique animation name
  type: 'css' | 'javascript' | 'ascii-frames';
  duration: number;                // Duration in milliseconds
  easing?: string;                 // CSS easing function
  frames?: string[];               // For ASCII art animations
  cssClass?: string;               // CSS class to apply
  keyframes?: Keyframe[];          // JavaScript keyframes
}
```

### ThemeAnimationSet

```typescript
interface ThemeAnimationSet {
  pageTransition: AnimationConfig;      // Page change animation
  loadingIndicator: AnimationConfig;    // Loading animation
  buttonPress: AnimationConfig;         // Button press feedback
  textEntry: AnimationConfig;           // Text input animation
  backgroundEffects: AnimationConfig[]; // Background effects
  decorativeElements: AnimationConfig[]; // Decorative animations
}
```

### AnimationPlayOptions

```typescript
interface AnimationPlayOptions {
  duration?: number;               // Override default duration
  easing?: string;                 // Override default easing
  delay?: number;                  // Delay before starting (ms)
  iterations?: number;             // Number of iterations (default: 1)
  direction?: 'normal' | 'reverse' | 'alternate';
}
```

## Theme Animation Sets

### Ceefax Theme

```typescript
const CEEFAX_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'horizontal-wipe',
    type: 'css',
    duration: 300,
    cssClass: 'ceefax-wipe'
  },
  loadingIndicator: {
    name: 'rotating-line',
    type: 'ascii-frames',
    duration: 1000,
    frames: ['|', '/', '─', '\\']
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
    cssClass: 'cursor-blink'
  },
  backgroundEffects: [
    {
      name: 'scanlines',
      type: 'css',
      duration: 0,  // Continuous
      cssClass: 'scanlines-overlay'
    }
  ],
  decorativeElements: []
};
```

### Haunting Theme

```typescript
const HAUNTING_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'glitch-transition',
    type: 'javascript',
    duration: 400,
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
    frames: ['💀', '👻', '💀', '🎃']
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
    cssClass: 'glitch-cursor'
  },
  backgroundEffects: [
    {
      name: 'floating-ghosts',
      type: 'css',
      duration: 10000,
      cssClass: 'ghost-float'
    },
    {
      name: 'screen-flicker',
      type: 'css',
      duration: 5000,
      cssClass: 'screen-flicker'
    },
    {
      name: 'chromatic-aberration',
      type: 'css',
      duration: 0,
      cssClass: 'chromatic-aberration'
    }
  ],
  decorativeElements: [
    {
      name: 'jack-o-lantern',
      type: 'ascii-frames',
      duration: 1000,
      frames: ['🎃', '🎃', '🎃']
    },
    {
      name: 'floating-bat',
      type: 'css',
      duration: 8000,
      cssClass: 'bat-float'
    }
  ]
};
```

## Usage Examples

### Basic Animation

```typescript
import { AnimationEngine } from '@/lib/animation-engine';

const animationEngine = new AnimationEngine();

// Set theme
animationEngine.setTheme('ceefax');

// Play page transition
const element = document.querySelector('.page');
await animationEngine.playPageTransition(element, 'forward');
```

### Custom Animation

```typescript
// Register custom animation
animationEngine.registerAnimation('pulse', {
  name: 'pulse',
  type: 'css',
  duration: 1000,
  cssClass: 'pulse-animation'
});

// Play custom animation
animationEngine.playAnimation('pulse', element);
```

### ASCII Frame Animation

```typescript
// Register ASCII animation
animationEngine.registerAnimation('spinner', {
  name: 'spinner',
  type: 'ascii-frames',
  duration: 1000,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
});

// Play ASCII animation
const spinnerId = animationEngine.playAnimation('spinner', element);

// Stop when done
setTimeout(() => {
  animationEngine.stopAnimation(spinnerId);
}, 5000);
```

### Theme-Specific Animations

```typescript
// Switch to Haunting theme
animationEngine.setTheme('haunting');

// Play theme-specific loading animation
const loadingId = animationEngine.playLoadingAnimation(element);
// Shows pulsing skull animation

// Switch to Ceefax theme
animationEngine.setTheme('ceefax');

// Play theme-specific loading animation
const loadingId2 = animationEngine.playLoadingAnimation(element);
// Shows rotating line animation
```

### Button Press Feedback

```typescript
const buttons = document.querySelectorAll('.teletext-button');

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    await animationEngine.playButtonPressAnimation(button);
    // Button animation complete, handle action
    handleButtonClick(button);
  });
});
```

### Background Effects

```typescript
// Get current theme animations
const animations = animationEngine.getThemeAnimations('haunting');

// Apply background effects
animations.backgroundEffects.forEach(effect => {
  const effectId = animationEngine.playAnimation(
    effect.name,
    document.body
  );
});
```

## Best Practices

### 1. Use Theme Animations

```typescript
// Good - Uses theme-specific animations
await animationEngine.playPageTransition(element);

// Avoid - Hardcoded animation
element.classList.add('fade-transition');
```

### 2. Clean Up Animations

```typescript
// Good - Stop animations when component unmounts
useEffect(() => {
  const animationId = animationEngine.playAnimation('loading', element);
  
  return () => {
    animationEngine.stopAnimation(animationId);
  };
}, []);

// Avoid - Leaving animations running
animationEngine.playAnimation('loading', element);
// Component unmounts, animation still running
```

### 3. Respect User Preferences

```typescript
import { shouldReduceMotion } from '@/lib/animation-accessibility';

if (!shouldReduceMotion()) {
  await animationEngine.playPageTransition(element);
} else {
  // Skip animation
  element.style.opacity = '1';
}
```

### 4. Use Appropriate Animation Types

```typescript
// Good - CSS for simple animations
animationEngine.registerAnimation('fade', {
  type: 'css',
  cssClass: 'fade-animation'
});

// Good - JavaScript for complex animations
animationEngine.registerAnimation('complex', {
  type: 'javascript',
  keyframes: [/* complex keyframes */]
});

// Good - ASCII frames for character animations
animationEngine.registerAnimation('spinner', {
  type: 'ascii-frames',
  frames: ['|', '/', '-', '\\']
});
```

## Performance Considerations

### GPU Acceleration

```typescript
// Use transform and opacity for GPU acceleration
animationEngine.registerAnimation('slide', {
  name: 'slide',
  type: 'css',
  duration: 300,
  cssClass: 'slide-animation'  // Uses transform
});

// Avoid animating layout properties
// Bad: width, height, top, left
// Good: transform, opacity
```

### Animation Throttling

```typescript
// Limit concurrent animations
const MAX_CONCURRENT_ANIMATIONS = 5;
let activeAnimations = 0;

function playAnimationThrottled(name: string, element: HTMLElement) {
  if (activeAnimations >= MAX_CONCURRENT_ANIMATIONS) {
    console.warn('Too many concurrent animations');
    return;
  }
  
  activeAnimations++;
  const id = animationEngine.playAnimation(name, element);
  
  setTimeout(() => {
    activeAnimations--;
  }, animationEngine.getAnimationDuration(name));
  
  return id;
}
```

### Frame Rate Monitoring

```typescript
import { monitorFrameRate } from '@/lib/animation-performance';

// Monitor frame rate during animations
const monitor = monitorFrameRate((fps) => {
  if (fps < 30) {
    console.warn('Low frame rate detected:', fps);
    // Reduce animation complexity
  }
});

await animationEngine.playPageTransition(element);
monitor.stop();
```

## Testing

### Unit Tests

```typescript
import { AnimationEngine } from '@/lib/animation-engine';

describe('AnimationEngine', () => {
  let animationEngine: AnimationEngine;
  
  beforeEach(() => {
    animationEngine = new AnimationEngine();
  });
  
  it('should set theme correctly', () => {
    animationEngine.setTheme('haunting');
    const animations = animationEngine.getThemeAnimations('haunting');
    expect(animations.pageTransition.name).toBe('glitch-transition');
  });
  
  it('should register custom animation', () => {
    animationEngine.registerAnimation('test', {
      name: 'test',
      type: 'css',
      duration: 300,
      cssClass: 'test-animation'
    });
    
    const element = document.createElement('div');
    const id = animationEngine.playAnimation('test', element);
    expect(id).toBeDefined();
  });
  
  it('should stop animation', () => {
    const element = document.createElement('div');
    const id = animationEngine.playAnimation('fade', element);
    
    animationEngine.stopAnimation(id);
    expect(element.classList.contains('fade-animation')).toBe(false);
  });
});
```

## Troubleshooting

### Animation Not Playing

**Problem:** Animation doesn't start or complete.

**Solution:**
```typescript
// Check if element exists
if (!element) {
  console.error('Element not found');
  return;
}

// Check if animation is registered
const animations = animationEngine.getThemeAnimations(currentTheme);
if (!animations.pageTransition) {
  console.error('Animation not found');
  return;
}

// Check for CSS class
const config = animations.pageTransition;
if (config.type === 'css' && !config.cssClass) {
  console.error('CSS class not defined');
  return;
}
```

### Animation Stuttering

**Problem:** Animation is choppy or stutters.

**Solution:**
```typescript
// Use GPU-accelerated properties
// Good
.my-animation {
  transform: translateX(100px);
  opacity: 0;
}

// Bad
.my-animation {
  left: 100px;  // Causes reflow
  width: 200px; // Causes reflow
}

// Add will-change for critical animations
.critical-animation {
  will-change: transform, opacity;
}
```

### Memory Leaks

**Problem:** Animations continue after component unmounts.

**Solution:**
```typescript
useEffect(() => {
  const animationIds: string[] = [];
  
  // Track all animations
  const id1 = animationEngine.playAnimation('anim1', element1);
  const id2 = animationEngine.playAnimation('anim2', element2);
  animationIds.push(id1, id2);
  
  // Clean up on unmount
  return () => {
    animationIds.forEach(id => {
      animationEngine.stopAnimation(id);
    });
  };
}, []);
```

## See Also

- [LAYOUT_MANAGER_API.md](./LAYOUT_MANAGER_API.md) - Layout Manager API
- [ADDING_ANIMATIONS.md](./ADDING_ANIMATIONS.md) - Guide for adding animations
- [ANIMATION_LIBRARY_DOCUMENTATION.md](./ANIMATION_LIBRARY_DOCUMENTATION.md) - Complete animation library
- [lib/ANIMATION_ENGINE_USAGE.md](./lib/ANIMATION_ENGINE_USAGE.md) - Usage examples
