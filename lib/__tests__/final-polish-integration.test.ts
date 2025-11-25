/**
 * Final Polish and Integration Tests
 * Tests complete user flows and verifies all requirements are met
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { NavigationRouter } from '../navigation-router';
import { InputHandler } from '../input-handler';
import * as layoutEngine from '../layout-engine';
import { generateNavigationHints } from '../navigation-hints';
import type { TeletextPage } from '../../types/teletext';

describe('Final Polish - Complete User Flows', () => {
  let navigationRouter: NavigationRouter;
  let inputHandler: InputHandler;

  // Mock page fetcher that returns test pages
  const mockPageFetcher = async (pageId: string) => {
    const mockPages: Record<string, TeletextPage> = {
      '100': {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '200', targetPage: '200' },
          { label: '300', targetPage: '300' },
          { label: '500', targetPage: '500' },
          { label: '600', targetPage: '600' },
        ],
        meta: {},
      },
      '200': {
        id: '200',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '201' },
          { label: '2', targetPage: '202' },
        ],
        meta: {
          contentType: 'news',
          inputMode: 'single',
          inputOptions: ['1', '2'],
        },
      },
      '201': {
        id: '201',
        title: 'News Article 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { contentType: 'news' },
      },
      '500': {
        id: '500',
        title: 'AI Topics',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' },
        ],
        meta: {
          contentType: 'ai',
          inputMode: 'single',
          inputOptions: ['1', '2'],
        },
      },
      '501': {
        id: '501',
        title: 'AI Topic 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { contentType: 'ai' },
      },
      '600': {
        id: '600',
        title: 'Games',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '601' },
          { label: '2', targetPage: '602' },
        ],
        meta: {
          contentType: 'games',
          inputMode: 'single',
          inputOptions: ['1', '2'],
        },
      },
      '601': {
        id: '601',
        title: 'Quiz Question 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '611' },
          { label: '2', targetPage: '611' },
          { label: '3', targetPage: '611' },
          { label: '4', targetPage: '611' },
        ],
        meta: {
          contentType: 'games',
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4'],
        },
      },
      '611': {
        id: '611',
        title: 'Quiz Question 2',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { contentType: 'games' },
      },
      '602': {
        id: '602',
        title: 'Quiz Results',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { contentType: 'games' },
      },
    };

    const page = mockPages[pageId] || null;
    return { page, fromCache: false };
  };

  beforeEach(() => {
    navigationRouter = new NavigationRouter(mockPageFetcher);
    inputHandler = new InputHandler(navigationRouter);
  });

  describe('User Flow: Index → News → Article → Back', () => {
    it('should navigate from index to news section', async () => {
      // Start at index
      await navigationRouter.navigateToPage('100');
      let currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('100');

      // Navigate to news (200)
      await inputHandler.handleDigitInput(2);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      
      currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('200');
      expect(currentPage?.meta?.contentType).toBe('news');
    });

    it('should navigate from news index to specific article', async () => {
      await navigationRouter.navigateToPage('200');
      
      // Select article 1 (should be single-digit navigation)
      await inputHandler.handleDigitInput(1);
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toMatch(/^20[0-9]/);
    });

    it('should navigate back from article to news index', async () => {
      await navigationRouter.navigateToPage('200');
      await inputHandler.handleDigitInput(1);
      
      // Go back
      await navigationRouter.navigateBack();
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('200');
    });

    it('should navigate back from news to index', async () => {
      // Start at index
      await navigationRouter.navigateToPage('100');
      
      // Navigate to news
      await navigationRouter.navigateToPage('200');
      
      // Go back to index
      await navigationRouter.navigateBack();
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('100');
    });
  });

  describe('User Flow: Index → AI → Topic → Question → Response', () => {
    it('should navigate from index to AI section', async () => {
      await navigationRouter.navigateToPage('100');
      
      // Navigate to AI (500)
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('500');
      expect(currentPage?.meta?.contentType).toBe('ai');
    });

    it('should use single-digit navigation on AI selection page', async () => {
      await navigationRouter.navigateToPage('500');
      const currentPage = navigationRouter.getCurrentPage();
      
      // AI selection pages should have single-digit input mode
      const inputMode = navigationRouter.getPageInputMode(currentPage!);
      expect(inputMode).toBe('single');
    });

    it('should navigate to AI topic with single digit', async () => {
      await navigationRouter.navigateToPage('500');
      
      // Select topic 1
      await inputHandler.handleDigitInput(1);
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toMatch(/^50[0-9]/);
    });

    it('should not cause page refresh loops on AI pages', async () => {
      await navigationRouter.navigateToPage('500');
      const initialPage = navigationRouter.getCurrentPage();
      
      // Navigate to a topic
      await inputHandler.handleDigitInput(1);
      const topicPage = navigationRouter.getCurrentPage();
      
      // Verify we actually navigated
      expect(topicPage?.id).not.toBe(initialPage?.id);
      
      // Verify no duplicate navigation
      const history = navigationRouter.getNavigationHistory();
      const lastTwo = history.slice(-2);
      expect(lastTwo[0]).not.toBe(lastTwo[1]);
    });
  });

  describe('User Flow: Index → Games → Quiz → Questions → Results', () => {
    it('should navigate from index to games section', async () => {
      await navigationRouter.navigateToPage('100');
      
      // Navigate to Games (600)
      await inputHandler.handleDigitInput(6);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('600');
      expect(currentPage?.meta?.contentType).toBe('games');
    });

    it('should use single-digit navigation on game selection', async () => {
      await navigationRouter.navigateToPage('600');
      const currentPage = navigationRouter.getCurrentPage();
      
      const inputMode = navigationRouter.getPageInputMode(currentPage!);
      expect(inputMode).toBe('single');
    });

    it('should navigate to quiz with single digit', async () => {
      await navigationRouter.navigateToPage('600');
      
      // Select quiz (option 1)
      await inputHandler.handleDigitInput(1);
      
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toMatch(/^60[0-9]/);
    });

    it('should handle quiz answer selection', async () => {
      await navigationRouter.navigateToPage('601'); // Quiz page
      const quizPage = navigationRouter.getCurrentPage();
      
      // Quiz pages should have single-digit input for answers
      const inputMode = navigationRouter.getPageInputMode(quizPage!);
      expect(inputMode).toBe('single');
      
      // Select answer
      await inputHandler.handleDigitInput(1);
      
      // Should navigate to next question or results
      const nextPage = navigationRouter.getCurrentPage();
      expect(nextPage?.id).not.toBe('601');
    });
  });

  describe('Navigation Hints Verification', () => {
    it('should show correct hints for selection pages', async () => {
      const selectionPage: TeletextPage = {
        id: '500',
        title: 'AI Topics',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' },
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2'],
          contentType: 'ai',
        },
      };

      const hints = generateNavigationHints(selectionPage);
      
      // Should include "Enter number to select"
      const hintText = hints.map(h => h.text).join(' ');
      expect(hintText).toContain('Enter');
      expect(hintText.toLowerCase()).toMatch(/select|number/);
    });

    it('should show correct hints for content pages', async () => {
      const contentPage: TeletextPage = {
        id: '201',
        title: 'News Article',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          contentType: 'news',
        },
      };

      const hints = generateNavigationHints(contentPage, true); // canGoBack = true
      
      // Should include index and back navigation
      const hintText = hints.map(h => h.text).join(' ');
      expect(hintText).toMatch(/100|INDEX/i);
      expect(hintText).toMatch(/BACK|PREVIOUS/i);
    });

    it('should show colored button hints when available', async () => {
      const pageWithButtons: TeletextPage = {
        id: '300',
        title: 'Sports',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: 'RED', targetPage: '301', color: 'red' },
          { label: 'GREEN', targetPage: '302', color: 'green' },
        ],
        meta: {
          contentType: 'sports',
        },
      };

      const hints = generateNavigationHints(pageWithButtons);
      
      // Should include colored button hints
      const redHint = hints.find(h => h.color === 'red');
      const greenHint = hints.find(h => h.color === 'green');
      
      expect(redHint).toBeDefined();
      expect(greenHint).toBeDefined();
    });
  });

  describe('Page Number Alignment Verification', () => {
    it('should left-align all page numbers in navigation options', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '200', targetPage: '200' },
          { label: '300', targetPage: '300' },
          { label: '400', targetPage: '400' },
        ],
        meta: {},
      };

      // Render page with layout engine
      const rendered = layoutEngine.renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: page.links.map(l => `${l.label} Section`).join('\n'),
        hints: [],
      });

      // Check that page numbers are aligned
      const contentRows = rendered.slice(2, -2);
      const pageNumberPositions = contentRows
        .filter(row => /\d{3}/.test(row))
        .map(row => row.search(/\d{3}/));

      // All page numbers should start at the same position
      if (pageNumberPositions.length > 1) {
        const firstPosition = pageNumberPositions[0];
        pageNumberPositions.forEach(pos => {
          expect(pos).toBe(firstPosition);
        });
      }
    });

    it('should display 3-digit page numbers with all digits', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '200', targetPage: '200' },
        ],
        meta: {},
      };

      const rendered = layoutEngine.renderSingleColumn({
        pageNumber: page.id,
        title: page.title,
        content: '200 News',
        hints: [],
      });

      const contentText = rendered.join('');
      expect(contentText).toContain('200');
    });
  });

  describe('Error Recovery', () => {
    it('should handle invalid page numbers gracefully', async () => {
      await navigationRouter.navigateToPage('100');
      
      // Try to navigate to invalid page
      await inputHandler.handleDigitInput(9);
      await inputHandler.handleDigitInput(9);
      await inputHandler.handleDigitInput(9);
      
      // Should remain on current page or show error page
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage).toBeDefined();
      expect(currentPage?.id).not.toBe('999');
    });

    it('should provide way to return to index from error', async () => {
      await navigationRouter.navigateToPage('100');
      
      // Try invalid navigation
      await inputHandler.handleDigitInput(9);
      await inputHandler.handleDigitInput(9);
      await inputHandler.handleDigitInput(9);
      
      // Should be able to navigate back to index
      await navigationRouter.navigateToPage('100');
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('100');
    });

    it('should clear input buffer after navigation', async () => {
      await navigationRouter.navigateToPage('100');
      
      await inputHandler.handleDigitInput(2);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      
      // Buffer should be cleared after navigation
      const buffer = inputHandler.getInputBuffer();
      expect(buffer).toBe('');
    });

    it('should handle back button when no history exists', async () => {
      await navigationRouter.navigateToPage('100');
      
      // Try to go back when at first page
      const canGoBack = navigationRouter.canGoBack();
      expect(canGoBack).toBe(false);
      
      // Should not crash
      await navigationRouter.navigateBack();
      const currentPage = navigationRouter.getCurrentPage();
      expect(currentPage?.id).toBe('100');
    });
  });

  describe('Layout Consistency', () => {
    it('should render all pages with exactly 40 characters per row', () => {
      const testPages = [
        { title: 'News', body: 'Test news content', contentType: 'news' as const },
        { title: 'Sports', body: 'Test sports content', contentType: 'sports' as const },
        { title: 'Markets', body: 'Test market content', contentType: 'markets' as const },
        { title: 'AI', body: 'Test AI content', contentType: 'ai' as const },
      ];

      testPages.forEach(page => {
        const rendered = layoutEngine.renderSingleColumn({
          pageNumber: '100',
          title: page.title,
          content: page.body,
          hints: [],
        });

        rendered.forEach((row, index) => {
          expect(row.length).toBe(40);
        });
      });
    });

    it('should render all pages with exactly 24 rows', () => {
      const testPages = [
        { title: 'News', body: 'Short content' },
        { title: 'Sports', body: 'A'.repeat(1000) }, // Long content
        { title: 'Markets', body: Array(50).fill('Line').join('\n') }, // Many lines
      ];

      testPages.forEach(page => {
        const rendered = layoutEngine.renderSingleColumn({
          pageNumber: '100',
          title: page.title,
          content: page.body,
          hints: [],
        });

        expect(rendered.length).toBe(24);
      });
    });

    it('should display headers consistently across page types', () => {
      const pageTypes = ['news', 'sports', 'markets', 'ai', 'games'] as const;

      pageTypes.forEach(type => {
        const rendered = layoutEngine.renderSingleColumn({
          pageNumber: '100',
          title: `${type.toUpperCase()} Page`,
          content: 'Content',
          hints: [],
        });

        // Header should be in first 2 rows
        const header = rendered.slice(0, 2).join('');
        
        // Should contain page number
        expect(header).toContain('100');
        
        // Should contain title
        expect(header.toUpperCase()).toContain(type.toUpperCase());
      });
    });
  });

  describe('Input Mode Detection', () => {
    it('should detect single-digit mode for AI pages', async () => {
      const aiPage: TeletextPage = {
        id: '500',
        title: 'AI Topics',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' },
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2'],
          contentType: 'ai',
        },
      };

      const inputMode = navigationRouter.getPageInputMode(aiPage);
      expect(inputMode).toBe('single');
    });

    it('should detect single-digit mode for game pages', async () => {
      const gamePage: TeletextPage = {
        id: '600',
        title: 'Games',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '601' },
          { label: '2', targetPage: '602' },
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2'],
          contentType: 'games',
        },
      };

      const inputMode = navigationRouter.getPageInputMode(gamePage);
      expect(inputMode).toBe('single');
    });

    it('should default to triple-digit mode for standard pages', async () => {
      const standardPage: TeletextPage = {
        id: '200',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          contentType: 'news',
        },
      };

      const inputMode = navigationRouter.getPageInputMode(standardPage);
      expect(inputMode).toBe('triple');
    });
  });
});
