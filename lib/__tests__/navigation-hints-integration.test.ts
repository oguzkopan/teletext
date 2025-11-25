/**
 * Integration tests for Navigation Hints with Layout Engine
 * 
 * Tests the complete flow of generating navigation hints and rendering them
 * in page footers using the layout engine.
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { TeletextPage } from '@/types/teletext';
import { generateNavigationHints } from '../navigation-hints';
import { renderSingleColumn, renderMultiColumn, renderFooter } from '../layout-engine';

describe('Navigation Hints Integration', () => {
  describe('Integration with renderSingleColumn', () => {
    it('should render selection page with appropriate hints', () => {
      // Requirement 13.2: For selection pages: "Enter number to select"
      const page: TeletextPage = {
        id: '500',
        title: 'AI Topics',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' }
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2']
        }
      };

      const hints = generateNavigationHints(page, false);
      const rows = renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: 'Select a topic:',
        hints
      });

      expect(rows).toHaveLength(24);
      expect(rows.every(row => row.length === 40)).toBe(true);
      
      // Footer should contain hints
      const footer = rows.slice(-2).join('');
      expect(footer).toContain('Enter number to select');
      expect(footer).toContain('100=INDEX');
    });

    it('should render content page with appropriate hints', () => {
      // Requirement 13.3: For content pages: "100=INDEX BACK=PREVIOUS"
      const page: TeletextPage = {
        id: '201',
        title: 'News Article',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, true);
      const rows = renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: 'This is a news article.',
        hints
      });

      expect(rows).toHaveLength(24);
      
      // Footer should contain hints
      const footer = rows.slice(-2).join('');
      expect(footer).toContain('100=INDEX');
      expect(footer).toContain('BACK=PREVIOUS');
    });

    it('should render page with colored button hints', () => {
      // Requirement 13.4: For pages with colored buttons: show colored button hints
      const page: TeletextPage = {
        id: '300',
        title: 'Sports',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: 'SCORES', targetPage: '301', color: 'red' },
          { label: 'TABLES', targetPage: '302', color: 'green' }
        ]
      };

      const hints = generateNavigationHints(page, false);
      const rows = renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: 'Sports section',
        hints
      });

      expect(rows).toHaveLength(24);
      
      // Footer should contain colored button hints
      const footer = rows.slice(-2).join('');
      expect(footer).toContain('RED=SCORES');
      expect(footer).toContain('GREEN=TABLES');
    });
  });

  describe('Integration with renderMultiColumn', () => {
    it('should render multi-column page with hints', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, false);
      const rows = renderMultiColumn({
        pageNumber: page.id,
        title: page.title,
        content: ['News 200', 'Sports 300', 'Markets 400', 'Weather 700'],
        columns: 2,
        hints
      });

      expect(rows).toHaveLength(24);
      expect(rows.every(row => row.length === 40)).toBe(true);
      
      // Footer should contain hints
      const footer = rows.slice(-2).join('');
      expect(footer).toContain('Enter page number');
    });
  });

  describe('Integration with renderFooter', () => {
    it('should render footer with navigation hints', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, true);
      const footerRows = renderFooter(hints);

      expect(footerRows).toHaveLength(2);
      expect(footerRows.every(row => row.length === 40)).toBe(true);
      
      const footerText = footerRows.join('');
      expect(footerText).toContain('100=INDEX');
      expect(footerText).toContain('BACK=PREVIOUS');
    });

    it('should handle empty hints gracefully', () => {
      const footerRows = renderFooter([]);

      expect(footerRows).toHaveLength(2);
      expect(footerRows.every(row => row.length === 40)).toBe(true);
    });

    it('should handle multiple hints', () => {
      const page: TeletextPage = {
        id: '601',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          progress: { current: 3, total: 10 }
        }
      };

      const hints = generateNavigationHints(page, true);
      const footerRows = renderFooter(hints);

      expect(footerRows).toHaveLength(2);
      
      const footerText = footerRows.join('');
      expect(footerText).toContain('Question 3/10');
      expect(footerText).toContain('100=INDEX');
    });
  });

  describe('Context-aware hint generation', () => {
    it('should generate different hints for AI loading vs ready state', () => {
      const loadingPage: TeletextPage = {
        id: '505',
        title: 'AI Response',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { loading: true }
      };

      const readyPage: TeletextPage = {
        id: '505',
        title: 'AI Response',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const loadingHints = generateNavigationHints(loadingPage, false);
      const readyHints = generateNavigationHints(readyPage, false);

      expect(loadingHints.some(h => h.text.includes('Generating'))).toBe(true);
      expect(readyHints.every(h => !h.text.includes('Generating'))).toBe(true);
    });

    it('should adapt hints based on navigation history', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hintsWithoutBack = generateNavigationHints(page, false);
      const hintsWithBack = generateNavigationHints(page, true);

      expect(hintsWithoutBack.every(h => !h.text.includes('BACK'))).toBe(true);
      expect(hintsWithBack.some(h => h.text.includes('BACK'))).toBe(true);
    });

    it('should use custom hints when specified', () => {
      // Requirement 13.5: Update hints based on current page context
      const page: TeletextPage = {
        id: '800',
        title: 'Settings',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          customHints: ['ENTER=Select', 'ESC=Cancel']
        }
      };

      const hints = generateNavigationHints(page, false);
      const rows = renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: 'Settings page',
        hints
      });

      const footer = rows.slice(-2).join('');
      expect(footer).toContain('ENTER=Select');
      expect(footer).toContain('ESC=Cancel');
      // Should not contain default hints
      expect(footer).not.toContain('100=INDEX');
    });
  });

  describe('Full page rendering with hints', () => {
    it('should render complete page with all components', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '201-1' },
          { label: '2', targetPage: '201-2' }
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2']
        }
      };

      const hints = generateNavigationHints(page, true);
      const rows = renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: [
          '1. First headline',
          '2. Second headline'
        ],
        timestamp: '12:34',
        hints
      });

      // Validate structure
      expect(rows).toHaveLength(24);
      expect(rows.every(row => row.length === 40)).toBe(true);

      // Header should contain page number and title
      expect(rows[0]).toContain('201');
      expect(rows[0]).toContain('Breaking News');
      expect(rows[0]).toContain('12:34');

      // Content should be present
      const content = rows.slice(2, -2).join('');
      expect(content).toContain('First headline');
      expect(content).toContain('Second headline');

      // Footer should contain hints (may be truncated due to 40-char limit)
      const footer = rows.slice(-2).join('');
      expect(footer).toContain('Enter number to select');
      expect(footer).toContain('100=INDEX');
      // Multiple hints may be truncated to fit in 40 characters
      // Just verify the main hints are present
      expect(hints.length).toBeGreaterThan(0);
    });
  });
});
