/**
 * Integration Tests for Timestamp and Cache Status System
 * 
 * Tests the complete flow from page creation through layout processing
 * to timestamp display in headers.
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */

import { TeletextPage } from '@/types/teletext';
import { pageLayoutProcessor } from '../page-layout-processor';
import { determineCacheStatus } from '../timestamp-cache-status';

describe('Timestamp and Cache Status Integration', () => {
  describe('News Page with LIVE Status', () => {
    it('should display LIVE indicator for recent news', () => {
      const recentTimestamp = new Date(Date.now() - 2 * 60 * 1000).toISOString(); // 2 minutes ago
      
      const newsPage: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(20).fill('News content here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: recentTimestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(newsPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header contains LIVE indicator
      expect(processedPage.rows[1]).toContain('🔴LIVE');
      // Check that time is displayed
      expect(processedPage.rows[1]).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('Sports Page with CACHED Status', () => {
    it('should display CACHED indicator for old sports scores', () => {
      // Use 10 minutes ago to ensure it's definitely cached (SPORT threshold is 2 minutes)
      const oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago
      
      const sportsPage: TeletextPage = {
        id: '301',
        title: 'Live Scores',
        rows: Array(20).fill('Match results here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: oldTimestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(sportsPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header contains CACHED indicator
      expect(processedPage.rows[1]).toContain('⚪CACHED');
      // Check that relative time is displayed
      expect(processedPage.rows[1]).toMatch(/\d+m ago/);
    });
  });

  describe('Markets Page with Timestamp', () => {
    it('should display timestamp for market data', () => {
      const timestamp = new Date().toISOString();
      
      const marketsPage: TeletextPage = {
        id: '401',
        title: 'Stock Market',
        rows: Array(20).fill('Market data here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'MarketsAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(marketsPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header contains status indicator
      expect(processedPage.rows[1]).toMatch(/🔴LIVE|⚪CACHED/);
    });
  });

  describe('Weather Page with Timestamp', () => {
    it('should display timestamp for weather data', () => {
      const timestamp = new Date().toISOString();
      
      const weatherPage: TeletextPage = {
        id: '451',
        title: 'Weather Forecast',
        rows: Array(20).fill('Weather data here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'WeatherAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(weatherPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header contains status indicator
      expect(processedPage.rows[1]).toMatch(/🔴LIVE|⚪CACHED/);
    });
  });

  describe('Non-Time-Sensitive Pages', () => {
    it('should NOT display timestamp for AI pages', () => {
      const timestamp = new Date().toISOString();
      
      const aiPage: TeletextPage = {
        id: '501',
        title: 'AI Oracle',
        rows: Array(20).fill('AI content here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'AIAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(aiPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header does NOT contain timestamp indicators
      expect(processedPage.rows[1]).not.toContain('LIVE');
      expect(processedPage.rows[1]).not.toContain('CACHED');
      // Should just be a separator
      expect(processedPage.rows[1]).toMatch(/^═+$/);
    });

    it('should NOT display timestamp for games pages', () => {
      const timestamp = new Date().toISOString();
      
      const gamesPage: TeletextPage = {
        id: '601',
        title: 'Quiz Game',
        rows: Array(20).fill('Game content here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'GamesAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(gamesPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header does NOT contain timestamp indicators
      expect(processedPage.rows[1]).not.toContain('LIVE');
      expect(processedPage.rows[1]).not.toContain('CACHED');
    });
  });

  describe('Cache Status Determination', () => {
    it('should correctly determine LIVE status for fresh NEWS', () => {
      const freshTimestamp = new Date(Date.now() - 3 * 60 * 1000).toISOString(); // 3 minutes ago
      const status = determineCacheStatus(freshTimestamp, 'NEWS');
      expect(status).toBe('LIVE');
    });

    it('should correctly determine CACHED status for old NEWS', () => {
      const oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago
      const status = determineCacheStatus(oldTimestamp, 'NEWS');
      expect(status).toBe('CACHED');
    });

    it('should correctly determine LIVE status for fresh SPORT', () => {
      const freshTimestamp = new Date(Date.now() - 1 * 60 * 1000).toISOString(); // 1 minute ago
      const status = determineCacheStatus(freshTimestamp, 'SPORT');
      expect(status).toBe('LIVE');
    });

    it('should correctly determine CACHED status for old SPORT', () => {
      const oldTimestamp = new Date(Date.now() - 3 * 60 * 1000).toISOString(); // 3 minutes ago
      const status = determineCacheStatus(oldTimestamp, 'SPORT');
      expect(status).toBe('CACHED');
    });
  });

  describe('Multi-Page Content Priority', () => {
    it('should prioritize page position over timestamp', () => {
      const timestamp = new Date().toISOString();
      
      const multiPage: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(20).fill('News content here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: timestamp,
          continuation: {
            currentPage: '201',
            nextPage: '202',
            previousPage: undefined,
            totalPages: 3,
            currentIndex: 0
          }
        }
      };

      const processedPage = pageLayoutProcessor.processPage(multiPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that header shows page position, not timestamp
      expect(processedPage.rows[1]).toContain('1/3');
      expect(processedPage.rows[1]).not.toContain('LIVE');
    });
  });

  describe('Breadcrumbs Priority', () => {
    it('should prioritize breadcrumbs over timestamp', () => {
      const timestamp = new Date().toISOString();
      
      const newsPage: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(20).fill('News content here'.padEnd(40)),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(newsPage, {
        breadcrumbs: ['100', '200', '201'],
        enableFullScreen: true
      });

      // Check that header shows breadcrumbs, not timestamp
      expect(processedPage.rows[1]).toContain('100 > 200 > 201');
      expect(processedPage.rows[1]).not.toContain('LIVE');
    });
  });

  describe('Header Layout Consistency', () => {
    it('should maintain 40-character width with timestamp', () => {
      const timestamp = new Date().toISOString();
      
      const newsPage: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(20).fill('News content here'.padEnd(40)),
        links: [],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(newsPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that all rows are exactly 40 characters
      processedPage.rows.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should maintain 24-row layout with timestamp', () => {
      const timestamp = new Date().toISOString();
      
      const newsPage: TeletextPage = {
        id: '201',
        title: 'Breaking News',
        rows: Array(20).fill('News content here'.padEnd(40)),
        links: [],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: timestamp
        }
      };

      const processedPage = pageLayoutProcessor.processPage(newsPage, {
        breadcrumbs: [],
        enableFullScreen: true
      });

      // Check that page has exactly 24 rows
      expect(processedPage.rows.length).toBe(24);
    });
  });
});
