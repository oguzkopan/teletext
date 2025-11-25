/**
 * Input Handler for Modern Teletext
 * 
 * Processes keyboard input with mode-aware logic:
 * - Single-digit mode: navigate immediately on valid option
 * - Multi-digit mode: add to buffer and auto-navigate when full
 * - Display input buffer to user
 * - Clear and manage input buffer
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { TeletextPage } from '@/types/teletext';
import { NavigationRouter, InputMode } from './navigation-router';

/**
 * Input handler options
 */
export interface InputHandlerOptions {
  onNavigate?: (pageId: string) => void;
  onError?: (error: string) => void;
  onBufferChange?: (buffer: string) => void;
}

/**
 * Input Handler Class
 * 
 * Manages keyboard input processing with mode-aware logic.
 * Handles digit input, buffer management, and auto-navigation.
 */
export class InputHandler {
  private navigationRouter: NavigationRouter;
  private inputBuffer: string;
  private options: InputHandlerOptions;

  constructor(
    navigationRouter: NavigationRouter,
    options: InputHandlerOptions = {}
  ) {
    this.navigationRouter = navigationRouter;
    this.inputBuffer = '';
    this.options = options;
  }

  /**
   * Handles digit input with mode-aware logic
   * 
   * For single-digit mode: navigate immediately on valid option
   * For multi-digit mode: add to buffer and auto-navigate when full
   * 
   * Requirement: 7.1, 7.2, 7.3
   */
  public async handleDigitInput(digit: number): Promise<void> {
    // Validate digit is 0-9
    if (digit < 0 || digit > 9) {
      return;
    }

    const currentPage = this.navigationRouter.getCurrentPage();
    if (!currentPage) {
      return;
    }

    const inputMode = this.navigationRouter.getPageInputMode(currentPage);
    const digitStr = digit.toString();

    // Requirement: 7.1 - Display digit in input buffer
    // For single-digit mode, navigate immediately
    if (inputMode === 'single') {
      // Check if this is a valid option
      if (currentPage.meta?.inputOptions?.includes(digitStr)) {
        // Find matching link
        const link = currentPage.links.find(l => l.label === digitStr);
        
        try {
          if (link && link.targetPage) {
            // Navigate to linked page
            await this.navigationRouter.navigateToPage(link.targetPage);
            this.notifyNavigate(link.targetPage);
          } else {
            // No link found - use sub-page navigation
            const subPageId = `${currentPage.id}-${digitStr}`;
            await this.navigationRouter.navigateToPage(subPageId);
            this.notifyNavigate(subPageId);
          }
          
          // Clear buffer after successful navigation
          this.clearInputBuffer();
        } catch (error) {
          // Navigation failed - show error
          const errorMsg = error instanceof Error ? error.message : `Invalid option: ${digitStr}`;
          this.notifyError(errorMsg);
        }
        
        return;
      }
      
      // Invalid option - show error
      this.notifyError(`Invalid option: ${digitStr}`);
      return;
    }

    // For multi-digit mode, add to buffer
    const maxLength = inputMode === 'double' ? 2 : 3;
    
    // Requirement: 7.2 - Display all digits in sequence
    if (this.inputBuffer.length < maxLength) {
      this.inputBuffer += digitStr;
      this.notifyBufferChange(this.inputBuffer);
      
      // Requirement: 7.3 - Auto-navigate when buffer is full
      if (this.inputBuffer.length === maxLength) {
        try {
          await this.navigationRouter.navigateToPage(this.inputBuffer);
          this.notifyNavigate(this.inputBuffer);
          
          // Clear buffer after successful navigation
          this.clearInputBuffer();
        } catch (error) {
          // Navigation failed - show error but keep buffer
          const errorMsg = error instanceof Error ? error.message : 'Navigation failed';
          this.notifyError(errorMsg);
          
          // Clear buffer after error
          this.clearInputBuffer();
        }
      }
    }
  }

  /**
   * Removes the last digit from the buffer
   * 
   * Requirement: 7.4
   */
  public removeLastDigit(): void {
    if (this.inputBuffer.length > 0) {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
      this.notifyBufferChange(this.inputBuffer);
    }
  }

  /**
   * Clears the input buffer
   * 
   * Requirement: 7.5
   */
  public clearInputBuffer(): void {
    this.inputBuffer = '';
    this.notifyBufferChange(this.inputBuffer);
  }

  /**
   * Gets the current input buffer
   */
  public getInputBuffer(): string {
    return this.inputBuffer;
  }

  /**
   * Renders the input buffer for display
   * Shows [___] with entered digits
   * 
   * Requirement: 7.1, 7.2
   */
  public renderInputBuffer(): string {
    const currentPage = this.navigationRouter.getCurrentPage();
    if (!currentPage) {
      return '';
    }

    const inputMode = this.navigationRouter.getPageInputMode(currentPage);
    
    // Don't show buffer for single-digit mode (immediate navigation)
    if (inputMode === 'single') {
      return '';
    }

    const maxLength = inputMode === 'double' ? 2 : 3;
    
    // Show input buffer with underscores for remaining digits
    let display = this.inputBuffer;
    while (display.length < maxLength) {
      display += '_';
    }
    
    return `[${display}]`;
  }

  /**
   * Shows input hint based on current page mode
   */
  public showInputHint(): string {
    const currentPage = this.navigationRouter.getCurrentPage();
    if (!currentPage) {
      return '';
    }

    const inputMode = this.navigationRouter.getPageInputMode(currentPage);
    
    if (inputMode === 'single') {
      return 'Enter 1-digit option';
    } else if (inputMode === 'double') {
      return 'Enter 2-digit page';
    } else {
      return 'Enter 3-digit page';
    }
  }

  /**
   * Handles keyboard event
   */
  public async handleKeyPress(event: KeyboardEvent): Promise<void> {
    const key = event.key;

    // Handle digit keys (0-9)
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      const digit = parseInt(key, 10);
      await this.handleDigitInput(digit);
      return;
    }

    // Handle backspace
    if (key === 'Backspace') {
      event.preventDefault();
      this.removeLastDigit();
      return;
    }

    // Handle escape (clear buffer)
    if (key === 'Escape') {
      event.preventDefault();
      this.clearInputBuffer();
      return;
    }
  }

  /**
   * Notifies navigation callback
   */
  private notifyNavigate(pageId: string): void {
    if (this.options.onNavigate) {
      this.options.onNavigate(pageId);
    }
  }

  /**
   * Notifies error callback
   */
  private notifyError(error: string): void {
    if (this.options.onError) {
      this.options.onError(error);
    }
  }

  /**
   * Notifies buffer change callback
   */
  private notifyBufferChange(buffer: string): void {
    if (this.options.onBufferChange) {
      this.options.onBufferChange(buffer);
    }
  }
}
