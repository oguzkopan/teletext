// Unit tests for DevAdapter

import { DevAdapter } from '../DevAdapter';
import { TeletextPage } from '../../types';

describe('DevAdapter', () => {
  let adapter: DevAdapter;

  beforeEach(() => {
    adapter = new DevAdapter();
  });

  describe('getPage', () => {
    it('should return API explorer index for page 800', async () => {
      const page = await adapter.getPage('800');
      
      expect(page.id).toBe('800');
      expect(page.title).toBe('API Explorer');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('DevAdapter');
      expect(page.links).toHaveLength(4);
    });

    it('should return raw JSON page for page 801', async () => {
      const page = await adapter.getPage('801');
      
      expect(page.id).toBe('801');
      expect(page.title).toBe('Raw JSON');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('DevAdapter');
    });

    it('should return API documentation for page 802', async () => {
      const page = await adapter.getPage('802');
      
      expect(page.id).toBe('802');
      expect(page.title).toBe('API Documentation');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('DevAdapter');
    });

    it('should return example requests for page 803', async () => {
      const page = await adapter.getPage('803');
      
      expect(page.id).toBe('803');
      expect(page.title).toBe('Example Requests');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('DevAdapter');
    });

    it('should return placeholder for unimplemented pages in 800-899 range', async () => {
      const page = await adapter.getPage('850');
      
      expect(page.id).toBe('850');
      expect(page.title).toBe('Dev Page 850');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should throw error for pages outside 800-899 range', async () => {
      await expect(adapter.getPage('700')).rejects.toThrow('Invalid dev page: 700');
    });

    it('should display current page JSON when provided as parameter', async () => {
      const mockPage: TeletextPage = {
        id: '201',
        title: 'Test Page',
        rows: Array(24).fill('Test content'.padEnd(40, ' ')),
        links: [
          { label: 'TEST', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'TestAdapter',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const page = await adapter.getPage('801', { currentPage: mockPage });
      
      expect(page.id).toBe('801');
      expect(page.title).toBe('Raw JSON');
      // Check that the page contains JSON content
      const contentRows = page.rows.slice(3, -1).join('');
      expect(contentRows).toContain('"id"');
      expect(contentRows).toContain('"201"');
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      expect(adapter.getCacheKey('800')).toBe('dev_800');
      expect(adapter.getCacheKey('801')).toBe('dev_801');
      expect(adapter.getCacheKey('850')).toBe('dev_850');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 0 seconds (no caching) for dev pages', () => {
      expect(adapter.getCacheDuration()).toBe(0);
    });
  });

  describe('Page content validation', () => {
    it('should include API explorer navigation links on page 800', async () => {
      const page = await adapter.getPage('800');
      
      const linkTargets = page.links.map(link => link.targetPage);
      expect(linkTargets).toContain('100'); // INDEX
      expect(linkTargets).toContain('801'); // JSON
      expect(linkTargets).toContain('802'); // DOCS
      expect(linkTargets).toContain('803'); // EXAMPLES
    });

    it('should include endpoint documentation on page 802', async () => {
      const page = await adapter.getPage('802');
      
      const content = page.rows.join('');
      expect(content).toContain('GET /api/page/:id');
      expect(content).toContain('POST /api/ai');
      expect(content).toContain('100-199: System');
      expect(content).toContain('200-299: News');
    });

    it('should include example request format on page 803', async () => {
      const page = await adapter.getPage('803');
      
      const content = page.rows.join('');
      expect(content).toContain('GET /api/page/201');
      expect(content).toContain('"success": true');
      expect(content).toContain('"page"');
    });

    it('should format JSON to fit 40-character width on page 801', async () => {
      const page = await adapter.getPage('801');
      
      // All rows should be exactly 40 characters
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      
      // Should contain JSON-like content
      const content = page.rows.join('');
      expect(content).toContain('{');
      expect(content).toContain('"id"');
      
      // Check that JSON is formatted (contains quotes and colons)
      expect(content).toMatch(/"\w+":/);
    });
  });

  describe('Static context management', () => {
    it('should use stored context when available for page 801', async () => {
      const mockPage: TeletextPage = {
        id: '300',
        title: 'Sports Index',
        rows: Array(24).fill('Sports content'.padEnd(40, ' ')),
        links: [],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      // Set context
      DevAdapter.setCurrentPageContext(mockPage);

      // Get page 801
      const page = await adapter.getPage('801');
      
      const content = page.rows.join('');
      expect(content).toContain('"300"');
      expect(content).toContain('Sports');

      // Clear context
      DevAdapter.setCurrentPageContext(null);
    });
  });

  describe('Metadata completeness', () => {
    it('should include complete metadata on all dev pages', async () => {
      const pageIds = ['800', '801', '802', '803'];
      
      for (const pageId of pageIds) {
        const page = await adapter.getPage(pageId);
        
        expect(page.meta).toBeDefined();
        expect(page.meta?.source).toBe('DevAdapter');
        expect(page.meta?.lastUpdated).toBeDefined();
        expect(page.meta?.cacheStatus).toBe('fresh');
      }
    });
  });
});
