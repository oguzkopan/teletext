import { renderHook, act, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme, themes } from '../theme-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase
jest.mock('../firebase-client', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn()
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default theme (ceefax)', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await waitFor(() => {
      expect(result.current.currentThemeKey).toBe('ceefax');
      expect(result.current.currentTheme.name).toBe('Ceefax');
    });
  });

  it('should load saved theme preference from Firestore', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ theme: 'haunting' })
    });

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await waitFor(() => {
      expect(result.current.currentThemeKey).toBe('haunting');
      expect(result.current.currentTheme.name).toBe('Haunting Mode');
    });
  });

  it('should change theme and save to Firestore', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await act(async () => {
      await result.current.setTheme('orf');
    });

    expect(result.current.currentThemeKey).toBe('orf');
    expect(result.current.currentTheme.name).toBe('ORF');
    expect(setDoc).toHaveBeenCalled();
  });

  it('should show confirmation message when theme is changed', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await act(async () => {
      await result.current.setTheme('highcontrast');
    });

    expect(result.current.confirmationMessage).toBe('Theme applied: High Contrast');

    // Wait for confirmation message to clear
    await waitFor(() => {
      expect(result.current.confirmationMessage).toBeNull();
    }, { timeout: 4000 });
  });

  it('should handle invalid theme key gracefully', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      await result.current.setTheme('invalid_theme');
    });

    // Theme should remain unchanged
    expect(result.current.currentThemeKey).toBe('ceefax');
    expect(consoleSpy).toHaveBeenCalledWith('Invalid theme key: invalid_theme');

    consoleSpy.mockRestore();
  });

  it('should continue with default theme if Firestore load fails', async () => {
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await waitFor(() => {
      expect(result.current.currentThemeKey).toBe('ceefax');
      expect(consoleSpy).toHaveBeenCalledWith('Error loading theme preference:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should apply theme locally even if Firestore save fails', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false
    });
    (setDoc as jest.Mock).mockRejectedValue(new Error('Firestore save error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    await act(async () => {
      await result.current.setTheme('haunting');
    });

    // Theme should still be applied locally
    expect(result.current.currentThemeKey).toBe('haunting');
    expect(result.current.currentTheme.name).toBe('Haunting Mode');
    expect(consoleSpy).toHaveBeenCalledWith('Error saving theme preference:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should have all four themes defined', () => {
    expect(themes).toHaveProperty('ceefax');
    expect(themes).toHaveProperty('orf');
    expect(themes).toHaveProperty('highcontrast');
    expect(themes).toHaveProperty('haunting');
    
    expect(themes.ceefax.name).toBe('Ceefax');
    expect(themes.orf.name).toBe('ORF');
    expect(themes.highcontrast.name).toBe('High Contrast');
    expect(themes.haunting.name).toBe('Haunting Mode');
  });
});
