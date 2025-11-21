# Feature Flags Usage Guide

This guide explains how to use the feature flags system for gradual rollout of UX redesign features.

## Overview

The feature flags system allows you to enable or disable specific UX features without code changes. This is useful for:

- **Gradual Rollout**: Enable features incrementally for testing
- **A/B Testing**: Compare different UX approaches
- **Emergency Rollback**: Quickly disable problematic features
- **Environment-Specific Configuration**: Different settings for dev/staging/production

## Available Feature Flags

### ENABLE_FULL_SCREEN_LAYOUT
**Default**: `true`

Enables full-screen layout with optimized space utilization (90%+ screen usage).

- Uses all 24 rows of the teletext grid
- Minimal padding on all sides
- Optimized content distribution
- Enhanced header and footer positioning

**When disabled**: Falls back to traditional layout with more padding.

### ENABLE_ANIMATIONS
**Default**: `true`

Enables theme-specific animations, transitions, and visual effects.

- Page transition animations (fade, wipe, glitch, slide)
- Loading indicators with theme-appropriate animations
- Button press feedback animations
- Text entry cursor animations
- Background effects (scanlines, fog, flicker)

**When disabled**: All animations are removed, providing a static experience.

### ENABLE_KIROWEEN_THEME
**Default**: `true`

Enables the Halloween/Kiroween theme with spooky decorations and effects.

- Haunting Mode theme option
- Animated jack-o'-lanterns, ghosts, and bats
- Glitch transition effects
- Chromatic aberration and screen flicker
- Horror-themed loading indicators

**When disabled**: Kiroween theme is hidden from theme selection.

### ENABLE_BREADCRUMBS
**Default**: `true`

Enables navigation breadcrumb trail showing page history.

- Shows "100 > 200 > 201" style navigation trail
- Displays in page headers
- Truncates long histories with "..."
- Highlights previous page on back button

**When disabled**: No breadcrumb trail is shown.

### ENABLE_DECORATIVE_ELEMENTS
**Default**: `true`

Enables decorative ASCII art and visual embellishments.

- ASCII art logos and banners
- Themed decorations (pumpkins, cats, etc.)
- Visual separators and borders
- Pixelated shapes and patterns

**When disabled**: Minimal visual design without decorative elements.

## Configuration

### Environment Variables

Set feature flags in your `.env.local` file:

```bash
# Enable all features (default)
NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=true
NEXT_PUBLIC_ENABLE_BREADCRUMBS=true
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=true

# Disable specific features
NEXT_PUBLIC_ENABLE_ANIMATIONS=false
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=false
```

**Supported Values**:
- `true`, `1`, `yes`, `on` → Feature enabled
- `false`, `0`, `no`, `off` → Feature disabled
- Case insensitive

### Runtime Configuration

For testing or dynamic configuration, you can override flags at runtime:

```typescript
import { setFeatureFlags } from './lib/feature-flags';

// Override specific flags
setFeatureFlags({
  ENABLE_ANIMATIONS: false,
  ENABLE_BREADCRUMBS: false,
});
```

## Usage in Code

### TypeScript/JavaScript

```typescript
import { isFeatureEnabled, withFeatureFlag } from './lib/feature-flags';

// Check if a feature is enabled
if (isFeatureEnabled('ENABLE_ANIMATIONS')) {
  // Apply animations
  applyPageTransition();
}

// Conditional value based on flag
const layoutClass = withFeatureFlag(
  'ENABLE_FULL_SCREEN_LAYOUT',
  'full-screen-layout',
  'traditional-layout'
);

// Conditional execution
import { ifFeatureEnabled } from './lib/feature-flags';

ifFeatureEnabled('ENABLE_DECORATIVE_ELEMENTS', () => {
  renderDecorativeElements();
});
```

### React Components

```tsx
import { useFeatureFlag, useConditionalFeature } from './hooks/useFeatureFlags';

function MyComponent() {
  // Simple flag check
  const animationsEnabled = useFeatureFlag('ENABLE_ANIMATIONS');
  
  // Conditional rendering helpers
  const breadcrumbs = useConditionalFeature('ENABLE_BREADCRUMBS');
  
  return (
    <div className={animationsEnabled ? 'animated' : 'static'}>
      {breadcrumbs.renderIf(
        <BreadcrumbTrail />
      )}
      
      {breadcrumbs.renderUnless(
        <SimpleTitleBar />
      )}
    </div>
  );
}
```

### CSS Classes

```typescript
import { getFeatureClass } from './lib/feature-flags';

// Get CSS class based on feature flag
const className = getFeatureClass(
  'teletext-screen',
  'ENABLE_ANIMATIONS',
  'with-animations'
);
// Returns: "teletext-screen with-animations" if enabled
// Returns: "teletext-screen" if disabled
```

## Viewing Feature Flag Status

### In the Application

Navigate to page **799** to see the current status of all feature flags:

```
FEATURE FLAGS                       799
════════════════════════════════════════

Current Feature Status:

✓ FULL SCREEN LAYOUT            ON
✓ ANIMATIONS                    ON
✓ KIROWEEN THEME                ON
✓ BREADCRUMBS                   ON
✓ DECORATIVE ELEMENTS           ON
```

### In Console

```typescript
import { logFeatureFlags } from './lib/feature-flags';

// Log all feature flags to console
logFeatureFlags();
```

Output:
```
🚩 Feature Flags Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ENABLED ENABLE_FULL_SCREEN_LAYOUT
   Full-screen layout with optimized space utilization (90%+ screen usage)
✅ ENABLED ENABLE_ANIMATIONS
   Theme-specific animations, transitions, and visual effects
...
```

## Testing

### Unit Tests

```typescript
import { setFeatureFlags, resetFeatureFlags } from './lib/feature-flags';

describe('My Component', () => {
  beforeEach(() => {
    resetFeatureFlags(); // Reset to defaults
  });

  it('should render with animations when enabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: true });
    // Test with animations enabled
  });

  it('should render without animations when disabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: false });
    // Test with animations disabled
  });
});
```

### Integration Tests

Test different feature flag combinations:

```typescript
const testCases = [
  { ENABLE_ANIMATIONS: true, ENABLE_BREADCRUMBS: true },
  { ENABLE_ANIMATIONS: false, ENABLE_BREADCRUMBS: true },
  { ENABLE_ANIMATIONS: true, ENABLE_BREADCRUMBS: false },
  { ENABLE_ANIMATIONS: false, ENABLE_BREADCRUMBS: false },
];

testCases.forEach(flags => {
  it(`should work with flags: ${JSON.stringify(flags)}`, () => {
    setFeatureFlags(flags);
    // Test behavior
  });
});
```

## Best Practices

### 1. Check Flags Early

Check feature flags at the component/function entry point:

```typescript
function renderPage(page: TeletextPage) {
  if (!isFeatureEnabled('ENABLE_FULL_SCREEN_LAYOUT')) {
    return renderTraditionalLayout(page);
  }
  
  return renderFullScreenLayout(page);
}
```

### 2. Provide Fallbacks

Always provide a fallback when a feature is disabled:

```typescript
const layout = isFeatureEnabled('ENABLE_FULL_SCREEN_LAYOUT')
  ? calculateFullScreenLayout(content)
  : calculateTraditionalLayout(content);
```

### 3. Document Flag Dependencies

If features depend on each other, document it:

```typescript
// ENABLE_DECORATIVE_ELEMENTS requires ENABLE_KIROWEEN_THEME for Halloween decorations
if (isFeatureEnabled('ENABLE_KIROWEEN_THEME') && 
    isFeatureEnabled('ENABLE_DECORATIVE_ELEMENTS')) {
  renderHalloweenDecorations();
}
```

### 4. Test Both States

Always test your code with features both enabled and disabled:

```typescript
describe('Feature', () => {
  it('should work when enabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: true });
    // Test
  });

  it('should work when disabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: false });
    // Test
  });
});
```

### 5. Clean Up After Tests

Reset flags after each test to avoid side effects:

```typescript
afterEach(() => {
  resetFeatureFlags();
});
```

## Deployment Strategies

### Gradual Rollout

1. **Phase 1**: Enable for development only
   ```bash
   # .env.local (dev)
   NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
   
   # .env.production (prod)
   NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=false
   ```

2. **Phase 2**: Enable for staging
   ```bash
   # .env.staging
   NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
   ```

3. **Phase 3**: Enable for production
   ```bash
   # .env.production
   NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
   ```

### A/B Testing

Split traffic between feature variants:

```typescript
// Randomly enable feature for 50% of users
const enableForUser = Math.random() < 0.5;
setFeatureFlags({ ENABLE_ANIMATIONS: enableForUser });
```

### Emergency Rollback

If a feature causes issues in production:

1. Set environment variable to `false`
2. Redeploy or restart application
3. Feature is immediately disabled

## API Reference

### Core Functions

- `getFeatureFlags()` - Get all feature flags
- `isFeatureEnabled(flag)` - Check if a feature is enabled
- `setFeatureFlags(overrides)` - Override feature flags
- `resetFeatureFlags()` - Reset to defaults
- `withFeatureFlag(flag, enabled, disabled)` - Conditional value
- `ifFeatureEnabled(flag, callback)` - Conditional execution
- `getFeatureClass(base, flag, enabled)` - Conditional CSS class

### React Hooks

- `useFeatureFlags()` - Get all flags in React
- `useFeatureFlag(flag)` - Check single flag in React
- `useFeatureFlags_Multiple(flags)` - Check multiple flags
- `useConditionalFeature(flag)` - Conditional rendering helpers

### Utility Functions

- `getAllFeatureFlags()` - Get flags with metadata
- `getFeatureFlagDescription(flag)` - Get flag description
- `logFeatureFlags()` - Log flags to console
- `createFeatureFlagsPage()` - Create teletext page (799)

## Troubleshooting

### Feature Not Enabling

1. Check environment variable is set correctly
2. Verify variable name starts with `NEXT_PUBLIC_`
3. Restart development server after changing `.env.local`
4. Check for typos in flag name

### Feature Not Disabling

1. Check for hardcoded overrides in code
2. Verify no runtime `setFeatureFlags()` calls
3. Clear browser cache
4. Check for cached environment variables

### Inconsistent Behavior

1. Reset flags in tests: `resetFeatureFlags()`
2. Check for race conditions in async code
3. Verify flag is checked at the right time
4. Use `logFeatureFlags()` to debug current state

## Examples

See the test files for comprehensive examples:
- `lib/__tests__/feature-flags.test.ts` - Core functionality tests
- `hooks/__tests__/useFeatureFlags.test.ts` - React hook tests

## Related Documentation

- `.env.example` - Environment variable reference
- `lib/feature-flags.ts` - Implementation
- `hooks/useFeatureFlags.ts` - React hooks
- Page 799 - Feature flags status page
