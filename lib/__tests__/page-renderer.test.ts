/**
 * Tests for Page Renderer
 * 
 * Verifies integration of layout engine with PageRouter
 */

import { TeletextPage } from '@/types/teletext';
import {
  PageRenderer,
  determineColumnCount,
  extractPageContent,
  renderPageWithLayoutEngine,
  shouldUseLayoutEngine
} from '../page-renderer';
import { TELETEXT_WIDTH, TELETEXT_HEIGHT } from '../layout-engine';

describe('Page Renderer', () => {
  describe('determineColumnCount', () => {
    it('should return 2 columns for index page (100)', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: [],
        links: []
      };
      
      expect(determineColumnCount(page)).toBe(2);
    });
    
    it('should return 1 column for news pages (200-299)', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'News',
        rows: [],
        links: []
      };
      
      expect(determineColumnCount(page)).toBe(1);
    });
    
    it('should return 1 column for sports pages (300-399)', () => {
      const page: TeletextPage = {
        id: '301',
        title: 'Sports',
        rows: [],
        links: []
      };
      
      expect(determineColumnCount(page)).toBe(1);
    });
    
    it('should return 1 column for AI pages (500-599)', () => {
      const page: TeletextPage = {
        id: '501',
        title: 'AI',
        rows: [],
        links: []
      };
      
      expect(determineColumnCount(page)).toBe(1);
    });
    
    it('should return 1 column for game pages (600-699)', () => {
      const page: TeletextPage = {
        id: '601',
        title: 'Games',
        rows: [],
        links: []
      };
      
      expect(determineColumnCount(page)).toBe(1);
    });
  });
  
  describe('extractPageContent', () => {
    it('should extract content from page rows', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: [
          'Header Row 1',
          'Header Row 2',
          'Content Line 1',
          'Content Line 2',
          'Content Line 3',
          ...Array(17).fill(''),
          'Footer Row 1',
          'Footer Row 2'
        ],
        links: []
      };
      
      const content = extractPageContent(page);
      
      expect(content).toContain('Content Line 1');
      expect(content).toContain('Content Line 2');
      expect(content).toContain('Content Line 3');
      expect(content).not.toContain('Header Row 1');
      expect(content).not.toContain('Footer Row 1');
    });
    
    it('should handle empty pages', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: [],
        links: []
      };
      
      const content = extractPageContent(page);
      
      expect(content).toEqual([]);
    });
  });
  
  describe('shouldUseLayoutEngine', () => {
    it('should return false for pages with useLayoutManager flag', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: [],
        links: [],
        meta: {
          useLayoutManager: true
        }
      };
      
      expect(shouldUseLayoutEngine(page)).toBe(false);
    });
    
    it('should return false for pages already rendered with layout engine', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: [],
        links: [],
        meta: {
          renderedWithLayoutEngine: true
        }
      };
      
      expect(shouldUseLayoutEngine(page)).toBe(false);
    });
    
    it('should return true for pages without processing flags', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: [],
        links: []
      };
      
      expect(shouldUseLayoutEngine(page)).toBe(true);
    });
  });
  
  describe('renderPageWithLayoutEngine', () => {
    it('should render page with exactly 24 rows', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test Page',
        rows: [
          '',
          '',
          'This is test content',
          'More content here',
          ...Array(20).fill('')
        ],
        links: []
      };
      
      const rendered = renderPageWithLayoutEngine(page);
      
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
    });
    
    it('should render page with exactly 40 character width per row', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test Page',
        rows: [
          '',
          '',
          'This is test content',
          ...Array(21).fill('')
        ],
        links: []
      };
      
      const rendered = renderPageWithLayoutEngine(page);
      
      rendered.rows.forEach((row, index) => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
    
    it('should set renderedWithLayoutEngine flag', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test Page',
        rows: Array(24).fill(''),
        links: []
      };
      
      const rendered = renderPageWithLayoutEngine(page);
      
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
    
    it('should use 2 columns for index page', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: [
          '',
          '',
          'News',
          'Sports',
          'Markets',
          'Weather',
          ...Array(18).fill('')
        ],
        links: []
      };
      
      const rendered = renderPageWithLayoutEngine(page);
      
      // Should have rendered with 2 columns
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
    });
    
    it('should use 1 column for news pages', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'News',
        rows: [
          '',
          '',
          'Breaking news story here',
          ...Array(21).fill('')
        ],
        links: []
      };
      
      const rendered = renderPageWithLayoutEngine(page);
      
      // Should have rendered with 1 column
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
    });
  });
  
  describe('PageRenderer class', () => {
    let renderer: PageRenderer;
    
    beforeEach(() => {
      renderer = new PageRenderer();
    });
    
    it('should render page with layout engine by default', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill(''),
        links: []
      };
      
      const rendered = renderer.render(page);
      
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
    
    it('should not re-render pages with useLayoutManager flag', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill('Test content'),
        links: [],
        meta: {
          useLayoutManager: true
        }
      };
      
      const rendered = renderer.render(page);
      
      // Should return page unchanged
      expect(rendered).toBe(page);
      expect(rendered.meta?.renderedWithLayoutEngine).toBeUndefined();
    });
    
    it('should not re-render pages already rendered with layout engine', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill('Test content'),
        links: [],
        meta: {
          renderedWithLayoutEngine: true
        }
      };
      
      const rendered = renderer.render(page);
      
      // Should return page unchanged
      expect(rendered).toBe(page);
    });
    
    it('should get correct column count for different page types', () => {
      const indexPage: TeletextPage = { id: '100', title: 'Index', rows: [], links: [] };
      const newsPage: TeletextPage = { id: '201', title: 'News', rows: [], links: [] };
      const sportsPage: TeletextPage = { id: '301', title: 'Sports', rows: [], links: [] };
      
      expect(renderer.getColumnCount(indexPage)).toBe(2);
      expect(renderer.getColumnCount(newsPage)).toBe(1);
      expect(renderer.getColumnCount(sportsPage)).toBe(1);
    });
    
    it('should respect forceColumnCount option', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Test',
        rows: Array(24).fill(''),
        links: []
      };
      
      // Force 3 columns
      const rendered = renderer.render(page, { forceColumnCount: 3, useLayoutEngine: true });
      
      expect(rendered.rows).toHaveLength(TELETEXT_HEIGHT);
      expect(rendered.meta?.renderedWithLayoutEngine).toBe(true);
    });
  });
});
