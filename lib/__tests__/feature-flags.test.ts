/**
 * Feature Flags Tests
 * Tests for the feature flags system
 */

import {
  getFeatureFlags,
  isFeatureEnabled,
  setFeatureFlags,
  resetFeatureFlags,
  getFeatureFlagDescription,
  getAllFeatureFlags,
  createFeatureFlagsPage,
  withFeatureFlag,
  ifFeatureEnabled,
  getFeatureClass,
} from '../feature-flags';

describe('Feature Flags', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    resetFeatureFlags();
  });

  describe('getFeatureFlags', () => {
    it('should return all feature flags', () => {
      const flags = getFeatureFlags();
      
      expect(flags).toHaveProperty('ENABLE_FULL_SCREEN_LAYOUT');
      expect(flags).toHaveProperty('ENABLE_ANIMATIONS');
      expect(flags).toHaveProperty('ENABLE_KIROWEEN_THEME');
      expect(flags).toHaveProperty('ENABLE_BREADCRUMBS');
      expect(flags).toHaveProperty('ENABLE_DECORATIVE_ELEMENTS');
    });

    it('should return a copy of flags (not mutable)', () => {
      const flags1 = getFeatureFlags();
      const flags2 = getFeatureFlags();
      
      expect(flags1).not.toBe(flags2);
      expect(flags1).toEqual(flags2);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled features', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(true);
    });

    it('should return false for disabled features', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
    });

    it('should check all feature flags', () => {
      setFeatureFlags({
        ENABLE_FULL_SCREEN_LAYOUT: true,
        ENABLE_ANIMATIONS: false,
        ENABLE_KIROWEEN_THEME: true,
        ENABLE_BREADCRUMBS: false,
        ENABLE_DECORATIVE_ELEMENTS: true,
      });

      expect(isFeatureEnabled('ENABLE_FULL_SCREEN_LAYOUT')).toBe(true);
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
      expect(isFeatureEnabled('ENABLE_KIROWEEN_THEME')).toBe(true);
      expect(isFeatureEnabled('ENABLE_BREADCRUMBS')).toBe(false);
      expect(isFeatureEnabled('ENABLE_DECORATIVE_ELEMENTS')).toBe(true);
    });
  });

  describe('setFeatureFlags', () => {
    it('should override specific flags', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
    });

    it('should preserve other flags when overriding', () => {
      const originalFlags = getFeatureFlags();
      
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      const newFlags = getFeatureFlags();
      expect(newFlags.ENABLE_FULL_SCREEN_LAYOUT).toBe(originalFlags.ENABLE_FULL_SCREEN_LAYOUT);
      expect(newFlags.ENABLE_KIROWEEN_THEME).toBe(originalFlags.ENABLE_KIROWEEN_THEME);
    });

    it('should allow multiple overrides', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: false,
        ENABLE_BREADCRUMBS: false,
      });

      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
      expect(isFeatureEnabled('ENABLE_BREADCRUMBS')).toBe(false);
    });
  });

  describe('resetFeatureFlags', () => {
    it('should reset flags to defaults', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
      
      resetFeatureFlags();
      
      // After reset, should be back to default (true)
      const flags = getFeatureFlags();
      expect(typeof flags.ENABLE_ANIMATIONS).toBe('boolean');
    });
  });

  describe('getFeatureFlagDescription', () => {
    it('should return description for each flag', () => {
      const flags: Array<keyof ReturnType<typeof getFeatureFlags>> = [
        'ENABLE_FULL_SCREEN_LAYOUT',
        'ENABLE_ANIMATIONS',
        'ENABLE_KIROWEEN_THEME',
        'ENABLE_BREADCRUMBS',
        'ENABLE_DECORATIVE_ELEMENTS',
      ];

      flags.forEach(flag => {
        const description = getFeatureFlagDescription(flag);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(10);
      });
    });

    it('should return meaningful descriptions', () => {
      const desc = getFeatureFlagDescription('ENABLE_ANIMATIONS');
      expect(desc.toLowerCase()).toContain('animation');
    });
  });

  describe('getAllFeatureFlags', () => {
    it('should return all flags with metadata', () => {
      const allFlags = getAllFeatureFlags();
      
      expect(allFlags.length).toBe(5);
      
      allFlags.forEach(item => {
        expect(item).toHaveProperty('flag');
        expect(item).toHaveProperty('enabled');
        expect(item).toHaveProperty('description');
        expect(typeof item.enabled).toBe('boolean');
        expect(typeof item.description).toBe('string');
      });
    });

    it('should reflect current flag states', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      const allFlags = getAllFeatureFlags();
      const animationFlag = allFlags.find(f => f.flag === 'ENABLE_ANIMATIONS');
      
      expect(animationFlag?.enabled).toBe(false);
    });
  });

  describe('createFeatureFlagsPage', () => {
    it('should create exactly 24 rows', () => {
      const page = createFeatureFlagsPage();
      expect(page.length).toBe(24);
    });

    it('should have exactly 40 characters per row', () => {
      const page = createFeatureFlagsPage();
      
      page.forEach((row, index) => {
        expect(row.length).toBe(40);
      });
    });

    it('should include page header', () => {
      const page = createFeatureFlagsPage();
      expect(page[0]).toContain('FEATURE FLAGS');
      expect(page[0]).toContain('799');
    });

    it('should show feature status', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const page = createFeatureFlagsPage();
      const content = page.join('\n');
      
      expect(content).toContain('ANIMATIONS');
    });

    it('should include navigation hints', () => {
      const page = createFeatureFlagsPage();
      const lastRows = page.slice(-3).join('\n');
      
      expect(lastRows).toContain('100');
    });
  });

  describe('withFeatureFlag', () => {
    it('should return enabled value when feature is enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const result = withFeatureFlag('ENABLE_ANIMATIONS', 'animated', 'static');
      expect(result).toBe('animated');
    });

    it('should return disabled value when feature is disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      const result = withFeatureFlag('ENABLE_ANIMATIONS', 'animated', 'static');
      expect(result).toBe('static');
    });

    it('should work with different types', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const numberResult = withFeatureFlag('ENABLE_ANIMATIONS', 100, 0);
      expect(numberResult).toBe(100);
      
      const objectResult = withFeatureFlag('ENABLE_ANIMATIONS', { a: 1 }, { b: 2 });
      expect(objectResult).toEqual({ a: 1 });
    });
  });

  describe('ifFeatureEnabled', () => {
    it('should execute callback when feature is enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      let executed = false;
      ifFeatureEnabled('ENABLE_ANIMATIONS', () => {
        executed = true;
      });
      
      expect(executed).toBe(true);
    });

    it('should not execute callback when feature is disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      let executed = false;
      ifFeatureEnabled('ENABLE_ANIMATIONS', () => {
        executed = true;
      });
      
      expect(executed).toBe(false);
    });
  });

  describe('getFeatureClass', () => {
    it('should return base class with enabled class when feature is enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const className = getFeatureClass('base', 'ENABLE_ANIMATIONS', 'animated');
      expect(className).toBe('base animated');
    });

    it('should return only base class when feature is disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      const className = getFeatureClass('base', 'ENABLE_ANIMATIONS', 'animated');
      expect(className).toBe('base');
    });

    it('should work with multiple base classes', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const className = getFeatureClass('base primary', 'ENABLE_ANIMATIONS', 'animated');
      expect(className).toBe('base primary animated');
    });
  });

  describe('Feature flag integration', () => {
    it('should allow toggling features on and off', () => {
      // Start with animations enabled
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(true);
      
      // Disable animations
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
      
      // Re-enable animations
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(true);
    });

    it('should support independent flag control', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: true,
        ENABLE_BREADCRUMBS: false,
      });

      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(true);
      expect(isFeatureEnabled('ENABLE_BREADCRUMBS')).toBe(false);
      
      // Change one without affecting the other
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      expect(isFeatureEnabled('ENABLE_ANIMATIONS')).toBe(false);
      expect(isFeatureEnabled('ENABLE_BREADCRUMBS')).toBe(false);
    });
  });
});
