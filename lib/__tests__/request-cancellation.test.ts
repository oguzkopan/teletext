/**
 * Tests for request cancellation
 */

import {
  RequestCancellationManager,
  RequestCancellationError,
  createCancellableFetch,
  makeCancellable,
  createCancellableTimeout,
  raceCancellable,
  allCancellable,
  getCancellationManager,
  resetCancellationManager
} from '../request-cancellation';

describe('RequestCancellationManager', () => {
  let manager: RequestCancellationManager;

  beforeEach(() => {
    manager = new RequestCancellationManager();
  });

  afterEach(() => {
    manager.cleanup();
  });

  describe('createCancellableRequest', () => {
    it('should create a cancellable request', async () => {
      const requestFn = jest.fn().mockResolvedValue('result');
      
      const request = manager.createCancellableRequest('test-1', requestFn);
      
      expect(request).toHaveProperty('promise');
      expect(request).toHaveProperty('cancel');
      expect(request).toHaveProperty('isCancelled');
      
      const result = await request.promise;
      expect(result).toBe('result');
    });

    it('should cancel a request', async () => {
      const requestFn = jest.fn(
        (signal) => new Promise((resolve) => {
          setTimeout(() => resolve('result'), 100);
        })
      );
      
      const request = manager.createCancellableRequest('test-1', requestFn);
      request.cancel();
      
      await expect(request.promise).rejects.toThrow(RequestCancellationError);
    });

    it('should cancel previous request with same ID', async () => {
      const requestFn1 = jest.fn(
        (signal) => new Promise((resolve) => {
          setTimeout(() => resolve('result1'), 100);
        })
      );
      
      const requestFn2 = jest.fn().mockResolvedValue('result2');
      
      const request1 = manager.createCancellableRequest('test-1', requestFn1);
      const request2 = manager.createCancellableRequest('test-1', requestFn2);
      
      await expect(request1.promise).rejects.toThrow(RequestCancellationError);
      await expect(request2.promise).resolves.toBe('result2');
    });

    it('should track cancelled requests', () => {
      const requestFn = jest.fn(
        (signal) => new Promise((resolve) => {
          setTimeout(() => resolve('result'), 100);
        })
      );
      
      const request = manager.createCancellableRequest('test-1', requestFn);
      request.cancel();
      
      expect(manager.wasRequestCancelled('test-1')).toBe(true);
    });
  });

  describe('cancelRequest', () => {
    it('should cancel specific request by ID', async () => {
      const requestFn = jest.fn(
        (signal) => new Promise((resolve) => {
          setTimeout(() => resolve('result'), 100);
        })
      );
      
      const request = manager.createCancellableRequest('test-1', requestFn);
      manager.cancelRequest('test-1');
      
      await expect(request.promise).rejects.toThrow(RequestCancellationError);
    });

    it('should not throw when cancelling non-existent request', () => {
      expect(() => manager.cancelRequest('non-existent')).not.toThrow();
    });
  });

  describe('cancelAllRequests', () => {
    it('should cancel all active requests', async () => {
      const requestFn = (signal: AbortSignal) => new Promise((resolve) => {
        setTimeout(() => resolve('result'), 100);
      });
      
      const request1 = manager.createCancellableRequest('test-1', requestFn);
      const request2 = manager.createCancellableRequest('test-2', requestFn);
      
      manager.cancelAllRequests();
      
      await expect(request1.promise).rejects.toThrow(RequestCancellationError);
      await expect(request2.promise).rejects.toThrow(RequestCancellationError);
    });
  });

  describe('Request tracking', () => {
    it('should track active requests', () => {
      const requestFn = (signal: AbortSignal) => new Promise((resolve) => {
        setTimeout(() => resolve('result'), 100);
      });
      
      expect(manager.getActiveRequestCount()).toBe(0);
      
      manager.createCancellableRequest('test-1', requestFn);
      expect(manager.getActiveRequestCount()).toBe(1);
      expect(manager.isRequestActive('test-1')).toBe(true);
      
      manager.createCancellableRequest('test-2', requestFn);
      expect(manager.getActiveRequestCount()).toBe(2);
    });

    it('should remove completed requests from active tracking', async () => {
      const requestFn = jest.fn().mockResolvedValue('result');
      
      const request = manager.createCancellableRequest('test-1', requestFn);
      expect(manager.isRequestActive('test-1')).toBe(true);
      
      await request.promise;
      expect(manager.isRequestActive('test-1')).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clean up all resources', async () => {
      const requestFn = (signal: AbortSignal) => new Promise((resolve) => {
        setTimeout(() => resolve('result'), 100);
      });
      
      manager.createCancellableRequest('test-1', requestFn);
      manager.createCancellableRequest('test-2', requestFn);
      
      manager.cleanup();
      
      expect(manager.getActiveRequestCount()).toBe(0);
    });
  });
});

describe('makeCancellable', () => {
  it('should make a promise cancellable', async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('result'), 100);
    });
    
    const cancellable = makeCancellable(promise);
    cancellable.cancel();
    
    try {
      await cancellable.promise;
      fail('Should have thrown RequestCancellationError');
    } catch (error) {
      expect(error).toBeInstanceOf(RequestCancellationError);
    }
  });

  it('should resolve normally if not cancelled', async () => {
    const promise = Promise.resolve('result');
    const cancellable = makeCancellable(promise);
    
    const result = await cancellable.promise;
    expect(result).toBe('result');
  });

  it('should track cancellation status', () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('result'), 100);
    });
    
    const cancellable = makeCancellable(promise);
    expect(cancellable.isCancelled()).toBe(false);
    
    cancellable.cancel();
    expect(cancellable.isCancelled()).toBe(true);
  });
});

describe('createCancellableTimeout', () => {
  it('should create a cancellable timeout', async () => {
    const timeout = createCancellableTimeout(50);
    
    await expect(timeout.promise).resolves.toBeUndefined();
  });

  it('should cancel timeout', () => {
    const timeout = createCancellableTimeout(100);
    timeout.cancel();
    
    expect(timeout.isCancelled()).toBe(true);
    // Note: The promise won't reject, it just won't resolve
  });
});

describe('raceCancellable', () => {
  it('should race multiple cancellable requests', async () => {
    const request1 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('first'), 100))
    );
    const request2 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('second'), 50))
    );
    
    const race = raceCancellable([request1, request2]);
    const result = await race.promise;
    
    expect(result).toBe('second');
  });

  it('should cancel all requests when race is cancelled', async () => {
    const request1 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('first'), 100))
    );
    const request2 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('second'), 100))
    );
    
    const race = raceCancellable([request1, request2]);
    race.cancel();
    
    expect(request1.isCancelled()).toBe(true);
    expect(request2.isCancelled()).toBe(true);
    
    // Ensure the race promise rejects
    try {
      await race.promise;
      fail('Should have thrown');
    } catch (error) {
      // Expected to throw
      expect(error).toBeInstanceOf(RequestCancellationError);
    }
  });
});

describe('allCancellable', () => {
  it('should wait for all cancellable requests', async () => {
    const request1 = makeCancellable(Promise.resolve('first'));
    const request2 = makeCancellable(Promise.resolve('second'));
    
    const all = allCancellable([request1, request2]);
    const results = await all.promise;
    
    expect(results).toEqual(['first', 'second']);
  });

  it('should cancel all requests when cancelled', async () => {
    const request1 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('first'), 100))
    );
    const request2 = makeCancellable(
      new Promise((resolve) => setTimeout(() => resolve('second'), 100))
    );
    
    const all = allCancellable([request1, request2]);
    all.cancel();
    
    expect(request1.isCancelled()).toBe(true);
    expect(request2.isCancelled()).toBe(true);
    
    // Ensure the all promise rejects
    try {
      await all.promise;
      fail('Should have thrown');
    } catch (error) {
      // Expected to throw
      expect(error).toBeInstanceOf(RequestCancellationError);
    }
  });
});

describe('Singleton manager', () => {
  beforeEach(() => {
    resetCancellationManager();
  });

  it('should return singleton instance', () => {
    const instance1 = getCancellationManager();
    const instance2 = getCancellationManager();
    
    expect(instance1).toBe(instance2);
  });

  it('should reset singleton instance', () => {
    const instance1 = getCancellationManager();
    resetCancellationManager();
    const instance2 = getCancellationManager();
    
    expect(instance1).not.toBe(instance2);
  });
});
