# Feature Flags Integration Guide

This guide shows how to integrate feature flags into existing components.

## Integration Checklist

- [x] Core feature flags system implemented
- [x] React hooks created
- [x] Tests written and passing (56 tests)
- [x] Documentation created
- [ ] Integrate into TeletextScreen
- [ ] Integrate into LayoutManager
- [ ] Integrate into NavigationIndicators
- [ ] Integrate into KiroweeenDecorations
- [ ] Integrate into ThemeContext
- [ ] Add page 799 to StaticAdapter

## Component Integration Examples

### 1. TeletextScreen Component

**File**: `components/TeletextScreen.tsx`

```tsx
import { useFeatureFlag } from '../hooks/useFeatureFlags';

export function TeletextScreen({ page }: { page: TeletextPage }) {
  const animationsEnabled = useFeatureFlag('ENABLE_ANIMATIONS');
  const fullScreenEnabled = useFeatureFlag('ENABLE_FULL_SCREEN_LAYOUT');
  
  // Apply animations only if enabled
  const transitionClass = animationsEnabled 
    ? 'page-transition-animated' 
    : 'page-transition-instant';
  
  // Use full-screen layout if enabled
  const layout = fullScreenEnabled
    ? calculateFullScreenLayout(page)
    : calculateTraditionalLayout(page);
  
  return (
    <div className={transitionClass}>
      {renderLayout(layout)}
    </div>
  );
}
```

### 2. LayoutManager

**File**: `lib/layout-manager.ts`

```typescript
import { isFeatureEnabled } from './feature-flags';

export function calculateLayout(page: TeletextPage): LayoutResult {
  // Check if full-screen layout is enabled
  if (!isFeatureEnabled('ENABLE_FULL_SCREEN_LAYOUT')) {
    return calculateTraditionalLayout(page);
  }
  
  // Use full-screen layout with minimal padding
  return calculateFullScreenLayout(page);
}

function calculateFullScreenLayout(page: TeletextPage): LayoutResult {
  // Utilize 90%+ of screen space
  const headerRows = 2;
  const footerRows = 2;
  const contentRows = 20; // 24 - 2 - 2
  
  return {
    header: createHeader(page, headerRows),
    content: optimizeContent(page.rows, contentRows),
    footer: createFooter(page, footerRows),
    totalRows: 24,
  };
}

function calculateTraditionalLayout(page: TeletextPage): LayoutResult {
  // Traditional layout with more padding
  const headerRows = 3;
  const footerRows = 3;
  const contentRows = 18; // 24 - 3 - 3
  
  return {
    header: createSimpleHeader(page, headerRows),
    content: page.rows.slice(0, contentRows),
    footer: createSimpleFooter(page, footerRows),
    totalRows: 24,
  };
}
```

### 3. NavigationIndicators

**File**: `lib/navigation-indicators.ts`

```typescript
import { isFeatureEnabled } from './feature-flags';

export function renderHeader(page: TeletextPage): string[] {
  const header: string[] = [];
  
  // Add breadcrumbs if enabled
  if (isFeatureEnabled('ENABLE_BREADCRUMBS')) {
    const breadcrumbs = renderBreadcrumbs(getNavigationHistory());
    header.push(breadcrumbs);
  } else {
    // Simple title without breadcrumbs
    header.push(page.title);
  }
  
  return header;
}

export function renderFooter(page: TeletextPage): string[] {
  const footer: string[] = [];
  
  // Always show basic navigation
  footer.push('Press 100 for INDEX');
  
  // Add decorative elements if enabled
  if (isFeatureEnabled('ENABLE_DECORATIVE_ELEMENTS')) {
    footer.push('════════════════════════════════════════');
  }
  
  return footer;
}
```

### 4. KiroweeenDecorations Component

**File**: `components/KiroweeenDecorations.tsx`

```tsx
import { useFeatureFlag } from '../hooks/useFeatureFlags';

export function KiroweeenDecorations() {
  const kiroweeenEnabled = useFeatureFlag('ENABLE_KIROWEEN_THEME');
  const decorationsEnabled = useFeatureFlag('ENABLE_DECORATIVE_ELEMENTS');
  
  // Only render if both flags are enabled
  if (!kiroweeenEnabled || !decorationsEnabled) {
    return null;
  }
  
  return (
    <div className="kiroween-decorations">
      <div className="pumpkin">🎃</div>
      <div className="ghost">👻</div>
      <div className="bat">🦇</div>
    </div>
  );
}
```

### 5. ThemeContext

**File**: `lib/theme-context.tsx`

```tsx
import { useFeatureFlag } from '../hooks/useFeatureFlags';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const kiroweeenEnabled = useFeatureFlag('ENABLE_KIROWEEN_THEME');
  
  // Filter available themes based on feature flags
  const availableThemes = useMemo(() => {
    const themes = ['ceefax', 'high-contrast', 'orf'];
    
    if (kiroweeenEnabled) {
      themes.push('kiroween');
    }
    
    return themes;
  }, [kiroweeenEnabled]);
  
  return (
    <ThemeContext.Provider value={{ availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 6. AnimationEngine

**File**: `lib/animation-engine.ts`

```typescript
import { isFeatureEnabled } from './feature-flags';

export function playAnimation(name: string, target: HTMLElement): void {
  // Check if animations are enabled
  if (!isFeatureEnabled('ENABLE_ANIMATIONS')) {
    // Skip animation, apply final state immediately
    applyFinalState(target);
    return;
  }
  
  // Play animation normally
  const animation = getAnimation(name);
  target.animate(animation.keyframes, animation.options);
}

export function applyPageTransition(from: HTMLElement, to: HTMLElement): void {
  if (!isFeatureEnabled('ENABLE_ANIMATIONS')) {
    // Instant transition
    from.style.display = 'none';
    to.style.display = 'block';
    return;
  }
  
  // Animated transition
  const theme = getCurrentTheme();
  const transition = getThemeTransition(theme);
  applyTransition(from, to, transition);
}
```

### 7. StaticAdapter (Page 799)

**File**: `functions/src/adapters/StaticAdapter.ts`

```typescript
import { createFeatureFlagsPage } from '../../lib/feature-flags';

export class StaticAdapter implements PageAdapter {
  async getPage(pageId: string): Promise<TeletextPage> {
    // ... existing code ...
    
    // Add feature flags page
    if (pageId === '799') {
      return {
        id: '799',
        title: 'Feature Flags',
        rows: createFeatureFlagsPage(),
        links: [
          { text: 'INDEX', page: '100', color: 'red' },
          { text: 'SETTINGS', page: '700', color: 'green' },
        ],
      };
    }
    
    // ... rest of existing code ...
  }
}
```

## Testing Integration

### Test with Feature Enabled

```typescript
import { setFeatureFlags } from '../lib/feature-flags';

describe('TeletextScreen with animations', () => {
  beforeEach(() => {
    setFeatureFlags({ ENABLE_ANIMATIONS: true });
  });
  
  it('should apply animated transitions', () => {
    const { container } = render(<TeletextScreen page={mockPage} />);
    expect(container.querySelector('.page-transition-animated')).toBeInTheDocument();
  });
});
```

### Test with Feature Disabled

```typescript
describe('TeletextScreen without animations', () => {
  beforeEach(() => {
    setFeatureFlags({ ENABLE_ANIMATIONS: false });
  });
  
  it('should use instant transitions', () => {
    const { container } = render(<TeletextScreen page={mockPage} />);
    expect(container.querySelector('.page-transition-instant')).toBeInTheDocument();
  });
});
```

### Test All Combinations

```typescript
const featureCombinations = [
  { ENABLE_ANIMATIONS: true, ENABLE_BREADCRUMBS: true },
  { ENABLE_ANIMATIONS: true, ENABLE_BREADCRUMBS: false },
  { ENABLE_ANIMATIONS: false, ENABLE_BREADCRUMBS: true },
  { ENABLE_ANIMATIONS: false, ENABLE_BREADCRUMBS: false },
];

featureCombinations.forEach(flags => {
  describe(`with flags: ${JSON.stringify(flags)}`, () => {
    beforeEach(() => {
      setFeatureFlags(flags);
    });
    
    it('should render correctly', () => {
      const { container } = render(<TeletextScreen page={mockPage} />);
      // Verify behavior matches flag configuration
    });
  });
});
```

## CSS Integration

### Conditional Classes

```css
/* Base styles (always applied) */
.teletext-screen {
  width: 100%;
  height: 100%;
}

/* Full-screen layout styles (when ENABLE_FULL_SCREEN_LAYOUT is true) */
.teletext-screen.full-screen {
  padding: 0;
  margin: 0;
}

/* Animation styles (when ENABLE_ANIMATIONS is true) */
.teletext-screen.with-animations {
  transition: all 0.3s ease;
}

.teletext-screen.with-animations .page-transition {
  animation: fadeIn 0.3s ease;
}

/* Decorative styles (when ENABLE_DECORATIVE_ELEMENTS is true) */
.teletext-screen.with-decorations::before {
  content: '════════════════════════════════════════';
  display: block;
}
```

### Apply Classes in Component

```tsx
import { getFeatureClass } from '../lib/feature-flags';

function TeletextScreen() {
  const className = [
    'teletext-screen',
    getFeatureClass('', 'ENABLE_FULL_SCREEN_LAYOUT', 'full-screen'),
    getFeatureClass('', 'ENABLE_ANIMATIONS', 'with-animations'),
    getFeatureClass('', 'ENABLE_DECORATIVE_ELEMENTS', 'with-decorations'),
  ].filter(Boolean).join(' ');
  
  return <div className={className}>...</div>;
}
```

## Deployment Integration

### Development Environment

```bash
# .env.local
NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=true
NEXT_PUBLIC_ENABLE_BREADCRUMBS=true
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=true
```

### Staging Environment

```bash
# .env.staging
NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=false  # Test without seasonal theme
NEXT_PUBLIC_ENABLE_BREADCRUMBS=true
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=true
```

### Production Environment (Gradual Rollout)

**Week 1**: Core improvements only
```bash
NEXT_PUBLIC_ENABLE_FULL_SCREEN_LAYOUT=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=false
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=false
NEXT_PUBLIC_ENABLE_BREADCRUMBS=true
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=false
```

**Week 2**: Add animations
```bash
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

**Week 3**: Add decorations
```bash
NEXT_PUBLIC_ENABLE_DECORATIVE_ELEMENTS=true
```

**Week 4**: Enable seasonal theme
```bash
NEXT_PUBLIC_ENABLE_KIROWEEN_THEME=true
```

## Monitoring Integration

### Log Feature Status on Startup

```typescript
// app/layout.tsx or app/page.tsx
import { logFeatureFlags } from '../lib/feature-flags';

export default function RootLayout() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logFeatureFlags();
    }
  }, []);
  
  return <html>...</html>;
}
```

### Track Feature Usage

```typescript
import { isFeatureEnabled } from '../lib/feature-flags';

function trackFeatureUsage(feature: string) {
  if (isFeatureEnabled(feature)) {
    analytics.track('feature_used', { feature });
  }
}
```

## Troubleshooting Integration

### Feature Not Working

1. Check environment variable is set:
   ```bash
   echo $NEXT_PUBLIC_ENABLE_ANIMATIONS
   ```

2. Verify flag is loaded:
   ```typescript
   import { logFeatureFlags } from './lib/feature-flags';
   logFeatureFlags();
   ```

3. Check component is using flag:
   ```typescript
   const enabled = useFeatureFlag('ENABLE_ANIMATIONS');
   console.log('Animations enabled:', enabled);
   ```

### Inconsistent Behavior

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Verify no hardcoded overrides:
   ```bash
   grep -r "setFeatureFlags" src/
   ```

3. Check for cached environment variables:
   ```bash
   unset NEXT_PUBLIC_ENABLE_ANIMATIONS
   ```

## Next Steps

1. ✅ Integrate into TeletextScreen component
2. ✅ Integrate into LayoutManager
3. ✅ Integrate into NavigationIndicators
4. ✅ Integrate into KiroweeenDecorations
5. ✅ Integrate into ThemeContext
6. ✅ Add page 799 to StaticAdapter
7. ✅ Update CSS with conditional classes
8. ✅ Add feature flag logging on startup
9. ✅ Test all feature combinations
10. ✅ Document integration in README

## Resources

- **Core System**: `lib/feature-flags.ts`
- **React Hooks**: `hooks/useFeatureFlags.ts`
- **Usage Guide**: `FEATURE_FLAGS_USAGE.md`
- **Quick Reference**: `FEATURE_FLAGS_QUICK_REFERENCE.md`
- **Examples**: `components/FeatureFlagExample.tsx`
- **Tests**: `lib/__tests__/feature-flags.test.ts`
