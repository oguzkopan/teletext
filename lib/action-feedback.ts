/**
 * Action Feedback Utility
 * 
 * Provides utilities for displaying success and error feedback messages
 * with animations for user actions in the teletext interface.
 * 
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */

/**
 * Feedback message type
 */
export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

/**
 * Feedback animation type
 */
export type FeedbackAnimation = 'checkmark' | 'cross' | 'flash' | 'celebration' | 'none';

/**
 * Feedback configuration
 */
export interface FeedbackConfig {
  type: FeedbackType;
  message: string;
  animation?: FeedbackAnimation;
  duration?: number; // milliseconds (default: 2500)
  color?: string; // Teletext color code
}

/**
 * Feedback display result
 */
export interface FeedbackDisplay {
  lines: string[];
  color: string;
  duration: number;
  animation: FeedbackAnimation;
}

/**
 * Default colors for feedback types
 */
const FEEDBACK_COLORS: Record<FeedbackType, string> = {
  success: 'green',
  error: 'red',
  info: 'cyan',
  warning: 'yellow'
};

/**
 * Default animations for feedback types
 */
const FEEDBACK_ANIMATIONS: Record<FeedbackType, FeedbackAnimation> = {
  success: 'checkmark',
  error: 'cross',
  info: 'none',
  warning: 'flash'
};

/**
 * Creates a success message with checkmark animation
 * 
 * @param message - Success message to display
 * @param options - Optional configuration
 * @returns Feedback display configuration
 * 
 * @example
 * createSuccessMessage('Settings saved!')
 * // Returns: { lines: ['✓ Settings saved!'], color: 'green', duration: 2500, animation: 'checkmark' }
 */
export function createSuccessMessage(
  message: string,
  options: { duration?: number; animation?: FeedbackAnimation } = {}
): FeedbackDisplay {
  const { duration = 2500, animation = 'checkmark' } = options;
  
  return {
    lines: [`✓ ${message}`],
    color: FEEDBACK_COLORS.success,
    duration,
    animation
  };
}

/**
 * Creates an error message with X animation
 * 
 * @param message - Error message to display
 * @param options - Optional configuration
 * @returns Feedback display configuration
 * 
 * @example
 * createErrorMessage('Failed to save settings')
 * // Returns: { lines: ['✗ Failed to save settings'], color: 'red', duration: 2500, animation: 'cross' }
 */
export function createErrorMessage(
  message: string,
  options: { duration?: number; animation?: FeedbackAnimation } = {}
): FeedbackDisplay {
  const { duration = 2500, animation = 'cross' } = options;
  
  return {
    lines: [`✗ ${message}`],
    color: FEEDBACK_COLORS.error,
    duration,
    animation
  };
}

/**
 * Creates a "SAVED" message with flash effect
 * 
 * @param itemName - Optional name of what was saved
 * @param options - Optional configuration
 * @returns Feedback display configuration
 * 
 * @example
 * createSavedMessage()
 * // Returns: { lines: ['✓ SAVED'], color: 'green', duration: 2000, animation: 'flash' }
 * 
 * createSavedMessage('Theme preferences')
 * // Returns: { lines: ['✓ Theme preferences SAVED'], color: 'green', duration: 2000, animation: 'flash' }
 */
export function createSavedMessage(
  itemName?: string,
  options: { duration?: number } = {}
): FeedbackDisplay {
  const { duration = 2000 } = options;
  const message = itemName ? `✓ ${itemName} SAVED` : '✓ SAVED';
  
  return {
    lines: [message],
    color: FEEDBACK_COLORS.success,
    duration,
    animation: 'flash'
  };
}

/**
 * Creates a celebration animation with ASCII confetti
 * 
 * @param message - Celebration message
 * @param options - Optional configuration
 * @returns Feedback display configuration
 * 
 * @example
 * createCelebrationMessage('Quiz Complete!')
 * // Returns: {
 * //   lines: [
 * //     '    *  ·  *  ·  *  ·  *  ·  *    ',
 * //     '  ·  *  ·  *  ·  *  ·  *  ·  *  ',
 * //     '    *  ·  *  ·  *  ·  *  ·  *    ',
 * //     '',
 * //     '🎉 Quiz Complete! 🎉',
 * //     '✓ CONGRATULATIONS!'
 * //   ],
 * //   color: 'green',
 * //   duration: 3000,
 * //   animation: 'celebration'
 * // }
 */
export function createCelebrationMessage(
  message: string,
  options: { duration?: number; showConfetti?: boolean } = {}
): FeedbackDisplay {
  const { duration = 3000, showConfetti = true } = options;
  const lines: string[] = [];
  
  // Add confetti if enabled
  if (showConfetti) {
    lines.push(
      '    *  ·  *  ·  *  ·  *  ·  *    ',
      '  ·  *  ·  *  ·  *  ·  *  ·  *  ',
      '    *  ·  *  ·  *  ·  *  ·  *    ',
      ''
    );
  }
  
  // Add celebration message
  lines.push(`🎉 ${message} 🎉`);
  lines.push('✓ CONGRATULATIONS!');
  
  return {
    lines,
    color: FEEDBACK_COLORS.success,
    duration,
    animation: 'celebration'
  };
}

/**
 * Creates a generic feedback message
 * 
 * @param config - Feedback configuration
 * @returns Feedback display configuration
 * 
 * @example
 * createFeedbackMessage({
 *   type: 'success',
 *   message: 'Operation completed',
 *   animation: 'checkmark',
 *   duration: 2500
 * })
 */
export function createFeedbackMessage(config: FeedbackConfig): FeedbackDisplay {
  const {
    type,
    message,
    animation = FEEDBACK_ANIMATIONS[type],
    duration = 2500,
    color = FEEDBACK_COLORS[type]
  } = config;
  
  let lines: string[] = [];
  
  // Add appropriate symbol based on type
  switch (type) {
    case 'success':
      lines = [`✓ ${message}`];
      break;
    case 'error':
      lines = [`✗ ${message}`];
      break;
    case 'warning':
      lines = [`⚠ ${message}`];
      break;
    case 'info':
      lines = [`ℹ ${message}`];
      break;
    default:
      lines = [message];
  }
  
  return {
    lines,
    color,
    duration,
    animation
  };
}

/**
 * Centers a feedback message for teletext display
 * 
 * @param message - Message to center
 * @param width - Display width (default: 40)
 * @returns Centered message
 */
export function centerFeedbackMessage(message: string, width: number = 40): string {
  if (message.length >= width) {
    return message.substring(0, width);
  }
  
  const leftPadding = Math.floor((width - message.length) / 2);
  const rightPadding = width - message.length - leftPadding;
  return ' '.repeat(leftPadding) + message + ' '.repeat(rightPadding);
}

/**
 * Formats feedback display for teletext page
 * 
 * @param feedback - Feedback display configuration
 * @param options - Formatting options
 * @returns Array of formatted lines
 * 
 * @example
 * const feedback = createSuccessMessage('Saved!');
 * const formatted = formatFeedbackDisplay(feedback, { centered: true });
 * // Returns centered lines ready for display
 */
export function formatFeedbackDisplay(
  feedback: FeedbackDisplay,
  options: { centered?: boolean; width?: number } = {}
): string[] {
  const { centered = true, width = 40 } = options;
  
  if (!centered) {
    return feedback.lines;
  }
  
  return feedback.lines.map(line => centerFeedbackMessage(line, width));
}

/**
 * Creates a multi-line feedback display with border
 * 
 * @param feedback - Feedback display configuration
 * @param options - Display options
 * @returns Array of formatted lines with border
 * 
 * @example
 * const feedback = createSuccessMessage('Settings saved!');
 * const display = createBorderedFeedback(feedback);
 * // Returns:
 * // [
 * //   '════════════════════════════════════',
 * //   '                                    ',
 * //   '        ✓ Settings saved!          ',
 * //   '                                    ',
 * //   '════════════════════════════════════'
 * // ]
 */
export function createBorderedFeedback(
  feedback: FeedbackDisplay,
  options: { width?: number; borderChar?: string } = {}
): string[] {
  const { width = 40, borderChar = '═' } = options;
  const border = borderChar.repeat(width);
  const emptyLine = ' '.repeat(width);
  
  const centeredLines = feedback.lines.map(line => centerFeedbackMessage(line, width));
  
  return [
    border,
    emptyLine,
    ...centeredLines,
    emptyLine,
    border
  ];
}

/**
 * Creates a flash animation effect for feedback
 * Returns CSS class name for the flash animation
 * 
 * @param type - Feedback type
 * @returns CSS class name
 */
export function getFlashAnimationClass(type: FeedbackType): string {
  return `feedback-flash-${type}`;
}

/**
 * Gets the appropriate CSS color class for feedback type
 * 
 * @param type - Feedback type
 * @returns CSS color class name
 */
export function getFeedbackColorClass(type: FeedbackType): string {
  return `teletext-${FEEDBACK_COLORS[type]}`;
}

/**
 * Validates feedback configuration
 * 
 * @param config - Feedback configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateFeedbackConfig(config: FeedbackConfig): void {
  if (!config.message || config.message.trim().length === 0) {
    throw new Error('Feedback message cannot be empty');
  }
  
  if (config.duration !== undefined && config.duration < 0) {
    throw new Error('Feedback duration cannot be negative');
  }
  
  const validTypes: FeedbackType[] = ['success', 'error', 'info', 'warning'];
  if (!validTypes.includes(config.type)) {
    throw new Error(`Invalid feedback type: ${config.type}`);
  }
}
