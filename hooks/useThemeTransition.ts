/**
 * Theme Transition Hook
 * 
 * Manages animated transitions between themes with visual feedback
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5
 */

'use client';

import { useState, useCallback, useRef } from 'react';

export interface ThemeTransitionOptions {
  duration?: number;  // Duration in milliseconds (default: 500-1000ms based on theme)
  showBanner?: boolean;  // Whether to show theme name banner (default: true)
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

export interface ThemeTransitionState {
  isTransitioning: boolean;
  currentPhase: 'idle' | 'fade-out' | 'switching' | 'fade-in' | 'banner';
  bannerVisible: boolean;
  bannerText: string;
  bannerTheme: string;
}

/**
 * Hook for managing theme transitions with animations
 */
export function useThemeTransition() {
  const [state, setState] = useState<ThemeTransitionState>({
    isTransitioning: false,
    currentPhase: 'idle',
    bannerVisible: false,
    bannerText: '',
    bannerTheme: ''
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Execute a theme transition with animations
   * 
   * @param fromTheme - Current theme key
   * @param toTheme - Target theme key
   * @param themeName - Display name for the theme
   * @param themeChangeCallback - Function to actually change the theme
   * @param options - Transition options
   */
  const executeTransition = useCallback(
    async (
      fromTheme: string,
      toTheme: string,
      themeName: string,
      themeChangeCallback: () => Promise<void>,
      options: ThemeTransitionOptions = {}
    ): Promise<void> => {
      // Clear any existing timeouts
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }

      const {
        duration = toTheme === 'haunting' ? 1000 : 500,
        showBanner = true,
        onTransitionStart,
        onTransitionComplete
      } = options;

      // Start transition
      setState({
        isTransitioning: true,
        currentPhase: 'fade-out',
        bannerVisible: false,
        bannerText: '',
        bannerTheme: toTheme
      });

      if (onTransitionStart) {
        onTransitionStart();
      }

      // Phase 1: Fade out (first half of duration)
      const fadeOutDuration = duration / 2;
      
      await new Promise<void>((resolve) => {
        transitionTimeoutRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            currentPhase: 'switching'
          }));
          resolve();
        }, fadeOutDuration);
      });

      // Phase 2: Switch theme (instant)
      await themeChangeCallback();

      // Phase 3: Fade in (second half of duration)
      setState(prev => ({
        ...prev,
        currentPhase: 'fade-in'
      }));

      await new Promise<void>((resolve) => {
        transitionTimeoutRef.current = setTimeout(() => {
          resolve();
        }, fadeOutDuration);
      });

      // Phase 4: Show banner (if enabled)
      if (showBanner) {
        const bannerText = toTheme === 'haunting' 
          ? '🎃 HAUNTING MODE ACTIVATED 🎃'
          : `${themeName.toUpperCase()} MODE ACTIVATED`;

        setState(prev => ({
          ...prev,
          currentPhase: 'banner',
          bannerVisible: true,
          bannerText,
          bannerTheme: toTheme
        }));

        // Hide banner after 2 seconds
        bannerTimeoutRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            bannerVisible: false
          }));

          // Complete transition after banner fades
          setTimeout(() => {
            setState({
              isTransitioning: false,
              currentPhase: 'idle',
              bannerVisible: false,
              bannerText: '',
              bannerTheme: ''
            });

            if (onTransitionComplete) {
              onTransitionComplete();
            }
          }, 500);
        }, 2000);
      } else {
        // Complete transition immediately if no banner
        setState({
          isTransitioning: false,
          currentPhase: 'idle',
          bannerVisible: false,
          bannerText: '',
          bannerTheme: ''
        });

        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }
    },
    []
  );

  /**
   * Get CSS class for current transition phase
   */
  const getTransitionClass = useCallback((): string => {
    switch (state.currentPhase) {
      case 'fade-out':
        return state.bannerTheme === 'haunting' 
          ? 'haunting-theme-transition' 
          : 'theme-transition-fade-out';
      case 'fade-in':
        return 'theme-transition-fade-in';
      default:
        return '';
    }
  }, [state.currentPhase, state.bannerTheme]);

  /**
   * Cancel any ongoing transition
   */
  const cancelTransition = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }

    setState({
      isTransitioning: false,
      currentPhase: 'idle',
      bannerVisible: false,
      bannerText: '',
      bannerTheme: ''
    });
  }, []);

  return {
    state,
    executeTransition,
    getTransitionClass,
    cancelTransition
  };
}
