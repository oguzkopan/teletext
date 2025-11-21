/**
 * Layout Manager Usage Examples
 * 
 * Demonstrates how to use the Layout Manager for various page types
 */

import { LayoutManager } from '../layout-manager';
import { TeletextPage } from '@/types/teletext';

describe('Layout Manager Examples', () => {
  let layoutManager: LayoutManager;

  beforeEach(() => {
    layoutManager = new LayoutManager();
  });

  it('Example 1: Simple news page with full-screen layout', () => {
    const newsPage: TeletextPage = {
      id: '201',
      title: 'Breaking News',
      rows: [
        'MAJOR TECH ANNOUNCEMENT',
        '',
        'A leading technology company has announced',
        'a breakthrough in quantum computing that',
        'could revolutionize the industry.',
        '',
        'The new processor operates at room',
        'temperature and achieves unprecedented',
        'calculation speeds.',
        '',
        'Industry experts are calling this a',
        'game-changing development.',
        ...Array(8).fill('')
      ],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'MORE NEWS', targetPage: '202', color: 'green' }
      ],
      meta: {
        source: 'NewsAPI',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };

    const layout = layoutManager.calculateLayout(newsPage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'left',
      showBreadcrumbs: false,
      showPageIndicator: false
    });

    // Verify layout structure
    expect(layout.totalRows).toBe(24);
    expect(layout.header[0]).toContain('📰'); // News icon
    expect(layout.header[0]).toContain('BREAKING NEWS');
    expect(layout.header[0]).toContain('P201');
    expect(layout.footer[1]).toContain('100=INDEX');
    expect(layout.footer[1]).toContain('🔴INDEX');
    expect(layout.footer[1]).toContain('🟢MORE NEW'); // Truncated to 8 chars

    // Verify all rows are exactly 40 characters
    const allRows = [...layout.header, ...layout.content, ...layout.footer];
    allRows.forEach(row => {
      expect(row.length).toBe(40);
    });
  });

  it('Example 2: Multi-page article with continuation', () => {
    const articlePage: TeletextPage = {
      id: '202',
      title: 'Tech Analysis',
      rows: Array(20).fill('Article content continues here...'),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' }
      ],
      meta: {
        continuation: {
          currentPage: '202',
          nextPage: '203',
          previousPage: '201',
          totalPages: 3,
          currentIndex: 1
        }
      }
    };

    const layout = layoutManager.calculateLayout(articlePage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'left',
      showBreadcrumbs: false,
      showPageIndicator: true
    });

    // Verify page position indicator
    expect(layout.header[1]).toContain('2/3');

    // Verify arrow navigation
    expect(layout.footer[1]).toContain('↑↓=SCROLL');
  });

  it('Example 3: Sports page with live indicator', () => {
    const sportsPage: TeletextPage = {
      id: '301',
      title: 'Live Scores',
      rows: [
        'PREMIER LEAGUE',
        '',
        'Manchester United  2 - 1  Liverpool',
        'Chelsea            1 - 1  Arsenal',
        'Tottenham          3 - 0  Newcastle',
        ...Array(15).fill('')
      ],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'FIXTURES', targetPage: '302', color: 'green' }
      ],
      meta: {
        source: 'SportsAPI',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };

    const layout = layoutManager.calculateLayout(sportsPage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'left',
      showBreadcrumbs: false,
      showPageIndicator: false
    });

    // Verify sports icon
    expect(layout.header[0]).toContain('⚽');
    expect(layout.header[0]).toContain('LIVE SCORES');

    // Verify timestamp
    expect(layout.header[1]).toContain('LIVE');
  });

  it('Example 4: Markets page with trend indicators', () => {
    const marketsPage: TeletextPage = {
      id: '401',
      title: 'Stock Markets',
      rows: [
        'FTSE 100          7,234.56  ▲ +1.2%',
        'DOW JONES        34,567.89  ▼ -0.5%',
        'NASDAQ           13,456.78  ▲ +2.1%',
        ...Array(17).fill('')
      ],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' }
      ],
      meta: {
        source: 'MarketsAPI',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'cached'
      }
    };

    const layout = layoutManager.calculateLayout(marketsPage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'left',
      showBreadcrumbs: false,
      showPageIndicator: false
    });

    // Verify markets icon
    expect(layout.header[0]).toContain('📈');
    // Title may be truncated due to color codes and icon
    expect(layout.header[0]).toMatch(/STOCK M/);

    // Verify cache status
    expect(layout.header[1]).toContain('CACHED');
  });

  it('Example 5: AI page with progress indicator', () => {
    const aiPage: TeletextPage = {
      id: '501',
      title: 'AI Assistant',
      rows: [
        'What would you like to know?',
        '',
        '1. Ask a question',
        '2. Get a random fact',
        '3. Tell a story',
        '4. Play a game',
        ...Array(14).fill('')
      ],
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' }
      ],
      meta: {
        source: 'AIAdapter'
      }
    };

    const layout = layoutManager.calculateLayout(aiPage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'left',
      showBreadcrumbs: false,
      showPageIndicator: false
    });

    // Verify AI icon
    expect(layout.header[0]).toContain('🤖');
    expect(layout.header[0]).toContain('AI ASSISTANT');
  });

  it('Example 6: Centered content layout', () => {
    const centeredPage: TeletextPage = {
      id: '100',
      title: 'Main Index',
      rows: [
        'MODERN TELETEXT',
        '',
        'Welcome to the information service',
        '',
        '200 - News Headlines',
        '300 - Sports Results',
        '400 - Market Data',
        '500 - AI Assistant',
        ...Array(12).fill('')
      ],
      links: [],
      meta: {}
    };

    const layout = layoutManager.calculateLayout(centeredPage, {
      fullScreen: true,
      headerRows: 2,
      footerRows: 2,
      contentAlignment: 'center',
      showBreadcrumbs: false,
      showPageIndicator: false
    });

    // Verify content is centered
    const firstContentLine = layout.content[0];
    const textStart = firstContentLine.indexOf('MODERN TELETEXT');
    const textEnd = textStart + 'MODERN TELETEXT'.length;
    const leftPadding = textStart;
    const rightPadding = 40 - textEnd;

    // Should be roughly centered (within 1 character due to rounding)
    expect(Math.abs(leftPadding - rightPadding)).toBeLessThanOrEqual(1);
  });

  it('Example 7: Custom navigation hints', () => {
    const customPage: TeletextPage = {
      id: '601',
      title: 'Quiz Game',
      rows: [
        'Question 1 of 10',
        '',
        'What is the capital of France?',
        '',
        '1. London',
        '2. Paris',
        '3. Berlin',
        '4. Madrid',
        ...Array(12).fill('')
      ],
      links: [],
      meta: {}
    };

    const header = layoutManager.createHeader('Quiz Game', {
      pageNumber: '601',
      title: 'Quiz Game',
      contentType: 'GAMES'
    });

    const footer = layoutManager.createFooter({
      backToIndex: true,
      customHints: ['1-4=ANSWER', 'ESC=QUIT']
    });

    expect(header[0]).toContain('🎮');
    expect(footer[1]).toContain('1-4=ANSWER');
    expect(footer[1]).toContain('ESC=QUIT');
  });
});
