/**
 * Tests for Progress Indicators Utility
 */

import {
  renderStepCounter,
  renderQuestionCounter,
  renderProgressBar,
  renderCompletionAnimation,
  renderCombinedProgress,
  calculateProgressPercentage,
  centerProgressIndicator,
  createProgressDisplay,
  createConfettiAnimation,
  validateProgressValues,
  ProgressConfig,
  ProgressBarConfig,
  CompletionConfig
} from '../progress-indicators';

describe('Progress Indicators', () => {
  describe('renderStepCounter', () => {
    it('should render basic step counter', () => {
      const result = renderStepCounter({ current: 2, total: 4 });
      expect(result).toBe('Step 2 of 4');
    });

    it('should render step counter with custom label', () => {
      const result = renderStepCounter({ current: 3, total: 5, label: 'Question' });
      expect(result).toBe('Question 3 of 5');
    });

    it('should render step counter with percentage', () => {
      const result = renderStepCounter({ current: 2, total: 4, showPercentage: true });
      expect(result).toBe('Step 2 of 4 (50%)');
    });

    it('should handle first step', () => {
      const result = renderStepCounter({ current: 1, total: 10 });
      expect(result).toBe('Step 1 of 10');
    });

    it('should handle last step', () => {
      const result = renderStepCounter({ current: 10, total: 10 });
      expect(result).toBe('Step 10 of 10');
    });

    it('should throw error for invalid current value', () => {
      expect(() => renderStepCounter({ current: 0, total: 4 })).toThrow();
      expect(() => renderStepCounter({ current: 5, total: 4 })).toThrow();
    });

    it('should throw error for invalid total value', () => {
      expect(() => renderStepCounter({ current: 1, total: 0 })).toThrow();
    });
  });

  describe('renderQuestionCounter', () => {
    it('should render question counter', () => {
      const result = renderQuestionCounter(3, 10);
      expect(result).toBe('Question 3/10');
    });

    it('should handle first question', () => {
      const result = renderQuestionCounter(1, 5);
      expect(result).toBe('Question 1/5');
    });

    it('should handle last question', () => {
      const result = renderQuestionCounter(5, 5);
      expect(result).toBe('Question 5/5');
    });

    it('should throw error for invalid values', () => {
      expect(() => renderQuestionCounter(0, 10)).toThrow();
      expect(() => renderQuestionCounter(11, 10)).toThrow();
    });
  });

  describe('renderProgressBar', () => {
    it('should render progress bar with default settings', () => {
      const result = renderProgressBar({ current: 5, total: 10 });
      expect(result).toBe('▓▓▓▓▓░░░░░');
      expect(result.length).toBe(10);
    });

    it('should render empty progress bar', () => {
      const result = renderProgressBar({ current: 0, total: 10 });
      expect(result).toBe('░░░░░░░░░░');
    });

    it('should render full progress bar', () => {
      const result = renderProgressBar({ current: 10, total: 10 });
      expect(result).toBe('▓▓▓▓▓▓▓▓▓▓');
    });

    it('should render progress bar with custom width', () => {
      const result = renderProgressBar({ current: 5, total: 10, width: 20 });
      expect(result).toBe('▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░');
      expect(result.length).toBe(20);
    });

    it('should render progress bar with custom characters', () => {
      const result = renderProgressBar({
        current: 3,
        total: 10,
        width: 10,
        filledChar: '█',
        emptyChar: '─'
      });
      expect(result).toBe('███───────');
    });

    it('should render progress bar with label', () => {
      const result = renderProgressBar({ current: 7, total: 10, showLabel: true });
      expect(result).toBe('▓▓▓▓▓▓▓░░░ 70%');
    });

    it('should handle partial progress correctly', () => {
      const result = renderProgressBar({ current: 1, total: 3, width: 9 });
      // 1/3 = 33.33%, rounded to 3 out of 9
      expect(result).toBe('▓▓▓░░░░░░');
    });

    it('should throw error for invalid width', () => {
      expect(() => renderProgressBar({ current: 5, total: 10, width: 0 })).toThrow();
    });
  });

  describe('renderCompletionAnimation', () => {
    it('should render checkmark completion', () => {
      const result = renderCompletionAnimation({ type: 'checkmark' });
      expect(result).toEqual(['✓ COMPLETE!']);
    });

    it('should render checkmark with custom message', () => {
      const result = renderCompletionAnimation({
        type: 'checkmark',
        message: 'Well done!'
      });
      expect(result).toEqual(['✓ COMPLETE!', 'Well done!']);
    });

    it('should render celebration completion', () => {
      const result = renderCompletionAnimation({ type: 'celebration' });
      expect(result).toEqual(['🎉 CONGRATULATIONS! 🎉', '✓ COMPLETE!']);
    });

    it('should render celebration with custom message', () => {
      const result = renderCompletionAnimation({
        type: 'celebration',
        message: 'Quiz Finished!'
      });
      expect(result).toEqual(['🎉 Quiz Finished! 🎉', '✓ COMPLETE!']);
    });

    it('should render custom completion', () => {
      const result = renderCompletionAnimation({
        type: 'custom',
        customSymbol: '★',
        message: 'Perfect Score!'
      });
      expect(result).toEqual(['★ Perfect Score! ★']);
    });

    it('should handle custom type without symbol', () => {
      const result = renderCompletionAnimation({
        type: 'custom',
        message: 'Done!'
      });
      expect(result).toEqual(['Done!']);
    });
  });

  describe('renderCombinedProgress', () => {
    it('should render combined progress with default bar width', () => {
      const result = renderCombinedProgress({ current: 2, total: 4 });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('Step 2 of 4');
      expect(result[1]).toBe('▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░');
    });

    it('should render combined progress with custom bar width', () => {
      const result = renderCombinedProgress({ current: 1, total: 2 }, 10);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('Step 1 of 2');
      expect(result[1]).toBe('▓▓▓▓▓░░░░░');
    });

    it('should use custom label in combined progress', () => {
      const result = renderCombinedProgress({ current: 3, total: 5, label: 'Phase' });
      expect(result[0]).toBe('Phase 3 of 5');
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateProgressPercentage(5, 10)).toBe(50);
      expect(calculateProgressPercentage(1, 4)).toBe(25);
      expect(calculateProgressPercentage(3, 4)).toBe(75);
    });

    it('should round to nearest integer', () => {
      expect(calculateProgressPercentage(1, 3)).toBe(33);
      expect(calculateProgressPercentage(2, 3)).toBe(67);
    });

    it('should handle 0% progress', () => {
      expect(calculateProgressPercentage(0, 10)).toBe(0);
    });

    it('should handle 100% progress', () => {
      expect(calculateProgressPercentage(10, 10)).toBe(100);
    });

    it('should handle zero total', () => {
      expect(calculateProgressPercentage(0, 0)).toBe(0);
    });
  });

  describe('centerProgressIndicator', () => {
    it('should center indicator in default width', () => {
      const result = centerProgressIndicator('Test');
      expect(result.length).toBe(40);
      expect(result.trim()).toBe('Test');
      expect(result.indexOf('Test')).toBe(18); // (40 - 4) / 2 = 18
    });

    it('should center indicator in custom width', () => {
      const result = centerProgressIndicator('Test', 20);
      expect(result.length).toBe(20);
      expect(result.indexOf('Test')).toBe(8); // (20 - 4) / 2 = 8
    });

    it('should truncate if indicator is too long', () => {
      const longText = 'This is a very long text that exceeds the width';
      const result = centerProgressIndicator(longText, 20);
      expect(result.length).toBe(20);
      expect(result).toBe(longText.substring(0, 20));
    });

    it('should handle exact width match', () => {
      const result = centerProgressIndicator('1234567890', 10);
      expect(result).toBe('1234567890');
    });
  });

  describe('createProgressDisplay', () => {
    it('should create full progress display', () => {
      const result = createProgressDisplay({ current: 3, total: 5 });
      expect(result).toHaveLength(3);
      expect(result[0].trim()).toBe('Step 3 of 5');
      expect(result[1]).toContain('▓');
      expect(result[2].trim()).toBe('60%');
    });

    it('should create progress display without bar', () => {
      const result = createProgressDisplay(
        { current: 2, total: 4 },
        { showBar: false }
      );
      expect(result).toHaveLength(2);
      expect(result[0].trim()).toBe('Step 2 of 4');
      expect(result[1].trim()).toBe('50%');
    });

    it('should create progress display without percentage', () => {
      const result = createProgressDisplay(
        { current: 2, total: 4 },
        { showPercentage: false }
      );
      expect(result).toHaveLength(2);
      expect(result[0].trim()).toBe('Step 2 of 4');
      expect(result[1]).toContain('▓');
    });

    it('should create progress display with custom bar width', () => {
      const result = createProgressDisplay(
        { current: 5, total: 10 },
        { barWidth: 30 }
      );
      expect(result[1].trim().length).toBe(30);
    });

    it('should create non-centered progress display', () => {
      const result = createProgressDisplay(
        { current: 1, total: 2 },
        { centered: false }
      );
      expect(result[0]).toBe('Step 1 of 2');
      expect(result[0].indexOf('Step')).toBe(0);
    });

    it('should use custom label', () => {
      const result = createProgressDisplay({ current: 2, total: 5, label: 'Question' });
      expect(result[0].trim()).toBe('Question 2 of 5');
    });
  });

  describe('createConfettiAnimation', () => {
    it('should create confetti animation lines', () => {
      const result = createConfettiAnimation();
      expect(result).toHaveLength(3);
      expect(result[0]).toContain('*');
      expect(result[0]).toContain('·');
      expect(result[1]).toContain('*');
      expect(result[2]).toContain('*');
    });
  });

  describe('validateProgressValues', () => {
    it('should not throw for valid values', () => {
      expect(() => validateProgressValues(5, 10)).not.toThrow();
      expect(() => validateProgressValues(0, 1)).not.toThrow();
      expect(() => validateProgressValues(10, 10)).not.toThrow();
    });

    it('should throw for non-integer values', () => {
      expect(() => validateProgressValues(1.5, 10)).toThrow('must be integers');
      expect(() => validateProgressValues(5, 10.5)).toThrow('must be integers');
    });

    it('should throw for negative current', () => {
      expect(() => validateProgressValues(-1, 10)).toThrow('cannot be negative');
    });

    it('should throw for zero or negative total', () => {
      expect(() => validateProgressValues(1, 0)).toThrow('must be at least 1');
      expect(() => validateProgressValues(1, -5)).toThrow('must be at least 1');
    });

    it('should throw when current exceeds total', () => {
      expect(() => validateProgressValues(11, 10)).toThrow('cannot exceed total');
    });
  });

  describe('Integration scenarios', () => {
    it('should create quiz progress display', () => {
      const config: ProgressConfig = {
        current: 3,
        total: 10,
        label: 'Question'
      };
      
      const display = createProgressDisplay(config, {
        showBar: true,
        showPercentage: true,
        barWidth: 20
      });
      
      expect(display[0].trim()).toBe('Question 3 of 10');
      expect(display[1].trim().length).toBe(20);
      expect(display[2].trim()).toBe('30%');
    });

    it('should create AI flow progress display', () => {
      const stepCounter = renderStepCounter({ current: 2, total: 4, label: 'Step' });
      const progressBar = renderProgressBar({ current: 2, total: 4, width: 20 });
      
      expect(stepCounter).toBe('Step 2 of 4');
      expect(progressBar).toBe('▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░');
    });

    it('should create completion display for quiz', () => {
      const completion = renderCompletionAnimation({
        type: 'celebration',
        message: 'Quiz Complete!'
      });
      const confetti = createConfettiAnimation();
      
      expect(completion).toContain('🎉 Quiz Complete! 🎉');
      expect(confetti.length).toBe(3);
    });
  });
});
