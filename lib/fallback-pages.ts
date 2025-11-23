/**
 * Fallback pages for development when Firebase emulators are not running
 * These provide a better developer experience with helpful error messages
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates a fallback page when emulators are not running
 */
export function createEmulatorOfflinePage(pageId: string): TeletextPage {
  const rows = [
    `EMULATOR OFFLINE              P${pageId}`,
    '════════════════════════════════════',
    '',
    '⚠ FIREBASE EMULATORS NOT RUNNING ⚠',
    '',
    'The Firebase emulators need to be',
    'running to fetch this page.',
    '',
    'TO START EMULATORS:',
    '',
    '1. Open a new terminal',
    '2. Run: npm run emulators:start',
    '3. Wait for "All emulators ready"',
    '4. Refresh this page',
    '',
    'ALTERNATIVE:',
    'Use fallback pages below for',
    'offline-first development.',
    '',
    'See SETUP.md for more details.',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: pageId,
    title: 'Emulator Offline',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback index page (100) with visual enhancements
 * Full-screen 80-character layout matching the main index
 */
export function createFallbackIndexPage(): TeletextPage {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const rows = [
    `{cyan}100 {yellow}🎃 KIROWEEN TELETEXT 🎃{cyan} ${dateStr} ${timeStr} {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔══════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {magenta}MODERN TELETEXT{yellow}  {white}░▒▓█▓▒░  {cyan}Your Gateway to Information{yellow}           ║',
    '{yellow}╚══════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{cyan}▓▓▓ NEWS & INFO ▓▓▓      {magenta}▓▓▓ ENTERTAINMENT ▓▓▓    {yellow}▓▓▓ SERVICES ▓▓▓       ',
    '{green}101{white} System Status       {red}600{white} Games & Quizzes      {cyan}700{white} Settings          ',
    '{green}200{white} News Headlines      {red}601{white} Quiz of the Day      {cyan}701{white} Themes            ',
    '{green}201{white} UK News             {red}610{white} Bamboozle Quiz       {cyan}800{white} Dev Tools         ',
    '{green}202{white} World News          {red}620{white} Random Facts         {cyan}999{white} Help              ',
    '{green}203{white} Local News          {yellow}500{white} AI Chat             {magenta}666{white} Cursed Page       ',
    '{blue}───────────────────────────────────────────────────────────────────────────────',
    '{cyan}▓▓▓ SPORT & LEISURE ▓▓▓  {yellow}▓▓▓ MARKETS & MONEY ▓▓▓  {red}▓▓▓ WEATHER & TRAVEL ▓▓',
    '{green}300{white} Sport Headlines     {green}400{white} Markets Overview    {green}420{white} Weather Forecast  ',
    '{green}301{white} Football            {green}401{white} Stock Prices        {green}421{white} London Weather    ',
    '{green}302{white} Cricket             {green}402{white} Crypto Markets      {green}422{white} New York Weather  ',
    '{green}303{white} Tennis              {green}403{white} Commodities         {green}423{white} Tokyo Weather     ',
    '{green}304{white} Live Scores         {green}404{white} Void Page           {green}424{white} Traffic Info      ',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{cyan}🎃 NAVIGATION: {white}Type {yellow}3-digit{white} page number or use {red}R{white}/{green}G{white}/{yellow}Y{white}/{blue}B{white} buttons',
    '{white}Press {cyan}999{white} for help • Press {magenta}666{white} if you dare... 👻',
    '{blue}───────────────────────────────────────────────────────────────────────────────',
    '{yellow}POPULAR PAGES: {green}200{white} News {green}300{white} Sport {green}400{white} Markets {green}500{white} AI {green}600{white} Games',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{yellow}                    ⚡ Kiroween 2024 - Built with Kiro ⚡                       '
  ];

  return {
    id: '100',
    title: 'Main Index',
    rows: padRows(rows),
    links: [
      { label: 'HELP', targetPage: '999', color: 'red' },
      { label: 'ABOUT', targetPage: '199', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback news index page (200)
 */
export function createFallbackNewsPage(): TeletextPage {
  const rows = [
    'NEWS INDEX                   P200',
    '════════════════════════════════════',
    '',
    'NEWS SERVICE UNAVAILABLE',
    '',
    'The news service requires Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS NEWS:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Ensure NEWS_API_KEY is set',
    '   in .env.local',
    '',
    '3. Refresh this page',
    '',
    'See NEWS_API_SETUP.md for details.',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '200',
    title: 'News Index',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback sports page (300)
 */
export function createFallbackSportsPage(): TeletextPage {
  const rows = [
    'SPORT INDEX                  P300',
    '════════════════════════════════════',
    '',
    'SPORT SERVICE UNAVAILABLE',
    '',
    'The sport service requires Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS SPORT:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Ensure SPORTS_API_KEY is set',
    '   in .env.local (optional)',
    '',
    '3. Refresh this page',
    '',
    'See SPORTS_API_SETUP.md for details.',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '300',
    title: 'Sport Index',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback markets page (400)
 */
export function createFallbackMarketsPage(): TeletextPage {
  const rows = [
    'MARKETS INDEX                P400',
    '════════════════════════════════════',
    '',
    'MARKETS SERVICE UNAVAILABLE',
    '',
    'The markets service requires Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS MARKETS:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Refresh this page',
    '',
    'Market data is fetched from free',
    'APIs (CoinGecko, etc.)',
    '',
    'See MARKETS_API_SETUP.md for details.',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '400',
    title: 'Markets Index',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback AI page (500)
 */
export function createFallbackAIPage(): TeletextPage {
  const rows = [
    'AI ORACLE                    P500',
    '════════════════════════════════════',
    '',
    'AI SERVICE UNAVAILABLE',
    '',
    'The AI Oracle requires Firebase',
    'emulators and Vertex AI to be',
    'configured.',
    '',
    'TO ACCESS AI ORACLE:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Ensure Vertex AI is configured',
    '   See AI_ADAPTER_SETUP.md',
    '',
    '3. Refresh this page',
    '',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '500',
    title: 'AI Oracle',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback games page (600)
 */
export function createFallbackGamesPage(): TeletextPage {
  const rows = [
    'GAMES INDEX                  P600',
    '════════════════════════════════════',
    '',
    'GAMES SERVICE UNAVAILABLE',
    '',
    'The games service requires Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS GAMES:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Refresh this page',
    '',
    'Games include quizzes, Bamboozle,',
    'and random facts.',
    '',
    'See GAMES_ADAPTER_SETUP.md for details.',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '600',
    title: 'Games Index',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback settings page (700)
 */
export function createFallbackSettingsPage(): TeletextPage {
  const rows = [
    'SETTINGS                     P700',
    '════════════════════════════════════',
    '',
    'SETTINGS SERVICE UNAVAILABLE',
    '',
    'The settings service requires Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS SETTINGS:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Refresh this page',
    '',
    'Settings include themes, CRT effects,',
    'and keyboard shortcuts.',
    '',
    'See SETTINGS_ADAPTER_SETUP.md',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '700',
    title: 'Settings',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Creates a fallback dev tools page (800)
 */
export function createFallbackDevPage(): TeletextPage {
  const rows = [
    'DEVELOPER TOOLS              P800',
    '════════════════════════════════════',
    '',
    'DEV TOOLS SERVICE UNAVAILABLE',
    '',
    'The developer tools require Firebase',
    'emulators to be running.',
    '',
    'TO ACCESS DEV TOOLS:',
    '',
    '1. Start Firebase emulators',
    '   npm run emulators:start',
    '',
    '2. Refresh this page',
    '',
    'Dev tools include API explorer,',
    'raw JSON viewer, and documentation.',
    '',
    'See DEV_ADAPTER_SETUP.md',
    '',
    '',
    '',
    'INDEX   HELP',
    ''
  ];

  return {
    id: '800',
    title: 'Developer Tools',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'HELP', targetPage: '999', color: 'green' }
    ],
    meta: {
      source: 'FallbackAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fallback: true
    }
  };
}

/**
 * Gets a fallback page based on page ID
 */
export function getFallbackPage(pageId: string): TeletextPage | null {
  const pageNumber = parseInt(pageId, 10);
  
  // Return specific fallback pages for major sections
  if (pageId === '100') return createFallbackIndexPage();
  if (pageId === '200') return createFallbackNewsPage();
  if (pageId === '300') return createFallbackSportsPage();
  if (pageId === '400') return createFallbackMarketsPage();
  if (pageId === '500') return createFallbackAIPage();
  if (pageId === '600') return createFallbackGamesPage();
  if (pageId === '700') return createFallbackSettingsPage();
  if (pageId === '800') return createFallbackDevPage();
  
  // For other pages, return generic emulator offline page
  if (pageNumber >= 100 && pageNumber <= 899) {
    return createEmulatorOfflinePage(pageId);
  }
  
  return null;
}

/**
 * Strips color codes and calculates visible length
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
  return withoutEmojis.length + (emojiCount * 2);
}

/**
 * Centers text within specified width (default 80 for full screen)
 */
function centerText(text: string, width: number = 80): string {
  const visibleLength = getVisibleLength(text);
  if (visibleLength >= width) {
    return text;
  }
  const padding = width - visibleLength;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

/**
 * Pads rows array to exactly 24 rows, each exactly 80 visible characters (full screen width)
 */
function padRows(rows: string[]): string[] {
  const paddedRows = rows.map(row => {
    const visibleLength = getVisibleLength(row);
    
    if (visibleLength > 80) {
      // Don't truncate - let it overflow (color codes make this tricky)
      return row;
    } else if (visibleLength < 80) {
      // Pad to exactly 80 visible characters
      const paddingNeeded = 80 - visibleLength;
      return row + ' '.repeat(paddingNeeded);
    }
    
    return row;
  });

  // Ensure exactly 24 rows
  while (paddedRows.length < 24) {
    paddedRows.push(''.padEnd(80, ' '));
  }

  return paddedRows.slice(0, 24);
}
