/**
 * Tests for Input Context Manager
 * 
 * Validates input mode detection, validation, and context-aware error messages
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

import { InputContextManager } from '../input-context-manager';
import { TeletextPage } from '@/types/teletext';

describe('InputContextManager', () => {
  let manager: InputContextManager;

  beforeEach(() => {
    manager = new InputContextManager();
  });

  describe('Input Mode Detection (Requirement 9.1)', () => {
    it('should detect single-digit mode from inputMode metadata', () => {
      const page: TeletextPage = {
        id: '500',
        title: 'AI Selection',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('single');
    });

    it('should detect text mode from inputMode metadata', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'text'
        }
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('text');
    });

    it('should detect text mode from AI question page title', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Ask a Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('text');
    });

    it('should detect single-digit mode from inputOptions', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputOptions: ['1', '2', '3', '4']
        }
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('single');
    });

    it('should detect single-digit mode from numbered links', () => {
      const page: TeletextPage = {
        id: '700',
        title: 'Settings',
        rows: Array(24).fill(''.padEnd(40)),
        links: [
          { label: '1', targetPage: '701' },
          { label: '2', targetPage: '702' },
          { label: '3', targetPage: '703' }
        ],
        meta: {}
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('single');
    });

    it('should default to triple-digit mode for standard pages', () => {
      const page: TeletextPage = {
        id: '200',
        title: 'News',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {}
      };

      const mode = manager.detectInputMode(page);
      expect(mode).toBe('triple');
    });
  });

  describe('Page Navigation Mode Handler (Requirement 9.2)', () => {
    it('should validate 1-3 digit numeric input', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      expect(manager.validateInput('1', page).valid).toBe(true);
      expect(manager.validateInput('12', page).valid).toBe(true);
      expect(manager.validateInput('123', page).valid).toBe(true);
      expect(manager.validateInput('abc', page).valid).toBe(false);
    });

    it('should validate page number range (100-999)', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      expect(manager.validateInput('100', page).valid).toBe(true);
      expect(manager.validateInput('500', page).valid).toBe(true);
      expect(manager.validateInput('999', page).valid).toBe(true);
      expect(manager.validateInput('099', page).valid).toBe(false);
      expect(manager.validateInput('000', page).valid).toBe(false);
    });

    it('should indicate auto-submit for triple-digit mode', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      expect(manager.shouldAutoSubmit(page)).toBe(true);
    });
  });

  describe('Text Entry Mode Handler (Requirement 9.3)', () => {
    it('should accept full alphanumeric and punctuation', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      expect(manager.isCharacterAllowed('a', page)).toBe(true);
      expect(manager.isCharacterAllowed('Z', page)).toBe(true);
      expect(manager.isCharacterAllowed('5', page)).toBe(true);
      expect(manager.isCharacterAllowed(' ', page)).toBe(true);
      expect(manager.isCharacterAllowed('.', page)).toBe(true);
      expect(manager.isCharacterAllowed('?', page)).toBe(true);
      expect(manager.isCharacterAllowed('!', page)).toBe(true);
    });

    it('should validate non-empty text', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      expect(manager.validateInput('Hello world', page).valid).toBe(true);
      expect(manager.validateInput('', page).valid).toBe(false);
      expect(manager.validateInput('   ', page).valid).toBe(false);
    });

    it('should not auto-submit for text mode', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      expect(manager.shouldAutoSubmit(page)).toBe(false);
    });

    it('should provide appropriate hint for text mode', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      const hint = manager.getHintMessage(page);
      expect(hint).toContain('Enter');
      expect(hint.toLowerCase()).toContain('text');
    });
  });

  describe('Single Choice Mode Handler (Requirement 9.4)', () => {
    it('should accept only single character selections', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4']
        }
      };

      expect(manager.validateInput('1', page).valid).toBe(true);
      expect(manager.validateInput('12', page).valid).toBe(false);
      expect(manager.validateInput('a', page).valid).toBe(false);
    });

    it('should validate against inputOptions', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      expect(manager.validateInput('1', page).valid).toBe(true);
      expect(manager.validateInput('2', page).valid).toBe(true);
      expect(manager.validateInput('3', page).valid).toBe(true);
      expect(manager.validateInput('4', page).valid).toBe(false);
    });

    it('should show error for invalid choices', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      const result = manager.validateInput('9', page);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid option');
    });

    it('should auto-submit for single choice mode', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      expect(manager.shouldAutoSubmit(page)).toBe(true);
    });
  });

  describe('Numeric Only Mode Handler (Requirement 9.5)', () => {
    it('should filter out non-numeric characters', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      expect(manager.isCharacterAllowed('5', page)).toBe(true);
      expect(manager.isCharacterAllowed('a', page)).toBe(false);
      expect(manager.isCharacterAllowed(' ', page)).toBe(false);
      expect(manager.isCharacterAllowed('.', page)).toBe(false);
    });

    it('should accept only digits 0-9', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      for (let i = 0; i <= 9; i++) {
        expect(manager.isCharacterAllowed(i.toString(), page)).toBe(true);
      }
    });
  });

  describe('Input Validation Per Mode (Requirement 9.6)', () => {
    it('should provide context-appropriate error messages', () => {
      const singlePage: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      const result = manager.validateInput('a', singlePage);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('digit');
    });

    it('should provide hints about expected input', () => {
      const textPage: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      const result = manager.validateInput('', textPage);
      expect(result.valid).toBe(false);
      expect(result.hint).toBeDefined();
    });

    it('should validate empty input appropriately', () => {
      const pages = [
        { id: '100', meta: { inputMode: 'triple' as const } },
        { id: '500', meta: { inputMode: 'single' as const } },
        { id: '510', meta: { inputMode: 'text' as const } }
      ];

      pages.forEach(({ id, meta }) => {
        const page: TeletextPage = {
          id,
          title: 'Test',
          rows: Array(24).fill(''.padEnd(40)),
          links: [],
          meta
        };

        const result = manager.validateInput('', page);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('empty');
      });
    });

    it('should validate input length constraints', () => {
      const triplePage: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      expect(manager.validateInput('1234', triplePage).valid).toBe(false);
    });
  });

  describe('Input Context Information', () => {
    it('should provide complete context for single mode', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'single' }
      };

      const context = manager.getInputContext(page);
      expect(context.mode).toBe('single');
      expect(context.maxLength).toBe(1);
      expect(context.autoSubmit).toBe(true);
      expect(context.hint).toBeDefined();
    });

    it('should provide complete context for text mode', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      const context = manager.getInputContext(page);
      expect(context.mode).toBe('text');
      expect(context.maxLength).toBeGreaterThan(1);
      expect(context.autoSubmit).toBe(false);
      expect(context.hint).toBeDefined();
    });

    it('should provide max length for each mode', () => {
      const modes = [
        { mode: 'single' as const, expectedMax: 1 },
        { mode: 'double' as const, expectedMax: 2 },
        { mode: 'triple' as const, expectedMax: 3 },
        { mode: 'text' as const, expectedMax: 200 }
      ];

      modes.forEach(({ mode, expectedMax }) => {
        const page: TeletextPage = {
          id: '100',
          title: 'Test',
          rows: Array(24).fill(''.padEnd(40)),
          links: [],
          meta: { inputMode: mode }
        };

        expect(manager.getMaxLength(page)).toBe(expectedMax);
      });
    });
  });

  describe('Error Messages', () => {
    it('should provide specific error for invalid page range', () => {
      const page: TeletextPage = {
        id: '100',
        title: 'Index',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'triple' }
      };

      const result = manager.validateInput('050', page);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('100');
      expect(result.error).toContain('999');
    });

    it('should provide specific error for invalid option', () => {
      const page: TeletextPage = {
        id: '600',
        title: 'Quiz',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: {
          inputMode: 'single',
          inputOptions: ['1', '2', '3']
        }
      };

      const result = manager.validateInput('9', page);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('1, 2, 3');
    });

    it('should provide error for text too long', () => {
      const page: TeletextPage = {
        id: '510',
        title: 'Enter Question',
        rows: Array(24).fill(''.padEnd(40)),
        links: [],
        meta: { inputMode: 'text' }
      };

      const longText = 'a'.repeat(201);
      const result = manager.validateInput(longText, page);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });
  });
});
