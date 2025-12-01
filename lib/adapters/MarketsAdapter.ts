// Markets adapter for pages 400-419
// Fetches market data from Alpha Vantage and CoinGecko

import { TeletextPage } from '@/types/teletext';

export class MarketsAdapter {
  private alphaVantageKey: string;
  private coinGeckoKey: string;

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.coinGeckoKey = process.env.COINGECKO_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 400) {
      return this.getMarketsIndexPage();
    } else if (pageNumber >= 401 && pageNumber <= 419) {
      return this.getMarketDetailPage(pageId);
    }

    throw new Error(`Invalid markets page: ${pageId}`);
  }

  private async getMarketsIndexPage(): Promise<TeletextPage> {
    const rows = [
      'MARKETS & FINANCE            P400',
      '════════════════════════════════════',
      '',
      'STOCK MARKETS',
      '  401 - FTSE 100',
      '  402 - S&P 500',
      '  403 - NASDAQ',
      '',
      'CURRENCIES',
      '  410 - GBP/USD',
      '  411 - EUR/USD',
      '',
      'CRYPTOCURRENCIES',
      '  415 - Bitcoin',
      '  416 - Ethereum',
      '',
      '',
      '',
      '',
      'INDEX   STOCKS  CRYPTO',
      ''
    ];

    return {
      id: '400',
      title: 'Markets & Finance',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'STOCKS', targetPage: '401', color: 'green' },
        { label: 'CRYPTO', targetPage: '415', color: 'yellow' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getMarketDetailPage(pageId: string): Promise<TeletextPage> {
    const rows = [
      `MARKETS                      P${pageId}`,
      '════════════════════════════════════',
      '',
      'Market data coming soon...',
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
      'INDEX   BACK',
      ''
    ];

    return {
      id: pageId,
      title: 'Markets',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'BACK', targetPage: '400', color: 'green' }
      ],
      meta: {
        source: 'MarketsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
