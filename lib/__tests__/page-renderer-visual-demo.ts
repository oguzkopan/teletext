/**
 * Visual Demo for Page Renderer
 * 
 * This file demonstrates the visual output of the page renderer
 * for different page types.
 */

import { TeletextPage } from '@/types/teletext';
import { pageRenderer } from '../page-renderer';

// Demo: Index page with 2 columns
const indexPage: TeletextPage = {
  id: '100',
  title: 'MAIN INDEX',
  rows: [
    '',
    '',
    '200 NEWS',
    '300 SPORT',
    '400 MARKETS',
    '450 WEATHER',
    '500 AI ORACLE',
    '600 GAMES',
    '700 SETTINGS',
    ...Array(15).fill('')
  ],
  links: [
    { label: 'NEWS', targetPage: '200', color: 'red' },
    { label: 'SPORT', targetPage: '300', color: 'green' }
  ]
};

// Demo: News page with 1 column
const newsPage: TeletextPage = {
  id: '201',
  title: 'BREAKING NEWS',
  rows: [
    '',
    '',
    'HEADLINE: Major Technology Breakthrough',
    '',
    'Scientists have announced a significant',
    'breakthrough in quantum computing that',
    'could revolutionize the industry.',
    '',
    'The new technology promises to solve',
    'complex problems in seconds that would',
    'take traditional computers years.',
    ...Array(13).fill('')
  ],
  links: [],
  meta: {
    source: 'NewsAdapter',
    lastUpdated: new Date().toISOString()
  }
};

// Demo: AI page with single-digit input
const aiPage: TeletextPage = {
  id: '500',
  title: 'AI ORACLE',
  rows: [
    '',
    '',
    'Choose a topic:',
    '',
    '1. Technology',
    '2. Science',
    '3. History',
    '4. Philosophy',
    '5. Art',
    ...Array(15).fill('')
  ],
  links: [
    { label: '1', targetPage: '501' },
    { label: '2', targetPage: '502' },
    { label: '3', targetPage: '503' },
    { label: '4', targetPage: '504' },
    { label: '5', targetPage: '505' }
  ],
  meta: {
    inputMode: 'single',
    inputOptions: ['1', '2', '3', '4', '5']
  }
};

// Render and display
console.log('\n=== INDEX PAGE (2 COLUMNS) ===\n');
const renderedIndex = pageRenderer.render(indexPage);
renderedIndex.rows.forEach((row, i) => {
  console.log(`${String(i + 1).padStart(2, '0')}: |${row}|`);
});

console.log('\n=== NEWS PAGE (1 COLUMN) ===\n');
const renderedNews = pageRenderer.render(newsPage);
renderedNews.rows.forEach((row, i) => {
  console.log(`${String(i + 1).padStart(2, '0')}: |${row}|`);
});

console.log('\n=== AI PAGE (1 COLUMN, SINGLE-DIGIT INPUT) ===\n');
const renderedAI = pageRenderer.render(aiPage);
renderedAI.rows.forEach((row, i) => {
  console.log(`${String(i + 1).padStart(2, '0')}: |${row}|`);
});

// Verify dimensions
console.log('\n=== DIMENSION VERIFICATION ===\n');
console.log(`Index page: ${renderedIndex.rows.length} rows`);
console.log(`News page: ${renderedNews.rows.length} rows`);
console.log(`AI page: ${renderedAI.rows.length} rows`);

console.log('\nAll rows 40 chars wide:');
console.log(`Index: ${renderedIndex.rows.every(r => r.length === 40)}`);
console.log(`News: ${renderedNews.rows.every(r => r.length === 40)}`);
console.log(`AI: ${renderedAI.rows.every(r => r.length === 40)}`);

console.log('\nMetadata flags:');
console.log(`Index renderedWithLayoutEngine: ${renderedIndex.meta?.renderedWithLayoutEngine}`);
console.log(`News renderedWithLayoutEngine: ${renderedNews.meta?.renderedWithLayoutEngine}`);
console.log(`AI renderedWithLayoutEngine: ${renderedAI.meta?.renderedWithLayoutEngine}`);
