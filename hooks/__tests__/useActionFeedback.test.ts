/**
 * Tests for useActionFeedback Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useActionFeedback, useActionFeedbackWithOptions } from '../useActionFeedback';

// Mock timers
jest.useFakeTimers();

describe('useActionFeedback', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('showSuccess', () => {
    it('should show success message', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Operation successful');
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback).not.toBeNull();
      expect(result.current.feedback?.lines).toEqual(['✓ Operation successful']);
      expect(result.current.feedback?.color).toBe('green');
      expect(result.current.feedback?.animation).toBe('checkmark');
    });

    it('should hide success message after duration', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Success', 1000);
      });
      
      expect(result.current.isVisible).toBe(true);
      
      // Fast-forward past duration
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(result.current.isAnimatingOut).toBe(true);
      
      // Fast-forward past animation
      act(() => {
        jest.advanceTimersByTime(200);
      });
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.feedback).toBeNull();
    });

    it('should use custom duration', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Success', 3000);
      });
      
      expect(result.current.feedback?.duration).toBe(3000);
    });
  });

  describe('showError', () => {
    it('should show error message', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showError('Operation failed');
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback?.lines).toEqual(['✗ Operation failed']);
      expect(result.current.feedback?.color).toBe('red');
      expect(result.current.feedback?.animation).toBe('cross');
    });

    it('should hide error message after duration', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showError('Error', 1500);
      });
      
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      
      expect(result.current.isAnimatingOut).toBe(true);
      
      act(() => {
        jest.advanceTimersByTime(200);
      });
      
      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('showSaved', () => {
    it('should show basic saved message', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSaved();
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback?.lines).toEqual(['✓ SAVED']);
      expect(result.current.feedback?.animation).toBe('flash');
    });

    it('should show saved message with item name', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSaved('Settings');
      });
      
      expect(result.current.feedback?.lines).toEqual(['✓ Settings SAVED']);
    });

    it('should use default duration of 2000ms', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSaved();
      });
      
      expect(result.current.feedback?.duration).toBe(2000);
    });
  });

  describe('showCelebration', () => {
    it('should show celebration message with confetti', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showCelebration('Quiz Complete!');
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback?.lines).toHaveLength(6);
      expect(result.current.feedback?.lines[4]).toBe('🎉 Quiz Complete! 🎉');
      expect(result.current.feedback?.animation).toBe('celebration');
    });

    it('should use default duration of 3000ms', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showCelebration('Success!');
      });
      
      expect(result.current.feedback?.duration).toBe(3000);
    });
  });

  describe('showFeedback', () => {
    it('should show custom feedback', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showFeedback({
          type: 'warning',
          message: 'Check input',
          duration: 2000
        });
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback?.lines).toEqual(['⚠ Check input']);
      expect(result.current.feedback?.color).toBe('yellow');
    });
  });

  describe('hideFeedback', () => {
    it('should hide feedback immediately', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Success');
      });
      
      expect(result.current.isVisible).toBe(true);
      
      act(() => {
        result.current.hideFeedback();
      });
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.feedback).toBeNull();
    });

    it('should cancel scheduled hide', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Success', 1000);
      });
      
      act(() => {
        result.current.hideFeedback();
      });
      
      // Advance timers - should not show animating out
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('multiple messages', () => {
    it('should replace previous message with new one', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('First message');
      });
      
      expect(result.current.feedback?.lines).toEqual(['✓ First message']);
      
      act(() => {
        result.current.showError('Second message');
      });
      
      expect(result.current.feedback?.lines).toEqual(['✗ Second message']);
      expect(result.current.feedback?.color).toBe('red');
    });

    it('should cancel previous timeout when showing new message', () => {
      const { result } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('First', 1000);
      });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      act(() => {
        result.current.showError('Second', 1000);
      });
      
      // First message timeout should be cancelled
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(result.current.feedback?.lines).toEqual(['✗ Second']);
    });
  });

  describe('cleanup', () => {
    it('should clear timeouts on unmount', () => {
      const { result, unmount } = renderHook(() => useActionFeedback());
      
      act(() => {
        result.current.showSuccess('Success', 5000);
      });
      
      unmount();
      
      // Should not throw or cause issues
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });
  });
});

describe('useActionFeedbackWithOptions', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should use default duration from options', () => {
    const { result } = renderHook(() =>
      useActionFeedbackWithOptions({ defaultDuration: 5000 })
    );
    
    act(() => {
      result.current.showSuccess('Success');
    });
    
    expect(result.current.feedback?.duration).toBe(5000);
  });

  it('should call onShow callback', () => {
    const onShow = jest.fn();
    const { result } = renderHook(() =>
      useActionFeedbackWithOptions({ onShow })
    );
    
    act(() => {
      result.current.showSuccess('Success');
    });
    
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onShow).toHaveBeenCalledWith(
      expect.objectContaining({
        lines: ['✓ Success'],
        color: 'green'
      })
    );
  });

  it('should call onHide callback', () => {
    const onHide = jest.fn();
    const { result } = renderHook(() =>
      useActionFeedbackWithOptions({ onHide })
    );
    
    act(() => {
      result.current.showSuccess('Success', 1000);
    });
    
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should call onHide when manually hidden', () => {
    const onHide = jest.fn();
    const { result } = renderHook(() =>
      useActionFeedbackWithOptions({ onHide })
    );
    
    act(() => {
      result.current.showSuccess('Success');
    });
    
    act(() => {
      result.current.hideFeedback();
    });
    
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should override default duration with explicit duration', () => {
    const { result } = renderHook(() =>
      useActionFeedbackWithOptions({ defaultDuration: 5000 })
    );
    
    act(() => {
      result.current.showSuccess('Success', 1000);
    });
    
    expect(result.current.feedback?.duration).toBe(1000);
  });
});
