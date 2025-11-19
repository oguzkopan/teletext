# CRT Effects Control Usage Guide

## Overview

Page 701 provides a comprehensive control panel for adjusting CRT (Cathode Ray Tube) visual effects in real-time. This page allows users to customize the retro television aesthetic of the teletext interface.

## Accessing the Page

Navigate to page 701 from:
- Theme selection page (700) - Red button labeled "EFFECTS"
- Direct navigation by entering "701"

## Available Controls

### 1. Scanline Intensity (0-100%)

Controls the visibility and intensity of horizontal scanlines that mimic the appearance of a CRT display.

- **Range**: 0% (no scanlines) to 100% (maximum intensity)
- **Default**: 50%
- **Visual Indicator**: 20-character slider bar using █ (filled) and ░ (empty) characters
- **User Input**: Press digits 1-9 to set intensity

**Examples:**
- 0% = No scanlines (smooth display)
- 50% = Moderate scanlines (balanced retro look)
- 100% = Heavy scanlines (authentic CRT appearance)

### 2. Screen Curvature (0-10px)

Controls the amount of curvature applied to the screen edges, simulating the curved glass of vintage CRT monitors.

- **Range**: 0px (flat screen) to 10px (maximum curvature)
- **Default**: 5px
- **Visual Indicator**: 20-character slider bar
- **User Input**: Use arrow keys to adjust

**Examples:**
- 0px = Flat screen (modern look)
- 5px = Moderate curvature (typical CRT)
- 10px = Heavy curvature (vintage TV)

### 3. Noise Level (0-100%)

Controls the amount of static/noise overlay, simulating analog signal interference.

- **Range**: 0% (no noise) to 100% (maximum static)
- **Default**: 10%
- **Visual Indicator**: 20-character slider bar
- **User Input**: Press + or - to adjust

**Examples:**
- 0% = Clean signal (no interference)
- 10% = Subtle noise (slight analog feel)
- 50% = Moderate noise (noticeable static)
- 100% = Heavy noise (poor signal quality)

## Page Layout

```
CRT EFFECTS CONTROL          P701
════════════════════════════════════

Adjust visual effects in real-time:

SCANLINE INTENSITY (0-100%):
██████████░░░░░░░░░░ 50%
Press 1-9 to set intensity

SCREEN CURVATURE (0-10px):
██████████░░░░░░░░░░ 5px
Press arrow keys to adjust

NOISE LEVEL (0-100%):
██░░░░░░░░░░░░░░░░░░ 10%
Press + or - to adjust

Changes apply immediately
Settings saved to Firestore

Press GREEN to reset to defaults


INDEX   RESET   THEMES
```

## Navigation

- **Red Button (INDEX)**: Return to main index (page 100)
- **Green Button (RESET)**: Reset all effects to default values
- **Yellow Button (THEMES)**: Go to theme selection (page 700)

## API Usage

### Fetching the Page

```typescript
// Get page with default values
const response = await fetch('/api/page/701');
const { page } = await response.json();

// Get page with custom values
const response = await fetch('/api/page/701', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    effects: {
      scanlinesIntensity: 75,
      curvature: 8,
      noiseLevel: 30
    }
  })
});
```

### Accessing Effect Values

Effect values are included in the page metadata:

```typescript
const page = await adapter.getPage('701', {
  effects: {
    scanlinesIntensity: 75,
    curvature: 8,
    noiseLevel: 30
  }
});

// Access from metadata
const effects = page.meta?.effectsData;
console.log(effects?.scanlinesIntensity); // 75
console.log(effects?.curvature);          // 8
console.log(effects?.noiseLevel);         // 30
```

## Frontend Integration

### Applying Effects to CSS

```typescript
// Fetch current effect values
const response = await fetch('/api/page/701');
const { page } = await response.json();
const effects = page.meta?.effectsData;

// Apply scanline intensity
const scanlinesOpacity = effects.scanlinesIntensity / 100;
document.documentElement.style.setProperty(
  '--scanlines-opacity', 
  scanlinesOpacity.toString()
);

// Apply screen curvature
document.documentElement.style.setProperty(
  '--screen-curvature', 
  `${effects.curvature}px`
);

// Apply noise level
const noiseOpacity = effects.noiseLevel / 100;
document.documentElement.style.setProperty(
  '--noise-opacity', 
  noiseOpacity.toString()
);
```

### CSS Variables

Define these CSS variables in your stylesheet:

```css
:root {
  --scanlines-opacity: 0.5;
  --screen-curvature: 5px;
  --noise-opacity: 0.1;
}

.crt-screen {
  border-radius: var(--screen-curvature);
}

.crt-screen::before {
  /* Scanlines effect */
  opacity: var(--scanlines-opacity);
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
}

.crt-screen::after {
  /* Noise effect */
  opacity: var(--noise-opacity);
  background-image: url('data:image/png;base64,...'); /* noise texture */
}
```

## Saving User Preferences

### Firestore Structure

User preferences should be stored in the `user_preferences` collection:

```typescript
interface UserPreferencesDocument {
  userId: string;
  theme: string;
  favoritePages: string[];
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
  };
  effects: {
    scanlinesIntensity: number;  // 0-100
    curvature: number;            // 0-10
    noiseLevel: number;           // 0-100
  };
  updatedAt: Date;
}
```

### Saving Preferences

```typescript
import { getFirestore } from 'firebase-admin/firestore';

async function saveEffectPreferences(userId: string, effects: any) {
  const db = getFirestore();
  
  await db.collection('user_preferences').doc(userId).set({
    effects: {
      scanlinesIntensity: effects.scanlinesIntensity,
      curvature: effects.curvature,
      noiseLevel: effects.noiseLevel
    },
    updatedAt: new Date()
  }, { merge: true });
}
```

### Loading Preferences

```typescript
async function loadEffectPreferences(userId: string) {
  const db = getFirestore();
  
  const doc = await db.collection('user_preferences').doc(userId).get();
  
  if (doc.exists) {
    return doc.data()?.effects || getDefaultEffects();
  }
  
  return getDefaultEffects();
}

function getDefaultEffects() {
  return {
    scanlinesIntensity: 50,
    curvature: 5,
    noiseLevel: 10
  };
}
```

## Value Validation

All effect values are automatically clamped to valid ranges:

```typescript
// Scanline intensity: 0-100
const scanlinesIntensity = Math.max(0, Math.min(100, value));

// Curvature: 0-10
const curvature = Math.max(0, Math.min(10, value));

// Noise level: 0-100
const noiseLevel = Math.max(0, Math.min(100, value));
```

## Reset to Defaults

Pressing the green "RESET" button navigates back to page 701 without parameters, which loads the default values:

- Scanline Intensity: 50%
- Screen Curvature: 5px
- Noise Level: 10%

## Real-time Updates

Changes should apply immediately as the user adjusts values:

1. User adjusts a slider
2. Frontend sends updated values to backend
3. Backend returns updated page with new slider positions
4. Frontend applies new CSS values
5. Visual effects update instantly

## Example Implementation

### Complete Frontend Flow

```typescript
class CRTEffectsController {
  private currentEffects = {
    scanlinesIntensity: 50,
    curvature: 5,
    noiseLevel: 10
  };

  async loadPage() {
    const response = await fetch('/api/page/701', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effects: this.currentEffects })
    });
    
    const { page } = await response.json();
    this.renderPage(page);
    this.applyEffects(page.meta?.effectsData);
  }

  async adjustScanlines(value: number) {
    this.currentEffects.scanlinesIntensity = value;
    await this.loadPage();
  }

  async adjustCurvature(value: number) {
    this.currentEffects.curvature = value;
    await this.loadPage();
  }

  async adjustNoise(value: number) {
    this.currentEffects.noiseLevel = value;
    await this.loadPage();
  }

  async resetToDefaults() {
    this.currentEffects = {
      scanlinesIntensity: 50,
      curvature: 5,
      noiseLevel: 10
    };
    await this.loadPage();
  }

  private applyEffects(effects: any) {
    document.documentElement.style.setProperty(
      '--scanlines-opacity',
      (effects.scanlinesIntensity / 100).toString()
    );
    document.documentElement.style.setProperty(
      '--screen-curvature',
      `${effects.curvature}px`
    );
    document.documentElement.style.setProperty(
      '--noise-opacity',
      (effects.noiseLevel / 100).toString()
    );
  }

  private renderPage(page: any) {
    // Render the teletext page with updated slider bars
    // ...
  }
}
```

## Testing

The CRT effects control page includes comprehensive tests:

```bash
# Run all SettingsAdapter tests
npm test -- SettingsAdapter.test.ts

# Tests cover:
# - Default effect values
# - Custom effect values via params
# - Value clamping (0-100%, 0-10px)
# - Effect data in page metadata
# - Reset button functionality
# - Visual slider bar rendering
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 27.1**: CRT effects control page (701)
- **Requirement 27.2**: Sliders for scanline intensity, screen curvature, and noise level
- **Requirement 27.3**: Real-time application of effect changes
- **Requirement 27.4**: Save effect preferences to Firestore
- **Requirement 27.5**: Reset to defaults button

## Troubleshooting

### Effects Not Applying

1. Check that CSS variables are defined in your stylesheet
2. Verify that the frontend is reading `page.meta.effectsData`
3. Ensure CSS is applying the variables to the correct elements

### Values Not Persisting

1. Verify Firestore connection is configured
2. Check that user ID is being passed correctly
3. Ensure `user_preferences` collection has proper security rules

### Slider Bars Not Displaying

1. Verify that the font supports █ and ░ characters
2. Check that monospace font is applied
3. Ensure page rows are exactly 40 characters wide
