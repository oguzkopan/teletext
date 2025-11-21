# Theme Transition System

## Overview

The theme transition system provides animated transitions when switching between themes in the Modern Teletext application. It includes fade-out/fade-in animations, special horror-themed transitions for Haunting Mode, and theme name banners.

**Requirements:** 27.1, 27.2, 27.3, 27.4, 27.5

## Features

- **Smooth Transitions**: 500-1000ms animated transitions between themes
- **Color Fade Effects**: Fade-out and fade-in during theme changes
- **Theme Name Banner**: Displays theme name during transition (e.g., "HAUNTING MODE ACTIVATED")
- **Special Horror Transition**: Glitch effects for Haunting Mode with chromatic aberration
- **Automatic Persistence**: Theme preference saved immediately after transition completes

## Architecture

### Components

1. **useThemeTransition Hook** (`hooks/useThemeTransition.ts`)
   - Manages transition state and timing
   - Coordinates fade-out, theme switch, fade-in, and banner phases
   - Provides transition CSS classes

2. **ThemeProvider** (`lib/theme-context.tsx`)
   - Integrates transition hook
   - Renders transition overlay and banner
   - Manages theme state and Firestore persistence

3. **CSS Animations** (`app/globals.css`)
   - Theme transition keyframes
   - Banner slide-in animation
   - Horror-themed glitch effects

## Usage

### Basic Theme Switching

The theme transition is automatically applied when using the `setTheme` function from the theme context:

```typescript
import { useTheme } from '@/lib/theme-context';

function ThemeSelector() {
  const { setTheme, currentThemeKey, isTransitioning } = useTheme();

  const handleThemeChange = async (themeKey: string) => {
    await setTheme(themeKey);
  };

  return (
    <div>
      <button 
        onClick={() => handleThemeChange('ceefax')}
        disabled={isTransitioning}
      >
        Ceefax
      </button>
      <button 
        onClick={() => handleThemeChange('haunting')}
        disabled={isTransitioning}
      >
        Haunting Mode
      </button>
      <button 
        onClick={() => handleThemeChange('orf')}
        disabled={isTransitioning}
      >
        ORF
      </button>
      <button 
        onClick={() => handleThemeChange('highcontrast')}
        disabled={isTransitioning}
      >
        High Contrast
      </button>
    </div>
  );
}
```

### Accessing Transition State

```typescript
import { useTheme } from '@/lib/theme-context';

function MyComponent() {
  const { 
    isTransitioning,
    transitionBanner,
    currentThemeKey 
  } = useTheme();

  return (
    <div>
      {isTransitioning && <p>Switching theme...</p>}
      {transitionBanner.visible && (
        <p>Banner: {transitionBanner.text}</p>
      )}
      <p>Current theme: {currentThemeKey}</p>
    </div>
  );
}
```

### Using the Hook Directly (Advanced)

For custom transition implementations:

```typescript
import { useThemeTransition } from '@/hooks/useThemeTransition';

function CustomTransition() {
  const { state, executeTransition, getTransitionClass } = useThemeTransition();

  const handleCustomTransition = async () => {
    await executeTransition(
      'ceefax',
      'haunting',
      'Haunting Mode',
      async () => {
        // Your theme change logic here
        console.log('Theme changed!');
      },
      {
        duration: 800,
        showBanner: true,
        onTransitionStart: () => console.log('Transition started'),
        onTransitionComplete: () => console.log('Transition complete')
      }
    );
  };

  return (
    <div className={getTransitionClass()}>
      <button onClick={handleCustomTransition}>
        Start Custom Transition
      </button>
      {state.bannerVisible && (
        <div className={`theme-banner ${state.bannerTheme}`}>
          {state.bannerText}
        </div>
      )}
    </div>
  );
}
```

## Transition Phases

The transition goes through the following phases:

1. **Fade-Out** (first half of duration)
   - Current theme fades out
   - CSS class: `theme-transition-fade-out` or `haunting-theme-transition`

2. **Switching** (instant)
   - Theme state is updated
   - Firestore persistence occurs

3. **Fade-In** (second half of duration)
   - New theme fades in
   - CSS class: `theme-transition-fade-in`

4. **Banner** (2 seconds)
   - Theme name banner slides in and out
   - CSS class: `theme-banner` with theme-specific class

## Transition Durations

- **Standard Themes** (Ceefax, ORF, High Contrast): 500ms
- **Haunting Mode**: 1000ms (longer for dramatic effect)
- **Custom Duration**: Can be specified in options

## Theme-Specific Banners

### Standard Themes
```
CEEFAX MODE ACTIVATED
ORF MODE ACTIVATED
HIGH CONTRAST MODE ACTIVATED
```

### Haunting Mode
```
🎃 HAUNTING MODE ACTIVATED 🎃
```

## CSS Classes

### Transition Classes

```css
/* Standard fade-out */
.theme-transition-fade-out {
  animation: theme-fade-out 500ms ease-out forwards;
}

/* Standard fade-in */
.theme-transition-fade-in {
  animation: theme-fade-in 500ms ease-in forwards;
}

/* Horror-themed transition with glitch effects */
.haunting-theme-transition {
  animation: haunting-theme-transition 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

### Banner Classes

```css
/* Base banner */
.theme-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  animation: theme-banner-slide-in 2000ms ease-in-out forwards;
}

/* Theme-specific banner styles */
.theme-banner.ceefax { /* Yellow on blue */ }
.theme-banner.haunting { /* Red with glow and flicker */ }
.theme-banner.orf { /* Green on black */ }
.theme-banner.high-contrast { /* White on black */ }
```

## Options

### ThemeTransitionOptions

```typescript
interface ThemeTransitionOptions {
  duration?: number;  // Duration in milliseconds (default: 500 or 1000 for haunting)
  showBanner?: boolean;  // Whether to show theme name banner (default: true)
  onTransitionStart?: () => void;  // Callback when transition starts
  onTransitionComplete?: () => void;  // Callback when transition completes
}
```

## State

### ThemeTransitionState

```typescript
interface ThemeTransitionState {
  isTransitioning: boolean;  // Whether a transition is in progress
  currentPhase: 'idle' | 'fade-out' | 'switching' | 'fade-in' | 'banner';
  bannerVisible: boolean;  // Whether the banner is currently visible
  bannerText: string;  // Text to display in the banner
  bannerTheme: string;  // Theme key for banner styling
}
```

## Examples

### Example 1: Simple Theme Switch

```typescript
const { setTheme } = useTheme();

// Switch to Haunting Mode with default transition
await setTheme('haunting');
```

### Example 2: Disable Transition During Loading

```typescript
const { setTheme, isTransitioning } = useTheme();

<button 
  onClick={() => setTheme('ceefax')}
  disabled={isTransitioning}
>
  Switch to Ceefax
</button>
```

### Example 3: Show Loading State

```typescript
const { isTransitioning, transitionBanner } = useTheme();

{isTransitioning && (
  <div className="loading-overlay">
    <p>Switching theme...</p>
  </div>
)}

{transitionBanner.visible && (
  <div className="banner-preview">
    {transitionBanner.text}
  </div>
)}
```

## Performance Considerations

- Transitions use CSS animations for optimal performance
- GPU-accelerated properties (opacity, transform) are used
- Transitions are automatically cancelled if a new one starts
- Theme preference is saved asynchronously to avoid blocking

## Accessibility

- Banner has `role="status"` and `aria-live="polite"` for screen readers
- Transition overlay has `aria-hidden="true"` to hide from assistive tech
- Buttons should be disabled during transitions to prevent rapid switching
- All functionality works without animations (respects `prefers-reduced-motion`)

## Testing

Tests are located in `hooks/__tests__/useThemeTransition.test.ts` and cover:

- Initialization state
- Transition phases and timing
- Theme-specific durations
- Banner display and text
- Transition cancellation
- Custom options
- Multiple transitions

Run tests with:
```bash
npm test -- hooks/__tests__/useThemeTransition.test.ts
```

## Browser Support

- Modern browsers with CSS animations support
- Web Animations API for JavaScript keyframes
- Fallback to instant theme switch if animations not supported

## Future Enhancements

- Custom transition animations per theme
- User-configurable transition duration
- Transition sound effects
- More elaborate banner animations
- Transition history/undo functionality
