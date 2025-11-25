/**
 * Screen Dimensions Calculator
 * 
 * Dynamically calculates the available character width and height
 * based on the actual viewport size and font metrics.
 * 
 * This replaces the hardcoded 40×24 constraint with a responsive system
 * that adapts to different screen sizes.
 */

/**
 * Default dimensions (fallback for SSR or when calculation isn't possible)
 */
export const DEFAULT_WIDTH = 80;  // Modern full-screen default
export const DEFAULT_HEIGHT = 24;

/**
 * Minimum dimensions to ensure readability
 */
export const MIN_WIDTH = 40;
export const MIN_HEIGHT = 20;

/**
 * Maximum dimensions to prevent excessive line lengths
 */
export const MAX_WIDTH = 120;
export const MAX_HEIGHT = 40;

/**
 * Calculates the available character width based on viewport and font size
 * 
 * @param viewportWidth - Width of the viewport in pixels (default: window.innerWidth)
 * @param fontSize - Font size in pixels (default: 16)
 * @param charWidth - Width of a monospace character relative to font size (default: 0.6)
 * @param padding - Horizontal padding in characters (default: 2)
 * @returns Number of characters that fit horizontally
 */
export function calculateCharacterWidth(
  viewportWidth?: number,
  fontSize: number = 16,
  charWidth: number = 0.6,
  padding: number = 2
): number {
  // Use window.innerWidth if available (client-side)
  const width = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1920);
  
  // Calculate character width in pixels
  const charWidthPx = fontSize * charWidth;
  
  // Calculate available characters
  const availableChars = Math.floor(width / charWidthPx) - padding;
  
  // Clamp to min/max bounds
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, availableChars));
}

/**
 * Calculates the available character height based on viewport and font size
 * 
 * @param viewportHeight - Height of the viewport in pixels (default: window.innerHeight)
 * @param fontSize - Font size in pixels (default: 16)
 * @param lineHeight - Line height multiplier (default: 1.2)
 * @param padding - Vertical padding in rows (default: 0)
 * @returns Number of rows that fit vertically
 */
export function calculateCharacterHeight(
  viewportHeight?: number,
  fontSize: number = 16,
  lineHeight: number = 1.2,
  padding: number = 0
): number {
  // Use window.innerHeight if available (client-side)
  const height = viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 1080);
  
  // Calculate line height in pixels
  const lineHeightPx = fontSize * lineHeight;
  
  // Calculate available rows
  const availableRows = Math.floor(height / lineHeightPx) - padding;
  
  // Clamp to min/max bounds
  return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, availableRows));
}

/**
 * Gets the current screen dimensions
 * 
 * @returns Object with width and height in characters
 */
export function getScreenDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    // Server-side: return defaults
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }
  
  return {
    width: calculateCharacterWidth(),
    height: calculateCharacterHeight()
  };
}

/**
 * Hook-friendly function to get screen dimensions with resize handling
 * (To be used with React hooks in components)
 */
export function createDimensionsObserver(
  callback: (dimensions: { width: number; height: number }) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  const handleResize = () => {
    callback(getScreenDimensions());
  };
  
  // Initial call
  handleResize();
  
  // Listen for resize events
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Legacy compatibility: Export constants for code that expects fixed dimensions
 * These now return the default values, but new code should use getScreenDimensions()
 */
export const TELETEXT_WIDTH = DEFAULT_WIDTH;
export const TELETEXT_HEIGHT = DEFAULT_HEIGHT;
