/**
 * Page Registry
 * 
 * Central registry for all static pages in the teletext system.
 * Maps page numbers to their factory functions.
 */

import { TeletextPage } from '@/types/teletext';

// Import all page factories
import { createIndexPage } from './index-page';
import { createSystemStatusPage, createHelpPage } from './system-pages';
import { 
  createAIOraclePage,
  createAIChatPage,
  createGamesIndexPage,
  createThemeSelectionPage,
  createSettingsIndexPage,
  createDevToolsIndexPage
} from './services-pages';
import { 
  createComingSoonPage,
  createGenericComingSoonPage,
  create404ErrorPage
} from './additional-pages';
import { createCursedPage, createCursedPageVariant } from './cursed-page';
import { createEnhancedCursedPage } from './cursed-page-enhanced';
import { createRadioListingsPage } from './radio-pages';
import {
  createCurrencyExchangePage,
  createLotteryResultsPage,
  createHoroscopesPage,
  createHoroscopesPage2,
  createFlightInfoPage,
  createHotelBookingsPage,
  createRestaurantReviewsPage,
  createTVGuidePage,
  createCinemaShowtimesPage
} from './additional-services-pages';

/**
 * Page factory function type
 */
export type PageFactory = () => TeletextPage;

/**
 * Registry of all static pages
 * Maps page number to factory function
 */
const pageRegistry: Map<string, PageFactory> = new Map();

// System pages (1xx)
pageRegistry.set('100', () => createIndexPage(false));
pageRegistry.set('101', createSystemStatusPage);

// News pages (2xx)
// All news pages are now handled by NewsAdapter for live data from News API
// Pages 200-209 and their sub-pages (200-1, 201-2, etc.) are dynamically generated

// Sports pages (3xx)
// All sports pages are now handled by SportsAdapter for live data from API-Football
// Pages 300-309 and their sub-pages (300-1, 301-2, etc.) are dynamically generated

// Markets pages (4xx)
// All markets pages are now handled by MarketsAdapter for live data from Alpha Vantage and CoinGecko
// Pages 400-419 and their sub-pages (401-1, 402-2, etc.) are dynamically generated

// Special page: 404 - Halloween-themed error page
pageRegistry.set('404', () => create404ErrorPage('404'));

// AI pages (5xx)
pageRegistry.set('500', createAIOraclePage);
pageRegistry.set('501', createAIChatPage);

// Games pages (6xx)
pageRegistry.set('600', createGamesIndexPage);
// Pages 601, 610, 620, 630, 640 are now handled by Firebase Functions GamesAdapter
// This allows them to use real-time AI generation instead of static mock data
// The GamesAdapter provides:
// - 601: Quiz with AI-generated questions
// - 610: Bamboozle branching story game
// - 620: Random facts (AI-generated or from API)
// - 630: Word games with AI-generated anagrams
// - 640: Math challenges with AI-generated problems

// Cursed page (666) - Special Kiroween hackathon feature
pageRegistry.set('666', createEnhancedCursedPage);
pageRegistry.set('666-1', createCursedPageVariant);
pageRegistry.set('666-2', createCursedPage); // Original version

// Settings pages (7xx)
pageRegistry.set('700', createThemeSelectionPage);
pageRegistry.set('701', createSettingsIndexPage);

// Developer tools (8xx)
pageRegistry.set('800', createDevToolsIndexPage);

// Help page (9xx)
pageRegistry.set('999', createHelpPage);

// Additional placeholder pages for features under construction
// Sports pages (3xx) - Now handled by SportsAdapter, no static pages needed
// Markets pages (4xx) - Now handled by MarketsAdapter, no static pages needed

// Weather pages (4xx)
pageRegistry.set('420', () => createComingSoonPage('420', 'Weather Forecast & Conditions', 'Current weather and 5-day forecast'));
pageRegistry.set('421', () => createComingSoonPage('421', 'London Weather', 'Weather forecast for London'));
pageRegistry.set('422', () => createComingSoonPage('422', 'New York Weather', 'Weather forecast for New York'));
pageRegistry.set('423', () => createComingSoonPage('423', 'Tokyo Weather', 'Weather forecast for Tokyo'));

// Additional Services pages (4xx)
pageRegistry.set('450', createCurrencyExchangePage); // Currency Exchange Rates
pageRegistry.set('451', createLotteryResultsPage); // Lottery Results
pageRegistry.set('452', createHoroscopesPage); // Horoscopes & Astrology (Part 1)
pageRegistry.set('453', createHoroscopesPage2); // Horoscopes & Astrology (Part 2)
pageRegistry.set('460', createFlightInfoPage); // Flight Information
pageRegistry.set('461', createHotelBookingsPage); // Hotel Bookings
pageRegistry.set('462', createRestaurantReviewsPage); // Restaurant Reviews
pageRegistry.set('470', createTVGuidePage); // TV Guide & Schedules
pageRegistry.set('471', () => createRadioListingsPage()); // Radio Listings with integrated player
pageRegistry.set('472', createCinemaShowtimesPage); // Cinema Showtimes

// Settings sub-pages (7xx)
pageRegistry.set('710', () => createComingSoonPage('710', 'Keyboard Shortcuts', 'View and customize keyboard shortcuts'));
pageRegistry.set('720', () => createComingSoonPage('720', 'Animation Settings', 'Control animation speed and effects'));

// Developer tools sub-pages (8xx)
pageRegistry.set('801', () => createComingSoonPage('801', 'API Explorer', 'Test and explore available APIs'));
pageRegistry.set('810', () => createComingSoonPage('810', 'Console Logs', 'View application logs and errors'));
pageRegistry.set('820', () => createComingSoonPage('820', 'API Documentation', 'Complete API reference guide'));

/**
 * Gets a page by its number
 * 
 * @param pageNumber - The page number (e.g., "100", "202", "501")
 * @returns The page object or null if not found
 */
export function getPageByNumber(pageNumber: string): TeletextPage | null {
  const factory = pageRegistry.get(pageNumber);
  if (!factory) {
    return null;
  }
  
  try {
    return factory();
  } catch (error) {
    console.error(`Error creating page ${pageNumber}:`, error);
    return null;
  }
}

/**
 * Checks if a page exists in the registry
 * 
 * @param pageNumber - The page number to check
 * @returns True if the page exists
 */
export function hasPage(pageNumber: string): boolean {
  return pageRegistry.has(pageNumber);
}

/**
 * Gets all registered page numbers
 * 
 * @returns Array of all page numbers
 */
export function getAllPageNumbers(): string[] {
  return Array.from(pageRegistry.keys());
}

/**
 * Registers a new page factory
 * 
 * @param pageNumber - The page number
 * @param factory - The factory function
 */
export function registerPage(pageNumber: string, factory: PageFactory): void {
  pageRegistry.set(pageNumber, factory);
}

/**
 * Unregisters a page
 * 
 * @param pageNumber - The page number to unregister
 */
export function unregisterPage(pageNumber: string): void {
  pageRegistry.delete(pageNumber);
}

/**
 * Gets a 404 error page for invalid page numbers
 * Requirements: 5.3 - Beautiful 404 error page
 * 
 * @param pageNumber - The invalid page number
 * @returns A 404 error page
 */
export function get404Page(pageNumber: string): TeletextPage {
  return create404ErrorPage(pageNumber);
}

/**
 * Gets a "Coming Soon" page for unimplemented but valid page numbers
 * Requirements: 6.5 - Handle unimplemented pages gracefully
 * 
 * @param pageNumber - The unimplemented page number
 * @returns A coming soon page with navigation hints
 */
export function getComingSoonPage(pageNumber: string): TeletextPage {
  return createGenericComingSoonPage(pageNumber);
}
