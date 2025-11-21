# Interactive Elements Visual Guide

## Quick Reference for Interactive Element Highlighting

### Button Elements

**Format**: `[Label]`

**Visual Appearance**:
```
Normal:  [1]  [2]  [3]  [Press]  [Enter]
Hover:   [1]  (with background highlight + underline)
         ‾‾‾
Focus:   [1]  (with yellow outline)
         ╔═╗
         ║1║
         ╚═╝
```

**CSS Classes**: `.interactive-element .interactive-button`

**Use Cases**:
- Numeric menu options: `[1]`, `[2]`, `[3]`
- Action buttons: `[Press]`, `[Enter]`, `[Submit]`
- Toggle options: `[ON]`, `[OFF]`

---

### Link Elements

**Format**: `► Label`

**Visual Appearance**:
```
Normal:  ► News  ► Sports  ► Index
         (cyan color)

Hover:   ► News  (white color + underline)
         ‾‾‾‾‾‾

Focus:   ► News  (cyan outline with glow)
         ╔══════╗
         ║► News║
         ╚══════╝
```

**CSS Classes**: `.interactive-element .interactive-link`

**Use Cases**:
- Navigation links: `► Index`, `► Back`, `► Help`
- Section links: `► News`, `► Sports`, `► Markets`
- Quick access: `► Settings`, `► About`

---

### Selection Elements

**Format**: `[Label]`

**Visual Appearance**:
```
Normal:  [Option A]  [Choice 1]  [Yes]
         (yellow color)

Hover:   [Option A]  (background highlight + underline)
         ‾‾‾‾‾‾‾‾‾‾

Focus:   [Option A]  (yellow outline)
         ╔══════════╗
         ║Option A  ║
         ╚══════════╝
```

**CSS Classes**: `.interactive-element .interactive-selection`

**Use Cases**:
- Multiple choice: `[Option A]`, `[Option B]`, `[Option C]`
- Quiz answers: `[A]`, `[B]`, `[C]`, `[D]`
- Preferences: `[Yes]`, `[No]`, `[Maybe]`

---

## Color Coding

### Standard Colors

```
{red}[RED]{white}      - Important actions, errors
{green}[GRN]{white}    - Success, confirmation
{yellow}[YEL]{white}   - Warnings, selections
{blue}[BLU]{white}     - Information, links
{cyan}[CYN]{white}     - Navigation, links
{magenta}[MAG]{white}  - Special features
{white}[WHT]{white}    - Default, neutral
```

### Color Usage Examples

```
Press {red}[1]{white} for urgent news
{green}[✓]{white} Saved successfully
{yellow}[!]{white} Warning: Low battery
{blue}[i]{white} More information
```

---

## Layout Examples

### Menu Layout
```
MAIN MENU                           100
════════════════════════════════════════

Select an option:

  [1] News Headlines
  [2] Sports Scores
  [3] Market Data
  [4] Weather Forecast
  [5] AI Assistant

Quick links:
  ► Index  ► Help  ► Settings
```

### Navigation Footer
```
{red}[RED]{white} News  {green}[GRN]{white} Sports  {yellow}[YEL]{white} Markets  {blue}[BLU]{white} AI
► Index  ► Back  ► Help
```

### Quiz Layout
```
QUIZ GAME                           600
════════════════════════════════════════

Question 1 of 10

What is the capital of France?

  [A] London
  [B] Paris
  [C] Berlin
  [D] Madrid

Press A, B, C, or D to answer
```

### Settings Layout
```
SETTINGS                            701
════════════════════════════════════════

Display Settings:

  [1] Scanlines [ON]
  [2] Screen Curvature [OFF]
  [3] Noise Effect [ON]

Theme:

  [4] Change Theme

► Save & Exit
```

---

## State Indicators

### Hover State
```
Before:  [1] Option
After:   [1] Option  (background: rgba(255,255,255,0.15))
         ‾‾‾‾‾‾‾‾‾
```

### Focus State
```
Before:  [1] Option
After:   ╔═══════════╗
         ║[1] Option ║  (outline: 2px solid yellow)
         ╚═══════════╝
```

### Active State
```
Before:  [1] Option
After:   [1] Option  (scaled: 0.98, background: rgba(255,255,255,0.25))
```

---

## Keyboard Navigation

### Tab Order
```
[1] → [2] → [3] → ► Link → [Option A] → [Option B]
 ↑                                              ↓
 └──────────────── Shift+Tab ───────────────────┘
```

### Focus Indicators
```
Tab:        Yellow outline for buttons/selections
            Cyan outline for links

Shift+Tab:  Same as Tab, reverse direction

Enter:      Activate focused element

Space:      Activate focused element
```

---

## Accessibility Features

### Visual Cues
- **Color**: Different colors for different element types
- **Shape**: Brackets for buttons/selections, arrows for links
- **Position**: Consistent placement across pages
- **Size**: Adequate touch targets (minimum 44×44px)

### Keyboard Support
- **Tab**: Move to next interactive element
- **Shift+Tab**: Move to previous interactive element
- **Enter/Space**: Activate element
- **Arrow Keys**: Navigate within groups

### Screen Reader Support
- **Role**: Appropriate ARIA roles (button, link)
- **Label**: Descriptive labels for all elements
- **State**: Current state announced (focused, pressed)
- **Context**: Surrounding context provided

---

## Best Practices

### DO ✓
- Use consistent formatting across all pages
- Provide clear visual feedback for all states
- Ensure adequate color contrast
- Test with keyboard navigation
- Include descriptive labels
- Group related elements together

### DON'T ✗
- Mix different formatting styles on same page
- Use color as the only indicator
- Create elements that are too small to click
- Forget to test with keyboard
- Use ambiguous labels
- Overcrowd the interface

---

## Common Patterns

### Numbered Menu
```
[1] First Option
[2] Second Option
[3] Third Option
[4] Fourth Option
```

### Link List
```
► News
► Sports
► Markets
► Weather
```

### Mixed Navigation
```
Press [1] for news or visit ► Index
Choose [Option A] or [Option B]
```

### Colored Buttons
```
{red}[RED]{white} Headlines  {green}[GRN]{white} Sports  {yellow}[YEL]{white} Markets
```

### Quiz Options
```
[A] First Answer
[B] Second Answer
[C] Third Answer
[D] Fourth Answer
```

---

## Testing Checklist

- [ ] All interactive elements have visual indicators
- [ ] Hover effects work on all elements
- [ ] Focus indicators are visible and clear
- [ ] Keyboard navigation works correctly
- [ ] Tab order is logical
- [ ] Colors have sufficient contrast
- [ ] Elements are large enough to click
- [ ] Screen reader announces elements correctly
- [ ] Active states provide feedback
- [ ] Consistent styling across all pages

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✓ Full  |
| Firefox | 88+     | ✓ Full  |
| Safari  | 14+     | ✓ Full  |
| Edge    | 90+     | ✓ Full  |
| Opera   | 76+     | ✓ Full  |

---

## Performance Tips

1. Use CSS for all visual effects (GPU-accelerated)
2. Minimize DOM updates
3. Cache formatted strings
4. Use memoization for expensive operations
5. Batch style changes
6. Avoid layout thrashing
7. Use transform and opacity for animations

---

## Troubleshooting

### Elements not highlighting on hover
- Check CSS classes are applied
- Verify theme colors are loaded
- Ensure no conflicting styles

### Focus indicators not visible
- Check outline styles
- Verify z-index stacking
- Test with different themes

### Keyboard navigation not working
- Verify tabindex attributes
- Check event handlers
- Test focus order

### Colors not displaying correctly
- Verify theme configuration
- Check color code parsing
- Test with different themes
