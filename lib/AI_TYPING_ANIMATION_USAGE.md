# AI Typing Animation Usage Guide

The AI Typing Animation system provides character-by-character text reveal animation for AI-generated content, creating a more natural and engaging user experience.

## Requirements

- **24.1**: Display typing animation with blinking cursor
- **24.2**: Reveal text character-by-character at 50-100 chars/second
- **24.3**: Allow users to skip typing animation by pressing any key
- **24.4**: Display navigation options after typing completes
- **24.5**: Display "thinking..." animation while waiting for AI response

## Features

- ✅ Character-by-character text reveal
- ✅ Blinking cursor during typing
- ✅ "Thinking..." animation with animated dots
- ✅ Configurable typing speed (50-100 chars/sec)
- ✅ Skip functionality (press any key)
- ✅ Progress tracking
- ✅ Completion callbacks
- ✅ React hook for easy integration

## Basic Usage

### Using the React Hook (Recommended)

```typescript
import { useAITypingAnimation } from '@/hooks/useAITypingAnimation';

function MyComponent() {
  const { 
    displayText, 
    startTyping, 
    startThinking, 
    isActive,
    state 
  } = useAITypingAnimation({
    speed: 75, // 75 characters per second
    onComplete: () => {
      console.log('Typing complete!');
      // Show navigation options
    }
  });

  // Start thinking animation while loading
  useEffect(() => {
    if (loading) {
      startThinking();
    }
  }, [loading]);

  // Start typing when content is ready
  useEffect(() => {
    if (aiResponse) {
      startTyping(aiResponse);
    }
  }, [aiResponse]);

  return (
    <div>
      <p>{displayText}</p>
      {isActive && <span>Press any key to skip</span>}
      {state.progress > 0 && <span>Progress: {state.progress}%</span>}
    </div>
  );
}
```

### Using the Class Directly

```typescript
import { AITypingAnimation } from '@/lib/ai-typing-animation';

const animation = new AITypingAnimation({
  speed: 75,
  showCursor: true,
  cursorChar: '█',
  allowSkip: true,
  onComplete: () => {
    console.log('Typing complete!');
  },
  onSkip: () => {
    console.log('User skipped typing');
  }
});

// Start thinking animation
animation.startThinking();

// Later, start typing
animation.start('This is AI-generated content...');

// Get display text with cursor
const displayText = animation.getDisplayText();

// Get current state
const state = animation.getState();
console.log('Progress:', state.progress);

// Skip animation
animation.skip();

// Clean up
animation.destroy();
```

## Configuration Options

```typescript
interface TypingAnimationOptions {
  /**
   * Typing speed in characters per second (50-100 recommended)
   * Default: 75
   */
  speed?: number;
  
  /**
   * Whether to show a blinking cursor during typing
   * Default: true
   */
  showCursor?: boolean;
  
  /**
   * Cursor character to display
   * Default: '█'
   */
  cursorChar?: string;
  
  /**
   * Callback when typing completes
   */
  onComplete?: () => void;
  
  /**
   * Callback when typing is skipped
   */
  onSkip?: () => void;
  
  /**
   * Whether to allow skipping by pressing any key
   * Default: true
   */
  allowSkip?: boolean;
}
```

## Animation State

The animation provides a state object with the following properties:

```typescript
interface TypingAnimationState {
  isTyping: boolean;      // Whether typing animation is active
  isThinking: boolean;    // Whether thinking animation is active
  revealedText: string;   // Current revealed text
  cursorVisible: boolean; // Whether cursor is visible (for blinking)
  progress: number;       // Progress percentage (0-100)
}
```

## Integration with TeletextScreen

The typing animation is automatically applied to pages with `meta.aiGenerated = true`:

```typescript
// In your adapter
return {
  id: '507',
  title: 'AI Response',
  rows: formattedRows,
  links: [...],
  meta: {
    aiGenerated: true,  // This triggers typing animation
    aiContextId: contextId
  }
};
```

The TeletextScreen component will:
1. Show "Thinking..." animation while loading AI content
2. Start typing animation when content is ready
3. Show "Press any key to skip" hint during typing
4. Show "Use colored buttons to navigate" after typing completes

## Examples

### Example 1: Simple Typing

```typescript
const animation = new AITypingAnimation({ speed: 75 });
animation.start('Hello, I am an AI assistant.');
```

### Example 2: Thinking Then Typing

```typescript
const animation = new AITypingAnimation({
  speed: 75,
  onComplete: () => {
    console.log('Ready for user input');
  }
});

// Show thinking animation
animation.startThinking();

// Simulate API call
setTimeout(() => {
  animation.start('Here is your AI-generated response...');
}, 2000);
```

### Example 3: Custom Cursor

```typescript
const animation = new AITypingAnimation({
  speed: 60,
  cursorChar: '|',
  showCursor: true
});

animation.start('Custom cursor example');
```

### Example 4: No Cursor

```typescript
const animation = new AITypingAnimation({
  speed: 100,
  showCursor: false
});

animation.start('Fast typing without cursor');
```

### Example 5: Skip Handling

```typescript
const animation = new AITypingAnimation({
  speed: 75,
  onSkip: () => {
    console.log('User skipped the animation');
    // Show full content immediately
  },
  onComplete: () => {
    console.log('Animation completed naturally');
  }
});

animation.start('This can be skipped by pressing any key');
```

## Performance Considerations

- The animation uses `setInterval` for character reveal and cursor blinking
- Intervals are cleaned up automatically on stop/destroy
- Keyboard listener is added only when `allowSkip` is true
- All resources are cleaned up on component unmount (when using React hook)

## Accessibility

- Users can skip the animation by pressing any key
- The animation can be disabled by setting `speed` to a very high value (e.g., 1000)
- Consider adding a user preference to disable typing animations entirely
- Ensure content is still readable without the animation

## Testing

The animation includes comprehensive tests covering:
- Character-by-character reveal
- Cursor blinking
- Thinking animation
- Skip functionality
- Progress tracking
- State management
- Edge cases

Run tests with:
```bash
npm test lib/__tests__/ai-typing-animation.test.ts
```

## Troubleshooting

### Animation not starting
- Check that `meta.aiGenerated` is set to `true` on the page
- Ensure the page is not in loading state
- Verify that content rows exist (rows 3-22)

### Cursor not blinking
- Check that `showCursor` option is `true`
- Verify that cursor interval is running (check browser console)

### Skip not working
- Ensure `allowSkip` option is `true`
- Check that keyboard listener is attached (check browser console)
- Verify that the animation is actually running

### Performance issues
- Reduce typing speed if animation is choppy
- Check for memory leaks (ensure `destroy()` is called)
- Verify that only one animation instance is running at a time

## Future Enhancements

Potential improvements for future versions:
- Variable typing speed (faster for common words, slower for emphasis)
- Sound effects for typing (optional)
- Different cursor styles per theme
- Pause/resume functionality
- Word-by-word reveal option
- Smooth scrolling for long content
