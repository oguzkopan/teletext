/**
 * Input Buffer Display Tests
 * 
 * Tests for input buffer display utilities
 * Requirements: 6.5, 8.4, 15.1
 */

import {
  formatInputBuffer,
  getInputBufferAnimationClasses,
  getInputBufferStyles,
  getInputBufferPosition
} from '../input-buffer-display';

describe('Input Buffer Display', () => {
  describe('formatInputBuffer', () => {
    it('should display hint when buffer is empty', () => {
      const result = formatInputBuffer({
        buffer: '',
        expectedLength: 3,
        showHint: true
      });
      
      expect(result).toBe('Enter 3-digit page number');
    });
    
    it('should display hint for single digit input', () => {
      const result = formatInputBuffer({
        buffer: '',
        expectedLength: 1,
        showHint: true
      });
      
      expect(result).toBe('Enter 1 digit');
    });
    
    it('should display hint for double digit input', () => {
      const result = formatInputBuffer({
        buffer: '',
        expectedLength: 2,
        showHint: true
      });
      
      expect(result).toBe('Enter 2 digits');
    });
    
    it('should display entered digits with cursor', () => {
      const result = formatInputBuffer({
        buffer: '2',
        expectedLength: 3,
        showCursor: true
      });
      
      expect(result).toBe('2_');
    });
    
    it('should display multiple digits with cursor', () => {
      const result = formatInputBuffer({
        buffer: '20',
        expectedLength: 3,
        showCursor: true
      });
      
      expect(result).toBe('20_');
    });
    
    it('should not display cursor when buffer is full', () => {
      const result = formatInputBuffer({
        buffer: '200',
        expectedLength: 3,
        showCursor: true
      });
      
      expect(result).toBe('200');
    });
    
    it('should not display cursor when showCursor is false', () => {
      const result = formatInputBuffer({
        buffer: '2',
        expectedLength: 3,
        showCursor: false
      });
      
      expect(result).toBe('2');
    });
  });
  
  describe('getInputBufferAnimationClasses', () => {
    it('should include base class', () => {
      const classes = getInputBufferAnimationClasses('', '');
      
      expect(classes).toContain('input-buffer-display');
    });
    
    it('should add digit entry animation when digit is added', () => {
      const classes = getInputBufferAnimationClasses('2', '');
      
      expect(classes).toContain('digit-entry-animation');
    });
    
    it('should add digit entry animation when second digit is added', () => {
      const classes = getInputBufferAnimationClasses('20', '2');
      
      expect(classes).toContain('digit-entry-animation');
    });
    
    it('should add clear animation when buffer is cleared', () => {
      const classes = getInputBufferAnimationClasses('', '200');
      
      expect(classes).toContain('buffer-clear-animation');
    });
    
    it('should not add animations when buffer is unchanged', () => {
      const classes = getInputBufferAnimationClasses('2', '2');
      
      expect(classes).toHaveLength(1);
      expect(classes).toContain('input-buffer-display');
    });
  });
  
  describe('getInputBufferStyles', () => {
    it('should return CSS styles string', () => {
      const styles = getInputBufferStyles('ceefax');
      
      expect(styles).toContain('.input-buffer-display');
      expect(styles).toContain('digitEntry');
      expect(styles).toContain('bufferClear');
      expect(styles).toContain('cursorBlink');
    });
    
    it('should include theme-specific styles', () => {
      const styles = getInputBufferStyles('haunting');
      
      expect(styles).toContain('.input-buffer-haunting');
      expect(styles).toContain('glitchPulse');
    });
    
    it('should include all theme variants', () => {
      const styles = getInputBufferStyles('ceefax');
      
      expect(styles).toContain('.input-buffer-ceefax');
      expect(styles).toContain('.input-buffer-haunting');
      expect(styles).toContain('.input-buffer-high-contrast');
      expect(styles).toContain('.input-buffer-orf');
    });
  });
  
  describe('getInputBufferPosition', () => {
    it('should return header position', () => {
      const position = getInputBufferPosition('header');
      
      expect(position).toEqual({
        top: '20px',
        right: '20px'
      });
    });
    
    it('should return footer position', () => {
      const position = getInputBufferPosition('footer');
      
      expect(position).toEqual({
        bottom: '40px',
        left: '50%'
      });
    });
    
    it('should default to footer position', () => {
      const position = getInputBufferPosition();
      
      expect(position).toEqual({
        bottom: '40px',
        left: '50%'
      });
    });
  });
});
