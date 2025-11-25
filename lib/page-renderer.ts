/**
 * Page Renderer
 * 
 * Integrates the layout engine with PageRouter to render pages with proper
 * 40×24 format, multi-column layouts, and navigation hints.
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */

import { TeletextPage } from '@/types/teletext';
import {
  renderSingleColumn,
  renderMultiColumn,
  NavigationHint,
  TELETEXT_WIDTH,
  TELETEXT_HEIGHT
} from './layout-engine';
import { generateNavigationHints } from './navigation-hints';

/**
 * Page rendering options
 */
export interface PageRenderOptions {
  useLayoutEngine?: boolean;  // Whether to use the new layout engine
  forceColumnCount?: number;  // Override automatic column detection
}

/**
 * Determines the appropriate number of columns for a page based on content type
 * 
 * Requirements: 1.2, 1.3, 12.1, 12.2, 12.3
 */
export function determineColumnCount(page: TeletextPage): number {
  const pageNum = parseInt(page.id, 10);
  
  // Index page (100) - use 2 columns for space efficiency
  if (pageNum === 100) {
    return 2;
  }
  
  // News pages (200-299) - single column for readability
  if (pageNum >= 200 && pageNum < 300) {
    return 1;
  }
  
  // Sports pages (300-399) - single column for tabular data
  if (pageNum >= 300 && pageNum < 400) {
    return 1;
  }
  
  // Markets pages (400-499) - single column for tabular data
  if (pageNum >= 400 && pageNum < 500) {
    return 1;
  }
  
  // AI pages (500-599) - single column for prompts and responses
  if (pageNum >= 500 && pageNum < 600) {
    return 1;
  }
  
  // Game pages (600-699) - single column for questions and options
  if (pageNum >= 600 && pageNum < 700) {
    return 1;
  }
  
  // Default to single column
  return 1;
}

/**
 * Extracts content from page rows, removing any existing headers/footers
 * 
 * This function attempts to identify and remove headers and footers from
 * pre-formatted page content to extract just the core content.
 */
export function extractPageContent(page: TeletextPage): string[] {
  const rows = page.rows;
  
  // If page has no rows, return empty array
  if (!rows || rows.length === 0) {
    return [];
  }
  
  // Simple heuristic: skip first 2 rows (likely header) and last 2 rows (likely footer)
  // This is a basic approach - more sophisticated detection could be added
  const contentStartRow = 2;
  const contentEndRow = Math.max(rows.length - 2, contentStartRow);
  
  const contentRows = rows.slice(contentStartRow, contentEndRow);
  
  // Filter out empty rows at the start and end
  let startIndex = 0;
  let endIndex = contentRows.length;
  
  // Find first non-empty row
  while (startIndex < contentRows.length && contentRows[startIndex].trim() === '') {
    startIndex++;
  }
  
  // Find last non-empty row
  while (endIndex > startIndex && contentRows[endIndex - 1].trim() === '') {
    endIndex--;
  }
  
  return contentRows.slice(startIndex, endIndex);
}

/**
 * Renders a page using the layout engine
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */
export function renderPageWithLayoutEngine(
  page: TeletextPage,
  options: PageRenderOptions = {}
): TeletextPage {
  const { forceColumnCount } = options;
  
  // Determine column count
  const columns = forceColumnCount ?? determineColumnCount(page);
  
  // Extract content from page
  const content = extractPageContent(page);
  
  // Generate navigation hints
  const hints: NavigationHint[] = generateNavigationHints(page);
  
  // Get timestamp if available
  const timestamp = page.meta?.lastUpdated 
    ? new Date(page.meta.lastUpdated).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : undefined;
  
  // Render using appropriate layout
  let renderedRows: string[];
  
  if (columns === 1) {
    renderedRows = renderSingleColumn({
      pageNumber: page.id,
      title: page.title,
      content,
      timestamp,
      hints
    });
  } else {
    renderedRows = renderMultiColumn({
      pageNumber: page.id,
      title: page.title,
      content,
      columns,
      timestamp,
      hints,
      gutter: 2
    });
  }
  
  // Validate output
  if (renderedRows.length !== TELETEXT_HEIGHT) {
    console.warn(
      `Layout engine produced ${renderedRows.length} rows instead of ${TELETEXT_HEIGHT}`
    );
  }
  
  renderedRows.forEach((row, index) => {
    if (row.length !== TELETEXT_WIDTH) {
      console.warn(
        `Row ${index} has width ${row.length} instead of ${TELETEXT_WIDTH}`
      );
    }
  });
  
  // Return page with rendered rows
  return {
    ...page,
    rows: renderedRows,
    meta: {
      ...page.meta,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Checks if a page should use the layout engine
 * 
 * Pages that have already been processed by adapters with useLayoutManager flag
 * should not be re-processed by the layout engine.
 */
export function shouldUseLayoutEngine(page: TeletextPage): boolean {
  // Don't re-process pages that were already processed by adapters
  if (page.meta?.useLayoutManager) {
    return false;
  }
  
  // Don't re-process pages that were already rendered with layout engine
  if (page.meta?.renderedWithLayoutEngine) {
    return false;
  }
  
  // Use layout engine for all other pages
  return true;
}

/**
 * Page renderer class for integration with PageRouter
 */
export class PageRenderer {
  /**
   * Renders a page, applying the layout engine if appropriate
   */
  render(page: TeletextPage, options: PageRenderOptions = {}): TeletextPage {
    // Check if we should use the layout engine
    const useEngine = options.useLayoutEngine ?? shouldUseLayoutEngine(page);
    
    if (!useEngine) {
      return page;
    }
    
    // Render with layout engine
    return renderPageWithLayoutEngine(page, options);
  }
  
  /**
   * Determines the appropriate column count for a page
   */
  getColumnCount(page: TeletextPage): number {
    return determineColumnCount(page);
  }
}

/**
 * Default page renderer instance
 */
export const pageRenderer = new PageRenderer();
