/**
 * 404 Error Page Tests
 * Requirements: 5.3 - Beautiful 404 error page with decorative elements
 */

import { create404ErrorPage } from '../additional-pages';
import { get404Page } from '../page-registry';

describe('404 Error Page', () => {
  describe('create404ErrorPage', () => {
    it('should create a 404 error page with the invalid page number', () => {
      const page = create404ErrorPage('999');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('999');
      expect(page.title).toBe('Page Not Found');
    });

    it('should include ASCII art decoration', () => {
      const page = create404ErrorPage('123');
      
      // Check for ASCII art in the rows
      const hasAsciiArt = page.rows.some(row => 
        row.includes('██') || row.includes('╔═') || row.includes('║')
      );
      
      expect(hasAsciiArt).toBe(true);
    });

    it('should display the invalid page number in the content', () => {
      const pageNumber = '456';
      const page = create404ErrorPage(pageNumber);
      
      // Check that the page number appears in the content
      const hasPageNumber = page.rows.some(row => 
        row.includes(pageNumber)
      );
      
      expect(hasPageNumber).toBe(true);
    });

    it('should provide navigation options', () => {
      const page = create404ErrorPage('789');
      
      expect(page.links).toBeDefined();
      expect(page.links.length).toBeGreaterThan(0);
      
      // Should have at least an INDEX link
      const hasIndexLink = page.links.some(link => 
        link.targetPage === '100'
      );
      
      expect(hasIndexLink).toBe(true);
    });

    it('should include helpful suggestions', () => {
      const page = create404ErrorPage('999');
      
      // Check for helpful text
      const content = page.rows.join(' ');
      
      expect(content).toContain('doesn\'t exist');
      expect(content).toContain('popular pages');
    });

    it('should apply current theme styling', () => {
      const page = create404ErrorPage('123');
      
      // Check for color codes in the content
      const hasColorCodes = page.rows.some(row => 
        row.includes('{red}') || 
        row.includes('{yellow}') || 
        row.includes('{cyan}') ||
        row.includes('{white}')
      );
      
      expect(hasColorCodes).toBe(true);
    });

    it('should mark as error page in metadata', () => {
      const page = create404ErrorPage('999');
      
      expect(page.meta.errorPage).toBe(true);
    });

    it('should use full-screen layout', () => {
      const page = create404ErrorPage('123');
      
      expect(page.meta.fullScreenLayout).toBe(true);
      expect(page.meta.useLayoutManager).toBe(true);
    });
  });

  describe('get404Page', () => {
    it('should return a 404 page from the registry', () => {
      const page = get404Page('999');
      
      expect(page).toBeDefined();
      expect(page.title).toBe('Page Not Found');
    });

    it('should work with any page number', () => {
      const page1 = get404Page('001');
      const page2 = get404Page('1234');
      const page3 = get404Page('abc');
      
      expect(page1).toBeDefined();
      expect(page2).toBeDefined();
      expect(page3).toBeDefined();
    });
  });

  describe('Visual Design', () => {
    it('should have a visually appealing header', () => {
      const page = create404ErrorPage('999');
      
      // Check for decorative elements in the page
      const content = page.rows.join('\n');
      
      expect(content).toContain('╔═');
      expect(content).toContain('║');
      expect(content).toContain('╚═');
    });

    it('should include the 404 ASCII art', () => {
      const page = create404ErrorPage('999');
      
      // Check for 404 ASCII art
      const content = page.rows.join('\n');
      
      expect(content).toContain('██╗  ██╗');
    });

    it('should provide clear navigation hints', () => {
      const page = create404ErrorPage('999');
      
      // Check for navigation section
      const content = page.rows.join(' ');
      
      expect(content).toContain('WHERE TO GO');
      expect(content).toContain('Main Index');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty page number', () => {
      const page = create404ErrorPage('');
      
      expect(page).toBeDefined();
      expect(page.title).toBe('Page Not Found');
    });

    it('should handle very long page numbers', () => {
      const page = create404ErrorPage('123456789');
      
      expect(page).toBeDefined();
      expect(page.title).toBe('Page Not Found');
    });

    it('should handle special characters in page number', () => {
      const page = create404ErrorPage('!@#$%');
      
      expect(page).toBeDefined();
      expect(page.title).toBe('Page Not Found');
    });
  });
});
