'use client';

import React, { useEffect, useCallback } from 'react';

interface RemoteInterfaceProps {
  onDigitPress: (digit: number) => void;
  onNavigate: (direction: 'back' | 'forward' | 'up' | 'down') => void;
  onColorButton: (color: 'red' | 'green' | 'yellow' | 'blue') => void;
  onEnter: () => void;
  onFavoriteKey?: (index: number) => void;
  currentInput: string;
}

/**
 * RemoteInterface Component
 * 
 * Provides on-screen numeric keypad and control buttons for navigation.
 * Also handles keyboard event listeners for the same controls.
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */
export default function RemoteInterface({
  onDigitPress,
  onNavigate,
  onColorButton,
  onEnter,
  onFavoriteKey,
  currentInput
}: RemoteInterfaceProps) {
  
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
      onDigitPress(parseInt(event.key, 10));
      return;
    }

    // Handle Enter key
    if (event.key === 'Enter') {
      onEnter();
      return;
    }

    // Handle arrow keys
    if (event.key === 'ArrowUp') {
      onNavigate('up');
      return;
    }
    if (event.key === 'ArrowDown') {
      onNavigate('down');
      return;
    }
    if (event.key === 'ArrowLeft') {
      onNavigate('back');
      return;
    }
    if (event.key === 'ArrowRight') {
      onNavigate('forward');
      return;
    }

    // Handle colored buttons (using letters as shortcuts)
    // Requirement: 23.2 - Document colored button shortcuts
    if (event.key.toLowerCase() === 'r') {
      onColorButton('red');
      return;
    }
    if (event.key.toLowerCase() === 'g') {
      onColorButton('green');
      return;
    }
    if (event.key.toLowerCase() === 'y') {
      onColorButton('yellow');
      return;
    }
    if (event.key.toLowerCase() === 'b') {
      onColorButton('blue');
      return;
    }
  }, [onDigitPress, onNavigate, onColorButton, onEnter, onFavoriteKey]);

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
          {currentInput || '___'}
        </div>
      </div>

      {/* Numeric keypad */}
      <div className="keypad">
        <div className="keypad-row">
          {[1, 2, 3].map(digit => (
            <button
              key={digit}
              className="key-button digit"
              onClick={() => onDigitPress(digit)}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          {[4, 5, 6].map(digit => (
            <button
              key={digit}
              className="key-button digit"
              onClick={() => onDigitPress(digit)}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          {[7, 8, 9].map(digit => (
            <button
              key={digit}
              className="key-button digit"
              onClick={() => onDigitPress(digit)}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="keypad-row">
          <button
            className="key-button digit zero"
            onClick={() => onDigitPress(0)}
          >
            0
          </button>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="navigation-controls">
        <button
          className="nav-button"
          onClick={() => onNavigate('up')}
          title="Channel Up"
        >
          ▲
        </button>
        <div className="nav-row">
          <button
            className="nav-button"
            onClick={() => onNavigate('back')}
            title="Back"
          >
            ◄
          </button>
          <button
            className="nav-button enter"
            onClick={onEnter}
            title="Enter"
          >
            OK
          </button>
          <button
            className="nav-button"
            onClick={() => onNavigate('forward')}
            title="Forward"
          >
            ►
          </button>
        </div>
        <button
          className="nav-button"
          onClick={() => onNavigate('down')}
          title="Channel Down"
        >
          ▼
        </button>
      </div>

      {/* Colored Fastext buttons */}
      <div className="color-buttons">
        <button
          className="color-button red"
          onClick={() => onColorButton('red')}
          title="Red (R)"
        />
        <button
          className="color-button green"
          onClick={() => onColorButton('green')}
          title="Green (G)"
        />
        <button
          className="color-button yellow"
          onClick={() => onColorButton('yellow')}
          title="Yellow (Y)"
        />
        <button
          className="color-button blue"
          onClick={() => onColorButton('blue')}
          title="Blue (B)"
        />
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

        .key-button:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
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

        .nav-button:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .color-buttons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
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

        .color-button:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
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
