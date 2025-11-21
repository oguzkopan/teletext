/**
 * Tests for Interactive Element Highlighting Utilities
 * 
 * Requirements tested:
 * - 25.1: Highlight interactive elements with brackets or color
 * - 25.2: Display visual highlight or underline on hover
 * - 25.3: Display border or background color change on focus
 * - 25.4: Use consistent visual styling across all pages
 * - 25.5: Show links in distinct color with indicator (►)
 */

import {
  formatInteractiveElement,
  detectInteractiveElements,
  getInteractiveElementClasses,
  getInteractiveElementStyles,
  formatNavigationOption,
  wrapInteractiveText,
  hasInteractiveElements,
  extractPlainText,
  InteractiveElement
} from '../interactive-element-highlighting';

describe('Interactive Element Highlighting', () => {
  describe('formatInteractiveElement', () => {
    it('should format button with brackets (Requirement 25.1)', () => {
      const element: InteractiveElement = {
        type: 'button',
        label: '1',
        action: '200'
      };
      
      const result = formatInteractiveElement(element);
      expect(result).toBe('[1]');
    });
    
    it('should format selection with brackets (Requirement 25.1)', () => {
      const element: InteractiveElement = {
        type: 'selection',
        label: 'Option A'
      };
      
      const result = formatInteractiveElement(element);
      expect(result).toBe('[Option A]');
    });
    
    it('should format link with arrow indicator (Requirement 25.5)', () => {
      const element: InteractiveElement = {
        type: 'link',
        label: 'News',
        action: '200'
      };
      
      const result = formatInteractiveElement(element);
      expect(result).toBe('► News');
    });
    
    it('should add color code when specified', () => {
      const element: InteractiveElement = {
        type: 'button',
        label: 'Press',
        action: '100'
      };
      
      const result = formatInteractiveElement(element, { colorCode: 'red' });
      expect(result).toBe('{red}[Press]{white}');
    });
    
    it('should respect showBrackets option', () => {
      const element: InteractiveElement = {
        type: 'button',
        label: '1'
      };
      
      const result = formatInteractiveElement(element, { showBrackets: false });
      expect(result).toBe('1');
    });
    
    it('should respect showLinkIndicator option', () => {
      const element: InteractiveElement = {
        type: 'link',
        label: 'News'
      };
      
      const result = formatInteractiveElement(element, { showLinkIndicator: false });
      expect(result).toBe('News');
    });
  });
  
  describe('detectInteractiveElements', () => {
    it('should detect bracketed buttons', () => {
      const text = 'Press [1] for news or [2] for sports';
      const elements = detectInteractiveElements(text);
      
      expect(elements).toHaveLength(2);
      expect(elements[0]).toMatchObject({
        content: '[1]',
        type: 'button'
      });
      expect(elements[1]).toMatchObject({
        content: '[2]',
        type: 'button'
      });
    });
    
    it('should detect bracketed selections', () => {
      const text = 'Choose [Option A] or [Option B]';
      const elements = detectInteractiveElements(text);
      
      expect(elements).toHaveLength(2);
      expect(elements[0]).toMatchObject({
        content: '[Option A]',
        type: 'selection'
      });
      expect(elements[1]).toMatchObject({
        content: '[Option B]',
        type: 'selection'
      });
    });
    
    it('should detect link indicators (Requirement 25.5)', () => {
      const text = 'Go to ► News or ► Sports';
      const elements = detectInteractiveElements(text);
      
      expect(elements).toHaveLength(2);
      expect(elements[0]).toMatchObject({
        content: '► News',
        type: 'link'
      });
      expect(elements[1]).toMatchObject({
        content: '► Sports',
        type: 'link'
      });
    });
    
    it('should detect mixed interactive elements', () => {
      const text = 'Press [1] or go to ► Index';
      const elements = detectInteractiveElements(text);
      
      expect(elements).toHaveLength(2);
      expect(elements[0].type).toBe('button');
      expect(elements[1].type).toBe('link');
    });
    
    it('should return empty array for text without interactive elements', () => {
      const text = 'This is plain text';
      const elements = detectInteractiveElements(text);
      
      expect(elements).toHaveLength(0);
    });
  });
  
  describe('getInteractiveElementClasses', () => {
    it('should return base classes (Requirement 25.4)', () => {
      const classes = getInteractiveElementClasses('button');
      
      expect(classes).toContain('interactive-element');
      expect(classes).toContain('interactive-button');
    });
    
    it('should add hover class when hovering (Requirement 25.2)', () => {
      const classes = getInteractiveElementClasses('button', { hover: true });
      
      expect(classes).toContain('interactive-hover');
    });
    
    it('should add focus class when focused (Requirement 25.3)', () => {
      const classes = getInteractiveElementClasses('button', { focus: true });
      
      expect(classes).toContain('interactive-focus');
    });
    
    it('should add active class when active', () => {
      const classes = getInteractiveElementClasses('button', { active: true });
      
      expect(classes).toContain('interactive-active');
    });
    
    it('should add multiple state classes', () => {
      const classes = getInteractiveElementClasses('link', {
        hover: true,
        focus: true
      });
      
      expect(classes).toContain('interactive-hover');
      expect(classes).toContain('interactive-focus');
    });
    
    it('should have consistent classes for all types (Requirement 25.4)', () => {
      const buttonClasses = getInteractiveElementClasses('button');
      const linkClasses = getInteractiveElementClasses('link');
      const selectionClasses = getInteractiveElementClasses('selection');
      
      expect(buttonClasses).toContain('interactive-element');
      expect(linkClasses).toContain('interactive-element');
      expect(selectionClasses).toContain('interactive-element');
    });
  });
  
  describe('getInteractiveElementStyles', () => {
    const mockTheme = {
      colors: {
        text: '#ffffff',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        cyan: '#00ffff',
        white: '#ffffff'
      }
    };
    
    it('should generate CSS styles (Requirement 25.4)', () => {
      const styles = getInteractiveElementStyles(mockTheme);
      
      expect(styles).toContain('.interactive-element');
      expect(styles).toContain('cursor: pointer');
    });
    
    it('should include hover styles (Requirement 25.2)', () => {
      const styles = getInteractiveElementStyles(mockTheme);
      
      expect(styles).toContain('.interactive-element:hover');
      expect(styles).toContain('text-decoration: underline');
    });
    
    it('should include focus styles (Requirement 25.3)', () => {
      const styles = getInteractiveElementStyles(mockTheme);
      
      expect(styles).toContain('.interactive-element:focus');
      expect(styles).toContain('outline:');
    });
    
    it('should style links distinctly (Requirement 25.5)', () => {
      const styles = getInteractiveElementStyles(mockTheme);
      
      expect(styles).toContain('.interactive-link');
      expect(styles).toContain(mockTheme.colors.cyan);
    });
  });
  
  describe('formatNavigationOption', () => {
    it('should format with page number and label', () => {
      const result = formatNavigationOption(200, 'News');
      
      expect(result).toContain('200');
      expect(result).toContain('News');
    });
    
    it('should pad single-digit numbers', () => {
      const result = formatNavigationOption(1, 'Option');
      
      expect(result).toMatch(/^\s*1\./);
    });
    
    it('should add brackets when specified', () => {
      const result = formatNavigationOption(100, 'Index', { showBrackets: true });
      
      expect(result).toMatch(/^\[/);
      expect(result).toMatch(/\]$/);
    });
    
    it('should add link indicator when isLink is true', () => {
      const result = formatNavigationOption(200, 'News', { isLink: true });
      
      expect(result).toContain('►');
    });
    
    it('should add color code when specified', () => {
      const result = formatNavigationOption(300, 'Sports', { colorCode: 'green' });
      
      expect(result).toContain('{green}');
      expect(result).toContain('{white}');
    });
  });
  
  describe('wrapInteractiveText', () => {
    it('should wrap button text with brackets', () => {
      const result = wrapInteractiveText('Press', 'button');
      expect(result).toBe('[Press]');
    });
    
    it('should wrap link text with arrow', () => {
      const result = wrapInteractiveText('News', 'link');
      expect(result).toBe('►News');
    });
    
    it('should wrap selection text with brackets', () => {
      const result = wrapInteractiveText('Option A', 'selection');
      expect(result).toBe('[Option A]');
    });
  });
  
  describe('hasInteractiveElements', () => {
    it('should return true for text with brackets', () => {
      expect(hasInteractiveElements('Press [1]')).toBe(true);
    });
    
    it('should return true for text with link indicators', () => {
      expect(hasInteractiveElements('Go to ► News')).toBe(true);
    });
    
    it('should return false for plain text', () => {
      expect(hasInteractiveElements('Plain text')).toBe(false);
    });
  });
  
  describe('extractPlainText', () => {
    it('should remove brackets', () => {
      const result = extractPlainText('Press [1] for news');
      expect(result).toBe('Press 1 for news');
    });
    
    it('should remove link indicators', () => {
      const result = extractPlainText('Go to ► News');
      expect(result).toBe('Go to News');
    });
    
    it('should remove both brackets and link indicators', () => {
      const result = extractPlainText('Press [1] or ► Index');
      expect(result).toBe('Press 1 or Index');
    });
    
    it('should return unchanged text if no interactive elements', () => {
      const result = extractPlainText('Plain text');
      expect(result).toBe('Plain text');
    });
  });
});
