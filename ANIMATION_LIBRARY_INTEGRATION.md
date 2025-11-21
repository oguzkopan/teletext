# Animation Library Integration Guide

## Quick Integration Steps

### 1. Import the Animation Library

Add to `app/globals.css` at the top (after Tailwind imports):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import comprehensive animation library */
@import './animations.css';

/* Existing styles below... */
```

### 2. Remove Duplicate Animations

The new `animations.css` library consolidates all animations. You can now remove duplicate animation definitions from:
- `app/globals.css` (existing animation keyframes)
- `app/sports-animations.css` (now included in main library)

**Note**: Keep the sports-animations.css file for now if other code references it, but the animations are now available in the main library.

### 3. Update Component Classes

Replace existing animation classes with library classes:

#### Before:
```tsx
<div className="ceefax-wipe">
```

#### After (same, but now using centralized library):
```tsx
<div className="ceefax-wipe">
```

The class names remain the same, but now come from the centralized library.

### 4. Add Performance Monitoring

Add to your main app component or layout:

```typescript
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    function measureFPS() {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Enable degraded mode if FPS drops below 30
        if (fps < 30) {
          document.body.classList.add('animations-degraded');
        } else {
          document.body.classList.remove('animations-degraded');
        }
      }

      requestAnimationFrame(measureFPS);
    }

    measureFPS();
  }, []);

  return children;
}
```

### 5. Add Accessibility Controls

Add to your settings page or user preferences:

```typescript
function AnimationSettings() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [animationIntensity, setAnimationIntensity] = useState(100);

  useEffect(() => {
    if (!animationsEnabled) {
      document.body.classList.add('animations-disabled');
    } else {
      document.body.classList.remove('animations-disabled');
    }

    if (animationIntensity < 100) {
      document.body.classList.add('animations-reduced');
    } else {
      document.body.classList.remove('animations-reduced');
    }
  }, [animationsEnabled, animationIntensity]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={animationsEnabled}
          onChange={(e) => setAnimationsEnabled(e.target.checked)}
        />
        Enable Animations
      </label>

      <label>
        Animation Intensity: {animationIntensity}%
        <input
          type="range"
          min="0"
          max="100"
          value={animationIntensity}
          onChange={(e) => setAnimationIntensity(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
```

### 6. Use Animation Utilities

Take advantage of utility classes for customization:

```tsx
// Basic animation
<div className="fade-in">Content</div>

// With timing modifiers
<div className="fade-in anim-slow anim-delay-2">
  Slow fade with delay
</div>

// Sequential animations
{items.map((item, index) => (
  <div key={item.id} className="fade-in anim-stagger-1">
    {item.name}
  </div>
))}

// Theme-specific
<div className="haunting-chromatic-aberration intensity-high">
  <div className="haunting-fog-overlay intensity-medium">
    Spooky content
  </div>
</div>

// Interactive elements
<button className="button-press ceefax-button-flash">
  Click me
</button>

// Feedback
<div className="feedback-success-flash">
  <span className="feedback-checkmark">✓</span>
  Saved successfully!
</div>
```

### 7. Clean Up Animation Event Listeners

Add cleanup for animations with will-change:

```typescript
useEffect(() => {
  const element = elementRef.current;
  
  const handleAnimationEnd = () => {
    element.classList.remove('animation-critical');
    element.classList.add('animation-complete');
  };

  element.addEventListener('animationend', handleAnimationEnd);

  return () => {
    element.removeEventListener('animationend', handleAnimationEnd);
  };
}, []);
```

## Migration Checklist

- [ ] Import `animations.css` in `app/globals.css`
- [ ] Test all theme animations (Ceefax, Haunting, High Contrast, ORF)
- [ ] Verify page transitions work correctly
- [ ] Test interactive element animations (buttons, inputs, links)
- [ ] Verify feedback animations (success, error, warnings)
- [ ] Test loading animations
- [ ] Verify decorative animations (weather, sports, markets)
- [ ] Add performance monitoring
- [ ] Add accessibility controls to settings
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Test with animations disabled
- [ ] Test with reduced animation intensity
- [ ] Verify sequential animations with stagger classes
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Verify mobile performance
- [ ] Update documentation references

## Common Patterns

### Page Transition
```typescript
function navigateToPage(pageNumber: string) {
  const screen = document.querySelector('.teletext-screen');
  
  // Add exit animation
  screen.classList.add('fade-out', 'anim-fast');
  
  setTimeout(() => {
    // Load new page content
    loadPage(pageNumber);
    
    // Add entrance animation
    screen.classList.remove('fade-out');
    screen.classList.add('fade-in', 'anim-fast');
  }, 150);
}
```

### Theme Transition
```typescript
function switchTheme(newTheme: string) {
  const body = document.body;
  
  // Show theme banner
  const banner = document.createElement('div');
  banner.className = `theme-banner ${newTheme}`;
  banner.textContent = `${newTheme.toUpperCase()} MODE ACTIVATED`;
  document.body.appendChild(banner);
  
  // Apply theme transition
  body.classList.add('theme-fade-out');
  
  setTimeout(() => {
    // Change theme
    applyTheme(newTheme);
    
    // Fade in new theme
    body.classList.remove('theme-fade-out');
    body.classList.add('theme-fade-in');
    
    // Remove banner after animation
    setTimeout(() => {
      banner.remove();
    }, 2000);
  }, 500);
}
```

### Loading State
```typescript
function LoadingIndicator({ theme }: { theme: string }) {
  const loadingClass = {
    ceefax: 'loading-rotating-line',
    haunting: 'loading-pulsing-skull',
    'high-contrast': 'loading-spinner',
    orf: 'loading-spinner'
  }[theme] || 'loading-spinner';

  return (
    <div className={`${loadingClass} loading-pulse`}>
      Loading...
    </div>
  );
}
```

### Feedback Message
```typescript
function showFeedback(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  const feedback = document.createElement('div');
  feedback.className = `feedback-container feedback-${type} feedback-message-in`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : '!';
  feedback.innerHTML = `
    <span class="feedback-${type === 'success' ? 'checkmark' : 'cross'}">${icon}</span>
    ${message}
  `;
  
  document.body.appendChild(feedback);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    feedback.classList.remove('feedback-message-in');
    feedback.classList.add('feedback-message-out');
    
    setTimeout(() => {
      feedback.remove();
    }, 200);
  }, 3000);
}
```

### Sequential List Animation
```typescript
function AnimatedList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          className="fade-in anim-stagger-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## Troubleshooting

### Animations Not Working

1. **Check import**: Ensure `animations.css` is imported in `globals.css`
2. **Check class names**: Verify class names match library classes
3. **Check accessibility**: Ensure `animations-disabled` is not set
4. **Check browser**: Verify browser supports CSS animations

### Performance Issues

1. **Enable degraded mode**: Add `animations-degraded` class to body
2. **Reduce complexity**: Use `animation-complexity-simple` classes only
3. **Disable decorations**: Add `decorations-disabled` class
4. **Disable backgrounds**: Add `background-effects-disabled` class

### Accessibility Issues

1. **Test with prefers-reduced-motion**: Enable in browser settings
2. **Test with animations disabled**: Add `animations-disabled` class
3. **Test with screen reader**: Verify content is accessible
4. **Test keyboard navigation**: Ensure animations don't interfere

## Resources

- [Animation Library Documentation](./ANIMATION_LIBRARY_DOCUMENTATION.md) - Complete reference
- [Quick Reference Guide](./ANIMATION_QUICK_REFERENCE.md) - Common patterns
- [Task 35 Summary](./TASK_35_IMPLEMENTATION_SUMMARY.md) - Implementation details

## Support

For issues or questions:
1. Check the documentation files
2. Review the CSS comments in `animations.css`
3. Test with browser developer tools
4. Verify accessibility settings

## Next Steps

After integration:
1. Monitor performance in production
2. Gather user feedback on animations
3. Adjust intensity levels based on usage
4. Add new animations as needed
5. Update documentation with new patterns
