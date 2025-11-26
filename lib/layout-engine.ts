/**
 * Layout Engine for Modern Teletext
 * 
 * Core system responsible for rendering text in proper rows.
 * Output is 24 rows tall with flexible width to use full screen.
 * 
 * For navigation hints generation, see lib/navigation-hints.ts
 */

export const TELETEXT_HEIGHT = 30;

/**
 * Wraps text to fit within a specified width, breaking at word boundaries when possible.
 * 
 * @param text - The text to wrap
 * @param width - Maximum width per line (default: no limit)
 * @returns Array of wrapped lines
 */
export function wrapText(text: string, width: number = Infinity): string[] {
  if (!text) {
    return [];
  }

  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push('');
      continue;
    }

    let currentLine = '';
    const words = paragraph.split(' ');

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // If word itself is longer than width, break it
      if (word.length > width) {
        // Push current line if it has content
        if (currentLine.length > 0) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        
        // Break the long word into chunks
        for (let j = 0; j < word.length; j += width) {
          lines.push(word.substring(j, j + width));
        }
        continue;
      }

      // Check if adding this word would exceed width
      const testLine = currentLine.length === 0 
        ? word 
        : currentLine + ' ' + word;

      if (testLine.length <= width) {
        currentLine = testLine;
      } else {
        // Push current line and start new one
        lines.push(currentLine);
        currentLine = word;
      }
    }

    // Push remaining content
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Pads text to exactly the specified width.
 * 
 * @param text - The text to pad
 * @param width - Target width (default: 40 characters)
 * @param align - Alignment: 'left', 'center', or 'right' (default: 'left')
 * @returns Padded text of exact width
 */
export function padText(
  text: string, 
  width: number = Infinity, 
  align: 'left' | 'center' | 'right' = 'left'
): string {
  // First truncate if too long
  const truncated = text.length > width ? text.substring(0, width) : text;
  
  if (truncated.length === width) {
    return truncated;
  }

  const padding = width - truncated.length;

  switch (align) {
    case 'center': {
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + truncated + ' '.repeat(rightPad);
    }
    case 'right': {
      return ' '.repeat(padding) + truncated;
    }
    case 'left':
    default: {
      return truncated + ' '.repeat(padding);
    }
  }
}

/**
 * Truncates text to fit within specified width, adding ellipsis if needed.
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 40 characters)
 * @param ellipsis - String to append when truncating (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string, 
  maxLength: number = TELETEXT_WIDTH, 
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Ensure ellipsis fits within maxLength
  const ellipsisLength = Math.min(ellipsis.length, maxLength);
  const contentLength = maxLength - ellipsisLength;

  if (contentLength <= 0) {
    return ellipsis.substring(0, maxLength);
  }

  return text.substring(0, contentLength) + ellipsis.substring(0, ellipsisLength);
}

/**
 * Validates that output is exactly 40 characters × 24 rows.
 * 
 * @param rows - Array of text rows to validate
 * @returns Validation result with any errors
 */
export function validateOutput(rows: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check row count
  if (rows.length !== TELETEXT_HEIGHT) {
    errors.push(
      `Invalid row count: expected ${TELETEXT_HEIGHT}, got ${rows.length}`
    );
  }

  // Check each row width
  rows.forEach((row, index) => {
    if (row.length !== TELETEXT_WIDTH) {
      errors.push(
        `Row ${index} has invalid width: expected ${TELETEXT_WIDTH}, got ${row.length}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Ensures output is exactly 40 characters × 24 rows by padding or truncating.
 * 
 * @param rows - Array of text rows
 * @returns Normalized array of exactly 24 rows, each 40 characters wide
 */
export function normalizeOutput(rows: string[]): string[] {
  const normalized: string[] = [];

  // Take first 24 rows (or fewer if input is shorter)
  const rowsToProcess = rows.slice(0, TELETEXT_HEIGHT);

  // Pad each row to exactly 40 characters
  for (const row of rowsToProcess) {
    normalized.push(padText(row, TELETEXT_WIDTH, 'left'));
  }

  // Add empty rows if we have fewer than 24
  while (normalized.length < TELETEXT_HEIGHT) {
    normalized.push(' '.repeat(TELETEXT_WIDTH));
  }

  return normalized;
}

/**
 * Navigation hint for footer display
 */
export interface NavigationHint {
  text: string;
  color?: string;
}

/**
 * Renders a page header with page number, title, and optional timestamp.
 * Returns exactly 2 rows.
 * 
 * @param pageNumber - Page number to display (e.g., "100")
 * @param title - Page title
 * @param timestamp - Optional timestamp string
 * @returns Array of 2 header rows, each 40 characters wide
 */
export function renderHeader(
  pageNumber: string,
  title: string,
  timestamp?: string
): string[] {
  const rows: string[] = [];

  // Row 1: Page number (left), Title (center), Timestamp (right)
  let row1 = '';
  
  // Page number on the left (pad to 8 chars for spacing)
  const pageNumPadded = padText(pageNumber, 8, 'left');
  
  // Calculate space for title in center
  const rightContent = timestamp ? timestamp : '';
  const rightPadded = padText(rightContent, 8, 'right');
  
  // Center section has remaining space
  const centerWidth = TELETEXT_WIDTH - 8 - 8; // 40 - 8 - 8 = 24
  const titleCentered = padText(truncateText(title, centerWidth), centerWidth, 'center');
  
  row1 = pageNumPadded + titleCentered + rightPadded;
  rows.push(row1);

  // Row 2: Separator line (can be customized later)
  rows.push(' '.repeat(TELETEXT_WIDTH));

  return rows;
}

/**
 * Renders a page footer with navigation hints.
 * Returns exactly 2 rows.
 * 
 * @param hints - Array of navigation hints to display
 * @returns Array of 2 footer rows, each 40 characters wide
 */
export function renderFooter(hints: NavigationHint[]): string[] {
  const rows: string[] = [];

  // Row 1: Empty separator
  rows.push(' '.repeat(TELETEXT_WIDTH));

  // Row 2: Navigation hints
  if (hints.length === 0) {
    rows.push(' '.repeat(TELETEXT_WIDTH));
  } else {
    // Join hints with spacing
    const hintsText = hints.map(h => h.text).join('  ');
    rows.push(padText(truncateText(hintsText, TELETEXT_WIDTH), TELETEXT_WIDTH, 'center'));
  }

  return rows;
}

/**
 * Calculates column widths for multi-column layouts.
 * 
 * For 2 columns: 19 chars each + 2 char gutter = 40
 * For 3 columns: 12 chars each + 2 char gutters (4 total) = 40
 * 
 * @param totalWidth - Total width available (default: 40)
 * @param columns - Number of columns (1-3)
 * @param gutter - Space between columns (default: 2)
 * @returns Array of column widths
 */
export function calculateColumnWidths(
  totalWidth: number = TELETEXT_WIDTH,
  columns: number = 1,
  gutter: number = 2
): number[] {
  if (columns < 1) {
    columns = 1;
  }
  
  if (columns === 1) {
    return [totalWidth];
  }

  // Calculate total gutter space
  const totalGutter = gutter * (columns - 1);
  
  // Calculate available space for columns
  const availableWidth = totalWidth - totalGutter;
  
  // Divide evenly among columns
  const baseWidth = Math.floor(availableWidth / columns);
  
  // Handle any remainder by adding to last column
  const remainder = availableWidth - (baseWidth * columns);
  
  const widths: number[] = Array(columns).fill(baseWidth);
  if (remainder > 0) {
    widths[widths.length - 1] += remainder;
  }
  
  return widths;
}

/**
 * Distributes text lines across multiple columns.
 * 
 * @param lines - Array of text lines to distribute
 * @param columnWidths - Width of each column
 * @returns Array of columns, each containing an array of lines
 */
export function flowTextToColumns(
  lines: string[],
  columnWidths: number[]
): string[][] {
  const columns: string[][] = [];
  const numColumns = columnWidths.length;
  
  if (numColumns === 0) {
    return [];
  }
  
  if (numColumns === 1) {
    return [lines];
  }
  
  // Calculate lines per column (distribute evenly)
  const linesPerColumn = Math.ceil(lines.length / numColumns);
  
  // Distribute lines across columns
  for (let col = 0; col < numColumns; col++) {
    const start = col * linesPerColumn;
    const end = Math.min(start + linesPerColumn, lines.length);
    const columnLines = lines.slice(start, end);
    
    // Wrap each line to fit column width
    const wrappedLines: string[] = [];
    for (const line of columnLines) {
      const wrapped = wrapText(line, columnWidths[col]);
      wrappedLines.push(...wrapped);
    }
    
    columns.push(wrappedLines);
  }
  
  return columns;
}

/**
 * Merges multiple columns horizontally into single rows.
 * 
 * @param columns - Array of columns, each containing lines
 * @param columnWidths - Width of each column
 * @param gutter - Space between columns (default: 2)
 * @returns Array of merged rows
 */
export function mergeColumns(
  columns: string[][],
  columnWidths: number[],
  gutter: number = 2
): string[] {
  if (columns.length === 0) {
    return [];
  }
  
  if (columns.length === 1) {
    return columns[0].map(line => padText(line, TELETEXT_WIDTH, 'left'));
  }
  
  // Find maximum number of rows across all columns
  const maxRows = Math.max(...columns.map(col => col.length));
  
  const mergedRows: string[] = [];
  const gutterStr = ' '.repeat(gutter);
  
  // Merge each row across columns
  for (let row = 0; row < maxRows; row++) {
    let mergedLine = '';
    
    for (let col = 0; col < columns.length; col++) {
      const cellText = columns[col][row] || '';
      const paddedCell = padText(cellText, columnWidths[col], 'left');
      
      mergedLine += paddedCell;
      
      // Add gutter between columns (but not after last column)
      if (col < columns.length - 1) {
        mergedLine += gutterStr;
      }
    }
    
    mergedRows.push(mergedLine);
  }
  
  return mergedRows;
}

/**
 * Renders a complete page with multi-column layout.
 * Includes header, content area, and footer.
 * 
 * @param options - Page rendering options
 * @returns Array of exactly 24 rows, each 40 characters wide
 */
export function renderMultiColumn(options: {
  pageNumber: string;
  title: string;
  content: string | string[];
  columns: number;
  timestamp?: string;
  hints?: NavigationHint[];
  gutter?: number;
}): string[] {
  const { 
    pageNumber, 
    title, 
    content, 
    columns, 
    timestamp, 
    hints = [],
    gutter = 2
  } = options;

  const rows: string[] = [];

  // Render header (2 rows)
  const headerRows = renderHeader(pageNumber, title, timestamp);
  rows.push(...headerRows);

  // Calculate content area (24 - 2 header - 2 footer = 20 rows)
  const headerHeight = 2;
  const footerHeight = 2;
  const contentHeight = TELETEXT_HEIGHT - headerHeight - footerHeight;

  // Prepare content lines
  let contentLines: string[];
  if (typeof content === 'string') {
    contentLines = wrapText(content, TELETEXT_WIDTH);
  } else {
    // If array, wrap each line and flatten
    contentLines = content.flatMap(line => wrapText(line, TELETEXT_WIDTH));
  }

  // Calculate column widths
  const columnWidths = calculateColumnWidths(TELETEXT_WIDTH, columns, gutter);
  
  // Flow text to columns
  const columnData = flowTextToColumns(contentLines, columnWidths);
  
  // Merge columns horizontally
  const mergedContent = mergeColumns(columnData, columnWidths, gutter);

  // Take only the lines that fit in content area
  const contentToDisplay = mergedContent.slice(0, contentHeight);

  // Add content lines
  rows.push(...contentToDisplay);

  // Fill remaining content area with empty lines
  while (rows.length < TELETEXT_HEIGHT - footerHeight) {
    rows.push(' '.repeat(TELETEXT_WIDTH));
  }

  // Render footer (2 rows)
  const footerRows = renderFooter(hints);
  rows.push(...footerRows);

  // Ensure exactly 24 rows (should already be, but validate)
  return normalizeOutput(rows);
}

/**
 * Renders a complete page with single-column layout.
 * Includes header, content area, and footer.
 * 
 * @param options - Page rendering options
 * @returns Array of exactly 24 rows, each 40 characters wide
 */
export function renderSingleColumn(options: {
  pageNumber: string;
  title: string;
  content: string | string[];
  timestamp?: string;
  hints?: NavigationHint[];
}): string[] {
  const { pageNumber, title, content, timestamp, hints = [] } = options;

  const rows: string[] = [];

  // Render header (2 rows)
  const headerRows = renderHeader(pageNumber, title, timestamp);
  rows.push(...headerRows);

  // Calculate content area (24 - 2 header - 2 footer = 20 rows)
  const headerHeight = 2;
  const footerHeight = 2;
  const contentHeight = TELETEXT_HEIGHT - headerHeight - footerHeight;

  // Prepare content lines
  let contentLines: string[];
  if (typeof content === 'string') {
    contentLines = wrapText(content, TELETEXT_WIDTH);
  } else {
    // If array, wrap each line and flatten
    contentLines = content.flatMap(line => wrapText(line, TELETEXT_WIDTH));
  }

  // Take only the lines that fit in content area
  const contentToDisplay = contentLines.slice(0, contentHeight);

  // Add content lines (padded to 40 chars)
  for (const line of contentToDisplay) {
    rows.push(padText(line, TELETEXT_WIDTH, 'left'));
  }

  // Fill remaining content area with empty lines
  while (rows.length < TELETEXT_HEIGHT - footerHeight) {
    rows.push(' '.repeat(TELETEXT_WIDTH));
  }

  // Render footer (2 rows)
  const footerRows = renderFooter(hints);
  rows.push(...footerRows);

  // Ensure exactly 24 rows (should already be, but validate)
  return normalizeOutput(rows);
}
