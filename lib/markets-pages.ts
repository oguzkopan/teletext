/**
 * Markets Pages (4xx)
 * Financial markets, stocks, crypto, and trading
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 400 - Markets Index
 */
export function createMarketsIndexPage(): TeletextPage {
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
    `{cyan}400 {yellow}📈 MARKETS OVERVIEW & INDICES 📈 {cyan}${dateStr} ${timeStr}                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{yellow}║  {green}MARKETS OPEN{yellow}  {white}░▒▓█▓▒░  {cyan}Real-Time Trading Data  {white}░▒▓█▓▒░  {yellow}Updated Every 15 Seconds{yellow}                                        ║',
    '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ MAJOR INDICES ▓▓▓',
    '{white}FTSE 100:          {green}7,845.23  {green}▲ +1.2%  {white}(+92.45)                                                                  {cyan}London',
    '{white}S&P 500:           {green}4,567.89  {green}▲ +0.8%  {white}(+36.12)                                                                  {cyan}New York',
    '{white}DAX:               {green}16,234.56 {green}▲ +1.5%  {white}(+240.78)                                                                 {cyan}Frankfurt',
    '{white}Nikkei 225:        {red}28,456.78   {red}▼ -0.3%  {white}(-85.23)                                                                  {cyan}Tokyo',
    '',
    '{cyan}▓▓▓ CRYPTOCURRENCY ▓▓▓',
    '{white}Bitcoin (BTC):     {green}$42,567.89  {green}▲ +3.2%  {white}24h Volume: $28.5B                                                      {cyan}Crypto',
    '{white}Ethereum (ETH):    {green}$2,234.56   {green}▲ +2.8%  {white}24h Volume: $12.3B                                                      {cyan}Crypto',
    '{white}Ripple (XRP):      {red}$0.5678     {red}▼ -1.2%  {white}24h Volume: $1.8B                                                       {cyan}Crypto',
    '',
    '{cyan}▓▓▓ MARKET CATEGORIES ▓▓▓',
    '{green}401{white} Stock Prices & Trading               {green}402{white} Crypto Markets & Digital Assets         {green}403{white} Commodities & Metals',
    '{green}404{white} Currency Exchange Rates              {green}405{white} Bonds & Fixed Income                    {green}406{white} Futures & Options',
    '',
    '{cyan}▓▓▓ MARKET NEWS ▓▓▓',
    '{yellow}•{white} Fed announces interest rate decision - Markets respond positively to policy update',
    '{yellow}•{white} Tech stocks surge on earnings reports - Major companies exceed expectations',
    '{yellow}•{white} Oil prices stabilize after volatile week - Energy sector shows signs of recovery',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}100{white}=MAIN INDEX {green}401{white}=STOCKS {yellow}402{white}=CRYPTO {blue}403{white}=COMMODITIES',
    ''
  ];
  
  return {
    id: '400',
    title: 'Markets Overview',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'STOCKS', targetPage: '401', color: 'green' },
      { label: 'CRYPTO', targetPage: '402', color: 'yellow' },
      { label: 'COMMODITIES', targetPage: '403', color: 'blue' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
      // No inputMode specified = defaults to 'triple' for 3-digit navigation
    }
  };
}
