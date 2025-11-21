# Content Type Indicators

## Overview

Content type indicators provide visual cues in page headers to help users quickly identify the type of content they're viewing. Each content type has a unique icon and color scheme that appears in the header.

**Requirements:** 13.1, 13.2, 13.3, 13.4, 13.5

## Content Types

The system supports the following content types:

| Content Type | Icon | Color | Page Range | Description |
|-------------|------|-------|------------|-------------|
| NEWS | 📰 | Red | 200-299 | News articles and headlines |
| SPORT | ⚽ | Green | 300-399 | Sports scores and tables |
| MARKETS | 📈 | Yellow | 400-499 | Financial markets and crypto |
| AI | 🤖 | Cyan | 500-599 | AI-powered interactions |
| GAMES | 🎮 | Magenta | 600-699 | Quizzes and games |
| WEATHER | 🌤️ | Blue | 450-459 | Weather forecasts |
| SETTINGS | ⚙️ | White | 700-799 | User settings |
| DEV | 🔧 | Yellow | 800-899 | Developer tools |

## Color Scheme Rationale

- **Red (NEWS)**: Conveys urgency and breaking news
- **Green (SPORT)**: Represents fields and pitches
- **Yellow (MARKETS)**: Symbolizes gold and money
- **Cyan (AI)**: Futuristic and technological
- **Magenta (GAMES)**: Fun and playful
- **Blue (WEATHER)**: Sky and water
- **White (SETTINGS)**: Neutral and clean
- **Yellow (DEV)**: Caution and technical

## Usage

### Automatic Detection

Content type is automatically detected based on page number ranges:

```typescript
import { LayoutManager } from '@/lib/layout-manager';

const layoutManager = new LayoutManager();

// Create header for a news page (200-299)
const header = layoutManager.createHeader('Breaking News', {
  pageNumber: '201',
  title: 'Breaking News',
  contentType: 'NEWS'  // Automatically detected or explicitly set
});

// Result: {red}📰{white} BREAKING NEWS        P201
```

### Manual Content Type Setting

You can explicitly set the content type in page metadata:

```typescript
import { TeletextPage } from '@/types/teletext';

const page: TeletextPage = {
  id: '201',
  title: 'Breaking News',
  rows: [...],
  links: [...],
  meta: {
    source: 'NewsAdapter',
    lastUpdated: new Date().toISOString(),
    // Content type will be detected from page ID
  }
};
```

### Using NavigationIndicators

The `NavigationIndicators` class also supports content type indicators:

```typescript
import { NavigationIndicators } from '@/lib/navigation-indicators';

const navIndicators = new NavigationIndicators();

const header = navIndicators.createHeader('Sports Index', '300', {
  contentType: 'SPORT'
});

// Result includes: {green}⚽{white} SPORTS INDEX
```

## Color Code Format

Content type indicators use teletext color codes in the format `{color}`:

```
{red}📰{white} NEWS TITLE
{green}⚽{white} SPORTS TITLE
{yellow}📈{white} MARKETS TITLE
```

The color code is applied to the icon, then reset to white for the title text.

## Integration with Page Layout Processor

The `PageLayoutProcessor` automatically detects and applies content type indicators:

```typescript
import { PageLayoutProcessor } from '@/lib/page-layout-processor';

const processor = new PageLayoutProcessor();

const processedPage = processor.processPage(page, {
  breadcrumbs: ['100', '200'],
  enableFullScreen: true
});

// Content type indicator is automatically included in the header
```

## Examples

### News Page Header

```
{red}📰{white} BREAKING NEWS              P201
════════════════════════════════════════
```

### Sports Page Header

```
{green}⚽{white} LIVE SCORES                P301
════════════════════════════════════════
```

### Markets Page Header

```
{yellow}📈{white} CRYPTO PRICES              P401
════════════════════════════════════════
```

### AI Page Header

```
{cyan}🤖{white} AI ORACLE                  P500
════════════════════════════════════════
```

### Games Page Header

```
{magenta}🎮{white} QUIZ TIME                  P600
════════════════════════════════════════
```

## Customization

### Adding New Content Types

To add a new content type:

1. Update `CONTENT_TYPE_ICONS` in `lib/layout-manager.ts`:

```typescript
const CONTENT_TYPE_ICONS: Record<string, string> = {
  // ... existing types
  CUSTOM: '🎯'
};
```

2. Update `CONTENT_TYPE_COLORS` in `lib/layout-manager.ts`:

```typescript
export const CONTENT_TYPE_COLORS: Record<string, string> = {
  // ... existing types
  CUSTOM: 'blue'
};
```

3. Update the `getContentType` method to detect the new type:

```typescript
private getContentType(pageId: string): HeaderMetadata['contentType'] | undefined {
  const pageNum = parseInt(pageId, 10);
  
  // ... existing ranges
  if (pageNum >= 900 && pageNum < 1000) return 'CUSTOM';
  
  return undefined;
}
```

4. Update the `NavigationIndicators` class similarly.

### Changing Colors

To change the color scheme for a content type, update `CONTENT_TYPE_COLORS`:

```typescript
export const CONTENT_TYPE_COLORS: Record<string, string> = {
  NEWS: 'yellow',  // Changed from red to yellow
  // ... other types
};
```

Available colors: `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `black`

## Testing

The content type indicators feature includes comprehensive tests:

```bash
npm test -- lib/__tests__/content-type-indicators.test.ts
```

Tests cover:
- Content type detection for all page ranges
- Color coding consistency
- Icon display
- Integration with headers
- Format validation

## Accessibility

Content type indicators enhance accessibility by:

1. **Visual Distinction**: Different colors help users quickly identify content types
2. **Icon Recognition**: Emoji icons provide universal visual cues
3. **Consistent Placement**: Always in the same position (top-left of header)
4. **Color Contrast**: Colors are chosen for good contrast with background

## Performance

Content type detection is optimized:

- Simple integer range checks (O(1) complexity)
- No external API calls
- Minimal string manipulation
- Cached in layout calculations

## Browser Compatibility

Content type indicators work across all modern browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

Emoji icons are rendered using system fonts, so appearance may vary slightly between platforms.

## Future Enhancements

Potential improvements for content type indicators:

1. **User Customization**: Allow users to customize colors and icons
2. **Additional Types**: Add more content types as features expand
3. **Animated Icons**: Subtle animations for active/live content
4. **Accessibility Mode**: High-contrast icons for better visibility
5. **Theme Integration**: Content type colors that adapt to selected theme

## Related Documentation

- [Layout Manager Usage](./LAYOUT_MANAGER_USAGE.md)
- [Navigation Indicators Usage](./NAVIGATION_INDICATORS_USAGE.md)
- [Page Layout Processor](./page-layout-processor.ts)
- [Teletext Types](../types/teletext.ts)
