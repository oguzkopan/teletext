---
title: "Resurrecting Teletext: Building Modern Teletext with Kiro AI for Kiroween 🎃"
published: false
description: "How I used Kiro's spec-driven development and vibe coding to resurrect 1970s teletext technology as a modern web app with AI chat, games, live radio, and spooky features"
tags: kiro, hackathon, ai, webdev
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/placeholder.jpg
canonical_url: null
---

# 🎃 Resurrecting Teletext: Building Modern Teletext with Kiro AI 👻

For the [Kiroween Hackathon](https://kiroween.devpost.com/), I resurrected 1970s teletext technology as a modern web app. **Modern Teletext** faithfully recreates BBC Ceefax-style navigation with AI chat, interactive games, live radio streaming, and Halloween horror elements - all built in 60 hours with Kiro AI.

**🏆 Category:** Resurrection  
**🔗 Live Demo:** [https://oguzkopan.com](https://oguzkopan.com)  
**📦 GitHub:** [https://github.com/oguzkopan/teletext](https://github.com/oguzkopan/teletext)

## What is Teletext? 📺

Teletext was a 1970s-90s broadcast system that transmitted text over TV signals. Users navigated with three-digit page numbers (100, 201, 302) to access news, weather, and sports - all in a character grid with 8 colors. It was fast, accessible, and distraction-free. And it's been dead for over a decade.

**Why resurrect it?** Modern web design is bloated and distracting. Teletext was the opposite: keyboard-only navigation, instant loading, no ads, no tracking. Perfect for the Resurrection category!

## The Tech Stack 🛠

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Firebase App Hosting (serverless, no Cloud Functions!)
- **AI:** Google Gemini via Vertex AI (direct integration)
- **Audio:** HTML5 Audio API for live radio streaming
- **Development:** Kiro AI IDE

## What I Built: 50+ Pages of Retro Goodness 🚀

### Page 100: Kiroween-Themed Main Index 🏠

The hub of everything with full Halloween treatment:
- 🎃 Animated decorations (pumpkins, ghosts, bats)
- Live date/time display
- Organized sections: News, Sports, Markets, AI, Games, Services
- Color-coded navigation (Red/Green/Yellow/Blue buttons)
- Quick access to popular pages

### News Pages (200-299) 📰

Real news content with smart navigation:
- **200**: News index with breaking news banner
- **201**: UK News with 5 top stories
- **202**: World News from international sources
- **203**: Local News with community updates
- **Single-digit navigation**: Press `1-5` on news pages to read full articles
- **Article pages** (201-1, 201-2, etc.): Full article text with source attribution

The innovation here: context-aware input. On news pages, pressing `1` reads article 1. But you can still type `201` to navigate to another page. Kiro helped me build a metadata-driven input system that switches modes dynamically.

### Sports Pages (300-399) ⚽

Live scores and match updates:
- **300**: Sports index with live scores indicator
- **301-304**: Football, Cricket, Tennis, Live Scores
- **Single-digit navigation**: Press `1-3` to read sports stories
- Real-time score updates (when API is connected)

### Markets Pages (400-499) 📈

Financial data in retro style:
- **400**: Markets overview with major indices (FTSE, S&P 500, DAX, Nikkei)
- Live cryptocurrency prices (BTC, ETH, XRP) with 24h changes
- **401-403**: Stocks, Crypto, Commodities
- **450-453**: Currency exchange, lottery results, horoscopes
- **460-462**: Flight info, hotels, restaurants
- **470-472**: TV guide, **radio listings**, cinema times

### AI Oracle (Page 500): The Game-Changer 🤖

This is where I broke from traditional teletext. Instead of menu-driven navigation, I built a **direct chat interface**:

```typescript
export function createAIOraclePage(): TeletextPage {
  return {
    id: '500',
    title: 'AI Oracle Chat',
    rows: [
      '{cyan}500 {yellow}🤖 AI ORACLE CHAT 🤖',
      '{yellow}╔════════════════════════════════════╗',
      '{yellow}║    {cyan}🎯 ASK ME ANYTHING 🎯{yellow}        ║',
      '{yellow}╚════════════════════════════════════╝',
      '',
      '{white}Type your question below and press {green}ENTER{white}:',
      '',
      '{yellow}▶{white} _',  // Blinking cursor
    ],
    meta: {
      inputMode: 'text',  // Enable text input!
      textInputEnabled: true,
      aiChatPage: true,
      stayOnPageAfterSubmit: true  // Responses appear on same page
    }
  };
}
```

**What makes this special:**
- Type any question directly (no menu navigation!)
- AI responses appear on the same page (no page jumping)
- Powered by Google Gemini via Vertex AI
- Maintains teletext aesthetic while being modern
- **Page 501**: Quick topic shortcuts for instant answers

**Kiro's contribution:** When I said "I want direct text input on page 500," Kiro understood immediately and generated the entire metadata system (`inputMode`, `textInputEnabled`, `stayOnPageAfterSubmit`) without me explaining the architecture.

### Live Radio Streaming (Page 471) 📻

One of my favorite features - **9 international radio stations** integrated into teletext:

```typescript
export function createRadioListingsPage(): TeletextPage {
  return {
    id: '471',
    title: 'Radio Listings',
    rows: [
      '{cyan}471 {yellow}📻 RADIO LISTINGS 📻',
      '',
      '{cyan}▓▓▓ NOW PLAYING ▓▓▓',
      '{yellow}► {white}Radio Swiss Jazz',
      '{white}  Jazz                {cyan}Switzerland',
      '{white}  Quality: {green}128kbps',
      '',
      '{cyan}▓▓▓ AVAILABLE STATIONS ▓▓▓',
      '{green}[1]{white} Radio Swiss Jazz      {green}Jazz        {cyan}Switzerland',
      '{green}[2]{white} Radio Swiss Classic   {green}Classical   {cyan}Switzerland',
      '{green}[3]{white} Radio Paradise        {green}Eclectic    {cyan}USA',
      // ... 6 more stations
    ],
    meta: {
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      radioPlayer: {
        enabled: true,
        currentStation: station,
        stations: RADIO_STATIONS
      }
    }
  };
}
```

**Features:**
- 9 live radio stations (Switzerland, UK, France, USA)
- Press 1-9 to switch stations instantly
- Audio plays in background while navigating other pages
- Genres: Jazz, Classical, Pop, Eclectic
- Real streaming URLs (no mock data!)

**How Kiro helped:** I said "Add live radio with instant station switching." Kiro generated the entire system: station data structure, HTML5 Audio integration, single-digit input mode, and background audio persistence. It even suggested the `meta.radioPlayer` object pattern!

### Games Hub (600-699) 🎮

Interactive entertainment in teletext:
- **600**: Games index with leaderboard
- **601**: Quiz of the Day (AI-generated questions)
- **610**: Bamboozle Quiz (spot the fake answer)
- **620**: Random Facts & Trivia
- **650**: 🐍 **Halloween Snake Game** (playable offline!)

### Halloween Snake Game (Page 650) 🐍

A full ASCII snake game with 5 progressive levels:

```typescript
const LEVELS = [
  { name: 'Graveyard', speed: 200, scoreTarget: 5, obstacles: [] },
  { name: 'Haunted House', speed: 150, scoreTarget: 10, obstacles: [...] },
  { name: 'Cursed Forest', speed: 120, scoreTarget: 15, obstacles: [...] },
  { name: 'Ghost Town', speed: 100, scoreTarget: 20, obstacles: [...] },
  { name: 'Demon Realm', speed: 80, scoreTarget: 30, obstacles: [...] }
];
```

**Features:**
- Ghost snake (@ for head, o for body)
- Pumpkin food (O)
- Red obstacles (█) that increase per level
- Progressive difficulty (speed increases)
- Level names with Halloween theme
- Score tracking and level progression

**Kiro's magic:** I said "Create a Halloween snake game with levels and obstacles." Kiro generated the entire game logic: level system, obstacle collision detection, progressive difficulty, ASCII rendering, and keyboard controls. It even suggested the Halloween-themed level names!

### Interactive Theme Selection (Page 700) 🎨

Press 1-4 to instantly switch themes:

```typescript
export function createThemeSelectionPage(): TeletextPage {
  return {
    id: '700',
    title: 'Theme Selection',
    rows: [
      '{cyan}700 {yellow}🎨 THEME SELECTION 🎨',
      '',
      '{cyan}▓▓▓ AVAILABLE THEMES ▓▓▓',
      '',
      '{green}[1] {yellow}CEEFAX {white}- Classic BBC Teletext',
      '{white}    Traditional yellow/blue color scheme',
      '',
      '{green}[2] {green}ORF {white}- Austrian Teletext Style',
      '{white}    Green/black matrix-style aesthetic',
      '',
      '{green}[3] {white}HIGH CONTRAST {white}- Accessibility Mode',
      '{white}    Maximum readability, bold colors',
      '',
      '{green}[4] {magenta}HAUNTING MODE {white}- Spooky Theme',
      '{white}    Dark atmospheric colors with effects',
    ],
    meta: {
      themeSelectionPage: true,
      inputMode: 'single',
      inputOptions: ['1', '2', '3', '4']
    }
  };
}
```

**No page reload** - themes apply instantly via the metadata system. The `KeyboardHandler` component reads `meta.inputMode` and switches behavior dynamically.

### The Cursed Page 666: My Kiroween Showpiece 👻💀

A fully animated horror experience with ASCII skull art:

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

                    ╔═══════════════════════════════════════╗
                    ║  THE SPIRITS HAVE BEEN AWAKENED       ║
                    ║  You have disturbed their slumber     ║
                    ╚═══════════════════════════════════════╝

▓▓▓ CURSED TRANSMISSIONS ▓▓▓
The teletext signal is corrupted... Strange messages appear...

[SIGNAL LOST] The darkness spreads...
[INTERFERENCE] We are watching...
[CORRUPTED] You cannot escape...
```

**Pure CSS Animations (no JavaScript overhead):**
- **Glitch effect**: Text shifts and distorts like corrupted signals
- **Pulse**: Warning messages glow red
- **Flicker**: Entire page flickers like unstable CRT
- **Shake**: Elements tremble for emphasis
- **Skull breathing**: Subtle scaling animation
- **Color shift**: Eerie hue rotation

```css
@keyframes glitch {
  0% { transform: translate(0); opacity: 1; }
  20% { transform: translate(-2px, 2px); opacity: 0.8; }
  40% { transform: translate(2px, -2px); opacity: 0.9; }
  60% { transform: translate(-1px, 1px); opacity: 0.85; }
  80% { transform: translate(1px, -1px); opacity: 0.95; }
  100% { transform: translate(0); opacity: 1; }
}

[data-page-id="666"] [data-cursed="true"] {
  animation: glitch 2s infinite;
}
```

**Accessibility:**
- All animations respect `prefers-reduced-motion`
- High contrast mode available
- Screen reader friendly
- Full keyboard navigation

**Variants:**
- **666**: Main cursed page with ASCII skull
- **666-1**: Alternative with different ASCII art (eyes with 👁 emoji)
- **666-2**: Original version

**Kiro's creativity:** I said "Create a cursed page with animated ASCII skull and glitch effects." Kiro generated the entire horror experience: hand-crafted ASCII art, CSS animations, multiple variants, and accessibility support. It even suggested the "CURSED TRANSMISSIONS" messages!

### Beautiful 404 Error Page 🎃

Not just a boring "Page Not Found" - a Halloween-themed masterpiece with animated ASCII skull, spooky decorations, helpful navigation suggestions, and the message "The spirits took it away..."

## How I Used Kiro: The Development Journey 🤖

### 1. Spec-Driven Foundation 📋

I created **4 comprehensive specs** in `.kiro/specs/`:

**modern-teletext/** - The foundation:
- 38 EARS-compliant requirements
- 34 correctness properties for property-based testing
- Complete architecture design
- 40+ implementation tasks

**teletext-ux-redesign/** - Visual polish:
- Full-screen layout system (90%+ screen utilization)
- Theme-specific animations
- Navigation indicators and breadcrumbs
- Content type icons (📰 NEWS, ⚽ SPORT, 🤖 AI)

**teletext-core-redesign/** - Architecture improvements:
- Multi-column layout engine
- Advanced navigation router
- Input handling system
- Page renderer with visual verification

**teletext-complete-overhaul/** - Final touches:
- Error handling and retry logic
- Performance optimization
- Accessibility improvements
- Comprehensive testing

**Why specs worked:** With detailed requirements, Kiro understood the entire system. When I asked it to implement a feature, it knew the constraints, patterns, and architecture without me repeating myself.

### 2. Vibe Coding for Features 💬

After the spec foundation, I used conversational development for rapid iteration:

**Me:** "I want page 500 to have direct text input for AI chat, not menu navigation. Users should type questions and get responses on the same page."

**Kiro:** *Generated the entire system:*
- `inputMode: 'text'` metadata
- `textInputEnabled: true` flag
- `stayOnPageAfterSubmit: true` to prevent navigation
- Input cursor with blinking animation
- AI response rendering on same page
- Integration with Vertex AI

**Me:** "Add live radio streaming on page 471. Users should press 1-9 to switch between 9 international stations. Audio should play in background."

**Kiro:** *Created complete radio system:*
- Radio station data structure with 9 stations
- HTML5 Audio API integration
- Single-digit input mode for station selection
- Background audio that persists during navigation
- Station metadata (name, country, genre, bitrate)
- Beautiful teletext-style station listings

**Me:** "Create a Halloween snake game on page 650 with 5 levels and increasing obstacles."

**Kiro:** *Built entire game:*
- 5 difficulty levels with Halloween-themed names
- Obstacle system that increases per level
- Score tracking and level progression
- ASCII rendering (@ for head, o for body, O for food, █ for obstacles)
- Keyboard controls (arrow keys)
- Level transition system

**Me:** "Create cursed page 666 with animated ASCII skull art, glitch effects, and disturbing messages."

**Kiro:** *Generated horror experience:*
- Hand-crafted ASCII skull art
- CSS animations (glitch, pulse, flicker, shake)
- Multiple variants (666, 666-1, 666-2)
- Accessibility support (reduced motion)
- Escape routes to safe pages
- "CURSED TRANSMISSIONS" messages

### 3. The Power of Context Awareness 🧠

What impressed me most: **Kiro never forgot the constraints**. Across hundreds of conversations, it remembered:
- Teletext format rules (character grid, colors)
- Page numbering scheme (100-899)
- Navigation patterns (3-digit, single-digit, colored buttons)
- Metadata system architecture
- Accessibility requirements
- Performance guidelines

**Example:** When I asked for the radio feature, Kiro automatically:
- Used the metadata pattern I'd established
- Added accessibility features (keyboard navigation)
- Implemented error handling
- Followed the teletext aesthetic
- Suggested improvements (background audio persistence)

## Key Challenges & Solutions 🔧

### Challenge 1: Text Input in Teletext

**Problem:** Traditional teletext only had numeric input. How do I add text input for AI chat while maintaining authenticity?

**Solution:** Metadata-driven input modes:
```typescript
meta: {
  inputMode: 'text',  // vs 'single' or 'triple'
  textInputEnabled: true,
  stayOnPageAfterSubmit: true
}
```

The `KeyboardHandler` component reads this metadata and switches input modes dynamically. On page 500, it enables text input. On page 700, it enables single-digit selection. On other pages, it uses 3-digit navigation.

### Challenge 2: Live Radio Streaming

**Problem:** How do I integrate audio streaming without breaking the teletext aesthetic?

**Solution:** The `meta.radioPlayer` object pattern:
```typescript
meta: {
  radioPlayer: {
    enabled: true,
    currentStation: station,
    stations: RADIO_STATIONS
  }
}
```

The `RadioPlayer` component reads this metadata and manages HTML5 Audio in the background. Audio persists during navigation because it's managed at the app level, not the page level.

### Challenge 3: Animated ASCII Art

**Problem:** How do I animate the cursed page skull without JavaScript overhead?

**Solution:** Pure CSS animations with data attributes:
```css
[data-page-id="666"] .skull {
  animation: skull-pulse 3s ease-in-out infinite,
             glitch 2s infinite,
             color-shift 5s infinite;
}

@media (prefers-reduced-motion: reduce) {
  [data-page-id="666"] .skull {
    animation: none;
  }
}
```

GPU-accelerated, performant, and respects accessibility preferences!

### Challenge 4: Context-Aware Navigation

**Problem:** News pages need single-digit input (press 1-5 for articles) but also need 3-digit navigation (type 201 for next page).

**Solution:** Context-aware input handler:
```typescript
meta: {
  inputMode: 'single',  // Accept 1-digit on this page
  inputOptions: ['1', '2', '3', '4', '5']  // Valid options
}
```

The input handler checks current page metadata and switches modes. On news pages, pressing `1` reads article 1. But typing `2-0-1` still navigates to page 201!

## Development Workflow 🔄

My typical day with Kiro:

**Morning:** Review spec, identify next feature  
**Conversation:** "Let's implement [feature], referencing requirements X.Y"  
**Generation:** Kiro generates implementation  
**Testing:** Run tests, check in browser  
**Refinement:** "Can we improve [aspect]?"  
**Iteration:** Kiro updates code  
**Commit:** Git commit with clear message

**Example conversation:**

**Me:** "The cursed page needs more variants. Create 666-1 with different ASCII art."

**Kiro:** *Generated `createCursedPageVariant()` with new skull design featuring 👁 emoji eyes, registered in page registry, added to navigation*

**Me:** "Perfect! Now add a glitch effect that makes text shift randomly."

**Kiro:** *Created CSS keyframe animation, added to cursed-page.css, applied via data attributes, included reduced-motion support*

This cycle was incredibly fast. Features that would take hours took minutes!

## The Results 📊

**Final Stats:**
- 📄 **50+ pages** across 9 sections
- 🎨 **4 themes** with instant switching
- 🤖 **AI Chat** with direct text input (no menu navigation!)
- 📻 **9 radio stations** with live streaming
- 🎮 **5 games** including Snake with 5 levels
- 👻 **3 cursed page variants** with CSS animations
- 🎃 **Beautiful 404** error page with ASCII art
- ⚡ **<500ms** page load times
- ♿ **Full accessibility** support (keyboard nav, reduced motion, screen readers)

**Development Time:**
- Spec creation: ~8 hours
- Implementation with Kiro: ~40 hours
- Testing and polish: ~12 hours
- **Total: ~60 hours** (would have been 200+ hours without Kiro)

**Code Quality:**
- TypeScript strict mode
- Comprehensive error handling
- Property-based testing
- Accessibility compliant
- Performance optimized

## Try It Yourself! 🚀

**Live Demo:** [https://oguzkopan.com](https://oguzkopan.com)

**Must-Try Pages:**
- `100` - Main index (start here!)
- `201` - UK News (press 1-5 for articles)
- `300` - Sports (press 1-3 for stories)
- `400` - Markets with live crypto prices
- `500` - AI Chat (type any question!)
- `471` - Radio (press 1-9 for stations)
- `600` - Games hub
- `650` - Halloween Snake Game
- `666` - 👻 Cursed page (if you dare!)
- `700` - Theme selection (press 1-4)
- `404` - Beautiful error page

**Navigation Tips:**
- Type 3 digits to navigate (e.g., `2` `0` `1`)
- Press 1-9 on special pages for quick actions
- Use arrow keys for multi-page content
- Press R/G/Y/B for colored button navigation
- Type text on page 500 for AI chat

## Key Learnings 📚

### Spec-Driven vs. Vibe Coding

**Spec-Driven (for architecture):**
- Perfect for system design and complex features
- Ensures consistency across codebase
- Enables property-based testing
- Great documentation for future development
- Requires upfront planning but saves time later

**Vibe Coding (for features):**
- Lightning fast for new features
- Great for experimentation and iteration
- Natural conversation flow
- Quick prototyping
- Needs good foundation first

**My Approach:** Spec for architecture, vibe for features. Best of both worlds!

### Kiro's Superpowers 🦸

**Context Awareness:** Kiro remembered constraints across hundreds of conversations. It never forgot the teletext format rules, page numbering scheme, or metadata patterns.

**Pattern Recognition:** After implementing one feature, Kiro understood the pattern and generated similar features consistently. The radio player followed the same metadata pattern as the AI chat.

**Proactive Improvements:** Kiro added error handling, accessibility features, and performance optimizations without being asked. It suggested background audio persistence for the radio player.

**Creative Solutions:** When I said "make it spooky," Kiro generated ASCII art, animations, and effects I hadn't imagined. The "CURSED TRANSMISSIONS" messages were its idea!

## Conclusion 🎬

Building Modern Teletext with Kiro was transformative. The combination of spec-driven architecture and vibe coding for features created a workflow that was both structured and flexible.

Kiro didn't just generate code - it understood context, maintained consistency, and proactively improved the codebase. It felt like pair programming with an expert who never gets tired, always has creative ideas, and remembers every detail.

The Kiroween hackathon pushed me to explore Kiro's full potential. This project would have taken months without AI assistance. With Kiro, I built a fully-featured application with 50+ pages, live radio, AI chat, games, and spooky animations in just 60 hours.

**For the love of building, or maybe the love of darkness, I crafted something wicked. And Kiro was with me every step of the way.** 🎃👻

---

## Resources 📚

- **Kiro IDE:** [https://kiro.dev](https://kiro.dev)
- **Kiroween Hackathon:** [https://kiroween.devpost.com/](https://kiroween.devpost.com/)
- **Project Repo:** [https://github.com/oguzkopan/teletext](https://github.com/oguzkopan/teletext)
- **Live Demo:** [https://oguzkopan.com](https://oguzkopan.com)

---

*Built with 💚 (and a little bit of 🩸) for Kiroween 2024*

#kiro #kiroween #hackathon #ai #webdev #teletext #resurrection
