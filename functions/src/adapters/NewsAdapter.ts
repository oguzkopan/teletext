// News adapter for pages 200-299
// Integrates with NewsAPI to provide live news headlines

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';
import { createMissingApiKeyPage, logMissingApiKey } from '../utils/env-validation';
import { getApiKey } from '../utils/config';
import {
  truncateText,
  wrapText,
  stripHtml,
  padRows
} from '../utils/adapter-layout-helper';

/**
 * NewsAdapter serves news pages (200-299)
 * Integrates with NewsAPI or similar service for live headlines
 */
export class NewsAdapter implements ContentAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://newsapi.org/v2';

  constructor() {
    // Get API key from environment variable or Firebase config
    this.apiKey = getApiKey('NEWS_API_KEY', 'news.api_key');
  }

  /**
   * Retrieves a news page
   * @param pageId - The page ID to retrieve (200-299, or sub-pages like "201-2", "201-1-2")
   * @returns A TeletextPage object with news content
   * Requirements: 35.1, 35.2, 35.3 - Handle multi-page navigation
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    // Check if this is a multi-page article request (e.g., "201-1-2" for article 1, page 2)
    const multiPageMatch = pageId.match(/^(\d{3})-(\d+)-(\d+)$/);
    if (multiPageMatch) {
      const basePageId = multiPageMatch[1];
      const articleIndex = parseInt(multiPageMatch[2], 10);
      // The sub-page index is handled within formatArticleDetailPage
      
      // Fetch the article detail page (it will handle the multi-page logic)
      return this.getArticleDetailPage(basePageId, articleIndex);
    }
    
    // Check if this is a sub-page request (e.g., "201-2" for article detail)
    const subPageMatch = pageId.match(/^(\d{3})-(\d+)$/);
    if (subPageMatch) {
      const basePageId = subPageMatch[1];
      const articleIndex = parseInt(subPageMatch[2], 10);
      
      // Fetch the article detail page
      return this.getArticleDetailPage(basePageId, articleIndex);
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
   * Retrieves an individual article detail page
   * Supports multi-page articles with format: "201-1" (article 1), "201-1-2" (article 1, page 2)
   * Requirements: 35.1, 35.2, 35.3 - Multi-page navigation for article details
   */
  private async getArticleDetailPage(basePageId: string, articleIndex: number): Promise<TeletextPage> {
    const pageNumber = parseInt(basePageId, 10);
    
    try {
      let articles: any[] = [];
      let title = '';
      
      if (pageNumber === 201) {
        articles = await this.fetchTopHeadlines();
        title = 'Top Headlines';
      } else if (pageNumber === 202) {
        articles = await this.fetchNewsByCategory('general');
        title = 'World News';
      } else if (pageNumber === 203) {
        articles = await this.fetchNewsByCountry('us');
        title = 'Local News';
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
        }
      }
      
      // Check if article exists
      if (articleIndex < 1 || articleIndex > articles.length) {
        return this.getArticleNotFoundPage(`${basePageId}-${articleIndex}`, title, basePageId, articles.length);
      }
      
      const article = articles[articleIndex - 1]; // Convert to 0-based index
      
      // Format article detail page (handles multi-page automatically)
      return this.formatArticleDetailPage(`${basePageId}-${articleIndex}`, title, article, basePageId, articleIndex, articles.length);
    } catch (error) {
      return this.getErrorPage(`${basePageId}-${articleIndex}`, 'News Article', error);
    }
  }

  /**
   * Creates an error page for article not found
   */
  private getArticleNotFoundPage(
    pageId: string,
    categoryTitle: string,
    basePageId: string,
    totalArticles: number
  ): TeletextPage {
    const rows = [
      `${truncateText(categoryTitle.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'ARTICLE NOT FOUND',
      '',
      'The requested article does not exist.',
      '',
      `This page has ${totalArticles} article${totalArticles !== 1 ? 's' : ''}.`,
      '',
      'Use color buttons to navigate',
      `or enter ${basePageId} to return to the index.`,
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
      'BACK    INDEX',
      ''
    ];

    return {
      id: pageId,
      title: `${categoryTitle} - Article Not Found`,
      rows: padRows(rows),
      links: [
        { label: 'BACK', targetPage: basePageId, color: 'red' },
        { label: 'INDEX', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        error: 'article_not_found'
      }
    };
  }

  /**
   * Formats an individual article detail page with proper wrapping
   * Requirements: 18.4, 18.5
   * Format full articles with proper wrapping
   */
  private formatArticleDetailPage(
    pageId: string,
    categoryTitle: string,
    article: any,
    basePageId: string,
    articleIndex: number,
    totalArticles: number
  ): TeletextPage {
    const contentLines: string[] = [];
    
    // Article number
    contentLines.push(`Article ${articleIndex} of ${totalArticles}`);
    contentLines.push('');
    
    // Headline (wrapped to 40 chars)
    const headline = stripHtml(article.title || 'Untitled');
    const headlineWrapped = wrapText(headline, 40);
    contentLines.push(...headlineWrapped);
    contentLines.push('');
    
    // Source and date
    if (article.source && article.source.name) {
      contentLines.push(`Source: ${truncateText(article.source.name, 32)}`);
    }
    if (article.publishedAt) {
      const date = new Date(article.publishedAt);
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      contentLines.push(`Date: ${dateStr}`);
    }
    contentLines.push('');
    
    // Description (wrapped to 40 chars)
    if (article.description) {
      const description = stripHtml(article.description);
      const descWrapped = wrapText(description, 40);
      contentLines.push(...descWrapped);
    }
    
    // Content (wrapped to 40 chars) - if available
    if (article.content) {
      contentLines.push('');
      const content = stripHtml(article.content);
      const contentWrapped = wrapText(content, 40);
      contentLines.push(...contentWrapped);
    }
    
    // Build page with proper layout
    const rows: string[] = [];
    
    // Header (2 rows)
    rows.push(`${pageId.padEnd(8)}${truncateText(categoryTitle, 24).padStart(24).padEnd(24)}        `);
    rows.push(' '.repeat(40));
    
    // Content (20 rows available)
    const contentToDisplay = contentLines.slice(0, 20);
    contentToDisplay.forEach(line => {
      rows.push(line.padEnd(40).substring(0, 40));
    });
    
    // Pad remaining content rows
    while (rows.length < 22) {
      rows.push(' '.repeat(40));
    }
    
    // Footer (2 rows)
    rows.push(' '.repeat(40));
    rows.push('BACK    INDEX   PREV    NEXT'.padStart(20).padEnd(40));
    
    return {
      id: pageId,
      title: `${categoryTitle} - Article ${articleIndex}`,
      rows,
      links: [
        { label: 'BACK', targetPage: basePageId, color: 'red' },
        { label: 'INDEX', targetPage: '200', color: 'green' },
        { label: 'PREV', targetPage: articleIndex > 1 ? `${basePageId}-${articleIndex - 1}` : basePageId, color: 'yellow' },
        { label: 'NEXT', targetPage: articleIndex < totalArticles ? `${basePageId}-${articleIndex + 1}` : basePageId, color: 'blue' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }
  


  /**
   * Creates the news index page (200)
   * Requirements: Uses layout manager for full-screen utilization
   */
  private getNewsIndex(): TeletextPage {
    const rows: string[] = [];
    
    // Header (2 rows)
    rows.push('200     News Index                      ');
    rows.push('                                        ');
    
    // Content (20 rows)
    rows.push('                                        ');
    rows.push('HEADLINES                               ');
    rows.push('201 📰 Top Headlines                    ');
    rows.push('202 🌍 World News                       ');
    rows.push('203 📍 Local News                       ');
    rows.push('                                        ');
    rows.push('TOPICS                                  ');
    rows.push('210 💻 Technology                       ');
    rows.push('211 💼 Business                         ');
    rows.push('212 🎬 Entertainment                    ');
    rows.push('213 🔬 Science                          ');
    rows.push('214 ❤️  Health                          ');
    rows.push('215 ⚽ Sports News                       ');
    rows.push('                                        ');
    rows.push('Updated every 5 minutes                 ');
    rows.push('                                        ');
    rows.push('                                        ');
    rows.push('                                        ');
    rows.push('                                        ');
    rows.push('                                        ');
    
    // Footer (2 rows)
    rows.push('                                        ');
    rows.push('INDEX   TOP     WORLD   TECH            ');

    return {
      id: '200',
      title: 'News Index',
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TOP', targetPage: '201', color: 'green' },
        { label: 'WORLD', targetPage: '202', color: 'yellow' },
        { label: 'TECH', targetPage: '210', color: 'blue' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        contentType: 'news'
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
   * Formats news articles into a teletext page using the new layout engine
   * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
   * Uses single-column layout for readability with numbered headlines
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

    // Build content lines for single-column layout
    const contentLines: string[] = [];

    // Add headlines with clear numbering (1-9)
    if (articles.length === 0) {
      contentLines.push('No articles available at this time.');
      contentLines.push('');
      contentLines.push('Please try again later.');
    } else {
      articles.slice(0, 9).forEach((article, index) => {
        // Number each headline clearly (1-9)
        const headline = stripHtml(article.title || 'Untitled');
        const number = `${index + 1}.`;
        
        // Wrap headline to fit (40 chars - 3 for number = 37 chars)
        const headlineWrapped = wrapText(headline, 37);
        
        // First line with number
        if (headlineWrapped.length > 0) {
          contentLines.push(`${number} ${headlineWrapped[0]}`);
          // Additional lines indented
          for (let i = 1; i < headlineWrapped.length; i++) {
            contentLines.push(`   ${headlineWrapped[i]}`);
          }
        }
        
        // Show source and timestamp for each headline
        const metadata: string[] = [];
        if (article.source && article.source.name) {
          metadata.push(truncateText(article.source.name, 18));
        }
        if (article.publishedAt) {
          const date = new Date(article.publishedAt);
          const dateStr = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
          });
          metadata.push(dateStr);
        }
        
        if (metadata.length > 0) {
          contentLines.push(`   ${metadata.join(' • ')}`);
        }
        
        // Add spacing between articles
        contentLines.push('');
      });
    }

    // Use the new layout engine for rendering
    // This will be imported from the layout engine module
    // For now, we'll use the old approach but structure it properly
    const rows: string[] = [];
    
    // Header (2 rows)
    rows.push(`${pageId.padEnd(8)}${truncateText(title, 24).padStart(24).padEnd(24)}${timeStr.padStart(8)}`);
    rows.push(' '.repeat(40));
    
    // Content (20 rows)
    const contentToDisplay = contentLines.slice(0, 20);
    contentToDisplay.forEach(line => {
      rows.push(line.padEnd(40).substring(0, 40));
    });
    
    // Pad remaining content rows
    while (rows.length < 22) {
      rows.push(' '.repeat(40));
    }
    
    // Footer (2 rows)
    rows.push(' '.repeat(40));
    rows.push('INDEX   PREV    NEXT    BACK'.padStart(20).padEnd(40));

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '200', color: 'red' },
        { label: 'PREV', targetPage: prevPage, color: 'green' },
        { label: 'NEXT', targetPage: nextPage, color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
        contentType: 'news',
        inputMode: 'single',
        inputOptions: articles.slice(0, 9).map((_, i) => (i + 1).toString())
      }
    };
  }

  /**
   * Creates multiple news pages with continuation metadata
   * Requirements: 35.1, 35.2, 35.3, 35.4, 35.5
   * @deprecated - Currently unused but kept for future multi-page news feature
   */
  // @ts-ignore - Unused method kept for future feature
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
      rows.push(truncateText(headerTitle, 28).padEnd(28, ' ') + `P${pageId}`.padStart(12));
      rows.push('════════════════════════════════════');
      rows.push('');
      
      // Add content
      pageContent.forEach(row => rows.push(row.padEnd(60, ' ')));
      
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
        rows: padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '200', color: 'red' },
          { label: 'PREV', targetPage: prevPage, color: 'green' },
          { label: 'NEXT', targetPage: nextPage, color: 'yellow' },
          { label: 'BACK', targetPage: '100', color: 'blue' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
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
        `${truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
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
      rows: padRows(rows),
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
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'NEWS', targetPage: '200', color: 'green' }
      ],
      meta: {
        source: 'NewsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

}
