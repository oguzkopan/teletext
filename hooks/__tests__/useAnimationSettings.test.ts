/**
 * Tests for useAnimationSettings hook
 * Requirements: 12.5 - Animation intensity controls
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAnimationSettings } from '../useAnimationSettings';
import { getAnimationAccessibility } from '@/lib/animation-accessibility';

// Mock Firebase
jest.mock('@/lib/firebase-client', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn()
}));

// Mock animation accessibility
jest.mock('@/lib/animation-accessibility');

describe('useAnimationSettings', () => {
  const mockUpdateSettings = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock animation accessibility
    (getAnimationAccessibility as jest.Mock).mockReturnValue({
      updateSettings: mockUpdateSettings
    });
  });

  it('should initialize with default settings', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings).toEqual({
      animationsEnabled: true,
      animationIntensity: 100,
      transitionsEnabled: true,
      decorationsEnabled: true,
      backgroundEffectsEnabled: true
    });
  });

  it('should adjust intensity up', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.adjustIntensity(10);
    });

    // Intensity should be capped at 100
    expect(result.current.settings.animationIntensity).toBe(100);
  });

  it('should adjust intensity down', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.adjustIntensity(-20);
    });

    expect(result.current.settings.animationIntensity).toBe(80);
  });

  it('should not allow intensity below 0', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.adjustIntensity(-150);
    });

    expect(result.current.settings.animationIntensity).toBe(0);
  });

  it('should toggle animations on/off', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings.animationsEnabled).toBe(true);

    await act(async () => {
      await result.current.toggleAnimations();
    });

    expect(result.current.settings.animationsEnabled).toBe(false);

    await act(async () => {
      await result.current.toggleAnimations();
    });

    expect(result.current.settings.animationsEnabled).toBe(true);
  });

  it('should toggle transitions', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings.transitionsEnabled).toBe(true);

    await act(async () => {
      await result.current.toggleTransitions();
    });

    expect(result.current.settings.transitionsEnabled).toBe(false);
  });

  it('should toggle decorations', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings.decorationsEnabled).toBe(true);

    await act(async () => {
      await result.current.toggleDecorations();
    });

    expect(result.current.settings.decorationsEnabled).toBe(false);
  });

  it('should toggle backgrounds', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings.backgroundEffectsEnabled).toBe(true);

    await act(async () => {
      await result.current.toggleBackgrounds();
    });

    expect(result.current.settings.backgroundEffectsEnabled).toBe(false);
  });

  it('should reset to defaults', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change some settings
    await act(async () => {
      await result.current.adjustIntensity(-50);
    });

    await waitFor(() => {
      expect(result.current.settings.animationIntensity).toBe(50);
    });

    await act(async () => {
      await result.current.toggleAnimations();
    });

    await waitFor(() => {
      expect(result.current.settings.animationsEnabled).toBe(false);
    });

    await act(async () => {
      await result.current.toggleTransitions();
    });

    await waitFor(() => {
      expect(result.current.settings.transitionsEnabled).toBe(false);
    });

    // Reset to defaults
    await act(async () => {
      await result.current.resetToDefaults();
    });

    await waitFor(() => {
      expect(result.current.settings).toEqual({
        animationsEnabled: true,
        animationIntensity: 100,
        transitionsEnabled: true,
        decorationsEnabled: true,
        backgroundEffectsEnabled: true
      });
    });
  });

  it('should apply settings to animation accessibility system', async () => {
    const { result } = renderHook(() => useAnimationSettings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.adjustIntensity(-30);
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        intensity: 70,
        transitionsEnabled: true,
        decorationsEnabled: true,
        backgroundEffectsEnabled: true,
        respectSystemPreference: true
      })
    );
  });
});
