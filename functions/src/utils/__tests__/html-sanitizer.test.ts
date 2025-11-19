/**
 * Tests for HTML Sanitization Utilities
 * 
 * Requirements: 13.2, 13.3, 14.4, 14.5
 */

import {
  stripHtmlTags,
  sanitizeSpecialCharacters,
  preserveWhitespace,
  parseHtmlContent,
  handleEmptyContent
} from '../html-sanitizer';

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

  it('should handle empty string', () => {
    const result = preserveWhitespace('');
    
    expect(result).toBe('');
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

  it('should handle news API response format', () => {
    const html = '<p>Tech giant announces new product &mdash; shares rise 5%</p>';
    const result = parseHtmlContent(html);
    
    expect(result).toBe('Tech giant announces new product - shares rise 5%');
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

describe('Edge cases and integration', () => {
  it('should handle content with mixed HTML and special characters', () => {
    const html = '<div>\u201CBreaking\u201D &mdash; <strong>Tech</strong> company\u2019s new AI\u2026</div>';
    const result = parseHtmlContent(html);
    
    expect(result).toBe('"Breaking" - Tech company\'s new AI...');
  });

  it('should handle empty content gracefully in full pipeline', () => {
    const html = '<div></div>';
    const parsed = parseHtmlContent(html);
    const result = handleEmptyContent(parsed, 'No news available');
    
    expect(result).toBe('No news available');
  });

  it('should preserve intentional formatting in news articles', () => {
    const html = '<p>Price:  $100</p><p>Change:  +5%</p>';
    const result = parseHtmlContent(html);
    
    expect(result).toContain('Price:  $100');
    expect(result).toContain('Change:  +5%');
  });
});
