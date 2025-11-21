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
    minute: '2-digit' 
  });
  
  const rows = [
    '╔══════════════════════════════════╗P100',
    '║  MODERN TELETEXT  ░▒▓█▓▒░       ║',
    '╚══════════════════════════════════╝',
    centerText(`${dateStr} ${timeStr}`, 40),
    centerText('⚠ OFFLINE MODE ⚠', 40),
    '',
    '▓▓▓▓ AVAILABLE OFFLINE ▓▓▓▓▓▓▓▓▓▓▓▓',
    '  101  ℹ️  System Info & How It Works',
    '  110  📋 System Pages Index',
    '  120  📢 Emergency Bulletins',
    '  199  📖 About & Credits',
    '  999  ❓ Help & Navigation',
    '',
    '▓▓▓▓ REQUIRES EMULATOR ▓▓▓▓▓▓▓▓▓▓▓▓',
    '  ►200 📰 News Headlines',
    '  ►300 ⚽ Sport & Live Scores',
    '  ►400 📈 Markets & Finance',
    '  ►420 🌤️  Weather Forecasts',
    '  ►500 🤖 AI Oracle Assistant',
    '  ►600 🎮 Games & Entertainment',
    '  ►700 ⚙️  Settings & Themes',
    '  ►800 🔧 Developer Tools',
    '────────────────────────────────────────',
    '🔴HELP 🟢ABOUT  Enter page number'
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
 * Centers text within specified width
 */
function centerText(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  const padding = width - text.length;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

/**
 * Pads rows array to exactly 24 rows, each max 40 characters
 */
function padRows(rows: string[]): string[] {
  const paddedRows = rows.map(row => {
    if (row.length > 40) {
      return row.substring(0, 40);
    }
    return row.padEnd(40, ' ');
  });

  // Ensure exactly 24 rows
  while (paddedRows.length < 24) {
    paddedRows.push(''.padEnd(40, ' '));
  }

  return paddedRows.slice(0, 24);
}
