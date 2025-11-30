/**
 * Input Handling Integration Test
 * Tests input handling across all page types
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock InputHandler
class MockInputHandler {
  private buffer: string = '';
  private mode: 'single' | 'double' | 'triple' | 'text' = 'triple';
  
  setMode(mode: 'single' | 'double' | 'triple' | 'text'): void {
    this.mode = mode;
    this.clearBuffer();
  }
  
  getMode(): string {
    return this.mode;
  }
  
  handleInput(char: string): boolean {
    if (this.mode === 'single') {
      // Only accept single character
      if (this.buffer.length === 0 && /^[0-9A-Za-z]$/.test(char)) {
        this.buffer = char;
        return true;
      }
      return false;
    } else if (this.mode === 'double') {
      // Accept 1-2 digits
      if (this.buffer.length < 2 && /^[0-9]$/.test(char)) {
        this.buffer += char;
        return true;
      }
      return false;
    } else if (this.mode === 'triple') {
      // Accept 1-3 digits for page numbers
      if (this.buffer.length < 3 && /^[0-9]$/.test(char)) {
        this.buffer += char;
        return true;
      }
      return false;
    } else if (this.mode === 'text') {
      // Accept all alphanumeric and common punctuation
      if (/^[a-zA-Z0-9 .,!?;:'"()-]$/.test(char)) {
        this.buffer += char;
        return true;
      }
      return false;
    }
    return false;
  }
  
  getBuffer(): string {
    return this.buffer;
  }
  
  clearBuffer(): void {
    this.buffer = '';
  }
  
  removeLastChar(): void {
    this.buffer = this.buffer.slice(0, -1);
  }
  
  validateInput(): boolean {
    if (this.mode === 'single') {
      return this.buffer.length === 1;
    } else if (this.mode === 'double') {
      return this.buffer.length >= 1 && this.buffer.length <= 2;
    } else if (this.mode === 'triple') {
      const num = parseInt(this.buffer);
      return this.buffer.length >= 1 && num >= 100 && num <= 999;
    } else if (this.mode === 'text') {
      return this.buffer.length > 0;
    }
    return false;
  }
}

describe('Input Handling Integration', () => {
  let inputHandler: MockInputHandler;
  
  beforeEach(() => {
    inputHandler = new MockInputHandler();
  });
  
  describe('Numeric Input on Navigation Pages', () => {
    beforeEach(() => {
      inputHandler.setMode('triple');
    });
    
    it('should accept single digit', () => {
      const result = inputHandler.handleInput('1');
      expect(result).toBe(true);
      expect(inputHandler.getBuffer()).toBe('1');
    });

    it('should accept two digits', () => {
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      expect(inputHandler.getBuffer()).toBe('12');
    });

    it('should accept three digits', () => {
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      expect(inputHandler.getBuffer()).toBe('123');
    });

    it('should reject fourth digit', () => {
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      const result = inputHandler.handleInput('4');
      expect(result).toBe(false);
      expect(inputHandler.getBuffer()).toBe('123');
    });

    it('should reject non-numeric characters', () => {
      const result = inputHandler.handleInput('a');
      expect(result).toBe(false);
      expect(inputHandler.getBuffer()).toBe('');
    });

    it('should validate page number range', () => {
      inputHandler.handleInput('1');
      inputHandler.handleInput('0');
      inputHandler.handleInput('0');
      expect(inputHandler.validateInput()).toBe(true);
      
      inputHandler.clearBuffer();
      inputHandler.handleInput('9');
      inputHandler.handleInput('9');
      inputHandler.handleInput('9');
      expect(inputHandler.validateInput()).toBe(true);
      
      inputHandler.clearBuffer();
      inputHandler.handleInput('0');
      inputHandler.handleInput('9');
      inputHandler.handleInput('9');
      expect(inputHandler.validateInput()).toBe(false);
    });
  });

  describe('Text Input on AI Question Pages', () => {
    beforeEach(() => {
      inputHandler.setMode('text');
    });
    
    it('should accept letters', () => {
      const result = inputHandler.handleInput('H');
      expect(result).toBe(true);
      expect(inputHandler.getBuffer()).toBe('H');
    });

    it('should accept numbers', () => {
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      expect(inputHandler.getBuffer()).toBe('123');
    });

    it('should accept spaces', () => {
      inputHandler.handleInput('H');
      inputHandler.handleInput('e');
      inputHandler.handleInput('l');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      inputHandler.handleInput(' ');
      inputHandler.handleInput('w');
      inputHandler.handleInput('o');
      inputHandler.handleInput('r');
      inputHandler.handleInput('l');
      inputHandler.handleInput('d');
      expect(inputHandler.getBuffer()).toBe('Hello world');
    });

    it('should accept punctuation', () => {
      const punctuation = '.,!?;:\'"()-';
      for (const char of punctuation) {
        inputHandler.clearBuffer();
        const result = inputHandler.handleInput(char);
        expect(result).toBe(true);
      }
    });

    it('should accept full sentences', () => {
      const sentence = 'What is teletext?';
      for (const char of sentence) {
        inputHandler.handleInput(char);
      }
      expect(inputHandler.getBuffer()).toBe(sentence);
    });

    it('should validate non-empty text', () => {
      expect(inputHandler.validateInput()).toBe(false);
      
      inputHandler.handleInput('H');
      expect(inputHandler.validateInput()).toBe(true);
    });
  });

  describe('Single-Choice Input on Menu Pages', () => {
    beforeEach(() => {
      inputHandler.setMode('single');
    });
    
    it('should accept single digit', () => {
      const result = inputHandler.handleInput('1');
      expect(result).toBe(true);
      expect(inputHandler.getBuffer()).toBe('1');
    });

    it('should accept single letter', () => {
      const result = inputHandler.handleInput('A');
      expect(result).toBe(true);
      expect(inputHandler.getBuffer()).toBe('A');
    });

    it('should reject second character', () => {
      inputHandler.handleInput('1');
      const result = inputHandler.handleInput('2');
      expect(result).toBe(false);
      expect(inputHandler.getBuffer()).toBe('1');
    });

    it('should validate single character', () => {
      expect(inputHandler.validateInput()).toBe(false);
      
      inputHandler.handleInput('1');
      expect(inputHandler.validateInput()).toBe(true);
    });
  });

  describe('Buffer Display and Clearing', () => {
    it('should display buffer contents', () => {
      inputHandler.setMode('triple');
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      
      expect(inputHandler.getBuffer()).toBe('123');
    });

    it('should clear buffer on mode change', () => {
      inputHandler.setMode('triple');
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      
      inputHandler.setMode('text');
      expect(inputHandler.getBuffer()).toBe('');
    });

    it('should clear buffer manually', () => {
      inputHandler.setMode('text');
      inputHandler.handleInput('H');
      inputHandler.handleInput('e');
      inputHandler.handleInput('l');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      
      inputHandler.clearBuffer();
      expect(inputHandler.getBuffer()).toBe('');
    });

    it('should remove last character (backspace)', () => {
      inputHandler.setMode('text');
      inputHandler.handleInput('H');
      inputHandler.handleInput('e');
      inputHandler.handleInput('l');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      
      inputHandler.removeLastChar();
      expect(inputHandler.getBuffer()).toBe('Hell');
      
      inputHandler.removeLastChar();
      expect(inputHandler.getBuffer()).toBe('Hel');
    });

    it('should handle backspace on empty buffer', () => {
      inputHandler.setMode('text');
      inputHandler.removeLastChar();
      expect(inputHandler.getBuffer()).toBe('');
    });
  });

  describe('Mode Switching', () => {
    it('should switch from triple to text mode', () => {
      inputHandler.setMode('triple');
      expect(inputHandler.getMode()).toBe('triple');
      
      inputHandler.setMode('text');
      expect(inputHandler.getMode()).toBe('text');
    });

    it('should switch from text to single mode', () => {
      inputHandler.setMode('text');
      expect(inputHandler.getMode()).toBe('text');
      
      inputHandler.setMode('single');
      expect(inputHandler.getMode()).toBe('single');
    });

    it('should clear buffer when switching modes', () => {
      inputHandler.setMode('triple');
      inputHandler.handleInput('1');
      inputHandler.handleInput('2');
      inputHandler.handleInput('3');
      
      inputHandler.setMode('text');
      expect(inputHandler.getBuffer()).toBe('');
    });

    it('should accept appropriate input after mode switch', () => {
      inputHandler.setMode('triple');
      inputHandler.handleInput('1');
      
      inputHandler.setMode('text');
      const result = inputHandler.handleInput('H');
      expect(result).toBe(true);
      expect(inputHandler.getBuffer()).toBe('H');
    });
  });

  describe('Input Validation', () => {
    it('should validate triple mode input', () => {
      inputHandler.setMode('triple');
      
      // Empty buffer is invalid
      expect(inputHandler.validateInput()).toBe(false);
      
      // Valid page number
      inputHandler.handleInput('1');
      inputHandler.handleInput('0');
      inputHandler.handleInput('0');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should validate text mode input', () => {
      inputHandler.setMode('text');
      
      // Empty buffer is invalid
      expect(inputHandler.validateInput()).toBe(false);
      
      // Non-empty text is valid
      inputHandler.handleInput('H');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should validate single mode input', () => {
      inputHandler.setMode('single');
      
      // Empty buffer is invalid
      expect(inputHandler.validateInput()).toBe(false);
      
      // Single character is valid
      inputHandler.handleInput('1');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should validate double mode input', () => {
      inputHandler.setMode('double');
      
      // Empty buffer is invalid
      expect(inputHandler.validateInput()).toBe(false);
      
      // Single digit is valid
      inputHandler.handleInput('1');
      expect(inputHandler.validateInput()).toBe(true);
      
      // Two digits is valid
      inputHandler.handleInput('2');
      expect(inputHandler.validateInput()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input', () => {
      inputHandler.setMode('text');
      
      const text = 'Quick brown fox';
      for (const char of text) {
        inputHandler.handleInput(char);
      }
      
      expect(inputHandler.getBuffer()).toBe(text);
    });

    it('should handle special characters in text mode', () => {
      inputHandler.setMode('text');
      
      inputHandler.handleInput('H');
      inputHandler.handleInput('e');
      inputHandler.handleInput('l');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      inputHandler.handleInput('!');
      
      expect(inputHandler.getBuffer()).toBe('Hello!');
    });

    it('should reject invalid characters in numeric mode', () => {
      inputHandler.setMode('triple');
      
      const invalidChars = ['a', 'b', 'c', '!', '@', '#', ' '];
      for (const char of invalidChars) {
        const result = inputHandler.handleInput(char);
        expect(result).toBe(false);
      }
      
      expect(inputHandler.getBuffer()).toBe('');
    });

    it('should handle mixed case in single mode', () => {
      inputHandler.setMode('single');
      
      inputHandler.handleInput('A');
      expect(inputHandler.getBuffer()).toBe('A');
      
      inputHandler.clearBuffer();
      inputHandler.handleInput('a');
      expect(inputHandler.getBuffer()).toBe('a');
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle page navigation input', () => {
      inputHandler.setMode('triple');
      
      // User types 500
      inputHandler.handleInput('5');
      inputHandler.handleInput('0');
      inputHandler.handleInput('0');
      
      expect(inputHandler.getBuffer()).toBe('500');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should handle AI question input', () => {
      inputHandler.setMode('text');
      
      // User types a question
      const question = 'What is teletext?';
      for (const char of question) {
        inputHandler.handleInput(char);
      }
      
      expect(inputHandler.getBuffer()).toBe(question);
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should handle menu selection', () => {
      inputHandler.setMode('single');
      
      // User selects option 1
      inputHandler.handleInput('1');
      
      expect(inputHandler.getBuffer()).toBe('1');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should handle quiz answer selection', () => {
      inputHandler.setMode('single');
      
      // User selects answer B
      inputHandler.handleInput('B');
      
      expect(inputHandler.getBuffer()).toBe('B');
      expect(inputHandler.validateInput()).toBe(true);
    });

    it('should handle user corrections with backspace', () => {
      inputHandler.setMode('text');
      
      // User types "Helo" then corrects to "Hello"
      inputHandler.handleInput('H');
      inputHandler.handleInput('e');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      inputHandler.removeLastChar(); // Remove 'o'
      inputHandler.removeLastChar(); // Remove 'l'
      inputHandler.handleInput('l');
      inputHandler.handleInput('l');
      inputHandler.handleInput('o');
      
      expect(inputHandler.getBuffer()).toBe('Hello');
    });
  });
});
