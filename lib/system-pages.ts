/**
 * System Pages (1xx)
 * System status, diagnostics, and information pages
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 101 - System Status
 */
export function createSystemStatusPage(): TeletextPage {
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
    `{cyan}101 {yellow}🔧 SYSTEM STATUS & DIAGNOSTICS 🔧 {cyan}${dateStr} ${timeStr}                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {green}SYSTEM OPERATIONAL{yellow}  {white}░▒▓█▓▒░  {cyan}All Services Running  {white}░▒▓█▓▒░  {yellow}Kiroween 2024 Edition{yellow}                                         ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ SYSTEM INFORMATION ▓▓▓',
    '{white}Application:        {green}Modern Teletext v1.0',
    '{white}Platform:           {green}Next.js 14 + Firebase',
    '{white}Status:             {green}✓ ONLINE',
    '{white}Uptime:             {green}99.9%',
    '{white}Last Updated:       {green}' + timeStr,
    '',
    '{cyan}▓▓▓ SERVICE STATUS ▓▓▓',
    '{white}News Service:       {green}✓ OPERATIONAL       {white}API Response: {green}< 100ms',
    '{white}Sports Service:     {green}✓ OPERATIONAL       {white}API Response: {green}< 150ms',
    '{white}Markets Service:    {green}✓ OPERATIONAL       {white}API Response: {green}< 200ms',
    '{white}AI Oracle:          {green}✓ OPERATIONAL       {white}API Response: {green}< 500ms',
    '{white}Games Service:      {green}✓ OPERATIONAL       {white}API Response: {green}< 50ms',
    '{white}Weather Service:    {green}✓ OPERATIONAL       {white}API Response: {green}< 100ms',
    '',
    '{cyan}▓▓▓ PERFORMANCE METRICS ▓▓▓',
    '{white}Page Load Time:     {green}< 1s                {white}Cache Hit Rate: {green}95%',
    '{white}Active Users:       {green}1,234               {white}Pages Served: {green}45,678',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}200{white}=NEWS {yellow}300{white}=SPORTS {blue}400{white}=MARKETS {magenta}999{white}=HELP',
    ''
  ];
  
  return {
    id: '101',
    title: 'System Status',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'SPORTS', targetPage: '300', color: 'yellow' },
      { label: 'HELP', targetPage: '999', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}


/**
 * Creates page 999 - Help & Documentation
 */
export function createHelpPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}999 {yellow}📖 HELP & DOCUMENTATION 📖 {cyan}${timeStr}                                                                                                            {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ NAVIGATION INSTRUCTIONS ▓▓▓',
    '',
    '{yellow}KEYBOARD SHORTCUTS:',
    '{white}• {green}0-9{white}: Enter page numbers',
    '{white}• {green}Enter{white}: Go to entered page',
    '{white}• {green}Backspace{white}: Delete last digit',
    '{white}• {green}Arrow Up/Down{white}: Channel up/down',
    '{white}• {green}Arrow Left{white}: Back to previous page',
    '',
    '{yellow}COLORED BUTTONS:',
    '{white}• {red}RED{white}: Quick link (varies by page)',
    '{white}• {green}GREEN{white}: Quick link (varies by page)',
    '{white}• {yellow}YELLOW{white}: Quick link (varies by page)',
    '{white}• {blue}BLUE{white}: Quick link (varies by page)',
    '',
    '{cyan}▓▓▓ PAGE RANGES ▓▓▓',
    '{green}100-199{white}: System pages          {green}500-599{white}: AI Oracle',
    '{green}200-299{white}: News                  {green}600-699{white}: Games',
    '{green}300-399{white}: Sport                 {green}700-799{white}: Settings',
    '{green}400-499{white}: Markets               {green}800-899{white}: Developer tools',
    '',
    '{white}See page {cyan}720{white} for full keyboard guide',
    '{white}Press {green}100{white} for main index',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}720{white}=SHORTCUTS',
    ''
  ];
  
  return {
    id: '999',
    title: 'Help',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'SHORTCUTS', targetPage: '720', color: 'green' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}
