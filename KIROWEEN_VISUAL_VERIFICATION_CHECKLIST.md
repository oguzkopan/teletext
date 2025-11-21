# Kiroween Theme Visual Verification Checklist

This checklist can be used for manual visual verification of the Kiroween theme in a browser.

## Setup
1. Start the development server: `npm run dev`
2. Open the application in a browser
3. Navigate to Settings (page 701) or use keyboard shortcut to switch to Haunting theme

## Visual Verification Checklist

### ✅ Halloween Decorations

#### Jack-o-Lantern (🎃)
- [ ] Pumpkin appears in corner of screen
- [ ] Pumpkin has flickering animation (subtle brightness changes)
- [ ] Animation loops continuously
- [ ] Size is appropriate (not too large or small)

#### Floating Ghost (👻)
- [ ] Ghost appears and floats across screen
- [ ] Ghost moves from left to right (or follows defined path)
- [ ] Ghost fades in at start and fades out at end
- [ ] Animation takes approximately 12 seconds
- [ ] Multiple ghosts may appear over time

#### Flying Bat (🦇)
- [ ] Bat appears and flies across screen
- [ ] Bat flips direction mid-flight (scaleX transformation)
- [ ] Bat follows a slightly curved path
- [ ] Animation takes approximately 10 seconds
- [ ] Bat appears at different vertical positions

#### ASCII Cat
- [ ] Cat ASCII art appears in header area
- [ ] Cat's eyes blink in different patterns:
  - Both eyes open (o.o)
  - Left eye wink (-.o)
  - Right eye wink (o.-)
  - Both eyes closed (-.-) 
- [ ] Blinking animation is smooth and natural
- [ ] Cat structure remains intact (ears, face, mouth)

#### Additional Decorations
- [ ] Skull (💀) appears with pulsing animation
- [ ] Spider web (🕸️) appears in corner
- [ ] Spider (🕷️) crawls near web

### ✅ Page Transition Effects

#### Glitch Transition
- [ ] When navigating between pages, glitch effect is visible
- [ ] Screen appears to shift horizontally (-5px to +5px)
- [ ] Colors shift (chromatic aberration effect)
- [ ] Transition completes in ~400ms
- [ ] Effect is noticeable but not jarring

### ✅ Chromatic Aberration Effect

#### Continuous Effect
- [ ] Subtle red and cyan color separation visible
- [ ] Effect is most noticeable on high-contrast edges
- [ ] Red channel shifts slightly left/up
- [ ] Cyan channel shifts slightly right/down
- [ ] Effect animates slowly (3s cycle)
- [ ] Effect is present but doesn't impair readability

### ✅ Background Effects

#### Floating Ghosts Background
- [ ] Ghosts occasionally float across the background
- [ ] Ghosts are semi-transparent (opacity ~0.7)
- [ ] Ghosts don't obstruct text readability
- [ ] Effect loops every 10 seconds

#### Screen Flicker
- [ ] Subtle screen flicker effect is present
- [ ] Flicker is barely noticeable (not seizure-inducing)
- [ ] Opacity varies slightly (95-97%)
- [ ] Effect loops every 5 seconds
- [ ] Flicker intensity can be adjusted in settings

#### Fog Overlay
- [ ] Subtle fog/mist effect visible in background
- [ ] Fog drifts slowly across screen
- [ ] Fog is semi-transparent and doesn't block content
- [ ] Effect creates atmospheric depth

### ✅ Interactive Element Animations

#### Button Press (Horror Flash)
- [ ] When clicking buttons, red flash effect appears
- [ ] Button brightness increases briefly
- [ ] Red glow/shadow appears around button
- [ ] Effect lasts ~200ms
- [ ] Effect is satisfying and provides clear feedback

#### Text Entry (Glitch Cursor)
- [ ] Cursor has glitch effect when typing
- [ ] Cursor shows chromatic aberration (red/cyan separation)
- [ ] Cursor blinks with glitch pattern
- [ ] Effect loops every 300ms
- [ ] Cursor remains visible and functional

#### Loading Indicator (Pulsing Skull)
- [ ] Loading shows rotating spooky emojis
- [ ] Sequence: 💀 → 👻 → 💀 → 🎃
- [ ] Each frame displays for ~200ms
- [ ] Animation loops smoothly
- [ ] Emojis are clearly visible

### ✅ Theme-Specific Behaviors

#### Theme Activation
- [ ] Theme activates when selected in settings
- [ ] All decorations appear immediately
- [ ] All background effects start immediately
- [ ] Page transitions use glitch effect
- [ ] Theme name banner appears: "HAUNTING MODE ACTIVATED"

#### Theme Banner
- [ ] Banner slides down from top
- [ ] Banner text is red with glow effect
- [ ] Banner includes screen flicker effect
- [ ] Banner displays for ~2.5 seconds
- [ ] Banner slides back up and disappears

#### Theme Deactivation
- [ ] When switching away from Haunting theme:
  - All decorations disappear
  - Background effects stop
  - Chromatic aberration removed
  - Page transitions change to new theme style

### ✅ Page Type Testing

Test the theme on different page types:

#### Index Page (100)
- [ ] All decorations visible
- [ ] Background effects active
- [ ] Navigation works with glitch transitions
- [ ] Text remains readable

#### Content Pages (News, Sports, Markets)
- [ ] Decorations don't interfere with content
- [ ] Background effects subtle enough for reading
- [ ] Interactive elements have horror flash
- [ ] Page transitions smooth

#### AI Pages (500-599)
- [ ] Loading indicator shows pulsing skull
- [ ] Text entry has glitch cursor
- [ ] Decorations present but not distracting
- [ ] Responses display correctly

#### Settings Page (701)
- [ ] Theme selector works
- [ ] Animation intensity controls work
- [ ] Preview of effects available
- [ ] Changes apply immediately

#### Special Pages (404, 666)
- [ ] Extra spooky effects on these pages
- [ ] Decorations more prominent
- [ ] Effects at maximum intensity
- [ ] ASCII art displays correctly

### ✅ Performance Verification

#### Frame Rate
- [ ] Animations run smoothly (no stuttering)
- [ ] Multiple simultaneous animations don't cause lag
- [ ] Page remains responsive during animations
- [ ] No significant CPU/GPU usage spikes

#### Memory Usage
- [ ] No memory leaks after extended use
- [ ] Switching themes doesn't increase memory
- [ ] Animations clean up properly

### ✅ Accessibility Verification

#### Reduced Motion
- [ ] Test with system "Reduce Motion" enabled
- [ ] Animations should be minimal or disabled
- [ ] Functionality still works without animations
- [ ] Static alternatives provided

#### User Settings
- [ ] Animation intensity slider works (0-100%)
- [ ] Individual animation type toggles work:
  - Transitions
  - Decorations
  - Background effects
- [ ] "Disable all animations" option works
- [ ] Settings persist across sessions

#### Keyboard Navigation
- [ ] All interactive elements accessible via keyboard
- [ ] Focus indicators visible with theme
- [ ] Tab order logical
- [ ] Shortcuts work correctly

### ✅ Browser Compatibility

Test in multiple browsers:

#### Chrome/Edge
- [ ] All animations work
- [ ] CSS effects render correctly
- [ ] Performance acceptable

#### Firefox
- [ ] All animations work
- [ ] CSS effects render correctly
- [ ] Performance acceptable

#### Safari
- [ ] All animations work
- [ ] CSS effects render correctly
- [ ] Performance acceptable

### ✅ Responsive Design

Test at different screen sizes:

#### Desktop (1920x1080)
- [ ] Decorations positioned correctly
- [ ] Animations scale appropriately
- [ ] No overflow issues

#### Tablet (768x1024)
- [ ] Decorations visible and positioned well
- [ ] Animations work smoothly
- [ ] Touch interactions work

#### Mobile (375x667)
- [ ] Decorations don't crowd screen
- [ ] Animations optimized for mobile
- [ ] Performance acceptable

## Issues Found

Document any issues discovered during visual verification:

| Issue | Severity | Description | Status |
|-------|----------|-------------|--------|
| | | | |

## Sign-Off

- [ ] All visual elements verified
- [ ] All animations tested
- [ ] All page types checked
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Browser compatibility confirmed

**Verified By:** _______________
**Date:** _______________
**Notes:** _______________

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Run automated tests
npm test -- lib/__tests__/kiroween-theme-integration.test.ts

# Run all animation tests
npm test -- lib/__tests__/animation

# Check for console errors
# Open browser DevTools Console and look for errors
```

## Tips for Visual Testing

1. **Use DevTools:** Open browser DevTools to inspect elements and see applied CSS classes
2. **Slow Motion:** Use browser DevTools to slow down animations for detailed inspection
3. **Network Throttling:** Test with slow network to ensure animations don't block content
4. **Color Blindness:** Test with color blindness simulators to ensure effects are visible
5. **Dark Room:** Test in a dark room to see subtle effects like fog and flicker
6. **Extended Session:** Leave theme active for 10+ minutes to check for memory leaks

## Expected Visual Characteristics

### Color Palette
- Primary: Green (#00ff00) on black background
- Accent: Red (#ff0000) for horror effects
- Shadows: Cyan (#00ffff) for chromatic aberration
- Fog: Gray (rgba(100, 100, 100, 0.15))

### Animation Speeds
- Fast: 150-300ms (button press, cursor)
- Medium: 400-800ms (transitions, loading)
- Slow: 2-12s (decorations, background effects)

### Visual Intensity
- Subtle: Fog, flicker (barely noticeable)
- Moderate: Chromatic aberration, decorations
- Prominent: Glitch transitions, horror flash

All effects should enhance the atmosphere without impairing usability.
