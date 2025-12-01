// Markets adapter for pages 400-419
// Fetches market data from Alpha Vantage and CoinGecko

import { TeletextPage } from '@/types/teletext';

interface StockQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface AlphaVantageQuoteResponse {
  'Global Quote': StockQuote;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

export class MarketsAdapter {
  private alphaVantageKey: string;
  private coinGeckoKey: string;
  private alphaVantageUrl: string = 'https://www.alphavantage.co/query';
  private coinGeckoUrl: string = 'https://api.coingecko.com/api/v3';

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.coinGeckoKey = process.env.COINGECKO_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    // Check for article detail pages FIRST
    if (pageId.includes('-')) {
      return this.getMarketDetailArticlePage(pageId);
    }

    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 400) {
      return this.getMarketsIndexPage();
    } else if (pageNumber === 401) {
      return this.getStockMarketsPage();
    } else if (pageNumber === 402) {
      return this.getCryptoMarketsPage();
    } else if (pageNumber === 403) {
      return this.getCommoditiesPage();
    } else if (pageNumber === 404) {
      return this.getForexPage();
    } else if (pageNumber >= 405 && pageNumber <= 419) {
      return this.getMarketCategoryPage(pageId);
    }

    throw new Error(`Invalid markets page: ${pageId}`);
  }

  private async getMarketsIndexPage(): Promise<TeletextPage> {
    try {
      // Fetch top crypto prices for index
      const cryptoResponse = await fetch(
        `${this.coinGeckoUrl}/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,ripple&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: this.coinGeckoKey ? { 'x-cg-demo-api-key': this.coinGeckoKey } : {},
          next: { revalidate: 300 }
        }
      );

      const cryptoData: CoinGeckoResponse = cryptoResponse.ok ? await cryptoResponse.json() : {};

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Format crypto data for display
      const cryptos = [
        { name: 'Bitcoin (BTC)', data: cryptoData.bitcoin },
        { name: 'Ethereum (ETH)', data: cryptoData.ethereum },
        { name: 'BNB (BNB)', data: cryptoData.binancecoin },
        { name: 'Cardano (ADA)', data: cryptoData.cardano },
        { name: 'Solana (SOL)', data: cryptoData.solana },
        { name: 'Ripple (XRP)', data: cryptoData.ripple }
      ];

      const cryptoLines: string[] = [];
      cryptos.forEach(crypto => {
        if (crypto.data) {
          const price = crypto.data.usd || 0;
          const change = crypto.data.usd_24h_change || 0;
          cryptoLines.push(
            `{yellow}${crypto.name}:{white} $${this.formatNumber(price)} {${change >= 0 ? 'green' : 'red'}}${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
          );
        }
      });

      const rows = [
        `{cyan}400 {yellow}💰 MARKETS & FINANCE 💰 {cyan}${dateStr} ${timeStr}                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
        '{yellow}║  {red}LIVE MARKETS{yellow}  {white}░▒▓█▓▒░  {cyan}Real-time Financial Data  {white}░▒▓█▓▒░  {yellow}Live from APIs{yellow}                                                  ║',
        '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{cyan}▓▓▓ MARKET SNAPSHOT ▓▓▓',
        ...cryptoLines,
        '',
        '{cyan}▓▓▓ MARKET CATEGORIES ▓▓▓',
        '{green}401{white} Stock Markets & Indices              {green}402{white} Cryptocurrency Markets               {green}403{white} Commodities & Metals',
        '{green}404{white} Foreign Exchange (Forex)             {green}405{white} Bonds & Treasury                     {green}406{white} Futures & Options',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=STOCKS {yellow}YELLOW{white}=CRYPTO {blue}BLUE{white}=COMMODITIES',
        ''
      ];

      return {
        id: '400',
        title: 'Markets & Finance',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'STOCKS', targetPage: '401', color: 'green' },
          { label: 'CRYPTO', targetPage: '402', color: 'yellow' },
          { label: 'COMMODITIES', targetPage: '403', color: 'blue' }
        ],
        meta: {
          source: 'MarketsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching markets index:', error);
      return this.getErrorPage('400', 'Markets & Finance');
    }
  }

  private async getStockMarketsPage(): Promise<TeletextPage> {
    try {
      // Fetch major stock indices
      const symbols = ['SPY', 'QQQ', 'DIA', 'AAPL', 'MSFT'];
      const stockData: any[] = [];

      for (const symbol of symbols.slice(0, 5)) {
        try {
          const response = await fetch(
            `${this.alphaVantageUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`,
            { next: { revalidate: 300 } }
          );
          const data: AlphaVantageQuoteResponse = await response.json();
          if (data['Global Quote']) {
            stockData.push(data['Global Quote']);
          }
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
        }
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const rows = [
        `{cyan}401 {yellow}Stock Markets & Indices {cyan}${timeStr}                                                                                                            {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live stock data from Alpha Vantage                                                                                      ',
        '{white}Major US stock indices and top companies',
        '',
        ...this.formatStockList(stockData),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-5{white} for details • {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=CRYPTO {blue}BLUE{white}=FOREX',
        ''
      ];

      return {
        id: '401',
        title: 'Stock Markets',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'MARKETS', targetPage: '400', color: 'green' },
          { label: 'CRYPTO', targetPage: '402', color: 'yellow' },
          { label: 'FOREX', targetPage: '404', color: 'blue' },
          ...stockData.map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `401-${index + 1}`
          }))
        ],
        meta: {
          source: 'MarketsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching stock markets:', error);
      return this.getErrorPage('401', 'Stock Markets');
    }
  }

  private async getCryptoMarketsPage(): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.coinGeckoUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1`,
        {
          headers: this.coinGeckoKey ? { 'x-cg-demo-api-key': this.coinGeckoKey } : {},
          next: { revalidate: 300 }
        }
      );

      const cryptoData: CryptoData[] = response.ok ? await response.json() : [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const rows = [
        `{cyan}402 {yellow}Cryptocurrency Markets {cyan}${timeStr}                                                                                                             {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live crypto data from CoinGecko                                                                                      ',
        '{white}Top cryptocurrencies by market cap',
        '',
        ...this.formatCryptoList(cryptoData),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-8{white} for details • {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=STOCKS {blue}BLUE{white}=COMMODITIES',
        ''
      ];

      return {
        id: '402',
        title: 'Cryptocurrency Markets',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'MARKETS', targetPage: '400', color: 'green' },
          { label: 'STOCKS', targetPage: '401', color: 'yellow' },
          { label: 'COMMODITIES', targetPage: '403', color: 'blue' },
          ...cryptoData.map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `402-${index + 1}`
          }))
        ],
        meta: {
          source: 'MarketsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      };
    } catch (error) {
      console.error('Error fetching crypto markets:', error);
      return this.getErrorPage('402', 'Cryptocurrency Markets');
    }
  }

  private async getCommoditiesPage(): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rows = [
      `{cyan}403 {yellow}Commodities & Metals {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{yellow}║  {white}COMING SOON{yellow}  {white}░▒▓█▓▒░  {cyan}Commodities data under development  {white}░▒▓█▓▒░{yellow}                                                          ║',
      '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{white}Commodities pricing will include:',
      '',
      '{yellow}•{white} Gold, Silver, Platinum prices',
      '{yellow}•{white} Oil (Brent & WTI) prices',
      '{yellow}•{white} Natural Gas prices',
      '{yellow}•{white} Agricultural commodities',
      '',
      '{white}Check out our other markets:',
      '',
      '{green}401{white} - Stock Markets',
      '{green}402{white} - Cryptocurrency Markets',
      '{green}404{white} - Foreign Exchange',
      '',
      '',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=STOCKS {blue}BLUE{white}=CRYPTO',
      ''
    ];

    return {
      id: '403',
      title: 'Commodities & Metals',
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' },
        { label: 'STOCKS', targetPage: '401', color: 'yellow' },
        { label: 'CRYPTO', targetPage: '402', color: 'blue' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private async getForexPage(): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rows = [
      `{cyan}404 {yellow}Foreign Exchange (Forex) {cyan}${timeStr}                                                                                                             {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{yellow}║  {white}COMING SOON{yellow}  {white}░▒▓█▓▒░  {cyan}Forex data under development  {white}░▒▓█▓▒░{yellow}                                                                ║',
      '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{white}Foreign exchange rates will include:',
      '',
      '{yellow}•{white} Major currency pairs (EUR/USD, GBP/USD, USD/JPY)',
      '{yellow}•{white} Cross rates and exotic pairs',
      '{yellow}•{white} Real-time exchange rates',
      '{yellow}•{white} 24-hour price changes',
      '',
      '{white}Check out our other markets:',
      '',
      '{green}401{white} - Stock Markets',
      '{green}402{white} - Cryptocurrency Markets',
      '{green}403{white} - Commodities & Metals',
      '',
      '',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=STOCKS {blue}BLUE{white}=CRYPTO',
      ''
    ];

    return {
      id: '404',
      title: 'Foreign Exchange',
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' },
        { label: 'STOCKS', targetPage: '401', color: 'yellow' },
        { label: 'CRYPTO', targetPage: '402', color: 'blue' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private async getMarketCategoryPage(pageId: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const categories: Record<string, string> = {
      '405': 'Bonds & Treasury',
      '406': 'Futures & Options',
      '407': 'Market Indices',
      '408': 'ETFs & Funds',
      '409': 'Market Analysis'
    };

    const title = categories[pageId] || 'Market Category';

    const rows = [
      `{cyan}${pageId} {yellow}${title} {cyan}${timeStr}                                                                                                                     {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{yellow}║  {white}COMING SOON{yellow}  {white}░▒▓█▓▒░  {cyan}This market category is under development  {white}░▒▓█▓▒░{yellow}                                                  ║',
      '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      `{white}${title} content will be available soon.`,
      '',
      '{white}In the meantime, check out our live markets:',
      '',
      '{green}401{white} - Stock Markets & Indices',
      '{green}402{white} - Cryptocurrency Markets',
      '{green}403{white} - Commodities & Metals',
      '{green}404{white} - Foreign Exchange (Forex)',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=STOCKS {blue}BLUE{white}=CRYPTO',
      ''
    ];

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' },
        { label: 'STOCKS', targetPage: '401', color: 'yellow' },
        { label: 'CRYPTO', targetPage: '402', color: 'blue' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private async getMarketDetailArticlePage(pageId: string): Promise<TeletextPage> {
    const [parentPage, articleNumStr] = pageId.split('-');
    const articleNum = parseInt(articleNumStr, 10) - 1;

    try {
      if (parentPage === '401') {
        // Stock detail page
        const symbols = ['SPY', 'QQQ', 'DIA', 'AAPL', 'MSFT'];
        const symbol = symbols[articleNum];
        
        const response = await fetch(
          `${this.alphaVantageUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`,
          { next: { revalidate: 300 } }
        );
        
        const data: AlphaVantageQuoteResponse = await response.json();
        const quote = data['Global Quote'];

        if (!quote) {
          return this.getErrorPage(pageId, 'Stock Not Found');
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = quote['10. change percent'];

        const rows = [
          `{cyan}${pageId} {yellow}${quote['01. symbol']} Stock Quote {cyan}${timeStr}                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
          '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
          '',
          `{white}Symbol: {yellow}${quote['01. symbol']}`,
          `{white}Price: {yellow}$${price.toFixed(2)}`,
          `{white}Change: {${change >= 0 ? 'green' : 'red'}}${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent})`,
          '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
          '',
          `{white}Open: {cyan}$${parseFloat(quote['02. open']).toFixed(2)}`,
          `{white}High: {cyan}$${parseFloat(quote['03. high']).toFixed(2)}`,
          `{white}Low: {cyan}$${parseFloat(quote['04. low']).toFixed(2)}`,
          `{white}Previous Close: {cyan}$${parseFloat(quote['08. previous close']).toFixed(2)}`,
          `{white}Volume: {cyan}${this.formatNumber(parseInt(quote['06. volume']))}`,
          `{white}Trading Day: {cyan}${quote['07. latest trading day']}`,
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
          `{cyan}NAVIGATION: {red}BACK{white}=Return to ${parentPage} {green}INDEX{white}=Main Index {yellow}PREV{white}=Previous {blue}NEXT{white}=Next Stock`,
          ''
        ];

        return {
          id: pageId,
          title: `${quote['01. symbol']} Stock`,
          rows,
          links: [
            { label: 'BACK', targetPage: parentPage, color: 'red' },
            { label: 'INDEX', targetPage: '100', color: 'green' },
            { label: 'PREV', targetPage: articleNum > 0 ? `${parentPage}-${articleNum}` : parentPage, color: 'yellow' },
            { label: 'NEXT', targetPage: `${parentPage}-${articleNum + 2}`, color: 'blue' }
          ],
          meta: {
            source: 'MarketsAdapter',
            lastUpdated: new Date().toISOString(),
            fullScreenLayout: true,
            useLayoutManager: true,
            renderedWithLayoutEngine: true
          }
        };
      } else if (parentPage === '402') {
        // Crypto detail page
        const response = await fetch(
          `${this.coinGeckoUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1`,
          {
            headers: this.coinGeckoKey ? { 'x-cg-demo-api-key': this.coinGeckoKey } : {},
            next: { revalidate: 300 }
          }
        );

        const cryptoData: CryptoData[] = await response.json();
        const crypto = cryptoData[articleNum];

        if (!crypto) {
          return this.getErrorPage(pageId, 'Crypto Not Found');
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        const rows = [
          `{cyan}${pageId} {yellow}${crypto.name} (${crypto.symbol.toUpperCase()}) {cyan}${timeStr}                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
          '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
          '',
          `{white}Name: {yellow}${crypto.name}`,
          `{white}Symbol: {yellow}${crypto.symbol.toUpperCase()}`,
          `{white}Price: {yellow}$${this.formatNumber(crypto.current_price)}`,
          `{white}24h Change: {${crypto.price_change_percentage_24h >= 0 ? 'green' : 'red'}}${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`,
          '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
          '',
          `{white}Market Cap: {cyan}$${this.formatNumber(crypto.market_cap)}`,
          `{white}24h Volume: {cyan}$${this.formatNumber(crypto.total_volume)}`,
          `{white}24h High: {cyan}$${this.formatNumber(crypto.high_24h)}`,
          `{white}24h Low: {cyan}$${this.formatNumber(crypto.low_24h)}`,
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
          `{cyan}NAVIGATION: {red}BACK{white}=Return to ${parentPage} {green}INDEX{white}=Main Index {yellow}PREV{white}=Previous {blue}NEXT{white}=Next Crypto`,
          ''
        ];

        return {
          id: pageId,
          title: `${crypto.name}`,
          rows,
          links: [
            { label: 'BACK', targetPage: parentPage, color: 'red' },
            { label: 'INDEX', targetPage: '100', color: 'green' },
            { label: 'PREV', targetPage: articleNum > 0 ? `${parentPage}-${articleNum}` : parentPage, color: 'yellow' },
            { label: 'NEXT', targetPage: `${parentPage}-${articleNum + 2}`, color: 'blue' }
          ],
          meta: {
            source: 'MarketsAdapter',
            lastUpdated: new Date().toISOString(),
            fullScreenLayout: true,
            useLayoutManager: true,
            renderedWithLayoutEngine: true
          }
        };
      }

      return this.getErrorPage(pageId, 'Market Detail');
    } catch (error) {
      console.error('Error fetching market detail:', error);
      return this.getErrorPage(pageId, 'Market Detail');
    }
  }

  private formatStockList(stocks: StockQuote[]): string[] {
    const lines: string[] = [];
    
    if (stocks.length === 0) {
      lines.push('{white}No stock data available');
      lines.push('{white}Please check your API key');
      return lines;
    }

    stocks.forEach((stock, index) => {
      const price = parseFloat(stock['05. price']);
      const change = parseFloat(stock['09. change']);
      const changePercent = stock['10. change percent'];
      
      lines.push(`{yellow}${index + 1}. {white}${stock['01. symbol'].padEnd(6)} $${price.toFixed(2).padStart(8)} {${change >= 0 ? 'green' : 'red'}}${change >= 0 ? '+' : ''}${changePercent}`);
      if (index < stocks.length - 1) lines.push('');
    });
    
    return lines;
  }

  private formatCryptoList(cryptos: CryptoData[]): string[] {
    const lines: string[] = [];
    
    if (cryptos.length === 0) {
      lines.push('{white}No crypto data available');
      lines.push('{white}Please check your API connection');
      return lines;
    }

    cryptos.forEach((crypto, index) => {
      const change = crypto.price_change_percentage_24h;
      
      lines.push(`{yellow}${index + 1}. {white}${crypto.name.padEnd(15)} $${this.formatNumber(crypto.current_price).padStart(10)} {${change >= 0 ? 'green' : 'red'}}${change >= 0 ? '+' : ''}${change.toFixed(2)}%`);
      if (index < cryptos.length - 1) lines.push('');
    });
    
    return lines;
  }

  private formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  private getErrorPage(pageId: string, title: string): TeletextPage {
    const rows = [
      `{cyan}${pageId} {yellow}${title} {cyan}ERROR                                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{red}SERVICE UNAVAILABLE',
      '',
      '{white}Unable to load market data at this time.',
      '',
      '{white}Please try again later.',
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
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MARKETS',
      ''
    ];

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MARKETS', targetPage: '400', color: 'green' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }
}
