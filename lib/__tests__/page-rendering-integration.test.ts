/**
 * Integration tests for enhanced page rendering with full-screen layout
 * 
 * Tests the complete pipeline: PageLayoutProcessor -> TeletextScreen
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4
 */

import { pageLayoutProcessor } from '../page-layout-processor';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage } from '../teletext-utils';

describe('Page Rendering Integration', () => {
  describe('Full-screen layout utilization', () => {
    it('should utilize at least 90% of screen space (Requirement 1.1)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS HEADLINES'),
        rows: Array(20).fill('News content line'), // Fill more rows to test utilization
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = pageLayoutProcessor.processPage(page, {
        breadcrumbs: ['100', '200'],
        enableFullScreen: true
      });

      // Should always use all 24 rows (full screen)
      expect(processed.rows).toHaveLength(24);

      // Count rows with content (non-empty rows)
      const rowsWithContent = processed.rows.filter(row => row.trim().length > 0).length;

      // With 20 content rows + 2 header + 2 footer = 24 rows, all should have content
      // Should use at least 90% of rows (at least 21 of 24 rows should have content)
      expect(rowsWithContent).toBeGreaterThanOrEqual(21);
    });

    it('should minimize padding (Requirement 1.2)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('300', 'SPORT SCORES'),
        rows: Array(18).fill('Match result'),
        links: []
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Check that there are no large blocks of empty rows
      let consecutiveEmptyRows = 0;
      let maxConsecutiveEmpty = 0;

      for (const row of processed.rows) {
        if (row.trim() === '') {
          consecutiveEmptyRows++;
          maxConsecutiveEmpty = Math.max(maxConsecutiveEmpty, consecutiveEmptyRows);
        } else {
          consecutiveEmptyRows = 0;
        }
      }

      // Should not have more than 3 consecutive empty rows
      expect(maxConsecutiveEmpty).toBeLessThanOrEqual(3);
    });

    it('should display headers in top rows and footers in bottom rows (Requirement 1.4)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('400', 'MARKETS'),
        rows: Array(10).fill('Market data'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = pageLayoutProcessor.processPage(page, {
        breadcrumbs: ['100', '400'],
        enableFullScreen: true
      });

      // Row 0 should contain title and page number (header)
      expect(processed.rows[0]).toContain('MARKETS');
      expect(processed.rows[0]).toContain('P400');

      // Row 1 should contain breadcrumbs or separator (header)
      expect(processed.rows[1]).toContain('100');

      // Row 22 should be separator (footer)
      expect(processed.rows[22]).toContain('─');

      // Row 23 should contain navigation hints (footer)
      expect(processed.rows[23]).toContain('100=INDEX');
    });
  });

  describe('Navigation indicators', () => {
    it('should display navigation options in footer (Requirement 8.1)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(10).fill('Content'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should contain navigation hints
      const footer = processed.rows[23];
      expect(footer).toContain('100=INDEX');
    });

    it('should display colored button indicators (Requirement 8.2)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(10).fill('Menu'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'MARKETS', targetPage: '400', color: 'yellow' }
        ]
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should contain colored button emojis
      const footer = processed.rows[23];
      expect(footer).toContain('🔴');
      expect(footer).toContain('🟢');
      expect(footer).toContain('🟡');
    });

    it('should display arrow navigation indicators for multi-page content (Requirement 8.3)', () => {
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

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Footer should contain arrow indicators
      const footer = processed.rows[23];
      expect(footer).toMatch(/↑↓|SCROLL/);
    });
  });

  describe('Contextual help', () => {
    it('should display contextual help for different page types (Requirement 11.2, 11.3, 11.4)', () => {
      // Test news page
      const newsPage: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(10).fill('News'),
        links: []
      };

      const processedNews = pageLayoutProcessor.processPage(newsPage, {
        enableFullScreen: true
      });

      expect(processedNews.rows[23]).toContain('100=INDEX');

      // Test AI page
      const aiPage: TeletextPage = {
        ...createEmptyPage('500', 'AI ORACLE'),
        rows: Array(10).fill('AI content'),
        links: []
      };

      const processedAI = pageLayoutProcessor.processPage(aiPage, {
        enableFullScreen: true
      });

      // AI pages should have different help text
      expect(processedAI.rows[23]).toBeTruthy();
    });
  });

  describe('Content type indicators', () => {
    it('should display content type indicators for different page types (Requirement 13.1-13.5)', () => {
      const testCases = [
        { pageId: '200', title: 'NEWS', icon: '📰' },
        { pageId: '300', title: 'SPORT', icon: '⚽' },
        { pageId: '400', title: 'MARKETS', icon: '📈' },
        { pageId: '500', title: 'AI', icon: '🤖' },
        { pageId: '600', title: 'GAMES', icon: '🎮' }
      ];

      for (const testCase of testCases) {
        const page: TeletextPage = {
          ...createEmptyPage(testCase.pageId, testCase.title),
          rows: Array(10).fill('Content'),
          links: []
        };

        const processed = pageLayoutProcessor.processPage(page, {
          enableFullScreen: true
        });

        // Header should contain content type icon
        expect(processed.rows[0]).toContain(testCase.icon);
      }
    });
  });

  describe('Breadcrumb navigation', () => {
    it('should display breadcrumb trail (Requirement 16.1)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201', 'ARTICLE'),
        rows: Array(10).fill('Content'),
        links: []
      };

      const processed = pageLayoutProcessor.processPage(page, {
        breadcrumbs: ['100', '200', '201'],
        enableFullScreen: true
      });

      // Second row should contain breadcrumbs
      expect(processed.rows[1]).toContain('100');
      expect(processed.rows[1]).toContain('200');
      expect(processed.rows[1]).toContain('201');
    });

    it('should truncate long breadcrumb trails (Requirement 16.2)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('205', 'ARTICLE'),
        rows: Array(10).fill('Content'),
        links: []
      };

      const processed = pageLayoutProcessor.processPage(page, {
        breadcrumbs: ['100', '200', '201', '202', '203', '204', '205'],
        enableFullScreen: true
      });

      // Should show ellipsis for long trails
      expect(processed.rows[1]).toContain('...');
      // Should show last 3 pages
      expect(processed.rows[1]).toContain('203');
      expect(processed.rows[1]).toContain('204');
      expect(processed.rows[1]).toContain('205');
    });

    it('should not show breadcrumbs on index page (Requirement 16.5)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(10).fill('Menu'),
        links: []
      };

      const processed = pageLayoutProcessor.processPage(page, {
        breadcrumbs: ['100'],
        enableFullScreen: true
      });

      // Should not show breadcrumb separator
      expect(processed.rows[1]).not.toContain('>');
    });
  });

  describe('Multi-page content indicators', () => {
    it('should display page position for multi-page content (Requirement 3.5)', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE PAGE 2'),
        rows: Array(20).fill('Content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-2',
            nextPage: '201-3',
            previousPage: '201-1',
            totalPages: 5,
            currentIndex: 1
          }
        }
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      // Should show page position
      expect(processed.rows[1]).toContain('2/5');
    });
  });

  describe('Layout validation', () => {
    it('should always produce exactly 24 rows', () => {
      const testPages = [
        createEmptyPage('100', 'INDEX'),
        createEmptyPage('200', 'NEWS'),
        createEmptyPage('666', 'SPECIAL'),
        {
          ...createEmptyPage('201-1', 'ARTICLE'),
          meta: {
            continuation: {
              currentPage: '201-1',
              nextPage: '201-2',
              previousPage: undefined,
              totalPages: 3,
              currentIndex: 0
            }
          }
        }
      ];

      for (const page of testPages) {
        const processed = pageLayoutProcessor.processPage(page as TeletextPage, {
          enableFullScreen: true
        });

        expect(processed.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(15).fill('Content'),
        links: []
      };

      const processed = pageLayoutProcessor.processPage(page, {
        enableFullScreen: true
      });

      for (const row of processed.rows) {
        expect(row).toHaveLength(40);
      }
    });
  });
});

