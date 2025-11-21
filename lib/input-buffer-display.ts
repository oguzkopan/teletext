/**
 * Input Buffer Display Utilities
 * 
 * Provides utilities for displaying the input buffer with animations
 * Requirements: 6.5, 8.4, 15.1
 */

export interface InputBufferDisplayOptions {
  buffer: string;
  expectedLength: number;
  showCursor?: boolean;
  showHint?: boolean;
  theme?: 'ceefax' | 'haunting' | 'high-contrast' | 'orf';
}

/**
 * Formats the input buffer for display with highlighting
 * Requirement 15.1: Display entered digits with highlighting
 */
export function formatInputBuffer(options: InputBufferDisplayOptions): string {
  const { buffer, expectedLength, showCursor = true, showHint = true } = options;
  
  if (buffer.length === 0 && showHint) {
    // Show input format hint when buffer is empty
    // Requirement 8.4: Display input format
    if (expectedLength === 1) {
      return 'Enter 1 digit';
    } else if (expectedLength === 2) {
      return 'Enter 2 digits';
    } else {
      return 'Enter 3-digit page number';
    }
  }
  
  // Display entered digits with cursor
  let display = buffer;
  
  if (showCursor && buffer.length < expectedLength) {
    display += '_';
  }
  
  return display;
}

/**
 * Gets CSS classes for input buffer animation
 * Requirement 15.1: Digit entry animation (fade in, scale up)
 */
export function getInputBufferAnimationClasses(
  buffer: string,
  previousBuffer: string
): string[] {
  const classes: string[] = ['input-buffer-display'];
  
  // Add animation class when a new digit is entered
  if (buffer.length > previousBuffer.length) {
    classes.push('digit-entry-animation');
  }
  
  // Add clearing animation when buffer is cleared
  if (buffer.length === 0 && previousBuffer.length > 0) {
    classes.push('buffer-clear-animation');
  }
  
  return classes;
}

/**
 * Gets the CSS styles for the input buffer display
 * Requirement 6.5: Animate text entry with blinking cursor
 */
export function getInputBufferStyles(theme: string): string {
  return `
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
  `;
}

/**
 * Gets the position for the input buffer display
 * Can be displayed in header or footer
 */
export function getInputBufferPosition(
  position: 'header' | 'footer' = 'footer'
): { top?: string; bottom?: string; left?: string; right?: string } {
  if (position === 'header') {
    return {
      top: '20px',
      right: '20px'
    };
  } else {
    return {
      bottom: '40px',
      left: '50%'
    };
  }
}
