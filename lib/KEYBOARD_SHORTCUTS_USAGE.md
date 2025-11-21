# Keyboard Shortcuts Visualization

This module provides keyboard shortcut definitions, visualization, and tutorial animations for the Modern Teletext application.

## Requirements

- 30.1: Create visual keyboard layout for page 720
- 30.2: Highlight shortcut keys with color or background
- 30.3: Display key combinations with visual representations (e.g., "Ctrl+H")
- 30.4: Add "tip of the day" to page 100 showcasing random shortcuts
- 30.5: Create tutorial animations for new shortcuts
- 30.6: Highlight frequently used shortcuts with different color

## Features

### 1. Keyboard Shortcut Definitions

The `keyboard-shortcuts.ts` module provides a comprehensive list of all available keyboard shortcuts:

```typescript
import { KEYBOARD_SHORTCUTS, getShortcutsByCategory } from '@/lib/keyboard-shortcuts';

// Get all navigation shortcuts
const navShortcuts = getShortcutsByCategory('navigation');

// Get high-frequency shortcuts
const frequentShortcuts = getShortcutsByFrequency('high');
```

### 2. Visual Keyboard Layout (Page 720)

Page 720 displays a visual keyboard layout with all shortcuts:

```
┌─────────────────────────────────┐
│  NUMBER KEYS (Page Navigation)  │
└─────────────────────────────────┘
[0][1][2][3][4][5][6][7][8][9]
Enter 3-digit page numbers

┌─────────────────────────────────┐
│  COLORED BUTTONS (Quick Links)  │
└─────────────────────────────────┘
[🔴 R] [🟢 G] [🟡 Y] [🔵 B]
Context-sensitive quick navigation

┌─────────────────────────────────┐
│  ARROW KEYS (Navigation)        │
└─────────────────────────────────┘
    [↑] Scroll up / Previous
[←] [↓] [→] Back / Down / Forward
```

### 3. Key Highlighting

Keys are highlighted with different colors based on their importance:

- **Yellow background**: All available shortcuts
- **Green text**: Frequently used shortcuts
- **Pulsing animation**: Active or recommended shortcuts

### 4. Random Tips on Main Index

The main index (page 100) displays a random keyboard shortcut tip each time it loads:

```
TIP: Press [🔴 R] for quick NEWS access
TIP: Press 100 to return to index
TIP: Use [←] to go back to previous
```

### 5. Tutorial Animations

Interactive tutorials demonstrate how to use specific shortcuts:

```typescript
import { useKeyboardShortcutTutorial, SHORTCUT_TUTORIALS } from '@/hooks/useKeyboardShortcutTutorial';

function MyComponent() {
  const tutorial = useKeyboardShortcutTutorial(SHORTCUT_TUTORIALS['red-button']);
  
  return (
    <div>
      {tutorial.currentFrame && (
        <div>
          <h3>{tutorial.currentFrame.title}</h3>
          {tutorial.currentFrame.content.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Available Shortcuts

### Navigation
- **0-9**: Enter page numbers
- **Enter**: Navigate to entered page
- **Backspace**: Delete last digit / Go back
- **Arrow Up**: Scroll up / Previous page
- **Arrow Down**: Scroll down / Next page
- **Arrow Left**: Go to previous page
- **Arrow Right**: Go forward in history

### Quick Access (Colored Buttons)
- **R**: Red button - Quick link (varies by page)
- **G**: Green button - Quick link (varies by page)
- **Y**: Yellow button - Quick link (varies by page)
- **B**: Blue button - Quick link (varies by page)

### Special Pages
- **100**: Jump to main index
- **720**: View keyboard shortcuts
- **999**: Open help page
- **700**: Open settings

## CSS Classes

The following CSS classes are used for keyboard shortcut visualization:

- `.keyboard-key-highlighted`: Yellow background with pulsing animation
- `.keyboard-key-frequent`: Green text for frequently used keys
- `.keyboard-key-pulse`: Pulsing animation for active keys
- `.shortcut-tutorial-overlay`: Tutorial overlay display
- `.shortcut-tutorial-key`: Highlighted key in tutorial

## Usage in Components

### KeyboardShortcutDisplay Component

Add keyboard shortcut highlighting to any page:

```tsx
import KeyboardShortcutDisplay from '@/components/KeyboardShortcutDisplay';

<KeyboardShortcutDisplay
  highlightedKeys={['R', 'G', 'Y', 'B', '0-9']}
  frequentKeys={['Enter', 'Backspace', 'R']}
/>
```

### Creating Custom Tutorials

```typescript
import { createTutorial } from '@/hooks/useKeyboardShortcutTutorial';

const customTutorial = createTutorial(
  'Ctrl+H',
  'Help Shortcut',
  'Open help page',
  'Ctrl+H'
);
```

## Backend Integration

The StaticAdapter includes page 720 with keyboard shortcuts and random tips on page 100:

```typescript
// In StaticAdapter.ts
case 720:
  return this.getKeyboardShortcutsPage();
```

Random tips are generated on each page load:

```typescript
const randomTip = SHORTCUT_TIPS[Math.floor(Math.random() * SHORTCUT_TIPS.length)];
```

## Testing

Run tests for keyboard shortcuts:

```bash
npm test lib/__tests__/keyboard-shortcuts.test.ts
npm test hooks/__tests__/useKeyboardShortcutTutorial.test.ts
npm test components/__tests__/KeyboardShortcutDisplay.test.tsx
```

## Accessibility

- All keyboard shortcuts work without visual feedback
- Screen readers can access shortcut descriptions
- Tutorials can be skipped or disabled
- High contrast mode supported

## Future Enhancements

- Custom keyboard layouts for different languages
- User-configurable shortcuts
- Shortcut discovery mode (highlights available shortcuts on each page)
- Keyboard shortcut cheat sheet overlay (press ? to show)
- Analytics to track most-used shortcuts
