/**
 * Tests for useLoadingTextRotation Hook
 * 
 * Requirements: 14.5
 */

import { renderHook, act } from '@testing-library/react';
import { useLoadingTextRotation } from '../useLoadingTextRotation';

describe('useLoadingTextRotation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should initialize with first message', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(result.current.currentMessage).toBe('LOADING...');
      expect(result.current.isActive).toBe(true);
    });

    it('should rotate messages every 2 seconds', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(result.current.currentMessage).toBe('LOADING...');

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.currentMessage).toBe('FETCHING DATA...');

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.currentMessage).toBe('ALMOST THERE...');
    });

    it('should not rotate when disabled', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: false })
      );

      const initialMessage = result.current.currentMessage;

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.currentMessage).toBe(initialMessage);
      expect(result.current.isActive).toBe(false);
    });

    it('should start rotation when enabled changes to true', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useLoadingTextRotation({ theme: 'ceefax', enabled }),
        { initialProps: { enabled: false } }
      );

      expect(result.current.isActive).toBe(false);

      rerender({ enabled: true });

      expect(result.current.isActive).toBe(true);
      expect(result.current.currentMessage).toBe('LOADING...');
    });

    it('should stop rotation when enabled changes to false', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useLoadingTextRotation({ theme: 'ceefax', enabled }),
        { initialProps: { enabled: true } }
      );

      expect(result.current.isActive).toBe(true);

      rerender({ enabled: false });

      expect(result.current.isActive).toBe(false);
    });
  });

  describe('Theme Support', () => {
    it('should use theme-specific messages', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'haunting', enabled: true })
      );

      expect(result.current.currentMessage).toBe('SUMMONING...');
      expect(result.current.messages).toContain('AWAKENING SPIRITS...');
    });

    it('should update messages when theme changes', () => {
      const { result, rerender } = renderHook(
        ({ theme }) => useLoadingTextRotation({ theme, enabled: true }),
        { initialProps: { theme: 'ceefax' } }
      );

      expect(result.current.currentMessage).toBe('LOADING...');

      rerender({ theme: 'haunting' });

      expect(result.current.currentMessage).toBe('SUMMONING...');
    });

    it('should support all theme types', () => {
      const themes = ['ceefax', 'haunting', 'high-contrast', 'orf'];

      themes.forEach(theme => {
        const { result } = renderHook(() => 
          useLoadingTextRotation({ theme, enabled: true })
        );

        expect(result.current.currentMessage).toBeTruthy();
        expect(result.current.messages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Custom Rotation Interval', () => {
    it('should use custom rotation interval', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ 
          theme: 'ceefax', 
          rotationInterval: 1000,
          enabled: true 
        })
      );

      expect(result.current.currentMessage).toBe('LOADING...');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.currentMessage).toBe('FETCHING DATA...');
    });

    it('should update interval when prop changes', () => {
      const { result, rerender } = renderHook(
        ({ interval }) => useLoadingTextRotation({ 
          theme: 'ceefax', 
          rotationInterval: interval,
          enabled: true 
        }),
        { initialProps: { interval: 2000 } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.currentMessage).toBe('LOADING...');

      rerender({ interval: 500 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.currentMessage).not.toBe('LOADING...');
    });
  });

  describe('State Tracking', () => {
    it('should track elapsed time', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(result.current.elapsedTime).toBe(0);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.elapsedTime).toBeGreaterThanOrEqual(1000);
    });

    it('should detect when rotation has occurred', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ 
          theme: 'ceefax', 
          rotationInterval: 2000,
          enabled: true 
        })
      );

      expect(result.current.hasRotated).toBe(false);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.hasRotated).toBe(true);
    });

    it('should reset elapsed time when disabled and re-enabled', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useLoadingTextRotation({ theme: 'ceefax', enabled }),
        { initialProps: { enabled: true } }
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBeGreaterThanOrEqual(3000);

      rerender({ enabled: false });
      rerender({ enabled: true });

      expect(result.current.elapsedTime).toBeLessThan(1000);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      unmount();

      // Should not throw errors
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });

    it('should cleanup when switching between enabled states', () => {
      const { rerender } = renderHook(
        ({ enabled }) => useLoadingTextRotation({ theme: 'ceefax', enabled }),
        { initialProps: { enabled: true } }
      );

      rerender({ enabled: false });
      rerender({ enabled: true });
      rerender({ enabled: false });

      // Should not throw errors or have memory leaks
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });
  });

  describe('Return Values', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(result.current).toHaveProperty('currentMessage');
      expect(result.current).toHaveProperty('messages');
      expect(result.current).toHaveProperty('elapsedTime');
      expect(result.current).toHaveProperty('hasRotated');
      expect(result.current).toHaveProperty('isActive');
    });

    it('should return array of messages', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(Array.isArray(result.current.messages)).toBe(true);
      expect(result.current.messages.length).toBeGreaterThan(0);
    });
  });

  describe('Default Values', () => {
    it('should use default theme when not specified', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ enabled: true })
      );

      expect(result.current.currentMessage).toBe('LOADING...');
    });

    it('should use default rotation interval when not specified', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax', enabled: true })
      );

      expect(result.current.currentMessage).toBe('LOADING...');

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.currentMessage).toBe('FETCHING DATA...');
    });

    it('should be enabled by default', () => {
      const { result } = renderHook(() => 
        useLoadingTextRotation({ theme: 'ceefax' })
      );

      expect(result.current.isActive).toBe(true);
    });
  });
});
