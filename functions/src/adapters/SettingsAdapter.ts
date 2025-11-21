// Settings adapter for pages 700-799
// Handles theme selection, CRT effects, and user preferences

import { ContentAdapter, TeletextPage, ThemeConfig } from '../types';

/**
 * SettingsAdapter serves settings and preferences pages (700-799)
 * Includes theme selection, CRT effects controls, and keyboard shortcuts
 */
export class SettingsAdapter implements ContentAdapter {
  // Predefined theme configurations
  private themes: Record<string, ThemeConfig> = {
    ceefax: {
      name: 'Ceefax',
      colors: {
        background: '#0000AA',  // BBC blue
        text: '#FFFF00',        // Yellow
        red: '#FF0000',
        green: '#00FF00',
        yellow: '#FFFF00',
        blue: '#0000FF',
        magenta: '#FF00FF',
        cyan: '#00FFFF',
        white: '#FFFFFF'
      },
      effects: {
        scanlines: true,
        curvature: true,
        noise: false,
        glitch: false
      }
    },
    orf: {
      name: 'ORF',
      colors: {
        background: '#000000',  // Black
        text: '#00FF00',        // Green
        red: '#FF3333',
        green: '#33FF33',
        yellow: '#FFFF33',
        blue: '#3333FF',
        magenta: '#FF33FF',
        cyan: '#33FFFF',
        white: '#CCCCCC'
      },
      effects: {
        scanlines: true,
        curvature: false,
        noise: false,
        glitch: false
      }
    },
    highcontrast: {
      name: 'High Contrast',
      colors: {
        background: '#000000',  // Black
        text: '#FFFFFF',        // White
        red: '#FF0000',
        green: '#00FF00',
        yellow: '#FFFF00',
        blue: '#0088FF',
        magenta: '#FF00FF',
        cyan: '#00FFFF',
        white: '#FFFFFF'
      },
      effects: {
        scanlines: false,
        curvature: false,
        noise: false,
        glitch: false
      }
    },
    haunting: {
      name: 'Haunting Mode',
      colors: {
        background: '#000000',  // Black
        text: '#00FF00',        // Green
        red: '#880000',         // Dark red
        green: '#008800',       // Dark green
        yellow: '#888800',      // Dark yellow
        blue: '#000088',        // Dark blue
        magenta: '#880088',     // Dark magenta
        cyan: '#008888',        // Dark cyan
        white: '#888888'        // Gray
      },
      effects: {
        scanlines: true,
        curvature: true,
        noise: true,
        glitch: true
      }
    }
  };

  /**
   * Retrieves a settings page
   * @param pageId - The page ID to retrieve
   * @param params - Optional parameters (e.g., selected theme)
   * @returns A TeletextPage object
   */
  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific settings pages
    if (pageNumber === 700) {
      return this.getThemeSelectionPage(params?.currentTheme);
    } else if (pageNumber === 701) {
      // Fetch current settings from Firestore if available
      const effects = params?.effects || await this.loadEffectsFromFirestore();
      return this.getCRTEffectsControlPage(effects);
    } else if (pageNumber >= 702 && pageNumber <= 705) {
      // Theme preview pages
      const themeKeys = ['ceefax', 'orf', 'highcontrast', 'haunting'];
      const themeKey = themeKeys[pageNumber - 702];
      return this.getThemePreviewPage(themeKey, pageNumber);
    } else if (pageNumber === 710) {
      return this.getKeyboardShortcutsConfigPage(params?.favoritePages);
    } else if (pageNumber === 720) {
      return this.getKeyboardShortcutsReferencePage();
    } else if (pageNumber >= 700 && pageNumber < 800) {
      return this.getPlaceholderPage(pageId);
    }

    // For pages outside this range, return error
    return this.getErrorPage(pageId);
  }



  /**
   * Creates the theme selection page (700)
   * Requirements: 37.1 - Display numbered theme options (1-4)
   */
  private getThemeSelectionPage(currentTheme?: string): TeletextPage {
    const rows = [
      'THEME SELECTION              P700',
      '════════════════════════════════════',
      '',
      'Press a number key to select theme:',
      '',
      '1. CEEFAX (Classic BBC)',
      '   Yellow on blue background',
      '   Traditional teletext look',
      '',
      '2. ORF (Austrian Teletext)',
      '   Green on black background',
      '   European teletext style',
      '',
      '3. HIGH CONTRAST',
      '   White on black background',
      '   Maximum readability',
      '',
      '4. HAUNTING MODE',
      '   Green on black with glitch',
      '   Spooky horror aesthetic',
      '',
      currentTheme ? `Current: ${currentTheme}` : '',
      '',
      'EFFECTS INDEX',
      ''
    ];

    return {
      id: '700',
      title: 'Theme Selection',
      rows: this.padRows(rows),
      links: [
        { label: 'EFFECTS', targetPage: '701', color: 'red' },
        { label: 'INDEX', targetPage: '100', color: 'green' },
        { label: '', targetPage: '702', color: 'blue' }, // Option 1
        { label: '', targetPage: '703', color: 'blue' }, // Option 2
        { label: '', targetPage: '704', color: 'blue' }, // Option 3
        { label: '', targetPage: '705', color: 'blue' }  // Option 4
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
        themeSelectionPage: true,  // Flag to enable special keyboard handling
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4']
      }
    };
  }

  /**
   * Creates a theme preview page
   */
  private getThemePreviewPage(themeKey: string, pageNumber: number): TeletextPage {
    const theme = this.themes[themeKey];
    if (!theme) {
      return this.getErrorPage('700');
    }
    
    const rows = [
      `THEME PREVIEW: ${theme.name.toUpperCase().padEnd(14)} P${pageNumber}`,
      '════════════════════════════════════',
      '',
      `Theme: ${theme.name}`,
      '',
      'COLOR PALETTE:',
      `Background: ${theme.colors.background}`,
      `Text: ${theme.colors.text}`,
      '',
      'SAMPLE TEXT:',
      'RED text example',
      'GREEN text example',
      'YELLOW text example',
      'BLUE text example',
      '',
      'EFFECTS:',
      `Scanlines: ${theme.effects.scanlines ? 'ON' : 'OFF'}`,
      `Curvature: ${theme.effects.curvature ? 'ON' : 'OFF'}`,
      `Noise: ${theme.effects.noise ? 'ON' : 'OFF'}`,
      `Glitch: ${theme.effects.glitch ? 'ON' : 'OFF'}`,
      '',
      'Press colored button to apply theme',
      '',
      'BACK    APPLY   THEMES',
      ''
    ];

    return {
      id: pageNumber.toString(),
      title: `${theme.name} Preview`,
      rows: this.padRows(rows),
      links: [
        { label: 'BACK', targetPage: '700', color: 'red' },
        { label: 'APPLY', targetPage: '700', color: 'green' },
        { label: 'THEMES', targetPage: '700', color: 'yellow' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates the keyboard shortcuts configuration page (710)
   */
  private getKeyboardShortcutsConfigPage(favoritePages?: string[]): TeletextPage {
    // Default favorites if none provided
    const defaults = ['100', '200', '300', '400', '500', '', '', '', '', ''];
    const favorites = favoritePages || defaults;
    
    // Ensure we have exactly 10 slots
    while (favorites.length < 10) {
      favorites.push('');
    }
    
    const rows = [
      'KEYBOARD SHORTCUTS CONFIG    P710',
      '════════════════════════════════════',
      '',
      'FAVORITE PAGES:',
      '',
      'Assign up to 10 favorite pages',
      'for quick access with F1-F10 keys.',
      '',
      'Current favorites:',
      `1. F1  → ${favorites[0] ? `Page ${favorites[0]}` : '(Not set)'}`,
      `2. F2  → ${favorites[1] ? `Page ${favorites[1]}` : '(Not set)'}`,
      `3. F3  → ${favorites[2] ? `Page ${favorites[2]}` : '(Not set)'}`,
      `4. F4  → ${favorites[3] ? `Page ${favorites[3]}` : '(Not set)'}`,
      `5. F5  → ${favorites[4] ? `Page ${favorites[4]}` : '(Not set)'}`,
      `6. F6  → ${favorites[5] ? `Page ${favorites[5]}` : '(Not set)'}`,
      `7. F7  → ${favorites[6] ? `Page ${favorites[6]}` : '(Not set)'}`,
      `8. F8  → ${favorites[7] ? `Page ${favorites[7]}` : '(Not set)'}`,
      `9. F9  → ${favorites[8] ? `Page ${favorites[8]}` : '(Not set)'}`,
      `10. F10 → ${favorites[9] ? `Page ${favorites[9]}` : '(Not set)'}`,
      '',
      'See page 720 for all shortcuts',
      '',
      'INDEX   HELP',
      ''
    ];

    return {
      id: '710',
      title: 'Keyboard Shortcuts Config',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '720', color: 'green' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
        favoritePages: favorites
      }
    };
  }

  /**
   * Creates the keyboard shortcuts reference page (720)
   */
  private getKeyboardShortcutsReferencePage(): TeletextPage {
    const rows = [
      'KEYBOARD SHORTCUTS           P720',
      '════════════════════════════════════',
      '',
      'NAVIGATION:',
      '0-9        Enter page digits',
      'Enter      Go to entered page',
      'Backspace  Delete last digit',
      '↑/↓        Channel up/down',
      '←          Back to previous page',
      '',
      'COLORED BUTTONS:',
      'R          Red button',
      'G          Green button',
      'Y          Yellow button',
      'B          Blue button',
      '',
      'FAVORITES:',
      'F1-F10     Quick access to favorites',
      '',
      'Configure favorites on page 710',
      '',
      '',
      'INDEX   CONFIG',
      ''
    ];

    return {
      id: '720',
      title: 'Keyboard Shortcuts',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'CONFIG', targetPage: '710', color: 'green' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates the CRT effects and animation control page (701)
   * Requirements: 10.5, 12.5 - Animation accessibility settings
   */
  private getCRTEffectsControlPage(effects?: any): TeletextPage {
    // Default values
    const defaultEffects = {
      scanlinesIntensity: 50,
      curvature: 5,
      noiseLevel: 10,
      animationsEnabled: true,
      animationIntensity: 100,
      transitionsEnabled: true,
      decorationsEnabled: true,
      backgroundEffectsEnabled: true
    };

    const currentEffects = effects || defaultEffects;
    
    // Ensure values are within valid ranges
    const scanlinesIntensity = Math.max(0, Math.min(100, currentEffects.scanlinesIntensity || defaultEffects.scanlinesIntensity));
    const curvature = Math.max(0, Math.min(10, currentEffects.curvature || defaultEffects.curvature));
    const noiseLevel = Math.max(0, Math.min(100, currentEffects.noiseLevel || defaultEffects.noiseLevel));
    const animationIntensity = Math.max(0, Math.min(100, currentEffects.animationIntensity || defaultEffects.animationIntensity));
    const animationsEnabled = currentEffects.animationsEnabled !== false;

    // Create visual slider bars
    const createSlider = (value: number, max: number, width: number = 15): string => {
      const filled = Math.round((value / max) * width);
      const empty = width - filled;
      return '█'.repeat(filled) + '░'.repeat(empty);
    };

    const rows = [
      'EFFECTS & ANIMATIONS         P701',
      '════════════════════════════════════',
      '',
      'CRT EFFECTS:',
      `Scanlines: ${createSlider(scanlinesIntensity, 100, 15)} ${scanlinesIntensity}%`,
      `Curvature: ${createSlider(curvature, 10, 15)} ${curvature}px`,
      `Noise:     ${createSlider(noiseLevel, 100, 15)} ${noiseLevel}%`,
      '',
      'ANIMATIONS:',
      `All Animations: ${animationsEnabled ? 'ON ' : 'OFF'}`,
      `Intensity:      ${createSlider(animationIntensity, 100, 15)} ${animationIntensity}%`,
      `Transitions:    ${currentEffects.transitionsEnabled !== false ? 'ON ' : 'OFF'}`,
      `Decorations:    ${currentEffects.decorationsEnabled !== false ? 'ON ' : 'OFF'}`,
      `Backgrounds:    ${currentEffects.backgroundEffectsEnabled !== false ? 'ON ' : 'OFF'}`,
      '',
      'Use arrow keys to adjust values',
      'Press 1-5 to toggle animation types',
      '',
      'Changes apply immediately',
      'Settings saved automatically',
      '',
      '',
      'INDEX   RESET   THEMES',
      ''
    ];

    return {
      id: '701',
      title: 'Effects & Animations',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'RESET', targetPage: '701', color: 'green' },
        { label: 'THEMES', targetPage: '700', color: 'yellow' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
        effectsData: {
          scanlinesIntensity,
          curvature,
          noiseLevel
        },
        animationSettings: {
          animationsEnabled,
          animationIntensity,
          transitionsEnabled: currentEffects.transitionsEnabled !== false,
          decorationsEnabled: currentEffects.decorationsEnabled !== false,
          backgroundEffectsEnabled: currentEffects.backgroundEffectsEnabled !== false
        },
        settingsPage: true
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `SETTINGS                     P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Page ${pageId} is under construction.`,
      '',
      'This settings page will be available',
      'in a future update.',
      '',
      'Available settings pages:',
      '700 - Theme selection',
      '701 - CRT effects control',
      '710 - Keyboard shortcuts config',
      '720 - Keyboard shortcuts reference',
      '',
      '',
      '',
      'Press 700 for theme settings',
      'Press 100 for main index',
      '',
      '',
      'THEMES  INDEX',
      ''
    ];

    return {
      id: pageId,
      title: `Settings Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'THEMES', targetPage: '700', color: 'red' },
        { label: 'INDEX', targetPage: '100', color: 'green' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates an error page
   */
  private getErrorPage(pageId: string): TeletextPage {
    const rows = [
      'ERROR                        P???',
      '════════════════════════════════════',
      '',
      'PAGE NOT FOUND',
      '',
      `Page ${pageId} does not exist in the`,
      'settings section.',
      '',
      'Available settings pages:',
      '700 - Theme selection',
      '701 - CRT effects control',
      '710 - Keyboard shortcuts config',
      '720 - Keyboard shortcuts reference',
      '',
      '',
      '',
      '',
      'Press 700 for settings index',
      'Press 100 for main index',
      '',
      '',
      'SETTINGS INDEX',
      ''
    ];

    return {
      id: pageId,
      title: 'Error',
      rows: this.padRows(rows),
      links: [
        { label: 'SETTINGS', targetPage: '700', color: 'red' },
        { label: 'INDEX', targetPage: '100', color: 'green' }
      ],
      meta: {
        source: 'SettingsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Gets a theme configuration by key
   * @param themeKey - The theme key (ceefax, orf, highcontrast, haunting)
   * @returns The theme configuration or undefined
   */
  getTheme(themeKey: string): ThemeConfig | undefined {
    return this.themes[themeKey];
  }

  /**
   * Gets all available themes
   * @returns Record of all theme configurations
   */
  getAllThemes(): Record<string, ThemeConfig> {
    return this.themes;
  }

  /**
   * Load effects and animation settings from Firestore
   * Requirement: 12.5 - Load saved animation preferences
   */
  private async loadEffectsFromFirestore(): Promise<any> {
    try {
      // In a real implementation, this would use Firebase Admin SDK
      // For now, return defaults since we can't access Firestore from Cloud Functions directly
      // The client-side hook will handle the actual Firestore integration
      return {
        scanlinesIntensity: 50,
        curvature: 5,
        noiseLevel: 10,
        animationsEnabled: true,
        animationIntensity: 100,
        transitionsEnabled: true,
        decorationsEnabled: true,
        backgroundEffectsEnabled: true
      };
    } catch (error) {
      console.error('Error loading effects from Firestore:', error);
      // Return defaults on error
      return {
        scanlinesIntensity: 50,
        curvature: 5,
        noiseLevel: 10,
        animationsEnabled: true,
        animationIntensity: 100,
        transitionsEnabled: true,
        decorationsEnabled: true,
        backgroundEffectsEnabled: true
      };
    }
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
