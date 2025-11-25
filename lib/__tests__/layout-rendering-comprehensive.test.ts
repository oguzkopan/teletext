/**
 * Comprehensive Layout Rendering Tests
 * Task 20: Test and fix layout rendering
 * 
 * Tests all aspects of layout rendering:
 * - Single-column layout with various content lengths
 * - Multi-column layout (2 and 3 columns)
 * - Header formatting on all page types
 * - Footer hints on all page types
 * - No text cutoff issues
 * - All pages use full 40×24 grid
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5
 */

import {
  renderSingleColumn,
  renderMultiColumn,
  renderHeader,
  renderFooter,
  validateOutput,
  wrapText,
  padText,
  TELETEXT_WIDTH,
  TELETEXT_HEIGHT,
  NavigationHint
} from '../layout-engine';
import { TeletextPage } from '@/types/teletext';
import {
  renderPageWithLayoutEngine,
  determineColumnCount
} from '../page-renderer';

describe('Task 20: Comprehensive Layout Rendering Tests', () => {
  
  describe('Single-column layout with various content lengths', () => {
    it('should render empty content correctly', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Empty Page',
        content: ''
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render short content (1 line)', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Short Content',
        content: 'This is a single line of content'
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Content should appear in row 2 (after 2-row header)
      expect(result[2]).toContain('This is a single line');
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render medium content (5-10 lines)', () => {
      const content = [
        'Line 1 of content',
        'Line 2 of content',
        'Line 3 of content',
        'Line 4 of content',
        'Line 5 of content',
        'Line 6 of content',
        'Line 7 of content'
      ];
      
      const result = renderSingleColumn({
        pageNumber: '200',
        title: 'Medium Content',
        content
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // All content lines should be present
      content.forEach(line => {
        const found = result.some(row => row.includes(line));
        expect(found).toBe(true);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render long content (exactly 20 lines - fills content area)', () => {
      const content = Array(20).fill(0).map((_, i) => `Content line ${i + 1}`);
      
      const result = renderSingleColumn({
        pageNumber: '300',
        title: 'Full Content',
        content
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // All 20 lines should fit in content area (rows 2-21)
      for (let i = 0; i < 20; i++) {
        expect(result[i + 2]).toContain(`Content line ${i + 1}`);
      }
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render very long content (>20 lines - truncates)', () => {
      const content = Array(50).fill(0).map((_, i) => `Content line ${i + 1}`);
      
      const result = renderSingleColumn({
        pageNumber: '400',
        title: 'Overflow Content',
        content
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Only first 20 lines should appear
      expect(result[2]).toContain('Content line 1');
      expect(result[21]).toContain('Content line 20');
      
      // Lines 21+ should not appear
      const hasLine21 = result.some(row => row.includes('Content line 21'));
      expect(hasLine21).toBe(false);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should wrap long lines correctly', () => {
      const longLine = 'This is a very long line of text that exceeds the 40 character width and needs to be wrapped across multiple lines to fit properly';
      
      const result = renderSingleColumn({
        pageNumber: '500',
        title: 'Wrapped Content',
        content: longLine
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Content should be wrapped (multiple rows should contain parts of the text)
      const contentRows = result.slice(2, 22);
      const hasContent = contentRows.filter(row => row.trim().length > 0);
      expect(hasContent.length).toBeGreaterThan(1);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
  });
  
  describe('Multi-column layout (2 columns)', () => {
    it('should render 2-column layout with short content', () => {
      const content = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Two Columns',
        content,
        columns: 2
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render 2-column layout with medium content', () => {
      const content = Array(12).fill(0).map((_, i) => `Item ${i + 1}`);
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Two Columns',
        content,
        columns: 2
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Content should be distributed across columns
      const contentRows = result.slice(2, 22);
      const hasContent = contentRows.filter(row => row.trim().length > 0);
      expect(hasContent.length).toBeGreaterThan(0);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render 2-column layout with long content', () => {
      const content = Array(40).fill(0).map((_, i) => `Item ${i + 1}`);
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Two Columns',
        content,
        columns: 2
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should maintain column spacing (gutter)', () => {
      const content = ['Left', 'Right'];
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Gutter Test',
        content,
        columns: 2,
        gutter: 2
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Check that columns are separated
      const contentRow = result[2];
      expect(contentRow.length).toBe(TELETEXT_WIDTH);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
  });
  
  describe('Multi-column layout (3 columns)', () => {
    it('should render 3-column layout with short content', () => {
      const content = ['Col1', 'Col2', 'Col3', 'Col4', 'Col5', 'Col6'];
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Three Columns',
        content,
        columns: 3
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render 3-column layout with medium content', () => {
      const content = Array(18).fill(0).map((_, i) => `Item ${i + 1}`);
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Three Columns',
        content,
        columns: 3
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should render 3-column layout with long content', () => {
      const content = Array(60).fill(0).map((_, i) => `Item ${i + 1}`);
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Three Columns',
        content,
        columns: 3
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
  });
  
  describe('Header formatting on all page types', () => {
    it('should format header for index page (100)', () => {
      const result = renderHeader('100', 'Main Index', '12:34');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Page number on left
      expect(result[0].substring(0, 8)).toContain('100');
      
      // Title in center
      expect(result[0]).toContain('Main Index');
      
      // Timestamp on right
      expect(result[0].substring(32, 40)).toContain('12:34');
    });
    
    it('should format header for news page (200)', () => {
      const result = renderHeader('200', 'News Headlines', '14:30');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('200');
      expect(result[0]).toContain('News Headlines');
      expect(result[0]).toContain('14:30');
    });
    
    it('should format header for sports page (300)', () => {
      const result = renderHeader('300', 'Sports Scores', '15:45');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('300');
      expect(result[0]).toContain('Sports Scores');
      expect(result[0]).toContain('15:45');
    });
    
    it('should format header for markets page (400)', () => {
      const result = renderHeader('400', 'Market Data', '16:00');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('400');
      expect(result[0]).toContain('Market Data');
      expect(result[0]).toContain('16:00');
    });
    
    it('should format header for AI page (500)', () => {
      const result = renderHeader('500', 'AI Assistant', '17:15');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('500');
      expect(result[0]).toContain('AI Assistant');
      expect(result[0]).toContain('17:15');
    });
    
    it('should format header for game page (600)', () => {
      const result = renderHeader('600', 'Games', '18:00');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('600');
      expect(result[0]).toContain('Games');
      expect(result[0]).toContain('18:00');
    });
    
    it('should handle long titles by truncating', () => {
      const longTitle = 'This is a very long title that exceeds the available space in the header';
      const result = renderHeader('100', longTitle);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
    
    it('should handle headers without timestamp', () => {
      const result = renderHeader('100', 'Test Page');
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[0]).toContain('100');
      expect(result[0]).toContain('Test Page');
    });
  });
  
  describe('Footer hints on all page types', () => {
    it('should render footer for selection pages', () => {
      const hints: NavigationHint[] = [
        { text: 'Enter number to select' }
      ];
      const result = renderFooter(hints);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[1]).toContain('Enter number to select');
    });
    
    it('should render footer for content pages', () => {
      const hints: NavigationHint[] = [
        { text: '100=INDEX' },
        { text: 'BACK=PREVIOUS' }
      ];
      const result = renderFooter(hints);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[1]).toContain('100=INDEX');
      expect(result[1]).toContain('BACK=PREVIOUS');
    });
    
    it('should render footer with colored button hints', () => {
      const hints: NavigationHint[] = [
        { text: 'RED=BACK', color: 'red' },
        { text: 'GREEN=NEXT', color: 'green' },
        { text: 'YELLOW=MENU', color: 'yellow' }
      ];
      const result = renderFooter(hints);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      expect(result[1]).toContain('RED=BACK');
      expect(result[1]).toContain('GREEN=NEXT');
      expect(result[1]).toContain('YELLOW=MENU');
    });
    
    it('should render empty footer when no hints', () => {
      const result = renderFooter([]);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
        expect(row).toBe(' '.repeat(TELETEXT_WIDTH));
      });
    });
    
    it('should truncate long hints', () => {
      const hints: NavigationHint[] = [
        { text: 'This is a very long navigation hint that exceeds the available space and needs to be truncated' }
      ];
      const result = renderFooter(hints);
      
      expect(result).toHaveLength(2);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
    });
  });
  
  describe('No text cutoff issues', () => {
    it('should not cut off text in single-column layout', () => {
      const content = 'This is a line of text that should not be cut off in the middle of the screen';
      
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'No Cutoff',
        content
      });
      
      // Every row should be exactly 40 characters (no cutoff)
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Content should be wrapped, not cut off
      const contentRows = result.slice(2, 22);
      const allContent = contentRows.join('').trim();
      expect(allContent.length).toBeGreaterThan(0);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should not cut off text in multi-column layout', () => {
      const content = Array(20).fill('This is content that should not be cut off');
      
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'No Cutoff',
        content,
        columns: 2
      });
      
      // Every row should be exactly 40 characters
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should wrap long words instead of cutting them off', () => {
      const longWord = 'a'.repeat(60);
      
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Long Word',
        content: longWord
      });
      
      // Every row should be exactly 40 characters
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Word should be broken across multiple lines
      const contentRows = result.slice(2, 22);
      const hasContent = contentRows.filter(row => row.trim().length > 0);
      expect(hasContent.length).toBeGreaterThan(1);
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
  });
  
  describe('All pages use full 40×24 grid', () => {
    it('should use full grid for index page', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid for news page', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'News',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid for sports page', () => {
      const page: TeletextPage = {
        id: '300',
        title: 'Sports',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid for markets page', () => {
      const page: TeletextPage = {
        id: '400',
        title: 'Markets',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid for AI page', () => {
      const page: TeletextPage = {
        id: '500',
        title: 'AI Assistant',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid for game page', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Games',
        rows: Array(24).fill(''),
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid even with minimal content', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Minimal',
        content: 'X'
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
    
    it('should use full grid even with no content', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Empty',
        content: ''
      });
      
      expect(result).toHaveLength(TELETEXT_HEIGHT);
      result.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });
  });
  
  describe('Integration: Complete page rendering', () => {
    it('should render complete news page correctly', () => {
      const page: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: [
          '',
          '',
          '1. Major event happens in city',
          '2. Sports team wins championship',
          '3. Weather alert issued',
          '4. Technology breakthrough announced',
          '5. Political decision made',
          ...Array(17).fill('')
        ],
        links: [],
        meta: {
          lastUpdated: new Date().toISOString()
        }
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Should have header with page number and title
      expect(result.rows[0]).toContain('201');
      expect(result.rows[0]).toContain('Breaking News');
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should render complete sports page correctly', () => {
      const page: TeletextPage = {
        id: '301',
        title: 'Sports Scores',
        rows: [
          '',
          '',
          'Team A vs Team B: 2-1',
          'Team C vs Team D: 0-0',
          'Team E vs Team F: 3-2',
          ...Array(19).fill('')
        ],
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
    
    it('should render complete index page with 2 columns', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Main Index',
        rows: [
          '',
          '',
          '200 News',
          '300 Sports',
          '400 Markets',
          '500 AI',
          '600 Games',
          '700 Weather',
          ...Array(16).fill('')
        ],
        links: []
      };
      
      const result = renderPageWithLayoutEngine(page);
      
      expect(result.rows).toHaveLength(TELETEXT_HEIGHT);
      result.rows.forEach(row => {
        expect(row.length).toBe(TELETEXT_WIDTH);
      });
      
      // Index page should use 2 columns
      const columnCount = determineColumnCount(page);
      expect(columnCount).toBe(2);
      
      const validation = validateOutput(result.rows);
      expect(validation.valid).toBe(true);
    });
  });
});
