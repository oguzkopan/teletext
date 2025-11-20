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
  sanitizeSpecialCharacters,
  preserveWhitespace,
  parseHtmlContent,
  handleEmptyContent,
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

  it('should remove script tags and their content', () => {
    const html = '<p>Hello</p><script>alert("bad")</script><p>World</p>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('HelloWorld');
    expect(result).not.toContain('alert');
  });

  it('should remove style tags and their content', () => {
    const html = '<p>Hello</p><style>.test { color: red; }</style><p>World</p>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('HelloWorld');
    expect(result).not.toContain('color');
  });

  it('should remove HTML comments', () => {
    const html = '<p>Hello</p><!-- This is a comment --><p>World</p>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('HelloWorld');
    expect(result).not.toContain('comment');
  });

  it('should decode extended HTML entities', () => {
    const html = 'Test &mdash; &ndash; &hellip; &copy; &reg; &trade;';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Test — – ... © ® ™');
  });

  it('should decode numeric HTML entities', () => {
    const html = 'Test &#65; &#x42; &#67;';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Test A B C');
  });

  it('should handle nested tags', () => {
    const html = '<div><p><span><strong>Nested</strong> content</span></p></div>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Nested content');
  });

  it('should handle self-closing tags', () => {
    const html = '<p>Line 1<br/>Line 2<hr/>Line 3</p>';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Line 1Line 2Line 3');
  });

  it('should handle malformed HTML gracefully', () => {
    const html = '<p>Unclosed tag<p>Another paragraph';
    const result = stripHtmlTags(html);
    
    expect(result).toBe('Unclosed tagAnother paragraph');
  });
});

describe('sanitizeSpecialCharacters', () => {
  it('should convert smart quotes to regular quotes', () => {
    const text = '\u201CHello\u201D and \u2018world\u2019';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('"Hello" and \'world\'');
  });

  it('should convert em and en dashes to hyphens', () => {
    const text = 'Test \u2014 em dash \u2013 en dash';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('Test - em dash - en dash');
  });

  it('should convert ellipsis to three dots', () => {
    const text = 'Wait\u2026';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('Wait...');
  });

  it('should remove zero-width characters', () => {
    const text = 'Hello\u200BWorld\u200C\u200D\uFEFF';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('HelloWorld');
  });

  it('should remove control characters', () => {
    const text = 'Hello\x00\x01\x02World\x7F';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('HelloWorld');
  });

  it('should replace tabs with spaces', () => {
    const text = 'Hello\tWorld';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('Hello  World');
  });

  it('should normalize excessive spaces', () => {
    const text = 'Hello     World';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('Hello  World');
  });

  it('should preserve intentional double spaces', () => {
    const text = 'Hello  World';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('Hello  World');
  });

  it('should handle empty string', () => {
    const result = sanitizeSpecialCharacters('');
    
    expect(result).toBe('');
  });

  it('should handle mixed special characters', () => {
    const text = '\u201CTest\u201D \u2014 with \u2018quotes\u2019 and\u2026 ellipsis';
    const result = sanitizeSpecialCharacters(text);
    
    expect(result).toBe('"Test" - with \'quotes\' and... ellipsis');
  });
});

describe('parseHtmlContent', () => {
  it('should parse HTML with all sanitization steps', () => {
    const html = '<p>\u201CHello\u201D &amp; <strong>world</strong>\u2026</p>';
    const result = parseHtmlContent(html);
    
    expect(result).toBe('"Hello" & world...');
  });

  it('should handle complex HTML with scripts and styles', () => {
    const html = `
      <div>
        <script>alert('bad')</script>
        <p>Good content</p>
        <style>.test { color: red; }</style>
      </div>
    `;
    const result = parseHtmlContent(html);
    
    expect(result).toContain('Good content');
    expect(result).not.toContain('alert');
    expect(result).not.toContain('color');
  });

  it('should preserve layout whitespace by default', () => {
    const html = '<p>Line 1\r\nLine 2\rLine 3</p>';
    const result = parseHtmlContent(html);
    
    expect(result).toContain('\n');
  });

  it('should not preserve layout when specified', () => {
    const html = '<p>Line 1\r\nLine 2</p>';
    const result = parseHtmlContent(html, false);
    
    // Should still have normalized content
    expect(result).toBeTruthy();
  });

  it('should trim excessive whitespace', () => {
    const html = '   <p>Content</p>   ';
    const result = parseHtmlContent(html);
    
    expect(result).toBe('Content');
  });

  it('should normalize multiple newlines', () => {
    const html = '<p>Line 1</p>\n\n\n\n<p>Line 2</p>';
    const result = parseHtmlContent(html);
    
    expect(result).not.toContain('\n\n\n');
  });

  it('should handle empty HTML', () => {
    const result = parseHtmlContent('');
    
    expect(result).toBe('');
  });

  it('should handle HTML with only tags', () => {
    const html = '<div><span></span></div>';
    const result = parseHtmlContent(html);
    
    expect(result).toBe('');
  });

  it('should handle real news content', () => {
    const html = `
      <article>
        <h1>Breaking News</h1>
        <p>This is a <strong>test</strong> article with &quot;quotes&quot; and special chars\u2026</p>
        <p>Second paragraph \u2014 with em dash.</p>
      </article>
    `;
    const result = parseHtmlContent(html);
    
    expect(result).toContain('Breaking News');
    expect(result).toContain('test');
    expect(result).toContain('"quotes"');
    expect(result).toContain('...');
    expect(result).toContain('-');
  });
});

describe('handleEmptyContent', () => {
  it('should return content if not empty', () => {
    const content = 'Valid content';
    const result = handleEmptyContent(content);
    
    expect(result).toBe('Valid content');
  });

  it('should return default message for empty string', () => {
    const result = handleEmptyContent('');
    
    expect(result).toBe('No content available');
  });

  it('should return default message for whitespace-only string', () => {
    const result = handleEmptyContent('   \n\t  ');
    
    expect(result).toBe('No content available');
  });

  it('should use custom default message', () => {
    const result = handleEmptyContent('', 'Custom message');
    
    expect(result).toBe('Custom message');
  });

  it('should handle null or undefined gracefully', () => {
    const result = handleEmptyContent(null as any);
    
    expect(result).toBe('No content available');
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

// Full-width layout tests - Requirements 34.2, 34.3
describe('centerText', () => {
  it('should center text within 40 characters', () => {
    const { centerText } = require('../teletext-utils');
    const result = centerText('HELLO', 40);
    
    expect(result.length).toBe(40);
    expect(result.trim()).toBe('HELLO');
    
    // Check that padding is roughly equal on both sides
    const leftPadding = result.indexOf('HELLO');
    const rightPadding = result.length - result.lastIndexOf('O') - 1;
    expect(Math.abs(leftPadding - rightPadding)).toBeLessThanOrEqual(1);
  });

  it('should handle text that is already 40 characters', () => {
    const { centerText } = require('../teletext-utils');
    const input = 'A'.repeat(40);
    const result = centerText(input, 40);
    
    expect(result).toBe(input);
    expect(result.length).toBe(40);
  });

  it('should truncate text longer than width', () => {
    const { centerText } = require('../teletext-utils');
    const input = 'A'.repeat(50);
    const result = centerText(input, 40);
    
    expect(result.length).toBe(40);
  });
});

describe('rightAlignText', () => {
  it('should right-align text within 40 characters', () => {
    const { rightAlignText } = require('../teletext-utils');
    const result = rightAlignText('HELLO', 40);
    
    expect(result.length).toBe(40);
    expect(result.trim()).toBe('HELLO');
    expect(result.endsWith('HELLO')).toBe(true);
  });
});

describe('justifyText', () => {
  it('should justify text by distributing spaces', () => {
    const { justifyText } = require('../teletext-utils');
    const result = justifyText('Hello world test', 40);
    
    expect(result.length).toBe(40);
    expect(result.trim()).toContain('Hello');
    expect(result.trim()).toContain('world');
    expect(result.trim()).toContain('test');
  });

  it('should handle single word by left-aligning', () => {
    const { justifyText } = require('../teletext-utils');
    const result = justifyText('Hello', 40);
    
    expect(result.length).toBe(40);
    expect(result.startsWith('Hello')).toBe(true);
  });

  it('should truncate text that exceeds width', () => {
    const { justifyText } = require('../teletext-utils');
    const input = 'A'.repeat(50);
    const result = justifyText(input, 40);
    
    expect(result.length).toBe(40);
  });
});

describe('createTitleRow', () => {
  it('should create a centered title with decorations', () => {
    const { createTitleRow } = require('../teletext-utils');
    const result = createTitleRow('TITLE', '═', 40);
    
    expect(result.length).toBe(40);
    expect(result).toContain('TITLE');
    expect(result).toContain('═');
  });

  it('should handle long titles by centering without decoration', () => {
    const { createTitleRow } = require('../teletext-utils');
    const longTitle = 'A'.repeat(38);
    const result = createTitleRow(longTitle, '═', 40);
    
    expect(result.length).toBe(40);
  });
});

describe('createSeparator', () => {
  it('should create a full-width separator', () => {
    const { createSeparator } = require('../teletext-utils');
    const result = createSeparator('═', 40);
    
    expect(result.length).toBe(40);
    expect(result).toBe('═'.repeat(40));
  });

  it('should use default character', () => {
    const { createSeparator } = require('../teletext-utils');
    const result = createSeparator();
    
    expect(result.length).toBe(40);
    expect(result).toBe('═'.repeat(40));
  });
});

describe('createTwoColumnRow', () => {
  it('should create a two-column layout', () => {
    const { createTwoColumnRow } = require('../teletext-utils');
    const result = createTwoColumnRow('Left', 'Right', 40);
    
    expect(result.length).toBe(40);
    expect(result.startsWith('Left')).toBe(true);
    expect(result.endsWith('Right')).toBe(true);
  });

  it('should handle long text by truncating', () => {
    const { createTwoColumnRow } = require('../teletext-utils');
    const longLeft = 'A'.repeat(30);
    const longRight = 'B'.repeat(30);
    const result = createTwoColumnRow(longLeft, longRight, 40);
    
    expect(result.length).toBe(40);
  });
});

describe('addHalloweenDecoration', () => {
  it('should add decoration to both sides', () => {
    const { addHalloweenDecoration } = require('../teletext-utils');
    const result = addHalloweenDecoration('TEXT', 'both');
    
    expect(result).toContain('TEXT');
    expect(result.length).toBeGreaterThan('TEXT'.length);
  });

  it('should add decoration to prefix only', () => {
    const { addHalloweenDecoration } = require('../teletext-utils');
    const result = addHalloweenDecoration('TEXT', 'prefix');
    
    expect(result).toContain('TEXT');
    expect(result.endsWith('TEXT')).toBe(true);
  });

  it('should add decoration to suffix only', () => {
    const { addHalloweenDecoration } = require('../teletext-utils');
    const result = addHalloweenDecoration('TEXT', 'suffix');
    
    expect(result).toContain('TEXT');
    expect(result.startsWith('TEXT')).toBe(true);
  });
});
