'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { TeletextPage } from '@/types/teletext';

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
  canGoBack: boolean;
  canGoForward: boolean;
}

/**
 * PageRouter Component
 * 
 * Manages navigation state, history stack, and page transitions.
 * Implements page number validation and input buffering.
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 3.4, 12.3, 12.5
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

  /**
   * Validates page number is in valid range (100-899)
   * Requirement: 1.2
   */
  const isValidPageNumber = (pageId: string): boolean => {
    const num = parseInt(pageId, 10);
    return !isNaN(num) && num >= 100 && num <= 899;
  };

  /**
   * Fetches a page by ID
   * Requirement: 1.1 - Display page within 500ms
   */
  const fetchPage = async (pageId: string): Promise<TeletextPage | null> => {
    try {
      // TODO: Replace with actual API call when backend is implemented
      // For now, return a mock page
      const response = await fetch(`/api/page/${pageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page ${pageId}`);
      }
      
      const data = await response.json();
      return data.page || null;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  };

  /**
   * Navigates to a specific page
   * Requirement: 1.1, 1.2
   */
  const navigateToPage = useCallback(async (pageId: string) => {
    // Validate page number
    if (!isValidPageNumber(pageId)) {
      console.error(`Invalid page number: ${pageId}`);
      // Requirement 1.2: Display error and remain on current page
      return;
    }

    setLoading(true);
    
    try {
      const page = await fetchPage(pageId);
      
      if (page) {
        setCurrentPage(page);
        
        // Update history - remove any forward history and add new page
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(pageId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        if (onPageChange) {
          onPageChange(page);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [history, historyIndex, onPageChange]);

  /**
   * Handles digit press for page number input
   * Requirement: 12.3, 12.5 - Input buffer with 3 digits
   */
  const handleDigitPress = useCallback((digit: number) => {
    if (inputBuffer.length < 3) {
      const newBuffer = inputBuffer + digit.toString();
      setInputBuffer(newBuffer);
      
      // Auto-navigate when 3 digits are entered
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
   * Handles navigation controls
   * Requirement: 1.4, 1.5
   */
  const handleNavigate = useCallback((direction: 'back' | 'forward' | 'up' | 'down') => {
    switch (direction) {
      case 'back':
        // Requirement 1.4: Navigate to previously viewed page
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          
          setLoading(true);
          fetchPage(pageId).then(page => {
            if (page) {
              setCurrentPage(page);
              if (onPageChange) {
                onPageChange(page);
              }
            }
            setLoading(false);
          });
        }
        break;
        
      case 'forward':
        // Navigate forward in history
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          
          setLoading(true);
          fetchPage(pageId).then(page => {
            if (page) {
              setCurrentPage(page);
              if (onPageChange) {
                onPageChange(page);
              }
            }
            setLoading(false);
          });
        }
        break;
        
      case 'up':
        // Requirement 1.5: Channel up - navigate to next page in sequence
        if (currentPage) {
          const currentNum = parseInt(currentPage.id, 10);
          const nextNum = currentNum + 1;
          if (nextNum <= 899) {
            navigateToPage(nextNum.toString().padStart(3, '0'));
          }
        }
        break;
        
      case 'down':
        // Requirement 1.5: Channel down - navigate to previous page in sequence
        if (currentPage) {
          const currentNum = parseInt(currentPage.id, 10);
          const prevNum = currentNum - 1;
          if (prevNum >= 100) {
            navigateToPage(prevNum.toString().padStart(3, '0'));
          }
        }
        break;
    }
  }, [currentPage, history, historyIndex, navigateToPage, onPageChange]);

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
        canGoBack,
        canGoForward
      })}
    </>
  );
}
