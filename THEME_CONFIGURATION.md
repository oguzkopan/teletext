# Theme Configuration Guide

## Overview

Modern Teletext supports multiple themes with unique color palettes, visual effects, and animations. This guide explains how to configure existing themes and create new custom themes.

## Available Themes

### 1. Classic Ceefax
The original BBC Ceefax aesthetic with subtle retro effects.

**Colors:**
- Background: `#000000` (Black)
- Text: `#ffffff` (White)
- Red: `#ff0000`
- Green: `#00ff00`
- Yellow: `#ffff00`
- Blue: `#0000ff`
- Magenta: `#ff00ff`
- Cyan: `#00ffff`

**Effects:**
- Scanlines: Enabled
- Curvature: Enabled
- Noise: Subtle
- Glitch: Disabled

**Animations:**
- Page Transition: Horizontal wipe (300ms)
- Loading: Rotating line (`|`, `/`, `─`, `\`)
- Button Press: Flash effect (150ms)
- Background: Scanline overlay

### 2. Haunting/Kiroween
Halloween-themed with spooky animations and effects.

**Colors:**
- Background: `#000000` (Black)
- Text: `#00ff00` (Green)
- Red: `#ff0000`
- Green: `#00ff00`
- Yellow: `#ffaa00`
- Blue: `#6600ff`
- Magenta: `#ff00ff`
- Cyan: `#00ffff`

**Effects:**
- Scanlines: Enabled
- Curvature: Enabled
- Noise: Moderate
- Glitch: Enabled

**Animations:**
- Page Transition: Glitch effect (400ms)
- Loading: Pulsing skull (💀, 👻, 🎃)
- Button Press: Horror flash (200ms)
- Background: Floating ghosts, screen flicker, chromatic aberration
- Decorations: Jack-o'-lanterns, bats, animated cat

### 3. High Contrast
Accessibility-focused theme with minimal effects.

**Colors:**
- Background: `#000000` (Black)
- Text: `#ffffff` (White)
- Red: `#ff0000`
- Green: `#00ff00`
- Yellow: `#ffff00`
- Blue: `#0099ff`
- Magenta: `#ff00ff`
- Cyan: `#00ffff`

**Effects:**
- Scanlines: Disabled
- Curvature: Disabled
- Noise: Disabled
- Glitch: Disabled

**Animations:**
- Page Transition: Simple fade (250ms)
- Loading: Smooth indicator
- Button Press: Subtle highlight
- Background: None

### 4. ORF
Austrian ORF teletext style with color-cycling effects.

**Colors:**
- Background: `#0000aa` (Blue)
- Text: `#ffffff` (White)
- Red: `#ff0000`
- Green: `#00ff00`
- Yellow: `#ffff00`
- Blue: `#0000ff`
- Magenta: `#ff00ff`
- Cyan: `#00ffff`

**Effects:**
- Scanlines: Enabled
- Curvature: Enabled
- Noise: Subtle
- Glitch: Disabled

**Animations:**
- Page Transition: Slide effect (300ms)
- Loading: Rotating indicator
- Button Press: Color pulse
- Background: Color-cycling headers

## Theme Configuration Structure

### ThemeConfig Interface

```typescript
interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    text: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
  };
  effects: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
    glitch: boolean;
  };
  animations: ThemeAnimationSet;
  decorativeElements: DecorativeElement[];
  transitionStyle: TransitionStyle;
  backgroundEffects: BackgroundEffect[];
}
```

## Creating a Custom Theme

### Step 1: Define Theme Configuration

Create a new theme configuration file:

```typescript
// lib/themes/my-custom-theme.ts

import { ThemeConfig } from '@/types/teletext';

export const MY_CUSTOM_THEME: ThemeConfig = {
  name: 'My Custom Theme',
  colors: {
    background: '#1a1a2e',
    text: '#eaeaea',
    red: '#ff6b6b',
    green: '#51cf66',
    yellow: '#ffd43b',
    blue: '#4dabf7',
    magenta: '#cc5de8',
    cyan: '#22b8cf',
    white: '#ffffff'
  },
  effects: {
    scanlines: true,
    curvature: false,
    noise: true,
    glitch: false
  },
  animations: {
    pageTransition: {
      name: 'custom-transition',
      type: 'css',
      duration: 350,
      cssClass: 'custom-transition',
      easing: 'ease-in-out'
    },
    loadingIndicator: {
      name: 'custom-loading',
      type: 'ascii-frames',
      duration: 1000,
      frames: ['◐', '◓', '◑', '◒']
    },
    buttonPress: {
      name: 'custom-button',
      type: 'css',
      duration: 200,
      cssClass: 'custom-button-press'
    },
    textEntry: {
      name: 'custom-cursor',
      type: 'css',
      duration: 600,
      cssClass: 'custom-cursor-blink'
    },
    backgroundEffects: [],
    decorativeElements: []
  },
  decorativeElements: [],
  transitionStyle: {
    type: 'fade',
    duration: 350,
    easing: 'ease-in-out'
  },
  backgroundEffects: []
};
```

### Step 2: Create CSS Animations

Create CSS file for theme animations:

```css
/* app/themes/my-custom-theme.css */

/* Page transition */
.custom-transition {
  animation: customTransition 350ms ease-in-out;
}

@keyframes customTransition {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Button press */
.custom-button-press {
  animation: customButtonPress 200ms ease-out;
}

@keyframes customButtonPress {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
    filter: brightness(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Cursor blink */
.custom-cursor-blink {
  animation: customCursorBlink 600ms step-end infinite;
}

@keyframes customCursorBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
```

### Step 3: Register Theme

Register the theme in the theme system:

```typescript
// lib/theme-context.tsx

import { MY_CUSTOM_THEME } from './themes/my-custom-theme';

const THEMES = {
  ceefax: CEEFAX_THEME,
  haunting: HAUNTING_THEME,
  'high-contrast': HIGH_CONTRAST_THEME,
  orf: ORF_THEME,
  'my-custom': MY_CUSTOM_THEME  // Add your theme
};
```

### Step 4: Import CSS

Import the CSS file in your app:

```typescript
// app/layout.tsx

import './themes/my-custom-theme.css';
```

### Step 5: Add Theme Selection

Add theme to settings page:

```typescript
// Update page 700 (Theme Selection)

const themes = [
  { id: 'ceefax', name: 'Classic Ceefax' },
  { id: 'haunting', name: 'Haunting Mode' },
  { id: 'high-contrast', name: 'High Contrast' },
  { id: 'orf', name: 'ORF' },
  { id: 'my-custom', name: 'My Custom Theme' }  // Add here
];
```

## Customizing Existing Themes

### Modifying Colors

```typescript
// lib/theme-context.tsx

const customCeefax = {
  ...CEEFAX_THEME,
  colors: {
    ...CEEFAX_THEME.colors,
    background: '#001100',  // Dark green background
    text: '#00ff00'         // Bright green text
  }
};
```

### Adjusting Effects

```typescript
const customHaunting = {
  ...HAUNTING_THEME,
  effects: {
    ...HAUNTING_THEME.effects,
    glitch: false,  // Disable glitch effect
    noise: false    // Disable noise
  }
};
```

### Changing Animations

```typescript
const customTheme = {
  ...CEEFAX_THEME,
  animations: {
    ...CEEFAX_THEME.animations,
    pageTransition: {
      name: 'fade',
      type: 'css',
      duration: 500,  // Slower transition
      cssClass: 'fade-transition'
    }
  }
};
```

## Adding Decorative Elements

### Static Decorations

```typescript
decorativeElements: [
  {
    type: 'emoji',
    content: '⭐',
    position: 'corner',
    animation: undefined  // No animation
  }
]
```

### Animated Decorations

```typescript
decorativeElements: [
  {
    type: 'emoji',
    content: '🌟',
    position: 'floating',
    animation: {
      name: 'star-twinkle',
      type: 'css',
      duration: 2000,
      cssClass: 'star-twinkle'
    }
  }
]
```

### ASCII Art Decorations

```typescript
decorativeElements: [
  {
    type: 'ascii-art',
    content: [
      '  /\\_/\\  ',
      ' ( o.o ) ',
      '  > ^ <  '
    ],
    position: 'header',
    animation: {
      name: 'blink',
      type: 'ascii-frames',
      duration: 2000,
      frames: [
        '  /\\_/\\  \n ( o.o ) \n  > ^ <  ',
        '  /\\_/\\  \n ( -.o ) \n  > ^ <  ',
        '  /\\_/\\  \n ( o.- ) \n  > ^ <  '
      ]
    }
  }
]
```

## Background Effects

### Adding Background Effects

```typescript
backgroundEffects: [
  {
    name: 'particles',
    cssClass: 'particles-effect',
    intensity: 50,  // 0-100
    zIndex: 0
  },
  {
    name: 'gradient',
    cssClass: 'gradient-overlay',
    intensity: 30,
    zIndex: 1
  }
]
```

### CSS for Background Effects

```css
.particles-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: particlesMove 20s linear infinite;
}

@keyframes particlesMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}
```

## Theme Transitions

### Configuring Transition Style

```typescript
transitionStyle: {
  type: 'fade',           // 'fade', 'wipe', 'glitch', 'slide'
  duration: 500,          // milliseconds
  easing: 'ease-in-out'   // CSS easing function
}
```

### Custom Transition Animation

```typescript
transitionStyle: {
  type: 'custom',
  duration: 800,
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
}
```

```css
.theme-transition-custom {
  animation: customThemeTransition 800ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes customThemeTransition {
  0% {
    opacity: 1;
    filter: blur(0px);
  }
  50% {
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
  }
}
```

## User Preferences

### Saving Theme Preferences

```typescript
import { saveUserPreferences } from '@/lib/firebase-client';

async function setTheme(themeName: string) {
  // Apply theme
  themeContext.setTheme(themeName);
  
  // Save to Firestore
  await saveUserPreferences({
    theme: themeName
  });
}
```

### Loading Theme Preferences

```typescript
import { getUserPreferences } from '@/lib/firebase-client';

async function loadThemePreference() {
  const prefs = await getUserPreferences();
  if (prefs?.theme) {
    themeContext.setTheme(prefs.theme);
  }
}
```

## Best Practices

### 1. Maintain Readability

```typescript
// Good - High contrast
colors: {
  background: '#000000',
  text: '#ffffff'
}

// Avoid - Low contrast
colors: {
  background: '#333333',
  text: '#444444'  // Hard to read
}
```

### 2. Consistent Color Usage

```typescript
// Good - Consistent color meanings
colors: {
  red: '#ff0000',    // Always for errors/back
  green: '#00ff00',  // Always for success/forward
  yellow: '#ffff00', // Always for warnings
  blue: '#0000ff'    // Always for info
}
```

### 3. Performance-Friendly Animations

```typescript
// Good - GPU accelerated
animations: {
  pageTransition: {
    type: 'css',
    cssClass: 'gpu-accelerated-transition'  // Uses transform/opacity
  }
}

// Avoid - CPU intensive
animations: {
  pageTransition: {
    type: 'javascript',
    keyframes: [
      { width: '0%' },    // Causes reflow
      { width: '100%' }   // Causes reflow
    ]
  }
}
```

### 4. Accessibility Considerations

```typescript
// Include high contrast option
effects: {
  scanlines: false,  // Disable for accessibility
  curvature: false,
  noise: false,
  glitch: false
}

// Provide reduced motion alternative
animations: {
  pageTransition: {
    duration: 0  // Instant for reduced motion
  }
}
```

## Testing Themes

### Visual Testing

```typescript
// Test all themes
const themes = ['ceefax', 'haunting', 'high-contrast', 'orf'];

themes.forEach(theme => {
  it(`should render ${theme} theme correctly`, () => {
    render(<App theme={theme} />);
    // Verify colors, effects, animations
  });
});
```

### Animation Testing

```typescript
it('should play theme transition animation', async () => {
  const { container } = render(<App theme="haunting" />);
  
  // Trigger theme change
  fireEvent.click(screen.getByText('Ceefax'));
  
  // Verify transition animation
  await waitFor(() => {
    expect(container.querySelector('.glitch-transition')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Theme Not Applying

**Problem:** Theme colors or effects not showing.

**Solution:**
```typescript
// Check theme is registered
console.log(THEMES['my-custom']);

// Verify CSS is imported
import './themes/my-custom-theme.css';

// Check theme context
const { currentTheme } = useTheme();
console.log(currentTheme);
```

### Animations Not Working

**Problem:** Theme animations not playing.

**Solution:**
```typescript
// Verify animation config
console.log(theme.animations.pageTransition);

// Check CSS class exists
const element = document.querySelector('.custom-transition');
console.log(getComputedStyle(element).animation);

// Ensure animation engine is initialized
const animationEngine = new AnimationEngine();
animationEngine.setTheme('my-custom');
```

### Performance Issues

**Problem:** Theme causes lag or stuttering.

**Solution:**
```typescript
// Reduce background effects
backgroundEffects: []  // Disable all

// Simplify animations
animations: {
  pageTransition: {
    duration: 0  // Instant
  }
}

// Disable decorative elements
decorativeElements: []
```

## See Also

- [ANIMATION_ENGINE_API.md](./ANIMATION_ENGINE_API.md) - Animation Engine API
- [ADDING_ANIMATIONS.md](./ADDING_ANIMATIONS.md) - Adding new animations
- [ACCESSIBILITY_FEATURES.md](./ACCESSIBILITY_FEATURES.md) - Accessibility features
- [lib/theme-context.tsx](./lib/theme-context.tsx) - Theme context implementation
