# Colored Button Indicators Usage Guide

## Overview

The colored button indicators feature provides visual feedback for Fastext-style colored button navigation in the footer of teletext pages. This feature displays colored emoji indicators (🔴🟢🟡🔵) with labels to show users which colored buttons are available for navigation.

**Requirements:** 8.2, 26.1, 26.2, 26.3, 26.4, 26.5

## Features

- **Visual Indicators**: Display colored emoji indicators (🔴 RED, 🟢 GREEN, 🟡 YELLOW, 🔵 BLUE)
- **Dynamic Labels**: Button labels update based on page context
- **Consistent Formatting**: Ensures proper spacing and truncation to fit 40-character width
- **Highlighting**: Available buttons are highlighted on the remote interface
- **Automatic Positioning**: Indicators are automatically placed in the footer

## API Reference

### `getColorEmoji(color: string): string`

Returns the emoji for a colored button.

**Parameters:**
- `color` - Button color ('red', 'green', 'yellow', 'blue')

**Returns:** Color emoji string

**Example:**
```typescript
import { getColorEmoji } from '@/lib/teletext-utils';

const redEmoji = getColorEmoji('red');     // Returns: 🔴
const greenEmoji = getColorEmoji('green'); // Returns: 🟢
const yellowEmoji = getColorEmoji('yellow'); // Returns: 🟡
const blueEmoji = getColorEmoji('blue');   // Returns: 🔵
```

### `formatColoredButtonIndicators(buttons, maxWidth): string`

Formats colored button indicators for footer display.

**Parameters:**
- `buttons` - Array of button configurations:
  - `color` - Button color ('red', 'green', 'yellow', 'blue')
  - `label` - Button label text
  - `page` - Optional target page number
- `maxWidth` - Maximum width for the indicator line (default: 40)

**Returns:** Formatted colored button indicator string

**Example:**
```typescript
import { formatColoredButtonIndicators } from '@/lib/teletext-utils';

const buttons = [
  { color: 'red', label: 'NEWS', page: '200' },
  { color: 'green', label: 'SPORT', page: '300' },
  { color: 'yellow', label: 'MARKETS', page: '400' },
  { color: 'blue', label: 'AI', page: '500' }
];

const indicators = formatColoredButtonIndicators(buttons, 40);
// Returns: "🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI"
```

### NavigationIndicators Methods

#### `renderColoredButtonIndicators(coloredButtons, maxWidth): string`

Renders colored button indicators for footer with padding.

**Parameters:**
- `coloredButtons` - Array of button configurations
- `maxWidth` - Maximum width (default: 40)

**Returns:** Formatted and padded colored button indicator string

**Example:**
```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';

const buttons = [
  { color: 'red', label: 'NEWS' },
  { color: 'green', label: 'SPORT' }
];

const indicators = navigationIndicators.renderColoredButtonIndicators(buttons, 40);
// Returns padded string with indicators
```

#### `createFooter(pageType, options): string[]`

Creates a complete footer with navigation indicators including colored buttons.

**Parameters:**
- `pageType` - Type of the current page
- `options` - Navigation options:
  - `coloredButtons` - Array of colored button configurations
  - `hasArrowNav` - Whether arrow navigation is available
  - `arrowUp` - Whether up arrow is available
  - `arrowDown` - Whether down arrow is available
  - `customHints` - Custom hint strings
  - `showColoredButtonsOnly` - Show only colored buttons (no other hints)

**Returns:** Array of footer rows (typically 2 rows)

**Example:**
```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';

const footer = navigationIndicators.createFooter('content', {
  coloredButtons: [
    { color: 'red', label: 'NEWS', page: '200' },
    { color: 'green', label: 'SPORT', page: '300' }
  ],
  hasArrowNav: true,
  arrowDown: true
});

// Returns:
// [
//   '────────────────────────────────────────',
//   '100=INDEX  ↓=MORE  🔴NEWS 🟢SPORT       '
// ]
```

### LayoutManager Methods

#### `createFooter(navigation): string[]`

Creates page footer with navigation hints and colored button indicators.

**Parameters:**
- `navigation` - Navigation options:
  - `backToIndex` - Show "100=INDEX" hint
  - `coloredButtons` - Array of colored button configurations
  - `arrowNavigation` - Arrow navigation configuration
  - `customHints` - Custom hint strings

**Returns:** Array of footer rows

**Example:**
```typescript
import { layoutManager } from '@/lib/layout-manager';

const footer = layoutManager.createFooter({
  backToIndex: true,
  coloredButtons: [
    { color: 'red', label: 'NEWS', page: '200' },
    { color: 'green', label: 'SPORT', page: '300' },
    { color: 'yellow', label: 'MARKETS', page: '400' },
    { color: 'blue', label: 'AI', page: '500' }
  ],
  arrowNavigation: {
    down: '201'
  }
});

// Returns:
// [
//   '────────────────────────────────────────',
//   '100=INDEX  ↓=MORE  🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI'
// ]
```

## Usage Examples

### Basic Usage with Page Links

```typescript
import { TeletextPage } from '@/types/teletext';
import { layoutManager } from '@/lib/layout-manager';

const page: TeletextPage = {
  id: '100',
  title: 'INDEX',
  rows: Array(24).fill('').map(() => ' '.repeat(40)),
  links: [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' },
    { label: 'MARKETS', targetPage: '400', color: 'yellow' },
    { label: 'AI', targetPage: '500', color: 'blue' }
  ]
};

const layout = layoutManager.calculateLayout(page, {
  fullScreen: true,
  headerRows: 2,
  footerRows: 2,
  contentAlignment: 'left',
  showBreadcrumbs: false,
  showPageIndicator: false
});

// Footer will automatically include colored button indicators:
// '────────────────────────────────────────'
// '100=INDEX  🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI'
```

### Custom Footer with Colored Buttons

```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';

// Create footer with only colored buttons (no other hints)
const footer = navigationIndicators.createFooter('index', {
  coloredButtons: [
    { color: 'red', label: 'NEWS', page: '200' },
    { color: 'green', label: 'SPORT', page: '300' },
    { color: 'yellow', label: 'MARKETS', page: '400' },
    { color: 'blue', label: 'AI', page: '500' }
  ],
  showColoredButtonsOnly: true
});

// Returns:
// [
//   '────────────────────────────────────────',
//   '🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI           '
// ]
```

### Dynamic Button Labels Based on Page Context

```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';

// News section - different button labels
const newsFooter = navigationIndicators.createFooter('news', {
  coloredButtons: [
    { color: 'red', label: 'HEADLINES', page: '201' },
    { color: 'green', label: 'WORLD', page: '210' },
    { color: 'yellow', label: 'BUSINESS', page: '220' },
    { color: 'blue', label: 'TECH', page: '230' }
  ]
});

// Sports section - different button labels
const sportsFooter = navigationIndicators.createFooter('sport', {
  coloredButtons: [
    { color: 'red', label: 'FOOTBALL', page: '301' },
    { color: 'green', label: 'CRICKET', page: '310' },
    { color: 'yellow', label: 'TENNIS', page: '320' },
    { color: 'blue', label: 'SCORES', page: '330' }
  ]
});
```

### Combining with Arrow Navigation

```typescript
import { navigationIndicators } from '@/lib/navigation-indicators';

const footer = navigationIndicators.createFooter('content', {
  hasArrowNav: true,
  arrowUp: true,
  arrowDown: true,
  coloredButtons: [
    { color: 'red', label: 'INDEX', page: '100' },
    { color: 'green', label: 'NEXT', page: '202' }
  ]
});

// Returns:
// [
//   '────────────────────────────────────────',
//   '100=INDEX  ↑↓=SCROLL  🔴INDEX 🟢NEXT    '
// ]
```

### Handling Long Labels

```typescript
import { formatColoredButtonIndicators } from '@/lib/teletext-utils';

const buttons = [
  { color: 'red', label: 'VERYLONGLABEL1', page: '200' },
  { color: 'green', label: 'VERYLONGLABEL2', page: '300' },
  { color: 'yellow', label: 'VERYLONGLABEL3', page: '400' },
  { color: 'blue', label: 'VERYLONGLABEL4', page: '500' }
];

const indicators = formatColoredButtonIndicators(buttons, 40);
// Labels are automatically truncated to fit:
// "🔴VERYLONG 🟢VERYLONG 🟡VERYLONG 🔵VERYLONG"
```

## Integration with RemoteInterface

The colored button indicators work seamlessly with the RemoteInterface component, which provides visual feedback when buttons are pressed:

```typescript
// RemoteInterface automatically highlights available buttons
<RemoteInterface
  currentPage={page}
  onColorButton={(color) => {
    // Navigate to the page associated with the colored button
    const link = page.links.find(l => l.color === color);
    if (link) {
      navigateToPage(link.targetPage);
    }
  }}
  // ... other props
/>
```

The RemoteInterface component:
- Highlights available colored buttons with a glow effect
- Shows dynamic button labels based on page context
- Provides visual feedback (depression effect) when buttons are pressed
- Displays tooltips showing button function

## Best Practices

1. **Consistent Button Usage**: Use the same color for similar functions across pages
   - Red: Primary navigation (NEWS, INDEX, BACK)
   - Green: Secondary navigation (SPORT, NEXT, CONTINUE)
   - Yellow: Tertiary navigation (MARKETS, MORE, OPTIONS)
   - Blue: Special functions (AI, HELP, SETTINGS)

2. **Label Length**: Keep labels short (8 characters or less) to ensure all 4 buttons fit
   - Good: "NEWS", "SPORT", "MARKETS", "AI"
   - Avoid: "INTERNATIONAL NEWS", "SPORTS SCORES"

3. **Context-Aware Labels**: Update button labels based on page context
   - Index page: "NEWS", "SPORT", "MARKETS", "AI"
   - News page: "HEADLINES", "WORLD", "BUSINESS", "TECH"
   - Sports page: "FOOTBALL", "CRICKET", "TENNIS", "SCORES"

4. **Prioritize Important Actions**: Place the most important navigation options on colored buttons

5. **Combine with Other Hints**: Use colored buttons alongside other navigation hints for clarity
   ```typescript
   const footer = navigationIndicators.createFooter('content', {
     customHints: ['100=INDEX', '↑↓=SCROLL'],
     coloredButtons: [
       { color: 'red', label: 'BACK', page: '100' },
       { color: 'green', label: 'NEXT', page: '202' }
     ]
   });
   ```

## Styling and Visual Feedback

The colored button indicators are automatically styled to match the teletext aesthetic:

- **Emojis**: Use colored circle emojis (🔴🟢🟡🔵) for visual clarity
- **Spacing**: Automatically spaced to fit within 40-character width
- **Truncation**: Long labels are truncated with proper handling
- **Padding**: Indicators are padded to fill the full footer width
- **Highlighting**: Available buttons glow on the remote interface

## Accessibility

The colored button indicators support accessibility features:

- **Keyboard Shortcuts**: R, G, Y, B keys map to colored buttons
- **Visual Feedback**: Button presses show visual animation
- **Tooltips**: Hover tooltips show button function
- **Screen Reader Support**: Button labels are accessible to screen readers

## Testing

The colored button indicators feature includes comprehensive tests:

```bash
# Test teletext-utils functions
npm test -- lib/__tests__/teletext-utils.test.ts

# Test navigation indicators
npm test -- lib/__tests__/navigation-indicators.test.ts

# Test layout manager
npm test -- lib/__tests__/layout-manager.test.ts
```

## Troubleshooting

### Buttons Not Showing

If colored button indicators are not appearing:

1. Check that page links have the `color` property set
2. Verify that the footer is being created with colored button options
3. Ensure the layout manager is using the enhanced footer creation

### Labels Truncated Too Much

If labels are being truncated too aggressively:

1. Keep labels to 8 characters or less
2. Use abbreviations (e.g., "MKTS" instead of "MARKETS")
3. Consider using fewer buttons if space is limited

### Buttons Not Highlighted on Remote

If buttons are not highlighting on the remote interface:

1. Ensure `currentPage` prop is passed to RemoteInterface
2. Verify that page links include the `color` property
3. Check that the `isColorButtonAvailable` function is working correctly

## Related Documentation

- [Navigation Indicators Usage](./NAVIGATION_INDICATORS_USAGE.md)
- [Layout Manager Usage](./LAYOUT_MANAGER_USAGE.md)
- [Remote Interface Documentation](../components/RemoteInterface.tsx)
- [Teletext Utils Documentation](./teletext-utils.ts)
