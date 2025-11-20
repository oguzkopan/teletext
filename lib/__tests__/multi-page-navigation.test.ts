/**
 * Multi-page Navigation Tests
 * 
 * Tests for the multi-page navigation feature with continuation metadata.
 * Requirements: 35.1, 35.2, 35.3, 35.4, 35.5
 */

import { createMultiPageContent, splitAIResponse } from '../teletext-utils';
import { TeletextPage } from '@/types/teletext';

describe('Multi-page Navigation', () => {
  describe('createMultiPageContent', () => {
    it('should create a single page when content fits', () => {
      const contentRows = [
        'Line 1',
        'Line 2',
        'Line 3'
      ];
      
      const pages = createMultiPageContent(
        '201',
        'Test Page',
        contentRows,
        3, // header rows
        2, // footer rows
        []
      );
      
      expect(pages).toHaveLength(1);
      expect(pages[0].id).toBe('201');
      expect(pages[0].meta?.continuation).toBeUndefined();
    });
    
    it('should create multiple pages with continuation metadata', () => {
      // Create content that exceeds one page (19 content rows per page)
      const contentRows = Array(40).fill('').map((_, i) => `Line ${i + 1}`);
      
      const pages = createMultiPageContent(
        '201',
        'Test Page',
        contentRows,
        3, // header rows
        2, // footer rows
        []
      );
      
      // Should create 3 pages (40 rows / 19 rows per page = 2.1, rounded up to 3)
      expect(pages.length).toBeGreaterThan(1);
      
      // First page should have continuation metadata
      expect(pages[0].meta?.continuation).toBeDefined();
      expect(pages[0].meta?.continuation?.currentPage).toBe('201');
      expect(pages[0].meta?.continuation?.nextPage).toBe('201-2');
      expect(pages[0].meta?.continuation?.previousPage).toBeUndefined();
      expect(pages[0].meta?.continuation?.currentIndex).toBe(0);
      expect(pages[0].meta?.continuation?.totalPages).toBe(pages.length);
      
      // Middle page should have both next and previous
      if (pages.length > 2) {
        expect(pages[1].meta?.continuation?.currentPage).toBe('201-2');
        expect(pages[1].meta?.continuation?.nextPage).toBe('201-3');
        expect(pages[1].meta?.continuation?.previousPage).toBe('201');
        expect(pages[1].meta?.continuation?.currentIndex).toBe(1);
      }
      
      // Last page should not have nextPage
      const lastPage = pages[pages.length - 1];
      expect(lastPage.meta?.continuation?.nextPage).toBeUndefined();
      expect(lastPage.meta?.continuation?.previousPage).toBeDefined();
      expect(lastPage.meta?.continuation?.currentIndex).toBe(pages.length - 1);
    });
    
    it('should format all pages with exactly 24 rows', () => {
      const contentRows = Array(40).fill('').map((_, i) => `Line ${i + 1}`);
      
      const pages = createMultiPageContent(
        '201',
        'Test Page',
        contentRows,
        3,
        2,
        []
      );
      
      pages.forEach(page => {
        expect(page.rows).toHaveLength(24);
        page.rows.forEach(row => {
          expect(row.length).toBeLessThanOrEqual(40);
        });
      });
    });
    
    it('should preserve links across all pages', () => {
      const contentRows = Array(40).fill('').map((_, i) => `Line ${i + 1}`);
      const links = [
        { label: 'INDEX', targetPage: '100', color: 'red' as const },
        { label: 'BACK', targetPage: '200', color: 'green' as const }
      ];
      
      const pages = createMultiPageContent(
        '201',
        'Test Page',
        contentRows,
        3,
        2,
        links
      );
      
      pages.forEach(page => {
        expect(page.links).toEqual(links);
      });
    });
  });
  
  describe('splitAIResponse', () => {
    it('should split long AI responses into multiple pages', () => {
      const longResponse = 'This is a very long AI response. '.repeat(100);
      
      const pages = splitAIResponse(
        '513',
        'AI Response',
        longResponse,
        [{ label: 'INDEX', targetPage: '100', color: 'red' }]
      );
      
      expect(pages.length).toBeGreaterThan(1);
      
      // Check continuation metadata
      expect(pages[0].meta?.continuation).toBeDefined();
      expect(pages[0].meta?.aiGenerated).toBe(true);
      
      // All pages should have exactly 24 rows
      pages.forEach(page => {
        expect(page.rows).toHaveLength(24);
      });
    });
    
    it('should handle short AI responses without continuation', () => {
      const shortResponse = 'This is a short response.';
      
      const pages = splitAIResponse(
        '513',
        'AI Response',
        shortResponse,
        []
      );
      
      expect(pages).toHaveLength(1);
      expect(pages[0].meta?.continuation).toBeUndefined();
      expect(pages[0].meta?.aiGenerated).toBe(true);
    });
  });
  
  describe('Page Continuation Navigation', () => {
    it('should create proper navigation chain', () => {
      const contentRows = Array(60).fill('').map((_, i) => `Line ${i + 1}`);
      
      const pages = createMultiPageContent(
        '201',
        'Test Page',
        contentRows,
        3,
        2,
        []
      );
      
      // Verify navigation chain
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const continuation = page.meta?.continuation;
        
        expect(continuation).toBeDefined();
        expect(continuation?.currentIndex).toBe(i);
        
        // Check next page link
        if (i < pages.length - 1) {
          expect(continuation?.nextPage).toBeDefined();
          const nextPageId = continuation?.nextPage;
          const nextPage = pages[i + 1];
          expect(nextPage.id).toBe(nextPageId);
        } else {
          expect(continuation?.nextPage).toBeUndefined();
        }
        
        // Check previous page link
        if (i > 0) {
          expect(continuation?.previousPage).toBeDefined();
          const prevPageId = continuation?.previousPage;
          const prevPage = pages[i - 1];
          expect(prevPage.id).toBe(prevPageId);
        } else {
          expect(continuation?.previousPage).toBeUndefined();
        }
      }
    });
  });
});
