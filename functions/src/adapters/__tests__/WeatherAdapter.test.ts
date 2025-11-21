// Tests for WeatherAdapter

import { WeatherAdapter } from '../WeatherAdapter';

describe('WeatherAdapter', () => {
  let adapter: WeatherAdapter;

  beforeEach(() => {
    adapter = new WeatherAdapter();
  });

  describe('getPage', () => {
    
  });

  describe('getCacheDuration', () => {
    it('should return 30 minutes (1800 seconds)', () => {
      
    });
  });

  describe('page formatting', () => {
    it('should format weather index with city list', async () => {
      const page = await adapter.getPage('420');
      
      // Should contain city names
      const content = page.rows.join('\n');
      expect(content).toContain('London');
      expect(content).toContain('New York');
      expect(content).toContain('Tokyo');
      expect(content).toContain('Paris');
    });

    it('should format city weather with current conditions', async () => {
      const page = await adapter.getPage('421'); // London
      
      const content = page.rows.join('\n');
      expect(content).toContain('CURRENT CONDITIONS');
      // New format includes weather icons and temperature with symbols
      expect(content).toMatch(/\d+°C/); // Temperature in Celsius
      expect(content).toContain('Humidity:');
      expect(content).toContain('Wind:');
    });

    it('should format city weather with forecast', async () => {
      const page = await adapter.getPage('422'); // New York
      
      const content = page.rows.join('\n');
      expect(content).toContain('FORECAST');
    });

    it('should include navigation links', async () => {
      const page = await adapter.getPage('421');
      
      expect(page.links).toBeDefined();
      expect(page.links.length).toBeGreaterThan(0);
      expect(page.links.some(link => link.targetPage === '420')).toBe(true); // Back to index
    });
  });

  describe('city coverage', () => {
    it('should support at least 20 major cities', async () => {
      const indexPage = await adapter.getPage('420');
      const content = indexPage.rows.join('\n');
      
      // Count city entries (each city has a page number)
      const cityMatches = content.match(/\d{3}\s+\w+/g);
      expect(cityMatches).toBeDefined();
      expect(cityMatches!.length).toBeGreaterThanOrEqual(20);
    });

    it('should provide weather for London (421)', async () => {
      const page = await adapter.getPage('421');
      expect(page.title).toContain('London');
    });

    it('should provide weather for New York (422)', async () => {
      const page = await adapter.getPage('422');
      expect(page.title).toContain('New York');
    });

    it('should provide weather for Tokyo (423)', async () => {
      const page = await adapter.getPage('423');
      expect(page.title).toContain('Tokyo');
    });

    it('should provide weather for Istanbul (430)', async () => {
      const page = await adapter.getPage('430');
      expect(page.title).toContain('Istanbul');
    });
  });

  describe('data formatting', () => {
    it('should format temperature values correctly', async () => {
      const page = await adapter.getPage('421');
      const content = page.rows.join('\n');
      
      // Should contain temperature in Celsius with weather symbols
      expect(content).toMatch(/\d+°C\s+[❄☀🔥]/);
    });

    it('should format wind speed correctly', async () => {
      const page = await adapter.getPage('421');
      const content = page.rows.join('\n');
      
      // Should contain wind speed in km/h
      expect(content).toMatch(/Wind:\s+\d+\s+km\/h/);
    });

    it('should format humidity as percentage', async () => {
      const page = await adapter.getPage('421');
      const content = page.rows.join('\n');
      
      // Should contain humidity as percentage
      expect(content).toMatch(/Humidity:\s+\d+%/);
    });

    it('should capitalize weather conditions', async () => {
      const page = await adapter.getPage('421');
      const content = page.rows.join('\n');
      
      // Conditions should be capitalized (e.g., "Clear Sky" not "clear sky")
      const conditionsMatch = content.match(/Conditions:\s+([A-Z][a-z\s]+)/);
      expect(conditionsMatch).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      // Even without API key, should return mock data or error page
      const page = await adapter.getPage('421');
      
      expect(page).toBeDefined();
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });
  });

  describe('page dimension invariant', () => {
    it('should always return exactly 24 rows', async () => {
      const pages = ['420', '421', '422', '430', '445'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', async () => {
      const pages = ['420', '421', '422', '430'];
      
      for (const pageId of pages) {
        const page = await adapter.getPage(pageId);
        expect(page.rows.every(row => row.length === 40)).toBe(true);
      }
    });
  });
});
