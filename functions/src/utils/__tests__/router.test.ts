// Tests for router utility

import { isValidPageId, routeToAdapter } from '../router';
import { NewsAdapter } from '../../adapters/NewsAdapter';

describe('router', () => {
  describe('isValidPageId', () => {
    it('should validate standard page IDs', () => {
      expect(isValidPageId('100')).toBe(true);
      expect(isValidPageId('202')).toBe(true);
      expect(isValidPageId('899')).toBe(true);
    });

    it('should validate special page IDs', () => {
      expect(isValidPageId('999')).toBe(true);
      expect(isValidPageId('404')).toBe(true);
      expect(isValidPageId('666')).toBe(true);
    });

    it('should validate sub-page IDs', () => {
      expect(isValidPageId('202-1')).toBe(true);
      expect(isValidPageId('202-2')).toBe(true);
      expect(isValidPageId('201-5')).toBe(true);
      expect(isValidPageId('210-9')).toBe(true);
    });

    it('should reject invalid page IDs', () => {
      expect(isValidPageId('99')).toBe(false);
      expect(isValidPageId('900')).toBe(false);
      expect(isValidPageId('abc')).toBe(false);
      expect(isValidPageId('')).toBe(false);
      expect(isValidPageId('202-0')).toBe(false); // Sub-page index must be >= 1
      expect(isValidPageId('202-100')).toBe(false); // Sub-page index must be <= 99
    });
  });

  describe('routeToAdapter', () => {
    it('should route standard news pages to NewsAdapter', () => {
      const adapter = routeToAdapter('202');
      expect(adapter).toBeInstanceOf(NewsAdapter);
    });

    it('should route news sub-pages to NewsAdapter', () => {
      const adapter = routeToAdapter('202-1');
      expect(adapter).toBeInstanceOf(NewsAdapter);
    });

    it('should handle sub-page format correctly', () => {
      const adapter1 = routeToAdapter('201-1');
      const adapter2 = routeToAdapter('202-5');
      const adapter3 = routeToAdapter('210-9');
      
      expect(adapter1).toBeInstanceOf(NewsAdapter);
      expect(adapter2).toBeInstanceOf(NewsAdapter);
      expect(adapter3).toBeInstanceOf(NewsAdapter);
    });
  });
});
