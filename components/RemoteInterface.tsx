'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { TeletextPage } from '@/types/teletext';

interface RemoteInterfaceProps {
  onDigitPress: (digit: number) => void;
  onNavigate: (direction: 'back' | 'forward' | 'up' | 'down') => void;
  onColorButton: (color: 'red' | 'green' | 'yellow' | 'blue') => void;
  onEnter: () => void;
  onFavoriteKey?: (index: number) => void;
  currentInput: string;
  expectedInputLength?: number; // 1, 2, or 3 digits expected
  currentPage?: TeletextPage | null; // For dynamic button labeling
  canGoBack?: boolean;
  canGoForward?: boolean;
}

/**
 * RemoteInterface Component
 * 
 * Provides on-screen numeric keypad and control buttons for navigation.
 * Also handles keyboard event listeners for the same controls.
 * Enhanced with visual feedback, dynamic button labeling, and tooltips.
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 15.1, 15.2, 15.3, 15.4, 26.1, 26.2, 26.3, 26.4, 26.5
 */
export default function RemoteInterface({
  onDigitPress,
  onNavigate,
  onColorButton,
  onEnter,
  onFavoriteKey,
  currentInput,
  expectedInputLength = 3,
  currentPage,
  canGoBack = false,
  canGoForward = false
}: RemoteInterfaceProps) {
  // Visual feedback state
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [flashingButton, setFlashingButton] = useState<string | null>(null);
  
  // Visual feedback helper - shows button press animation
  const showButtonFeedback = useCallback((buttonId: string) => {
    setPressedButton(buttonId);
    setFlashingButton(buttonId);
    
    // Clear pressed state after depression animation
    setTimeout(() => setPressedButton(null), 150);
    
    // Clear flash state after flash animation
    setTimeout(() => setFlashingButton(null), 300);
  }, []);

  // Get dynamic button labels based on current page
  const getColorButtonLabel = useCallback((color: 'red' | 'green' | 'yellow' | 'blue'): string => {
    if (!currentPage?.links) return '';
    
    const link = currentPage.links.find(l => l.color === color);
    return link?.label || '';
  }, [currentPage]);

  // Check if a colored button is available
  const isColorButtonAvailable = useCallback((color: 'red' | 'green' | 'yellow' | 'blue'): boolean => {
    if (!currentPage?.links) return false;
    
    const link = currentPage.links.find(l => l.color === color);
    return !!(link && link.targetPage);
  }, [currentPage]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default for keys we handle
    const handledKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                         'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                         'Backspace', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'];
    
    if (handledKeys.includes(event.key)) {
      event.preventDefault();
    }

    // Handle F1-F10 keys for favorite pages
    // Requirement: 23.4, 23.5 - Single-key access to favorite pages
    if (event.key.startsWith('F') && onFavoriteKey) {
      const fKeyMatch = event.key.match(/^F(\d+)$/);
      if (fKeyMatch) {
        const fKeyNumber = parseInt(fKeyMatch[1], 10);
        if (fKeyNumber >= 1 && fKeyNumber <= 10) {
          onFavoriteKey(fKeyNumber - 1); // 0-indexed
          return;
        }
      }
    }

    // Handle digit keys
    if (event.key >= '0' && event.key <= '9') {
      const digit = parseInt(event.key, 10);
      showButtonFeedback(`digit-${digit}`);
      onDigitPress(digit);
      return;
    }

    // Handle Enter key
    if (event.key === 'Enter') {
      showButtonFeedback('enter');
      onEnter();
      return;
    }

    // Handle arrow keys
    if (event.key === 'ArrowUp') {
      showButtonFeedback('nav-up');
      onNavigate('up');
      return;
    }
    if (event.key === 'ArrowDown') {
      showButtonFeedback('nav-down');
      onNavigate('down');
      return;
    }
    if (event.key === 'ArrowLeft') {
      showButtonFeedback('nav-back');
      onNavigate('back');
      return;
    }
    if (event.key === 'ArrowRight') {
      showButtonFeedback('nav-forward');
      onNavigate('forward');
      return;
    }

    // Handle colored buttons (using letters as shortcuts)
    // Requirement: 23.2 - Document colored button shortcuts
    if (event.key.toLowerCase() === 'r') {
      showButtonFeedback('color-red');
      onColorButton('red');
      return;
    }
    if (event.key.toLowerCase() === 'g') {
      showButtonFeedback('color-green');
      onColorButton('green');
      return;
    }
    if (event.key.toLowerCase() === 'y') {
      showButtonFeedback('color-yellow');
      onColorButton('yellow');
      return;
    }
    if (event.key.toLowerCase() === 'b') {
      showButtonFeedback('color-blue');
      onColorButton('blue');
      return;
    }
  }, [onDigitPress, onNavigate, onColorButton, onEnter, onFavoriteKey, showButtonFeedback]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="remote-interface">
      {/* Input display */}
      <div className="input-display">
        <div className="display-screen">
          {currentInput || '_'.repeat(expectedInputLength)}
        </div>
      </div>

      {/* Numeric keypad */}
      <div className="keypad">
        <div className="keypad-row">
          {[1, 2, 3].map(digit => (
            <button
              key={digit}
              className={`key-button digit ${pressedButton === `digit-${digit}` ? 'pressed' : ''} ${flashingButton === `digit-${digit}` ? 'flashing' : ''}`}
              onClick={() => {
                showButtonFeedback(`digit-${digit}`);
                onDigitPress(digit);
              }}
              title={`Press ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          {[4, 5, 6].map(digit => (
            <button
              key={digit}
              className={`key-button digit ${pressedButton === `digit-${digit}` ? 'pressed' : ''} ${flashingButton === `digit-${digit}` ? 'flashing' : ''}`}
              onClick={() => {
                showButtonFeedback(`digit-${digit}`);
                onDigitPress(digit);
              }}
              title={`Press ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          {[7, 8, 9].map(digit => (
            <button
              key={digit}
              className={`key-button digit ${pressedButton === `digit-${digit}` ? 'pressed' : ''} ${flashingButton === `digit-${digit}` ? 'flashing' : ''}`}
              onClick={() => {
                showButtonFeedback(`digit-${digit}`);
                onDigitPress(digit);
              }}
              title={`Press ${digit}`}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          <button
            className={`key-button digit zero ${pressedButton === 'digit-0' ? 'pressed' : ''} ${flashingButton === 'digit-0' ? 'flashing' : ''}`}
            onClick={() => {
              showButtonFeedback('digit-0');
              onDigitPress(0);
            }}
            title="Press 0"
          >
            0
          </button>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="navigation-controls">
        <button
          className={`nav-button ${pressedButton === 'nav-up' ? 'pressed' : ''} ${flashingButton === 'nav-up' ? 'flashing' : ''} ${currentPage?.meta?.continuation?.previousPage ? 'available' : ''}`}
          onClick={() => {
            showButtonFeedback('nav-up');
            onNavigate('up');
          }}
          title={currentPage?.meta?.continuation?.previousPage ? 'Previous page (↑)' : 'Channel Up (↑)'}
        >
          ▲
        </button>
        <div className="nav-row">
          <button
            className={`nav-button ${pressedButton === 'nav-back' ? 'pressed' : ''} ${flashingButton === 'nav-back' ? 'flashing' : ''} ${canGoBack ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('nav-back');
              onNavigate('back');
            }}
            title={canGoBack ? 'Back (←)' : 'Back to Index (←)'}
          >
            ◄
          </button>
          <button
            className={`nav-button enter ${pressedButton === 'enter' ? 'pressed' : ''} ${flashingButton === 'enter' ? 'flashing' : ''}`}
            onClick={() => {
              showButtonFeedback('enter');
              onEnter();
            }}
            title="Enter (⏎)"
          >
            OK
          </button>
          <button
            className={`nav-button ${pressedButton === 'nav-forward' ? 'pressed' : ''} ${flashingButton === 'nav-forward' ? 'flashing' : ''} ${canGoForward ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('nav-forward');
              onNavigate('forward');
            }}
            title={canGoForward ? 'Forward (→)' : 'Forward (→)'}
          >
            ►
          </button>
        </div>
        <button
          className={`nav-button ${pressedButton === 'nav-down' ? 'pressed' : ''} ${flashingButton === 'nav-down' ? 'flashing' : ''} ${currentPage?.meta?.continuation?.nextPage ? 'available' : ''}`}
          onClick={() => {
            showButtonFeedback('nav-down');
            onNavigate('down');
          }}
          title={currentPage?.meta?.continuation?.nextPage ? 'Next page (↓)' : 'Channel Down (↓)'}
        >
          ▼
        </button>
      </div>

      {/* Colored Fastext buttons */}
      <div className="color-buttons">
        <div className="color-button-wrapper">
          <button
            className={`color-button red ${pressedButton === 'color-red' ? 'pressed' : ''} ${flashingButton === 'color-red' ? 'flashing' : ''} ${isColorButtonAvailable('red') ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('color-red');
              onColorButton('red');
            }}
            title={getColorButtonLabel('red') ? `Red: ${getColorButtonLabel('red')} (R)` : 'Red (R)'}
          />
          {getColorButtonLabel('red') && (
            <div className="button-label">{getColorButtonLabel('red')}</div>
          )}
        </div>
        <div className="color-button-wrapper">
          <button
            className={`color-button green ${pressedButton === 'color-green' ? 'pressed' : ''} ${flashingButton === 'color-green' ? 'flashing' : ''} ${isColorButtonAvailable('green') ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('color-green');
              onColorButton('green');
            }}
            title={getColorButtonLabel('green') ? `Green: ${getColorButtonLabel('green')} (G)` : 'Green (G)'}
          />
          {getColorButtonLabel('green') && (
            <div className="button-label">{getColorButtonLabel('green')}</div>
          )}
        </div>
        <div className="color-button-wrapper">
          <button
            className={`color-button yellow ${pressedButton === 'color-yellow' ? 'pressed' : ''} ${flashingButton === 'color-yellow' ? 'flashing' : ''} ${isColorButtonAvailable('yellow') ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('color-yellow');
              onColorButton('yellow');
            }}
            title={getColorButtonLabel('yellow') ? `Yellow: ${getColorButtonLabel('yellow')} (Y)` : 'Yellow (Y)'}
          />
          {getColorButtonLabel('yellow') && (
            <div className="button-label">{getColorButtonLabel('yellow')}</div>
          )}
        </div>
        <div className="color-button-wrapper">
          <button
            className={`color-button blue ${pressedButton === 'color-blue' ? 'pressed' : ''} ${flashingButton === 'color-blue' ? 'flashing' : ''} ${isColorButtonAvailable('blue') ? 'available' : ''}`}
            onClick={() => {
              showButtonFeedback('color-blue');
              onColorButton('blue');
            }}
            title={getColorButtonLabel('blue') ? `Blue: ${getColorButtonLabel('blue')} (B)` : 'Blue (B)'}
          />
          {getColorButtonLabel('blue') && (
            <div className="button-label">{getColorButtonLabel('blue')}</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .remote-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 20px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          width: 280px;
        }

        .input-display {
          width: 100%;
          background: #0a0a0a;
          border-radius: 8px;
          padding: 15px;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .display-screen {
          font-family: 'Courier New', monospace;
          font-size: 32px;
          color: #00ff00;
          text-align: center;
          letter-spacing: 8px;
          text-shadow: 0 0 10px #00ff00;
        }

        .keypad {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .keypad-row {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .key-button {
          width: 60px;
          height: 60px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.1s ease;
        }

        .key-button:hover {
          background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
          transform: translateY(-2px);
          box-shadow: 
            0 6px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .key-button:active,
        .key-button.pressed {
          transform: translateY(2px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .key-button.flashing {
          animation: button-flash 0.3s ease;
        }

        @keyframes button-flash {
          0%, 100% { background: linear-gradient(145deg, #3a3a3a, #2a2a2a); }
          50% { background: linear-gradient(145deg, #6a6a6a, #5a5a5a); }
        }

        .key-button.zero {
          width: 140px;
        }

        .navigation-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .nav-row {
          display: flex;
          gap: 8px;
        }

        .nav-button {
          width: 50px;
          height: 50px;
          font-size: 20px;
          color: #fff;
          background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button.enter {
          width: 60px;
          height: 60px;
          font-size: 16px;
          font-weight: bold;
          background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
        }

        .nav-button:hover {
          background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
          transform: translateY(-2px);
          box-shadow: 
            0 6px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-button:active,
        .nav-button.pressed {
          transform: translateY(2px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .nav-button.flashing {
          animation: button-flash 0.3s ease;
        }

        .nav-button.available {
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 10px rgba(0, 255, 0, 0.5);
        }

        .nav-button.available:hover {
          box-shadow: 
            0 6px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 15px rgba(0, 255, 0, 0.7);
        }

        .color-buttons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .color-button-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .button-label {
          font-size: 9px;
          color: #aaa;
          text-align: center;
          max-width: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'Courier New', monospace;
        }

        .color-button {
          width: 50px;
          height: 30px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.1s ease;
        }

        .color-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .color-button:active,
        .color-button.pressed {
          transform: translateY(2px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .color-button.flashing {
          animation: color-button-flash 0.3s ease;
        }

        .color-button.available {
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 10px currentColor;
        }

        .color-button.available:hover {
          box-shadow: 
            0 6px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 15px currentColor;
        }

        @keyframes color-button-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; filter: brightness(1.5); }
        }

        .color-button.red {
          background: linear-gradient(145deg, #ff3333, #cc0000);
        }

        .color-button.green {
          background: linear-gradient(145deg, #33ff33, #00cc00);
        }

        .color-button.yellow {
          background: linear-gradient(145deg, #ffff33, #cccc00);
        }

        .color-button.blue {
          background: linear-gradient(145deg, #3333ff, #0000cc);
        }
      `}</style>
    </div>
  );
}
