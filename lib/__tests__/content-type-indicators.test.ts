/**
 * Content Type Indicators Tests
 * 
 * Tests for content type detection, icons, and color coding in headers.
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { LayoutManager, CONTENT_TYPE_COLORS } from '../layout-manager';
import { NavigationIndicators } from '../navigation-indicators';

describe('Content Type Indicators', () => {
  let layoutManager: LayoutManager;
  let navigationIndicators: NavigationIndicators;

  beforeEach(() => {
    layoutManager = new LayoutManager();
    navigationIndicators = new NavigationIndicators();
  });

  describe('Content Type Detection', () => {
    it('should detect NEWS content type for pages 200-299', () => {
      const header = layoutManager.createHeader('Breaking News', {
        pageNumber: '201',
        title: 'Breaking News',
        contentType: 'NEWS'
      });

      expect(header[0]).toContain('📰');
      expect(header[0]).toContain('{red}');
    });

    it('should detect SPORT content type for pages 300-399', () => {
      const header = layoutManager.createHeader('Live Scores', {
        pageNumber: '301',
        title: 'Live Scores',
        contentType: 'SPORT'
      });

      expect(header[0]).toContain('⚽');
      expect(header[0]).toContain('{green}');
    });

    it('should detect MARKETS content type for pages 400-499', () => {
      const header = layoutManager.createHeader('Crypto Prices', {
        pageNumber: '401',
        title: 'Crypto Prices',
        contentType: 'MARKETS'
      });

      expect(header[0]).toContain('📈');
      expect(header[0]).toContain('{yellow}');
    });

    it('should detect AI content type for pages 500-599', () => {
      const header = layoutManager.createHeader('AI Oracle', {
        pageNumber: '500',
        title: 'AI Oracle',
        contentType: 'AI'
      });

      expect(header[0]).toContain('🤖');
      expect(header[0]).toContain('{cyan}');
    });

    it('should detect GAMES content type for pages 600-699', () => {
      const header = layoutManager.createHeader('Quiz Time', {
        pageNumber: '600',
        title: 'Quiz Time',
        contentType: 'GAMES'
      });

      expect(header[0]).toContain('🎮');
      expect(header[0]).toContain('{magenta}');
    });

    it('should detect WEATHER content type for pages 450-459', () => {
      const header = layoutManager.createHeader('Weather Forecast', {
        pageNumber: '450',
        title: 'Weather Forecast',
        contentType: 'WEATHER'
      });

      expect(header[0]).toContain('🌤️');
      expect(header[0]).toContain('{blue}');
    });

    it('should detect SETTINGS content type for pages 700-799', () => {
      const header = layoutManager.createHeader('Settings', {
        pageNumber: '701',
        title: 'Settings',
        contentType: 'SETTINGS'
      });

      expect(header[0]).toContain('⚙️');
      expect(header[0]).toContain('{white}');
    });

    it('should detect DEV content type for pages 800-899', () => {
      const header = layoutManager.createHeader('Debug Info', {
        pageNumber: '800',
        title: 'Debug Info',
        contentType: 'DEV'
      });

      expect(header[0]).toContain('🔧');
      expect(header[0]).toContain('{yellow}');
    });
  });

  describe('Content Type Color Coding', () => {
    it('should have consistent color scheme for each content type', () => {
      expect(CONTENT_TYPE_COLORS.NEWS).toBe('red');
      expect(CONTENT_TYPE_COLORS.SPORT).toBe('green');
      expect(CONTENT_TYPE_COLORS.MARKETS).toBe('yellow');
      expect(CONTENT_TYPE_COLORS.AI).toBe('cyan');
      expect(CONTENT_TYPE_COLORS.GAMES).toBe('magenta');
      expect(CONTENT_TYPE_COLORS.WEATHER).toBe('blue');
      expect(CONTENT_TYPE_COLORS.SETTINGS).toBe('white');
      expect(CONTENT_TYPE_COLORS.DEV).toBe('yellow');
    });

    it('should apply color codes in correct format', () => {
      const header = layoutManager.createHeader('Test Page', {
        pageNumber: '201',
        title: 'Test Page',
        contentType: 'NEWS'
      });

      // Color code should be in format {color}icon{white}
      expect(header[0]).toMatch(/\{red\}📰\{white\}/);
    });

    it('should reset to white after colored icon', () => {
      const header = layoutManager.createHeader('Test Page', {
        pageNumber: '301',
        title: 'Test Page',
        contentType: 'SPORT'
      });

      // Should have {white} after the icon to reset color
      expect(header[0]).toContain('{white}');
    });
  });

  describe('NavigationIndicators Content Type Support', () => {
    it('should include content type icon in header', () => {
      const header = navigationIndicators.createHeader('News Index', '200', {
        contentType: 'NEWS'
      });

      expect(header[0]).toContain('📰');
    });

    it('should include content type color in header', () => {
      const header = navigationIndicators.createHeader('Sports Index', '300', {
        contentType: 'SPORT'
      });

      expect(header[0]).toContain('{green}');
      expect(header[0]).toContain('⚽');
    });

    it('should work without content type', () => {
      const header = navigationIndicators.createHeader('Generic Page', '100', {});

      expect(header[0]).not.toContain('📰');
      expect(header[0]).not.toContain('{red}');
      expect(header[0]).toContain('GENERIC PAGE');
    });
  });

  describe('Header Format Validation', () => {
    it('should maintain 40-character width with content type indicator', () => {
      const header = layoutManager.createHeader('Test Page', {
        pageNumber: '201',
        title: 'Test Page',
        contentType: 'NEWS'
      });

      expect(header[0].length).toBe(40);
      expect(header[1].length).toBe(40);
    });

    it('should include page number in header', () => {
      const header = layoutManager.createHeader('Test Page', {
        pageNumber: '401',
        title: 'Test Page',
        contentType: 'MARKETS'
      });

      expect(header[0]).toContain('P401');
    });

    it('should truncate long titles with content type indicator', () => {
      const longTitle = 'This is a very long title that should be truncated';
      const header = layoutManager.createHeader(longTitle, {
        pageNumber: '201',
        title: longTitle,
        contentType: 'NEWS'
      });

      expect(header[0].length).toBe(40);
      expect(header[0]).toContain('📰');
    });
  });

  describe('Content Type Icons', () => {
    it('should use correct icon for each content type', () => {
      const testCases = [
        { type: 'NEWS', icon: '📰' },
        { type: 'SPORT', icon: '⚽' },
        { type: 'MARKETS', icon: '📈' },
        { type: 'AI', icon: '🤖' },
        { type: 'GAMES', icon: '🎮' },
        { type: 'WEATHER', icon: '🌤️' },
        { type: 'SETTINGS', icon: '⚙️' },
        { type: 'DEV', icon: '🔧' }
      ];

      testCases.forEach(({ type, icon }) => {
        const header = layoutManager.createHeader('Test', {
          pageNumber: '100',
          title: 'Test',
          contentType: type as any
        });

        expect(header[0]).toContain(icon);
      });
    });
  });

  describe('Integration with Page Metadata', () => {
    it('should work with timestamp and cache status', () => {
      const header = layoutManager.createHeader('News Page', {
        pageNumber: '201',
        title: 'News Page',
        contentType: 'NEWS',
        timestamp: new Date().toISOString(),
        cacheStatus: 'LIVE'
      });

      expect(header[0]).toContain('📰');
      expect(header[0]).toContain('{red}');
      expect(header[1]).toContain('LIVE');
    });

    it('should work with page position indicator', () => {
      const header = layoutManager.createHeader('Article', {
        pageNumber: '201-2',
        title: 'Article',
        contentType: 'NEWS',
        pagePosition: { current: 2, total: 5 }
      });

      expect(header[0]).toContain('📰');
      expect(header[1]).toContain('2/5');
    });
  });
});
