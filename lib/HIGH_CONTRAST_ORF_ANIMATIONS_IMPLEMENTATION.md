# High Contrast and ORF Theme Animations Implementation

This document describes the implementation of animation sets for the High Contrast and ORF themes in the Modern Teletext application.

## Overview

The High Contrast and ORF themes provide distinct visual experiences:
- **High Contrast**: Simple, accessible animations with smooth transitions
- **ORF**: Colorful, dynamic animations with color-cycling effects

Both themes are registered in the Animation Engine and include CSS-based animations for optimal performance.

## High Contrast Theme

### Design Philosophy
The High Contrast theme prioritizes accessibility and simplicity. Animations are subtle and smooth, avoiding distracting effects while maintaining visual feedback.

### Animation Set

#### 1. Page Transition: Simple Fade (250ms)
- **Type**: CSS animation
- **Duration**: 250ms
- **Easing**: ease
- **Effect**: Smooth opacity fade-in from 0 to 1

```css
@keyframes fade-transition-animation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fade-transition {
  animation: fade-transition-animation 250ms ease forwards;
}
```

#### 2. Loading Indicator: Smooth Loading (1000ms)
- **Type**: ASCII frame animation
- **Duration**: 1000ms (100ms per frame)
- **Frames**: Braille spinner characters
- **Loop**: Yes

Frames: `⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏`

#### 3. Button Press: Simple Flash (150ms)
- **Type**: CSS animation
- **Duration**: 150ms
- **Easing**: ease-in-out
- **Effect**: Opacity pulse from 1 to 0.5 and back

```css
@keyframes simple-flash-animation {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.simple-flash {
  animation: simple-flash-animation 150ms ease-in-out;
}
```

#### 4. Text Entry: Steady Cursor (500ms)
- **Type**: CSS animation
- **Duration**: 500ms
- **Loop**: Yes
- **Effect**: Step-end blinking cursor

```css
@keyframes steady-cursor-animation {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.steady-cursor {
  animation: steady-cursor-animation 500ms step-end infinite;
}
```

#### 5. Background Effects
None - High Contrast theme has no background effects to maintain clarity.

## ORF Theme

### Design Philosophy
The ORF theme features vibrant, colorful animations inspired by Austrian broadcasting. Color-cycling effects and smooth transitions create a dynamic, engaging experience.

### Animation Set

#### 1. Page Transition: Slide Transition (300ms)
- **Type**: CSS animation
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Effect**: Horizontal slide from right to left

```css
@keyframes slide-transition-animation {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.slide-transition {
  animation: slide-transition-animation 300ms ease-in-out forwards;
}
```

#### 2. Loading Indicator: Rotating Dots (1000ms)
- **Type**: ASCII frame animation
- **Duration**: 1000ms (125ms per frame)
- **Frames**: Braille dot spinner
- **Loop**: Yes

Frames: `⣾ ⣽ ⣻ ⢿ ⡿ ⣟ ⣯ ⣷`

#### 3. Button Press: Color Flash (150ms)
- **Type**: CSS animation
- **Duration**: 150ms
- **Easing**: ease-in-out
- **Effect**: Brightness and saturation increase

```css
@keyframes color-flash-animation {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.5) saturate(1.5);
  }
}

.color-flash {
  animation: color-flash-animation 150ms ease-in-out;
}
```

#### 4. Text Entry: Color Cursor (500ms)
- **Type**: CSS animation
- **Duration**: 500ms
- **Loop**: Yes
- **Effect**: Blinking cursor with hue rotation

```css
@keyframes color-cursor-animation {
  0%, 50% {
    opacity: 1;
    filter: hue-rotate(0deg);
  }
  51%, 100% {
    opacity: 0;
    filter: hue-rotate(180deg);
  }
}

.color-cursor {
  animation: color-cursor-animation 500ms step-end infinite;
}
```

#### 5. Background Effects: Color Cycling Header (5000ms)
- **Type**: CSS animation
- **Duration**: 5000ms
- **Loop**: Yes
- **Effect**: Continuous hue rotation through full color spectrum

```css
@keyframes color-cycle-animation {
  0% {
    filter: hue-rotate(0deg);
  }
  25% {
    filter: hue-rotate(90deg);
  }
  50% {
    filter: hue-rotate(180deg);
  }
  75% {
    filter: hue-rotate(270deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.color-cycle {
  animation: color-cycle-animation 5000ms linear infinite;
}
```

## Usage

### Switching to High Contrast Theme

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';

const engine = getAnimationEngine();
engine.setTheme('high-contrast');

// Play page transition
const element = document.getElementById('content');
engine.playPageTransition(element);

// Play loading indicator
const loader = document.getElementById('loader');
engine.playLoadingIndicator(loader);
```

### Switching to ORF Theme

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';

const engine = getAnimationEngine();
engine.setTheme('orf');

// Apply background effects (color cycling header)
const container = document.getElementById('app');
engine.applyBackgroundEffects(container);

// Play button press animation
const button = document.getElementById('button');
engine.playButtonPress(button);
```

### Playing Specific Animations

```typescript
const engine = getAnimationEngine();

// High Contrast animations
engine.setTheme('high-contrast');
engine.playAnimation('simple-fade', element);
engine.playAnimation('smooth-loading', loaderElement);

// ORF animations
engine.setTheme('orf');
engine.playAnimation('slide-transition', element);
engine.playAnimation('color-cycling-header', headerElement);
```

## Animation Registration

Both themes are automatically registered when the Animation Engine is initialized:

```typescript
// High Contrast Theme
this.registerThemeAnimations('high-contrast', {
  pageTransition: {
    name: 'simple-fade',
    type: 'css',
    duration: 250,
    cssClass: 'fade-transition',
    easing: 'ease'
  },
  loadingIndicator: {
    name: 'smooth-loading',
    type: 'ascii-frames',
    duration: 1000,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    loop: true
  },
  buttonPress: {
    name: 'simple-flash',
    type: 'css',
    duration: 150,
    cssClass: 'simple-flash'
  },
  textEntry: {
    name: 'steady-cursor',
    type: 'css',
    duration: 500,
    cssClass: 'steady-cursor',
    loop: true
  },
  backgroundEffects: []
});

// ORF Theme
this.registerThemeAnimations('orf', {
  pageTransition: {
    name: 'slide-transition',
    type: 'css',
    duration: 300,
    cssClass: 'slide-transition',
    easing: 'ease-in-out'
  },
  loadingIndicator: {
    name: 'rotating-dots',
    type: 'ascii-frames',
    duration: 1000,
    frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    loop: true
  },
  buttonPress: {
    name: 'color-flash',
    type: 'css',
    duration: 150,
    cssClass: 'color-flash'
  },
  textEntry: {
    name: 'color-cursor',
    type: 'css',
    duration: 500,
    cssClass: 'color-cursor',
    loop: true
  },
  backgroundEffects: [
    {
      name: 'color-cycling-header',
      type: 'css',
      duration: 5000,
      cssClass: 'color-cycle',
      loop: true
    }
  ]
});
```

## Performance Considerations

### High Contrast Theme
- All animations use CSS for GPU acceleration
- No background effects to minimize resource usage
- Simple opacity and transform animations are highly performant
- Ideal for users who prefer reduced motion

### ORF Theme
- CSS-based animations with hardware acceleration
- Color cycling uses CSS filters (hue-rotate) which are GPU-accelerated
- Single background effect (color cycling) has minimal performance impact
- Smooth 60fps animations on modern devices

## Accessibility

### High Contrast Theme
- Designed specifically for accessibility
- Respects `prefers-reduced-motion` media query
- Simple, predictable animations
- High contrast maintained throughout all animations
- No distracting or rapid movements

### ORF Theme
- Color cycling may be disabled via accessibility settings
- All animations can be turned off in user preferences
- Maintains readability during all animation states
- Provides visual feedback without relying solely on color

## Testing

Both themes are covered by the Animation Engine test suite:

```typescript
it('should have high-contrast theme registered', () => {
  const animations = engine.getThemeAnimations('high-contrast');
  expect(animations).toBeDefined();
  expect(animations?.pageTransition.name).toBe('simple-fade');
});

it('should have orf theme registered', () => {
  const animations = engine.getThemeAnimations('orf');
  expect(animations).toBeDefined();
  expect(animations?.pageTransition.name).toBe('slide-transition');
});
```

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 5.3**: High Contrast theme displays smooth fade transitions without distracting effects ✓
- **Requirement 5.4**: ORF theme displays color-cycling effects on headers and borders ✓
- **Requirement 10.4**: Both themes registered in Animation Engine ✓

## Future Enhancements

### High Contrast Theme
- Add user-configurable animation speed
- Implement additional accessibility options
- Support for custom high-contrast color schemes

### ORF Theme
- Additional color cycling patterns
- Configurable color cycling speed
- Theme-specific decorative elements
- Austrian broadcasting-inspired ASCII art

## Related Files

- `lib/animation-engine.ts` - Animation Engine implementation
- `app/globals.css` - CSS animation definitions
- `lib/__tests__/animation-engine.test.ts` - Test suite
- `lib/CEEFAX_ANIMATIONS_IMPLEMENTATION.md` - Ceefax theme documentation
- `lib/HAUNTING_ANIMATIONS_IMPLEMENTATION.md` - Haunting theme documentation
