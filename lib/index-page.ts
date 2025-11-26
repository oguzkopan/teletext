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
  
  // Full-screen layout optimized for 40×24 teletext
  const rows = [
    `{cyan}100 {yellow}KIROWEEN {cyan}${timeStr}`,
    '{blue}════════════════════════════════════',
    showWelcome 
      ? '{green}    👻 SYSTEM READY - WELCOME! 👻'
      : '',
    showWelcome
      ? '{blue}════════════════════════════════════'
      : '{yellow}🎃 {magenta}MODERN TELETEXT{yellow} 🎃',
    showWelcome
      ? ''
      : '',
    '{cyan}▓▓▓ NEWS & INFO ▓▓▓',
    '{green}101{white} System Status',
    '{green}200{white} News Headlines',
    '{green}201{white} UK News',
    '{green}202{white} World News',
    '{green}203{white} Local News',
    '',
    '{cyan}▓▓▓ SPORT & LEISURE ▓▓▓',
    '{green}300{white} Sport Headlines',
    '{green}301{white} Football',
    '{green}302{white} Cricket',
    '{green}303{white} Tennis',
    '{green}304{white} Live Scores',
    '',
    '{cyan}▓▓▓ MORE SERVICES ▓▓▓',
    '{green}400{white} Markets  {green}500{white} AI  {green}600{white} Games',
    '',
    '{blue}════════════════════════════════════',
    '{red}100{white}=INDEX {green}999{white}=HELP'
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
