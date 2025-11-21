# Flexible Input System Implementation

## Overview

Implemented a flexible input system that allows pages to specify whether they expect 1-digit, 2-digit, or 3-digit input. This provides better UX by showing the correct number of underscores and enabling single-digit menu selections where appropriate.

## Changes Made

### 1. Type Definitions

Added new properties to `PageMeta` interface in both `types/teletext.ts` and `functions/src/types.ts`:

```typescript
export interface PageMeta {
  // ... existing properties ...
  inputMode?: 'single' | 'double' | 'triple'; // Expected input length: 1, 2, or 3 digits
  inputOptions?: string[];  // Valid single-digit options (e.g., ['1', '2', '3', '4', '5'])
}
```

### 2. PageRouter Component

Updated `components/PageRouter.tsx` to:
- Detect the expected input length from current page metadata
- Handle single-digit input with automatic navigation
- Map single-digit inputs to page links
- Pass `expectedInputLength` to child components

**Key Logic:**
```typescript
const inputMode = currentPage?.meta?.inputMode || 'triple';
const maxLength = inputMode === 'single' ? 1 : inputMode === 'double' ? 2 : 3;

// For single-digit input mode, navigate immediately when valid option is entered
if (inputMode === 'single' && validOptions.includes(digitStr)) {
  const optionIndex = validOptions.indexOf(digitStr);
  if (currentPage?.links && currentPage.links[optionIndex]) {
    const targetPage = currentPage.links[optionIndex].targetPage;
    navigateToPage(targetPage);
  }
}
```

### 3. Input Display

Updated `app/page.tsx` to show correct number of underscores:

```typescript
{routerState.inputBuffer}
{routerState.inputBuffer.length < routerState.expectedInputLength && 
  <span style={{ color: '#666' }}>
    {'_'.repeat(routerState.expectedInputLength - routerState.inputBuffer.length)}
  </span>
}
```

### 4. RemoteInterface Component

Updated `components/RemoteInterface.tsx` to:
- Accept `expectedInputLength` prop
- Display correct number of underscores in the input display

### 5. Page Updates

Updated the following pages to use single-digit input mode:

#### Page 510 (Q&A Assistant)
```typescript
meta: {
  inputMode: 'single',
  inputOptions: ['1', '2', '3', '4', '5']
}
links: [
  { label: 'INDEX', targetPage: '100', color: 'red' },
  { label: 'AI', targetPage: '500', color: 'green' },
  { label: 'BACK', targetPage: '500', color: 'yellow' },
  { label: '', targetPage: '511', color: 'blue' }, // Option 1
  { label: '', targetPage: '512', color: 'blue' }, // Option 2
  { label: '', targetPage: '513', color: 'blue' }, // Option 3
  { label: '', targetPage: '514', color: 'blue' }, // Option 4
  { label: '', targetPage: '515', color: 'blue' }  // Option 5
]
```

#### Page 505 (Spooky Story Generator)
```typescript
meta: {
  inputMode: 'single',
  inputOptions: ['1', '2', '3', '4', '5', '6']
}
links: [
  { label: 'INDEX', targetPage: '100', color: 'red' },
  { label: 'AI', targetPage: '500', color: 'green' },
  { label: 'BACK', targetPage: '500', color: 'yellow' },
  { label: '', targetPage: '506', color: 'blue' }, // Option 1
  { label: '', targetPage: '507', color: 'blue' }, // Option 2
  { label: '', targetPage: '508', color: 'blue' }, // Option 3
  { label: '', targetPage: '509', color: 'blue' }, // Option 4
  { label: '', targetPage: '520', color: 'blue' }, // Option 5
  { label: '', targetPage: '520', color: 'blue' }  // Option 6
]
```

#### Page 700 (Theme Selection)
```typescript
meta: {
  inputMode: 'single',
  inputOptions: ['1', '2', '3', '4'],
  themeSelectionPage: true
}
links: [
  { label: 'EFFECTS', targetPage: '701', color: 'red' },
  { label: 'INDEX', targetPage: '100', color: 'green' },
  { label: '', targetPage: '702', color: 'blue' }, // Option 1
  { label: '', targetPage: '703', color: 'blue' }, // Option 2
  { label: '', targetPage: '704', color: 'blue' }, // Option 3
  { label: '', targetPage: '705', color: 'blue' }  // Option 4
]
```

## How It Works

### For Standard 3-Digit Pages (Default)
- User enters 3 digits (e.g., 2-0-1)
- Display shows: `2__` → `20_` → `201`
- Auto-navigates after 3rd digit

### For Single-Digit Menu Pages
- Page specifies `inputMode: 'single'` and `inputOptions: ['1', '2', '3', '4', '5']`
- User enters 1 digit (e.g., 3)
- Display shows: `_` → `3`
- Immediately navigates to the page linked to option 3

### For 2-Digit Pages (Future Use)
- Page specifies `inputMode: 'double'`
- User enters 2 digits
- Display shows: `__` → `2_` → `23`
- Auto-navigates after 2nd digit

## Benefits

1. **Better UX**: Users see the correct number of underscores, making it clear how many digits to enter
2. **Faster Navigation**: Single-digit menus navigate immediately without waiting for Enter
3. **Flexible**: Pages can specify their own input requirements
4. **Backward Compatible**: Pages without `inputMode` default to 3-digit input

## Testing

Test the following scenarios:

1. **Page 510 (Q&A Assistant)**:
   - Navigate to page 510
   - Display should show single underscore: `_`
   - Press `1` - should immediately navigate to page 511
   - Press `2` - should immediately navigate to page 512

2. **Page 505 (Spooky Story)**:
   - Navigate to page 505
   - Display should show single underscore: `_`
   - Press `1` - should immediately navigate to page 506
   - Press `6` - should immediately navigate to page 520

3. **Page 700 (Theme Selection)**:
   - Navigate to page 700
   - Display should show single underscore: `_`
   - Press `1` - should immediately navigate to page 702 (CEEFAX theme)
   - Press `4` - should immediately navigate to page 705 (Haunting theme)

4. **Standard Pages**:
   - Navigate to page 100
   - Display should show three underscores: `___`
   - Enter `2-0-1` - should navigate to page 201 after 3rd digit

## Future Enhancements

1. Add more pages with single-digit input (quiz questions, game menus, etc.)
2. Implement 2-digit input mode for sub-menus
3. Add visual feedback for valid/invalid options
4. Support alphanumeric input for special pages
