/**
 * Background Effects Module
 * 
 * Manages theme-specific background effects with configurable intensity:
 * - Fog overlay effect for Haunting Mode
 * - Screen flicker effect with configurable intensity
 * - Chromatic aberration effect with RGB channel separation
 * - Scanline overlay for Ceefax theme
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

import { getAnimationAccessibility } from './animation-accessibility';

// ============================================================================
// Type Definitions
// ============================================================================

export type BackgroundEffectType = 'fog' | 'flicker' | 'chromatic' | 'scanlines';
export type EffectIntensity = 'low' | 'medium' | 'high';

export interface BackgroundEffect {
  type: BackgroundEffectType;
  name: string;
  cssClass: string;
  intensity: EffectIntensity;
  enabled: boolean;
  zIndex: number;
}

export interface BackgroundEffectsConfig {
  theme: string;
  effects: BackgroundEffect[];
}

// ============================================================================
// Theme-Specific Effect Configurations
// ============================================================================

/**
 * Ceefax theme background effects
 * Requirement: 12.4 - Create scanline overlay for Ceefax theme
 */
export const CEEFAX_EFFECTS: BackgroundEffect[] = [
  {
    type: 'scanlines',
    name: 'Scanlines',
    cssClass: 'scanlines-overlay',
    intensity: 'medium',
    enabled: true,
    zIndex: 1
  }
];

/**
 * Haunting/Kiroween theme background effects
 * Requirements: 12.1, 12.2, 12.3 - Fog, flicker, and chromatic aberration
 */
export const HAUNTING_EFFECTS: BackgroundEffect[] = [
  {
    type: 'fog',
    name: 'Fog Overlay',
    cssClass: 'fog-overlay',
    intensity: 'medium',
    enabled: true,
    zIndex: 0
  },
  {
    type: 'flicker',
    name: 'Screen Flicker',
    cssClass: 'screen-flicker',
    intensity: 'medium',
    enabled: true,
    zIndex: 2
  },
  {
    type: 'chromatic',
    name: 'Chromatic Aberration',
    cssClass: 'chromatic-aberration',
    intensity: 'medium',
    enabled: true,
    zIndex: 1
  }
];

/**
 * ORF theme background effects
 */
export const ORF_EFFECTS: BackgroundEffect[] = [
  {
    type: 'scanlines',
    name: 'Scanlines',
    cssClass: 'scanlines-overlay',
    intensity: 'low',
    enabled: true,
    zIndex: 1
  }
];

/**
 * High Contrast theme - no background effects
 */
export const HIGH_CONTRAST_EFFECTS: BackgroundEffect[] = [];

// ============================================================================
// Background Effects Manager
// ============================================================================

class BackgroundEffectsManager {
  private currentTheme: string = 'ceefax';
  private effects: Map<BackgroundEffectType, BackgroundEffect> = new Map();
  private targetElement: HTMLElement | null = null;

  /**
   * Initialize background effects for a theme
   * Requirement: 12.1, 12.2, 12.3, 12.4 - Theme-specific background effects
   */
  initializeForTheme(theme: string, targetElement?: HTMLElement): void {
    this.currentTheme = theme;
    this.targetElement = targetElement || document.body;

    // Clear existing effects
    this.clearEffects();

    // Get effects for theme
    const themeEffects = this.getEffectsForTheme(theme);

    // Store effects
    themeEffects.forEach(effect => {
      this.effects.set(effect.type, { ...effect });
    });

    // Apply effects if animations are enabled
    if (this.shouldApplyEffects()) {
      this.applyEffects();
    }
  }

  /**
   * Get effects configuration for a theme
   */
  private getEffectsForTheme(theme: string): BackgroundEffect[] {
    switch (theme.toLowerCase()) {
      case 'ceefax':
        return CEEFAX_EFFECTS;
      case 'haunting':
      case 'kiroween':
        return HAUNTING_EFFECTS;
      case 'orf':
        return ORF_EFFECTS;
      case 'highcontrast':
      case 'high-contrast':
        return HIGH_CONTRAST_EFFECTS;
      default:
        return [];
    }
  }

  /**
   * Check if effects should be applied based on accessibility settings
   * Requirement: 12.5 - Respect animation accessibility settings
   */
  private shouldApplyEffects(): boolean {
    const accessibility = getAnimationAccessibility();
    return accessibility.shouldAnimateType('background');
  }

  /**
   * Apply all enabled effects to target element
   * Requirement: 12.1, 12.2, 12.3, 12.4 - Apply background effects
   */
  private applyEffects(): void {
    if (!this.targetElement) return;

    // Sort effects by z-index
    const sortedEffects = Array.from(this.effects.values())
      .filter(effect => effect.enabled)
      .sort((a, b) => a.zIndex - b.zIndex);

    // Apply each effect
    sortedEffects.forEach(effect => {
      this.applyEffect(effect);
    });
  }

  /**
   * Apply a single effect to target element
   */
  private applyEffect(effect: BackgroundEffect): void {
    if (!this.targetElement) return;

    // Add base effect class
    this.targetElement.classList.add(effect.cssClass);

    // Add intensity class
    const intensityClass = `intensity-${effect.intensity}`;
    this.targetElement.classList.add(intensityClass);

    console.log(`Applied background effect: ${effect.name} (${effect.intensity})`);
  }

  /**
   * Clear all effects from target element
   */
  private clearEffects(): void {
    if (!this.targetElement) return;

    // Get all current effects and remove their classes
    this.effects.forEach(effect => {
      this.targetElement!.classList.remove(effect.cssClass);
      this.targetElement!.classList.remove(`intensity-${effect.intensity}`);
    });

    // Also remove all possible effect classes to be thorough
    const allEffectClasses = [
      'fog-overlay',
      'screen-flicker',
      'chromatic-aberration',
      'scanlines-overlay',
      'intensity-low',
      'intensity-medium',
      'intensity-high'
    ];

    allEffectClasses.forEach(className => {
      this.targetElement!.classList.remove(className);
    });

    // Clear the effects map
    this.effects.clear();
  }

  /**
   * Update intensity for a specific effect
   * Requirement: 12.2 - Allow users to adjust effect intensity
   */
  updateEffectIntensity(type: BackgroundEffectType, intensity: EffectIntensity): void {
    const effect = this.effects.get(type);
    if (!effect) return;

    // Remove old intensity class
    if (this.targetElement) {
      this.targetElement.classList.remove(`intensity-${effect.intensity}`);
    }

    // Update intensity
    effect.intensity = intensity;

    // Apply new intensity class
    if (this.targetElement && effect.enabled) {
      this.targetElement.classList.add(`intensity-${intensity}`);
    }

    console.log(`Updated ${effect.name} intensity to ${intensity}`);
  }

  /**
   * Enable or disable a specific effect
   * Requirement: 12.2 - Allow users to adjust effect intensity
   */
  toggleEffect(type: BackgroundEffectType, enabled: boolean): void {
    const effect = this.effects.get(type);
    if (!effect) return;

    effect.enabled = enabled;

    if (!this.targetElement) return;

    if (enabled && this.shouldApplyEffects()) {
      this.applyEffect(effect);
    } else {
      this.targetElement.classList.remove(effect.cssClass);
      this.targetElement.classList.remove(`intensity-${effect.intensity}`);
    }

    console.log(`${enabled ? 'Enabled' : 'Disabled'} background effect: ${effect.name}`);
  }

  /**
   * Get current effects configuration
   */
  getEffects(): BackgroundEffect[] {
    return Array.from(this.effects.values());
  }

  /**
   * Get a specific effect
   */
  getEffect(type: BackgroundEffectType): BackgroundEffect | undefined {
    return this.effects.get(type);
  }

  /**
   * Update all effects based on accessibility settings
   * Requirement: 12.5 - Respect animation accessibility settings
   */
  updateFromAccessibilitySettings(): void {
    if (this.shouldApplyEffects()) {
      this.applyEffects();
    } else {
      this.clearEffects();
    }
  }

  /**
   * Ensure background effects don't reduce text readability
   * Requirement: 12.3 - Ensure background effects don't reduce text readability
   */
  ensureReadability(): void {
    if (!this.targetElement) return;

    // Check if we need to reduce effect intensity for readability
    const accessibility = getAnimationAccessibility();
    const settings = accessibility.getSettings();

    // If intensity is low, reduce all effects
    if (settings.intensity < 50) {
      this.effects.forEach(effect => {
        if (effect.intensity === 'high') {
          this.updateEffectIntensity(effect.type, 'medium');
        } else if (effect.intensity === 'medium') {
          this.updateEffectIntensity(effect.type, 'low');
        }
      });
    }
  }

  /**
   * Get CSS variables for dynamic intensity control
   */
  getCSSVariables(): Record<string, string> {
    const variables: Record<string, string> = {};

    this.effects.forEach(effect => {
      const intensityValue = this.getIntensityValue(effect.intensity);
      
      switch (effect.type) {
        case 'fog':
          variables['--fog-intensity'] = intensityValue.toString();
          break;
        case 'flicker':
          variables['--flicker-intensity'] = intensityValue.toString();
          break;
        case 'chromatic':
          variables['--chromatic-intensity'] = intensityValue.toString();
          break;
        case 'scanlines':
          variables['--scanlines-intensity'] = intensityValue.toString();
          break;
      }
    });

    return variables;
  }

  /**
   * Convert intensity level to numeric value
   */
  private getIntensityValue(intensity: EffectIntensity): number {
    switch (intensity) {
      case 'low':
        return 0.5;
      case 'medium':
        return 1.0;
      case 'high':
        return 1.5;
      default:
        return 1.0;
    }
  }

  /**
   * Apply CSS variables to target element
   */
  applyCSSVariables(): void {
    if (!this.targetElement) return;

    const variables = this.getCSSVariables();
    Object.entries(variables).forEach(([key, value]) => {
      this.targetElement!.style.setProperty(key, value);
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let backgroundEffectsInstance: BackgroundEffectsManager | null = null;

/**
 * Get the singleton BackgroundEffectsManager instance
 */
export function getBackgroundEffects(): BackgroundEffectsManager {
  if (!backgroundEffectsInstance) {
    backgroundEffectsInstance = new BackgroundEffectsManager();
  }
  return backgroundEffectsInstance;
}

/**
 * Reset the BackgroundEffectsManager instance (useful for testing)
 */
export function resetBackgroundEffects(): void {
  backgroundEffectsInstance = null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Initialize background effects for a theme
 * Requirement: 12.1, 12.2, 12.3, 12.4 - Initialize theme-specific effects
 */
export function initializeBackgroundEffects(theme: string, targetElement?: HTMLElement): void {
  const manager = getBackgroundEffects();
  manager.initializeForTheme(theme, targetElement);
  manager.applyCSSVariables();
  manager.ensureReadability();
}

/**
 * Update effect intensity
 * Requirement: 12.2 - Allow users to adjust effect intensity
 */
export function updateEffectIntensity(type: BackgroundEffectType, intensity: EffectIntensity): void {
  const manager = getBackgroundEffects();
  manager.updateEffectIntensity(type, intensity);
  manager.applyCSSVariables();
}

/**
 * Toggle effect on/off
 */
export function toggleEffect(type: BackgroundEffectType, enabled: boolean): void {
  const manager = getBackgroundEffects();
  manager.toggleEffect(type, enabled);
}

/**
 * Get all effects for current theme
 */
export function getCurrentEffects(): BackgroundEffect[] {
  return getBackgroundEffects().getEffects();
}

/**
 * Update effects based on accessibility settings
 */
export function updateEffectsFromAccessibility(): void {
  getBackgroundEffects().updateFromAccessibilitySettings();
}
