/**
 * Tests for useThemeTransition hook
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useThemeTransition } from '../useThemeTransition';

describe('useThemeTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useThemeTransition());

    expect(result.current.state.isTransitioning).toBe(false);
    expect(result.current.state.currentPhase).toBe('idle');
    expect(result.current.state.bannerVisible).toBe(false);
  });

  it('should execute transition with default duration (500ms)', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);
    const onTransitionStart = jest.fn();
    const onTransitionComplete = jest.fn();

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback,
        { onTransitionStart, onTransitionComplete }
      );
    });

    // Should start transition
    expect(result.current.state.isTransitioning).toBe(true);
    expect(result.current.state.currentPhase).toBe('fade-out');
    expect(onTransitionStart).toHaveBeenCalled();

    // Advance through fade-out phase (250ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('switching');
    });

    // Theme change callback should be called
    expect(themeChangeCallback).toHaveBeenCalled();

    // Advance through fade-in phase (250ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('banner');
      expect(result.current.state.bannerVisible).toBe(true);
      expect(result.current.state.bannerText).toBe('ORF MODE ACTIVATED');
    });

    // Advance through banner display (2000ms)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.state.bannerVisible).toBe(false);
    });

    // Advance through banner fade (500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.state.isTransitioning).toBe(false);
      expect(result.current.state.currentPhase).toBe('idle');
      expect(onTransitionComplete).toHaveBeenCalled();
    });
  });

  it('should use longer duration for haunting theme (1000ms)', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'haunting',
        'Haunting Mode',
        themeChangeCallback
      );
    });

    expect(result.current.state.isTransitioning).toBe(true);

    // Advance through fade-out phase (500ms for haunting)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('switching');
    });

    // Advance through fade-in phase (500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('banner');
      expect(result.current.state.bannerText).toBe('🎃 HAUNTING MODE ACTIVATED 🎃');
    });
  });

  it('should display special banner for haunting theme', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'haunting',
        'Haunting Mode',
        themeChangeCallback
      );
    });

    // Fast-forward to banner phase
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.state.bannerVisible).toBe(true);
      expect(result.current.state.bannerText).toContain('HAUNTING MODE ACTIVATED');
      expect(result.current.state.bannerText).toContain('🎃');
    });
  });

  it('should skip banner when showBanner is false', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);
    const onTransitionComplete = jest.fn();

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback,
        { showBanner: false, onTransitionComplete }
      );
    });

    // Fast-forward through transition
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.state.bannerVisible).toBe(false);
      expect(result.current.state.isTransitioning).toBe(false);
      expect(onTransitionComplete).toHaveBeenCalled();
    });
  });

  it('should return correct transition class for fade-out phase', () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback
      );
    });

    expect(result.current.getTransitionClass()).toBe('theme-transition-fade-out');
  });

  it('should return haunting transition class for haunting theme', () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'haunting',
        'Haunting Mode',
        themeChangeCallback
      );
    });

    expect(result.current.getTransitionClass()).toBe('haunting-theme-transition');
  });

  it('should return fade-in class during fade-in phase', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback
      );
    });

    // Advance to fade-in phase
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('switching');
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('fade-in');
      expect(result.current.getTransitionClass()).toBe('theme-transition-fade-in');
    });
  });

  it('should cancel transition when cancelTransition is called', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback
      );
    });

    expect(result.current.state.isTransitioning).toBe(true);

    act(() => {
      result.current.cancelTransition();
    });

    expect(result.current.state.isTransitioning).toBe(false);
    expect(result.current.state.currentPhase).toBe('idle');
    expect(result.current.state.bannerVisible).toBe(false);
  });

  it('should handle custom duration option', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback = jest.fn().mockResolvedValue(undefined);
    const customDuration = 800;

    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback,
        { duration: customDuration }
      );
    });

    // Advance through fade-out phase (half of custom duration)
    act(() => {
      jest.advanceTimersByTime(customDuration / 2);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('switching');
    });

    // Advance through fade-in phase (other half)
    act(() => {
      jest.advanceTimersByTime(customDuration / 2);
    });

    await waitFor(() => {
      expect(result.current.state.currentPhase).toBe('banner');
    });
  });

  it('should clear previous timeouts when starting new transition', async () => {
    const { result } = renderHook(() => useThemeTransition());
    const themeChangeCallback1 = jest.fn().mockResolvedValue(undefined);
    const themeChangeCallback2 = jest.fn().mockResolvedValue(undefined);

    // Start first transition
    act(() => {
      result.current.executeTransition(
        'ceefax',
        'orf',
        'ORF',
        themeChangeCallback1
      );
    });

    expect(result.current.state.isTransitioning).toBe(true);

    // Start second transition before first completes
    act(() => {
      result.current.executeTransition(
        'orf',
        'haunting',
        'Haunting Mode',
        themeChangeCallback2
      );
    });

    // Should still be transitioning with new theme
    expect(result.current.state.isTransitioning).toBe(true);
    expect(result.current.state.bannerTheme).toBe('haunting');
  });
});
