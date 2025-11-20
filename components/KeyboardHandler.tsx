'use client';

import { useEffect } from 'react';
import { PageRouterState } from './PageRouter';
import { useTheme } from '@/lib/theme-context';

interface KeyboardHandlerProps {
  routerState: PageRouterState;
}

/**
 * KeyboardHandler Component
 * 
 * Handles keyboard input for teletext navigation
 * Requirements: 37.1, 37.2 - Theme selection on page 700
 */
export default function KeyboardHandler({ routerState }: KeyboardHandlerProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're on page 700 (theme selection page)
      const isThemeSelectionPage = routerState.currentPage?.id === '700' && 
                                   routerState.currentPage?.meta?.themeSelectionPage;

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

      // Digit keys (0-9) - normal page navigation
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
      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        routerState.handleNavigate('back');
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
  }, [routerState, setTheme]);

  return null;
}
