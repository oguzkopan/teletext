/**
 * Tests for Theme Selection Page (Page 700)
 * Requirements: 3.1, 3.2 - Interactive theme selection
 */

import { createThemeSelectionPage } from '../services-pages';

describe('Theme Selection Page (700)', () => {
  it('should create page 700 with correct metadata', () => {
    const page = createThemeSelectionPage();
    
    expect(page.id).toBe('700');
    expect(page.title).toBe('Theme Selection');
    expect(page.meta.themeSelectionPage).toBe(true);
  });

  it('should have inputMode set to single', () => {
    const page = createThemeSelectionPage();
    
    expect(page.meta.inputMode).toBe('single');
  });

  it('should have inputOptions for 1-4', () => {
    const page = createThemeSelectionPage();
    
    expect(page.meta.inputOptions).toEqual(['1', '2', '3', '4']);
  });

  it('should have links for all four theme options', () => {
    const page = createThemeSelectionPage();
    
    const themeLinks = page.links.filter(link => 
      ['1', '2', '3', '4'].includes(link.label)
    );
    
    expect(themeLinks).toHaveLength(4);
    expect(themeLinks.every(link => link.targetPage === '700')).toBe(true);
  });

  it('should display all theme options in content', () => {
    const page = createThemeSelectionPage();
    const content = page.rows.join('\n');
    
    expect(content).toContain('CEEFAX');
    expect(content).toContain('ORF');
    expect(content).toContain('HIGH CONTRAST');
    expect(content).toContain('HAUNTING MODE');
  });

  it('should have navigation links', () => {
    const page = createThemeSelectionPage();
    
    const navLinks = page.links.filter(link => 
      ['INDEX', 'SETTINGS', 'EFFECTS'].includes(link.label)
    );
    
    expect(navLinks.length).toBeGreaterThan(0);
  });
});
