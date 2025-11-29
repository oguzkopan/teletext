/**
 * News Pages (2xx)
 * News headlines, articles, and updates
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 200 - News Index
 */
export function createNewsIndexPage(): TeletextPage {
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
    `{cyan}200 {yellow}📰 NEWS HEADLINES & BREAKING NEWS 📰 {cyan}${dateStr} ${timeStr}                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {red}BREAKING NEWS{yellow}  {white}░▒▓█▓▒░  {cyan}Latest Updates from Around the World  {white}░▒▓█▓▒░  {yellow}Updated Every 5 Minutes{yellow}                        ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ TOP STORIES ▓▓▓',
    '{red}🔴 BREAKING:{white} Major technology announcement expected today - Industry sources suggest significant product launch',
    '{white}   {cyan}Tech News • Updated 5 minutes ago',
    '',
    '{yellow}1. {white}Global markets react to economic policy changes - Investors cautiously optimistic about new measures',
    '{white}   {cyan}Financial Times • 15 minutes ago',
    '',
    '{yellow}2. {white}Climate summit reaches historic agreement - World leaders commit to ambitious carbon reduction targets',
    '{white}   {cyan}Reuters • 1 hour ago',
    '',
    '{yellow}3. {white}Sports: Championship finals draw record viewership - Millions tune in for thrilling conclusion',
    '{white}   {cyan}Sports Network • 2 hours ago',
    '',
    '{cyan}▓▓▓ NEWS CATEGORIES ▓▓▓',
    '{green}201{white} UK News & Local Updates              {green}202{white} World News & International              {green}203{white} Local News & Community',
    '{green}204{white} Business & Economy                    {green}205{white} Technology & Innovation                 {green}206{white} Science & Health',
    '{green}207{white} Entertainment & Culture               {green}208{white} Politics & Government                   {green}209{white} Environment & Climate',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-3{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=UK {yellow}YELLOW{white}=WORLD {blue}BLUE{white}=LOCAL',
    ''
  ];
  
  return {
    id: '200',
    title: 'News Headlines',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'UK', targetPage: '201', color: 'green' },
      { label: 'WORLD', targetPage: '202', color: 'yellow' },
      { label: 'LOCAL', targetPage: '203', color: 'blue' },
      { label: '1', targetPage: '200-1' },
      { label: '2', targetPage: '200-2' },
      { label: '3', targetPage: '200-3' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3'] // Valid single-digit options
    }
  };
}

/**
 * Creates page 201 - UK News
 */
export function createUKNewsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}201 {yellow}UK News & Local Updates {cyan}${timeStr}                                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}Updated: {green}' + timeStr + '                                                                                                                                     ',
    '{white}Use colored buttons to navigate between news categories',
    '',
    '{yellow}1. {white}Parliament debates new legislation on digital privacy - MPs divided on proposed measures for online data protection',
    '{white}   {cyan}BBC News • 10 minutes ago',
    '',
    '{yellow}2. {white}London transport upgrades announced - Major investment in infrastructure to improve commuter experience',
    '{white}   {cyan}The Guardian • 25 minutes ago',
    '',
    '{yellow}3. {white}UK tech sector sees record growth - Innovation hubs across the country report increased investment',
    '{white}   {cyan}Financial Times • 45 minutes ago',
    '',
    '{yellow}4. {white}Weather warning issued for northern regions - Heavy rainfall expected over the weekend',
    '{white}   {cyan}Met Office • 1 hour ago',
    '',
    '{yellow}5. {white}Education reforms proposed by government - New curriculum changes aim to modernize learning',
    '{white}   {cyan}The Times • 2 hours ago',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-5{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=NEWS {yellow}YELLOW{white}=WORLD {blue}BLUE{white}=LOCAL',
    ''
  ];
  
  return {
    id: '201',
    title: 'UK News',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'WORLD', targetPage: '202', color: 'yellow' },
      { label: 'LOCAL', targetPage: '203', color: 'blue' },
      { label: '1', targetPage: '201-1' },
      { label: '2', targetPage: '201-2' },
      { label: '3', targetPage: '201-3' },
      { label: '4', targetPage: '201-4' },
      { label: '5', targetPage: '201-5' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5'] // Valid single-digit options
    }
  };
}

/**
 * Creates page 202 - World News
 */
export function createWorldNewsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}202 {yellow}World News & International {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}Updated: {green}' + timeStr + '                                                                                                                                     ',
    '{white}International news from around the globe',
    '',
    '{yellow}1. {white}UN summit addresses global challenges - World leaders gather to discuss climate, security, and economic cooperation',
    '{white}   {cyan}Reuters • 15 minutes ago',
    '',
    '{yellow}2. {white}Asian markets show strong performance - Economic indicators suggest continued growth in the region',
    '{white}   {cyan}Bloomberg • 30 minutes ago',
    '',
    '{yellow}3. {white}European space agency announces new mission - Ambitious project aims to explore distant planets',
    '{white}   {cyan}ESA News • 1 hour ago',
    '',
    '{yellow}4. {white}International trade agreements reach milestone - New partnerships expected to boost global commerce',
    '{white}   {cyan}Financial Times • 2 hours ago',
    '',
    '{yellow}5. {white}Cultural festival celebrates diversity - Cities worldwide participate in annual event',
    '{white}   {cyan}Associated Press • 3 hours ago',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-5{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=NEWS {yellow}YELLOW{white}=UK {blue}BLUE{white}=LOCAL',
    ''
  ];
  
  return {
    id: '202',
    title: 'World News',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'UK', targetPage: '201', color: 'yellow' },
      { label: 'LOCAL', targetPage: '203', color: 'blue' },
      { label: '1', targetPage: '202-1' },
      { label: '2', targetPage: '202-2' },
      { label: '3', targetPage: '202-3' },
      { label: '4', targetPage: '202-4' },
      { label: '5', targetPage: '202-5' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5'] // Valid single-digit options
    }
  };
}

/**
 * Creates page 203 - Local News
 */
export function createLocalNewsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}203 {yellow}Local News & Community {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{white}Updated: {green}' + timeStr + '                                                                                                                                     ',
    '{white}Your local news and community updates',
    '',
    '{yellow}1. {white}\'Dancing With the Stars\' Ends Season 34 With Star-Studded Finale as a New Winner Is Crowned: See the Scores, Who Won',
    '{white}   {cyan}Hollywood Reporter • 26 Nov',
    '',
    '{yellow}2. {white}Qualcomm reveals its not-so-elite Snapdragon 8 Gen 5 - The Verge',
    '{white}   {cyan}The Verge • 26 Nov',
    '',
    '{yellow}3. {white}National parks announce \'America-first\' upcharges for foreign visitors - the Washington Post',
    '{white}   {cyan}The Washington Post • 26 Nov',
    '',
    '{yellow}4. {white}Asian Stocks Set to Extend Gains on Fed Cut Hopes: Markets Wrap - Bloomberg.com',
    '{white}   {cyan}Bloomberg • 26 Nov',
    '',
    '{yellow}5. {white}Community center opens new facilities - Local residents celebrate improved amenities for all ages',
    '{white}   {cyan}Local News • 3 hours ago',
    '',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: Press {yellow}1-5{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=NEWS {yellow}YELLOW{white}=UK {blue}BLUE{white}=WORLD',
    ''
  ];
  
  return {
    id: '203',
    title: 'Local News',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'NEWS', targetPage: '200', color: 'green' },
      { label: 'UK', targetPage: '201', color: 'yellow' },
      { label: 'WORLD', targetPage: '202', color: 'blue' },
      { label: '1', targetPage: '203-1' },
      { label: '2', targetPage: '203-2' },
      { label: '3', targetPage: '203-3' },
      { label: '4', targetPage: '203-4' },
      { label: '5', targetPage: '203-5' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5'] // Valid single-digit options
    }
  };
}


/**
 * Creates news article detail pages
 * These are accessed via single-digit navigation from news index pages
 */
export function createNewsArticlePage(parentPage: string, articleNumber: number): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const pageId = `${parentPage}-${articleNumber}`;
  
  // Sample article content based on parent page and article number
  const articles: Record<string, { title: string; content: string; source: string; time: string }[]> = {
    '200': [
      {
        title: 'Global markets react to economic policy changes',
        content: 'Investors cautiously optimistic about new measures as central banks announce coordinated policy adjustments. Stock markets across major financial centers showed positive momentum following the announcement of new economic stimulus packages. Analysts suggest the coordinated approach by global central banks could help stabilize markets and support economic growth in the coming quarters.',
        source: 'Financial Times',
        time: '15 minutes ago'
      },
      {
        title: 'Climate summit reaches historic agreement',
        content: 'World leaders commit to ambitious carbon reduction targets at the annual climate summit. The agreement includes binding commitments from over 190 countries to reduce greenhouse gas emissions by 50% by 2030. Environmental groups have praised the deal as a significant step forward in the fight against climate change.',
        source: 'Reuters',
        time: '1 hour ago'
      },
      {
        title: 'Championship finals draw record viewership',
        content: 'Millions tune in for thrilling conclusion as the championship finals break all previous viewing records. The match, which went into extra time, captivated audiences worldwide with its dramatic finish. Sports analysts are calling it one of the greatest finals in the tournament\'s history.',
        source: 'Sports Network',
        time: '2 hours ago'
      }
    ],
    '201': [
      {
        title: 'Parliament debates new legislation on digital privacy',
        content: 'MPs divided on proposed measures for online data protection as the government introduces sweeping new privacy legislation. The bill would give citizens greater control over their personal data and impose stricter penalties on companies that mishandle user information. Opposition parties have raised concerns about implementation costs.',
        source: 'BBC News',
        time: '10 minutes ago'
      },
      {
        title: 'London transport upgrades announced',
        content: 'Major investment in infrastructure to improve commuter experience across the capital. The £2 billion package includes new train lines, upgraded stations, and improved accessibility features. Transport officials say the improvements will reduce journey times by up to 20%.',
        source: 'The Guardian',
        time: '25 minutes ago'
      },
      {
        title: 'UK tech sector sees record growth',
        content: 'Innovation hubs across the country report increased investment as the UK tech sector continues its impressive growth trajectory. Venture capital funding reached record levels in the past quarter, with particular strength in fintech and artificial intelligence startups.',
        source: 'Financial Times',
        time: '45 minutes ago'
      },
      {
        title: 'Weather warning issued for northern regions',
        content: 'Heavy rainfall expected over the weekend as a low-pressure system moves across the country. The Met Office has issued yellow warnings for flooding in several northern counties. Residents are advised to prepare for potential travel disruptions.',
        source: 'Met Office',
        time: '1 hour ago'
      },
      {
        title: 'Education reforms proposed by government',
        content: 'New curriculum changes aim to modernize learning and better prepare students for the digital economy. The proposals include increased focus on STEM subjects, coding education from primary school, and enhanced vocational training options.',
        source: 'The Times',
        time: '2 hours ago'
      }
    ],
    '202': [
      {
        title: 'UN summit addresses global challenges',
        content: 'World leaders gather to discuss climate, security, and economic cooperation at the annual United Nations summit. The three-day conference brings together representatives from over 190 countries to address pressing global issues including climate change, international security, and economic development.',
        source: 'Reuters',
        time: '15 minutes ago'
      },
      {
        title: 'Asian markets show strong performance',
        content: 'Economic indicators suggest continued growth in the region as major Asian stock markets post significant gains. The Nikkei 225, Hang Seng, and Shanghai Composite all showed positive momentum driven by strong corporate earnings and optimistic economic forecasts.',
        source: 'Bloomberg',
        time: '30 minutes ago'
      },
      {
        title: 'European space agency announces new mission',
        content: 'Ambitious project aims to explore distant planets and search for signs of extraterrestrial life. The European Space Agency unveiled plans for a groundbreaking mission that will deploy advanced telescopes and probes to study exoplanets in nearby star systems.',
        source: 'ESA News',
        time: '1 hour ago'
      },
      {
        title: 'International trade agreements reach milestone',
        content: 'New partnerships expected to boost global commerce and strengthen economic ties between nations. Multiple countries have signed comprehensive trade agreements that will reduce tariffs, streamline customs procedures, and promote cross-border investment.',
        source: 'Financial Times',
        time: '2 hours ago'
      },
      {
        title: 'Cultural festival celebrates diversity',
        content: 'Cities worldwide participate in annual event showcasing art, music, and traditions from around the globe. The week-long festival features performances, exhibitions, and culinary experiences representing over 100 different cultures.',
        source: 'Associated Press',
        time: '3 hours ago'
      }
    ],
    '203': [
      {
        title: 'Dancing With the Stars crowns new winner',
        content: 'Season 34 ends with star-studded finale as a new champion is crowned in front of millions of viewers. The competition featured impressive performances from all finalists, with the winning couple receiving perfect scores from the judges.',
        source: 'Hollywood Reporter',
        time: '26 Nov'
      },
      {
        title: 'Qualcomm reveals Snapdragon 8 Gen 5',
        content: 'The Verge reports on the latest mobile processor announcement from Qualcomm. The new chip promises significant performance improvements and enhanced AI capabilities for next-generation smartphones.',
        source: 'The Verge',
        time: '26 Nov'
      },
      {
        title: 'National parks announce visitor fee changes',
        content: 'Washington Post reports on America-first upcharges for foreign visitors to national parks. The new pricing structure has sparked debate about accessibility and conservation funding.',
        source: 'The Washington Post',
        time: '26 Nov'
      },
      {
        title: 'Asian stocks extend gains on Fed hopes',
        content: 'Bloomberg markets wrap shows continued optimism as investors anticipate Federal Reserve rate cuts. Market analysts suggest the positive sentiment could continue into the new year.',
        source: 'Bloomberg',
        time: '26 Nov'
      },
      {
        title: 'Community center opens new facilities',
        content: 'Local residents celebrate improved amenities for all ages as the newly renovated community center opens its doors. The facility includes a modern gym, swimming pool, and multipurpose rooms for community events.',
        source: 'Local News',
        time: '3 hours ago'
      }
    ]
  };
  
  const parentArticles = articles[parentPage] || articles['200'];
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
