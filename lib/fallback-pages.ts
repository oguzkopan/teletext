/**
 * Fallback pages for development when Firebase emulators are not running
 * These provide a better developer experience with helpful error messages
 * 
 * Pages now use responsive dimensions that adapt to screen size
 */

import { TeletextPage } from '@/types/teletext';

// No character width constraint - use full screen
const SCREEN_HEIGHT = 30;

/**
 * Creates a fallback page when emulators are not running
 */
export function createEmulatorOfflinePage(pageId: string): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}${pageId} {yellow}EMULATOR OFFLINE {cyan}${timeStr}                                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚠ FIREBASE EMULATORS NOT RUNNING ⚠',
    '',
    '{white}Firebase emulators need to be running to fetch this page.',
    '',
    '{yellow}TO START EMULATORS:',
    '',
    '{white}1. Open a new terminal',
    '{white}2. Run: {green}npm run emulators:start',
    '{white}3. Wait for "All emulators ready"',
    '{white}4. Refresh this page',
    '',
    '{yellow}ALTERNATIVE:',
    '{white}Use fallback pages for offline development.',
    '',
    '{white}See SETUP.md for more details.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}100 {yellow}🎃 KIROWEEN TELETEXT 🎃 {cyan}${dateStr} ${timeStr}                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {magenta}MODERN TELETEXT{yellow}  {white}░▒▓█▓▒░  {cyan}Your Gateway to Information  {white}░▒▓█▓▒░  {yellow}Kiroween 2024 Edition{yellow}                                    ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}▓▓▓ NEWS & INFORMATION ▓▓▓                    {magenta}▓▓▓ ENTERTAINMENT & GAMES ▓▓▓                    {yellow}▓▓▓ SERVICES & TOOLS ▓▓▓',
    '{green}101{white} System Status & Diagnostics              {red}600{white} Games & Quizzes Hub                         {cyan}700{white} Settings & Preferences',
    '{green}200{white} News Headlines & Breaking News           {red}601{white} Quiz of the Day                             {cyan}701{white} Theme Customization',
    '{green}201{white} UK News & Local Updates                  {red}610{white} Bamboozle Quiz Game                         {cyan}800{white} Developer Tools',
    '{green}202{white} World News & International               {red}620{white} Random Facts & Trivia                       {cyan}999{white} Help & Documentation',
    '{green}203{white} Local News & Community                   {yellow}500{white} AI Chat & Oracle                           {magenta}666{white} Cursed Page (Enter if you dare...)',
    '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    '{cyan}▓▓▓ SPORT & LEISURE ▓▓▓                       {yellow}▓▓▓ MARKETS & FINANCE ▓▓▓                       {red}▓▓▓ WEATHER & TRAVEL ▓▓▓',
    '{green}300{white} Sport Headlines & Live Scores            {green}400{white} Markets Overview & Indices                  {green}420{white} Weather Forecast & Conditions',
    '{green}301{white} Football Results & Fixtures              {green}401{white} Stock Prices & Trading                      {green}421{white} London Weather',
    '{green}302{white} Cricket Scores & Commentary              {green}402{white} Crypto Markets & Digital Assets            {green}422{white} New York Weather',
    '{green}303{white} Tennis Tournaments & Rankings            {green}403{white} Commodities & Precious Metals               {green}423{white} Tokyo Weather',
    '{green}304{white} Live Scores Across All Sports            {green}404{white} Void Page (Under Construction)              {green}424{white} Traffic Information & Updates',
    '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    '{cyan}▓▓▓ ADDITIONAL SERVICES ▓▓▓',
    '{green}450{white} Currency Exchange Rates                  {green}460{white} Flight Information                          {green}470{white} TV Guide & Schedules',
    '{green}451{white} Lottery Results                          {green}461{white} Hotel Bookings                              {green}471{white} Radio Listings',
    '{green}452{white} Horoscopes & Astrology                   {green}462{white} Restaurant Reviews                          {green}472{white} Cinema Showtimes',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}🎃 NAVIGATION: {white}Type {yellow}3-digit{white} page number (e.g., {yellow}200{white}) or use colored {red}R{white}/{green}G{white}/{yellow}Y{white}/{blue}B{white} buttons to navigate quickly',
    '{white}Press {cyan}999{white} for comprehensive help and keyboard shortcuts • Press {magenta}666{white} if you dare to enter the cursed realm... 👻',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}⚡ POPULAR PAGES: {green}200{white} Latest News  {green}300{white} Live Sport  {green}400{white} Market Data  {green}500{white} AI Oracle  {green}600{white} Fun Games  {green}700{white} Customize',
    ''
  ];

  return {
    id: '100',
    title: 'Main Index',
    rows: padRows(rows),
    links: [
      { label: 'NEWS', targetPage: '200', color: 'red' },
      { label: 'SPORT', targetPage: '300', color: 'green' },
      { label: 'WEATHER', targetPage: '420', color: 'yellow' },
      { label: 'AI', targetPage: '500', color: 'blue' }
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
    `{cyan}200 {yellow}NEWS INDEX {cyan}${timeStr}                                                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}📰 NEWS SERVICE UNAVAILABLE',
    '',
    '{white}News service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS NEWS:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Ensure {cyan}NEWS_API_KEY{white} is set in {cyan}.env.local',
    '{white}3. Refresh this page',
    '',
    '{white}See {cyan}NEWS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}300 {yellow}SPORT INDEX {cyan}${timeStr}                                                                                                                             {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚽ SPORT SERVICE UNAVAILABLE',
    '',
    '{white}Sport service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS SPORT:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Ensure {cyan}SPORTS_API_KEY{white} is set in {cyan}.env.local{white} (optional)',
    '{white}3. Refresh this page',
    '',
    '{white}See {cyan}SPORTS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}400 {yellow}MARKETS INDEX {cyan}${timeStr}                                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}📈 MARKETS SERVICE UNAVAILABLE',
    '',
    '{white}Markets service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS MARKETS:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Refresh this page',
    '',
    '{white}Market data is fetched from free APIs (CoinGecko, etc.)',
    '',
    '{white}See {cyan}MARKETS_API_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}500 {yellow}AI ORACLE {cyan}${timeStr}                                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🤖 AI SERVICE UNAVAILABLE',
    '',
    '{white}AI Oracle requires Firebase emulators and Vertex AI to be configured.',
    '',
    '{yellow}TO ACCESS AI ORACLE:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Ensure Vertex AI is configured - See {cyan}AI_ADAPTER_SETUP.md',
    '{white}3. Refresh this page',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}600 {yellow}GAMES INDEX {cyan}${timeStr}                                                                                                                            {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🎮 GAMES SERVICE UNAVAILABLE',
    '',
    '{white}Games service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS GAMES:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Refresh this page',
    '',
    '{white}Games include quizzes, Bamboozle, and random facts.',
    '',
    '{white}See {cyan}GAMES_ADAPTER_SETUP.md{white} for details.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}700 {yellow}SETTINGS {cyan}${timeStr}                                                                                                                                 {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}⚙️ SETTINGS SERVICE UNAVAILABLE',
    '',
    '{white}Settings service requires Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS SETTINGS:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Refresh this page',
    '',
    '{white}Settings include themes, CRT effects, and keyboard shortcuts.',
    '',
    '{white}See {cyan}SETTINGS_ADAPTER_SETUP.md',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}800 {yellow}DEVELOPER TOOLS {cyan}${timeStr}                                                                                                                      {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{red}🔧 DEV TOOLS SERVICE UNAVAILABLE',
    '',
    '{white}Developer tools require Firebase emulators to be running.',
    '',
    '{yellow}TO ACCESS DEV TOOLS:',
    '',
    '{white}1. Start Firebase emulators: {green}npm run emulators:start',
    '{white}2. Refresh this page',
    '',
    '{white}Dev tools include API explorer, raw JSON viewer, and docs.',
    '',
    '{white}See {cyan}DEV_ADAPTER_SETUP.md',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}999{white}=HELP',
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
    `{cyan}203 {yellow}Local News {cyan}${timeStr}                                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}Updated: {green}18:00                                                                                                                                                  ',
    '{white}Use color buttons to navigate                                                                                                                                          ',
    '',
    '{yellow}1. {white}\'Dancing With the Stars\' Ends Season 34 With Star-Studded Finale as a New Winner Is Crowned: See the Scores, Who Won - The Hollywood Reporter',
    '   {cyan}Hollywood Reporter • 26 Nov                                                                                                                                         ',
    '',
    '{yellow}2. {white}Qualcomm reveals its not-so-elite Snapdragon 8 Gen 5 - The Verge',
    '   {cyan}The Verge • 26 Nov                                                                                                                                                  ',
    '',
    '{yellow}3. {white}National parks announce \'America-first\' upcharges for foreign visitors - the Washington Post',
    '   {cyan}The Washington Post • 26 Nov                                                                                                                                        ',
    '',
    '{yellow}4. {white}Asian Stocks Set to Extend Gains on Fed Cut Hopes: Markets Wrap - Bloomberg.com',
    '   {cyan}Bloomberg • 26 Nov                                                                                                                                                  ',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}201{white}=UK NEWS {yellow}202{white}=WORLD NEWS {blue}200{white}=NEWS HEADLINES                                                                                ',
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
 * Centers text within specified width - no longer used, kept for compatibility
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
 * Pads rows array to exactly 24 rows - no width constraint
 */
function padRows(rows: string[]): string[] {
  // Just return rows as-is, no padding needed
  const paddedRows = [...rows];

  // Ensure exactly SCREEN_HEIGHT rows
  while (paddedRows.length < SCREEN_HEIGHT) {
    paddedRows.push('');
  }

  return paddedRows.slice(0, SCREEN_HEIGHT);
}
