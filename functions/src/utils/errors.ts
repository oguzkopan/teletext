// Error handling utilities

import { PageResponse, AIResponse } from '../types';

/**
 * Custom error class for teletext-specific errors
 */
export class TeletextError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'TeletextError';
  }
}

/**
 * Error for invalid page requests
 */
export class InvalidPageError extends TeletextError {
  constructor(pageId: string) {
    super(
      `Invalid page number: ${pageId}. Must be between 100-899.`,
      400,
      'INVALID_PAGE'
    );
    this.name = 'InvalidPageError';
  }
}

/**
 * Error for page not found
 */
export class PageNotFoundError extends TeletextError {
  constructor(pageId: string) {
    super(
      `Page ${pageId} not found`,
      404,
      'PAGE_NOT_FOUND'
    );
    this.name = 'PageNotFoundError';
  }
}

/**
 * Error for adapter failures
 */
export class AdapterError extends TeletextError {
  constructor(message: string, public adapterName: string) {
    super(
      `Adapter error (${adapterName}): ${message}`,
      500,
      'ADAPTER_ERROR'
    );
    this.name = 'AdapterError';
  }
}

/**
 * Error for external API failures
 */
export class ExternalAPIError extends TeletextError {
  constructor(message: string, public apiName: string) {
    super(
      `External API error (${apiName}): ${message}`,
      502,
      'EXTERNAL_API_ERROR'
    );
    this.name = 'ExternalAPIError';
  }
}

/**
 * Creates a standardized error response for page requests
 */
export function createErrorResponse(error: Error | TeletextError): PageResponse {
  if (error instanceof TeletextError) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred'
  };
}

/**
 * Creates a standardized error response for AI requests
 */
export function createAIErrorResponse(error: Error | TeletextError): AIResponse {
  if (error instanceof TeletextError) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred'
  };
}

/**
 * Determines HTTP status code from error
 */
export function getStatusCode(error: Error | TeletextError): number {
  if (error instanceof TeletextError) {
    return error.statusCode;
  }
  return 500;
}
