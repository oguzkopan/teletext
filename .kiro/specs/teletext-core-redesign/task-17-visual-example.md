# Task 17: Visual Example - Input Buffer and Navigation Hints

## Input Buffer Display

When a user enters digits for page navigation, they now see visual feedback:

### Example 1: Standard 3-Digit Navigation (Page 200)
```
┌────────────────────────────────────────┐
│ P200  NEWS HEADLINES        [12_]      │ ← Input buffer shows "12_"
│                                        │
│ 1. Breaking: Tech Giant Announces...  │
│ 2. Sports: Local Team Wins...         │
│ 3. Weather: Sunny Weekend Ahead...    │
│                                        │
│ ...                                    │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│ 100=INDEX  BACK=PREVIOUS               │
└────────────────────────────────────────┘
```

After entering the 3rd digit, auto-navigation occurs and buffer clears.

### Example 2: Single-Digit Navigation (AI Page 500)
```
┌────────────────────────────────────────┐
│ P500  AI ORACLE                        │
│                                        │
│ Choose a topic:                        │
│                                        │
│ 1. Technology Trends                   │
│ 2. Science Discoveries                 │
│ 3. Historical Events                   │
│ 4. Future Predictions                  │
│ 5. Ask Anything                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│ 100=INDEX  BACK=PREVIOUS               │
│                    Enter 1-digit option│ ← Input hint
└────────────────────────────────────────┘
```

Pressing "1" immediately navigates to page 500-1 (no buffer shown).

### Example 3: Double-Digit Navigation (News Article Sub-pages)
```
┌────────────────────────────────────────┐
│ P202  BREAKING NEWS            [1_]    │ ← Input buffer for 2-digit
│                                        │
│ Article continues...                   │
│                                        │
│ Lorem ipsum dolor sit amet...          │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│                                        │
│ 100=INDEX  BACK=PREVIOUS               │
│                      Enter 2-digit page│ ← Input hint
└────────────────────────────────────────┘
```

## Backspace Behavior

### Scenario 1: Buffer Has Content
```
User types: 1, 2
Buffer shows: [12_]

User presses: Backspace
Buffer shows: [1__]  ← Last digit removed
```

### Scenario 2: Buffer Is Empty
```
Buffer shows: (nothing)

User presses: Backspace
Action: Navigate back to previous page ← Standard back navigation
```

## Color Coding

All visual indicators use consistent colors:
- **Input Buffer**: Yellow (`theme.colors.yellow`) - High visibility for active input
- **Input Hint**: Cyan (`theme.colors.cyan`) - Matches navigation hints
- **Loading**: Green (`theme.colors.green`) - Standard loading indicator
- **Offline**: Red (`theme.colors.red`) - Warning indicator

## Positioning

Visual indicators are positioned to avoid content overlap:
- **Input Buffer**: Top-right corner (below page number)
- **Input Hint**: Bottom-right corner (above navigation hints)
- **Loading**: Top-left corner
- **Offline**: Top-right corner (when no input buffer)

## User Experience Flow

### Flow 1: Standard Page Navigation
1. User on page 100
2. User types "2" → Buffer shows `[2__]`
3. User types "0" → Buffer shows `[20_]`
4. User types "0" → Auto-navigation to page 200, buffer clears
5. Page 200 loads

### Flow 2: Single-Digit Selection
1. User on page 500 (AI Oracle)
2. Hint shows "Enter 1-digit option"
3. User types "3" → Immediate navigation to page 500-3
4. No buffer shown (instant navigation)

### Flow 3: Correcting Input
1. User on page 100
2. User types "2" → Buffer shows `[2__]`
3. User types "5" → Buffer shows `[25_]`
4. User realizes mistake, presses Backspace → Buffer shows `[2__]`
5. User types "0" → Buffer shows `[20_]`
6. User types "0" → Auto-navigation to page 200

### Flow 4: Canceling Input
1. User on page 100
2. User types "9" → Buffer shows `[9__]`
3. User changes mind, presses Backspace → Buffer shows `[___]` (empty)
4. User presses Backspace again → Navigate back to previous page

## Accessibility

The integration provides clear feedback for all navigation actions:
- **Visual**: Input buffer and hints always visible
- **Predictable**: Consistent behavior across all page types
- **Forgiving**: Easy to correct mistakes with backspace
- **Guided**: Hints tell users what input is expected

## Technical Implementation

The visual feedback is implemented through:
1. **TeletextScreen**: Renders buffer and hints based on props
2. **PageRouter**: Manages buffer state and expected input length
3. **KeyboardHandler**: Routes input to appropriate handlers
4. **Automatic**: No manual configuration needed per page
