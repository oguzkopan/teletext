/**
 * Navigation Indicators Component
 * 
 * Provides visual indicators for navigation including breadcrumbs, page position,
 * arrow indicators, input buffer display, and contextual help.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { padText, truncateText, getColorEmoji, formatColoredButtonIndicators } from './teletext-utils';
import {
  determineCacheStatus,
  formatTimestampWithStatus,
  shouldDisplayTimestamp
} from './timestamp-cache-status';

/**
 * Page type for contextual help generation
 */
export type PageType = 'index' | 'content' | 'ai-menu' | 'quiz' | 'settings' | 'news' | 'sport' | 'markets' | 'weather' | 'games';

/**
 * Navigation Indicators class
 */
export class NavigationIndicators {
  /**
   * Render breadcrumb trail from navigation history
   * 
   * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
   * 
   * @param history - Array of page numbers in navigation history
   * @returns Formatted breadcrumb string
   */
  renderBreadcrumbs(history: string[]): string {
    // Special case: empty history or on index page
    if (history.length === 0 || (history.length === 1 && history[0] === '100')) {
      return 'INDEX';
    }

    // If history is 3 or fewer pages, show all
    if (history.length <= 3) {
      return history.join(' > ');
    }

    // Show last 3 pages with ellipsis for longer histories
    const last3 = history.slice(-3);
    return `... > ${last3.join(' > ')}`;
  }

  /**
   * Render page position indicator for multi-page content
   * 
   * Requirements: 3.5
   * 
   * @param current - Current page number (1-based)
   * @param total - Total number of pages
   * @returns Formatted page position string
   */
  renderPagePosition(current: number, total: number): string {
    return `Page ${current}/${total}`;
  }

  /**
   * Render arrow indicators for multi-page content
   * 
   * Requirements: 3.1, 3.2, 3.3, 3.4
   * 
   * @param up - Whether up arrow navigation is available
   * @param down - Whether down arrow navigation is available
   * @returns Array of indicator strings
   */
  renderArrowIndicators(up: boolean, down: boolean): string[] {
    const indicators: string[] = [];

    if (up) {
      indicators.push('▲ Press ↑ for previous');
    }

    if (down) {
      indicators.push('▼ Press ↓ for more');
    } else if (!up) {
      // Only show END if we're not showing any arrows
      indicators.push('END OF CONTENT');
    }

    return indicators;
  }

  /**
   * Render input buffer display with highlighting
   * 
   * Requirements: 6.5, 8.4, 15.1
   * 
   * @param digits - Current input buffer digits
   * @param maxLength - Maximum expected input length (1, 2, or 3)
   * @returns Formatted input buffer string
   */
  renderInputBuffer(digits: string, maxLength: number = 3): string {
    if (!digits) {
      // Show format hint when buffer is empty
      const hint = maxLength === 1 ? 'Enter digit' : 
                   maxLength === 2 ? 'Enter 2 digits' : 
                   'Enter 3-digit page';
      return hint;
    }

    // Display entered digits with blinking cursor
    const cursor = '█'; // Block cursor
    return `${digits}${cursor}`;
  }

  /**
   * Render contextual help based on page type
   * 
   * Requirements: 11.2, 11.3, 11.4, 11.5
   * 
   * @param pageType - Type of the current page
   * @param hasArrowNav - Whether arrow navigation is available
   * @param hasColoredButtons - Whether colored buttons are available
   * @returns Array of help strings
   */
  renderContextualHelp(pageType: PageType, hasArrowNav: boolean = false, hasColoredButtons: boolean = false): string[] {
    const helpMap: Record<PageType, string[]> = {
      'index': hasColoredButtons ? ['Enter page number'] : ['Enter page number or use colored buttons'],
      'content': hasArrowNav ? ['100=INDEX  ↑↓=SCROLL  BACK=PREVIOUS'] : ['100=INDEX  BACK=PREVIOUS'],
      'ai-menu': ['Enter number to select option'],
      'quiz': ['Enter 1-4 to answer'],
      'settings': ['Enter number to change setting'],
      'news': hasArrowNav ? ['100=INDEX  ↑↓=SCROLL'] : ['100=INDEX'],
      'sport': hasArrowNav ? ['100=INDEX  ↑↓=SCROLL'] : ['100=INDEX'],
      'markets': hasArrowNav ? ['100=INDEX  ↑↓=SCROLL'] : ['100=INDEX'],
      'weather': ['100=INDEX  Enter location code'],
      'games': ['Enter number to select game']
    };

    return helpMap[pageType] || ['Press 100 for INDEX'];
  }

  /**
   * Format page number with consistent left-alignment
   * 
   * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
   * 
   * @param pageNumber - Page number (1-3 digits)
   * @param label - Label text for the option
   * @param maxWidth - Maximum width for the formatted string
   * @returns Formatted navigation option string
   */
  formatPageNumber(pageNumber: number | string, label: string, maxWidth: number = 40): string {
    const numStr = pageNumber.toString();
    
    // Format: "NNN. Label text"
    // All page numbers left-aligned, followed by period and space
    const formatted = `${numStr}. ${label}`;
    
    // Truncate if necessary
    return truncateText(formatted, maxWidth, false);
  }

  /**
   * Format multiple navigation options with consistent alignment
   * 
   * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
   * 
   * @param options - Array of {page, label} objects
   * @param maxWidth - Maximum width for each line
   * @returns Array of formatted option strings
   */
  formatNavigationOptions(
    options: Array<{ page: number | string; label: string }>,
    maxWidth: number = 40
  ): string[] {
    return options.map(opt => this.formatPageNumber(opt.page, opt.label, maxWidth));
  }

  /**
   * Create a navigation hint line for footer
   * 
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
   * 
   * @param hints - Array of hint strings
   * @param coloredButtons - Optional colored button indicators
   * @param maxWidth - Maximum width for the line
   * @returns Formatted navigation hint string
   */
  createNavigationHint(
    hints: string[],
    coloredButtons?: Array<{ color: string; label: string }>,
    maxWidth: number = 40
  ): string {
    let hintText = hints.join('  ');

    // Add colored button indicators if available
    // Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
    if (coloredButtons && coloredButtons.length > 0) {
      const buttonHints = coloredButtons.map(btn => {
        const colorEmoji = getColorEmoji(btn.color);
        return `${colorEmoji}${btn.label}`;
      }).join(' ');

      // Combine hints and buttons
      const combined = hintText ? `${hintText}  ${buttonHints}` : buttonHints;
      hintText = combined;
    }

    // Truncate if necessary and pad to width
    return padText(truncateText(hintText, maxWidth, false), maxWidth, 'left');
  }

  /**
   * Render colored button indicators for footer
   * 
   * Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
   * 
   * @param coloredButtons - Array of colored button configurations
   * @param maxWidth - Maximum width for the indicator line
   * @returns Formatted colored button indicator string
   */
  renderColoredButtonIndicators(
    coloredButtons: Array<{ color: string; label: string; page?: string }>,
    maxWidth: number = 40
  ): string {
    if (!coloredButtons || coloredButtons.length === 0) {
      return '';
    }

    // Use utility function to format colored button indicators
    const buttonIndicators = formatColoredButtonIndicators(coloredButtons, maxWidth);
    
    // Pad to width
    return padText(buttonIndicators, maxWidth, 'left');
  }



  /**
   * Create a complete footer with navigation indicators
   * 
   * Requirements: 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4, 26.1, 26.2, 26.3, 26.4, 26.5
   * 
   * @param pageType - Type of the current page
   * @param options - Navigation options
   * @returns Array of footer rows (typically 2 rows)
   */
  createFooter(
    pageType: PageType,
    options: {
      hasArrowNav?: boolean;
      arrowUp?: boolean;
      arrowDown?: boolean;
      coloredButtons?: Array<{ color: string; label: string; page?: string }>;
      customHints?: string[];
      showColoredButtonsOnly?: boolean; // Option to show only colored buttons
    } = {}
  ): string[] {
    const footer: string[] = [];

    // Get contextual help
    const hasColoredButtons = options.coloredButtons && options.coloredButtons.length > 0;
    
    // Add separator
    footer.push('─'.repeat(40));

    // Requirements: 8.2, 26.1, 26.2, 26.3, 26.4, 26.5
    // If we have colored buttons and should show them prominently
    if (hasColoredButtons && options.showColoredButtonsOnly) {
      // Show only colored button indicators
      const buttonLine = this.renderColoredButtonIndicators(options.coloredButtons!, 40);
      footer.push(buttonLine);
    } else {
      // Standard footer with hints and colored buttons
      const helpArray = options.customHints || this.renderContextualHelp(pageType, options.hasArrowNav, hasColoredButtons);
      const help = [...helpArray]; // Create a copy to avoid mutating the original

      // Add arrow indicators if available
      if (options.hasArrowNav && (options.arrowUp || options.arrowDown)) {
        const arrowIndicators = this.renderArrowIndicators(
          options.arrowUp || false,
          options.arrowDown || false
        );
        help.push(...arrowIndicators);
      }

      // Create navigation hint line with colored buttons
      const hintLine = this.createNavigationHint(help, options.coloredButtons);
      footer.push(hintLine);
    }

    return footer;
  }

  /**
   * Create a header with breadcrumbs and page position
   * 
   * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 3.5
   * 
   * @param title - Page title
   * @param pageNumber - Page number
   * @param options - Header options
   * @returns Array of header rows (typically 2 rows)
   */
  createHeader(
    title: string,
    pageNumber: string,
    options: {
      breadcrumbs?: string[];
      pagePosition?: { current: number; total: number };
      contentType?: string;
      timestamp?: string;
      cacheStatus?: 'LIVE' | 'CACHED';
    } = {}
  ): string[] {
    const header: string[] = [];

    // Row 0: Title and page number with optional content type icon and color
    const contentTypeIcon = options.contentType ? this.getContentTypeIcon(options.contentType) : '';
    const contentTypeColor = options.contentType ? this.getContentTypeColor(options.contentType) : '';
    
    // Apply color coding to content type indicator
    const titlePrefix = contentTypeIcon && contentTypeColor 
      ? `{${contentTypeColor}}${contentTypeIcon}{white} ` 
      : contentTypeIcon 
      ? `${contentTypeIcon} ` 
      : '';
    
    const titleText = truncateText(titlePrefix + title.toUpperCase(), 28);
    const pageNum = `P${pageNumber}`;
    
    header.push(padText(titleText, 28) + pageNum.padStart(12));

    // Row 1: Breadcrumbs or separator with metadata
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      const breadcrumbText = this.renderBreadcrumbs(options.breadcrumbs);
      header.push(padText(breadcrumbText, 40, 'left'));
    } else if (options.pagePosition) {
      // Show page position for multi-page content
      const position = this.renderPagePosition(options.pagePosition.current, options.pagePosition.total);
      const separator = '═'.repeat(40 - position.length - 1);
      header.push(separator + ' ' + position);
    } else if (options.timestamp && shouldDisplayTimestamp(options.contentType)) {
      // Determine cache status if not provided
      const cacheStatus = options.cacheStatus || determineCacheStatus(
        options.timestamp,
        options.contentType
      );
      
      // Format timestamp with status
      const statusText = formatTimestampWithStatus(options.timestamp, cacheStatus);
      const separator = '═'.repeat(40 - statusText.length - 1);
      header.push(separator + ' ' + statusText);
    } else {
      header.push('═'.repeat(40));
    }

    return header;
  }

  /**
   * Get content type icon
   * 
   * @param contentType - Content type
   * @returns Icon emoji
   */
  private getContentTypeIcon(contentType: string): string {
    const iconMap: Record<string, string> = {
      NEWS: '📰',
      SPORT: '⚽',
      MARKETS: '📈',
      AI: '🤖',
      GAMES: '🎮',
      WEATHER: '🌤️',
      SETTINGS: '⚙️',
      DEV: '🔧'
    };

    return iconMap[contentType.toUpperCase()] || '';
  }

  /**
   * Get content type color
   * 
   * @param contentType - Content type
   * @returns Color name for teletext color codes
   */
  private getContentTypeColor(contentType: string): string {
    const colorMap: Record<string, string> = {
      NEWS: 'red',
      SPORT: 'green',
      MARKETS: 'yellow',
      AI: 'cyan',
      GAMES: 'magenta',
      WEATHER: 'blue',
      SETTINGS: 'white',
      DEV: 'yellow'
    };

    return colorMap[contentType.toUpperCase()] || 'white';
  }
}

/**
 * Default navigation indicators instance
 */
export const navigationIndicators = new NavigationIndicators();
