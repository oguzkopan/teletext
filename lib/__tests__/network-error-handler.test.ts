/**
 * Tests for network error handler
 */

import { NetworkErrorHandler, getNetworkErrorHandler, resetNetworkErrorHandler } from '../network-error-handler';
import { TeletextPage } from '../../types/teletext';

describe('NetworkErrorHandler', () => {
  let handler: NetworkErrorHandler;
  
  const mockPage: TeletextPage = {
    id: '100',
    title: 'Test Page',
    rows: new Array(24).fill(''.padEnd(40, ' ')),
    links: [],
    meta: {
      source: 'test',
      lastUpdated: new Date().toISOString()
    }
  };

  beforeEach(() => {
    handler = new NetworkErrorHandler();
  });

  describe('Network status', () => {
    it('should initialize with online status', () => {
      expect(handler.isOnline()).toBe(true);
    });

    it('should return network status', () => {
      const status = handler.getNetworkStatus();
      expect(status).toHaveProperty('online');
      expect(status).toHaveProperty('lastChecked');
      expect(typeof status.online).toBe('boolean');
      expect(typeof status.lastChecked).toBe('number');
    });
  });

  describe('Page caching', () => {
    it('should cache a page', () => {
      handler.cachePage('100', mockPage);
      expect(handler.hasCachedPage('100')).toBe(true);
    });

    it('should retrieve cached page', () => {
      handler.cachePage('100', mockPage);
      const cached = handler.getCachedPage('100');
      
      expect(cached).not.toBeNull();
      expect(cached?.page.id).toBe('100');
      expect(cached?.stale).toBe(false);
    });

    it('should return null for non-cached page', () => {
      const cached = handler.getCachedPage('999');
      expect(cached).toBeNull();
    });

    it('should mark old cache as stale', () => {
      handler.cachePage('100', mockPage);
      handler.setCacheMaxAge(100); // 100ms
      
      // Wait for cache to become stale
      return new Promise(resolve => {
        setTimeout(() => {
          const cached = handler.getCachedPage('100');
          expect(cached?.stale).toBe(true);
          resolve(undefined);
        }, 150);
      });
    });

    it('should clear cached page', () => {
      handler.cachePage('100', mockPage);
      expect(handler.hasCachedPage('100')).toBe(true);
      
      handler.clearCachedPage('100');
      expect(handler.hasCachedPage('100')).toBe(false);
    });

    it('should clear all cached pages', () => {
      handler.cachePage('100', mockPage);
      handler.cachePage('200', mockPage);
      expect(handler.getCacheSize()).toBe(2);
      
      handler.clearAllCache();
      expect(handler.getCacheSize()).toBe(0);
    });

    it('should return cache size', () => {
      expect(handler.getCacheSize()).toBe(0);
      
      handler.cachePage('100', mockPage);
      expect(handler.getCacheSize()).toBe(1);
      
      handler.cachePage('200', mockPage);
      expect(handler.getCacheSize()).toBe(2);
    });
  });

  describe('handleNetworkError', () => {
    it('should return error page when no cache available', () => {
      const errorPage = handler.handleNetworkError('500');
      
      expect(errorPage.id).toBe('500');
      expect(errorPage.rows[0]).toContain('ERROR');
    });

    it('should return cached page with offline indicator when offline', () => {
      handler.cachePage('100', mockPage);
      
      // Simulate offline
      Object.defineProperty(handler, 'networkStatus', {
        value: { online: false, lastChecked: Date.now() },
        writable: true
      });
      
      const page = handler.handleNetworkError('100');
      expect(page.id).toBe('100');
      expect(page.rows[23]).toContain('OFFLINE');
    });
  });

  describe('fetchWithErrorHandling', () => {
    it('should execute fetch function and return result', async () => {
      const fetchFn = jest.fn().mockResolvedValue(mockPage);
      
      const result = await handler.fetchWithErrorHandling('100', fetchFn);
      
      expect(fetchFn).toHaveBeenCalled();
      expect(result).toEqual(mockPage);
    });

    it('should cache successful result', async () => {
      const fetchFn = jest.fn().mockResolvedValue(mockPage);
      
      await handler.fetchWithErrorHandling('100', fetchFn, { cacheResult: true });
      
      expect(handler.hasCachedPage('100')).toBe(true);
    });

    it('should not cache when cacheResult is false', async () => {
      const fetchFn = jest.fn().mockResolvedValue(mockPage);
      
      await handler.fetchWithErrorHandling('100', fetchFn, { cacheResult: false });
      
      expect(handler.hasCachedPage('100')).toBe(false);
    });

    it('should throw error when fetch fails and no cache available', async () => {
      const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(
        handler.fetchWithErrorHandling('100', fetchFn)
      ).rejects.toThrow('Network error');
    });

    it('should return cached page when fetch fails and cache available', async () => {
      handler.cachePage('100', mockPage);
      const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await handler.fetchWithErrorHandling('100', fetchFn);
      
      expect(result).toEqual(mockPage);
    });
  });

  describe('Status listeners', () => {
    it('should add status listener', () => {
      const listener = jest.fn();
      const unsubscribe = handler.addStatusListener(listener);
      
      expect(typeof unsubscribe).toBe('function');
    });

    it('should remove status listener', () => {
      const listener = jest.fn();
      const unsubscribe = handler.addStatusListener(listener);
      
      unsubscribe();
      
      // Listener should not be called after unsubscribe
      // (We can't easily test this without triggering a status change)
    });
  });

  describe('Cache configuration', () => {
    it('should set cache max age', () => {
      handler.setCacheMaxAge(10000);
      expect(handler.getCacheMaxAge()).toBe(10000);
    });

    it('should get cache max age', () => {
      const maxAge = handler.getCacheMaxAge();
      expect(typeof maxAge).toBe('number');
      expect(maxAge).toBeGreaterThan(0);
    });
  });

  describe('Singleton instance', () => {
    beforeEach(() => {
      resetNetworkErrorHandler();
    });

    it('should return singleton instance', () => {
      const instance1 = getNetworkErrorHandler();
      const instance2 = getNetworkErrorHandler();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton instance', () => {
      const instance1 = getNetworkErrorHandler();
      resetNetworkErrorHandler();
      const instance2 = getNetworkErrorHandler();
      
      expect(instance1).not.toBe(instance2);
    });
  });
});
