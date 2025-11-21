/**
 * Layout Manager for Full-Screen Teletext Utilization
 * 
 * Manages the layout of teletext pages to maximize screen space utilization,
 * create consistent headers and footers, and provide clear navigation indicators.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { TeletextPage, PageLink } from '@/types/teletext';
import { padText, centerText, justifyText, truncateText, createSeparator, getColorEmoji } from './teletext-utils';
import {
  determineCacheStatus,
  formatTimestampWithStatus,
  shouldDisplayTimestamp,
  getContentTypeFromPageId
} from './timestamp-cache-status';

/**
 * Layout configuration options
 */
export interface LayoutOptions {
  fullScreen: boolean;        // Use all 24 rows
  headerRows: number;          // Rows reserved for header (default: 2)
  footerRows: number;          // Rows reserved for footer (default: 2)
  contentAlignment: 'left' | 'center' | 'justify';
  showBreadcrumbs: boolean;
  showPageIndicator: boolean;
}

/**
 * Result of layout calculation
 */
export interface LayoutResult {
  header: string[];     // Formatted header rows
  content: string[];    // Formatted content rows
  footer: string[];     // Formatted footer rows
  totalRows: number;    // Should equal 24
}

/**
 * Header metadata for page headers
 */
export interface HeaderMetadata {
  pageNumber: string;
  title: string;
  timestamp?: string;
  cacheStatus?: 'LIVE' | 'CACHED';
  breadcrumbs?: string[];
  pagePosition?: { current: number; total: number };
  contentType?: 'NEWS' | 'SPORT' | 'MARKETS' | 'AI' | 'GAMES' | 'WEATHER' | 'SETTINGS' | 'DEV';
}

/**
 * Navigation options for page footers
 */
export interface NavigationOptions {
  backToIndex: boolean;
  coloredButtons?: { color: string; label: string; page: string }[];
  arrowNavigation?: { up?: string; down?: string };
  customHints?: string[];
}

/**
 * Content type icons for visual indicators
 */
const CONTENT_TYPE_ICONS: Record<string, string> = {
  NEWS: '📰',
  SPORT: '⚽',
  MARKETS: '📈',
  AI: '🤖',
  GAMES: '🎮',
  WEATHER: '🌤️',
  SETTINGS: '⚙️',
  DEV: '🔧'
};

/**
 * Content type color codes (teletext color names)
 * These colors will be applied to the content type indicator in headers
 */
export const CONTENT_TYPE_COLORS: Record<string, string> = {
  NEWS: 'red',        // Red for news (urgency, breaking news)
  SPORT: 'green',     // Green for sports (field, pitch)
  MARKETS: 'yellow',  // Yellow for markets (gold, money)
  AI: 'cyan',         // Cyan for AI (technology, futuristic)
  GAMES: 'magenta',   // Magenta for games (fun, playful)
  WEATHER: 'blue',    // Blue for weather (sky, water)
  SETTINGS: 'white',  // White for settings (neutral, clean)
  DEV: 'yellow'       // Yellow for dev (caution, technical)
};

/**
 * Layout Manager class for full-screen utilization
 */
export class LayoutManager {
  /**
   * Calculate optimal layout for a teletext page
   * 
   * @param page - The teletext page to layout
   * @param options - Layout configuration options
   * @returns Layout result with header, content, and footer
   */
  calculateLayout(page: TeletextPage, options: LayoutOptions): LayoutResult {
    // Create header
    const header = this.createHeader(page.title, {
      pageNumber: page.id,
      title: page.title,
      timestamp: page.meta?.lastUpdated,
      cacheStatus: page.meta?.cacheStatus === 'cached' ? 'CACHED' : 'LIVE',
      breadcrumbs: [], // Will be populated by navigation system
      pagePosition: page.meta?.continuation ? {
        current: page.meta.continuation.currentIndex + 1,
        total: page.meta.continuation.totalPages
      } : undefined,
      contentType: this.getContentType(page.id)
    });

    // Create footer
    const footer = this.createFooter({
      backToIndex: true,
      coloredButtons: page.links.filter(l => l.color).map(l => ({
        color: l.color!,
        label: l.label,
        page: l.targetPage
      })),
      arrowNavigation: page.meta?.continuation ? {
        up: page.meta.continuation.previousPage,
        down: page.meta.continuation.nextPage
      } : undefined,
      customHints: []
    });

    // Calculate available rows for content
    const availableRows = 24 - header.length - footer.length;

    // Optimize content spacing
    const content = this.optimizeSpacing(page.rows, availableRows, options.contentAlignment);

    return {
      header,
      content,
      footer,
      totalRows: header.length + content.length + footer.length
    };
  }

  /**
   * Optimize content spacing to fit available rows
   * 
   * @param content - Array of content rows
   * @param maxRows - Maximum rows available
   * @param alignment - Content alignment
   * @returns Optimized content rows
   */
  optimizeSpacing(content: string[], maxRows: number, alignment: 'left' | 'center' | 'justify' = 'left'): string[] {
    const result: string[] = [];

    // Take up to maxRows of content
    const contentToUse = content.slice(0, maxRows);

    // Apply alignment to each row
    for (const row of contentToUse) {
      switch (alignment) {
        case 'center':
          result.push(this.centerText(row, 40));
          break;
        case 'justify':
          result.push(this.justifyText(row, 40));
          break;
        case 'left':
        default:
          result.push(padText(row, 40, 'left'));
          break;
      }
    }

    // Pad to exactly maxRows
    while (result.length < maxRows) {
      result.push(''.padEnd(40));
    }

    return result;
  }

  /**
   * Center text within specified width
   * 
   * @param text - Text to center
   * @param width - Target width
   * @returns Centered text
   */
  centerText(text: string, width: number = 40): string {
    return centerText(text, width);
  }

  /**
   * Justify text to fill specified width
   * 
   * @param text - Text to justify
   * @param width - Target width
   * @returns Justified text
   */
  justifyText(text: string, width: number = 40): string {
    return justifyText(text, width);
  }

  /**
   * Create page header with metadata
   * 
   * @param title - Page title
   * @param metadata - Header metadata
   * @returns Array of header rows
   */
  createHeader(title: string, metadata: HeaderMetadata): string[] {
    const header: string[] = [];

    // Row 0: Title and page number with content type indicator
    const contentTypeIcon = metadata.contentType ? CONTENT_TYPE_ICONS[metadata.contentType] || '' : '';
    const contentTypeColor = metadata.contentType ? CONTENT_TYPE_COLORS[metadata.contentType] || '' : '';
    
    // Apply color coding to content type indicator
    const titlePrefix = contentTypeIcon && contentTypeColor 
      ? `{${contentTypeColor}}${contentTypeIcon}{white} ` 
      : contentTypeIcon 
      ? `${contentTypeIcon} ` 
      : '';
    
    const titleText = truncateText(titlePrefix + title.toUpperCase(), 28);
    const pageNum = `P${metadata.pageNumber}`;
    
    header.push(padText(titleText, 28) + pageNum.padStart(12));

    // Row 1: Separator with optional metadata
    if (metadata.pagePosition) {
      // Show page position for multi-page content
      const position = `${metadata.pagePosition.current}/${metadata.pagePosition.total}`;
      const separator = createSeparator('═', 40 - position.length - 1);
      header.push(separator + ' ' + position);
    } else if (metadata.timestamp && shouldDisplayTimestamp(metadata.contentType)) {
      // Determine cache status if not provided
      const cacheStatus = metadata.cacheStatus || determineCacheStatus(
        metadata.timestamp,
        metadata.contentType
      );
      
      // Format timestamp with status
      const statusText = formatTimestampWithStatus(metadata.timestamp, cacheStatus);
      const separator = createSeparator('═', 40 - statusText.length - 1);
      header.push(separator + ' ' + statusText);
    } else {
      header.push(createSeparator('═', 40));
    }

    return header;
  }

  /**
   * Create page footer with navigation hints
   * 
   * Requirements: 8.1, 8.2, 8.3, 8.4, 26.1, 26.2, 26.3, 26.4, 26.5
   * 
   * @param navigation - Navigation options
   * @returns Array of footer rows
   */
  createFooter(navigation: NavigationOptions): string[] {
    const footer: string[] = [];

    // Build navigation hints
    const hints: string[] = [];

    // Add back to index hint
    if (navigation.backToIndex) {
      hints.push('100=INDEX');
    }

    // Add arrow navigation hints
    if (navigation.arrowNavigation) {
      if (navigation.arrowNavigation.up && navigation.arrowNavigation.down) {
        hints.push('↑↓=SCROLL');
      } else if (navigation.arrowNavigation.down) {
        hints.push('↓=MORE');
      } else if (navigation.arrowNavigation.up) {
        hints.push('↑=BACK');
      }
    }

    // Add custom hints
    if (navigation.customHints && navigation.customHints.length > 0) {
      hints.push(...navigation.customHints);
    }

    // Row 22: Separator
    footer.push(createSeparator('─', 40));

    // Row 23: Navigation hints and colored buttons
    // Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
    let footerText = hints.join('  ');

    // Add colored button indicators if available
    if (navigation.coloredButtons && navigation.coloredButtons.length > 0) {
      const buttonHints = navigation.coloredButtons.map(btn => {
        const colorEmoji = getColorEmoji(btn.color);
        // Truncate label to fit (max 8 chars per button)
        const label = truncateText(btn.label.toUpperCase(), 8, false);
        return `${colorEmoji}${label}`;
      }).join(' ');

      // Combine hints and buttons, truncating if necessary
      const combined = footerText ? `${footerText}  ${buttonHints}` : buttonHints;
      footerText = truncateText(combined, 40, false);
    }

    footer.push(padText(footerText, 40, 'left'));

    return footer;
  }

  /**
   * Get content type from page number
   * 
   * @param pageId - Page ID
   * @returns Content type or undefined
   */
  private getContentType(pageId: string): HeaderMetadata['contentType'] | undefined {
    const pageNum = parseInt(pageId, 10);

    if (pageNum >= 200 && pageNum < 300) return 'NEWS';
    if (pageNum >= 300 && pageNum < 400) return 'SPORT';
    // Check for weather pages first (specific range within markets)
    if (pageNum >= 450 && pageNum < 460) return 'WEATHER';
    if (pageNum >= 400 && pageNum < 500) return 'MARKETS';
    if (pageNum >= 500 && pageNum < 600) return 'AI';
    if (pageNum >= 600 && pageNum < 700) return 'GAMES';
    if (pageNum >= 700 && pageNum < 800) return 'SETTINGS';
    if (pageNum >= 800 && pageNum < 900) return 'DEV';

    return undefined;
  }



  /**
   * Validate that layout produces exactly 24 rows
   * 
   * @param layout - Layout result to validate
   * @returns True if valid, false otherwise
   */
  validateLayout(layout: LayoutResult): boolean {
    // Check total rows equals 24
    if (layout.totalRows !== 24) {
      return false;
    }

    // Check all rows are exactly 40 characters
    const allRows = [...layout.header, ...layout.content, ...layout.footer];
    
    if (allRows.length !== 24) {
      return false;
    }

    for (const row of allRows) {
      if (row.length !== 40) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Default layout manager instance
 */
export const layoutManager = new LayoutManager();
