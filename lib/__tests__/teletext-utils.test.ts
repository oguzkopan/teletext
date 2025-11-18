/**
 * Tests for Teletext Utility Functions
 */

import {
  wrapText,
  truncateText,
  padText,
  normalizeRows,
  validatePage,
  createEmptyPage,
  stripHtmlTags,
  preserveWhitespace,
  formatContentToPages
} from '../teletext-utils';
import { TeletextPage } from '@/types/teletext';

describe('wrapText', () => {
  it('should wrap long text at word boundaries', () => {
    const input = 'This is a very long sentence that exceeds forty characters in total length';
    const result = wrapText(input, 40);
    
    expect(result.every(line => line.length <= 40)).toBe(true);
    expect(result.length).toBeGreaterThan(1);
  });

  it('should hard-wrap words longer than 40 characters', () => {
    const input = 'Supercalifragilisticexpialidocious';
    const result = wrapText(input, 40);
    
    expect(result.every(line => line.length <= 40)).toBe(true);
  });

  it('should handle empty string', () => {
    const result = wrapText('', 40);
    expect(result).toEqual(['']);
  });

  it('should handle text that fits in one line', () => {
    const input = 'Short text';
    const result = wrapText(input, 40);
    
    expect(result).toEqual(['Short text']);
  });

  it('should preserve word boundaries when possible', () => {
    const input = 'Hello world this is a test';
    const result = wrapText(input, 15);
    
    // Should not split words unnecessarily
    expect(result.every(line => !line.startsWith(' '))).toBe(true);
  });
});

describe('truncateText', () => {
  it('should truncate text longer than maxLength', () => {
    const input = 'This is a very long text that needs truncation';
    const result = truncateText(input, 20, true);
    
    expect(result.length).toBe(20);
    expect(result.endsWith('...')).toBe(true);
  });

  it('should not truncate text shorter than maxLength', () => {
    const input = 'Short';
    const result = truncateText(input, 20, true);
    
    expect(result).toBe('Short');
  });

  it('should truncate without ellipsis when specified', () => {
    const input = 'This is a very long text';
    const result = truncateText(input, 10, false);
    
    expect(result.length).toBe(10);
    expect(result.endsWith('...')).toBe(false);
  });
});

describe('padText', () => {
  it('should pad text to the left (default)', () => {
    const result = padText('Hello', 10, 'left');
    
    expect(result.length).toBe(10);
    expect(result).toBe('Hello     ');
  });

  it('should pad text to the right', () => {
    const result = padText('Hello', 10, 'right');
    
    expect(result.length).toBe(10);
    expect(result).toBe('     Hello');
  });

  it('should pad text to center', () => {
    const result = padText('Hello', 10, 'center');
    
    expect(result.length).toBe(10);
    expect(result.trim()).toBe('Hello');
  });

  it('should truncate text if longer than width', () => {
    const result = padText('This is too long', 10, 'left');
    
    expect(result.length).toBe(10);
  });

  it('should pad to exactly 40 characters by default', () => {
    const result = padText('Test');
    
    expect(result.length).toBe(40);
  });
});

describe('normalizeRows', () => {
  it('should normalize all rows to 40 characters', () => {
    const rows = ['Short', 'A bit longer', 'X'];
    const result = normalizeRows(rows, 40);
    
    expect(result.every(row => row.length === 40)).toBe(true);
  });

  it('should handle empty array', () => {
    const result = normalizeRows([], 40);
    
    expect(result).toEqual([]);
  });
});

describe('validatePage', () => {
  it('should validate a correct page', () => {
    const page: TeletextPage = {
      id: '100',
      title: 'Test Page',
      rows: Array(24).fill('').map(() => 'X'.repeat(40)),
      links: []
    };
    
    const result = validatePage(page);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject page with wrong number of rows', () => {
    const page: TeletextPage = {
      id: '100',
      title: 'Test Page',
      rows: Array(20).fill('').map(() => 'X'.repeat(40)),
      links: []
    };
    
    const result = validatePage(page);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('24 rows'))).toBe(true);
  });

  it('should reject page with rows exceeding 40 characters', () => {
    const page: TeletextPage = {
      id: '100',
      title: 'Test Page',
      rows: Array(24).fill('').map(() => 'X'.repeat(50)),
      links: []
    };
    
    const result = validatePage(page);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('exceeds 40 characters'))).toBe(true);
  });

  it('should reject invalid page ID', () => {
    const page: TeletextPage = {
      id: '999',
      title: 'Test Page',
      rows: Array(24).fill('').map(() => 'X'.repeat(40)),
      links: []
    };
    
    const result = validatePage(page);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('100 and 899'))).toBe(true);
  });

  it('should reject page without title', () => {
    const page: TeletextPage = {
      id: '100',
      title: '',
      rows: Array(24).fill('').map(() => 'X'.repeat(40)),
      links: []
    };
    
    const result = validatePage(page);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('title is required'))).toBe(true);
  });
});

describe('createEmptyPage', () => {
  it('should create a valid empty page', () => {
    const page = createEmptyPage('200', 'News');
    
    expect(page.id).toBe('200');
    expect(page.title).toBe('News');
    expect(page.rows.length).toBe(24);
    expect(page.rows.every(row => row.length === 40)).toBe(true);
    expect(page.links).toEqual([]);
  });

  it('should use default title if not provided', () => {
    const page = createEmptyPage('300');
    
    expect(page.title).toBe('Page 300');
  });
});

describe('stripHtmlTags', () => {
  it('should remove HTML tags', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Hello world');
  });

  it('should decode HTML entities', () => {
    const html = 'Hello &amp; goodbye &lt;test&gt;';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Hello & goodbye <test>');
  });

  it('should handle empty string', () => {
    const result = stripHtmlTags('');
    
    expect(result).toBe('');
  });
});

describe('preserveWhitespace', () => {
  it('should normalize line breaks', () => {
    const text = 'Line 1\r\nLine 2\rLine 3\nLine 4';
    const result = preserveWhitespace(text);
    
    expect(result).toBe('Line 1\nLine 2\nLine 3\nLine 4');
  });

  it('should preserve spaces', () => {
    const text = 'Hello    world';
    const result = preserveWhitespace(text);
    
    expect(result).toBe('Hello    world');
  });
});

describe('formatContentToPages', () => {
  it('should format content into pages of 24 rows', () => {
    const content = 'A '.repeat(1000); // Long content
    const pages = formatContentToPages(content, 24);
    
    expect(pages.length).toBeGreaterThan(1);
    expect(pages.every(page => page.length === 24)).toBe(true);
    expect(pages.every(page => page.every(row => row.length === 40))).toBe(true);
  });

  it('should handle short content', () => {
    const content = 'Short content';
    const pages = formatContentToPages(content, 24);
    
    expect(pages.length).toBe(1);
    expect(pages[0].length).toBe(24);
  });

  it('should return at least one page for empty content', () => {
    const pages = formatContentToPages('', 24);
    
    expect(pages.length).toBe(1);
    expect(pages[0].length).toBe(24);
  });
});
