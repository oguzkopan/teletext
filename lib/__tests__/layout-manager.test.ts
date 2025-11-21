/**
 * Tests for Layout Manager
 * 
 * Validates full-screen utilization, header/footer creation,
 * and layout optimization functionality.
 */

import { LayoutManager } from '../layout-manager';
import { TeletextPage } from '@/types/teletext';

describe('LayoutManager', () => {
  let layoutManager: LayoutManager;

  beforeEach(() => {
    layoutManager = new LayoutManager();
  });

  describe('calculateLayout', () => {
    it('should create a valid 24-row layout', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'News Headlines',
        rows: Array(20).fill('Test content line'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'NewsAPI',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      expect(layout.totalRows).toBe(24);
      expect(layout.header.length).toBe(2);
      expect(layout.footer.length).toBe(2);
      expect(layout.content.length).toBe(20);
    });

    it('should include content type indicator for news pages', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'News',
        rows: Array(20).fill('Content'),
        links: [],
        meta: {}
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      // Header should contain news icon
      expect(layout.header[0]).toContain('📰');
    });

    it('should include page position for multi-page content', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'Article',
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201',
            nextPage: '202',
            previousPage: undefined,
            totalPages: 3,
            currentIndex: 0
          }
        }
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: true
      });

      // Header should contain page position
      expect(layout.header[1]).toContain('1/3');
    });

    it('should include arrow navigation hints for multi-page content', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'Article',
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201',
            nextPage: '202',
            previousPage: undefined,
            totalPages: 2,
            currentIndex: 0
          }
        }
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      // Footer should contain arrow navigation
      expect(layout.footer[1]).toContain('↓=MORE');
    });
  });

  describe('createHeader', () => {
    it('should create header with title and page number', () => {
      const header = layoutManager.createHeader('Test Page', {
        pageNumber: '100',
        title: 'Test Page'
      });

      expect(header.length).toBe(2);
      expect(header[0]).toContain('TEST PAGE');
      expect(header[0]).toContain('P100');
      expect(header[0].length).toBe(40);
      expect(header[1].length).toBe(40);
    });

    it('should include content type icon when provided', () => {
      const header = layoutManager.createHeader('Sports News', {
        pageNumber: '300',
        title: 'Sports News',
        contentType: 'SPORT'
      });

      expect(header[0]).toContain('⚽');
      expect(header[0]).toContain('SPORTS NEWS');
    });

    it('should include page position for multi-page content', () => {
      const header = layoutManager.createHeader('Article', {
        pageNumber: '201',
        title: 'Article',
        pagePosition: { current: 2, total: 5 }
      });

      expect(header[1]).toContain('2/5');
    });

    it('should include timestamp and cache status', () => {
      const timestamp = new Date('2024-01-01T12:30:00Z').toISOString();
      const header = layoutManager.createHeader('News', {
        pageNumber: '200',
        title: 'News',
        timestamp,
        cacheStatus: 'LIVE',
        contentType: 'NEWS' // Required for timestamp display
      });

      expect(header[1]).toContain('LIVE');
    });

    it('should truncate long titles', () => {
      const longTitle = 'This is a very long title that exceeds the available space';
      const header = layoutManager.createHeader(longTitle, {
        pageNumber: '100',
        title: longTitle
      });

      expect(header[0].length).toBe(40);
      expect(header[0]).toContain('...');
    });
  });

  describe('createFooter', () => {
    it('should create footer with back to index hint', () => {
      const footer = layoutManager.createFooter({
        backToIndex: true
      });

      expect(footer.length).toBe(2);
      expect(footer[1]).toContain('100=INDEX');
      expect(footer[0].length).toBe(40);
      expect(footer[1].length).toBe(40);
    });

    it('should include colored button indicators', () => {
      const footer = layoutManager.createFooter({
        backToIndex: true,
        coloredButtons: [
          { color: 'red', label: 'NEWS', page: '200' },
          { color: 'green', label: 'SPORT', page: '300' }
        ]
      });

      expect(footer[1]).toContain('🔴NEWS');
      expect(footer[1]).toContain('🟢SPORT');
    });

    it('should include arrow navigation hints', () => {
      const footer = layoutManager.createFooter({
        backToIndex: false,
        arrowNavigation: {
          up: '200',
          down: '202'
        }
      });

      expect(footer[1]).toContain('↑↓=SCROLL');
    });

    it('should show down arrow only when no up navigation', () => {
      const footer = layoutManager.createFooter({
        backToIndex: false,
        arrowNavigation: {
          down: '202'
        }
      });

      expect(footer[1]).toContain('↓=MORE');
      expect(footer[1]).not.toContain('↑');
    });

    it('should include custom hints', () => {
      const footer = layoutManager.createFooter({
        backToIndex: false,
        customHints: ['ENTER=SELECT', 'ESC=BACK']
      });

      expect(footer[1]).toContain('ENTER=SELECT');
      expect(footer[1]).toContain('ESC=BACK');
    });
  });

  describe('optimizeSpacing', () => {
    it('should pad content to exact row count', () => {
      const content = ['Line 1', 'Line 2', 'Line 3'];
      const optimized = layoutManager.optimizeSpacing(content, 10, 'left');

      expect(optimized.length).toBe(10);
      expect(optimized[0]).toContain('Line 1');
      expect(optimized[1]).toContain('Line 2');
      expect(optimized[2]).toContain('Line 3');
      expect(optimized[9]).toBe(''.padEnd(40));
    });

    it('should truncate content exceeding max rows', () => {
      const content = Array(30).fill('Content line');
      const optimized = layoutManager.optimizeSpacing(content, 20, 'left');

      expect(optimized.length).toBe(20);
    });

    it('should apply left alignment', () => {
      const content = ['Test'];
      const optimized = layoutManager.optimizeSpacing(content, 5, 'left');

      expect(optimized[0]).toBe('Test' + ' '.repeat(36));
    });

    it('should apply center alignment', () => {
      const content = ['Test'];
      const optimized = layoutManager.optimizeSpacing(content, 5, 'center');

      // "Test" centered in 40 chars: 18 spaces, "Test", 18 spaces
      expect(optimized[0].trim()).toBe('Test');
      expect(optimized[0].indexOf('Test')).toBeGreaterThan(15);
    });

    it('should ensure all rows are exactly 40 characters', () => {
      const content = ['Short', 'A bit longer', 'X'];
      const optimized = layoutManager.optimizeSpacing(content, 10, 'left');

      optimized.forEach(row => {
        expect(row.length).toBe(40);
      });
    });
  });

  describe('centerText', () => {
    it('should center text within width', () => {
      const centered = layoutManager.centerText('Hello', 40);
      
      expect(centered.length).toBe(40);
      expect(centered.trim()).toBe('Hello');
      
      // Calculate expected position (centered)
      const expectedStart = Math.floor((40 - 5) / 2);
      expect(centered.indexOf('Hello')).toBe(expectedStart);
    });

    it('should handle text equal to width', () => {
      const text = 'X'.repeat(40);
      const centered = layoutManager.centerText(text, 40);
      
      expect(centered).toBe(text);
    });
  });

  describe('justifyText', () => {
    it('should distribute spaces evenly', () => {
      const justified = layoutManager.justifyText('Hello World Test', 40);
      
      expect(justified.length).toBe(40);
      expect(justified).toContain('Hello');
      expect(justified).toContain('World');
      expect(justified).toContain('Test');
    });

    it('should handle single word', () => {
      const justified = layoutManager.justifyText('Hello', 40);
      
      expect(justified.length).toBe(40);
      expect(justified.startsWith('Hello')).toBe(true);
    });
  });

  describe('validateLayout', () => {
    it('should validate correct layout', () => {
      const layout = {
        header: ['X'.repeat(40), 'Y'.repeat(40)],
        content: Array(20).fill('Z'.repeat(40)),
        footer: ['A'.repeat(40), 'B'.repeat(40)],
        totalRows: 24
      };

      expect(layoutManager.validateLayout(layout)).toBe(true);
    });

    it('should reject layout with wrong total rows', () => {
      const layout = {
        header: ['X'.repeat(40)],
        content: Array(20).fill('Z'.repeat(40)),
        footer: ['A'.repeat(40)],
        totalRows: 22
      };

      expect(layoutManager.validateLayout(layout)).toBe(false);
    });

    it('should reject layout with wrong row count', () => {
      const layout = {
        header: ['X'.repeat(40)],
        content: Array(20).fill('Z'.repeat(40)),
        footer: ['A'.repeat(40)],
        totalRows: 24
      };

      expect(layoutManager.validateLayout(layout)).toBe(false);
    });

    it('should reject layout with wrong row width', () => {
      const layout = {
        header: ['X'.repeat(40), 'Y'.repeat(40)],
        content: Array(20).fill('Z'.repeat(39)), // Wrong width
        footer: ['A'.repeat(40), 'B'.repeat(40)],
        totalRows: 24
      };

      expect(layoutManager.validateLayout(layout)).toBe(false);
    });
  });

  describe('full-screen utilization', () => {
    it('should use all 24 rows with minimal empty rows', () => {
      // Create content that fills most of the 40-character width
      const contentLine = 'This is a full line of content text.';
      const page: TeletextPage = {
        id: '200',
        title: 'Test Page With Content',
        rows: Array(20).fill(contentLine.padEnd(40, ' ')),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'NEWS', targetPage: '200', color: 'green' }
        ],
        meta: {
          source: 'Test',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      // Should use all 24 rows
      expect(layout.totalRows).toBe(24);
      
      // Count rows with actual content (not just whitespace)
      const allRows = [...layout.header, ...layout.content, ...layout.footer];
      const rowsWithContent = allRows.filter(row => row.trim().length > 0).length;
      
      // At least 90% of rows should have content (21.6 rows, so at least 22)
      expect(rowsWithContent).toBeGreaterThanOrEqual(22);
    });

    it('should minimize padding', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'Test',
        rows: Array(20).fill('X'.repeat(40)),
        links: [],
        meta: {}
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      // Count empty rows
      const allRows = [...layout.header, ...layout.content, ...layout.footer];
      const emptyRows = allRows.filter(row => row.trim().length === 0).length;

      // Should have minimal empty rows (less than 10% of 24 = 2.4 rows)
      expect(emptyRows).toBeLessThanOrEqual(2);
    });
  });
});
