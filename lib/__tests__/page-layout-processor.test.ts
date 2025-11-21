/**
 * Tests for Page Layout Processor
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4
 */

import { PageLayoutProcessor } from '../page-layout-processor';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage } from '../teletext-utils';

describe('PageLayoutProcessor', () => {
  let processor: PageLayoutProcessor;

  beforeEach(() => {
    processor = new PageLayoutProcessor();
  });

  describe('processPage', () => {
    it('should process a basic page with full-screen layout', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS HEADLINES'),
        rows: Array(10).fill('Test content line'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '200'],
        enableFullScreen: true
      });

      // Should have exactly 24 rows
      expect(processed.rows).toHaveLength(24);

      // All rows should be exactly 40 characters
      processed.rows.forEach(row => {
        expect(row).toHaveLength(40);
      });

      // First row should contain page title and number
      // Note: Title may include color codes like {red}📰{white}
      expect(processed.rows[0]).toMatch(/NEWS HEADL/); // Truncated due to icon
      expect(processed.rows[0]).toContain('P200');

      // Last row should contain navigation hints
      expect(processed.rows[23]).toContain('100=INDEX');
    });

    it('should include breadcrumbs when provided', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201', 'NEWS ARTICLE'),
        rows: Array(10).fill('Article content'),
        links: []
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '200', '201'],
        enableFullScreen: true
      });

      // Second row should contain breadcrumbs
      expect(processed.rows[1]).toContain('100');
      expect(processed.rows[1]).toContain('200');
      expect(processed.rows[1]).toContain('201');
    });

    it('should include page position for multi-page content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-1', 'ARTICLE PAGE 1'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-1',
            nextPage: '201-2',
            previousPage: undefined,
            totalPages: 3,
            currentIndex: 0
          }
        }
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Should include page position indicator
      expect(processed.rows[1]).toContain('1/3');
    });

    it('should include arrow navigation hints for multi-page content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE PAGE 2'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201-1',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should include arrow navigation hints
      const footer = processed.rows[23];
      expect(footer).toMatch(/↑↓|SCROLL/);
    });

    it('should include colored button indicators', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(10).fill('Content'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'MARKETS', targetPage: '400', color: 'yellow' }
        ]
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should include colored button indicators
      const footer = processed.rows[23];
      expect(footer).toContain('🔴');
      expect(footer).toContain('🟢');
      expect(footer).toContain('🟡');
    });

    it('should include content type indicator for news pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(10).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Header should include news icon
      expect(processed.rows[0]).toContain('📰');
    });

    it('should include content type indicator for sports pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('300', 'SPORT'),
        rows: Array(10).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Header should include sport icon
      expect(processed.rows[0]).toContain('⚽');
    });

    it('should return original page when full-screen is disabled', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(24).fill('Original content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: false
      });

      // Should return original page unchanged
      expect(processed).toEqual(page);
    });

    it('should handle pages with no links', () => {
      const page: TeletextPage = {
        ...createEmptyPage('666', 'SPECIAL PAGE'),
        rows: Array(20).fill('Spooky content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Should still have valid layout
      expect(processed.rows).toHaveLength(24);
      processed.rows.forEach(row => {
        expect(row).toHaveLength(40);
      });
    });

    it('should handle index page (100) without breadcrumbs', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(15).fill('Menu content'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100'],
        enableFullScreen: true
      });

      // Should not show breadcrumbs for index page
      expect(processed.rows[1]).not.toContain('>');
    });

    it('should apply content alignment', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: ['Short line', 'Another short line'],
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true,
        contentAlignment: 'center'
      });

      // Content rows should be centered (rows 2-21)
      const contentRow = processed.rows[2];
      const trimmed = contentRow.trim();
      const leadingSpaces = contentRow.indexOf(trimmed);
      const trailingSpaces = contentRow.length - trimmed.length - leadingSpaces;

      // For centered text, leading and trailing spaces should be roughly equal
      expect(Math.abs(leadingSpaces - trailingSpaces)).toBeLessThanOrEqual(1);
    });
  });
});

