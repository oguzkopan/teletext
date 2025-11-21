# Animation Performance Optimization

This document describes the CSS animation performance optimizations implemented for the Modern Teletext application.

**Requirements:** 12.3 - Use CSS animations for background effects to maintain performance

## Overview

The animation performance optimization system ensures smooth 60 FPS animations by:

1. Using GPU-accelerated properties (transform, opacity)
2. Avoiding reflow-causing properties (width, height, top, left)
3. Adding will-change hints for critical animations
4. Implementing frame throttling for complex effects
5. Monitoring frame rate and degrading animations when FPS drops below 30

## GPU-Accelerated Animations

### Optimized Properties

All animations use only GPU-accelerated properties:

- ✅ `transform` (translate, rotate, scale)
- ✅ `opacity`
- ✅ `filter` (for visual effects)

### Avoided Properties

These properties cause layout reflow and are NOT used in animations:

- ❌ `width`, `height`
- ❌ `top`, `left`, `right`, `bottom`
- ❌ `margin`, `padding`
- ❌ `border-width`

### Example: Optimized Animation

```css
/* ✅ GOOD - Uses transform and opacity */
@keyframes optimized-slide {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ❌ BAD - Uses left (causes reflow) */
@keyframes bad-slide {
  0% {
    left: -100px;
  }
  100% {
    left: 0;
  }
}
```

## Will-Change Property

The `will-change` CSS property hints to the browser which properties will animate, allowing optimization.

### Usage Guidelines

1. **Use sparingly** - Only for critical, short-duration animations
2. **Remove after animation** - Free resources when animation completes
3. **Limit concurrent usage** - Maximum 10 elements at once

### Automatic Management

The `animationPerformanceManager` automatically manages will-change:

```typescript
import { applyOptimizedAnimation } from './animation-performance';

// Automatically adds will-change, applies animation, and cleans up
const cleanup = applyOptimizedAnimation(element, 'fade-in', {
  useWillChange: true,
  complexity: 'simple'
});

// Later: cleanup();
```

### Manual Management

```typescript
import { animationPerformanceManager } from './animation-performance';

// Add will-change before animation
animationPerformanceManager.addWillChange(element, ['transform', 'opacity']);

// Start animation
element.classList.add('animated');

// Remove will-change after animation completes
element.addEventListener('animationend', () => {
  animationPerformanceManager.removeWillChange(element);
});
```

## Frame Rate Monitoring

The system continuously monitors frame rate and automatically degrades animations when performance drops.

### Automatic Degradation

When FPS drops below 30:

1. Complex animations are disabled
2. Moderate animations are disabled
3. Simple animations have reduced duration
4. Background effects are hidden
5. Decorative elements are hidden

### Restoration

When FPS improves to 45+:

- All animations are restored
- Full visual effects return

### Manual Control

```typescript
import { animationPerformanceManager } from './animation-performance';

// Check if animations are degraded
if (animationPerformanceManager.isDegraded()) {
  console.log('Animations are currently degraded');
}

// Listen for degradation events
window.addEventListener('animationsDegraded', () => {
  console.log('Animations degraded due to low FPS');
});

window.addEventListener('animationsRestored', () => {
  console.log('Animations restored - FPS improved');
});
```

## Animation Complexity Levels

Animations are classified by complexity for selective degradation:

### Simple Animations

- Always enabled, even in degraded mode
- Short duration (< 500ms)
- Essential UI feedback
- Examples: button press, cursor blink

```css
.animation-complexity-simple {
  /* Always runs */
}
```

### Moderate Animations

- Disabled in degraded mode
- Medium duration (500ms - 1000ms)
- Page transitions, loading indicators
- Examples: page wipe, fade transitions

```css
.animation-complexity-moderate {
  /* Disabled when FPS < 30 */
}

body.animations-degraded .animation-complexity-moderate {
  animation: none !important;
}
```

### Complex Animations

- Disabled in degraded mode
- Long duration or continuous
- Background effects, decorative elements
- Examples: floating ghosts, chromatic aberration

```css
.animation-complexity-complex {
  /* Disabled when FPS < 30 */
}

body.animations-degraded .animation-complexity-complex {
  animation: none !important;
}
```

## Frame Throttling

For complex JavaScript animations, frame throttling reduces CPU usage:

```typescript
import { animationPerformanceManager } from './animation-performance';

// Create throttled animation (executes every 2 frames)
const startAnimation = animationPerformanceManager.createThrottledAnimation(
  (timestamp) => {
    // Animation logic here
    updateComplexEffect(timestamp);
  },
  2 // Throttle to every 2nd frame
);

// Start animation
const stopAnimation = startAnimation();

// Later: stop animation
stopAnimation();
```

## Performance-Aware Animation Loop

For custom animation loops that adapt to current FPS:

```typescript
import { createPerformanceAwareLoop } from './animation-performance';

const startLoop = createPerformanceAwareLoop((timestamp, fps) => {
  // Animation logic with FPS awareness
  if (fps < 30) {
    // Simplified rendering
    renderSimple();
  } else {
    // Full rendering
    renderFull();
  }
});

// Start loop
const stopLoop = startLoop();

// Later: stop loop
stopLoop();
```

## CSS Classes for Optimization

### GPU Acceleration

```html
<!-- Force GPU layer creation -->
<div class="gpu-accelerated">
  Animated content
</div>
```

```css
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### Critical Animations

```html
<!-- Add will-change hint -->
<div class="animation-critical">
  Critical animated content
</div>
```

```css
.animation-critical {
  will-change: transform, opacity;
}
```

### Animation Complete

```html
<!-- Remove will-change after animation -->
<div class="animation-complete">
  Animation finished
</div>
```

```css
.animation-complete {
  will-change: auto;
}
```

## Degraded Mode CSS

When frame rate drops, the body gets `animations-degraded` class:

```css
/* Disable complex animations in degraded mode */
body.animations-degraded .ghost-float,
body.animations-degraded .bat-float,
body.animations-degraded .chromatic-aberration,
body.animations-degraded .screen-flicker {
  animation: none !important;
}

/* Hide decorative pseudo-elements */
body.animations-degraded .ghost-float::after,
body.animations-degraded .bat-float::after {
  display: none;
}
```

## Accessibility: Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Performance Monitoring

### Get Current FPS

```typescript
import { performanceMonitor } from './performance-monitor';

const averageFPS = performanceMonitor.getAverageFPS();
const recentFPS = performanceMonitor.getRecentFPS();

console.log(`Average FPS: ${averageFPS}`);
console.log(`Recent FPS: ${recentFPS}`);
```

### Get Frame Rate Summary

```typescript
const summary = performanceMonitor.getFrameRateSummary();

console.log('Frame Rate Summary:', {
  averageFPS: summary.averageFPS,
  recentFPS: summary.recentFPS,
  minFPS: summary.minFPS,
  maxFPS: summary.maxFPS,
  samples: summary.samples
});
```

### Get Performance Recommendations

```typescript
import { animationPerformanceManager } from './animation-performance';

const recommendations = animationPerformanceManager.getPerformanceRecommendations();

recommendations.forEach(rec => {
  console.log('Recommendation:', rec);
});
```

## Best Practices

### 1. Use Transform Instead of Position

```css
/* ✅ GOOD */
.slide-in {
  animation: slide-in 300ms ease-out;
}

@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* ❌ BAD */
.slide-in-bad {
  animation: slide-in-bad 300ms ease-out;
}

@keyframes slide-in-bad {
  from { left: -100px; }
  to { left: 0; }
}
```

### 2. Use Opacity Instead of Display

```css
/* ✅ GOOD */
.fade-in {
  animation: fade-in 200ms ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ❌ BAD - Can't animate display */
.fade-in-bad {
  animation: fade-in-bad 200ms ease-out;
}

@keyframes fade-in-bad {
  from { display: none; }
  to { display: block; }
}
```

### 3. Combine Transform Properties

```css
/* ✅ GOOD - Single transform */
@keyframes combined {
  from {
    transform: translateX(-100%) scale(0.8) rotate(-10deg);
  }
  to {
    transform: translateX(0) scale(1) rotate(0deg);
  }
}

/* ❌ BAD - Multiple transforms (only last one applies) */
@keyframes separate {
  from {
    transform: translateX(-100%);
    transform: scale(0.8);
    transform: rotate(-10deg);
  }
}
```

### 4. Use will-change Sparingly

```typescript
// ✅ GOOD - Add before animation, remove after
element.style.willChange = 'transform, opacity';
element.classList.add('animated');

element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});

// ❌ BAD - Permanent will-change
element.style.willChange = 'transform, opacity';
// Never removed - wastes resources
```

### 5. Throttle Complex Animations

```typescript
// ✅ GOOD - Throttled for performance
const startAnimation = animationPerformanceManager.createThrottledAnimation(
  updateComplexEffect,
  2 // Every 2nd frame
);

// ❌ BAD - Runs every frame
function animate() {
  updateComplexEffect();
  requestAnimationFrame(animate);
}
```

## Testing Performance

### Validate Animation Properties

```typescript
import { animationPerformanceManager } from './animation-performance';

// Check if animation uses GPU-accelerated properties
const isValid = animationPerformanceManager.validateAnimationProperties('my-animation');

if (!isValid) {
  console.warn('Animation uses non-GPU-accelerated properties');
}
```

### Check GPU Acceleration

```typescript
import { isGPUAccelerated } from './animation-performance';

const element = document.querySelector('.animated');
const isAccelerated = isGPUAccelerated(element);

console.log(`Element is GPU accelerated: ${isAccelerated}`);
```

### Get Recommended Complexity

```typescript
import { getRecommendedComplexity } from './animation-performance';

const complexity = getRecommendedComplexity();

console.log(`Recommended animation complexity: ${complexity}`);
// Returns: 'simple' | 'moderate' | 'complex'
```

## Debugging

### Development Mode

In development, performance information is logged to console:

```
Current FPS: 58
Low frame rate detected: 28 FPS
Degrading animations due to low frame rate
Restoring animations - frame rate improved
```

### Browser DevTools

Access performance manager in console:

```javascript
// Check current state
window.animationPerformanceManager.isDegraded();

// Get recommendations
window.animationPerformanceManager.getPerformanceRecommendations();

// Check frame rate
window.performanceMonitor.getFrameRateSummary();
```

### Performance Tab

Use Chrome DevTools Performance tab to:

1. Record animation performance
2. Check for layout thrashing
3. Verify GPU acceleration (look for "Composite Layers")
4. Identify expensive animations

## Summary

The animation performance optimization system ensures smooth animations by:

- ✅ Using only GPU-accelerated properties (transform, opacity)
- ✅ Avoiding reflow-causing properties (width, height, position)
- ✅ Adding will-change hints for critical animations
- ✅ Automatically removing will-change after animations
- ✅ Monitoring frame rate continuously
- ✅ Degrading animations when FPS < 30
- ✅ Restoring animations when FPS improves
- ✅ Throttling complex animation frames
- ✅ Respecting user's reduced motion preferences
- ✅ Providing performance recommendations

This ensures the Modern Teletext application maintains 60 FPS even with complex theme animations and decorative effects.
