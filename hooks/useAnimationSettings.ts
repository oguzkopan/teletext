/**
 * Animation Settings Hook
 * 
 * Manages animation settings for page 701 with real-time preview and Firestore persistence
 * Requirements: 12.5 - Animation intensity controls
 */

import { useState, useEffect, useCallback } from 'react';
import { getAnimationAccessibility } from '@/lib/animation-accessibility';
import { db } from '@/lib/firebase-client';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AnimationSettingsState {
  animationsEnabled: boolean;
  animationIntensity: number;
  transitionsEnabled: boolean;
  decorationsEnabled: boolean;
  backgroundEffectsEnabled: boolean;
}

export interface AnimationSettingsControls {
  settings: AnimationSettingsState;
  updateSetting: (key: keyof AnimationSettingsState, value: boolean | number) => Promise<void>;
  adjustIntensity: (delta: number) => Promise<void>;
  toggleAnimations: () => Promise<void>;
  toggleTransitions: () => Promise<void>;
  toggleDecorations: () => Promise<void>;
  toggleBackgrounds: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const DEFAULT_SETTINGS: AnimationSettingsState = {
  animationsEnabled: true,
  animationIntensity: 100,
  transitionsEnabled: true,
  decorationsEnabled: true,
  backgroundEffectsEnabled: true
};

/**
 * Hook for managing animation settings with Firestore persistence
 * Requirement: 12.5 - Add animation intensity controls to settings page
 */
export function useAnimationSettings(): AnimationSettingsControls {
  const [settings, setSettings] = useState<AnimationSettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from Firestore on mount
  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load settings from Firestore
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const userId = 'default_user';
      const userPrefsRef = doc(db, 'user_preferences', userId);
      const userPrefsDoc = await getDoc(userPrefsRef);

      if (userPrefsDoc.exists()) {
        const data = userPrefsDoc.data();
        const loadedSettings: AnimationSettingsState = {
          animationsEnabled: data.animationSettings?.animationsEnabled ?? DEFAULT_SETTINGS.animationsEnabled,
          animationIntensity: data.animationSettings?.animationIntensity ?? DEFAULT_SETTINGS.animationIntensity,
          transitionsEnabled: data.animationSettings?.transitionsEnabled ?? DEFAULT_SETTINGS.transitionsEnabled,
          decorationsEnabled: data.animationSettings?.decorationsEnabled ?? DEFAULT_SETTINGS.decorationsEnabled,
          backgroundEffectsEnabled: data.animationSettings?.backgroundEffectsEnabled ?? DEFAULT_SETTINGS.backgroundEffectsEnabled
        };

        setSettings(loadedSettings);
        
        // Apply to animation accessibility system
        applyToAccessibilitySystem(loadedSettings);
        
        console.log('Animation settings loaded from Firestore:', loadedSettings);
      } else {
        // No saved settings, use defaults
        applyToAccessibilitySystem(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading animation settings:', error);
      // Use defaults on error
      applyToAccessibilitySystem(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save settings to Firestore
   * Requirement: 12.5 - Save animation preferences to Firestore
   */
  const saveSettings = async (newSettings: AnimationSettingsState) => {
    try {
      setIsSaving(true);
      const userId = 'default_user';
      const userPrefsRef = doc(db, 'user_preferences', userId);

      await setDoc(userPrefsRef, {
        userId,
        animationSettings: newSettings,
        updatedAt: new Date()
      }, { merge: true });

      console.log('Animation settings saved to Firestore:', newSettings);
    } catch (error) {
      console.error('Error saving animation settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Apply settings to the animation accessibility system
   * Requirement: 12.5 - Implement real-time preview of animation changes
   */
  const applyToAccessibilitySystem = (newSettings: AnimationSettingsState) => {
    const accessibility = getAnimationAccessibility();
    
    accessibility.updateSettings({
      enabled: newSettings.animationsEnabled,
      intensity: newSettings.animationIntensity,
      transitionsEnabled: newSettings.transitionsEnabled,
      decorationsEnabled: newSettings.decorationsEnabled,
      backgroundEffectsEnabled: newSettings.backgroundEffectsEnabled,
      respectSystemPreference: true
    });
  };

  /**
   * Update a specific setting
   * Requirement: 12.5 - Changes apply immediately
   */
  const updateSetting = useCallback(async (key: keyof AnimationSettingsState, value: boolean | number) => {
    const newSettings = {
      ...settings,
      [key]: value
    };

    // Ensure intensity is within valid range
    if (key === 'animationIntensity' && typeof value === 'number') {
      newSettings.animationIntensity = Math.max(0, Math.min(100, value));
    }

    setSettings(newSettings);
    applyToAccessibilitySystem(newSettings);
    await saveSettings(newSettings);
  }, [settings]);

  /**
   * Adjust animation intensity by delta
   * Requirement: 12.5 - Animation intensity slider (0-100%)
   */
  const adjustIntensity = useCallback(async (delta: number) => {
    const newIntensity = Math.max(0, Math.min(100, settings.animationIntensity + delta));
    await updateSetting('animationIntensity', newIntensity);
  }, [settings.animationIntensity, updateSetting]);

  /**
   * Toggle all animations on/off
   */
  const toggleAnimations = useCallback(async () => {
    await updateSetting('animationsEnabled', !settings.animationsEnabled);
  }, [settings.animationsEnabled, updateSetting]);

  /**
   * Toggle transitions
   * Requirement: 12.5 - Individual controls for different animation types
   */
  const toggleTransitions = useCallback(async () => {
    await updateSetting('transitionsEnabled', !settings.transitionsEnabled);
  }, [settings.transitionsEnabled, updateSetting]);

  /**
   * Toggle decorations
   * Requirement: 12.5 - Individual controls for different animation types
   */
  const toggleDecorations = useCallback(async () => {
    await updateSetting('decorationsEnabled', !settings.decorationsEnabled);
  }, [settings.decorationsEnabled, updateSetting]);

  /**
   * Toggle background effects
   * Requirement: 12.5 - Individual controls for different animation types
   */
  const toggleBackgrounds = useCallback(async () => {
    await updateSetting('backgroundEffectsEnabled', !settings.backgroundEffectsEnabled);
  }, [settings.backgroundEffectsEnabled, updateSetting]);

  /**
   * Reset all settings to defaults
   * Requirement: 12.5 - Add "reset to defaults" button
   */
  const resetToDefaults = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    applyToAccessibilitySystem(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    adjustIntensity,
    toggleAnimations,
    toggleTransitions,
    toggleDecorations,
    toggleBackgrounds,
    resetToDefaults,
    isLoading,
    isSaving
  };
}
