'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeConfig } from '@/types/teletext';
import { useThemeTransition } from '@/hooks/useThemeTransition';
import { ThemeManager, themes, themeRegistry } from '@/lib/theme-manager';

// Re-export themes and registry for backward compatibility
export { themes, themeRegistry };

interface ThemeContextType {
  currentTheme: ThemeConfig;
  currentThemeKey: string;
  setTheme: (themeKey: string) => Promise<void>;
  confirmationMessage: string | null;
  isTransitioning: boolean;
  transitionBanner: {
    visible: boolean;
    text: string;
    theme: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeManager] = useState(() => new ThemeManager('default_user'));
  const [currentThemeKey, setCurrentThemeKey] = useState<string>('ceefax');
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes.ceefax);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  
  // Use theme transition hook for animated transitions
  const { state: transitionState, executeTransition, getTransitionClass } = useThemeTransition();

  // Initialize theme manager on mount
  // Requirements: 8.1, 8.2, 8.6
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        await themeManager.initialize();
        const loadedTheme = themeManager.getCurrentTheme();
        const loadedThemeKey = themeManager.getCurrentThemeKey();
        
        setCurrentThemeKey(loadedThemeKey);
        setCurrentTheme(loadedTheme);
        
        // Apply CSS variables immediately
        themeManager.applyCSSVariables(loadedTheme);
        
        console.log(`[ThemeProvider] Initialized with theme: ${loadedThemeKey}`);
      } catch (error) {
        console.error('[ThemeProvider] Error initializing theme:', error);
      }
    };

    initializeTheme();

    // Set up listener for cross-tab sync
    // Requirement: 8.6
    const handleThemeChange = (newThemeKey: string) => {
      setCurrentThemeKey(newThemeKey);
      setCurrentTheme(themes[newThemeKey]);
      console.log(`[ThemeProvider] Theme synced from another tab: ${newThemeKey}`);
    };

    themeManager.addStorageListener(handleThemeChange);

    return () => {
      themeManager.removeStorageListener(handleThemeChange);
    };
  }, [themeManager]);

  // Set theme and save to Firestore with animated transition
  // Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 37.2, 37.3, 37.4, 8.2, 8.4, 8.6
  const setTheme = useCallback(async (themeKey: string) => {
    if (!themes[themeKey]) {
      console.error(`[ThemeProvider] Invalid theme key: ${themeKey}`);
      return;
    }

    const newTheme = themes[themeKey];
    const oldThemeKey = currentThemeKey;

    // Execute animated transition
    // Requirements: 27.1, 27.2, 27.3, 27.4
    await executeTransition(
      oldThemeKey,
      themeKey,
      newTheme.name,
      async () => {
        // Update state during transition
        // Requirement: 37.2
        setCurrentThemeKey(themeKey);
        setCurrentTheme(newTheme);

        // Use ThemeManager to set theme and persist
        // Requirements: 8.2, 8.4, 8.6
        try {
          await themeManager.setTheme(themeKey);
          console.log(`[ThemeProvider] Theme set via ThemeManager: ${themeKey}`);
        } catch (error) {
          console.error('[ThemeProvider] Error setting theme via ThemeManager:', error);
          // Fallback: apply CSS variables directly
          themeManager.applyCSSVariables(newTheme);
        }
      },
      {
        duration: themeKey === 'haunting' ? 1000 : 500,
        showBanner: true,
        onTransitionComplete: () => {
          // Show confirmation message after transition
          // Requirement: 37.3
          setConfirmationMessage(`Theme applied: ${newTheme.name}`);
          setTimeout(() => {
            setConfirmationMessage(null);
          }, 3000);
        }
      }
    );
  }, [currentThemeKey, executeTransition, themeManager]);

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        currentThemeKey, 
        setTheme, 
        confirmationMessage,
        isTransitioning: transitionState.isTransitioning,
        transitionBanner: {
          visible: transitionState.bannerVisible,
          text: transitionState.bannerText,
          theme: transitionState.bannerTheme
        }
      }}
    >
      {/* Theme transition overlay */}
      {transitionState.isTransitioning && (
        <div 
          className={`theme-transition-overlay ${getTransitionClass()}`}
          aria-hidden="true"
        />
      )}
      
      {/* Theme name banner */}
      {transitionState.bannerVisible && (
        <div 
          className={`theme-banner ${transitionState.bannerTheme}`}
          role="status"
          aria-live="polite"
        >
          {transitionState.bannerText}
        </div>
      )}
      
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
