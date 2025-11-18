// Integration tests for Cloud Functions
// These tests verify the core functionality without requiring Firebase emulator

import { isValidPageId, routeToAdapter } from '../utils/router';
import { StaticAdapter } from '../adapters/StaticAdapter';

describe('Page Routing', () => {
  describe('isValidPageId', () => {
    it('should accept valid page IDs', () => {
      expect(isValidPageId('100')).toBe(true);
      expect(isValidPageId('201')).toBe(true);
      expect(isValidPageId('899')).toBe(true);
    });

    it('should reject invalid page IDs', () => {
      expect(isValidPageId('99')).toBe(false);
      expect(isValidPageId('900')).toBe(false);
      expect(isValidPageId('abc')).toBe(false);
      expect(isValidPageId('')).toBe(false);
    });
  });

  describe('routeToAdapter', () => {
    it('should route to StaticAdapter for 1xx pages', () => {
      const adapter = routeToAdapter('100');
      expect(adapter).toBeInstanceOf(StaticAdapter);
    });

    it('should throw error for invalid page numbers', () => {
      expect(() => routeToAdapter('99')).toThrow('Invalid page number');
      expect(() => routeToAdapter('900')).toThrow('Invalid page number');
    });
  });
});

describe('StaticAdapter', () => {
  let adapter: StaticAdapter;

  beforeEach(() => {
    adapter = new StaticAdapter();
  });

  describe('getPage', () => {
    it('should return index page for page 100', async () => {
      const page = await adapter.getPage('100');
      
      expect(page.id).toBe('100');
      expect(page.title).toBe('Main Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.links.length).toBeGreaterThan(0);
      expect(page.meta?.source).toBe('StaticAdapter');
    });

    it('should return error page for page 404', async () => {
      const page = await adapter.getPage('404');
      
      expect(page.id).toBe('404');
      expect(page.title).toBe('Page Not Found');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should return placeholder for unimplemented pages', async () => {
      const page = await adapter.getPage('150');
      
      expect(page.id).toBe('150');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('COMING SOON'))).toBe(true);
    });
  });

  describe('getCacheDuration', () => {
    it('should return long cache duration for static pages', () => {
      const duration = adapter.getCacheDuration();
      expect(duration).toBe(31536000); // 1 year
    });
  });

  describe('getCacheKey', () => {
    it('should generate correct cache key', () => {
      const key = adapter.getCacheKey('100');
      expect(key).toBe('static_100');
    });
  });
});

describe('Page Format Validation', () => {
  let adapter: StaticAdapter;

  beforeEach(() => {
    adapter = new StaticAdapter();
  });

  it('should ensure all pages have exactly 24 rows', async () => {
    const pageIds = ['100', '404', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.rows).toHaveLength(24);
    }
  });

  it('should ensure all rows are exactly 40 characters', async () => {
    const pageIds = ['100', '404', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    }
  });

  it('should include metadata in all pages', async () => {
    const pageIds = ['100', '404', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.meta).toBeDefined();
      expect(page.meta?.source).toBe('StaticAdapter');
      expect(page.meta?.lastUpdated).toBeDefined();
    }
  });
});
