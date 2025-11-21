/**
 * Market Trend Indicators
 * 
 * Provides visual indicators and animations for market data including:
 * - Trend arrows (▲ up, ▼ down, ► stable)
 * - Color coding for price changes (green=up, red=down)
 * - Animated percentage changes with counting effect
 * - ASCII sparklines for price history
 * - Upward/downward animations for price movements
 * 
 * Requirements: 23.1, 23.2, 23.3, 23.4, 23.5
 */

export type TrendDirection = 'up' | 'down' | 'stable';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  priceHistory?: number[];
}

export interface TrendIndicatorOptions {
  showArrow?: boolean;
  showColor?: boolean;
  showAnimation?: boolean;
  animationDuration?: number;
}

/**
 * Gets the trend direction based on price change
 */
export function getTrendDirection(change: number): TrendDirection {
  if (change > 0.1) return 'up';
  if (change < -0.1) return 'down';
  return 'stable';
}

/**
 * Gets the trend arrow symbol based on direction
 * ▲ for up, ▼ for down, ► for stable
 */
export function getTrendArrow(direction: TrendDirection): string {
  switch (direction) {
    case 'up':
      return '▲';
    case 'down':
      return '▼';
    case 'stable':
      return '►';
  }
}

/**
 * Gets the trend arrow based on price change
 */
export function getTrendArrowFromChange(change: number): string {
  return getTrendArrow(getTrendDirection(change));
}

/**
 * Gets the color code for a trend direction
 * green for up, red for down, white for stable
 */
export function getTrendColor(direction: TrendDirection): string {
  switch (direction) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'stable':
      return 'white';
  }
}

/**
 * Gets the color code based on price change
 */
export function getTrendColorFromChange(change: number): string {
  return getTrendColor(getTrendDirection(change));
}

/**
 * Formats a price change with trend arrow and color
 * Example: "▲ +2.34%" (green) or "▼ -1.23%" (red)
 */
export function formatTrendChange(
  change: number,
  options: TrendIndicatorOptions = {}
): string {
  const { showArrow = true } = options;
  const direction = getTrendDirection(change);
  const arrow = showArrow ? getTrendArrow(direction) + ' ' : '';
  const sign = change >= 0 ? '+' : '';
  return `${arrow}${sign}${change.toFixed(2)}%`;
}

/**
 * Formats market data with trend indicators
 */
export function formatMarketDataWithTrend(
  data: MarketData,
  options: TrendIndicatorOptions = {}
): string {
  const arrow = getTrendArrowFromChange(data.changePercent);
  const sign = data.changePercent >= 0 ? '+' : '';
  return `${data.symbol.padEnd(8)} $${data.price.toFixed(2).padStart(10)} ${arrow} ${sign}${data.changePercent.toFixed(2)}%`;
}

/**
 * Creates an ASCII sparkline from price history
 * Uses characters: ▁ ▂ ▃ ▄ ▅ ▆ ▇ █
 */
export function createSparkline(
  priceHistory: number[],
  width: number = 20
): string {
  if (!priceHistory || priceHistory.length === 0) {
    return ''.padEnd(width, '─');
  }

  // Sample the data to fit the width
  const sampledData = sampleArray(priceHistory, width);
  
  // Find min and max for normalization
  const min = Math.min(...sampledData);
  const max = Math.max(...sampledData);
  const range = max - min;

  // If all values are the same, return flat line
  if (range === 0) {
    return ''.padEnd(width, '▄');
  }

  // Map to sparkline characters
  const sparkChars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  
  return sampledData
    .map(value => {
      const normalized = (value - min) / range;
      const index = Math.min(
        Math.floor(normalized * sparkChars.length),
        sparkChars.length - 1
      );
      return sparkChars[index];
    })
    .join('');
}

/**
 * Samples an array to a specific length
 */
function sampleArray(arr: number[], targetLength: number): number[] {
  if (arr.length <= targetLength) {
    return arr;
  }

  const step = arr.length / targetLength;
  const sampled: number[] = [];
  
  for (let i = 0; i < targetLength; i++) {
    const index = Math.floor(i * step);
    sampled.push(arr[index]);
  }
  
  return sampled;
}

/**
 * Creates CSS classes for trend animations
 */
export function getTrendAnimationClass(direction: TrendDirection): string {
  switch (direction) {
    case 'up':
      return 'market-trend-up';
    case 'down':
      return 'market-trend-down';
    case 'stable':
      return 'market-trend-stable';
  }
}

/**
 * Generates CSS for market trend animations
 */
export function generateMarketTrendCSS(): string {
  return `
/* Market Trend Animations */
.market-trend-up {
  animation: trend-up 0.5s ease-out;
  color: #00ff00;
}

.market-trend-down {
  animation: trend-down 0.5s ease-out;
  color: #ff0000;
}

.market-trend-stable {
  color: #ffffff;
}

@keyframes trend-up {
  0% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-3px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes trend-down {
  0% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(3px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Percentage counting animation */
.market-percentage-count {
  animation: count-flash 0.3s ease-in-out;
}

@keyframes count-flash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Price change flash */
.market-price-flash {
  animation: price-flash 0.5s ease-out;
}

@keyframes price-flash {
  0% {
    background-color: rgba(255, 255, 0, 0.3);
  }
  100% {
    background-color: transparent;
  }
}

/* Sparkline animation */
.market-sparkline {
  display: inline-block;
  letter-spacing: -1px;
  animation: sparkline-draw 1s ease-out;
}

@keyframes sparkline-draw {
  from {
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
`;
}

/**
 * Creates an animated percentage counter effect
 * Returns HTML with data attributes for JavaScript animation
 */
export function createAnimatedPercentage(
  startValue: number,
  endValue: number,
  duration: number = 1000
): string {
  const direction = getTrendDirection(endValue);
  const arrow = getTrendArrow(direction);
  const color = getTrendColor(direction);
  
  return `<span class="market-percentage-count ${getTrendAnimationClass(direction)}" 
    data-start="${startValue}" 
    data-end="${endValue}" 
    data-duration="${duration}"
    style="color: ${color === 'green' ? '#00ff00' : color === 'red' ? '#ff0000' : '#ffffff'}">
    ${arrow} ${endValue >= 0 ? '+' : ''}${endValue.toFixed(2)}%
  </span>`;
}

/**
 * Formats a complete market row with all indicators
 */
export function formatMarketRow(
  symbol: string,
  price: number,
  changePercent: number,
  priceHistory?: number[]
): string {
  const arrow = getTrendArrowFromChange(changePercent);
  const sign = changePercent >= 0 ? '+' : '';
  const change = `${sign}${changePercent.toFixed(2)}%`;
  
  // Format: "BTC      $45,123.45  ▲ +2.34%"
  let row = `${symbol.padEnd(8)} $${formatPrice(price).padStart(10)} ${arrow} ${change.padStart(8)}`;
  
  // Add sparkline if history is available
  if (priceHistory && priceHistory.length > 0) {
    const sparkline = createSparkline(priceHistory, 10);
    row += ` ${sparkline}`;
  }
  
  return row.substring(0, 40);
}

/**
 * Formats a price with appropriate precision
 */
function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (price >= 1) {
    return price.toFixed(2);
  } else {
    return price.toFixed(4);
  }
}

/**
 * Creates a trend summary line
 */
export function createTrendSummary(
  upCount: number,
  downCount: number,
  stableCount: number
): string {
  return `▲${upCount} ▼${downCount} ►${stableCount}`;
}

/**
 * Determines if a price movement is significant enough to animate
 */
export function isSignificantChange(changePercent: number, threshold: number = 1.0): boolean {
  return Math.abs(changePercent) >= threshold;
}
