/**
 * Lazy-loaded adapter imports for code splitting
 * 
 * Requirement: Add code splitting by magazine (lazy load adapters)
 * 
 * This module provides dynamic imports for adapter modules to reduce
 * initial bundle size. Adapters are loaded on-demand when their
 * corresponding magazine pages are accessed.
 */

/**
 * Dynamically imports the appropriate adapter based on page number
 */
export async function loadAdapter(pageId: string) {
  const pageNum = parseInt(pageId, 10);
  const magazine = Math.floor(pageNum / 100);

  switch (magazine) {
    case 1:
      // Static pages (100-199)
      return import('@/functions/src/adapters/StaticAdapter');
    
    case 2:
      // News (200-299)
      return import('@/functions/src/adapters/NewsAdapter');
    
    case 3:
      // Sports (300-399)
      return import('@/functions/src/adapters/SportsAdapter');
    
    case 4:
      // Markets (400-499)
      return import('@/functions/src/adapters/MarketsAdapter');
    
    case 5:
      // AI Oracle (500-599)
      return import('@/functions/src/adapters/AIAdapter');
    
    case 6:
      // Games (600-699)
      return import('@/functions/src/adapters/GamesAdapter');
    
    case 7:
      // Settings (700-799)
      return import('@/functions/src/adapters/SettingsAdapter');
    
    case 8:
      // Developer tools (800-899)
      return import('@/functions/src/adapters/DevAdapter');
    
    default:
      throw new Error(`Invalid page number: ${pageId}`);
  }
}

/**
 * Preloads adapters for frequently accessed magazines
 */
export async function preloadCommonAdapters() {
  // Preload the most commonly accessed adapters
  const commonMagazines = ['100', '200', '300', '400', '500'];
  
  for (const pageId of commonMagazines) {
    try {
      await loadAdapter(pageId);
    } catch (error) {
      console.warn(`Failed to preload adapter for page ${pageId}:`, error);
    }
  }
}
