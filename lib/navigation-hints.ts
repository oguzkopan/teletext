/**
 * Navigation Hints System for Modern Teletext
 * 
 * Generates contextual navigation hints for page footers based on:
 * - Page type (selection, content, AI, quiz, etc.)
 * - Input mode (single-digit, multi-digit)
 * - Available navigation options (back, colored buttons, etc.)
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { TeletextPage } from '@/types/teletext';
import { NavigationHint } from './layout-engine';

/**
 * Generates navigation hints for a page based on its context and metadata.
 * 
 * Requirement 13.1: Display navigation hints in footer
 * Requirement 13.2: For selection pages: "Enter number to select"
 * Requirement 13.3: For content pages: "100=INDEX BACK=PREVIOUS"
 * Requirement 13.4: For pages with colored buttons: show colored button hints
 * Requirement 13.5: Update hints based on current page context
 * 
 * @param page - The teletext page to generate hints for
 * @param canGoBack - Whether back navigation is available
 * @returns Array of navigation hints to display in footer
 */
export function generateNavigationHints(
  page: TeletextPage,
  canGoBack: boolean = false
): NavigationHint[] {
  const hints: NavigationHint[] = [];

  // Check for custom hints first (highest priority)
  // Requirement 13.5: Update hints based on current page context
  if (page.meta?.customHints && page.meta.customHints.length > 0) {
    return page.meta.customHints.map(text => ({ text }));
  }

  // Determine page type and generate appropriate hints
  const inputMode = page.meta?.inputMode;
  const hasInputOptions = page.meta?.inputOptions && page.meta.inputOptions.length > 0;
  const hasColoredButtons = page.links.some(link => link.color);

  // Selection pages with single-digit input
  // Requirement 13.2: For selection pages: "Enter number to select"
  if (inputMode === 'single' || hasInputOptions) {
    hints.push({ text: 'Enter number to select' });
  }

  // Always show INDEX option for easy navigation home
  // Requirement 13.3: For content pages: "100=INDEX BACK=PREVIOUS"
  if (page.id !== '100') {
    hints.push({ text: '100=INDEX' });
  }

  // Show BACK option if navigation history exists
  // Requirement 13.3: For content pages: "100=INDEX BACK=PREVIOUS"
  if (canGoBack) {
    hints.push({ text: 'BACK=PREVIOUS' });
  }

  // Add colored button hints if available
  // Requirement 13.4: For pages with colored buttons: show colored button hints
  if (hasColoredButtons) {
    const coloredLinks = page.links.filter(link => link.color);
    
    // Group by color and create hints
    const colorGroups = new Map<string, string[]>();
    for (const link of coloredLinks) {
      if (link.color) {
        const labels = colorGroups.get(link.color) || [];
        labels.push(link.label);
        colorGroups.set(link.color, labels);
      }
    }

    // Add hints for each color
    for (const [color, labels] of colorGroups) {
      const colorUpper = color.toUpperCase();
      const labelText = labels.join('/');
      hints.push({ 
        text: `${colorUpper}=${labelText}`,
        color 
      });
    }
  }

  // Special hints for specific page types
  const pageNumber = parseInt(page.id.split('-')[0], 10);

  // AI pages (500-599)
  if (pageNumber >= 500 && pageNumber < 600) {
    // Check if this is a loading page
    if (page.meta?.loading) {
      hints.unshift({ text: 'Generating response...' });
    }
  }

  // Quiz/Game pages (600-699)
  if (pageNumber >= 600 && pageNumber < 700) {
    // Check if this is a quiz question page
    if (page.meta?.progress) {
      const { current, total } = page.meta.progress;
      hints.unshift({ text: `Question ${current}/${total}` });
    }
  }

  // Settings pages (800-899)
  if (pageNumber >= 800 && pageNumber < 900) {
    if (page.meta?.settingsPage) {
      hints.unshift({ text: 'Use arrows to navigate' });
    }
  }

  // If no hints were generated, provide default
  // Requirement 13.1: Display navigation hints in footer
  if (hints.length === 0) {
    hints.push({ text: 'Enter page number to navigate' });
  }

  return hints;
}

/**
 * Generates hints specifically for selection pages with numbered options.
 * 
 * @param optionCount - Number of options available (1-9)
 * @returns Navigation hints for selection page
 */
export function generateSelectionHints(optionCount: number): NavigationHint[] {
  const hints: NavigationHint[] = [];
  
  if (optionCount > 0 && optionCount <= 9) {
    hints.push({ text: 'Enter number to select' });
  }
  
  hints.push({ text: '100=INDEX' });
  
  return hints;
}

/**
 * Generates hints for content pages (news, sports, markets, etc.).
 * 
 * @param canGoBack - Whether back navigation is available
 * @param hasMorePages - Whether there are more pages in sequence
 * @returns Navigation hints for content page
 */
export function generateContentHints(
  canGoBack: boolean = false,
  hasMorePages: boolean = false
): NavigationHint[] {
  const hints: NavigationHint[] = [];
  
  hints.push({ text: '100=INDEX' });
  
  if (canGoBack) {
    hints.push({ text: 'BACK=PREVIOUS' });
  }
  
  if (hasMorePages) {
    hints.push({ text: 'NEXT=Continue' });
  }
  
  return hints;
}

/**
 * Generates hints for AI interaction pages.
 * 
 * @param isLoading - Whether AI is generating a response
 * @param canGoBack - Whether back navigation is available
 * @returns Navigation hints for AI page
 */
export function generateAIHints(
  isLoading: boolean = false,
  canGoBack: boolean = false
): NavigationHint[] {
  const hints: NavigationHint[] = [];
  
  if (isLoading) {
    hints.push({ text: 'Generating response...' });
  }
  
  hints.push({ text: '100=INDEX' });
  hints.push({ text: '500=AI' });
  
  if (canGoBack) {
    hints.push({ text: 'BACK=PREVIOUS' });
  }
  
  return hints;
}

/**
 * Generates hints for quiz/game pages.
 * 
 * @param questionNumber - Current question number
 * @param totalQuestions - Total number of questions
 * @param canGoBack - Whether back navigation is available
 * @returns Navigation hints for quiz page
 */
export function generateQuizHints(
  questionNumber?: number,
  totalQuestions?: number,
  canGoBack: boolean = false
): NavigationHint[] {
  const hints: NavigationHint[] = [];
  
  if (questionNumber && totalQuestions) {
    hints.push({ text: `Question ${questionNumber}/${totalQuestions}` });
  }
  
  hints.push({ text: 'Enter 1-4 to answer' });
  hints.push({ text: '100=INDEX' });
  
  if (canGoBack) {
    hints.push({ text: 'BACK=PREVIOUS' });
  }
  
  return hints;
}

/**
 * Generates hints for error pages.
 * 
 * @returns Navigation hints for error page
 */
export function generateErrorHints(): NavigationHint[] {
  return [
    { text: '100=INDEX' },
    { text: 'BACK=PREVIOUS' }
  ];
}

/**
 * Generates hints for the main index page (100).
 * 
 * @returns Navigation hints for index page
 */
export function generateIndexHints(): NavigationHint[] {
  return [
    { text: 'Enter page number to navigate' }
  ];
}
