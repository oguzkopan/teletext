/**
 * Network Error Handler
 * 
 * Handles network connectivity issues, offline detection, and cached content display
 */

import { TeletextPage } from '../types/teletext';
import { createNetworkErrorPage } from './error-pages';

export interface CachedPageData {
  page: TeletextPage;
  timestamp: number;
  stale: boolean;
}

export interface NetworkStatus {
  online: boolean;
  lastChecked: number;
}

/**
 * Network error handler class
 */
export class NetworkErrorHandler {
  private cache: Map<string, CachedPageData> = new Map();
  private networkStatus: NetworkStatus = {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChecked: Date.now()
  };
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private cacheMaxAge: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupNetworkListeners();
    }
  }

  /**
   * Sets up network status listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.updateNetworkStatus(true);
    });

    window.addEventListener('offline', () => {
      this.updateNetworkStatus(false);
    });
  }

  /**
   * Updates network status and notifies listeners
   */
  private updateNetworkStatus(online: boolean): void {
    this.networkStatus = {
      online,
      lastChecked: Date.now()
    };

    this.notifyListeners();
  }

  /**
   * Checks if currently online
   */
  public isOnline(): boolean {
    return this.networkStatus.online;
  }

  /**
   * Gets current network status
   */
  public getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  /**
   * Adds a network status listener
   */
  public addStatusListener(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifies all listeners of status change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getNetworkStatus());
      } catch (error) {
        console.error('Error in network status listener:', error);
      }
    });
  }

  /**
   * Caches a page for offline access
   */
  public cachePage(pageId: string, page: TeletextPage): void {
    this.cache.set(pageId, {
      page,
      timestamp: Date.now(),
      stale: false
    });
  }

  /**
   * Gets a cached page if available
   */
  public getCachedPage(pageId: string): CachedPageData | null {
    const cached = this.cache.get(pageId);
    
    if (!cached) {
      return null;
    }

    // Check if cache is stale
    const age = Date.now() - cached.timestamp;
    const stale = age > this.cacheMaxAge;

    return {
      ...cached,
      stale
    };
  }

  /**
   * Checks if a page is cached
   */
  public hasCachedPage(pageId: string): boolean {
    return this.cache.has(pageId);
  }

  /**
   * Clears cached page
   */
  public clearCachedPage(pageId: string): void {
    this.cache.delete(pageId);
  }

  /**
   * Clears all cached pages
   */
  public clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache size
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Handles a network error and returns appropriate page
   */
  public handleNetworkError(pageId: string): TeletextPage {
    const cached = this.getCachedPage(pageId);
    
    if (cached && !this.isOnline()) {
      // Return cached page with offline indicator
      const page = { ...cached.page };
      
      // Add offline indicator to page
      if (cached.stale) {
        page.rows[23] = ' ⚠ OFFLINE - Cached content (stale)    ';
      } else {
        page.rows[23] = ' ⚠ OFFLINE - Cached content            ';
      }
      
      return page;
    }

    // Return network error page
    return createNetworkErrorPage(pageId, !this.isOnline());
  }

  /**
   * Wraps a fetch operation with network error handling
   */
  public async fetchWithErrorHandling<T>(
    pageId: string,
    fetchFn: () => Promise<T>,
    options?: {
      useCache?: boolean;
      cacheResult?: boolean;
    }
  ): Promise<T> {
    const { useCache = true, cacheResult = true } = options || {};

    // Check if offline and cache is available
    if (!this.isOnline() && useCache) {
      const cached = this.getCachedPage(pageId);
      if (cached) {
        return cached.page as unknown as T;
      }
    }

    try {
      const result = await fetchFn();
      
      // Cache successful result if it's a page
      if (cacheResult && this.isPage(result)) {
        this.cachePage(pageId, result as unknown as TeletextPage);
      }
      
      return result;
    } catch (error) {
      // If offline, try to return cached content
      if (!this.isOnline() && useCache) {
        const cached = this.getCachedPage(pageId);
        if (cached) {
          return cached.page as unknown as T;
        }
      }
      
      throw error;
    }
  }

  /**
   * Checks if a value is a TeletextPage
   */
  private isPage(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      'rows' in value &&
      Array.isArray((value as any).rows)
    );
  }

  /**
   * Sets cache max age in milliseconds
   */
  public setCacheMaxAge(maxAge: number): void {
    this.cacheMaxAge = maxAge;
  }

  /**
   * Gets cache max age in milliseconds
   */
  public getCacheMaxAge(): number {
    return this.cacheMaxAge;
  }
}

// Singleton instance
let networkErrorHandlerInstance: NetworkErrorHandler | null = null;

/**
 * Gets the singleton network error handler instance
 */
export function getNetworkErrorHandler(): NetworkErrorHandler {
  if (!networkErrorHandlerInstance) {
    networkErrorHandlerInstance = new NetworkErrorHandler();
  }
  return networkErrorHandlerInstance;
}

/**
 * Resets the singleton instance (useful for testing)
 */
export function resetNetworkErrorHandler(): void {
  networkErrorHandlerInstance = null;
}
