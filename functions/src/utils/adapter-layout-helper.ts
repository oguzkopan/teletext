/**
 * Adapter Layout Helper
 * 
 * Provides utility functions for adapters to integrate with the LayoutManager
 * and create consistent, full-screen layouts with proper indicators.
 * 
 * Requirements: All layout and indicator requirements from teletext-ux-redesign
 */

import { TeletextPage, PageLink } from '../types';

/**
 * Layout options for adapter pages
 */
export interface AdapterLayoutOptions {
  pageId: string;
  title: string;
  contentRows: string[];
  links: PageLink[];
  meta?: Record<string, any>;
  showTimestamp?: boolean;
  showBreadcrumbs?: boolean;
  showPagePosition?: boolean;
  continuation?: {
    currentPage: string;
    nextPage?: string;
    previousPage?: string;
    totalPages: number;
    currentIndex: number;
  };
}

/**
 * Applies full-screen layout to adapter content
 * 
 * This function integrates with the LayoutManager on the frontend
 * by providing properly structured page data with metadata that
 * the layout manager can use to create headers and footers.
 * 
 * @param options - Layout configuration
 * @returns Formatted TeletextPage
 */
export function applyAdapterLayout(options: AdapterLayoutOptions): TeletextPage {
  const {
    pageId,
    title,
    contentRows,
    links,
    meta = {},
    showTimestamp = false,
    showBreadcrumbs = false,
    showPagePosition = false,
    continuation
  } = options;

  // Pad content rows to exactly 40 characters
  const paddedContent = contentRows.map(row => {
    if (row.length > 40) {
      return row.substring(0, 40);
    }
    return row.padEnd(40, ' ');
  });

  // Ensure exactly 24 rows
  while (paddedContent.length < 24) {
    paddedContent.push(''.padEnd(40, ' '));
  }

  // Limit to 24 rows
  const finalRows = paddedContent.slice(0, 24);

  // Build metadata for layout manager
  const layoutMeta: Record<string, any> = {
    ...meta,
    useLayoutManager: true, // Signal to frontend to use layout manager
    showTimestamp,
    showBreadcrumbs,
    showPagePosition
  };

  // Add continuation metadata if provided
  if (continuation) {
    layoutMeta.continuation = continuation;
  }

  return {
    id: pageId,
    title,
    rows: finalRows,
    links,
    meta: layoutMeta
  };
}

/**
 * Creates a simple header row for adapters that don't use layout manager
 * 
 * @param title - Page title
 * @param pageId - Page ID
 * @param maxTitleLength - Maximum length for title (default: 28)
 * @returns Header row string
 */
export function createSimpleHeader(title: string, pageId: string, maxTitleLength: number = 28): string {
  const truncatedTitle = title.length > maxTitleLength 
    ? title.substring(0, maxTitleLength - 3) + '...' 
    : title;
  
  const titlePart = truncatedTitle.toUpperCase().padEnd(maxTitleLength, ' ');
  const pageNumPart = `P${pageId}`.padStart(12);
  
  return titlePart + pageNumPart;
}

/**
 * Creates a separator row
 * 
 * @param char - Character to use for separator (default: '═')
 * @param width - Width of separator (default: 40)
 * @returns Separator row string
 */
export function createSeparator(char: string = '═', width: number = 40): string {
  return char.repeat(width).substring(0, width).padEnd(width, ' ');
}

/**
 * Truncates text to specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param addEllipsis - Whether to add ellipsis (default: true)
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, addEllipsis: boolean = true): string {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  if (addEllipsis) {
    return text.slice(0, maxLength - 3) + '...';
  }
  
  return text.slice(0, maxLength);
}

/**
 * Wraps text to multiple lines with specified width
 * 
 * @param text - Text to wrap
 * @param maxWidth - Maximum width per line
 * @returns Array of wrapped lines
 */
export function wrapText(text: string, maxWidth: number): string[] {
  if (!text) return [];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      // If single word is longer than maxWidth, truncate it
      if (word.length > maxWidth) {
        lines.push(word.substring(0, maxWidth - 3) + '...');
        currentLine = '';
      } else {
        currentLine = word;
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Centers text within specified width
 * 
 * @param text - Text to center
 * @param width - Target width (default: 40)
 * @returns Centered text
 */
export function centerText(text: string, width: number = 40): string {
  if (text.length >= width) {
    return text.substring(0, width);
  }
  
  const leftPadding = Math.floor((width - text.length) / 2);
  const rightPadding = width - text.length - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}

/**
 * Strips color codes and calculates visible length
 */
function getVisibleLength(text: string): number {
  // Remove color codes like {red}, {green}, etc.
  let cleaned = text.replace(/\{(red|green|yellow|blue|magenta|cyan|white|black)\}/gi, '');
  
  // Count emojis as 2 characters (they take up 2 character widths in monospace)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = cleaned.match(emojiRegex) || [];
  const emojiCount = emojis.length;
  
  // Remove emojis to count regular characters
  const withoutEmojis = cleaned.replace(emojiRegex, '');
  
  // Total visible length = regular chars + (emojis * 2)
  return withoutEmojis.length + (emojiCount * 2);
}

/**
 * Pads rows array to exactly 24 rows, each exactly 40 visible characters
 * 
 * @param rows - Array of rows to pad
 * @returns Padded rows array
 */
export function padRows(rows: string[]): string[] {
  const paddedRows = rows.map(row => {
    const visibleLength = getVisibleLength(row);
    
    if (visibleLength > 40) {
      // Truncate to 40 characters (rough approximation)
      return row.substring(0, 40);
    } else if (visibleLength < 40) {
      // Pad to exactly 40 visible characters
      const paddingNeeded = 40 - visibleLength;
      return row + ' '.repeat(paddingNeeded);
    }
    
    return row;
  });

  // Ensure exactly 24 rows
  while (paddedRows.length < 24) {
    paddedRows.push(''.padEnd(40, ' '));
  }

  // CRITICAL: Always return exactly 24 rows, truncate if necessary
  return paddedRows.slice(0, 24);
}

/**
 * Strips HTML tags from text
 * 
 * @param html - HTML string
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  let text = html.replace(/<[^>]*>/g, '');
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
 * Decodes HTML entities
 * 
 * @param html - HTML string with entities
 * @returns Decoded text
 */
export function decodeHtml(html: string): string {
  return stripHtml(html);
}
