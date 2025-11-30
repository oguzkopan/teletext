/**
 * Tests for timeout handler
 */

import {
  TimeoutHandler,
  TimeoutError,
  withTimeout,
  delay,
  retryWithTimeout,
  TimeoutPresets,
  getTimeoutHandler,
  resetTimeoutHandler
} from '../timeout-handler';

describe('TimeoutHandler', () => {
  let handler: TimeoutHandler;

  beforeEach(() => {
    handler = new TimeoutHandler();
  });

  afterEach(() => {
    handler.cleanup();
  });

  describe('Default timeout', () => {
    it('should have default timeout', () => {
      expect(handler.getDefaultTimeout()).toBeGreaterThan(0);
    });

    it('should set default timeout', () => {
      handler.setDefaultTimeout(5000);
      expect(handler.getDefaultTimeout()).toBe(5000);
    });
  });

  describe('withTimeout', () => {
    it('should resolve promise before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await handler.withTimeout(promise, { timeoutMs: 1000 });
      
      expect(result).toBe('success');
    });

    it('should reject with TimeoutError when timeout exceeded', async () => {
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('success'), 200);
      });

      await expect(
        handler.withTimeout(promise, { timeoutMs: 50 })
      ).rejects.toThrow(TimeoutError);
    });

    it('should use default timeout when not specified', async () => {
      handler.setDefaultTimeout(100);
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('success'), 200);
      });

      await expect(
        handler.withTimeout(promise)
      ).rejects.toThrow(TimeoutError);
    });

    it('should call onTimeout callback', async () => {
      const onTimeout = jest.fn();
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('success'), 200);
      });

      await expect(
        handler.withTimeout(promise, { timeoutMs: 50, onTimeout })
      ).rejects.toThrow(TimeoutError);

      expect(onTimeout).toHaveBeenCalled();
    });

    it('should include operation name in error', async () => {
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('success'), 200);
      });

      try {
        await handler.withTimeout(promise, {
          timeoutMs: 50,
          operation: 'test operation'
        });
        fail('Should have thrown TimeoutError');
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as Error).message).toContain('test operation');
      }
    });
  });

  describe('Named timeouts', () => {
    it('should create named timeout', (done) => {
      const callback = jest.fn(() => {
        expect(callback).toHaveBeenCalled();
        done();
      });

      handler.createNamedTimeout('test', callback, 50);
      expect(handler.hasActiveTimeout('test')).toBe(true);
    });

    it('should clear named timeout', (done) => {
      const callback = jest.fn();

      handler.createNamedTimeout('test', callback, 50);
      handler.clearNamedTimeout('test');

      expect(handler.hasActiveTimeout('test')).toBe(false);

      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should replace existing timeout with same name', (done) => {
      const callback1 = jest.fn();
      const callback2 = jest.fn(() => {
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        done();
      });

      handler.createNamedTimeout('test', callback1, 100);
      handler.createNamedTimeout('test', callback2, 50);
    });

    it('should track active timeout count', () => {
      expect(handler.getActiveTimeoutCount()).toBe(0);

      handler.createNamedTimeout('test1', () => {}, 1000);
      expect(handler.getActiveTimeoutCount()).toBe(1);

      handler.createNamedTimeout('test2', () => {}, 1000);
      expect(handler.getActiveTimeoutCount()).toBe(2);

      handler.clearNamedTimeout('test1');
      expect(handler.getActiveTimeoutCount()).toBe(1);
    });

    it('should clear all timeouts', (done) => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      handler.createNamedTimeout('test1', callback1, 50);
      handler.createNamedTimeout('test2', callback2, 50);

      handler.clearAllTimeouts();

      expect(handler.getActiveTimeoutCount()).toBe(0);

      setTimeout(() => {
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('fetchWithTimeout', () => {
    it('should fetch with timeout', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' })
      });

      const response = await handler.fetchWithTimeout('https://example.com', {
        timeoutMs: 1000
      });

      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should timeout fetch request', async () => {
      global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => resolve({ ok: true }), 200);
          
          // Listen for abort signal
          if (options?.signal) {
            options.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            });
          }
        });
      });

      await expect(
        handler.fetchWithTimeout('https://example.com', { timeoutMs: 50 })
      ).rejects.toThrow(TimeoutError);
    });
  });

  describe('createTimeoutErrorPage', () => {
    it('should create timeout error page', () => {
      const page = handler.createTimeoutErrorPage('500', 'AI request');

      expect(page.id).toBe('500');
      expect(page.rows[0]).toContain('ERROR');
      const pageContent = page.rows.join('');
      expect(pageContent).toContain('AI request');
      expect(pageContent).toContain('took too long');
    });
  });

  describe('cleanup', () => {
    it('should cleanup all resources', () => {
      handler.createNamedTimeout('test1', () => {}, 1000);
      handler.createNamedTimeout('test2', () => {}, 1000);

      handler.cleanup();

      expect(handler.getActiveTimeoutCount()).toBe(0);
    });
  });
});

describe('withTimeout helper', () => {
  it('should resolve promise before timeout', async () => {
    const promise = Promise.resolve('success');
    const result = await withTimeout(promise, 1000);
    
    expect(result).toBe('success');
  });

  it('should reject with TimeoutError when timeout exceeded', async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('success'), 200);
    });

    await expect(
      withTimeout(promise, 50)
    ).rejects.toThrow(TimeoutError);
  });

  it('should include operation name in error', async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('success'), 200);
    });

    try {
      await withTimeout(promise, 50, 'test operation');
      fail('Should have thrown TimeoutError');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      expect((error as Error).message).toContain('test operation');
    }
  });
});

describe('delay', () => {
  it('should delay execution', async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some margin
  });
});

describe('retryWithTimeout', () => {
  it('should succeed on first attempt', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    
    const result = await retryWithTimeout(operation, {
      maxAttempts: 3,
      timeoutMs: 1000,
      delayMs: 10
    });

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const result = await retryWithTimeout(operation, {
      maxAttempts: 3,
      timeoutMs: 1000,
      delayMs: 10
    });

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should throw after max attempts', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));

    await expect(
      retryWithTimeout(operation, {
        maxAttempts: 3,
        timeoutMs: 1000,
        delayMs: 10
      })
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should timeout individual attempts', async () => {
    const operation = jest.fn().mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve('success'), 200))
    );

    await expect(
      retryWithTimeout(operation, {
        maxAttempts: 2,
        timeoutMs: 50,
        delayMs: 10
      })
    ).rejects.toThrow(TimeoutError);
  });
});

describe('TimeoutPresets', () => {
  it('should have predefined timeout values', () => {
    expect(TimeoutPresets.FAST).toBe(5000);
    expect(TimeoutPresets.NORMAL).toBe(30000);
    expect(TimeoutPresets.SLOW).toBe(60000);
    expect(TimeoutPresets.AI_GENERATION).toBe(45000);
    expect(TimeoutPresets.PAGE_LOAD).toBe(10000);
  });
});

describe('Singleton instance', () => {
  beforeEach(() => {
    resetTimeoutHandler();
  });

  it('should return singleton instance', () => {
    const instance1 = getTimeoutHandler();
    const instance2 = getTimeoutHandler();
    
    expect(instance1).toBe(instance2);
  });

  it('should reset singleton instance', () => {
    const instance1 = getTimeoutHandler();
    resetTimeoutHandler();
    const instance2 = getTimeoutHandler();
    
    expect(instance1).not.toBe(instance2);
  });
});
