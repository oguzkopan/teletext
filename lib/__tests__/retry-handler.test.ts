/**
 * Tests for retry handler
 */

import {
  RetryHandler,
  RetryHandlerWithStatus,
  retryOperation,
  withRetry,
  MaxRetriesExceededError
} from '../retry-handler';

describe('RetryHandler', () => {
  describe('Basic retry logic', () => {
    it('should succeed on first attempt', async () => {
      const handler = new RetryHandler();
      const fn = jest.fn().mockResolvedValue('success');

      const result = await handler.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const handler = new RetryHandler({ initialDelay: 10 });
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      const result = await handler.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max attempts', async () => {
      const handler = new RetryHandler({ maxAttempts: 3, initialDelay: 10 });
      const fn = jest.fn().mockRejectedValue(new Error('network error'));

      await expect(handler.execute(fn)).rejects.toThrow('network error');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const handler = new RetryHandler();
      const fn = jest.fn().mockRejectedValue(new Error('validation error'));

      await expect(handler.execute(fn)).rejects.toThrow('validation error');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Exponential backoff', () => {
    it('should increase delay exponentially', async () => {
      const delays: number[] = [];
      const handler = new RetryHandler({
        maxAttempts: 3,
        initialDelay: 100,
        backoffMultiplier: 2,
        onRetry: (error, attempt, delay) => {
          delays.push(delay);
        }
      });

      const fn = jest.fn().mockRejectedValue(new Error('network error'));

      await expect(handler.execute(fn)).rejects.toThrow();

      expect(delays).toHaveLength(2); // 2 retries after initial attempt
      expect(delays[0]).toBe(100); // First retry: 100ms
      expect(delays[1]).toBe(200); // Second retry: 200ms
    });

    it('should respect max delay', async () => {
      const delays: number[] = [];
      const handler = new RetryHandler({
        maxAttempts: 5,
        initialDelay: 1000,
        maxDelay: 2000,
        backoffMultiplier: 2,
        onRetry: (error, attempt, delay) => {
          delays.push(delay);
        }
      });

      const fn = jest.fn().mockRejectedValue(new Error('network error'));

      await expect(handler.execute(fn)).rejects.toThrow();

      // All delays should be capped at maxDelay
      delays.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(2000);
      });
    });
  });

  describe('Custom retry conditions', () => {
    it('should use custom shouldRetry function', async () => {
      const shouldRetry = jest.fn().mockReturnValue(false);
      const handler = new RetryHandler({ shouldRetry });
      const fn = jest.fn().mockRejectedValue(new Error('error'));

      await expect(handler.execute(fn)).rejects.toThrow();

      expect(shouldRetry).toHaveBeenCalled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry callback', async () => {
      const onRetry = jest.fn();
      const handler = new RetryHandler({
        maxAttempts: 3,
        initialDelay: 10,
        onRetry
      });

      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      await handler.execute(fn);

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(
        expect.any(Error),
        1,
        expect.any(Number)
      );
    });
  });

  describe('State management', () => {
    it('should track retry state', async () => {
      const handler = new RetryHandler({ initialDelay: 10 });
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      await handler.execute(fn);

      const state = handler.getState();
      expect(state.attempt).toBe(2);
      expect(state.totalAttempts).toBe(2);
      expect(state.isRetrying).toBe(false);
    });

    it('should reset state', async () => {
      const handler = new RetryHandler({ initialDelay: 10 });
      const fn = jest.fn().mockRejectedValue(new Error('network error'));

      await expect(handler.execute(fn)).rejects.toThrow();

      handler.reset();

      const state = handler.getState();
      expect(state.attempt).toBe(0);
      expect(state.totalAttempts).toBe(0);
      expect(state.lastError).toBeNull();
    });
  });

  describe('retryOperation helper', () => {
    it('should retry operation with default options', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      const result = await retryOperation(fn, { initialDelay: 10 });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('RetryHandlerWithStatus', () => {
    it('should notify status listeners on retry', async () => {
      const handler = new RetryHandlerWithStatus({
        maxAttempts: 3,
        initialDelay: 10
      });

      const listener = jest.fn();
      handler.addStatusListener(listener);

      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      await handler.execute(fn);

      expect(listener).toHaveBeenCalled();
    });

    it('should remove status listener', async () => {
      const handler = new RetryHandlerWithStatus({
        maxAttempts: 3,
        initialDelay: 10
      });

      const listener = jest.fn();
      const unsubscribe = handler.addStatusListener(listener);
      unsubscribe();

      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      await handler.execute(fn);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('withRetry wrapper', () => {
    it('should wrap function with retry logic', async () => {
      const originalFn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      const wrappedFn = withRetry(originalFn, { initialDelay: 10 });

      const result = await wrappedFn();

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to wrapped function', async () => {
      const originalFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = withRetry(originalFn);

      await wrappedFn('arg1', 'arg2');

      expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});
