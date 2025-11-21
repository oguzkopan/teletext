# Input Buffer Display Usage

The Input Buffer Display system provides visual feedback for user input with animations and theme-specific styling.

## Requirements

- **6.5**: Animate text entry with blinking cursor effect
- **8.4**: Display input format (e.g., "Enter 3-digit page number")
- **15.1**: Display entered digits in input buffer with highlight effect

## Features

- Display entered digits with highlighting
- Blinking cursor after last digit
- Digit entry animation (fade in, scale up)
- Clear input buffer with animation after navigation
- Input format hint when buffer is empty
- Theme-specific styling and animations

## Components

### InputBufferDisplay Component

React component that displays the input buffer with animations.

```tsx
import InputBufferDisplay from '@/components/InputBufferDisplay';
import { themes } from '@/lib/theme-context';

<InputBufferDisplay
  buffer="20"
  expectedLength={3}
  theme={themes.ceefax}
  position="footer"
  visible={true}
/>
```

**Props:**
- `buffer` (string): Current input buffer content
- `expectedLength` (number): Expected number of digits (1, 2, or 3)
- `theme` (ThemeConfig): Current theme configuration
- `position` ('header' | 'footer'): Display position (default: 'footer')
- `visible` (boolean): Whether to display the component (default: true)

## Utility Functions

### formatInputBuffer

Formats the input buffer for display with cursor and hints.

```typescript
import { formatInputBuffer } from '@/lib/input-buffer-display';

const displayText = formatInputBuffer({
  buffer: '20',
  expectedLength: 3,
  showCursor: true,
  showHint: true,
  theme: 'ceefax'
});
// Returns: "20_"
```

### getInputBufferAnimationClasses

Gets CSS classes for input buffer animations.

```typescript
import { getInputBufferAnimationClasses } from '@/lib/input-buffer-display';

const classes = getInputBufferAnimationClasses('2', '');
// Returns: ['input-buffer-display', 'digit-entry-animation']
```

### getInputBufferStyles

Gets CSS styles for the input buffer display.

```typescript
import { getInputBufferStyles } from '@/lib/input-buffer-display';

const styles = getInputBufferStyles('ceefax');
// Returns: CSS string with all animation and theme styles
```

### getInputBufferPosition

Gets position styles for the input buffer display.

```typescript
import { getInputBufferPosition } from '@/lib/input-buffer-display';

const position = getInputBufferPosition('footer');
// Returns: { bottom: '40px', left: '50%' }
```

## Animations

### Digit Entry Animation

When a digit is entered, the display animates with:
- Fade in from 0 to 1 opacity
- Scale from 0.8 to 1.1 to 1.0
- Duration: 300ms

### Buffer Clear Animation

When the buffer is cleared, the display animates with:
- Fade out from 1 to 0 opacity
- Scale from 1.0 to 0.9
- Duration: 200ms

### Cursor Blink Animation

The cursor blinks continuously:
- Alternates between visible and hidden
- Duration: 1s per cycle
- Uses step-end timing

## Theme-Specific Styling

### Ceefax Theme
- Yellow text and border
- Yellow background with 20% opacity
- Standard animations

### Haunting Theme
- Red text and border
- Red background with 20% opacity
- Glowing box shadow that pulses
- Glitch pulse animation

### High Contrast Theme
- White text and border
- White background with 20% opacity
- Bold 2px border
- Standard animations

### ORF Theme
- Cyan text and border
- Cyan background with 20% opacity
- Color cycling animation

## Integration Example

```tsx
import { useState } from 'react';
import TeletextScreen from '@/components/TeletextScreen';
import PageRouter from '@/components/PageRouter';
import { useTheme } from '@/lib/theme-context';

function App() {
  const { currentTheme } = useTheme();
  
  return (
    <PageRouter>
      {(routerState) => (
        <TeletextScreen
          page={routerState.currentPage}
          loading={routerState.loading}
          theme={currentTheme}
          inputBuffer={routerState.inputBuffer}
          expectedInputLength={routerState.expectedInputLength}
        />
      )}
    </PageRouter>
  );
}
```

## Display Behavior

### Empty Buffer
- Shows hint: "Enter 3-digit page number" (or 1/2 digit variants)
- Hint is styled with reduced opacity and italic font

### Partial Input
- Shows entered digits with cursor: "2_" or "20_"
- Cursor blinks after last digit
- Each digit entry triggers animation

### Full Buffer
- Shows all digits without cursor: "200"
- No cursor displayed when buffer is full

### After Navigation
- Buffer clears with animation
- Component disappears after clear animation completes
- Ready for next input

## Position Options

### Header Position
- Top-right corner of screen
- Absolute positioning: top: 20px, right: 20px
- Suitable for pages with busy footers

### Footer Position (Default)
- Bottom-center of screen
- Absolute positioning: bottom: 40px, left: 50%
- Centered with transform: translateX(-50%)
- Suitable for most pages

## Accessibility

- High contrast colors for visibility
- Clear visual feedback for all input
- Animations can be disabled via theme settings
- Cursor provides clear indication of input state

## Performance

- Memoized formatting functions
- CSS animations for smooth performance
- Minimal re-renders with React.memo
- Cleanup of timeouts on unmount
