# Feature Flags Quick Reference

## Available Flags

| Flag | Default | Description |
|------|---------|-------------|
| `ENABLE_FULL_SCREEN_LAYOUT` | `true` | Full-screen layout (90%+ screen usage) |
| `ENABLE_ANIMATIONS` | `true` | Theme animations and transitions |
| `ENABLE_KIROWEEN_THEME` | `true` | Halloween theme with spooky effects |
| `ENABLE_BREADCRUMBS` | `true` | Navigation breadcrumb trail |
| `ENABLE_DECORATIVE_ELEMENTS` | `true` | ASCII art and decorations |

## Environment Setup

Add to `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=true
NEXT_PUBLIC_ENABLE_BREADCRUMBS=true
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=true
```

Supported values: `true/false`, `1/0`, `yes/no`, `on/off` (case insensitive)

## Quick Usage

### TypeScript/JavaScript

```typescript
import { isFeatureEnabled } from './lib/feature-flags';

// Simple check
if (isFeatureEnabled('ENABLE_ANIMATIONS')) {
  applyAnimation();
}

// Conditional value
import { withFeatureFlag } from './lib/feature-flags';
const value = withFeatureFlag('ENABLE_ANIMATIONS', 'animated', 'static');

// Conditional execution
import { ifFeatureEnabled } from './lib/feature-flags';
ifFeatureEnabled('ENABLE_ANIMATIONS', () => {
  setupAnimations();
});

// CSS class
import { getFeatureClass } from './lib/feature-flags';
const className = getFeatureClass('base', 'ENABLE_ANIMATIONS', 'animated');
```

### React Components

```tsx
import { useFeatureFlag, useConditionalFeature } from './hooks/useFeatureFlags';

function MyComponent() {
  // Simple check
  const enabled = useFeatureFlag('ENABLE_ANIMATIONS');
  
  // Conditional rendering
  const feature = useConditionalFeature('ENABLE_BREADCRUMBS');
  
  return (
    <div className={enabled ? 'animated' : 'static'}>
      {feature.renderIf(<Breadcrumbs />)}
      {feature.renderUnless(<SimpleTitle />)}
    </div>
  );
}
```

### Testing

```typescript
import { setFeatureFlags, resetFeatureFlags } from './lib/feature-flags';

describe('Tests', () => {
  beforeEach(() => resetFeatureFlags() });
  
  it('test with feature enabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: true });
    // test code
  });
  
  it('test with feature disabled', () => {
    setFeatureFlags({ ENABLE_ANIMATIONS: false });
    // test code
  });
});
```

## View Status

- **In App**: Navigate to page **799**
- **In Console**: `import { logFeatureFlags } from './lib/feature-flags'; logFeatureFlags();`

## Common Patterns

### Conditional Component Rendering
```tsx
{useFeatureFlag('ENABLE_DECORATIONS') && <Decorations />}
```

### Multiple Classes
```tsx
const classes = [
  'base',
  useFeatureFlag('ENABLE_ANIMATIONS') && 'animated',
  useFeatureFlag('ENABLE_FULL_SCREEN') && 'full-screen',
].filter(Boolean).join(' ');
```

### Fallback Behavior
```tsx
const layout = useFeatureFlag('ENABLE_FULL_SCREEN_LAYOUT')
  ? calculateFullScreen()
  : calculateTraditional();
```

## Emergency Disable

Set to `false` in `.env.local` and restart:
```bash
NEXT_PUBLIC_ENABLE_ANIMATIONS=false
```

## Documentation

- Full guide: `FEATURE_FLAGS_USAGE.md`
- Implementation: `TASK_36_IMPLEMENTATION_SUMMARY.md`
- Code: `lib/feature-flags.ts`
- Hooks: `hooks/useFeatureFlags.ts`
