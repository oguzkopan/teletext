/**
 * Comprehensive Navigation Flow Tests
 * Task 19: Test and fix navigation flows
 * 
 * Tests:
 * - Navigation from index to all major sections
 * - AI page selection and navigation (verify no loops)
 * - Game page selection and quiz flow
 * - Back button from all page types
 * - Invalid page number handling
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 14.1, 14.2, 14.3, 14.4, 14.5
 */

import { NavigationRouter, PageFetcher, FetchPageResult } from '../navigation-router';
import { InputHandler } from '../input-handler';
import { TeletextPage } from '@/types/teletext';

// Helper to create a test page
const createTestPage = (
  id: string,
  options?: {
    title?: string;
    inputMode?: 'single' | 'double' | 'triple';
    inputOptions?: string[];
    links?: Array<{ label: string; targetPage: string; color?: string }>;
    source?: string;
  }
): TeletextPage => {
  return {
    id,
    title: options?.title || `Page ${id}`,
    rows: Array(24).fill('').map(() => ' '.repeat(40)),
    links: options?.links || [],
    meta: {
      source: options?.source || 'Test',
      inputMode: options?.inputMode,
      inputOptions: options?.inputOptions,
      lastUpdated: new Date().toISOString()
    }
  };
};

// Create a comprehensive mock page structure
const createMockPages = (): Record<string, TeletextPage> => {
  return {
    // Index page
    '100': createTestPage('100', {
      title: 'Modern Teletext Index',
      links: [
        { label: 'NEWS', targetPage: '200', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' },
        { label: 'MARKETS', targetPage: '400', color: 'yellow' },
        { label: 'AI', targetPage: '500', color: 'blue' }
      ],
      source: 'StaticAdapter'
    }),

    // News section
    '200': createTestPage('200', {
      title: 'News Headlines',
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: '1', targetPage: '200-1' },
        { label: '2', targetPage: '200-2' },
        { label: '3', targetPage: '200-3' },
        { label: '4', targetPage: '200-4' },
        { label: '5', targetPage: '200-5' }
      ],
      source: 'NewsAdapter'
    }),
    '200-1': createTestPage('200-1', {
      title: 'News Article 1',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      source: 'NewsAdapter'
    }),

    // Sports section
    '300': createTestPage('300', {
      title: 'Sports Scores',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'FOOTBALL', targetPage: '310', color: 'green' },
        { label: 'CRICKET', targetPage: '320', color: 'yellow' }
      ],
      source: 'SportsAdapter'
    }),
    '310': createTestPage('310', {
      title: 'Football Scores',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      source: 'SportsAdapter'
    }),

    // Markets section
    '400': createTestPage('400', {
      title: 'Market Data',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'STOCKS', targetPage: '410', color: 'green' },
        { label: 'CRYPTO', targetPage: '420', color: 'yellow' }
      ],
      source: 'MarketsAdapter'
    }),
    '410': createTestPage('410', {
      title: 'Stock Prices',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' }
      ],
      source: 'MarketsAdapter'
    }),

    // AI section
    '500': createTestPage('500', {
      title: 'AI Oracle Index',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'Q&A', targetPage: '510', color: 'green' },
        { label: 'HISTORY', targetPage: '520', color: 'yellow' }
      ],
      source: 'AIAdapter'
    }),
    '505': createTestPage('505', {
      title: 'Spooky Story Generator',
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5', '6'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: '1', targetPage: '506' },
        { label: '2', targetPage: '507' },
        { label: '3', targetPage: '508' },
        { label: '4', targetPage: '509' },
        { label: '5', targetPage: '520' },
        { label: '6', targetPage: '520' }
      ],
      source: 'AIAdapter'
    }),
    '506': createTestPage('506', {
      title: 'Haunted House Story',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'THEMES', targetPage: '505', color: 'green' },
        { label: 'AI', targetPage: '500', color: 'yellow' }
      ],
      source: 'AIAdapter'
    }),
    '510': createTestPage('510', {
      title: 'Q&A Topic Selection',
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: '1', targetPage: '511' },
        { label: '2', targetPage: '512' },
        { label: '3', targetPage: '513' },
        { label: '4', targetPage: '514' },
        { label: '5', targetPage: '515' }
      ],
      source: 'AIAdapter'
    }),
    '511': createTestPage('511', {
      title: 'News & Current Events Q&A',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TOPICS', targetPage: '510', color: 'green' },
        { label: 'AI', targetPage: '500', color: 'yellow' }
      ],
      source: 'AIAdapter'
    }),

    // Games section
    '600': createTestPage('600', {
      title: 'Games Menu',
      inputMode: 'single',
      inputOptions: ['1', '2', '3'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: '1', targetPage: '601' },
        { label: '2', targetPage: '610' },
        { label: '3', targetPage: '620' }
      ],
      source: 'GamesAdapter'
    }),
    '601': createTestPage('601', {
      title: 'Quiz Game Intro',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'START', targetPage: '602', color: 'yellow' }
      ],
      source: 'GamesAdapter'
    }),
    '602': createTestPage('602', {
      title: 'Quiz Question 1',
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: '1', targetPage: '603' },
        { label: '2', targetPage: '603' },
        { label: '3', targetPage: '603' },
        { label: '4', targetPage: '603' }
      ],
      source: 'GamesAdapter'
    }),
    '603': createTestPage('603', {
      title: 'Quiz Question 2',
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4'],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: '1', targetPage: '604' },
        { label: '2', targetPage: '604' },
        { label: '3', targetPage: '604' },
        { label: '4', targetPage: '604' }
      ],
      source: 'GamesAdapter'
    }),
    '604': createTestPage('604', {
      title: 'Quiz Results',
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GAMES', targetPage: '600', color: 'green' },
        { label: 'RETRY', targetPage: '601', color: 'yellow' }
      ],
      source: 'GamesAdapter'
    })
  };
};

describe('Navigation Flows - Task 19', () => {
  let router: NavigationRouter;
  let inputHandler: InputHandler;
  let pages: Record<string, TeletextPage>;
  let navigations: string[];
  let errors: string[];

  beforeEach(() => {
    pages = createMockPages();
    navigations = [];
    errors = [];

    const pageFetcher: PageFetcher = async (pageId: string): Promise<FetchPageResult> => {
      const page = pages[pageId];
      if (!page) {
        return { page: null, fromCache: false };
      }
      return { page, fromCache: false };
    };

    router = new NavigationRouter(pageFetcher, pages['100']);
    inputHandler = new InputHandler(router, {
      onNavigate: (pageId) => navigations.push(pageId),
      onError: (error) => errors.push(error)
    });
  });

  describe('Navigation from index to all major sections', () => {
    it('should navigate from index (100) to news (200)', async () => {
      expect(router.getCurrentPage()?.id).toBe('100');

      // Type 200
      await inputHandler.handleDigitInput(2);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('200');
      expect(navigations).toContain('200');
    });

    it('should navigate from index (100) to sports (300)', async () => {
      expect(router.getCurrentPage()?.id).toBe('100');

      // Type 300
      await inputHandler.handleDigitInput(3);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('300');
      expect(navigations).toContain('300');
    });

    it('should navigate from index (100) to markets (400)', async () => {
      expect(router.getCurrentPage()?.id).toBe('100');

      // Type 400
      await inputHandler.handleDigitInput(4);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('400');
      expect(navigations).toContain('400');
    });

    it('should navigate from index (100) to AI (500)', async () => {
      expect(router.getCurrentPage()?.id).toBe('100');

      // Type 500
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('500');
      expect(navigations).toContain('500');
    });

    it('should navigate from index (100) to games (600)', async () => {
      expect(router.getCurrentPage()?.id).toBe('100');

      // Type 600
      await inputHandler.handleDigitInput(6);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('600');
      expect(navigations).toContain('600');
    });
  });

  describe('AI page selection and navigation (verify no loops)', () => {
    it('should navigate to AI index and then to spooky stories', async () => {
      // Navigate to AI index
      await router.navigateToPage('500');
      expect(router.getCurrentPage()?.id).toBe('500');

      // Type 505 to go to spooky stories
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(5);

      expect(router.getCurrentPage()?.id).toBe('505');
      expect(navigations).toContain('505');
    });

    it('should use single-digit navigation on spooky story menu', async () => {
      // Navigate to spooky stories
      await router.navigateToPage('505');
      expect(router.getCurrentPage()?.id).toBe('505');

      // Verify input mode is single
      const inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // Press 1 for Haunted House
      await inputHandler.handleDigitInput(1);

      // Should navigate immediately to 506
      expect(router.getCurrentPage()?.id).toBe('506');
      expect(navigations).toContain('506');
    });

    it('should NOT cause page refresh loops on AI pages', async () => {
      // Navigate to spooky stories
      await router.navigateToPage('505');
      const page505 = router.getCurrentPage();

      // Press 1 to navigate to theme page
      await inputHandler.handleDigitInput(1);

      // Should be on different page (506), not 505
      expect(router.getCurrentPage()?.id).toBe('506');
      expect(router.getCurrentPage()?.id).not.toBe('505');

      // Verify no self-referencing links on page 505
      const selfLink = page505?.links.find(link => link.targetPage === '505');
      expect(selfLink).toBeUndefined();
    });

    it('should navigate to Q&A and use single-digit selection', async () => {
      // Navigate to AI index
      await router.navigateToPage('500');

      // Navigate to Q&A (510)
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(1);
      await inputHandler.handleDigitInput(0);

      expect(router.getCurrentPage()?.id).toBe('510');

      // Verify input mode is single
      const inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // Press 1 for News & Current Events
      await inputHandler.handleDigitInput(1);

      // Should navigate immediately to 511
      expect(router.getCurrentPage()?.id).toBe('511');
      expect(navigations).toContain('511');
    });

    it('should NOT cause page refresh loops on Q&A pages', async () => {
      // Navigate to Q&A
      await router.navigateToPage('510');
      const page510 = router.getCurrentPage();

      // Press 1 to navigate to topic page
      await inputHandler.handleDigitInput(1);

      // Should be on different page (511), not 510
      expect(router.getCurrentPage()?.id).toBe('511');
      expect(router.getCurrentPage()?.id).not.toBe('510');

      // Verify no self-referencing links on page 510
      const selfLink = page510?.links.find(link => link.targetPage === '510');
      expect(selfLink).toBeUndefined();
    });

    it('should show error for invalid AI page option', async () => {
      // Navigate to spooky stories
      await router.navigateToPage('505');

      // Press 9 (invalid option)
      await inputHandler.handleDigitInput(9);

      // Should show error
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid option');

      // Should stay on same page
      expect(router.getCurrentPage()?.id).toBe('505');
    });
  });

  describe('Game page selection and quiz flow', () => {
    it('should navigate to games menu and select quiz', async () => {
      // Navigate to games menu
      await router.navigateToPage('600');
      expect(router.getCurrentPage()?.id).toBe('600');

      // Verify input mode is single
      const inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // Press 1 for quiz
      await inputHandler.handleDigitInput(1);

      // Should navigate to quiz intro (601)
      expect(router.getCurrentPage()?.id).toBe('601');
      expect(navigations).toContain('601');
    });

    it('should complete quiz flow with single-digit answers', async () => {
      // Navigate to quiz intro
      await router.navigateToPage('601');

      // Navigate to first question (602)
      await router.navigateToPage('602');
      expect(router.getCurrentPage()?.id).toBe('602');

      // Verify input mode is single
      let inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // Answer question 1 (press 1)
      await inputHandler.handleDigitInput(1);

      // Should navigate to question 2 (603)
      expect(router.getCurrentPage()?.id).toBe('603');

      // Verify input mode is still single
      inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // Answer question 2 (press 2)
      await inputHandler.handleDigitInput(2);

      // Should navigate to results (604)
      expect(router.getCurrentPage()?.id).toBe('604');
    });

    it('should maintain quiz state across page transitions', async () => {
      // Navigate through quiz
      await router.navigateToPage('602');
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('603');

      // Verify history includes quiz pages
      const history = router.getNavigationHistory();
      expect(history).toContain('602');
      expect(history).toContain('603');
    });

    it('should show error for invalid quiz answer option', async () => {
      // Navigate to quiz question
      await router.navigateToPage('602');

      // Press 9 (invalid option, only 1-4 are valid)
      await inputHandler.handleDigitInput(9);

      // Should show error
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid option');

      // Should stay on same page
      expect(router.getCurrentPage()?.id).toBe('602');
    });
  });

  describe('Back button from all page types', () => {
    it('should go back from news page to index', async () => {
      // Navigate to news
      await router.navigateToPage('200');
      expect(router.getCurrentPage()?.id).toBe('200');

      // Go back
      await router.navigateBack();

      // Should be at index
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should go back from news article to news headlines', async () => {
      // Navigate to news
      await router.navigateToPage('200');

      // Navigate to article
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('200-1');

      // Go back
      await router.navigateBack();

      // Should be at news headlines
      expect(router.getCurrentPage()?.id).toBe('200');
    });

    it('should go back from sports sub-page to sports index', async () => {
      // Navigate to sports
      await router.navigateToPage('300');

      // Navigate to football
      await router.navigateToPage('310');
      expect(router.getCurrentPage()?.id).toBe('310');

      // Go back
      await router.navigateBack();

      // Should be at sports index
      expect(router.getCurrentPage()?.id).toBe('300');
    });

    it('should go back from AI theme page to AI menu', async () => {
      // Navigate to spooky stories
      await router.navigateToPage('505');

      // Navigate to theme
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('506');

      // Go back
      await router.navigateBack();

      // Should be at spooky stories menu
      expect(router.getCurrentPage()?.id).toBe('505');
    });

    it('should go back from quiz question to quiz intro', async () => {
      // Navigate to quiz intro
      await router.navigateToPage('601');

      // Navigate to first question
      await router.navigateToPage('602');
      expect(router.getCurrentPage()?.id).toBe('602');

      // Go back
      await router.navigateBack();

      // Should be at quiz intro
      expect(router.getCurrentPage()?.id).toBe('601');
    });

    it('should go back through multiple pages', async () => {
      // Navigate: 100 -> 200 -> 200-1
      await router.navigateToPage('200');
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('200-1');

      // Go back to 200
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('200');

      // Go back to 100
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should not go back when at beginning of history', async () => {
      // Already at index (100)
      expect(router.getCurrentPage()?.id).toBe('100');
      expect(router.canGoBack()).toBe(false);

      // Try to go back
      await router.navigateBack();

      // Should still be at index
      expect(router.getCurrentPage()?.id).toBe('100');
    });
  });

  describe('Invalid page number handling', () => {
    it('should reject page numbers below 100', async () => {
      await expect(router.navigateToPage('99')).rejects.toThrow();
      expect(router.getError()).toContain('Invalid page number');

      // Should remain on current page
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should reject page numbers above 899', async () => {
      await expect(router.navigateToPage('900')).rejects.toThrow();
      expect(router.getError()).toContain('Invalid page number');

      // Should remain on current page
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should reject non-numeric page numbers', async () => {
      await expect(router.navigateToPage('abc')).rejects.toThrow();
      expect(router.getError()).toContain('Invalid page number');

      // Should remain on current page
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should handle page not found errors', async () => {
      // Try to navigate to page that doesn't exist
      await expect(router.navigateToPage('777')).rejects.toThrow();
      expect(router.getError()).toContain('not found');

      // Should remain on current page
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should provide recovery instructions for invalid pages', async () => {
      try {
        await router.navigateToPage('99');
      } catch (error) {
        // Expected
      }

      const errorMsg = router.getError();
      expect(errorMsg).toContain('100');
      expect(errorMsg).toContain('899');
    });

    it('should provide recovery instructions for missing pages', async () => {
      try {
        await router.navigateToPage('777');
      } catch (error) {
        // Expected
      }

      const errorMsg = router.getError();
      expect(errorMsg).toContain('not found');
      expect(errorMsg).toContain('100');
    });

    it('should clear errors after successful navigation', async () => {
      // Cause an error
      try {
        await router.navigateToPage('99');
      } catch (error) {
        // Expected
      }

      expect(router.getError()).not.toBeNull();

      // Navigate successfully
      await router.navigateToPage('200');

      // Error should be cleared
      expect(router.getError()).toBeNull();
    });
  });

  describe('Complete user flows', () => {
    it('should complete: Index -> News -> Article -> Back -> Index', async () => {
      // Start at index
      expect(router.getCurrentPage()?.id).toBe('100');

      // Navigate to news
      await inputHandler.handleDigitInput(2);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      expect(router.getCurrentPage()?.id).toBe('200');

      // Navigate to article
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('200-1');

      // Go back to news
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('200');

      // Go back to index
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should complete: Index -> AI -> Spooky -> Theme -> Back -> Back -> Index', async () => {
      // Start at index
      expect(router.getCurrentPage()?.id).toBe('100');

      // Navigate to AI
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      expect(router.getCurrentPage()?.id).toBe('500');

      // Navigate to spooky stories
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(5);
      expect(router.getCurrentPage()?.id).toBe('505');

      // Select theme
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('506');

      // Go back to spooky stories
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('505');

      // Go back to AI index
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('500');

      // Go back to main index
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should complete: Index -> Games -> Quiz -> Q1 -> Q2 -> Results', async () => {
      // Start at index
      expect(router.getCurrentPage()?.id).toBe('100');

      // Navigate to games
      await inputHandler.handleDigitInput(6);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(0);
      expect(router.getCurrentPage()?.id).toBe('600');

      // Select quiz
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('601');

      // Start quiz
      await router.navigateToPage('602');
      expect(router.getCurrentPage()?.id).toBe('602');

      // Answer Q1
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('603');

      // Answer Q2
      await inputHandler.handleDigitInput(2);
      expect(router.getCurrentPage()?.id).toBe('604');
    });
  });
});
