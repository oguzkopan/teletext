# Accessibility Features and Settings

## Overview

Modern Teletext includes comprehensive accessibility features to ensure the application is usable by everyone, including users with visual impairments, motion sensitivity, and those who rely on keyboard navigation or screen readers.

## Core Accessibility Features

### 1. Reduced Motion Support

The application respects the `prefers-reduced-motion` media query and provides user controls for animation settings.

**Automatic Detection:**
```typescript
import { shouldReduceMotion } from '@/lib/animation-accessibility';

if (shouldReduceMotion()) {
  // Skip animations or use instant transitions
  element.style.opacity = '1';
} else {
  // Play normal animations
  await animationEngine.playAnimation('fade-in', element);
}
```

**User Settings:**
- Page 701: Animation Settings
- Toggle animations on/off
- Adjust animation intensity (0-100%)
- Control individual animation types

### 2. Keyboard Navigation

All features are fully accessible via keyboard:

**Navigation Keys:**
- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter`: Activate buttons and links
- `Arrow Keys`: Navigate multi-page content
- `0-9`: Enter page numbers
- `R/G/Y/B`: Colored button navigation
- `Escape`: Cancel input or go back

**Keyboard Shortcuts:**
- `Ctrl+H`: Go to home (page 100)
- `Ctrl+B`: Go back in history
- `Ctrl+F`: Go forward in history
- `F1-F10`: Quick access to favorite pages

### 3. Screen Reader Support

**ARIA Labels:**
```typescript
<div
  role="button"
  aria-label="Navigate to page 200"
  tabIndex={0}
>
  200. News Index
</div>
```

**Live Regions:**
```typescript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

**Semantic HTML:**
```typescript
<nav aria-label="Page navigation">
  <button aria-label="Go to index">100</button>
  <button aria-label="Go to news">200</button>
</nav>
```

### 4. High Contrast Theme

Dedicated high contrast theme with:
- Maximum color contrast (WCAG AAA compliant)
- No distracting effects
- Clear visual indicators
- Simplified animations

**Activation:**
- Page 700: Theme Selection
- Select "High Contrast" theme
- Automatically applied if system preference detected

### 5. Focus Indicators

Clear visual focus indicators for keyboard navigation:

```css
.interactive-element:focus {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
  background-color: var(--focus-background);
}

.interactive-element:focus-visible {
  outline: 3px solid var(--focus-color);
  outline-offset: 3px;
}
```

### 6. Text Alternatives

All visual content has text alternatives:
- ASCII art has `aria-label` descriptions
- Icons have text labels
- Images have alt text
- Decorative elements marked with `aria-hidden="true"`

## Animation Settings (Page 701)

### Animation Controls

**Master Toggle:**
```typescript
// Enable/disable all animations
setAnimationsEnabled(false);  // Disables all animations
```

**Animation Intensity:**
```typescript
// Adjust animation intensity (0-100%)
setAnimationIntensity(50);  // 50% intensity
```

**Individual Controls:**
- Page Transitions: On/Off
- Loading Indicators: On/Off
- Button Feedback: On/Off
- Background Effects: On/Off
- Decorative Elements: On/Off

### Settings Interface

```
┌────────────────────────────────────────┐
│ ANIMATION SETTINGS                 701 │
├────────────────────────────────────────┤
│                                        │
│ Master Control                         │
│ [ ] Enable Animations                  │
│                                        │
│ Animation Intensity: 50%               │
│ [▓▓▓▓▓░░░░░]                          │
│                                        │
│ Individual Controls                    │
│ [✓] Page Transitions                   │
│ [✓] Loading Indicators                 │
│ [✓] Button Feedback                    │
│ [ ] Background Effects                 │
│ [ ] Decorative Elements                │
│                                        │
│ Presets                                │
│ 1. Full Animations                     │
│ 2. Reduced Motion                      │
│ 3. Essential Only                      │
│ 4. No Animations                       │
│                                        │
│ [SAVE] [RESET TO DEFAULTS]            │
└────────────────────────────────────────┘
```

## Implementation Guide

### Detecting User Preferences

```typescript
// lib/animation-accessibility.ts

export function shouldReduceMotion(): boolean {
  // Check system preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    return true;
  }
  
  // Check user setting
  const userPreference = getUserAnimationPreference();
  if (userPreference === 'disabled') {
    return true;
  }
  
  return false;
}

export function getAnimationIntensity(): number {
  if (shouldReduceMotion()) {
    return 0;
  }
  
  const userIntensity = getUserAnimationIntensity();
  return userIntensity ?? 100;
}
```

### Applying Accessibility Settings

```typescript
// components/TeletextScreen.tsx

function TeletextScreen({ page }: Props) {
  const animationEnabled = !shouldReduceMotion();
  const intensity = getAnimationIntensity();
  
  return (
    <div
      className="teletext-screen"
      data-animation-enabled={animationEnabled}
      style={{
        '--animation-intensity': intensity / 100
      }}
    >
      {/* Content */}
    </div>
  );
}
```

### CSS with Accessibility

```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Use animation intensity variable */
.animated-element {
  animation-duration: calc(300ms * var(--animation-intensity, 1));
  opacity: calc(0.5 + 0.5 * var(--animation-intensity, 1));
}
```

### Providing Static Alternatives

```typescript
function AnimatedContent({ content }: Props) {
  const animationEnabled = !shouldReduceMotion();
  
  if (!animationEnabled) {
    // Static version
    return <div>{content}</div>;
  }
  
  // Animated version
  return (
    <div className="animated-content">
      {content}
    </div>
  );
}
```

## Keyboard Navigation Implementation

### Focus Management

```typescript
// hooks/useFocusManagement.ts

export function useFocusManagement() {
  const focusableElements = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef(0);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (e.shiftKey) {
        // Previous element
        currentFocusIndex.current = Math.max(0, currentFocusIndex.current - 1);
      } else {
        // Next element
        currentFocusIndex.current = Math.min(
          focusableElements.current.length - 1,
          currentFocusIndex.current + 1
        );
      }
      
      focusableElements.current[currentFocusIndex.current]?.focus();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return { focusableElements };
}
```

### Skip Links

```typescript
function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
    </div>
  );
}
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Screen Reader Optimization

### Announcing Page Changes

```typescript
function announcePageChange(pageTitle: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = `Navigated to ${pageTitle}`;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```typescript
<span className="sr-only">
  Page 201 of 300. Top Headlines. Last updated 5 minutes ago.
</span>
```

### ARIA Live Regions

```typescript
function LoadingIndicator({ isLoading }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true">⠋</span>
          <span className="sr-only">Loading content...</span>
        </>
      ) : (
        <span className="sr-only">Content loaded</span>
      )}
    </div>
  );
}
```

## Color Contrast

### WCAG Compliance

All color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

```typescript
// High contrast theme (WCAG AAA - 7:1)
const HIGH_CONTRAST_THEME = {
  background: '#000000',  // Black
  text: '#ffffff',        // White
  // Contrast ratio: 21:1
};

// Standard theme (WCAG AA - 4.5:1)
const STANDARD_THEME = {
  background: '#000000',  // Black
  text: '#ffffff',        // White
  // Contrast ratio: 21:1
};
```

### Contrast Checker

```typescript
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function meetsWCAG_AA(ratio: number): boolean {
  return ratio >= 4.5;
}

function meetsWCAG_AAA(ratio: number): boolean {
  return ratio >= 7;
}
```

## Testing Accessibility

### Automated Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TeletextScreen page={mockPage} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Testing

```typescript
describe('Keyboard Navigation', () => {
  it('should navigate with Tab key', () => {
    render(<Navigation />);
    
    const buttons = screen.getAllByRole('button');
    
    // Tab to first button
    userEvent.tab();
    expect(buttons[0]).toHaveFocus();
    
    // Tab to second button
    userEvent.tab();
    expect(buttons[1]).toHaveFocus();
  });
  
  it('should activate with Enter key', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Screen Reader Testing

```typescript
describe('Screen Reader', () => {
  it('should have proper ARIA labels', () => {
    render(<Navigation />);
    
    const button = screen.getByRole('button', { name: 'Navigate to page 200' });
    expect(button).toBeInTheDocument();
  });
  
  it('should announce page changes', () => {
    render(<TeletextScreen page={mockPage} />);
    
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Navigated to Top Headlines');
  });
});
```

## Best Practices

### 1. Always Provide Text Alternatives

```typescript
// Good
<button aria-label="Navigate to news page">
  📰
</button>

// Avoid
<button>
  📰
</button>
```

### 2. Use Semantic HTML

```typescript
// Good
<nav>
  <button>Home</button>
  <button>News</button>
</nav>

// Avoid
<div>
  <div onClick={handleClick}>Home</div>
  <div onClick={handleClick}>News</div>
</div>
```

### 3. Respect User Preferences

```typescript
// Good
if (shouldReduceMotion()) {
  // Skip animation
}

// Avoid
// Always animate regardless of preferences
animationEngine.playAnimation('complex', element);
```

### 4. Provide Multiple Navigation Methods

```typescript
// Support multiple input methods
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="Navigate to page 200"
>
  200. News
</button>
```

### 5. Test with Real Users

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test with keyboard only (no mouse)
- Test with reduced motion enabled
- Test with high contrast mode
- Get feedback from users with disabilities

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility audits
- [NVDA](https://www.nvaccess.org/) - Free screen reader

### Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - ARIA patterns
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Accessibility documentation

## See Also

- [ANIMATION_ENGINE_API.md](./ANIMATION_ENGINE_API.md) - Animation Engine API
- [THEME_CONFIGURATION.md](./THEME_CONFIGURATION.md) - Theme configuration
- [lib/animation-accessibility.ts](./lib/animation-accessibility.ts) - Accessibility utilities
- [hooks/useAnimationAccessibility.ts](./hooks/useAnimationAccessibility.ts) - Accessibility hooks
