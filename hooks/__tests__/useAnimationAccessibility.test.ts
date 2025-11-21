/**
 * Tests for useAnimationAccessibility Hook
 * 
 * Requirements: 10.5, 12.5
 */

import { renderHook, act } from '@testing-library/react';
import {
  useAnimationAccessibility,
  useAnimationType,
  useAnimationDuration
} from '../useAnimationAccessibility';
import { 
  resetAnimationAccessibility,
  getAnimationAccessibility
} from '@/lib/animation-accessibility';

describe('useAnimationAccessibility', () => {
  beforeEach(() => {
    resetAnimationAccessibility();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    resetAnimationAccessibility();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    expect(result.current.shouldAnimate).toBe(true);
    expect(result.current.settings.enabled).toBe(true);
    expect(result.current.settings.intensity).toBe(100);
  });

  it('should enable animations', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.disableAnimations();
    });
    expect(result.current.shouldAnimate).toBe(false);

    act(() => {
      result.current.enableAnimations();
    });
    expect(result.current.shouldAnimate).toBe(true);
  });

  it('should disable animations', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.disableAnimations();
    });

    expect(result.current.shouldAnimate).toBe(false);
    expect(result.current.settings.enabled).toBe(false);
  });

  it('should set intensity', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.setIntensity(50);
    });

    expect(result.current.settings.intensity).toBe(50);
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.updateSettings({
        transitionsEnabled: false,
        decorationsEnabled: false
      });
    });

    expect(result.current.settings.transitionsEnabled).toBe(false);
    expect(result.current.settings.decorationsEnabled).toBe(false);
  });

  it('should reset to defaults', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.updateSettings({
        enabled: false,
        intensity: 25
      });
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(result.current.settings.enabled).toBe(true);
    expect(result.current.settings.intensity).toBe(100);
  });

  it('should check animation types', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    act(() => {
      result.current.updateSettings({
        transitionsEnabled: false
      });
    });

    expect(result.current.shouldAnimateType('transition')).toBe(false);
    expect(result.current.shouldAnimateType('decoration')).toBe(true);
  });

  it('should adjust duration', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    expect(result.current.getAdjustedDuration(1000)).toBe(1000);

    act(() => {
      result.current.setIntensity(50);
    });

    expect(result.current.getAdjustedDuration(1000)).toBe(500);
  });

  it('should update when settings change', () => {
    const { result } = renderHook(() => useAnimationAccessibility());

    const initialShouldAnimate = result.current.shouldAnimate;
    expect(initialShouldAnimate).toBe(true);

    act(() => {
      result.current.disableAnimations();
    });

    expect(result.current.shouldAnimate).toBe(false);
    expect(result.current.shouldAnimate).not.toBe(initialShouldAnimate);
  });
});

describe('useAnimationType', () => {
  beforeEach(() => {
    resetAnimationAccessibility();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    resetAnimationAccessibility();
  });

  it('should return true for enabled type', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    
    const { result } = renderHook(() => useAnimationType('transition'));
    expect(result.current).toBe(true);
  });

  it('should return false for disabled type', () => {
    const { result: accessibilityResult } = renderHook(() => useAnimationAccessibility());
    
    act(() => {
      accessibilityResult.current.updateSettings({
        transitionsEnabled: false
      });
    });

    const { result } = renderHook(() => useAnimationType('transition'));
    expect(result.current).toBe(false);
  });

  it('should update when settings change', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    
    const { result: accessibilityResult } = renderHook(() => useAnimationAccessibility());
    const { result, rerender } = renderHook(() => useAnimationType('decoration'));

    expect(result.current).toBe(true);

    act(() => {
      accessibilityResult.current.updateSettings({
        decorationsEnabled: false
      });
    });

    rerender();
    expect(result.current).toBe(false);
  });
});

describe('useAnimationDuration', () => {
  beforeEach(() => {
    resetAnimationAccessibility();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    resetAnimationAccessibility();
  });

  it('should return base duration at 100% intensity', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    manager.setIntensity(100);
    
    const { result } = renderHook(() => useAnimationDuration(1000));
    expect(result.current).toBe(1000);
  });

  it('should return adjusted duration at 50% intensity', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    
    const { result: accessibilityResult } = renderHook(() => useAnimationAccessibility());
    
    act(() => {
      accessibilityResult.current.setIntensity(50);
    });

    const { result } = renderHook(() => useAnimationDuration(1000));
    expect(result.current).toBe(500);
  });

  it('should return 0 duration at 0% intensity', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    
    const { result: accessibilityResult } = renderHook(() => useAnimationAccessibility());
    
    act(() => {
      accessibilityResult.current.setIntensity(0);
    });

    const { result } = renderHook(() => useAnimationDuration(1000));
    expect(result.current).toBe(0);
  });

  it('should update when intensity changes', () => {
    // Reset and ensure clean state
    resetAnimationAccessibility();
    const manager = getAnimationAccessibility();
    manager.enableAnimations();
    manager.setIntensity(100);
    
    const { result: accessibilityResult } = renderHook(() => useAnimationAccessibility());
    const { result, rerender } = renderHook(() => useAnimationDuration(1000));

    expect(result.current).toBe(1000);

    act(() => {
      accessibilityResult.current.setIntensity(25);
    });

    rerender();
    expect(result.current).toBe(250);
  });
});
