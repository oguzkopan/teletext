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
      // Check if we're on the snake game page (650)
      const isSnakeGamePage = routerState.currentPage?.id === '650' && 
                             routerState.currentPage?.meta?.snakeGame;
      
      // On snake game page, only let navigation keys (color buttons, digits, backspace) pass through
      // Let the game component handle arrow keys, WASD, space, enter, and S
      if (isSnakeGamePage) {
        const navigationKeys = ['r', 'R', 'g', 'G', 'y', 'Y', 'b', 'B', 'Backspace'];
        const digitKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        // Allow color buttons, digit keys, and backspace for page navigation
        if (navigationKeys.includes(e.key) || digitKeys.includes(e.key)) {
          // Let these pass through to navigation handler below
        } else {
          // Block all other keys - let game handle them
          return;
        }
      }

      // Check if we're on page 700 (theme selection page)
      const isThemeSelectionPage = routerState.currentPage?.id === '700' && 
                                   routerState.currentPage?.meta?.themeSelectionPage;

      // Check if we're on page 701 (animation settings page)
      const isSettingsPage = routerState.currentPage?.id === '701' && 
                             routerState.currentPage?.meta?.settingsPage;

      // Check if we're on page 471 (radio listings page)
      const isRadioPage = routerState.currentPage?.id === '471' && 
                         routerState.currentPage?.meta?.radioPlayer?.enabled;

      // Check if we're in text input mode (for AI Q&A pages)
      const isTextInputMode = routerState.currentPage?.meta?.inputMode === 'text';

      // Check if input is disabled (for error pages)
      const isInputDisabled = routerState.currentPage?.meta?.inputMode === 'disabled' ||
                             routerState.currentPage?.meta?.errorPage;

      // If input is disabled (error pages), only allow back button and Enter for retry
      if (isInputDisabled) {
        // Allow back button (arrow left or backspace)
        if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          e.preventDefault();
          routerState.handleNavigate('back');
          return;
        }
        // Allow Enter key for retry action (if specified in error page)
        if (e.key === 'Enter') {
          e.preventDefault();
          routerState.handleEnter();
          return;
        }
        // Block all other keys
        e.preventDefault();
        return;
      }

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

      // On page 471, handle radio station selection with number keys 1-9
      if (isRadioPage && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        // Station selection is handled by the digit press handler
        routerState.handleDigitPress(parseInt(e.key));
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

      // Text input mode - accept all printable characters
      // Requirements: 1.1, 1.2, 4.1, 4.2, 4.5
      if (isTextInputMode) {
        // Check if page has color button links defined
        const hasColorLinks = routerState.currentPage?.links && routerState.currentPage.links.length > 0;
        
        // Only handle color buttons if the page has color button links
        // This allows typing R, G, Y, B freely on pages without color button navigation
        if (hasColorLinks) {
          if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            routerState.handleColorButton('red');
            return;
          }
          else if (e.key.toLowerCase() === 'g') {
            e.preventDefault();
            routerState.handleColorButton('green');
            return;
          }
          else if (e.key.toLowerCase() === 'y') {
            e.preventDefault();
            routerState.handleColorButton('yellow');
            return;
          }
          else if (e.key.toLowerCase() === 'b') {
            e.preventDefault();
            routerState.handleColorButton('blue');
            return;
          }
        }
        
        // Check if this digit is a single-digit shortcut (e.g., 1-6 on page 501)
        const singleDigitShortcuts = routerState.currentPage?.meta?.singleDigitShortcuts || [];
        const isShortcut = e.key >= '0' && e.key <= '9' && singleDigitShortcuts.includes(e.key);
        
        // If it's a shortcut digit, handle it as navigation
        if (isShortcut) {
          e.preventDefault();
          routerState.handleDigitPress(parseInt(e.key));
          return;
        }
        
        // Arrow Left - allow back navigation even in text input mode
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          routerState.handleNavigate('back');
          return;
        }
        
        // Enter key - submit text input
        if (e.key === 'Enter') {
          e.preventDefault();
          routerState.handleEnter();
          return;
        }
        // Backspace - remove last character (only if there's text in buffer)
        else if (e.key === 'Backspace') {
          e.preventDefault();
          // If buffer is empty, navigate back; otherwise remove last character
          if (routerState.inputBuffer.length === 0) {
            routerState.handleNavigate('back');
          } else {
            routerState.handleBackspace?.();
          }
          return;
        }
        // Accept all printable characters (letters, numbers, symbols, spaces)
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          routerState.handleTextInput?.(e.key);
          return;
        }
        // Ignore other keys in text input mode
        return;
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
