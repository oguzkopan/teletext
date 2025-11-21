/**
 * Page Layout Processor
 * 
 * Processes teletext pages to apply full-screen layout with headers, footers,
 * breadcrumbs, and navigation indicators.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4
 */

import { TeletextPage } from '@/types/teletext';
import { LayoutManager, LayoutOptions, HeaderMetadata, NavigationOptions } from './layout-manager';
import { NavigationIndicators, PageType } from './navigation-indicators';

/**
 * Page layout processor options
 */
export interface PageLayoutProcessorOptions {
  breadcrumbs?: string[];
  enableFullScreen?: boolean;
  contentAlignment?: 'left' | 'center' | 'justify';
}

/**
 * Page Layout Processor class
 */
export class PageLayoutProcessor {
  private layoutManager: LayoutManager;
  private navigationIndicators: NavigationIndicators;

  constructor() {
    this.layoutManager = new LayoutManager();
    this.navigationIndicators = new NavigationIndicators();
  }

  /**
   * Process a teletext page to apply full-screen layout
   * 
   * @param page - The teletext page to process
   * @param options - Processing options
   * @returns Processed page with full-screen layout
   */
  processPage(page: TeletextPage, options: PageLayoutProcessorOptions = {}): TeletextPage {
    const {
      breadcrumbs = [],
      enableFullScreen = true,
      contentAlignment = 'left'
    } = options;

    // If full-screen layout is disabled, return page as-is
    if (!enableFullScreen) {
      return page;
    }

    // Determine page type for contextual help
    const pageType = this.getPageType(page.id);

    // Create custom header with breadcrumbs if needed
    const header = this.navigationIndicators.createHeader(
      page.title,
      page.id,
      {
        breadcrumbs: page.id === '100' ? [] : breadcrumbs,
        pagePosition: page.meta?.continuation ? {
          current: page.meta.continuation.currentIndex + 1,
          total: page.meta.continuation.totalPages
        } : undefined,
        contentType: this.getContentType(page.id),
        timestamp: page.meta?.lastUpdated,
        // Let the navigation indicators determine cache status automatically
        // based on timestamp and content type
        cacheStatus: undefined
      }
    );

    // Create custom footer with navigation hints
    const hasArrowNav = !!page.meta?.continuation;
    const footer = this.navigationIndicators.createFooter(
      pageType,
      {
        hasArrowNav,
        arrowUp: !!page.meta?.continuation?.previousPage,
        arrowDown: !!page.meta?.continuation?.nextPage,
        coloredButtons: page.links
          .filter(l => l.color)
          .map(l => ({
            color: l.color!,
            label: l.label
          }))
      }
    );

    // Calculate available rows for content (24 - header - footer)
    const availableRows = 24 - header.length - footer.length;

    // Optimize content spacing
    const content = this.layoutManager.optimizeSpacing(
      page.rows,
      availableRows,
      contentAlignment
    );

    // Combine header, content, and footer into final rows
    const processedRows = [
      ...header,
      ...content,
      ...footer
    ];

    // Ensure exactly 24 rows
    while (processedRows.length < 24) {
      processedRows.push(''.padEnd(40));
    }

    // Return processed page
    return {
      ...page,
      rows: processedRows.slice(0, 24)
    };
  }

  /**
   * Determine page type from page ID
   * 
   * @param pageId - Page ID
   * @returns Page type
   */
  private getPageType(pageId: string): PageType {
    const pageNum = parseInt(pageId, 10);

    if (pageNum === 100) return 'index';
    if (pageNum >= 200 && pageNum < 300) return 'news';
    if (pageNum >= 300 && pageNum < 400) return 'sport';
    if (pageNum >= 400 && pageNum < 500) return 'markets';
    if (pageNum >= 450 && pageNum < 460) return 'weather';
    if (pageNum >= 500 && pageNum < 600) return 'ai-menu';
    if (pageNum >= 600 && pageNum < 700) return 'games';
    if (pageNum >= 700 && pageNum < 800) return 'settings';

    return 'content';
  }

  /**
   * Create header metadata from page
   * 
   * @param page - Teletext page
   * @param breadcrumbs - Navigation breadcrumbs
   * @returns Header metadata
   */
  private createHeaderMetadata(page: TeletextPage, breadcrumbs: string[]): HeaderMetadata {
    return {
      pageNumber: page.id,
      title: page.title,
      timestamp: page.meta?.lastUpdated,
      cacheStatus: page.meta?.cacheStatus === 'cached' ? 'CACHED' : 'LIVE',
      breadcrumbs,
      pagePosition: page.meta?.continuation ? {
        current: page.meta.continuation.currentIndex + 1,
        total: page.meta.continuation.totalPages
      } : undefined,
      contentType: this.getContentType(page.id)
    };
  }

  /**
   * Create navigation options from page
   * 
   * @param page - Teletext page
   * @param pageType - Page type
   * @returns Navigation options
   */
  private createNavigationOptions(page: TeletextPage, pageType: PageType): NavigationOptions {
    const hasArrowNav = !!page.meta?.continuation;
    const hasColoredButtons = page.links.some(l => l.color);

    // Get contextual help
    const customHints = this.navigationIndicators.renderContextualHelp(
      pageType,
      hasArrowNav,
      hasColoredButtons
    );

    return {
      backToIndex: page.id !== '100',
      coloredButtons: page.links
        .filter(l => l.color)
        .map(l => ({
          color: l.color!,
          label: l.label,
          page: l.targetPage
        })),
      arrowNavigation: page.meta?.continuation ? {
        up: page.meta.continuation.previousPage,
        down: page.meta.continuation.nextPage
      } : undefined,
      customHints
    };
  }

  /**
   * Get content type from page ID
   * 
   * @param pageId - Page ID
   * @returns Content type
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
}

/**
 * Default page layout processor instance
 */
export const pageLayoutProcessor = new PageLayoutProcessor();

