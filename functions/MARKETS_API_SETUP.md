# Markets API Setup Guide

This guide explains how to set up the external APIs used by the MarketsAdapter for cryptocurrency, stock, and forex data.

## Overview

The MarketsAdapter integrates with the following APIs:
- **CoinGecko API** (Free, no API key required) - Cryptocurrency prices and exchange rates
- **Alpha Vantage API** (Optional) - Stock market data

## CoinGecko API (Cryptocurrency & Forex)

### Features
- Real-time cryptocurrency prices
- 24-hour price changes
- Market cap rankings
- Exchange rates for major currencies

### Setup
No API key required! CoinGecko's public API is free to use with rate limits:
- 10-30 calls/minute (depending on endpoint)
- No authentication needed

### Endpoints Used
1. **Crypto Markets**: `GET /coins/markets`
   - Returns top cryptocurrencies by market cap
   - Includes price, 24h change, and other metrics

2. **Exchange Rates**: `GET /exchange_rates`
   - Returns exchange rates for major currencies
   - Relative to Bitcoin (BTC)

### Rate Limits
- Free tier: 10-30 calls/minute
- Consider implementing caching (already done - 1 minute TTL)

### Documentation
- API Docs: https://www.coingecko.com/en/api/documentation
- No registration required for basic usage

## Alpha Vantage API (Stock Market Data)

### Features
- Real-time and historical stock prices
- Market indices
- Forex rates
- Cryptocurrency data

### Setup

1. **Get API Key** (Free)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Sign up for a free API key
   - Free tier: 25 requests/day, 5 requests/minute

2. **Set Environment Variable**
   ```bash
   # Local development (.env.local)
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   
   # Firebase Functions
   firebase functions:config:set alpha_vantage.api_key="your_api_key_here"
   ```

3. **Access in Code**
   ```typescript
   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
   ```

### Endpoints Used
1. **Quote Endpoint**: `GET /query?function=GLOBAL_QUOTE`
   - Returns real-time stock quote
   - Symbol parameter required

2. **Batch Quotes**: `GET /query?function=BATCH_STOCK_QUOTES`
   - Returns quotes for multiple symbols
   - Limited to 100 symbols per request

### Rate Limits
- Free tier: 25 requests/day, 5 requests/minute
- Premium tiers available for higher limits

### Documentation
- API Docs: https://www.alphavantage.co/documentation/

## Current Implementation

### Mock Data Fallback
The MarketsAdapter includes mock data for all endpoints, which is used when:
- No API key is configured
- API requests fail
- Rate limits are exceeded

This ensures the application works out-of-the-box for development and testing.

### Pages Implemented

1. **Page 400** - Markets Index
   - Overview of available market data
   - Navigation to crypto, stocks, and forex pages

2. **Page 401** - Cryptocurrency Prices
   - Top 10 cryptocurrencies by market cap
   - Current price and 24-hour change
   - Updates every 60 seconds

3. **Page 402** - Stock Market Data
   - Major stock indices and popular stocks
   - Current price and percentage change
   - Updates every 60 seconds

4. **Page 410** - Foreign Exchange Rates
   - 10 major currency pairs
   - Rates relative to Bitcoin (from CoinGecko)
   - Updates every 60 seconds

### Caching Strategy
- All market pages cached for 60 seconds (1 minute)
- Reduces API calls and improves performance
- Balances freshness with rate limit constraints

## Testing Without API Keys

The adapter works without any API keys by using mock data:

```bash
# No environment variables needed for basic testing
npm test

# Or run the functions locally
npm run serve
```

Mock data includes:
- 10 popular cryptocurrencies with realistic prices
- 5 major US stocks (AAPL, MSFT, GOOGL, AMZN, TSLA)
- 10 major currency pairs

## Production Deployment

### Recommended Setup

1. **Use CoinGecko** (Free)
   - No API key needed
   - Sufficient for crypto and forex data
   - Already implemented and working

2. **Optional: Add Alpha Vantage** (Free tier)
   - Only if you need real stock data
   - 25 requests/day is enough for demo purposes
   - Consider upgrading for production use

3. **Set Environment Variables**
   ```bash
   # Firebase Functions config
   firebase functions:config:set \
     alpha_vantage.api_key="your_key_here"
   
   # Deploy
   firebase deploy --only functions
   ```

### Alternative APIs

If you need more features or higher rate limits, consider:

1. **Cryptocurrency**
   - CoinMarketCap API (free tier available)
   - Binance API (free, high rate limits)
   - Kraken API (free, good documentation)

2. **Stock Market**
   - IEX Cloud (free tier available)
   - Finnhub (free tier available)
   - Yahoo Finance API (unofficial, free)

3. **Forex**
   - Fixer.io (free tier available)
   - ExchangeRate-API (free, no key required)
   - Open Exchange Rates (free tier available)

## Troubleshooting

### CoinGecko Rate Limit Exceeded
- Error: 429 Too Many Requests
- Solution: Increase cache TTL or implement request queuing
- The 60-second cache should prevent most rate limit issues

### Alpha Vantage Daily Limit Reached
- Error: API call frequency limit reached
- Solution: Use mock data or upgrade to premium tier
- Consider caching data for longer periods

### Network Errors
- The adapter automatically falls back to mock data
- Check your internet connection
- Verify API endpoints are accessible

## Future Enhancements

Potential improvements for the markets adapter:

1. **User Watchlists**
   - Allow users to track specific cryptocurrencies/stocks
   - Personalized market pages

2. **Historical Charts**
   - Display price trends over time
   - ASCII art charts in teletext format

3. **Price Alerts**
   - Notify users of significant price changes
   - Configurable thresholds

4. **More Asset Classes**
   - Commodities (gold, silver, oil)
   - Market indices (S&P 500, NASDAQ, etc.)
   - Bonds and treasuries

5. **Advanced Metrics**
   - Market cap, volume, supply
   - Technical indicators
   - News integration

## Support

For issues or questions:
- CoinGecko: https://www.coingecko.com/en/api/documentation
- Alpha Vantage: https://www.alphavantage.co/support/
- Project Issues: [Your GitHub repo]
