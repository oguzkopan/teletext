'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ThemeConfig } from '@/types/teletext';
import {
  formatInputBuffer,
  getInputBufferAnimationClasses,
  getInputBufferStyles,
  getInputBufferPosition
} from '@/lib/input-buffer-display';

interface InputBufferDisplayProps {
  buffer: string;
  expectedLength: number;
  theme: ThemeConfig;
  position?: 'header' | 'footer';
  visible?: boolean;
  inputMode?: 'single' | 'double' | 'triple' | 'text';
}

/**
 * InputBufferDisplay Component
 * 
 * Displays the input buffer with animations and visual feedback
 * Supports all input modes including text entry
 * 
 * Requirements: 4.6, 6.5, 8.4, 15.1
 */
export default function InputBufferDisplay({
  buffer,
  expectedLength,
  theme,
  position = 'footer',
  visible = true,
  inputMode
}: InputBufferDisplayProps) {
  const [previousBuffer, setPreviousBuffer] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map theme names to theme keys
  const getThemeKey = (themeName: string): string => {
    const themeMap: Record<string, string> = {
      'Ceefax': 'ceefax',
      'Haunting Mode': 'haunting',
      'High Contrast': 'high-contrast',
      'ORF': 'orf'
    };
    return themeMap[themeName] || 'ceefax';
  };

  const themeKey = getThemeKey(theme.name);

  // Track buffer changes for animations
  useEffect(() => {
    if (buffer !== previousBuffer) {
      // Trigger animation by updating key
      setAnimationKey(prev => prev + 1);
      
      // Check if buffer was cleared
      if (buffer.length === 0 && previousBuffer.length > 0) {
        setIsClearing(true);
        
        // Clear the clearing state after animation completes
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsClearing(false);
        }, 200);
      }
      
      setPreviousBuffer(buffer);
    }
  }, [buffer, previousBuffer]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render if not visible or if clearing animation is complete
  if (!visible || (isClearing && buffer.length === 0)) {
    return null;
  }

  const displayText = formatInputBuffer({
    buffer,
    expectedLength,
    showCursor: inputMode === 'text' ? true : (buffer.length > 0 && buffer.length < expectedLength),
    showHint: buffer.length === 0,
    theme: themeKey as 'ceefax' | 'haunting' | 'high-contrast' | 'orf',
    inputMode
  });

  const animationClasses = getInputBufferAnimationClasses(buffer, previousBuffer);
  const positionStyles = getInputBufferPosition(position);

  // Determine if this is a hint or actual input
  const isHint = buffer.length === 0;

  return (
    <>
      <div
        key={animationKey}
        className={`${animationClasses.join(' ')} input-buffer-${themeKey} ${isHint ? 'input-buffer-hint' : ''} ${inputMode === 'text' ? 'input-buffer-text-mode' : ''}`}
        style={{
          position: 'absolute',
          ...positionStyles,
          transform: position === 'footer' ? 'translateX(-50%)' : undefined,
          zIndex: 15,
          color: theme.colors.yellow,
          backgroundColor: `${theme.colors.yellow}20`,
          border: `1px solid ${theme.colors.yellow}`,
          pointerEvents: 'none',
          maxWidth: inputMode === 'text' ? '80%' : undefined,
          whiteSpace: inputMode === 'text' ? 'pre-wrap' : undefined,
          wordBreak: inputMode === 'text' ? 'break-word' : undefined
        }}
      >
        {displayText}
      </div>
      
      <style jsx>{`
        .input-buffer-display {
          font-family: 'Courier New', Courier, monospace;
          font-size: 16px;
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 2px;
          display: inline-block;
          min-width: 120px;
          text-align: center;
          transition: all 0.2s ease;
        }
        
        /* Digit entry animation - fade in and scale up */
        .digit-entry-animation {
          animation: digitEntry 0.3s ease-out;
        }
        
        @keyframes digitEntry {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Buffer clear animation - fade out */
        .buffer-clear-animation {
          animation: bufferClear 0.2s ease-out;
        }
        
        @keyframes bufferClear {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
        
        /* Blinking cursor animation */
        .input-buffer-display::after {
          content: '';
          display: inline-block;
          width: 0;
          animation: cursorBlink 1s step-end infinite;
        }
        
        @keyframes cursorBlink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        /* Theme-specific highlighting */
        .input-buffer-ceefax {
          background-color: rgba(255, 255, 0, 0.2);
          color: #ffff00;
          border: 1px solid #ffff00;
        }
        
        .input-buffer-haunting {
          background-color: rgba(255, 0, 0, 0.2);
          color: #ff0000;
          border: 1px solid #ff0000;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          animation: glitchPulse 2s ease-in-out infinite;
        }
        
        @keyframes glitchPulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
          }
        }
        
        .input-buffer-high-contrast {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: 2px solid #ffffff;
        }
        
        .input-buffer-orf {
          background-color: rgba(0, 255, 255, 0.2);
          color: #00ffff;
          border: 1px solid #00ffff;
          animation: colorCycle 3s linear infinite;
        }
        
        @keyframes colorCycle {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        
        /* Hint text styling */
        .input-buffer-hint {
          font-size: 12px;
          opacity: 0.7;
          font-style: italic;
        }
        
        /* Text mode styling - wider display for text input */
        .input-buffer-text-mode {
          min-width: 200px;
          text-align: left;
          padding: 8px 12px;
        }
      `}</style>
    </>
  );
}
