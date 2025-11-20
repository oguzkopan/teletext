// Tests for SportsAdapter

import { SportsAdapter } from '../SportsAdapter';

describe('SportsAdapter', () => {
  let adapter: SportsAdapter;

  beforeEach(() => {
    adapter = new SportsAdapter();
  });

  describe('getPage', () => {
    
  });

  describe('getCacheDuration', () => {
    
  });

  describe('page structure', () => {
    it('should have consistent header format across all pages', async () => {
      const pages = ['300', '301', '302', '310'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        
        // First row should contain page title and page number
        expect(page.rows[0]).toContain(`P${pageId}`);
        
        // Second row should be separator
        expect(page.rows[1].trim()).toBe('════════════════════════════════════');
      }
    });

    it('should have navigation links in footer area', async () => {
      const page = await adapter.getPage('300');
      
      // Last row should be empty (for Fastext display)
      expect(page.rows[23].trim()).toBe('');
      
      // Check that navigation links exist in the page
      expect(page.links.length).toBeGreaterThan(0);
      expect(page.links.some(link => link.label === 'INDEX')).toBe(true);
    });
  });
});
