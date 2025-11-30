/**
 * Tests for Input Handler
 * 
 * Validates keyboard input processing with mode-aware logic
 */

import { InputHandler } from '../input-handler';
import { NavigationRouter, InputMode } from '../navigation-router';
import { TeletextPage } from '@/types/teletext';

describe('InputHandler', () => {
  let mockFetcher: jest.Mock;
  let router: NavigationRouter;
  let handler: InputHandler;
  let onNavigate: jest.Mock;
  let onError: jest.Mock;
  let onBufferChange: jest.Mock;

  beforeEach(() => {
    mockFetcher = jest.fn();
    router = new NavigationRouter(mockFetcher);
    onNavigate = jest.fn();
    onError = jest.fn();
    onBufferChange = jest.fn();
    
    handler = new InputHandler(router, {
      onNavigate,
      onError,
      onBufferChange
    });
  });

  describe('Single-digit mode', () => {
    let selectionPage: TeletextPage;

    beforeEach(() => {
      selectionPage = {
        id: '500',
        title: 'AI Selection',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '501', color: 'red' },
          { label: '2', targetPage: '502', color: 'green' },
          { label: '3', targetPage: '503', color: 'yellow' }
        ],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      mockFetcher.mockResolvedValue({ page: selectionPage, fromCache: false });
    });

    it('should navigate immediately on valid single-digit input', async () => {
      // Navigate to selection page first
      await router.navigateToPage('500');
      mockFetcher.mockClear();

      // Mock the target page
      const targetPage: TeletextPage = {
        id: '501',
        title: 'AI Topic 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };
      mockFetcher.mockResolvedValue({ page: targetPage, fromCache: false });

      // Enter digit 1
      await handler.handleDigitInput(1);

      // Should navigate immediately
      expect(mockFetcher).toHaveBeenCalledWith('501', undefined);
      expect(onNavigate).toHaveBeenCalledWith('501');
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should show error for invalid single-digit option', async () => {
      await router.navigateToPage('500');
      mockFetcher.mockClear();

      // Enter invalid digit 9
      await handler.handleDigitInput(9);

      // Should not navigate
      expect(mockFetcher).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('Invalid option. Valid options: 1, 2, 3');
    });

    it('should use sub-page navigation when no link exists', async () => {
      // Page with inputOptions but no matching links
      const pageWithoutLinks: TeletextPage = {
        id: '600',
        title: 'Games',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      mockFetcher.mockResolvedValue({ page: pageWithoutLinks, fromCache: false });
      await router.navigateToPage('600');
      mockFetcher.mockClear();

      // Mock sub-page
      const subPage: TeletextPage = {
        id: '600-1',
        title: 'Game 1',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };
      mockFetcher.mockResolvedValue({ page: subPage, fromCache: false });

      // Enter digit 1
      await handler.handleDigitInput(1);

      // Should navigate to sub-page
      expect(mockFetcher).toHaveBeenCalledWith('600-1', undefined);
      expect(onNavigate).toHaveBeenCalledWith('600-1');
    });

    it('should not show input buffer in single-digit mode', async () => {
      await router.navigateToPage('500');

      const buffer = handler.renderInputBuffer();
      expect(buffer).toBe('');
    });
  });

  describe('Triple-digit mode', () => {
    let standardPage: TeletextPage;

    beforeEach(() => {
      standardPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'triple'
        }
      };

      mockFetcher.mockResolvedValue({ page: standardPage, fromCache: false });
    });

    it('should add digits to buffer in triple-digit mode', async () => {
      await router.navigateToPage('100');
      mockFetcher.mockClear();

      // Enter first digit
      await handler.handleDigitInput(2);
      expect(handler.getInputBuffer()).toBe('2');
      expect(onBufferChange).toHaveBeenCalledWith('2');
      expect(mockFetcher).not.toHaveBeenCalled();

      // Enter second digit
      await handler.handleDigitInput(0);
      expect(handler.getInputBuffer()).toBe('20');
      expect(onBufferChange).toHaveBeenCalledWith('20');
      expect(mockFetcher).not.toHaveBeenCalled();
    });

    it('should auto-navigate when buffer is full', async () => {
      await router.navigateToPage('100');
      mockFetcher.mockClear();

      // Mock target page
      const targetPage: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };
      mockFetcher.mockResolvedValue({ page: targetPage, fromCache: false });

      // Enter three digits
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(0);
      await handler.handleDigitInput(1);

      // Should auto-navigate
      expect(mockFetcher).toHaveBeenCalledWith('201', undefined);
      expect(onNavigate).toHaveBeenCalledWith('201');
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should render input buffer with underscores', async () => {
      await router.navigateToPage('100');

      // Empty buffer
      expect(handler.renderInputBuffer()).toBe('[___]');

      // One digit
      await handler.handleDigitInput(2);
      expect(handler.renderInputBuffer()).toBe('[2__]');

      // Two digits
      await handler.handleDigitInput(0);
      expect(handler.renderInputBuffer()).toBe('[20_]');
    });

    it('should clear buffer after navigation error', async () => {
      await router.navigateToPage('100');
      mockFetcher.mockClear();

      // Mock navigation error
      mockFetcher.mockRejectedValue(new Error('Page not found'));

      // Enter three digits
      await handler.handleDigitInput(9);
      await handler.handleDigitInput(9);
      await handler.handleDigitInput(9);

      // Should clear buffer after error
      expect(handler.getInputBuffer()).toBe('');
      expect(onError).toHaveBeenCalled();
    });

    it('should not exceed max buffer length', async () => {
      await router.navigateToPage('100');
      mockFetcher.mockClear();

      // Mock target page
      const targetPage: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };
      mockFetcher.mockResolvedValue({ page: targetPage, fromCache: false });

      // Enter three digits (buffer full)
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(0);
      await handler.handleDigitInput(1);

      // Buffer should be cleared after navigation
      expect(handler.getInputBuffer()).toBe('');

      // Try to enter another digit
      await handler.handleDigitInput(5);

      // Should start new buffer
      expect(handler.getInputBuffer()).toBe('5');
    });
  });

  describe('Double-digit mode', () => {
    let doublePage: TeletextPage;

    beforeEach(() => {
      doublePage = {
        id: '200',
        title: 'Sub-pages',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'double'
        }
      };

      mockFetcher.mockResolvedValue({ page: doublePage, fromCache: false });
    });

    it('should handle double-digit input mode buffer display', async () => {
      await router.navigateToPage('200');
      mockFetcher.mockClear();

      // Enter first digit
      await handler.handleDigitInput(2);
      expect(handler.getInputBuffer()).toBe('2');
      expect(handler.renderInputBuffer()).toBe('[2_]');

      // Enter second digit
      await handler.handleDigitInput(5);

      // Should attempt auto-navigation with "25"
      // Since "25" is not a valid page number (must be 100-899),
      // navigation will fail and buffer will be cleared
      expect(handler.getInputBuffer()).toBe('');
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Buffer management', () => {
    let standardPage: TeletextPage;

    beforeEach(() => {
      standardPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'triple'
        }
      };

      mockFetcher.mockResolvedValue({ page: standardPage, fromCache: false });
    });

    it('should remove last digit from buffer', async () => {
      await router.navigateToPage('100');

      // Add digits
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(0);
      expect(handler.getInputBuffer()).toBe('20');

      // Remove last digit
      handler.removeLastDigit();
      expect(handler.getInputBuffer()).toBe('2');
      expect(onBufferChange).toHaveBeenCalledWith('2');

      // Remove again
      handler.removeLastDigit();
      expect(handler.getInputBuffer()).toBe('');
      expect(onBufferChange).toHaveBeenCalledWith('');
    });

    it('should handle removeLastDigit on empty buffer', async () => {
      await router.navigateToPage('100');

      // Remove from empty buffer
      handler.removeLastDigit();
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should clear input buffer', async () => {
      await router.navigateToPage('100');

      // Add digits
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(0);
      expect(handler.getInputBuffer()).toBe('20');

      // Clear buffer
      handler.clearInputBuffer();
      expect(handler.getInputBuffer()).toBe('');
      expect(onBufferChange).toHaveBeenCalledWith('');
    });
  });

  describe('Input hints', () => {
    it('should show correct hint for single-digit mode', async () => {
      const page: TeletextPage = {
        id: '500',
        title: 'AI',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'single' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('500');

      expect(handler.showInputHint()).toBe('Enter option number');
    });

    it('should show correct hint for double-digit mode', async () => {
      const page: TeletextPage = {
        id: '200',
        title: 'Sub-pages',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'double' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('200');

      expect(handler.showInputHint()).toBe('Enter 2-digit page');
    });

    it('should show correct hint for triple-digit mode', async () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('100');

      expect(handler.showInputHint()).toBe('Enter 3-digit page');
    });
  });

  describe('Keyboard event handling', () => {
    let standardPage: TeletextPage;

    beforeEach(() => {
      standardPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      mockFetcher.mockResolvedValue({ page: standardPage, fromCache: false });
    });

    it('should handle digit key press', async () => {
      await router.navigateToPage('100');

      const event = new KeyboardEvent('keypress', { key: '5' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      await handler.handleKeyPress(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handler.getInputBuffer()).toBe('5');
    });

    it('should handle backspace key', async () => {
      await router.navigateToPage('100');

      // Add digit
      await handler.handleDigitInput(5);
      expect(handler.getInputBuffer()).toBe('5');

      // Press backspace
      const event = new KeyboardEvent('keypress', { key: 'Backspace' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      await handler.handleKeyPress(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should handle escape key', async () => {
      await router.navigateToPage('100');

      // Add digits
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(0);
      expect(handler.getInputBuffer()).toBe('20');

      // Press escape
      const event = new KeyboardEvent('keypress', { key: 'Escape' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      await handler.handleKeyPress(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should ignore non-digit keys', async () => {
      await router.navigateToPage('100');

      const event = new KeyboardEvent('keypress', { key: 'a' });
      await handler.handleKeyPress(event);

      expect(handler.getInputBuffer()).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid digit values', async () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('100');

      // Try invalid digits
      await handler.handleDigitInput(-1);
      expect(handler.getInputBuffer()).toBe('');

      await handler.handleDigitInput(10);
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should handle no current page', async () => {
      // Don't navigate to any page
      await handler.handleDigitInput(5);

      // Should not crash
      expect(handler.getInputBuffer()).toBe('');
    });

    it('should return empty strings when no current page', () => {
      expect(handler.renderInputBuffer()).toBe('');
      expect(handler.showInputHint()).toBe('');
    });
  });
});
