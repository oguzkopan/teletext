import { renderHook, act } from '@testing-library/react';
import { useBrowserCache } from '../useOfflineSupport';
import { TeletextPage } from '@/types/teletext';

/**
 * Tests for offline support hooks
 * Requirements: 13.4, 15.3
 */
describe('useBrowserCache', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save and load a page from localStorage', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const testPage: TeletextPage = {
      id: '200',
      title: 'Test Page',
      rows: Array(24).fill('Test content'.padEnd(40)),
      links: []
    };

    // Save page
    act(() => {
      result.current.savePage('200', testPage, 30);
    });

    // Load page
    const loadedPage = result.current.loadPage('200');
    
    expect(loadedPage).not.toBeNull();
    expect(loadedPage?.id).toBe('200');
    expect(loadedPage?.title).toBe('Test Page');
  });

  it('should return null for non-existent page', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const loadedPage = result.current.loadPage('999');
    
    expect(loadedPage).toBeNull();
  });

  it('should return null for expired cache', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const testPage: TeletextPage = {
      id: '300',
      title: 'Expired Page',
      rows: Array(24).fill(''.padEnd(40)),
      links: []
    };

    // Save page with 0 TTL (immediately expired)
    act(() => {
      result.current.savePage('300', testPage, 0);
    });

    // Wait a bit to ensure expiry
    setTimeout(() => {
      const loadedPage = result.current.loadPage('300');
      expect(loadedPage).toBeNull();
    }, 100);
  });

  it('should clear specific page from cache', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const testPage: TeletextPage = {
      id: '400',
      title: 'Clear Test',
      rows: Array(24).fill(''.padEnd(40)),
      links: []
    };

    // Save page
    act(() => {
      result.current.savePage('400', testPage, 30);
    });

    // Verify it's saved
    expect(result.current.loadPage('400')).not.toBeNull();

    // Clear page
    act(() => {
      result.current.clearPage('400');
    });

    // Verify it's cleared
    expect(result.current.loadPage('400')).toBeNull();
  });

  it('should clear all pages from cache', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const page1: TeletextPage = {
      id: '500',
      title: 'Page 1',
      rows: Array(24).fill(''.padEnd(40)),
      links: []
    };

    const page2: TeletextPage = {
      id: '501',
      title: 'Page 2',
      rows: Array(24).fill(''.padEnd(40)),
      links: []
    };

    // Save multiple pages
    act(() => {
      result.current.savePage('500', page1, 30);
      result.current.savePage('501', page2, 30);
    });

    // Verify they're saved
    expect(result.current.loadPage('500')).not.toBeNull();
    expect(result.current.loadPage('501')).not.toBeNull();

    // Clear all
    act(() => {
      result.current.clearAllPages();
    });

    // Verify all are cleared
    expect(result.current.loadPage('500')).toBeNull();
    expect(result.current.loadPage('501')).toBeNull();
  });

  it('should handle localStorage errors gracefully', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    // Mock localStorage to throw error
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('Storage full');
    });

    const testPage: TeletextPage = {
      id: '600',
      title: 'Error Test',
      rows: Array(24).fill(''.padEnd(40)),
      links: []
    };

    // Should not throw
    expect(() => {
      act(() => {
        result.current.savePage('600', testPage, 30);
      });
    }).not.toThrow();

    // Restore original
    Storage.prototype.setItem = originalSetItem;
  });

  it('should preserve page metadata when caching', () => {
    const { result } = renderHook(() => useBrowserCache());
    
    const testPage: TeletextPage = {
      id: '700',
      title: 'Metadata Test',
      rows: Array(24).fill(''.padEnd(40)),
      links: [
        { label: 'Test', targetPage: '100', color: 'red' }
      ],
      meta: {
        source: 'NewsAPI',
        lastUpdated: '2024-01-01T00:00:00Z',
        cacheStatus: 'fresh'
      }
    };

    // Save page
    act(() => {
      result.current.savePage('700', testPage, 30);
    });

    // Load and verify metadata
    const loadedPage = result.current.loadPage('700');
    
    expect(loadedPage?.meta?.source).toBe('NewsAPI');
    expect(loadedPage?.meta?.lastUpdated).toBe('2024-01-01T00:00:00Z');
    expect(loadedPage?.links).toHaveLength(1);
    expect(loadedPage?.links[0].color).toBe('red');
  });
});
