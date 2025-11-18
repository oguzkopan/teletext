/**
 * Teletext Utility Functions
 * 
 * Core utilities for formatting and validating teletext content
 * according to the 40×24 character grid constraints.
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Wraps text to fit within 40-character width, respecting word boundaries.
 * 
 * @param text - The text to wrap
 * @param maxWidth - Maximum characters per line (default: 40)
 * @returns Array of wrapped lines, each <= maxWidth characters
 * 
 * Requirements: 14.1, 14.2
 */
export function wrapText(text: string, maxWidth: number = 40): string[] {
  if (!text || text.length === 0) {
    return [''];
  }

  const lines: string[] = [];
  const words = text.split(/\s+/);
  let currentLine = '';

  for (const word of words) {
    // Handle words longer than maxWidth - hard wrap them
    if (word.length > maxWidth) {
      // If there's content in current line, push it first
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = '';
      }
      
      // Split the long word into chunks
      for (let i = 0; i < word.length; i += maxWidth) {
        lines.push(word.slice(i, i + maxWidth));
      }
      continue;
    }

    // Check if adding this word would exceed maxWidth
    const testLine = currentLine.length === 0 
      ? word 
      : `${currentLine} ${word}`;

    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      // Push current line and start new one with this word
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  // Push any remaining content
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Return at least one line (empty if no content)
  return lines.length > 0 ? lines : [''];
}

/**
 * Truncates text to a maximum length, optionally adding an ellipsis.
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 40)
 * @param ellipsis - Whether to add "..." if truncated (default: true)
 * @returns Truncated text
 * 
 * Requirements: 14.1, 14.2
 */
export function truncateText(
  text: string, 
  maxLength: number = 40, 
  ellipsis: boolean = true
): string {
  if (!text || text.length <= maxLength) {
    return text || '';
  }

  if (ellipsis && maxLength >= 3) {
    return text.slice(0, maxLength - 3) + '...';
  }

  return text.slice(0, maxLength);
}

/**
 * Pads text to exactly the specified width with spaces.
 * 
 * @param text - The text to pad
 * @param width - Target width (default: 40)
 * @param align - Alignment: 'left', 'right', or 'center' (default: 'left')
 * @returns Padded text of exactly width characters
 * 
 * Requirements: 2.1, 2.2, 14.5
 */
export function padText(
  text: string, 
  width: number = 40, 
  align: 'left' | 'right' | 'center' = 'left'
): string {
  // Truncate if too long
  if (text.length > width) {
    return text.slice(0, width);
  }

  const padding = width - text.length;

  switch (align) {
    case 'right':
      return ' '.repeat(padding) + text;
    
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    
    case 'left':
    default:
      return text + ' '.repeat(padding);
  }
}

/**
 * Ensures all rows in an array are exactly 40 characters wide.
 * 
 * @param rows - Array of text rows
 * @param targetWidth - Target width (default: 40)
 * @returns Array of rows, each exactly targetWidth characters
 * 
 * Requirements: 2.1, 2.2
 */
export function normalizeRows(rows: string[], targetWidth: number = 40): string[] {
  return rows.map(row => padText(row, targetWidth, 'left'));
}

/**
 * Validates that a teletext page conforms to the 40×24 constraint.
 * 
 * @param page - The page to validate
 * @returns Object with isValid flag and array of validation errors
 * 
 * Requirements: 2.1, 2.2, 11.5
 */
export function validatePage(page: TeletextPage): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check page ID format (3 digits, 100-899)
  if (!/^\d{3}$/.test(page.id)) {
    errors.push('Page ID must be exactly 3 digits');
  } else {
    const pageNum = parseInt(page.id, 10);
    if (pageNum < 100 || pageNum > 899) {
      errors.push('Page ID must be between 100 and 899');
    }
  }

  // Check rows array exists
  if (!Array.isArray(page.rows)) {
    errors.push('Page rows must be an array');
    return { isValid: false, errors };
  }

  // Check exactly 24 rows
  if (page.rows.length !== 24) {
    errors.push(`Page must have exactly 24 rows, found ${page.rows.length}`);
  }

  // Check each row is at most 40 characters
  page.rows.forEach((row, index) => {
    if (typeof row !== 'string') {
      errors.push(`Row ${index} must be a string`);
    } else if (row.length > 40) {
      errors.push(`Row ${index} exceeds 40 characters (${row.length} chars)`);
    }
  });

  // Check title exists and is reasonable length
  if (!page.title || page.title.length === 0) {
    errors.push('Page title is required');
  } else if (page.title.length > 40) {
    errors.push('Page title should not exceed 40 characters');
  }

  // Check links array exists
  if (!Array.isArray(page.links)) {
    errors.push('Page links must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates an empty teletext page with the correct structure.
 * 
 * @param pageId - The page ID (3 digits)
 * @param title - The page title
 * @returns A valid empty TeletextPage
 * 
 * Requirements: 2.1, 2.2
 */
export function createEmptyPage(pageId: string, title: string = ''): TeletextPage {
  return {
    id: pageId,
    title: title || `Page ${pageId}`,
    rows: Array(24).fill('').map(() => ' '.repeat(40)),
    links: [],
    meta: {
      source: 'system',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh'
    }
  };
}

/**
 * Strips HTML tags from text content.
 * 
 * @param html - HTML content to sanitize
 * @returns Plain text with HTML tags removed
 * 
 * Requirements: 14.4
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  return text;
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
 * Formats content into teletext rows, handling wrapping and pagination.
 * 
 * @param content - The content to format
 * @param maxRows - Maximum rows per page (default: 24)
 * @returns Array of row arrays, each representing a page
 * 
 * Requirements: 2.1, 2.2, 14.1
 */
export function formatContentToPages(
  content: string, 
  maxRows: number = 24
): string[][] {
  const allLines = wrapText(content, 40);
  const pages: string[][] = [];
  
  for (let i = 0; i < allLines.length; i += maxRows) {
    const pageLines = allLines.slice(i, i + maxRows);
    
    // Pad to exactly maxRows
    while (pageLines.length < maxRows) {
      pageLines.push('');
    }
    
    // Normalize all rows to 40 characters
    pages.push(normalizeRows(pageLines, 40));
  }
  
  // Return at least one page
  return pages.length > 0 ? pages : [normalizeRows(Array(maxRows).fill(''), 40)];
}
