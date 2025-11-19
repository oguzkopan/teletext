'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeletextPage } from '@/types/teletext';

/**
 * Hook for managing offline support and network connectivity
 * Requirements: 13.4, 15.3
 */
export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(true);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setServiceWorkerReady(true);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Network: Offline');
      setIsOnline(false);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache a page in the service worker
  const cachePage = useCallback((pageId: string, pageData: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PAGE',
        pageId,
        pageData
      });
    }
  }, []);

  // Clear all caches
  const clearCache = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }, []);

  return {
    isOnline,
    serviceWorkerReady,
    cachePage,
    clearCache
  };
}

/**
 * Hook for managing browser storage cache
 * Provides fallback when service worker is not available
 */
export function useBrowserCache() {
  const CACHE_KEY_PREFIX = 'teletext_page_';
  const CACHE_EXPIRY_KEY_PREFIX = 'teletext_expiry_';

  // Save page to localStorage
  const savePage = useCallback((pageId: string, page: TeletextPage, ttlMinutes: number = 30) => {
    try {
      const cacheKey = CACHE_KEY_PREFIX + pageId;
      const expiryKey = CACHE_EXPIRY_KEY_PREFIX + pageId;
      const expiryTime = Date.now() + (ttlMinutes * 60 * 1000);

      localStorage.setItem(cacheKey, JSON.stringify(page));
      localStorage.setItem(expiryKey, expiryTime.toString());
    } catch (error) {
      console.error('Failed to save page to localStorage:', error);
    }
  }, []);

  // Load page from localStorage
  const loadPage = useCallback((pageId: string): TeletextPage | null => {
    try {
      const cacheKey = CACHE_KEY_PREFIX + pageId;
      const expiryKey = CACHE_EXPIRY_KEY_PREFIX + pageId;

      const cachedData = localStorage.getItem(cacheKey);
      const expiryTime = localStorage.getItem(expiryKey);

      if (!cachedData || !expiryTime) {
        return null;
      }

      // Check if cache has expired
      if (Date.now() > parseInt(expiryTime, 10)) {
        // Clean up expired cache
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(expiryKey);
        return null;
      }

      return JSON.parse(cachedData) as TeletextPage;
    } catch (error) {
      console.error('Failed to load page from localStorage:', error);
      return null;
    }
  }, []);

  // Clear specific page from cache
  const clearPage = useCallback((pageId: string) => {
    try {
      const cacheKey = CACHE_KEY_PREFIX + pageId;
      const expiryKey = CACHE_EXPIRY_KEY_PREFIX + pageId;
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(expiryKey);
    } catch (error) {
      console.error('Failed to clear page from localStorage:', error);
    }
  }, []);

  // Clear all cached pages
  const clearAllPages = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX) || key.startsWith(CACHE_EXPIRY_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear all pages from localStorage:', error);
    }
  }, []);

  return {
    savePage,
    loadPage,
    clearPage,
    clearAllPages
  };
}
