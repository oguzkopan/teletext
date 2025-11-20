// Tests for StaticAdapter

import { StaticAdapter } from '../StaticAdapter';

describe('StaticAdapter', () => {
  let adapter: StaticAdapter;

  beforeEach(() => {
    adapter = new StaticAdapter();
  });

  describe('Basic Pages', () => {
    it('should return the main index page (100)', async () => {
      const page = await adapter.getPage('100');
      
      expect(page.id).toBe('100');
      expect(page.title).toBe('Main Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.links.length).toBeGreaterThan(0);
    });

    it('should return the how it works page (101)', async () => {
      const page = await adapter.getPage('101');
      
      expect(page.id).toBe('101');
      expect(page.title).toBe('How It Works');
      expect(page.rows).toHaveLength(24);
    });

    it('should return the help page (999)', async () => {
      const page = await adapter.getPage('999');
      
      expect(page.id).toBe('999');
      expect(page.title).toBe('Help');
      expect(page.rows).toHaveLength(24);
    });
  });

  describe('Easter Egg Pages', () => {
    it('should return the 404 error page with horror theme', async () => {
      const page = await adapter.getPage('404');
      
      expect(page.id).toBe('404');
      expect(page.title).toBe('Page Not Found');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      
      // Check for haunting mode flag
      expect(page.meta?.haunting).toBe(true);
      
      // Check for horror-themed content
      const content = page.rows.join('');
      expect(content).toContain('404');
      
      // Check for navigation links including 666
      expect(page.links.some(link => link.targetPage === '666')).toBe(true);
    });

    it('should return the cursed page 666 with horror content', async () => {
      const page = await adapter.getPage('666', { generateNew: false });
      
      expect(page.id).toBe('666');
      expect(page.title).toBe('The Cursed Page');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      
      // Check for haunting mode flag
      expect(page.meta?.haunting).toBe(true);
      
      // Check for horror-themed content
      const content = page.rows.join('');
      expect(content).toContain('watching');
      expect(content).toContain('WARNED');
      
      // Check for escape links
      expect(page.links.some(link => link.label === 'ESCAPE')).toBe(true);
    });

    it('should handle page 666 with AI generation disabled', async () => {
      const page = await adapter.getPage('666', { generateNew: false });
      
      expect(page.id).toBe('666');
      expect(page.meta?.haunting).toBe(true);
      expect(page.meta?.aiGenerated).toBe(false);
    });
  });

  describe('Page Validation', () => {
    it('should ensure all pages have exactly 24 rows', async () => {
      const pageIds = ['100', '101', '120', '199', '404', '999'];
      
      for (const pageId of pageIds) {
        const page = await adapter.getPage(pageId);
        expect(page.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', async () => {
      const pageIds = ['100', '101', '404', '999'];
      
      for (const pageId of pageIds) {
        const page = await adapter.getPage(pageId);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
      }
    });

    it('should include metadata for all pages', async () => {
      const page = await adapter.getPage('100');
      
      expect(page.meta).toBeDefined();
      expect(page.meta?.source).toBe('StaticAdapter');
      expect(page.meta?.lastUpdated).toBeDefined();

    });
  });

  describe('Placeholder Pages', () => {
    it('should return placeholder for unimplemented pages in 100-199 range', async () => {
      const page = await adapter.getPage('150');
      
      expect(page.id).toBe('150');
      expect(page.title).toBe('Page 150');
      expect(page.rows).toHaveLength(24);
      
      const content = page.rows.join('');
      expect(content).toContain('COMING SOON');
    });
  });
});
