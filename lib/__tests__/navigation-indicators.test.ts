/**
 * Tests for Navigation Indicators Component
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { NavigationIndicators, PageType } from '../navigation-indicators';

describe('NavigationIndicators', () => {
  let indicators: NavigationIndicators;

  beforeEach(() => {
    indicators = new NavigationIndicators();
  });

  describe('renderBreadcrumbs', () => {
    it('should return "INDEX" for empty history', () => {
      expect(indicators.renderBreadcrumbs([])).toBe('INDEX');
    });

    it('should return "INDEX" for history with only page 100', () => {
      expect(indicators.renderBreadcrumbs(['100'])).toBe('INDEX');
    });

    it('should show all pages for history of 3 or fewer', () => {
      expect(indicators.renderBreadcrumbs(['100', '200'])).toBe('100 > 200');
      expect(indicators.renderBreadcrumbs(['100', '200', '201'])).toBe('100 > 200 > 201');
    });

    it('should truncate with ellipsis for history longer than 3', () => {
      const history = ['100', '200', '201', '202'];
      expect(indicators.renderBreadcrumbs(history)).toBe('... > 200 > 201 > 202');
    });

    it('should show last 3 pages for very long history', () => {
      const history = ['100', '200', '201', '202', '203', '204', '205'];
      expect(indicators.renderBreadcrumbs(history)).toBe('... > 203 > 204 > 205');
    });
  });

  describe('renderPagePosition', () => {
    it('should format page position correctly', () => {
      expect(indicators.renderPagePosition(1, 5)).toBe('Page 1/5');
      expect(indicators.renderPagePosition(3, 10)).toBe('Page 3/10');
      expect(indicators.renderPagePosition(10, 10)).toBe('Page 10/10');
    });
  });

  describe('renderArrowIndicators', () => {
    it('should show up arrow when up navigation is available', () => {
      const result = indicators.renderArrowIndicators(true, false);
      expect(result).toContain('▲ Press ↑ for previous');
    });

    it('should show down arrow when down navigation is available', () => {
      const result = indicators.renderArrowIndicators(false, true);
      expect(result).toContain('▼ Press ↓ for more');
    });

    it('should show both arrows when both directions available', () => {
      const result = indicators.renderArrowIndicators(true, true);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('▲ Press ↑ for previous');
      expect(result[1]).toBe('▼ Press ↓ for more');
    });

    it('should show END OF CONTENT when no navigation available', () => {
      const result = indicators.renderArrowIndicators(false, false);
      expect(result).toContain('END OF CONTENT');
    });
  });

  describe('renderInputBuffer', () => {
    it('should show format hint when buffer is empty', () => {
      expect(indicators.renderInputBuffer('', 1)).toBe('Enter digit');
      expect(indicators.renderInputBuffer('', 2)).toBe('Enter 2 digits');
      expect(indicators.renderInputBuffer('', 3)).toBe('Enter 3-digit page');
    });

    it('should show digits with cursor when buffer has content', () => {
      expect(indicators.renderInputBuffer('1', 3)).toBe('1█');
      expect(indicators.renderInputBuffer('12', 3)).toBe('12█');
      expect(indicators.renderInputBuffer('123', 3)).toBe('123█');
    });
  });

  describe('renderContextualHelp', () => {
    it('should return appropriate help for index page without colored buttons', () => {
      const help = indicators.renderContextualHelp('index', false, false);
      expect(help).toContain('Enter page number or use colored buttons');
    });

    it('should return shorter help for index page with colored buttons', () => {
      const help = indicators.renderContextualHelp('index', false, true);
      expect(help).toContain('Enter page number');
      expect(help[0]).not.toContain('or use colored buttons');
    });

    it('should return appropriate help for content page without arrows', () => {
      const help = indicators.renderContextualHelp('content', false);
      expect(help).toContain('100=INDEX  BACK=PREVIOUS');
    });

    it('should return appropriate help for content page with arrows', () => {
      const help = indicators.renderContextualHelp('content', true);
      expect(help).toContain('100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS');
    });

    it('should return appropriate help for AI menu', () => {
      const help = indicators.renderContextualHelp('ai-menu');
      expect(help).toContain('Enter number to select option');
    });

    it('should return appropriate help for quiz', () => {
      const help = indicators.renderContextualHelp('quiz');
      expect(help).toContain('Enter 1-4 to answer');
    });

    it('should return appropriate help for settings', () => {
      const help = indicators.renderContextualHelp('settings');
      expect(help).toContain('Enter number to change setting');
    });

    it('should return default help for unknown page type', () => {
      const help = indicators.renderContextualHelp('unknown' as PageType);
      expect(help).toContain('Press 100 for INDEX');
    });
  });

  describe('formatPageNumber', () => {
    it('should format single digit page numbers consistently', () => {
      expect(indicators.formatPageNumber(1, 'Option One')).toBe('1. Option One');
      expect(indicators.formatPageNumber(5, 'Option Five')).toBe('5. Option Five');
    });

    it('should format double digit page numbers consistently', () => {
      expect(indicators.formatPageNumber(10, 'Option Ten')).toBe('10. Option Ten');
      expect(indicators.formatPageNumber(99, 'Option Ninety-Nine')).toBe('99. Option Ninety-Nine');
    });

    it('should format triple digit page numbers consistently', () => {
      expect(indicators.formatPageNumber(100, 'Index')).toBe('100. Index');
      expect(indicators.formatPageNumber(999, 'Last Page')).toBe('999. Last Page');
    });

    it('should truncate long labels to fit width', () => {
      const longLabel = 'This is a very long label that exceeds the maximum width';
      const result = indicators.formatPageNumber(1, longLabel, 40);
      expect(result.length).toBeLessThanOrEqual(40);
    });

    it('should handle string page numbers', () => {
      expect(indicators.formatPageNumber('200', 'News')).toBe('200. News');
    });
  });

  describe('formatNavigationOptions', () => {
    it('should format multiple options with consistent alignment', () => {
      const options = [
        { page: 1, label: 'First' },
        { page: 10, label: 'Tenth' },
        { page: 100, label: 'Hundredth' }
      ];

      const result = indicators.formatNavigationOptions(options);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('1. First');
      expect(result[1]).toBe('10. Tenth');
      expect(result[2]).toBe('100. Hundredth');
    });

    it('should handle empty options array', () => {
      const result = indicators.formatNavigationOptions([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('createNavigationHint', () => {
    it('should create hint from array of strings', () => {
      const hints = ['100=INDEX', '↑↓=SCROLL'];
      const result = indicators.createNavigationHint(hints);
      
      expect(result).toContain('100=INDEX');
      expect(result).toContain('↑↓=SCROLL');
      expect(result.length).toBe(40);
    });

    it('should add colored button indicators', () => {
      const hints = ['100=INDEX'];
      const buttons = [
        { color: 'red', label: 'NEWS' },
        { color: 'green', label: 'SPORT' }
      ];
      
      const result = indicators.createNavigationHint(hints, buttons);
      
      expect(result).toContain('100=INDEX');
      expect(result).toContain('🔴NEWS');
      expect(result).toContain('🟢SPORT');
      expect(result.length).toBe(40);
    });

    it('should handle only colored buttons without hints', () => {
      const buttons = [
        { color: 'red', label: 'NEWS' },
        { color: 'blue', label: 'AI' }
      ];
      
      const result = indicators.createNavigationHint([], buttons);
      
      expect(result).toContain('🔴NEWS');
      expect(result).toContain('🔵AI');
      expect(result.length).toBe(40);
    });

    it('should truncate if content exceeds max width', () => {
      const hints = ['VERY LONG HINT TEXT', 'ANOTHER LONG HINT', 'MORE TEXT'];
      const buttons = [
        { color: 'red', label: 'NEWS' },
        { color: 'green', label: 'SPORT' },
        { color: 'yellow', label: 'MARKETS' },
        { color: 'blue', label: 'AI' }
      ];
      
      const result = indicators.createNavigationHint(hints, buttons, 40);
      expect(result.length).toBe(40);
    });
  });

  describe('createFooter', () => {
    it('should create footer for index page', () => {
      const footer = indicators.createFooter('index');
      
      expect(footer).toHaveLength(2);
      expect(footer[0]).toBe('─'.repeat(40));
      expect(footer[1]).toContain('Enter page number or use colored buttons');
    });

    it('should create footer for content page with arrow navigation', () => {
      const footer = indicators.createFooter('content', {
        hasArrowNav: true,
        arrowUp: true,
        arrowDown: true
      });
      
      expect(footer).toHaveLength(2);
      expect(footer[1]).toContain('100=INDEX');
      expect(footer[1]).toContain('↑↓=SCROLL');
    });

    it('should create footer with colored buttons', () => {
      const footer = indicators.createFooter('index', {
        coloredButtons: [
          { color: 'red', label: 'NEWS' },
          { color: 'green', label: 'SPORT' }
        ]
      });
      
      expect(footer[1]).toContain('🔴NEWS');
      expect(footer[1]).toContain('🟢SPORT');
    });

    it('should use custom hints when provided', () => {
      const footer = indicators.createFooter('content', {
        customHints: ['CUSTOM HINT 1', 'CUSTOM HINT 2']
      });
      
      expect(footer[1]).toContain('CUSTOM HINT 1');
      expect(footer[1]).toContain('CUSTOM HINT 2');
    });
  });

  describe('createHeader', () => {
    it('should create basic header with title and page number', () => {
      const header = indicators.createHeader('Test Page', '200');
      
      expect(header).toHaveLength(2);
      expect(header[0]).toContain('TEST PAGE');
      expect(header[0]).toContain('P200');
      expect(header[1]).toBe('═'.repeat(40));
    });

    it('should include content type icon when provided', () => {
      const header = indicators.createHeader('News', '200', {
        contentType: 'NEWS'
      });
      
      expect(header[0]).toContain('📰');
      expect(header[0]).toContain('NEWS');
    });

    it('should show breadcrumbs when provided', () => {
      const header = indicators.createHeader('Article', '201', {
        breadcrumbs: ['100', '200', '201']
      });
      
      expect(header[1]).toContain('100 > 200 > 201');
    });

    it('should show page position for multi-page content', () => {
      const header = indicators.createHeader('Long Article', '201', {
        pagePosition: { current: 2, total: 5 }
      });
      
      expect(header[1]).toContain('Page 2/5');
    });

    it('should show timestamp and cache status', () => {
      const timestamp = new Date('2024-01-01T12:30:00Z').toISOString();
      const header = indicators.createHeader('Live News', '200', {
        timestamp,
        cacheStatus: 'LIVE',
        contentType: 'NEWS' // Required for timestamp display
      });
      
      expect(header[1]).toContain('🔴LIVE');
      // Check that a time is present (format will vary by timezone)
      expect(header[1]).toMatch(/\d{2}:\d{2}/);
    });

    it('should prioritize breadcrumbs over other metadata', () => {
      const header = indicators.createHeader('Test', '200', {
        breadcrumbs: ['100', '200'],
        pagePosition: { current: 1, total: 3 },
        timestamp: new Date().toISOString(),
        cacheStatus: 'LIVE'
      });
      
      // Breadcrumbs should be shown, not page position or timestamp
      expect(header[1]).toContain('100 > 200');
      expect(header[1]).not.toContain('Page');
      expect(header[1]).not.toContain('LIVE');
    });
  });

  describe('integration tests', () => {
    it('should create complete page layout with header and footer', () => {
      const header = indicators.createHeader('News Article', '201', {
        contentType: 'NEWS',
        breadcrumbs: ['100', '200', '201']
      });

      const footer = indicators.createFooter('content', {
        hasArrowNav: true,
        arrowDown: true,
        coloredButtons: [
          { color: 'red', label: 'NEWS' },
          { color: 'green', label: 'SPORT' }
        ]
      });

      // Verify header
      expect(header).toHaveLength(2);
      expect(header[0].length).toBe(40);
      expect(header[1].length).toBe(40);

      // Verify footer
      expect(footer).toHaveLength(2);
      expect(footer[0].length).toBe(40);
      expect(footer[1].length).toBe(40);
    });

    it('should handle all page types correctly', () => {
      const pageTypes: PageType[] = ['index', 'content', 'ai-menu', 'quiz', 'settings', 'news', 'sport', 'markets', 'weather', 'games'];

      pageTypes.forEach(pageType => {
        const footer = indicators.createFooter(pageType);
        expect(footer).toHaveLength(2);
        expect(footer[0].length).toBe(40);
        expect(footer[1].length).toBe(40);
      });
    });
  });
});
