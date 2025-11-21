# Background Effects Usage Guide

This module provides theme-specific background effects with configurable intensity for the Modern Teletext application.

## Requirements

- **12.1**: Create fog overlay effect for Haunting Mode
- **12.2**: Implement screen flicker effect with configurable intensity
- **12.3**: Add chromatic aberration effect with RGB channel separation
- **12.4**: Create scanline overlay for Ceefax theme
- **12.5**: Ensure background effects don't reduce text readability and allow users to adjust effect intensity

## Available Effects

### 1. Fog Overlay (Haunting Mode)
Creates a drifting fog effect with multiple layers of semi-transparent gradients.

**CSS Class**: `fog-overlay`
**Intensity Levels**: low (0.08), medium (0.15), high (0.25)

### 2. Screen Flicker
Simulates CRT screen flickering with variable opacity changes.

**CSS Class**: `screen-flicker`
**Intensity Levels**: low (0.03), medium (0.05), high (0.08)

### 3. Chromatic Aberration
RGB channel separation effect that creates a retro color distortion.

**CSS Class**: `chromatic-aberration`
**Intensity Levels**: low (0.15), medium (0.3), high (0.5)

### 4. Scanlines
Classic CRT scanline overlay effect.

**CSS Class**: `scanlines-overlay`
**Intensity Levels**: low (0.08), medium (0.15), high (0.25)

## Basic Usage

### Initialize Effects for a Theme

```typescript
import { initializeBackgroundEffects } from '@/lib/background-effects';

// Initialize effects for Haunting theme
initializeBackgroundEffects('haunting');

// Initialize effects for Ceefax theme
initializeBackgroundEffects('ceefax');

// Initialize effects on a specific element
const screenElement = document.getElementById('teletext-screen');
initializeBackgroundEffects('haunting', screenElement);
```

### Adjust Effect Intensity

```typescript
import { updateEffectIntensity } from '@/lib/background-effects';

// Set fog overlay to high intensity
updateEffectIntensity('fog', 'high');

// Set screen flicker to low intensity
updateEffectIntensity('flicker', 'low');

// Set chromatic aberration to medium intensity
updateEffectIntensity('chromatic', 'medium');

// Set scanlines to low intensity
updateEffectIntensity('scanlines', 'low');
```

### Toggle Effects On/Off

```typescript
import { toggleEffect } from '@/lib/background-effects';

// Disable fog overlay
toggleEffect('fog', false);

// Enable screen flicker
toggleEffect('flicker', true);
```

### Get Current Effects

```typescript
import { getCurrentEffects } from '@/lib/background-effects';

const effects = getCurrentEffects();
effects.forEach(effect => {
  console.log(`${effect.name}: ${effect.enabled ? 'enabled' : 'disabled'} (${effect.intensity})`);
});
```

## Theme-Specific Configurations

### Ceefax Theme
```typescript
const CEEFAX_EFFECTS = [
  {
    type: 'scanlines',
    name: 'Scanlines',
    intensity: 'medium',
    enabled: true
  }
];
```

### Haunting/Kiroween Theme
```typescript
const HAUNTING_EFFECTS = [
  {
    type: 'fog',
    name: 'Fog Overlay',
    intensity: 'medium',
    enabled: true
  },
  {
    type: 'flicker',
    name: 'Screen Flicker',
    intensity: 'medium',
    enabled: true
  },
  {
    type: 'chromatic',
    name: 'Chromatic Aberration',
    intensity: 'medium',
    enabled: true
  }
];
```

### ORF Theme
```typescript
const ORF_EFFECTS = [
  {
    type: 'scanlines',
    name: 'Scanlines',
    intensity: 'low',
    enabled: true
  }
];
```

### High Contrast Theme
No background effects (empty array).

## Integration with Animation Accessibility

The background effects system automatically respects animation accessibility settings:

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';
import { updateEffectsFromAccessibility } from '@/lib/background-effects';

// When user changes animation settings
const accessibility = getAnimationAccessibility();
accessibility.updateSettings({
  backgroundEffectsEnabled: false
});

// Update effects to respect new settings
updateEffectsFromAccessibility();
```

## CSS Classes

### Base Effect Classes
- `.fog-overlay` - Fog overlay effect
- `.screen-flicker` - Screen flicker effect
- `.chromatic-aberration` - Chromatic aberration effect
- `.scanlines-overlay` - Scanlines effect

### Intensity Modifier Classes
- `.intensity-low` - Low intensity variant
- `.intensity-medium` - Medium intensity variant
- `.intensity-high` - High intensity variant

### Example HTML
```html
<!-- Fog overlay with medium intensity -->
<div class="fog-overlay intensity-medium">
  <!-- Content -->
</div>

<!-- Screen flicker with high intensity -->
<div class="screen-flicker intensity-high">
  <!-- Content -->
</div>

<!-- Multiple effects combined -->
<div class="fog-overlay screen-flicker chromatic-aberration intensity-medium">
  <!-- Content -->
</div>
```

## CSS Variables

Effects support dynamic intensity control via CSS variables:

```css
/* Fog overlay intensity */
--fog-intensity: 0.15;

/* Screen flicker intensity */
--flicker-intensity: 0.05;

/* Chromatic aberration intensity */
--chromatic-intensity: 0.3;

/* Scanlines intensity */
--scanlines-intensity: 0.15;
```

### Setting Variables Programmatically
```typescript
import { getBackgroundEffects } from '@/lib/background-effects';

const manager = getBackgroundEffects();
manager.applyCSSVariables();
```

## Readability Considerations

The system automatically ensures effects don't reduce text readability:

1. **Automatic Intensity Reduction**: When animation intensity is below 50%, effects are automatically reduced
2. **Z-Index Management**: Effects are layered properly to avoid obscuring text
3. **Opacity Control**: All effects use semi-transparent overlays
4. **Pointer Events**: Effects have `pointer-events: none` to not interfere with interactions

## Performance Optimization

All effects use GPU-accelerated CSS animations:

- **Transform and Opacity**: All animations use `transform` and `opacity` for GPU acceleration
- **No Reflow**: Effects avoid animating properties that cause layout reflow
- **Efficient Keyframes**: Animations use efficient keyframe definitions
- **Conditional Rendering**: Effects are only applied when accessibility settings allow

## Example: Complete Integration

```typescript
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { initializeBackgroundEffects, updateEffectIntensity } from '@/lib/background-effects';

function TeletextScreen() {
  const { currentThemeKey } = useTheme();

  useEffect(() => {
    // Initialize effects when theme changes
    const screenElement = document.getElementById('teletext-screen');
    initializeBackgroundEffects(currentThemeKey, screenElement);

    // Optionally adjust specific effects
    if (currentThemeKey === 'haunting') {
      updateEffectIntensity('fog', 'high');
      updateEffectIntensity('chromatic', 'medium');
    }
  }, [currentThemeKey]);

  return (
    <div id="teletext-screen" className="teletext-screen">
      {/* Content */}
    </div>
  );
}
```

## Testing

```typescript
import { 
  initializeBackgroundEffects, 
  getCurrentEffects,
  updateEffectIntensity,
  toggleEffect 
} from '@/lib/background-effects';

describe('Background Effects', () => {
  it('should initialize effects for Haunting theme', () => {
    initializeBackgroundEffects('haunting');
    const effects = getCurrentEffects();
    
    expect(effects).toHaveLength(3);
    expect(effects.find(e => e.type === 'fog')).toBeDefined();
    expect(effects.find(e => e.type === 'flicker')).toBeDefined();
    expect(effects.find(e => e.type === 'chromatic')).toBeDefined();
  });

  it('should update effect intensity', () => {
    initializeBackgroundEffects('haunting');
    updateEffectIntensity('fog', 'high');
    
    const effects = getCurrentEffects();
    const fogEffect = effects.find(e => e.type === 'fog');
    
    expect(fogEffect?.intensity).toBe('high');
  });

  it('should toggle effects', () => {
    initializeBackgroundEffects('haunting');
    toggleEffect('fog', false);
    
    const effects = getCurrentEffects();
    const fogEffect = effects.find(e => e.type === 'fog');
    
    expect(fogEffect?.enabled).toBe(false);
  });
});
```

## Browser Compatibility

All effects use standard CSS features supported in modern browsers:
- CSS animations
- CSS gradients
- CSS pseudo-elements (::before, ::after)
- CSS custom properties (variables)
- Mix-blend-mode

Fallback: Effects gracefully degrade in older browsers by simply not appearing.
