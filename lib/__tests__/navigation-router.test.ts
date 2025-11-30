/**
 * Tests for Navigation Router
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 14.1, 14.2, 14.3
 */

import { 
  NavigationRouter, 
  NavigationError, 
  NavigationErrorType,
  PageFetcher,
  FetchPageResult
} from '../navigation-router';
import { TeletextPage } from '@/types/teletext';

// Mock page fetcher
const createMockPageFetcher = (
  pages: Record<string, TeletextPage>
): PageFetcher => {
  return async (pageId: string): Promise<FetchPageResult> => {
    const page = pages[pageId] || null;
    return { page, fromCache: false };
  };
};

// Helper to create a test page
const createTestPage = (
  id: string,
  options?: {
    inputMode?: 'single' | 'double' | 'triple';
    inputOptions?: string[];
    links?: Array<{ label: string; targetPage: string }>;
  }
): TeletextPage => {
  return {
    id,
    title: `Page ${id}`,
    rows: Array(24).fill('').map(() => ' '.repeat(40)),
    links: options?.links || [],
    meta: {
      source: 'Test',
      inputMode: options?.inputMode,
      inputOptions: options?.inputOptions
    }
  };
};

describe('NavigationRouter', () => {
  describe('isValidPageNumber', () => {
    it('should validate standard 3-digit page numbers (100-999)', () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(createMockPageFetcher(pages));

      // Valid page numbers
      expect(router.isValidPageNumber('100')).toBe(true);
      expect(router.isValidPageNumber('200')).toBe(true);
      expect(router.isValidPageNumber('500')).toBe(true);
      expect(router.isValidPageNumber('899')).toBe(true);
      expect(router.isValidPageNumber('900')).toBe(true);
      expect(router.isValidPageNumber('999')).toBe(true);

      // Invalid page numbers
      expect(router.isValidPageNumber('99')).toBe(false);
      expect(router.isValidPageNumber('1000')).toBe(false);
      expect(router.isValidPageNumber('abc')).toBe(false);
      expect(router.isValidPageNumber('')).toBe(false);
    });

    it('should validate sub-page format (e.g., "202-1")', () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(createMockPageFetcher(pages));

      // Valid sub-pages
      expect(router.isValidPageNumber('202-1')).toBe(true);
      expect(router.isValidPageNumber('100-5')).toBe(true);
      expect(router.isValidPageNumber('899-99')).toBe(true);
      expect(router.isValidPageNumber('999-99')).toBe(true);

      // Invalid sub-pages
      expect(router.isValidPageNumber('99-1')).toBe(false);
      expect(router.isValidPageNumber('1000-1')).toBe(false);
      expect(router.isValidPageNumber('200-0')).toBe(false);
      expect(router.isValidPageNumber('200-100')).toBe(false);
    });

    it('should validate multi-page article format (e.g., "202-1-2")', () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(createMockPageFetcher(pages));

      // Valid multi-page articles
      expect(router.isValidPageNumber('202-1-2')).toBe(true);
      expect(router.isValidPageNumber('100-5-10')).toBe(true);
      expect(router.isValidPageNumber('899-99-99')).toBe(true);
      expect(router.isValidPageNumber('999-99-99')).toBe(true);

      // Invalid multi-page articles
      expect(router.isValidPageNumber('99-1-2')).toBe(false);
      expect(router.isValidPageNumber('1000-1-2')).toBe(false);
      expect(router.isValidPageNumber('200-0-2')).toBe(false);
      expect(router.isValidPageNumber('200-1-1')).toBe(false); // Page 1 is base article
      expect(router.isValidPageNumber('200-1-100')).toBe(false);
    });
  });

  describe('getPageInputMode', () => {
    it('should return inputMode from page metadata if present', () => {
      const page = createTestPage('500', { inputMode: 'single' });
      const router = new NavigationRouter(createMockPageFetcher({ '500': page }));

      expect(router.getPageInputMode(page)).toBe('single');
    });

    it('should detect single-digit mode from numbered links (1-9)', () => {
      const page = createTestPage('500', {
        links: [
          { label: '1', targetPage: '501' },
          { label: '2', targetPage: '502' },
          { label: '3', targetPage: '503' }
        ]
      });
      const router = new NavigationRouter(createMockPageFetcher({ '500': page }));

      expect(router.getPageInputMode(page)).toBe('single');
    });

    it('should detect single-digit mode from inputOptions', () => {
      const page = createTestPage('600', {
        inputOptions: ['1', '2', '3', '4']
      });
      const router = new NavigationRouter(createMockPageFetcher({ '600': page }));

      expect(router.getPageInputMode(page)).toBe('single');
    });

    it('should default to triple-digit mode for standard pages', () => {
      const page = createTestPage('200');
      const router = new NavigationRouter(createMockPageFetcher({ '200': page }));

      expect(router.getPageInputMode(page)).toBe('triple');
    });

    it('should detect single-digit mode for AI pages (500-599) with options', () => {
      const page = createTestPage('550', {
        inputOptions: ['1', '2', '3']
      });
      const router = new NavigationRouter(createMockPageFetcher({ '550': page }));

      expect(router.getPageInputMode(page)).toBe('single');
    });

    it('should detect single-digit mode for game pages (600-699) with options', () => {
      const page = createTestPage('650', {
        inputOptions: ['1', '2', '3', '4']
      });
      const router = new NavigationRouter(createMockPageFetcher({ '650': page }));

      expect(router.getPageInputMode(page)).toBe('single');
    });
  });

  describe('navigateToPage', () => {
    it('should navigate to a valid page', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');

      expect(router.getCurrentPage()?.id).toBe('200');
      expect(router.getNavigationHistory()).toEqual(['100', '200']);
    });

    it('should throw error for invalid page number', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await expect(router.navigateToPage('99')).rejects.toThrow(NavigationError);
      await expect(router.navigateToPage('1000')).rejects.toThrow(NavigationError);
      
      // Should remain on current page
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should throw error when page is not found', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await expect(router.navigateToPage('200')).rejects.toThrow(NavigationError);
      
      // Error should be set
      expect(router.getError()).toContain('not found');
    });

    it('should update expected input length based on new page', async () => {
      const pages = {
        '100': createTestPage('100'),
        '500': createTestPage('500', { inputMode: 'single' })
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      expect(router.getExpectedInputLength()).toBe(3); // Default triple

      await router.navigateToPage('500');

      expect(router.getExpectedInputLength()).toBe(1); // Single-digit mode
    });

    it('should clear input buffer after successful navigation', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      // Simulate input buffer (would normally be set by input handler)
      const state = router.getState();
      expect(state.inputBuffer).toBe('');

      await router.navigateToPage('200');

      expect(router.getInputBuffer()).toBe('');
    });

    it('should add page to history', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200'),
        '300': createTestPage('300')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');
      await router.navigateToPage('300');

      expect(router.getNavigationHistory()).toEqual(['100', '200', '300']);
    });
  });

  describe('navigateBack', () => {
    it('should navigate to previous page in history', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200'),
        '300': createTestPage('300')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');
      await router.navigateToPage('300');
      
      expect(router.getCurrentPage()?.id).toBe('300');
      expect(router.canGoBack()).toBe(true);

      await router.navigateBack();

      expect(router.getCurrentPage()?.id).toBe('200');
      expect(router.canGoBack()).toBe(true);

      await router.navigateBack();

      expect(router.getCurrentPage()?.id).toBe('100');
      expect(router.canGoBack()).toBe(false);
    });

    it('should do nothing when at beginning of history', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      expect(router.canGoBack()).toBe(false);

      await router.navigateBack();

      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should update expected input length when navigating back', async () => {
      const pages = {
        '100': createTestPage('100'),
        '500': createTestPage('500', { inputMode: 'single' })
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('500');
      expect(router.getExpectedInputLength()).toBe(1);

      await router.navigateBack();
      expect(router.getExpectedInputLength()).toBe(3);
    });
  });

  describe('navigateForward', () => {
    it('should navigate forward in history', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200'),
        '300': createTestPage('300')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');
      await router.navigateToPage('300');
      await router.navigateBack();
      await router.navigateBack();

      expect(router.getCurrentPage()?.id).toBe('100');
      expect(router.canGoForward()).toBe(true);

      await router.navigateForward();

      expect(router.getCurrentPage()?.id).toBe('200');
      expect(router.canGoForward()).toBe(true);

      await router.navigateForward();

      expect(router.getCurrentPage()?.id).toBe('300');
      expect(router.canGoForward()).toBe(false);
    });

    it('should do nothing when at end of history', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');

      expect(router.canGoForward()).toBe(false);

      await router.navigateForward();

      expect(router.getCurrentPage()?.id).toBe('200');
    });
  });

  describe('history management', () => {
    it('should remove forward history when navigating to new page', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200'),
        '300': createTestPage('300'),
        '400': createTestPage('400')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateToPage('200');
      await router.navigateToPage('300');
      await router.navigateBack();

      expect(router.getNavigationHistory()).toEqual(['100', '200', '300']);
      expect(router.canGoForward()).toBe(true);

      // Navigate to new page - should remove forward history
      await router.navigateToPage('400');

      expect(router.getNavigationHistory()).toEqual(['100', '200', '400']);
      expect(router.canGoForward()).toBe(false);
    });

    it('should limit history size', async () => {
      const pages: Record<string, TeletextPage> = {};
      for (let i = 100; i <= 200; i++) {
        pages[i.toString()] = createTestPage(i.toString());
      }

      const maxHistorySize = 10;
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100'],
        maxHistorySize
      );

      // Navigate to many pages
      for (let i = 101; i <= 120; i++) {
        await router.navigateToPage(i.toString());
      }

      const history = router.getNavigationHistory();
      expect(history.length).toBeLessThanOrEqual(maxHistorySize);
      expect(history[history.length - 1]).toBe('120');
    });
  });

  describe('error handling', () => {
    it('should set error message for invalid page number', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      try {
        await router.navigateToPage('99');
      } catch (error) {
        // Expected
      }

      expect(router.getError()).toContain('Invalid page number');
    });

    it('should set error message for page not found', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      try {
        await router.navigateToPage('200');
      } catch (error) {
        // Expected
      }

      expect(router.getError()).toContain('not found');
    });

    it('should clear error with clearError()', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      try {
        await router.navigateToPage('99');
      } catch (error) {
        // Expected
      }

      expect(router.getError()).not.toBeNull();

      router.clearError();

      expect(router.getError()).toBeNull();
    });

    it('should handle fetch errors gracefully', async () => {
      const errorFetcher: PageFetcher = async () => {
        throw new Error('Network error');
      };

      const router = new NavigationRouter(
        errorFetcher,
        createTestPage('100')
      );

      await expect(router.navigateToPage('200')).rejects.toThrow(NavigationError);
      expect(router.getError()).toContain('Failed to navigate');
    });
  });

  describe('state management', () => {
    it('should return current state', () => {
      const page = createTestPage('100');
      const router = new NavigationRouter(
        createMockPageFetcher({ '100': page }),
        page
      );

      const state = router.getState();

      expect(state.currentPage?.id).toBe('100');
      expect(state.history).toEqual(['100']);
      expect(state.historyIndex).toBe(0);
      expect(state.expectedInputLength).toBe(3);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should indicate loading state during navigation', async () => {
      const pages = {
        '100': createTestPage('100'),
        '200': createTestPage('200')
      };
      
      let resolvePromise: (value: FetchPageResult) => void;
      const delayedFetcher: PageFetcher = async (pageId: string) => {
        return new Promise((resolve) => {
          resolvePromise = resolve;
        });
      };

      const router = new NavigationRouter(
        delayedFetcher,
        pages['100']
      );

      const navigationPromise = router.navigateToPage('200');

      // Should be loading
      expect(router.isLoading()).toBe(true);

      // Resolve the fetch
      resolvePromise!({ page: pages['200'], fromCache: false });
      await navigationPromise;

      // Should no longer be loading
      expect(router.isLoading()).toBe(false);
    });
  });

  describe('arrow key navigation', () => {
    it('should navigate up to next page', async () => {
      const pages = {
        '100': createTestPage('100'),
        '101': createTestPage('101'),
        '102': createTestPage('102')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateUp();

      expect(router.getCurrentPage()?.id).toBe('101');

      await router.navigateUp();

      expect(router.getCurrentPage()?.id).toBe('102');
    });

    it('should navigate down to previous page', async () => {
      const pages = {
        '100': createTestPage('100'),
        '101': createTestPage('101'),
        '102': createTestPage('102')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['102']
      );

      await router.navigateDown();

      expect(router.getCurrentPage()?.id).toBe('101');

      await router.navigateDown();

      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should not navigate up beyond page 999', async () => {
      const pages = {
        '999': createTestPage('999')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['999']
      );

      await router.navigateUp();

      // Should remain on page 999
      expect(router.getCurrentPage()?.id).toBe('999');
    });

    it('should not navigate down below page 100', async () => {
      const pages = {
        '100': createTestPage('100')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateDown();

      // Should remain on page 100
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should handle missing pages gracefully when navigating up', async () => {
      const pages = {
        '100': createTestPage('100'),
        '102': createTestPage('102')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateUp();

      // Should remain on page 100 since 101 doesn't exist
      expect(router.getCurrentPage()?.id).toBe('100');
    });

    it('should handle missing pages gracefully when navigating down', async () => {
      const pages = {
        '100': createTestPage('100'),
        '102': createTestPage('102')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['102']
      );

      await router.navigateDown();

      // Should remain on page 102 since 101 doesn't exist
      expect(router.getCurrentPage()?.id).toBe('102');
    });

    it('should add arrow navigation to history', async () => {
      const pages = {
        '100': createTestPage('100'),
        '101': createTestPage('101'),
        '102': createTestPage('102')
      };
      const router = new NavigationRouter(
        createMockPageFetcher(pages),
        pages['100']
      );

      await router.navigateUp();
      await router.navigateUp();

      expect(router.getNavigationHistory()).toEqual(['100', '101', '102']);
    });
  });
});
