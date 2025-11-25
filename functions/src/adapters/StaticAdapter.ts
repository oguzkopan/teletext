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
      
      case 110:
        return this.getSystemPagesIndex();
      
      case 120:
        return this.getEmergencyBulletinsPage();
      
      case 198:
        return this.getScrollingCreditsPage();
      
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
   * Creates the main index page (100) with visual enhancements
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5
   * Enhanced with ASCII art logo, pixelated shapes, colored blocks, icons, and visual navigation
   */
  private getIndexPage(): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    // Build enhanced content with ASCII art logo, visual separators, and icons
    const rows: string[] = [];
    
    // Row 0: Page header with page number and time
    rows.push(this.padText('P100', 8, 'left') + this.padText('MAIN INDEX', 24, 'center') + this.padText(timeStr, 8, 'right'));
    
    // Row 1: Empty separator
    rows.push('');
    
    // Rows 2-4: ASCII art logo banner
    rows.push('╔══════════════════════════════════╗');
    rows.push('║  MODERN TELETEXT  ░▒▓█▓▒░       ║');
    rows.push('╚══════════════════════════════════╝');
    
    // Row 5: Subtitle
    rows.push(this.centerText('Your Gateway to Information', 40));
    
    // Row 6: Empty separator
    rows.push('');
    
    // Row 7: Section header with pixelated decoration
    rows.push('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    
    // Rows 8-9: News section (RED)
    rows.push('📰 NEWS                  ►200 Headlines');
    rows.push('  201 UK  202 World  203 Local        ');
    
    // Row 10: Separator
    rows.push('════════════════════════════════════════');
    
    // Rows 11-12: Sport section (GREEN)
    rows.push('⚽ SPORT                  ►300 Headlines');
    rows.push('  301 Football  302 Cricket  304 Live  ');
    
    // Row 13: Separator
    rows.push('════════════════════════════════════════');
    
    // Rows 14-15: Markets section (YELLOW)
    rows.push('📈 MARKETS               ►400 Overview ');
    rows.push('  401 Stocks  402 Crypto  403 Commodit.');
    
    // Row 16: Separator
    rows.push('════════════════════════════════════════');
    
    // Row 17: Weather section (CYAN)
    rows.push('🌤  WEATHER              ►420 Forecast ');
    
    // Row 18: Separator
    rows.push('════════════════════════════════════════');
    
    // Row 19: AI & Games section (BLUE/MAGENTA)
    rows.push('🤖 AI ►500  🎮 GAMES ►600  ⚙️  SET ►700');
    
    // Row 20: Separator with decoration
    rows.push('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    
    // Row 21: Navigation legend
    rows.push(this.centerText('NAVIGATION: Enter 3-digit page #', 40));
    
    // Row 22: Empty
    rows.push('');
    
    // Row 23: Footer with colored button hints
    rows.push('🔴NEWS 🟢SPORT 🟡MARKETS 🔵AI  999=HELP');
    
    return {
      id: '100',
      title: 'Main Index',
      rows: rows.map(row => this.padText(row, 40, 'left')),
      links: [
        { label: 'NEWS', targetPage: '200', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' },
        { label: 'MARKETS', targetPage: '400', color: 'yellow' },
        { label: 'AI', targetPage: '500', color: 'blue' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'triple',
        animatedLogo: true,
        logoAnimation: 'logo-pulse',
        specialPageAnimation: {
          type: 'ascii-frames',
          name: 'logo-pulse',
          targetRows: [2, 3, 4], // The logo rows
          frames: [
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▒▓█▓▒          ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▓█▓            ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  █              ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▓█▓            ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ▒▓█▓▒          ║\n╚══════════════════════════════════╝',
            '╔══════════════════════════════════╗\n║  MODERN TELETEXT  ░▒▓█▓▒░       ║\n╚══════════════════════════════════╝'
          ],
          duration: 2100, // 300ms per frame × 7 frames
          loop: true
        }
      }
    };
  }

  /**
   * Pads text to exact width with alignment
   */
  private padText(text: string, width: number, align: 'left' | 'center' | 'right'): string {
    const truncated = text.length > width ? text.substring(0, width) : text;
    if (truncated.length === width) return truncated;
    
    const padding = width - truncated.length;
    switch (align) {
      case 'center': {
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return ' '.repeat(leftPad) + truncated + ' '.repeat(rightPad);
      }
      case 'right':
        return ' '.repeat(padding) + truncated;
      case 'left':
      default:
        return truncated + ' '.repeat(padding);
    }
  }

  /**
   * Centers text within specified width
   */
  private centerText(text: string, width: number): string {
    if (text.length >= width) {
      return text.slice(0, width);
    }
    const padding = width - text.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  }

  /**
   * Creates the System Pages index (110)
   * Requirements: 3.2, 3.3, 32.2
   */
  private getSystemPagesIndex(): TeletextPage {
    const rows = [
      'SYSTEM PAGES                 P110',
      '════════════════════════════════════',
      '',
      'AVAILABLE SYSTEM PAGES:',
      '',
      '100 Main index',
      '101 How it works',
      '110 System pages (this page)',
      '120 Emergency bulletins',
      '199 About & credits',
      '',
      'SPECIAL PAGES:',
      '404 Page not found (error)',
      '666 The cursed page',
      '999 Help & navigation guide',
      '',
      'System pages provide information',
      'about the teletext service itself.',
      '',
      'Press 100 to return to main index',
      '',
      '',
      'INDEX   HELP',
      ''
    ];

    return {
      id: '110',
      title: 'System Pages',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '999', color: 'green' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
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
      }
    };
  }

  /**
   * Creates the scrolling credits page (198)
   * Requirements: 29.4
   */
  private getScrollingCreditsPage(): TeletextPage {
    // Initial frame of scrolling credits
    const rows = [
      'CREDITS                      P198',
      '════════════════════════════════════',
      '',
      '',
      '',
      '',
      '',
      '',
      '         MODERN TELETEXT',
      '            Version 1.0',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press any key to start scrolling...',
      '',
      'INDEX   BACK'
    ];

    return {
      id: '198',
      title: 'Credits',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'BACK', targetPage: '199', color: 'green' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        scrollingCredits: true, // Signal to frontend to use scrolling animation
        creditsAnimation: 'scrolling-credits'
      }
    };
  }

  /**
   * Creates the about/credits page (199) with scrolling credits
   * Requirements: 29.4, 29.5
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
      this.centerText('⚡ Powered by Kiro ⚡', 40),
      '',
      'INDEX   HELP   CREDITS',
      ''
    ];

    return {
      id: '199',
      title: 'About & Credits',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '999', color: 'green' },
        { label: 'CREDITS', targetPage: '198', color: 'yellow' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
        kiroBadge: true, // Signal to frontend to animate Kiro badge
        kiroBadgeAnimation: 'kiro-badge-pulse'
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
      'See page 720 for full keyboard guide',
      'Press 100 for main index',
      '',
      '',
      'INDEX   SHORTCUTS',
      ''
    ];

    return {
      id: '999',
      title: 'Help',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SHORTCUTS', targetPage: '720', color: 'green' }
      ],
      meta: {
        source: 'StaticAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a 404 error page with animated glitching ASCII art of broken TV
   * Requirements: 17.1, 17.4, 17.5
   */
  private getErrorPage(): TeletextPage {
    // Frame-by-frame ASCII animation of a broken/glitching TV
    // This will be animated on the frontend using the animation engine
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

    // Define frame-by-frame animation for broken TV
    const brokenTVFrames = [
      // Frame 1: Normal broken TV
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    █░ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ░█\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 2: Glitch effect 1
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█\n    █▓ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ▓█\n    █▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 3: Glitch effect 2
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█\n    █▒ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ▒█\n    █▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 4: Static/noise
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒█\n    █░ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ░█\n    █▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 5: Distorted
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    █░ P̴̷A̴̷G̴̷E̴̷ N̴̷O̴̷T̴̷ F̴̷O̴̷U̴̷N̴̷D̴̷ █\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 6: Back to normal
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    █░ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ░█\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 7: Flicker
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █                      █\n    █  P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷  █\n    █                      █\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
      // Frame 8: Back to normal
      '    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    █░ P̷A̷G̷E̷ ░N̷O̷T̷ ░F̷O̷U̷N̷D̷ ░█\n    █░░░░░░░░░░░░░░░░░░░░░░█\n    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀'
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
        haunting: true, // Signal to frontend to apply glitch effects
        maxVisualEffects: true, // Apply maximum visual effects regardless of user settings
        specialPageAnimation: {
          type: 'ascii-frames',
          name: 'broken-tv-glitch',
          targetRows: [4, 5, 6, 7, 8], // Rows containing the TV ASCII art
          frames: brokenTVFrames,
          duration: 2400, // 300ms per frame × 8 frames
          loop: true
        }
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
      }
    };
  }

  /**
   * Creates the cursed page 666 with animated demonic ASCII art and pulsing effects
   * Requirements: 17.2, 17.3, 17.4, 17.5
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

    // Define frame-by-frame animation for demonic ASCII art
    const demonicFrames = [
      // Frame 1: Normal demonic face
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █ 6 ██ 6 ██ 6 █\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 2: Eyes glow
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █▓6▓██▓6▓██▓6▓█\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 3: Intense glow
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █▒6▒██▒6▒██▒6▒█\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 4: Maximum intensity
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █░6░██░6░██░6░█\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 5: Pulsing back
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █▒6▒██▒6▒██▒6▒█\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 6: Back to glow
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █▓6▓██▓6▓██▓6▓█\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 7: Normal
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █ 6 ██ 6 ██ 6 █\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 8: Distorted
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █ 6̴ ██ 6̴ ██ 6̴ █\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 9: More distorted
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █ 6̷ ██ 6̷ ██ 6̷ █\n         ▀▀▀  ▀▀▀  ▀▀▀',
      // Frame 10: Back to normal
      '         ▄▄▄  ▄▄▄  ▄▄▄\n        █ 6 ██ 6 ██ 6 █\n         ▀▀▀  ▀▀▀  ▀▀▀'
    ];

    // Define animation for the pentagram borders
    const pentagramFrames = [
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸',
      '⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸'
    ];

    // Define animation for the warning text
    const warningFrames = [
      '    ░▒▓█ YOU HAVE BEEN WARNED █▓▒░',
      '    ▒▓█░ YOU HAVE BEEN WARNED ░█▓▒',
      '    ▓█░▒ YOU HAVE BEEN WARNED ▒░█▓',
      '    █░▒▓ YOU HAVE BEEN WARNED ▓▒░█',
      '    ░▒▓█ YOU HAVE BEEN WARNED █▓▒░'
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
        haunting: true, // Signal to frontend to apply maximum glitch effects
        maxVisualEffects: true, // Apply maximum visual effects regardless of user settings
        aiGenerated: useAI,
        specialPageAnimations: [
          {
            type: 'ascii-frames',
            name: 'demonic-666-pulse',
            targetRows: [1, 2, 3], // The 666 ASCII art
            frames: demonicFrames,
            duration: 3000, // 300ms per frame × 10 frames
            loop: true
          },
          {
            type: 'ascii-frames',
            name: 'pentagram-pulse',
            targetRows: [0, 4], // Top and bottom pentagram borders
            frames: pentagramFrames,
            duration: 1500, // 300ms per frame × 5 frames
            loop: true
          },
          {
            type: 'ascii-frames',
            name: 'warning-shimmer',
            targetRows: [13], // The warning text
            frames: warningFrames,
            duration: 1500, // 300ms per frame × 5 frames
            loop: true
          }
        ]
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
   * Pads rows array to exactly 24 rows, each exactly 40 characters (teletext width)
   * Note: For simplicity, we use actual string length, not visible length
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        // Truncate to 40 characters
        return row.substring(0, 40);
      } else if (row.length < 40) {
        // Pad to exactly 40 characters
        const paddingNeeded = 40 - row.length;
        return row + ' '.repeat(paddingNeeded);
      }
      
      return row;
    });

    // Ensure exactly 24 rows
    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
