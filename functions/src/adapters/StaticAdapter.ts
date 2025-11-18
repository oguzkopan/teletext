// Static page adapter for system pages (100-199)

import { ContentAdapter, TeletextPage } from '../types';

/**
 * StaticAdapter serves static system pages
 * This is a basic implementation that will be expanded in later tasks
 */
export class StaticAdapter implements ContentAdapter {
  /**
   * Retrieves a static page
   * @param pageId - The page ID to retrieve
   * @returns A TeletextPage object
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // For now, return placeholder pages
    // These will be replaced with actual content from Firebase Storage in later tasks
    switch (pageNumber) {
      case 100:
        return this.getIndexPage();
      
      case 404:
        return this.getErrorPage();
      
      default:
        return this.getPlaceholderPage(pageId);
    }
  }

  /**
   * Gets the cache key for a page
   * @param pageId - The page ID
   * @returns The cache key
   */
  getCacheKey(pageId: string): string {
    return `static_${pageId}`;
  }

  /**
   * Gets the cache duration for static pages
   * Static pages are cached indefinitely (1 year)
   * @returns Cache duration in seconds
   */
  getCacheDuration(): number {
    return 31536000; // 1 year
  }

  /**
   * Creates the main index page (100)
   */
  private getIndexPage(): TeletextPage {
    const rows = [
      'MODERN TELETEXT              P100',
      '════════════════════════════════════',
      '',
      'MAIN INDEX',
      '',
      '1xx SYSTEM PAGES',
      '2xx NEWS & CURRENT AFFAIRS',
      '3xx SPORT',
      '4xx MARKETS & FINANCE',
      '5xx AI ORACLE',
      '6xx GAMES & ENTERTAINMENT',
      '7xx SETTINGS & PREFERENCES',
      '8xx DEVELOPER TOOLS',
      '',
      'QUICK ACCESS:',
      '101 How it works',
      '120 Emergency bulletins',
      '199 About & credits',
      '999 Help',
      '',
      '',
      '',
      'NEWS    SPORT   MARKETS AI',
      ''
    ];

    return {
      id: '100',
      title: 'Main Index',
      rows: this.padRows(rows),
      links: [
        { label: 'NEWS', targetPage: '200', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' },
        { label: 'MARKETS', targetPage: '400', color: 'yellow' },
        { label: 'AI', targetPage: '500', color: 'blue' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates a 404 error page
   */
  private getErrorPage(): TeletextPage {
    const rows = [
      'ERROR                        P404',
      '════════════════════════════════════',
      '',
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
      '    █ 4 0 4   E R R O R █',
      '    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      '',
      'PAGE NOT FOUND',
      '',
      'The page you requested does not',
      'exist in the system.',
      '',
      'This could mean:',
      '• The page number is invalid',
      '• The content is not yet available',
      '• You have discovered a glitch...',
      '',
      'Press 100 to return to index',
      'Press 999 for help',
      '',
      '',
      '',
      'INDEX   HELP',
      ''
    ];

    return {
      id: '404',
      title: 'Page Not Found',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '999', color: 'green' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `PAGE ${pageId}                    P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Page ${pageId} is under construction.`,
      '',
      'This page will be available in a',
      'future update.',
      '',
      'Thank you for your patience!',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 100 to return to index',
      '',
      '',
      '',
      'INDEX',
      ''
    ];

    return {
      id: pageId,
      title: `Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    // Ensure exactly 24 rows
    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
