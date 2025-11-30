/**
 * Tests for input validation handler
 */

import {
  InputValidationHandler,
  sanitizeInput,
  formatInputForDisplay,
  getInputHint,
  getValidationHandler,
  resetValidationHandler
} from '../input-validation-handler';

describe('InputValidationHandler', () => {
  let handler: InputValidationHandler;

  beforeEach(() => {
    handler = new InputValidationHandler();
  });

  describe('Single digit validation', () => {
    it('should validate single digit input', () => {
      const result = handler.validateInput('5', { mode: 'single' });
      expect(result.valid).toBe(true);
    });

    it('should reject non-digit input', () => {
      const result = handler.validateInput('a', { mode: 'single' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('single digit');
    });

    it('should reject multiple digits', () => {
      const result = handler.validateInput('12', { mode: 'single' });
      expect(result.valid).toBe(false);
    });

    it('should reject empty input', () => {
      const result = handler.validateInput('', { mode: 'single' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });
  });

  describe('Double digit validation', () => {
    it('should validate single digit', () => {
      const result = handler.validateInput('5', { mode: 'double' });
      expect(result.valid).toBe(true);
    });

    it('should validate double digit', () => {
      const result = handler.validateInput('42', { mode: 'double' });
      expect(result.valid).toBe(true);
    });

    it('should reject three digits', () => {
      const result = handler.validateInput('123', { mode: 'double' });
      expect(result.valid).toBe(false);
    });

    it('should reject non-numeric input', () => {
      const result = handler.validateInput('ab', { mode: 'double' });
      expect(result.valid).toBe(false);
    });
  });

  describe('Triple digit validation', () => {
    it('should validate page numbers in range', () => {
      const result = handler.validateInput('500', { mode: 'triple' });
      expect(result.valid).toBe(true);
    });

    it('should reject page numbers below 100', () => {
      const result = handler.validateInput('99', { mode: 'triple' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('100 and 999');
    });

    it('should reject page numbers above 999', () => {
      const result = handler.validateInput('1000', { mode: 'triple' });
      expect(result.valid).toBe(false);
    });

    it('should accept minimum valid page', () => {
      const result = handler.validateInput('100', { mode: 'triple' });
      expect(result.valid).toBe(true);
    });

    it('should accept maximum valid page', () => {
      const result = handler.validateInput('999', { mode: 'triple' });
      expect(result.valid).toBe(true);
    });
  });

  describe('Numeric validation', () => {
    it('should validate numeric input', () => {
      const result = handler.validateInput('12345', { mode: 'numeric' });
      expect(result.valid).toBe(true);
    });

    it('should reject non-numeric input', () => {
      const result = handler.validateInput('123abc', { mode: 'numeric' });
      expect(result.valid).toBe(false);
    });

    it('should reject input with spaces', () => {
      const result = handler.validateInput('123 456', { mode: 'numeric' });
      expect(result.valid).toBe(false);
    });
  });

  describe('Text validation', () => {
    it('should validate text input', () => {
      const result = handler.validateInput('Hello world', { mode: 'text' });
      expect(result.valid).toBe(true);
    });

    it('should reject whitespace-only input', () => {
      const result = handler.validateInput('   ', { mode: 'text' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('whitespace');
    });

    it('should validate text with punctuation', () => {
      const result = handler.validateInput('Hello, world!', { mode: 'text' });
      expect(result.valid).toBe(true);
    });

    it('should respect allowed characters', () => {
      const result = handler.validateInput('test@email', {
        mode: 'text',
        allowedCharacters: /^[a-zA-Z0-9]+$/
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('Length validation', () => {
    it('should enforce minimum length', () => {
      const result = handler.validateInput('ab', {
        mode: 'text',
        minLength: 3
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 3');
    });

    it('should enforce maximum length', () => {
      const result = handler.validateInput('abcdefgh', {
        mode: 'text',
        maxLength: 5
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at most 5');
    });

    it('should accept input within length bounds', () => {
      const result = handler.validateInput('test', {
        mode: 'text',
        minLength: 3,
        maxLength: 10
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('Custom validator', () => {
    it('should use custom validator when provided', () => {
      const customValidator = jest.fn().mockReturnValue({
        valid: false,
        error: 'Custom error'
      });

      const result = handler.validateInput('test', {
        mode: 'text',
        customValidator
      });

      expect(customValidator).toHaveBeenCalledWith('test');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Custom error');
    });
  });

  describe('validatePageNumber', () => {
    it('should validate page numbers', () => {
      const result = handler.validatePageNumber('500');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid page numbers', () => {
      const result = handler.validatePageNumber('50');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateMenuSelection', () => {
    it('should validate menu selection', () => {
      const result = handler.validateMenuSelection('2', ['1', '2', '3']);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid selection', () => {
      const result = handler.validateMenuSelection('4', ['1', '2', '3']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid selection');
    });
  });

  describe('validateQuestion', () => {
    it('should validate question input', () => {
      const result = handler.validateQuestion('What is the weather?');
      expect(result.valid).toBe(true);
    });

    it('should reject too short questions', () => {
      const result = handler.validateQuestion('Hi');
      expect(result.valid).toBe(false);
    });

    it('should reject too long questions', () => {
      const longQuestion = 'a'.repeat(201);
      const result = handler.validateQuestion(longQuestion);
      expect(result.valid).toBe(false);
    });
  });

  describe('createInputErrorPage', () => {
    it('should create error page for invalid input', () => {
      const validationResult = {
        valid: false,
        error: 'Invalid input',
        expectedFormat: '1-3 digits'
      };

      const page = handler.createInputErrorPage('500', 'abc', validationResult);

      expect(page.id).toBe('500');
      expect(page.rows[0]).toContain('ERROR');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('abc');
      expect(pageContent).toContain('1-3 digits');
    });
  });
});

describe('sanitizeInput', () => {
  it('should sanitize numeric input', () => {
    expect(sanitizeInput('123abc', 'numeric')).toBe('123');
  });

  it('should sanitize triple digit input', () => {
    expect(sanitizeInput('5a0b0', 'triple')).toBe('500');
  });

  it('should remove non-printable characters from text', () => {
    expect(sanitizeInput('hello\x00world', 'text')).toBe('helloworld');
  });

  it('should keep valid text unchanged', () => {
    expect(sanitizeInput('Hello, world!', 'text')).toBe('Hello, world!');
  });
});

describe('formatInputForDisplay', () => {
  it('should pad triple digit input', () => {
    expect(formatInputForDisplay('5', 'triple')).toBe('005');
  });

  it('should pad double digit input', () => {
    expect(formatInputForDisplay('5', 'double')).toBe('05');
  });

  it('should not pad text input', () => {
    expect(formatInputForDisplay('hello', 'text')).toBe('hello');
  });
});

describe('getInputHint', () => {
  it('should return hint for single digit mode', () => {
    const hint = getInputHint('single');
    expect(hint).toContain('single digit');
  });

  it('should return hint for triple digit mode', () => {
    const hint = getInputHint('triple');
    expect(hint).toContain('100-999');
  });

  it('should return hint for text mode', () => {
    const hint = getInputHint('text');
    expect(hint).toContain('text');
  });
});

describe('Singleton instance', () => {
  beforeEach(() => {
    resetValidationHandler();
  });

  it('should return singleton instance', () => {
    const instance1 = getValidationHandler();
    const instance2 = getValidationHandler();
    
    expect(instance1).toBe(instance2);
  });

  it('should reset singleton instance', () => {
    const instance1 = getValidationHandler();
    resetValidationHandler();
    const instance2 = getValidationHandler();
    
    expect(instance1).not.toBe(instance2);
  });
});
