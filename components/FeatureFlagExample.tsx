/**
 * Feature Flag Example Component
 * Demonstrates how to use feature flags in React components
 * Task 36: Implement feature flags for gradual rollout
 */

'use client';

import React from 'react';
import { useFeatureFlag, useConditionalFeature } from '../hooks/useFeatureFlags';
import { getFeatureClass } from '../lib/feature-flags';

/**
 * Example component showing feature flag usage
 */
export function FeatureFlagExample() {
  // Simple flag check
  const animationsEnabled = useFeatureFlag('ENABLE_ANIMATIONS');
  const fullScreenEnabled = useFeatureFlag('ENABLE_FULL_SCREEN_LAYOUT');
  
  // Conditional rendering helpers
  const breadcrumbs = useConditionalFeature('ENABLE_BREADCRUMBS');
  const decorations = useConditionalFeature('ENABLE_DECORATIVE_ELEMENTS');
  const kiroween = useConditionalFeature('ENABLE_KIROWEEN_THEME');
  
  // CSS class based on feature flag
  const containerClass = getFeatureClass(
    'teletext-container',
    'ENABLE_FULL_SCREEN_LAYOUT',
    'full-screen'
  );
  
  return (
    <div className={containerClass}>
      {/* Conditional rendering with renderIf */}
      {breadcrumbs.renderIf(
        <div className="breadcrumb-trail">
          100 &gt; 200 &gt; 201
        </div>
      )}
      
      {/* Conditional rendering with renderUnless */}
      {breadcrumbs.renderUnless(
        <div className="simple-title">
          Page 201
        </div>
      )}
      
      {/* Conditional content based on flag */}
      <div className={animationsEnabled ? 'animated-content' : 'static-content'}>
        <h1>Feature Flags Demo</h1>
        
        <div className="feature-status">
          <p>Animations: {animationsEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
          <p>Full Screen: {fullScreenEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
          <p>Breadcrumbs: {breadcrumbs.enabled ? '✓ Enabled' : '✗ Disabled'}</p>
          <p>Decorations: {decorations.enabled ? '✓ Enabled' : '✗ Disabled'}</p>
          <p>Kiroween: {kiroween.enabled ? '✓ Enabled' : '✗ Disabled'}</p>
        </div>
        
        {/* Decorative elements only if enabled */}
        {decorations.renderIf(
          <div className="decorative-border">
            ════════════════════════════════════════
          </div>
        )}
        
        {/* Kiroween-specific content */}
        {kiroween.renderIf(
          <div className="kiroween-decoration">
            🎃 👻 🦇
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Example of feature flag usage in a functional component
 */
export function ConditionalAnimation({ children }: { children: React.ReactNode }) {
  const animationsEnabled = useFeatureFlag('ENABLE_ANIMATIONS');
  
  if (!animationsEnabled) {
    return <>{children}</>;
  }
  
  return (
    <div className="animated-wrapper fade-in">
      {children}
    </div>
  );
}

/**
 * Example of feature flag usage with multiple flags
 */
export function EnhancedLayout({ children }: { children: React.ReactNode }) {
  const fullScreen = useFeatureFlag('ENABLE_FULL_SCREEN_LAYOUT');
  const breadcrumbs = useFeatureFlag('ENABLE_BREADCRUMBS');
  const decorations = useFeatureFlag('ENABLE_DECORATIVE_ELEMENTS');
  
  const layoutClass = [
    'teletext-layout',
    fullScreen && 'full-screen',
    breadcrumbs && 'with-breadcrumbs',
    decorations && 'with-decorations',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={layoutClass}>
      {children}
    </div>
  );
}
