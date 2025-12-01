// News adapter for pages 200-299
// Fetches news from NewsAPI

import { TeletextPage } from '@/types/teletext';

export class NewsAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 200) {
      return this.getNewsIndexPage();
    } else if (pageNumber >= 201 && pageNumber <= 299) {
      return this.getNewsArticlePage(pageId);
    }

    throw new Error(`Invalid news page: ${pageId}`);
  }

  private async getNewsIndexPage(): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.apiUrl}/top-headlines?country=gb&pageSize=10&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } } // Cache for 5 minutes
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      const articles = data.articles || [];

      const rows = [
        'NEWS HEADLINES               P200',
        '════════════════════════════════════',
        '',
        ...articles.slice(0, 15).map((article: any, index: number) => {
          const title = this.truncateText(article.title, 36);
          return `${(index + 1).toString().padStart(2, ' ')}. ${title}`;
        }),
        '',
        '',
        'INDEX   UK      WORLD',
        ''
      ];

      return {
        id: '200',
        title: 'News Headlines',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'UK', targetPage: '201', color: 'green' },
          { label: 'WORLD', targetPage: '202', color: 'yellow' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getErrorPage('200', 'News Headlines');
    }
  }

  private async getNewsArticlePage(pageId: string): Promise<TeletextPage> {
    // Return placeholder for now
    const rows = [
      `NEWS ARTICLE                 P${pageId}`,
      '════════════════════════════════════',
      '',
      'Article content coming soon...',
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
      title: 'News Article',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'BACK', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private getErrorPage(pageId: string, title: string): TeletextPage {
    const rows = [
      `${title.toUpperCase().padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to load news at this time.',
      '',
      'Please try again later.',
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
      'INDEX',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
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
