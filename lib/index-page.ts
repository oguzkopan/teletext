/**
 * Shared Index Page (100)
 * 
 * This is the main index page used both on initial load and when navigating to page 100.
 * It must be identical in both cases.
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates the main index page (100)
 * 
 * @param showWelcome - Whether to show the welcome message (only on first boot)
 * @returns The index page object
 */
export function createIndexPage(showWelcome: boolean = false): TeletextPage {
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
  
  // Full-screen layout - no character constraints, 30 rows
  // Use the same layout for both welcome and normal display
  const rows = [
    `{cyan}100 {yellow}🎃 KIROWEEN TELETEXT 🎃 {cyan}${dateStr} ${timeStr} {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    showWelcome 
      ? '{green}                                                    👻 SYSTEM READY - WELCOME! 👻'
      : '',
    showWelcome
      ? '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'
      : '',
    showWelcome ? '' : '',
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
    rows,
    links: [
      { label: 'NEWS', targetPage: '200', color: 'red' },
      { label: 'SPORT', targetPage: '300', color: 'green' },
      { label: 'WEATHER', targetPage: '420', color: 'yellow' },
      { label: 'AI', targetPage: '500', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      halloweenTheme: true,
      fullScreenLayout: true,
      // IMPORTANT: Mark this so it doesn't get re-processed
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}
