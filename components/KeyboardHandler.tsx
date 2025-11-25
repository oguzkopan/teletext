'use client';

import { useEffect } from 'react';
import { PageRouterState } from './PageRouter';
import { useTheme } from '@/lib/theme-context';
import { useAnimationSettings } from '@/hooks/useAnimationSettings';

interface KeyboardHandlerProps {
  routerState: PageRouterState;
}

/**
 * KeyboardHandler Component
 * 
 * Handles keyboard input for teletext navigation
 * Integrated with new navigation router and input handler
 * 
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5 - Navigation router integration
 * Requirements: 37.1, 37.2 - Theme selection on page 700
 * Requirements: 12.5 - Animation settings controls on page 701
 */
export default function KeyboardHandler({ routerState }: KeyboardHandlerProps) {
  const { setTheme } = useTheme();
  const animationSettings = useAnimationSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're on page 700 (theme selection page)
      const isThemeSelectionPage = routerState.currentPage?.id === '700' && 
                                   routerState.currentPage?.meta?.themeSelectionPage;

      // Check if we're on page 701 (animation settings page)
      const isSettingsPage = routerState.currentPage?.id === '701' && 
                             routerState.currentPage?.meta?.settingsPage;

      // On page 700, handle theme selection with number keys 1-4
      // Requirement: 37.1, 37.2
      if (isThemeSelectionPage && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const themeMap: Record<string, string> = {
          '1': 'ceefax',
          '2': 'orf',
          '3': 'highcontrast',
          '4': 'haunting'
        };
        const themeKey = themeMap[e.key];
        if (themeKey) {
          setTheme(themeKey);
        }
        return;
      }

      // On page 701, handle animation settings controls
      // Requirement: 12.5 - Animation intensity controls
      if (isSettingsPage) {
        // Arrow keys to adjust intensity
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          animationSettings.adjustIntensity(5);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          animationSettings.adjustIntensity(-5);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          animationSettings.adjustIntensity(-10);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          animationSettings.adjustIntensity(10);
          return;
        }

        // Number keys to toggle animation types
        if (e.key === '1') {
          e.preventDefault();
          animationSettings.toggleAnimations();
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          animationSettings.toggleTransitions();
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          animationSettings.toggleDecorations();
          return;
        }
        if (e.key === '4') {
          e.preventDefault();
          animationSettings.toggleBackgrounds();
          return;
        }

        // Green button (G) to reset to defaults
        if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          animationSettings.resetToDefaults();
          // Reload the page to show updated values
          routerState.navigateToPage('701');
          return;
        }
      }

      // Requirement 16.2: Connect digit input to input handler
      // Digit keys (0-9) - use new navigation router logic
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        routerState.handleDigitPress(parseInt(e.key));
      }
      // Enter key
      else if (e.key === 'Enter') {
        e.preventDefault();
        routerState.handleEnter();
      }
      // Arrow keys
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        routerState.handleNavigate('up');
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        routerState.handleNavigate('down');
      }
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        routerState.handleNavigate('back');
      }
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        routerState.handleNavigate('forward');
      }
      // Backspace - remove last digit from input buffer
      // Requirement 16.2: Connect to input handler
      else if (e.key === 'Backspace') {
        e.preventDefault();
        // If there's input in the buffer, remove last digit
        // Otherwise, navigate back
        if (routerState.inputBuffer.length > 0) {
          routerState.handleBackspace?.();
        } else {
          routerState.handleNavigate('back');
        }
      }
      // Color buttons (R, G, Y, B)
      else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        routerState.handleColorButton('red');
      }
      else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        routerState.handleColorButton('green');
      }
      else if (e.key.toLowerCase() === 'y') {
        e.preventDefault();
        routerState.handleColorButton('yellow');
      }
      else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        routerState.handleColorButton('blue');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [routerState, setTheme, animationSettings]);

  return null;
}
