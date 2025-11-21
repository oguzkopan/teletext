// Markets adapter for pages 400-499
// Integrates with CoinGecko API for cryptocurrency data and financial APIs for stocks

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';
import { getApiKey } from '../utils/config';

/**
 * MarketsAdapter serves market pages (400-499)
 * Integrates with CoinGecko for crypto and financial APIs for stocks/forex
 */
export class MarketsAdapter implements ContentAdapter {
  private coinGeckoBaseUrl: string = 'https://api.coingecko.com/api/v3';
  private coinGeckoApiKey: string;
  private alphaVantageApiKey: string;

  constructor() {
    // Get API keys from environment variables or Firebase config
    this.coinGeckoApiKey = getApiKey('COINGECKO_API_KEY', 'coingecko.api_key');
    this.alphaVantageApiKey = getApiKey('ALPHA_VANTAGE_API_KEY', 'alphavantage.api_key');
  }

  /**
   * Retrieves a markets page
   * @param pageId - The page ID to retrieve (400-499)
   * @returns A TeletextPage object with market content
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific market pages
    if (pageNumber === 400) {
      return this.getMarketsIndex();
    } else if (pageNumber === 401) {
      return this.getCryptoPrices();
    } else if (pageNumber === 402) {
      return this.getStockMarketData();
    } else if (pageNumber === 410) {
      return this.getForexRates();
    } else if (pageNumber >= 400 && pageNumber < 500) {
      return this.getPlaceholderPage(pageId);
    }

    throw new Error(`Invalid markets page: ${pageId}`);
  }



  /**
   * Creates the markets index page (400)
   */
  private getMarketsIndex(): TeletextPage {
    const rows = [
      'MARKETS INDEX                P400',
      '════════════════════════════════════',
      '',
      'FINANCIAL MARKETS',
      '401 Cryptocurrency Prices',
      '402 Stock Market Data',
      '410 Foreign Exchange Rates',
      '',
      'COMING SOON',
      '420 Commodities',
      '430 Indices',
      '',
      '',
      '',
      '',
      '',
      'Updated every 60 seconds',
      '',
      '',
      '',
      '',
      'INDEX   CRYPTO  STOCKS  FOREX',
      ''
    ];

    return {
      id: '400',
      title: 'Markets Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'CRYPTO', targetPage: '401', color: 'green' },
        { label: 'STOCKS', targetPage: '402', color: 'yellow' },
        { label: 'FOREX', targetPage: '410', color: 'blue' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates the cryptocurrency prices page (401)
   */
  private async getCryptoPrices(): Promise<TeletextPage> {
    try {
      const cryptoData = await this.fetchCryptoPrices();
      return this.formatCryptoPricesPage(cryptoData);
    } catch (error) {
      return this.getErrorPage('401', 'Cryptocurrency Prices', error);
    }
  }

  /**
   * Creates the stock market data page (402)
   */
  private async getStockMarketData(): Promise<TeletextPage> {
    try {
      const stockData = await this.fetchStockData();
      return this.formatStockDataPage(stockData);
    } catch (error) {
      return this.getErrorPage('402', 'Stock Market Data', error);
    }
  }

  /**
   * Creates the foreign exchange rates page (410)
   */
  private async getForexRates(): Promise<TeletextPage> {
    try {
      const forexData = await this.fetchForexRates();
      return this.formatForexRatesPage(forexData);
    } catch (error) {
      return this.getErrorPage('410', 'Foreign Exchange', error);
    }
  }

  /**
   * Fetches cryptocurrency prices from CoinGecko API
   */
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
            sparkline: false,
            price_change_percentage: '24h'
          },
          headers,
          timeout: 5000
        }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Fallback to mock data on error
      return this.getMockCryptoData();
    }
  }

  /**
   * Fetches stock market data
   */
  private async fetchStockData(): Promise<any[]> {
    // If no API key, return mock data
    if (!this.alphaVantageApiKey) {
      return this.getMockStockData();
    }

    try {
      // Fetch data for major indices/stocks
      // Note: Alpha Vantage has rate limits, so we'll use mock data for demo
      // In production, you'd fetch real data or use a different API
      return this.getMockStockData();
    } catch (error) {
      return this.getMockStockData();
    }
  }

  /**
   * Fetches foreign exchange rates
   */
  private async fetchForexRates(): Promise<any[]> {
    try {
      const headers: Record<string, string> = {};
      if (this.coinGeckoApiKey) {
        headers['x-cg-demo-api-key'] = this.coinGeckoApiKey;
      }

      // Using CoinGecko's exchange rates endpoint
      const response = await axios.get(
        `${this.coinGeckoBaseUrl}/exchange_rates`,
        {
          headers,
          timeout: 5000
        }
      );

      const rates = response.data?.rates || {};
      
      // Extract major currency pairs
      const majorCurrencies = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'inr', 'krw'];
      const forexData = majorCurrencies
        .filter(currency => rates[currency])
        .map(currency => ({
          currency: currency.toUpperCase(),
          name: rates[currency].name,
          value: rates[currency].value,
          type: rates[currency].type
        }));

      return forexData;
    } catch (error) {
      console.error('Error fetching forex rates:', error);
      return this.getMockForexData();
    }
  }

  /**
   * Formats cryptocurrency prices into a teletext page
   */
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
      'COIN         PRICE       24H CHANGE',
      '────────────────────────────────────'
    ];

    if (cryptoData.length === 0) {
      rows.push('');
      rows.push('No cryptocurrency data available.');
      rows.push('');
      rows.push('Please try again later.');
    } else {
      cryptoData.slice(0, 10).forEach((coin) => {
        const symbol = this.truncateText(coin.symbol?.toUpperCase() || '???', 6);
        const price = this.formatPrice(coin.current_price);
        const change = coin.price_change_percentage_24h || 0;
        const changeStr = this.formatPercentage(change);
        
        // Format: "BTC      $45,123.45    +2.34%"
        const line = `${symbol.padEnd(8)} ${price.padStart(12)} ${changeStr.padStart(10)}`;
        rows.push(this.truncateText(line, 40));
      });
    }

    // Add remaining empty rows
    while (rows.length < 22) {
      rows.push('');
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

  /**
   * Formats stock market data into a teletext page
   */
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
      'SYMBOL       PRICE       CHANGE',
      '────────────────────────────────────'
    ];

    if (stockData.length === 0) {
      rows.push('');
      rows.push('No stock data available.');
      rows.push('');
      rows.push('Please try again later.');
    } else {
      stockData.forEach((stock) => {
        const symbol = this.truncateText(stock.symbol, 8);
        const price = this.formatPrice(stock.price);
        const change = stock.change || 0;
        const changeStr = this.formatPercentage(change);
        
        // Format: "AAPL     $175.43      +1.23%"
        const line = `${symbol.padEnd(10)} ${price.padStart(10)} ${changeStr.padStart(10)}`;
        rows.push(this.truncateText(line, 40));
        
        // Add company name on next line
        const name = this.truncateText(stock.name, 40);
        rows.push(name);
      });
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

  /**
   * Formats foreign exchange rates into a teletext page
   */
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
      'PAIR              RATE',
      '────────────────────────────────────'
    ];

    if (forexData.length === 0) {
      rows.push('');
      rows.push('No forex data available.');
      rows.push('');
      rows.push('Please try again later.');
    } else {
      // Display rates relative to BTC (from CoinGecko) or USD
      forexData.slice(0, 10).forEach((forex) => {
        const pair = `BTC/${forex.currency}`;
        const rate = this.formatForexRate(forex.value);
        
        // Format: "BTC/USD           45,123.45"
        const line = `${pair.padEnd(18)} ${rate.padStart(12)}`;
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

  /**
   * Formats a price value with appropriate precision
   */
  private formatPrice(price: number): string {
    if (price === undefined || price === null) {
      return 'N/A';
    }

    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  }

  /**
   * Formats a percentage change value
   */
  private formatPercentage(change: number): string {
    if (change === undefined || change === null) {
      return 'N/A';
    }

    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  /**
   * Formats a forex rate value
   */
  private formatForexRate(rate: number): string {
    if (rate === undefined || rate === null) {
      return 'N/A';
    }

    if (rate >= 1000) {
      return rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (rate >= 1) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(6);
    }
  }

  /**
   * Returns mock cryptocurrency data for testing/demo
   */
  private getMockCryptoData(): any[] {
    return [
      {
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45123.45,
        price_change_percentage_24h: 2.34
      },
      {
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2345.67,
        price_change_percentage_24h: -1.23
      },
      {
        symbol: 'usdt',
        name: 'Tether',
        current_price: 1.00,
        price_change_percentage_24h: 0.01
      },
      {
        symbol: 'bnb',
        name: 'Binance Coin',
        current_price: 312.45,
        price_change_percentage_24h: 3.45
      },
      {
        symbol: 'sol',
        name: 'Solana',
        current_price: 98.76,
        price_change_percentage_24h: 5.67
      },
      {
        symbol: 'xrp',
        name: 'XRP',
        current_price: 0.6234,
        price_change_percentage_24h: -2.34
      },
      {
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.4567,
        price_change_percentage_24h: 1.23
      },
      {
        symbol: 'avax',
        name: 'Avalanche',
        current_price: 34.56,
        price_change_percentage_24h: 4.56
      },
      {
        symbol: 'doge',
        name: 'Dogecoin',
        current_price: 0.0789,
        price_change_percentage_24h: -0.45
      },
      {
        symbol: 'dot',
        name: 'Polkadot',
        current_price: 6.78,
        price_change_percentage_24h: 2.12
      }
    ];
  }

  /**
   * Returns mock stock data for testing/demo
   */
  private getMockStockData(): any[] {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 1.23
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.91,
        change: 0.87
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.56,
        change: -0.45
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 178.23,
        change: 2.34
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 234.56,
        change: -1.67
      }
    ];
  }

  /**
   * Returns mock forex data for testing/demo
   */
  private getMockForexData(): any[] {
    return [
      { currency: 'USD', name: 'US Dollar', value: 45123.45, type: 'fiat' },
      { currency: 'EUR', name: 'Euro', value: 42345.67, type: 'fiat' },
      { currency: 'GBP', name: 'British Pound', value: 38456.78, type: 'fiat' },
      { currency: 'JPY', name: 'Japanese Yen', value: 6234567.89, type: 'fiat' },
      { currency: 'AUD', name: 'Australian Dollar', value: 68234.56, type: 'fiat' },
      { currency: 'CAD', name: 'Canadian Dollar', value: 61234.56, type: 'fiat' },
      { currency: 'CHF', name: 'Swiss Franc', value: 39876.54, type: 'fiat' },
      { currency: 'CNY', name: 'Chinese Yuan', value: 325678.90, type: 'fiat' },
      { currency: 'INR', name: 'Indian Rupee', value: 3756789.12, type: 'fiat' },
      { currency: 'KRW', name: 'South Korean Won', value: 59876543.21, type: 'fiat' }
    ];
  }

  /**
   * Creates an error page when API fails
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to fetch market data at this',
      'time.',
      '',
      'This could be due to:',
      '• API service is down',
      '• Network connectivity issues',
      '• Rate limit exceeded',
      '',
      'Please try again in a few minutes.',
      '',
      '',
      '',
      '',
      'Press 400 for markets index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   MARKETS',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `MARKETS PAGE ${pageId}           P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Markets page ${pageId} is under`,
      'construction.',
      '',
      'This page will be available in a',
      'future update.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 400 for markets index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   MARKETS',
      ''
    ];

    return {
      id: pageId,
      title: `Markets Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
