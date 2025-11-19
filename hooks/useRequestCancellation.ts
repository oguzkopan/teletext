'use client';

import { useRef, useCallback } from 'react';

/**
 * Hook for managing request cancellation during rapid navigation
 * 
 * Requirement: 15.5 - Cancel pending requests and prioritize most recent request
 */
export function useRequestCancellation() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestRef = useRef<string | null>(null);

  /**
   * Creates a new AbortController and cancels any pending request
   */
  const createCancellableRequest = useCallback((pageId: string): AbortController => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      console.log(`Cancelling pending request for page ${pendingRequestRef.current}`);
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    pendingRequestRef.current = pageId;

    return controller;
  }, []);

  /**
   * Clears the current request reference
   */
  const clearRequest = useCallback(() => {
    abortControllerRef.current = null;
    pendingRequestRef.current = null;
  }, []);

  /**
   * Checks if a request is still active (not cancelled)
   */
  const isRequestActive = useCallback((pageId: string): boolean => {
    return pendingRequestRef.current === pageId;
  }, []);

  return {
    createCancellableRequest,
    clearRequest,
    isRequestActive,
  };
}
