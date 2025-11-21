/**
 * Hook for keyboard shortcut tutorial animations
 * Requirements: 30.4
 */

import { useState, useEffect, useCallback } from 'react';

export interface ShortcutTutorialFrame {
  title: string;
  content: string[];
  highlightedKey?: string;
}

export interface ShortcutTutorial {
  shortcut: string;
  frames: ShortcutTutorialFrame[];
  duration: number; // ms per frame
}

/**
 * Hook to manage keyboard shortcut tutorial animations
 */
export function useKeyboardShortcutTutorial(tutorial: ShortcutTutorial | null) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset when tutorial changes
  useEffect(() => {
    if (tutorial) {
      setCurrentFrame(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [tutorial]);

  // Animate through frames
  useEffect(() => {
    if (!tutorial || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentFrame(prev => {
        const next = prev + 1;
        if (next >= tutorial.frames.length) {
          setIsPlaying(false);
          return prev; // Stay on last frame
        }
        return next;
      });
    }, tutorial.duration);

    return () => clearInterval(timer);
  }, [tutorial, isPlaying]);

  const restart = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    currentFrame: tutorial ? tutorial.frames[currentFrame] : null,
    frameIndex: currentFrame,
    totalFrames: tutorial?.frames.length || 0,
    isPlaying,
    restart,
    stop
  };
}

/**
 * Create a tutorial for a specific shortcut
 */
export function createTutorial(
  shortcut: string,
  label: string,
  description: string,
  visual: string
): ShortcutTutorial {
  return {
    shortcut,
    frames: [
      {
        title: `TUTORIAL: ${label}`,
        content: [
          '═══════════════════════════════════',
          '',
          `Press: ${visual}`,
          '',
          `Action: ${description}`,
          '',
          'Watch the key highlight...'
        ]
      },
      {
        title: `TUTORIAL: ${label}`,
        content: [
          '═══════════════════════════════════',
          '',
          `>>> ${visual} <<<`,
          '',
          `Action: ${description}`,
          '',
          'Key is pressed!'
        ],
        highlightedKey: shortcut
      },
      {
        title: `TUTORIAL: ${label}`,
        content: [
          '═══════════════════════════════════',
          '',
          `Press: ${visual}`,
          '',
          `✓ ${description}`,
          '',
          'Tutorial complete!'
        ]
      }
    ],
    duration: 1500 // 1.5 seconds per frame
  };
}

/**
 * Predefined tutorials for common shortcuts
 */
export const SHORTCUT_TUTORIALS: Record<string, ShortcutTutorial> = {
  'red-button': createTutorial(
    'R',
    'Red Button',
    'Quick link (varies by page)',
    '[🔴 R]'
  ),
  'green-button': createTutorial(
    'G',
    'Green Button',
    'Quick link (varies by page)',
    '[🟢 G]'
  ),
  'yellow-button': createTutorial(
    'Y',
    'Yellow Button',
    'Quick link (varies by page)',
    '[🟡 Y]'
  ),
  'blue-button': createTutorial(
    'B',
    'Blue Button',
    'Quick link (varies by page)',
    '[🔵 B]'
  ),
  'enter': createTutorial(
    'Enter',
    'Enter Key',
    'Navigate to entered page',
    '[⏎ Enter]'
  ),
  'backspace': createTutorial(
    'Backspace',
    'Backspace Key',
    'Delete last digit / Go back',
    '[⌫ Backspace]'
  ),
  'arrow-up': createTutorial(
    'ArrowUp',
    'Arrow Up',
    'Scroll up / Previous page',
    '[↑]'
  ),
  'arrow-down': createTutorial(
    'ArrowDown',
    'Arrow Down',
    'Scroll down / Next page',
    '[↓]'
  )
};
