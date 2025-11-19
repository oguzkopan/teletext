'use client';

import { useEffect } from 'react';
import { PageRouterState } from './PageRouter';

interface KeyboardHandlerProps {
  routerState: PageRouterState;
}

/**
 * KeyboardHandler Component
 * 
 * Handles keyboard input for teletext navigation
 */
export default function KeyboardHandler({ routerState }: KeyboardHandlerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Digit keys (0-9)
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
  }, [routerState]);

  return null;
}
