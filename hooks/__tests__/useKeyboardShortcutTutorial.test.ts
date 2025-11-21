/**
 * Tests for keyboard shortcut tutorial hook
 * Requirements: 30.4
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useKeyboardShortcutTutorial,
  createTutorial,
  SHORTCUT_TUTORIALS
} from '../useKeyboardShortcutTutorial';

describe('useKeyboardShortcutTutorial', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should start with no current frame when tutorial is null', () => {
    const { result } = renderHook(() => useKeyboardShortcutTutorial(null));
    
    expect(result.current.currentFrame).toBeNull();
    expect(result.current.frameIndex).toBe(0);
    expect(result.current.totalFrames).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });

  it('should start playing when tutorial is provided', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result } = renderHook(() => useKeyboardShortcutTutorial(tutorial));
    
    expect(result.current.currentFrame).not.toBeNull();
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.totalFrames).toBe(3);
  });

  it('should advance through frames automatically', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result } = renderHook(() => useKeyboardShortcutTutorial(tutorial));
    
    expect(result.current.frameIndex).toBe(0);
    
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.frameIndex).toBe(1);
    
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.frameIndex).toBe(2);
  });

  it('should stop playing after last frame', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result } = renderHook(() => useKeyboardShortcutTutorial(tutorial));
    
    expect(result.current.isPlaying).toBe(true);
    
    // Advance through all frames
    act(() => {
      jest.advanceTimersByTime(1500 * 3);
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.frameIndex).toBe(2); // Stay on last frame
  });

  it('should restart tutorial', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result } = renderHook(() => useKeyboardShortcutTutorial(tutorial));
    
    // Advance to second frame
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.frameIndex).toBe(1);
    
    // Restart
    act(() => {
      result.current.restart();
    });
    
    expect(result.current.frameIndex).toBe(0);
    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop tutorial', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result } = renderHook(() => useKeyboardShortcutTutorial(tutorial));
    
    expect(result.current.isPlaying).toBe(true);
    
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isPlaying).toBe(false);
  });

  it('should reset when tutorial changes', () => {
    const tutorial1 = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    const { result, rerender } = renderHook(
      ({ tutorial }) => useKeyboardShortcutTutorial(tutorial),
      { initialProps: { tutorial: tutorial1 } }
    );
    
    // Advance to second frame
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.frameIndex).toBe(1);
    
    // Change tutorial
    const tutorial2 = createTutorial('G', 'Green Button', 'Quick link', '[🟢 G]');
    rerender({ tutorial: tutorial2 });
    
    expect(result.current.frameIndex).toBe(0);
    expect(result.current.isPlaying).toBe(true);
  });
});

describe('createTutorial', () => {
  it('should create a tutorial with 3 frames', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    
    expect(tutorial.frames.length).toBe(3);
    expect(tutorial.shortcut).toBe('R');
    expect(tutorial.duration).toBe(1500);
  });

  it('should include shortcut information in frames', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    
    tutorial.frames.forEach(frame => {
      expect(frame.title).toContain('Red Button');
      const contentStr = frame.content.join(' ');
      expect(contentStr).toContain('Quick link');
    });
  });

  it('should highlight key in middle frame', () => {
    const tutorial = createTutorial('R', 'Red Button', 'Quick link', '[🔴 R]');
    
    expect(tutorial.frames[0].highlightedKey).toBeUndefined();
    expect(tutorial.frames[1].highlightedKey).toBe('R');
    expect(tutorial.frames[2].highlightedKey).toBeUndefined();
  });
});

describe('SHORTCUT_TUTORIALS', () => {
  it('should contain predefined tutorials', () => {
    expect(Object.keys(SHORTCUT_TUTORIALS).length).toBeGreaterThan(0);
  });

  it('should have tutorials for colored buttons', () => {
    expect(SHORTCUT_TUTORIALS['red-button']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['green-button']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['yellow-button']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['blue-button']).toBeDefined();
  });

  it('should have tutorials for common keys', () => {
    expect(SHORTCUT_TUTORIALS['enter']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['backspace']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['arrow-up']).toBeDefined();
    expect(SHORTCUT_TUTORIALS['arrow-down']).toBeDefined();
  });

  it('should have valid tutorial structure', () => {
    Object.values(SHORTCUT_TUTORIALS).forEach(tutorial => {
      expect(tutorial.shortcut).toBeDefined();
      expect(tutorial.frames).toBeDefined();
      expect(tutorial.frames.length).toBe(3);
      expect(tutorial.duration).toBe(1500);
    });
  });
});
