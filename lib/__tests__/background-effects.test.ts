/**
 * Background Effects Tests
 * 
 * Tests for theme-specific background effects with configurable intensity
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

import {
  getBackgroundEffects,
  resetBackgroundEffects,
  initializeBackgroundEffects,
  updateEffectIntensity,
  toggleEffect,
  getCurrentEffects,
  CEEFAX_EFFECTS,
  HAUNTING_EFFECTS,
  ORF_EFFECTS,
  HIGH_CONTRAST_EFFECTS,
  BackgroundEffectType,
  EffectIntensity
} from '../background-effects';

describe('Background Effects', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Reset singleton before each test
    resetBackgroundEffects();

    // Create mock element
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    resetBackgroundEffects();
  });

  describe('Theme-Specific Effects', () => {
    it('should have scanlines for Ceefax theme', () => {
      expect(CEEFAX_EFFECTS).toHaveLength(1);
      expect(CEEFAX_EFFECTS[0].type).toBe('scanlines');
      expect(CEEFAX_EFFECTS[0].cssClass).toBe('scanlines-overlay');
    });

    it('should have fog, flicker, and chromatic for Haunting theme', () => {
      expect(HAUNTING_EFFECTS).toHaveLength(3);
      
      const types = HAUNTING_EFFECTS.map(e => e.type);
      expect(types).toContain('fog');
      expect(types).toContain('flicker');
      expect(types).toContain('chromatic');
    });

    it('should have scanlines for ORF theme', () => {
      expect(ORF_EFFECTS).toHaveLength(1);
      expect(ORF_EFFECTS[0].type).toBe('scanlines');
      expect(ORF_EFFECTS[0].intensity).toBe('low');
    });

    it('should have no effects for High Contrast theme', () => {
      expect(HIGH_CONTRAST_EFFECTS).toHaveLength(0);
    });
  });

  describe('Initialization', () => {
    it('should initialize effects for Ceefax theme', () => {
      initializeBackgroundEffects('ceefax', mockElement);
      
      expect(mockElement.classList.contains('scanlines-overlay')).toBe(true);
      expect(mockElement.classList.contains('intensity-medium')).toBe(true);
    });

    it('should initialize effects for Haunting theme', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(true);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(true);
    });

    it('should initialize effects for ORF theme', () => {
      initializeBackgroundEffects('orf', mockElement);
      
      expect(mockElement.classList.contains('scanlines-overlay')).toBe(true);
      expect(mockElement.classList.contains('intensity-low')).toBe(true);
    });

    it('should not add effects for High Contrast theme', () => {
      initializeBackgroundEffects('highcontrast', mockElement);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(false);
      expect(mockElement.classList.contains('screen-flicker')).toBe(false);
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(false);
      expect(mockElement.classList.contains('scanlines-overlay')).toBe(false);
    });

    it('should use document.body if no target element provided', () => {
      initializeBackgroundEffects('ceefax');
      
      expect(document.body.classList.contains('scanlines-overlay')).toBe(true);
      
      // Clean up
      document.body.classList.remove('scanlines-overlay', 'intensity-medium');
    });
  });

  describe('Effect Intensity', () => {
    beforeEach(() => {
      initializeBackgroundEffects('haunting', mockElement);
    });

    it('should update fog intensity to high', () => {
      updateEffectIntensity('fog', 'high');
      
      expect(mockElement.classList.contains('intensity-high')).toBe(true);
      expect(mockElement.classList.contains('intensity-medium')).toBe(false);
    });

    it('should update flicker intensity to low', () => {
      updateEffectIntensity('flicker', 'low');
      
      const effects = getCurrentEffects();
      const flickerEffect = effects.find(e => e.type === 'flicker');
      
      expect(flickerEffect?.intensity).toBe('low');
    });

    it('should update chromatic intensity to high', () => {
      updateEffectIntensity('chromatic', 'high');
      
      const effects = getCurrentEffects();
      const chromaticEffect = effects.find(e => e.type === 'chromatic');
      
      expect(chromaticEffect?.intensity).toBe('high');
    });

    it('should handle intensity updates for non-existent effects gracefully', () => {
      expect(() => {
        updateEffectIntensity('scanlines' as BackgroundEffectType, 'high');
      }).not.toThrow();
    });
  });

  describe('Toggle Effects', () => {
    beforeEach(() => {
      initializeBackgroundEffects('haunting', mockElement);
    });

    it('should disable fog effect', () => {
      toggleEffect('fog', false);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(false);
      
      const effects = getCurrentEffects();
      const fogEffect = effects.find(e => e.type === 'fog');
      expect(fogEffect?.enabled).toBe(false);
    });

    it('should re-enable fog effect', () => {
      toggleEffect('fog', false);
      toggleEffect('fog', true);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(true);
      
      const effects = getCurrentEffects();
      const fogEffect = effects.find(e => e.type === 'fog');
      expect(fogEffect?.enabled).toBe(true);
    });

    it('should disable screen flicker', () => {
      toggleEffect('flicker', false);
      
      expect(mockElement.classList.contains('screen-flicker')).toBe(false);
    });

    it('should disable chromatic aberration', () => {
      toggleEffect('chromatic', false);
      
      expect(mockElement.classList.contains('chromatic-aberration')).toBe(false);
    });
  });

  describe('Get Effects', () => {
    it('should return all effects for Haunting theme', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      const effects = getCurrentEffects();
      expect(effects).toHaveLength(3);
      
      const types = effects.map(e => e.type);
      expect(types).toContain('fog');
      expect(types).toContain('flicker');
      expect(types).toContain('chromatic');
    });

    it('should return effects with correct properties', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      const effects = getCurrentEffects();
      const fogEffect = effects.find(e => e.type === 'fog');
      
      expect(fogEffect).toBeDefined();
      expect(fogEffect?.name).toBe('Fog Overlay');
      expect(fogEffect?.cssClass).toBe('fog-overlay');
      expect(fogEffect?.intensity).toBe('medium');
      expect(fogEffect?.enabled).toBe(true);
      expect(fogEffect?.zIndex).toBe(0);
    });

    it('should return empty array for High Contrast theme', () => {
      initializeBackgroundEffects('highcontrast', mockElement);
      
      const effects = getCurrentEffects();
      expect(effects).toHaveLength(0);
    });
  });

  describe('CSS Variables', () => {
    it('should apply CSS variables for Haunting theme', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      const manager = getBackgroundEffects();
      manager.applyCSSVariables();
      
      // Check that CSS variables are set
      const fogIntensity = mockElement.style.getPropertyValue('--fog-intensity');
      const flickerIntensity = mockElement.style.getPropertyValue('--flicker-intensity');
      const chromaticIntensity = mockElement.style.getPropertyValue('--chromatic-intensity');
      
      expect(fogIntensity).toBeTruthy();
      expect(flickerIntensity).toBeTruthy();
      expect(chromaticIntensity).toBeTruthy();
    });

    it('should update CSS variables when intensity changes', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      const manager = getBackgroundEffects();
      manager.updateEffectIntensity('fog', 'high');
      manager.applyCSSVariables();
      
      const fogIntensity = mockElement.style.getPropertyValue('--fog-intensity');
      expect(fogIntensity).toBe('1.5');
    });
  });

  describe('Effect Clearing', () => {
    it('should clear effects when switching themes', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(true);
      expect(mockElement.classList.contains('screen-flicker')).toBe(true);
      
      initializeBackgroundEffects('ceefax', mockElement);
      
      expect(mockElement.classList.contains('fog-overlay')).toBe(false);
      expect(mockElement.classList.contains('screen-flicker')).toBe(false);
      expect(mockElement.classList.contains('scanlines-overlay')).toBe(true);
    });

    it('should remove all intensity classes when clearing', () => {
      initializeBackgroundEffects('haunting', mockElement);
      updateEffectIntensity('fog', 'high');
      
      initializeBackgroundEffects('ceefax', mockElement);
      
      expect(mockElement.classList.contains('intensity-high')).toBe(false);
      expect(mockElement.classList.contains('intensity-medium')).toBe(true);
    });
  });

  describe('Z-Index Ordering', () => {
    it('should apply effects in correct z-index order', () => {
      initializeBackgroundEffects('haunting', mockElement);
      
      const effects = getCurrentEffects();
      const sortedEffects = effects.sort((a, b) => a.zIndex - b.zIndex);
      
      expect(sortedEffects[0].type).toBe('fog'); // z-index: 0
      expect(sortedEffects[1].type).toBe('chromatic'); // z-index: 1
      expect(sortedEffects[2].type).toBe('flicker'); // z-index: 2
    });
  });

  describe('Readability Considerations', () => {
    it('should ensure effects have proper z-index for readability', () => {
      const effects = HAUNTING_EFFECTS;
      
      // All effects should have z-index <= 2 to not obscure text
      effects.forEach(effect => {
        expect(effect.zIndex).toBeLessThanOrEqual(2);
      });
    });

    it('should use semi-transparent effects', () => {
      // This is tested via CSS, but we can verify intensity values are reasonable
      const manager = getBackgroundEffects();
      initializeBackgroundEffects('haunting', mockElement);
      
      const variables = manager.getCSSVariables();
      
      // All intensity values should be <= 1.5 for readability
      Object.values(variables).forEach(value => {
        const numValue = parseFloat(value);
        expect(numValue).toBeLessThanOrEqual(1.5);
      });
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = getBackgroundEffects();
      const instance2 = getBackgroundEffects();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset singleton', () => {
      const instance1 = getBackgroundEffects();
      resetBackgroundEffects();
      const instance2 = getBackgroundEffects();
      
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown theme gracefully', () => {
      expect(() => {
        initializeBackgroundEffects('unknown-theme', mockElement);
      }).not.toThrow();
      
      const effects = getCurrentEffects();
      expect(effects).toHaveLength(0);
    });

    it('should handle missing target element', () => {
      expect(() => {
        const manager = getBackgroundEffects();
        manager.initializeForTheme('haunting');
      }).not.toThrow();
    });

    it('should handle rapid theme switches', () => {
      expect(() => {
        initializeBackgroundEffects('haunting', mockElement);
        initializeBackgroundEffects('ceefax', mockElement);
        initializeBackgroundEffects('orf', mockElement);
        initializeBackgroundEffects('haunting', mockElement);
      }).not.toThrow();
    });
  });
});
