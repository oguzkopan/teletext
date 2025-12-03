/**
 * Error Page Input Disabled Tests
 * 
 * Verifies that error pages (like page 500) have input disabled
 * and only allow back button navigation and Enter key for retry.
 */

import { createErrorPage, createGenericErrorPage } from '../error-pages';
import { InputContextManager } from '../input-context-manager';

describe('Error Page Input Disabled', () => {
  let contextManager: InputContextManager;

  beforeEach(() => {
    contextManager = new InputContextManager();
  });

  describe('Error page creation', () => {
    it('should create error page with disabled input mode', () => {
      const errorPage = createErrorPage({
        errorType: 'generic',
        pageNumber: '500',
        errorMessage: 'Test error'
      });

      expect(errorPage.meta?.inputMode).toBe('disabled');
      expect(errorPage.meta?.errorPage).toBe(true);
    });

    it('should create generic error page with disabled input', () => {
      const errorPage = createGenericErrorPage('500', 'Something went wrong');

      expect(errorPage.meta?.inputMode).toBe('disabled');
      expect(errorPage.meta?.errorPage).toBe(true);
    });
  });

  describe('Input mode detection', () => {
    it('should detect disabled mode for error pages', () => {
      const errorPage = createErrorPage({
        errorType: 'network',
        pageNumber: '500',
        errorMessage: 'Network error'
      });

      const inputMode = contextManager.detectInputMode(errorPage);
      expect(inputMode).toBe('disabled');
    });

    it('should detect disabled mode from errorPage flag', () => {
      const page = {
        id: '500',
        title: 'Error',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          errorPage: true
        }
      };

      const inputMode = contextManager.detectInputMode(page);
      expect(inputMode).toBe('disabled');
    });
  });

  describe('Input validation', () => {
    it('should reject all input on error pages', () => {
      const errorPage = createErrorPage({
        errorType: 'timeout',
        pageNumber: '500',
        errorMessage: 'Request timeout'
      });

      // Test digit input
      const digitResult = contextManager.validateInput('1', errorPage);
      expect(digitResult.valid).toBe(false);
      expect(digitResult.error).toContain('disabled');

      // Test text input
      const textResult = contextManager.validateInput('test', errorPage);
      expect(textResult.valid).toBe(false);
      expect(textResult.error).toContain('disabled');
    });

    it('should provide helpful hint for disabled input', () => {
      const errorPage = createErrorPage({
        errorType: 'not_found',
        pageNumber: '404',
        errorMessage: 'Page not found'
      });

      const hint = contextManager.getHintMessage(errorPage);
      expect(hint).toContain('back');
    });
  });

  describe('Input context', () => {
    it('should return disabled context for error pages', () => {
      const errorPage = createErrorPage({
        errorType: 'ai_service',
        pageNumber: '500',
        errorMessage: 'AI service unavailable'
      });

      const context = contextManager.getInputContext(errorPage);
      expect(context.mode).toBe('disabled');
      expect(context.maxLength).toBe(0);
      expect(context.autoSubmit).toBe(false);
    });

    it('should not allow any characters in disabled mode', () => {
      const errorPage = createErrorPage({
        errorType: 'rate_limit',
        pageNumber: '500',
        errorMessage: 'Too many requests'
      });

      // Test various characters
      expect(contextManager.isCharacterAllowed('1', errorPage)).toBe(false);
      expect(contextManager.isCharacterAllowed('a', errorPage)).toBe(false);
      expect(contextManager.isCharacterAllowed(' ', errorPage)).toBe(false);
      expect(contextManager.isCharacterAllowed('.', errorPage)).toBe(false);
    });
  });

  describe('Error page content', () => {
    it('should include retry action in error message', () => {
      const errorPage = createErrorPage({
        errorType: 'network',
        pageNumber: '500',
        errorMessage: 'Connection failed',
        retryAction: 'Press R to retry'
      });

      const pageContent = errorPage.rows.join('\n');
      expect(pageContent).toContain('Press R to retry');
    });

    it('should include back navigation hint', () => {
      const errorPage = createErrorPage({
        errorType: 'invalid_input',
        pageNumber: '500',
        errorMessage: 'Invalid input'
      });

      const pageContent = errorPage.rows.join('\n');
      expect(pageContent).toContain('100'); // Main index link
    });
  });
});
