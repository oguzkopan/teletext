// Router to map page ranges to appropriate adapters

import { ContentAdapter } from '../types';
import { StaticAdapter } from '../adapters/StaticAdapter';
import { NewsAdapter } from '../adapters/NewsAdapter';
import { SportsAdapter } from '../adapters/SportsAdapter';
import { MarketsAdapter } from '../adapters/MarketsAdapter';
import { WeatherAdapter } from '../adapters/WeatherAdapter';
import { AIAdapter } from '../adapters/AIAdapter';
import { GamesAdapter } from '../adapters/GamesAdapter';
import { SettingsAdapter } from '../adapters/SettingsAdapter';
import { DevAdapter } from '../adapters/DevAdapter';

/**
 * Routes a page request to the appropriate content adapter based on page number
 * @param pageId - The page ID (e.g., "201", "305")
 * @returns The appropriate content adapter for the page range
 */
export function routeToAdapter(pageId: string): ContentAdapter {
  const pageNumber = parseInt(pageId, 10);

  // Special cases handled by StaticAdapter
  if (pageNumber === 999 || pageNumber === 404 || pageNumber === 666) {
    return new StaticAdapter();
  }

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
      // 200-299: News adapter
      return new NewsAdapter();
    
    case 3:
      // 300-399: Sports adapter
      return new SportsAdapter();
    
    case 4:
      // 400-499: Markets and Weather adapter
      // 400-419: Markets
      // 420-449: Weather
      if (pageNumber >= 420 && pageNumber <= 449) {
        return new WeatherAdapter();
      }
      return new MarketsAdapter();
    
    case 5:
      // 500-599: AI adapter
      return new AIAdapter();
    
    case 6:
      // 600-699: Games adapter
      return new GamesAdapter();
    
    case 7:
      // 700-799: Settings adapter
      return new SettingsAdapter();
    
    case 8:
      // 800-899: Dev tools adapter
      return new DevAdapter();
    
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
  
  // Special cases: Easter egg pages and help page
  if (pageNumber === 999 || pageNumber === 404 || pageNumber === 666) {
    return true;
  }
  
  return !isNaN(pageNumber) && pageNumber >= 100 && pageNumber <= 899;
}
