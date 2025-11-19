/**
 * Performance Tracing Utilities
 * 
 * Provides custom performance traces for Firebase Performance Monitoring
 * to track page loads, API calls, and other critical operations.
 */

import { performance } from './firebase-client';
import { trace } from 'firebase/performance';

/**
 * Trace a page load operation
 * 
 * @param pageId - The page ID being loaded
 * @param fn - The async function to trace
 * @returns The result of the function
 */
export async function tracePageLoad<T>(
  pageId: string,
  fn: () => Promise<T>
): Promise<T> {
  // If performance monitoring is not enabled, just execute the function
  if (!performance) {
    return fn();
  }

  const pageTrace = trace(performance, `page_load_${pageId}`);
  pageTrace.putAttribute('page_id', pageId);
  
  pageTrace.start();
  try {
    const result = await fn();
    pageTrace.stop();
    return result;
  } catch (error) {
    pageTrace.putAttribute('error', 'true');
    pageTrace.stop();
    throw error;
  }
}

/**
 * Trace an API call operation
 * 
 * @param endpoint - The API endpoint being called
 * @param fn - The async function to trace
 * @returns The result of the function
 */
export async function traceAPICall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  // If performance monitoring is not enabled, just execute the function
  if (!performance) {
    return fn();
  }

  const apiTrace = trace(performance, `api_${endpoint.replace(/\//g, '_')}`);
  apiTrace.putAttribute('endpoint', endpoint);
  
  apiTrace.start();
  try {
    const result = await fn();
    apiTrace.putAttribute('status', 'success');
    apiTrace.stop();
    return result;
  } catch (error) {
    apiTrace.putAttribute('status', 'error');
    apiTrace.putAttribute('error', error instanceof Error ? error.message : 'unknown');
    apiTrace.stop();
    throw error;
  }
}

/**
 * Trace a navigation operation
 * 
 * @param fromPage - The page being navigated from
 * @param toPage - The page being navigated to
 * @param fn - The async function to trace
 * @returns The result of the function
 */
export async function traceNavigation<T>(
  fromPage: string,
  toPage: string,
  fn: () => Promise<T>
): Promise<T> {
  // If performance monitoring is not enabled, just execute the function
  if (!performance) {
    return fn();
  }

  const navTrace = trace(performance, 'navigation');
  navTrace.putAttribute('from_page', fromPage);
  navTrace.putAttribute('to_page', toPage);
  
  navTrace.start();
  try {
    const result = await fn();
    navTrace.stop();
    return result;
  } catch (error) {
    navTrace.putAttribute('error', 'true');
    navTrace.stop();
    throw error;
  }
}

/**
 * Trace a cache operation
 * 
 * @param operation - The cache operation (hit, miss, set)
 * @param pageId - The page ID being cached
 */
export function traceCacheOperation(
  operation: 'hit' | 'miss' | 'set',
  pageId: string
): void {
  // If performance monitoring is not enabled, do nothing
  if (!performance) {
    return;
  }

  const cacheTrace = trace(performance, `cache_${operation}`);
  cacheTrace.putAttribute('page_id', pageId);
  cacheTrace.putAttribute('operation', operation);
  
  cacheTrace.start();
  cacheTrace.stop();
}

/**
 * Trace a custom operation
 * 
 * @param name - The name of the operation
 * @param attributes - Optional attributes to add to the trace
 * @param fn - The async function to trace
 * @returns The result of the function
 */
export async function traceCustomOperation<T>(
  name: string,
  attributes: Record<string, string>,
  fn: () => Promise<T>
): Promise<T> {
  // If performance monitoring is not enabled, just execute the function
  if (!performance) {
    return fn();
  }

  const customTrace = trace(performance, name);
  
  // Add all attributes
  Object.entries(attributes).forEach(([key, value]) => {
    customTrace.putAttribute(key, value);
  });
  
  customTrace.start();
  try {
    const result = await fn();
    customTrace.stop();
    return result;
  } catch (error) {
    customTrace.putAttribute('error', 'true');
    customTrace.stop();
    throw error;
  }
}
