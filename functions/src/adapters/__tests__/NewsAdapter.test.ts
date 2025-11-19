// Tests for NewsAdapter

import { NewsAdapter } from '../NewsAdapter';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NewsAdapter', () => {
  let adapter: NewsAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set a mock API key for testing
    process.env.NEWS_API_KEY = 'test-api-key';
    adapter = new NewsAdapter();
  });

  afterEach(() => {
    delete process.env.NEWS_API_KEY;
  });

  describe('getPage', () => {
    it('should return news index for page 200', async () => {
      const page = await adapter.getPage('200');
      
      expect(page.id).toBe('200');
      expect(page.title).toBe('News Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.links).toHaveLength(4);
    });

    it('should return top headlines for page 201', async () => {
      const mockArticles = [
        {
          title: 'Breaking News: Test Article 1',
          source: { name: 'Test Source' }
        },
        {
          title: 'Breaking News: Test Article 2',
          source: { name: 'Another Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('201');
      
      expect(page.id).toBe('201');
      expect(page.title).toBe('Top Headlines');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('NewsAdapter');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const page = await adapter.getPage('201');
      
      expect(page.id).toBe('201');
      expect(page.title).toBe('Top Headlines');
      expect(page.rows.some(row => row.includes('SERVICE UNAVAILABLE'))).toBe(true);
    });

    it('should return world news for page 202', async () => {
      const mockArticles = [
        {
          title: 'World News Article',
          source: { name: 'Global News' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('202');
      
      expect(page.id).toBe('202');
      expect(page.title).toBe('World News');
      expect(page.rows).toHaveLength(24);
    });

    it('should return local news for page 203', async () => {
      const mockArticles = [
        {
          title: 'Local News Article',
          source: { name: 'Local Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('203');
      
      expect(page.id).toBe('203');
      expect(page.title).toBe('Local News');
      expect(page.rows).toHaveLength(24);
    });

    it('should return technology news for page 210', async () => {
      const mockArticles = [
        {
          title: 'Tech News Article',
          source: { name: 'Tech Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('210');
      
      expect(page.id).toBe('210');
      expect(page.title).toBe('Technology');
      expect(page.rows).toHaveLength(24);
    });

    it('should truncate headlines to fit within 40 characters', async () => {
      const longTitle = 'This is a very long headline that exceeds the maximum allowed length for teletext display';
      const mockArticles = [
        {
          title: longTitle,
          source: { name: 'Test Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('201');
      
      // All rows should be exactly 40 characters
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      
      // Find the headline row (should start with "1. ")
      const headlineRow = page.rows.find(row => row.trim().startsWith('1.'));
      expect(headlineRow).toBeDefined();
      
      if (headlineRow) {
        const headlineText = headlineRow.trim();
        expect(headlineText).toContain('...');
      }
    });

    it('should handle empty articles array', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: [] }
      });

      const page = await adapter.getPage('201');
      
      expect(page.id).toBe('201');
      const contentText = page.rows.join('');
      expect(contentText).toContain('No articles available');
    });

    it('should return placeholder for unimplemented pages', async () => {
      const page = await adapter.getPage('250');
      
      expect(page.id).toBe('250');
      expect(page.rows.some(row => row.includes('COMING SOON'))).toBe(true);
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      const key = adapter.getCacheKey('201');
      expect(key).toBe('news_201');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 300 seconds (5 minutes)', () => {
      const duration = adapter.getCacheDuration();
      expect(duration).toBe(300);
    });
  });

  describe('page validation', () => {
    it('should ensure all pages have exactly 24 rows', async () => {
      const mockArticles = Array(10).fill(null).map((_, i) => ({
        title: `Article ${i + 1}`,
        source: { name: 'Source' }
      }));

      mockedAxios.get.mockResolvedValue({
        data: { articles: mockArticles }
      });

      const pages = ['200', '201', '202', '203', '210'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', async () => {
      const mockArticles = [
        {
          title: 'Test',
          source: { name: 'Source' }
        }
      ];

      mockedAxios.get.mockResolvedValue({
        data: { articles: mockArticles }
      });

      const pages = ['200', '201', '202', '203', '210'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
      }
    });
  });

  describe('HTML sanitization', () => {
    it('should strip HTML tags from article titles', async () => {
      const mockArticles = [
        {
          title: '<p>Article with <strong>HTML</strong> tags</p>',
          source: { name: 'Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('201');
      
      // Check that HTML tags are removed
      const contentRows = page.rows.join('');
      expect(contentRows).not.toContain('<p>');
      expect(contentRows).not.toContain('<strong>');
      expect(contentRows).not.toContain('</strong>');
      expect(contentRows).not.toContain('</p>');
    });

    it('should decode HTML entities', async () => {
      const mockArticles = [
        {
          title: 'Article with &amp; &quot;quotes&quot;',
          source: { name: 'Source' }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { articles: mockArticles }
      });

      const page = await adapter.getPage('201');
      
      // Find the headline row
      const headlineRow = page.rows.find(row => row.trim().startsWith('1.'));
      expect(headlineRow).toBeDefined();
      
      if (headlineRow) {
        // Check that HTML entities are decoded
        expect(headlineRow).toContain('&');
        expect(headlineRow).toContain('"');
        // Should not contain the encoded versions
        expect(headlineRow).not.toContain('&amp;');
        expect(headlineRow).not.toContain('&quot;');
      }
    });
  });
});
