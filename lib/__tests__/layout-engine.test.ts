/**
 * Tests for Layout Engine core functions
 */

import {
  wrapText,
  padText,
  truncateText,
  validateOutput,
  normalizeOutput,
  renderHeader,
  renderFooter,
  renderSingleColumn,
  calculateColumnWidths,
  flowTextToColumns,
  mergeColumns,
  renderMultiColumn,
  TELETEXT_WIDTH,
  TELETEXT_HEIGHT,
  NavigationHint
} from '../layout-engine';

describe('Layout Engine', () => {
  describe('wrapText', () => {
    it('should wrap text at word boundaries', () => {
      const text = 'This is a long line of text that needs to be wrapped';
      const result = wrapText(text, 20);
      
      expect(result.length).toBeGreaterThan(1);
      result.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(20);
      });
    });

    it('should handle text shorter than width', () => {
      const text = 'Short text';
      const result = wrapText(text, 40);
      
      expect(result).toEqual(['Short text']);
    });

    it('should handle empty text', () => {
      const result = wrapText('', 40);
      expect(result).toEqual([]);
    });

    it('should preserve paragraph breaks', () => {
      const text = 'First paragraph\n\nSecond paragraph';
      const result = wrapText(text, 40);
      
      expect(result).toContain('');
    });

    it('should break words longer than width', () => {
      const longWord = 'a'.repeat(50);
      const result = wrapText(longWord, 40);
      
      expect(result.length).toBeGreaterThan(1);
      result.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(40);
      });
    });

    it('should use default width of 40', () => {
      const text = 'a'.repeat(50);
      const result = wrapText(text);
      
      result.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(TELETEXT_WIDTH);
      });
    });
  });

  describe('padText', () => {
    it('should pad text to exact width (left align)', () => {
      const text = 'Hello';
      const result = padText(text, 10, 'left');
      
      expect(result).toBe('Hello     ');
      expect(result.length).toBe(10);
    });

    it('should pad text to exact width (center align)', () => {
      const text = 'Hello';
      const result = padText(text, 11, 'center');
      
      expect(result).toBe('   Hello   ');
      expect(result.length).toBe(11);
    });

    it('should pad text to exact width (right align)', () => {
      const text = 'Hello';
      const result = padText(text, 10, 'right');
      
      expect(result).toBe('     Hello');
      expect(result.length).toBe(10);
    });

    it('should truncate text that exceeds width', () => {
      const text = 'This is too long';
      const result = padText(text, 10);
      
      expect(result.length).toBe(10);
      expect(result).toBe('This is to');
    });

    it('should handle text that exactly matches width', () => {
      const text = 'a'.repeat(40);
      const result = padText(text, 40);
      
      expect(result).toBe(text);
      expect(result.length).toBe(40);
    });

    it('should use default width of 40', () => {
      const text = 'Hello';
      const result = padText(text);
      
      expect(result.length).toBe(TELETEXT_WIDTH);
    });
  });

  describe('truncateText', () => {
    it('should truncate text with ellipsis', () => {
      const text = 'This is a very long text that needs truncation';
      const result = truncateText(text, 20);
      
      expect(result.length).toBe(20);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short';
      const result = truncateText(text, 20);
      
      expect(result).toBe('Short');
    });

    it('should handle custom ellipsis', () => {
      const text = 'This is a very long text';
      const result = truncateText(text, 15, '…');
      
      expect(result.length).toBe(15);
      expect(result.endsWith('…')).toBe(true);
    });

    it('should handle text exactly at maxLength', () => {
      const text = 'a'.repeat(40);
      const result = truncateText(text, 40);
      
      expect(result).toBe(text);
    });

    it('should use default maxLength of 40', () => {
      const text = 'a'.repeat(50);
      const result = truncateText(text);
      
      expect(result.length).toBe(TELETEXT_WIDTH);
    });

    it('should handle very short maxLength', () => {
      const text = 'Hello World';
      const result = truncateText(text, 3);
      
      expect(result.length).toBe(3);
    });
  });

  describe('validateOutput', () => {
    it('should validate correct output', () => {
      const rows = Array(24).fill('a'.repeat(40));
      const result = validateOutput(rows);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect incorrect row count', () => {
      const rows = Array(20).fill('a'.repeat(40));
      const result = validateOutput(rows);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid row count');
    });

    it('should detect incorrect row width', () => {
      const rows = Array(24).fill('a'.repeat(30));
      const result = validateOutput(rows);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('invalid width'))).toBe(true);
    });

    it('should detect multiple errors', () => {
      const rows = Array(20).fill('a'.repeat(30));
      const result = validateOutput(rows);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('normalizeOutput', () => {
    it('should normalize correct output', () => {
      const rows = Array(24).fill('Hello');
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should pad short rows', () => {
      const rows = Array(24).fill('Hi');
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
        expect(row.startsWith('Hi')).toBe(true);
      });
    });

    it('should truncate long rows', () => {
      const rows = Array(24).fill('a'.repeat(50));
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should add empty rows if fewer than 24', () => {
      const rows = Array(10).fill('Hello');
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
      expect(result[0].startsWith('Hello')).toBe(true);
      expect(result[23]).toBe(' '.repeat(40));
    });

    it('should truncate if more than 24 rows', () => {
      const rows = Array(30).fill('Hello');
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
    });

    it('should handle empty input', () => {
      const rows: string[] = [];
      const result = normalizeOutput(rows);
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row).toBe(' '.repeat(40));
      });
    });

    it('should ensure output passes validation', () => {
      const rows = ['Short', 'a'.repeat(50), '', 'Normal text'];
      const result = normalizeOutput(rows);
      const validation = validateOutput(result);
      
      expect(validation.valid).toBe(true);
    });
  });

  describe('renderHeader', () => {
    it('should render header with page number and title', () => {
      const result = renderHeader('100', 'Main Index');
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      // Page number should be on the left
      expect(result[0].startsWith('100')).toBe(true);
      
      // Title should be in the middle
      expect(result[0]).toContain('Main Index');
    });

    it('should render header with timestamp', () => {
      const result = renderHeader('200', 'News', '12:34');
      
      expect(result.length).toBe(2);
      expect(result[0]).toContain('200');
      expect(result[0]).toContain('News');
      expect(result[0]).toContain('12:34');
    });

    it('should truncate long titles', () => {
      const longTitle = 'This is a very long title that exceeds the available space';
      const result = renderHeader('300', longTitle);
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle empty title', () => {
      const result = renderHeader('100', '');
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });
  });

  describe('renderFooter', () => {
    it('should render footer with navigation hints', () => {
      const hints: NavigationHint[] = [
        { text: '100=INDEX' },
        { text: 'BACK=PREVIOUS' }
      ];
      const result = renderFooter(hints);
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      expect(result[1]).toContain('100=INDEX');
      expect(result[1]).toContain('BACK=PREVIOUS');
    });

    it('should render empty footer when no hints', () => {
      const result = renderFooter([]);
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
        expect(row).toBe(' '.repeat(40));
      });
    });

    it('should truncate long hints', () => {
      const hints: NavigationHint[] = [
        { text: 'This is a very long navigation hint that exceeds the available space' }
      ];
      const result = renderFooter(hints);
      
      expect(result.length).toBe(2);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle multiple hints', () => {
      const hints: NavigationHint[] = [
        { text: 'RED=BACK' },
        { text: 'GREEN=NEXT' },
        { text: 'YELLOW=MENU' }
      ];
      const result = renderFooter(hints);
      
      expect(result.length).toBe(2);
      expect(result[1]).toContain('RED=BACK');
    });
  });

  describe('renderSingleColumn', () => {
    it('should render complete page with header, content, and footer', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Main Index',
        content: 'Welcome to Modern Teletext',
        hints: [{ text: '100=INDEX' }]
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      // Validate output
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });

    it('should wrap long content', () => {
      const longContent = 'This is a very long piece of content that needs to be wrapped across multiple lines to fit within the teletext display constraints.';
      const result = renderSingleColumn({
        pageNumber: '200',
        title: 'News',
        content: longContent
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle array content', () => {
      const content = [
        'Line 1',
        'Line 2',
        'Line 3'
      ];
      const result = renderSingleColumn({
        pageNumber: '300',
        title: 'Sports',
        content
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should fill content area without cutoff', () => {
      // Content area is 20 rows (24 - 2 header - 2 footer)
      const content = Array(25).fill('Content line').join('\n');
      const result = renderSingleColumn({
        pageNumber: '400',
        title: 'Test',
        content
      });
      
      expect(result.length).toBe(24);
      
      // Should have header (rows 0-1)
      expect(result[0]).toContain('400');
      
      // Should have content (rows 2-21)
      expect(result[2]).toContain('Content line');
      
      // Should have footer (rows 22-23)
      expect(result[22]).toBe(' '.repeat(40));
    });

    it('should include timestamp when provided', () => {
      const result = renderSingleColumn({
        pageNumber: '200',
        title: 'News',
        content: 'Breaking news',
        timestamp: '14:30'
      });
      
      expect(result[0]).toContain('14:30');
    });

    it('should handle empty content', () => {
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Empty',
        content: ''
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should calculate correct content area', () => {
      // Content area should be 20 rows (24 total - 2 header - 2 footer)
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Test',
        content: 'Test content'
      });
      
      // Row 0-1: Header
      expect(result[0]).toContain('100');
      
      // Row 2-21: Content area (20 rows)
      expect(result[2]).toContain('Test content');
      
      // Row 22-23: Footer
      expect(result[22]).toBe(' '.repeat(40));
    });

    it('should ensure no text cutoff in content area', () => {
      const content = 'A'.repeat(1000); // Very long content
      const result = renderSingleColumn({
        pageNumber: '100',
        title: 'Test',
        content
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      // All content rows should be properly formatted
      for (let i = 2; i < 22; i++) {
        expect(result[i].length).toBe(40);
      }
    });
  });

  describe('calculateColumnWidths', () => {
    it('should calculate widths for 2 columns with default gutter', () => {
      const widths = calculateColumnWidths(40, 2, 2);
      
      expect(widths.length).toBe(2);
      // 40 - 2 (gutter) = 38, divided by 2 = 19 each
      expect(widths[0]).toBe(19);
      expect(widths[1]).toBe(19);
      
      // Verify total width
      const total = widths.reduce((sum, w) => sum + w, 0) + 2; // +2 for gutter
      expect(total).toBe(40);
    });

    it('should calculate widths for 3 columns with default gutter', () => {
      const widths = calculateColumnWidths(40, 3, 2);
      
      expect(widths.length).toBe(3);
      // 40 - 4 (2 gutters) = 36, divided by 3 = 12 each
      expect(widths[0]).toBe(12);
      expect(widths[1]).toBe(12);
      expect(widths[2]).toBe(12);
      
      // Verify total width
      const total = widths.reduce((sum, w) => sum + w, 0) + 4; // +4 for 2 gutters
      expect(total).toBe(40);
    });

    it('should handle single column', () => {
      const widths = calculateColumnWidths(40, 1, 2);
      
      expect(widths.length).toBe(1);
      expect(widths[0]).toBe(40);
    });

    it('should handle remainder by adding to last column', () => {
      // 40 - 2 (gutter) = 38, divided by 2 = 19 each (no remainder in this case)
      // Let's test with a case that has remainder
      const widths = calculateColumnWidths(41, 2, 2);
      
      expect(widths.length).toBe(2);
      // 41 - 2 = 39, divided by 2 = 19 with remainder 1
      expect(widths[0]).toBe(19);
      expect(widths[1]).toBe(20); // Gets the remainder
    });

    it('should use default values', () => {
      const widths = calculateColumnWidths();
      
      expect(widths.length).toBe(1);
      expect(widths[0]).toBe(TELETEXT_WIDTH);
    });

    it('should handle invalid column count', () => {
      const widths = calculateColumnWidths(40, 0, 2);
      
      expect(widths.length).toBe(1);
      expect(widths[0]).toBe(40);
    });

    it('should handle negative column count', () => {
      const widths = calculateColumnWidths(40, -1, 2);
      
      expect(widths.length).toBe(1);
      expect(widths[0]).toBe(40);
    });
  });

  describe('flowTextToColumns', () => {
    it('should distribute lines evenly across 2 columns', () => {
      const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
      const columnWidths = [19, 19];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(2);
      expect(columns[0].length).toBe(2); // First 2 lines
      expect(columns[1].length).toBe(2); // Last 2 lines
    });

    it('should distribute lines evenly across 3 columns', () => {
      const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5', 'Line 6'];
      const columnWidths = [12, 12, 12];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(3);
      expect(columns[0].length).toBe(2); // First 2 lines
      expect(columns[1].length).toBe(2); // Next 2 lines
      expect(columns[2].length).toBe(2); // Last 2 lines
    });

    it('should handle uneven distribution', () => {
      const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'];
      const columnWidths = [19, 19];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(2);
      expect(columns[0].length).toBe(3); // First 3 lines (ceil(5/2))
      expect(columns[1].length).toBe(2); // Last 2 lines
    });

    it('should wrap long lines to fit column width', () => {
      const lines = ['This is a very long line that needs to be wrapped'];
      const columnWidths = [19, 19];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(2);
      // First column should have wrapped lines
      expect(columns[0].length).toBeGreaterThan(0);
      columns[0].forEach(line => {
        expect(line.length).toBeLessThanOrEqual(19);
      });
    });

    it('should handle single column', () => {
      const lines = ['Line 1', 'Line 2', 'Line 3'];
      const columnWidths = [40];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(1);
      expect(columns[0]).toEqual(lines);
    });

    it('should handle empty lines array', () => {
      const lines: string[] = [];
      const columnWidths = [19, 19];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(2);
      expect(columns[0].length).toBe(0);
      expect(columns[1].length).toBe(0);
    });

    it('should handle empty column widths', () => {
      const lines = ['Line 1', 'Line 2'];
      const columnWidths: number[] = [];
      
      const columns = flowTextToColumns(lines, columnWidths);
      
      expect(columns.length).toBe(0);
    });
  });

  describe('mergeColumns', () => {
    it('should merge 2 columns horizontally', () => {
      const columns = [
        ['Left 1', 'Left 2'],
        ['Right 1', 'Right 2']
      ];
      const columnWidths = [19, 19];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(2);
      merged.forEach(row => {
        expect(row.length).toBe(40); // 19 + 2 (gutter) + 19
      });
      
      // Check that columns are separated by gutter
      expect(merged[0]).toContain('Left 1');
      expect(merged[0]).toContain('Right 1');
      expect(merged[1]).toContain('Left 2');
      expect(merged[1]).toContain('Right 2');
    });

    it('should merge 3 columns horizontally', () => {
      const columns = [
        ['Col1-1', 'Col1-2'],
        ['Col2-1', 'Col2-2'],
        ['Col3-1', 'Col3-2']
      ];
      const columnWidths = [12, 12, 12];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(2);
      merged.forEach(row => {
        expect(row.length).toBe(40); // 12 + 2 + 12 + 2 + 12
      });
    });

    it('should handle columns with different heights', () => {
      const columns = [
        ['Left 1', 'Left 2', 'Left 3'],
        ['Right 1']
      ];
      const columnWidths = [19, 19];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(3); // Max height
      merged.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      // First row should have both columns
      expect(merged[0]).toContain('Left 1');
      expect(merged[0]).toContain('Right 1');
      
      // Second row should have left column only (right is empty/padded)
      expect(merged[1]).toContain('Left 2');
      
      // Third row should have left column only
      expect(merged[2]).toContain('Left 3');
    });

    it('should pad cells to column width', () => {
      const columns = [
        ['Hi'],
        ['Bye']
      ];
      const columnWidths = [19, 19];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(1);
      expect(merged[0].length).toBe(40);
      
      // Each cell should be padded to its column width
      expect(merged[0].substring(0, 19).trim()).toBe('Hi');
      expect(merged[0].substring(21, 40).trim()).toBe('Bye');
    });

    it('should handle single column', () => {
      const columns = [
        ['Line 1', 'Line 2']
      ];
      const columnWidths = [40];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(2);
      merged.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle empty columns array', () => {
      const columns: string[][] = [];
      const columnWidths: number[] = [];
      
      const merged = mergeColumns(columns, columnWidths, 2);
      
      expect(merged.length).toBe(0);
    });

    it('should add gutter between columns', () => {
      const columns = [
        ['AAA'],
        ['BBB']
      ];
      const columnWidths = [3, 3];
      const gutter = 2;
      
      const merged = mergeColumns(columns, columnWidths, gutter);
      
      expect(merged.length).toBe(1);
      // Should be: "AAA  BBB" (3 + 2 + 3 = 8 chars)
      expect(merged[0].substring(0, 3)).toBe('AAA');
      expect(merged[0].substring(3, 5)).toBe('  '); // Gutter
      expect(merged[0].substring(5, 8)).toBe('BBB');
    });
  });

  describe('renderMultiColumn', () => {
    it('should render page with 2 columns', () => {
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Main Index',
        content: [
          '200 News',
          '300 Sports',
          '400 Markets',
          '500 AI',
          '600 Games',
          '700 Weather'
        ],
        columns: 2,
        hints: [{ text: 'Enter page number' }]
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      // Validate output
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
      
      // Check header
      expect(result[0]).toContain('100');
      expect(result[0]).toContain('Main Index');
      
      // Check footer
      expect(result[23]).toContain('Enter page number');
    });

    it('should render page with 3 columns', () => {
      const result = renderMultiColumn({
        pageNumber: '200',
        title: 'News',
        content: [
          'Story 1',
          'Story 2',
          'Story 3',
          'Story 4',
          'Story 5',
          'Story 6',
          'Story 7',
          'Story 8',
          'Story 9'
        ],
        columns: 3
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
      
      const validation = validateOutput(result);
      expect(validation.valid).toBe(true);
    });

    it('should handle long content in multiple columns', () => {
      const longContent = Array(30).fill('Content line').join('\n');
      
      const result = renderMultiColumn({
        pageNumber: '300',
        title: 'Sports',
        content: longContent,
        columns: 2
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should include timestamp when provided', () => {
      const result = renderMultiColumn({
        pageNumber: '400',
        title: 'Markets',
        content: ['Stock 1', 'Stock 2'],
        columns: 2,
        timestamp: '15:45'
      });
      
      expect(result[0]).toContain('15:45');
    });

    it('should use custom gutter spacing', () => {
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content: ['A', 'B', 'C', 'D'],
        columns: 2,
        gutter: 4
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should handle empty content', () => {
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Empty',
        content: '',
        columns: 2
      });
      
      expect(result.length).toBe(24);
      result.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should fill content area without cutoff', () => {
      const result = renderMultiColumn({
        pageNumber: '100',
        title: 'Test',
        content: Array(50).fill('Line').join('\n'),
        columns: 2
      });
      
      expect(result.length).toBe(24);
      
      // Should have header (rows 0-1)
      expect(result[0]).toContain('100');
      
      // Should have content (rows 2-21)
      expect(result[2]).toContain('Line');
      
      // Should have footer (rows 22-23)
      expect(result[22]).toBe(' '.repeat(40));
    });
  });

  describe('Integration', () => {
    it('should handle complete workflow: wrap, pad, validate', () => {
      const text = 'This is a long piece of text that needs to be wrapped and formatted properly for teletext display.';
      
      // Wrap text
      const wrapped = wrapText(text, 40);
      
      // Pad each line
      const padded = wrapped.map(line => padText(line, 40));
      
      // Normalize to 24 rows
      const normalized = normalizeOutput(padded);
      
      // Validate
      const validation = validateOutput(normalized);
      
      expect(validation.valid).toBe(true);
      expect(normalized.length).toBe(24);
      normalized.forEach(row => {
        expect(row.length).toBe(40);
      });
    });

    it('should render complete page using single-column layout', () => {
      const page = renderSingleColumn({
        pageNumber: '100',
        title: 'Main Index',
        content: [
          'Welcome to Modern Teletext',
          '',
          '200 News',
          '300 Sports',
          '400 Markets',
          '500 AI Assistant',
          '600 Games'
        ],
        timestamp: '12:34',
        hints: [
          { text: 'Enter page number' }
        ]
      });
      
      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
      
      // Check structure
      expect(page[0]).toContain('100');
      expect(page[0]).toContain('Main Index');
      expect(page[0]).toContain('12:34');
      expect(page[2]).toContain('Welcome');
      expect(page[23]).toContain('Enter page number');
    });

    it('should render complete page using multi-column layout', () => {
      const page = renderMultiColumn({
        pageNumber: '100',
        title: 'Main Index',
        content: [
          '200 News',
          '300 Sports',
          '400 Markets',
          '500 AI',
          '600 Games',
          '700 Weather'
        ],
        columns: 2,
        timestamp: '12:34',
        hints: [
          { text: 'Enter page number' }
        ]
      });
      
      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
      
      // Check structure
      expect(page[0]).toContain('100');
      expect(page[0]).toContain('Main Index');
      expect(page[0]).toContain('12:34');
      expect(page[23]).toContain('Enter page number');
    });

    it('should handle news content with multi-column layout', () => {
      const newsContent = [
        'Breaking: Major event happens',
        'Sports: Team wins championship',
        'Markets: Stocks rise sharply',
        'Weather: Sunny skies ahead',
        'Tech: New product launched',
        'Politics: Important decision made'
      ];
      
      const page = renderMultiColumn({
        pageNumber: '200',
        title: 'News Headlines',
        content: newsContent,
        columns: 2,
        timestamp: '14:30'
      });
      
      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });

    it('should handle sports content with multi-column layout', () => {
      const sportsContent = [
        'Team A vs Team B: 2-1',
        'Team C vs Team D: 0-0',
        'Team E vs Team F: 3-2',
        'Team G vs Team H: 1-1'
      ];
      
      const page = renderMultiColumn({
        pageNumber: '300',
        title: 'Sports Scores',
        content: sportsContent,
        columns: 2
      });
      
      const validation = validateOutput(page);
      expect(validation.valid).toBe(true);
    });
  });
});
