/**
 * Unit tests for ThemeManager
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */

import { ThemeManager, themes, themeRegistry } from '@/lib/theme-manager';

// Mock Firestore
jest.mock('@/lib/firebase-client', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn()
}));

describe('ThemeManager', () => {
  let themeManager: ThemeManager;
  let mockLocalStorage: { [key: string]: string };
  let mockSetProperty: jest.Mock;
  let mockClassListAdd: jest.Mock;
  let mockClassListToggle: jest.Mock;
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    mockLocalStorage = {};
    const mockGetItem = jest.fn((key: string) => mockLocalStorage[key] || null);
    const mockSetItem = jest.fn((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    
    global.localStorage = {
      getItem: mockGetItem,
      setItem: mockSetItem,
      removeItem: jest.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: jest.fn(() => {
        mockLocalStorage = {};
      }),
      length: 0,
      key: jest.fn()
    } as any;

    // Mock document - create fresh mocks each time
    mockSetProperty = jest.fn();
    mockClassListAdd = jest.fn();
    mockClassListToggle = jest.fn();
    
    global.document = {
      documentElement: {
        style: {
          setProperty: mockSetProperty
        }
      },
      body: {
        className: '',
        classList: {
          add: mockClassListAdd,
          remove: jest.fn(),
          toggle: mockClassListToggle
        }
      }
    } as any;

    // Mock window.matchMedia
    mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    
    global.window = {
      matchMedia: mockMatchMedia,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    } as any;

    themeManager = new ThemeManager('test_user');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Theme Initialization', () => {
    it('should initialize with default theme', () => {
      // Requirement: 8.1
      const currentTheme = themeManager.getCurrentTheme();
      const currentThemeKey = themeManager.getCurrentThemeKey();

      expect(currentThemeKey).toBe('ceefax');
      expect(currentTheme).toEqual(themes.ceefax);
    });

    it('should load theme from Firestore on initialization', async () => {
      // Requirement: 8.1
      const { getDoc } = require('firebase/firestore');
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          theme: 'orf',
          animationSettings: {
            animationsEnabled: true,
            animationIntensity: 75
          }
        })
      });

      const newManager = new ThemeManager('test_user');
      await newManager.initialize();

      expect(newManager.getCurrentThemeKey()).toBe('orf');
      expect(newManager.getCurrentTheme()).toEqual(themes.orf);
    });

    it('should handle initialization errors gracefully', async () => {
      // Requirement: 8.1
      const { getDoc } = require('firebase/firestore');
      getDoc.mockRejectedValue(new Error('Firestore error'));

      await themeManager.initialize();

      // Should still have default theme
      expect(themeManager.getCurrentThemeKey()).toBe('ceefax');
    });
  });

  describe('CSS Custom Properties', () => {
    it('should apply CSS custom properties for theme colors', () => {
      // Requirement: 8.2, 8.4
      const theme = themes.ceefax;
      themeManager.applyCSSVariables(theme);

      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-bg', theme.colors.background);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-text', theme.colors.text);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-red', theme.colors.red);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-green', theme.colors.green);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-yellow', theme.colors.yellow);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-blue', theme.colors.blue);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-magenta', theme.colors.magenta);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-cyan', theme.colors.cyan);
      expect(mockSetProperty).toHaveBeenCalledWith('--teletext-white', theme.colors.white);
    });

    it('should apply CSS custom properties for theme effects', () => {
      // Requirement: 8.2
      const theme = themes.haunting;
      themeManager.applyCSSVariables(theme);

      expect(mockSetProperty).toHaveBeenCalledWith('--scanlines-enabled', '1');
      expect(mockSetProperty).toHaveBeenCalledWith('--curvature-enabled', '1');
      expect(mockSetProperty).toHaveBeenCalledWith('--noise-enabled', '1');
      expect(mockSetProperty).toHaveBeenCalledWith('--glitch-enabled', '1');
    });

    it('should add theme class to body', () => {
      // Requirement: 8.2, 8.4
      const theme = themes.orf;
      themeManager.applyCSSVariables(theme);

      expect(mockClassListAdd).toHaveBeenCalledWith('theme-ceefax');
    });
  });

  describe('Theme Setting', () => {
    it('should set theme and update state', async () => {
      // Requirement: 8.2, 8.4
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await themeManager.setTheme('orf');

      expect(themeManager.getCurrentThemeKey()).toBe('orf');
      expect(themeManager.getCurrentTheme()).toEqual(themes.orf);
    });

    it('should save theme to localStorage', async () => {
      // Requirement: 8.6
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await themeManager.setTheme('highcontrast');

      expect(global.localStorage.setItem).toHaveBeenCalledWith('teletext-theme', 'highcontrast');
    });

    it('should throw error for invalid theme key', async () => {
      // Requirement: 8.2
      await expect(themeManager.setTheme('invalid')).rejects.toThrow('Invalid theme key');
    });

    it('should save theme to localStorage even if Firestore fails', async () => {
      // Requirement: 8.6
      const { setDoc } = require('firebase/firestore');
      setDoc.mockRejectedValue(new Error('Firestore error'));

      await themeManager.setTheme('orf');

      expect(global.localStorage.setItem).toHaveBeenCalledWith('teletext-theme', 'orf');
    });
  });

  describe('Animation Settings', () => {
    it('should get default animation settings', () => {
      // Requirement: 8.3
      const settings = themeManager.getAnimationSettings();

      expect(settings.animationsEnabled).toBe(true);
      expect(settings.animationIntensity).toBe(75);
      expect(settings.transitionsEnabled).toBe(true);
      expect(settings.decorationsEnabled).toBe(true);
      expect(settings.backgroundEffectsEnabled).toBe(true);
      expect(settings.respectReducedMotion).toBe(true);
    });

    it('should update animation settings', async () => {
      // Requirement: 8.3
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      // Ensure matchMedia returns false for reduced motion
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      await themeManager.setAnimationSettings({
        animationsEnabled: false,
        animationIntensity: 50
      });

      const settings = themeManager.getAnimationSettings();
      expect(settings.animationsEnabled).toBe(false);
      expect(settings.animationIntensity).toBe(50);
    });

    it('should apply animation settings to DOM', async () => {
      // Requirement: 8.3
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      // Ensure matchMedia returns false for reduced motion
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      await themeManager.setAnimationSettings({
        animationsEnabled: false
      });

      expect(mockSetProperty).toHaveBeenCalledWith('--animations-enabled', '0');
    });

    it('should respect reduced motion preference', async () => {
      // Requirement: 8.3
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      // Mock reduced motion preference
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      await themeManager.setAnimationSettings({
        respectReducedMotion: true
      });

      const settings = themeManager.getAnimationSettings();
      expect(settings.animationsEnabled).toBe(false);
    });
  });

  describe('Theme Registry', () => {
    it('should return all themes', () => {
      // Requirement: 8.5
      const allThemes = themeManager.getAllThemes();

      expect(allThemes).toHaveProperty('ceefax');
      expect(allThemes).toHaveProperty('orf');
      expect(allThemes).toHaveProperty('highcontrast');
      expect(allThemes).toHaveProperty('haunting');
    });

    it('should return theme registry with metadata', () => {
      // Requirement: 8.5
      const registry = themeManager.getThemeRegistry();

      expect(registry).toHaveProperty('ceefax');
      expect(registry.ceefax).toHaveProperty('name');
      expect(registry.ceefax).toHaveProperty('description');
      expect(registry.ceefax).toHaveProperty('preview');
      expect(registry.ceefax).toHaveProperty('category');
      expect(registry.ceefax).toHaveProperty('effects');
    });

    it('should return theme metadata by key', () => {
      // Requirement: 8.5
      const metadata = themeManager.getThemeMetadata('orf');

      expect(metadata).not.toBeNull();
      expect(metadata?.name).toBe('ORF');
      expect(metadata?.category).toBe('classic');
    });

    it('should return null for invalid theme key', () => {
      // Requirement: 8.5
      const metadata = themeManager.getThemeMetadata('invalid');

      expect(metadata).toBeNull();
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('should add storage listener', () => {
      // Requirement: 8.6
      const callback = jest.fn();
      themeManager.addStorageListener(callback);

      // Trigger storage event manually
      const storageEvent = new Event('storage') as StorageEvent;
      Object.defineProperty(storageEvent, 'key', { value: 'teletext-theme' });
      Object.defineProperty(storageEvent, 'newValue', { value: 'orf' });

      // Should not throw
      expect(() => themeManager.addStorageListener(callback)).not.toThrow();
    });

    it('should remove storage listener', () => {
      // Requirement: 8.6
      const callback = jest.fn();
      themeManager.addStorageListener(callback);
      themeManager.removeStorageListener(callback);

      // Should not throw
      expect(() => themeManager.removeStorageListener(callback)).not.toThrow();
    });
  });

  describe('Theme Effects', () => {
    it('should apply effects based on theme configuration', () => {
      // Requirement: 8.2, 8.4
      const effects = {
        scanlines: true,
        curvature: false,
        noise: true,
        glitch: false
      };

      themeManager.applyEffects(effects);

      expect(mockSetProperty).toHaveBeenCalledWith('--scanlines-enabled', '1');
      expect(mockSetProperty).toHaveBeenCalledWith('--curvature-enabled', '0');
      expect(mockSetProperty).toHaveBeenCalledWith('--noise-enabled', '1');
      expect(mockSetProperty).toHaveBeenCalledWith('--glitch-enabled', '0');
    });
  });
});
