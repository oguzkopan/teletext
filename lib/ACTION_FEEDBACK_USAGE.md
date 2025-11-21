# Action Feedback Usage Guide

This guide explains how to use the action feedback system for displaying success/error messages with animations in the Modern Teletext application.

## Overview

The action feedback system provides:
- **Success Messages**: Green checkmark animations for successful operations
- **Error Messages**: Red X animations for failed operations
- **Saved Indicators**: Flash animations for save actions
- **Celebration Messages**: Confetti animations for quiz completion and achievements
- **Custom Feedback**: Flexible feedback with custom types and animations

## Requirements

Implements requirements: 28.1, 28.2, 28.3, 28.4, 28.5

## Core Components

### 1. Action Feedback Utility (`lib/action-feedback.ts`)

Low-level utility functions for creating feedback messages.

```typescript
import {
  createSuccessMessage,
  createErrorMessage,
  createSavedMessage,
  createCelebrationMessage,
  createFeedbackMessage
} from './lib/action-feedback';

// Create success message
const success = createSuccessMessage('Settings saved!');
// Returns: { lines: ['✓ Settings saved!'], color: 'green', duration: 2500, animation: 'checkmark' }

// Create error message
const error = createErrorMessage('Failed to save');
// Returns: { lines: ['✗ Failed to save'], color: 'red', duration: 2500, animation: 'cross' }

// Create saved message
const saved = createSavedMessage('Theme preferences');
// Returns: { lines: ['✓ Theme preferences SAVED'], color: 'green', duration: 2000, animation: 'flash' }

// Create celebration message
const celebration = createCelebrationMessage('Quiz Complete!');
// Returns: { lines: [...confetti, '🎉 Quiz Complete! 🎉', '✓ CONGRATULATIONS!'], ... }
```

### 2. React Hook (`hooks/useActionFeedback.ts`)

React hook for managing feedback state and display.

```typescript
import { useActionFeedback } from './hooks/useActionFeedback';

function MyComponent() {
  const { showSuccess, showError, showSaved, showCelebration, feedback, isVisible } = useActionFeedback();
  
  const handleSave = async () => {
    try {
      await saveSettings();
      showSaved('Settings');
    } catch (error) {
      showError('Failed to save settings');
    }
  };
  
  return (
    <div>
      <button onClick={handleSave}>Save</button>
      {/* Render feedback */}
    </div>
  );
}
```

### 3. React Component (`components/ActionFeedback.tsx`)

React component for rendering feedback messages.

```typescript
import { ActionFeedback } from './components/ActionFeedback';
import { useActionFeedback } from './hooks/useActionFeedback';

function MyComponent() {
  const { showSuccess, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  return (
    <div>
      <button onClick={() => showSuccess('Operation successful!')}>
        Do Something
      </button>
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

## Usage Examples

### Basic Success/Error Feedback

```typescript
import { useActionFeedback } from './hooks/useActionFeedback';
import { ActionFeedback } from './components/ActionFeedback';

function SettingsPage() {
  const { showSuccess, showError, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  const handleSave = async () => {
    try {
      await saveSettings();
      showSuccess('Settings saved successfully!');
    } catch (error) {
      showError('Failed to save settings');
    }
  };
  
  return (
    <div>
      <button onClick={handleSave}>Save Settings</button>
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

### Saved Indicator

```typescript
import { useActionFeedback } from './hooks/useActionFeedback';
import { ActionFeedback } from './components/ActionFeedback';

function ThemeSelector() {
  const { showSaved, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    showSaved('Theme preferences');
  };
  
  return (
    <div>
      <button onClick={() => handleThemeChange('ceefax')}>Ceefax</button>
      <button onClick={() => handleThemeChange('haunting')}>Haunting</button>
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

### Celebration Animation

```typescript
import { useActionFeedback } from './hooks/useActionFeedback';
import { CelebrationFeedback } from './components/ActionFeedback';

function QuizPage() {
  const { showCelebration, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  const handleQuizComplete = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    showCelebration(`Quiz Complete! Score: ${percentage}%`);
  };
  
  return (
    <div>
      {/* Quiz content */}
      
      <CelebrationFeedback
        message={feedback?.lines[4] || ''}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
        showConfetti={true}
      />
    </div>
  );
}
```

### Custom Feedback

```typescript
import { useActionFeedback } from './hooks/useActionFeedback';
import { ActionFeedback } from './components/ActionFeedback';

function CustomFeedbackExample() {
  const { showFeedback, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  const handleWarning = () => {
    showFeedback({
      type: 'warning',
      message: 'Please check your input',
      animation: 'flash',
      duration: 3000
    });
  };
  
  const handleInfo = () => {
    showFeedback({
      type: 'info',
      message: 'Loading data...',
      animation: 'none',
      duration: 2000
    });
  };
  
  return (
    <div>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

### Inline Feedback

For feedback that appears inline within content rather than as an overlay:

```typescript
import { InlineFeedback } from './components/ActionFeedback';

function FormField() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  return (
    <div>
      <input type="text" onChange={handleChange} />
      
      {error && (
        <InlineFeedback type="error" message={error} />
      )}
      
      {success && (
        <InlineFeedback type="success" message="Validation passed" />
      )}
    </div>
  );
}
```

### Saved Indicator Component

Specialized component for "SAVED" messages:

```typescript
import { SavedIndicator } from './components/ActionFeedback';
import { useState } from 'react';

function AutoSaveForm() {
  const [showSaved, setShowSaved] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
  const handleAutoSave = () => {
    setShowSaved(true);
    setIsAnimatingOut(false);
    
    setTimeout(() => {
      setIsAnimatingOut(true);
      setTimeout(() => setShowSaved(false), 200);
    }, 2000);
  };
  
  return (
    <div>
      <textarea onChange={handleAutoSave} />
      
      <SavedIndicator
        itemName="Draft"
        isVisible={showSaved}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

### Advanced Hook with Options

```typescript
import { useActionFeedbackWithOptions } from './hooks/useActionFeedback';

function AdvancedExample() {
  const { showSuccess, feedback, isVisible, isAnimatingOut } = useActionFeedbackWithOptions({
    defaultDuration: 5000,
    onShow: (feedback) => {
      console.log('Feedback shown:', feedback);
    },
    onHide: () => {
      console.log('Feedback hidden');
    }
  });
  
  return (
    <div>
      <button onClick={() => showSuccess('Success!')}>Show</button>
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

## API Reference

### Hook: `useActionFeedback()`

Returns an object with:
- `showSuccess(message, duration?)` - Show success message
- `showError(message, duration?)` - Show error message
- `showSaved(itemName?, duration?)` - Show saved message
- `showCelebration(message, duration?)` - Show celebration message
- `showFeedback(config)` - Show custom feedback
- `hideFeedback()` - Hide feedback immediately
- `feedback` - Current feedback display object
- `isVisible` - Whether feedback is visible
- `isAnimatingOut` - Whether feedback is animating out

### Component: `ActionFeedback`

Props:
- `feedback: FeedbackDisplay | null` - Feedback to display
- `isVisible: boolean` - Whether feedback is visible
- `isAnimatingOut: boolean` - Whether animating out
- `className?: string` - Additional CSS classes

### Component: `CelebrationFeedback`

Props:
- `message: string` - Celebration message
- `isVisible: boolean` - Whether visible
- `isAnimatingOut: boolean` - Whether animating out
- `showConfetti?: boolean` - Show confetti animation (default: true)
- `className?: string` - Additional CSS classes

### Component: `InlineFeedback`

Props:
- `type: 'success' | 'error' | 'warning' | 'info'` - Feedback type
- `message: string` - Message to display
- `visible?: boolean` - Whether visible (default: true)
- `className?: string` - Additional CSS classes

### Component: `SavedIndicator`

Props:
- `itemName?: string` - Name of saved item
- `isVisible: boolean` - Whether visible
- `isAnimatingOut: boolean` - Whether animating out
- `className?: string` - Additional CSS classes

## CSS Animations

The following CSS animations are available:

- `feedback-checkmark` - Checkmark appears with scale effect
- `feedback-cross` - X appears with rotation
- `feedback-flash` - Flash animation for saved messages
- `feedback-flash-success` - Green pulse
- `feedback-flash-error` - Red pulse
- `feedback-flash-warning` - Yellow pulse
- `feedback-flash-info` - Cyan pulse
- `feedback-celebration` - Bounce animation for celebrations
- `feedback-confetti` - Confetti falling animation
- `feedback-fade-in` - Fade in from top
- `feedback-fade-out` - Fade out to top

## Color Classes

- `teletext-green` - Green text (#00ff00)
- `teletext-red` - Red text (#ff0000)
- `teletext-yellow` - Yellow text (#ffff00)
- `teletext-cyan` - Cyan text (#00ffff)
- `teletext-magenta` - Magenta text (#ff00ff)
- `teletext-white` - White text (#ffffff)

## Best Practices

1. **Duration**: Use 2-3 seconds for most feedback (2000-3000ms)
2. **Success**: Use green with checkmark for successful operations
3. **Error**: Use red with X for failed operations
4. **Saved**: Use flash animation for save confirmations
5. **Celebration**: Use confetti for major achievements (quiz completion, etc.)
6. **Accessibility**: All feedback includes `aria-live="polite"` for screen readers
7. **Cleanup**: Hook automatically cleans up timeouts on unmount

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useActionFeedback } from './hooks/useActionFeedback';

test('shows success message', () => {
  const { result } = renderHook(() => useActionFeedback());
  
  act(() => {
    result.current.showSuccess('Success!');
  });
  
  expect(result.current.isVisible).toBe(true);
  expect(result.current.feedback?.lines).toEqual(['✓ Success!']);
});
```

## Integration with Teletext Pages

```typescript
// In a teletext page adapter
import { useActionFeedback } from './hooks/useActionFeedback';
import { ActionFeedback } from './components/ActionFeedback';

function TeletextPage() {
  const { showSuccess, showError, feedback, isVisible, isAnimatingOut } = useActionFeedback();
  
  const handlePageAction = async () => {
    try {
      await performAction();
      showSuccess('Action completed!');
    } catch (error) {
      showError('Action failed');
    }
  };
  
  return (
    <div className="teletext-screen">
      {/* Page content */}
      
      <ActionFeedback
        feedback={feedback}
        isVisible={isVisible}
        isAnimatingOut={isAnimatingOut}
      />
    </div>
  );
}
```

## Troubleshooting

**Feedback not showing:**
- Ensure `isVisible` is true
- Check that `feedback` is not null
- Verify CSS animations are loaded

**Feedback not hiding:**
- Check that duration is set correctly
- Ensure timeouts are not being cleared prematurely
- Verify component is not unmounting before animation completes

**Animations not working:**
- Ensure `app/globals.css` includes feedback animations
- Check browser support for CSS animations
- Verify animation classes are applied correctly
