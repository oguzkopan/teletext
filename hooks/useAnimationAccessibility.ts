/**
 * React Hook for Animation Accessibility
 * 
 * Provides React components with access to animation accessibility state
 * and controls, including system preferences and user settings.
 * 
 * Requirements: 10.5, 12.5
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAnimationAccessibility,
  type AnimationAccessibilitySettings,
  type AnimationAccessibilityState
} from '@/lib/animation-accessibility';

export interface UseAnimationAccessibilityReturn {
  // Current state
  shouldAnimate: boolean;
  systemPrefersReduced: boolean;
  settings: AnimationAccessibilitySettings;
  
  // Control functions
  enableAnimations: () => void;
  disableAnimations: () => void;
  setIntensity: (intensity: number) => void;
  updateSettings: (updates: Partial<AnimationAccessibilitySettings>) => void;
  resetToDefaults: () => void;
  
  // Type-specific checks
  shouldAnimateType: (type: 'transition' | 'decoration' | 'background') => boolean;
  
  // Duration adjustment
  getAdjustedDuration: (baseDuration: number) => number;
}

/**
 * Hook for managing animation accessibility in React components
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldAnimate, disableAnimations } = useAnimationAccessibility();
 *   
 *   return (
 *     <div>
 *       {shouldAnimate && <AnimatedElement />}
 *       <button onClick={disableAnimations}>Disable Animations</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimationAccessibility(): UseAnimationAccessibilityReturn {
  const manager = getAnimationAccessibility();
  
  // Initialize state from manager
  const [state, setState] = useState<AnimationAccessibilityState>(() => 
    manager.getState()
  );

  // Listen for state changes
  useEffect(() => {
    const unsubscribe = manager.addListener((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [manager]);

  // Control functions
  const enableAnimations = useCallback(() => {
    manager.enableAnimations();
  }, [manager]);

  const disableAnimations = useCallback(() => {
    manager.disableAnimations();
  }, [manager]);

  const setIntensity = useCallback((intensity: number) => {
    manager.setIntensity(intensity);
  }, [manager]);

  const updateSettings = useCallback((updates: Partial<AnimationAccessibilitySettings>) => {
    manager.updateSettings(updates);
  }, [manager]);

  const resetToDefaults = useCallback(() => {
    manager.resetToDefaults();
  }, [manager]);

  const shouldAnimateType = useCallback((type: 'transition' | 'decoration' | 'background') => {
    return manager.shouldAnimateType(type);
  }, [manager]);

  const getAdjustedDuration = useCallback((baseDuration: number) => {
    return baseDuration * manager.getAnimationDurationMultiplier();
  }, [manager]);

  return {
    shouldAnimate: state.shouldAnimate,
    systemPrefersReduced: state.systemPrefersReduced,
    settings: state.userSettings,
    enableAnimations,
    disableAnimations,
    setIntensity,
    updateSettings,
    resetToDefaults,
    shouldAnimateType,
    getAdjustedDuration
  };
}

/**
 * Hook for checking if a specific animation type should be shown
 * 
 * @example
 * ```tsx
 * function BackgroundEffect() {
 *   const shouldShow = useAnimationType('background');
 *   
 *   if (!shouldShow) return null;
 *   
 *   return <div className="background-effect">...</div>;
 * }
 * ```
 */
export function useAnimationType(type: 'transition' | 'decoration' | 'background'): boolean {
  const { shouldAnimateType } = useAnimationAccessibility();
  return shouldAnimateType(type);
}

/**
 * Hook for getting adjusted animation duration
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const duration = useAnimationDuration(1000); // Base duration 1000ms
 *   
 *   return (
 *     <div style={{ animationDuration: `${duration}ms` }}>
 *       Animated content
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimationDuration(baseDuration: number): number {
  const { getAdjustedDuration } = useAnimationAccessibility();
  return getAdjustedDuration(baseDuration);
}
