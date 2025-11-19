'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for debouncing keyboard input
 * 
 * Requirement: Performance optimization - Add debouncing for keyboard input (100ms)
 */
export function useDebouncedInput(delay: number = 100) {
  const [inputBuffer, setInputBuffer] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Updates the input buffer with debouncing
   */
  const updateInput = useCallback((value: string) => {
    setInputBuffer(value);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [delay]);

  /**
   * Clears the input buffer immediately
   */
  const clearInput = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setInputBuffer('');
    setDebouncedValue('');
  }, []);

  /**
   * Forces immediate update without debouncing
   */
  const forceUpdate = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDebouncedValue(inputBuffer);
  }, [inputBuffer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    inputBuffer,
    debouncedValue,
    updateInput,
    clearInput,
    forceUpdate,
  };
}
