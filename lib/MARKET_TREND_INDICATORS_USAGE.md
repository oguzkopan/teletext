# Market Trend Indicators Usage Guide

This module provides visual indicators and animations for market data display in the Modern Teletext application.

## Features

- **Trend Arrows**: ▲ (up), ▼ (down), ► (stable)
- **Color Coding**: Green for gains, red for losses, white for stable
- **Animated Percentage Changes**: Counting effect for price changes
- **ASCII Sparklines**: Visual price history representation
- **Price Movement Animations**: Upward/downward animations

## Requirements

Implements requirements 23.1, 23.2, 23.3, 23.4, 23.5 from the UX Redesign specification.

## Basic Usage

### Trend Arrows

```typescript
import { getTrendArrowFromChange, getTrendColorFromChange } from './market-trend-indicators';

// Get arrow based on price change
const arrow = getTrendArrowFromChange(2.34);  // Returns: ▲
const color = getTrendColorFromChange(2.34);  // Returns: 'green'
```

### Format Price Changes

```typescript
import { formatTrendChange } from './market-trend-indicators';

// Format with arrow and percentage
const change = formatTrendChange(2.34);
// Returns: "▲ +2.34%"

const negChange = formatTrendChange(-1.23);
// Returns: "▼ -1.23%"

// Without arrow
const changeNoArrow = formatTrendChange(2.34, { showArrow: false });
// Returns: "+2.34%"
```

### Complete Market Data Row

```typescript
import { formatMarketRow } from './market-trend-indicators';

// Basic format
const row = formatMarketRow('BTC', 45123.45, 2.34);
// Returns: "BTC      $45,123.45  ▲ +2.34%"

// With price history sparkline
const history = [44000, 44500, 45000, 45500, 45123.45];
const rowWithSparkline = formatMarketRow('BTC', 45123.45, 2.34, history);
// Returns: "BTC      $45,123.45  ▲ +2.34% ▃▄▅▆█"
```

### ASCII Sparklines

```typescript
import { createSparkline } from './market-trend-indicators';

const priceHistory = [100, 105, 103, 108, 110, 107, 112, 115];
const sparkline = createSparkline(priceHistory, 20);
// Returns: "▁▃▂▅▆▄▇█" (scaled to show trend)
```

### Market Data with Trend

```typescript
import { formatMarketDataWithTrend, MarketData } from './market-trend-indicators';

const data: MarketData = {
  symbol: 'BTC',
  price: 45123.45,
  change: 1056.78,
  changePercent: 2.34,
  priceHistory: [44000, 44500, 45000, 45500, 45123.45]
};

const formatted = formatMarketDataWithTrend(data);
// Returns formatted string with symbol, price, arrow, and percentage
```

## Animations

### CSS Animations

Include the generated CSS in your application:

```typescript
import { generateMarketTrendCSS } from './market-trend-indicators';

// Add to your stylesheet
const css = generateMarketTrendCSS();
```

### Animation Classes

```typescript
import { getTrendAnimationClass } from './market-trend-indicators';

const className = getTrendAnimationClass('up');
// Returns: 'market-trend-up'

// Apply to element
element.className = getTrendAnimationClass(getTrendDirection(changePercent));
```

### Animated Percentage Counter

```typescript
import { createAnimatedPercentage } from './market-trend-indicators';

// Create HTML with animation attributes
const html = createAnimatedPercentage(0, 2.34, 1000);
// Returns HTML string with data attributes for JavaScript animation
```

## Helper Functions

### Trend Summary

```typescript
import { createTrendSummary } from './market-trend-indicators';

// Count trends in your data
const upCount = 5;
const downCount = 3;
const stableCount = 2;

const summary = createTrendSummary(upCount, downCount, stableCount);
// Returns: "▲5 ▼3 ►2"
```

### Significant Change Detection

```typescript
import { isSignificantChange } from './market-trend-indicators';

// Check if change warrants animation
if (isSignificantChange(changePercent, 1.0)) {
  // Apply animation
}
```

## Integration with MarketsAdapter

Example integration in the MarketsAdapter:

```typescript
import {
  formatMarketRow,
  createSparkline,
  createTrendSummary,
  getTrendArrowFromChange,
  getTrendColorFromChange
} from '../lib/market-trend-indicators';

// In formatCryptoPricesPage method:
cryptoData.forEach((coin) => {
  const history = coin.sparkline_in_7d?.price || [];
  const row = formatMarketRow(
    coin.symbol.toUpperCase(),
    coin.current_price,
    coin.price_change_percentage_24h,
    history
  );
  rows.push(row);
});

// Add trend summary
const upCount = cryptoData.filter(c => c.price_change_percentage_24h > 0.1).length;
const downCount = cryptoData.filter(c => c.price_change_percentage_24h < -0.1).length;
const stableCount = cryptoData.length - upCount - downCount;
rows.push('');
rows.push(`Market: ${createTrendSummary(upCount, downCount, stableCount)}`);
```

## CSS Classes

The following CSS classes are available:

- `.market-trend-up` - Green color with upward animation
- `.market-trend-down` - Red color with downward animation
- `.market-trend-stable` - White color, no animation
- `.market-percentage-count` - Flash animation for percentage changes
- `.market-price-flash` - Background flash for price updates
- `.market-sparkline` - Draw animation for sparklines

## Animation Keyframes

- `trend-up` - Upward bounce animation (0.5s)
- `trend-down` - Downward bounce animation (0.5s)
- `count-flash` - Scale and opacity flash (0.3s)
- `price-flash` - Background color flash (0.5s)
- `sparkline-draw` - Left-to-right draw effect (1s)

## Examples

### Complete Market Page

```typescript
const rows = [
  'CRYPTOCURRENCY PRICES        P401',
  '════════════════════════════════════',
  `Updated: ${timeStr}`,
  '',
  'COIN     PRICE        CHANGE  TREND',
  '────────────────────────────────────'
];

// Add market data with trends
cryptoData.forEach((coin) => {
  const row = formatMarketRow(
    coin.symbol.toUpperCase(),
    coin.current_price,
    coin.price_change_percentage_24h,
    coin.sparkline_in_7d?.price
  );
  rows.push(row);
});

// Add summary
const summary = createTrendSummary(upCount, downCount, stableCount);
rows.push('');
rows.push(`Market Summary: ${summary}`);
```

### Real-time Updates

```typescript
// When price updates
const oldPrice = 45000;
const newPrice = 45123.45;
const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;

// Check if significant
if (isSignificantChange(changePercent)) {
  // Apply animation
  element.className = getTrendAnimationClass(getTrendDirection(changePercent));
  
  // Update display
  element.innerHTML = formatTrendChange(changePercent);
}
```

## Best Practices

1. **Use sparklines for historical context**: Include price history when available
2. **Apply animations for significant changes**: Use `isSignificantChange()` to avoid over-animating
3. **Maintain consistent formatting**: Use the provided formatting functions for consistency
4. **Color code appropriately**: Always use trend colors for better visual communication
5. **Keep sparklines readable**: Limit width to 10-20 characters for teletext display

## Performance Considerations

- Sparklines are generated on-demand, cache results for repeated renders
- CSS animations are GPU-accelerated for smooth performance
- Sampling algorithm efficiently handles large price history arrays
- Animation durations are optimized for teletext display (0.3-1s)

## Accessibility

- Trend arrows provide visual indicators beyond color
- Stable trend uses neutral color and symbol
- Animations can be disabled via CSS `prefers-reduced-motion`
- Text-based indicators work with screen readers
