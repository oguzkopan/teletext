/**
 * Tests for error page templates
 */

import {
  createErrorPage,
  createNetworkErrorPage,
  createTimeoutErrorPage,
  createInvalidInputErrorPage,
  createSessionExpiredPage,
  createNotFoundPage,
  createAIServiceErrorPage,
  createRateLimitErrorPage,
  createGenericErrorPage
} from '../error-pages';

describe('Error Pages', () => {
  describe('createErrorPage', () => {
    it('should create a basic error page with correct structure', () => {
      const page = createErrorPage({
        errorType: 'generic',
        pageNumber: '500',
        errorMessage: 'Test error message'
      });

      expect(page.id).toBe('500');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.rows[0]).toContain('ERROR');
      expect(page.rows[0]).toContain('P500');
    });

    it('should include error message in the page', () => {
      const page = createErrorPage({
        errorType: 'generic',
        pageNumber: '500',
        errorMessage: 'Something went wrong'
      });

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Something went wrong');
    });

    it('should include retry action when provided', () => {
      const page = createErrorPage({
        errorType: 'generic',
        pageNumber: '500',
        errorMessage: 'Error',
        retryAction: 'Press R to retry'
      });

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Press R to retry');
    });

    it('should always include link to main index', () => {
      const page = createErrorPage({
        errorType: 'generic',
        pageNumber: '500',
        errorMessage: 'Error'
      });

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Press 100 for main index');
      expect(page.links.some(link => link.targetPage === '100')).toBe(true);
    });
  });

  describe('createNetworkErrorPage', () => {
    it('should create network error page for offline state', () => {
      const page = createNetworkErrorPage('500', true);

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('offline');
      expect(pageContent).toContain('cached content');
    });

    it('should create network error page for connection issues', () => {
      const page = createNetworkErrorPage('500', false);

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('connect to the server');
    });

    it('should include retry action', () => {
      const page = createNetworkErrorPage('500');

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Press R to retry');
    });
  });

  describe('createTimeoutErrorPage', () => {
    it('should create timeout error page', () => {
      const page = createTimeoutErrorPage('500', 'AI request');

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('AI request');
      expect(pageContent).toContain('took too long');
    });

    it('should use default operation name', () => {
      const page = createTimeoutErrorPage('500');

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('request');
    });
  });

  describe('createInvalidInputErrorPage', () => {
    it('should create invalid input error page', () => {
      const page = createInvalidInputErrorPage('500', 'abc', '1-3 digits');

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Invalid input');
      expect(pageContent).toContain('abc');
      expect(pageContent).toContain('1-3 digits');
    });
  });

  describe('createSessionExpiredPage', () => {
    it('should create session expired page', () => {
      const page = createSessionExpiredPage('500', 'quiz');

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('quiz');
      expect(pageContent).toContain('expired');
    });

    it('should use default session type', () => {
      const page = createSessionExpiredPage('500');

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('session');
    });
  });

  describe('createNotFoundPage', () => {
    it('should create 404 not found page', () => {
      const page = createNotFoundPage('999');

      expect(page.id).toBe('999');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('999');
      expect(pageContent.toLowerCase()).toContain('could not be found');
    });

    it('should include navigation links to main sections', () => {
      const page = createNotFoundPage('999');

      expect(page.links.some(link => link.targetPage === '200')).toBe(true);
      expect(page.links.some(link => link.targetPage === '300')).toBe(true);
      expect(page.links.some(link => link.targetPage === '400')).toBe(true);
    });
  });

  describe('createAIServiceErrorPage', () => {
    it('should create AI service error page with retry', () => {
      const page = createAIServiceErrorPage('500', true);

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('AI service');
      expect(pageContent).toContain('Press R to retry');
    });

    it('should create AI service error page without retry', () => {
      const page = createAIServiceErrorPage('500', false);

      const pageContent = page.rows.join('');
      expect(pageContent).not.toContain('Press R to retry');
    });
  });

  describe('createRateLimitErrorPage', () => {
    it('should create rate limit error page with wait time', () => {
      const page = createRateLimitErrorPage('500', 30);

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Too many requests');
      expect(pageContent).toContain('30');
    });

    it('should create rate limit error page without specific wait time', () => {
      const page = createRateLimitErrorPage('500');

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Too many requests');
    });
  });

  describe('createGenericErrorPage', () => {
    it('should create generic error page with custom message', () => {
      const page = createGenericErrorPage('500', 'Custom error message');

      expect(page.id).toBe('500');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('Custom error message');
    });

    it('should create generic error page with default message', () => {
      const page = createGenericErrorPage('500');

      const pageContent = page.rows.join('');
      expect(pageContent).toContain('unexpected error');
    });
  });

  describe('Page structure validation', () => {
    it('should ensure all error pages have exactly 24 rows', () => {
      const pages = [
        createNetworkErrorPage('500'),
        createTimeoutErrorPage('500'),
        createInvalidInputErrorPage('500', 'test', 'format'),
        createSessionExpiredPage('500'),
        createNotFoundPage('500'),
        createAIServiceErrorPage('500'),
        createRateLimitErrorPage('500'),
        createGenericErrorPage('500')
      ];

      pages.forEach(page => {
        expect(page.rows).toHaveLength(24);
      });
    });

    it('should ensure all rows are exactly 40 characters', () => {
      const pages = [
        { name: 'network', page: createNetworkErrorPage('500') },
        { name: 'timeout', page: createTimeoutErrorPage('500') },
        { name: 'invalid_input', page: createInvalidInputErrorPage('500', 'test', 'format') },
        { name: 'session_expired', page: createSessionExpiredPage('500') },
        { name: 'not_found', page: createNotFoundPage('500') },
        { name: 'ai_service', page: createAIServiceErrorPage('500') },
        { name: 'rate_limit', page: createRateLimitErrorPage('500') },
        { name: 'generic', page: createGenericErrorPage('500') }
      ];

      pages.forEach(({ name, page }) => {
        page.rows.forEach((row, index) => {
          if (row.length !== 40) {
            console.log(`${name} page, row ${index}: length=${row.length}, content="${row}"`);
          }
          expect(row.length).toBe(40);
        });
      });
    });
  });
});
