/**
 * Tests for Navigation Hints System
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { TeletextPage } from '@/types/teletext';
import {
  generateNavigationHints,
  generateSelectionHints,
  generateContentHints,
  generateAIHints,
  generateQuizHints,
  generateErrorHints,
  generateIndexHints
} from '../navigation-hints';

describe('Navigation Hints System', () => {
  describe('generateNavigationHints', () => {
    it('should generate hints for selection pages with single-digit input', () => {
      // Requirement 13.2: For selection pages: "Enter number to select"
      const page: TeletextPage = {
        id: '500',
        title: 'AI Topics',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' },
          { label: '3', targetPage: '503' }
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      const hints = generateNavigationHints(page, false);

      expect(hints).toContainEqual({ text: 'Enter number to select' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should generate hints for content pages', () => {
      // Requirement 13.3: For content pages: "100=INDEX BACK=PREVIOUS"
      const page: TeletextPage = {
        id: '201',
        title: 'News Article',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, true);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });

    it('should generate hints for pages with colored buttons', () => {
      // Requirement 13.4: For pages with colored buttons: show colored button hints
      const page: TeletextPage = {
        id: '300',
        title: 'Sports',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: 'SCORES', targetPage: '301', color: 'red' },
          { label: 'TABLES', targetPage: '302', color: 'green' },
          { label: 'FIXTURES', targetPage: '303', color: 'yellow' }
        ]
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.some(h => h.text.includes('RED=SCORES'))).toBe(true);
      expect(hints.some(h => h.text.includes('GREEN=TABLES'))).toBe(true);
      expect(hints.some(h => h.text.includes('YELLOW=FIXTURES'))).toBe(true);
    });

    it('should use custom hints when provided', () => {
      // Requirement 13.5: Update hints based on current page context
      const page: TeletextPage = {
        id: '400',
        title: 'Custom Page',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          customHints: ['CUSTOM HINT 1', 'CUSTOM HINT 2']
        }
      };

      const hints = generateNavigationHints(page, false);

      expect(hints).toHaveLength(2);
      expect(hints).toContainEqual({ text: 'CUSTOM HINT 1' });
      expect(hints).toContainEqual({ text: 'CUSTOM HINT 2' });
    });

    it('should not show INDEX hint on index page', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.every(h => !h.text.includes('100=INDEX'))).toBe(true);
    });

    it('should not show BACK hint when canGoBack is false', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.every(h => !h.text.includes('BACK'))).toBe(true);
    });

    it('should show loading hint for AI pages', () => {
      const page: TeletextPage = {
        id: '505',
        title: 'AI Response',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          loading: true
        }
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.some(h => h.text.includes('Generating response'))).toBe(true);
    });

    it('should show progress for quiz pages', () => {
      const page: TeletextPage = {
        id: '601',
        title: 'Quiz Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          progress: {
            current: 3,
            total: 10
          }
        }
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.some(h => h.text.includes('Question 3/10'))).toBe(true);
    });

    it('should show navigation hint for settings pages', () => {
      const page: TeletextPage = {
        id: '800',
        title: 'Settings',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          settingsPage: true
        }
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.some(h => h.text.includes('Use arrows to navigate'))).toBe(true);
    });

    it('should provide default hint when no specific context', () => {
      // Requirement 13.1: Display navigation hints in footer
      const page: TeletextPage = {
        id: '999',
        title: 'Unknown Page',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.length).toBeGreaterThan(0);
      expect(hints.some(h => h.text.includes('100=INDEX') || h.text.includes('Enter page number'))).toBe(true);
    });

    it('should handle pages with multiple colored buttons of same color', () => {
      const page: TeletextPage = {
        id: '300',
        title: 'Sports',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: 'FOOTBALL', targetPage: '301', color: 'red' },
          { label: 'CRICKET', targetPage: '302', color: 'red' },
          { label: 'TENNIS', targetPage: '303', color: 'green' }
        ]
      };

      const hints = generateNavigationHints(page, false);

      expect(hints.some(h => h.text.includes('RED=FOOTBALL/CRICKET'))).toBe(true);
      expect(hints.some(h => h.text.includes('GREEN=TENNIS'))).toBe(true);
    });
  });

  describe('generateSelectionHints', () => {
    it('should generate hints for selection with valid option count', () => {
      const hints = generateSelectionHints(5);

      expect(hints).toContainEqual({ text: 'Enter number to select' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should handle edge case with 1 option', () => {
      const hints = generateSelectionHints(1);

      expect(hints).toContainEqual({ text: 'Enter number to select' });
    });

    it('should handle edge case with 9 options', () => {
      const hints = generateSelectionHints(9);

      expect(hints).toContainEqual({ text: 'Enter number to select' });
    });

    it('should not show selection hint for 0 options', () => {
      const hints = generateSelectionHints(0);

      expect(hints.every(h => !h.text.includes('Enter number to select'))).toBe(true);
      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should not show selection hint for more than 9 options', () => {
      const hints = generateSelectionHints(10);

      expect(hints.every(h => !h.text.includes('Enter number to select'))).toBe(true);
    });
  });

  describe('generateContentHints', () => {
    it('should generate basic content hints', () => {
      const hints = generateContentHints(false, false);

      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should include BACK hint when available', () => {
      const hints = generateContentHints(true, false);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });

    it('should include NEXT hint when more pages available', () => {
      const hints = generateContentHints(false, true);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'NEXT=Continue' });
    });

    it('should include both BACK and NEXT when applicable', () => {
      const hints = generateContentHints(true, true);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
      expect(hints).toContainEqual({ text: 'NEXT=Continue' });
    });
  });

  describe('generateAIHints', () => {
    it('should generate basic AI hints', () => {
      const hints = generateAIHints(false, false);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: '500=AI' });
    });

    it('should show loading hint when generating', () => {
      const hints = generateAIHints(true, false);

      expect(hints).toContainEqual({ text: 'Generating response...' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: '500=AI' });
    });

    it('should include BACK hint when available', () => {
      const hints = generateAIHints(false, true);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: '500=AI' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });
  });

  describe('generateQuizHints', () => {
    it('should generate basic quiz hints', () => {
      const hints = generateQuizHints(undefined, undefined, false);

      expect(hints).toContainEqual({ text: 'Enter 1-4 to answer' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should show question progress when provided', () => {
      const hints = generateQuizHints(3, 10, false);

      expect(hints).toContainEqual({ text: 'Question 3/10' });
      expect(hints).toContainEqual({ text: 'Enter 1-4 to answer' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
    });

    it('should include BACK hint when available', () => {
      const hints = generateQuizHints(1, 5, true);

      expect(hints).toContainEqual({ text: 'Question 1/5' });
      expect(hints).toContainEqual({ text: 'Enter 1-4 to answer' });
      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });
  });

  describe('generateErrorHints', () => {
    it('should generate error page hints', () => {
      const hints = generateErrorHints();

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });
  });

  describe('generateIndexHints', () => {
    it('should generate index page hints', () => {
      const hints = generateIndexHints();

      expect(hints).toContainEqual({ text: 'Enter page number to navigate' });
    });
  });

  describe('Context-specific behavior', () => {
    it('should generate different hints for different page types', () => {
      // Requirement 13.5: Update hints based on current page context
      const selectionPage: TeletextPage = {
        id: '500',
        title: 'Selection',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'single', inputOptions: ['1', '2'] }
      };

      const contentPage: TeletextPage = {
        id: '201',
        title: 'Content',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const selectionHints = generateNavigationHints(selectionPage, false);
      const contentHints = generateNavigationHints(contentPage, false);

      // Selection page should have "Enter number to select"
      expect(selectionHints.some(h => h.text.includes('Enter number to select'))).toBe(true);
      
      // Content page should not have "Enter number to select"
      expect(contentHints.every(h => !h.text.includes('Enter number to select'))).toBe(true);
    });

    it('should handle sub-pages correctly', () => {
      const subPage: TeletextPage = {
        id: '201-1',
        title: 'Article 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: []
      };

      const hints = generateNavigationHints(subPage, true);

      expect(hints).toContainEqual({ text: '100=INDEX' });
      expect(hints).toContainEqual({ text: 'BACK=PREVIOUS' });
    });
  });
});
