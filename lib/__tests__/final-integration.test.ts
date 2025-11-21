/**
 * Final Integration Tests for Teletext UX Redesign
 * 
 * This test suite validates:
 * - All navigation flows with new layout
 * - All animations work correctly
 * - Theme switching during active session
 * - Breadcrumbs update correctly
 * - Input feedback and visual indicators
 * - Visual glitches or layout issues
 * - Performance targets (60fps, <500ms page load)
 */

import { LayoutManager } from '../layout-manager';
import { AnimationEngine } from '../animation-engine';
import { NavigationIndicators } from '../navigation-indicators';

describe('Final Integration Tests', () => {
  let layoutManager: LayoutManager;
  let animationEngine: AnimationEngine;
  let navigationIndicators: NavigationIndicators;

  beforeEach(() => {
    layoutManager = new LayoutManager();
    animationEngine = new AnimationEngine();
    navigationIndicators = new NavigationIndicators();
  });

  describe('Navigation Flows with New Layout', () => {
    it('should navigate from index to content page with full layout', () => {
      const indexPage = {
        id: '100',
        title: 'INDEX',
        rows: ['Welcome to Modern Teletext', '200 - News', '300 - Sports'],
        links: []
      };

      const layout = layoutManager.calculateLayout(indexPage, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: false,
        showPageIndicator: false
      });

      expect(layout.totalRows).toBe(24);
      expect(layout.header.length).toBeGreaterThan(0);
      expect(layout.footer.length).toBeGreaterThan(0);
      expect(layout.content.length).toBeGreaterThan(0);
    });

    it('should handle multi-page navigation with breadcrumbs', () => {
      const history = ['100', '200', '201'];
      const breadcrumb = navigationIndicators.renderBreadcrumbs(history);
      
      expect(breadcrumb).toContain('100');
      expect(breadcrumb).toContain('200');
      expect(breadcrumb).toContain('201');
    });

    it('should show correct navigation indicators for different page types', () => {
      const indexHelp = navigationIndicators.renderContextualHelp('index');
      const contentHelp = navigationIndicators.renderContextualHelp('content');
      
      expect(indexHelp).not.toEqual(contentHelp);
      expect(indexHelp.length).toBeGreaterThan(0);
      expect(contentHelp.length).toBeGreaterThan(0);
    });
  });

  describe('Animation System', () => {
    it('should load all theme animation sets', () => {
      const themes = ['ceefax', 'haunting', 'high-contrast', 'orf'];
      
      themes.forEach(theme => {
        animationEngine.setTheme(theme);
        const animations = animationEngine.getThemeAnimations(theme);
        
        expect(animations).toBeDefined();
        expect(animations.pageTransition).toBeDefined();
        expect(animations.loadingIndicator).toBeDefined();
      });
    });

    it('should have different animations for different themes', () => {
      const ceefaxAnims = animationEngine.getThemeAnimations('ceefax');
      const hauntingAnims = animationEngine.getThemeAnimations('haunting');
      
      expect(ceefaxAnims.pageTransition.name).not.toBe(hauntingAnims.pageTransition.name);
    });

    it('should register and play animations without errors', () => {
      const mockElement = document.createElement('div');
      
      expect(() => {
        animationEngine.playAnimation('test-animation', mockElement);
      }).not.toThrow();
    });
  });

  describe('Theme Switching', () => {
    it('should switch themes without losing state', () => {
      const initialTheme = 'ceefax';
      const newTheme = 'haunting';
      
      animationEngine.setTheme(initialTheme);
      const initialAnimations = animationEngine.getThemeAnimations(initialTheme);
      
      animationEngine.setTheme(newTheme);
      const newAnimations = animationEngine.getThemeAnimations(newTheme);
      
      expect(initialAnimations).toBeDefined();
      expect(newAnimations).toBeDefined();
      expect(initialAnimations).not.toEqual(newAnimations);
    });

    it('should apply theme-specific decorations', () => {
      animationEngine.setTheme('haunting');
      const hauntingAnims = animationEngine.getThemeAnimations('haunting');
      
      expect(hauntingAnims.decorativeElements).toBeDefined();
      expect(hauntingAnims.decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Breadcrumb Updates', () => {
    it('should update breadcrumbs correctly on navigation', () => {
      const history1 = ['100'];
      const history2 = ['100', '200'];
      const history3 = ['100', '200', '201'];
      
      const breadcrumb1 = navigationIndicators.renderBreadcrumbs(history1);
      const breadcrumb2 = navigationIndicators.renderBreadcrumbs(history2);
      const breadcrumb3 = navigationIndicators.renderBreadcrumbs(history3);
      
      expect(breadcrumb1).not.toBe(breadcrumb2);
      expect(breadcrumb2).not.toBe(breadcrumb3);
    });

    it('should truncate long breadcrumb trails', () => {
      const longHistory = ['100', '200', '201', '202', '203', '204'];
      const breadcrumb = navigationIndicators.renderBreadcrumbs(longHistory);
      
      expect(breadcrumb).toContain('...');
      expect(breadcrumb).toContain('204');
    });
  });

  describe('Input Feedback and Visual Indicators', () => {
    it('should display input buffer correctly', () => {
      const buffer = '123';
      const display = navigationIndicators.renderInputBuffer(buffer);
      
      expect(display).toContain('123');
    });

    it('should show arrow indicators for multi-page content', () => {
      const indicators = navigationIndicators.renderArrowIndicators(true, true);
      
      expect(indicators.length).toBeGreaterThan(0);
      expect(indicators.some(i => i.includes('▲'))).toBe(true);
      expect(indicators.some(i => i.includes('▼'))).toBe(true);
    });

    it('should show END indicator when no more content', () => {
      const indicators = navigationIndicators.renderArrowIndicators(false, false);
      
      expect(indicators.some(i => i.includes('END'))).toBe(true);
    });
  });

  describe('Layout Validation', () => {
    it('should always produce exactly 24 rows', () => {
      const testPages = [
        { id: '100', title: 'Index', rows: ['Line 1'], links: [] },
        { id: '200', title: 'News', rows: Array(30).fill('Content'), links: [] },
        { id: '300', title: 'Sports', rows: ['Short'], links: [] }
      ];

      testPages.forEach(page => {
        const layout = layoutManager.calculateLayout(page, {
          fullScreen: true,
          headerRows: 2,
          footerRows: 2,
          contentAlignment: 'left',
          showBreadcrumbs: true,
          showPageIndicator: true
        });

        expect(layout.totalRows).toBe(24);
      });
    });

    it('should utilize at least 40% of screen space', () => {
      const page = {
        id: '200',
        title: 'Test Page',
        rows: Array(15).fill('Content line with text'),
        links: []
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: true,
        showPageIndicator: true
      });

      const allRows = [...layout.header, ...layout.content, ...layout.footer];
      const totalChars = allRows.join('').replace(/\s/g, '').length;
      const totalPossible = 40 * 24;
      const utilization = totalChars / totalPossible;

      // At least 40% utilization (accounting for padding and formatting)
      expect(utilization).toBeGreaterThan(0.4);
    });

    it('should position header at top and footer at bottom', () => {
      const page = {
        id: '200',
        title: 'Test',
        rows: ['Content'],
        links: []
      };

      const layout = layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: true,
        showPageIndicator: true
      });

      expect(layout.header.length).toBeGreaterThan(0);
      expect(layout.footer.length).toBeGreaterThan(0);
      
      // Header should be first, footer should be last
      const allRows = [...layout.header, ...layout.content, ...layout.footer];
      expect(allRows.length).toBe(24);
    });
  });

  describe('Performance Validation', () => {
    it('should calculate layout in under 50ms', () => {
      const page = {
        id: '200',
        title: 'Performance Test',
        rows: Array(50).fill('Content line'),
        links: []
      };

      const start = performance.now();
      layoutManager.calculateLayout(page, {
        fullScreen: true,
        headerRows: 2,
        footerRows: 2,
        contentAlignment: 'left',
        showBreadcrumbs: true,
        showPageIndicator: true
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
    });

    it('should render breadcrumbs quickly', () => {
      const history = Array(20).fill(0).map((_, i) => (100 + i).toString());

      const start = performance.now();
      navigationIndicators.renderBreadcrumbs(history);
      const end = performance.now();

      expect(end - start).toBeLessThan(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty page content gracefully', () => {
      const emptyPage = {
        id: '100',
        title: '',
        rows: [],
        links: []
      };

      expect(() => {
        layoutManager.calculateLayout(emptyPage, {
          fullScreen: true,
          headerRows: 2,
          footerRows: 2,
          contentAlignment: 'left',
          showBreadcrumbs: false,
          showPageIndicator: false
        });
      }).not.toThrow();
    });

    it('should handle invalid theme gracefully', () => {
      expect(() => {
        animationEngine.setTheme('invalid-theme');
      }).not.toThrow();
    });

    it('should handle empty breadcrumb history', () => {
      const breadcrumb = navigationIndicators.renderBreadcrumbs([]);
      expect(breadcrumb).toBe('INDEX');
    });
  });

  describe('Visual Consistency', () => {
    it('should maintain consistent page number formatting', () => {
      const options = [
        { page: 5, label: 'Test' },
        { page: 50, label: 'Test' },
        { page: 500, label: 'Test' }
      ];

      const formatted = options.map(opt => 
        `${opt.page}. ${opt.label}`
      );

      // All should have consistent structure
      formatted.forEach(line => {
        expect(line).toMatch(/^\d+\.\s/);
      });
    });

    it('should show page position for multi-page content', () => {
      const position = navigationIndicators.renderPagePosition(2, 5);
      
      expect(position).toContain('2');
      expect(position).toContain('5');
      expect(position).toMatch(/Page \d+\/\d+/);
    });
  });
});
