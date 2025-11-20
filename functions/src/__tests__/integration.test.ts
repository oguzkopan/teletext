// Integration tests for Cloud Functions
// These tests verify the core functionality without requiring Firebase emulator

import { isValidPageId, routeToAdapter } from '../utils/router';
import { StaticAdapter } from '../adapters/StaticAdapter';
import { NewsAdapter } from '../adapters/NewsAdapter';
import { SportsAdapter } from '../adapters/SportsAdapter';
import { MarketsAdapter } from '../adapters/MarketsAdapter';
import { WeatherAdapter } from '../adapters/WeatherAdapter';
import { SettingsAdapter } from '../adapters/SettingsAdapter';
import { DevAdapter } from '../adapters/DevAdapter';

describe('Page Routing', () => {
  describe('isValidPageId', () => {
    it('should accept valid page IDs', () => {
      expect(isValidPageId('100')).toBe(true);
      expect(isValidPageId('201')).toBe(true);
      expect(isValidPageId('899')).toBe(true);
      expect(isValidPageId('999')).toBe(true); // Special help page
    });

    it('should reject invalid page IDs', () => {
      expect(isValidPageId('99')).toBe(false);
      expect(isValidPageId('900')).toBe(false);
      expect(isValidPageId('998')).toBe(false);
      expect(isValidPageId('abc')).toBe(false);
      expect(isValidPageId('')).toBe(false);
    });
  });

  describe('routeToAdapter', () => {
    it('should route to StaticAdapter for 1xx pages', () => {
      const adapter = routeToAdapter('100');
      expect(adapter).toBeInstanceOf(StaticAdapter);
    });

    it('should route to NewsAdapter for 2xx pages', () => {
      const adapter = routeToAdapter('200');
      expect(adapter).toBeInstanceOf(NewsAdapter);
    });

    it('should route to SportsAdapter for 3xx pages', () => {
      const adapter = routeToAdapter('300');
      expect(adapter).toBeInstanceOf(SportsAdapter);
    });

    it('should route to MarketsAdapter for 4xx pages (400-419)', () => {
      const adapter = routeToAdapter('400');
      expect(adapter).toBeInstanceOf(MarketsAdapter);
      
      const adapter410 = routeToAdapter('410');
      expect(adapter410).toBeInstanceOf(MarketsAdapter);
    });

    it('should route to WeatherAdapter for 4xx pages (420-449)', () => {
      const adapter = routeToAdapter('420');
      expect(adapter).toBeInstanceOf(WeatherAdapter);
      
      const adapter430 = routeToAdapter('430');
      expect(adapter430).toBeInstanceOf(WeatherAdapter);
    });

    it('should route to SettingsAdapter for 7xx pages', () => {
      const adapter = routeToAdapter('700');
      expect(adapter).toBeInstanceOf(SettingsAdapter);
      
      const adapter710 = routeToAdapter('710');
      expect(adapter710).toBeInstanceOf(SettingsAdapter);
    });

    it('should route to DevAdapter for 8xx pages', () => {
      const adapter = routeToAdapter('800');
      expect(adapter).toBeInstanceOf(DevAdapter);
      
      const adapter850 = routeToAdapter('850');
      expect(adapter850).toBeInstanceOf(DevAdapter);
    });

    it('should route to StaticAdapter for page 999 (help page)', () => {
      const adapter = routeToAdapter('999');
      expect(adapter).toBeInstanceOf(StaticAdapter);
    });

    it('should throw error for invalid page numbers', () => {
      expect(() => routeToAdapter('99')).toThrow('Invalid page number');
      expect(() => routeToAdapter('900')).toThrow('Invalid page number');
      expect(() => routeToAdapter('998')).toThrow('Invalid page number');
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

    it('should return how it works page for page 101', async () => {
      const page = await adapter.getPage('101');
      
      expect(page.id).toBe('101');
      expect(page.title).toBe('How It Works');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('WHAT IS TELETEXT'))).toBe(true);
    });

    it('should return emergency bulletins page for page 120', async () => {
      const page = await adapter.getPage('120');
      
      expect(page.id).toBe('120');
      expect(page.title).toBe('Emergency Bulletins');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('BREAKING ALERTS'))).toBe(true);
    });

    it('should return about/credits page for page 199', async () => {
      const page = await adapter.getPage('199');
      
      expect(page.id).toBe('199');
      expect(page.title).toBe('About & Credits');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('MODERN TELETEXT'))).toBe(true);
    });

    it('should return help page for page 999', async () => {
      const page = await adapter.getPage('999');
      
      expect(page.id).toBe('999');
      expect(page.title).toBe('Help');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('NAVIGATION INSTRUCTIONS'))).toBe(true);
    });

    it('should return error page for page 404', async () => {
      const page = await adapter.getPage('404');
      
      expect(page.id).toBe('404');
      expect(page.title).toBe('Page Not Found');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should return placeholder for unimplemented pages in 100-199 range', async () => {
      const page = await adapter.getPage('150');
      
      expect(page.id).toBe('150');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows.some(row => row.includes('COMING SOON'))).toBe(true);
    });
  });

});

describe('Page Format Validation', () => {
  let adapter: StaticAdapter;

  beforeEach(() => {
    adapter = new StaticAdapter();
  });

  it('should ensure all pages have exactly 24 rows', async () => {
    const pageIds = ['100', '101', '120', '199', '404', '999', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.rows).toHaveLength(24);
    }
  });

  it('should ensure all rows are exactly 40 characters', async () => {
    const pageIds = ['100', '101', '120', '199', '404', '999', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    }
  });

  it('should include metadata in all pages', async () => {
    const pageIds = ['100', '101', '120', '199', '404', '999', '150'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.meta).toBeDefined();
      expect(page.meta?.source).toBe('StaticAdapter');
      expect(page.meta?.lastUpdated).toBeDefined();
    }
  });

  it('should include navigation links in all pages', async () => {
    const pageIds = ['100', '101', '120', '199', '404', '999'];
    
    for (const pageId of pageIds) {
      const page = await adapter.getPage(pageId);
      expect(page.links).toBeDefined();
      expect(page.links.length).toBeGreaterThan(0);
    }
  });
});
