// Static page adapter for system pages (100-199)

import { ContentAdapter, TeletextPage } from '../types';
import { VertexAI } from '@google-cloud/vertexai';

/**
 * StaticAdapter serves static system pages (100-199)
 * Includes main index, help pages, emergency bulletins, and about pages
 */
export class StaticAdapter implements ContentAdapter {
  /**
   * Retrieves a static page
   * @param pageId - The page ID to retrieve
   * @param params - Optional parameters for dynamic content
   * @returns A TeletextPage object
   */
  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific static pages
    switch (pageNumber) {
      case 100:
        return this.getIndexPage();
      
      case 101:
        return this.getHowItWorksPage();
      
      case 120:
        return this.getEmergencyBulletinsPage();
      
      case 199:
        return this.getAboutCreditsPage();
      
      case 404:
        return this.getErrorPage();
      
      case 666:
        return this.getPage666(params);
      
      case 999:
        return this.getHelpPage();
      
      default:
        // For other pages in 100-199 range, return placeholder
        if (pageNumber >= 100 && pageNumber < 200) {
          return this.getPlaceholderPage(pageId);
        }
        // For pages outside this range, return 404
        return this.getErrorPage();
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
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
    const timeStr = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const rows = [
      'MODERN TELETEXT              P100',
      '════════════════════════════════════',
      `${dateStr} ${timeStr}`,
      '',
      'MAIN INDEX',
      '',
      '1xx SYSTEM PAGES',
      '2xx NEWS & CURRENT AFFAIRS',
      '3xx SPORT',
      '4xx MARKETS & FINANCE',
      '420 Weather forecasts',
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
      'NEWS    SPORT   WEATHER AI',
      ''
    ];

    return {
      id: '100',
      title: 'Main Index',
      rows: this.padRows(rows),
      links: [
        { label: 'NEWS', targetPage: '200', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' },
        { label: 'WEATHER', targetPage: '420', color: 'yellow' },
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
   * Creates the "How it works" page (101)
   */
  private getHowItWorksPage(): TeletextPage {
    const rows = [
      'HOW IT WORKS                 P101',
      '════════════════════════════════════',
      '',
      'WHAT IS TELETEXT?',
      '',
      'Teletext was a broadcast technology',
      'from the 1970s that transmitted text',
      'information over TV signals.',
      '',
      'This modern web version recreates',
      'the classic 40×24 character grid',
      'interface while adding contemporary',
      'features like live APIs and AI.',
      '',
      'NAVIGATION:',
      '• Enter 3-digit page numbers (100-899)',
      '• Use colored buttons for quick jumps',
      '• Press BACK to return to previous',
      '',
      'See page 999 for full help',
      '',
      '',
      'INDEX   HELP',
      ''
    ];

    return {
      id: '101',
      title: 'How It Works',
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
   * Creates the emergency bulletins page (120)
   */
  private getEmergencyBulletinsPage(): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const rows = [
      'EMERGENCY BULLETINS          P120',
      '════════════════════════════════════',
      `Last updated: ${timeStr}`,
      '',
      '⚠ BREAKING ALERTS ⚠',
      '',
      'No active emergency alerts at this',
      'time.',
      '',
      'This page displays critical',
      'information during emergencies:',
      '',
      '• Weather warnings',
      '• Public safety alerts',
      '• Service disruptions',
      '• Breaking news',
      '',
      'Updates appear within 60 seconds',
      'of being issued.',
      '',
      'For news, see page 200',
      '',
      '',
      'INDEX   NEWS',
      ''
    ];

    return {
      id: '120',
      title: 'Emergency Bulletins',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the about/credits page (199)
   */
  private getAboutCreditsPage(): TeletextPage {
    const rows = [
      'ABOUT & CREDITS              P199',
      '════════════════════════════════════',
      '',
      'MODERN TELETEXT',
      'Version 1.0',
      '',
      'A resurrection of 1970s teletext',
      'technology for the modern web.',
      '',
      'Built with:',
      '• Next.js & React',
      '• Firebase (Hosting, Functions,',
      '  Firestore, Storage)',
      '• Google Gemini AI',
      '• External APIs for live data',
      '',
      'Inspired by BBC Ceefax (1974-2012)',
      'and other classic teletext services.',
      '',
      'Source code & documentation:',
      'github.com/your-repo/modern-teletext',
      '',
      'INDEX   HELP',
      ''
    ];

    return {
      id: '199',
      title: 'About & Credits',
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
   * Creates the help page (999)
   */
  private getHelpPage(): TeletextPage {
    const rows = [
      'HELP                         P999',
      '════════════════════════════════════',
      '',
      'NAVIGATION INSTRUCTIONS',
      '',
      'KEYBOARD SHORTCUTS:',
      '• 0-9: Enter page numbers',
      '• Enter: Go to entered page',
      '• Backspace: Delete last digit',
      '• Arrow Up/Down: Channel up/down',
      '• Arrow Left: Back to previous page',
      '',
      'COLORED BUTTONS:',
      '• RED: Quick link (varies by page)',
      '• GREEN: Quick link (varies by page)',
      '• YELLOW: Quick link (varies by page)',
      '• BLUE: Quick link (varies by page)',
      '',
      'PAGE RANGES:',
      '100-199: System pages',
      '200-299: News',
      '300-399: Sport',
      '400-499: Markets',
      '500-599: AI Oracle',
      '600-699: Games',
      '700-799: Settings',
      '800-899: Developer tools',
      '',
      'Press 100 for main index',
      '',
      '',
      'INDEX',
      ''
    ];

    return {
      id: '999',
      title: 'Help',
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
   * Creates a 404 error page with horror-themed ASCII art and glitch effects
   * Requirements: 13.1
   */
  private getErrorPage(): TeletextPage {
    const rows = [
      'ERROR                        P404',
      '════════════════════════════════════',
      '',
      '    ░▒▓█ 4 0 4 █▓▒░',
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
      '    █░░░░░░░░░░░░░░░░░░░░░░█',
      '    █░ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ░█',
      '    █░░░░░░░░░░░░░░░░░░░░░░█',
      '    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      '',
      '    ╔═══════════════════════╗',
      '    ║  Y̴O̴U̴ ̴S̴H̴O̴U̴L̴D̴N̴\'̴T̴  ║',
      '    ║   B̴E̴ ̴H̴E̴R̴E̴...     ║',
      '    ╚═══════════════════════╝',
      '',
      'The void stares back...',
      '',
      'Something went wrong. Or did it?',
      'Perhaps you were meant to find this.',
      '',
      'Try 666 if you dare...',
      '',
      '',
      'INDEX   HELP    666',
      ''
    ];

    return {
      id: '404',
      title: 'Page Not Found',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '999', color: 'green' },
        { label: '666', targetPage: '666', color: 'blue' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh',
        haunting: true // Signal to frontend to apply glitch effects
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
   * Creates the cursed page 666 with AI-generated horror content
   * Requirements: 13.5
   */
  private async getPage666(params?: Record<string, any>): Promise<TeletextPage> {
    // Check if we have cached horror content
    const useAI = params?.generateNew !== false;
    
    let horrorContent = '';
    
    if (useAI) {
      try {
        // Initialize Vertex AI
        const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID || '';
        const location = process.env.VERTEX_LOCATION || 'us-central1';
        
        const vertexAI = new VertexAI({
          project: projectId,
          location: location
        });
        
        const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Generate horror content
        const prompt = `Generate a short, disturbing horror message (2-3 sentences, max 120 characters total) for a cursed teletext page 666. Make it cryptic, unsettling, and atmospheric. No formatting, just plain text.`;
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        horrorContent = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Truncate if too long
        if (horrorContent.length > 120) {
          horrorContent = horrorContent.substring(0, 117) + '...';
        }
      } catch (error) {
        console.error('Error generating AI content for page 666:', error);
        // Fall back to static content
        horrorContent = 'They are watching. They have always been watching. And now they see you.';
      }
    } else {
      // Use static fallback content
      horrorContent = 'They are watching. They have always been watching. And now they see you.';
    }
    
    // Split horror content into lines (max 40 chars per line)
    const horrorLines = this.wrapText(horrorContent, 38);
    
    const rows = [
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '         ▄▄▄  ▄▄▄  ▄▄▄',
      '        █ 6 ██ 6 ██ 6 █',
      '         ▀▀▀  ▀▀▀  ▀▀▀',
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '',
      '    ╔══════════════════════════╗',
      '    ║   T̴H̴E̴ ̴C̴U̴R̴S̴E̴D̴ ̴P̴A̴G̴E̴   ║',
      '    ╚══════════════════════════╝',
      '',
      ...horrorLines.map(line => `  ${line}`),
      '',
      '',
      '    ░▒▓█ YOU HAVE BEEN WARNED █▓▒░',
      '',
      '    ◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤',
      '',
      'The numbers speak. The void listens.',
      'Your presence here is not coincidence.',
      '',
      '',
      '',
      'ESCAPE  INDEX   BACK',
      ''
    ];

    return {
      id: '666',
      title: 'The Cursed Page',
      rows: this.padRows(rows),
      links: [
        { label: 'ESCAPE', targetPage: '100', color: 'red' },
        { label: 'INDEX', targetPage: '100', color: 'green' },
        { label: 'BACK', targetPage: '100', color: 'yellow' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh',
        haunting: true, // Signal to frontend to apply maximum glitch effects
        aiGenerated: useAI
      }
    };
  }

  /**
   * Wraps text to fit within specified width
   */
  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
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
