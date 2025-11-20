/**
 * Adapter Router for Next.js API Routes
 * Routes page requests to appropriate adapters without needing Firebase emulators
 */

import { StaticAdapter } from '@/functions/src/adapters/StaticAdapter';
import { NewsAdapter } from '@/functions/src/adapters/NewsAdapter';
import { SportsAdapter } from '@/functions/src/adapters/SportsAdapter';
import { MarketsAdapter } from '@/functions/src/adapters/MarketsAdapter';
import { AIAdapter } from '@/functions/src/adapters/AIAdapter';
import { GamesAdapter } from '@/functions/src/adapters/GamesAdapter';
import { SettingsAdapter } from '@/functions/src/adapters/SettingsAdapter';
import { DevAdapter } from '@/functions/src/adapters/DevAdapter';
import { WeatherAdapter } from '@/functions/src/adapters/WeatherAdapter';
import type { ContentAdapter } from '@/functions/src/types';

/**
 * Routes a page ID to the appropriate content adapter
 * @param pageId - The page ID (100-899)
 * @returns The appropriate ContentAdapter instance
 */
export function routeToAdapter(pageId: string): ContentAdapter {
  const pageNumber = parseInt(pageId, 10);
  const magazine = Math.floor(pageNumber / 100);

  switch (magazine) {
    case 1:
      // System pages (100-199)
      return new StaticAdapter();
    
    case 2:
      // News pages (200-299)
      return new NewsAdapter();
    
    case 3:
      // Sports pages (300-399)
      return new SportsAdapter();
    
    case 4:
      // Markets and Weather pages (400-499)
      // Weather is 420-449, rest is markets
      if (pageNumber >= 420 && pageNumber < 450) {
        return new WeatherAdapter();
      }
      return new MarketsAdapter();
    
    case 5:
      // AI Oracle pages (500-599)
      return new AIAdapter();
    
    case 6:
      // Games pages (600-699)
      return new GamesAdapter();
    
    case 7:
      // Settings pages (700-799)
      return new SettingsAdapter();
    
    case 8:
      // Developer tools pages (800-899)
      return new DevAdapter();
    
    default:
      // Default to static adapter for error pages
      return new StaticAdapter();
  }
}

/**
 * Validates if a page ID is in the valid range
 * @param pageId - The page ID to validate
 * @returns True if valid (100-899), false otherwise
 */
export function isValidPageId(pageId: string): boolean {
  const num = parseInt(pageId, 10);
  return !isNaN(num) && num >= 100 && num <= 899;
}
