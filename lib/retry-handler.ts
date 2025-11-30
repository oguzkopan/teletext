/**
 * Retry Handler with Exponential Backoff
 * 
 * Implements retry logic for failed requests with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
  onRetry?: (error: Error, attempt: number, delay: number) => void;
}

export interface RetryState {
  attempt: number;
  totalAttempts: number;
  lastError: Error | null;
  isRetrying: boolean;
  nextRetryDelay: number;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'shouldRetry' | 'onRetry'>> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
};

/**
 * Retry handler class
 */
export class RetryHandler {
  private options: Required<RetryOptions>;
  private state: RetryState = {
    attempt: 0,
    totalAttempts: 0,
    lastError: null,
    isRetrying: false,
    nextRetryDelay: 0
  };

  constructor(options?: RetryOptions) {
    this.options = {
      ...DEFAULT_RETRY_OPTIONS,
      shouldRetry: options?.shouldRetry || this.defaultShouldRetry,
      onRetry: options?.onRetry || (() => {}),
      ...options
    };
  }

  /**
   * Default retry condition - retry on network errors
   */
  private defaultShouldRetry(error: Error, attempt: number): boolean {
    // Don't retry if max attempts reached
    if (attempt >= this.options.maxAttempts) {
      return false;
    }

    // Retry on network errors
    if (error.message.includes('network') || 
        error.message.includes('timeout') ||
        error.message.includes('fetch')) {
      return true;
    }

    // Don't retry on other errors
    return false;
  }

  /**
   * Calculates delay for next retry using exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const delay = this.options.initialDelay * Math.pow(this.options.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.options.maxDelay);
  }

  /**
   * Executes a function with retry logic
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.state.attempt = 0;
    this.state.totalAttempts = 0;
    this.state.lastError = null;

    while (this.state.attempt < this.options.maxAttempts) {
      this.state.attempt++;
      this.state.totalAttempts++;

      try {
        const result = await fn();
        this.state.isRetrying = false;
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.state.lastError = err;

        // Check if we should retry
        if (!this.options.shouldRetry(err, this.state.attempt)) {
          throw err;
        }

        // Calculate delay for next retry
        const delay = this.calculateDelay(this.state.attempt);
        this.state.nextRetryDelay = delay;
        this.state.isRetrying = true;

        // Call retry callback
        this.options.onRetry(err, this.state.attempt, delay);

        // Wait before retrying
        if (this.state.attempt < this.options.maxAttempts) {
          await this.sleep(delay);
        } else {
          // Max attempts reached
          throw err;
        }
      }
    }

    // Should never reach here, but TypeScript needs it
    throw this.state.lastError || new Error('Max retry attempts reached');
  }

  /**
   * Gets current retry state
   */
  public getState(): RetryState {
    return { ...this.state };
  }

  /**
   * Resets retry state
   */
  public reset(): void {
    this.state = {
      attempt: 0,
      totalAttempts: 0,
      lastError: null,
      isRetrying: false,
      nextRetryDelay: 0
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Convenience function to retry an operation
 */
export async function retryOperation<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const handler = new RetryHandler(options);
  return handler.execute(fn);
}

/**
 * Creates a retry handler with status tracking
 */
export class RetryHandlerWithStatus extends RetryHandler {
  private statusListeners: Set<(state: RetryState) => void> = new Set();

  constructor(options?: RetryOptions) {
    const enhancedOptions: RetryOptions = {
      ...options,
      onRetry: (error, attempt, delay) => {
        // Call original onRetry if provided
        options?.onRetry?.(error, attempt, delay);
        
        // Notify status listeners
        this.notifyStatusListeners();
      }
    };

    super(enhancedOptions);
  }

  /**
   * Adds a status listener
   */
  public addStatusListener(listener: (state: RetryState) => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  /**
   * Notifies all status listeners
   */
  private notifyStatusListeners(): void {
    const state = this.getState();
    this.statusListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in retry status listener:', error);
      }
    });
  }

  /**
   * Executes with status updates
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await super.execute(fn);
      this.notifyStatusListeners();
      return result;
    } catch (error) {
      this.notifyStatusListeners();
      throw error;
    }
  }
}

/**
 * Retry-specific error types
 */
export class MaxRetriesExceededError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(`Max retry attempts (${attempts}) exceeded. Last error: ${lastError.message}`);
    this.name = 'MaxRetriesExceededError';
  }
}

/**
 * Wraps a function with automatic retry logic
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return (async (...args: any[]) => {
    return retryOperation(() => fn(...args), options);
  }) as T;
}
