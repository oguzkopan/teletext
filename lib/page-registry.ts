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
  createNewsIndexPage, 
  createUKNewsPage, 
  createWorldNewsPage, 
  createLocalNewsPage,
  createNewsArticlePage
} from './news-pages';
import { createSportsIndexPage, createSportsArticlePage } from './sports-pages';
import { createMarketsIndexPage } from './markets-pages';
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
pageRegistry.set('200', createNewsIndexPage);
pageRegistry.set('201', createUKNewsPage);
pageRegistry.set('202', createWorldNewsPage);
pageRegistry.set('203', createLocalNewsPage);

// News article detail pages (200-x, 201-x, 202-x, 203-x)
// Register articles for page 200
for (let i = 1; i <= 3; i++) {
  pageRegistry.set(`200-${i}`, () => createNewsArticlePage('200', i));
}

// Register articles for page 201 (UK News)
for (let i = 1; i <= 5; i++) {
  pageRegistry.set(`201-${i}`, () => createNewsArticlePage('201', i));
}

// Register articles for page 202 (World News)
for (let i = 1; i <= 5; i++) {
  pageRegistry.set(`202-${i}`, () => createNewsArticlePage('202', i));
}

// Register articles for page 203 (Local News)
for (let i = 1; i <= 5; i++) {
  pageRegistry.set(`203-${i}`, () => createNewsArticlePage('203', i));
}

// Sports pages (3xx)
pageRegistry.set('300', createSportsIndexPage);

// Sports article detail pages (300-x)
for (let i = 1; i <= 3; i++) {
  pageRegistry.set(`300-${i}`, () => createSportsArticlePage('300', i));
}

// Markets pages (4xx)
pageRegistry.set('400', createMarketsIndexPage);

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

// Settings pages (7xx)
pageRegistry.set('700', createThemeSelectionPage);
pageRegistry.set('701', createSettingsIndexPage);

// Developer tools (8xx)
pageRegistry.set('800', createDevToolsIndexPage);

// Help page (9xx)
pageRegistry.set('999', createHelpPage);

// Additional placeholder pages for features under construction
// Sports sub-pages (3xx)
pageRegistry.set('301', () => createComingSoonPage('301', 'Football Results & Fixtures', 'Football scores, fixtures, and league tables'));
pageRegistry.set('302', () => createComingSoonPage('302', 'Cricket Scores & Commentary', 'Live cricket scores and match commentary'));
pageRegistry.set('303', () => createComingSoonPage('303', 'Tennis Tournaments & Rankings', 'Tennis tournament results and player rankings'));
pageRegistry.set('304', () => createComingSoonPage('304', 'Live Scores Across All Sports', 'Real-time scores from multiple sports'));

// Markets sub-pages (4xx)
pageRegistry.set('401', () => createComingSoonPage('401', 'Stock Prices & Trading', 'Real-time stock market data and trading information'));
pageRegistry.set('402', () => createComingSoonPage('402', 'Crypto Markets & Digital Assets', 'Cryptocurrency prices and market analysis'));
pageRegistry.set('403', () => createComingSoonPage('403', 'Commodities & Precious Metals', 'Commodity prices including gold, silver, and oil'));
pageRegistry.set('404', () => createComingSoonPage('404', 'Void Page', 'This page is intentionally left blank'));

// Weather pages (4xx)
pageRegistry.set('420', () => createComingSoonPage('420', 'Weather Forecast & Conditions', 'Current weather and 5-day forecast'));
pageRegistry.set('421', () => createComingSoonPage('421', 'London Weather', 'Weather forecast for London'));
pageRegistry.set('422', () => createComingSoonPage('422', 'New York Weather', 'Weather forecast for New York'));
pageRegistry.set('423', () => createComingSoonPage('423', 'Tokyo Weather', 'Weather forecast for Tokyo'));

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
