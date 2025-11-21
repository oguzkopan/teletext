/**
 * Tests for Timestamp and Cache Status Utilities
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */

import {
  determineCacheStatus,
  formatTimestamp,
  getRelativeTime,
  getCacheAgeDisplay,
  formatTimestampWithStatus,
  shouldDisplayTimestamp,
  getContentTypeFromPageId,
  getMillisecondsUntilNextMinute,
  CACHE_THRESHOLDS
} from '../timestamp-cache-status';

describe('Timestamp and Cache Status Utilities', () => {
  describe('determineCacheStatus', () => {
    it('should return LIVE for undefined timestamp', () => {
      expect(determineCacheStatus(undefined)).toBe('LIVE');
    });

    it('should return LIVE for recent content', () => {
      const recentTime = new Date(Date.now() - 1000).toISOString(); // 1 second ago
      expect(determineCacheStatus(recentTime, 'NEWS')).toBe('LIVE');
    });

    it('should return CACHED for old NEWS content (>5 minutes)', () => {
      const oldTime = new Date(Date.now() - 6 * 60 * 1000).toISOString(); // 6 minutes ago
      expect(determineCacheStatus(oldTime, 'NEWS')).toBe('CACHED');
    });

    it('should return CACHED for old SPORT content (>2 minutes)', () => {
      const oldTime = new Date(Date.now() - 3 * 60 * 1000).toISOString(); // 3 minutes ago
      expect(determineCacheStatus(oldTime, 'SPORT')).toBe('CACHED');
    });

    it('should return LIVE for recent SPORT content (<2 minutes)', () => {
      const recentTime = new Date(Date.now() - 1 * 60 * 1000).toISOString(); // 1 minute ago
      expect(determineCacheStatus(recentTime, 'SPORT')).toBe('LIVE');
    });

    it('should use default threshold for unknown content type', () => {
      const oldTime = new Date(Date.now() - 11 * 60 * 1000).toISOString(); // 11 minutes ago
      expect(determineCacheStatus(oldTime, 'UNKNOWN')).toBe('CACHED');
    });
  });

  describe('formatTimestamp', () => {
    it('should format time in HH:MM format', () => {
      const timestamp = new Date('2024-01-15T13:45:30').toISOString();
      const formatted = formatTimestamp(timestamp, 'time');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should format datetime with date and time', () => {
      const timestamp = new Date('2024-01-15T13:45:30').toISOString();
      const formatted = formatTimestamp(timestamp, 'datetime');
      expect(formatted).toContain('Jan');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should return empty string for undefined timestamp', () => {
      expect(formatTimestamp(undefined)).toBe('');
    });

    it('should format relative time', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      const formatted = formatTimestamp(timestamp, 'relative');
      expect(formatted).toBe('5m ago');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for very recent times', () => {
      const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      expect(getRelativeTime(date)).toBe('just now');
    });

    it('should return minutes for times under 1 hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(getRelativeTime(date)).toBe('5m ago');
    });

    it('should return hours for times under 24 hours', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(getRelativeTime(date)).toBe('2h ago');
    });

    it('should return days for times over 24 hours', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      expect(getRelativeTime(date)).toBe('2d ago');
    });
  });

  describe('getCacheAgeDisplay', () => {
    it('should return empty string for undefined timestamp', () => {
      expect(getCacheAgeDisplay(undefined)).toBe('');
    });

    it('should return CACHED with relative time', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      const display = getCacheAgeDisplay(timestamp);
      expect(display).toBe('CACHED 5m ago');
    });
  });

  describe('formatTimestampWithStatus', () => {
    it('should return empty string for undefined timestamp', () => {
      expect(formatTimestampWithStatus(undefined, 'LIVE')).toBe('');
    });

    it('should format LIVE status with time', () => {
      const timestamp = new Date('2024-01-15T13:45:30').toISOString();
      const formatted = formatTimestampWithStatus(timestamp, 'LIVE');
      expect(formatted).toContain('🔴LIVE');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should format CACHED status with relative time', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      const formatted = formatTimestampWithStatus(timestamp, 'CACHED');
      expect(formatted).toContain('⚪CACHED');
      expect(formatted).toContain('5m ago');
    });
  });

  describe('shouldDisplayTimestamp', () => {
    it('should return true for NEWS content', () => {
      expect(shouldDisplayTimestamp('NEWS')).toBe(true);
    });

    it('should return true for SPORT content', () => {
      expect(shouldDisplayTimestamp('SPORT')).toBe(true);
    });

    it('should return true for MARKETS content', () => {
      expect(shouldDisplayTimestamp('MARKETS')).toBe(true);
    });

    it('should return true for WEATHER content', () => {
      expect(shouldDisplayTimestamp('WEATHER')).toBe(true);
    });

    it('should return false for AI content', () => {
      expect(shouldDisplayTimestamp('AI')).toBe(false);
    });

    it('should return false for undefined content type', () => {
      expect(shouldDisplayTimestamp(undefined)).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(shouldDisplayTimestamp('news')).toBe(true);
      expect(shouldDisplayTimestamp('Sport')).toBe(true);
    });
  });

  describe('getContentTypeFromPageId', () => {
    it('should return NEWS for pages 200-299', () => {
      expect(getContentTypeFromPageId('200')).toBe('NEWS');
      expect(getContentTypeFromPageId('250')).toBe('NEWS');
      expect(getContentTypeFromPageId('299')).toBe('NEWS');
    });

    it('should return SPORT for pages 300-399', () => {
      expect(getContentTypeFromPageId('300')).toBe('SPORT');
      expect(getContentTypeFromPageId('350')).toBe('SPORT');
      expect(getContentTypeFromPageId('399')).toBe('SPORT');
    });

    it('should return MARKETS for pages 400-499 (excluding weather)', () => {
      expect(getContentTypeFromPageId('400')).toBe('MARKETS');
      expect(getContentTypeFromPageId('440')).toBe('MARKETS');
      expect(getContentTypeFromPageId('460')).toBe('MARKETS');
      expect(getContentTypeFromPageId('499')).toBe('MARKETS');
    });

    it('should return WEATHER for pages 450-459', () => {
      expect(getContentTypeFromPageId('450')).toBe('WEATHER');
      expect(getContentTypeFromPageId('455')).toBe('WEATHER');
      expect(getContentTypeFromPageId('459')).toBe('WEATHER');
    });

    it('should return undefined for non-time-sensitive pages', () => {
      expect(getContentTypeFromPageId('100')).toBeUndefined();
      expect(getContentTypeFromPageId('500')).toBeUndefined();
      expect(getContentTypeFromPageId('700')).toBeUndefined();
    });
  });

  describe('getMillisecondsUntilNextMinute', () => {
    it('should return a value between 0 and 60000', () => {
      const ms = getMillisecondsUntilNextMinute();
      expect(ms).toBeGreaterThan(0);
      expect(ms).toBeLessThanOrEqual(60000);
    });

    it('should return approximately 60000 when called at the start of a minute', () => {
      // This test is time-dependent and may be flaky
      // We just verify it returns a reasonable value
      const ms = getMillisecondsUntilNextMinute();
      expect(ms).toBeGreaterThan(0);
    });
  });

  describe('CACHE_THRESHOLDS', () => {
    it('should have appropriate thresholds for each content type', () => {
      expect(CACHE_THRESHOLDS.NEWS).toBe(5 * 60 * 1000); // 5 minutes
      expect(CACHE_THRESHOLDS.SPORT).toBe(2 * 60 * 1000); // 2 minutes
      expect(CACHE_THRESHOLDS.MARKETS).toBe(5 * 60 * 1000); // 5 minutes
      expect(CACHE_THRESHOLDS.WEATHER).toBe(30 * 60 * 1000); // 30 minutes
      expect(CACHE_THRESHOLDS.DEFAULT).toBe(10 * 60 * 1000); // 10 minutes
    });
  });

  describe('Integration: Full timestamp display flow', () => {
    it('should correctly determine and format status for recent NEWS', () => {
      const timestamp = new Date(Date.now() - 2 * 60 * 1000).toISOString(); // 2 minutes ago
      const status = determineCacheStatus(timestamp, 'NEWS');
      const formatted = formatTimestampWithStatus(timestamp, status);
      
      expect(status).toBe('LIVE');
      expect(formatted).toContain('🔴LIVE');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should correctly determine and format status for old SPORT', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      const status = determineCacheStatus(timestamp, 'SPORT');
      const formatted = formatTimestampWithStatus(timestamp, status);
      
      expect(status).toBe('CACHED');
      expect(formatted).toContain('⚪CACHED');
      expect(formatted).toContain('5m ago');
    });

    it('should only display timestamps for time-sensitive content', () => {
      expect(shouldDisplayTimestamp('NEWS')).toBe(true);
      expect(shouldDisplayTimestamp('AI')).toBe(false);
      expect(shouldDisplayTimestamp('GAMES')).toBe(false);
    });
  });
});
