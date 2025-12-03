/**
 * Navigation Router for Modern Teletext
 * 
 * Centralized navigation logic for all pages with support for:
 * - Page number validation (100-999)
 * - Navigation history (back/forward)
 * - Input mode detection (single/double/triple digit)
 * - Error handling for invalid pages
 * - Arrow key navigation
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 14.1, 14.2, 14.3
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Input mode determines how input is processed
 * - single: 1 digit (e.g., menu options 1-9)
 * - double: 2 digits (e.g., sub-pages 10-99)
 * - triple: 3 digits (standard page navigation 100-899)
 * - text: full text input (e.g., AI questions, search queries)
 * - disabled: no keyboard input allowed (e.g., error pages - only back button works)
 */
export type InputMode = 'single' | 'double' | 'triple' | 'text' | 'disabled';

/**
 * Navigation state managed by the router
 */
export interface NavigationState {
  currentPage: TeletextPage | null;
  inputBuffer: string;
  history: string[];
  historyIndex: number;
  expectedInputLength: number;
  loading: boolean;
  error: string | null;
}

/**
 * Navigation error types
 */
export enum NavigationErrorType {
  INVALID_PAGE_NUMBER = 'INVALID_PAGE_NUMBER',
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  NAVIGATION_FAILED = 'NAVIGATION_FAILED',
  FETCH_ERROR = 'FETCH_ERROR'
}

/**
 * Navigation error with type and message
 */
export class NavigationError extends Error {
  constructor(
    public type: NavigationErrorType,
    message: string
  ) {
    super(message);
    this.name = 'NavigationError';
  }
}

/**
 * Options for page fetching
 */
export interface FetchPageOptions {
  signal?: AbortSignal;
  sessionId?: string;
}

/**
 * Result of page fetch operation
 */
export interface FetchPageResult {
  page: TeletextPage | null;
  fromCache: boolean;
}

/**
 * Page fetch function type
 */
export type PageFetcher = (
  pageId: string,
  options?: FetchPageOptions
) => Promise<FetchPageResult>;

/**
 * Navigation Router Class
 * 
 * Manages navigation state, history, and page transitions.
 * Provides validation and error handling for all navigation operations.
 */
export class NavigationRouter {
  private state: NavigationState;
  private pageFetcher: PageFetcher;
  private maxHistorySize: number;

  constructor(
    pageFetcher: PageFetcher,
    initialPage?: TeletextPage,
    maxHistorySize: number = 50
  ) {
    this.pageFetcher = pageFetcher;
    this.maxHistorySize = maxHistorySize;
    
    this.state = {
      currentPage: initialPage || null,
      inputBuffer: '',
      history: initialPage ? [initialPage.id] : [],
      historyIndex: initialPage ? 0 : -1,
      expectedInputLength: 3,
      loading: false,
      error: null
    };
  }

  /**
   * Validates page number is in valid range (100-999)
   * Supports standard pages (e.g., "202"), sub-pages (e.g., "202-1"), 
   * and multi-page articles (e.g., "202-1-2")
   * 
   * Requirement: 6.1, 6.3, 6.4, 8.2, 8.3
   */
  public isValidPageNumber(pageId: string): boolean {
    // Check for multi-page article format (e.g., "202-1-2" for article 1, page 2)
    const multiPageMatch = pageId.match(/^(\d{3})-(\d+)-(\d+)$/);
    if (multiPageMatch) {
      const basePageNumber = parseInt(multiPageMatch[1], 10);
      const articleIndex = parseInt(multiPageMatch[2], 10);
      const pageIndex = parseInt(multiPageMatch[3], 10);
      
      return !isNaN(basePageNumber) && 
             basePageNumber >= 100 && 
             basePageNumber <= 999 &&
             !isNaN(articleIndex) &&
             articleIndex >= 1 &&
             articleIndex <= 99 &&
             !isNaN(pageIndex) &&
             pageIndex >= 2 &&
             pageIndex <= 99;
    }
    
    // Check for sub-page format (e.g., "202-1", "202-2")
    const subPageMatch = pageId.match(/^(\d{3})-(\d+)$/);
    if (subPageMatch) {
      const basePageNumber = parseInt(subPageMatch[1], 10);
      const subPageIndex = parseInt(subPageMatch[2], 10);
      
      return !isNaN(basePageNumber) && 
             basePageNumber >= 100 && 
             basePageNumber <= 999 &&
             !isNaN(subPageIndex) &&
             subPageIndex >= 1 &&
             subPageIndex <= 99;
    }
    
    // Standard 3-digit page number
    const num = parseInt(pageId, 10);
    return !isNaN(num) && num >= 100 && num <= 999;
  }

  /**
   * Determines the input mode for a given page
   * 
   * Requirement: 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4
   */
  public getPageInputMode(page: TeletextPage): InputMode {
    // Check page metadata first - this is the authoritative source
    if (page.meta?.inputMode) {
      return page.meta.inputMode;
    }
    
    // Determine from page type
    const pageNumber = parseInt(page.id, 10);
    
    // Selection pages with numbered options use single-digit input
    if (page.links && page.links.length > 0 && page.links.length <= 9) {
      const hasNumberedOptions = page.links.every((link, index) => 
        link.label === (index + 1).toString()
      );
      if (hasNumberedOptions) {
        return 'single';
      }
    }
    
    // AI pages (500-599) and Games (600-699) often use single-digit or text
    if ((pageNumber >= 500 && pageNumber < 600) || (pageNumber >= 600 && pageNumber < 700)) {
      // Check if page has single-digit options
      if (page.meta?.inputOptions && page.meta.inputOptions.length <= 9) {
        return 'single';
      }
    }
    
    // Default to 3-digit input for standard page navigation
    return 'triple';
  }

  /**
   * Navigates to a specific page
   * 
   * Requirement: 8.1, 8.2, 8.3, 14.1, 14.2
   */
  public async navigateToPage(
    pageId: string,
    options?: FetchPageOptions
  ): Promise<void> {
    // Validate page number
    // Requirement: 6.1, 6.3, 6.4, 8.3 - Display error for invalid page numbers
    if (!this.isValidPageNumber(pageId)) {
      const error = new NavigationError(
        NavigationErrorType.INVALID_PAGE_NUMBER,
        `Invalid page number: ${pageId}. Page numbers must be between 100 and 999.`
      );
      this.state.error = error.message;
      throw error;
    }

    this.state.loading = true;
    this.state.error = null;

    try {
      // Fetch the page
      // Requirement: 8.2 - Navigate to valid page
      const result = await this.pageFetcher(pageId, options);
      
      if (!result.page) {
        // Requirement: 14.2 - Display "Page not found" for missing pages
        const error = new NavigationError(
          NavigationErrorType.PAGE_NOT_FOUND,
          `Page ${pageId} not found. Press 100 to return to index.`
        );
        this.state.error = error.message;
        throw error;
      }

      // Update current page
      this.state.currentPage = result.page;
      
      // Update history
      // Requirement: 8.4 - Support back button
      this.addToHistory(pageId);
      
      // Update expected input length based on new page
      const inputMode = this.getPageInputMode(result.page);
      this.state.expectedInputLength = inputMode === 'single' ? 1 : 
                                       inputMode === 'double' ? 2 : 
                                       inputMode === 'text' ? 0 : 3; // 0 for text means variable length
      
      // Clear input buffer after successful navigation
      this.state.inputBuffer = '';
      
    } catch (error) {
      // Requirement: 14.3 - Log errors and provide recovery
      console.error('Navigation error:', error);
      
      if (error instanceof NavigationError) {
        throw error;
      }
      
      // Wrap unknown errors
      const navError = new NavigationError(
        NavigationErrorType.NAVIGATION_FAILED,
        `Failed to navigate to page ${pageId}. Press 100 to return to index.`
      );
      this.state.error = navError.message;
      throw navError;
      
    } finally {
      this.state.loading = false;
    }
  }

  /**
   * Navigates back in history
   * 
   * Requirement: 8.4
   */
  public async navigateBack(options?: FetchPageOptions): Promise<void> {
    if (!this.canGoBack()) {
      return;
    }

    const newIndex = this.state.historyIndex - 1;
    const pageId = this.state.history[newIndex];
    
    this.state.loading = true;
    this.state.error = null;

    try {
      const result = await this.pageFetcher(pageId, options);
      
      if (result.page) {
        this.state.currentPage = result.page;
        this.state.historyIndex = newIndex;
        
        // Update expected input length
        const inputMode = this.getPageInputMode(result.page);
        this.state.expectedInputLength = inputMode === 'single' ? 1 : 
                                         inputMode === 'double' ? 2 : 
                                         inputMode === 'text' ? 0 : 3;
      }
    } catch (error) {
      console.error('Back navigation error:', error);
      this.state.error = 'Failed to navigate back';
    } finally {
      this.state.loading = false;
    }
  }

  /**
   * Navigates forward in history
   * 
   * Requirement: 8.4
   */
  public async navigateForward(options?: FetchPageOptions): Promise<void> {
    if (!this.canGoForward()) {
      return;
    }

    const newIndex = this.state.historyIndex + 1;
    const pageId = this.state.history[newIndex];
    
    this.state.loading = true;
    this.state.error = null;

    try {
      const result = await this.pageFetcher(pageId, options);
      
      if (result.page) {
        this.state.currentPage = result.page;
        this.state.historyIndex = newIndex;
        
        // Update expected input length
        const inputMode = this.getPageInputMode(result.page);
        this.state.expectedInputLength = inputMode === 'single' ? 1 : 
                                         inputMode === 'double' ? 2 : 
                                         inputMode === 'text' ? 0 : 3;
      }
    } catch (error) {
      console.error('Forward navigation error:', error);
      this.state.error = 'Failed to navigate forward';
    } finally {
      this.state.loading = false;
    }
  }

  /**
   * Adds a page to navigation history
   * 
   * Requirement: 8.4
   */
  private addToHistory(pageId: string): void {
    // Remove any forward history
    this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    
    // Add new page
    this.state.history.push(pageId);
    this.state.historyIndex = this.state.history.length - 1;
    
    // Trim if exceeds max size
    if (this.state.history.length > this.maxHistorySize) {
      this.state.history.shift();
      this.state.historyIndex--;
    }
  }

  /**
   * Gets the current page
   */
  public getCurrentPage(): TeletextPage | null {
    return this.state.currentPage;
  }

  /**
   * Gets the input buffer
   */
  public getInputBuffer(): string {
    return this.state.inputBuffer;
  }

  /**
   * Gets the expected input length for current page
   */
  public getExpectedInputLength(): number {
    return this.state.expectedInputLength;
  }

  /**
   * Gets the navigation history
   */
  public getNavigationHistory(): string[] {
    return [...this.state.history];
  }

  /**
   * Checks if back navigation is possible
   */
  public canGoBack(): boolean {
    return this.state.historyIndex > 0;
  }

  /**
   * Checks if forward navigation is possible
   */
  public canGoForward(): boolean {
    return this.state.historyIndex < this.state.history.length - 1;
  }

  /**
   * Gets the current navigation state
   */
  public getState(): Readonly<NavigationState> {
    return { ...this.state };
  }

  /**
   * Gets the current error message
   */
  public getError(): string | null {
    return this.state.error;
  }

  /**
   * Clears the current error
   */
  public clearError(): void {
    this.state.error = null;
  }

  /**
   * Checks if currently loading
   */
  public isLoading(): boolean {
    return this.state.loading;
  }

  /**
   * Navigates to the next page (channel up)
   * 
   * Requirement: 6.7
   */
  public async navigateUp(options?: FetchPageOptions): Promise<void> {
    if (!this.state.currentPage) {
      return;
    }

    const currentPageNum = parseInt(this.state.currentPage.id.split('-')[0], 10);
    if (isNaN(currentPageNum)) {
      return;
    }

    // Navigate to next page (increment by 1)
    const nextPageNum = currentPageNum + 1;
    if (nextPageNum <= 999) {
      try {
        await this.navigateToPage(nextPageNum.toString(), options);
      } catch (error) {
        // If page doesn't exist, try to find the next available page
        console.log(`Page ${nextPageNum} not found, staying on current page`);
      }
    }
  }

  /**
   * Navigates to the previous page (channel down)
   * 
   * Requirement: 6.7
   */
  public async navigateDown(options?: FetchPageOptions): Promise<void> {
    if (!this.state.currentPage) {
      return;
    }

    const currentPageNum = parseInt(this.state.currentPage.id.split('-')[0], 10);
    if (isNaN(currentPageNum)) {
      return;
    }

    // Navigate to previous page (decrement by 1)
    const prevPageNum = currentPageNum - 1;
    if (prevPageNum >= 100) {
      try {
        await this.navigateToPage(prevPageNum.toString(), options);
      } catch (error) {
        // If page doesn't exist, try to find the previous available page
        console.log(`Page ${prevPageNum} not found, staying on current page`);
      }
    }
  }
}
