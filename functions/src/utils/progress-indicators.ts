/**
 * Progress Indicators Utility for Backend
 * 
 * Provides utilities for displaying progress indicators in multi-step processes
 * Simplified version for use in Firebase Functions adapters
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

/**
 * Renders a step counter (e.g., "Step 2 of 4")
 */
export function renderStepCounter(
  current: number,
  total: number,
  label: string = 'Step'
): string {
  return `${label} ${current} of ${total}`;
}

/**
 * Renders a question counter (e.g., "Question 3/10")
 */
export function renderQuestionCounter(current: number, total: number): string {
  return `Question ${current}/${total}`;
}

/**
 * Renders an ASCII progress bar
 */
export function renderProgressBar(
  current: number,
  total: number,
  width: number = 20
): string {
  const filledCount = Math.round((current / total) * width);
  const emptyCount = width - filledCount;
  
  return '▓'.repeat(filledCount) + '░'.repeat(emptyCount);
}

/**
 * Renders a completion message with checkmark
 */
export function renderCompletionMessage(message?: string): string[] {
  const lines = ['✓ COMPLETE!'];
  if (message) {
    lines.push(message);
  }
  return lines;
}

/**
 * Renders a celebration message
 */
export function renderCelebration(message?: string): string[] {
  if (message) {
    return [`🎉 ${message} 🎉`, '✓ COMPLETE!'];
  }
  return ['🎉 CONGRATULATIONS! 🎉', '✓ COMPLETE!'];
}

/**
 * Centers text within a given width
 */
export function centerText(text: string, width: number = 40): string {
  if (text.length >= width) {
    return text.substring(0, width);
  }
  
  const leftPadding = Math.floor((width - text.length) / 2);
  const rightPadding = width - text.length - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}

/**
 * Creates a full progress display for teletext pages
 */
export function createProgressDisplay(
  current: number,
  total: number,
  label: string = 'Step'
): string[] {
  const counter = renderStepCounter(current, total, label);
  const bar = renderProgressBar(current, total, 20);
  const percentage = Math.round((current / total) * 100);
  
  return [
    centerText(counter),
    centerText(bar),
    centerText(`${percentage}%`)
  ];
}

/**
 * Creates confetti animation lines
 */
export function createConfetti(): string[] {
  return [
    '    *  ·  *  ·  *  ·  *  ·  *    ',
    '  ·  *  ·  *  ·  *  ·  *  ·  *  ',
    '    *  ·  *  ·  *  ·  *  ·  *    '
  ];
}
