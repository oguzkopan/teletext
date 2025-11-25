/**
 * Integration tests for AI page navigation
 * Tests the complete navigation flow from index to AI pages
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { NavigationRouter } from '../navigation-router';
import { InputHandler } from '../input-handler';
import { TeletextPage } from '@/types/teletext';

// Mock page fetcher that simulates AI pages
const createMockPageFetcher = () => {
  const pages: Record<string, TeletextPage> = {
    '500': {
      id: '500',
      title: 'AI Oracle Index',
      rows: Array(24).fill('').map((_, i) => ' '.repeat(40)),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'Q&A', targetPage: '510', color: 'green' },
        { label: 'HISTORY', targetPage: '520', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString()
      }
    },
    '505': {
      id: '505',
      title: 'Spooky Story Generator',
      rows: Array(24).fill('').map((_, i) => ' '.repeat(40)),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '500', color: 'yellow' },
        { label: '1', targetPage: '506' },
        { label: '2', targetPage: '507' },
        { label: '3', targetPage: '508' },
        { label: '4', targetPage: '509' },
        { label: '5', targetPage: '520' },
        { label: '6', targetPage: '520' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4', '5', '6']
      }
    },
    '506': {
      id: '506',
      title: 'Haunted House Story',
      rows: Array(24).fill('').map((_, i) => ' '.repeat(40)),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GENERATE', targetPage: '530', color: 'green' },
        { label: 'THEMES', targetPage: '505', color: 'yellow' },
        { label: 'AI', targetPage: '500', color: 'blue' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString()
      }
    },
    '510': {
      id: '510',
      title: 'Q&A Topic Selection',
      rows: Array(24).fill('').map((_, i) => ' '.repeat(40)),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '500', color: 'yellow' },
        { label: '1', targetPage: '511' },
        { label: '2', targetPage: '512' },
        { label: '3', targetPage: '513' },
        { label: '4', targetPage: '514' },
        { label: '5', targetPage: '515' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4', '5']
      }
    },
    '511': {
      id: '511',
      title: 'News & Current Events Q&A',
      rows: Array(24).fill('').map((_, i) => ' '.repeat(40)),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TOPICS', targetPage: '510', color: 'green' },
        { label: 'AI', targetPage: '500', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString()
      }
    }
  };

  return async (pageId: string) => {
    const page = pages[pageId];
    if (!page) {
      return { page: null, fromCache: false };
    }
    return { page, fromCache: false };
  };
};

describe('AI Navigation Integration', () => {
  let router: NavigationRouter;
  let inputHandler: InputHandler;
  let navigations: string[];
  let errors: string[];

  beforeEach(() => {
    navigations = [];
    errors = [];

    const pageFetcher = createMockPageFetcher();
    router = new NavigationRouter(pageFetcher);
    inputHandler = new InputHandler(router, {
      onNavigate: (pageId) => navigations.push(pageId),
      onError: (error) => errors.push(error)
    });
  });

  describe('Spooky Story Navigation', () => {
    it('should navigate from AI index to spooky stories using 3-digit input', async () => {
      // Start at AI index
      await router.navigateToPage('500');
      expect(router.getCurrentPage()?.id).toBe('500');

      // User types "505" to go to spooky stories
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(5);

      // Should navigate to page 505
      expect(navigations).toContain('505');
      expect(router.getCurrentPage()?.id).toBe('505');
    });

    it('should use single-digit navigation on spooky story menu', async () => {
      // Navigate to spooky stories page
      await router.navigateToPage('505');
      expect(router.getCurrentPage()?.id).toBe('505');

      // Verify input mode is single
      const inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // User presses "1" for Haunted House
      await inputHandler.handleDigitInput(1);

      // Should navigate immediately to page 506
      expect(navigations).toContain('506');
      expect(router.getCurrentPage()?.id).toBe('506');
    });

    it('should not refresh the same page repeatedly', async () => {
      // Navigate to spooky stories page
      await router.navigateToPage('505');
      const initialPage = router.getCurrentPage();

      // User presses "1" for Haunted House
      await inputHandler.handleDigitInput(1);

      // Should navigate to different page (506)
      expect(router.getCurrentPage()?.id).toBe('506');
      expect(router.getCurrentPage()?.id).not.toBe('505');
    });

    it('should show error for invalid option on spooky story menu', async () => {
      // Navigate to spooky stories page
      await router.navigateToPage('505');

      // User presses "9" which is not a valid option
      await inputHandler.handleDigitInput(9);

      // Should show error
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid option');

      // Should stay on same page
      expect(router.getCurrentPage()?.id).toBe('505');
    });
  });

  describe('Q&A Navigation', () => {
    it('should navigate from AI index to Q&A using colored button', async () => {
      // Start at AI index
      await router.navigateToPage('500');
      expect(router.getCurrentPage()?.id).toBe('500');

      // User presses green button (Q&A)
      await router.navigateToPage('510');

      expect(router.getCurrentPage()?.id).toBe('510');
    });

    it('should use single-digit navigation on Q&A topic selection', async () => {
      // Navigate to Q&A page
      await router.navigateToPage('510');
      expect(router.getCurrentPage()?.id).toBe('510');

      // Verify input mode is single
      const inputMode = router.getPageInputMode(router.getCurrentPage()!);
      expect(inputMode).toBe('single');

      // User presses "1" for News & Current Events
      await inputHandler.handleDigitInput(1);

      // Should navigate immediately to page 511
      expect(navigations).toContain('511');
      expect(router.getCurrentPage()?.id).toBe('511');
    });

    it('should not refresh the same page repeatedly', async () => {
      // Navigate to Q&A page
      await router.navigateToPage('510');

      // User presses "1" for News & Current Events
      await inputHandler.handleDigitInput(1);

      // Should navigate to different page (511)
      expect(router.getCurrentPage()?.id).toBe('511');
      expect(router.getCurrentPage()?.id).not.toBe('510');
    });

    it('should show error for invalid option on Q&A menu', async () => {
      // Navigate to Q&A page
      await router.navigateToPage('510');

      // User presses "9" which is not a valid option
      await inputHandler.handleDigitInput(9);

      // Should show error
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid option');

      // Should stay on same page
      expect(router.getCurrentPage()?.id).toBe('510');
    });
  });

  describe('Back Navigation', () => {
    it('should allow back navigation from spooky story theme to menu', async () => {
      // Navigate to spooky stories
      await router.navigateToPage('505');

      // Navigate to theme page
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('506');

      // Go back
      await router.navigateBack();

      // Should be back at spooky stories menu
      expect(router.getCurrentPage()?.id).toBe('505');
    });

    it('should allow back navigation from Q&A topic to menu', async () => {
      // Navigate to Q&A
      await router.navigateToPage('510');

      // Navigate to topic page
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('511');

      // Go back
      await router.navigateBack();

      // Should be back at Q&A menu
      expect(router.getCurrentPage()?.id).toBe('510');
    });
  });

  describe('Input Mode Detection', () => {
    it('should detect single-digit mode for page 505', async () => {
      await router.navigateToPage('505');
      const page = router.getCurrentPage()!;
      const inputMode = router.getPageInputMode(page);

      expect(inputMode).toBe('single');
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should detect single-digit mode for page 510', async () => {
      await router.navigateToPage('510');
      const page = router.getCurrentPage()!;
      const inputMode = router.getPageInputMode(page);

      expect(inputMode).toBe('single');
      expect(page.meta?.inputOptions).toEqual(['1', '2', '3', '4', '5']);
    });

    it('should detect triple-digit mode for page 500', async () => {
      await router.navigateToPage('500');
      const page = router.getCurrentPage()!;
      const inputMode = router.getPageInputMode(page);

      expect(inputMode).toBe('triple');
    });

    it('should detect triple-digit mode for page 506', async () => {
      await router.navigateToPage('506');
      const page = router.getCurrentPage()!;
      const inputMode = router.getPageInputMode(page);

      expect(inputMode).toBe('triple');
    });
  });

  describe('Complete User Flows', () => {
    it('should complete full spooky story selection flow', async () => {
      // Start at AI index
      await router.navigateToPage('500');

      // Navigate to spooky stories (type 505)
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(0);
      await inputHandler.handleDigitInput(5);
      expect(router.getCurrentPage()?.id).toBe('505');

      // Select theme 1 (Haunted House)
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('506');

      // Verify we can go back
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('505');
    });

    it('should complete full Q&A selection flow', async () => {
      // Start at AI index
      await router.navigateToPage('500');

      // Navigate to Q&A (type 510)
      await inputHandler.handleDigitInput(5);
      await inputHandler.handleDigitInput(1);
      await inputHandler.handleDigitInput(0);
      expect(router.getCurrentPage()?.id).toBe('510');

      // Select topic 1 (News & Current Events)
      await inputHandler.handleDigitInput(1);
      expect(router.getCurrentPage()?.id).toBe('511');

      // Verify we can go back
      await router.navigateBack();
      expect(router.getCurrentPage()?.id).toBe('510');
    });
  });
});
