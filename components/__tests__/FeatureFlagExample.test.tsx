/**
 * Tests for FeatureFlagExample component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  FeatureFlagExample,
  ConditionalAnimation,
  EnhancedLayout,
} from '../FeatureFlagExample';
import { setFeatureFlags, resetFeatureFlags } from '../../lib/feature-flags';

describe('FeatureFlagExample', () => {
  beforeEach(() => {
    resetFeatureFlags();
  });

  describe('FeatureFlagExample', () => {
    it('should render with all features enabled', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: true,
        ENABLE_FULL_SCREEN_LAYOUT: true,
        ENABLE_BREADCRUMBS: true,
        ENABLE_DECORATIVE_ELEMENTS: true,
        ENABLE_KIROWEEN_THEME: true,
      });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/Feature Flags Demo/i)).toBeInTheDocument();
      expect(screen.getByText(/Animations: ✓ Enabled/i)).toBeInTheDocument();
      expect(screen.getByText(/Full Screen: ✓ Enabled/i)).toBeInTheDocument();
    });

    it('should show disabled status when features are off', () => {
      setFeatureFlags({
        ENABLE_ANIMATIONS: false,
        ENABLE_FULL_SCREEN_LAYOUT: false,
        ENABLE_BREADCRUMBS: false,
        ENABLE_DECORATIVE_ELEMENTS: false,
        ENABLE_KIROWEEN_THEME: false,
      });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/Animations: ✗ Disabled/i)).toBeInTheDocument();
      expect(screen.getByText(/Full Screen: ✗ Disabled/i)).toBeInTheDocument();
    });

    it('should render breadcrumbs when enabled', () => {
      setFeatureFlags({ ENABLE_BREADCRUMBS: true });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/100 > 200 > 201/i)).toBeInTheDocument();
    });

    it('should render simple title when breadcrumbs disabled', () => {
      setFeatureFlags({ ENABLE_BREADCRUMBS: false });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/Page 201/i)).toBeInTheDocument();
    });

    it('should render decorative border when enabled', () => {
      setFeatureFlags({ ENABLE_DECORATIVE_ELEMENTS: true });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/════════════════════════════════════════/)).toBeInTheDocument();
    });

    it('should render Kiroween decorations when enabled', () => {
      setFeatureFlags({ ENABLE_KIROWEEN_THEME: true });

      render(<FeatureFlagExample />);
      
      expect(screen.getByText(/🎃 👻 🦇/)).toBeInTheDocument();
    });

    it('should apply full-screen class when enabled', () => {
      setFeatureFlags({ ENABLE_FULL_SCREEN_LAYOUT: true });

      const { container } = render(<FeatureFlagExample />);
      
      expect(container.querySelector('.full-screen')).toBeInTheDocument();
    });

    it('should apply animated-content class when animations enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { container } = render(<FeatureFlagExample />);
      
      expect(container.querySelector('.animated-content')).toBeInTheDocument();
    });

    it('should apply static-content class when animations disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });

      const { container } = render(<FeatureFlagExample />);
      
      expect(container.querySelector('.static-content')).toBeInTheDocument();
    });
  });

  describe('ConditionalAnimation', () => {
    it('should wrap children with animation when enabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: true });

      const { container } = render(
        <ConditionalAnimation>
          <div>Test Content</div>
        </ConditionalAnimation>
      );
      
      expect(container.querySelector('.animated-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.fade-in')).toBeInTheDocument();
    });

    it('should render children without wrapper when disabled', () => {
      setFeatureFlags({ ENABLE_ANIMATIONS: false });

      const { container } = render(
        <ConditionalAnimation>
          <div className="test-child">Test Content</div>
        </ConditionalAnimation>
      );
      
      expect(container.querySelector('.animated-wrapper')).not.toBeInTheDocument();
      expect(container.querySelector('.test-child')).toBeInTheDocument();
    });
  });

  describe('EnhancedLayout', () => {
    it('should apply all layout classes when features enabled', () => {
      setFeatureFlags({
        ENABLE_FULL_SCREEN_LAYOUT: true,
        ENABLE_BREADCRUMBS: true,
        ENABLE_DECORATIVE_ELEMENTS: true,
      });

      const { container } = render(
        <EnhancedLayout>
          <div>Content</div>
        </EnhancedLayout>
      );
      
      const layout = container.querySelector('.teletext-layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('full-screen');
      expect(layout).toHaveClass('with-breadcrumbs');
      expect(layout).toHaveClass('with-decorations');
    });

    it('should apply only base class when features disabled', () => {
      setFeatureFlags({
        ENABLE_FULL_SCREEN_LAYOUT: false,
        ENABLE_BREADCRUMBS: false,
        ENABLE_DECORATIVE_ELEMENTS: false,
      });

      const { container } = render(
        <EnhancedLayout>
          <div>Content</div>
        </EnhancedLayout>
      );
      
      const layout = container.querySelector('.teletext-layout');
      expect(layout).toBeInTheDocument();
      expect(layout).not.toHaveClass('full-screen');
      expect(layout).not.toHaveClass('with-breadcrumbs');
      expect(layout).not.toHaveClass('with-decorations');
    });

    it('should apply selective classes based on flags', () => {
      setFeatureFlags({
        ENABLE_FULL_SCREEN_LAYOUT: true,
        ENABLE_BREADCRUMBS: false,
        ENABLE_DECORATIVE_ELEMENTS: true,
      });

      const { container } = render(
        <EnhancedLayout>
          <div>Content</div>
        </EnhancedLayout>
      );
      
      const layout = container.querySelector('.teletext-layout');
      expect(layout).toHaveClass('full-screen');
      expect(layout).not.toHaveClass('with-breadcrumbs');
      expect(layout).toHaveClass('with-decorations');
    });
  });
});
