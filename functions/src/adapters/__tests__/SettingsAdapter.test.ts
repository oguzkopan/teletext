// Tests for SettingsAdapter

import { SettingsAdapter } from '../SettingsAdapter';

describe('SettingsAdapter', () => {
  let adapter: SettingsAdapter;

  beforeEach(() => {
    adapter = new SettingsAdapter();
  });

  describe('getPage', () => {
    it('should return theme selection page for page 700', async () => {
      const page = await adapter.getPage('700');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('700');
      expect(page.title).toBe('Theme Selection');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
      expect(page.meta?.source).toBe('SettingsAdapter');
    });

    it('should include all four theme options on page 700', async () => {
      const page = await adapter.getPage('700');
      const content = page.rows.join('\n');
      
      expect(content).toContain('CEEFAX');
      expect(content).toContain('ORF');
      expect(content).toContain('HIGH CONTRAST');
      expect(content).toContain('HAUNTING MODE');
    });

    it('should return CRT effects control page for page 701', async () => {
      const page = await adapter.getPage('701');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('701');
      expect(page.title).toBe('CRT Effects Control');
      expect(page.rows).toHaveLength(24);
      expect(page.rows.every(row => row.length === 40)).toBe(true);
    });

    it('should return Ceefax theme preview for page 702', async () => {
      const page = await adapter.getPage('702');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('702');
      expect(page.title).toContain('Ceefax');
      expect(page.rows).toHaveLength(24);
    });

    it('should return ORF theme preview for page 703', async () => {
      const page = await adapter.getPage('703');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('703');
      expect(page.title).toContain('ORF');
    });

    it('should return High Contrast theme preview for page 704', async () => {
      const page = await adapter.getPage('704');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('704');
      expect(page.title).toContain('High Contrast');
    });

    it('should return Haunting Mode theme preview for page 705', async () => {
      const page = await adapter.getPage('705');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('705');
      expect(page.title).toContain('Haunting');
    });

    it('should return keyboard shortcuts config page for page 710', async () => {
      const page = await adapter.getPage('710');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('710');
      expect(page.title).toBe('Keyboard Shortcuts Config');
      expect(page.rows).toHaveLength(24);
    });

    it('should return keyboard shortcuts reference page for page 720', async () => {
      const page = await adapter.getPage('720');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('720');
      expect(page.title).toBe('Keyboard Shortcuts');
      expect(page.rows).toHaveLength(24);
    });

    it('should display default favorite pages on page 710', async () => {
      const page = await adapter.getPage('710');
      const content = page.rows.join('\n');
      
      expect(content).toContain('F1  → Page 100');
      expect(content).toContain('F2  → Page 200');
      expect(content).toContain('F3  → Page 300');
      expect(content).toContain('F4  → Page 400');
      expect(content).toContain('F5  → Page 500');
      expect(content).toContain('F6  → (Not set)');
    });

    it('should accept custom favorite pages via params', async () => {
      const customFavorites = ['100', '201', '301', '401', '501', '600', '700', '', '', ''];
      const page = await adapter.getPage('710', { favoritePages: customFavorites });
      const content = page.rows.join('\n');
      
      expect(content).toContain('F1  → Page 100');
      expect(content).toContain('F2  → Page 201');
      expect(content).toContain('F3  → Page 301');
      expect(content).toContain('F6  → Page 600');
      expect(content).toContain('F7  → Page 700');
      expect(content).toContain('F8  → (Not set)');
    });

    it('should include favoritePages in page meta', async () => {
      const page = await adapter.getPage('710');
      
      expect(page.meta?.favoritePages).toBeDefined();
      expect(Array.isArray(page.meta?.favoritePages)).toBe(true);
      expect(page.meta?.favoritePages?.length).toBe(10);
    });

    it('should document all keyboard shortcuts on page 720', async () => {
      const page = await adapter.getPage('720');
      const content = page.rows.join('\n');
      
      // Navigation shortcuts
      expect(content).toContain('0-9');
      expect(content).toContain('Enter');
      expect(content).toContain('Backspace');
      expect(content).toContain('↑/↓');
      expect(content).toContain('←');
      
      // Colored buttons
      expect(content).toContain('R');
      expect(content).toContain('G');
      expect(content).toContain('Y');
      expect(content).toContain('B');
      
      // Favorites
      expect(content).toContain('F1-F10');
    });



    it('should return placeholder for unimplemented pages in 700-799 range', async () => {
      const page = await adapter.getPage('750');
      
      expect(page).toBeDefined();
      expect(page.id).toBe('750');
      expect(page.rows.join('\n')).toContain('COMING SOON');
    });

    it('should return error page for pages outside 700-799 range', async () => {
      const page = await adapter.getPage('600');
      
      expect(page).toBeDefined();
      expect(page.rows.join('\n')).toContain('PAGE NOT FOUND');
    });
  });

  describe('theme configurations', () => {
    it('should have Ceefax theme with yellow on blue', () => {
      const theme = adapter.getTheme('ceefax');
      
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('Ceefax');
      expect(theme?.colors.background).toBe('#0000AA');
      expect(theme?.colors.text).toBe('#FFFF00');
      expect(theme?.effects.scanlines).toBe(true);
    });

    it('should have ORF theme with green on black', () => {
      const theme = adapter.getTheme('orf');
      
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('ORF');
      expect(theme?.colors.background).toBe('#000000');
      expect(theme?.colors.text).toBe('#00FF00');
    });

    it('should have High Contrast theme with white on black', () => {
      const theme = adapter.getTheme('highcontrast');
      
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('High Contrast');
      expect(theme?.colors.background).toBe('#000000');
      expect(theme?.colors.text).toBe('#FFFFFF');
      expect(theme?.effects.scanlines).toBe(false);
    });

    it('should have Haunting Mode theme with glitch effects', () => {
      const theme = adapter.getTheme('haunting');
      
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('Haunting Mode');
      expect(theme?.colors.background).toBe('#000000');
      expect(theme?.colors.text).toBe('#00FF00');
      expect(theme?.effects.glitch).toBe(true);
    });

    it('should return all four themes', () => {
      const themes = adapter.getAllThemes();
      
      expect(Object.keys(themes)).toHaveLength(4);
      expect(themes).toHaveProperty('ceefax');
      expect(themes).toHaveProperty('orf');
      expect(themes).toHaveProperty('highcontrast');
      expect(themes).toHaveProperty('haunting');
    });
  });

  describe('CRT effects control', () => {
    it('should display default effect values on page 701', async () => {
      const page = await adapter.getPage('701');
      const content = page.rows.join('\n');
      
      expect(content).toContain('SCANLINE INTENSITY');
      expect(content).toContain('SCREEN CURVATURE');
      expect(content).toContain('NOISE LEVEL');
      expect(content).toContain('50%'); // Default scanlines intensity
      expect(content).toContain('5px'); // Default curvature
      expect(content).toContain('10%'); // Default noise level
    });

    it('should accept custom effect values via params', async () => {
      const customEffects = {
        scanlinesIntensity: 75,
        curvature: 8,
        noiseLevel: 30
      };
      
      const page = await adapter.getPage('701', { effects: customEffects });
      const content = page.rows.join('\n');
      
      expect(content).toContain('75%');
      expect(content).toContain('8px');
      expect(content).toContain('30%');
    });

    it('should clamp scanlines intensity to 0-100 range', async () => {
      const page1 = await adapter.getPage('701', { effects: { scanlinesIntensity: -10 } });
      expect(page1.meta?.effectsData?.scanlinesIntensity).toBe(0);
      
      const page2 = await adapter.getPage('701', { effects: { scanlinesIntensity: 150 } });
      expect(page2.meta?.effectsData?.scanlinesIntensity).toBe(100);
    });

    it('should clamp curvature to 0-10 range', async () => {
      const page1 = await adapter.getPage('701', { effects: { curvature: -5 } });
      expect(page1.meta?.effectsData?.curvature).toBe(0);
      
      const page2 = await adapter.getPage('701', { effects: { curvature: 20 } });
      expect(page2.meta?.effectsData?.curvature).toBe(10);
    });

    it('should clamp noise level to 0-100 range', async () => {
      const page1 = await adapter.getPage('701', { effects: { noiseLevel: -20 } });
      expect(page1.meta?.effectsData?.noiseLevel).toBe(0);
      
      const page2 = await adapter.getPage('701', { effects: { noiseLevel: 200 } });
      expect(page2.meta?.effectsData?.noiseLevel).toBe(100);
    });

    it('should include effectsData in page meta', async () => {
      const page = await adapter.getPage('701');
      
      expect(page.meta?.effectsData).toBeDefined();
      expect(page.meta?.effectsData?.scanlinesIntensity).toBeDefined();
      expect(page.meta?.effectsData?.curvature).toBeDefined();
      expect(page.meta?.effectsData?.noiseLevel).toBeDefined();
    });

    it('should include reset button link', async () => {
      const page = await adapter.getPage('701');
      
      const resetLink = page.links.find(link => link.label === 'RESET');
      expect(resetLink).toBeDefined();
      expect(resetLink?.targetPage).toBe('701');
      expect(resetLink?.color).toBe('green');
    });

    it('should display visual slider bars', async () => {
      const page = await adapter.getPage('701', { 
        effects: { 
          scanlinesIntensity: 50,
          curvature: 5,
          noiseLevel: 25
        } 
      });
      const content = page.rows.join('\n');
      
      // Should contain filled (█) and empty (░) slider characters
      expect(content).toContain('█');
      expect(content).toContain('░');
    });
  });

  describe('page formatting', () => {
    it('should ensure all pages have exactly 24 rows', async () => {
      const pageIds = ['700', '701', '710', '720'];
      
      for (const pageId of pageIds) {
        const page = await adapter.getPage(pageId);
        expect(page.rows).toHaveLength(24);
      }
    });

    it('should ensure all rows are exactly 40 characters', async () => {
      const page = await adapter.getPage('700');
      
      page.rows.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should include navigation links on all pages', async () => {
      const page = await adapter.getPage('700');
      
      expect(page.links).toBeDefined();
      expect(page.links.length).toBeGreaterThan(0);
    });
  });

  describe('getCacheKey', () => {
    it('should return correct cache key format', () => {
      const key = adapter.getCacheKey('700');
      expect(key).toBe('settings_700');
    });
  });

  describe('getCacheDuration', () => {
    it('should return 1 hour cache duration', () => {
      const duration = adapter.getCacheDuration();
      expect(duration).toBe(3600);
    });
  });
});
