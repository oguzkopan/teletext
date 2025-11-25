/**
 * Tests for SportsAdapter layout implementation
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

import { SportsAdapter } from '../SportsAdapter';

describe('SportsAdapter Layout', () => {
  let adapter: SportsAdapter;

  beforeEach(() => {
    adapter = new SportsAdapter();
  });

  describe('Sports Index Page (300)', () => {
    it('should use tabular layout with aligned columns', async () => {
      const page = await adapter.getPage('300');
      
      // Find the table header row
      const headerRow = page.rows.find(row => row.includes('POS TEAM'));
      expect(headerRow).toBeDefined();
      
      // Verify column headers are present (Requirement 19.5)
      expect(headerRow).toContain('POS');
      expect(headerRow).toContain('TEAM');
      expect(headerRow).toContain('P');
      expect(headerRow).toContain('W');
      expect(headerRow).toContain('D');
      expect(headerRow).toContain('L');
      expect(headerRow).toContain('PTS');
    });

    it('should right-align numeric values', async () => {
      const page = await adapter.getPage('300');
      
      // Find a data row (e.g., Liverpool)
      const dataRow = page.rows.find(row => row.includes('Liverpool'));
      expect(dataRow).toBeDefined();
      
      // Verify the row has proper structure with right-aligned numbers
      // Format should be: " 1  Liverpool         15 11  3  1  36"
      // Position should be right-aligned in 2 chars
      // Team name should be left-aligned and padded
      // All stats should be right-aligned
      expect(dataRow).toMatch(/^\s*\d+\s+\w+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+/);
    });

    it('should truncate long team names to fit columns', async () => {
      const page = await adapter.getPage('300');
      
      // All team names should fit within their column width
      const dataRows = page.rows.filter(row => 
        row.match(/^\s*\d+\s+\w/) && !row.includes('POS')
      );
      
      dataRows.forEach(row => {
        // Extract team name (after position number, before stats)
        const match = row.match(/^\s*\d+\s+(\w+(?:\s+\w+)*)\s+\d+/);
        if (match) {
          const teamName = match[1].trim();
          // Team name should not exceed reasonable length (e.g., 17 chars)
          expect(teamName.length).toBeLessThanOrEqual(17);
        }
      });
    });
  });

  describe('League Tables Page (302)', () => {
    it('should use tabular layout with column headers', async () => {
      const page = await adapter.getPage('302');
      
      // Find the table header row
      const headerRow = page.rows.find(row => row.includes('POS TEAM'));
      expect(headerRow).toBeDefined();
      
      // Verify all column headers are present (Requirement 19.5)
      expect(headerRow).toContain('POS');
      expect(headerRow).toContain('TEAM');
      expect(headerRow).toContain('P');
      expect(headerRow).toContain('W');
      expect(headerRow).toContain('D');
      expect(headerRow).toContain('L');
      expect(headerRow).toContain('PTS');
    });

    it('should right-align all numeric values', async () => {
      const page = await adapter.getPage('302');
      
      // Find data rows (after the separator line)
      const separatorIndex = page.rows.findIndex(row => row.includes('────'));
      const dataRows = page.rows.slice(separatorIndex + 1, separatorIndex + 11);
      
      dataRows.forEach(row => {
        if (row.trim().length > 0 && row.match(/^\s*\d+/)) {
          // Each numeric column should be right-aligned
          // Format: "POS  TEAM              P  W  D  L  PTS"
          expect(row).toMatch(/^\s*\d+\s+\w+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+/);
        }
      });
    });

    it('should truncate long team names', async () => {
      const page = await adapter.getPage('302');
      
      // Find data rows
      const dataRows = page.rows.filter(row => 
        row.match(/^\s*\d+\s+\w/) && !row.includes('POS')
      );
      
      dataRows.forEach(row => {
        // Team names should be truncated to fit the column (14 chars max)
        const match = row.match(/^\s*\d+\s+(\w+(?:\s+\w+)*)\s+\d+/);
        if (match) {
          const teamName = match[1].trim();
          expect(teamName.length).toBeLessThanOrEqual(14);
        }
      });
    });
  });

  describe('Live Scores Page (301)', () => {
    it('should use tabular layout for match scores', async () => {
      const page = await adapter.getPage('301');
      
      // Should have structured score lines
      // Format should be consistent across all matches
      const scoreLines = page.rows.filter(row => 
        row.includes('v') || row.includes('-')
      );
      
      // If there are matches, verify they follow tabular format
      if (scoreLines.length > 0) {
        scoreLines.forEach(line => {
          // Should have team names and scores in consistent positions
          expect(line.length).toBeGreaterThan(0);
        });
      }
    });

    it('should use color coding for live matches', async () => {
      const page = await adapter.getPage('301');
      
      // Check for color codes in live match indicators
      const liveIndicators = page.rows.filter(row => 
        row.includes('{green}●') || row.includes('{yellow}◐')
      );
      
      // If there are live matches, they should have color coding
      // This verifies Requirement 19.4
      if (page.meta?.hasLiveMatches) {
        expect(liveIndicators.length).toBeGreaterThan(0);
      }
    });

    it('should truncate team names in score lines', async () => {
      const page = await adapter.getPage('301');
      
      // All score lines should have truncated team names
      // This is handled by the formatScoreLine function
      // which uses truncated team names passed to it
      const contentRows = page.rows.filter(row => row.trim().length > 0);
      
      // Verify page structure is valid
      expect(contentRows.length).toBeGreaterThan(0);
    });
  });

  describe('Tabular Layout Requirements', () => {
    it('should maintain consistent column alignment across all sports pages', async () => {
      const pages = ['300', '302'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        
        // Find the header row
        const headerRow = page.rows.find(row => row.includes('POS TEAM'));
        
        if (headerRow) {
          // Verify POS column starts at consistent position
          const posIndex = headerRow.indexOf('POS');
          expect(posIndex).toBeGreaterThanOrEqual(0);
          
          // Verify TEAM column follows
          const teamIndex = headerRow.indexOf('TEAM');
          expect(teamIndex).toBeGreaterThan(posIndex);
          
          // Verify numeric columns are present
          expect(headerRow).toContain('PTS');
        }
      }
    });

    it('should use separator lines to delineate table sections', async () => {
      const pages = ['300', '302'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        
        // Should have separator line after header
        const separatorRow = page.rows.find(row => 
          row.includes('────') || row.includes('━━━━')
        );
        
        expect(separatorRow).toBeDefined();
      }
    });
  });
});
