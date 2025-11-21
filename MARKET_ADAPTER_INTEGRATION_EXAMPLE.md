# MarketsAdapter Integration Example

This document shows how to integrate the market trend indicators into the existing MarketsAdapter.

## Step 1: Import the Module

Add to the top of `functions/src/adapters/MarketsAdapter.ts`:

```typescript
import {
  formatMarketRow,
  createSparkline,
  createTrendSummary,
  getTrendArrowFromChange,
  getTrendColorFromChange,
  isSignificantChange
} from '../../lib/market-trend-indicators';
```

## Step 2: Update formatCryptoPricesPage Method

Replace the existing formatting logic with trend indicators:

```typescript
private formatCryptoPricesPage(cryptoData: any[]): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows = [
    'CRYPTOCURRENCY PRICES        P401',
    '════════════════════════════════════',
    `Updated: ${timeStr}`,
    '',
    'COIN     PRICE      CHANGE   TREND',
    '────────────────────────────────────'
  ];

  if (cryptoData.length === 0) {
    rows.push('');
    rows.push('No cryptocurrency data available.');
    rows.push('');
    rows.push('Please try again later.');
  } else {
    // Count trends for summary
    let upCount = 0;
    let downCount = 0;
    let stableCount = 0;

    cryptoData.slice(0, 10).forEach((coin) => {
      const changePercent = coin.price_change_percentage_24h || 0;
      const priceHistory = coin.sparkline_in_7d?.price || [];
      
      // Format row with trend indicators
      const row = formatMarketRow(
        coin.symbol?.toUpperCase() || '???',
        coin.current_price,
        changePercent,
        priceHistory.length > 0 ? priceHistory : undefined
      );
      
      rows.push(row);
      
      // Count trends
      if (changePercent > 0.1) upCount++;
      else if (changePercent < -0.1) downCount++;
      else stableCount++;
    });
    
    // Add market summary
    rows.push('');
    rows.push(`Market: ${createTrendSummary(upCount, downCount, stableCount)}`);
  }

  return {
    id: '401',
    title: 'Cryptocurrency Prices',
    rows: this.padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '400', color: 'red' },
      { label: 'STOCKS', targetPage: '402', color: 'green' },
      { label: 'FOREX', targetPage: '410', color: 'yellow' },
      { label: 'BACK', targetPage: '100', color: 'blue' }
    ],
    meta: {
      source: 'MarketsAdapter',
      lastUpdated: new Date().toISOString(),
    }
  };
}
```

## Step 3: Update formatStockDataPage Method

```typescript
private formatStockDataPage(stockData: any[]): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows = [
    'STOCK MARKET DATA            P402',
    '════════════════════════════════════',
    `Updated: ${timeStr}`,
    '',
    'SYMBOL   PRICE      CHANGE   TREND',
    '────────────────────────────────────'
  ];

  if (stockData.length === 0) {
    rows.push('');
    rows.push('No stock data available.');
    rows.push('');
    rows.push('Please try again later.');
  } else {
    let upCount = 0;
    let downCount = 0;
    let stableCount = 0;

    stockData.forEach((stock) => {
      const changePercent = stock.change || 0;
      
      // Format row with trend indicators
      const row = formatMarketRow(
        stock.symbol,
        stock.price,
        changePercent
      );
      
      rows.push(row);
      
      // Add company name on next line (truncated)
      const name = this.truncateText(stock.name, 40);
      rows.push(name);
      
      // Count trends
      if (changePercent > 0.1) upCount++;
      else if (changePercent < -0.1) downCount++;
      else stableCount++;
    });
    
    // Add market summary
    rows.push('');
    rows.push(`Market: ${createTrendSummary(upCount, downCount, stableCount)}`);
  }

  return {
    id: '402',
    title: 'Stock Market Data',
    rows: this.padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '400', color: 'red' },
      { label: 'CRYPTO', targetPage: '401', color: 'green' },
      { label: 'FOREX', targetPage: '410', color: 'yellow' },
      { label: 'BACK', targetPage: '100', color: 'blue' }
    ],
    meta: {
      source: 'MarketsAdapter',
      lastUpdated: new Date().toISOString(),
    }
  };
}
```

## Step 4: Update formatForexRatesPage Method

```typescript
private formatForexRatesPage(forexData: any[]): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows = [
    'FOREIGN EXCHANGE RATES       P410',
    '════════════════════════════════════',
    `Updated: ${timeStr}`,
    '',
    'PAIR              RATE      CHANGE',
    '────────────────────────────────────'
  ];

  if (forexData.length === 0) {
    rows.push('');
    rows.push('No forex data available.');
    rows.push('');
    rows.push('Please try again later.');
  } else {
    // For forex, we'll need to calculate changes
    // This is a simplified example
    forexData.slice(0, 10).forEach((forex) => {
      const pair = `BTC/${forex.currency}`;
      const rate = this.formatForexRate(forex.value);
      
      // Simulate change (in real implementation, compare with previous value)
      const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
      const arrow = getTrendArrowFromChange(changePercent);
      const sign = changePercent >= 0 ? '+' : '';
      const change = `${sign}${changePercent.toFixed(2)}%`;
      
      // Format: "BTC/USD           45,123.45  ▲ +0.23%"
      const line = `${pair.padEnd(18)} ${rate.padStart(12)} ${arrow} ${change}`;
      rows.push(this.truncateText(line, 40));
    });
  }

  return {
    id: '410',
    title: 'Foreign Exchange Rates',
    rows: this.padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '400', color: 'red' },
      { label: 'CRYPTO', targetPage: '401', color: 'green' },
      { label: 'STOCKS', targetPage: '402', color: 'yellow' },
      { label: 'BACK', targetPage: '100', color: 'blue' }
    ],
    meta: {
      source: 'MarketsAdapter',
      lastUpdated: new Date().toISOString(),
    }
  };
}
```

## Step 5: Add CSS to Global Styles

Add to `app/globals.css` or create `app/market-animations.css`:

```css
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
```

## Step 6: Update API Calls to Include Sparkline Data

Modify the CoinGecko API call to include sparkline data:

```typescript
private async fetchCryptoPrices(): Promise<any[]> {
  try {
    const headers: Record<string, string> = {};
    if (this.coinGeckoApiKey) {
      headers['x-cg-demo-api-key'] = this.coinGeckoApiKey;
    }

    const response = await axios.get(
      `${this.coinGeckoBaseUrl}/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: true,  // Enable sparkline data
          price_change_percentage: '24h'
        },
        headers,
        timeout: 5000
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return this.getMockCryptoData();
  }
}
```

## Step 7: Update Mock Data to Include Sparklines

```typescript
private getMockCryptoData(): any[] {
  return [
    {
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 45123.45,
      price_change_percentage_24h: 2.34,
      sparkline_in_7d: {
        price: [44000, 44200, 44500, 44800, 45000, 45200, 45123.45]
      }
    },
    {
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 2345.67,
      price_change_percentage_24h: -1.23,
      sparkline_in_7d: {
        price: [2400, 2380, 2360, 2350, 2340, 2350, 2345.67]
      }
    },
    // ... more mock data with sparklines
  ];
}
```

## Step 8: Add Real-time Update Support (Optional)

For real-time price updates with animations:

```typescript
// In your component that displays market data
useEffect(() => {
  const interval = setInterval(async () => {
    const newData = await fetchMarketData();
    
    // Compare with old data and trigger animations
    newData.forEach((item, index) => {
      const oldItem = oldData[index];
      if (oldItem && isSignificantChange(item.changePercent - oldItem.changePercent)) {
        // Trigger animation
        const element = document.getElementById(`market-${item.symbol}`);
        if (element) {
          element.classList.add('market-price-flash');
          setTimeout(() => {
            element.classList.remove('market-price-flash');
          }, 500);
        }
      }
    });
    
    setOldData(newData);
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to market pages:
   - Page 400: Markets Index
   - Page 401: Cryptocurrency Prices (with trend indicators)
   - Page 402: Stock Market Data (with trend indicators)
   - Page 410: Foreign Exchange Rates (with trend indicators)

3. Verify:
   - ✓ Trend arrows appear (▲ ▼ ►)
   - ✓ Colors are correct (green/red/white)
   - ✓ Sparklines display for crypto prices
   - ✓ Market summary shows at bottom
   - ✓ Animations trigger on page load
   - ✓ All data fits within 40-character width

## Expected Output

```
CRYPTOCURRENCY PRICES        P401
════════════════════════════════════
Updated: 14:23

COIN     PRICE      CHANGE   TREND
────────────────────────────────────
BTC      $45,123.45 ▲ +2.34% ▁▃▅▇█
ETH      $2,345.67  ▼ -1.23% █▇▅▃▁
USDT     $1.00      ► +0.01% ▄▄▄▄▄
BNB      $312.45    ▲ +3.45% ▂▄▅▆█
SOL      $98.76     ▲ +5.67% ▁▂▄▆█
XRP      $0.6234    ▼ -2.34% ▇▆▄▃▂
ADA      $0.4567    ▲ +1.23% ▃▄▄▅▆
AVAX     $34.56     ▲ +4.56% ▂▃▅▆█

Market: ▲5 ▼2 ►1
```

## Troubleshooting

### Sparklines not showing
- Verify API returns sparkline data
- Check that `sparkline: true` is set in API params
- Ensure mock data includes `sparkline_in_7d.price` array

### Colors not appearing
- Verify CSS is loaded
- Check browser console for CSS errors
- Ensure color codes are correct (#00ff00, #ff0000)

### Animations not working
- Check that CSS animations are defined
- Verify `prefers-reduced-motion` is not set
- Test in different browsers

### Text truncation issues
- Verify `formatMarketRow` is limiting to 40 chars
- Check that `padRows` is working correctly
- Test with various symbol lengths

## Performance Considerations

- Sparkline generation is O(n) where n is target width
- Cache sparkline results for repeated renders
- Limit API calls to once per minute
- Use memoization for expensive calculations
- Consider lazy loading for large datasets

## Next Steps

1. Test with live API data
2. Add WebSocket support for real-time updates
3. Implement price alerts with animations
4. Add user preferences for animation intensity
5. Create mobile-optimized version
6. Add accessibility features (screen reader support)
