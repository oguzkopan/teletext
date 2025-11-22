/**
 * Page Header Helper
 * Standardizes page headers across all adapters
 * Format: {pageNumber} 🎃KIROWEEN🎃 {time} 🔴🟢🟡🔵
 */

/**
 * Creates a standardized header for all pages
 * @param pageNumber - The page number (e.g., "200", "300")
 * @param title - Optional page title (not used in compact format)
 * @returns Array of header rows [row1, row2]
 */
export function createStandardHeader(pageNumber: string, title?: string): [string, string] {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Compact header format matching P100
  const headerRow = `{cyan}${pageNumber} 🎃KIROWEEN🎃 ${timeStr} {red}🔴{green}🟢{yellow}🟡{blue}🔵`;
  const separatorRow = '{magenta}════════════════════════════════════════';

  return [headerRow, separatorRow];
}

/**
 * Creates a standardized footer for all pages
 * @returns Footer row with colored button indicators
 */
export function createStandardFooter(): string {
  return '{red}🔴NEWS {green}🟢SPORT {yellow}🟡WEATHER {blue}🔵AI {white}999=HELP';
}

/**
 * Pads rows array to exactly 24 rows, each exactly 40 characters
 * @param rows - Array of row strings
 * @returns Padded array of exactly 24 rows
 */
export function padRowsTo24(rows: string[]): string[] {
  const paddedRows = rows.map((row) => {
    const visibleLength = getVisibleLength(row);

    if (visibleLength > 40) {
      return row.substring(0, 40);
    } else if (visibleLength < 40) {
      const paddingNeeded = 40 - visibleLength;
      return row + ' '.repeat(paddingNeeded);
    }

    return row;
  });

  // Ensure exactly 24 rows
  while (paddedRows.length < 24) {
    paddedRows.push(''.padEnd(40, ' '));
  }

  return paddedRows.slice(0, 24);
}

/**
 * Strips color codes and emojis to get visible length
 * @param text - Text with color codes
 * @returns Visible character count
 */
function getVisibleLength(text: string): number {
  // Remove color codes like {red}, {green}, etc.
  let cleaned = text.replace(/\{(red|green|yellow|blue|magenta|cyan|white|black)\}/gi, '');

  // Count emojis as 2 characters (they take up 2 character widths in monospace)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = cleaned.match(emojiRegex) || [];
  const emojiCount = emojis.length;

  // Remove emojis to count regular characters
  const withoutEmojis = cleaned.replace(emojiRegex, '');

  // Total visible length = regular chars + (emojis * 2)
  return withoutEmojis.length + emojiCount * 2;
}
