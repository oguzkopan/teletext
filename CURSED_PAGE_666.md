# 🎃 Cursed Page 666 - Kiroween Hackathon Feature 👻

## Overview

Page 666 is a special haunting experience created for the Kiroween hackathon, showcasing animated teletext horror aesthetics with authentic retro motifs. This page demonstrates the "Costume Contest" category with a polished, spooky UI that enhances the application's function.

## Features

### 🎨 Visual Design
- **Animated ASCII Skull Art**: Hand-crafted teletext-style skull that pulses and glows
- **Glitch Effects**: Authentic CRT-style corruption and signal interference
- **Pulsing Warnings**: Red warning text with animated glow effects
- **Flickering Display**: Simulates old teletext signal degradation
- **Static Noise Overlay**: Subtle scanline effects for authenticity

### 🎭 Animations
All animations are CSS-based and respect user preferences:
- **Glitch Animation**: Text shifts and distorts like corrupted teletext signals
- **Pulse Effect**: Warning messages pulse with red glow
- **Flicker**: Entire page flickers like an unstable CRT display
- **Shake**: Warning elements shake for emphasis
- **Ghost Fade**: Elements fade in and out mysteriously
- **Skull Pulse**: The ASCII skull breathes with subtle scaling
- **Color Shift**: Hue rotation for eerie color effects

### ♿ Accessibility
- **Reduced Motion Support**: All animations respect `prefers-reduced-motion`
- **High Contrast Mode**: Enhanced contrast for better readability
- **Screen Reader Friendly**: Proper semantic HTML structure
- **Keyboard Navigation**: Full keyboard support for navigation

### 🎮 Interactive Elements
- Multiple escape routes to other pages
- Themed navigation with cursed aesthetics
- Variant page (666-1) with different ASCII art
- Integration with the main teletext navigation system

## Technical Implementation

### Files Created
1. **`lib/cursed-page.ts`**: Page factory functions for page 666 and variant
2. **`app/cursed-page.css`**: CSS animations and effects
3. **Updated `lib/page-registry.ts`**: Registered page 666 in the system
4. **Updated `types/teletext.ts`**: Added cursedPage metadata support
5. **Updated `components/TeletextScreen.tsx`**: Added data attributes for animations

### How It Works

The cursed page uses a combination of:
- **Metadata flags**: `cursedPage: true`, `enableAnimations: true`, `specialEffects: {...}`
- **Data attributes**: `data-page-id="666"`, `data-cursed="true"` on the screen element
- **CSS selectors**: Target specific elements with `[data-page-id="666"]`
- **Keyframe animations**: Pure CSS animations for performance

### Animation System

```css
/* Example: Glitch effect */
@keyframes glitch {
  0% { transform: translate(0); opacity: 1; }
  20% { transform: translate(-2px, 2px); opacity: 0.8; }
  /* ... */
}

[data-page-id="666"] [data-cursed="true"] {
  animation: glitch 2s infinite;
}
```

## Navigation

### Access Page 666
- From main index (page 100): Type `666`
- Direct link in the index: "666 Cursed Page (Enter if you dare...)"

### Escape Routes
- **100**: Main Index (safety)
- **600**: Games Hub
- **500**: AI Oracle
- **999**: Help & Documentation

## Kiroween Hackathon Alignment

### Category: Costume Contest
This feature demonstrates:
- **Haunting UI**: Polished, spooky interface with authentic teletext aesthetics
- **Enhanced Function**: The horror theme enhances the retro teletext experience
- **Attention to Detail**: Multiple animation layers, accessibility support, variants
- **Unforgettable Design**: Memorable experience that fits the Kiroween theme

### Kiro Features Used

#### 1. **Vibe Coding**
- Conversational development with Kiro to design the page concept
- Iterative refinement of ASCII art and animations
- Quick prototyping of different visual effects

#### 2. **Spec-Driven Development**
- Used existing teletext specs as foundation
- Extended type system for cursed page metadata
- Maintained consistency with overall architecture

#### 3. **Steering Docs**
- Followed project steering for teletext authenticity
- Maintained accessibility standards from steering
- Adhered to performance guidelines

## ASCII Art Showcase

### Main Skull (Page 666)
```
                      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                    ▄█░░░░░░░░░░░░░░░░░░░█▄
                  ▄█░░▄▄░░░░░░░░░░░▄▄░░█▄
                 █░░█░░█░░░░░░░░░█░░█░░█
                 █░░░▀▀░░░░░░░░░░░▀▀░░░█
                 █░░░░░░░░░▄▄▄░░░░░░░░░█
                 █░░░░░░░▄█░░░█▄░░░░░░░█
                 █░░░░░░█░░░░░░░█░░░░░░█
                 █░░░░░░█░▄▄▄▄▄░█░░░░░░█
                  █░░░░░░▀▀▀▀▀▀▀░░░░░░█
                   █░░░░░░░░░░░░░░░░░█
                    ▀█░░░░░░░░░░░░░░░█▀
                      ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

### Variant Skull (Page 666-1)
Features eyes with 👁 emoji and different expression

## Performance

- **Pure CSS animations**: No JavaScript overhead
- **GPU-accelerated**: Uses transform and opacity for smooth performance
- **Conditional loading**: Animations only active on page 666
- **Optimized selectors**: Specific data attributes prevent style leakage

## Future Enhancements

Potential additions for post-hackathon:
- Sound effects (eerie ambient sounds)
- More ASCII art variations
- Interactive elements (clickable skull parts)
- Random message generation
- Integration with AI Oracle for cursed predictions
- Multiple themed variants (different horror styles)

## Testing

To test the cursed page:
1. Navigate to page 100 (main index)
2. Type `666` to enter the cursed realm
3. Observe animations and effects
4. Test escape routes (100, 600, 500, 999)
5. Try variant page 666-1 for different art

## Credits

Created for the Kiroween Hackathon 2024 using Kiro AI-powered IDE.

**Theme**: Costume Contest - Haunting User Interface
**Technology**: Next.js, TypeScript, CSS Animations, Teletext Protocol
**Inspiration**: Classic BBC Ceefax, retro horror aesthetics, 1980s teletext systems

---

*"Enter if you dare... The spirits have been awakened..."* 👻💀🕷️🦇
