/**
 * Tests for environment variable validation
 * Requirements: 38.1, 38.2, 38.3, 38.4, 38.5
 */

import {
  validateEnvironmentVariables,
  isApiKeyConfigured,
  getEnvVarInfo,
  getMissingApiKeyMessage,
  createMissingApiKeyPage,
  isFeatureAvailable,
  getMissingKeysForPage
} from '../env-validation';

describe('Environment Variable Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('validateEnvironmentVariables', () => {
    it('should detect missing Firebase configuration', () => {
      // Remove Firebase keys
      delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      const result = validateEnvironmentVariables();

      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
      expect(result.missing.some(m => m.key === 'NEXT_PUBLIC_FIREBASE_API_KEY')).toBe(true);
    });

    it('should detect missing optional API keys as warnings', () => {
      // Set required keys but remove optional ones
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456';
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
      
      delete process.env.NEWS_API_KEY;
      delete process.env.SPORTS_API_KEY;

      const result = validateEnvironmentVariables();

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.key === 'NEWS_API_KEY')).toBe(true);
    });

    it('should pass validation when all required keys are set', () => {
      // Set all required keys
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456';
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const result = validateEnvironmentVariables();

      expect(result.valid).toBe(true);
      expect(result.missing.length).toBe(0);
    });
  });

  describe('isApiKeyConfigured', () => {
    it('should return false for missing keys', () => {
      delete process.env.NEWS_API_KEY;
      expect(isApiKeyConfigured('NEWS_API_KEY')).toBe(false);
    });

    it('should return false for empty keys', () => {
      process.env.NEWS_API_KEY = '';
      expect(isApiKeyConfigured('NEWS_API_KEY')).toBe(false);
    });

    it('should return false for placeholder keys', () => {
      process.env.NEWS_API_KEY = 'your_key_here';
      expect(isApiKeyConfigured('NEWS_API_KEY')).toBe(false);
    });

    it('should return true for valid keys', () => {
      process.env.NEWS_API_KEY = 'actual-api-key-12345';
      expect(isApiKeyConfigured('NEWS_API_KEY')).toBe(true);
    });
  });

  describe('getEnvVarInfo', () => {
    it('should return info for known environment variables', () => {
      const info = getEnvVarInfo('NEWS_API_KEY');
      
      expect(info).not.toBeNull();
      expect(info?.key).toBe('NEWS_API_KEY');
      expect(info?.description).toBeTruthy();
      expect(info?.setupUrl).toBeTruthy();
      expect(info?.affectedPages).toBeTruthy();
    });

    it('should return null for unknown variables', () => {
      const info = getEnvVarInfo('UNKNOWN_KEY');
      expect(info).toBeNull();
    });
  });

  describe('getMissingApiKeyMessage', () => {
    it('should return detailed message for known API keys', () => {
      const message = getMissingApiKeyMessage('NEWS_API_KEY');
      
      expect(message).toContain('NEWS_API_KEY');
      expect(message).toContain('newsapi.org');
      expect(message).toContain('News pages (200-299)');
    });

    it('should return generic message for unknown keys', () => {
      const message = getMissingApiKeyMessage('UNKNOWN_KEY');
      
      expect(message).toContain('UNKNOWN_KEY');
      expect(message).toContain('.env.example');
    });
  });

  describe('createMissingApiKeyPage', () => {
    it('should create exactly 24 rows', () => {
      const page = createMissingApiKeyPage('NEWS_API_KEY', '201');
      expect(page).toHaveLength(24);
    });

    it('should create rows with exactly 40 characters', () => {
      const page = createMissingApiKeyPage('NEWS_API_KEY', '201');
      
      page.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should include page number in header', () => {
      const page = createMissingApiKeyPage('NEWS_API_KEY', '201');
      expect(page[0]).toContain('201');
    });

    it('should include setup URL', () => {
      const page = createMissingApiKeyPage('NEWS_API_KEY', '201');
      const pageText = page.join('\n');
      
      expect(pageText).toContain('newsapi.org');
    });

    it('should include navigation instructions', () => {
      const page = createMissingApiKeyPage('NEWS_API_KEY', '201');
      const lastRows = page.slice(-3).join('\n');
      
      expect(lastRows).toContain('100');
    });
  });

  describe('isFeatureAvailable', () => {
    it('should return false when news API key is missing', () => {
      delete process.env.NEWS_API_KEY;
      expect(isFeatureAvailable('news')).toBe(false);
    });

    it('should return true when news API key is configured', () => {
      process.env.NEWS_API_KEY = 'valid-key-12345';
      expect(isFeatureAvailable('news')).toBe(true);
    });

    it('should return false for unknown features', () => {
      expect(isFeatureAvailable('unknown')).toBe(false);
    });
  });

  describe('getMissingKeysForPage', () => {
    beforeEach(() => {
      // Clear all API keys
      delete process.env.NEWS_API_KEY;
      delete process.env.SPORTS_API_KEY;
      delete process.env.ALPHA_VANTAGE_API_KEY;
      delete process.env.OPENWEATHER_API_KEY;
      delete process.env.GOOGLE_CLOUD_PROJECT;
    });

    it('should detect missing NEWS_API_KEY for news pages', () => {
      const missing = getMissingKeysForPage(201);
      
      expect(missing.length).toBe(1);
      expect(missing[0].key).toBe('NEWS_API_KEY');
    });

    it('should detect missing SPORTS_API_KEY for sports pages', () => {
      const missing = getMissingKeysForPage(301);
      
      expect(missing.length).toBe(1);
      expect(missing[0].key).toBe('SPORTS_API_KEY');
    });

    it('should detect missing ALPHA_VANTAGE_API_KEY for stock pages', () => {
      const missing = getMissingKeysForPage(402);
      
      expect(missing.length).toBe(1);
      expect(missing[0].key).toBe('ALPHA_VANTAGE_API_KEY');
    });

    it('should detect missing OPENWEATHER_API_KEY for weather pages', () => {
      const missing = getMissingKeysForPage(425);
      
      expect(missing.length).toBe(1);
      expect(missing[0].key).toBe('OPENWEATHER_API_KEY');
    });

    it('should detect missing GOOGLE_CLOUD_PROJECT for AI pages', () => {
      const missing = getMissingKeysForPage(501);
      
      expect(missing.length).toBe(1);
      expect(missing[0].key).toBe('GOOGLE_CLOUD_PROJECT');
    });

    it('should return empty array when API key is configured', () => {
      process.env.NEWS_API_KEY = 'valid-key';
      const missing = getMissingKeysForPage(201);
      
      expect(missing.length).toBe(0);
    });

    it('should return empty array for pages that do not require API keys', () => {
      const missing = getMissingKeysForPage(100); // Index page
      expect(missing.length).toBe(0);
    });
  });
});
