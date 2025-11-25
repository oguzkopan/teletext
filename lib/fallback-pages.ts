/**
 * Fallback pages for development when Firebase emulators are not running
 * These provide a better developer experience with helpful error messages
 * 
 * Pages now use responsive dimensions that adapt to screen size
 */

import { TeletextPage } from '@/types/teletext';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './screen-dimensions';

// Use responsive dimensions (defaults to 80×24 for modern screens)
const SCREEN_WIDTH = DEFAULT_WIDTH;
const SCREEN_HEIGHT = DEFAULT_HEIGHT;

/**
 * Creates a fallback page when emulators are not running
 */
export function createEmulatorOfflinePage(pageId: string): TeletextPage {
  const rows = [
    `{cyan}${pageId} {yellow}EMULATOR OFFLINE`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚠ FIREBASE EMULATORS NOT RUNNING ⚠',
    '',
    '{white}The Firebase emulators need to be running to fetch this page.',
    '',
    '{yellow}TO START EMULATORS:',
    '',
    '{white}1. Open a new terminal',
    '{white}2. Run: {green}npm run emulators:start',
    '{white}3. Wait for "All emulators ready"',
    '{white}4. Refresh this page',
    '',
    '{yellow}ALTERNATIVE:',
    '{white}Use fallback pages below for offline-first development.',
    '',
    '{white}See SETUP.md for more details.',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
    '{yellow}POPULAR PAGES: {green}200{white} News {green}300{white} Sport {green}400{white} Markets {green}500{white} AI {green}600{white} Games'
  ];

  return {
    id: '100',
    title: 'Main Index',
    rows: padRows(rows),
    links: [
      { label: 'HELP', targetPage: '999', color: 'red' },
      { label: 'SETTINGS', targetPage: '700', color: 'green' },
      { label: 'DEV', targetPage: '800', color: 'yellow' }
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}200 {yellow}NEWS INDEX {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}📰 NEWS SERVICE UNAVAILABLE',
    '',
    '{white}The news service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS NEWS:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Ensure {cyan}NEWS_API_KEY{white} is set in {cyan}.env.local',
    '',
    '{white}3. Refresh this page',
    '',
    '{white}See {cyan}NEWS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}300 {yellow}SPORT INDEX {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚽ SPORT SERVICE UNAVAILABLE',
    '',
    '{white}The sport service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS SPORT:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Ensure {cyan}SPORTS_API_KEY{white} is set in {cyan}.env.local{white} (optional)',
    '',
    '{white}3. Refresh this page',
    '',
    '{white}See {cyan}SPORTS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}400 {yellow}MARKETS INDEX {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}📈 MARKETS SERVICE UNAVAILABLE',
    '',
    '{white}The markets service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS MARKETS:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Refresh this page',
    '',
    '{white}Market data is fetched from free APIs (CoinGecko, etc.)',
    '',
    '{white}See {cyan}MARKETS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}500 {yellow}AI ORACLE {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🤖 AI SERVICE UNAVAILABLE',
    '',
    '{white}The AI Oracle requires Firebase emulators and Vertex AI to be configured.',
    '',
    '{yellow}TO ACCESS AI ORACLE:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Ensure Vertex AI is configured',
    '   See {cyan}AI_ADAPTER_SETUP.md',
    '',
    '{white}3. Refresh this page',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}600 {yellow}GAMES INDEX {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🎮 GAMES SERVICE UNAVAILABLE',
    '',
    '{white}The games service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS GAMES:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Refresh this page',
    '',
    '{white}Games include quizzes, Bamboozle, and random facts.',
    '',
    '{white}See {cyan}GAMES_ADAPTER_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}700 {yellow}SETTINGS {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚙️ SETTINGS SERVICE UNAVAILABLE',
    '',
    '{white}The settings service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS SETTINGS:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Refresh this page',
    '',
    '{white}Settings include themes, CRT effects, and keyboard shortcuts.',
    '',
    '{white}See {cyan}SETTINGS_ADAPTER_SETUP.md',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}800 {yellow}DEVELOPER TOOLS {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🔧 DEV TOOLS SERVICE UNAVAILABLE',
    '',
    '{white}The developer tools require Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS DEV TOOLS:',
    '',
    '{white}1. Start Firebase emulators',
    '   {green}npm run emulators:start',
    '',
    '{white}2. Refresh this page',
    '',
    '{white}Dev tools include API explorer, raw JSON viewer, and documentation.',
    '',
    '{white}See {cyan}DEV_ADAPTER_SETUP.md',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}999=HELP',
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
 * Creates a fallback page for page 203 (Local News detail)
 */
export function createFallbackLocalNewsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}203 {yellow}LOCAL NEWS {cyan}${timeStr}`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}Updated: {green}18:00',
    '{white}Use color buttons to navigate',
    '',
    '{yellow}1. {white}Judge dismisses cases against James...',
    '{cyan}NBC News',
    '',
    '{yellow}2. {white}The complicated relationship between...',
    '{cyan}The Washington Post',
    '',
    '{yellow}3. {white}Why the Idea That Shedeur Sanders...',
    '{cyan}Sports Illustrated',
    '',
    '{yellow}4. {white}Pentagon probing misconduct allegations...',
    '{cyan}CNBC',
    '',
    '{yellow}5. {white}Zach Bryan announces "With Heaven..." tour dates',
    '{cyan}clevelandbrowns.com',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════',
    '{red}100=INDEX   {green}201=UK NEWS   {yellow}202=WORLD NEWS   {blue}PREV   {magenta}NEXT',
    ''
  ];

  return {
    id: '203',
    title: 'Local News',
    rows: padRows(rows),
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'UK', targetPage: '201', color: 'green' },
      { label: 'WORLD', targetPage: '202', color: 'yellow' }
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
  if (pageId === '203') return createFallbackLocalNewsPage();
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
 * Centers text within specified width (default 40 for teletext screen)
 */
function centerText(text: string, width: number = SCREEN_WIDTH): string {
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
 * Pads rows array to exactly 24 rows, each exactly 40 visible characters (teletext screen width)
 */
function padRows(rows: string[]): string[] {
  const paddedRows = rows.map(row => {
    const visibleLength = getVisibleLength(row);
    
    if (visibleLength > SCREEN_WIDTH) {
      // Truncate if too long (shouldn't happen with proper design)
      // This is tricky with color codes, so we'll just warn
      console.warn(`Row exceeds ${SCREEN_WIDTH} characters:`, row);
      return row;
    } else if (visibleLength < SCREEN_WIDTH) {
      // Pad to exactly SCREEN_WIDTH visible characters
      const paddingNeeded = SCREEN_WIDTH - visibleLength;
      return row + ' '.repeat(paddingNeeded);
    }
    
    return row;
  });

  // Ensure exactly SCREEN_HEIGHT rows
  while (paddedRows.length < SCREEN_HEIGHT) {
    paddedRows.push(''.padEnd(SCREEN_WIDTH, ' '));
  }

  return paddedRows.slice(0, SCREEN_HEIGHT);
}
