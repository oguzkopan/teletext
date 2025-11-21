/**
 * Interactive Element Highlighting Utilities
 * 
 * Provides utilities for highlighting interactive elements (buttons, links, selections)
 * with consistent visual styling across all pages.
 * 
 * Requirements:
 * - 25.1: Highlight interactive elements with brackets or color
 * - 25.2: Display visual highlight or underline on hover
 * - 25.3: Display border or background color change on focus
 * - 25.4: Use consistent visual styling across all pages
 * - 25.5: Show links in distinct color with indicator (►)
 */

export interface InteractiveElement {
  type: 'button' | 'link' | 'input' | 'selection';
  label: string;
  action?: string;  // Page number or command
  highlighted?: boolean;
}

export interface HighlightStyle {
  prefix: string;
  suffix: string;
  color?: string;
  className?: string;
}

/**
 * Formats an interactive element with appropriate visual indicators
 * Requirement 25.1: Highlight with brackets or color
 * Requirement 25.5: Show links with arrow indicator
 */
export function formatInteractiveElement(
  element: InteractiveElement,
  options: {
    showBrackets?: boolean;
    showLinkIndicator?: boolean;
    colorCode?: string;
  } = {}
): string {
  const { showBrackets = true, showLinkIndicator = true, colorCode } = options;
  
  let formatted = element.label;
  
  // Add link indicator for links (Requirement 25.5)
  if (element.type === 'link' && showLinkIndicator) {
    formatted = `► ${formatted}`;
  }
  
  // Add brackets for buttons and selections (Requirement 25.1)
  if ((element.type === 'button' || element.type === 'selection') && showBrackets) {
    formatted = `[${formatted}]`;
  }
  
  // Add color code if specified
  if (colorCode) {
    formatted = `{${colorCode}}${formatted}{white}`;
  }
  
  return formatted;
}

/**
 * Detects interactive elements in text
 * Looks for patterns like [1], [Option], ►Link, etc.
 */
export function detectInteractiveElements(text: string): Array<{
  start: number;
  end: number;
  content: string;
  type: 'button' | 'link' | 'selection';
}> {
  const elements: Array<{
    start: number;
    end: number;
    content: string;
    type: 'button' | 'link' | 'selection';
  }> = [];
  
  // Detect bracketed elements [...]
  const bracketRegex = /\[([^\]]+)\]/g;
  let match;
  
  while ((match = bracketRegex.exec(text)) !== null) {
    const content = match[1];
    const isNumeric = /^\d+$/.test(content);
    
    elements.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[0],
      type: isNumeric ? 'button' : 'selection'
    });
  }
  
  // Detect link indicators ►...
  // Match ► followed by one or more words (but stop at 'or', 'and', punctuation)
  const linkRegex = /►\s*([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*?)(?=\s+(?:or|and|,|\.|\||$)|$)/g;
  
  while ((match = linkRegex.exec(text)) !== null) {
    elements.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[0],
      type: 'link'
    });
  }
  
  return elements;
}

/**
 * Gets CSS class names for interactive element styling
 * Requirement 25.4: Consistent visual styling
 */
export function getInteractiveElementClasses(
  type: 'button' | 'link' | 'input' | 'selection',
  state: {
    hover?: boolean;
    focus?: boolean;
    active?: boolean;
  } = {}
): string {
  const classes = ['interactive-element', `interactive-${type}`];
  
  if (state.hover) classes.push('interactive-hover');
  if (state.focus) classes.push('interactive-focus');
  if (state.active) classes.push('interactive-active');
  
  return classes.join(' ');
}

/**
 * Generates CSS styles for interactive element highlighting
 * Requirements 25.2, 25.3: Hover and focus indicators
 */
export function getInteractiveElementStyles(theme: {
  colors: {
    text: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    cyan: string;
    white: string;
  };
}): string {
  return `
    /* Base interactive element styles - Requirement 25.1 */
    .interactive-element {
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      display: inline-block;
      position: relative;
    }
    
    /* Button styling */
    .interactive-button {
      font-weight: bold;
    }
    
    /* Link styling - Requirement 25.5 */
    .interactive-link {
      color: ${theme.colors.cyan};
      text-decoration: none;
    }
    
    /* Selection styling */
    .interactive-selection {
      color: ${theme.colors.yellow};
    }
    
    /* Hover effects - Requirement 25.2 */
    .interactive-element:hover,
    .interactive-hover {
      background-color: rgba(255, 255, 255, 0.15);
      text-decoration: underline;
      text-decoration-color: ${theme.colors.white};
      text-underline-offset: 2px;
      padding: 0 2px;
      border-radius: 2px;
    }
    
    .interactive-link:hover {
      color: ${theme.colors.white};
      text-decoration: underline;
    }
    
    /* Focus indicators - Requirement 25.3 */
    .interactive-element:focus,
    .interactive-focus {
      outline: 2px solid ${theme.colors.yellow};
      outline-offset: 2px;
      background-color: rgba(255, 255, 0, 0.1);
      border-radius: 2px;
    }
    
    /* Active state */
    .interactive-element:active,
    .interactive-active {
      background-color: rgba(255, 255, 255, 0.25);
      transform: scale(0.98);
    }
    
    /* Keyboard focus visible */
    .interactive-element:focus-visible {
      outline: 2px solid ${theme.colors.cyan};
      outline-offset: 2px;
      box-shadow: 0 0 8px ${theme.colors.cyan};
    }
    
    /* Disabled state */
    .interactive-element:disabled,
    .interactive-element.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* Animation for interactive elements */
    @keyframes interactive-pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    .interactive-element.pulse {
      animation: interactive-pulse 2s ease-in-out infinite;
    }
  `;
}

/**
 * Formats a navigation option with consistent styling
 * Requirement 25.1, 25.4: Consistent highlighting across pages
 */
export function formatNavigationOption(
  pageNumber: string | number,
  label: string,
  options: {
    showBrackets?: boolean;
    colorCode?: string;
    isLink?: boolean;
  } = {}
): string {
  const { showBrackets = false, colorCode, isLink = false } = options;
  
  const paddedNumber = String(pageNumber).padStart(3, ' ');
  let formatted = `${paddedNumber}. ${label}`;
  
  if (isLink) {
    formatted = `► ${formatted}`;
  }
  
  if (showBrackets) {
    formatted = `[${formatted}]`;
  }
  
  if (colorCode) {
    formatted = `{${colorCode}}${formatted}{white}`;
  }
  
  return formatted;
}

/**
 * Wraps text segments with interactive element markers
 * Used for parsing and rendering
 */
export function wrapInteractiveText(
  text: string,
  type: 'button' | 'link' | 'selection'
): string {
  if (type === 'link') {
    return `►${text}`;
  }
  return `[${text}]`;
}

/**
 * Checks if text contains interactive elements
 */
export function hasInteractiveElements(text: string): boolean {
  return /\[[^\]]+\]|►/.test(text);
}

/**
 * Extracts plain text from interactive element markup
 */
export function extractPlainText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]/g, '$1')  // Remove brackets
    .replace(/►\s*/g, '');            // Remove link indicators
}
