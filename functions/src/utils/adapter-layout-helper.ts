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
 * This function creates a complete page with header, content, and footer.
 * The header is created here to prevent duplication.
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

  // Create header (2 rows)
  const header = createSimpleHeader(title, pageId);
  const separator = createSeparator();

  // Combine header + content
  const allRows = [
    header,
    separator,
    ...contentRows
  ];

  // Pad content rows to exactly 80 characters (full screen width)
  const paddedContent = allRows.map(row => {
    if (row.length > 80) {
      return row.substring(0, 80);
    }
    return row.padEnd(80, ' ');
  });

  // Ensure exactly 24 rows
  while (paddedContent.length < 24) {
    paddedContent.push(''.padEnd(80, ' '));
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
 * Creates a standardized header row with Kiroween branding
 * Format: {pageNumber} 🎃KIROWEEN🎃 {time} 🔴🟢🟡🔵
 * 
 * @param title - Page title (not used in compact format, kept for compatibility)
 * @param pageId - Page ID
 * @param maxTitleLength - Not used, kept for compatibility
 * @returns Header row string
 */
export function createSimpleHeader(title: string, pageId: string, maxTitleLength: number = 28): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Compact header format matching P100
  return `{cyan}${pageId} 🎃KIROWEEN🎃 ${timeStr} {red}🔴{green}🟢{yellow}🟡{blue}🔵`;
}

/**
 * Creates a separator row
 * 
 * @param char - Character to use for separator (default: '═')
 * @param width - Width of separator (default: 80 for full screen)
 * @returns Separator row string
 */
export function createSeparator(char: string = '═', width: number = 80): string {
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
 * @param width - Target width (default: 80 for full screen)
 * @returns Centered text
 */
export function centerText(text: string, width: number = 80): string {
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
 * Pads rows array to exactly 24 rows, each exactly 80 visible characters (full screen width)
 * 
 * @param rows - Array of rows to pad
 * @returns Padded rows array
 */
export function padRows(rows: string[]): string[] {
  const paddedRows = rows.map(row => {
    const visibleLength = getVisibleLength(row);
    
    if (visibleLength > 80) {
      // Truncate to 80 characters (rough approximation)
      return row.substring(0, 80);
    } else if (visibleLength < 80) {
      // Pad to exactly 80 visible characters
      const paddingNeeded = 80 - visibleLength;
      return row + ' '.repeat(paddingNeeded);
    }
    
    return row;
  });

  // Ensure exactly 24 rows
  while (paddedRows.length < 24) {
    paddedRows.push(''.padEnd(80, ' '));
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
