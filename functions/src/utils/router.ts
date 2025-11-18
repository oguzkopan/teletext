// Router to map page ranges to appropriate adapters

import { ContentAdapter } from '../types';
import { StaticAdapter } from '../adapters/StaticAdapter';

/**
 * Routes a page request to the appropriate content adapter based on page number
 * @param pageId - The page ID (e.g., "201", "305")
 * @returns The appropriate content adapter for the page range
 */
export function routeToAdapter(pageId: string): ContentAdapter {
  const pageNumber = parseInt(pageId, 10);

  if (isNaN(pageNumber) || pageNumber < 100 || pageNumber > 899) {
    throw new Error(`Invalid page number: ${pageId}`);
  }

  // Determine magazine (first digit)
  const magazine = Math.floor(pageNumber / 100);

  switch (magazine) {
    case 1:
      // 100-199: Static/System pages
      return new StaticAdapter();
    
    case 2:
      // 200-299: News adapter (to be implemented in later tasks)
      // For now, return a placeholder adapter
      return new StaticAdapter();
    
    case 3:
      // 300-399: Sports adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    case 4:
      // 400-499: Markets adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    case 5:
      // 500-599: AI adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    case 6:
      // 600-699: Games adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    case 7:
      // 700-799: Settings adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    case 8:
      // 800-899: Dev tools adapter (to be implemented in later tasks)
      return new StaticAdapter();
    
    default:
      throw new Error(`No adapter found for page: ${pageId}`);
  }
}

/**
 * Validates a page ID format
 * @param pageId - The page ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidPageId(pageId: string): boolean {
  if (!pageId || typeof pageId !== 'string') {
    return false;
  }

  const pageNumber = parseInt(pageId, 10);
  return !isNaN(pageNumber) && pageNumber >= 100 && pageNumber <= 899;
}
