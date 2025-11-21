# Kiroween Decorations Usage Guide

This guide explains how to use the Kiroween decorative elements system for the Modern Teletext application.

## Overview

The Kiroween decorations system provides Halloween-themed decorative elements that enhance the Haunting/Kiroween theme with animated jack-o-lanterns, floating ghosts, flying bats, and ASCII cat art.

**Requirements:** 6.2, 7.1, 7.2, 7.3

## Features

- **Jack-o-lantern** (🎃) with flickering animation
- **Floating ghost** (👻) with CSS animation
- **Flying bat** (🦇) with CSS animation
- **ASCII cat art** with blinking eyes animation
- **Flexible positioning system** (header, footer, corner, floating)
- **Theme-aware rendering** (only displays for haunting theme)

## Available Decorations

### Core Decorations

```typescript
import {
  JACK_O_LANTERN,
  FLOATING_GHOST,
  FLYING_BAT,
  ASCII_CAT,
  DEFAULT_KIROWEEN_DECORATIONS
} from '@/lib/kiroween-decorations';
```

### Additional Decorations

```typescript
import {
  SKULL_DECORATION,
  SPIDER_WEB,
  SPIDER,
  KIROWEEN_DECORATIONS
} from '@/lib/kiroween-decorations';
```

## Using the React Component

### Basic Usage

```tsx
import { KiroweeenDecorations } from '@/components/KiroweeenDecorations';

function MyPage() {
  return (
    <div className="page-container">
      <KiroweeenDecorations />
      {/* Your page content */}
    </div>
  );
}
```

### Custom Decorations

```tsx
import { KiroweeenDecorations } from '@/components/KiroweeenDecorations';
import { JACK_O_LANTERN, FLOATING_GHOST } from '@/lib/kiroween-decorations';

function MyPage() {
  const customDecorations = [JACK_O_LANTERN, FLOATING_GHOST];
  
  return (
    <div className="page-container">
      <KiroweeenDecorations decorations={customDecorations} />
      {/* Your page content */}
    </div>
  );
}
```

### Disable Decorations

```tsx
<KiroweeenDecorations enabled={false} />
```

## Decoration Properties

Each decoration has the following structure:

```typescript
interface DecorativeElement {
  id: string;                          // Unique identifier
  type: 'ascii-art' | 'emoji' | 'symbol';
  content: string | string[];          // Content or animation frames
  position: DecorativePosition;        // Where to place the decoration
  animation?: AnimationConfig;         // Optional animation
  zIndex?: number;                     // Stacking order
  size?: 'small' | 'medium' | 'large'; // Display size
}
```

## Position Types

- **header**: Centered at the top
- **footer**: Centered at the bottom
- **corner** / **top-left**: Top-left corner
- **top-right**: Top-right corner
- **bottom-left**: Bottom-left corner
- **bottom-right**: Bottom-right corner
- **floating**: Animated across the screen

## Creating Custom Decorations

```typescript
import { DecorativeElement } from '@/lib/kiroween-decorations';

const MY_CUSTOM_DECORATION: DecorativeElement = {
  id: 'my-decoration',
  type: 'emoji',
  content: '🌙',
  position: 'top-right',
  size: 'medium',
  zIndex: 10,
  animation: {
    name: 'moon-glow',
    type: 'css',
    duration: 2000,
    cssClass: 'moon-glow-animation',
    loop: true
  }
};
```

## Positioning Helpers

### Get Position Styles

```typescript
import { getPositionStyles } from '@/lib/kiroween-decorations';

const styles = getPositionStyles('header', 'large');
// Returns React.CSSProperties with absolute positioning
```

### Filter by Position

```typescript
import {
  getDecorationsForPosition,
  getFloatingDecorations,
  getCornerDecorations
} from '@/lib/kiroween-decorations';

// Get all header decorations
const headerDecorations = getDecorationsForPosition('header');

// Get all floating decorations
const floatingDecorations = getFloatingDecorations();

// Get all corner decorations
const cornerDecorations = getCornerDecorations();
```

## Theme Integration

Decorations automatically check the current theme and only render for the haunting theme:

```typescript
import { shouldRenderDecoration } from '@/lib/kiroween-decorations';

const element = JACK_O_LANTERN;
const shouldRender = shouldRenderDecoration(element, 'haunting'); // true
const shouldNotRender = shouldRenderDecoration(element, 'ceefax'); // false
```

## Animation Integration

Decorations integrate with the Animation Engine automatically:

```typescript
// The component handles animation playback
<KiroweeenDecorations />

// Animations start when component mounts
// Animations stop when component unmounts or theme changes
```

## CSS Animations

The following CSS classes are available for decorations:

- `.jack-o-lantern-flicker` - Flickering pumpkin effect
- `.ghost-float-decoration` - Floating ghost animation
- `.bat-fly-decoration` - Flying bat animation
- `.skull-pulse-decoration` - Pulsing skull effect
- `.spider-crawl-decoration` - Crawling spider animation

## ASCII Art Decorations

ASCII art decorations use frame-by-frame animation:

```typescript
const ASCII_CAT: DecorativeElement = {
  id: 'ascii-cat',
  type: 'ascii-art',
  content: [
    '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',  // Eyes open
    '  /\\_/\\  \n ( -.o ) \n  > ^ <  ',  // Left wink
    '  /\\_/\\  \n ( o.- ) \n  > ^ <  ',  // Right wink
    '  /\\_/\\  \n ( -.- ) \n  > ^ <  '   // Eyes closed
  ],
  position: 'header',
  animation: {
    name: 'cat-blink',
    type: 'ascii-frames',
    duration: 4000,
    frames: [...],
    loop: true
  }
};
```

## React Config Helpers

Convert decorations to React-compatible configs:

```typescript
import { toReactConfig, getAllDecorationsAsConfigs } from '@/lib/kiroween-decorations';

// Convert single decoration
const config = toReactConfig(JACK_O_LANTERN);
// Returns: { element, cssClass, style }

// Convert all decorations
const allConfigs = getAllDecorationsAsConfigs();
```

## Best Practices

1. **Performance**: Use CSS animations when possible for better performance
2. **Z-Index**: Set appropriate z-index values to control layering
3. **Theme Awareness**: Always check theme before rendering decorations
4. **Accessibility**: Ensure decorations don't interfere with content readability
5. **Pointer Events**: Decorations should have `pointer-events: none` to not block interactions

## Example: Full Page Integration

```tsx
import React from 'react';
import { KiroweeenDecorations } from '@/components/KiroweeenDecorations';
import { useTheme } from '@/lib/theme-context';

function HalloweenPage() {
  const { currentThemeKey } = useTheme();
  const isHauntingMode = currentThemeKey === 'haunting';

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      {/* Decorations layer */}
      {isHauntingMode && <KiroweeenDecorations />}
      
      {/* Content layer */}
      <div className="page-content">
        <h1>Welcome to Kiroween! 🎃</h1>
        <p>Spooky content goes here...</p>
      </div>
    </div>
  );
}
```

## Testing

Tests are available in:
- `lib/__tests__/kiroween-decorations.test.ts` - Module tests
- `components/__tests__/KiroweeenDecorations.test.tsx` - Component tests

Run tests:
```bash
npm test -- lib/__tests__/kiroween-decorations.test.ts
npm test -- components/__tests__/KiroweeenDecorations.test.tsx
```

## Requirements Validation

- ✅ **Requirement 6.2**: Halloween decorations on all pages when Haunting Mode is active
- ✅ **Requirement 7.1**: Jack-o-lantern with flickering animation
- ✅ **Requirement 7.2**: Floating ghost sprite with CSS animation
- ✅ **Requirement 7.3**: Flying bat sprite and ASCII cat with animations
