/**
 * Keyboard Shortcuts Utility
 * 
 * Provides keyboard shortcut definitions, visualization, and tips
 * Requirements: 30.1, 30.2, 30.3, 30.4, 30.5
 */

export interface KeyboardShortcut {
  key: string;
  label: string;
  description: string;
  category: 'navigation' | 'input' | 'quick-access' | 'special';
  frequency: 'high' | 'medium' | 'low';
  visual?: string; // Visual representation for display
}

/**
 * All available keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Navigation shortcuts
  {
    key: '0-9',
    label: 'Number Keys',
    description: 'Enter page numbers',
    category: 'navigation',
    frequency: 'high',
    visual: '[0][1][2][3][4][5][6][7][8][9]'
  },
  {
    key: 'Enter',
    label: 'Enter',
    description: 'Navigate to entered page',
    category: 'navigation',
    frequency: 'high',
    visual: '[Enter]'
  },
  {
    key: 'Backspace',
    label: 'Backspace',
    description: 'Delete last digit / Go back',
    category: 'navigation',
    frequency: 'high',
    visual: '[←Backspace]'
  },
  {
    key: 'ArrowUp',
    label: 'Arrow Up',
    description: 'Scroll up / Previous page',
    category: 'navigation',
    frequency: 'medium',
    visual: '[↑]'
  },
  {
    key: 'ArrowDown',
    label: 'Arrow Down',
    description: 'Scroll down / Next page',
    category: 'navigation',
    frequency: 'medium',
    visual: '[↓]'
  },
  {
    key: 'ArrowLeft',
    label: 'Arrow Left',
    description: 'Go to previous page',
    category: 'navigation',
    frequency: 'medium',
    visual: '[←]'
  },
  {
    key: 'ArrowRight',
    label: 'Arrow Right',
    description: 'Go forward in history',
    category: 'navigation',
    frequency: 'low',
    visual: '[→]'
  },
  
  // Quick access shortcuts (colored buttons)
  {
    key: 'R',
    label: 'Red Button',
    description: 'Quick link (varies by page)',
    category: 'quick-access',
    frequency: 'high',
    visual: '[🔴 R]'
  },
  {
    key: 'G',
    label: 'Green Button',
    description: 'Quick link (varies by page)',
    category: 'quick-access',
    frequency: 'high',
    visual: '[🟢 G]'
  },
  {
    key: 'Y',
    label: 'Yellow Button',
    description: 'Quick link (varies by page)',
    category: 'quick-access',
    frequency: 'medium',
    visual: '[🟡 Y]'
  },
  {
    key: 'B',
    label: 'Blue Button',
    description: 'Quick link (varies by page)',
    category: 'quick-access',
    frequency: 'medium',
    visual: '[🔵 B]'
  },
  
  // Special shortcuts
  {
    key: '100',
    label: 'Page 100',
    description: 'Jump to main index',
    category: 'special',
    frequency: 'high',
    visual: '100 + [Enter]'
  },
  {
    key: '999',
    label: 'Page 999',
    description: 'Open help page',
    category: 'special',
    frequency: 'low',
    visual: '999 + [Enter]'
  },
  {
    key: '700',
    label: 'Page 700',
    description: 'Open settings',
    category: 'special',
    frequency: 'medium',
    visual: '700 + [Enter]'
  },
  {
    key: '720',
    label: 'Page 720',
    description: 'View keyboard shortcuts',
    category: 'special',
    frequency: 'low',
    visual: '720 + [Enter]'
  }
];

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter(s => s.category === category);
}

/**
 * Get shortcuts by frequency
 */
export function getShortcutsByFrequency(frequency: KeyboardShortcut['frequency']): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter(s => s.frequency === frequency);
}

/**
 * Get a random shortcut tip
 */
export function getRandomShortcutTip(): string {
  const shortcuts = KEYBOARD_SHORTCUTS.filter(s => s.frequency !== 'low');
  const random = shortcuts[Math.floor(Math.random() * shortcuts.length)];
  return `TIP: Press ${random.visual || random.key} to ${random.description}`;
}

/**
 * Format a key combination for display
 * Requirements: 30.2
 */
export function formatKeyCombination(keys: string[]): string {
  return keys.map(key => {
    // Special key formatting
    const keyMap: Record<string, string> = {
      'Enter': '⏎',
      'Backspace': '⌫',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Ctrl': 'Ctrl',
      'Alt': 'Alt',
      'Shift': '⇧'
    };
    
    return keyMap[key] || key;
  }).join('+');
}

/**
 * Create a visual keyboard layout for page 720
 * Requirements: 30.1, 30.2
 */
export function createKeyboardLayout(): string[] {
  const layout = [
    '┌─────────────────────────────────┐',
    '│  KEYBOARD SHORTCUTS GUIDE       │',
    '└─────────────────────────────────┘',
    '',
    '┌───┬───┬───┬───┬───┬───┬───┬───┐',
    '│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │',
    '└───┴───┴───┴───┴───┴───┴───┴───┘',
    '┌───┬───┬───┬───┬───┬───┬───┬───┐',
    '│ 9 │ 0 │   │   │   │   │   │⌫  │',
    '└───┴───┴───┴───┴───┴───┴───┴───┘',
    '',
    '┌───┬───┬───┬───┬───┬───┬───┬───┐',
    '│ R │ G │ Y │ B │   │   │   │⏎  │',
    '└───┴───┴───┴───┴───┴───┴───┴───┘',
    '🔴  🟢  🟡  🔵              Enter',
    '',
    '      ┌───┐',
    '      │ ↑ │  Arrow Keys',
    '  ┌───┼───┼───┐',
    '  │ ← │ ↓ │ → │',
    '  └───┴───┴───┘'
  ];
  
  return layout;
}

/**
 * Highlight specific keys in the keyboard layout
 * Requirements: 30.2
 */
export function highlightKeys(layout: string[], keys: string[]): string[] {
  // This would be enhanced with color codes in the actual implementation
  return layout.map(line => {
    let highlighted = line;
    for (const key of keys) {
      // Add highlighting markers (would be color codes in real implementation)
      highlighted = highlighted.replace(new RegExp(`\\b${key}\\b`, 'g'), `[${key}]`);
    }
    return highlighted;
  });
}

/**
 * Create tutorial animation frames for a shortcut
 * Requirements: 30.4
 */
export function createShortcutTutorial(shortcut: KeyboardShortcut): string[][] {
  const frames: string[][] = [];
  
  // Frame 1: Show the key
  frames.push([
    `TUTORIAL: ${shortcut.label}`,
    '═══════════════════════════════════',
    '',
    `Press: ${shortcut.visual || shortcut.key}`,
    '',
    `Action: ${shortcut.description}`,
    '',
    'Watch the key highlight...'
  ]);
  
  // Frame 2: Highlight the key
  frames.push([
    `TUTORIAL: ${shortcut.label}`,
    '═══════════════════════════════════',
    '',
    `>>> ${shortcut.visual || shortcut.key} <<<`,
    '',
    `Action: ${shortcut.description}`,
    '',
    'Key is pressed!'
  ]);
  
  // Frame 3: Show result
  frames.push([
    `TUTORIAL: ${shortcut.label}`,
    '═══════════════════════════════════',
    '',
    `Press: ${shortcut.visual || shortcut.key}`,
    '',
    `✓ ${shortcut.description}`,
    '',
    'Tutorial complete!'
  ]);
  
  return frames;
}
