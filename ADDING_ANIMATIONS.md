# Guide for Adding New Animations

## Overview

This guide explains how to add new animations to Modern Teletext, including CSS animations, JavaScript animations, and ASCII frame-by-frame animations.

## Animation Types

### 1. CSS Animations
Best for simple, performant animations using CSS keyframes.

**Pros:**
- GPU accelerated
- Performant
- Easy to implement
- Browser-optimized

**Cons:**
- Limited control
- Less dynamic

**Use for:**
- Page transitions
- Button effects
- Loading indicators
- Background effects

### 2. JavaScript Animations
Best for complex, dynamic animations requiring programmatic control.

**Pros:**
- Full control
- Dynamic parameters
- Complex timing
- Event-driven

**Cons:**
- More CPU intensive
- Requires careful optimization

**Use for:**
- Interactive animations
- Data-driven animations
- Complex sequences
- Physics-based effects

### 3. ASCII Frame Animations
Best for character-based animations in the teletext grid.

**Pros:**
- Authentic teletext feel
- Simple to create
- Low overhead

**Cons:**
- Limited to character grid
- Frame-based (not smooth)

**Use for:**
- Loading spinners
- Character effects
- Decorative elements
- Retro effects

## Adding a CSS Animation

### Step 1: Define CSS Keyframes

Create keyframes in your CSS file:

```css
/* app/animations.css */

@keyframes myCustomAnimation {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.my-custom-animation {
  animation: myCustomAnimation 300ms ease-out;
}
```

### Step 2: Register Animation

Register the animation with the Animation Engine:

```typescript
// lib/my-animations.ts

import { AnimationEngine } from '@/lib/animation-engine';

export function registerMyAnimations(engine: AnimationEngine) {
  engine.registerAnimation('my-custom', {
    name: 'my-custom',
    type: 'css',
    duration: 300,
    cssClass: 'my-custom-animation',
    easing: 'ease-out'
  });
}
```

### Step 3: Use Animation

Use the animation in your components:

```typescript
import { AnimationEngine } from '@/lib/animation-engine';

const animationEngine = new AnimationEngine();

// Play animation
animationEngine.playAnimation('my-custom', element);
```

## Adding a JavaScript Animation

### Step 1: Define Keyframes

Create keyframe configuration:

```typescript
// lib/my-animations.ts

const MY_ANIMATION_KEYFRAMES: Keyframe[] = [
  {
    offset: 0,
    opacity: '0',
    transform: 'scale(0.8) rotate(0deg)',
    filter: 'blur(5px)'
  },
  {
    offset: 0.5,
    opacity: '0.5',
    transform: 'scale(1.1) rotate(180deg)',
    filter: 'blur(2px)'
  },
  {
    offset: 1,
    opacity: '1',
    transform: 'scale(1) rotate(360deg)',
    filter: 'blur(0px)'
  }
];
```

### Step 2: Register Animation

```typescript
export function registerMyAnimations(engine: AnimationEngine) {
  engine.registerAnimation('my-js-animation', {
    name: 'my-js-animation',
    type: 'javascript',
    duration: 600,
    keyframes: MY_ANIMATION_KEYFRAMES,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  });
}
```

### Step 3: Use Animation

```typescript
// Play JavaScript animation
await animationEngine.playAnimation('my-js-animation', element);
// Animation complete
```

## Adding an ASCII Frame Animation

### Step 1: Define Frames

Create ASCII art frames:

```typescript
// lib/my-animations.ts

const SPINNER_FRAMES = [
  '⠋',
  '⠙',
  '⠹',
  '⠸',
  '⠼',
  '⠴',
  '⠦',
  '⠧',
  '⠇',
  '⠏'
];

const PROGRESS_FRAMES = [
  '[          ]',
  '[▓         ]',
  '[▓▓        ]',
  '[▓▓▓       ]',
  '[▓▓▓▓      ]',
  '[▓▓▓▓▓     ]',
  '[▓▓▓▓▓▓    ]',
  '[▓▓▓▓▓▓▓   ]',
  '[▓▓▓▓▓▓▓▓  ]',
  '[▓▓▓▓▓▓▓▓▓ ]',
  '[▓▓▓▓▓▓▓▓▓▓]'
];
```

### Step 2: Register Animation

```typescript
export function registerMyAnimations(engine: AnimationEngine) {
  engine.registerAnimation('my-spinner', {
    name: 'my-spinner',
    type: 'ascii-frames',
    duration: 1000,
    frames: SPINNER_FRAMES
  });
  
  engine.registerAnimation('my-progress', {
    name: 'my-progress',
    type: 'ascii-frames',
    duration: 2000,
    frames: PROGRESS_FRAMES
  });
}
```

### Step 3: Use Animation

```typescript
// Play ASCII animation
const animationId = animationEngine.playAnimation('my-spinner', element);

// Stop when done
setTimeout(() => {
  animationEngine.stopAnimation(animationId);
}, 5000);
```

## Adding Theme-Specific Animations

### Step 1: Define Theme Animation Set

```typescript
// lib/themes/my-theme-animations.ts

import { ThemeAnimationSet } from '@/types/teletext';

export const MY_THEME_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'my-page-transition',
    type: 'css',
    duration: 400,
    cssClass: 'my-page-transition'
  },
  loadingIndicator: {
    name: 'my-loading',
    type: 'ascii-frames',
    duration: 1000,
    frames: ['◐', '◓', '◑', '◒']
  },
  buttonPress: {
    name: 'my-button-press',
    type: 'css',
    duration: 150,
    cssClass: 'my-button-press'
  },
  textEntry: {
    name: 'my-cursor',
    type: 'css',
    duration: 500,
    cssClass: 'my-cursor-blink'
  },
  backgroundEffects: [
    {
      name: 'my-background',
      type: 'css',
      duration: 0,  // Continuous
      cssClass: 'my-background-effect'
    }
  ],
  decorativeElements: [
    {
      name: 'my-decoration',
      type: 'emoji',
      duration: 2000,
      frames: ['⭐', '✨', '⭐']
    }
  ]
};
```

### Step 2: Create CSS

```css
/* app/themes/my-theme-animations.css */

.my-page-transition {
  animation: myPageTransition 400ms ease-in-out;
}

@keyframes myPageTransition {
  0% {
    opacity: 0;
    transform: rotateY(-90deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

.my-button-press {
  animation: myButtonPress 150ms ease-out;
}

@keyframes myButtonPress {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
    filter: brightness(1.3);
  }
}

.my-cursor-blink {
  animation: myCursorBlink 500ms step-end infinite;
}

@keyframes myCursorBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.my-background-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
  background-size: 200% 200%;
  animation: myBackgroundMove 10s ease infinite;
}

@keyframes myBackgroundMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

### Step 3: Register with Theme

```typescript
// lib/themes/my-theme.ts

import { ThemeConfig } from '@/types/teletext';
import { MY_THEME_ANIMATIONS } from './my-theme-animations';

export const MY_THEME: ThemeConfig = {
  name: 'My Theme',
  colors: { /* ... */ },
  effects: { /* ... */ },
  animations: MY_THEME_ANIMATIONS,
  // ...
};
```

## Animation Best Practices

### 1. Use GPU-Accelerated Properties

```css
/* Good - GPU accelerated */
@keyframes goodAnimation {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100px);
    opacity: 0;
  }
}

/* Avoid - Causes reflow */
@keyframes badAnimation {
  from {
    left: 0;
    width: 100px;
  }
  to {
    left: 100px;
    width: 200px;
  }
}
```

### 2. Add will-change for Critical Animations

```css
.critical-animation {
  will-change: transform, opacity;
}

.critical-animation.animating {
  animation: criticalAnim 300ms ease-out;
}

/* Remove will-change after animation */
.critical-animation.complete {
  will-change: auto;
}
```

### 3. Use Appropriate Durations

```typescript
// Quick feedback
buttonPress: {
  duration: 150  // 150ms - instant feedback
}

// Page transitions
pageTransition: {
  duration: 300  // 300ms - smooth but not slow
}

// Loading indicators
loadingIndicator: {
  duration: 1000  // 1s - visible but not distracting
}

// Background effects
backgroundEffect: {
  duration: 10000  // 10s - slow, ambient
}
```

### 4. Choose Appropriate Easing

```typescript
// Entering animations
{
  easing: 'ease-out'  // Fast start, slow end
}

// Exiting animations
{
  easing: 'ease-in'  // Slow start, fast end
}

// Both entering and exiting
{
  easing: 'ease-in-out'  // Smooth both ways
}

// Custom easing
{
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'  // Material Design
}
```

### 5. Respect Reduced Motion

```typescript
import { shouldReduceMotion } from '@/lib/animation-accessibility';

function playAnimation(name: string, element: HTMLElement) {
  if (shouldReduceMotion()) {
    // Skip animation or use instant version
    element.style.opacity = '1';
    return;
  }
  
  // Play normal animation
  animationEngine.playAnimation(name, element);
}
```

## Complex Animation Examples

### Staggered Animation

```typescript
// Animate multiple elements with delay
const elements = document.querySelectorAll('.item');

elements.forEach((element, index) => {
  setTimeout(() => {
    animationEngine.playAnimation('fade-in', element as HTMLElement);
  }, index * 100);  // 100ms delay between each
});
```

### Sequential Animation

```typescript
// Play animations in sequence
async function playSequence(element: HTMLElement) {
  await animationEngine.playAnimation('fade-in', element);
  await animationEngine.playAnimation('slide-up', element);
  await animationEngine.playAnimation('pulse', element);
}
```

### Looping Animation

```typescript
// Loop animation until stopped
let loopId: string;

function startLoop(element: HTMLElement) {
  function loop() {
    loopId = animationEngine.playAnimation('pulse', element, {
      iterations: 1
    });
    
    setTimeout(loop, 1000);  // Repeat every second
  }
  
  loop();
}

function stopLoop() {
  animationEngine.stopAnimation(loopId);
}
```

### Conditional Animation

```typescript
// Different animations based on state
function animateBasedOnState(element: HTMLElement, state: string) {
  switch (state) {
    case 'success':
      animationEngine.playAnimation('success-flash', element);
      break;
    case 'error':
      animationEngine.playAnimation('error-shake', element);
      break;
    case 'loading':
      animationEngine.playAnimation('loading-spinner', element);
      break;
    default:
      animationEngine.playAnimation('default-fade', element);
  }
}
```

## Testing Animations

### Unit Tests

```typescript
import { AnimationEngine } from '@/lib/animation-engine';

describe('My Custom Animation', () => {
  let animationEngine: AnimationEngine;
  let element: HTMLElement;
  
  beforeEach(() => {
    animationEngine = new AnimationEngine();
    element = document.createElement('div');
    document.body.appendChild(element);
  });
  
  afterEach(() => {
    document.body.removeChild(element);
  });
  
  it('should apply animation class', () => {
    animationEngine.playAnimation('my-custom', element);
    expect(element.classList.contains('my-custom-animation')).toBe(true);
  });
  
  it('should remove animation class after duration', async () => {
    animationEngine.playAnimation('my-custom', element);
    
    await new Promise(resolve => setTimeout(resolve, 350));
    
    expect(element.classList.contains('my-custom-animation')).toBe(false);
  });
});
```

### Visual Testing

```typescript
// Create demo page for visual testing
function AnimationDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const playAnimation = async () => {
    if (elementRef.current) {
      setIsAnimating(true);
      await animationEngine.playAnimation('my-custom', elementRef.current);
      setIsAnimating(false);
    }
  };
  
  return (
    <div>
      <div ref={elementRef}>Animated Element</div>
      <button onClick={playAnimation} disabled={isAnimating}>
        Play Animation
      </button>
    </div>
  );
}
```

## Performance Optimization

### Debounce Animations

```typescript
import { debounce } from 'lodash';

const debouncedAnimation = debounce((element: HTMLElement) => {
  animationEngine.playAnimation('my-animation', element);
}, 100);

// Use debounced version
debouncedAnimation(element);
```

### Throttle Animations

```typescript
import { throttle } from 'lodash';

const throttledAnimation = throttle((element: HTMLElement) => {
  animationEngine.playAnimation('my-animation', element);
}, 200);

// Use throttled version
window.addEventListener('scroll', () => {
  throttledAnimation(element);
});
```

### Monitor Performance

```typescript
import { monitorFrameRate } from '@/lib/animation-performance';

const monitor = monitorFrameRate((fps) => {
  if (fps < 30) {
    console.warn('Low FPS detected:', fps);
    // Reduce animation complexity
    animationEngine.setAnimationQuality('low');
  }
});

// Play animation
await animationEngine.playAnimation('complex-animation', element);

// Stop monitoring
monitor.stop();
```

## Troubleshooting

### Animation Not Playing

1. Check if animation is registered
2. Verify CSS class exists
3. Check element is in DOM
4. Verify animation duration > 0
5. Check for CSS conflicts

### Animation Stuttering

1. Use GPU-accelerated properties
2. Add `will-change` property
3. Reduce animation complexity
4. Check for layout thrashing
5. Monitor frame rate

### Animation Not Stopping

1. Verify animation ID is correct
2. Check if animation is looping
3. Ensure cleanup in useEffect
4. Check for memory leaks

## See Also

- [ANIMATION_ENGINE_API.md](./ANIMATION_ENGINE_API.md) - Animation Engine API
- [THEME_CONFIGURATION.md](./THEME_CONFIGURATION.md) - Theme configuration
- [ANIMATION_LIBRARY_DOCUMENTATION.md](./ANIMATION_LIBRARY_DOCUMENTATION.md) - Complete animation library
- [lib/animation-performance.ts](./lib/animation-performance.ts) - Performance utilities
