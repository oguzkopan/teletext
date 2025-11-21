# ASCII Logo Animation Examples

## 1. Standard Logo (Static)

```
╔══════════════════════════════════╗
║  MODERN TELETEXT  ░▒▓█▓▒░       ║
╚══════════════════════════════════╝
```

## 2. Logo Reveal Animation (Frame-by-Frame)

### Frame 1 (Empty)
```
╔══════════════════════════════════╗
║                                  ║
╚══════════════════════════════════╝
```

### Frame 5 (MODE)
```
╔══════════════════════════════════╗
║  MODE                            ║
╚══════════════════════════════════╝
```

### Frame 10 (MODERN TELE)
```
╔══════════════════════════════════╗
║  MODERN TELE                     ║
╚══════════════════════════════════╝
```

### Frame 15 (MODERN TELETEXT)
```
╔══════════════════════════════════╗
║  MODERN TELETEXT                 ║
╚══════════════════════════════════╝
```

### Frame 23 (Complete with decoration)
```
╔══════════════════════════════════╗
║  MODERN TELETEXT  ░▒▓█▓▒░       ║
╚══════════════════════════════════╝
```

## 3. Alternative Logo Styles

### Compact Logo
```
▓▓▓ MODERN TELETEXT ▓▓▓
```

### Simple Logo
```
┌────────────────────────────────────┐
│    MODERN TELETEXT SYSTEM v1.0    │
└────────────────────────────────────┘
```

### Retro Logo
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ MODERN █ TELETEXT █ SYSTEM █ v1.0 █
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

## 4. Kiro Badge Variants

```
⚡ Powered by Kiro
✨ Built with Kiro
🚀 Made with Kiro
💫 Created with Kiro
```

## 5. Boot Sequence Display

```
╔══════════════════════════════════╗
║  MODERN TELETEXT  ░▒▓█▓▒░       ║
╚══════════════════════════════════╝

SYSTEM READY

KEYBOARD CONTROLS:
0-9: Enter page number
Arrow Keys: Navigate pages
R/G/Y/B: Color shortcuts

▶ PRESS ANY KEY TO ENTER ◀

⚡ Powered by Kiro
```

## 6. Scrolling Credits (Sample)

```
════════════════════════════════════
         MODERN TELETEXT
            Version 1.0
════════════════════════════════════


         CREATED BY

      The Modern Teletext Team


════════════════════════════════════
           BUILT WITH
════════════════════════════════════

         Next.js & React
      TypeScript & Tailwind CSS

         Firebase Platform
    Hosting • Functions • Firestore

        Google Gemini AI
      Vertex AI • Generative AI


════════════════════════════════════
      ⚡ POWERED BY KIRO ⚡
════════════════════════════════════

    Built with Kiro AI Assistant
    Designed for the Kiroween
    Hackathon 2024
```

## 7. Page 100 Integration

```
╔══════════════════════════════════╗P100
║  MODERN TELETEXT  ░▒▓█▓▒░       ║
╚══════════════════════════════════╝
    Fri 22 Nov 14:30

▓▓▓▓ INFORMATION & SYSTEM ▓▓▓▓▓▓▓▓▓▓
  101  ℹ️  System Info & How It Works
  110  📋 System Pages Index
▓▓▓▓ NEWS & CURRENT AFFAIRS ▓▓▓▓▓▓▓▓
  ►200 📰 News Headlines & Stories
▓▓▓▓ SPORT & LIVE SCORES ▓▓▓▓▓▓▓▓▓▓▓
  ►300 ⚽ Sport Results & Fixtures
▓▓▓▓ MARKETS & FINANCE ▓▓▓▓▓▓▓▓▓▓▓▓▓
  ►400 📈 Markets, Stocks & Crypto
  ►420 🌤️  Weather Forecasts
▓▓▓▓ INTERACTIVE SERVICES ▓▓▓▓▓▓▓▓▓▓
  ►500 🤖 AI Oracle  ►600 🎮 Games
  ►700 ⚙️  Settings  ►800 🔧 Dev Tools

        ★ WHAT'S NEW ★
  Enhanced UX with visual indicators!
  Try page 666 for a spooky surprise...
────────────────────────────────────────
🔴NEWS 🟢SPORT 🟡WEATHER 🔵AI  999=HELP
```

## Animation Timings

- **Logo Reveal**: 2.3 seconds (23 frames @ 100ms each)
- **Logo Pulse**: 2.4 seconds per cycle (8 frames @ 300ms each)
- **Kiro Badge**: 2.0 seconds per cycle (5 frames @ 400ms each)
- **Scrolling Credits**: Variable (150ms per frame)

## Usage in Code

```typescript
// Import the logo module
import { 
  MODERN_TELETEXT_LOGO,
  createLogoRevealAnimation,
  createKiroBadgeAnimation,
  formatLogoForPage 
} from '@/lib/ascii-logo';

// Display static logo
const logoRows = formatLogoForPage(MODERN_TELETEXT_LOGO);

// Animate logo reveal
const animEngine = getAnimationEngine();
const revealAnim = createLogoRevealAnimation();
animEngine.playAnimationConfig(revealAnim, logoElement);

// Animate Kiro badge
const badgeAnim = createKiroBadgeAnimation();
animEngine.playAnimationConfig(badgeAnim, badgeElement);
```

## Demo

Open `lib/__tests__/ascii-logo-demo.html` in a browser to see all animations in action!

