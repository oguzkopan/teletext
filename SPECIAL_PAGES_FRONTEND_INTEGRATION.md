# Special Pages Frontend Integration Guide

## Overview
This guide explains how to integrate the animated special pages (404, 666) into the frontend TeletextScreen component.

## Backend Implementation Complete
The backend (StaticAdapter) now provides:
- Frame-by-frame ASCII animation data
- Animation configuration metadata
- Flags for maximum visual effects

## Frontend Integration Steps

### 1. Detect Special Page Animations

Check the page metadata for animation configuration:

```typescript
// In TeletextScreen component
const hasSpecialAnimation = page.meta?.specialPageAnimation;
const hasMultipleAnimations = page.meta?.specialPageAnimations;
const maxEffects = page.meta?.maxVisualEffects === true;
```

### 2. Single Animation (Page 404)

For pages with a single animation (like 404):

```typescript
if (page.meta?.specialPageAnimation) {
  const animConfig = page.meta.specialPageAnimation;
  
  // Create animation configuration for AnimationEngine
  const animation: AnimationConfig = {
    name: animConfig.name,
    type: animConfig.type, // 'ascii-frames'
    duration: animConfig.duration,
    frames: animConfig.frames,
    loop: animConfig.loop
  };
  
  // Get or create target element for animation
  const targetElement = getRowsElement(animConfig.targetRows);
  
  // Play animation using AnimationEngine
  const animationEngine = getAnimationEngine();
  const animationId = animationEngine.playAnimationConfig(
    animation,
    targetElement,
    { loop: true }
  );
  
  // Store animation ID for cleanup
  setActiveAnimationId(animationId);
}
```

### 3. Multiple Animations (Page 666)

For pages with multiple simultaneous animations:

```typescript
if (page.meta?.specialPageAnimations) {
  const animations = page.meta.specialPageAnimations;
  const animationIds: string[] = [];
  
  animations.forEach(animConfig => {
    const animation: AnimationConfig = {
      name: animConfig.name,
      type: animConfig.type,
      duration: animConfig.duration,
      frames: animConfig.frames,
      loop: animConfig.loop
    };
    
    const targetElement = getRowsElement(animConfig.targetRows);
    const animationEngine = getAnimationEngine();
    const animationId = animationEngine.playAnimationConfig(
      animation,
      targetElement,
      { loop: true }
    );
    
    animationIds.push(animationId);
  });
  
  // Store all animation IDs for cleanup
  setActiveAnimationIds(animationIds);
}
```

### 4. Target Row Element Creation

Create a helper function to get/create elements for specific rows:

```typescript
function getRowsElement(targetRows: number[]): HTMLElement {
  // Option 1: Create a container that wraps the target rows
  const container = document.createElement('div');
  container.className = 'animation-target';
  container.style.position = 'absolute';
  
  // Calculate position based on target rows
  const firstRow = Math.min(...targetRows);
  const lastRow = Math.max(...targetRows);
  const rowHeight = 20; // Adjust based on your CSS
  
  container.style.top = `${firstRow * rowHeight}px`;
  container.style.height = `${(lastRow - firstRow + 1) * rowHeight}px`;
  
  // Option 2: Use existing row elements
  // Get the actual row elements from the teletext grid
  const rowElements = targetRows.map(rowIndex => 
    document.querySelector(`[data-row="${rowIndex}"]`)
  );
  
  return container; // or return a wrapper around rowElements
}
```

### 5. Override User Settings

When `maxVisualEffects` is true, ignore user animation preferences:

```typescript
function shouldPlayAnimation(page: TeletextPage): boolean {
  // Check if this is a special page with max effects
  if (page.meta?.maxVisualEffects === true) {
    return true; // Always play, ignore user settings
  }
  
  // Otherwise, respect user settings
  return userSettings.animationsEnabled;
}
```

### 6. Apply Additional Effects

When `haunting` flag is set, apply maximum glitch effects:

```typescript
if (page.meta?.haunting === true) {
  // Apply CSS classes for maximum effects
  screenElement.classList.add('haunting-mode');
  screenElement.classList.add('max-glitch');
  screenElement.classList.add('chromatic-aberration');
  screenElement.classList.add('screen-flicker');
  
  // If maxVisualEffects is also true, add even more
  if (page.meta?.maxVisualEffects === true) {
    screenElement.classList.add('screen-shake');
    screenElement.classList.add('fog-overlay');
  }
}
```

### 7. Cleanup on Page Navigation

Clean up animations when navigating away:

```typescript
useEffect(() => {
  return () => {
    // Cleanup function
    const animationEngine = getAnimationEngine();
    
    if (activeAnimationId) {
      animationEngine.stopAnimation(activeAnimationId);
    }
    
    if (activeAnimationIds) {
      activeAnimationIds.forEach(id => 
        animationEngine.stopAnimation(id)
      );
    }
    
    // Remove effect classes
    screenElement.classList.remove('haunting-mode');
    screenElement.classList.remove('max-glitch');
    // ... remove other classes
  };
}, [page.id]);
```

## Complete Integration Example

```typescript
// TeletextScreen.tsx
import { useEffect, useState } from 'react';
import { getAnimationEngine, AnimationConfig } from '@/lib/animation-engine';
import { TeletextPage } from '@/types/teletext';

export function TeletextScreen({ page }: { page: TeletextPage }) {
  const [activeAnimationIds, setActiveAnimationIds] = useState<string[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!screenRef.current) return;
    
    const animationEngine = getAnimationEngine();
    const newAnimationIds: string[] = [];
    
    // Check for special page animations
    if (page.meta?.specialPageAnimation) {
      // Single animation (Page 404)
      const animConfig = page.meta.specialPageAnimation;
      const animation: AnimationConfig = {
        name: animConfig.name,
        type: animConfig.type,
        duration: animConfig.duration,
        frames: animConfig.frames,
        loop: animConfig.loop
      };
      
      const targetElement = createAnimationTarget(
        screenRef.current,
        animConfig.targetRows
      );
      
      const animId = animationEngine.playAnimationConfig(
        animation,
        targetElement,
        { loop: true }
      );
      
      newAnimationIds.push(animId);
    }
    
    if (page.meta?.specialPageAnimations) {
      // Multiple animations (Page 666)
      page.meta.specialPageAnimations.forEach(animConfig => {
        const animation: AnimationConfig = {
          name: animConfig.name,
          type: animConfig.type,
          duration: animConfig.duration,
          frames: animConfig.frames,
          loop: animConfig.loop
        };
        
        const targetElement = createAnimationTarget(
          screenRef.current!,
          animConfig.targetRows
        );
        
        const animId = animationEngine.playAnimationConfig(
          animation,
          targetElement,
          { loop: true }
        );
        
        newAnimationIds.push(animId);
      });
    }
    
    // Apply visual effects
    if (page.meta?.haunting === true) {
      screenRef.current.classList.add('haunting-mode');
      screenRef.current.classList.add('max-glitch');
    }
    
    if (page.meta?.maxVisualEffects === true) {
      screenRef.current.classList.add('max-visual-effects');
    }
    
    setActiveAnimationIds(newAnimationIds);
    
    // Cleanup
    return () => {
      newAnimationIds.forEach(id => 
        animationEngine.stopAnimation(id)
      );
      
      if (screenRef.current) {
        screenRef.current.classList.remove('haunting-mode');
        screenRef.current.classList.remove('max-glitch');
        screenRef.current.classList.remove('max-visual-effects');
      }
    };
  }, [page.id]);
  
  return (
    <div ref={screenRef} className="teletext-screen">
      {/* Render page content */}
      {page.rows.map((row, index) => (
        <div key={index} data-row={index} className="teletext-row">
          {row}
        </div>
      ))}
    </div>
  );
}

function createAnimationTarget(
  container: HTMLElement,
  targetRows: number[]
): HTMLElement {
  // Create a div that overlays the target rows
  const target = document.createElement('div');
  target.className = 'animation-target';
  target.style.position = 'absolute';
  target.style.whiteSpace = 'pre';
  target.style.fontFamily = 'inherit';
  target.style.fontSize = 'inherit';
  target.style.lineHeight = 'inherit';
  
  // Position based on first target row
  const firstRow = Math.min(...targetRows);
  const rowElements = container.querySelectorAll('.teletext-row');
  const firstRowElement = rowElements[firstRow] as HTMLElement;
  
  if (firstRowElement) {
    const rect = firstRowElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    target.style.top = `${rect.top - containerRect.top}px`;
    target.style.left = `${rect.left - containerRect.left}px`;
  }
  
  container.appendChild(target);
  return target;
}
```

## CSS Requirements

Add these CSS classes for visual effects:

```css
/* Haunting mode effects */
.haunting-mode {
  position: relative;
}

.max-glitch {
  animation: glitch 0.3s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
}

.chromatic-aberration {
  position: relative;
}

.chromatic-aberration::before,
.chromatic-aberration::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
}

.chromatic-aberration::before {
  color: #ff0000;
  transform: translate(-2px, 0);
  opacity: 0.5;
}

.chromatic-aberration::after {
  color: #00ffff;
  transform: translate(2px, 0);
  opacity: 0.5;
}

.screen-flicker {
  animation: flicker 5s infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
  51% { opacity: 1; }
  52% { opacity: 0.98; }
  53% { opacity: 1; }
}

.screen-shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1px, 1px); }
  20% { transform: translate(1px, -1px); }
  30% { transform: translate(-1px, -1px); }
  40% { transform: translate(1px, 1px); }
  50% { transform: translate(-1px, 1px); }
  60% { transform: translate(1px, -1px); }
  70% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  90% { transform: translate(-1px, 1px); }
}

.max-visual-effects {
  /* Combine all effects */
  animation: glitch 0.3s infinite, flicker 5s infinite, shake 0.5s infinite;
}

/* Animation target positioning */
.animation-target {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}
```

## Testing Checklist

- [ ] Navigate to page 404
- [ ] Verify broken TV animation plays
- [ ] Verify animation loops continuously
- [ ] Navigate to page 666
- [ ] Verify all three animations play simultaneously
- [ ] Verify demonic 666 pulse animation
- [ ] Verify pentagram border pulse
- [ ] Verify warning text shimmer
- [ ] Disable animations in settings
- [ ] Verify pages 404 and 666 still animate (maxVisualEffects)
- [ ] Verify other pages respect animation settings
- [ ] Check performance (should maintain 60fps)
- [ ] Test on different browsers
- [ ] Test on mobile devices

## Performance Considerations

1. **Use CSS transforms** for visual effects (GPU accelerated)
2. **Limit DOM updates** - only update animated elements
3. **Clean up animations** when navigating away
4. **Use requestAnimationFrame** for smooth frame updates
5. **Monitor memory** - ensure no leaks from looping animations

## Troubleshooting

**Animations not playing:**
- Check that AnimationEngine is initialized
- Verify animation configuration is correct
- Check browser console for errors

**Animations stuttering:**
- Reduce animation complexity
- Check for other heavy operations
- Verify CSS is using transforms, not position

**Multiple animations out of sync:**
- Each animation runs independently
- This is expected and creates dynamic effect
- Adjust frame counts/durations if needed

**Effects not applying:**
- Verify CSS classes are being added
- Check CSS specificity
- Ensure styles are loaded
