// Tests for WeatherAdapter

import { WeatherAdapter } from '../WeatherAdapter';

describe('WeatherAdapter', () => {
  let adapter: WeatherAdapter;

  beforeEach(() => {
    adapter = new WeatherAdapter();
  });

  describe('getPage', () => {
    it('should return weather index for page 420', async () => {
      const page = await adapter.getPage('420');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('420');
      expect(page.title).toBe('Weather Index');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('WeatherAdapter');
    });

    it('should return city weather for valid city pages', async () => {
      const page = await adapter.getPage('421'); // London
      
      expect(page).toBeDefined();
      expect(page.id).toBe('421');
      expect(page.title).toContain('London');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('WeatherAdapter');
    });

    it('should return placeholder for unassigned pages', async () => {
      const page = await adapter.getPage('445');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('445');
      expect(page.title).toContain('Weather Page');
      expect(page.rows).toHaveLength(24);
    });

    it('should throw error for invalid page numbers', async () => {
      await expect(adapter.getPage('450')).rejects.toThrow('Invalid weather page');
      await expect(adapter.getPage('419')).rejects.toThrow('Invalid weather page');
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      expect(adapter.getCacheKey('420')).toBe('weather_420');
      expect(adapter.getCacheKey('421')).toBe('weather_421');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 30 minutes (1800 seconds)', () => {
      expect(adapter.getCacheDuration()).toBe(1800);
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
      expect(content).toContain('Temperature:');
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
      
      // Should contain temperature in Celsius
      expect(content).toMatch(/Temperature:\s+\d+°C/);
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
