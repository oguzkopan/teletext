# Error Page Input Fix

## Problem
On error pages (like page 500), keyboard typing was triggering navigation, making it impossible to type anything. The keyboard input was being interpreted as navigation commands instead of being disabled.

## Solution
Implemented a new `disabled` input mode specifically for error pages that:

1. **Blocks all keyboard input** - No digits, letters, or symbols are processed
2. **Allows only back button** - Arrow left or backspace navigates back
3. **Allows Enter key** - For retry actions on error pages

## Changes Made

### 1. Added 'disabled' Input Mode
- Updated `InputMode` type in `lib/navigation-router.ts` to include `'disabled'`
- Updated `PageMeta.inputMode` type in `types/teletext.ts` to include `'disabled'`

### 2. Updated Error Page Creation
- Modified `lib/error-pages.ts` to set `inputMode: 'disabled'` and `errorPage: true` flag
- All error pages now automatically have input disabled

### 3. Enhanced Input Context Manager
- Added detection for `disabled` mode in `lib/input-context-manager.ts`
- Added validation that rejects all input when mode is `disabled`
- Returns helpful hint: "Press back button to return"

### 4. Updated Input Handler
- Modified `lib/input-handler.ts` to block all input operations when mode is `disabled`
- Prevents digit input, text input, and backspace from modifying buffer
- Blocks all keyboard events in `handleKeyPress()`

### 5. Enhanced Keyboard Handler
- Updated `components/KeyboardHandler.tsx` to detect disabled input mode
- Only allows:
  - **Arrow Left** or **Backspace**: Navigate back
  - **Enter**: Retry action (if specified in error page)
- All other keys are blocked with `preventDefault()`

## Testing
Created comprehensive test suite in `lib/__tests__/error-page-input-disabled.test.ts`:
- ✅ Error pages created with disabled input mode
- ✅ Input mode detection works correctly
- ✅ All input validation rejects input on error pages
- ✅ Helpful hints provided for disabled mode
- ✅ No characters allowed in disabled mode

All existing tests continue to pass.

## Usage
Error pages automatically have input disabled. No changes needed to existing error page creation:

```typescript
// This automatically has input disabled
const errorPage = createGenericErrorPage('500', 'Something went wrong');

// User can only:
// - Press back button (arrow left or backspace) to navigate back
// - Press Enter to retry (if retry action is specified)
// - All other keyboard input is blocked
```

## Benefits
1. **Better UX** - Users can't accidentally navigate away while reading error messages
2. **Clear intent** - Only back button and retry actions work, making navigation obvious
3. **Consistent behavior** - All error pages behave the same way
4. **Type-safe** - TypeScript enforces the disabled mode throughout the codebase
