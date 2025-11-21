/**
 * Tests for useFeatureFlags hook
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import {
  useFeatureFlags,
  useFeatureFlag,
  useFeatureFlags_Multiple,
  useConditionalFeature,
} from '../useFeatureFlags';
import { setFeatureFlags, resetFeatureFlags } from '../../lib/feature-flags';

describe('useFeatureFlags', () => {
  beforeEach(() => {
    resetFeatureFlags();
  });

  describe('useFeatureFlags', () => {
    it('should return all feature flags', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      expect(result.current).toHaveProperty('ENABLE_FULL_SCREEN_LAYOUT');
      expect(result.current).toHaveProperty('ENABLE_ANIMATIONS');
      expect(result.current).toHaveProperty('ENABLE_KIROWEEN_THEME');
      expect(result.current).toHaveProperty('ENABLE_BREADCRUMBS');
      expect(result.current).toHaveProperty('ENABLE_DECORATIVE_ELEMENTS');
    });

    it('should return stable reference', () => {
      const { result, rerender } = renderHook(() => useFeatureFlags());
      
      const firstResult = result.current;
      rerender();
      const secondResult = result.current;
      
      expect(firstResult).toBe(secondResult);
    });
  });

  describe('useFeatureFlag', () => {
    it('should return true for enabled features', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });
      
      const { result } = renderHook(() => useFeatureFlag('ENABLE_ANIMATIONS'));
      
      expect(result.current).toBe(true);
    });

    it('should return false for disabled features', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });
      
      const { result } = renderHook(() => useFeatureFlag('ENABLE_ANIMATIONS'));
      
      expect(result.current).toBe(false);
    });

    it('should check different flags', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: true,
        ENABLE_BREADCRUMBS: false,
      });

      const { result: animationsResult } = renderHook(() => 
        useFeatureFlag('ENABLE_ANIMATIONS')
      );
      const { result: breadcrumbsResult } = renderHook(() => 
        useFeatureFlag('ENABLE_BREADCRUMBS')
      );

      expect(animationsResult.current).toBe(true);
      expect(breadcrumbsResult.current).toBe(false);
    });
  });

  describe('useFeatureFlags_Multiple', () => {
    it('should return status for multiple flags', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: true,
        ENABLE_BREADCRUMBS: false,
      });

      const { result } = renderHook(() => 
        useFeatureFlags_Multiple(['ENABLE_ANIMATIONS', 'ENABLE_BREADCRUMBS'])
      );

      expect(result.current.ENABLE_ANIMATIONS).toBe(true);
      expect(result.current.ENABLE_BREADCRUMBS).toBe(false);
    });

    it('should handle empty array', () => {
      const { result } = renderHook(() => useFeatureFlags_Multiple([]));
      
      expect(result.current).toEqual({});
    });

    it('should handle single flag', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { result } = renderHook(() => 
        useFeatureFlags_Multiple(['ENABLE_ANIMATIONS'])
      );

      expect(result.current.ENABLE_ANIMATIONS).toBe(true);
    });
  });

  describe('useConditionalFeature', () => {
    it('should provide enabled status', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      expect(result.current.enabled).toBe(true);
      expect(result.current.disabled).toBe(false);
    });

    it('should provide disabled status', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      expect(result.current.enabled).toBe(false);
      expect(result.current.disabled).toBe(true);
    });

    it('should render component when enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      const component = React.createElement('div', null, 'Test');
      expect(result.current.renderIf(component)).toBe(component);
    });

    it('should not render component when disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      const component = React.createElement('div', null, 'Test');
      expect(result.current.renderIf(component)).toBeNull();
    });

    it('should render component with renderUnless when disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      const component = React.createElement('div', null, 'Test');
      expect(result.current.renderUnless(component)).toBe(component);
    });

    it('should not render component with renderUnless when enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { result } = renderHook(() => 
        useConditionalFeature('ENABLE_ANIMATIONS')
      );

      const component = React.createElement('div', null, 'Test');
      expect(result.current.renderUnless(component)).toBeNull();
    });
  });
});
