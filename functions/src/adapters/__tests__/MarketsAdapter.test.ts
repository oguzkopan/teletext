// Tests for MarketsAdapter

import { MarketsAdapter } from '../MarketsAdapter';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MarketsAdapter', () => {
  let adapter: MarketsAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set a mock API key for testing
    process.env.ALPHA_VANTAGE_API_KEY = 'test-api-key';
    adapter = new MarketsAdapter();
  });

  afterEach(() => {
    delete process.env.ALPHA_VANTAGE_API_KEY;
  });

  describe('getPage', () => {
    it('should return markets index for page 400', async () => {
      const page = await adapter.getPage('400');
      
      expect(page.id).toBe('400');
      expect(page.title).toBe('Markets Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.links).toHaveLength(4);
    });

    it('should return cryptocurrency prices for page 401', async () => {
      const mockCryptoData = [
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
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      expect(page.id).toBe('401');
      expect(page.title).toBe('Cryptocurrency Prices');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('MarketsAdapter');
    });

    it('should return stock market data for page 402', async () => {
      const page = await adapter.getPage('402');
      
      expect(page.id).toBe('402');
      expect(page.title).toBe('Stock Market Data');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should return forex rates for page 410', async () => {
      const mockForexData = {
        rates: {
          usd: { name: 'US Dollar', value: 45123.45, type: 'fiat' },
          eur: { name: 'Euro', value: 42345.67, type: 'fiat' }
        }
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockForexData
      });

      const page = await adapter.getPage('410');
      
      expect(page.id).toBe('410');
      expect(page.title).toBe('Foreign Exchange Rates');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should handle API errors gracefully for crypto page', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const page = await adapter.getPage('401');
      
      expect(page.id).toBe('401');
      expect(page.title).toBe('Cryptocurrency Prices');
      // Should use mock data as fallback
      expect(page.rows).toHaveLength(24);
    });

    it('should handle API errors gracefully for forex page', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const page = await adapter.getPage('410');
      
      expect(page.id).toBe('410');
      expect(page.title).toBe('Foreign Exchange Rates');
      // Should use mock data as fallback
      expect(page.rows).toHaveLength(24);
    });

    it('should return placeholder for unimplemented pages', async () => {
      const page = await adapter.getPage('450');
      
      expect(page.id).toBe('450');
      expect(page.rows.some(row => row.includes('COMING SOON'))).toBe(true);
    });

    it('should throw error for invalid page numbers', async () => {
      await expect(adapter.getPage('500')).rejects.toThrow('Invalid markets page');
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      const key = adapter.getCacheKey('401');
      expect(key).toBe('markets_401');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 60 seconds (1 minute)', () => {
      const duration = adapter.getCacheDuration();
      expect(duration).toBe(60);
    });
  });

  describe('page validation', () => {
    it('should ensure all pages have exactly 24 rows', async () => {
      const mockCryptoData = Array(10).fill(null).map((_, i) => ({
        symbol: `coin${i}`,
        name: `Coin ${i}`,
        current_price: 100 + i,
        price_change_percentage_24h: i * 0.5
      }));

      mockedAxios.get.mockResolvedValue({
        data: mockCryptoData
      });

      const pages = ['400', '401', '402', '410'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', async () => {
      const mockCryptoData = [
        {
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45123.45,
          price_change_percentage_24h: 2.34
        }
      ];

      mockedAxios.get.mockResolvedValue({
        data: mockCryptoData
      });

      const pages = ['400', '401', '402', '410'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
      }
    });
  });

  describe('data formatting', () => {
    it('should format cryptocurrency prices correctly', async () => {
      const mockCryptoData = [
        {
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45123.45,
          price_change_percentage_24h: 2.34
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      // Find a row with price data
      const priceRow = page.rows.find(row => row.includes('BTC'));
      expect(priceRow).toBeDefined();
      
      if (priceRow) {
        // Should contain formatted price
        expect(priceRow).toMatch(/\$[\d,]+\.\d{2}/);
        // Should contain percentage change
        expect(priceRow).toMatch(/[+-]\d+\.\d{2}%/);
      }
    });

    it('should format stock prices correctly', async () => {
      const page = await adapter.getPage('402');
      
      // Find a row with stock data (using mock data)
      const stockRow = page.rows.find(row => row.includes('AAPL'));
      expect(stockRow).toBeDefined();
      
      if (stockRow) {
        // Should contain formatted price
        expect(stockRow).toMatch(/\$\d+\.\d{2}/);
        // Should contain percentage change
        expect(stockRow).toMatch(/[+-]\d+\.\d{2}%/);
      }
    });

    it('should format forex rates correctly', async () => {
      const mockForexData = {
        rates: {
          usd: { name: 'US Dollar', value: 45123.45, type: 'fiat' },
          eur: { name: 'Euro', value: 42345.67, type: 'fiat' }
        }
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockForexData
      });

      const page = await adapter.getPage('410');
      
      // Find a row with forex data
      const forexRow = page.rows.find(row => row.includes('BTC/USD'));
      expect(forexRow).toBeDefined();
      
      if (forexRow) {
        // Should contain formatted rate
        expect(forexRow).toMatch(/[\d,]+\.\d+/);
      }
    });

    it('should handle positive percentage changes', async () => {
      const mockCryptoData = [
        {
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45123.45,
          price_change_percentage_24h: 5.67
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      const priceRow = page.rows.find(row => row.includes('BTC'));
      expect(priceRow).toBeDefined();
      
      if (priceRow) {
        // Should have + sign for positive change
        expect(priceRow).toContain('+5.67%');
      }
    });

    it('should handle negative percentage changes', async () => {
      const mockCryptoData = [
        {
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 2345.67,
          price_change_percentage_24h: -3.21
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      const priceRow = page.rows.find(row => row.includes('ETH'));
      expect(priceRow).toBeDefined();
      
      if (priceRow) {
        // Should have - sign for negative change
        expect(priceRow).toContain('-3.21%');
      }
    });

    it('should handle prices less than $1', async () => {
      const mockCryptoData = [
        {
          symbol: 'doge',
          name: 'Dogecoin',
          current_price: 0.0789,
          price_change_percentage_24h: -0.45
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      const priceRow = page.rows.find(row => row.includes('DOGE'));
      expect(priceRow).toBeDefined();
      
      if (priceRow) {
        // Should format with 4 decimal places for prices < $1
        expect(priceRow).toMatch(/\$0\.\d{4}/);
      }
    });

    it('should handle large prices with thousands separator', async () => {
      const mockCryptoData = [
        {
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45123.45,
          price_change_percentage_24h: 2.34
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      const priceRow = page.rows.find(row => row.includes('BTC'));
      expect(priceRow).toBeDefined();
      
      if (priceRow) {
        // Should include comma separator for thousands
        expect(priceRow).toContain('$45,123.45');
      }
    });
  });

  describe('column alignment', () => {
    it('should align cryptocurrency data in columns', async () => {
      const mockCryptoData = [
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
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockCryptoData
      });

      const page = await adapter.getPage('401');
      
      // Find the header row
      const headerRow = page.rows.find(row => row.includes('COIN'));
      expect(headerRow).toBeDefined();
      
      // Find data rows
      const btcRow = page.rows.find(row => row.includes('BTC'));
      const ethRow = page.rows.find(row => row.includes('ETH'));
      
      expect(btcRow).toBeDefined();
      expect(ethRow).toBeDefined();
      
      // All rows should be exactly 40 characters (proper alignment)
      expect(btcRow?.length).toBe(40);
      expect(ethRow?.length).toBe(40);
    });

    it('should align stock data in columns', async () => {
      const page = await adapter.getPage('402');
      
      // Find the header row
      const headerRow = page.rows.find(row => row.includes('SYMBOL'));
      expect(headerRow).toBeDefined();
      
      // Find data rows
      const aaplRow = page.rows.find(row => row.includes('AAPL'));
      const msftRow = page.rows.find(row => row.includes('MSFT'));
      
      expect(aaplRow).toBeDefined();
      expect(msftRow).toBeDefined();
      
      // All rows should be exactly 40 characters (proper alignment)
      expect(aaplRow?.length).toBe(40);
      expect(msftRow?.length).toBe(40);
    });

    it('should align forex data in columns', async () => {
      const mockForexData = {
        rates: {
          usd: { name: 'US Dollar', value: 45123.45, type: 'fiat' },
          eur: { name: 'Euro', value: 42345.67, type: 'fiat' }
        }
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockForexData
      });

      const page = await adapter.getPage('410');
      
      // Find the header row
      const headerRow = page.rows.find(row => row.includes('PAIR'));
      expect(headerRow).toBeDefined();
      
      // Find data rows
      const usdRow = page.rows.find(row => row.includes('BTC/USD'));
      const eurRow = page.rows.find(row => row.includes('BTC/EUR'));
      
      expect(usdRow).toBeDefined();
      expect(eurRow).toBeDefined();
      
      // All rows should be exactly 40 characters (proper alignment)
      expect(usdRow?.length).toBe(40);
      expect(eurRow?.length).toBe(40);
    });
  });

  describe('mock data fallback', () => {
    it('should use mock crypto data when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const page = await adapter.getPage('401');
      
      expect(page.id).toBe('401');
      expect(page.rows).toHaveLength(24);
      
      // Should contain mock data (BTC, ETH, etc.)
      const contentText = page.rows.join('');
      expect(contentText).toMatch(/BTC|ETH|USDT/);
    });

    it('should use mock stock data when no API key is configured', async () => {
      delete process.env.ALPHA_VANTAGE_API_KEY;
      const adapterWithoutKey = new MarketsAdapter();

      const page = await adapterWithoutKey.getPage('402');
      
      expect(page.id).toBe('402');
      expect(page.rows).toHaveLength(24);
      
      // Should contain mock data (AAPL, MSFT, etc.)
      const contentText = page.rows.join('');
      expect(contentText).toMatch(/AAPL|MSFT|GOOGL/);
    });

    it('should use mock forex data when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const page = await adapter.getPage('410');
      
      expect(page.id).toBe('410');
      expect(page.rows).toHaveLength(24);
      
      // Should contain mock data (USD, EUR, etc.)
      const contentText = page.rows.join('');
      expect(contentText).toMatch(/USD|EUR|GBP/);
    });
  });

  describe('metadata', () => {
    it('should include correct metadata in pages', async () => {
      const page = await adapter.getPage('400');
      
      expect(page.meta).toBeDefined();
      expect(page.meta?.source).toBe('MarketsAdapter');
      expect(page.meta?.lastUpdated).toBeDefined();
      expect(page.meta?.cacheStatus).toBe('fresh');
    });
  });

  describe('navigation links', () => {
    it('should include correct navigation links on index page', async () => {
      const page = await adapter.getPage('400');
      
      expect(page.links).toHaveLength(4);
      expect(page.links[0]).toEqual({ label: 'INDEX', targetPage: '100', color: 'red' });
      expect(page.links[1]).toEqual({ label: 'CRYPTO', targetPage: '401', color: 'green' });
      expect(page.links[2]).toEqual({ label: 'STOCKS', targetPage: '402', color: 'yellow' });
      expect(page.links[3]).toEqual({ label: 'FOREX', targetPage: '410', color: 'blue' });
    });

    it('should include correct navigation links on crypto page', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const page = await adapter.getPage('401');
      
      expect(page.links).toHaveLength(4);
      expect(page.links[0]).toEqual({ label: 'INDEX', targetPage: '400', color: 'red' });
      expect(page.links[1]).toEqual({ label: 'STOCKS', targetPage: '402', color: 'green' });
      expect(page.links[2]).toEqual({ label: 'FOREX', targetPage: '410', color: 'yellow' });
      expect(page.links[3]).toEqual({ label: 'BACK', targetPage: '100', color: 'blue' });
    });
  });
});
