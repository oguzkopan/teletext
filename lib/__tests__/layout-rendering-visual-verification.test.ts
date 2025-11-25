/**
 * Visual Verification Test for Layout Rendering
 * Task 20: Test and fix layout rendering
 * 
 * This test outputs visual examples of layout rendering for manual inspection.
 * Run with: npm test -- lib/__tests__/layout-rendering-visual-verification.test.ts
 */

import {
  renderSingleColumn,
  renderMultiColumn,
  TELETEXT_WIDTH,
  TELETEXT_HEIGHT
} from '../layout-engine';

describe('Visual Verification: Layout Rendering', () => {
  
  function printPage(title: string, rows: string[]) {
    console.log('\n' + '='.repeat(42));
    console.log(`  ${title}`);
    console.log('='.repeat(42));
    rows.forEach((row, index) => {
      console.log(`${String(index).padStart(2, '0')}|${row}|`);
    });
    console.log('='.repeat(42));
  }
  
  it('Visual: Single-column layout with short content', () => {
    const result = renderSingleColumn({
      pageNumber: '100',
      title: 'Main Index',
      content: [
        'Welcome to Modern Teletext',
        '',
        '200 News',
        '300 Sports',
        '400 Markets',
        '500 AI Assistant',
        '600 Games',
        '700 Weather'
      ],
      hints: [
        { text: 'Enter page number' }
      ]
    });
    
    printPage('Single-Column Layout - Index Page', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Two-column layout with menu items', () => {
    const result = renderMultiColumn({
      pageNumber: '100',
      title: 'Main Index',
      content: [
        '200 News',
        '300 Sports',
        '400 Markets',
        '500 AI Assistant',
        '600 Games',
        '700 Weather',
        '800 Settings',
        '900 About'
      ],
      columns: 2,
      hints: [
        { text: 'Enter page number' }
      ]
    });
    
    printPage('Two-Column Layout - Index Page', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Three-column layout with many items', () => {
    const result = renderMultiColumn({
      pageNumber: '200',
      title: 'News Categories',
      content: [
        'World',
        'Politics',
        'Business',
        'Technology',
        'Science',
        'Health',
        'Sports',
        'Entertainment',
        'Culture',
        'Travel',
        'Food',
        'Fashion'
      ],
      columns: 3,
      timestamp: '14:30',
      hints: [
        { text: '100=INDEX' },
        { text: 'BACK=PREVIOUS' }
      ]
    });
    
    printPage('Three-Column Layout - News Categories', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Single-column with long wrapped text', () => {
    const result = renderSingleColumn({
      pageNumber: '201',
      title: 'Breaking News',
      content: [
        '1. Major event happens in city center',
        '',
        'This is a very long news article that contains multiple sentences and needs to be wrapped across several lines to fit within the 40-character width constraint of the teletext display system.',
        '',
        '2. Sports team wins championship',
        '',
        'Another long article about the championship victory that includes details about the game, the players, and the celebration that followed.'
      ],
      timestamp: '15:45',
      hints: [
        { text: '100=INDEX' },
        { text: 'BACK=200' }
      ]
    });
    
    printPage('Single-Column with Wrapped Text', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Sports scores with tabular data', () => {
    const result = renderSingleColumn({
      pageNumber: '301',
      title: 'Football Scores',
      content: [
        'PREMIER LEAGUE',
        '',
        'Team A          2 - 1  Team B',
        'Team C          0 - 0  Team D',
        'Team E          3 - 2  Team F',
        'Team G          1 - 1  Team H',
        '',
        'CHAMPIONSHIP',
        '',
        'Team I          2 - 0  Team J',
        'Team K          1 - 3  Team L'
      ],
      timestamp: '16:00',
      hints: [
        { text: '100=INDEX' },
        { text: '300=SPORTS' }
      ]
    });
    
    printPage('Sports Scores - Tabular Layout', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Market data with aligned numbers', () => {
    const result = renderSingleColumn({
      pageNumber: '401',
      title: 'Stock Prices',
      content: [
        'FTSE 100                    7,234.56',
        'DOW JONES                  34,567.89',
        'NASDAQ                     12,345.67',
        '',
        'COMPANY         PRICE    CHANGE   %',
        'Apple Inc       $145.23   +2.34  +1.6',
        'Microsoft       $289.45   -1.23  -0.4',
        'Google          $123.45   +5.67  +4.8',
        'Amazon          $134.56   +0.12  +0.1'
      ],
      timestamp: '16:30',
      hints: [
        { text: '100=INDEX' },
        { text: '400=MARKETS' }
      ]
    });
    
    printPage('Market Data - Aligned Numbers', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: AI page with question and response', () => {
    const result = renderSingleColumn({
      pageNumber: '501',
      title: 'AI Assistant',
      content: [
        'QUESTION:',
        'What is the weather like today?',
        '',
        'RESPONSE:',
        'Based on current data, today will be partly cloudy with temperatures around 18°C. There is a 30% chance of rain in the afternoon. Wind speeds will be moderate at 15-20 km/h.'
      ],
      timestamp: '17:00',
      hints: [
        { text: '500=AI MENU' },
        { text: 'BACK=PREVIOUS' }
      ]
    });
    
    printPage('AI Page - Question and Response', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Quiz page with numbered options', () => {
    const result = renderSingleColumn({
      pageNumber: '601',
      title: 'General Knowledge Quiz',
      content: [
        'Question 3 of 10',
        '',
        'What is the capital of France?',
        '',
        '1. London',
        '2. Paris',
        '3. Berlin',
        '4. Madrid',
        '',
        'Enter your answer (1-4)'
      ],
      hints: [
        { text: 'Enter number to select' }
      ]
    });
    
    printPage('Quiz Page - Multiple Choice', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
  
  it('Visual: Page with maximum content (20 lines)', () => {
    const content = Array(20).fill(0).map((_, i) => 
      `Line ${String(i + 1).padStart(2, '0')}: This is content`
    );
    
    const result = renderSingleColumn({
      pageNumber: '999',
      title: 'Full Content Test',
      content,
      timestamp: '23:59',
      hints: [
        { text: '100=INDEX' }
      ]
    });
    
    printPage('Maximum Content (20 lines)', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
    
    // Verify all 20 lines are present
    for (let i = 0; i < 20; i++) {
      expect(result[i + 2]).toContain(`Line ${String(i + 1).padStart(2, '0')}`);
    }
  });
  
  it('Visual: Empty page (minimal content)', () => {
    const result = renderSingleColumn({
      pageNumber: '404',
      title: 'Page Not Found',
      content: '',
      hints: [
        { text: '100=INDEX' },
        { text: 'BACK=PREVIOUS' }
      ]
    });
    
    printPage('Empty Page', result);
    
    expect(result).toHaveLength(TELETEXT_HEIGHT);
  });
});
