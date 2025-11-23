'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TeletextPage, createOfflinePage } from '@/types/teletext';
import { useRequestCancellation } from '@/hooks/useRequestCancellation';
import { performanceMonitor } from '@/lib/performance-monitor';
import { pageLayoutProcessor } from '@/lib/page-layout-processor';
import { useTimestampUpdateCheck } from '@/hooks/useTimestampUpdates';

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
  expectedInputLength: number; // 1, 2, or 3 digits expected
  highlightBreadcrumb: boolean; // Visual feedback for back navigation
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
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(initialPage ? [initialPage.id] : []);
  const [highlightBreadcrumb, setHighlightBreadcrumb] = useState(false);
  
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

  // Requirement: 18.4 - Update timestamps every minute without page refresh
  // Get content type from current page
  const contentType = currentPage?.meta?.source === 'NewsAdapter' ? 'NEWS' :
                      currentPage?.meta?.source === 'SportsAdapter' ? 'SPORT' :
                      currentPage?.meta?.source === 'MarketsAdapter' ? 'MARKETS' :
                      currentPage?.meta?.source === 'WeatherAdapter' ? 'WEATHER' :
                      undefined;
  
  const { shouldUpdate, currentTime } = useTimestampUpdateCheck(
    currentPage?.meta?.lastUpdated,
    contentType
  );

  // Re-process page when timestamp updates (every minute)
  // DISABLED: This was causing duplicate headers by re-processing pages
  // The timestamp updates are now handled by the layout processor on initial load
  // useEffect(() => {
  //   if (shouldUpdate && currentPage && !loading) {
  //     const processedPage = pageLayoutProcessor.processPage(currentPage, {
  //       breadcrumbs: currentPage.id === '100' ? [] : breadcrumbs,
  //       enableFullScreen: true,
  //       contentAlignment: 'left'
  //     });
  //     setCurrentPage(processedPage);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentTime, shouldUpdate, currentPage?.id, breadcrumbs, loading]);

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
    abortSignal?: AbortSignal,
    sessionId?: string
  ): Promise<{ page: TeletextPage | null; fromCache: boolean }> => {
    try {
      // Build URL with session ID if provided
      const url = sessionId 
        ? `/api/page/${pageId}?sessionId=${encodeURIComponent(sessionId)}`
        : `/api/page/${pageId}`;
      
      // Network request with abort signal for cancellation
      const response = await fetch(url, {
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
    
    // Get session ID from current page if it exists (for quiz/game continuity)
    const sessionId = currentPage?.meta?.aiContextId;
    console.log(`[PageRouter] Navigating from ${currentPage?.id} to ${pageId}, sessionId: ${sessionId}`);
    
    setLoading(true);
    setIsCached(false);
    
    try {
      const { page, fromCache } = await fetchPage(pageId, abortController.signal, sessionId);
      
      console.log(`[PageRouter] Received page: ${page?.id}, requested: ${pageId}`);
      console.log(`[PageRouter] Page metadata:`, page?.meta);
      
      // Check if this request is still active (not cancelled by a newer request)
      if (!isRequestActive(pageId)) {
        console.log(`Ignoring response for cancelled request: ${pageId}`);
        return;
      }
      
      // Record performance metrics
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordPageLoad(pageId, loadTime, fromCache);
      
      if (page) {
        // Update history and breadcrumbs
        // Requirement 33.2: Treat page 100 as home
        // Requirement 16.1, 16.2, 16.3, 16.4, 16.5: Breadcrumb navigation
        const newHistory = history.slice(0, historyIndex + 1);
        
        // If navigating to page 100, clear history and start fresh
        if (pageId === '100') {
          setHistory(['100']);
          setHistoryIndex(0);
          setBreadcrumbs([]);
        } else {
          newHistory.push(pageId);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          
          // Update breadcrumbs to reflect the navigation trail
          // Build breadcrumbs from history, excluding page 100 if it's the first page
          const newBreadcrumbs = newHistory.filter(id => id !== '100' || newHistory.length === 1);
          setBreadcrumbs(newBreadcrumbs);
        }
        
        // Clear breadcrumb highlight
        setHighlightBreadcrumb(false);
        
        // Process page with layout manager to apply full-screen layout
        // Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4
        // Only process if page doesn't already have layout applied
        const processedPage = page.meta?.useLayoutManager 
          ? page 
          : pageLayoutProcessor.processPage(page, {
              breadcrumbs: pageId === '100' ? [] : breadcrumbs,
              enableFullScreen: true,
              contentAlignment: 'left'
            });
        
        setCurrentPage(processedPage);
        setIsCached(fromCache);
        
        if (onPageChange) {
          onPageChange(processedPage);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, historyIndex, breadcrumbs, onPageChange, createCancellableRequest, clearRequest, isRequestActive, fetchPage]);

  /**
   * Handles digit press for page number input with variable length support
   * Requirement: 12.3, 12.5 - Input buffer with flexible digit length
   * Requirement: Performance - Debouncing for keyboard input (100ms)
   * Supports 1-digit, 2-digit, or 3-digit input based on current page metadata
   */
  const handleDigitPress = useCallback((digit: number) => {
    // Determine expected input length from current page metadata
    const inputMode = currentPage?.meta?.inputMode || 'triple';
    const maxLength = inputMode === 'single' ? 1 : inputMode === 'double' ? 2 : 3;
    
    // Check if this is a valid single-digit option for the current page
    const validOptions = currentPage?.meta?.inputOptions || [];
    const digitStr = digit.toString();
    
    console.log(`[PageRouter] Digit pressed: ${digitStr}, inputMode: ${inputMode}, maxLength: ${maxLength}, validOptions:`, validOptions);
    
    // For single-digit input mode, check if it's a valid option and navigate immediately
    if (inputMode === 'single' && validOptions.includes(digitStr)) {
      console.log(`[PageRouter] Single-digit input detected: ${digitStr}`);
      console.log(`[PageRouter] Current page: ${currentPage?.id}, Links:`, currentPage?.links);
      
      // First, try to find a link that matches this digit (for games, AI menus, etc.)
      const matchingLink = currentPage?.links?.find(link => link.label === digitStr);
      
      console.log(`[PageRouter] Matching link found:`, matchingLink);
      
      if (matchingLink && matchingLink.targetPage) {
        // Navigate using the link's target page
        console.log(`[PageRouter] Navigating to link target: ${matchingLink.targetPage}`);
        navigateToPage(matchingLink.targetPage);
      } else if (currentPage?.id) {
        // No matching link found - use sub-page navigation (for news articles, etc.)
        // Navigate to currentPageId-digit (e.g., "203-1", "203-2")
        const subPageId = `${currentPage.id}-${digitStr}`;
        console.log(`[PageRouter] No matching link, using sub-page navigation: ${subPageId}`);
        navigateToPage(subPageId);
      }
      setInputBuffer(''); // Clear buffer after navigation
      return; // Exit early - don't add to buffer
    }
    
    // For multi-digit input, add to buffer
    if (inputBuffer.length < maxLength) {
      const newBuffer = inputBuffer + digitStr;
      setInputBuffer(newBuffer);
      
      // Auto-navigate when max digits are entered
      if (newBuffer.length === maxLength) {
        console.log(`[PageRouter] Max digits entered (${maxLength}), navigating to: ${newBuffer}`);
        navigateToPage(newBuffer);
        setInputBuffer('');
      }
    }
  }, [inputBuffer, currentPage?.meta?.inputMode, currentPage?.meta?.inputOptions, currentPage?.links, currentPage?.id, navigateToPage]);

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
        // Requirement 16.4: Highlight breadcrumb on back button press
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          
          // Highlight breadcrumb briefly before navigation
          setHighlightBreadcrumb(true);
          
          const abortController = createCancellableRequest(pageId);
          const sessionId = currentPage?.meta?.aiContextId;
          setLoading(true);
          setIsCached(false);
          
          fetchPage(pageId, abortController.signal, sessionId).then(({ page, fromCache }) => {
            if (isRequestActive(pageId) && page) {
              // Update breadcrumbs for back navigation
              // Build breadcrumbs from history up to the new index
              const newBreadcrumbs = history.slice(0, newIndex + 1).filter(id => id !== '100' || history.slice(0, newIndex + 1).length === 1);
              setBreadcrumbs(newBreadcrumbs);
              
              // Process page with layout manager
              // Only process if page doesn't already have layout applied
              const processedPage = page.meta?.useLayoutManager 
                ? page 
                : pageLayoutProcessor.processPage(page, {
                    breadcrumbs: pageId === '100' ? [] : newBreadcrumbs,
                    enableFullScreen: true,
                    contentAlignment: 'left'
                  });
              
              setCurrentPage(processedPage);
              setIsCached(fromCache);
              if (onPageChange) {
                onPageChange(processedPage);
              }
              
              // Clear highlight after navigation
              setTimeout(() => setHighlightBreadcrumb(false), 300);
            }
            setLoading(false);
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Navigation error:', error);
            }
            setLoading(false);
            setHighlightBreadcrumb(false);
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
          const sessionId = currentPage?.meta?.aiContextId;
          setLoading(true);
          setIsCached(false);
          
          fetchPage(pageId, abortController.signal, sessionId).then(({ page, fromCache }) => {
            if (isRequestActive(pageId) && page) {
              // Update breadcrumbs for forward navigation
              // Build breadcrumbs from history up to the new index
              const newBreadcrumbs = history.slice(0, newIndex + 1).filter(id => id !== '100' || history.slice(0, newIndex + 1).length === 1);
              setBreadcrumbs(newBreadcrumbs);
              
              // Process page with layout manager
              // Only process if page doesn't already have layout applied
              const processedPage = page.meta?.useLayoutManager 
                ? page 
                : pageLayoutProcessor.processPage(page, {
                    breadcrumbs: pageId === '100' ? [] : newBreadcrumbs,
                    enableFullScreen: true,
                    contentAlignment: 'left'
                  });
              
              setCurrentPage(processedPage);
              setIsCached(fromCache);
              if (onPageChange) {
                onPageChange(processedPage);
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

  // Calculate expected input length based on current page metadata
  const inputMode = currentPage?.meta?.inputMode || 'triple';
  const expectedInputLength = inputMode === 'single' ? 1 : inputMode === 'double' ? 2 : 3;
  
  // Debug log for expected input length
  useEffect(() => {
    console.log(`[PageRouter] Page ${currentPage?.id} - inputMode: ${inputMode}, expectedInputLength: ${expectedInputLength}`);
  }, [currentPage?.id, inputMode, expectedInputLength]);

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
        isCached,
        expectedInputLength,
        highlightBreadcrumb
      })}
    </>
  );
}
