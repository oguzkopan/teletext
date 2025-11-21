# Interactive Element Highlighting Usage Guide

## Overview

The Interactive Element Highlighting system provides utilities for highlighting interactive elements (buttons, links, selections) with consistent visual styling across all pages in the Modern Teletext application.

## Requirements Implemented

- **25.1**: Highlight interactive elements with brackets or color (e.g., "[1] Option")
- **25.2**: Display visual highlight or underline on hover
- **25.3**: Display border or background color change on focus
- **25.4**: Use consistent visual styling across all pages
- **25.5**: Show links in distinct color with indicator (►)

## Core Functions

### formatInteractiveElement

Formats an interactive element with appropriate visual indicators.

```typescript
import { formatInteractiveElement } from '@/lib/interactive-element-highlighting';

// Format a button
const button = formatInteractiveElement({
  type: 'button',
  label: '1',
  action: '200'
});
// Result: "[1]"

// Format a link with arrow indicator
const link = formatInteractiveElement({
  type: 'link',
  label: 'News',
  action: '200'
});
// Result: "► News"

// Format with color code
const coloredButton = formatInteractiveElement(
  { type: 'button', label: 'Press' },
  { colorCode: 'red' }
);
// Result: "{red}[Press]{white}"
```

### detectInteractiveElements

Detects interactive elements in text.

```typescript
import { detectInteractiveElements } from '@/lib/interactive-element-highlighting';

const text = 'Press [1] for news or go to ► Sports';
const elements = detectInteractiveElements(text);

// Returns:
// [
//   { start: 6, end: 9, content: '[1]', type: 'button' },
//   { start: 29, end: 37, content: '► Sports', type: 'link' }
// ]
```

### getInteractiveElementClasses

Gets CSS class names for interactive element styling.

```typescript
import { getInteractiveElementClasses } from '@/lib/interactive-element-highlighting';

// Base classes
const classes = getInteractiveElementClasses('button');
// Result: "interactive-element interactive-button"

// With state
const hoverClasses = getInteractiveElementClasses('link', { hover: true });
// Result: "interactive-element interactive-link interactive-hover"

const focusClasses = getInteractiveElementClasses('button', { focus: true });
// Result: "interactive-element interactive-button interactive-focus"
```

### getInteractiveElementStyles

Generates CSS styles for interactive element highlighting.

```typescript
import { getInteractiveElementStyles } from '@/lib/interactive-element-highlighting';

const theme = {
  colors: {
    text: '#ffffff',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    cyan: '#00ffff',
    white: '#ffffff'
  }
};

const styles = getInteractiveElementStyles(theme);
// Returns CSS string with all interactive element styles
```

### formatNavigationOption

Formats a navigation option with consistent styling.

```typescript
import { formatNavigationOption } from '@/lib/interactive-element-highlighting';

// Basic format
const option = formatNavigationOption(200, 'News');
// Result: "200. News"

// With brackets
const bracketedOption = formatNavigationOption(100, 'Index', { showBrackets: true });
// Result: "[100. Index]"

// As link
const linkOption = formatNavigationOption(300, 'Sports', { isLink: true });
// Result: "► 300. Sports"

// With color
const coloredOption = formatNavigationOption(400, 'Markets', { colorCode: 'green' });
// Result: "{green}400. Markets{white}"
```

## Integration with TeletextScreen

The TeletextScreen component automatically applies interactive element highlighting:

```typescript
import { TeletextScreen } from '@/components/TeletextScreen';

// The component automatically:
// 1. Detects interactive elements in page content
// 2. Applies appropriate CSS classes
// 3. Provides hover and focus effects
// 4. Styles links with arrow indicators

<TeletextScreen page={page} loading={false} theme={theme} />
```

## Visual Styling

### Buttons

Buttons are displayed with brackets and bold text:
- Format: `[1]`, `[Press]`
- Hover: Background highlight + underline
- Focus: Yellow outline + background tint
- Active: Scaled down slightly

### Links

Links are displayed with arrow indicators and cyan color:
- Format: `► News`, `► Sports`
- Hover: White color + underline
- Focus: Cyan outline with glow
- Active: Background highlight

### Selections

Selections are displayed with brackets and yellow color:
- Format: `[Option A]`, `[Choice 1]`
- Hover: Background highlight + underline
- Focus: Yellow outline + background tint
- Active: Scaled down slightly

## CSS Classes

The following CSS classes are available:

- `.interactive-element` - Base class for all interactive elements
- `.interactive-button` - Button-specific styling
- `.interactive-link` - Link-specific styling
- `.interactive-selection` - Selection-specific styling
- `.interactive-hover` - Hover state
- `.interactive-focus` - Focus state
- `.interactive-active` - Active state

## Accessibility

The interactive element highlighting system includes accessibility features:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Clear focus indicators with outlines and background changes
- **Focus Visible**: Enhanced focus indicators for keyboard navigation
- **Screen Readers**: Semantic HTML with appropriate ARIA attributes
- **Color Contrast**: Sufficient contrast ratios for all themes

## Examples

### Creating a Menu with Interactive Options

```typescript
import { formatInteractiveElement } from '@/lib/interactive-element-highlighting';

const menuOptions = [
  { type: 'button', label: '1', action: '200' },
  { type: 'button', label: '2', action: '300' },
  { type: 'button', label: '3', action: '400' }
];

const formattedMenu = menuOptions.map(opt => 
  formatInteractiveElement(opt)
).join('  ');

// Result: "[1]  [2]  [3]"
```

### Creating a Navigation Bar with Links

```typescript
import { formatInteractiveElement } from '@/lib/interactive-element-highlighting';

const navLinks = [
  { type: 'link', label: 'News', action: '200' },
  { type: 'link', label: 'Sports', action: '300' },
  { type: 'link', label: 'Markets', action: '400' }
];

const formattedNav = navLinks.map(link => 
  formatInteractiveElement(link)
).join('  |  ');

// Result: "► News  |  ► Sports  |  ► Markets"
```

### Detecting and Highlighting Interactive Elements in Content

```typescript
import { detectInteractiveElements, hasInteractiveElements } from '@/lib/interactive-element-highlighting';

const content = 'Press [1] for news or visit ► Index';

if (hasInteractiveElements(content)) {
  const elements = detectInteractiveElements(content);
  console.log(`Found ${elements.length} interactive elements`);
  // Output: "Found 2 interactive elements"
}
```

## Best Practices

1. **Consistency**: Use the same formatting functions across all pages
2. **Clarity**: Make interactive elements visually distinct from regular text
3. **Accessibility**: Ensure all interactive elements are keyboard accessible
4. **Performance**: Use memoization for expensive formatting operations
5. **Testing**: Test interactive elements with keyboard, mouse, and screen readers

## Testing

The interactive element highlighting system includes comprehensive tests:

```bash
npm test -- lib/__tests__/interactive-element-highlighting.test.ts
```

Tests cover:
- Formatting functions
- Detection algorithms
- CSS class generation
- Style generation
- Navigation option formatting
- Text wrapping and extraction

## Performance Considerations

- CSS styles are generated once per theme change
- Interactive element detection uses efficient regex patterns
- Formatting functions are pure and can be memoized
- CSS animations use GPU-accelerated properties (transform, opacity)

## Browser Support

The interactive element highlighting system works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Future Enhancements

Potential future improvements:
- Custom highlight colors per element type
- Animation effects on interaction
- Touch gesture support for mobile devices
- Voice control integration
- Customizable keyboard shortcuts
