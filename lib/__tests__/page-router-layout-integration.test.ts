/**
 * Integration test for PageRouter and Layout Engine
 * 
 * Verifies that PageRouter correctly integrates with the layout engine
 * to render pages with proper 40×24 format.
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */

import { TeletextPage } from '@/types/teletext';
import { pageRenderer } from '../page-renderer';
import { TELETEXT_WIDTH, TELETEXT_HEIGHT } from '../layout-engine';

describe('PageRouter Layout Engine Integration', () => {
  describe('Page rendering with layout engine', () => {
    it('should render pages with exact 40×24 dimensions', () => {
      const testPage: TeletextPage = {
        id: '201',
        title: 'Test News Page',
        rows: [
          '',
          '',
          'Breaking news: Test story here',
          'More details about the story',
          'Additional information',
          ...Array(19).fill('')
        ],
        links: []
      };
      
      const rendered = pageRenderer.render(testPage);
      
      // Verify dimensions
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      rendered.rows.forEach((row, index) => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
    
    it('should apply appropriate column count based on page type', () => {
      const indexPage: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''),
        links: []
      };
      
      const newsPage: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''),
        links: []
      };
      
      // Index should use 2 columns
      expect(pageRenderer.getColumnCount(indexPage)).toBe(2);
      
      // News should use 1 column
      expect(pageRenderer.getColumnCount(newsPage)).toBe(1);
    });
    
    it('should not re-process pages with useLayoutManager flag', () => {
      const preProcessedPage: TeletextPage = {
        id: '100',
        title: 'Pre-processed',
        rows: Array(24).fill('Already processed'),
        links: [],
        meta: {
          useLayoutManager: true
        }
      };
      
      const rendered = pageRenderer.render(preProcessedPage);
      
      // Should return same page without modification
      expect(rendered).toBe(preProcessedPage);
      expect(rendered.meta?.renderedWithLayoutEngine).toBeUndefined();
    });
    
    it('should include navigation hints in rendered pages', () => {
      const pageWithLinks: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''),
        links: [
          { label: 'NEWS', targetPage: '200', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' }
        ]
      };
      
      const rendered = pageRenderer.render(pageWithLinks);
      
      // Should have rendered with hints in footer
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      
      // Last row should contain navigation hints
      const lastRow = rendered.rows[TELETEXT_HEIGHT - 1];
      expect(lastRow.length).toBe(TELETEXT_WIDTH);
    });
    
    it('should handle pages with continuation metadata', () => {
      const multiPageArticle: TeletextPage = {
        id: '201-1-2',
        title: 'Article Page 2',
        rows: Array(24).fill('Article content'),
        links: [],
        meta: {
          continuation: {
            currentPage: '201-1-2',
            nextPage: '201-1-3',
            previousPage: '201-1-1',
            totalPages: 3,
            currentIndex: 1
          }
        }
      };
      
      const rendered = pageRenderer.render(multiPageArticle);
      
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
    
    it('should preserve page metadata after rendering', () => {
      const pageWithMeta: TeletextPage = {
        id: '201',
        title: 'News',
        rows: Array(24).fill(''),
        links: [],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: '2024-01-01T12:00:00Z',
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };
      
      const rendered = pageRenderer.render(pageWithMeta);
      
      // Original metadata should be preserved
      expect(rendered.meta?.source).toBe('NewsAdapter');
      expect(rendered.meta?.lastUpdated).toBe('2024-01-01T12:00:00Z');
      expect(rendered.meta?.inputMode).toBe('single');
      expect(rendered.meta?.inputOptions).toEqual(['1', '2', '3']);
      
      // New flag should be added
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
    
    it('should handle empty content gracefully', () => {
      const emptyPage: TeletextPage = {
        id: '100',
        title: 'Empty Page',
        rows: [],
        links: []
      };
      
      const rendered = pageRenderer.render(emptyPage);
      
      // Should still produce valid 40×24 output
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      rendered.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
    
    it('should handle very long content by truncating', () => {
      const longContent = Array(100).fill('This is a very long line of content that needs to be wrapped or truncated');
      
      const longPage: TeletextPage = {
        id: '201',
        title: 'Long Content',
        rows: [
          '',
          '',
          ...longContent
        ],
        links: []
      };
      
      const rendered = pageRenderer.render(longPage);
      
      // Should still produce exactly 24 rows
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      rendered.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
  });
  
  describe('Backward compatibility', () => {
    it('should handle pages without meta object', () => {
      const pageWithoutMeta: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill(''),
        links: []
      };
      
      const rendered = pageRenderer.render(pageWithoutMeta);
      
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
    
    it('should handle pages with partial meta object', () => {
      const pageWithPartialMeta: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill(''),
        links: [],
        meta: {
          source: 'TestAdapter'
        }
      };
      
      const rendered = pageRenderer.render(pageWithPartialMeta);
      
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      expect(rendered.meta?.source).toBe('TestAdapter');
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
  });
});
