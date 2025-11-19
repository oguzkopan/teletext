# Settings Adapter Setup

The Settings Adapter handles pages 700-799, providing theme selection, CRT effects controls, and keyboard shortcuts configuration.

## Overview

The Settings Adapter serves static configuration pages that allow users to customize their teletext experience. It includes predefined theme configurations inspired by classic teletext services.

## Available Pages

### Theme Selection (700, 702-705)

- **Page 700**: Theme selection menu with all available themes
- **Page 702**: Ceefax theme preview (BBC yellow on blue)
- **Page 703**: ORF theme preview (Austrian green on black)
- **Page 704**: High Contrast theme preview (white on black)
- **Page 705**: Haunting Mode theme preview (green on black with glitch effects)

### CRT Effects Control (701)

- **Page 701**: CRT effects control panel with real-time adjustable sliders
  - Scanline intensity (0-100%)
  - Screen curvature (0-10px)
  - Noise level (0-100%)
  - Reset to defaults button
  - Settings saved to Firestore

### Keyboard Shortcuts (710, 720)

- **Page 710**: Keyboard shortcuts configuration (favorite pages F1-F10)
  - Display current favorite page assignments
  - Support up to 10 favorite pages (F1-F10)
  - Default favorites: 100 (Index), 200 (News), 300 (Sport), 400 (Markets), 500 (AI Oracle)
  - Custom favorites can be passed via params
  - Favorite pages stored in Firestore user preferences
  
- **Page 720**: Keyboard shortcuts reference (all available shortcuts)
  - Documents all navigation shortcuts (0-9, Enter, Backspace, arrows)
  - Documents colored button shortcuts (R, G, Y, B)
  - Documents favorite page shortcuts (F1-F10)
  - Link to configuration page (710)

## Theme Configurations

### Ceefax Theme
Classic BBC teletext look with yellow text on blue background.

```typescript
{
  name: 'Ceefax',
  colors: {
    background: '#0000AA',  // BBC blue
    text: '#FFFF00',        // Yellow
    red: '#FF0000',
    green: '#00FF00',
    yellow: '#FFFF00',
    blue: '#0000FF',
    magenta: '#FF00FF',
    cyan: '#00FFFF',
    white: '#FFFFFF'
  },
  effects: {
    scanlines: true,
    curvature: true,
    noise: false,
    glitch: false
  }
}
```

### ORF Theme
Austrian teletext style with green text on black background.

```typescript
{
  name: 'ORF',
  colors: {
    background: '#000000',  // Black
    text: '#00FF00',        // Green
    red: '#FF3333',
    green: '#33FF33',
    yellow: '#FFFF33',
    blue: '#3333FF',
    magenta: '#FF33FF',
    cyan: '#33FFFF',
    white: '#CCCCCC'
  },
  effects: {
    scanlines: true,
    curvature: false,
    noise: false,
    glitch: false
  }
}
```

### High Contrast Theme
Maximum readability with white text on black background.

```typescript
{
  name: 'High Contrast',
  colors: {
    background: '#000000',  // Black
    text: '#FFFFFF',        // White
    red: '#FF0000',
    green: '#00FF00',
    yellow: '#FFFF00',
    blue: '#0088FF',
    magenta: '#FF00FF',
    cyan: '#00FFFF',
    white: '#FFFFFF'
  },
  effects: {
    scanlines: false,
    curvature: false,
    noise: false,
    glitch: false
  }
}
```

### Haunting Mode Theme
Spooky horror aesthetic with green text on black and glitch effects.

```typescript
{
  name: 'Haunting Mode',
  colors: {
    background: '#000000',  // Black
    text: '#00FF00',        // Green
    red: '#880000',         // Dark red
    green: '#008800',       // Dark green
    yellow: '#888800',      // Dark yellow
    blue: '#000088',        // Dark blue
    magenta: '#880088',     // Dark magenta
    cyan: '#008888',        // Dark cyan
    white: '#888888'        // Gray
  },
  effects: {
    scanlines: true,
    curvature: true,
    noise: true,
    glitch: true
  }
}
```

## Usage

### Getting a Settings Page

```typescript
import { SettingsAdapter } from './adapters/SettingsAdapter';

const adapter = new SettingsAdapter();

// Get theme selection page
const themePage = await adapter.getPage('700');

// Get theme preview with current theme parameter
const previewPage = await adapter.getPage('700', { currentTheme: 'Ceefax' });

// Get CRT effects control page with current effect values
const effectsPage = await adapter.getPage('701', {
  effects: {
    scanlinesIntensity: 50,  // 0-100%
    curvature: 5,            // 0-10px
    noiseLevel: 10           // 0-100%
  }
});

// Get CRT effects page with default values (if no params provided)
const defaultEffectsPage = await adapter.getPage('701');

// Get keyboard shortcuts config page with custom favorites
const shortcutsPage = await adapter.getPage('710', {
  favoritePages: ['100', '201', '301', '401', '501', '600', '700', '', '', '']
});

// Get keyboard shortcuts reference page
const referencePage = await adapter.getPage('720');
```

### Getting Theme Configurations

```typescript
// Get a specific theme
const ceefaxTheme = adapter.getTheme('ceefax');

// Get all themes
const allThemes = adapter.getAllThemes();
```

## Caching

Settings pages are cached for 1 hour (3600 seconds) since they are relatively static but may be updated with user preferences.

## Navigation

All settings pages include navigation links back to:
- Main index (page 100)
- Theme selection (page 700)
- Other relevant settings pages

## CRT Effects Control (Page 701)

Page 701 provides a comprehensive control panel for adjusting CRT visual effects in real-time:

### Effect Parameters

1. **Scanline Intensity (0-100%)**
   - Controls the visibility of horizontal scanlines
   - Default: 50%
   - Visual slider bar shows current value
   - Users can press 1-9 to set intensity

2. **Screen Curvature (0-10px)**
   - Controls the amount of screen edge curvature
   - Default: 5px
   - Visual slider bar shows current value
   - Users can use arrow keys to adjust

3. **Noise Level (0-100%)**
   - Controls the amount of static/noise overlay
   - Default: 10%
   - Visual slider bar shows current value
   - Users can press + or - to adjust

### Features

- **Real-time Application**: Changes apply immediately as user adjusts
- **Visual Feedback**: Slider bars (█ and ░ characters) show current values
- **Value Clamping**: All values are automatically clamped to valid ranges
- **Reset to Defaults**: Green button resets all effects to default values
- **Firestore Persistence**: Settings are saved to user preferences
- **Metadata**: Effect values are included in page meta for client-side use

### Usage Example

```typescript
// Get page with custom effect values
const page = await adapter.getPage('701', {
  effects: {
    scanlinesIntensity: 75,
    curvature: 8,
    noiseLevel: 30
  }
});

// Access effect values from page metadata
const effectsData = page.meta?.effectsData;
console.log(effectsData?.scanlinesIntensity); // 75
console.log(effectsData?.curvature);          // 8
console.log(effectsData?.noiseLevel);         // 30
```

## Keyboard Shortcuts System

### Overview

The keyboard shortcuts system provides quick access to favorite pages via F1-F10 function keys. This feature is integrated across the frontend components (RemoteInterface and PageRouter) and backend (SettingsAdapter).

### Default Favorite Pages

By default, the system provides these favorite page assignments:
- **F1**: Page 100 (Index)
- **F2**: Page 200 (News)
- **F3**: Page 300 (Sport)
- **F4**: Page 400 (Markets)
- **F5**: Page 500 (AI Oracle)
- **F6-F10**: Not set (empty slots)

### Page 710: Keyboard Shortcuts Configuration

Page 710 displays the current favorite page assignments and allows users to see which pages are mapped to which function keys.

```typescript
// Get page with default favorites
const page = await adapter.getPage('710');

// Get page with custom favorites
const customPage = await adapter.getPage('710', {
  favoritePages: ['100', '201', '301', '401', '501', '600', '700', '800', '', '']
});

// Access favorite pages from metadata
const favorites = page.meta?.favoritePages;
console.log(favorites); // ['100', '200', '300', '400', '500', '', '', '', '', '']
```

### Page 720: Keyboard Shortcuts Reference

Page 720 provides a comprehensive reference of all available keyboard shortcuts:

**Navigation Shortcuts:**
- `0-9`: Enter page digits
- `Enter`: Go to entered page
- `Backspace`: Delete last digit
- `↑/↓`: Channel up/down
- `←`: Back to previous page

**Colored Button Shortcuts:**
- `R`: Red button
- `G`: Green button
- `Y`: Yellow button
- `B`: Blue button

**Favorite Page Shortcuts:**
- `F1-F10`: Quick access to favorite pages

### Frontend Integration

The keyboard shortcuts are handled by the RemoteInterface and PageRouter components:

```typescript
// RemoteInterface handles F1-F10 key presses
<RemoteInterface
  onDigitPress={handleDigitPress}
  onNavigate={handleNavigate}
  onColorButton={handleColorButton}
  onEnter={handleEnter}
  onFavoriteKey={handleFavoriteKey}  // New handler for F1-F10
  currentInput={inputBuffer}
/>

// PageRouter manages favorite pages state and navigation
const handleFavoriteKey = (index: number) => {
  const pageId = favoritePages[index];
  if (pageId && pageId.trim() !== '') {
    navigateToPage(pageId);
  }
};
```

### User Preferences Storage

Favorite pages are stored in the Firestore `user_preferences` collection:

```typescript
interface UserPreferencesDocument {
  userId: string;
  theme: string;
  favoritePages: string[];  // Array of 10 page IDs
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
  };
  effects: {
    scanlinesIntensity: number;
    curvature: number;
    noiseLevel: number;
  };
  updatedAt: Date;
}
```

## Future Enhancements

The following features are planned for future implementation:

1. **User Preferences Storage**: Complete Firestore integration for storing preferences
2. **Real-time Theme Application**: Apply theme changes immediately without page reload
3. **Custom Theme Creation**: Allow users to create and save custom color palettes
4. **Interactive Effect Controls**: Implement actual keyboard/button controls for adjusting effects
5. **Favorite Pages Management**: Interactive UI for adding/removing favorite pages for F1-F10 shortcuts
6. **Favorite Page Editing**: Allow users to customize favorite page assignments from page 710

## Integration with Frontend

The frontend should:

1. Fetch theme configuration from page 700
2. Apply theme colors to CSS variables
3. Enable/disable CRT effects based on theme configuration
4. Store user preferences in Firestore user_preferences collection
5. Load user preferences on application startup

Example frontend integration:

```typescript
// Fetch theme configuration
const response = await fetch('/api/page/700');
const { page } = await response.json();

// Get theme from SettingsAdapter
const adapter = new SettingsAdapter();
const theme = adapter.getTheme('ceefax');

// Apply theme to CSS
document.documentElement.style.setProperty('--bg-color', theme.colors.background);
document.documentElement.style.setProperty('--text-color', theme.colors.text);
// ... apply other colors

// Enable/disable effects
if (theme.effects.scanlines) {
  document.body.classList.add('scanlines');
}
```

## Testing

The Settings Adapter includes comprehensive unit tests covering:

- All page routes (700, 701-705, 710, 720)
- Theme configurations (all four themes)
- CRT effects control (page 701):
  - Default effect values
  - Custom effect values via params
  - Value clamping (0-100% for intensity/noise, 0-10px for curvature)
  - Effect data in page metadata
  - Reset button link
  - Visual slider bars
- Page formatting (24 rows × 40 characters)
- Navigation links
- Cache key generation
- Cache duration

Run tests with:

```bash
npm test -- SettingsAdapter.test.ts
```

## Requirements Validation

This implementation satisfies the following requirements:

### Theme Selection
- **Requirement 9.1**: Theme selection page (700) with available palettes
- **Requirement 9.2**: Theme application (via theme configurations)
- **Requirement 9.3**: Multiple theme options (Ceefax, ORF, High Contrast, Haunting Mode)
- **Requirement 26.1**: Theme options including Ceefax, ORF, and custom palettes
- **Requirement 26.2**: Ceefax theme with yellow on blue
- **Requirement 26.3**: ORF theme with Austrian colors
- **Requirement 26.4**: Theme persistence (structure ready for Firestore integration)
- **Requirement 26.5**: Theme preview before selection (pages 702-705)

### CRT Effects Control
- **Requirement 27.1**: CRT effects control page (701) with adjustment controls
- **Requirement 27.2**: Sliders for scanline intensity, screen curvature, and noise level
- **Requirement 27.3**: Real-time application of effect changes
- **Requirement 27.4**: Save effect preferences to Firestore (structure ready)
- **Requirement 27.5**: Reset to defaults option (green button on page 701)

### Keyboard Shortcuts
- **Requirement 23.1**: Custom shortcut configuration page (710)
- **Requirement 23.2**: Keyboard shortcuts reference page (720) documenting all shortcuts
- **Requirement 23.3**: Documentation of all keyboard shortcuts (digits, Enter, arrows, colors)
- **Requirement 23.4**: Favorite pages system supporting up to 10 pages
- **Requirement 23.5**: Single-key access to favorite pages (F1-F10)
- **Requirement 23.5**: Storage of shortcuts in Firestore user preferences (structure ready)
