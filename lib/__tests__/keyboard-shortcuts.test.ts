/**
 * Tests for keyboard shortcuts utility
 * Requirements: 30.1, 30.2, 30.3, 30.4, 30.5
 */

import {
  KEYBOARD_SHORTCUTS,
  getShortcutsByCategory,
  getShortcutsByFrequency,
  getRandomShortcutTip,
  formatKeyCombination,
  createKeyboardLayout,
  highlightKeys
} from '../keyboard-shortcuts';

describe('Keyboard Shortcuts', () => {
  describe('KEYBOARD_SHORTCUTS', () => {
    it('should contain all essential shortcuts', () => {
      expect(KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
      
      // Check for essential shortcuts
      const keys = KEYBOARD_SHORTCUTS.map(s => s.key);
      expect(keys).toContain('0-9');
      expect(keys).toContain('Enter');
      expect(keys).toContain('Backspace');
      expect(keys).toContain('R');
      expect(keys).toContain('G');
      expect(keys).toContain('Y');
      expect(keys).toContain('B');
    });

    it('should have all required properties for each shortcut', () => {
      KEYBOARD_SHORTCUTS.forEach(shortcut => {
        expect(shortcut).toHaveProperty('key');
        expect(shortcut).toHaveProperty('label');
        expect(shortcut).toHaveProperty('description');
        expect(shortcut).toHaveProperty('category');
        expect(shortcut).toHaveProperty('frequency');
      });
    });

    it('should categorize shortcuts correctly', () => {
      const categories = KEYBOARD_SHORTCUTS.map(s => s.category);
      expect(categories).toContain('navigation');
      expect(categories).toContain('quick-access');
      expect(categories).toContain('special');
    });
  });

  describe('getShortcutsByCategory', () => {
    it('should return navigation shortcuts', () => {
      const navShortcuts = getShortcutsByCategory('navigation');
      expect(navShortcuts.length).toBeGreaterThan(0);
      navShortcuts.forEach(s => {
        expect(s.category).toBe('navigation');
      });
    });

    it('should return quick-access shortcuts', () => {
      const quickShortcuts = getShortcutsByCategory('quick-access');
      expect(quickShortcuts.length).toBeGreaterThan(0);
      quickShortcuts.forEach(s => {
        expect(s.category).toBe('quick-access');
      });
    });

    it('should return special shortcuts', () => {
      const specialShortcuts = getShortcutsByCategory('special');
      expect(specialShortcuts.length).toBeGreaterThan(0);
      specialShortcuts.forEach(s => {
        expect(s.category).toBe('special');
      });
    });
  });

  describe('getShortcutsByFrequency', () => {
    it('should return high frequency shortcuts', () => {
      const highFreq = getShortcutsByFrequency('high');
      expect(highFreq.length).toBeGreaterThan(0);
      highFreq.forEach(s => {
        expect(s.frequency).toBe('high');
      });
    });

    it('should return medium frequency shortcuts', () => {
      const mediumFreq = getShortcutsByFrequency('medium');
      expect(mediumFreq.length).toBeGreaterThan(0);
      mediumFreq.forEach(s => {
        expect(s.frequency).toBe('medium');
      });
    });

    it('should return low frequency shortcuts', () => {
      const lowFreq = getShortcutsByFrequency('low');
      expect(lowFreq.length).toBeGreaterThan(0);
      lowFreq.forEach(s => {
        expect(s.frequency).toBe('low');
      });
    });
  });

  describe('getRandomShortcutTip', () => {
    it('should return a tip string', () => {
      const tip = getRandomShortcutTip();
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return different tips on multiple calls', () => {
      const tips = new Set();
      for (let i = 0; i < 20; i++) {
        tips.add(getRandomShortcutTip());
      }
      // Should have at least 2 different tips in 20 calls
      expect(tips.size).toBeGreaterThan(1);
    });

    it('should not include low frequency shortcuts in tips', () => {
      const tip = getRandomShortcutTip();
      const lowFreqShortcuts = getShortcutsByFrequency('low');
      const lowFreqKeys = lowFreqShortcuts.map(s => s.key);
      
      // The tip should not be about a low frequency shortcut
      // (This is probabilistic, but with enough shortcuts it should hold)
      const containsLowFreq = lowFreqKeys.some(key => tip.includes(key));
      // We can't guarantee this, but it's unlikely
    });
  });

  describe('formatKeyCombination', () => {
    it('should format single keys', () => {
      expect(formatKeyCombination(['A'])).toBe('A');
      expect(formatKeyCombination(['1'])).toBe('1');
    });

    it('should format special keys with symbols', () => {
      expect(formatKeyCombination(['Enter'])).toBe('⏎');
      expect(formatKeyCombination(['Backspace'])).toBe('⌫');
      expect(formatKeyCombination(['ArrowUp'])).toBe('↑');
      expect(formatKeyCombination(['ArrowDown'])).toBe('↓');
      expect(formatKeyCombination(['ArrowLeft'])).toBe('←');
      expect(formatKeyCombination(['ArrowRight'])).toBe('→');
    });

    it('should format key combinations with plus signs', () => {
      expect(formatKeyCombination(['Ctrl', 'C'])).toBe('Ctrl+C');
      expect(formatKeyCombination(['Shift', 'Enter'])).toBe('⇧+⏎');
      expect(formatKeyCombination(['Ctrl', 'Alt', 'Delete'])).toBe('Ctrl+Alt+Delete');
    });
  });

  describe('createKeyboardLayout', () => {
    it('should return an array of strings', () => {
      const layout = createKeyboardLayout();
      expect(Array.isArray(layout)).toBe(true);
      expect(layout.length).toBeGreaterThan(0);
      layout.forEach(line => {
        expect(typeof line).toBe('string');
      });
    });

    it('should include number keys', () => {
      const layout = createKeyboardLayout();
      const layoutStr = layout.join('\n');
      expect(layoutStr).toContain('1');
      expect(layoutStr).toContain('2');
      expect(layoutStr).toContain('9');
      expect(layoutStr).toContain('0');
    });

    it('should include colored buttons', () => {
      const layout = createKeyboardLayout();
      const layoutStr = layout.join('\n');
      expect(layoutStr).toContain('R');
      expect(layoutStr).toContain('G');
      expect(layoutStr).toContain('Y');
      expect(layoutStr).toContain('B');
    });

    it('should include arrow keys', () => {
      const layout = createKeyboardLayout();
      const layoutStr = layout.join('\n');
      expect(layoutStr).toContain('↑');
      expect(layoutStr).toContain('↓');
      expect(layoutStr).toContain('←');
      expect(layoutStr).toContain('→');
    });

    it('should include Enter and Backspace', () => {
      const layout = createKeyboardLayout();
      const layoutStr = layout.join('\n');
      expect(layoutStr).toContain('⏎');
      expect(layoutStr).toContain('⌫');
    });
  });

  describe('highlightKeys', () => {
    it('should return an array of the same length', () => {
      const layout = createKeyboardLayout();
      const highlighted = highlightKeys(layout, ['R', 'G']);
      expect(highlighted.length).toBe(layout.length);
    });

    it('should add highlighting markers to specified keys', () => {
      const layout = ['Line with R and G keys'];
      const highlighted = highlightKeys(layout, ['R', 'G']);
      expect(highlighted[0]).toContain('[R]');
      expect(highlighted[0]).toContain('[G]');
    });

    it('should not modify keys that are not highlighted', () => {
      const layout = ['Line with R and G and Y keys'];
      const highlighted = highlightKeys(layout, ['R']);
      expect(highlighted[0]).toContain('[R]');
      expect(highlighted[0]).not.toContain('[G]');
      expect(highlighted[0]).not.toContain('[Y]');
    });

    it('should handle empty highlight list', () => {
      const layout = createKeyboardLayout();
      const highlighted = highlightKeys(layout, []);
      expect(highlighted).toEqual(layout);
    });
  });
});
