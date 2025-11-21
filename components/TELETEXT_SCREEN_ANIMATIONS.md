# TeletextScreen Component - Animation Enhancements

## Overview

The TeletextScreen component has been enhanced with comprehensive animation support, integrating with the Animation Engine to provide theme-specific visual effects, page transitions, loading animations, and interactive element highlighting.

## Features Implemented

### 1. Animation Layer Overlay (Requirement 6.1)
- Added a dedicated animation layer for theme-specific background effects
- Positioned absolutely with `pointer-events: none` to avoid interfering with content
- Automatically applies background effects based on the current theme

### 2. Page Transition Animations (Requirements 10.1, 10.2, 10.3, 10.4)
- **Ceefax Theme**: Horizontal wipe transition (300ms)
- **Haunting Mode**: Glitch transition with chromatic aberration (400ms)
- **High Contrast**: Simple fade transition (250ms)
- **ORF Theme**: Slide transition (300ms)
- Transitions play automatically when navigating between pages

### 3. Loading Animation Display (Requirement 6.3)
- Theme-appropriate loading indicators:
  - **Ceefax**: Rotating line animation (`|`, `/`, `─`, `\`)
  - **Haunting**: Pulsing skull/ghost animation (💀, 👻, 🎃)
  - **High Contrast**: Smooth loading spinner
  - **ORF**: Rotating dots animation
- Loading animation loops continuously until content loads

### 4. Animated ASCII Art Rendering
- Frame-by-frame ASCII animation support
- Used for loading indicators and decorative elements
- Configurable frame duration and looping

### 5. Interactive Element Highlighting (Requirement 6.4)
- Detects interactive elements (text in brackets like `[1]`, `[Option]`)
- Applies visual highlighting:
  - Bold font weight
  - Underline decoration
  - Pointer cursor on hover
  - Background highlight on hover
- Enhances user understanding of clickable/selectable elements

### 6. Visual Feedback for Navigation
- Arrow indicators (▲ BACK, ▼ MORE) pulse to draw attention
- Interactive elements respond to hover with background highlight
- Smooth animations for all state changes

## Theme-Specific Animations

### Ceefax Theme
```css
/* Page transition */
.ceefax-wipe {
  animation: ceefax-wipe 0.3s ease-in-out;
}

/* Button press */
.button-flash {
  animation: button-flash 0.15s ease-in-out;
}

/* Text cursor */
.cursor-blink {
  animation: cursor-blink 0.5s step-end infinite;
}

/* Background effect */
.scanlines-overlay {
  background: repeating-linear-gradient(...);
}
```

### Haunting Mode
```css
/* Page transition */
.glitch-transition {
  /* JavaScript keyframe animation */
  transform + filter effects
}

/* Button press */
.horror-flash {
  animation: horror-flash 0.2s ease-in-out;
  /* Includes hue rotation and brightness */
}

/* Text cursor */
.glitch-cursor {
  animation: glitch-cursor 0.3s steps(2) infinite;
  /* Includes position jitter */
}

/* Background effects */
.ghost-float {
  animation: ghost-float 10s ease-in-out infinite;
}

.screen-flicker {
  animation: screen-flicker 5s ease-in-out infinite;
}

.chromatic-aberration {
  /* RGB channel separation effect */
}
```

### High Contrast Theme
```css
/* Simple, accessible animations */
.fade-transition {
  animation: fade-transition 0.25s ease;
}

.simple-flash {
  animation: simple-flash 0.15s ease;
}

.steady-cursor {
  animation: steady-cursor 0.5s ease-in-out infinite;
}
```

### ORF Theme
```css
/* Colorful animations */
.slide-transition {
  animation: slide-transition 0.3s ease-in-out;
}

.color-flash {
  animation: color-flash 0.15s ease;
  /* Includes hue rotation */
}

.color-cursor {
  animation: color-cursor 0.5s ease-in-out infinite;
}

.color-cycle {
  animation: color-cycle 5s linear infinite;
}
```

## Usage Example

```tsx
import TeletextScreen from '@/components/TeletextScreen';
import { useTheme } from '@/lib/theme-context';

function MyPage() {
  const { currentTheme } = useTheme();
  const [page, setPage] = useState<TeletextPage>(...);
  const [loading, setLoading] = useState(false);

  return (
    <TeletextScreen
      page={page}
      loading={loading}
      theme={currentTheme}
      isOnline={navigator.onLine}
    />
  );
}
```

## Interactive Elements

The component automatically detects and highlights interactive elements:

```typescript
// In your page content:
const rows = [
  '[1] First Option',
  '[2] Second Option',
  'Press [ENTER] to continue',
  'Navigate with [↑] [↓] arrows'
];

// These will be automatically styled with:
// - Bold text
// - Underline
// - Hover effects
// - Pointer cursor
```

## Animation Engine Integration

The component integrates with the Animation Engine singleton:

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';

const animationEngine = getAnimationEngine();

// Set theme (done automatically)
animationEngine.setTheme('haunting');

// Play animations (done automatically)
animationEngine.playPageTransition(element);
animationEngine.playLoadingIndicator(element);
animationEngine.applyBackgroundEffects(element);
```

## Performance Considerations

- All animations use CSS transforms and opacity for GPU acceleration
- Background effects are applied to a separate layer to avoid reflows
- Memoization prevents unnecessary re-renders
- Animation cleanup on unmount prevents memory leaks
- Refs used for direct DOM manipulation where needed

## Accessibility

- Interactive elements are keyboard accessible
- Visual feedback doesn't rely solely on color
- Animations respect user preferences (can be disabled)
- Loading states are clearly indicated
- Screen reader compatible structure

## Testing

The component includes comprehensive tests:
- Renders 40×24 character grid
- Displays loading indicators correctly
- Applies theme colors
- Parses color codes
- Shows offline indicators
- Handles interactive elements

Run tests:
```bash
npm test -- components/__tests__/TeletextScreen.test.tsx
```

## Requirements Validated

- ✅ 6.1: Animation layer overlay for theme-specific effects
- ✅ 6.3: Loading animation display with theme-appropriate indicators
- ✅ 6.4: Visual feedback for interactive elements (highlighting, brackets)
- ✅ 10.1: Page transition animations
- ✅ 10.2: Ceefax theme animations
- ✅ 10.3: Haunting theme animations
- ✅ 10.4: High Contrast and ORF theme animations

## Future Enhancements

Potential improvements for future iterations:
- User-configurable animation intensity
- Additional animation types (bounce, zoom, rotate)
- Custom animation registration API
- Animation performance monitoring
- Reduced motion mode for accessibility
