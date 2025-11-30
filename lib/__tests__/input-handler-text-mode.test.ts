/**
 * Tests for InputHandler text mode functionality
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */

import { InputHandler } from '../input-handler';
import { NavigationRouter } from '../navigation-router';
import { TeletextPage } from '@/types/teletext';

describe('InputHandler - Text Mode', () => {
  let mockFetcher: jest.Mock;
  let router: NavigationRouter;
  let handler: InputHandler;
  let navigateCalled: string | null;
  let errorCalled: string | null;
  let bufferChanged: string | null;
  let textSubmitted: string | null;

  beforeEach(() => {
    navigateCalled = null;
    errorCalled = null;
    bufferChanged = null;
    textSubmitted = null;

    mockFetcher = jest.fn();
    router = new NavigationRouter(mockFetcher);
    
    handler = new InputHandler(router, {
      onNavigate: (pageId) => { navigateCalled = pageId; },
      onError: (error) => { errorCalled = error; },
      onBufferChange: (buffer) => { bufferChanged = buffer; },
      onTextSubmit: (text) => { textSubmitted = text; }
    });
  });

  describe('Text input mode', () => {
    let textPage: TeletextPage;

    beforeEach(() => {
      textPage = {
        id: '510',
        title: 'AI Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          source: 'AI',
          inputMode: 'text'
        }
      };

      mockFetcher.mockResolvedValue({ page: textPage, fromCache: false });
    });

    test('should accept alphanumeric characters in text mode', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('H');
      expect(bufferChanged).toBe('H');
      
      handler.handleTextInput('e');
      expect(bufferChanged).toBe('He');
      
      handler.handleTextInput('l');
      expect(bufferChanged).toBe('Hel');
      
      handler.handleTextInput('l');
      expect(bufferChanged).toBe('Hell');
      
      handler.handleTextInput('o');
      expect(bufferChanged).toBe('Hello');
    });

    test('should accept spaces in text mode', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('H');
      handler.handleTextInput('i');
      handler.handleTextInput(' ');
      handler.handleTextInput('t');
      handler.handleTextInput('h');
      handler.handleTextInput('e');
      handler.handleTextInput('r');
      handler.handleTextInput('e');
      
      expect(bufferChanged).toBe('Hi there');
    });

    test('should accept punctuation in text mode', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('H');
      handler.handleTextInput('e');
      handler.handleTextInput('l');
      handler.handleTextInput('l');
      handler.handleTextInput('o');
      handler.handleTextInput('!');
      
      expect(bufferChanged).toBe('Hello!');
    });

    test('should accept digits in text mode', async () => {
      await router.navigateToPage('510');
      
      await handler.handleDigitInput(1);
      await handler.handleDigitInput(2);
      await handler.handleDigitInput(3);
      
      expect(bufferChanged).toBe('123');
    });

    test('should submit text on enter key', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('T');
      handler.handleTextInput('e');
      handler.handleTextInput('s');
      handler.handleTextInput('t');
      
      await handler.handleEnterKey();
      
      expect(textSubmitted).toBe('Test');
      expect(bufferChanged).toBe(''); // Buffer should be cleared
    });

    test('should show error when submitting empty text', async () => {
      await router.navigateToPage('510');
      
      await handler.handleEnterKey();
      
      expect(errorCalled).toBe('Input cannot be empty');
      expect(textSubmitted).toBeNull();
    });

    test('should remove last character with backspace', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('H');
      handler.handleTextInput('e');
      handler.handleTextInput('l');
      handler.handleTextInput('l');
      handler.handleTextInput('o');
      
      expect(bufferChanged).toBe('Hello');
      
      handler.removeLastDigit();
      expect(bufferChanged).toBe('Hell');
      
      handler.removeLastDigit();
      expect(bufferChanged).toBe('Hel');
    });

    test('should clear buffer with escape', async () => {
      await router.navigateToPage('510');
      
      handler.handleTextInput('H');
      handler.handleTextInput('e');
      handler.handleTextInput('l');
      handler.handleTextInput('l');
      handler.handleTextInput('o');
      
      expect(bufferChanged).toBe('Hello');
      
      handler.clearInputBuffer();
      expect(bufferChanged).toBe('');
    });
  });

  describe('Input mode switching', () => {
    test('should clear buffer when switching from numeric to text mode', async () => {
      const numericPage: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'Static', inputMode: 'triple' }
      };

      const textPage: TeletextPage = {
        id: '510',
        title: 'AI Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'AI', inputMode: 'text' }
      };

      mockFetcher.mockResolvedValueOnce({ page: numericPage, fromCache: false });
      await router.navigateToPage('100');
      
      // Add some digits
      await handler.handleDigitInput(1);
      await handler.handleDigitInput(2);
      expect(bufferChanged).toBe('12');
      
      // Switch to text page
      mockFetcher.mockResolvedValueOnce({ page: textPage, fromCache: false });
      await router.navigateToPage('510');
      
      // Update input mode - should clear buffer
      handler.updateInputMode();
      expect(bufferChanged).toBe('');
    });

    test('should clear buffer when switching from text to numeric mode', async () => {
      const textPage: TeletextPage = {
        id: '510',
        title: 'AI Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'AI', inputMode: 'text' }
      };

      const numericPage: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'Static', inputMode: 'triple' }
      };

      mockFetcher.mockResolvedValueOnce({ page: textPage, fromCache: false });
      await router.navigateToPage('510');
      
      // Add some text
      handler.handleTextInput('H');
      handler.handleTextInput('e');
      handler.handleTextInput('l');
      handler.handleTextInput('l');
      handler.handleTextInput('o');
      expect(bufferChanged).toBe('Hello');
      
      // Switch to numeric page
      mockFetcher.mockResolvedValueOnce({ page: numericPage, fromCache: false });
      await router.navigateToPage('100');
      
      // Update input mode - should clear buffer
      handler.updateInputMode();
      expect(bufferChanged).toBe('');
    });
  });

  describe('Input validation', () => {
    test('should validate single-digit input', async () => {
      const page: TeletextPage = {
        id: '500',
        title: 'Menu',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'Static', inputMode: 'single', inputOptions: ['1', '2', '3'] }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('500');

      expect(handler.validateInput('1')).toBe(true);
      expect(handler.validateInput('2')).toBe(true);
      expect(handler.validateInput('3')).toBe(true);
      expect(handler.validateInput('4')).toBe(false);
      expect(handler.validateInput('12')).toBe(false);
    });

    test('should validate double-digit input', async () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'Static', inputMode: 'double' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('100');

      expect(handler.validateInput('1')).toBe(true);
      expect(handler.validateInput('12')).toBe(true);
      expect(handler.validateInput('123')).toBe(false);
      expect(handler.validateInput('abc')).toBe(false);
    });

    test('should validate triple-digit input', async () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'Static', inputMode: 'triple' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('100');

      expect(handler.validateInput('1')).toBe(true);
      expect(handler.validateInput('12')).toBe(true);
      expect(handler.validateInput('123')).toBe(true);
      expect(handler.validateInput('1234')).toBe(false);
      expect(handler.validateInput('abc')).toBe(false);
    });

    test('should validate text input', async () => {
      const page: TeletextPage = {
        id: '510',
        title: 'AI Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { source: 'AI', inputMode: 'text' }
      };

      mockFetcher.mockResolvedValue({ page, fromCache: false });
      await router.navigateToPage('510');

      expect(handler.validateInput('Hello')).toBe(true);
      expect(handler.validateInput('Hello world!')).toBe(true);
      expect(handler.validateInput('123')).toBe(true);
      expect(handler.validateInput('')).toBe(false);
    });
  });
});
