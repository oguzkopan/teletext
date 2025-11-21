# CSS Animation Library Documentation

## Overview

The Modern Teletext CSS Animation Library provides a comprehensive set of animations organized by theme, type, and purpose. All animations are GPU-accelerated, accessible, and performance-optimized.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Performance Optimizations](#performance-optimizations)
3. [Accessibility](#accessibility)
4. [Base Utilities](#base-utilities)
5. [Theme-Specific Animations](#theme-specific-animations)
6. [Interactive Elements](#interactive-elements)
7. [Feedback Animations](#feedback-animations)
8. [Loading Animations](#loading-animations)
9. [Decorative Animations](#decorative-animations)
10. [Utility Classes](#utility-classes)
11. [Best Practices](#best-practices)

---

## Quick Start

### Import the Library

Add to your main CSS file:

```css
@import './animations.css';
```

### Basic Usage

Apply animation classes directly to elements:

```html
<div class="fade-in">Content fades in</div>
<button class="button-press">Click me</button>
<div class="pulse">Pulsing element</div>
```

### Combine with Utilities

```html
<div class="fade-in anim-slow anim-delay-2">
  Fades in slowly after 200ms delay
</div>
```

---

## Performance Optimizations

### GPU Acceleration

All animations use GPU-accelerated properties (`transform`, `opacity`) to ensure smooth 60fps performance.

**Classes:**
- `.gpu-accelerated` - Force GPU layer creation
- `.animation-critical` - Add `will-change` hints for critical animations
- `.animation-complete` - Remove `will-change` after animation completes

### Complexity Levels

Animations are categorized by complexity for performance degradation:

- `.animation-complexity-simple` - Always enabled
- `.animation-complexity-moderate` - Disabled when FPS < 30
- `.animation-complexity-complex` - Disabled when FPS < 30

### Degraded Mode

When performance drops below 30fps, add `animations-degraded` class to `<body>`:

```javascript
document.body.classList.add('animations-degraded');
```

This automatically disables complex animations and reduces duration of simple ones.

---

## Accessibility

### Respecting User Preferences

The library automatically respects:
- `prefers-reduced-motion` media query
- User animation settings

### Disable All Animations

```html
<body class="animations-disabled">
  <!-- All animations disabled -->
</body>
```

### Reduce Animation Intensity

```html
<body class="animations-reduced">
  <!-- All animations run at 50% speed -->
</body>
```

### Disable Specific Types

```html
<body class="transitions-disabled">
  <!-- Only transitions disabled -->
</body>

<body class="decorations-disabled">
  <!-- Only decorative elements hidden -->
</body>

<body class="background-effects-disabled">
  <!-- Only background effects hidden -->
</body>
```

---

## Base Utilities

### Fade Animations

**Classes:**
- `.fade-in` - Fade in (300ms)
- `.fade-out` - Fade out (300ms)
- `.fade-in-fast` - Fast fade in (150ms)
- `.fade-out-fast` - Fast fade out (150ms)
- `.fade-in-slow` - Slow fade in (600ms)
- `.fade-out-slow` - Slow fade out (600ms)

**Example:**
```html
<div class="fade-in">Fades in over 300ms</div>
```

### Slide Animations

**Classes:**
- `.slide-in-left` - Slide in from left
- `.slide-in-right` - Slide in from right
- `.slide-in-top` - Slide in from top
- `.slide-in-bottom` - Slide in from bottom

**Example:**
```html
<div class="slide-in-left">Slides in from the left</div>
```

### Scale Animations

**Classes:**
- `.scale-in` - Scale up from 0 to 1
- `.scale-out` - Scale down from 1 to 0
- `.pulse` - Continuous pulse (1s)
- `.pulse-slow` - Slow pulse (2s)
- `.pulse-fast` - Fast pulse (0.5s)

**Example:**
```html
<div class="pulse">Pulses continuously</div>
```

### Bounce Animations

**Classes:**
- `.bounce` - Continuous bounce
- `.bounce-in` - Bounce in entrance

**Example:**
```html
<div class="bounce-in">Bounces in</div>
```

### Shake Animation

**Classes:**
- `.shake` - Shake horizontally (500ms)

**Example:**
```html
<div class="shake">Shakes side to side</div>
```

### Rotate Animations

**Classes:**
- `.rotate` - Continuous rotation (2s)
- `.rotate-fast` - Fast rotation (1s)
- `.rotate-slow` - Slow rotation (4s)
- `.rotate-reverse` - Reverse rotation (2s)

**Example:**
```html
<div class="rotate">Rotates continuously</div>
```

### Blink/Flash Animations

**Classes:**
- `.blink` - Blink on/off (1s)
- `.blink-fast` - Fast blink (500ms)
- `.blink-slow` - Slow blink (2s)
- `.flash` - Single flash (500ms)

**Example:**
```html
<span class="blink">Blinking text</span>
```

### Glow Animation

**Classes:**
- `.glow` - Continuous glow effect (2s)

**Example:**
```html
<div class="glow">Glowing element</div>
```

---

## Theme-Specific Animations

### Ceefax Theme

Classic BBC Ceefax-style animations with scanlines and horizontal wipes.

**Classes:**
- `.ceefax-wipe` - Horizontal wipe transition (300ms)
- `.ceefax-button-flash` - Button flash (150ms)
- `.ceefax-cursor-blink` - Blinking cursor (500ms)
- `.ceefax-scanlines` - Scanline overlay effect
  - `.intensity-low` - Light scanlines
  - `.intensity-medium` - Medium scanlines (default)
  - `.intensity-high` - Heavy scanlines

**Example:**
```html
<div class="ceefax-wipe">Page content with wipe transition</div>
<div class="ceefax-scanlines intensity-medium">
  Content with scanline overlay
</div>
```

### Haunting/Kiroween Theme

Halloween horror theme with glitch effects, ghosts, and chromatic aberration.

**Classes:**
- `.haunting-button-flash` - Horror button flash with red tint (200ms)
- `.haunting-cursor-glitch` - Glitching cursor (300ms)
- `.haunting-ghost-float` - Floating ghost decoration (10s)
- `.haunting-screen-flicker` - Screen flicker effect (5s)
  - `.intensity-low` - Subtle flicker
  - `.intensity-medium` - Medium flicker (default)
  - `.intensity-high` - Strong flicker
- `.haunting-chromatic-aberration` - RGB channel separation
  - `.intensity-low` - Subtle aberration
  - `.intensity-medium` - Medium aberration (default)
  - `.intensity-high` - Strong aberration
- `.haunting-bat-float` - Flying bat decoration (8s)
- `.haunting-fog-overlay` - Fog effect
  - `.intensity-low` - Light fog
  - `.intensity-medium` - Medium fog (default)
  - `.intensity-high` - Heavy fog
- `.haunting-pumpkin-flicker` - Flickering jack-o-lantern (1.5s)
- `.haunting-ghost-decoration` - Ghost floating across screen (12s)
- `.haunting-bat-decoration` - Bat flying across screen (10s)
- `.haunting-skull-pulse` - Pulsing skull (2s)
- `.haunting-spider-crawl` - Crawling spider (3s)

**Example:**
```html
<div class="haunting-chromatic-aberration intensity-high">
  <div class="haunting-fog-overlay intensity-medium">
    <div class="haunting-screen-flicker">
      Spooky content with multiple effects
    </div>
  </div>
</div>
```

### High Contrast Theme

Simple, accessible animations for users who need high contrast.

**Classes:**
- `.high-contrast-fade` - Simple fade (250ms)
- `.high-contrast-button-flash` - Simple button flash (150ms)
- `.high-contrast-cursor` - Steady cursor (500ms)
- `.high-contrast-loading` - Smooth loading spinner (1s)

**Example:**
```html
<div class="high-contrast-fade">Simple fade transition</div>
```

### ORF Theme

Colorful, vibrant animations with color cycling and rainbow effects.

**Classes:**
- `.orf-slide` - Slide transition (300ms)
- `.orf-button-flash` - Color-enhanced button flash (150ms)
- `.orf-cursor` - Color-cycling cursor (500ms)
- `.orf-color-cycle` - Continuous color cycling (5s)
- `.orf-rainbow-border` - Rainbow border animation (3s)

**Example:**
```html
<div class="orf-color-cycle">
  Header with color cycling effect
</div>
```

---

## Page Transitions

**Classes:**
- `.page-transition` - Generic fade transition (300ms)
- `.wipe-left` - Wipe from left to right (300ms)
- `.wipe-right` - Wipe from right to left (300ms)
- `.wipe-top` - Wipe from top to bottom (300ms)
- `.wipe-bottom` - Wipe from bottom to top (300ms)
- `.glitch-transition` - Glitch effect transition (400ms)
- `.zoom-in-transition` - Zoom in transition (300ms)
- `.zoom-out-transition` - Zoom out transition (300ms)

**Example:**
```html
<div class="wipe-left">Page content with wipe effect</div>
```

---

## Theme Transitions

**Classes:**
- `.theme-fade-out` - Theme fade out (500ms)
- `.theme-fade-in` - Theme fade in (500ms)
- `.theme-haunting-transition` - Horror-themed glitch transition (1s)
- `.theme-banner` - Theme name banner
  - `.haunting` - Red horror styling
  - `.ceefax` - Yellow Ceefax styling
  - `.orf` - Green ORF styling
  - `.high-contrast` - White high contrast styling

**Example:**
```html
<div class="theme-banner haunting">
  HAUNTING MODE ACTIVATED
</div>
```

---

## Interactive Elements

**Classes:**
- `.button-press` - Button press animation (150ms)
- `.button-hover-glow` - Continuous hover glow (1s)
- `.input-highlight` - Input field highlight (300ms)
- `.focus-ring-pulse` - Focus ring pulse (1s)
- `.link-indicator-bounce` - Link arrow bounce (1s)
- `.selection-highlight` - Selection highlight (400ms)

**Example:**
```html
<button class="button-press button-hover-glow">
  Interactive Button
</button>
```

---

## Feedback Animations

### Success/Error Indicators

**Classes:**
- `.feedback-checkmark` - Checkmark appears (300ms)
- `.feedback-cross` - X/cross appears (300ms)
- `.feedback-success-flash` - Green success flash (400ms)
- `.feedback-error-flash` - Red error flash (400ms)
- `.feedback-warning-flash` - Yellow warning flash (400ms)
- `.feedback-info-flash` - Cyan info flash (400ms)

**Example:**
```html
<div class="feedback-success-flash">
  <span class="feedback-checkmark">✓</span>
  Success!
</div>
```

### Celebration Animations

**Classes:**
- `.feedback-confetti` - Confetti falls (2s)
- `.feedback-celebration` - Celebration bounce (600ms)
- `.feedback-saved-flash` - "Saved" flash effect (400ms)

**Example:**
```html
<div class="feedback-celebration">
  🎉 Quiz Completed!
</div>
```

### Message Animations

**Classes:**
- `.feedback-message-in` - Message fades in (200ms)
- `.feedback-message-out` - Message fades out (200ms)

**Example:**
```html
<div class="feedback-message-in">
  Your changes have been saved
</div>
```

---

## Loading Animations

**Classes:**
- `.loading-rotating-line` - Rotating line indicator (|/-\)
- `.loading-pulsing-skull` - Pulsing skull (800ms)
- `.loading-spinner` - Rotating spinner (1s)
- `.loading-dots` - Animated dots (...)
- `.loading-progress-fill` - Progress bar fill (2s)
- `.loading-pulse` - Pulsing opacity (1.5s)

**Example:**
```html
<div class="loading-spinner">Loading...</div>
<div class="loading-dots">Loading</div>
```

---

## Decorative Animations

### Weather Icons

**Classes:**
- `.weather-rain` - Falling rain (1s)
- `.weather-cloud` - Drifting cloud (3s)
- `.weather-sun` - Rotating sun rays (20s)
- `.weather-snow` - Falling snow (2s)

**Example:**
```html
<span class="weather-rain">💧</span>
<span class="weather-cloud">☁️</span>
```

### Sports Indicators

**Classes:**
- `.sports-live-pulse` - Live indicator pulse (1.5s)
- `.sports-score-flash` - Score change flash (500ms)

**Example:**
```html
<span class="sports-live-pulse">LIVE</span>
<span class="sports-score-flash">3-2</span>
```

### Market Indicators

**Classes:**
- `.market-trend-up` - Upward trend animation (500ms)
- `.market-trend-down` - Downward trend animation (500ms)
- `.market-value-count` - Value counting effect (300ms)

**Example:**
```html
<span class="market-trend-up">▲ +5.2%</span>
<span class="market-trend-down">▼ -2.1%</span>
```

### AI Typing

**Classes:**
- `.ai-typing-cursor` - Blinking typing cursor (500ms)
- `.ai-thinking` - Animated thinking dots

**Example:**
```html
<span class="ai-typing-cursor">|</span>
<span class="ai-thinking">Thinking</span>
```

### Progress Indicators

**Classes:**
- `.progress-bar-fill` - Progress bar fill animation (1s)
- `.progress-step-highlight` - Step highlight (600ms)

**Example:**
```html
<div class="progress-bar-fill" style="width: 60%"></div>
```

---

## Utility Classes

### Duration Modifiers

**Classes:**
- `.anim-instant` - 0ms duration
- `.anim-fast` - 150ms duration
- `.anim-normal` - 300ms duration
- `.anim-slow` - 600ms duration
- `.anim-slower` - 1000ms duration

**Example:**
```html
<div class="fade-in anim-slow">Slow fade in</div>
```

### Delay Modifiers

**Classes:**
- `.anim-delay-0` - 0ms delay
- `.anim-delay-1` - 100ms delay
- `.anim-delay-2` - 200ms delay
- `.anim-delay-3` - 300ms delay
- `.anim-delay-4` - 400ms delay
- `.anim-delay-5` - 500ms delay

**Example:**
```html
<div class="fade-in anim-delay-3">Fades in after 300ms</div>
```

### Iteration Modifiers

**Classes:**
- `.anim-once` - Play once
- `.anim-twice` - Play twice
- `.anim-thrice` - Play three times
- `.anim-infinite` - Play infinitely

**Example:**
```html
<div class="pulse anim-thrice">Pulses 3 times</div>
```

### Direction Modifiers

**Classes:**
- `.anim-normal` - Normal direction
- `.anim-reverse` - Reverse direction
- `.anim-alternate` - Alternate direction
- `.anim-alternate-reverse` - Alternate reverse

**Example:**
```html
<div class="slide-in-left anim-reverse">Slides out to left</div>
```

### Fill Mode Modifiers

**Classes:**
- `.anim-fill-none` - No fill mode
- `.anim-fill-forwards` - Forwards fill mode
- `.anim-fill-backwards` - Backwards fill mode
- `.anim-fill-both` - Both fill modes

**Example:**
```html
<div class="fade-in anim-fill-forwards">Stays visible after fade</div>
```

### Play State Modifiers

**Classes:**
- `.anim-paused` - Pause animation
- `.anim-running` - Resume animation

**Example:**
```html
<div class="rotate anim-paused">Paused rotation</div>
```

### Easing Modifiers

**Classes:**
- `.anim-ease` - Ease timing
- `.anim-ease-in` - Ease-in timing
- `.anim-ease-out` - Ease-out timing
- `.anim-ease-in-out` - Ease-in-out timing
- `.anim-linear` - Linear timing

**Example:**
```html
<div class="slide-in-left anim-ease-out">Smooth slide</div>
```

### Transform Origin Utilities

**Classes:**
- `.anim-origin-center` - Center origin
- `.anim-origin-top` - Top origin
- `.anim-origin-bottom` - Bottom origin
- `.anim-origin-left` - Left origin
- `.anim-origin-right` - Right origin
- `.anim-origin-top-left` - Top-left origin
- `.anim-origin-top-right` - Top-right origin
- `.anim-origin-bottom-left` - Bottom-left origin
- `.anim-origin-bottom-right` - Bottom-right origin

**Example:**
```html
<div class="rotate anim-origin-top-left">Rotates from top-left</div>
```

### Stagger Utilities

For sequential animations on multiple elements:

**Classes:**
- `.anim-stagger-1` - 100ms stagger intervals
- `.anim-stagger-2` - 50ms stagger intervals

**Example:**
```html
<div class="fade-in anim-stagger-1">Item 1 (0ms delay)</div>
<div class="fade-in anim-stagger-1">Item 2 (100ms delay)</div>
<div class="fade-in anim-stagger-1">Item 3 (200ms delay)</div>
```

---

## Best Practices

### 1. Use GPU-Accelerated Properties

✅ **Good:**
```css
.my-animation {
  animation: slide 300ms ease-out;
}

@keyframes slide {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

❌ **Bad:**
```css
@keyframes slide-bad {
  from { left: -100%; }
  to { left: 0; }
}
```

### 2. Apply will-change Sparingly

✅ **Good:**
```html
<div class="animation-critical fade-in">
  Critical animation
</div>
```

❌ **Bad:**
```css
* {
  will-change: transform, opacity;
}
```

### 3. Respect Accessibility

Always test with:
- `prefers-reduced-motion` enabled
- Screen readers
- Keyboard-only navigation

### 4. Combine Utilities Effectively

```html
<div class="fade-in anim-slow anim-delay-2 anim-ease-out">
  Fades in slowly with delay and smooth easing
</div>
```

### 5. Use Appropriate Complexity Levels

```html
<!-- Simple animation - always runs -->
<div class="fade-in animation-complexity-simple">
  Essential content
</div>

<!-- Complex animation - disabled in degraded mode -->
<div class="haunting-chromatic-aberration animation-complexity-complex">
  Decorative effect
</div>
```

### 6. Clean Up After Animations

```javascript
element.addEventListener('animationend', () => {
  element.classList.remove('animation-critical');
  element.classList.add('animation-complete');
});
```

### 7. Test Performance

Monitor frame rate and degrade animations if needed:

```javascript
if (fps < 30) {
  document.body.classList.add('animations-degraded');
}
```

---

## Browser Support

All animations are supported in modern browsers:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

Fallbacks are provided for older browsers through the accessibility system.

---

## Contributing

When adding new animations:

1. Use GPU-accelerated properties only
2. Add appropriate accessibility controls
3. Include utility class variants
4. Document in this file
5. Test with `prefers-reduced-motion`
6. Verify 60fps performance

---

## License

Part of the Modern Teletext project.
