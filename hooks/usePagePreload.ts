'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook for preloading frequently accessed pages
 * 
 * Requirement: 15.4 - Preload index page (100) and frequently accessed pages
 */
export function usePagePreload() {
  const preloadedPages = useRef<Set<string>>(new Set());

  /**
   * Preloads a page by making a fetch request and caching the response
   */
  const preloadPage = async (pageId: string) => {
    if (preloadedPages.current.has(pageId)) {
      return; // Already preloaded
    }

    try {
      // Make a low-priority fetch request
      const response = await fetch(`/api/page/${pageId}`, {
        priority: 'low' as RequestPriority,
      });

      if (response.ok) {
        // The response will be cached by the browser/service worker
        await response.json();
        preloadedPages.current.add(pageId);
        console.log(`Preloaded page ${pageId}`);
      }
    } catch (error) {
      console.warn(`Failed to preload page ${pageId}:`, error);
    }
  };

  /**
   * Preloads multiple pages
   */
  const preloadPages = async (pageIds: string[]) => {
    // Preload pages sequentially with a small delay to avoid overwhelming the server
    for (const pageId of pageIds) {
      await preloadPage(pageId);
      // Small delay between preloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  /**
   * Preload frequently accessed pages on mount
   */
  useEffect(() => {
    // Preload after a short delay to not interfere with initial page load
    const timer = setTimeout(() => {
      const frequentPages = [
        '100', // Index
        '200', // News index
        '201', // Top headlines
        '300', // Sports index
        '400', // Markets index
        '500', // AI Oracle index
        '600', // Games index
        '700', // Settings index
        '999', // Help page
      ];

      preloadPages(frequentPages);
    }, 2000); // Wait 2 seconds after initial load

    return () => clearTimeout(timer);
  }, []);

  return {
    preloadPage,
    preloadPages,
  };
}
