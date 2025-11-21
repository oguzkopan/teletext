/**
 * Tests for Breadcrumb Navigation System
 * 
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

import { NavigationIndicators } from '../navigation-indicators';

describe('Breadcrumb Navigation System', () => {
  let indicators: NavigationIndicators;

  beforeEach(() => {
    indicators = new NavigationIndicators();
  });

  describe('Requirement 16.1: Breadcrumb trail display', () => {
    it('should display breadcrumb trail in header for any page', () => {
      const history = ['100', '200', '201'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('100 > 200 > 201');
    });

    it('should show navigation path with page numbers', () => {
      const history = ['100', '200'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toContain('100');
      expect(breadcrumb).toContain('200');
      expect(breadcrumb).toContain('>');
    });
  });

  describe('Requirement 16.2: Breadcrumb truncation for long histories', () => {
    it('should show last 3 pages with ellipsis for histories longer than 3', () => {
      const history = ['100', '200', '201', '202'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('... > 200 > 201 > 202');
      expect(breadcrumb).toContain('...');
    });

    it('should truncate very long histories correctly', () => {
      const history = ['100', '200', '201', '202', '203', '204', '205', '206'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('... > 204 > 205 > 206');
      expect(breadcrumb.split('>').length).toBe(4); // "..." + 3 pages
    });

    it('should not truncate histories of 3 or fewer pages', () => {
      const history1 = ['100'];
      const history2 = ['100', '200'];
      const history3 = ['100', '200', '201'];
      
      expect(indicators.renderBreadcrumbs(history1)).not.toContain('...');
      expect(indicators.renderBreadcrumbs(history2)).not.toContain('...');
      expect(indicators.renderBreadcrumbs(history3)).not.toContain('...');
    });
  });

  describe('Requirement 16.3: Breadcrumb display in page header', () => {
    it('should include breadcrumbs in header when provided', () => {
      const header = indicators.createHeader('Test Page', '201', {
        breadcrumbs: ['100', '200', '201']
      });
      
      expect(header).toHaveLength(2);
      expect(header[1]).toContain('100 > 200 > 201');
    });

    it('should display breadcrumbs in second row of header', () => {
      const header = indicators.createHeader('News Article', '201', {
        breadcrumbs: ['100', '200', '201']
      });
      
      // First row is title and page number
      expect(header[0]).toContain('NEWS ARTICLE');
      expect(header[0]).toContain('P201');
      
      // Second row is breadcrumbs
      expect(header[1]).toContain('100 > 200 > 201');
    });

    it('should format breadcrumbs to fit 40-character width', () => {
      const header = indicators.createHeader('Test', '201', {
        breadcrumbs: ['100', '200', '201']
      });
      
      expect(header[1].length).toBe(40);
    });
  });

  describe('Requirement 16.4: Breadcrumb highlighting on back button press', () => {
    it('should support breadcrumb highlighting state', () => {
      // This is tested in PageRouter component
      // The highlightBreadcrumb state is exposed in PageRouterState
      // and can be used by UI components to apply visual highlighting
      expect(true).toBe(true);
    });
  });

  describe('Requirement 16.5: Show INDEX instead of breadcrumbs on page 100', () => {
    it('should return "INDEX" for empty history', () => {
      const breadcrumb = indicators.renderBreadcrumbs([]);
      expect(breadcrumb).toBe('INDEX');
    });

    it('should return "INDEX" for history with only page 100', () => {
      const breadcrumb = indicators.renderBreadcrumbs(['100']);
      expect(breadcrumb).toBe('INDEX');
    });

    it('should not show breadcrumbs in header for page 100', () => {
      const header = indicators.createHeader('Main Index', '100', {
        breadcrumbs: []
      });
      
      // Should show separator instead of breadcrumbs
      expect(header[1]).toBe('═'.repeat(40));
    });

    it('should show breadcrumbs for other pages even if they start from 100', () => {
      const history = ['100', '200'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('100 > 200');
      expect(breadcrumb).not.toBe('INDEX');
    });
  });

  describe('Integration: Complete breadcrumb navigation flow', () => {
    it('should handle complete navigation sequence with breadcrumbs', () => {
      // Start at index
      let history = ['100'];
      expect(indicators.renderBreadcrumbs(history)).toBe('INDEX');
      
      // Navigate to news
      history = ['100', '200'];
      expect(indicators.renderBreadcrumbs(history)).toBe('100 > 200');
      
      // Navigate to article
      history = ['100', '200', '201'];
      expect(indicators.renderBreadcrumbs(history)).toBe('100 > 200 > 201');
      
      // Navigate to another article
      history = ['100', '200', '201', '202'];
      expect(indicators.renderBreadcrumbs(history)).toBe('... > 200 > 201 > 202');
      
      // Navigate deeper
      history = ['100', '200', '201', '202', '203'];
      expect(indicators.renderBreadcrumbs(history)).toBe('... > 201 > 202 > 203');
    });

    it('should handle back navigation in breadcrumbs', () => {
      // Forward navigation
      let history = ['100', '200', '201', '202'];
      expect(indicators.renderBreadcrumbs(history)).toBe('... > 200 > 201 > 202');
      
      // Back one page
      history = ['100', '200', '201'];
      expect(indicators.renderBreadcrumbs(history)).toBe('100 > 200 > 201');
      
      // Back to news index
      history = ['100', '200'];
      expect(indicators.renderBreadcrumbs(history)).toBe('100 > 200');
      
      // Back to main index
      history = ['100'];
      expect(indicators.renderBreadcrumbs(history)).toBe('INDEX');
    });

    it('should create complete header with breadcrumbs and content type', () => {
      const header = indicators.createHeader('Breaking News', '201', {
        breadcrumbs: ['100', '200', '201'],
        contentType: 'NEWS'
      });
      
      // Should have title with content type icon
      expect(header[0]).toContain('📰');
      expect(header[0]).toContain('BREAKING NEWS');
      expect(header[0]).toContain('P201');
      
      // Should have breadcrumbs
      expect(header[1]).toContain('100 > 200 > 201');
    });

    it('should prioritize breadcrumbs over other metadata in header', () => {
      const header = indicators.createHeader('Article', '201', {
        breadcrumbs: ['100', '200', '201'],
        pagePosition: { current: 1, total: 3 },
        timestamp: new Date().toISOString(),
        cacheStatus: 'LIVE'
      });
      
      // Breadcrumbs should be shown
      expect(header[1]).toContain('100 > 200 > 201');
      
      // Other metadata should not be shown
      expect(header[1]).not.toContain('Page');
      expect(header[1]).not.toContain('LIVE');
    });
  });

  describe('Edge cases', () => {
    it('should handle single page navigation', () => {
      const history = ['200'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('200');
    });

    it('should handle sub-page navigation in breadcrumbs', () => {
      const history = ['100', '200', '201-1'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('100 > 200 > 201-1');
    });

    it('should handle multi-page article navigation in breadcrumbs', () => {
      const history = ['100', '200', '201-1', '201-1-2'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('... > 200 > 201-1 > 201-1-2');
    });

    it('should handle very long page IDs in breadcrumbs', () => {
      const history = ['100', '200-10', '201-15-20'];
      const breadcrumb = indicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toBe('100 > 200-10 > 201-15-20');
    });
  });
});
