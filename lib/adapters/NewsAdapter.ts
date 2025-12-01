// News adapter for pages 200-299
// Fetches news from NewsAPI

import { TeletextPage } from '@/types/teletext';

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  urlToImage?: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export class NewsAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    // Check for article detail pages FIRST (before parsing as integer)
    if (pageId.includes('-')) {
      // Article detail pages like 200-1, 201-2, etc.
      return this.getNewsArticleDetailPage(pageId);
    }

    // Now parse as integer for main pages
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 200) {
      return this.getNewsIndexPage();
    } else if (pageNumber === 201) {
      return this.getUKNewsPage();
    } else if (pageNumber === 202) {
      return this.getWorldNewsPage();
    } else if (pageNumber === 203) {
      return this.getLocalNewsPage();
    } else if (pageNumber >= 204 && pageNumber <= 209) {
      return this.getCategoryNewsPage(pageId);
    }

    throw new Error(`Invalid news page: ${pageId}`);
  }

  private async getNewsIndexPage(): Promise<TeletextPage> {
    try {
      // Try UK first, fallback to general if no results
      let response = await fetch(
        `${this.apiUrl}/top-headlines?country=gb&pageSize=5&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } } // Cache for 5 minutes
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      let data: NewsAPIResponse = await response.json();
      let articles = data.articles || [];
      
      // If no UK articles, fallback to general news
      if (articles.length === 0) {
        response = await fetch(
          `${this.apiUrl}/top-headlines?category=general&pageSize=5&apiKey=${this.apiKey}`,
          { next: { revalidate: 300 } }
        );
        data = await response.json();
        articles = data.articles || [];
      }

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
        '{yellow}║  {red}BREAKING NEWS{yellow}  {white}░▒▓█▓▒░  {cyan}Latest Updates from Around the World  {white}░▒▓█▓▒░  {yellow}Live from News API{yellow}                           ║',
        '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{cyan}▓▓▓ TOP STORIES ▓▓▓',
        ...this.formatArticlesForIndex(articles),
        '',
        '{cyan}▓▓▓ NEWS CATEGORIES ▓▓▓',
        '{green}201{white} UK News & Local Updates              {green}202{white} World News & International              {green}203{white} Local News & Community',
        '{green}204{white} Business & Economy                    {green}205{white} Technology & Innovation                 {green}206{white} Science & Health',
        '{green}207{white} Entertainment & Culture               {green}208{white} Politics & Government                   {green}209{white} Environment & Climate',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-5{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=UK {yellow}YELLOW{white}=WORLD {blue}BLUE{white}=LOCAL',
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
          ...articles.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `200-${index + 1}`
          }))
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getErrorPage('200', 'News Headlines');
    }
  }

  private async getUKNewsPage(): Promise<TeletextPage> {
    try {
      // Try UK first, fallback to general if no results
      let response = await fetch(
        `${this.apiUrl}/top-headlines?country=gb&pageSize=5&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch UK news');
      }

      let data: NewsAPIResponse = await response.json();
      let articles = data.articles || [];
      
      // If no UK articles, fallback to general news
      if (articles.length === 0) {
        response = await fetch(
          `${this.apiUrl}/top-headlines?category=general&pageSize=5&apiKey=${this.apiKey}`,
          { next: { revalidate: 300 } }
        );
        data = await response.json();
        articles = data.articles || [];
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}201 {yellow}UK News & Local Updates {cyan}${timeStr}                                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live data from News API                                                                                                  ',
        '{white}Use colored buttons to navigate between news categories',
        '',
        ...this.formatArticlesForList(articles),
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
          ...articles.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `201-${index + 1}`
          }))
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching UK news:', error);
      return this.getErrorPage('201', 'UK News');
    }
  }

  private async getWorldNewsPage(): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.apiUrl}/top-headlines?category=general&pageSize=5&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch world news');
      }

      const data: NewsAPIResponse = await response.json();
      const articles = data.articles || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}202 {yellow}World News & International {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live international news from News API                                                                                    ',
        '{white}International news from around the globe',
        '',
        ...this.formatArticlesForList(articles),
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
          ...articles.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `202-${index + 1}`
          }))
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching world news:', error);
      return this.getErrorPage('202', 'World News');
    }
  }

  private async getLocalNewsPage(): Promise<TeletextPage> {
    try {
      // Use US news as "local" news for demonstration
      const response = await fetch(
        `${this.apiUrl}/top-headlines?country=us&pageSize=5&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch local news');
      }

      const data: NewsAPIResponse = await response.json();
      const articles = data.articles || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}203 {yellow}Local News & Community {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live local news from News API                                                                                            ',
        '{white}Your local news and community updates',
        '',
        ...this.formatArticlesForList(articles),
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
          ...articles.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `203-${index + 1}`
          }))
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching local news:', error);
      return this.getErrorPage('203', 'Local News');
    }
  }

  private async getCategoryNewsPage(pageId: string): Promise<TeletextPage> {
    const pageNum = parseInt(pageId, 10);
    const categories: Record<number, { name: string; category: string; title: string }> = {
      204: { name: 'Business', category: 'business', title: 'Business & Economy' },
      205: { name: 'Technology', category: 'technology', title: 'Technology & Innovation' },
      206: { name: 'Science', category: 'science', title: 'Science & Health' },
      207: { name: 'Entertainment', category: 'entertainment', title: 'Entertainment & Culture' },
      208: { name: 'Politics', category: 'general', title: 'Politics & Government' },
      209: { name: 'Environment', category: 'science', title: 'Environment & Climate' }
    };

    const categoryInfo = categories[pageNum];
    if (!categoryInfo) {
      return this.getErrorPage(pageId, 'News Category');
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/top-headlines?category=${categoryInfo.category}&pageSize=5&apiKey=${this.apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${categoryInfo.name} news`);
      }

      const data: NewsAPIResponse = await response.json();
      const articles = data.articles || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}${pageId} {yellow}${categoryInfo.title} {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ` {white}• Live ${categoryInfo.name.toLowerCase()} news from News API                                                                                    `,
        `{white}Latest ${categoryInfo.name.toLowerCase()} news and updates`,
        '',
        ...this.formatArticlesForList(articles),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-5{white} for articles • {red}RED{white}=INDEX {green}GREEN{white}=NEWS {yellow}YELLOW{white}=UK {blue}BLUE{white}=WORLD',
        ''
      ];

      return {
        id: pageId,
        title: categoryInfo.title,
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'NEWS', targetPage: '200', color: 'green' },
          { label: 'UK', targetPage: '201', color: 'yellow' },
          { label: 'WORLD', targetPage: '202', color: 'blue' },
          ...articles.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `${pageId}-${index + 1}`
          }))
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error(`Error fetching ${categoryInfo.name} news:`, error);
      return this.getErrorPage(pageId, categoryInfo.title);
    }
  }

  private async getNewsArticleDetailPage(pageId: string): Promise<TeletextPage> {
    const [parentPage, articleNumStr] = pageId.split('-');
    const articleNum = parseInt(articleNumStr, 10) - 1;

    try {
      // Fetch articles based on parent page
      let endpoint = '';
      let pageTitle = '';
      
      if (parentPage === '200') {
        endpoint = `${this.apiUrl}/top-headlines?country=gb&pageSize=5&apiKey=${this.apiKey}`;
        pageTitle = 'News Headlines';
      } else if (parentPage === '201') {
        endpoint = `${this.apiUrl}/top-headlines?country=gb&pageSize=5&apiKey=${this.apiKey}`;
        pageTitle = 'UK News';
      } else if (parentPage === '202') {
        endpoint = `${this.apiUrl}/top-headlines?category=general&pageSize=5&apiKey=${this.apiKey}`;
        pageTitle = 'World News';
      } else if (parentPage === '203') {
        endpoint = `${this.apiUrl}/top-headlines?country=us&pageSize=5&apiKey=${this.apiKey}`;
        pageTitle = 'Local News';
      } else if (parseInt(parentPage, 10) >= 204 && parseInt(parentPage, 10) <= 209) {
        const categories: Record<string, string> = {
          '204': 'business',
          '205': 'technology',
          '206': 'science',
          '207': 'entertainment',
          '208': 'general',
          '209': 'science'
        };
        const category = categories[parentPage];
        endpoint = `${this.apiUrl}/top-headlines?category=${category}&pageSize=5&apiKey=${this.apiKey}`;
        pageTitle = 'Category News';
      }

      const response = await fetch(endpoint, { next: { revalidate: 300 } });
      
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data: NewsAPIResponse = await response.json();
      const articles = data.articles || [];
      const article = articles[articleNum];

      if (!article) {
        return this.getErrorPage(pageId, 'Article Not Found');
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const publishedDate = new Date(article.publishedAt);
      const timeAgo = this.getTimeAgo(publishedDate);

      // Format article content
      const content = article.description || article.content || 'No content available.';
      const wrappedContent = this.wrapText(content, 140);

      const rows = [
        `{cyan}${pageId} {yellow}${this.truncateText(article.title, 60)} {cyan}${timeStr}                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        `{white}${article.title}`,
        '',
        `{cyan}${article.source.name} • ${timeAgo}`,
        '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
        '',
        ...wrappedContent.map(line => `{white}${line}`),
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
        title: this.truncateText(article.title, 30),
        rows,
        links: [
          { label: 'BACK', targetPage: parentPage, color: 'red' },
          { label: 'INDEX', targetPage: '100', color: 'green' },
          { label: 'PREV', targetPage: articleNum > 0 ? `${parentPage}-${articleNum}` : parentPage, color: 'yellow' },
          { label: 'NEXT', targetPage: `${parentPage}-${articleNum + 2}`, color: 'blue' }
        ],
        meta: {
          source: 'NewsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching article:', error);
      return this.getErrorPage(pageId, 'Article Error');
    }
  }

  private formatArticlesForIndex(articles: NewsArticle[]): string[] {
    const lines: string[] = [];
    
    articles.slice(0, 5).forEach((article, index) => {
      const title = this.truncateText(article.title, 110);
      const timeAgo = this.getTimeAgo(new Date(article.publishedAt));
      
      if (index === 0) {
        lines.push(`{red}🔴 BREAKING:{white} ${title}`);
      } else {
        lines.push(`{yellow}${index + 1}. {white}${title}`);
      }
      lines.push(`{white}   {cyan}${article.source.name} • ${timeAgo}`);
      lines.push('');
    });
    
    return lines;
  }

  private formatArticlesForList(articles: NewsArticle[]): string[] {
    const lines: string[] = [];
    
    articles.slice(0, 5).forEach((article, index) => {
      const title = this.truncateText(article.title, 110);
      const timeAgo = this.getTimeAgo(new Date(article.publishedAt));
      
      lines.push(`{yellow}${index + 1}. {white}${title}`);
      lines.push(`{white}   {cyan}${article.source.name} • ${timeAgo}`);
      lines.push('');
    });
    
    return lines;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    
    return lines.slice(0, 15); // Limit to 15 lines for article content
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
