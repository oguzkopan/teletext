/**
 * Feature Flags System
 * Enables gradual rollout of new UX features
 * Task 36: Implement feature flags for gradual rollout
 */

/**
 * Feature flag configuration
 * Each flag can be controlled via environment variables or runtime configuration
 */
export interface FeatureFlags {
  ENABLE_FULL_SCREEN_LAYOUT: boolean;
  ENABLE_ANIMATIONS: boolean;
  ENABLE_KIROWEEN_THEME: boolean;
  ENABLE_BREADCRUMBS: boolean;
  ENABLE_DECORATIVE_ELEMENTS: boolean;
}

/**
 * Default feature flag values
 * These are used when no environment variable is set
 */
const DEFAULT_FLAGS: FeatureFlags = {
  ENABLE_FULL_SCREEN_LAYOUT: true,
  ENABLE_ANIMATIONS: true,
  ENABLE_KIROWEEN_THEME: true,
  ENABLE_BREADCRUMBS: true,
  ENABLE_DECORATIVE_ELEMENTS: true,
};

/**
 * Parse a boolean environment variable
 * Supports: true/false, 1/0, yes/no, on/off (case insensitive)
 */
function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  
  const normalized = value.toLowerCase().trim();
  
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }
  
  return defaultValue;
}

/**
 * Load feature flags from environment variables
 * Environment variables take precedence over defaults
 */
function loadFeatureFlags(): FeatureFlags {
  return {
    ENABLE_FULL_SCREEN_LAYOUT: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT,
      DEFAULT_FLAGS.ENABLE_FULL_SCREEN_LAYOUT
    ),
    ENABLE_ANIMATIONS: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
      DEFAULT_FLAGS.ENABLE_ANIMATIONS
    ),
    ENABLE_KIROWEEN_THEME: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_KIROWEEN_THEME,
      DEFAULT_FLAGS.ENABLE_KIROWEEN_THEME
    ),
    ENABLE_BREADCRUMBS: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_BREADCRUMBS,
      DEFAULT_FLAGS.ENABLE_BREADCRUMBS
    ),
    ENABLE_DECORATIVE_ELEMENTS: parseBooleanEnv(
      process.env.NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS,
      DEFAULT_FLAGS.ENABLE_DECORATIVE_ELEMENTS
    ),
  };
}

/**
 * Global feature flags instance
 * Loaded once at module initialization
 */
let featureFlags: FeatureFlags = loadFeatureFlags();

/**
 * Get the current feature flags
 * @returns Current feature flag configuration
 */
export function getFeatureFlags(): Readonly<FeatureFlags> {
  return { ...featureFlags };
}

/**
 * Check if a specific feature is enabled
 * @param flag - Feature flag name
 * @returns True if the feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag];
}

/**
 * Override feature flags at runtime (for testing or dynamic configuration)
 * @param overrides - Partial feature flag overrides
 */
export function setFeatureFlags(overrides: Partial<FeatureFlags>): void {
  featureFlags = {
    ...featureFlags,
    ...overrides,
  };
}

/**
 * Reset feature flags to defaults (useful for testing)
 */
export function resetFeatureFlags(): void {
  featureFlags = loadFeatureFlags();
}

/**
 * Get a human-readable description of a feature flag
 * @param flag - Feature flag name
 * @returns Description of what the flag controls
 */
export function getFeatureFlagDescription(flag: keyof FeatureFlags): string {
  const descriptions: Record<keyof FeatureFlags, string> = {
    ENABLE_FULL_SCREEN_LAYOUT: 'Full-screen layout with optimized space utilization (90%+ screen usage)',
    ENABLE_ANIMATIONS: 'Theme-specific animations, transitions, and visual effects',
    ENABLE_KIROWEEN_THEME: 'Halloween/Kiroween theme with spooky decorations and effects',
    ENABLE_BREADCRUMBS: 'Navigation breadcrumb trail showing page history',
    ENABLE_DECORATIVE_ELEMENTS: 'Decorative ASCII art and visual embellishments',
  };
  
  return descriptions[flag];
}

/**
 * Get all feature flags with their descriptions
 * @returns Array of feature flag information
 */
export function getAllFeatureFlags(): Array<{
  flag: keyof FeatureFlags;
  enabled: boolean;
  description: string;
}> {
  return (Object.keys(featureFlags) as Array<keyof FeatureFlags>).map(flag => ({
    flag,
    enabled: featureFlags[flag],
    description: getFeatureFlagDescription(flag),
  }));
}

/**
 * Log feature flag status to console (useful for debugging)
 */
export function logFeatureFlags(): void {
  console.log('🚩 Feature Flags Status:');
  console.log('━'.repeat(60));
  
  getAllFeatureFlags().forEach(({ flag, enabled, description }) => {
    const status = enabled ? '✅ ENABLED' : '❌ DISABLED';
    console.log(`${status} ${flag}`);
    console.log(`   ${description}`);
  });
  
  console.log('━'.repeat(60));
  console.log('ℹ️  Set NEXT_PUBLIC_<FLAG_NAME>=true/false in .env.local to override');
}

/**
 * Create a teletext-formatted page showing feature flag status
 * @returns Array of 24 rows (40 chars each) showing feature flags
 */
export function createFeatureFlagsPage(): string[] {
  const padTo40 = (text: string): string => {
    if (text.length >= 40) return text.substring(0, 40);
    return text + ' '.repeat(40 - text.length);
  };
  
  const rows: string[] = [
    padTo40('FEATURE FLAGS                       799'),
    padTo40('════════════════════════════════════════'),
    padTo40(''),
    padTo40('Current Feature Status:'),
    padTo40(''),
  ];
  
  getAllFeatureFlags().forEach(({ flag, enabled }) => {
    const status = enabled ? '✓' : '✗';
    const statusColor = enabled ? 'ON ' : 'OFF';
    const flagName = flag.replace('ENABLE_', '').replace(/_/g, ' ');
    
    rows.push(padTo40(`${status} ${flagName.substring(0, 30)} ${statusColor}`));
  });
  
  rows.push(padTo40(''));
  rows.push(padTo40('To change feature flags:'));
  rows.push(padTo40('Set NEXT_PUBLIC_<FLAG_NAME>=true/false'));
  rows.push(padTo40('in .env.local and restart server'));
  rows.push(padTo40(''));
  rows.push(padTo40('Example:'));
  rows.push(padTo40('NEXT_PUBLIC_ENABLE_ANIMATIONS=false'));
  
  // Pad to 24 rows
  while (rows.length < 22) {
    rows.push(padTo40(''));
  }
  
  rows.push(padTo40('Press 100 for INDEX'));
  rows.push(padTo40('Press 700 for SETTINGS'));
  
  return rows.slice(0, 24);
}

/**
 * Helper function to conditionally apply a feature
 * @param flag - Feature flag to check
 * @param enabledValue - Value to return if feature is enabled
 * @param disabledValue - Value to return if feature is disabled
 * @returns The appropriate value based on flag status
 */
export function withFeatureFlag<T>(
  flag: keyof FeatureFlags,
  enabledValue: T,
  disabledValue: T
): T {
  return isFeatureEnabled(flag) ? enabledValue : disabledValue;
}

/**
 * Helper function to conditionally execute code based on feature flag
 * @param flag - Feature flag to check
 * @param callback - Function to execute if feature is enabled
 */
export function ifFeatureEnabled(
  flag: keyof FeatureFlags,
  callback: () => void
): void {
  if (isFeatureEnabled(flag)) {
    callback();
  }
}

/**
 * Helper function to get CSS class names based on feature flags
 * @param baseClass - Base CSS class
 * @param flag - Feature flag to check
 * @param enabledClass - Additional class if feature is enabled
 * @returns Combined class names
 */
export function getFeatureClass(
  baseClass: string,
  flag: keyof FeatureFlags,
  enabledClass: string
): string {
  return isFeatureEnabled(flag) ? `${baseClass} ${enabledClass}` : baseClass;
}
