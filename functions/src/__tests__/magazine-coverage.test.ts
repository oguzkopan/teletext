/**
 * Magazine Coverage Test
 * Verifies that all magazine sections have meaningful content
 * Requirements: 39.1, 39.2, 39.3, 39.4, 39.5
 * 
 * Note: AIAdapter and GamesAdapter tests are skipped in this file because they require
 * Firebase Admin initialization. These adapters are fully tested in their dedicated
 * test files (AIAdapter.test.ts and GamesAdapter.test.ts) which properly initialize
 * Firebase Admin.
 */

import { StaticAdapter } from '../adapters/StaticAdapter';
import { NewsAdapter } from '../adapters/NewsAdapter';
import { SportsAdapter } from '../adapters/SportsAdapter';
import { MarketsAdapter } from '../adapters/MarketsAdapter';
import { AIAdapter } from '../adapters/AIAdapter';
import { GamesAdapter } from '../adapters/GamesAdapter';
import { SettingsAdapter } from '../adapters/SettingsAdapter';
import { DevAdapter } from '../adapters/DevAdapter';

describe('Magazine Coverage - Requirement 39', () => {
  describe('Magazine Index Pages', () => {
    it('should have working index page 100 (System)', async () => {
      const adapter = new StaticAdapter();
      const page = await adapter.getPage('100');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('100');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should have working index page 200 (News)', async () => {
      const adapter = new NewsAdapter();
      const page = await adapter.getPage('200');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('200');
      expect(page.rows).toHaveLength(24);
    });

    it('should have working index page 300 (Sports)', async () => {
      const adapter = new SportsAdapter();
      const page = await adapter.getPage('300');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('300');
      expect(page.rows).toHaveLength(24);
    });

    it('should have working index page 400 (Markets) - Requirement 39.1', async () => {
      const adapter = new MarketsAdapter();
      const page = await adapter.getPage('400');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('400');
      expect(page.rows).toHaveLength(24);
      expect(page.title).toContain('Markets');
    });

    it.skip('should have working index page 500 (AI Oracle) - Requirement 39.2', async () => {
      // Skipped: Requires Firebase Admin initialization
      const adapter = new AIAdapter();
      const page = await adapter.getPage('500');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('500');
      expect(page.rows).toHaveLength(24);
      expect(page.title).toContain('AI');
    });

    it.skip('should have working index page 600 (Games)', async () => {
      // Skipped: Requires Firebase Admin initialization
      const adapter = new GamesAdapter();
      const page = await adapter.getPage('600');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('600');
      expect(page.rows).toHaveLength(24);
    });

    it('should have working index page 700 (Settings)', async () => {
      const adapter = new SettingsAdapter();
      const page = await adapter.getPage('700');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('700');
      expect(page.rows).toHaveLength(24);
    });

    it('should have working index page 800 (Dev Tools)', async () => {
      const adapter = new DevAdapter();
      const page = await adapter.getPage('800');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('800');
      expect(page.rows).toHaveLength(24);
    });
  });

  describe('Magazine Sub-Pages - Requirement 39.3', () => {
    it('should have at least 3 sub-pages in System (1xx)', async () => {
      const adapter = new StaticAdapter();
      const pages = ['100', '101', '110', '120', '199', '999'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 sub-pages in News (2xx)', async () => {
      const adapter = new NewsAdapter();
      const pages = ['200', '201', '202', '203', '210'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 sub-pages in Sports (3xx)', async () => {
      const adapter = new SportsAdapter();
      const pages = ['300', '301', '302', '310'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 sub-pages in Markets (4xx) - Requirement 39.1', async () => {
      const adapter = new MarketsAdapter();
      const pages = ['400', '401', '402', '410'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it.skip('should have at least 3 sub-pages in AI Oracle (5xx) - Requirement 39.2', async () => {
      // Skipped: Requires Firebase Admin initialization
      const adapter = new AIAdapter();
      const pages = ['500', '505', '510', '520'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it.skip('should have at least 3 sub-pages in Games (6xx)', async () => {
      // Skipped: Requires Firebase Admin initialization
      const adapter = new GamesAdapter();
      const pages = ['600', '601', '610', '620'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 sub-pages in Settings (7xx)', async () => {
      const adapter = new SettingsAdapter();
      const pages = ['700', '701', '710', '720'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });

    it('should have at least 3 sub-pages in Dev Tools (8xx)', async () => {
      const adapter = new DevAdapter();
      const pages = ['800', '801', '802', '803'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
      }
      
      expect(pages.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Markets Content - Requirement 39.1', () => {
    it('should display cryptocurrency data on page 401', async () => {
      const adapter = new MarketsAdapter();
      const page = await adapter.getPage('401');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('401');
      expect(page.title).toContain('Cryptocurrency');
      
      // Check that page contains crypto-related content
      const content = page.rows.join(' ');
      expect(content).toMatch(/BTC|ETH|CRYPTO|PRICE/i);
    });

    it('should display stock data on page 402', async () => {
      const adapter = new MarketsAdapter();
      const page = await adapter.getPage('402');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('402');
      expect(page.title).toContain('Stock');
      
      // Check that page contains stock-related content
      const content = page.rows.join(' ');
      expect(content).toMatch(/STOCK|MARKET|PRICE|AAPL|MSFT/i);
    });

    it('should display forex rates on page 410', async () => {
      const adapter = new MarketsAdapter();
      const page = await adapter.getPage('410');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('410');
      expect(page.title).toContain('Exchange');
      
      // Check that page contains forex-related content
      const content = page.rows.join(' ');
      expect(content).toMatch(/USD|EUR|GBP|EXCHANGE|RATE/i);
    });
  });

  describe('AI Oracle Content - Requirement 39.2', () => {
    // Note: AIAdapter tests are skipped because they require Firebase Admin initialization
    // These are tested in the dedicated AIAdapter.test.ts file
    it.skip('should display AI menu on page 500', async () => {
      const adapter = new AIAdapter();
      const page = await adapter.getPage('500');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('500');
      expect(page.title).toContain('AI');
      
      // Check that page contains AI-related content
      const content = page.rows.join(' ');
      expect(content).toMatch(/AI|ORACLE|GEMINI|Q&A|ASSISTANT/i);
    });

    it.skip('should have Q&A service on page 510', async () => {
      const adapter = new AIAdapter();
      const page = await adapter.getPage('510');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('510');
      
      // Check that page contains Q&A content
      const content = page.rows.join(' ');
      expect(content).toMatch(/Q&A|QUESTION|TOPIC|SELECT/i);
    });

    it.skip('should have spooky story generator on page 505', async () => {
      const adapter = new AIAdapter();
      const page = await adapter.getPage('505');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('505');
      
      // Check that page contains story generator content
      const content = page.rows.join(' ');
      expect(content).toMatch(/SPOOKY|STORY|HORROR|THEME/i);
    });

    it.skip('should have conversation history on page 520', async () => {
      const adapter = new AIAdapter();
      const page = await adapter.getPage('520');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('520');
      
      // Check that page contains conversation history content
      const content = page.rows.join(' ');
      expect(content).toMatch(/CONVERSATION|HISTORY|RECENT/i);
    });
  });

  describe('Fallback Content - Requirement 39.4', () => {
    it('should provide sample data when APIs are unavailable', async () => {
      // Markets adapter should have mock data
      const marketsAdapter = new MarketsAdapter();
      const cryptoPage = await marketsAdapter.getPage('401');
      
      expect(cryptoPage).toBeDefined();
      expect(cryptoPage.rows).toHaveLength(24);
      
      // Even if API fails, should show mock data
      const content = cryptoPage.rows.join(' ');
      expect(content.length).toBeGreaterThan(0);
    });

    it('should show helpful error messages when services are unavailable', async () => {
      // Markets adapter should handle invalid pages gracefully
      const marketsAdapter = new MarketsAdapter();
      
      // Test with a placeholder page in the valid range
      const page = await marketsAdapter.getPage('450');
      expect(page).toBeDefined();
      expect(page.rows).toHaveLength(24);
      
      // Should show "COMING SOON" or similar message
      const content = page.rows.join(' ');
      expect(content).toMatch(/COMING SOON|UNDER CONSTRUCTION/i);
    });
  });

  describe('Every Magazine Has Working Content - Requirement 39.5', () => {
    it('should have at least one working content page in each magazine', async () => {
      const testPages = [
        { adapter: new StaticAdapter(), pageId: '100', name: 'System' },
        { adapter: new NewsAdapter(), pageId: '201', name: 'News' },
        { adapter: new SportsAdapter(), pageId: '301', name: 'Sports' },
        { adapter: new MarketsAdapter(), pageId: '401', name: 'Markets' },
        // AIAdapter and GamesAdapter skipped due to Firebase Admin requirement
        { adapter: new SettingsAdapter(), pageId: '700', name: 'Settings' },
        { adapter: new DevAdapter(), pageId: '801', name: 'Dev' }
      ];
      
      for (const test of testPages) {
        const page = await test.adapter.getPage(test.pageId);
        expect(page).toBeDefined();
        expect(page.rows).toHaveLength(24);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
      }
    });
  });
});
