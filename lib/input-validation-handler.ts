/**
 * Input Validation Error Handler
 * 
 * Validates input and provides clear error feedback
 */

import { createInvalidInputErrorPage } from './error-pages';
import { TeletextPage } from '../types/teletext';

export type InputMode = 'single' | 'double' | 'triple' | 'text' | 'numeric';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  expectedFormat?: string;
}

export interface InputValidationOptions {
  mode: InputMode;
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: RegExp;
  customValidator?: (input: string) => ValidationResult;
}

/**
 * Input validation handler class
 */
export class InputValidationHandler {
  /**
   * Validates input based on mode
   */
  public validateInput(input: string, options: InputValidationOptions): ValidationResult {
    const { mode, minLength, maxLength, allowedCharacters, customValidator } = options;

    // Custom validator takes precedence
    if (customValidator) {
      return customValidator(input);
    }

    // Empty input check
    if (input.length === 0) {
      return {
        valid: false,
        error: 'Input cannot be empty',
        expectedFormat: this.getExpectedFormat(mode)
      };
    }

    // Length validation
    if (minLength !== undefined && input.length < minLength) {
      return {
        valid: false,
        error: `Input must be at least ${minLength} characters`,
        expectedFormat: this.getExpectedFormat(mode)
      };
    }

    if (maxLength !== undefined && input.length > maxLength) {
      return {
        valid: false,
        error: `Input must be at most ${maxLength} characters`,
        expectedFormat: this.getExpectedFormat(mode)
      };
    }

    // Mode-specific validation
    switch (mode) {
      case 'single':
        return this.validateSingleDigit(input);
      case 'double':
        return this.validateDoubleDigit(input);
      case 'triple':
        return this.validateTripleDigit(input);
      case 'numeric':
        return this.validateNumeric(input);
      case 'text':
        return this.validateText(input, allowedCharacters);
      default:
        return { valid: true };
    }
  }

  /**
   * Validates single digit input (0-9)
   */
  private validateSingleDigit(input: string): ValidationResult {
    if (!/^[0-9]$/.test(input)) {
      return {
        valid: false,
        error: 'Input must be a single digit (0-9)',
        expectedFormat: 'Single digit (0-9)'
      };
    }
    return { valid: true };
  }

  /**
   * Validates double digit input (00-99)
   */
  private validateDoubleDigit(input: string): ValidationResult {
    if (!/^[0-9]{1,2}$/.test(input)) {
      return {
        valid: false,
        error: 'Input must be 1-2 digits',
        expectedFormat: '1-2 digits (0-99)'
      };
    }
    return { valid: true };
  }

  /**
   * Validates triple digit input (100-999)
   */
  private validateTripleDigit(input: string): ValidationResult {
    if (!/^[0-9]{1,3}$/.test(input)) {
      return {
        valid: false,
        error: 'Input must be 1-3 digits',
        expectedFormat: '1-3 digits (100-999)'
      };
    }

    const num = parseInt(input, 10);
    if (num < 100 || num > 999) {
      return {
        valid: false,
        error: 'Page number must be between 100 and 999',
        expectedFormat: '100-999'
      };
    }

    return { valid: true };
  }

  /**
   * Validates numeric input
   */
  private validateNumeric(input: string): ValidationResult {
    if (!/^[0-9]+$/.test(input)) {
      return {
        valid: false,
        error: 'Input must contain only numbers',
        expectedFormat: 'Numeric characters only'
      };
    }
    return { valid: true };
  }

  /**
   * Validates text input
   */
  private validateText(input: string, allowedCharacters?: RegExp): ValidationResult {
    // Check for whitespace-only input
    if (input.trim().length === 0) {
      return {
        valid: false,
        error: 'Input cannot be only whitespace',
        expectedFormat: 'Non-empty text'
      };
    }

    // Check allowed characters if specified
    if (allowedCharacters && !allowedCharacters.test(input)) {
      return {
        valid: false,
        error: 'Input contains invalid characters',
        expectedFormat: 'Alphanumeric and punctuation only'
      };
    }

    return { valid: true };
  }

  /**
   * Gets expected format description for mode
   */
  private getExpectedFormat(mode: InputMode): string {
    switch (mode) {
      case 'single':
        return 'Single digit (0-9)';
      case 'double':
        return '1-2 digits (0-99)';
      case 'triple':
        return '1-3 digits (100-999)';
      case 'numeric':
        return 'Numeric characters only';
      case 'text':
        return 'Text input';
      default:
        return 'Valid input';
    }
  }

  /**
   * Creates an error page for invalid input
   */
  public createInputErrorPage(
    pageNumber: string,
    input: string,
    validationResult: ValidationResult
  ): TeletextPage {
    return createInvalidInputErrorPage(
      pageNumber,
      input,
      validationResult.expectedFormat || 'Valid input'
    );
  }

  /**
   * Validates page number input
   */
  public validatePageNumber(input: string): ValidationResult {
    return this.validateInput(input, { mode: 'triple' });
  }

  /**
   * Validates menu selection input
   */
  public validateMenuSelection(input: string, validOptions: string[]): ValidationResult {
    if (!validOptions.includes(input)) {
      return {
        valid: false,
        error: `Invalid selection: ${input}`,
        expectedFormat: `One of: ${validOptions.join(', ')}`
      };
    }
    return { valid: true };
  }

  /**
   * Validates question input
   */
  public validateQuestion(input: string, minLength: number = 3, maxLength: number = 200): ValidationResult {
    return this.validateInput(input, {
      mode: 'text',
      minLength,
      maxLength,
      allowedCharacters: /^[a-zA-Z0-9\s.,!?'"()-]+$/
    });
  }
}

/**
 * Sanitizes input by removing invalid characters
 */
export function sanitizeInput(input: string, mode: InputMode): string {
  switch (mode) {
    case 'single':
    case 'double':
    case 'triple':
    case 'numeric':
      return input.replace(/[^0-9]/g, '');
    case 'text':
      return input.replace(/[^\x20-\x7E]/g, ''); // Keep printable ASCII only
    default:
      return input;
  }
}

/**
 * Formats input for display
 */
export function formatInputForDisplay(input: string, mode: InputMode): string {
  const sanitized = sanitizeInput(input, mode);
  
  switch (mode) {
    case 'triple':
      return sanitized.padStart(3, '0');
    case 'double':
      return sanitized.padStart(2, '0');
    default:
      return sanitized;
  }
}

/**
 * Gets input hint for mode
 */
export function getInputHint(mode: InputMode): string {
  switch (mode) {
    case 'single':
      return 'Enter a single digit (0-9)';
    case 'double':
      return 'Enter 1-2 digits';
    case 'triple':
      return 'Enter page number (100-999)';
    case 'numeric':
      return 'Enter numbers only';
    case 'text':
      return 'Enter your text and press Enter';
    default:
      return 'Enter your input';
  }
}

// Singleton instance
let validationHandlerInstance: InputValidationHandler | null = null;

/**
 * Gets the singleton validation handler instance
 */
export function getValidationHandler(): InputValidationHandler {
  if (!validationHandlerInstance) {
    validationHandlerInstance = new InputValidationHandler();
  }
  return validationHandlerInstance;
}

/**
 * Resets the singleton instance (useful for testing)
 */
export function resetValidationHandler(): void {
  validationHandlerInstance = null;
}
