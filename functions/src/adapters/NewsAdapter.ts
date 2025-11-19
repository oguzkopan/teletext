// News adapter for pages 200-299
// Integrates with NewsAPI to provide live news headlines

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';

/**
 * NewsAdapter serves news pages (200-299)
 * Integrates with NewsAPI or similar service for live headlines
 */
export class NewsAdapter implements ContentAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://newsapi.org/v2';

  constructor() {
    // Get API key from environment variable
    // In Firebase Functions, use functions.config() or process.env
    this.apiKey = process.env.NEWS_API_KEY || '';
  }

  /**
   * Retrieves a news page
   * @param pageId - The page ID to retrieve (200-299)
   * @returns A TeletextPage object with news content
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific news pages
    if (pageNumber === 200) {
      return this.getNewsIndex();
    } else if (pageNumber === 201) {
      return this.getTopHeadlines();
    } else if (pageNumber === 202) {
      return this.getWorldNews();
    } else if (pageNumber === 203) {
      return this.getLocalNews();
    } else if (pageNumber >= 210 && pageNumber <= 219) {
      return this.getTopicNews(pageNumber);
    } else if (pageNumber >= 200 && pageNumber < 300) {
      return this.getPlaceholderPage(pageId);
    }

    throw new Error(`Invalid news page: ${pageId}`);
  }

  /**
   * Gets the cache key for a page
   * @param pageId - The page ID
   * @returns The cache key
   */
  getCacheKey(pageId: string): string {
    return `news_${pageId}`;
  }

  /**
   * Gets the cache duration for news pages
   * News pages are cached for 5 minutes (300 seconds)
   * @returns Cache duration in seconds
   */
  getCacheDuration(): number {
    return 300; // 5 minutes
  }

  /**
   * Creates the news index page (200)
   */
  private getNewsIndex(): TeletextPage {
    const rows = [
      'NEWS INDEX                   P200',
      '════════════════════════════════════',
      '',
      'HEADLINES',
      '201 Top Headlines',
      '202 World News',
      '203 Local News',
      '',
      'TOPICS',
      '210 Technology',
      '211 Business',
      '212 Entertainment',
      '213 Science',
      '214 Health',
      '215 Sports News',
      '',
      'Updated every 5 minutes',
      '',
      '',
      '',
      '',
      '',
      'INDEX   TOP     WORLD   TECH',
      ''
    ];

    return {
      id: '200',
      title: 'News Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TOP', targetPage: '201', color: 'green' },
        { label: 'WORLD', targetPage: '202', color: 'yellow' },
        { label: 'TECH', targetPage: '210', color: 'blue' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the top headlines page (201)
   */
  private async getTopHeadlines(): Promise<TeletextPage> {
    try {
      const articles = await this.fetchTopHeadlines();
      return this.formatNewsPage('201', 'Top Headlines', articles, '200', '202');
    } catch (error) {
      return this.getErrorPage('201', 'Top Headlines', error);
    }
  }

  /**
   * Creates the world news page (202)
   */
  private async getWorldNews(): Promise<TeletextPage> {
    try {
      const articles = await this.fetchNewsByCategory('general');
      return this.formatNewsPage('202', 'World News', articles, '201', '203');
    } catch (error) {
      return this.getErrorPage('202', 'World News', error);
    }
  }

  /**
   * Creates the local news page (203)
   */
  private async getLocalNews(): Promise<TeletextPage> {
    try {
      // Default to US news, could be made configurable
      const articles = await this.fetchNewsByCountry('us');
      return this.formatNewsPage('203', 'Local News', articles, '202', '200');
    } catch (error) {
      return this.getErrorPage('203', 'Local News', error);
    }
  }

  /**
   * Creates topic-specific news pages (210-219)
   */
  private async getTopicNews(pageNumber: number): Promise<TeletextPage> {
    const topicMap: Record<number, { title: string; category: string }> = {
      210: { title: 'Technology', category: 'technology' },
      211: { title: 'Business', category: 'business' },
      212: { title: 'Entertainment', category: 'entertainment' },
      213: { title: 'Science', category: 'science' },
      214: { title: 'Health', category: 'health' },
      215: { title: 'Sports News', category: 'sports' }
    };

    const topic = topicMap[pageNumber];
    if (!topic) {
      return this.getPlaceholderPage(pageNumber.toString());
    }

    try {
      const articles = await this.fetchNewsByCategory(topic.category);
      return this.formatNewsPage(
        pageNumber.toString(),
        topic.title,
        articles,
        '200',
        '201'
      );
    } catch (error) {
      return this.getErrorPage(pageNumber.toString(), topic.title, error);
    }
  }

  /**
   * Fetches top headlines from NewsAPI
   */
  private async fetchTopHeadlines(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const response = await axios.get(`${this.baseUrl}/top-headlines`, {
      params: {
        apiKey: this.apiKey,
        country: 'us',
        pageSize: 8
      },
      timeout: 5000
    });

    return response.data.articles || [];
  }

  /**
   * Fetches news by category from NewsAPI
   */
  private async fetchNewsByCategory(category: string): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const response = await axios.get(`${this.baseUrl}/top-headlines`, {
      params: {
        apiKey: this.apiKey,
        category: category,
        country: 'us',
        pageSize: 8
      },
      timeout: 5000
    });

    return response.data.articles || [];
  }

  /**
   * Fetches news by country from NewsAPI
   */
  private async fetchNewsByCountry(country: string): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const response = await axios.get(`${this.baseUrl}/top-headlines`, {
      params: {
        apiKey: this.apiKey,
        country: country,
        pageSize: 8
      },
      timeout: 5000
    });

    return response.data.articles || [];
  }

  /**
   * Formats news articles into a teletext page
   */
  private formatNewsPage(
    pageId: string,
    title: string,
    articles: any[],
    prevPage: string,
    nextPage: string
  ): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      `Updated: ${timeStr}`,
      ''
    ];

    // Add headlines (truncated to 38 characters to leave room for numbering)
    if (articles.length === 0) {
      rows.push('');
      rows.push('No articles available at this time.');
      rows.push('');
      rows.push('Please try again later.');
    } else {
      articles.slice(0, 8).forEach((article, index) => {
        const headline = this.stripHtml(article.title || 'Untitled');
        const truncated = this.truncateText(headline, 36); // 36 chars for headline + "1. " = 39 chars
        rows.push(`${index + 1}. ${truncated}`);
        
        // Add source if available
        if (article.source && article.source.name) {
          const source = this.truncateText(`   ${article.source.name}`, 40);
          rows.push(source);
        } else {
          rows.push('');
        }
      });
    }

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '200', color: 'red' },
        { label: 'PREV', targetPage: prevPage, color: 'green' },
        { label: 'NEXT', targetPage: nextPage, color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates an error page when API fails
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to fetch news at this time.',
      '',
      'This could be due to:',
      '• API service is down',
      '• Network connectivity issues',
      '• Rate limit exceeded',
      '',
      'Please try again in a few minutes.',
      '',
      '',
      '',
      '',
      '',
      'Press 200 for news index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   NEWS',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `NEWS PAGE ${pageId}              P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `News page ${pageId} is under construction.`,
      '',
      'This page will be available in a',
      'future update.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 200 for news index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   NEWS',
      ''
    ];

    return {
      id: pageId,
      title: `News Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Strips HTML tags from text
   */
  private stripHtml(html: string): string {
    if (!html) return '';
    
    let text = html.replace(/<[^>]*>/g, '');
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    return text;
  }

  /**
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
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
