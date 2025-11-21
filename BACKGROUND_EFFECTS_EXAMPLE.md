# Background Effects Integration Example

This document demonstrates how to integrate the background effects system into the Modern Teletext application.

## Requirements Implemented

- **12.1**: Create fog overlay effect for Haunting Mode ✓
- **12.2**: Implement screen flicker effect with configurable intensity ✓
- **12.3**: Add chromatic aberration effect with RGB channel separation ✓
- **12.4**: Create scanline overlay for Ceefax theme ✓
- **12.5**: Ensure background effects don't reduce text readability and allow users to adjust effect intensity ✓

## Integration with TeletextScreen Component

### Step 1: Import Background Effects

```typescript
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { initializeBackgroundEffects } from '@/lib/background-effects';
```

### Step 2: Initialize Effects on Theme Change

```typescript
function TeletextScreen() {
  const { currentThemeKey } = useTheme();

  useEffect(() => {
    // Get the screen element
    const screenElement = document.getElementById('teletext-screen');
    
    if (screenElement) {
      // Initialize background effects for current theme
      initializeBackgroundEffects(currentThemeKey, screenElement);
    }
  }, [currentThemeKey]);

  return (
    <div id="teletext-screen" className="teletext-screen">
      {/* Screen content */}
    </div>
  );
}
```

## Integration with Animation Settings Page

### Step 3: Add Effect Intensity Controls

```typescript
import { useState, useEffect } from 'react';
import { 
  getCurrentEffects, 
  updateEffectIntensity,
  toggleEffect,
  BackgroundEffect,
  EffectIntensity 
} from '@/lib/background-effects';

function AnimationSettingsPage() {
  const [effects, setEffects] = useState<BackgroundEffect[]>([]);

  useEffect(() => {
    // Load current effects
    setEffects(getCurrentEffects());
  }, []);

  const handleIntensityChange = (effectType: string, intensity: EffectIntensity) => {
    updateEffectIntensity(effectType as any, intensity);
    setEffects(getCurrentEffects());
  };

  const handleToggle = (effectType: string, enabled: boolean) => {
    toggleEffect(effectType as any, enabled);
    setEffects(getCurrentEffects());
  };

  return (
    <div className="animation-settings">
      <h2>Background Effects</h2>
      
      {effects.map(effect => (
        <div key={effect.type} className="effect-control">
          <h3>{effect.name}</h3>
          
          {/* Toggle effect on/off */}
          <label>
            <input
              type="checkbox"
              checked={effect.enabled}
              onChange={(e) => handleToggle(effect.type, e.target.checked)}
            />
            Enabled
          </label>
          
          {/* Intensity slider */}
          <div className="intensity-control">
            <label>Intensity:</label>
            <select
              value={effect.intensity}
              onChange={(e) => handleIntensityChange(effect.type, e.target.value as EffectIntensity)}
              disabled={!effect.enabled}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## CSS Integration

The CSS for background effects is already included in `app/globals.css`. The effects use:

1. **CSS Custom Properties** for dynamic intensity control
2. **GPU-accelerated animations** using transform and opacity
3. **Pseudo-elements** (::before, ::after) for overlay effects
4. **Mix-blend-mode** for chromatic aberration

### Example CSS Usage

```css
/* Apply fog overlay with medium intensity */
.teletext-screen.fog-overlay.intensity-medium {
  --fog-intensity: 0.15;
}

/* Apply screen flicker with high intensity */
.teletext-screen.screen-flicker.intensity-high {
  --flicker-intensity: 0.08;
}

/* Apply chromatic aberration with low intensity */
.teletext-screen.chromatic-aberration.intensity-low {
  --chromatic-intensity: 0.15;
}

/* Apply scanlines with medium intensity */
.teletext-screen.scanlines-overlay.intensity-medium {
  --scanlines-intensity: 0.15;
}
```

## Theme-Specific Configurations

### Ceefax Theme
```typescript
// Automatically applied when theme is 'ceefax'
initializeBackgroundEffects('ceefax');

// Result: Scanlines overlay with medium intensity
```

### Haunting/Kiroween Theme
```typescript
// Automatically applied when theme is 'haunting'
initializeBackgroundEffects('haunting');

// Result: 
// - Fog overlay (medium intensity)
// - Screen flicker (medium intensity)
// - Chromatic aberration (medium intensity)
```

### ORF Theme
```typescript
// Automatically applied when theme is 'orf'
initializeBackgroundEffects('orf');

// Result: Scanlines overlay with low intensity
```

### High Contrast Theme
```typescript
// Automatically applied when theme is 'highcontrast'
initializeBackgroundEffects('highcontrast');

// Result: No background effects (clean display)
```

## Advanced Usage

### Custom Effect Intensity

```typescript
import { initializeBackgroundEffects, updateEffectIntensity } from '@/lib/background-effects';

// Initialize with default settings
initializeBackgroundEffects('haunting');

// Customize specific effects
updateEffectIntensity('fog', 'high');
updateEffectIntensity('flicker', 'low');
updateEffectIntensity('chromatic', 'medium');
```

### Disable Specific Effects

```typescript
import { initializeBackgroundEffects, toggleEffect } from '@/lib/background-effects';

// Initialize all effects
initializeBackgroundEffects('haunting');

// Disable fog overlay but keep other effects
toggleEffect('fog', false);

// Re-enable later
toggleEffect('fog', true);
```

### Respect Animation Accessibility Settings

The background effects system automatically respects animation accessibility settings:

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';
import { updateEffectsFromAccessibility } from '@/lib/background-effects';

// When user disables background effects
const accessibility = getAnimationAccessibility();
accessibility.updateSettings({
  backgroundEffectsEnabled: false
});

// Update effects to respect new settings
updateEffectsFromAccessibility();
```

## Performance Considerations

All background effects are optimized for performance:

1. **GPU Acceleration**: All animations use `transform` and `opacity`
2. **No Reflow**: Effects avoid animating layout properties
3. **Efficient Keyframes**: Animations use optimized keyframe definitions
4. **Conditional Rendering**: Effects only apply when enabled
5. **Z-Index Management**: Effects are layered to avoid obscuring content

### Performance Monitoring

```typescript
import { getBackgroundEffects } from '@/lib/background-effects';

// Check current effects
const manager = getBackgroundEffects();
const effects = manager.getEffects();

console.log('Active effects:', effects.filter(e => e.enabled).length);
console.log('Total effects:', effects.length);
```

## Readability Assurance

The system ensures effects don't reduce text readability:

1. **Semi-transparent overlays**: All effects use opacity < 0.5
2. **Proper z-indexing**: Effects are behind text content
3. **Automatic intensity reduction**: When animation intensity < 50%, effects are reduced
4. **Pointer events disabled**: Effects don't interfere with interactions

```typescript
import { getBackgroundEffects } from '@/lib/background-effects';

// Ensure readability
const manager = getBackgroundEffects();
manager.ensureReadability();
```

## Testing

### Unit Tests

```typescript
import { 
  initializeBackgroundEffects, 
  getCurrentEffects,
  updateEffectIntensity 
} from '@/lib/background-effects';

describe('Background Effects Integration', () => {
  it('should initialize effects for Haunting theme', () => {
    const element = document.createElement('div');
    initializeBackgroundEffects('haunting', element);
    
    expect(element.classList.contains('fog-overlay')).toBe(true);
    expect(element.classList.contains('screen-flicker')).toBe(true);
    expect(element.classList.contains('chromatic-aberration')).toBe(true);
  });

  it('should update effect intensity', () => {
    const element = document.createElement('div');
    initializeBackgroundEffects('haunting', element);
    
    updateEffectIntensity('fog', 'high');
    
    const effects = getCurrentEffects();
    const fogEffect = effects.find(e => e.type === 'fog');
    
    expect(fogEffect?.intensity).toBe('high');
  });
});
```

### Visual Testing

1. Open the application in a browser
2. Navigate to Settings (page 701)
3. Switch between themes to see different effects
4. Adjust effect intensity sliders
5. Toggle effects on/off
6. Verify text remains readable at all intensity levels

## Browser Compatibility

All effects use standard CSS features:
- ✓ Chrome/Edge 88+
- ✓ Firefox 85+
- ✓ Safari 14+
- ✓ Opera 74+

Fallback: Effects gracefully degrade in older browsers.

## Troubleshooting

### Effects Not Appearing

1. Check if animations are enabled in accessibility settings
2. Verify theme is correctly set
3. Check browser console for errors
4. Ensure target element exists in DOM

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';
import { getCurrentEffects } from '@/lib/background-effects';

// Debug animation settings
const accessibility = getAnimationAccessibility();
console.log('Should animate:', accessibility.shouldAnimate());
console.log('Background effects enabled:', accessibility.shouldAnimateType('background'));

// Debug current effects
const effects = getCurrentEffects();
console.log('Current effects:', effects);
```

### Effects Too Intense

```typescript
import { updateEffectIntensity } from '@/lib/background-effects';

// Reduce all effects to low intensity
updateEffectIntensity('fog', 'low');
updateEffectIntensity('flicker', 'low');
updateEffectIntensity('chromatic', 'low');
updateEffectIntensity('scanlines', 'low');
```

### Text Readability Issues

```typescript
import { getBackgroundEffects } from '@/lib/background-effects';

// Force readability check
const manager = getBackgroundEffects();
manager.ensureReadability();
```

## Next Steps

1. Integrate with TeletextScreen component
2. Add effect controls to Settings page (701)
3. Test with all themes
4. Verify accessibility compliance
5. Optimize performance if needed
6. Add user documentation

## Related Files

- `lib/background-effects.ts` - Main implementation
- `lib/BACKGROUND_EFFECTS_USAGE.md` - API documentation
- `lib/__tests__/background-effects.test.ts` - Unit tests
- `app/globals.css` - CSS animations and effects
- `lib/animation-accessibility.ts` - Accessibility integration
