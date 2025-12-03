/**
 * Error Page Templates
 * 
 * Provides teletext-styled error pages for various error scenarios
 */

import { TeletextPage, PageLink } from '../types/teletext';

export type ErrorType = 
  | 'network'
  | 'timeout'
  | 'invalid_input'
  | 'session_expired'
  | 'not_found'
  | 'ai_service'
  | 'rate_limit'
  | 'generic';

export interface ErrorPageOptions {
  errorType: ErrorType;
  pageNumber: string;
  errorMessage?: string;
  details?: string;
  retryAction?: string;
  navigationLinks?: PageLink[];
}

/**
 * Creates a teletext-styled error page
 */
export function createErrorPage(options: ErrorPageOptions): TeletextPage {
  const {
    errorType,
    pageNumber,
    errorMessage,
    details,
    retryAction,
    navigationLinks = []
  } = options;

  const rows: string[] = new Array(24).fill(''.padEnd(40, ' '));
  
  // Header
  const headerText = `ERROR                        P${pageNumber.padStart(3, '0')}`;
  rows[0] = headerText + ' '.repeat(Math.max(0, 40 - headerText.length));
  rows[1] = '════════════════════════════════════════';
  
  // Error type and icon
  const errorInfo = getErrorInfo(errorType);
  rows[3] = centerText(errorInfo.icon);
  rows[4] = ''.padEnd(40, ' ');
  rows[5] = centerText(errorInfo.title);
  rows[6] = ''.padEnd(40, ' ');
  
  // Error message
  let currentRow = 8;
  if (errorMessage) {
    const messageLines = wrapText(errorMessage, 38);
    messageLines.forEach(line => {
      if (currentRow < 18) {
        rows[currentRow] = ` ${line}${' '.repeat(Math.max(0, 38 - line.length))} `;
        currentRow++;
      }
    });
    currentRow++;
  }
  
  // Details
  if (details && currentRow < 18) {
    const detailLines = wrapText(details, 38);
    detailLines.forEach(line => {
      if (currentRow < 18) {
        rows[currentRow] = ` ${line}${' '.repeat(Math.max(0, 38 - line.length))} `;
        currentRow++;
      }
    });
    currentRow++;
  }
  
  // Actions
  if (currentRow < 20) {
    rows[currentRow] = ''.padEnd(40, ' ');
    currentRow++;
    
    if (retryAction) {
      const actionText = ` ${retryAction}`;
      rows[currentRow] = actionText + ' '.repeat(Math.max(0, 40 - actionText.length));
      currentRow++;
    }
    
    rows[currentRow] = ' Press 100 for main index' + ' '.repeat(15);
    currentRow++;
  }
  
  // Navigation hints
  rows[22] = '────────────────────────────────────────';
  
  const defaultLinks: PageLink[] = [
    { label: 'Index', targetPage: '100', color: 'yellow' },
    ...navigationLinks
  ];
  
  if (defaultLinks.length > 0) {
    const linkText = defaultLinks
      .map(link => `${link.targetPage}:${link.label}`)
      .join(' ');
    const displayText = ` ${linkText.substring(0, 38)}`;
    rows[23] = displayText + ' '.repeat(Math.max(0, 40 - displayText.length));
  }

  return {
    id: pageNumber,
    title: `Error - ${errorInfo.title}`,
    rows,
    links: defaultLinks,
    meta: {
      source: 'error-handler',
      lastUpdated: new Date().toISOString(),
      inputMode: 'disabled',
      errorPage: true
    }
  };
}

/**
 * Creates a network error page
 */
export function createNetworkErrorPage(pageNumber: string, offline: boolean = false): TeletextPage {
  return createErrorPage({
    errorType: 'network',
    pageNumber,
    errorMessage: offline 
      ? 'You appear to be offline. Please check your internet connection.'
      : 'Unable to connect to the server. The service may be temporarily unavailable.',
    details: offline
      ? 'Displaying cached content where available.'
      : 'Please try again in a moment.',
    retryAction: 'Press R to retry'
  });
}

/**
 * Creates a timeout error page
 */
export function createTimeoutErrorPage(pageNumber: string, operation: string = 'request'): TeletextPage {
  return createErrorPage({
    errorType: 'timeout',
    pageNumber,
    errorMessage: `The ${operation} took too long to complete.`,
    details: 'This may be due to high server load or network issues.',
    retryAction: 'Press R to retry'
  });
}

/**
 * Creates an invalid input error page
 */
export function createInvalidInputErrorPage(
  pageNumber: string, 
  input: string, 
  expectedFormat: string
): TeletextPage {
  return createErrorPage({
    errorType: 'invalid_input',
    pageNumber,
    errorMessage: `Invalid input: "${input}"`,
    details: `Expected: ${expectedFormat}`,
    retryAction: 'Press any key to continue'
  });
}

/**
 * Creates a session expired error page
 */
export function createSessionExpiredPage(pageNumber: string, sessionType: string = 'session'): TeletextPage {
  return createErrorPage({
    errorType: 'session_expired',
    pageNumber,
    errorMessage: `Your ${sessionType} has expired.`,
    details: 'Sessions expire after a period of inactivity for security reasons.',
    retryAction: 'Press any key to start a new session'
  });
}

/**
 * Creates a 404 not found error page
 */
export function createNotFoundPage(pageNumber: string): TeletextPage {
  return createErrorPage({
    errorType: 'not_found',
    pageNumber,
    errorMessage: `Page ${pageNumber} could not be found.`,
    details: 'This page may not exist or is not yet implemented.',
    navigationLinks: [
      { label: 'News', targetPage: '200', color: 'red' },
      { label: 'Sports', targetPage: '300', color: 'green' },
      { label: 'Weather', targetPage: '400', color: 'blue' }
    ]
  });
}

/**
 * Creates an AI service error page
 */
export function createAIServiceErrorPage(pageNumber: string, retryable: boolean = true): TeletextPage {
  return createErrorPage({
    errorType: 'ai_service',
    pageNumber,
    errorMessage: 'The AI service is currently unavailable.',
    details: retryable 
      ? 'This is usually temporary. Please try again.'
      : 'Please try again later or visit another section.',
    retryAction: retryable ? 'Press R to retry' : undefined,
    navigationLinks: [
      { label: 'Games', targetPage: '600', color: 'green' },
      { label: 'Settings', targetPage: '700', color: 'blue' }
    ]
  });
}

/**
 * Creates a rate limit error page
 */
export function createRateLimitErrorPage(pageNumber: string, waitSeconds?: number): TeletextPage {
  const waitMessage = waitSeconds 
    ? `Please wait ${waitSeconds} seconds before trying again.`
    : 'Please wait a moment before trying again.';
  
  return createErrorPage({
    errorType: 'rate_limit',
    pageNumber,
    errorMessage: 'Too many requests. Please slow down.',
    details: waitMessage,
    retryAction: waitSeconds ? `Retry available in ${waitSeconds}s` : 'Press R to retry'
  });
}

/**
 * Creates a generic error page
 */
export function createGenericErrorPage(
  pageNumber: string, 
  message: string = 'An unexpected error occurred.'
): TeletextPage {
  return createErrorPage({
    errorType: 'generic',
    pageNumber,
    errorMessage: message,
    details: 'Please try again or return to the main index.',
    retryAction: 'Press R to retry'
  });
}

/**
 * Gets error information for display
 */
function getErrorInfo(errorType: ErrorType): { title: string; icon: string } {
  switch (errorType) {
    case 'network':
      return { title: 'NETWORK ERROR', icon: '! CONNECTION LOST !' };
    case 'timeout':
      return { title: 'TIMEOUT ERROR', icon: '* REQUEST TIMEOUT *' };
    case 'invalid_input':
      return { title: 'INVALID INPUT', icon: 'X INPUT ERROR X' };
    case 'session_expired':
      return { title: 'SESSION EXPIRED', icon: '~ SESSION TIMEOUT ~' };
    case 'not_found':
      return { title: 'PAGE NOT FOUND', icon: '404' };
    case 'ai_service':
      return { title: 'AI SERVICE ERROR', icon: '# AI UNAVAILABLE #' };
    case 'rate_limit':
      return { title: 'RATE LIMIT', icon: '= TOO MANY REQUESTS =' };
    case 'generic':
    default:
      return { title: 'ERROR', icon: '! ERROR !' };
  }
}

/**
 * Centers text within 40 characters
 */
function centerText(text: string): string {
  const padding = Math.max(0, Math.floor((40 - text.length) / 2));
  return ''.padEnd(padding, ' ') + text + ''.padEnd(40 - padding - text.length, ' ');
}

/**
 * Wraps text to specified width
 */
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    // Handle words longer than maxWidth
    if (word.length > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      // Split long word
      for (let i = 0; i < word.length; i += maxWidth) {
        lines.push(word.substring(i, i + maxWidth));
      }
      continue;
    }
    
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}
