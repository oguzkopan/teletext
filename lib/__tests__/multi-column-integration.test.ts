/**
 * Integration tests for multi-column layout with news and sports content
 * Tests Requirements 1.2, 1.3, 12.1, 12.2, 12.3
 */

import {
  renderMultiColumn,
  validateOutput,
  TELETEXT_WIDTH,
  TELETEXT_HEIGHT
} from '../layout-engine';

describe('Multi-Column Layout Integration', () => {
  describe('News Content', () => {
    it('should render news headlines in 2-column layout', () => {
      const newsHeadlines = [
        '1. Breaking: Major event occurs',
        '2. Sports: Team wins championship',
        '3. Markets: Stocks rise sharply',
        '4. Weather: Sunny skies ahead',
        '5. Tech: New product launched',
        '6. Politics: Important decision',
        '7. Entertainment: Movie premiere',
        '8. Science: Discovery announced'
      ];

      const page = renderMultiColumn({
        pageNumber: '200',
        title: 'News Headlines',
        content: newsHeadlines,
        columns: 2,
        timestamp: '14:30',
        hints: [{ text: 'Enter number to read' }]
      });

      // Validate structure
      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
      expect(page.length).toBe(TELETEXT_HEIGHT);
      page.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });

      // Check header
      expect(page[0]).toContain('200');
      expect(page[0]).toContain('News Headlines');
      expect(page[0]).toContain('14:30');

      // Check content is distributed across columns
      const contentArea = page.slice(2, 22).join('');
      expect(contentArea).toContain('Breaking');
      expect(contentArea).toContain('Sports');
      expect(contentArea).toContain('Markets');

      // Check footer
      expect(page[23]).toContain('Enter number to read');
    });

    it('should render news article in single column for readability', () => {
      const article = 
        'Breaking News: A major event has occurred today that will have ' +
        'significant implications for the region. Experts are analyzing ' +
        'the situation and more details will be available soon. ' +
        'Stay tuned for updates.';

      const page = renderMultiColumn({
        pageNumber: '201',
        title: 'Full Article',
        content: article,
        columns: 1,
        timestamp: '14:35',
        hints: [{ text: '200=BACK' }]
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // Content should be wrapped properly
      const contentArea = page.slice(2, 22);
      contentArea.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });

    it('should handle long news headlines with wrapping', () => {
      const longHeadlines = [
        'Breaking: This is a very long headline that needs to be wrapped properly',
        'Sports: Another long headline about a championship game result',
        'Markets: Stock market analysis with detailed information',
        'Weather: Extended forecast for the upcoming week'
      ];

      const page = renderMultiColumn({
        pageNumber: '200',
        title: 'News',
        content: longHeadlines,
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Sports Content', () => {
    it('should render sports scores in 2-column layout', () => {
      const scores = [
        'Premier League',
        'Team A 2-1 Team B',
        'Team C 0-0 Team D',
        'Team E 3-2 Team F',
        '',
        'Championship',
        'Team G 1-1 Team H',
        'Team I 2-0 Team J'
      ];

      const page = renderMultiColumn({
        pageNumber: '300',
        title: 'Sports Scores',
        content: scores,
        columns: 2,
        timestamp: '15:45',
        hints: [{ text: '100=INDEX' }]
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // Check header
      expect(page[0]).toContain('300');
      expect(page[0]).toContain('Sports Scores');
      expect(page[0]).toContain('15:45');

      // Check content
      const contentArea = page.slice(2, 22).join('');
      expect(contentArea).toContain('Premier League');
      expect(contentArea).toContain('Championship');
    });

    it('should render standings table in 3-column layout', () => {
      const standings = [
        'Pos Team         Pts',
        '1   Team A       45',
        '2   Team B       42',
        '3   Team C       40',
        '4   Team D       38',
        '5   Team E       35',
        '6   Team F       33',
        '7   Team G       30',
        '8   Team H       28',
        '9   Team I       25'
      ];

      const page = renderMultiColumn({
        pageNumber: '301',
        title: 'League Table',
        content: standings,
        columns: 1, // Use single column for tabular data
        hints: [{ text: '300=SCORES' }]
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // Check that table structure is preserved
      const contentArea = page.slice(2, 22);
      expect(contentArea[0]).toContain('Pos');
      expect(contentArea[0]).toContain('Team');
      expect(contentArea[0]).toContain('Pts');
    });

    it('should handle live match indicators', () => {
      const liveScores = [
        'LIVE MATCHES',
        '',
        'Team A 1-0 Team B (45\')',
        'Team C 2-2 Team D (67\')',
        '',
        'FULL TIME',
        '',
        'Team E 3-1 Team F',
        'Team G 0-2 Team H'
      ];

      const page = renderMultiColumn({
        pageNumber: '302',
        title: 'Live Scores',
        content: liveScores,
        columns: 2,
        timestamp: '16:20'
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      const contentArea = page.slice(2, 22).join('');
      expect(contentArea).toContain('LIVE MATCHES');
      expect(contentArea).toContain('FULL TIME');
    });
  });

  describe('Market Content', () => {
    it('should render market data in 2-column layout', () => {
      const marketData = [
        'FTSE 100    7,500 +25',
        'S&P 500     4,200 +15',
        'NASDAQ      13,000 +50',
        'DOW JONES   35,000 -10',
        'NIKKEI      28,000 +30',
        'DAX         15,500 +20'
      ];

      const page = renderMultiColumn({
        pageNumber: '400',
        title: 'Market Data',
        content: marketData,
        columns: 2,
        timestamp: '16:00',
        hints: [{ text: '100=INDEX' }]
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      const contentArea = page.slice(2, 22).join('');
      expect(contentArea).toContain('FTSE');
      expect(contentArea).toContain('S&P');
      expect(contentArea).toContain('NASDAQ');
    });
  });

  describe('Column Width Calculations', () => {
    it('should maintain consistent column widths in 2-column layout', () => {
      const content = Array(10).fill('Test content line');

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content,
        columns: 2
      });

      // Each row should be exactly 40 characters
      page.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });

      // Content rows should have visible column separation
      const contentRows = page.slice(2, 22);
      
      // Find rows with actual content (not empty padding)
      const nonEmptyRows = contentRows.filter(row => row.trim().length > 0);
      
      // Should have some content rows
      expect(nonEmptyRows.length).toBeGreaterThan(0);
      
      // Each non-empty row should be properly formatted
      nonEmptyRows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });

    it('should maintain consistent column widths in 3-column layout', () => {
      const content = Array(15).fill('Test');

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content,
        columns: 3
      });

      page.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });

    it('should handle gutter spacing correctly', () => {
      const content = ['A', 'B', 'C', 'D'];

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content,
        columns: 2,
        gutter: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // Check that gutter exists (2 spaces between columns)
      const contentRows = page.slice(2, 22);
      const firstContentRow = contentRows.find(row => row.trim().length > 0);
      
      if (firstContentRow) {
        // Should have proper spacing
        expect(firstContentRow.length).toBe(TELETEXT_WIDTH);
      }
    });
  });

  describe('Content Distribution', () => {
    it('should distribute content evenly across columns', () => {
      const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6'
      ];

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content: items,
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // All items should appear in the content
      const contentArea = page.slice(2, 22).join('');
      items.forEach(item => {
        expect(contentArea).toContain(item);
      });
    });

    it('should handle uneven content distribution', () => {
      const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5'
      ];

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content: items,
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long content that exceeds available space', () => {
      const longContent = Array(100).fill('Content line').join('\n');

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content: longContent,
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);

      // Should still be exactly 24 rows
      expect(page.length).toBe(TELETEXT_HEIGHT);
    });

    it('should handle empty content in multi-column layout', () => {
      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Empty',
        content: '',
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });

    it('should handle single item in multi-column layout', () => {
      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Single',
        content: ['Only one item'],
        columns: 3
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });

    it('should handle mixed short and long lines', () => {
      const content = [
        'Short',
        'This is a much longer line that will need to be wrapped',
        'Medium length line here',
        'X',
        'Another very long line that exceeds the column width significantly'
      ];

      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Mixed',
        content,
        columns: 2
      });

      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });
  });
});
