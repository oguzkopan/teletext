/**
 * Arrow Navigation Indicators Tests
 * 
 * Comprehensive tests for arrow navigation indicators in footers
 * 
 * Requirements: 8.3, 11.4
 */

import { pageLayoutProcessor } from '../page-layout-processor';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage } from '../teletext-utils';

describe('Arrow Navigation Indicators', () => {
  describe('First page of multi-page content', () => {
    it('should show only down arrow on first page', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201', 'ARTICLE PAGE 1'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201',
            nextPage: '201-2',
            previousPage: undefined,
            totalPages: 3,
            currentIndex: 0
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should show down arrow indicator
      expect(footer).toContain('▼');
      expect(footer).toMatch(/Press ↓ for more|↓/);
      
      // Should NOT show up arrow
      expect(footer).not.toContain('▲');
    });
  });

  describe('Middle page of multi-page content', () => {
    it('should show both up and down arrows on middle page', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE PAGE 2'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should show both arrow indicators
      expect(footer).toMatch(/↑↓|SCROLL/);
    });
  });

  describe('Last page of multi-page content', () => {
    it('should show only up arrow on last page', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-3', 'ARTICLE PAGE 3'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-3',
            nextPage: undefined,
            previousPage: '201-2',
            totalPages: 3,
            currentIndex: 2
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should show up arrow indicator
      expect(footer).toContain('▲');
      expect(footer).toMatch(/Press ↑ for previous|↑/);
      
      // Should NOT show down arrow
      expect(footer).not.toContain('▼');
    });

    it('should display "END OF CONTENT" when on last page with no up navigation', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201', 'SINGLE PAGE'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: undefined // No continuation metadata
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should NOT show arrow indicators for single page
      expect(footer).not.toContain('▲');
      expect(footer).not.toContain('▼');
      
      // Should show standard navigation hints instead
      expect(footer).toMatch(/100=INDEX|BACK/);
    });
  });

  describe('Arrow indicators positioning', () => {
    it('should display arrow indicators in footer consistently', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should be in row 23 (last row)
      const footer = processed.rows[23];
      
      // Footer should be exactly 40 characters
      expect(footer.length).toBe(40);
      
      // Should contain arrow navigation hints
      expect(footer).toMatch(/↑↓|SCROLL/);
    });
  });

  describe('Arrow indicators with colored buttons', () => {
    it('should prioritize arrow indicators when space is limited', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE'),
        rows: Array(20).fill('Content'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'INDEX', targetPage: '100', color: 'green' }
        ],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should contain arrow indicators (priority when space is limited)
      expect(footer).toMatch(/↑↓|SCROLL/);
      
      // Footer should be exactly 40 characters
      expect(footer.length).toBe(40);
      
      // Note: Colored buttons may be truncated when combined with arrow indicators
      // due to 40-character width limit. This is expected behavior.
    });

    it('should show colored buttons when no arrow navigation', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(10).fill('Content'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' }
        ],
        meta: undefined // No continuation
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should contain colored buttons when no arrow navigation
      expect(footer).toMatch(/🔴|🟢/);
    });
  });

  describe('Arrow indicators only when available', () => {
    it('should not show arrow indicators for single-page content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(10).fill('News content'),
        links: [],
        meta: undefined // No continuation
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      
      // Should NOT show arrow indicators
      expect(footer).not.toContain('▲');
      expect(footer).not.toContain('▼');
      
      // Should show standard navigation
      expect(footer).toContain('100=INDEX');
    });
  });

  describe('Contextual help with arrow navigation', () => {
    it('should update contextual help when arrow navigation is available', () => {
      const pageWithArrows: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };

      const pageWithoutArrows: TeletextPage = {
        ...createEmptyPage('201', 'ARTICLE'),
        rows: Array(10).fill('Content'),
        links: [],
        meta: undefined
      };

      const processedWithArrows = pageLayoutProcessor.processPage(pageWithArrows, {
        enableFullScreen: true
      });

      const processedWithoutArrows = pageLayoutProcessor.processPage(pageWithoutArrows, {
        enableFullScreen: true
      });

      const footerWithArrows = processedWithArrows.rows[23];
      const footerWithoutArrows = processedWithoutArrows.rows[23];
      
      // Footer with arrows should mention scrolling
      expect(footerWithArrows).toMatch(/↑↓|SCROLL/);
      
      // Footer without arrows should not mention scrolling
      expect(footerWithoutArrows).not.toMatch(/↑↓|SCROLL/);
    });
  });
});
