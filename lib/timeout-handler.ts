/**
 * Timeout Handler
 * 
 * Manages timeouts for async operations and provides timeout error handling
 */

import { createTimeoutErrorPage } from './error-pages';
import { TeletextPage } from '../types/teletext';

export class TimeoutError extends Error {
  constructor(
    message: string = 'Operation timed out',
    public readonly timeoutMs: number = 0
  ) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export interface TimeoutOptions {
  timeoutMs: number;
  operation?: string;
  onTimeout?: () => void;
}

/**
 * Timeout handler class
 */
export class TimeoutHandler {
  private defaultTimeout: number = 30000; // 30 seconds
  private activeTimeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Sets default timeout in milliseconds
   */
  public setDefaultTimeout(timeoutMs: number): void {
    this.defaultTimeout = timeoutMs;
  }

  /**
   * Gets default timeout in milliseconds
   */
  public getDefaultTimeout(): number {
    return this.defaultTimeout;
  }

  /**
   * Wraps a promise with a timeout
   */
  public async withTimeout<T>(
    promise: Promise<T>,
    options?: Partial<TimeoutOptions>
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs || this.defaultTimeout;
    const operation = options?.operation || 'operation';
    const onTimeout = options?.onTimeout;

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (onTimeout) {
          try {
            onTimeout();
          } catch (error) {
            console.error('Error in timeout callback:', error);
          }
        }
        reject(new TimeoutError(`${operation} timed out after ${timeoutMs}ms`, timeoutMs));
      }, timeoutMs);

      promise
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Creates a named timeout that can be cancelled
   */
  public createNamedTimeout(
    name: string,
    callback: () => void,
    timeoutMs: number
  ): void {
    // Clear existing timeout with same name
    this.clearNamedTimeout(name);

    const timeoutId = setTimeout(() => {
      this.activeTimeouts.delete(name);
      callback();
    }, timeoutMs);

    this.activeTimeouts.set(name, timeoutId);
  }

  /**
   * Clears a named timeout
   */
  public clearNamedTimeout(name: string): void {
    const timeoutId = this.activeTimeouts.get(name);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.activeTimeouts.delete(name);
    }
  }

  /**
   * Checks if a named timeout is active
   */
  public hasActiveTimeout(name: string): boolean {
    return this.activeTimeouts.has(name);
  }

  /**
   * Clears all active timeouts
   */
  public clearAllTimeouts(): void {
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts.clear();
  }

  /**
   * Gets count of active timeouts
   */
  public getActiveTimeoutCount(): number {
    return this.activeTimeouts.size;
  }

  /**
   * Creates a timeout error page
   */
  public createTimeoutErrorPage(pageNumber: string, operation: string = 'request'): TeletextPage {
    return createTimeoutErrorPage(pageNumber, operation);
  }

  /**
   * Wraps a fetch request with timeout
   */
  public async fetchWithTimeout(
    url: string,
    options?: RequestInit & { timeoutMs?: number }
  ): Promise<Response> {
    const { timeoutMs = this.defaultTimeout, ...fetchOptions } = options || {};

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Fetch request timed out after ${timeoutMs}ms`, timeoutMs);
      }
      
      throw error;
    }
  }

  /**
   * Cleanup all resources
   */
  public cleanup(): void {
    this.clearAllTimeouts();
  }
}

/**
 * Wraps a promise with a timeout (convenience function)
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation?: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(
        operation ? `${operation} timed out after ${timeoutMs}ms` : `Operation timed out after ${timeoutMs}ms`,
        timeoutMs
      ));
    }, timeoutMs);

    promise
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Creates a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries an operation with timeout
 */
export async function retryWithTimeout<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    timeoutMs?: number;
    delayMs?: number;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, timeoutMs = 30000, delayMs = 1000 } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await withTimeout(operation(), timeoutMs, `Attempt ${attempt}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

/**
 * Timeout configuration presets
 */
export const TimeoutPresets = {
  FAST: 5000,        // 5 seconds - for quick operations
  NORMAL: 30000,     // 30 seconds - default
  SLOW: 60000,       // 60 seconds - for slow operations
  AI_GENERATION: 45000, // 45 seconds - for AI content generation
  PAGE_LOAD: 10000   // 10 seconds - for page loading
} as const;

// Singleton instance
let timeoutHandlerInstance: TimeoutHandler | null = null;

/**
 * Gets the singleton timeout handler instance
 */
export function getTimeoutHandler(): TimeoutHandler {
  if (!timeoutHandlerInstance) {
    timeoutHandlerInstance = new TimeoutHandler();
  }
  return timeoutHandlerInstance;
}

/**
 * Resets the singleton instance (useful for testing)
 */
export function resetTimeoutHandler(): void {
  if (timeoutHandlerInstance) {
    timeoutHandlerInstance.cleanup();
  }
  timeoutHandlerInstance = null;
}
