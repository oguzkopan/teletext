'use client';

import { useState, useCallback } from 'react';
import { TeletextPage } from '@/types/teletext';

export interface UsePageRouterReturn {
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
 * Hook for page routing and navigation
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 3.4, 12.3, 12.5
 */
export function usePageRouter(initialPage?: TeletextPage): UsePageRouterReturn {
  const [currentPage, setCurrentPage] = useState<TeletextPage | null>(initialPage || null);
  const [loading, setLoading] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [history, setHistory] = useState<string[]>(initialPage ? [initialPage.id] : []);
  const [historyIndex, setHistoryIndex] = useState(initialPage ? 0 : -1);

  const isValidPageNumber = (pageId: string): boolean => {
    const num = parseInt(pageId, 10);
    return !isNaN(num) && num >= 100 && num <= 899;
  };

  const fetchPage = async (pageId: string): Promise<TeletextPage | null> => {
    try {
      const response = await fetch(`/api/page/${pageId}`);
      if (!response.ok) throw new Error(`Failed to fetch page ${pageId}`);
      const data = await response.json();
      return data.page || null;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  };

  const navigateToPage = useCallback(async (pageId: string) => {
    if (!isValidPageNumber(pageId)) {
      console.error(`Invalid page number: ${pageId}`);
      return;
    }

    setLoading(true);
    try {
      const page = await fetchPage(pageId);
      if (page) {
        setCurrentPage(page);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(pageId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    } finally {
      setLoading(false);
    }
  }, [history, historyIndex]);

  const handleDigitPress = useCallback((digit: number) => {
    if (inputBuffer.length < 3) {
      const newBuffer = inputBuffer + digit.toString();
      setInputBuffer(newBuffer);
      if (newBuffer.length === 3) {
        setTimeout(() => {
          navigateToPage(newBuffer);
          setInputBuffer('');
        }, 100);
      }
    }
  }, [inputBuffer, navigateToPage]);

  const handleEnter = useCallback(() => {
    if (inputBuffer.length === 3) {
      navigateToPage(inputBuffer);
      setInputBuffer('');
    } else if (inputBuffer.length > 0) {
      setInputBuffer('');
    }
  }, [inputBuffer, navigateToPage]);

  const handleNavigate = useCallback((direction: 'back' | 'forward' | 'up' | 'down') => {
    switch (direction) {
      case 'back':
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          setLoading(true);
          fetchPage(pageId).then(page => {
            if (page) setCurrentPage(page);
            setLoading(false);
          });
        }
        break;
      case 'forward':
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const pageId = history[newIndex];
          setHistoryIndex(newIndex);
          setLoading(true);
          fetchPage(pageId).then(page => {
            if (page) setCurrentPage(page);
            setLoading(false);
          });
        }
        break;
      case 'up':
        if (currentPage) {
          const currentNum = parseInt(currentPage.id, 10);
          const nextNum = currentNum + 1;
          if (nextNum <= 899) {
            navigateToPage(nextNum.toString().padStart(3, '0'));
          }
        }
        break;
      case 'down':
        if (currentPage) {
          const currentNum = parseInt(currentPage.id, 10);
          const prevNum = currentNum - 1;
          if (prevNum >= 100) {
            navigateToPage(prevNum.toString().padStart(3, '0'));
          }
        }
        break;
    }
  }, [currentPage, history, historyIndex, navigateToPage]);

  const handleColorButton = useCallback((color: 'red' | 'green' | 'yellow' | 'blue') => {
    if (!currentPage) return;
    const link = currentPage.links.find(l => l.color === color);
    if (link && link.targetPage) {
      navigateToPage(link.targetPage);
    }
  }, [currentPage, navigateToPage]);

  return {
    currentPage,
    loading,
    inputBuffer,
    navigateToPage,
    handleDigitPress,
    handleEnter,
    handleNavigate,
    handleColorButton,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < history.length - 1
  };
}
