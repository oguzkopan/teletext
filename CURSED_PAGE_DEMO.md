# 🎃 Cursed Page 666 - Visual Demo 👻

## Live Preview

When you navigate to page 666, you'll see:

```
666 ⚠️ CURSED REALM ⚠️ 23:45:12                                                  💀👻🕷️🦇
═══════════════════════════════════════════════════════════════════════════════════════

                                ⚠️  WARNING: YOU HAVE ENTERED THE CURSED REALM  ⚠️
                                     PROCEED AT YOUR OWN RISK...

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

                                ╔═══════════════════════════════════════╗
                                ║  THE SPIRITS HAVE BEEN AWAKENED       ║
                                ║  You have disturbed their slumber     ║
                                ╚═══════════════════════════════════════╝

▓▓▓ CURSED TRANSMISSIONS ▓▓▓
The teletext signal is corrupted... Strange messages appear...

[SIGNAL LOST] T̴h̴e̴ ̴d̴a̴r̴k̴n̴e̴s̴s̴ ̴s̴p̴r̴e̴a̴d̴s̴.̴.̴.̴
[INTERFERENCE] W̷e̷ ̷a̷r̷e̷ ̷w̷a̷t̷c̷h̷i̷n̷g̷.̷.̷.̷
[CORRUPTED] Y̶o̶u̶ ̶c̶a̶n̶n̶o̶t̶ ̶e̶s̶c̶a̶p̶e̶.̶.̶.̶

▓▓▓ ESCAPE ROUTES (IF YOU DARE) ▓▓▓
100 - Return to safety (Main Index)
600 - Games Hub (Less cursed)
500 - Consult the AI Oracle
999 - Call for help...

⚠️  Press any page number to escape... or stay and face the darkness... ⚠️

═══════════════════════════════════════════════════════════════════════════════════════
CURSED NAVIGATION: 100=ESCAPE 600=GAMES 500=ORACLE 666=STAY IN DARKNESS
```

## Animation Effects

### 1. **Page Flicker** (3s cycle)
The entire page flickers like an unstable CRT display:
- Opacity varies: 1.0 → 0.8 → 1.0 → 0.9 → 0.7 → 0.85 → 1.0
- Creates authentic teletext signal degradation effect

### 2. **Glitch Effect** (2s cycle)
Text elements shift and distort:
- Translates: (0,0) → (-2px,2px) → (-2px,-2px) → (2px,2px) → (2px,-2px) → (0,0)
- Opacity fluctuates: 1.0 → 0.8 → 0.9 → 0.8 → 0.9 → 1.0
- Applied to cursed text elements

### 3. **Pulsing Red Warnings** (2s cycle)
Warning text pulses with red glow:
- Color shifts: #ff0000 → #ff6666 → #ff0000
- Text shadow grows: 5px → 20px/30px → 5px
- Creates urgent, attention-grabbing effect

### 4. **Shake Effect** (0.5s cycle)
Warning elements shake horizontally:
- Translates: 0 → -2px → 2px → -2px → 2px → 0
- Rapid oscillation for emphasis

### 5. **Skull Pulse** (3s cycle)
The ASCII skull breathes:
- Scale: 1.0 → 1.02 → 1.0
- Brightness: 1.0 → 1.2 → 1.0
- Subtle, eerie effect

### 6. **Static Noise Overlay**
Scanline effect on background:
- Repeating linear gradient (2px transparent, 2px red tint)
- Animated position for moving static
- Subtle but adds authenticity

### 7. **Color Shift** (varies)
Hue rotation for eerie color effects:
- Rotates through 30 degrees of hue
- Applied to specific elements

## Color Scheme

### Primary Colors
- **Red** (#ff0000): Warnings, danger, cursed elements
- **Magenta** (#ff00ff): Supernatural, mystical elements
- **Cyan** (#00ffff): System messages, status indicators
- **White** (#ffffff): Main text content
- **Yellow** (#ffff00): Navigation hints, escape routes

### Effects
- **Glow**: Red text shadow (0 0 5px/10px/15px/20px #ff0000)
- **Background**: Black with red-tinted scanlines
- **Transparency**: Overlays use rgba for depth

## Accessibility Features

### Reduced Motion
Users with `prefers-reduced-motion: reduce` see:
- Animation duration: 0.01ms (effectively static)
- Animation iteration: 1 (no loops)
- Transition duration: 0.01ms
- All content remains readable

### High Contrast
Users with `prefers-contrast: high` see:
- Increased contrast (1.5x filter)
- No text shadows (for clarity)
- Bold font weight for warnings
- Enhanced readability

### Dark Mode
Users with `prefers-color-scheme: dark` see:
- Enhanced static noise (5% opacity vs 3%)
- Optimized for dark backgrounds
- Better visibility of effects

## Interactive Elements

### Navigation Links
- **100**: Yellow text - "Return to safety"
- **600**: Magenta text - "Games Hub (Less cursed)"
- **500**: Cyan text - "Consult the AI Oracle"
- **999**: Red text - "Call for help..."

### Keyboard Support
- Type `100`, `600`, `500`, or `999` to navigate
- Press any key to interact
- Full keyboard navigation support

## Technical Details

### Performance
- **GPU Accelerated**: Uses `transform` and `opacity`
- **CSS Only**: No JavaScript animation overhead
- **Conditional**: Only active on page 666
- **Optimized**: Specific selectors prevent style leakage

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Fallback to static display if animations unsupported

### File Size
- **CSS**: ~4KB (cursed-page.css)
- **TypeScript**: ~6KB (cursed-page.ts)
- **Total Impact**: <10KB additional code

## Variant Page (666-1)

Alternative version with different ASCII art:
- Different skull design with eye emoji (👁)
- Different warning messages
- Same animation system
- Accessible via page 666-1

## User Experience Flow

1. **Discovery**: User sees "666 Cursed Page" on main index
2. **Curiosity**: Intrigued by warning "Enter if you dare..."
3. **Entry**: Types `666` to navigate
4. **Impact**: Immediate visual impact with animations
5. **Exploration**: Reads cursed messages and warnings
6. **Decision**: Choose to escape or explore further
7. **Navigation**: Clear escape routes provided

## Design Philosophy

### Authentic Teletext
- Respects 40-column layout constraints
- Uses teletext color codes
- Maintains monospace font rendering
- Authentic scanline effects

### Horror Aesthetics
- Classic horror tropes (skulls, warnings, corruption)
- Retro CRT glitch effects
- Eerie color palette
- Unsettling animations

### User-Friendly Horror
- Clear navigation options
- No jump scares or sudden sounds
- Accessible to all users
- Easy escape routes

### Performance First
- Lightweight animations
- No JavaScript overhead
- Respects user preferences
- Graceful degradation

---

## How to Experience

1. **Start the app**: `npm run dev`
2. **Navigate to main index**: Page 100 loads automatically
3. **Enter the cursed realm**: Type `666`
4. **Observe the effects**: Watch animations and read messages
5. **Escape when ready**: Type `100` to return to safety

**Warning**: This page is designed to be spooky but not scary. It's a fun, Halloween-themed experience that showcases creative use of CSS animations and teletext aesthetics. Perfect for the Kiroween hackathon! 🎃👻

---

*Created with Kiro AI-powered IDE for the Kiroween Hackathon 2024*
