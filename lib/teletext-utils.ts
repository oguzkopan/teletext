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

/**
 * Centers text within the full 40-character width.
 * 
 * @param text - The text to center
 * @param width - Target width (default: 40)
 * @returns Centered text padded to full width
 * 
 * Requirements: 34.2, 34.3
 */
export function centerText(text: string, width: number = 40): string {
  return padText(text, width, 'center');
}

/**
 * Right-aligns text within the full 40-character width.
 * 
 * @param text - The text to right-align
 * @param width - Target width (default: 40)
 * @returns Right-aligned text padded to full width
 * 
 * Requirements: 34.2, 34.3
 */
export function rightAlignText(text: string, width: number = 40): string {
  return padText(text, width, 'right');
}

/**
 * Justifies text to fill the full 40-character width by distributing spaces.
 * 
 * @param text - The text to justify
 * @param width - Target width (default: 40)
 * @returns Justified text with distributed spacing
 * 
 * Requirements: 34.2, 34.3
 */
export function justifyText(text: string, width: number = 40): string {
  // If text is already at or exceeds width, truncate
  if (text.length >= width) {
    return text.slice(0, width);
  }
  
  // Split into words
  const words = text.trim().split(/\s+/);
  
  // If only one word, left-align it
  if (words.length === 1) {
    return padText(text, width, 'left');
  }
  
  // Calculate total character count and spaces needed
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  const totalSpaces = width - totalChars;
  const gaps = words.length - 1;
  
  // If not enough space, just join with single spaces
  if (totalSpaces < gaps) {
    return padText(words.join(' '), width, 'left');
  }
  
  // Distribute spaces evenly
  const baseSpaces = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;
  
  let result = '';
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if (i < words.length - 1) {
      // Add base spaces plus one extra for the first 'extraSpaces' gaps
      const spacesToAdd = baseSpaces + (i < extraSpaces ? 1 : 0);
      result += ' '.repeat(spacesToAdd);
    }
  }
  
  return result;
}

/**
 * Creates a full-width title row with decorative elements.
 * 
 * @param title - The title text
 * @param decoration - Decoration character (default: '═')
 * @param width - Target width (default: 40)
 * @returns Centered title with decorative padding
 * 
 * Requirements: 34.2, 34.3
 */
export function createTitleRow(
  title: string, 
  decoration: string = '═', 
  width: number = 40
): string {
  const titleLength = title.length;
  
  // If title is too long, truncate
  if (titleLength >= width - 4) {
    return centerText(title, width);
  }
  
  // Calculate decoration on each side
  const totalDecoration = width - titleLength - 2; // -2 for spaces around title
  const leftDecoration = Math.floor(totalDecoration / 2);
  const rightDecoration = totalDecoration - leftDecoration;
  
  return decoration.repeat(leftDecoration) + ' ' + title + ' ' + decoration.repeat(rightDecoration);
}

/**
 * Creates a full-width separator line.
 * 
 * @param char - Character to use for separator (default: '═')
 * @param width - Target width (default: 40)
 * @returns Full-width separator line
 * 
 * Requirements: 34.2, 34.3
 */
export function createSeparator(char: string = '═', width: number = 40): string {
  return char.repeat(width);
}

/**
 * Formats a two-column layout within 40 characters.
 * 
 * @param left - Left column text
 * @param right - Right column text
 * @param width - Total width (default: 40)
 * @returns Formatted two-column row
 * 
 * Requirements: 34.2, 34.3
 */
export function createTwoColumnRow(
  left: string, 
  right: string, 
  width: number = 40
): string {
  const leftTruncated = truncateText(left, width - right.length - 1, false);
  const rightTruncated = truncateText(right, width - leftTruncated.length - 1, false);
  const spaces = width - leftTruncated.length - rightTruncated.length;
  
  return leftTruncated + ' '.repeat(spaces) + rightTruncated;
}

/**
 * Adds Halloween decorative elements to text.
 * 
 * @param text - The text to decorate
 * @param position - Position of decoration: 'prefix', 'suffix', or 'both'
 * @returns Text with Halloween decorations
 * 
 * Requirements: 36.3
 */
export function addHalloweenDecoration(
  text: string, 
  position: 'prefix' | 'suffix' | 'both' = 'both'
): string {
  const decorations = ['🎃', '👻', '🦇', '💀'];
  const randomDecoration = () => decorations[Math.floor(Math.random() * decorations.length)];
  
  if (position === 'prefix') {
    return `${randomDecoration()} ${text}`;
  } else if (position === 'suffix') {
    return `${text} ${randomDecoration()}`;
  } else {
    return `${randomDecoration()} ${text} ${randomDecoration()}`;
  }
}

/**
 * Creates multiple pages from long content with continuation metadata.
 * Each page will have proper navigation links to previous/next pages.
 * 
 * @param basePageId - Base page ID (e.g., "201")
 * @param title - Page title
 * @param contentRows - Array of content rows (can exceed 24 rows)
 * @param headerRows - Number of rows reserved for header (default: 3)
 * @param footerRows - Number of rows reserved for footer/links (default: 2)
 * @param links - Navigation links for the pages
 * @param meta - Additional metadata for the pages
 * @returns Array of TeletextPage objects with continuation metadata
 * 
 * Requirements: 35.1, 35.2, 35.3, 35.4, 35.5
 */
export function createMultiPageContent(
  basePageId: string,
  title: string,
  contentRows: string[],
  headerRows: number = 3,
  footerRows: number = 2,
  links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [],
  meta: any = {}
): TeletextPage[] {
  const contentRowsPerPage = 24 - headerRows - footerRows;
  const pages: TeletextPage[] = [];
  
  // Calculate total pages needed
  const totalPages = Math.ceil(contentRows.length / contentRowsPerPage);
  
  // If content fits in one page, return single page without continuation
  if (totalPages === 1) {
    const rows: string[] = [];
    
    // Add header
    rows.push(padText(`${title.toUpperCase()}`, 28) + `P${basePageId}`.padStart(12));
    rows.push(createSeparator('═', 40));
    rows.push(''.padEnd(40));
    
    // Add content
    contentRows.forEach(row => rows.push(padText(row, 40)));
    
    // Pad to 24 rows
    while (rows.length < 24) {
      rows.push(''.padEnd(40));
    }
    
    return [{
      id: basePageId,
      title,
      rows: rows.slice(0, 24),
      links,
      meta: {
        ...meta,
        source: meta.source || 'System',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    }];
  }
  
  // Create multiple pages with continuation metadata
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const pageId = pageIndex === 0 ? basePageId : `${basePageId}-${pageIndex + 1}`;
    const startRow = pageIndex * contentRowsPerPage;
    const endRow = Math.min(startRow + contentRowsPerPage, contentRows.length);
    const pageContent = contentRows.slice(startRow, endRow);
    
    const rows: string[] = [];
    
    // Add header
    const headerTitle = pageIndex === 0 ? title.toUpperCase() : `${title.toUpperCase()} (cont.)`;
    rows.push(padText(headerTitle, 28) + `P${pageId}`.padStart(12));
    rows.push(createSeparator('═', 40));
    rows.push(''.padEnd(40));
    
    // Add content
    pageContent.forEach(row => rows.push(padText(row, 40)));
    
    // Pad to 24 rows
    while (rows.length < 24) {
      rows.push(''.padEnd(40));
    }
    
    // Create continuation metadata
    const continuation = {
      currentPage: pageId,
      nextPage: pageIndex < totalPages - 1 ? (pageIndex === 0 ? `${basePageId}-2` : `${basePageId}-${pageIndex + 2}`) : undefined,
      previousPage: pageIndex > 0 ? (pageIndex === 1 ? basePageId : `${basePageId}-${pageIndex}`) : undefined,
      totalPages,
      currentIndex: pageIndex
    };
    
    pages.push({
      id: pageId,
      title: pageIndex === 0 ? title : `${title} (${pageIndex + 1}/${totalPages})`,
      rows: rows.slice(0, 24),
      links,
      meta: {
        ...meta,
        source: meta.source || 'System',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh',
        continuation
      }
    });
  }
  
  return pages;
}

/**
 * Splits long AI responses into multiple pages with continuation.
 * 
 * @param basePageId - Base page ID for the response
 * @param title - Response title
 * @param responseText - The full AI response text
 * @param links - Navigation links
 * @param meta - Additional metadata
 * @returns Array of TeletextPage objects
 * 
 * Requirements: 7.4, 35.1, 35.2, 35.3
 */
export function splitAIResponse(
  basePageId: string,
  title: string,
  responseText: string,
  links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [],
  meta: any = {}
): TeletextPage[] {
  // Wrap the response text to 40 characters
  const wrappedLines = wrapText(responseText, 40);
  
  // Create multi-page content
  return createMultiPageContent(
    basePageId,
    title,
    wrappedLines,
    3, // header rows
    2, // footer rows
    links,
    { ...meta, aiGenerated: true }
  );
}

/**
 * Gets the emoji for a colored button.
 * 
 * @param color - Button color ('red', 'green', 'yellow', 'blue')
 * @returns Color emoji
 * 
 * Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
 */
export function getColorEmoji(color: string): string {
  const colorMap: Record<string, string> = {
    red: '🔴',
    green: '🟢',
    yellow: '🟡',
    blue: '🔵'
  };

  return colorMap[color.toLowerCase()] || '';
}

/**
 * Formats colored button indicators for footer display.
 * 
 * @param buttons - Array of colored button configurations
 * @param maxWidth - Maximum width for the indicator line (default: 40)
 * @returns Formatted colored button indicator string
 * 
 * Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
 */
export function formatColoredButtonIndicators(
  buttons: Array<{ color: string; label: string; page?: string }>,
  maxWidth: number = 40
): string {
  if (!buttons || buttons.length === 0) {
    return '';
  }

  // Create button indicators with emojis and labels
  const buttonIndicators = buttons.map(btn => {
    const colorEmoji = getColorEmoji(btn.color);
    // Truncate label if too long (max 8 chars per button to fit 4 buttons)
    const label = truncateText(btn.label.toUpperCase(), 8, false);
    return `${colorEmoji}${label}`;
  }).join(' ');

  // Truncate if necessary
  return truncateText(buttonIndicators, maxWidth, false);
}
