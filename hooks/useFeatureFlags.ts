/**
 * React Hook for Feature Flags
 * Provides easy access to feature flags in React components
 * Task 36: Implement feature flags for gradual rollout
 */

import { useMemo } from 'react';
import {
  getFeatureFlags,
  isFeatureEnabled,
  type FeatureFlags,
} from '../lib/feature-flags';

/**
 * Hook to access all feature flags
 * @returns Current feature flag configuration
 */
export function useFeatureFlags(): Readonly<FeatureFlags> {
  return useMemo(() => getFeatureFlags(), []);
}

/**
 * Hook to check if a specific feature is enabled
 * @param flag - Feature flag name
 * @returns True if the feature is enabled
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return useMemo(() => isFeatureEnabled(flag), [flag]);
}

/**
 * Hook to get multiple feature flags at once
 * @param flags - Array of feature flag names
 * @returns Object with flag names as keys and enabled status as values
 */
export function useFeatureFlags_Multiple(
  flags: Array<keyof FeatureFlags>
): Record<keyof FeatureFlags, boolean> {
  return useMemo(() => {
    const result: Partial<Record<keyof FeatureFlags, boolean>> = {};
    flags.forEach(flag => {
      result[flag] = isFeatureEnabled(flag);
    });
    return result as Record<keyof FeatureFlags, boolean>;
  }, [flags]);
}

/**
 * Hook to conditionally render based on feature flag
 * @param flag - Feature flag to check
 * @returns Object with render helpers
 */
export function useConditionalFeature(flag: keyof FeatureFlags) {
  const enabled = useFeatureFlag(flag);
  
  return useMemo(() => ({
    enabled,
    disabled: !enabled,
    renderIf: (component: React.ReactNode) => enabled ? component : null,
    renderUnless: (component: React.ReactNode) => !enabled ? component : null,
  }), [enabled]);
}
