/**
 * Progress Indicators Utility
 * 
 * Provides utilities for displaying progress indicators in multi-step processes
 * including step counters, ASCII progress bars, question counters, and completion animations.
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

/**
 * Progress indicator configuration
 */
export interface ProgressConfig {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

/**
 * Progress bar configuration
 */
export interface ProgressBarConfig {
  current: number;
  total: number;
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  showLabel?: boolean;
}

/**
 * Completion animation configuration
 */
export interface CompletionConfig {
  type: 'checkmark' | 'celebration' | 'custom';
  message?: string;
  customSymbol?: string;
}

/**
 * Renders a step counter (e.g., "Step 2 of 4")
 * 
 * @param config - Progress configuration
 * @returns Formatted step counter string
 * 
 * @example
 * renderStepCounter({ current: 2, total: 4 })
 * // Returns: "Step 2 of 4"
 * 
 * renderStepCounter({ current: 2, total: 4, label: 'Question' })
 * // Returns: "Question 2 of 4"
 */
export function renderStepCounter(config: ProgressConfig): string {
  const { current, total, label = 'Step', showPercentage = false } = config;
  
  if (current < 1 || current > total || total < 1) {
    throw new Error('Invalid progress values: current must be between 1 and total');
  }
  
  let counter = `${label} ${current} of ${total}`;
  
  if (showPercentage) {
    const percentage = Math.round((current / total) * 100);
    counter += ` (${percentage}%)`;
  }
  
  return counter;
}

/**
 * Renders a question counter (e.g., "Question 3/10")
 * 
 * @param current - Current question number (1-based)
 * @param total - Total number of questions
 * @returns Formatted question counter string
 * 
 * @example
 * renderQuestionCounter(3, 10)
 * // Returns: "Question 3/10"
 */
export function renderQuestionCounter(current: number, total: number): string {
  if (current < 1 || current > total || total < 1) {
    throw new Error('Invalid question values: current must be between 1 and total');
  }
  
  return `Question ${current}/${total}`;
}

/**
 * Renders an ASCII progress bar
 * 
 * @param config - Progress bar configuration
 * @returns Formatted ASCII progress bar string
 * 
 * @example
 * renderProgressBar({ current: 5, total: 10 })
 * // Returns: "▓▓▓▓▓░░░░░"
 * 
 * renderProgressBar({ current: 3, total: 10, width: 20 })
 * // Returns: "▓▓▓▓▓▓░░░░░░░░░░░░░░"
 * 
 * renderProgressBar({ current: 7, total: 10, showLabel: true })
 * // Returns: "▓▓▓▓▓▓▓░░░ 70%"
 */
export function renderProgressBar(config: ProgressBarConfig): string {
  const {
    current,
    total,
    width = 10,
    filledChar = '▓',
    emptyChar = '░',
    showLabel = false
  } = config;
  
  if (current < 0 || current > total || total < 1) {
    throw new Error('Invalid progress values: current must be between 0 and total');
  }
  
  if (width < 1) {
    throw new Error('Width must be at least 1');
  }
  
  const filledCount = Math.round((current / total) * width);
  const emptyCount = width - filledCount;
  
  const filled = filledChar.repeat(filledCount);
  const empty = emptyChar.repeat(emptyCount);
  const bar = filled + empty;
  
  if (showLabel) {
    const percentage = Math.round((current / total) * 100);
    return `${bar} ${percentage}%`;
  }
  
  return bar;
}

/**
 * Renders a completion animation with checkmark or celebration
 * 
 * @param config - Completion configuration
 * @returns Array of strings representing the completion animation/message
 * 
 * @example
 * renderCompletionAnimation({ type: 'checkmark' })
 * // Returns: ["✓ COMPLETE!"]
 * 
 * renderCompletionAnimation({ type: 'celebration', message: 'Quiz Finished!' })
 * // Returns: ["🎉 Quiz Finished! 🎉", "✓ COMPLETE!"]
 * 
 * renderCompletionAnimation({ type: 'custom', customSymbol: '★', message: 'Perfect Score!' })
 * // Returns: ["★ Perfect Score! ★"]
 */
export function renderCompletionAnimation(config: CompletionConfig): string[] {
  const { type, message, customSymbol } = config;
  const lines: string[] = [];
  
  switch (type) {
    case 'checkmark':
      lines.push('✓ COMPLETE!');
      if (message) {
        lines.push(message);
      }
      break;
      
    case 'celebration':
      if (message) {
        lines.push(`🎉 ${message} 🎉`);
      } else {
        lines.push('🎉 CONGRATULATIONS! 🎉');
      }
      lines.push('✓ COMPLETE!');
      break;
      
    case 'custom':
      if (customSymbol && message) {
        lines.push(`${customSymbol} ${message} ${customSymbol}`);
      } else if (message) {
        lines.push(message);
      } else {
        lines.push('✓ COMPLETE!');
      }
      break;
      
    default:
      lines.push('✓ COMPLETE!');
  }
  
  return lines;
}

/**
 * Renders a combined progress indicator with step counter and progress bar
 * 
 * @param config - Progress configuration
 * @param barWidth - Width of the progress bar (default: 20)
 * @returns Array of strings with step counter and progress bar
 * 
 * @example
 * renderCombinedProgress({ current: 2, total: 4 })
 * // Returns: ["Step 2 of 4", "▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░"]
 */
export function renderCombinedProgress(
  config: ProgressConfig,
  barWidth: number = 20
): string[] {
  const stepCounter = renderStepCounter(config);
  const progressBar = renderProgressBar({
    current: config.current,
    total: config.total,
    width: barWidth
  });
  
  return [stepCounter, progressBar];
}

/**
 * Calculates progress percentage
 * 
 * @param current - Current step/question
 * @param total - Total steps/questions
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(current: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  
  return Math.round((current / total) * 100);
}

/**
 * Formats a progress indicator for teletext display (40 characters wide)
 * Centers the progress indicator within the available width
 * 
 * @param indicator - Progress indicator string
 * @param width - Available width (default: 40)
 * @returns Centered progress indicator
 */
export function centerProgressIndicator(indicator: string, width: number = 40): string {
  if (indicator.length >= width) {
    return indicator.substring(0, width);
  }
  
  const leftPadding = Math.floor((width - indicator.length) / 2);
  const rightPadding = width - indicator.length - leftPadding;
  return ' '.repeat(leftPadding) + indicator + ' '.repeat(rightPadding);
}

/**
 * Creates a multi-line progress display suitable for teletext pages
 * 
 * @param config - Progress configuration
 * @param options - Display options
 * @returns Array of formatted lines for display
 * 
 * @example
 * createProgressDisplay({ current: 3, total: 5, label: 'Question' })
 * // Returns: [
 * //   "        Question 3 of 5         ",
 * //   "      ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░      ",
 * //   "             60%                "
 * // ]
 */
export function createProgressDisplay(
  config: ProgressConfig,
  options: {
    showBar?: boolean;
    showPercentage?: boolean;
    barWidth?: number;
    centered?: boolean;
  } = {}
): string[] {
  const {
    showBar = true,
    showPercentage = true,
    barWidth = 20,
    centered = true
  } = options;
  
  const lines: string[] = [];
  
  // Add step counter
  const stepCounter = renderStepCounter({
    ...config,
    showPercentage: false
  });
  lines.push(centered ? centerProgressIndicator(stepCounter) : stepCounter);
  
  // Add progress bar
  if (showBar) {
    const progressBar = renderProgressBar({
      current: config.current,
      total: config.total,
      width: barWidth
    });
    lines.push(centered ? centerProgressIndicator(progressBar) : progressBar);
  }
  
  // Add percentage
  if (showPercentage) {
    const percentage = calculateProgressPercentage(config.current, config.total);
    const percentageStr = `${percentage}%`;
    lines.push(centered ? centerProgressIndicator(percentageStr) : percentageStr);
  }
  
  return lines;
}

/**
 * Creates ASCII confetti animation for celebration
 * 
 * @returns Array of confetti lines
 */
export function createConfettiAnimation(): string[] {
  return [
    '    *  ·  *  ·  *  ·  *  ·  *    ',
    '  ·  *  ·  *  ·  *  ·  *  ·  *  ',
    '    *  ·  *  ·  *  ·  *  ·  *    '
  ];
}

/**
 * Validates progress values
 * 
 * @param current - Current step
 * @param total - Total steps
 * @throws Error if values are invalid
 */
export function validateProgressValues(current: number, total: number): void {
  if (!Number.isInteger(current) || !Number.isInteger(total)) {
    throw new Error('Progress values must be integers');
  }
  
  if (current < 0) {
    throw new Error('Current value cannot be negative');
  }
  
  if (total < 1) {
    throw new Error('Total must be at least 1');
  }
  
  if (current > total) {
    throw new Error('Current value cannot exceed total');
  }
}
