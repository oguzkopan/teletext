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
