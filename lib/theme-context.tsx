'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeConfig } from '@/types/teletext';
import { db } from '@/lib/firebase-client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useThemeTransition } from '@/hooks/useThemeTransition';

// Theme definitions
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
      text: '#00FF00',
      red: '#FF0000',
      green: '#00FF00',
      yellow: '#FF6600',
      blue: '#9933FF',
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
  const [currentThemeKey, setCurrentThemeKey] = useState<string>('ceefax');
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes.ceefax);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  
  // Use theme transition hook for animated transitions
  const { state: transitionState, executeTransition, getTransitionClass } = useThemeTransition();

  // Load saved theme preference on startup
  // Requirement: 37.5
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        // Use a default user ID for now (in production, this would be the authenticated user's ID)
        const userId = 'default_user';
        const userPrefsRef = doc(db, 'user_preferences', userId);
        const userPrefsDoc = await getDoc(userPrefsRef);

        if (userPrefsDoc.exists()) {
          const data = userPrefsDoc.data();
          const savedThemeKey = data.theme || 'ceefax';
          
          if (themes[savedThemeKey]) {
            setCurrentThemeKey(savedThemeKey);
            setCurrentTheme(themes[savedThemeKey]);
            console.log(`Loaded saved theme: ${savedThemeKey}`);
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        // Continue with default theme
      }
    };

    loadThemePreference();
  }, []);

  // Set theme and save to Firestore with animated transition
  // Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 37.2, 37.3, 37.4
  const setTheme = useCallback(async (themeKey: string) => {
    if (!themes[themeKey]) {
      console.error(`Invalid theme key: ${themeKey}`);
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

        // Save to Firestore immediately after transition completes
        // Requirement: 27.5, 37.4
        try {
          const userId = 'default_user';
          const userPrefsRef = doc(db, 'user_preferences', userId);
          
          await setDoc(userPrefsRef, {
            userId,
            theme: themeKey,
            favoritePages: [],
            settings: {
              scanlines: newTheme.effects.scanlines,
              curvature: newTheme.effects.curvature,
              noise: newTheme.effects.noise
            },
            effects: {
              scanlinesIntensity: 50,
              curvature: 5,
              noiseLevel: 10
            },
            updatedAt: new Date()
          }, { merge: true });

          console.log(`Theme saved to Firestore: ${themeKey}`);
        } catch (error) {
          console.error('Error saving theme preference:', error);
          // Theme is still applied locally even if save fails
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
  }, [currentThemeKey, executeTransition]);

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
