# Animation Settings Usage Guide

## Overview
Page 701 provides comprehensive controls for adjusting animation settings in the Modern Teletext application. All changes apply immediately and are automatically saved to Firestore.

## Accessing Animation Settings
Navigate to page 701 by:
- Entering `701` on any page
- Pressing the Yellow button on page 700 (Theme Selection)
- Pressing the Red button on page 100 and selecting Settings

## Controls

### Animation Intensity Slider (0-100%)
Adjust the overall intensity of all animations:

- **Arrow Up**: Increase intensity by 5%
- **Arrow Down**: Decrease intensity by 5%
- **Arrow Right**: Increase intensity by 10%
- **Arrow Left**: Decrease intensity by 10%

The intensity slider affects:
- Animation duration (lower intensity = faster animations)
- Animation complexity
- Overall visual impact

### Individual Animation Type Controls
Toggle specific animation types on/off:

- **Press 1**: Toggle all animations on/off
- **Press 2**: Toggle page transitions
- **Press 3**: Toggle decorative elements (ghosts, bats, pumpkins)
- **Press 4**: Toggle background effects (scanlines, fog, flicker)

### Reset to Defaults
- **Press G (Green button)**: Reset all settings to defaults
  - Animation intensity: 100%
  - All animations: ON
  - All types: Enabled

### Navigation
- **Press R (Red button)**: Return to main index (page 100)
- **Press Y (Yellow button)**: Go to theme selection (page 700)

## Visual Feedback

### Slider Bars
Settings are displayed with visual slider bars:
```
Intensity:      ███████████████ 100%
                ███████░░░░░░░░ 50%
                ░░░░░░░░░░░░░░░ 0%
```

### Status Indicators
Animation types show ON/OFF status:
```
All Animations: ON 
Transitions:    OFF
Decorations:    ON 
Backgrounds:    ON 
```

### Save Status
The page shows save status:
```
Changes apply immediately
Settings saved automatically
```

Or while saving:
```
Saving...
Settings saved automatically
```

## Real-Time Preview
All changes apply immediately:
- Adjusting intensity affects all active animations
- Toggling animation types enables/disables them instantly
- No page reload required
- Changes persist across sessions

## Integration with System Preferences
The animation settings respect system accessibility preferences:
- If `prefers-reduced-motion` is enabled, animations are automatically reduced
- User settings override system preferences when explicitly set
- Accessibility features remain functional regardless of animation settings

## Persistence
Settings are automatically saved to Firestore:
- Saved after every change
- Loaded on page mount
- Persist across sessions
- Sync across devices (same user account)

## Default Settings
```
Animation Intensity: 100%
All Animations: ON
Transitions: ON
Decorations: ON
Backgrounds: ON
```

## Use Cases

### Performance Mode
For better performance on slower devices:
1. Navigate to page 701
2. Press 1 to disable all animations
3. Or reduce intensity to 25-50%

### Minimal Distractions
To reduce visual distractions:
1. Navigate to page 701
2. Press 3 to disable decorations
3. Press 4 to disable background effects
4. Keep transitions enabled for smooth navigation

### Full Experience
For the complete visual experience:
1. Navigate to page 701
2. Press G to reset to defaults
3. Ensure all settings show ON
4. Set intensity to 100%

### Custom Balance
Create your own balance:
1. Navigate to page 701
2. Set intensity to 75% (Arrow Down 5 times)
3. Press 3 to disable decorations
4. Keep transitions and backgrounds enabled

## Troubleshooting

### Changes Not Applying
- Ensure you're on page 701
- Check that you're pressing the correct keys
- Verify Firestore connection (check browser console)

### Settings Not Persisting
- Check browser console for Firestore errors
- Verify you're logged in (if authentication is enabled)
- Clear browser cache and reload

### Animations Still Showing When Disabled
- Check system `prefers-reduced-motion` setting
- Verify animation intensity is not at 0%
- Some critical animations may still show for functionality

## Technical Details

### Storage Location
Settings are stored in Firestore:
```
user_preferences/{userId}/animationSettings
```

### Data Structure
```typescript
{
  animationsEnabled: boolean,
  animationIntensity: number,  // 0-100
  transitionsEnabled: boolean,
  decorationsEnabled: boolean,
  backgroundEffectsEnabled: boolean
}
```

### Integration Points
- Animation Accessibility System (`lib/animation-accessibility.ts`)
- Animation Engine (`lib/animation-engine.ts`)
- Theme System (`lib/theme-context.tsx`)
- Firestore (`lib/firebase-client.ts`)

## Related Pages
- **Page 700**: Theme Selection
- **Page 701**: Animation Settings (this page)
- **Page 710**: Keyboard Shortcuts Configuration
- **Page 720**: Keyboard Shortcuts Reference

## Keyboard Reference
Quick reference for page 701:

| Key | Action |
|-----|--------|
| ↑ | Increase intensity +5% |
| ↓ | Decrease intensity -5% |
| → | Increase intensity +10% |
| ← | Decrease intensity -10% |
| 1 | Toggle all animations |
| 2 | Toggle transitions |
| 3 | Toggle decorations |
| 4 | Toggle backgrounds |
| R | Return to index |
| G | Reset to defaults |
| Y | Go to themes |

## Examples

### Example 1: Disable All Animations
```
1. Navigate to page 701
2. Press 1 (toggle all animations)
3. Verify "All Animations: OFF" is displayed
4. Settings automatically saved
```

### Example 2: Reduce Intensity to 50%
```
1. Navigate to page 701
2. Press Arrow Down 10 times (or Arrow Left 5 times)
3. Verify slider shows 50%
4. Observe animations running at half speed
```

### Example 3: Keep Only Transitions
```
1. Navigate to page 701
2. Press 3 (disable decorations)
3. Press 4 (disable backgrounds)
4. Verify only transitions remain ON
5. Navigate between pages to see smooth transitions
```

## Best Practices
1. Start with defaults and adjust based on preference
2. Test changes by navigating between pages
3. Use performance mode on slower devices
4. Reset to defaults if unsure about changes
5. Adjust intensity before disabling specific types

## Accessibility
- All controls are keyboard accessible
- Visual feedback for all actions
- Settings integrate with system preferences
- Screen reader compatible
- No mouse required

## Support
For issues or questions:
- Check browser console for errors
- Verify Firestore connection
- Try resetting to defaults
- Check system accessibility settings
