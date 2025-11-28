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
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}201{white}=UK NEWS {yellow}202{white}=WORLD NEWS {blue}203{white}=LOCAL NEWS',
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
      { label: 'LOCAL', targetPage: '203', color: 'blue' }
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
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}200{white}=NEWS INDEX {yellow}202{white}=WORLD NEWS {blue}203{white}=LOCAL NEWS',
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
      { label: 'LOCAL', targetPage: '203', color: 'blue' }
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
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}200{white}=NEWS INDEX {yellow}201{white}=UK NEWS {blue}203{white}=LOCAL NEWS',
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
      { label: 'LOCAL', targetPage: '203', color: 'blue' }
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
    '{cyan}NAVIGATION: {red}100{white}=INDEX {green}200{white}=NEWS INDEX {yellow}201{white}=UK NEWS {blue}202{white}=WORLD NEWS',
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
      { label: 'WORLD', targetPage: '202', color: 'blue' }
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
