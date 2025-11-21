/**
 * Full-Screen Layout Integration Tests
 * 
 * Task 38: Test full-screen layout on all pages
 * 
 * Tests verify:
 * - All pages use at least 90% of screen space
 * - Header and footer positioning on all pages
 * - Breadcrumbs display correctly
 * - Page position indicators on multi-page content
 * - Navigation hints are contextual and helpful
 * - Layout on different content types
 * 
 * Requirements: All layout requirements (1.1, 1.2, 1.3, 1.4, 1.5)
 */

import { PageLayoutProcessor } from '../page-layout-processor';
import { LayoutManager } from '../layout-manager';
import { TeletextPage } from '@/types/teletext';
import { createEmptyPage } from '../teletext-utils';

describe('Full-Screen Layout Integration Tests', () => {
  let processor: PageLayoutProcessor;
  let layoutManager: LayoutManager;

  beforeEach(() => {
    processor = new PageLayoutProcessor();
    layoutManager = new LayoutManager();
  });

  /**
   * Helper function to calculate screen space utilization
   * Returns percentage of rows with content (not just whitespace)
   * Requirement 1.1 states "at least 90% of the 40×24 character grid"
   * which means at least 21.6 rows (90% of 24) should have content
   */
  function calculateScreenUtilization(rows: string[]): number {
    const rowsWithContent = rows.filter(row => row.trim().length > 0).length;
    return (rowsWithContent / rows.length) * 100;
  }

  /**
   * Helper function to count rows with content
   */
  function countContentRows(rows: string[]): number {
    return rows.filter(row => row.trim().length > 0).length;
  }

  describe('Screen Space Utilization (Requirement 1.1)', () => {
    it('should use at least 90% of screen space on news pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS HEADLINES'),
        rows: Array(20).fill('Breaking news story with full content'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'NewsAPI',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '200'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on sports pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('300', 'SPORTS SCORES'),
        rows: Array(18).fill('Team A vs Team B - Live Score 2-1'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'SportsAPI',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '300'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on markets pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('400', 'MARKET DATA'),
        rows: Array(18).fill('BTC/USD $45,000 ▲ +2.5% Volume: 1.2B'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'CoinGecko',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '400'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on AI pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('500', 'AI ASSISTANT'),
        rows: Array(18).fill('How can I help you today? Select option'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '500'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on games pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('600', 'TRIVIA QUIZ'),
        rows: Array(18).fill('Question 1: What is the capital of...'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '600'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on settings pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('700', 'SETTINGS'),
        rows: Array(18).fill('1. Theme Selection - Current: Ceefax'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '700'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on weather pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('450', 'WEATHER FORECAST'),
        rows: Array(18).fill('London: Sunny 22°C Wind: 10mph'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'OpenWeatherMap',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '450'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on dev pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('800', 'DEVELOPER TOOLS'),
        rows: Array(18).fill('API Status: OK Response Time: 45ms'),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '800'],
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });

    it('should use at least 90% of screen space on index page', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'MODERN TELETEXT INDEX'),
        rows: [
          '  WELCOME TO MODERN TELETEXT',
          '  ═══════════════════════════════',
          '  MAIN SECTIONS:',
          '  200 - NEWS HEADLINES',
          '  300 - SPORTS SCORES & FIXTURES',
          '  400 - MARKET DATA & CRYPTO',
          '  450 - WEATHER FORECASTS',
          '  500 - AI ASSISTANT & CHAT',
          '  600 - GAMES & TRIVIA QUIZ',
          '  700 - SETTINGS & PREFERENCES',
          '  800 - DEVELOPER TOOLS',
          '  ───────────────────────────────',
          '  QUICK ACCESS:',
          '  Use colored buttons for shortcuts',
          '  Enter 3-digit page number',
          '  Press BACK to return here',
          '  ───────────────────────────────',
          '  TIPS:',
          '  - Arrow keys scroll long pages',
          '  - Press 100 anytime for index',
          '  - Explore special pages like 666'
        ],
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'MARKETS', targetPage: '400', color: 'yellow' },
          { label: 'AI', targetPage: '500', color: 'blue' }
        ]
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      const utilization = calculateScreenUtilization(processed.rows);
      expect(utilization).toBeGreaterThanOrEqual(90);
    });
  });

  describe('Minimal Padding (Requirement 1.2)', () => {
    it('should minimize empty rows across all page types', () => {
      const pageTypes = [
        { id: '200', title: 'NEWS' },
        { id: '300', title: 'SPORT' },
        { id: '400', title: 'MARKETS' },
        { id: '500', title: 'AI' },
        { id: '600', title: 'GAMES' },
        { id: '700', title: 'SETTINGS' },
        { id: '800', title: 'DEV' }
      ];

      pageTypes.forEach(({ id, title }) => {
        const page: TeletextPage = {
          ...createEmptyPage(id, title),
          rows: Array(18).fill('Content line with text'),
          links: [{ label: 'INDEX', targetPage: '100', color: 'red' }]
        };

        const processed = processor.processPage(page, {
          breadcrumbs: ['100', id],
          enableFullScreen: true
        });

        const emptyRows = processed.rows.filter(row => row.trim().length === 0).length;
        
        // Should have minimal empty rows (less than 10% of 24 = 2.4 rows)
        expect(emptyRows).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('Header and Footer Positioning (Requirements 1.3, 1.4)', () => {
    it('should position header in top rows on all page types', () => {
      const pageTypes = ['200', '300', '400', '500', '600', '700', '800'];

      pageTypes.forEach(pageId => {
        const page: TeletextPage = {
          ...createEmptyPage(pageId, 'TEST PAGE'),
          rows: Array(18).fill('Content'),
          links: []
        };

        const processed = processor.processPage(page, {
          enableFullScreen: true
        });

        // Row 0 should contain title and page number
        expect(processed.rows[0]).toContain('TEST PAGE');
        expect(processed.rows[0]).toContain(`P${pageId}`);

        // Row 1 should be separator or metadata
        expect(processed.rows[1].length).toBe(40);
      });
    });

    it('should position footer in bottom rows on all page types', () => {
      const pageTypes = ['200', '300', '400', '500', '600', '700', '800'];

      pageTypes.forEach(pageId => {
        const page: TeletextPage = {
          ...createEmptyPage(pageId, 'TEST PAGE'),
          rows: Array(18).fill('Content'),
          links: [{ label: 'INDEX', targetPage: '100', color: 'red' }]
        };

        const processed = processor.processPage(page, {
          enableFullScreen: true
        });

        // Row 22 should be separator
        expect(processed.rows[22]).toMatch(/[─═]/);

        // Row 23 should contain navigation hints (either 100=INDEX or contextual hints)
        const footer = processed.rows[23];
        expect(footer.length).toBe(40);
        // Footer should have some navigation content
        expect(footer.trim().length).toBeGreaterThan(0);
      });
    });

    it('should maintain consistent header/footer structure across content types', () => {
      const pages = [
        { id: '200', title: 'NEWS', type: 'NEWS' },
        { id: '300', title: 'SPORT', type: 'SPORT' },
        { id: '400', title: 'MARKETS', type: 'MARKETS' }
      ];

      pages.forEach(({ id, title }) => {
        const page: TeletextPage = {
          ...createEmptyPage(id, title),
          rows: Array(18).fill('Content'),
          links: []
        };

        const processed = processor.processPage(page, {
          enableFullScreen: true
        });

        // All should have 2-row header
        expect(processed.rows[0].length).toBe(40);
        expect(processed.rows[1].length).toBe(40);

        // All should have 2-row footer
        expect(processed.rows[22].length).toBe(40);
        expect(processed.rows[23].length).toBe(40);
      });
    });
  });

  describe('Breadcrumb Display (Requirement 16.1, 16.2)', () => {
    it('should display breadcrumbs correctly on content pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201', 'NEWS ARTICLE'),
        rows: Array(18).fill('Article content'),
        links: []
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100', '200', '201'],
        enableFullScreen: true
      });

      // Should contain breadcrumb trail
      const headerRow = processed.rows[1];
      expect(headerRow).toContain('100');
      expect(headerRow).toContain('200');
      expect(headerRow).toContain('201');
    });

    it('should truncate long breadcrumb trails', () => {
      const page: TeletextPage = {
        ...createEmptyPage('205', 'DEEP PAGE'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const longBreadcrumbs = ['100', '200', '201', '202', '203', '204', '205'];

      const processed = processor.processPage(page, {
        breadcrumbs: longBreadcrumbs,
        enableFullScreen: true
      });

      // Should show truncation indicator
      const headerRow = processed.rows[1];
      expect(headerRow).toContain('...');
    });

    it('should not show breadcrumbs on index page', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(18).fill('Menu content'),
        links: []
      };

      const processed = processor.processPage(page, {
        breadcrumbs: ['100'],
        enableFullScreen: true
      });

      // Should not contain breadcrumb separators
      const headerRow = processed.rows[1];
      expect(headerRow).not.toContain('>');
    });
  });

  describe('Page Position Indicators (Requirement 3.5)', () => {
    it('should display page position on multi-page content', () => {
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

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Should show page position
      expect(processed.rows[1]).toContain('2/5');
    });

    it('should display correct position for first page', () => {
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

      expect(processed.rows[1]).toContain('1/3');
    });

    it('should display correct position for last page', () => {
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

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[1]).toContain('3/3');
    });
  });

  describe('Navigation Hints (Requirements 8.1, 11.1, 11.2, 11.3, 11.4)', () => {
    it('should show contextual hints for index pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(18).fill('Menu'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' }
        ]
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Should show hints appropriate for index
      const footer = processed.rows[23];
      expect(footer.length).toBe(40);
      // Index page should show colored buttons
      expect(footer).toContain('🔴');
    });

    it('should show contextual hints for content pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      // Should show back to index hint
      const footer = processed.rows[23];
      expect(footer).toContain('100=INDEX');
    });

    it('should show arrow navigation hints for multi-page content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('201-2', 'ARTICLE'),
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

      // Should show arrow navigation
      const footer = processed.rows[23];
      expect(footer).toMatch(/↑↓|SCROLL/);
    });

    it('should show colored button hints when available', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(18).fill('Content'),
        links: [
          { label: 'HEADLINES', targetPage: '201', color: 'red' },
          { label: 'BUSINESS', targetPage: '202', color: 'green' }
        ]
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      const footer = processed.rows[23];
      expect(footer).toContain('🔴');
      expect(footer).toContain('🟢');
    });
  });

  describe('Content Type Indicators (Requirement 13.1-13.5)', () => {
    it('should show news icon for news pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('📰');
    });

    it('should show sports icon for sports pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('300', 'SPORT'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('⚽');
    });

    it('should show markets icon for markets pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('400', 'MARKETS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('📈');
    });

    it('should show AI icon for AI pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('500', 'AI'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('🤖');
    });

    it('should show games icon for games pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('600', 'GAMES'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('🎮');
    });

    it('should show weather icon for weather pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('450', 'WEATHER'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('🌤️');
    });

    it('should show settings icon for settings pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('700', 'SETTINGS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('⚙️');
    });

    it('should show dev icon for dev pages', () => {
      const page: TeletextPage = {
        ...createEmptyPage('800', 'DEV'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows[0]).toContain('🔧');
    });
  });

  describe('Layout Validation', () => {
    it('should produce exactly 24 rows for all page types', () => {
      const pageTypes = ['100', '200', '300', '400', '450', '500', '600', '700', '800'];

      pageTypes.forEach(pageId => {
        const page: TeletextPage = {
          ...createEmptyPage(pageId, 'TEST'),
          rows: Array(18).fill('Content'),
          links: []
        };

        const processed = processor.processPage(page, {
          enableFullScreen: true
        });

        expect(processed.rows).toHaveLength(24);
      });
    });

    it('should ensure all rows are exactly 40 characters', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      processed.rows.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should validate layout using LayoutManager', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(18).fill('Content'),
        links: []
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      expect(layoutManager.validateLayout(layout)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle pages with minimal content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: ['Single line of content'],
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows).toHaveLength(24);
      processed.rows.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle pages with maximum content', () => {
      const page: TeletextPage = {
        ...createEmptyPage('200', 'NEWS'),
        rows: Array(50).fill('X'.repeat(40)),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows).toHaveLength(24);
      processed.rows.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle pages with no links', () => {
      const page: TeletextPage = {
        ...createEmptyPage('666', 'SPECIAL'),
        rows: Array(18).fill('Spooky content'),
        links: []
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows).toHaveLength(24);
      expect(layoutManager.validateLayout({
        header: processed.rows.slice(0, 2),
        content: processed.rows.slice(2, 22),
        footer: processed.rows.slice(22, 24),
        totalRows: 24
      })).toBe(true);
    });

    it('should handle pages with many colored buttons', () => {
      const page: TeletextPage = {
        ...createEmptyPage('100', 'INDEX'),
        rows: Array(18).fill('Menu'),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'MARKETS', targetPage: '400', color: 'yellow' },
          { label: 'AI', targetPage: '500', color: 'blue' }
        ]
      };

      const processed = processor.processPage(page, {
        enableFullScreen: true
      });

      expect(processed.rows).toHaveLength(24);
      expect(processed.rows[23].length).toBe(40);
    });
  });
});
