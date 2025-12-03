/**
 * Input Context Manager for Modern Teletext
 * 
 * Manages input context detection, validation, and mode-specific handling.
 * Provides centralized logic for determining appropriate input modes based on page type.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

import { TeletextPage } from '@/types/teletext';
import { InputMode } from './navigation-router';

/**
 * Input validation result
 */
export interface InputValidationResult {
  valid: boolean;
  error?: string;
  hint?: string;
}

/**
 * Input context information
 */
export interface InputContext {
  mode: InputMode;
  maxLength: number;
  allowedCharacters: RegExp;
  validationRules: string[];
  hint: string;
  autoSubmit: boolean;
}

/**
 * Input Context Manager Class
 * 
 * Detects and manages input context based on page metadata and type.
 * Provides validation and error messages appropriate to each context.
 */
export class InputContextManager {
  /**
   * Detects input mode from page metadata
   * 
   * Requirement: 9.1
   */
  public detectInputMode(page: TeletextPage): InputMode {
    // Priority 1: Explicit inputMode in metadata
    if (page.meta?.inputMode) {
      return page.meta.inputMode;
    }

    // Priority 2: Check if this is an error page (disable all input)
    if (page.meta?.errorPage) {
      return 'disabled';
    }

    // Priority 2: Determine from page type and content
    const pageNumber = parseInt(page.id.split('-')[0], 10);

    // AI Oracle pages (500-599) - check for text input or single choice
    if (pageNumber >= 500 && pageNumber < 600) {
      // Question input pages use text mode
      if (page.title.toLowerCase().includes('question') || 
          page.title.toLowerCase().includes('ask') ||
          page.title.toLowerCase().includes('enter')) {
        return 'text';
      }
      
      // Topic selection uses single-digit
      if (page.meta?.inputOptions && page.meta.inputOptions.length <= 9) {
        return 'single';
      }
    }

    // Games pages (600-699) - typically single choice for answers
    if (pageNumber >= 600 && pageNumber < 700) {
      if (page.meta?.inputOptions && page.meta.inputOptions.length <= 9) {
        return 'single';
      }
    }

    // Settings pages (700-799) - typically single choice
    if (pageNumber >= 700 && pageNumber < 800) {
      if (page.meta?.inputOptions && page.meta.inputOptions.length <= 9) {
        return 'single';
      }
    }

    // Check for numbered menu options (1-9)
    if (page.meta?.inputOptions) {
      const allNumeric = page.meta.inputOptions.every(opt => /^\d$/.test(opt));
      if (allNumeric && page.meta.inputOptions.length <= 9) {
        return 'single';
      }
    }

    // Check links for numbered options
    if (page.links && page.links.length > 0 && page.links.length <= 9) {
      const hasNumberedOptions = page.links.every((link, index) => 
        link.label === (index + 1).toString()
      );
      if (hasNumberedOptions) {
        return 'single';
      }
    }

    // Sub-pages (e.g., 100-1, 100-2) use double-digit
    if (page.id.includes('-')) {
      const parts = page.id.split('-');
      if (parts.length === 2 && /^\d+$/.test(parts[1])) {
        return 'double';
      }
    }

    // Default: triple-digit for standard page navigation
    return 'triple';
  }

  /**
   * Gets complete input context for a page
   * 
   * Requirement: 9.1, 9.6
   */
  public getInputContext(page: TeletextPage): InputContext {
    const mode = this.detectInputMode(page);

    switch (mode) {
      case 'single':
        return {
          mode: 'single',
          maxLength: 1,
          allowedCharacters: /^[0-9]$/,
          validationRules: ['Must be a single digit (0-9)'],
          hint: 'Enter option number',
          autoSubmit: true
        };

      case 'double':
        return {
          mode: 'double',
          maxLength: 2,
          allowedCharacters: /^[0-9]$/,
          validationRules: ['Must be 1-2 digits'],
          hint: 'Enter 2-digit page',
          autoSubmit: true
        };

      case 'triple':
        return {
          mode: 'triple',
          maxLength: 3,
          allowedCharacters: /^[0-9]$/,
          validationRules: ['Must be 3 digits (100-999)'],
          hint: 'Enter 3-digit page',
          autoSubmit: true
        };

      case 'text':
        return {
          mode: 'text',
          maxLength: 200, // Reasonable limit for text input
          allowedCharacters: /^[a-zA-Z0-9 .,!?;:'"()\-_@#$%&*+=/<>[\]{}|\\`~]$/,
          validationRules: ['Enter text and press Enter'],
          hint: 'Type your text and press Enter',
          autoSubmit: false
        };

      case 'disabled':
        return {
          mode: 'disabled',
          maxLength: 0,
          allowedCharacters: /(?!)/,  // Never matches anything
          validationRules: ['Input disabled on this page'],
          hint: 'Press back button to return',
          autoSubmit: false
        };

      default:
        return {
          mode: 'triple',
          maxLength: 3,
          allowedCharacters: /^[0-9]$/,
          validationRules: ['Must be 3 digits (100-999)'],
          hint: 'Enter 3-digit page',
          autoSubmit: true
        };
    }
  }

  /**
   * Validates input against mode requirements
   * 
   * Requirement: 9.6
   */
  public validateInput(
    input: string,
    page: TeletextPage
  ): InputValidationResult {
    const context = this.getInputContext(page);
    const mode = context.mode;

    // Check for disabled mode first
    if (mode === 'disabled') {
      return {
        valid: false,
        error: 'Input is disabled on this page',
        hint: 'Press back button to return'
      };
    }

    // Empty input check
    if (input.length === 0) {
      return {
        valid: false,
        error: 'Input cannot be empty',
        hint: context.hint
      };
    }

    // Length validation
    if (input.length > context.maxLength) {
      return {
        valid: false,
        error: `Input too long (max ${context.maxLength} characters)`,
        hint: context.hint
      };
    }

    // Mode-specific validation
    switch (mode) {
      case 'single':
        return this.validateSingleChoice(input, page);

      case 'double':
        return this.validateDouble(input);

      case 'triple':
        return this.validateTriple(input);

      case 'text':
        return this.validateText(input);

      case 'disabled':
        return {
          valid: false,
          error: 'Input is disabled on this page',
          hint: 'Press back button to return'
        };

      default:
        return {
          valid: false,
          error: 'Unknown input mode',
          hint: context.hint
        };
    }
  }

  /**
   * Validates single-choice input
   * 
   * Requirement: 9.4
   */
  private validateSingleChoice(
    input: string,
    page: TeletextPage
  ): InputValidationResult {
    // Must be single digit
    if (!/^[0-9]$/.test(input)) {
      return {
        valid: false,
        error: 'Must be a single digit (0-9)',
        hint: 'Enter option number'
      };
    }

    // Check against inputOptions if specified
    if (page.meta?.inputOptions) {
      if (!page.meta.inputOptions.includes(input)) {
        const validOptions = page.meta.inputOptions.join(', ');
        return {
          valid: false,
          error: `Invalid option. Valid options: ${validOptions}`,
          hint: `Choose from: ${validOptions}`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates double-digit input
   * 
   * Requirement: 9.5
   */
  private validateDouble(input: string): InputValidationResult {
    // Must be 1-2 digits
    if (!/^[0-9]{1,2}$/.test(input)) {
      return {
        valid: false,
        error: 'Must be 1-2 digits',
        hint: 'Enter 2-digit page'
      };
    }

    return { valid: true };
  }

  /**
   * Validates triple-digit input (page navigation)
   * 
   * Requirement: 9.2
   */
  private validateTriple(input: string): InputValidationResult {
    // Must be 1-3 digits
    if (!/^[0-9]{1,3}$/.test(input)) {
      return {
        valid: false,
        error: 'Must be 1-3 digits',
        hint: 'Enter 3-digit page (100-999)'
      };
    }

    // If 3 digits, validate range
    if (input.length === 3) {
      const pageNum = parseInt(input, 10);
      if (pageNum < 100 || pageNum > 999) {
        return {
          valid: false,
          error: 'Page number must be between 100 and 999',
          hint: 'Enter valid page number (100-999)'
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates text input
   * 
   * Requirement: 9.3
   */
  private validateText(input: string): InputValidationResult {
    // Must not be empty
    if (input.trim().length === 0) {
      return {
        valid: false,
        error: 'Text cannot be empty',
        hint: 'Enter some text'
      };
    }

    // Check for reasonable length
    if (input.length > 200) {
      return {
        valid: false,
        error: 'Text too long (max 200 characters)',
        hint: 'Keep text under 200 characters'
      };
    }

    return { valid: true };
  }

  /**
   * Checks if a character is allowed in current context
   * 
   * Requirement: 9.5, 9.6
   */
  public isCharacterAllowed(char: string, page: TeletextPage): boolean {
    const context = this.getInputContext(page);
    return context.allowedCharacters.test(char);
  }

  /**
   * Gets error message for invalid input
   * 
   * Requirement: 9.6
   */
  public getErrorMessage(
    input: string,
    page: TeletextPage
  ): string {
    const result = this.validateInput(input, page);
    return result.error || 'Invalid input';
  }

  /**
   * Gets hint message for current context
   * 
   * Requirement: 9.6
   */
  public getHintMessage(page: TeletextPage): string {
    const context = this.getInputContext(page);
    return context.hint;
  }

  /**
   * Checks if input should auto-submit when complete
   * 
   * Requirement: 9.2, 9.4
   */
  public shouldAutoSubmit(page: TeletextPage): boolean {
    const context = this.getInputContext(page);
    return context.autoSubmit;
  }

  /**
   * Gets maximum input length for current context
   */
  public getMaxLength(page: TeletextPage): number {
    const context = this.getInputContext(page);
    return context.maxLength;
  }
}
