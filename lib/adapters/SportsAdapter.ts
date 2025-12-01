// Sports adapter for pages 300-399
// Fetches sports data from API-Football

import { TeletextPage } from '@/types/teletext';

export class SportsAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://v3.football.api-sports.io';

  constructor() {
    this.apiKey = process.env.SPORTS_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 300) {
      return this.getSportsIndexPage();
    } else if (pageNumber >= 301 && pageNumber <= 399) {
      return this.getSportsDetailPage(pageId);
    }

    throw new Error(`Invalid sports page: ${pageId}`);
  }

  private async getSportsIndexPage(): Promise<TeletextPage> {
    const rows = [
      'SPORTS INDEX                 P300',
      '════════════════════════════════════',
      '',
      'FOOTBALL',
      '  301 - Live Scores',
      '  302 - Premier League Table',
      '  303 - Fixtures',
      '',
      'CRICKET',
      '  310 - Live Scores',
      '  311 - Test Matches',
      '',
      'TENNIS',
      '  320 - Live Scores',
      '  321 - Tournament Results',
      '',
      '',
      '',
      '',
      'INDEX   LIVE    TABLE',
      ''
    ];

    return {
      id: '300',
      title: 'Sports Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'LIVE', targetPage: '301', color: 'green' },
        { label: 'TABLE', targetPage: '302', color: 'yellow' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getSportsDetailPage(pageId: string): Promise<TeletextPage> {
    const rows = [
      `SPORTS                       P${pageId}`,
      '════════════════════════════════════',
      '',
      'Sports content coming soon...',
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
      title: 'Sports',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'BACK', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
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
