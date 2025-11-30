/**
 * Centralized Theme Management System
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */

import { ThemeConfig } from '@/types/teletext';
import { db } from '@/lib/firebase-client';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Theme registry with metadata
 * Requirement: 8.5
 */
export interface ThemeMetadata {
  key: string;
  name: string;
  description: string;
  preview: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  category: 'classic' | 'modern' | 'accessibility' | 'special';
  effects: string[];
}

/**
 * Animation settings
 * Requirement: 8.3
 */
export interface AnimationSettings {
  animationsEnabled: boolean;
  animationIntensity: number; // 0-100
  transitionsEnabled: boolean;
  decorationsEnabled: boolean;
  backgroundEffectsEnabled: boolean;
  respectReducedMotion: boolean;
}

/**
 * Complete theme registry with metadata
 * Requirement: 8.5
 */
export const themeRegistry: Record<string, ThemeMetadata> = {
  ceefax: {
    key: 'ceefax',
    name: 'Ceefax',
    description: 'Classic BBC Ceefax blue and yellow',
    preview: {
      backgroundColor: '#0000AA',
      textColor: '#FFFF00',
      accentColor: '#FF0000'
    },
    category: 'classic',
    effects: ['scanlines', 'curvature']
  },
  orf: {
    key: 'orf',
    name: 'ORF',
    description: 'Austrian ORF teletext green on black',
    preview: {
      backgroundColor: '#000000',
      textColor: '#00FF00',
      accentColor: '#FF3333'
    },
    category: 'classic',
    effects: ['scanlines']
  },
  highcontrast: {
    key: 'highcontrast',
    name: 'High Contrast',
    description: 'Maximum readability with white on black',
    preview: {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      accentColor: '#0088FF'
    },
    category: 'accessibility',
    effects: []
  },
  haunting: {
    key: 'haunting',
    name: 'Haunting Mode',
    description: 'Spooky green with maximum glitch effects',
    preview: {
      backgroundColor: '#000000',
      textColor: '#00FF00',
      accentColor: '#FF0000'
    },
    category: 'special',
    effects: ['scanlines', 'curvature', 'noise', 'glitch']
  }
};

/**
 * Theme definitions
 * Requirement: 8.5
 */
export const themes: Record<string, ThemeConfig> = {
  ceefax: {
    name: 'Ceefax',
    colors: {
      background: '#0000AA',
      text: '#FFFF00',
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
      background: '#000000',
      text: '#00FF00',
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
      background: '#000000',
      text: '#FFFFFF',
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
      background: '#000000',
      text: '#FF00FF',      // Magenta/purple for spooky effect
      red: '#FF0000',
      green: '#00FF00',
      yellow: '#FF6600',    // Orange for Halloween
      blue: '#9933FF',      // Purple
      magenta: '#FF00FF',
      cyan: '#00FFFF',
      white: '#CCCCCC'
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
 * Default animation settings
 * Requirement: 8.3
 */
const defaultAnimationSettings: AnimationSettings = {
  animationsEnabled: true,
  animationIntensity: 75,
  transitionsEnabled: true,
  decorationsEnabled: true,
  backgroundEffectsEnabled: true,
  respectReducedMotion: true
};

/**
 * Centralized Theme Manager
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */
export class ThemeManager {
  private currentThemeKey: string = 'ceefax';
  private currentTheme: ThemeConfig = themes.ceefax;
  private animationSettings: AnimationSettings = { ...defaultAnimationSettings };
  private userId: string = 'default_user';
  private storageListeners: Array<(themeKey: string) => void> = [];

  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }

  /**
   * Initialize theme system and load saved preferences
   * Requirement: 8.1
   */
  async initialize(): Promise<void> {
    try {
      // First try localStorage for immediate load
      const localThemeKey = this.loadFromLocalStorage();
      if (localThemeKey && themes[localThemeKey]) {
        this.currentThemeKey = localThemeKey;
        this.currentTheme = themes[localThemeKey];
        console.log(`[ThemeManager] Loaded theme from localStorage: ${localThemeKey}`);
      }

      // Then load from Firestore (authoritative source)
      await this.loadFromFirestore();

      // Set up cross-tab synchronization
      this.setupCrossTabSync();

      console.log(`[ThemeManager] Initialized with theme: ${this.currentThemeKey}`);
    } catch (error) {
      console.error('[ThemeManager] Error during initialization:', error);
      // Continue with default theme
      this.applyDefaultTheme();
    }
  }

  /**
   * Load theme from localStorage
   * Requirement: 8.1, 8.6
   */
  private loadFromLocalStorage(): string | null {
    try {
      return localStorage.getItem('teletext-theme');
    } catch (error) {
      console.error('[ThemeManager] Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Load theme and settings from Firestore
   * Requirement: 8.1
   */
  private async loadFromFirestore(): Promise<void> {
    try {
      const userPrefsRef = doc(db, 'user_preferences', this.userId);
      const userPrefsDoc = await getDoc(userPrefsRef);

      if (userPrefsDoc.exists()) {
        const data = userPrefsDoc.data();
        const savedThemeKey = data.theme || 'ceefax';

        if (themes[savedThemeKey]) {
          this.currentThemeKey = savedThemeKey;
          this.currentTheme = themes[savedThemeKey];
          console.log(`[ThemeManager] Loaded theme from Firestore: ${savedThemeKey}`);

          // Sync localStorage with Firestore
          this.saveToLocalStorage(savedThemeKey);
        }

        // Load animation settings if available
        if (data.animationSettings) {
          this.animationSettings = {
            ...defaultAnimationSettings,
            ...data.animationSettings
          };
          console.log(`[ThemeManager] Loaded animation settings from Firestore`);
        }
      } else {
        // No saved preferences, use default
        console.log(`[ThemeManager] No saved preferences found, using default theme`);
      }
    } catch (error) {
      console.error('[ThemeManager] Error loading from Firestore:', error);
      throw error;
    }
  }

  /**
   * Apply default theme when loading fails
   * Requirement: 8.1
   */
  private applyDefaultTheme(): void {
    this.currentThemeKey = 'ceefax';
    this.currentTheme = themes.ceefax;
    console.log(`[ThemeManager] Applied default theme: ceefax`);
  }

  /**
   * Get current theme
   * Requirement: 8.4
   */
  getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  /**
   * Get current theme key
   * Requirement: 8.4
   */
  getCurrentThemeKey(): string {
    return this.currentThemeKey;
  }

  /**
   * Get all available themes
   * Requirement: 8.5
   */
  getAllThemes(): Record<string, ThemeConfig> {
    return themes;
  }

  /**
   * Get theme registry with metadata
   * Requirement: 8.5
   */
  getThemeRegistry(): Record<string, ThemeMetadata> {
    return themeRegistry;
  }

  /**
   * Get theme metadata by key
   * Requirement: 8.5
   */
  getThemeMetadata(themeKey: string): ThemeMetadata | null {
    return themeRegistry[themeKey] || null;
  }

  /**
   * Set theme and persist to storage
   * Requirements: 8.2, 8.4, 8.6
   */
  async setTheme(themeKey: string): Promise<void> {
    if (!themes[themeKey]) {
      throw new Error(`Invalid theme key: ${themeKey}`);
    }

    const newTheme = themes[themeKey];
    this.currentThemeKey = themeKey;
    this.currentTheme = newTheme;

    // Apply CSS custom properties
    this.applyCSSVariables(newTheme);

    // Save to both Firestore and localStorage
    await this.saveThemePreference(themeKey);

    console.log(`[ThemeManager] Theme set to: ${themeKey}`);
  }

  /**
   * Apply CSS custom properties for theme
   * Requirement: 8.2, 8.4
   */
  applyCSSVariables(theme: ThemeConfig): void {
    const root = document.documentElement;

    // Apply theme colors as CSS custom properties
    root.style.setProperty('--teletext-bg', theme.colors.background);
    root.style.setProperty('--teletext-text', theme.colors.text);
    root.style.setProperty('--teletext-red', theme.colors.red);
    root.style.setProperty('--teletext-green', theme.colors.green);
    root.style.setProperty('--teletext-yellow', theme.colors.yellow);
    root.style.setProperty('--teletext-blue', theme.colors.blue);
    root.style.setProperty('--teletext-magenta', theme.colors.magenta);
    root.style.setProperty('--teletext-cyan', theme.colors.cyan);
    root.style.setProperty('--teletext-white', theme.colors.white);

    // Apply theme effects as CSS custom properties
    root.style.setProperty('--scanlines-enabled', theme.effects.scanlines ? '1' : '0');
    root.style.setProperty('--curvature-enabled', theme.effects.curvature ? '1' : '0');
    root.style.setProperty('--noise-enabled', theme.effects.noise ? '1' : '0');
    root.style.setProperty('--glitch-enabled', theme.effects.glitch ? '1' : '0');

    // Add theme class to body for theme-specific styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${this.currentThemeKey}`);

    console.log(`[ThemeManager] Applied CSS variables for theme: ${theme.name}`);
  }

  /**
   * Save theme preference to Firestore and localStorage
   * Requirement: 8.6
   */
  private async saveThemePreference(themeKey: string): Promise<void> {
    try {
      // Save to Firestore
      const userPrefsRef = doc(db, 'user_preferences', this.userId);
      await setDoc(userPrefsRef, {
        userId: this.userId,
        theme: themeKey,
        favoritePages: [],
        settings: {
          scanlines: this.currentTheme.effects.scanlines,
          curvature: this.currentTheme.effects.curvature,
          noise: this.currentTheme.effects.noise
        },
        effects: {
          scanlinesIntensity: 50,
          curvature: 5,
          noiseLevel: 10
        },
        animationSettings: this.animationSettings,
        updatedAt: new Date()
      }, { merge: true });

      console.log(`[ThemeManager] Theme saved to Firestore: ${themeKey}`);

      // Save to localStorage for cross-tab sync
      this.saveToLocalStorage(themeKey);
    } catch (error) {
      console.error('[ThemeManager] Error saving theme preference:', error);
      // Still try to save to localStorage
      this.saveToLocalStorage(themeKey);
    }
  }

  /**
   * Save to localStorage
   * Requirement: 8.6
   */
  private saveToLocalStorage(themeKey: string): void {
    try {
      localStorage.setItem('teletext-theme', themeKey);
      console.log(`[ThemeManager] Theme saved to localStorage: ${themeKey}`);
    } catch (error) {
      console.error('[ThemeManager] Error saving to localStorage:', error);
    }
  }

  /**
   * Get current animation settings
   * Requirement: 8.3
   */
  getAnimationSettings(): AnimationSettings {
    return { ...this.animationSettings };
  }

  /**
   * Update animation settings
   * Requirement: 8.3
   */
  async setAnimationSettings(settings: Partial<AnimationSettings>): Promise<void> {
    this.animationSettings = {
      ...this.animationSettings,
      ...settings
    };

    // Check for reduced motion preference
    if (this.animationSettings.respectReducedMotion) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        this.animationSettings.animationsEnabled = false;
        console.log(`[ThemeManager] Animations disabled due to reduced motion preference`);
      }
    }

    // Apply animation settings to DOM
    this.applyAnimationSettings();

    // Save to Firestore
    await this.saveAnimationSettings();

    console.log(`[ThemeManager] Animation settings updated`);
  }

  /**
   * Apply animation settings to DOM
   * Requirement: 8.3
   */
  private applyAnimationSettings(): void {
    const root = document.documentElement;

    // Apply animation settings as CSS custom properties
    root.style.setProperty('--animations-enabled', this.animationSettings.animationsEnabled ? '1' : '0');
    root.style.setProperty('--animation-intensity', `${this.animationSettings.animationIntensity / 100}`);
    root.style.setProperty('--transitions-enabled', this.animationSettings.transitionsEnabled ? '1' : '0');

    // Add/remove animation classes on body
    document.body.classList.toggle('animations-disabled', !this.animationSettings.animationsEnabled);
    document.body.classList.toggle('transitions-disabled', !this.animationSettings.transitionsEnabled);
    document.body.classList.toggle('decorations-disabled', !this.animationSettings.decorationsEnabled);
    document.body.classList.toggle('background-effects-disabled', !this.animationSettings.backgroundEffectsEnabled);

    console.log(`[ThemeManager] Applied animation settings to DOM`);
  }

  /**
   * Save animation settings to Firestore
   * Requirement: 8.3
   */
  private async saveAnimationSettings(): Promise<void> {
    try {
      const userPrefsRef = doc(db, 'user_preferences', this.userId);
      await setDoc(userPrefsRef, {
        animationSettings: this.animationSettings,
        updatedAt: new Date()
      }, { merge: true });

      console.log(`[ThemeManager] Animation settings saved to Firestore`);
    } catch (error) {
      console.error('[ThemeManager] Error saving animation settings:', error);
    }
  }

  /**
   * Set up cross-tab synchronization
   * Requirement: 8.6
   */
  private setupCrossTabSync(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'teletext-theme' && e.newValue) {
        const newThemeKey = e.newValue;
        if (themes[newThemeKey] && newThemeKey !== this.currentThemeKey) {
          console.log(`[ThemeManager] Theme changed in another tab: ${newThemeKey}`);
          this.currentThemeKey = newThemeKey;
          this.currentTheme = themes[newThemeKey];
          this.applyCSSVariables(this.currentTheme);

          // Notify listeners
          this.notifyStorageListeners(newThemeKey);
        }
      }
    });

    console.log(`[ThemeManager] Cross-tab synchronization enabled`);
  }

  /**
   * Add listener for storage changes
   * Requirement: 8.6
   */
  addStorageListener(callback: (themeKey: string) => void): void {
    this.storageListeners.push(callback);
  }

  /**
   * Remove storage listener
   * Requirement: 8.6
   */
  removeStorageListener(callback: (themeKey: string) => void): void {
    this.storageListeners = this.storageListeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all storage listeners
   * Requirement: 8.6
   */
  private notifyStorageListeners(themeKey: string): void {
    this.storageListeners.forEach(listener => {
      try {
        listener(themeKey);
      } catch (error) {
        console.error('[ThemeManager] Error in storage listener:', error);
      }
    });
  }

  /**
   * Apply effects based on theme configuration
   * Requirement: 8.2, 8.4
   */
  applyEffects(effects: ThemeConfig['effects']): void {
    const root = document.documentElement;

    root.style.setProperty('--scanlines-enabled', effects.scanlines ? '1' : '0');
    root.style.setProperty('--curvature-enabled', effects.curvature ? '1' : '0');
    root.style.setProperty('--noise-enabled', effects.noise ? '1' : '0');
    root.style.setProperty('--glitch-enabled', effects.glitch ? '1' : '0');

    console.log(`[ThemeManager] Applied effects`);
  }
}

/**
 * Create a singleton instance for global use
 */
let themeManagerInstance: ThemeManager | null = null;

export function getThemeManager(userId?: string): ThemeManager {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager(userId);
  }
  return themeManagerInstance;
}
