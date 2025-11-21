# Haunting/Kiroween Theme Animations Implementation

This document describes the implementation of the Haunting/Kiroween theme animation set for the Modern Teletext application.

## Overview

The Haunting theme provides a spooky, Halloween-inspired animation set with glitch effects, chromatic aberration, floating ghosts and bats, and horror-themed visual feedback. All animations are designed to create an immersive horror atmosphere while maintaining the retro teletext aesthetic.

**Requirements:** 5.2, 7.1, 7.2, 7.3, 7.4, 7.5, 10.3

## Animation Set Components

### 1. Glitch Transition (400ms)

**Type:** JavaScript keyframe animation  
**Purpose:** Page transition with chromatic aberration effect  
**CSS Class:** N/A (uses Web Animations API)

**Keyframes:**
```typescript
[
  { transform: 'translateX(0)', filter: 'none' },
  { transform: 'translateX(-5px)', filter: 'hue-rotate(90deg)' },
  { transform: 'translateX(5px)', filter: 'hue-rotate(-90deg)' },
  { transform: 'translateX(0)', filter: 'none' }
]
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.playPageTransition(targetElement);
```

### 2. Pulsing Skull Loading Indicator (800ms loop)

**Type:** ASCII frame animation  
**Purpose:** Loading state indicator with Halloween emoji  
**Frames:** `['💀', '👻', '💀', '🎃']`

**Frame Duration:** 200ms per frame (800ms total / 4 frames)

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
const animationId = engine.playLoadingIndicator(targetElement);
// Animation loops automatically
```

### 3. Horror Flash Button Animation (200ms)

**Type:** CSS animation  
**Purpose:** Button press feedback with red tint and glow  
**CSS Class:** `horror-flash`

**Effect:**
- Brightness increase to 1.5x
- Hue rotation of -30 degrees (red tint)
- Saturation increase to 2x
- Red glow shadow

**CSS:**
```css
@keyframes horror-flash-animation {
  0%, 100% {
    filter: brightness(1) hue-rotate(0deg);
  }
  50% {
    filter: brightness(1.5) hue-rotate(-30deg) saturate(2);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  }
}

.horror-flash {
  animation: horror-flash-animation 200ms ease-in-out;
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.playButtonPress(buttonElement);
```

### 4. Glitch Cursor Text Entry (300ms loop)

**Type:** CSS animation  
**Purpose:** Blinking cursor with chromatic aberration glitch  
**CSS Class:** `glitch-cursor`

**Effect:**
- Opacity changes (1 → 0.8 → 0 → 0.8 → 1)
- RGB channel separation (text-shadow)
- Step-end timing for digital glitch effect

**CSS:**
```css
@keyframes glitch-cursor-animation {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 0 transparent;
  }
  25% {
    opacity: 0.8;
    text-shadow: -2px 0 0 rgba(255, 0, 0, 0.7), 2px 0 0 rgba(0, 255, 255, 0.7);
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 0.8;
    text-shadow: 2px 0 0 rgba(255, 0, 0, 0.7), -2px 0 0 rgba(0, 255, 255, 0.7);
  }
}

.glitch-cursor {
  animation: glitch-cursor-animation 300ms step-end infinite;
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.playTextEntry(cursorElement);
```

### 5. Floating Ghosts Background (10s loop)

**Type:** CSS animation  
**Purpose:** Ghost emoji floating across screen  
**CSS Class:** `ghost-float`

**Effect:**
- Ghost (👻) moves from left (-100%) to right (100vw)
- Slight vertical movement (-20px)
- Rotation (0deg → 10deg)
- Fade in/out at edges

**CSS:**
```css
@keyframes ghost-float-animation {
  0% {
    transform: translateX(-100%) translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateX(100vw) translateY(-20px) rotate(10deg);
    opacity: 0;
  }
}

.ghost-float::after {
  content: '👻';
  position: absolute;
  top: 20%;
  left: 0;
  font-size: 2rem;
  pointer-events: none;
  z-index: 1;
  animation: ghost-float-animation 10000ms linear infinite;
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.applyBackgroundEffects(containerElement);
```

### 6. Screen Flicker Effect (5s loop)

**Type:** CSS animation  
**Purpose:** Subtle screen flickering for horror atmosphere  
**CSS Class:** `screen-flicker`

**Effect:**
- Opacity variations (1 → 0.95 → 0.9 → 0.85 → 0.92 → 0.88 → 1)
- Creates old TV/horror movie effect

**CSS:**
```css
@keyframes screen-flicker-animation {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.95; }
  20% { opacity: 0.9; }
  30% { opacity: 1; }
  40% { opacity: 0.85; }
  50% { opacity: 1; }
  60% { opacity: 0.92; }
  70% { opacity: 1; }
  80% { opacity: 0.88; }
  90% { opacity: 1; }
}

.screen-flicker {
  animation: screen-flicker-animation 5000ms ease-in-out infinite;
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.applyBackgroundEffects(containerElement);
```

### 7. Chromatic Aberration (continuous)

**Type:** CSS animation  
**Purpose:** RGB channel separation effect  
**CSS Class:** `chromatic-aberration`

**Effect:**
- Horizontal translation (-1px → 1px → -0.5px)
- Hue rotation (0deg → 5deg → -5deg → 3deg)
- Mix-blend-mode: screen for color separation

**CSS:**
```css
.chromatic-aberration::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 1;
  animation: chromatic-aberration-animation 3s ease-in-out infinite;
}

@keyframes chromatic-aberration-animation {
  0%, 100% {
    transform: translateX(0);
    filter: hue-rotate(0deg);
  }
  25% {
    transform: translateX(-1px);
    filter: hue-rotate(5deg);
  }
  50% {
    transform: translateX(1px);
    filter: hue-rotate(-5deg);
  }
  75% {
    transform: translateX(-0.5px);
    filter: hue-rotate(3deg);
  }
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
engine.setTheme('haunting');
engine.applyBackgroundEffects(containerElement);
```

### 8. Decorative Elements

#### Jack-o'-Lantern (1s loop)

**Type:** ASCII frame animation  
**Purpose:** Flickering pumpkin decoration  
**Frames:** `['🎃', '🎃', '🎃']`

**Usage:**
```typescript
const engine = getAnimationEngine();
const animations = engine.getThemeAnimations('haunting');
const jackOLantern = animations?.decorativeElements?.find(e => e.name === 'jack-o-lantern');
if (jackOLantern) {
  engine.playAnimationConfig(jackOLantern, targetElement, { loop: true });
}
```

#### Floating Bat (8s loop)

**Type:** CSS animation  
**Purpose:** Bat emoji flying across screen  
**CSS Class:** `bat-float`

**Effect:**
- Bat (🦇) moves from right (100vw) to left (-100%)
- Flips direction at midpoint (scaleX: 1 → -1)
- Vertical movement (-30px at midpoint)
- Fade in/out at edges

**CSS:**
```css
@keyframes bat-float-animation {
  0% {
    transform: translateX(100vw) translateY(0) scaleX(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translateX(50vw) translateY(-30px) scaleX(1);
  }
  51% {
    transform: translateX(50vw) translateY(-30px) scaleX(-1);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(-100%) translateY(0) scaleX(-1);
    opacity: 0;
  }
}

.bat-float::after {
  content: '🦇';
  position: absolute;
  top: 10%;
  right: 0;
  font-size: 1.5rem;
  pointer-events: none;
  z-index: 1;
  animation: bat-float-animation 8000ms linear infinite;
}
```

**Usage:**
```typescript
const engine = getAnimationEngine();
const animations = engine.getThemeAnimations('haunting');
const floatingBat = animations?.decorativeElements?.find(e => e.name === 'floating-bat');
if (floatingBat) {
  engine.playAnimationConfig(floatingBat, targetElement, { loop: true });
}
```

## Complete Theme Configuration

```typescript
const HAUNTING_ANIMATIONS: ThemeAnimationSet = {
  pageTransition: {
    name: 'glitch-transition',
    type: 'javascript',
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
    frames: ['💀', '👻', '💀', '🎃'],
    loop: true
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
    cssClass: 'glitch-cursor',
    loop: true
  },
  backgroundEffects: [
    {
      name: 'floating-ghosts',
      type: 'css',
      duration: 10000,
      cssClass: 'ghost-float',
      loop: true
    },
    {
      name: 'screen-flicker',
      type: 'css',
      duration: 5000,
      cssClass: 'screen-flicker',
      loop: true
    },
    {
      name: 'chromatic-aberration',
      type: 'css',
      duration: 0,
      cssClass: 'chromatic-aberration',
      loop: true
    }
  ],
  decorativeElements: [
    {
      name: 'jack-o-lantern',
      type: 'ascii-frames',
      duration: 1000,
      frames: ['🎃', '🎃', '🎃'],
      loop: true
    },
    {
      name: 'floating-bat',
      type: 'css',
      duration: 8000,
      cssClass: 'bat-float',
      loop: true
    }
  ]
};
```

## Usage Examples

### Basic Theme Setup

```typescript
import { getAnimationEngine } from './animation-engine';

const engine = getAnimationEngine();
engine.setTheme('haunting');
```

### Page Transition

```typescript
// On page navigation
const pageElement = document.querySelector('.teletext-page');
engine.playPageTransition(pageElement);
```

### Loading State

```typescript
// Show loading indicator
const loadingElement = document.querySelector('.loading-indicator');
const animationId = engine.playLoadingIndicator(loadingElement);

// Stop when loaded
engine.stopAnimation(animationId);
```

### Button Interaction

```typescript
// On button click
button.addEventListener('click', () => {
  engine.playButtonPress(button);
});
```

### Text Input

```typescript
// Show cursor in input field
const cursor = document.querySelector('.input-cursor');
engine.playTextEntry(cursor);
```

### Background Effects

```typescript
// Apply all background effects
const container = document.querySelector('.teletext-container');
const effectIds = engine.applyBackgroundEffects(container);

// Stop all effects later
effectIds.forEach(id => engine.stopAnimation(id));
```

### Decorative Elements

```typescript
// Add jack-o'-lantern to corner
const corner = document.querySelector('.page-corner');
const animations = engine.getThemeAnimations('haunting');
const pumpkin = animations?.decorativeElements?.find(e => e.name === 'jack-o-lantern');
if (pumpkin) {
  engine.playAnimationConfig(pumpkin, corner, { loop: true });
}

// Add floating bat
const header = document.querySelector('.page-header');
const bat = animations?.decorativeElements?.find(e => e.name === 'floating-bat');
if (bat) {
  engine.playAnimationConfig(bat, header, { loop: true });
}
```

## Testing

Run the test suite:
```bash
npm test -- lib/__tests__/haunting-animations.test.ts
```

View the visual demo:
```bash
open lib/__tests__/haunting-animations-demo.html
```

## Performance Considerations

1. **CSS Animations:** All background effects use CSS animations for GPU acceleration
2. **Transform & Opacity:** Animations primarily use `transform` and `opacity` properties to avoid layout reflows
3. **Pseudo-elements:** Decorative elements use `::before` and `::after` to minimize DOM nodes
4. **Loop Control:** Animations can be stopped individually or all at once to manage performance
5. **Frame Rate:** ASCII frame animations use calculated intervals to maintain smooth playback

## Browser Compatibility

- **Web Animations API:** Required for glitch transition (polyfill available)
- **CSS Animations:** Supported in all modern browsers
- **Emoji Support:** Requires Unicode emoji support (all modern browsers)
- **Mix-blend-mode:** Required for chromatic aberration (IE11 not supported)

## Accessibility

- All animations respect `prefers-reduced-motion` media query (to be implemented)
- Decorative elements use `pointer-events: none` to avoid interfering with interactions
- Animations can be disabled via settings (to be implemented)
- Core functionality works without animations

## Related Files

- `lib/animation-engine.ts` - Animation engine implementation
- `app/globals.css` - CSS animation definitions
- `lib/__tests__/haunting-animations.test.ts` - Test suite
- `lib/__tests__/haunting-animations-demo.html` - Visual demo
- `.kiro/specs/teletext-ux-redesign/design.md` - Design specification
- `.kiro/specs/teletext-ux-redesign/requirements.md` - Requirements
