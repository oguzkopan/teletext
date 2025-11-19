// Developer tools adapter for pages 800-899
// Provides API explorer, raw JSON views, and documentation

import { ContentAdapter, TeletextPage } from '../types';

/**
 * DevAdapter serves developer tools pages (800-899)
 * Includes API explorer, raw JSON views, and documentation
 */
export class DevAdapter implements ContentAdapter {
  // Store the current page context for page 801 (raw JSON view)
  private static currentPageContext: TeletextPage | null = null;

  /**
   * Sets the current page context for raw JSON viewing
   * This should be called by the router before serving page 801
   */
  static setCurrentPageContext(page: TeletextPage | null): void {
    DevAdapter.currentPageContext = page;
  }

  /**
   * Retrieves a developer tools page
   * @param pageId - The page ID to retrieve (800-899)
   * @param params - Optional parameters (e.g., currentPage for 801)
   * @returns A TeletextPage object
   */
  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific dev pages
    switch (pageNumber) {
      case 800:
        return this.getAPIExplorerIndex();
      
      case 801:
        return this.getRawJSONPage(params?.currentPage);
      
      case 802:
        return this.getAPIDocumentation();
      
      case 803:
        return this.getExampleRequests();
      
      default:
        // For other pages in 800-899 range, return placeholder
        if (pageNumber >= 800 && pageNumber < 900) {
          return this.getPlaceholderPage(pageId);
        }
        throw new Error(`Invalid dev page: ${pageId}`);
    }
  }

  /**
   * Gets the cache key for a page
   * @param pageId - The page ID
   * @returns The cache key
   */
  getCacheKey(pageId: string): string {
    return `dev_${pageId}`;
  }

  /**
   * Gets the cache duration for dev pages
   * Dev pages are not cached (0 seconds) as they may show dynamic content
   * @returns Cache duration in seconds
   */
  getCacheDuration(): number {
    return 0; // No caching for dev tools
  }

  /**
   * Creates the API explorer index page (800)
   */
  private getAPIExplorerIndex(): TeletextPage {
    const rows = [
      'API EXPLORER                 P800',
      '════════════════════════════════════',
      '',
      'DEVELOPER TOOLS',
      '',
      '801 Raw JSON of current page',
      '802 API endpoint documentation',
      '803 Example API requests',
      '',
      'ABOUT THIS SYSTEM:',
      '',
      'Modern Teletext uses a REST API',
      'architecture with Firebase Cloud',
      'Functions serving content adapters.',
      '',
      'Each page is a JSON object with:',
      '• id: Page number (string)',
      '• title: Page title',
      '• rows: Array of 24 strings (40 chars)',
      '• links: Navigation links',
      '• meta: Metadata (source, cache, etc.)',
      '',
      '',
      'INDEX   JSON    DOCS    EXAMPLES',
      ''
    ];

    return {
      id: '800',
      title: 'API Explorer',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'JSON', targetPage: '801', color: 'green' },
        { label: 'DOCS', targetPage: '802', color: 'yellow' },
        { label: 'EXAMPLES', targetPage: '803', color: 'blue' }
      ],
      meta: {
        source: 'DevAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the raw JSON page (801)
   * Shows the JSON representation of the current or specified page
   */
  private getRawJSONPage(currentPage?: TeletextPage): TeletextPage {
    let jsonContent: string;
    let pageTitle: string;

    if (currentPage) {
      // Format the current page as JSON
      jsonContent = JSON.stringify(currentPage, null, 2);
      pageTitle = `JSON: Page ${currentPage.id}`;
    } else if (DevAdapter.currentPageContext) {
      // Use stored context
      jsonContent = JSON.stringify(DevAdapter.currentPageContext, null, 2);
      pageTitle = `JSON: Page ${DevAdapter.currentPageContext.id}`;
    } else {
      // No page context available, show example
      const examplePage: TeletextPage = {
        id: '100',
        title: 'Example Page',
        rows: Array(24).fill(''.padEnd(40, ' ')),
        links: [
          { label: 'TEST', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'ExampleAdapter',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh'
        }
      };
      jsonContent = JSON.stringify(examplePage, null, 2);
      pageTitle = 'JSON: Example';
    }

    // Format JSON to fit 40-character width
    const formattedLines = this.formatJSON(jsonContent);

    const rows = [
      'RAW JSON                     P801',
      '════════════════════════════════════',
      pageTitle.substring(0, 40).padEnd(40, ' '),
      ''
    ];

    // Add formatted JSON lines (up to 18 lines to leave room for footer)
    const jsonLines = formattedLines.slice(0, 18);
    rows.push(...jsonLines);

    // If there are more lines, indicate continuation
    if (formattedLines.length > 18) {
      rows.push(`... (${formattedLines.length - 18} more lines)`);
    }

    return {
      id: '801',
      title: 'Raw JSON',
      rows: this.padRows(rows),
      links: [
        { label: 'BACK', targetPage: '800', color: 'red' },
        { label: 'DOCS', targetPage: '802', color: 'green' },
        { label: 'EXAMPLES', targetPage: '803', color: 'yellow' },
        { label: 'INDEX', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'DevAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the API documentation page (802)
   */
  private getAPIDocumentation(): TeletextPage {
    const rows = [
      'API DOCUMENTATION            P802',
      '════════════════════════════════════',
      '',
      'ENDPOINTS:',
      '',
      'GET /api/page/:id',
      '  Retrieves a teletext page by ID',
      '  Parameters:',
      '    id: Page number (100-899)',
      '  Returns: PageResponse object',
      '',
      'POST /api/ai',
      '  Processes AI requests',
      '  Body: AIRequest object',
      '  Returns: AIResponse with pages',
      '',
      'PAGE RANGES:',
      '100-199: System (StaticAdapter)',
      '200-299: News (NewsAdapter)',
      '300-399: Sports (SportsAdapter)',
      '400-499: Markets/Weather',
      '500-599: AI (AIAdapter)',
      '600-699: Games (GamesAdapter)',
      '700-799: Settings (SettingsAdapter)',
      '800-899: Dev Tools (DevAdapter)',
      '',
      '',
      'BACK    EXAMPLES',
      ''
    ];

    return {
      id: '802',
      title: 'API Documentation',
      rows: this.padRows(rows),
      links: [
        { label: 'BACK', targetPage: '800', color: 'red' },
        { label: 'EXAMPLES', targetPage: '803', color: 'green' }
      ],
      meta: {
        source: 'DevAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the example requests page (803)
   */
  private getExampleRequests(): TeletextPage {
    const rows = [
      'EXAMPLE REQUESTS             P803',
      '════════════════════════════════════',
      '',
      'GET PAGE REQUEST:',
      '',
      'GET /api/page/201',
      '',
      'Response:',
      '{',
      '  "success": true,',
      '  "page": {',
      '    "id": "201",',
      '    "title": "Top Headlines",',
      '    "rows": [...],',
      '    "links": [...],',
      '    "meta": {...}',
      '  }',
      '}',
      '',
      'See page 801 for full JSON structure',
      'of any page.',
      '',
      '',
      '',
      'BACK    DOCS    JSON',
      ''
    ];

    return {
      id: '803',
      title: 'Example Requests',
      rows: this.padRows(rows),
      links: [
        { label: 'BACK', targetPage: '800', color: 'red' },
        { label: 'DOCS', targetPage: '802', color: 'green' },
        { label: 'JSON', targetPage: '801', color: 'yellow' }
      ],
      meta: {
        source: 'DevAdapter',
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
      `DEV PAGE ${pageId}               P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Developer page ${pageId} is under`,
      'construction.',
      '',
      'This page will be available in a',
      'future update.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 800 for dev tools index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   DEV',
      ''
    ];

    return {
      id: pageId,
      title: `Dev Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'DEV', targetPage: '800', color: 'green' }
      ],
      meta: {
        source: 'DevAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Formats JSON to fit within 40-character width with syntax highlighting
   * Uses teletext color codes for different JSON elements
   */
  private formatJSON(json: string): string[] {
    const lines: string[] = [];
    const jsonLines = json.split('\n');

    for (const line of jsonLines) {
      // If line is <= 40 chars, add it as-is
      if (line.length <= 40) {
        lines.push(line.padEnd(40, ' '));
      } else {
        // Split long lines at 40 characters
        let remaining = line;
        while (remaining.length > 0) {
          const chunk = remaining.substring(0, 40);
          lines.push(chunk.padEnd(40, ' '));
          remaining = remaining.substring(40);
          
          // Add indentation for continuation lines
          if (remaining.length > 0) {
            remaining = '  ' + remaining.trimStart();
          }
        }
      }
    }

    return lines;
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
