// Logging utilities for Cloud Functions

import * as functions from 'firebase-functions';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Structured logger for Cloud Functions
 */
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Log debug information
   */
  debug(message: string, data?: any): void {
    functions.logger.debug(message, {
      context: this.context,
      ...data
    });
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: any): void {
    functions.logger.info(message, {
      context: this.context,
      ...data
    });
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any): void {
    functions.logger.warn(message, {
      context: this.context,
      ...data
    });
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error | any, data?: any): void {
    functions.logger.error(message, {
      context: this.context,
      error: error?.message || error,
      stack: error?.stack,
      ...data
    });
  }

  /**
   * Log API request
   */
  logRequest(method: string, path: string, params?: any): void {
    this.info(`${method} ${path}`, { params });
  }

  /**
   * Log API response
   */
  logResponse(statusCode: number, duration: number, data?: any): void {
    this.info(`Response ${statusCode}`, { duration, ...data });
  }
}

/**
 * Create a logger instance for a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
