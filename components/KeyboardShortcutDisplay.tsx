/**
 * Keyboard Shortcut Display Component
 * 
 * Displays keyboard shortcuts with visual highlighting
 * Requirements: 30.1, 30.2, 30.5
 */

'use client';

import { useEffect, useState } from 'react';

interface KeyboardShortcutDisplayProps {
  highlightedKeys?: string[];
  frequentKeys?: string[];
}

/**
 * Component to enhance keyboard shortcut visualization on page 720
 */
export default function KeyboardShortcutDisplay({
  highlightedKeys = [],
  frequentKeys = []
}: KeyboardShortcutDisplayProps) {
  const [pulseKeys, setPulseKeys] = useState<Set<string>>(new Set());

  // Animate frequently used shortcuts with pulsing effect
  // Requirements: 30.5
  useEffect(() => {
    if (frequentKeys.length === 0) return;

    const interval = setInterval(() => {
      // Randomly pulse one of the frequent keys
      const randomKey = frequentKeys[Math.floor(Math.random() * frequentKeys.length)];
      setPulseKeys(new Set([randomKey]));

      // Clear pulse after animation
      setTimeout(() => {
        setPulseKeys(new Set());
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [frequentKeys]);

  // This component adds CSS classes to enhance the display
  // The actual highlighting is done via CSS
  useEffect(() => {
    // Add highlighting class to keyboard shortcut elements
    const keyElements = document.querySelectorAll('[data-key]');
    
    keyElements.forEach(element => {
      const key = element.getAttribute('data-key');
      if (!key) return;

      // Check if this key should be highlighted
      const isHighlighted = highlightedKeys.some(pattern => {
        if (pattern === '0-9') {
          return /^[0-9]$/.test(key);
        }
        return pattern === key;
      });

      // Check if this is a frequently used key
      const isFrequent = frequentKeys.includes(key);

      // Check if this key should pulse
      const shouldPulse = pulseKeys.has(key);

      if (isHighlighted) {
        element.classList.add('keyboard-key-highlighted');
      }

      if (isFrequent) {
        element.classList.add('keyboard-key-frequent');
      }

      if (shouldPulse) {
        element.classList.add('keyboard-key-pulse');
      } else {
        element.classList.remove('keyboard-key-pulse');
      }
    });
  }, [highlightedKeys, frequentKeys, pulseKeys]);

  return null; // This is a utility component that doesn't render anything
}
