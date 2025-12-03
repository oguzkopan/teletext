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
    '{cyan}▓▓▓ TOP STORIES ▓▓▓',
    '{red}🔴 BREAKING:{white} Premier League title race heats up - Three teams separated by just two points',
    '{white}   {cyan}Sky Sports • Updated 2 minutes ago',
    '',
    '{yellow}1. {white}Manchester United secure dramatic late victory - Last-minute goal seals crucial three points',
    '{white}   {cyan}BBC Sport • 15 minutes ago',
    '',
    '{yellow}2. {white}Champions League quarter-finals draw announced - European giants set for blockbuster ties',
    '{white}   {cyan}UEFA • 30 minutes ago',
    '',
    '{yellow}3. {white}Transfer news: Record-breaking deal completed - Star player joins new club for £100m',
    '{white}   {cyan}Sky Sports • 1 hour ago',
    '',
    '{cyan}▓▓▓ SPORT CATEGORIES ▓▓▓',
    '{green}301{white} Football Results & Fixtures          {green}302{white} Cricket Scores & Commentary          {green}303{white} Tennis Tournaments',
    '{green}304{white} Live Scores Across All Sports        {green}305{white} Rugby Union & League                 {green}306{white} Golf Championships',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-3{white} for stories • {red}RED{white}=INDEX {green}GREEN{white}=FOOTBALL {yellow}YELLOW{white}=CRICKET {blue}BLUE{white}=LIVE',
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
      renderedWithLayoutEngine: true
      // No inputMode specified = defaults to 'triple' for 3-digit navigation
      // This allows typing 301, 302, 303, etc. to navigate to those pages
    }
  };
}

/**
 * Creates sports article detail pages
 * These are accessed via single-digit navigation from sports pages
 */
export function createSportsArticlePage(parentPage: string, articleNumber: number): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const pageId = `${parentPage}-${articleNumber}`;
  
  // Sample article content based on parent page and article number
  const articles: Record<string, { title: string; content: string; source: string; time: string }[]> = {
    '300': [
      {
        title: 'Manchester United secure dramatic late victory',
        content: 'Last-minute goal seals crucial three points in thrilling encounter at Old Trafford. The Red Devils came from behind twice to claim all three points in a pulsating match that kept fans on the edge of their seats until the final whistle. The victory moves United into second place in the table, just two points behind the leaders with six games remaining.',
        source: 'BBC Sport',
        time: '15 minutes ago'
      },
      {
        title: 'Champions League quarter-finals draw announced',
        content: 'European giants set for blockbuster ties as the draw for the Champions League quarter-finals produces some mouth-watering matchups. Defending champions will face last year\'s runners-up in what promises to be the tie of the round. The first legs will be played next week, with the return fixtures scheduled for the following week.',
        source: 'UEFA',
        time: '30 minutes ago'
      },
      {
        title: 'Transfer news: Record-breaking deal completed',
        content: 'Star player joins new club for £100m in one of the biggest transfers in football history. The 25-year-old midfielder has signed a five-year contract and is expected to make his debut this weekend. Club officials say the signing demonstrates their ambition to compete for major honors both domestically and in Europe.',
        source: 'Sky Sports',
        time: '1 hour ago'
      }
    ]
  };
  
  const parentArticles = articles[parentPage] || articles['300'];
  const article = parentArticles[articleNumber - 1] || parentArticles[0];
  
  const rows = [
    `{cyan}${pageId} {yellow}${article.title.substring(0, 60)} {cyan}${timeStr}                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    `{white}${article.title}`,
    '',
    `{cyan}${article.source} • ${article.time}`,
    '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    '',
    `{white}${article.content}`,
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
    '',
    '',
    '',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    `{cyan}NAVIGATION: {red}BACK{white}=Return to ${parentPage} {green}INDEX{white}=Main Index {yellow}PREV{white}=Previous {blue}NEXT{white}=Next Article`,
    ''
  ];
  
  return {
    id: pageId,
    title: article.title.substring(0, 30),
    rows,
    links: [
      { label: 'BACK', targetPage: parentPage, color: 'red' },
      { label: 'INDEX', targetPage: '100', color: 'green' },
      { label: 'PREV', targetPage: articleNumber > 1 ? `${parentPage}-${articleNumber - 1}` : parentPage, color: 'yellow' },
      { label: 'NEXT', targetPage: `${parentPage}-${articleNumber + 1}`, color: 'blue' }
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
