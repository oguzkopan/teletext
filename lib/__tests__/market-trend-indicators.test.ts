/**
 * Tests for Market Trend Indicators
 */

import {
  getTrendDirection,
  getTrendArrow,
  getTrendArrowFromChange,
  getTrendColor,
  getTrendColorFromChange,
  formatTrendChange,
  formatMarketDataWithTrend,
  createSparkline,
  getTrendAnimationClass,
  generateMarketTrendCSS,
  createAnimatedPercentage,
  formatMarketRow,
  createTrendSummary,
  isSignificantChange,
  MarketData,
} from '../market-trend-indicators';

describe('Market Trend Indicators', () => {
  describe('getTrendDirection', () => {
    it('should return "up" for positive changes above threshold', () => {
      expect(getTrendDirection(2.5)).toBe('up');
      expect(getTrendDirection(0.2)).toBe('up');
    });

    it('should return "down" for negative changes below threshold', () => {
      expect(getTrendDirection(-2.5)).toBe('down');
      expect(getTrendDirection(-0.2)).toBe('down');
    });

    it('should return "stable" for changes within threshold', () => {
      expect(getTrendDirection(0.05)).toBe('stable');
      expect(getTrendDirection(-0.05)).toBe('stable');
      expect(getTrendDirection(0)).toBe('stable');
    });
  });

  describe('getTrendArrow', () => {
    it('should return correct arrow symbols', () => {
      expect(getTrendArrow('up')).toBe('▲');
      expect(getTrendArrow('down')).toBe('▼');
      expect(getTrendArrow('stable')).toBe('►');
    });
  });

  describe('getTrendArrowFromChange', () => {
    it('should return correct arrow based on change value', () => {
      expect(getTrendArrowFromChange(5.0)).toBe('▲');
      expect(getTrendArrowFromChange(-3.0)).toBe('▼');
      expect(getTrendArrowFromChange(0.05)).toBe('►');
    });
  });

  describe('getTrendColor', () => {
    it('should return correct colors for trends', () => {
      expect(getTrendColor('up')).toBe('green');
      expect(getTrendColor('down')).toBe('red');
      expect(getTrendColor('stable')).toBe('white');
    });
  });

  describe('getTrendColorFromChange', () => {
    it('should return correct color based on change value', () => {
      expect(getTrendColorFromChange(2.5)).toBe('green');
      expect(getTrendColorFromChange(-2.5)).toBe('red');
      expect(getTrendColorFromChange(0.05)).toBe('white');
    });
  });

  describe('formatTrendChange', () => {
    it('should format positive changes with arrow and sign', () => {
      const result = formatTrendChange(2.34);
      expect(result).toContain('▲');
      expect(result).toContain('+2.34%');
    });

    it('should format negative changes with arrow and sign', () => {
      const result = formatTrendChange(-1.23);
      expect(result).toContain('▼');
      expect(result).toContain('-1.23%');
    });

    it('should format stable changes', () => {
      const result = formatTrendChange(0.05);
      expect(result).toContain('►');
      expect(result).toContain('+0.05%');
    });

    it('should respect showArrow option', () => {
      const withArrow = formatTrendChange(2.34, { showArrow: true });
      const withoutArrow = formatTrendChange(2.34, { showArrow: false });
      
      expect(withArrow).toContain('▲');
      expect(withoutArrow).not.toContain('▲');
    });
  });

  describe('formatMarketDataWithTrend', () => {
    it('should format complete market data row', () => {
      const data: MarketData = {
        symbol: 'BTC',
        price: 45123.45,
        change: 1056.78,
        changePercent: 2.34,
      };

      const result = formatMarketDataWithTrend(data);
      expect(result).toContain('BTC');
      expect(result).toContain('45123.45');
      expect(result).toContain('▲');
      expect(result).toContain('+2.34%');
    });

    it('should handle negative changes', () => {
      const data: MarketData = {
        symbol: 'ETH',
        price: 2345.67,
        change: -28.90,
        changePercent: -1.23,
      };

      const result = formatMarketDataWithTrend(data);
      expect(result).toContain('ETH');
      expect(result).toContain('▼');
      expect(result).toContain('-1.23%');
    });
  });

  describe('createSparkline', () => {
    it('should create sparkline from price history', () => {
      const history = [100, 105, 103, 108, 110, 107, 112];
      const sparkline = createSparkline(history, 7);
      
      expect(sparkline).toHaveLength(7);
      expect(sparkline).toMatch(/[▁▂▃▄▅▆▇█]+/);
    });

    it('should handle empty history', () => {
      const sparkline = createSparkline([], 10);
      expect(sparkline).toBe('──────────');
    });

    it('should handle flat price history', () => {
      const history = [100, 100, 100, 100, 100];
      const sparkline = createSparkline(history, 5);
      expect(sparkline).toBe('▄▄▄▄▄');
    });

    it('should sample data to fit width', () => {
      const history = Array.from({ length: 100 }, (_, i) => 100 + i);
      const sparkline = createSparkline(history, 20);
      expect(sparkline).toHaveLength(20);
    });

    it('should show increasing trend', () => {
      const history = [100, 110, 120, 130, 140];
      const sparkline = createSparkline(history, 5);
      
      // Should have increasing characters
      const chars = sparkline.split('');
      const indices = chars.map(c => '▁▂▃▄▅▆▇█'.indexOf(c));
      
      // Check that trend is generally increasing
      expect(indices[4]).toBeGreaterThan(indices[0]);
    });

    it('should show decreasing trend', () => {
      const history = [140, 130, 120, 110, 100];
      const sparkline = createSparkline(history, 5);
      
      // Should have decreasing characters
      const chars = sparkline.split('');
      const indices = chars.map(c => '▁▂▃▄▅▆▇█'.indexOf(c));
      
      // Check that trend is generally decreasing
      expect(indices[0]).toBeGreaterThan(indices[4]);
    });
  });

  describe('getTrendAnimationClass', () => {
    it('should return correct CSS classes', () => {
      expect(getTrendAnimationClass('up')).toBe('market-trend-up');
      expect(getTrendAnimationClass('down')).toBe('market-trend-down');
      expect(getTrendAnimationClass('stable')).toBe('market-trend-stable');
    });
  });

  describe('generateMarketTrendCSS', () => {
    it('should generate valid CSS', () => {
      const css = generateMarketTrendCSS();
      
      expect(css).toContain('.market-trend-up');
      expect(css).toContain('.market-trend-down');
      expect(css).toContain('.market-trend-stable');
      expect(css).toContain('@keyframes trend-up');
      expect(css).toContain('@keyframes trend-down');
      expect(css).toContain('animation:');
    });

    it('should include color definitions', () => {
      const css = generateMarketTrendCSS();
      
      expect(css).toContain('#00ff00'); // green
      expect(css).toContain('#ff0000'); // red
      expect(css).toContain('#ffffff'); // white
    });

    it('should include all animation types', () => {
      const css = generateMarketTrendCSS();
      
      expect(css).toContain('market-percentage-count');
      expect(css).toContain('market-price-flash');
      expect(css).toContain('market-sparkline');
    });
  });

  describe('createAnimatedPercentage', () => {
    it('should create HTML with animation attributes', () => {
      const html = createAnimatedPercentage(0, 2.34, 1000);
      
      expect(html).toContain('data-start="0"');
      expect(html).toContain('data-end="2.34"');
      expect(html).toContain('data-duration="1000"');
      expect(html).toContain('▲');
      expect(html).toContain('+2.34%');
    });

    it('should use correct color for positive change', () => {
      const html = createAnimatedPercentage(0, 2.34);
      expect(html).toContain('#00ff00'); // green
    });

    it('should use correct color for negative change', () => {
      const html = createAnimatedPercentage(0, -1.23);
      expect(html).toContain('#ff0000'); // red
    });

    it('should include CSS class', () => {
      const html = createAnimatedPercentage(0, 2.34);
      expect(html).toContain('market-percentage-count');
      expect(html).toContain('market-trend-up');
    });
  });

  describe('formatMarketRow', () => {
    it('should format complete market row', () => {
      const row = formatMarketRow('BTC', 45123.45, 2.34);
      
      expect(row).toContain('BTC');
      expect(row).toContain('45,123.45');
      expect(row).toContain('▲');
      expect(row).toContain('+2.34%');
      expect(row.length).toBeLessThanOrEqual(40);
    });

    it('should include sparkline when history provided', () => {
      const history = [100, 105, 103, 108, 110];
      const row = formatMarketRow('ETH', 2345.67, -1.23, history);
      
      expect(row).toContain('ETH');
      expect(row).toContain('▼');
      expect(row).toMatch(/[▁▂▃▄▅▆▇█]+/);
    });

    it('should handle small prices correctly', () => {
      const row = formatMarketRow('DOGE', 0.0789, 1.23);
      
      expect(row).toContain('DOGE');
      expect(row).toContain('0.0789');
      expect(row).toContain('▲');
    });

    it('should truncate to 40 characters', () => {
      const history = Array.from({ length: 100 }, (_, i) => 100 + i);
      const row = formatMarketRow('VERYLONGSYMBOL', 999999.99, 99.99, history);
      
      expect(row.length).toBeLessThanOrEqual(40);
    });
  });

  describe('createTrendSummary', () => {
    it('should create summary with counts', () => {
      const summary = createTrendSummary(5, 3, 2);
      
      expect(summary).toContain('▲5');
      expect(summary).toContain('▼3');
      expect(summary).toContain('►2');
    });

    it('should handle zero counts', () => {
      const summary = createTrendSummary(0, 0, 10);
      
      expect(summary).toContain('▲0');
      expect(summary).toContain('▼0');
      expect(summary).toContain('►10');
    });
  });

  describe('isSignificantChange', () => {
    it('should identify significant positive changes', () => {
      expect(isSignificantChange(2.5, 1.0)).toBe(true);
      expect(isSignificantChange(1.5, 1.0)).toBe(true);
    });

    it('should identify significant negative changes', () => {
      expect(isSignificantChange(-2.5, 1.0)).toBe(true);
      expect(isSignificantChange(-1.5, 1.0)).toBe(true);
    });

    it('should identify insignificant changes', () => {
      expect(isSignificantChange(0.5, 1.0)).toBe(false);
      expect(isSignificantChange(-0.5, 1.0)).toBe(false);
      expect(isSignificantChange(0, 1.0)).toBe(false);
    });

    it('should respect custom threshold', () => {
      expect(isSignificantChange(0.5, 0.3)).toBe(true);
      expect(isSignificantChange(0.2, 0.3)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      expect(getTrendDirection(0)).toBe('stable');
      expect(formatTrendChange(0)).toContain('►');
    });

    it('should handle very large numbers', () => {
      const row = formatMarketRow('BTC', 999999.99, 99.99);
      expect(row).toBeTruthy();
      expect(row.length).toBeLessThanOrEqual(40);
    });

    it('should handle very small numbers', () => {
      const row = formatMarketRow('SHIB', 0.00001234, -0.01);
      expect(row).toContain('0.0000');
    });

    it('should handle negative prices gracefully', () => {
      const row = formatMarketRow('TEST', -100, -50);
      expect(row).toBeTruthy();
    });
  });
});
