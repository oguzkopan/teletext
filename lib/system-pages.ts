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
