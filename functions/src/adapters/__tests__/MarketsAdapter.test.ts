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
    
  });

  describe('getCacheDuration', () => {
    
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
