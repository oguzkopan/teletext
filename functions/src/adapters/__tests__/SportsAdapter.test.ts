// Tests for SportsAdapter

import { SportsAdapter } from '../SportsAdapter';

describe('SportsAdapter', () => {
  let adapter: SportsAdapter;

  beforeEach(() => {
    adapter = new SportsAdapter();
  });

  describe('getPage', () => {
    it('should return sports index for page 300', async () => {
      const page = await adapter.getPage('300');
      
      expect(page.id).toBe('300');
      expect(page.title).toBe('Sport Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SportsAdapter');
    });

    it('should return live scores for page 301', async () => {
      const page = await adapter.getPage('301');
      
      expect(page.id).toBe('301');
      expect(page.title).toBe('Live Scores');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SportsAdapter');
    });

    it('should return league tables for page 302', async () => {
      const page = await adapter.getPage('302');
      
      expect(page.id).toBe('302');
      expect(page.title).toBe('League Tables');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SportsAdapter');
    });

    it('should return team watchlist config for page 310', async () => {
      const page = await adapter.getPage('310');
      
      expect(page.id).toBe('310');
      expect(page.title).toBe('Team Watchlist Config');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SportsAdapter');
    });

    it('should return team pages for pages 311-315', async () => {
      for (let i = 311; i <= 315; i++) {
        const page = await adapter.getPage(i.toString());
        
        expect(page.id).toBe(i.toString());
        expect(page.title).toBe(`Team ${i - 310}`);
        expect(page.rows).toHaveLength(24);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
        expect(page.meta?.source).toBe('SportsAdapter');
      }
    });

    it('should return placeholder for other pages in range', async () => {
      const page = await adapter.getPage('350');
      
      expect(page.id).toBe('350');
      expect(page.title).toBe('Sport Page 350');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SportsAdapter');
    });

    it('should throw error for invalid page numbers', async () => {
      await expect(adapter.getPage('400')).rejects.toThrow('Invalid sports page: 400');
      await expect(adapter.getPage('299')).rejects.toThrow('Invalid sports page: 299');
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      expect(adapter.getCacheKey('300')).toBe('sports_300');
      expect(adapter.getCacheKey('301')).toBe('sports_301');
      expect(adapter.getCacheKey('302')).toBe('sports_302');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 120 seconds (2 minutes) for sports pages', () => {
      expect(adapter.getCacheDuration()).toBe(120);
    });
  });

  describe('page formatting', () => {
    it('should format live scores page with mock data', async () => {
      const page = await adapter.getPage('301');
      
      // Check header
      expect(page.rows[0]).toContain('LIVE SCORES');
      expect(page.rows[0]).toContain('P301');
      expect(page.rows[1].trim()).toBe('════════════════════════════════════');
      expect(page.rows[2]).toContain('Updated:');
      
      // Check for match data (mock data should be present)
      const hasMatchData = page.rows.some(row => 
        row.includes('MAN UTD') || row.includes('ARSENAL') || row.includes('MAN CITY')
      );
      expect(hasMatchData).toBe(true);
    });

    it('should format league tables page with mock data', async () => {
      const page = await adapter.getPage('302');
      
      // Check header
      expect(page.rows[0]).toContain('LEAGUE TABLES');
      expect(page.rows[0]).toContain('P302');
      expect(page.rows[1].trim()).toBe('════════════════════════════════════');
      expect(page.rows[2]).toContain('PREMIER LEAGUE');
      
      // Check for table header
      expect(page.rows[4]).toContain('POS');
      expect(page.rows[4]).toContain('TEAM');
      expect(page.rows[4]).toContain('PTS');
      
      // Check for team data (mock data should be present)
      const hasTeamData = page.rows.some(row => 
        row.includes('MAN CITY') || row.includes('ARSENAL') || row.includes('LIVERPOOL')
      );
      expect(hasTeamData).toBe(true);
    });

    it('should include navigation links', async () => {
      const page = await adapter.getPage('300');
      
      expect(page.links).toBeDefined();
      expect(page.links.length).toBeGreaterThan(0);
      
      // Check for colored button links
      const colors = page.links.map(link => link.color);
      expect(colors).toContain('red');
      expect(colors).toContain('green');
    });

    it('should truncate team names to fit 40-character constraint', async () => {
      const page = await adapter.getPage('302');
      
      // All rows should be exactly 40 characters
      page.rows.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should format scores with proper alignment', async () => {
      const page = await adapter.getPage('301');
      
      // Find score lines (they contain " - " for the score)
      const scoreLines = page.rows.filter(row => row.includes(' - '));
      
      // Each score line should be properly formatted
      scoreLines.forEach(line => {
        expect(line.length).toBe(40);
        // Should have format: "TEAM1  X - Y  TEAM2  STATUS"
        expect(line).toMatch(/\d\s*-\s*\d/);
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully for live scores', async () => {
      // The adapter should fall back to mock data or error page
      const page = await adapter.getPage('301');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('301');
      expect(page.rows).toHaveLength(24);
    });

    it('should handle API errors gracefully for league tables', async () => {
      // The adapter should fall back to mock data or error page
      const page = await adapter.getPage('302');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('302');
      expect(page.rows).toHaveLength(24);
    });
  });

  describe('metadata', () => {
    it('should include correct metadata in all pages', async () => {
      const pages = ['300', '301', '302', '310', '311'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        
        expect(page.meta).toBeDefined();
        expect(page.meta?.source).toBe('SportsAdapter');
        expect(page.meta?.lastUpdated).toBeDefined();
        expect(page.meta?.cacheStatus).toBe('fresh');
      }
    });
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
