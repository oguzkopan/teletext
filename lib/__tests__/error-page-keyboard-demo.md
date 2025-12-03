# Error Page Keyboard Behavior Demo

## Before the Fix ❌

When user was on page 500 (error page):
```
User types: "1" → Navigates to page 1 (unexpected!)
User types: "2" → Navigates to page 2 (unexpected!)
User types: "abc" → Tries to navigate (confusing!)
```

**Problem**: User couldn't read the error message because any key press would navigate away.

## After the Fix ✅

When user is on page 500 (error page):
```
User types: "1" → Nothing happens (input blocked)
User types: "2" → Nothing happens (input blocked)
User types: "abc" → Nothing happens (input blocked)
User presses: Arrow Left → Navigates back (works!)
User presses: Backspace → Navigates back (works!)
User presses: Enter → Retry action (works!)
```

**Solution**: Only back button and Enter key work. All other keyboard input is blocked.

## Technical Implementation

### Error Page Creation
```typescript
// lib/error-pages.ts
return {
  id: pageNumber,
  title: `Error - ${errorInfo.title}`,
  rows,
  links: defaultLinks,
  meta: {
    source: 'error-handler',
    lastUpdated: new Date().toISOString(),
    inputMode: 'disabled',  // ← Disables all input
    errorPage: true         // ← Marks as error page
  }
};
```

### Input Mode Detection
```typescript
// lib/input-context-manager.ts
public detectInputMode(page: TeletextPage): InputMode {
  // Check if this is an error page
  if (page.meta?.errorPage) {
    return 'disabled';  // ← Returns disabled mode
  }
  // ... other mode detection logic
}
```

### Keyboard Handler
```typescript
// components/KeyboardHandler.tsx
const isInputDisabled = routerState.currentPage?.meta?.inputMode === 'disabled' ||
                       routerState.currentPage?.meta?.errorPage;

if (isInputDisabled) {
  // Only allow back button
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    e.preventDefault();
    routerState.handleNavigate('back');
    return;
  }
  // Only allow Enter for retry
  if (e.key === 'Enter') {
    e.preventDefault();
    routerState.handleEnter();
    return;
  }
  // Block all other keys
  e.preventDefault();
  return;
}
```

## User Experience

### Error Page Display
```
════════════════════════════════════════
ERROR                              P500
════════════════════════════════════════

        ! CONNECTION LOST !

     NETWORK ERROR

Unable to connect to the server. The
service may be temporarily unavailable.

Please try again in a moment.

Press R to retry

Press 100 for main index

────────────────────────────────────────
100:Index
════════════════════════════════════════
```

### Available Actions
- **← (Arrow Left)**: Go back to previous page
- **Backspace**: Go back to previous page
- **Enter**: Retry the failed action
- **All other keys**: Blocked (no navigation)

## Benefits

1. **No accidental navigation** - Users can read error messages without fear of navigating away
2. **Clear user intent** - Only explicit back/retry actions work
3. **Consistent behavior** - All error pages work the same way
4. **Better accessibility** - Screen reader users won't accidentally trigger navigation
5. **Type-safe** - TypeScript enforces the disabled mode throughout the codebase
