# Loading Text Rotation Usage Guide

## Overview

The Loading Text Rotation system provides rotating loading messages that change every 2 seconds during loading states. It supports theme-appropriate messages for different visual themes (Ceefax, Haunting, High Contrast, ORF).

**Requirements:** 14.5

## Features

- ✅ Automatic message rotation every 2 seconds
- ✅ Theme-specific loading messages
- ✅ Customizable rotation interval
- ✅ Custom message arrays
- ✅ Elapsed time tracking
- ✅ React hook for easy integration
- ✅ Automatic cleanup and lifecycle management

## Basic Usage

### Using the React Hook (Recommended)

```tsx
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';

function LoadingComponent({ isLoading, theme }) {
  const { currentMessage } = useLoadingTextRotation({
    theme,
    enabled: isLoading
  });

  if (!isLoading) return null;

  return (
    <div className="loading-indicator">
      {currentMessage}
    </div>
  );
}
```

### Using the Class Directly

```typescript
import { LoadingTextRotation } from '@/lib/loading-text-rotation';

const rotation = new LoadingTextRotation(
  { theme: 'ceefax' },
  (message) => {
    console.log('New message:', message);
  }
);

// Start rotation
rotation.start();

// Stop rotation
rotation.stop();
```

## Theme-Specific Messages

### Ceefax Theme
```
LOADING...
FETCHING DATA...
ALMOST THERE...
PLEASE WAIT...
RETRIEVING PAGE...
```

### Haunting/Kiroween Theme
```
SUMMONING...
AWAKENING SPIRITS...
CONJURING DATA...
ENTERING THE VOID...
CHANNELING...
MANIFESTING...
```

### High Contrast Theme
```
LOADING...
FETCHING...
PROCESSING...
PLEASE WAIT...
```

### ORF Theme
```
LADEN...
DATEN ABRUFEN...
BITTE WARTEN...
VERARBEITUNG...
FAST FERTIG...
```

## Advanced Usage

### Custom Rotation Interval

```tsx
const { currentMessage } = useLoadingTextRotation({
  theme: 'ceefax',
  rotationInterval: 1000, // Rotate every 1 second
  enabled: isLoading
});
```

### Custom Messages

```typescript
const rotation = new LoadingTextRotation({ theme: 'ceefax' });

rotation.setMessages([
  'CUSTOM MESSAGE 1',
  'CUSTOM MESSAGE 2',
  'CUSTOM MESSAGE 3'
]);

rotation.start();
```

### Tracking State

```tsx
const { 
  currentMessage, 
  elapsedTime, 
  hasRotated,
  isActive 
} = useLoadingTextRotation({
  theme: 'ceefax',
  enabled: isLoading
});

// Check if loading has been active for more than 2 seconds
if (hasRotated) {
  console.log('Loading is taking longer than expected');
}

// Display elapsed time
console.log(`Loading for ${elapsedTime}ms`);
```

### Dynamic Theme Switching

```tsx
function LoadingWithTheme() {
  const [theme, setTheme] = useState('ceefax');
  const { currentMessage } = useLoadingTextRotation({
    theme,
    enabled: true
  });

  return (
    <div>
      <div>{currentMessage}</div>
      <button onClick={() => setTheme('haunting')}>
        Switch to Haunting
      </button>
    </div>
  );
}
```

## Integration with TeletextScreen

```tsx
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';

function TeletextScreen({ loading, theme }) {
  const { currentMessage } = useLoadingTextRotation({
    theme: theme.name,
    enabled: loading
  });

  return (
    <div className="teletext-screen">
      {loading && (
        <div className="loading-indicator">
          <span>{currentMessage}</span>
        </div>
      )}
      {/* Rest of screen content */}
    </div>
  );
}
```

## Integration with Animation Engine

```tsx
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';
import { getAnimationEngine } from '@/lib/animation-engine';

function AnimatedLoading({ loading, theme }) {
  const { currentMessage } = useLoadingTextRotation({
    theme,
    enabled: loading
  });
  
  const loadingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (loading && loadingRef.current) {
      const engine = getAnimationEngine();
      engine.setTheme(theme);
      const animId = engine.playLoadingIndicator(loadingRef.current);
      
      return () => engine.stopAnimation(animId);
    }
  }, [loading, theme]);

  if (!loading) return null;

  return (
    <div className="loading-container">
      <span ref={loadingRef}>{currentMessage}</span>
    </div>
  );
}
```

## API Reference

### LoadingTextRotation Class

#### Constructor
```typescript
new LoadingTextRotation(
  config?: Partial<LoadingTextConfig>,
  onUpdate?: (message: string) => void
)
```

#### Methods

- `start()` - Start rotating messages
- `stop()` - Stop rotating messages
- `getCurrentMessage()` - Get current message
- `getMessages()` - Get all messages for current theme
- `setTheme(theme: string)` - Change theme
- `setMessages(messages: string[])` - Set custom messages
- `setRotationInterval(interval: number)` - Change rotation speed
- `getElapsedTime()` - Get time since start
- `hasRotated()` - Check if at least one rotation occurred
- `isActive()` - Check if rotation is running

### useLoadingTextRotation Hook

#### Parameters
```typescript
interface UseLoadingTextRotationOptions {
  theme?: string;              // Default: 'ceefax'
  rotationInterval?: number;   // Default: 2000ms
  enabled?: boolean;           // Default: true
}
```

#### Return Value
```typescript
interface UseLoadingTextRotationReturn {
  currentMessage: string;      // Current loading message
  messages: string[];          // All available messages
  elapsedTime: number;         // Time since start (ms)
  hasRotated: boolean;         // Has rotated at least once
  isActive: boolean;           // Is rotation active
}
```

### Convenience Functions

```typescript
// Get messages for a theme
getLoadingMessages(theme: string): string[]

// Create rotation instance
createLoadingTextRotation(
  theme?: string,
  onUpdate?: (message: string) => void
): LoadingTextRotation
```

## Best Practices

1. **Use the React Hook** - Prefer `useLoadingTextRotation` for React components
2. **Enable/Disable Properly** - Set `enabled` based on actual loading state
3. **Match Theme** - Always pass the current theme to get appropriate messages
4. **Cleanup** - The hook handles cleanup automatically
5. **Performance** - Rotation uses efficient timers, no performance impact

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';

test('rotates messages', () => {
  jest.useFakeTimers();
  
  const { result } = renderHook(() => 
    useLoadingTextRotation({ theme: 'ceefax', enabled: true })
  );

  expect(result.current.currentMessage).toBe('LOADING...');

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(result.current.currentMessage).toBe('FETCHING DATA...');

  jest.useRealTimers();
});
```

## Troubleshooting

### Messages Not Rotating

**Problem:** Messages stay the same
**Solution:** Ensure `enabled` is `true` and check that timers are running

### Wrong Theme Messages

**Problem:** Seeing wrong messages for theme
**Solution:** Verify theme name matches exactly ('ceefax', 'haunting', 'high-contrast', 'orf')

### Memory Leaks

**Problem:** Timers not cleaning up
**Solution:** Use the React hook which handles cleanup automatically

### Custom Messages Not Working

**Problem:** Custom messages not displaying
**Solution:** Ensure messages array is not empty and call `setMessages()` before `start()`

## Examples

### Complete Loading Screen

```tsx
import { useLoadingTextRotation } from '@/hooks/useLoadingTextRotation';
import { getAnimationEngine } from '@/lib/animation-engine';

function LoadingScreen({ isLoading, theme }) {
  const { currentMessage, elapsedTime, hasRotated } = useLoadingTextRotation({
    theme,
    enabled: isLoading
  });
  
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      const engine = getAnimationEngine();
      engine.setTheme(theme);
      const animId = engine.playLoadingIndicator(loadingRef.current);
      
      return () => engine.stopAnimation(animId);
    }
  }, [isLoading, theme]);

  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      <div ref={loadingRef} className="loading-animation">
        {currentMessage}
      </div>
      {hasRotated && (
        <div className="loading-hint">
          This is taking longer than usual...
        </div>
      )}
      <div className="loading-time">
        {Math.floor(elapsedTime / 1000)}s
      </div>
    </div>
  );
}
```

### Conditional Loading Messages

```tsx
function SmartLoading({ isLoading, theme, pageType }) {
  const customMessages = useMemo(() => {
    switch (pageType) {
      case 'news':
        return ['FETCHING HEADLINES...', 'LOADING NEWS...', 'ALMOST READY...'];
      case 'sports':
        return ['LOADING SCORES...', 'FETCHING RESULTS...', 'UPDATING...'];
      case 'weather':
        return ['CHECKING FORECAST...', 'LOADING WEATHER...', 'ALMOST THERE...'];
      default:
        return undefined; // Use theme defaults
    }
  }, [pageType]);

  const rotation = useRef<LoadingTextRotation>();

  useEffect(() => {
    if (customMessages && rotation.current) {
      rotation.current.setMessages(customMessages);
    }
  }, [customMessages]);

  const { currentMessage } = useLoadingTextRotation({
    theme,
    enabled: isLoading
  });

  return isLoading ? <div>{currentMessage}</div> : null;
}
```

## Related Documentation

- [Animation Engine Usage](./ANIMATION_ENGINE_USAGE.md)
- [Theme Context Usage](./THEME_TRANSITION_USAGE.md)
- [Progress Indicators Usage](./PROGRESS_INDICATORS_USAGE.md)
