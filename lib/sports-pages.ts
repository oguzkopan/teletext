/**
 * Sports Pages (3xx)
 * Sports headlines, scores, and live updates
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 300 - Sports Index
 */
export function createSportsIndexPage(): TeletextPage {
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
    `{cyan}300 {yellow}⚽ SPORT HEADLINES & LIVE SCORES ⚽ {cyan}${dateStr} ${timeStr}                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {red}LIVE SPORT{yellow}  {white}░▒▓█▓▒░  {cyan}Latest Scores & Results  {white}░▒▓█▓▒░  {yellow}Updated Every Minute{yellow}                                                ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ LIVE MATCHES ▓▓▓',
    '{red}🔴 LIVE:{white} Premier League - Manchester United vs Liverpool                                    {green}2-2 {white}(75\')  {red}⚽ LIVE',
    '{red}🔴 LIVE:{white} Champions League - Real Madrid vs Bayern Munich                                    {green}1-0 {white}(HT)   {red}⚽ LIVE',
    '',
    '{cyan}▓▓▓ TODAY\'S RESULTS ▓▓▓',
    '{white}Football:  Arsenal 3-1 Chelsea                                                                  {cyan}Full Time',
    '{white}Cricket:   England 287/5 vs Australia                                                           {cyan}Day 2',
    '{white}Tennis:    Djokovic def. Nadal 6-4, 7-6                                                         {cyan}Final',
    '',
    '{cyan}▓▓▓ SPORT CATEGORIES ▓▓▓',
    '{green}301{white} Football Results & Fixtures          {green}302{white} Cricket Scores & Commentary          {green}303{white} Tennis Tournaments',
    '{green}304{white} Live Scores Across All Sports        {green}305{white} Rugby Union & League                 {green}306{white} Golf Championships',
    '{green}307{white} Formula 1 & Motorsport               {green}308{white} Basketball & NBA                     {green}309{white} Athletics & Olympics',
    '',
    '{cyan}▓▓▓ BREAKING SPORTS NEWS ▓▓▓',
    '{yellow}•{white} Transfer deadline day: Record-breaking deals completed across Europe',
    '{yellow}•{white} Championship finals set: Teams confirmed for weekend showdown',
    '{yellow}•{white} Injury update: Star player ruled out for remainder of season',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}301{white}=FOOTBALL {yellow}302{white}=CRICKET {blue}304{white}=LIVE SCORES',
    ''
  ];
  
  return {
    id: '300',
    title: 'Sport Headlines',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'FOOTBALL', targetPage: '301', color: 'green' },
      { label: 'CRICKET', targetPage: '302', color: 'yellow' },
      { label: 'LIVE', targetPage: '304', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single' // Accept 1-digit input for numbered options
    }
  };
}
