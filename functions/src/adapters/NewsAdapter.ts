// News adapter for pages 200-299
// Integrates with NewsAPI to provide live news headlines

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';
import { createMissingApiKeyPage, logMissingApiKey } from '../utils/env-validation';

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
   * @param pageId - The page ID to retrieve (200-299, or sub-pages like "201-2")
   * @returns A TeletextPage object with news content
   * Requirements: 35.1, 35.2, 35.3 - Handle multi-page navigation
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    // Check if this is a sub-page request (e.g., "201-2")
    const subPageMatch = pageId.match(/^(\d{3})-(\d+)$/);
    if (subPageMatch) {
      const basePageId = subPageMatch[1];
      const subPageIndex = parseInt(subPageMatch[2], 10) - 1; // Convert to 0-based index
      
      // If the base page has continuation, we need to regenerate all pages
      // For now, we'll fetch the sub-page directly
      // In a production system, you'd cache the multi-page result
      return this.getSubPage(basePageId, subPageIndex);
    }
    
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
   * Retrieves a sub-page of a multi-page news article
   * Requirements: 35.2, 35.3
   */
  private async getSubPage(basePageId: string, subPageIndex: number): Promise<TeletextPage> {
    // Re-fetch the content to generate all pages
    const pageNumber = parseInt(basePageId, 10);
    
    try {
      let articles: any[] = [];
      let title = '';
      let prevPage = '200';
      let nextPage = '200';
      
      if (pageNumber === 201) {
        articles = await this.fetchTopHeadlines();
        title = 'Top Headlines';
        prevPage = '200';
        nextPage = '202';
      } else if (pageNumber === 202) {
        articles = await this.fetchNewsByCategory('general');
        title = 'World News';
        prevPage = '201';
        nextPage = '203';
      } else if (pageNumber === 203) {
        articles = await this.fetchNewsByCountry('us');
        title = 'Local News';
        prevPage = '202';
        nextPage = '200';
      } else if (pageNumber >= 210 && pageNumber <= 219) {
        const topicMap: Record<number, { title: string; category: string }> = {
          210: { title: 'Technology', category: 'technology' },
          211: { title: 'Business', category: 'business' },
          212: { title: 'Entertainment', category: 'entertainment' },
          213: { title: 'Science', category: 'science' },
          214: { title: 'Health', category: 'health' },
          215: { title: 'Sports News', category: 'sports' }
        };
        const topic = topicMap[pageNumber];
        if (topic) {
          articles = await this.fetchNewsByCategory(topic.category);
          title = topic.title;
          prevPage = '200';
          nextPage = '201';
        }
      }
      
      // Generate content rows
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const contentRows: string[] = [];
      contentRows.push(`Updated: ${timeStr}`);
      contentRows.push('');

      articles.slice(0, 12).forEach((article, index) => {
        const headline = this.stripHtml(article.title || 'Untitled');
        const truncated = this.truncateText(headline, 36);
        contentRows.push(`${index + 1}. ${truncated}`);
        
        if (article.source && article.source.name) {
          const source = this.truncateText(`   ${article.source.name}`, 40);
          contentRows.push(source);
        } else {
          contentRows.push('');
        }
      });
      
      // Generate all pages
      const pages = this.createMultiPageNews(basePageId, title, contentRows, prevPage, nextPage);
      
      // Return the requested sub-page (add 1 because index 0 is the base page)
      if (subPageIndex + 1 < pages.length) {
        return pages[subPageIndex + 1];
      }
      
      // If sub-page doesn't exist, return error
      return this.getErrorPage(basePageId, title, new Error('Sub-page not found'));
    } catch (error) {
      return this.getErrorPage(basePageId, 'News', error);
    }
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
      logMissingApiKey('NEWS_API_KEY');
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
      logMissingApiKey('NEWS_API_KEY');
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
      logMissingApiKey('NEWS_API_KEY');
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
   * Formats news articles into a teletext page (or multiple pages if content is long)
   * Requirements: 35.1, 35.2, 35.3, 35.4, 35.5
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

    const contentRows: string[] = [];
    contentRows.push(`Updated: ${timeStr}`);
    contentRows.push('');

    // Add headlines (truncated to 38 characters to leave room for numbering)
    if (articles.length === 0) {
      contentRows.push('');
      contentRows.push('No articles available at this time.');
      contentRows.push('');
      contentRows.push('Please try again later.');
    } else {
      articles.slice(0, 12).forEach((article, index) => {
        const headline = this.stripHtml(article.title || 'Untitled');
        const truncated = this.truncateText(headline, 36); // 36 chars for headline + "1. " = 39 chars
        contentRows.push(`${index + 1}. ${truncated}`);
        
        // Add source if available
        if (article.source && article.source.name) {
          const source = this.truncateText(`   ${article.source.name}`, 40);
          contentRows.push(source);
        } else {
          contentRows.push('');
        }
      });
    }

    // Check if content fits in one page (24 rows total - 3 header - 2 footer = 19 content rows)
    if (contentRows.length <= 19) {
      const rows = [
        `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
        '════════════════════════════════════',
        ''
      ];
      
      rows.push(...contentRows);
      
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
    } else {
      // Content exceeds one page - create multi-page with continuation
      const pages = this.createMultiPageNews(pageId, title, contentRows, prevPage, nextPage);
      // Return the first page (the adapter will need to handle sub-pages separately)
      return pages[0];
    }
  }

  /**
   * Creates multiple news pages with continuation metadata
   * Requirements: 35.1, 35.2, 35.3, 35.4, 35.5
   */
  private createMultiPageNews(
    basePageId: string,
    title: string,
    contentRows: string[],
    prevPage: string,
    nextPage: string
  ): TeletextPage[] {
    const contentRowsPerPage = 19; // 24 total - 3 header - 2 footer
    const totalPages = Math.ceil(contentRows.length / contentRowsPerPage);
    const pages: TeletextPage[] = [];
    
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageId = pageIndex === 0 ? basePageId : `${basePageId}-${pageIndex + 1}`;
      const startRow = pageIndex * contentRowsPerPage;
      const endRow = Math.min(startRow + contentRowsPerPage, contentRows.length);
      const pageContent = contentRows.slice(startRow, endRow);
      
      const rows: string[] = [];
      
      // Add header
      const headerTitle = pageIndex === 0 ? title.toUpperCase() : `${title.toUpperCase()} (cont.)`;
      rows.push(this.truncateText(headerTitle, 28).padEnd(28, ' ') + `P${pageId}`.padStart(12));
      rows.push('════════════════════════════════════');
      rows.push('');
      
      // Add content
      pageContent.forEach(row => rows.push(row.padEnd(40, ' ')));
      
      // Create continuation metadata
      const continuation = {
        currentPage: pageId,
        nextPage: pageIndex < totalPages - 1 ? (pageIndex === 0 ? `${basePageId}-2` : `${basePageId}-${pageIndex + 2}`) : undefined,
        previousPage: pageIndex > 0 ? (pageIndex === 1 ? basePageId : `${basePageId}-${pageIndex}`) : undefined,
        totalPages,
        currentIndex: pageIndex
      };
      
      pages.push({
        id: pageId,
        title: pageIndex === 0 ? title : `${title} (${pageIndex + 1}/${totalPages})`,
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
          cacheStatus: 'fresh',
          continuation
        }
      });
    }
    
    return pages;
  }

  /**
   * Creates an error page when API fails
   * Requirements: 4.5, 31.5
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    // Check if error is due to missing API key
    const isMissingApiKey = !this.apiKey || 
                           error?.message?.includes('NEWS_API_KEY') ||
                           error?.message?.includes('not configured');
    
    let rows: string[];
    
    if (isMissingApiKey) {
      // Use enhanced error page with detailed setup instructions
      // Requirements: 38.1, 38.2, 38.4, 38.5
      rows = createMissingApiKeyPage('NEWS_API_KEY', pageId);
    } else {
      rows = [
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
        '• Invalid API key',
        '',
        'Please try again in a few minutes.',
        '',
        'If problem persists, check:',
        '• NEWS_API_KEY in .env.local',
        '• Firebase emulators are running',
        '',
        '',
        '',
        'INDEX   NEWS',
        ''
      ];
    }

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: isMissingApiKey ? [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'HELP', targetPage: '999', color: 'green' }
      ] : [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh',
        error: isMissingApiKey ? 'missing_api_key' : 'service_unavailable'
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
