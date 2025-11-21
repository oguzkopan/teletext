'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TeletextPage, createOfflinePage } from '@/types/teletext';
import { useRequestCancellation } from '@/hooks/useRequestCancellation';
import { performanceMonitor } from '@/lib/performance-monitor';

interface PageRouterProps {
  initialPage?: TeletextPage;
  onPageChange?: (page: TeletextPage) => void;
  children: (props: PageRouterState) => React.ReactNode;
}

export interface PageRouterState {
  currentPage: TeletextPage | null;
  loading: boolean;
  inputBuffer: string;
  navigateToPage: (pageId: string) => Promise<void>;
  handleDigitPress: (digit: number) => void;
  handleEnter: () => void;
  handleNavigate: (direction: 'back' | 'forward' | 'up' | 'down') => void;
  handleColorButton: (color: 'red' | 'green' | 'yellow' | 'blue') => void;
  handleFavoriteKey: (index: number) => void;
  favoritePages: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  isOnline: boolean;
  isCached: boolean;
}

/**
 * PageRouter Component
 * 
 * Manages navigation state, history stack, and page transitions.
 * Implements page number validation and input buffering.
 * Includes performance optimizations: preloading, request cancellation, and debouncing.
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 3.4, 12.3, 12.5, 15.4, 15.5
 */
export default function PageRouter({ 
  initialPage, 
  onPageChange,
  children 
}: PageRouterProps) {
  const [currentPage, setCurrentPage] = useState<TeletextPage | null>(initialPage || null);
  const [loading, setLoading] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [history, setHistory] = useState<string[]>(initialPage ? [initialPage.id] : []);
  const [historyIndex, setHistoryIndex] = useState(initialPage ? 0 : -1);
  const [isCached, setIsCached] = useState(false);
  const [isOnline] = useState(true); // Always online now that caching is removed
  
  // Requirement: 15.5 - Request cancellation
  const { createCancellableRequest, clearRequest, isRequestActive } = useRequestCancellation();
  
  // Favorite pages state - default favorites
  // Requirement: 23.4 - Support up to 10 favorite pages
  const [favoritePages, setFavoritePages] = useState<string[]>([
    '100', // Index
    '200', // News
    '300', // Sport
    '400', // Markets
    '500', // AI Oracle
    '',    // Not set
    '',    // Not set
    '',    // Not set
    '',    // Not set
    ''     // Not set
  ]);

  /**
   * Validates page number is in valid range (100-899)
   * Supports standard pages (e.g., "202"), sub-pages (e.g., "202-1"), and multi-page articles (e.g., "202-1-2")
   * Requirement: 1.2, 35.1, 35.2, 35.3
   */
  const isValidPageNumber = (pageId: string): boolean => {
    // Check for multi-page article format (e.g., "202-1-2" for article 1, page 2)
    const multiPageMatch = pageId.match(/^(\d{3})-(\d+)-(\d+)$/);
    if (multiPageMatch) {
      const basePageNumber = parseInt(multiPageMatch[1], 10);
      const articleIndex = parseInt(multiPageMatch[2], 10);
      const pageIndex = parseInt(multiPageMatch[3], 10);
      
      // Validate base page number, article index, and page index
      return !isNaN(basePageNumber) && 
             basePageNumber >= 100 && 
             basePageNumber <= 899 &&
             !isNaN(articleIndex) &&
             articleIndex >= 1 &&
             articleIndex <= 99 &&
             !isNaN(pageIndex) &&
             pageIndex >= 2 &&  // Page 1 is the base article page
             pageIndex <= 99;
    }
    
    // Check for sub-page format (e.g., "202-1", "202-2")
    const subPageMatch = pageId.match(/^(\d{3})-(\d+)$/);
    if (subPageMatch) {
      const basePageNumber = parseInt(subPageMatch[1], 10);
      const subPageIndex = parseInt(subPageMatch[2], 10);
      
      // Validate base page number and sub-page index
      return !isNaN(basePageNumber) && 
             basePageNumber >= 100 && 
             basePageNumber <= 899 &&
             !isNaN(subPageIndex) &&
             subPageIndex >= 1 &&
             subPageIndex <= 99;
    }
    
    const num = parseInt(pageId, 10);
    return !isNaN(num) && num >= 100 && num <= 899;
  };

  /**
   * Fetches a page by ID with request cancellation
   * Requirements: 1.1 - Display page within 500ms
   * Requirements: 15.3 - Remain responsive during loading
   * Requirements: 15.5 - Cancel pending requests for rapid navigation
   */
  const fetchPage = useCallback(async (
    pageId: string, 
    abortSignal?: AbortSignal
  ): Promise<{ page: TeletextPage | null; fromCache: boolean }> => {
    try {
      // Network request with abort signal for cancellation
      const response = await fetch(`/api/page/${pageId}`, {
        signal: abortSignal,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page ${pageId}`);
      }
      
      const data = await response.json();
      const page = data.page || null;
      
      return { page, fromCache: false };
    } catch (error) {
      // Check if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`Request for page ${pageId} was cancelled`);
        throw error; // Re-throw to handle in navigateToPage
      }
      
      console.error('Error fetching page:', error);
      return { page: null, fromCache: false };
    }
  }, []);

  /**
   * Navigates to a specific page with request cancellation
   * Requirements: 1.1, 1.2, 15.3, 15.5, 33.2
   */
  const navigateToPage = useCallback(async (pageId: string) => {
    // Validate page number
    if (!isValidPageNumber(pageId)) {
      console.error(`Invalid page number: ${pageId}`);
      // Requirement 1.2: Display error and remain on current page
      return;
    }

    // Create cancellable request
    const abortController = createCancellableRequest(pageId);
    
    // Start performance measurement
    const startTime = performance.now();
    
    setLoading(true);
    setIsCached(false);
    
    try {
      const { page, fromCache } = await fetchPage(pageId, abortController.signal);
      
      // Check if this request is still active (not cancelled by a newer request)
      if (!isRequestActive(pageId)) {
        console.log(`Ignoring response for cancelled request: ${pageId}`);
        return;
      }
      
      // Record performance metrics
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordPageLoad(pageId, loadTime, fromCache);
      
      if (page) {
        setCurrentPage(page);
        setIsCached(fromCache);
        
        // Update history - remove any forward history and add new page
        // Requirement 33.2: Treat page 100 as home
        const newHistory = history.slice(0, historyIndex + 1);
        
        // If navigating to page 100, clear history and start fresh
        if (pageId === '100') {
          setHistory(['100']);
          setHistoryIndex(0);
        } else {
          newHistory.push(pageId);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
        
        if (onPageChange) {
          onPageChange(page);
        }
      } else {
        // No page available
        console.error(`Page ${pageId} not available`);
        const offlinePage = createOfflinePage(pageId);
        setCurrentPage(offlinePage);
        setIsCached(false);
      }
      
      clearRequest();
      setLoading(false);
    } catch (error) {
      // Handle abort errors silently (request was cancelled)
      if (error instanceof Error && error.name === 'AbortError') {
        setLoading(false);
        return;
      }
      console.error('Navigation error:', error);
      setLoading(false);
    }
  }, [history, historyIndex, onPageChange, createCancellableRequest, clearRequest, isRequestActive, fetchPage]);

  /**
   * Handles digit press for page number input with debouncing
   * Requirement: 12.3, 12.5 - Input buffer with 3 digits
   * Requirement: Performance - Debouncing for keyboard input (100ms)
   * All navigation requires 3-digit input - no single-digit shortcuts
   */
  const handleDigitPress = useCallback((digit: number) => {
    // Only accept digits to build 3-digit page number
    if (inputBuffer.length < 3) {
      const newBuffer = inputBuffer + digit.toString();
      setInputBuffer(newBuffer);
      
      // Auto-navigate when 3 digits are entered (with 100ms debounce)
      if (newBuffer.length === 3) {
        setTimeout(() => {
          navigateToPage(newBuffer);
          setInputBuffer('');
        }, 100);
      }
    }
  }, [inputBuffer, navigateToPage]);

  /**
   * Handles Enter key press
   * Requirement: 12.3
   */
  const handleEnter = useCallback(() => {
    if (inputBuffer.length === 3) {
      navigateToPage(inputBuffer);
      setInputBuffer('');
    } else if (inputBuffer.length > 0) {
      // Clear incomplete input
      setInputBuffer('');
    }
  }, [inputBuffer, navigateToPage]);

  /**
   * Handles navigation controls with request cancellation
   * Requirement: 1.4, 1.5, 15.5, 33.1, 33.3, 35.2, 35.3
   */
  const handleNavigate = useCallback((direction: 'back' | 'forward' | 'up' | 'down') => {
    switch (direction) {
      case 'back':
        // Requirement 1.4: Navigate to previously viewed page
        // Requirement 33.3: When history is empty, navigate to page 100
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          
          const abortController = createCancellableRequest(pageId);
          setLoading(true);
          setIsCached(false);
          
          fetchPage(pageId, abortController.signal).then(({ page, fromCache }) => {
            if (isRequestActive(pageId) && page) {
              setCurrentPage(page);
              setIsCached(fromCache);
              if (onPageChange) {
                onPageChange(page);
              }
            }
            setLoading(false);
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Navigation error:', error);
            }
            setLoading(false);
          });
        } else if (currentPage && currentPage.id !== '100') {
          // At the beginning of history but not on page 100
          // Navigate to page 100 (home)
          navigateToPage('100');
        }
        break;
        
      case 'forward':
        // Navigate forward in history
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          
          const abortController = createCancellableRequest(pageId);
          setLoading(true);
          setIsCached(false);
          
          fetchPage(pageId, abortController.signal).then(({ page, fromCache }) => {
            if (isRequestActive(pageId) && page) {
              setCurrentPage(page);
              setIsCached(fromCache);
              if (onPageChange) {
                onPageChange(page);
              }
            }
            setLoading(false);
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Navigation error:', error);
            }
            setLoading(false);
          });
        }
        break;
        
      case 'up':
        // Arrow UP: Navigate to previous page in multi-page sequence (BACK indicator)
        // Requirement 35.3: Navigate to previous page in multi-page sequence
        if (currentPage?.meta?.continuation?.previousPage) {
          navigateToPage(currentPage.meta.continuation.previousPage);
        }
        // No fallback - up arrow only works for multi-page navigation
        break;
        
      case 'down':
        // Arrow DOWN: Navigate to next page in multi-page sequence (MORE indicator)
        // Requirement 35.2: Navigate to next page in multi-page sequence
        if (currentPage?.meta?.continuation?.nextPage) {
          navigateToPage(currentPage.meta.continuation.nextPage);
        }
        // No fallback - down arrow only works for multi-page navigation
        break;
    }
  }, [currentPage, history, historyIndex, navigateToPage, onPageChange, createCancellableRequest, isRequestActive, fetchPage]);

  /**
   * Handles colored Fastext button navigation
   * Requirement: 3.4
   */
  const handleColorButton = useCallback((color: 'red' | 'green' | 'yellow' | 'blue') => {
    if (!currentPage) return;
    
    // Find the link with matching color
    const link = currentPage.links.find(l => l.color === color);
    
    if (link && link.targetPage) {
      navigateToPage(link.targetPage);
    }
  }, [currentPage, navigateToPage]);

  /**
   * Handles F1-F10 favorite page shortcuts
   * Requirement: 23.5 - Single-key access to favorite pages
   */
  const handleFavoriteKey = useCallback((index: number) => {
    if (index >= 0 && index < favoritePages.length) {
      const pageId = favoritePages[index];
      if (pageId && pageId.trim() !== '') {
        navigateToPage(pageId);
      }
    }
  }, [favoritePages, navigateToPage]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  return (
    <>
      {children({
        currentPage,
        loading,
        inputBuffer,
        navigateToPage,
        handleDigitPress,
        handleEnter,
        handleNavigate,
        handleColorButton,
        handleFavoriteKey,
        favoritePages,
        canGoBack,
        canGoForward,
        isOnline,
        isCached
      })}
    </>
  );
}
