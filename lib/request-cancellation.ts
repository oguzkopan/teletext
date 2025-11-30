/**
 * Request Cancellation Handler
 * 
 * Manages request cancellation to prevent race conditions and clean up resources
 */

export interface CancellableRequest<T> {
  promise: Promise<T>;
  cancel: () => void;
  isCancelled: () => boolean;
}

export class RequestCancellationError extends Error {
  constructor(message: string = 'Request was cancelled') {
    super(message);
    this.name = 'RequestCancellationError';
  }
}

/**
 * Request cancellation manager
 */
export class RequestCancellationManager {
  private activeRequests: Map<string, AbortController> = new Map();
  private cancelledRequests: Set<string> = new Set();

  /**
   * Creates a cancellable request
   */
  public createCancellableRequest<T>(
    requestId: string,
    requestFn: (signal: AbortSignal) => Promise<T>
  ): CancellableRequest<T> {
    // Cancel any existing request with the same ID
    this.cancelRequest(requestId);

    // Create new abort controller
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    this.cancelledRequests.delete(requestId);

    // Create the promise
    const promise = requestFn(controller.signal)
      .then(result => {
        // Clean up on success
        this.activeRequests.delete(requestId);
        return result;
      })
      .catch(error => {
        // Clean up on error
        this.activeRequests.delete(requestId);
        
        // Convert abort errors to cancellation errors
        if (error.name === 'AbortError' || this.cancelledRequests.has(requestId)) {
          throw new RequestCancellationError();
        }
        
        throw error;
      });

    return {
      promise,
      cancel: () => this.cancelRequest(requestId),
      isCancelled: () => this.cancelledRequests.has(requestId)
    };
  }

  /**
   * Cancels a specific request
   */
  public cancelRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
      this.cancelledRequests.add(requestId);
    }
  }

  /**
   * Cancels all active requests
   */
  public cancelAllRequests(): void {
    this.activeRequests.forEach((controller, requestId) => {
      controller.abort();
      this.cancelledRequests.add(requestId);
    });
    
    this.activeRequests.clear();
  }

  /**
   * Checks if a request is active
   */
  public isRequestActive(requestId: string): boolean {
    return this.activeRequests.has(requestId);
  }

  /**
   * Checks if a request was cancelled
   */
  public wasRequestCancelled(requestId: string): boolean {
    return this.cancelledRequests.has(requestId);
  }

  /**
   * Gets count of active requests
   */
  public getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  /**
   * Clears cancelled request tracking
   */
  public clearCancelledTracking(): void {
    this.cancelledRequests.clear();
  }

  /**
   * Cleans up all resources
   */
  public cleanup(): void {
    this.cancelAllRequests();
    this.cancelledRequests.clear();
  }
}

/**
 * Creates a cancellable fetch request
 */
export function createCancellableFetch(
  url: string,
  options?: RequestInit
): CancellableRequest<Response> {
  const controller = new AbortController();
  
  const promise = fetch(url, {
    ...options,
    signal: controller.signal
  }).catch(error => {
    if (error.name === 'AbortError') {
      throw new RequestCancellationError();
    }
    throw error;
  });

  return {
    promise,
    cancel: () => controller.abort(),
    isCancelled: () => controller.signal.aborted
  };
}

/**
 * Wraps a promise to make it cancellable
 */
export function makeCancellable<T>(
  promise: Promise<T>
): CancellableRequest<T> {
  let cancelled = false;
  let rejectFn: ((reason: Error) => void) | null = null;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    rejectFn = reject;
    
    promise
      .then(result => {
        if (!cancelled) {
          resolve(result);
        }
      })
      .catch(error => {
        if (!cancelled) {
          reject(error);
        }
      });
  }).catch(error => {
    // Ensure cancellation errors are properly handled
    if (error instanceof RequestCancellationError) {
      throw error;
    }
    throw error;
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      if (!cancelled) {
        cancelled = true;
        if (rejectFn) {
          rejectFn(new RequestCancellationError());
        }
      }
    },
    isCancelled: () => cancelled
  };
}

/**
 * Creates a timeout promise that can be cancelled
 */
export function createCancellableTimeout(
  ms: number
): CancellableRequest<void> {
  let timeoutId: NodeJS.Timeout | null = null;
  let cancelled = false;

  const promise = new Promise<void>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (!cancelled) {
        resolve();
      }
    }, ms);
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
    isCancelled: () => cancelled
  };
}

/**
 * Race multiple cancellable requests
 */
export function raceCancellable<T>(
  requests: CancellableRequest<T>[]
): CancellableRequest<T> {
  const promise = Promise.race(requests.map(r => r.promise));

  return {
    promise,
    cancel: () => {
      requests.forEach(r => r.cancel());
    },
    isCancelled: () => requests.some(r => r.isCancelled())
  };
}

/**
 * Wait for all cancellable requests
 */
export function allCancellable<T>(
  requests: CancellableRequest<T>[]
): CancellableRequest<T[]> {
  const promise = Promise.all(requests.map(r => r.promise));

  return {
    promise,
    cancel: () => {
      requests.forEach(r => r.cancel());
    },
    isCancelled: () => requests.some(r => r.isCancelled())
  };
}

// Singleton instance
let cancellationManagerInstance: RequestCancellationManager | null = null;

/**
 * Gets the singleton cancellation manager instance
 */
export function getCancellationManager(): RequestCancellationManager {
  if (!cancellationManagerInstance) {
    cancellationManagerInstance = new RequestCancellationManager();
  }
  return cancellationManagerInstance;
}

/**
 * Resets the singleton instance (useful for testing)
 */
export function resetCancellationManager(): void {
  if (cancellationManagerInstance) {
    cancellationManagerInstance.cleanup();
  }
  cancellationManagerInstance = null;
}
