# ASCII Logo and Branding Usage Guide

This module provides animated ASCII art logos, frame-by-frame animations, and branding elements for the Modern Teletext interface.

## Requirements

- **29.1**: Design "Modern Teletext" ASCII art logo
- **29.2**: Implement frame-by-frame logo animation (letters appearing one by one)
- **29.3**: Add animated logo to page 100 header
- **29.4**: Create animated boot sequence with logo
- **29.5**: Implement scrolling credits animation for about page
- **29.6**: Add "Powered by Kiro" badge with subtle animation

## Features

### Logo Definitions

Multiple logo variants are available for different contexts:

```typescript
import {
  MODERN_TELETEXT_LOGO,  // Standard 3-line logo with box
  COMPACT_LOGO,          // Single-line compact version
  SIMPLE_LOGO_40,        // Simple version that fits in 40 chars
  RETRO_LOGO,            // Retro-style with block characters
  KIRO_BADGE             // "Powered by Kiro" badge
} from '@/lib/ascii-logo';
```

### Animation Frames

Pre-built animation frames for various effects:

```typescript
import {
  LOGO_REVEAL_FRAMES,    // Progressive letter-by-letter reveal
  LOGO_PULSE_FRAMES,     // Pulsing animation
  KIRO_BADGE_FRAMES      // Subtle badge animation
} from '@/lib/ascii-logo';
```

### Animation Configurations

Helper functions to create animation configs compatible with the Animation Engine:

```typescript
import {
  createLogoRevealAnimation,
  createLogoPulseAnimation,
  createKiroBadgeAnimation,
  createScrollingCreditsAnimation,
  createBootSequenceAnimation
} from '@/lib/ascii-logo';

// Use with Animation Engine
const animEngine = getAnimationEngine();
const config = createLogoRevealAnimation();
animEngine.playAnimationConfig(config, targetElement);
```

## Usage Examples

### 1. Static Logo Display

Display the logo on a page without animation:

```typescript
import { MODERN_TELETEXT_LOGO, formatLogoForPage } from '@/lib/ascii-logo';

const rows = [
  ...formatLogoForPage(MODERN_TELETEXT_LOGO),
  'Additional content here...',
  // ... more rows
];
```

### 2. Animated Logo Reveal

Animate the logo appearing letter by letter:

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';
import { createLogoRevealAnimation } from '@/lib/ascii-logo';

const animEngine = getAnimationEngine();
const logoElement = document.getElementById('logo');

if (logoElement) {
  const animation = createLogoRevealAnimation();
  animEngine.playAnimationConfig(animation, logoElement);
}
```

### 3. Boot Sequence with Logo

Create a boot sequence with animated logo:

```typescript
import { createBootSequenceAnimation } from '@/lib/ascii-logo';

const animations = createBootSequenceAnimation();

// Play each animation in sequence
animations.forEach((config, index) => {
  setTimeout(() => {
    animEngine.playAnimationConfig(config, targetElement);
  }, index * config.duration);
});
```

### 4. Scrolling Credits

Display scrolling credits on the about page:

```typescript
import { createScrollingCreditsAnimation } from '@/lib/ascii-logo';

const creditsAnimation = createScrollingCreditsAnimation();
animEngine.playAnimationConfig(creditsAnimation, creditsElement);
```

### 5. Kiro Badge with Animation

Add an animated "Powered by Kiro" badge:

```typescript
import { createKiroBadgeAnimation, getRandomKiroBadge } from '@/lib/ascii-logo';

// Get a random badge variant
const badge = getRandomKiroBadge();

// Animate it
const animation = createKiroBadgeAnimation();
animEngine.playAnimationConfig(animation, badgeElement);
```

## Integration with Pages

### Page 100 (Main Index)

The main index page includes metadata to trigger logo animation:

```typescript
{
  id: '100',
  title: 'Main Index',
  rows: [...],
  meta: {
    animatedLogo: true,
    logoAnimation: 'logo-reveal'
  }
}
```

Frontend components can check this metadata and trigger the appropriate animation.

### Page 198 (Scrolling Credits)

The credits page includes metadata for scrolling animation:

```typescript
{
  id: '198',
  title: 'Credits',
  rows: [...],
  meta: {
    scrollingCredits: true,
    creditsAnimation: 'scrolling-credits'
  }
}
```

### Page 199 (About)

The about page includes metadata for Kiro badge animation:

```typescript
{
  id: '199',
  title: 'About & Credits',
  rows: [...],
  meta: {
    kiroBadge: true,
    kiroBadgeAnimation: 'kiro-badge-pulse'
  }
}
```

## Utility Functions

### centerText

Centers text within a specified width:

```typescript
import { centerText } from '@/lib/ascii-logo';

const centered = centerText('HELLO', 40);
// Result: '                 HELLO                  '
```

### formatLogoForPage

Formats logo lines to fit page width:

```typescript
import { formatLogoForPage } from '@/lib/ascii-logo';

const logo = ['SHORT', 'MEDIUM', 'LONG LINE'];
const formatted = formatLogoForPage(logo, 40);
// Each line will be exactly 40 characters
```

### getRandomKiroBadge

Gets a random Kiro badge variant:

```typescript
import { getRandomKiroBadge } from '@/lib/ascii-logo';

const badge = getRandomKiroBadge();
// Returns one of: '⚡ Powered by Kiro', '✨ Built with Kiro', etc.
```

## Custom Scrolling Credits

Create custom scrolling credits frames:

```typescript
import { createScrollingCreditsFrames } from '@/lib/ascii-logo';

// Create frames starting from line 10, showing 20 lines at a time
const frames = createScrollingCreditsFrames(10, 20);

// Use with Animation Engine
const config = {
  name: 'custom-credits',
  type: 'ascii-frames',
  duration: frames.length * 150,
  frames,
  loop: false
};

animEngine.playAnimationConfig(config, element);
```

## Credits Content

The module includes comprehensive credits content covering:

- Project information
- Technology stack
- Inspiration sources
- Special thanks
- Open source information
- Kiro attribution

Access the raw credits content:

```typescript
import { CREDITS_CONTENT } from '@/lib/ascii-logo';

// CREDITS_CONTENT is an array of strings
console.log(CREDITS_CONTENT.length); // Number of credit lines
```

## Performance Considerations

- Logo reveal animation: ~2.3 seconds (23 frames @ 100ms each)
- Logo pulse animation: ~2.4 seconds per cycle (8 frames @ 300ms each)
- Kiro badge animation: ~2 seconds per cycle (5 frames @ 400ms each)
- Scrolling credits: Variable duration based on content length

All animations use ASCII frame-by-frame rendering for authentic teletext feel.

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS animations
- Web Animations API (for JavaScript keyframe animations)

## Accessibility

- All animations can be disabled via user settings
- Static fallbacks are provided for all animated content
- Respects `prefers-reduced-motion` media query

## Examples in Codebase

See these files for implementation examples:

- `components/BootSequence.tsx` - Boot sequence with animated logo
- `functions/src/adapters/StaticAdapter.ts` - Page metadata for animations
- `lib/__tests__/ascii-logo.test.ts` - Comprehensive test examples

