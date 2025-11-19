/**
 * HTML Sanitization Utilities for Cloud Functions
 * 
 * These utilities handle HTML content from external APIs,
 * stripping tags and sanitizing special characters for teletext display.
 * 
 * Requirements: 13.2, 13.3, 14.4, 14.5
 */

/**
 * Strips HTML tags from text content.
 * Removes script/style tags, comments, and all HTML markup.
 * Decodes HTML entities to plain text.
 * 
 * @param html - HTML content to sanitize
 * @returns Plain text with HTML tags removed
 * 
 * Requirements: 14.4
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Remove script and style tags with their content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove all HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™');
  
  // Decode numeric HTML entities (&#123; or &#xAB;)
  text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  text = text.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return text;
}

/**
 * Sanitizes special characters for teletext display.
 * Removes or replaces characters that could cause display issues.
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text safe for teletext display
 * 
 * Requirements: 13.2, 13.3
 */
export function sanitizeSpecialCharacters(text: string): string {
  if (!text) return '';
  
  // Replace problematic Unicode characters with ASCII equivalents
  let sanitized = text
    // Smart quotes to regular quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Em/en dashes to hyphens
    .replace(/[\u2013\u2014]/g, '-')
    // Ellipsis to three dots
    .replace(/\u2026/g, '...')
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove control characters except newline and tab
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Replace tab with spaces
    .replace(/\t/g, '  ')
    // Normalize multiple spaces (but preserve intentional spacing)
    .replace(/ {3,}/g, '  ');
  
  return sanitized;
}

/**
 * Preserves whitespace while normalizing line breaks.
 * 
 * @param text - Text with potential whitespace
 * @returns Text with preserved spacing
 * 
 * Requirements: 14.5
 */
export function preserveWhitespace(text: string): string {
  if (!text) return '';
  
  // Normalize line breaks but preserve spaces
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Parses HTML content and converts it to clean teletext-ready text.
 * Combines HTML stripping, special character sanitization, and whitespace preservation.
 * 
 * @param html - HTML content to parse
 * @param preserveLayout - Whether to preserve whitespace for layout (default: true)
 * @returns Clean text ready for teletext display
 * 
 * Requirements: 13.2, 13.3, 14.4, 14.5
 */
export function parseHtmlContent(html: string, preserveLayout: boolean = true): string {
  if (!html) return '';
  
  // Step 1: Strip HTML tags
  let text = stripHtmlTags(html);
  
  // Step 2: Sanitize special characters
  text = sanitizeSpecialCharacters(text);
  
  // Step 3: Preserve whitespace if requested
  if (preserveLayout) {
    text = preserveWhitespace(text);
  }
  
  // Step 4: Trim excessive whitespace at start/end
  text = text.trim();
  
  // Step 5: Normalize multiple consecutive newlines to max 2
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text;
}

/**
 * Handles empty or invalid content gracefully with appropriate messages.
 * 
 * @param content - Content to check
 * @param defaultMessage - Message to return if content is empty (default: "No content available")
 * @returns Original content or default message
 * 
 * Requirements: 13.2
 */
export function handleEmptyContent(content: string, defaultMessage: string = 'No content available'): string {
  if (!content || content.trim().length === 0) {
    return defaultMessage;
  }
  return content;
}
