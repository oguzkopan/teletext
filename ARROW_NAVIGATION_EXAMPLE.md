# Arrow Navigation Indicators - Visual Examples

## Overview

This document provides visual examples of how arrow navigation indicators appear in different scenarios within the Modern Teletext application.

## Example 1: First Page of Multi-Page Article

```
┌────────────────────────────────────────┐
│ 📰 NEWS ARTICLE              P201      │
│ 100 > 200 > 201                        │
├────────────────────────────────────────┤
│                                        │
│ Breaking News: Major Development      │
│                                        │
│ Lorem ipsum dolor sit amet,            │
│ consectetur adipiscing elit. Sed do    │
│ eiusmod tempor incididunt ut labore    │
│ et dolore magna aliqua.                │
│                                        │
│ Ut enim ad minim veniam, quis nostrud  │
│ exercitation ullamco laboris nisi ut   │
│ aliquip ex ea commodo consequat.       │
│                                        │
│ Duis aute irure dolor in               │
│ reprehenderit in voluptate velit esse  │
│ cillum dolore eu fugiat nulla          │
│ pariatur.                              │
│                                        │
│ Excepteur sint occaecat cupidatat non  │
│ proident, sunt in culpa qui officia    │
│ deserunt mollit anim id est laborum.   │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ▼ Press ↓ for more         │
└────────────────────────────────────────┘
```

**Key Features:**
- Down arrow (▼) indicates more content available
- Clear instruction: "Press ↓ for more"
- No up arrow since this is the first page

## Example 2: Middle Page of Multi-Page Article

```
┌────────────────────────────────────────┐
│ 📰 NEWS ARTICLE              P201-2    │
│ ... > 200 > 201 > 201-2                │
├────────────────────────────────────────┤
│                                        │
│ (Continued from previous page)         │
│                                        │
│ Sed ut perspiciatis unde omnis iste    │
│ natus error sit voluptatem accusantium │
│ doloremque laudantium, totam rem       │
│ aperiam, eaque ipsa quae ab illo       │
│ inventore veritatis et quasi           │
│ architecto beatae vitae dicta sunt     │
│ explicabo.                             │
│                                        │
│ Nemo enim ipsam voluptatem quia        │
│ voluptas sit aspernatur aut odit aut   │
│ fugit, sed quia consequuntur magni     │
│ dolores eos qui ratione voluptatem     │
│ sequi nesciunt.                        │
│                                        │
│ Neque porro quisquam est, qui dolorem  │
│ ipsum quia dolor sit amet...           │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev│
└────────────────────────────────────────┘
```

**Key Features:**
- Both arrows shown: ↑↓
- Compact "SCROLL" hint in contextual help
- Full instruction: "▲ Press ↑ for previous"
- Breadcrumbs show navigation path

## Example 3: Last Page of Multi-Page Article

```
┌────────────────────────────────────────┐
│ 📰 NEWS ARTICLE              P201-3    │
│ ... > 201 > 201-2 > 201-3              │
├────────────────────────────────────────┤
│                                        │
│ (Continued from previous page)         │
│                                        │
│ At vero eos et accusamus et iusto      │
│ dignissimos ducimus qui blanditiis     │
│ praesentium voluptatum deleniti atque  │
│ corrupti quos dolores et quas          │
│ molestias excepturi sint occaecati     │
│ cupiditate non provident.              │
│                                        │
│ Similique sunt in culpa qui officia    │
│ deserunt mollitia animi, id est        │
│ laborum et dolorum fuga.               │
│                                        │
│ Et harum quidem rerum facilis est et   │
│ expedita distinctio.                   │
│                                        │
│ --- END OF ARTICLE ---                 │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ▲ Press ↑ for previous      │
└────────────────────────────────────────┘
```

**Key Features:**
- Only up arrow (▲) shown
- Clear indication this is the last page
- No down arrow since no more content
- Article end marker visible

## Example 4: Single Page (No Arrow Indicators)

```
┌────────────────────────────────────────┐
│ 📰 NEWS BRIEF                P200      │
│ 100 > 200                              │
├────────────────────────────────────────┤
│                                        │
│ Quick News Update                      │
│                                        │
│ This is a short news item that fits    │
│ on a single page. No continuation      │
│ required.                              │
│                                        │
│ Lorem ipsum dolor sit amet,            │
│ consectetur adipiscing elit.           │
│                                        │
│ For more news, press 200.              │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  BACK=PREVIOUS  🔴NEWS       │
└────────────────────────────────────────┘
```

**Key Features:**
- No arrow indicators (single page)
- Standard navigation hints shown
- Colored buttons visible (space available)
- Clean, uncluttered footer

## Example 5: AI Response with Arrow Navigation

```
┌────────────────────────────────────────┐
│ 🤖 AI RESPONSE               P513-2    │
│ ... > 500 > 513 > 513-2     Page 2/4   │
├────────────────────────────────────────┤
│                                        │
│ (AI Response Continued)                │
│                                        │
│ Based on your question, here are some  │
│ key points to consider:                │
│                                        │
│ 1. The primary factor is...           │
│                                        │
│ 2. Additionally, you should consider   │
│    the following aspects:              │
│    - Performance implications          │
│    - Security considerations           │
│    - Scalability requirements          │
│                                        │
│ 3. Best practices suggest that...     │
│                                        │
│ Would you like more details on any     │
│ of these points?                       │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev│
└────────────────────────────────────────┘
```

**Key Features:**
- Page position indicator: "Page 2/4"
- Both arrow indicators shown
- AI-specific content type icon (🤖)
- Continuation clearly marked

## Example 6: Sports Scores with Arrow Navigation

```
┌────────────────────────────────────────┐
│ ⚽ LIVE SCORES               P301-2    │
│ ... > 300 > 301 > 301-2                │
├────────────────────────────────────────┤
│                                        │
│ PREMIER LEAGUE - LIVE MATCHES          │
│                                        │
│ 🔴LIVE  Arsenal      2 - 1  Chelsea    │
│         87' ⚽                          │
│                                        │
│ 🔴LIVE  Man United   1 - 1  Liverpool  │
│         72'                            │
│                                        │
│ 🟡HT    Tottenham    0 - 2  Man City   │
│         45'                            │
│                                        │
│ COMPLETED MATCHES                      │
│                                        │
│ ⚪FT    Newcastle    3 - 0  Brighton   │
│                                        │
│ ⚪FT    Everton      1 - 2  West Ham   │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev│
└────────────────────────────────────────┘
```

**Key Features:**
- Live sports content with arrow navigation
- Both arrows available for scrolling
- Content type icon (⚽)
- Real-time updates with navigation

## Example 7: Markets Data with Arrow Navigation

```
┌────────────────────────────────────────┐
│ 📈 MARKET DATA               P401-3    │
│ ... > 400 > 401 > 401-3     Page 3/3   │
├────────────────────────────────────────┤
│                                        │
│ CRYPTOCURRENCY PRICES                  │
│                                        │
│ Bitcoin (BTC)                          │
│ $45,234.56  ▲ +2.3%  🟢               │
│                                        │
│ Ethereum (ETH)                         │
│ $3,012.89   ▼ -0.8%  🔴               │
│                                        │
│ Cardano (ADA)                          │
│ $0.5234     ► +0.1%  ⚪               │
│                                        │
│ Solana (SOL)                           │
│ $98.45      ▲ +5.2%  🟢               │
│                                        │
│ Last updated: 14:23                    │
│                                        │
├────────────────────────────────────────┤
│ 100=INDEX  ▲ Press ↑ for previous      │
└────────────────────────────────────────┘
```

**Key Features:**
- Last page indicator (only up arrow)
- Page position shown: "Page 3/3"
- Market trend indicators with arrows
- Timestamp for data freshness

## Arrow Indicator States Summary

| State | Up Arrow | Down Arrow | Footer Text Example |
|-------|----------|------------|---------------------|
| First Page | ❌ | ✅ | `100=INDEX  ▼ Press ↓ for more` |
| Middle Page | ✅ | ✅ | `100=INDEX  ↑↓=SCROLL  ▲ Press ↑ for prev` |
| Last Page | ✅ | ❌ | `100=INDEX  ▲ Press ↑ for previous` |
| Single Page | ❌ | ❌ | `100=INDEX  BACK=PREVIOUS` |

## Keyboard Shortcuts

When arrow indicators are displayed, the following keyboard shortcuts are active:

- **↑ (Up Arrow)**: Navigate to previous page (when ▲ shown)
- **↓ (Down Arrow)**: Navigate to next page (when ▼ shown)
- **Page Up**: Same as ↑
- **Page Down**: Same as ↓
- **Home**: Jump to first page of series
- **End**: Jump to last page of series

## Design Rationale

### Symbol Choice
- **▲ (U+25B2)**: Solid up-pointing triangle - clear direction indicator
- **▼ (U+25BC)**: Solid down-pointing triangle - matches up arrow style
- **↑ (U+2191)**: Upward arrow - used in keyboard hint
- **↓ (U+2193)**: Downward arrow - used in keyboard hint

### Text Format
- **Descriptive**: "Press ↓ for more" - clear action
- **Compact**: "↑↓=SCROLL" - space-efficient for contextual help
- **Consistent**: Same format across all pages

### Positioning
- **Footer Row 23**: Always in the same location
- **Left-aligned**: Consistent with other navigation hints
- **40 characters**: Fits teletext grid exactly

## Accessibility Features

1. **Screen Reader Support**: Arrow symbols have descriptive text
2. **Keyboard Navigation**: Matches visual indicators
3. **High Contrast**: Symbols visible in all themes
4. **Consistent Position**: Users know where to look

## Browser Compatibility

All arrow symbols are standard Unicode characters supported by:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers (iOS/Android)

## Related Features

- **Breadcrumb Navigation**: Shows navigation path in header
- **Page Position Indicator**: Shows "Page X/Y" for multi-page content
- **Colored Buttons**: Additional navigation options
- **Contextual Help**: Updates based on available navigation

## Testing

To test arrow navigation indicators:

1. Navigate to a multi-page article (e.g., page 201)
2. Observe down arrow (▼) on first page
3. Press ↓ to navigate to next page
4. Observe both arrows (↑↓) on middle pages
5. Press ↓ repeatedly until last page
6. Observe only up arrow (▲) on last page
7. Press ↑ to navigate back

## Implementation Notes

- Arrow indicators are automatically added by `PageLayoutProcessor`
- Based on page `meta.continuation` data
- No manual configuration required
- Integrates seamlessly with existing navigation system

## Future Enhancements

Potential improvements:
- Animated arrows to draw attention
- Touch/swipe gestures for mobile
- Progress bar showing position in series
- Thumbnail preview of next/previous page
- Smooth scroll animation between pages
