/**
 * Tests for Action Feedback Utility
 */

import {
  createSuccessMessage,
  createErrorMessage,
  createSavedMessage,
  createCelebrationMessage,
  createFeedbackMessage,
  centerFeedbackMessage,
  formatFeedbackDisplay,
  createBorderedFeedback,
  getFlashAnimationClass,
  getFeedbackColorClass,
  validateFeedbackConfig,
  FeedbackConfig,
  FeedbackDisplay
} from '../action-feedback';

describe('Action Feedback', () => {
  describe('createSuccessMessage', () => {
    it('should create basic success message', () => {
      const result = createSuccessMessage('Settings saved!');
      
      expect(result.lines).toEqual(['✓ Settings saved!']);
      expect(result.color).toBe('green');
      expect(result.duration).toBe(2500);
      expect(result.animation).toBe('checkmark');
    });

    it('should create success message with custom duration', () => {
      const result = createSuccessMessage('Done!', { duration: 3000 });
      
      expect(result.duration).toBe(3000);
      expect(result.lines).toEqual(['✓ Done!']);
    });

    it('should create success message with custom animation', () => {
      const result = createSuccessMessage('Complete!', { animation: 'flash' });
      
      expect(result.animation).toBe('flash');
      expect(result.lines).toEqual(['✓ Complete!']);
    });
  });

  describe('createErrorMessage', () => {
    it('should create basic error message', () => {
      const result = createErrorMessage('Failed to save');
      
      expect(result.lines).toEqual(['✗ Failed to save']);
      expect(result.color).toBe('red');
      expect(result.duration).toBe(2500);
      expect(result.animation).toBe('cross');
    });

    it('should create error message with custom duration', () => {
      const result = createErrorMessage('Error occurred', { duration: 4000 });
      
      expect(result.duration).toBe(4000);
      expect(result.lines).toEqual(['✗ Error occurred']);
    });

    it('should create error message with custom animation', () => {
      const result = createErrorMessage('Invalid input', { animation: 'flash' });
      
      expect(result.animation).toBe('flash');
      expect(result.lines).toEqual(['✗ Invalid input']);
    });
  });

  describe('createSavedMessage', () => {
    it('should create basic saved message', () => {
      const result = createSavedMessage();
      
      expect(result.lines).toEqual(['✓ SAVED']);
      expect(result.color).toBe('green');
      expect(result.duration).toBe(2000);
      expect(result.animation).toBe('flash');
    });

    it('should create saved message with item name', () => {
      const result = createSavedMessage('Theme preferences');
      
      expect(result.lines).toEqual(['✓ Theme preferences SAVED']);
      expect(result.animation).toBe('flash');
    });

    it('should create saved message with custom duration', () => {
      const result = createSavedMessage('Settings', { duration: 1500 });
      
      expect(result.duration).toBe(1500);
      expect(result.lines).toEqual(['✓ Settings SAVED']);
    });
  });

  describe('createCelebrationMessage', () => {
    it('should create celebration message with confetti', () => {
      const result = createCelebrationMessage('Quiz Complete!');
      
      expect(result.lines).toHaveLength(6); // 3 confetti + 1 empty + 2 message
      expect(result.lines[0]).toContain('*');
      expect(result.lines[0]).toContain('·');
      expect(result.lines[4]).toBe('🎉 Quiz Complete! 🎉');
      expect(result.lines[5]).toBe('✓ CONGRATULATIONS!');
      expect(result.color).toBe('green');
      expect(result.duration).toBe(3000);
      expect(result.animation).toBe('celebration');
    });

    it('should create celebration message without confetti', () => {
      const result = createCelebrationMessage('Done!', { showConfetti: false });
      
      expect(result.lines).toHaveLength(2);
      expect(result.lines[0]).toBe('🎉 Done! 🎉');
      expect(result.lines[1]).toBe('✓ CONGRATULATIONS!');
    });

    it('should create celebration message with custom duration', () => {
      const result = createCelebrationMessage('Success!', { duration: 4000 });
      
      expect(result.duration).toBe(4000);
      expect(result.animation).toBe('celebration');
    });
  });

  describe('createFeedbackMessage', () => {
    it('should create success feedback', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Operation completed'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.lines).toEqual(['✓ Operation completed']);
      expect(result.color).toBe('green');
      expect(result.animation).toBe('checkmark');
    });

    it('should create error feedback', () => {
      const config: FeedbackConfig = {
        type: 'error',
        message: 'Operation failed'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.lines).toEqual(['✗ Operation failed']);
      expect(result.color).toBe('red');
      expect(result.animation).toBe('cross');
    });

    it('should create warning feedback', () => {
      const config: FeedbackConfig = {
        type: 'warning',
        message: 'Please check input'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.lines).toEqual(['⚠ Please check input']);
      expect(result.color).toBe('yellow');
      expect(result.animation).toBe('flash');
    });

    it('should create info feedback', () => {
      const config: FeedbackConfig = {
        type: 'info',
        message: 'Loading data'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.lines).toEqual(['ℹ Loading data']);
      expect(result.color).toBe('cyan');
      expect(result.animation).toBe('none');
    });

    it('should use custom animation', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Done',
        animation: 'celebration'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.animation).toBe('celebration');
    });

    it('should use custom duration', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Done',
        duration: 5000
      };
      const result = createFeedbackMessage(config);
      
      expect(result.duration).toBe(5000);
    });

    it('should use custom color', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Done',
        color: 'magenta'
      };
      const result = createFeedbackMessage(config);
      
      expect(result.color).toBe('magenta');
    });
  });

  describe('centerFeedbackMessage', () => {
    it('should center message in default width', () => {
      const result = centerFeedbackMessage('Test');
      
      expect(result.length).toBe(40);
      expect(result.trim()).toBe('Test');
      expect(result.indexOf('Test')).toBe(18); // (40 - 4) / 2 = 18
    });

    it('should center message in custom width', () => {
      const result = centerFeedbackMessage('Test', 20);
      
      expect(result.length).toBe(20);
      expect(result.indexOf('Test')).toBe(8); // (20 - 4) / 2 = 8
    });

    it('should truncate if message is too long', () => {
      const longMessage = 'This is a very long message that exceeds the width';
      const result = centerFeedbackMessage(longMessage, 20);
      
      expect(result.length).toBe(20);
      expect(result).toBe(longMessage.substring(0, 20));
    });

    it('should handle exact width match', () => {
      const result = centerFeedbackMessage('1234567890', 10);
      
      expect(result).toBe('1234567890');
    });

    it('should handle empty message', () => {
      const result = centerFeedbackMessage('', 10);
      
      expect(result).toBe(' '.repeat(10));
    });
  });

  describe('formatFeedbackDisplay', () => {
    it('should format centered feedback', () => {
      const feedback: FeedbackDisplay = {
        lines: ['✓ SAVED', 'Success!'],
        color: 'green',
        duration: 2000,
        animation: 'flash'
      };
      const result = formatFeedbackDisplay(feedback, { centered: true });
      
      expect(result).toHaveLength(2);
      expect(result[0].length).toBe(40);
      expect(result[1].length).toBe(40);
      expect(result[0].trim()).toBe('✓ SAVED');
      expect(result[1].trim()).toBe('Success!');
    });

    it('should format non-centered feedback', () => {
      const feedback: FeedbackDisplay = {
        lines: ['✓ SAVED'],
        color: 'green',
        duration: 2000,
        animation: 'flash'
      };
      const result = formatFeedbackDisplay(feedback, { centered: false });
      
      expect(result).toEqual(['✓ SAVED']);
    });

    it('should format with custom width', () => {
      const feedback: FeedbackDisplay = {
        lines: ['Test'],
        color: 'green',
        duration: 2000,
        animation: 'none'
      };
      const result = formatFeedbackDisplay(feedback, { centered: true, width: 20 });
      
      expect(result[0].length).toBe(20);
      expect(result[0].trim()).toBe('Test');
    });
  });

  describe('createBorderedFeedback', () => {
    it('should create bordered feedback with default settings', () => {
      const feedback: FeedbackDisplay = {
        lines: ['✓ SAVED'],
        color: 'green',
        duration: 2000,
        animation: 'flash'
      };
      const result = createBorderedFeedback(feedback);
      
      expect(result).toHaveLength(5); // border + empty + message + empty + border
      expect(result[0]).toBe('═'.repeat(40));
      expect(result[1]).toBe(' '.repeat(40));
      expect(result[2].trim()).toBe('✓ SAVED');
      expect(result[3]).toBe(' '.repeat(40));
      expect(result[4]).toBe('═'.repeat(40));
    });

    it('should create bordered feedback with custom width', () => {
      const feedback: FeedbackDisplay = {
        lines: ['Test'],
        color: 'green',
        duration: 2000,
        animation: 'none'
      };
      const result = createBorderedFeedback(feedback, { width: 20 });
      
      expect(result[0].length).toBe(20);
      expect(result[0]).toBe('═'.repeat(20));
    });

    it('should create bordered feedback with custom border char', () => {
      const feedback: FeedbackDisplay = {
        lines: ['Test'],
        color: 'green',
        duration: 2000,
        animation: 'none'
      };
      const result = createBorderedFeedback(feedback, { borderChar: '─' });
      
      expect(result[0]).toBe('─'.repeat(40));
      expect(result[4]).toBe('─'.repeat(40));
    });

    it('should handle multiple lines', () => {
      const feedback: FeedbackDisplay = {
        lines: ['Line 1', 'Line 2', 'Line 3'],
        color: 'green',
        duration: 2000,
        animation: 'none'
      };
      const result = createBorderedFeedback(feedback);
      
      expect(result).toHaveLength(7); // border + empty + 3 lines + empty + border
      expect(result[2].trim()).toBe('Line 1');
      expect(result[3].trim()).toBe('Line 2');
      expect(result[4].trim()).toBe('Line 3');
    });
  });

  describe('getFlashAnimationClass', () => {
    it('should return correct class for success', () => {
      expect(getFlashAnimationClass('success')).toBe('feedback-flash-success');
    });

    it('should return correct class for error', () => {
      expect(getFlashAnimationClass('error')).toBe('feedback-flash-error');
    });

    it('should return correct class for warning', () => {
      expect(getFlashAnimationClass('warning')).toBe('feedback-flash-warning');
    });

    it('should return correct class for info', () => {
      expect(getFlashAnimationClass('info')).toBe('feedback-flash-info');
    });
  });

  describe('getFeedbackColorClass', () => {
    it('should return correct color class for success', () => {
      expect(getFeedbackColorClass('success')).toBe('teletext-green');
    });

    it('should return correct color class for error', () => {
      expect(getFeedbackColorClass('error')).toBe('teletext-red');
    });

    it('should return correct color class for warning', () => {
      expect(getFeedbackColorClass('warning')).toBe('teletext-yellow');
    });

    it('should return correct color class for info', () => {
      expect(getFeedbackColorClass('info')).toBe('teletext-cyan');
    });
  });

  describe('validateFeedbackConfig', () => {
    it('should not throw for valid config', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Valid message'
      };
      
      expect(() => validateFeedbackConfig(config)).not.toThrow();
    });

    it('should throw for empty message', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: ''
      };
      
      expect(() => validateFeedbackConfig(config)).toThrow('cannot be empty');
    });

    it('should throw for whitespace-only message', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: '   '
      };
      
      expect(() => validateFeedbackConfig(config)).toThrow('cannot be empty');
    });

    it('should throw for negative duration', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Test',
        duration: -100
      };
      
      expect(() => validateFeedbackConfig(config)).toThrow('cannot be negative');
    });

    it('should throw for invalid type', () => {
      const config: any = {
        type: 'invalid',
        message: 'Test'
      };
      
      expect(() => validateFeedbackConfig(config)).toThrow('Invalid feedback type');
    });

    it('should allow zero duration', () => {
      const config: FeedbackConfig = {
        type: 'success',
        message: 'Test',
        duration: 0
      };
      
      expect(() => validateFeedbackConfig(config)).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    it('should create complete save feedback display', () => {
      const feedback = createSavedMessage('Settings');
      const formatted = formatFeedbackDisplay(feedback, { centered: true });
      
      expect(formatted[0].trim()).toBe('✓ Settings SAVED');
      expect(feedback.animation).toBe('flash');
      expect(feedback.color).toBe('green');
    });

    it('should create complete quiz completion display', () => {
      const feedback = createCelebrationMessage('Quiz Complete!');
      const bordered = createBorderedFeedback(feedback);
      
      expect(bordered.length).toBeGreaterThan(5);
      expect(bordered[0]).toBe('═'.repeat(40));
      expect(feedback.animation).toBe('celebration');
    });

    it('should create error feedback with border', () => {
      const feedback = createErrorMessage('Failed to load data');
      const bordered = createBorderedFeedback(feedback);
      
      expect(bordered).toHaveLength(5);
      expect(bordered[2].trim()).toBe('✗ Failed to load data');
      expect(feedback.color).toBe('red');
    });

    it('should create custom feedback with all options', () => {
      const config: FeedbackConfig = {
        type: 'warning',
        message: 'Check your input',
        animation: 'flash',
        duration: 3500,
        color: 'yellow'
      };
      const feedback = createFeedbackMessage(config);
      const formatted = formatFeedbackDisplay(feedback);
      
      expect(feedback.lines[0]).toBe('⚠ Check your input');
      expect(feedback.color).toBe('yellow');
      expect(feedback.duration).toBe(3500);
      expect(feedback.animation).toBe('flash');
      expect(formatted[0].length).toBe(40);
    });
  });
});
