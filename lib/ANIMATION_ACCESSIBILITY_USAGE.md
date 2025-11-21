# Animation Accessibility

Comprehensive accessibility features for animations in Modern Teletext, including system preference detection, user settings, and static alternatives.

## Requirements

- **10.5**: Respect `prefers-reduced-motion` media query
- **12.5**: Allow users to adjust animation intensity in settings

## Features

### System Preference Detection

Automatically detects and respects the user's `prefers-reduced-motion` system preference:

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';

const manager = getAnimationAccessibility();
const systemPrefersReduced = manager.getSystemPreference();

if (systemPrefersReduced) {
  console.log('User prefers reduced motion');
}
```

### User Settings

Users can control animations through page 701 (Effects & Animations):

- **Enable/Disable All Animations**: Master switch for all animations
- **Animation Intensity**: 0-100% intensity slider
- **Transitions**: Enable/disable page transitions
- **Decorations**: Enable/disable decorative elements
- **Background Effects**: Enable/disable background animations

### Animation Decision Logic

The system determines whether to show animations based on:

1. User's master animation switch
2. System `prefers-reduced-motion` preference (if user respects it)
3. Animation intensity setting
4. Type-specific settings (transitions, decorations, backgrounds)

```typescript
import { shouldAnimate, shouldAnimateType } from '@/lib/animation-accessibility';

// Check if any animations should be shown
if (shouldAnimate()) {
  // Show animations
}

// Check specific animation type
if (shouldAnimateType('transition')) {
  // Show page transitions
}

if (shouldAnimateType('decoration')) {
  // Show decorative elements
}

if (shouldAnimateType('background')) {
  // Show background effects
}
```

## Usage

### Basic Usage

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';

const manager = getAnimationAccessibility();

// Check if animations should be shown
if (manager.shouldAnimate()) {
  // Play animation
  playAnimation();
} else {
  // Show static alternative
  showStaticContent();
}
```

### React Hook

```tsx
import { useAnimationAccessibility } from '@/hooks/useAnimationAccessibility';

function MyComponent() {
  const {
    shouldAnimate,
    settings,
    disableAnimations,
    setIntensity
  } = useAnimationAccessibility();

  return (
    <div>
      {shouldAnimate && <AnimatedElement />}
      {!shouldAnimate && <StaticElement />}
      
      <button onClick={disableAnimations}>
        Disable Animations
      </button>
      
      <input
        type="range"
        min="0"
        max="100"
        value={settings.intensity}
        onChange={(e) => setIntensity(Number(e.target.value))}
      />
    </div>
  );
}
```

### Type-Specific Checks

```tsx
import { useAnimationType } from '@/hooks/useAnimationAccessibility';

function BackgroundEffect() {
  const shouldShow = useAnimationType('background');
  
  if (!shouldShow) return null;
  
  return <div className="background-effect">...</div>;
}

function PageTransition() {
  const shouldShow = useAnimationType('transition');
  
  return (
    <div className={shouldShow ? 'with-transition' : 'no-transition'}>
      Content
    </div>
  );
}
```

### Duration Adjustment

```tsx
import { useAnimationDuration } from '@/hooks/useAnimationAccessibility';

function AnimatedComponent() {
  const duration = useAnimationDuration(1000); // Base duration 1000ms
  
  return (
    <div style={{ animationDuration: `${duration}ms` }}>
      Animated content
    </div>
  );
}
```

### Applying Animations with Accessibility

```typescript
import { applyAccessibleAnimation } from '@/lib/animation-accessibility';

const element = document.getElementById('my-element');

// Apply animation with accessibility check
const wasApplied = applyAccessibleAnimation(
  element,
  'fade-in-animation',
  'transition'
);

if (wasApplied) {
  console.log('Animation applied');
} else {
  console.log('Animation skipped, static alternative shown');
}
```

## CSS Classes

The system automatically applies CSS classes to the `<body>` element:

### Animation State Classes

- `animations-enabled`: All animations are enabled
- `animations-disabled`: All animations are disabled
- `animations-reduced`: Animation intensity is less than 100%
- `system-prefers-reduced-motion`: System prefers reduced motion

### Type-Specific Classes

- `transitions-disabled`: Page transitions are disabled
- `decorations-disabled`: Decorative elements are disabled
- `background-effects-disabled`: Background effects are disabled

### CSS Usage

```css
/* Hide decorations when disabled */
body.decorations-disabled .decoration {
  display: none;
}

/* Reduce animation duration when intensity is reduced */
body.animations-reduced * {
  animation-duration: calc(var(--animation-duration) * 0.5);
}

/* Disable all animations when user preference is set */
body.animations-disabled *,
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

## Static Alternatives

Always provide static alternatives for animated content:

```tsx
function ContentDisplay() {
  const { shouldAnimate } = useAnimationAccessibility();
  
  return (
    <div>
      {shouldAnimate ? (
        <div className="animated-content">
          <AnimatedLogo />
        </div>
      ) : (
        <div className="static-content">
          <StaticLogo />
        </div>
      )}
    </div>
  );
}
```

Or use CSS:

```css
.animated-content {
  display: block;
}

.static-content {
  display: none;
}

body.animations-disabled .animated-content,
@media (prefers-reduced-motion: reduce) {
  .animated-content {
    display: none;
  }
  
  .static-content {
    display: block;
  }
}
```

## Settings Management

### Update Settings

```typescript
import { getAnimationAccessibility } from '@/lib/animation-accessibility';

const manager = getAnimationAccessibility();

// Update multiple settings
manager.updateSettings({
  enabled: true,
  intensity: 75,
  transitionsEnabled: true,
  decorationsEnabled: false,
  backgroundEffectsEnabled: true
});

// Or use convenience methods
manager.enableAnimations();
manager.disableAnimations();
manager.setIntensity(50);
```

### Persist Settings

Settings are automatically saved to localStorage and loaded on initialization:

```typescript
// Save manually (usually automatic)
manager.saveToLocalStorage();

// Load manually (usually automatic)
manager.loadFromLocalStorage();
```

### Reset to Defaults

```typescript
manager.resetToDefaults();
```

## Event Listeners

Listen for accessibility state changes:

```typescript
const manager = getAnimationAccessibility();

const unsubscribe = manager.addListener((state) => {
  console.log('Animation accessibility state changed:', state);
  console.log('Should animate:', state.shouldAnimate);
  console.log('System prefers reduced:', state.systemPrefersReduced);
  console.log('User settings:', state.userSettings);
});

// Unsubscribe when done
unsubscribe();
```

## Integration with Animation Engine

The Animation Engine automatically checks accessibility settings:

```typescript
import { getAnimationEngine } from '@/lib/animation-engine';

const engine = getAnimationEngine();

// Animation will be skipped if accessibility settings prevent it
const animationId = engine.playAnimation('fade-in', element);

if (!animationId) {
  console.log('Animation was skipped due to accessibility settings');
}
```

## Testing

### Unit Tests

```typescript
import {
  getAnimationAccessibility,
  resetAnimationAccessibility
} from '@/lib/animation-accessibility';

describe('Animation Accessibility', () => {
  beforeEach(() => {
    resetAnimationAccessibility();
  });

  it('should disable animations', () => {
    const manager = getAnimationAccessibility();
    manager.disableAnimations();
    
    expect(manager.shouldAnimate()).toBe(false);
  });
});
```

### React Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAnimationAccessibility } from '@/hooks/useAnimationAccessibility';

it('should disable animations', () => {
  const { result } = renderHook(() => useAnimationAccessibility());
  
  act(() => {
    result.current.disableAnimations();
  });
  
  expect(result.current.shouldAnimate).toBe(false);
});
```

## Accessibility Best Practices

1. **Always provide static alternatives**: Ensure all functionality works without animations
2. **Respect system preferences**: Honor `prefers-reduced-motion` by default
3. **Make settings discoverable**: Clearly indicate where users can control animations (page 701)
4. **Test without animations**: Verify all features work with animations disabled
5. **Use semantic HTML**: Don't rely solely on animations to convey information
6. **Provide keyboard navigation**: Ensure all interactive elements work without mouse
7. **Test with screen readers**: Verify animations don't interfere with assistive technology

## Browser Support

- Modern browsers with `matchMedia` support
- Graceful degradation for older browsers
- Works in JSDOM for testing

## Performance

- Minimal overhead when animations are disabled
- Efficient event listener management
- Automatic cleanup on unmount
- LocalStorage caching for instant load

## Debugging

In development mode, the manager is exposed on the window object:

```javascript
// In browser console
window.animationAccessibility.getState();
window.animationAccessibility.disableAnimations();
window.animationAccessibility.getSettings();
```

## Examples

### Complete Component Example

```tsx
import { useAnimationAccessibility } from '@/hooks/useAnimationAccessibility';

function AnimatedPage() {
  const {
    shouldAnimate,
    shouldAnimateType,
    settings,
    updateSettings
  } = useAnimationAccessibility();

  return (
    <div className="page">
      {/* Page transition */}
      {shouldAnimateType('transition') && (
        <div className="page-transition" />
      )}
      
      {/* Main content */}
      <div className={shouldAnimate ? 'animated' : 'static'}>
        <h1>Welcome</h1>
        <p>Content here</p>
      </div>
      
      {/* Background effects */}
      {shouldAnimateType('background') && (
        <div className="background-effects">
          <div className="scanlines" />
          <div className="noise" />
        </div>
      )}
      
      {/* Decorative elements */}
      {shouldAnimateType('decoration') && (
        <div className="decorations">
          <div className="floating-ghost" />
          <div className="pumpkin" />
        </div>
      )}
      
      {/* Settings control */}
      <div className="settings">
        <label>
          Animation Intensity: {settings.intensity}%
          <input
            type="range"
            min="0"
            max="100"
            value={settings.intensity}
            onChange={(e) => updateSettings({
              intensity: Number(e.target.value)
            })}
          />
        </label>
      </div>
    </div>
  );
}
```

## Related Documentation

- [Animation Engine Usage](./ANIMATION_ENGINE_USAGE.md)
- [Animation Performance Optimization](./ANIMATION_PERFORMANCE_OPTIMIZATION.md)
- [Theme Transition Usage](./THEME_TRANSITION_USAGE.md)
