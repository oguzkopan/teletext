# 📻 Radio Listings Page (471) - Visual Demo

## Page Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 471 📻 RADIO LISTINGS 📻 13:16                                                                                                    🔴🟢🟡🔵 │
│ ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ │
│                                                                                                                                         │
│ ▓▓▓ NOW PLAYING ▓▓▓                                                                                                                     │
│ ► Radio Swiss Jazz                         [1]                                                                                          │
│   Jazz                    Switzerland                                                                                                   │
│   Quality: 128kbps                                                                                                                      │
│                                                                                                                                         │
│ ▓▓▓ AVAILABLE STATIONS ▓▓▓                                                                                                              │
│ ► [1] Radio Swiss Jazz            Jazz                 Switzerland                                                                      │
│   [2] Radio Swiss Classic         Classical            Switzerland                                                                      │
│   [3] Radio Paradise              Eclectic             USA                                                                              │
│   [4] Classic FM                  Classical            UK                                                                               │
│   [5] Radio Swiss Pop             Pop                  Switzerland                                                                      │
│   [6] FIP Radio                   Eclectic/World       France                                                                           │
│   [7] Capital FM                  Pop/Dance            UK                                                                               │
│   [8] Heart FM                    Pop                  UK                                                                               │
│   [9] Smooth Radio                Easy Listening       UK                                                                               │
│                                                                                                                                         │
│ ▓▓▓ CONTROLS ▓▓▓                                                                                                                        │
│ Press 1-9 to select a station                                                                                                           │
│ Press SPACE to play/pause                                                                                                               │
│ Press M to mute/unmute                                                                                                                  │
│                                                                                                                                         │
│ ╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗     │
│ ║ 💡 TIP: Use number keys to quickly switch between stations. Audio plays in background!                          ║     │
│ ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝     │
│                                                                                                                                         │
│ ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ │
│ NAVIGATION: RED=INDEX GREEN=SERVICES 1-9=SELECT STATION SPACE=PLAY/PAUSE                                                               │
│                                                                                                                                         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Radio Player UI (Floating)

```
                                                                    ┌──────────────────────────────┐
                                                                    │   📻 RADIO PLAYER            │
                                                                    ├──────────────────────────────┤
                                                                    │                              │
                                                                    │   ♪ Now Playing              │
                                                                    │                              │
                                                                    │   🔊 ▬▬▬▬▬▬▬▬▬▬ 70%         │
                                                                    │                              │
                                                                    └──────────────────────────────┘
```

## User Interaction Flow

### 1. Initial State (Page Load)

```
User navigates to page 471
         ↓
Page displays with Radio Swiss Jazz selected (default)
         ↓
Radio player appears in bottom-right corner
         ↓
Status: "⏸ Stopped"
```

### 2. Playing a Station

```
User presses SPACE or clicks play
         ↓
Status changes to: "⟳ Loading..."
         ↓
Stream connects (1-3 seconds)
         ↓
Status changes to: "♪ Now Playing"
         ↓
Audio plays through speakers
```

### 3. Changing Stations

```
User presses "3" (Radio Paradise)
         ↓
Page updates with station 3 highlighted
         ↓
Player switches stream
         ↓
Status: "⟳ Loading..."
         ↓
New station plays
```

### 4. Volume Control

```
User clicks volume slider
         ↓
Drags to adjust (0-100%)
         ↓
Audio volume changes in real-time
         ↓
Icon updates: 🔇 (muted) → 🔉 (low) → 🔊 (high)
```

## Color Scheme

### Page Colors (Teletext Style)

- **Cyan** (`#00FFFF`): Headers, borders, section titles
- **Yellow** (`#FFFF00`): Currently playing indicator, highlights
- **Green** (`#00FF00`): Station numbers, positive status
- **White** (`#FFFFFF`): Main text content
- **Magenta** (`#FF00FF`): Tip box border
- **Red** (`#FF0000`): Error states, navigation buttons

### Player Colors

- **Background**: `rgba(0, 0, 0, 0.9)` - Semi-transparent black
- **Border**: Cyan with glow effect
- **Text**: White on dark background
- **Status Colors**:
  - Loading: Yellow
  - Playing: Green
  - Stopped: White
  - Error: Red

## Animations

### 1. Loading Spinner

```
⟳ → Rotates 360° continuously
Duration: 1 second per rotation
```

### 2. Playing Indicator

```
♪ → Pulses opacity 100% → 50% → 100%
Duration: 1 second per pulse
```

### 3. Station Highlight

```
Selected station: Yellow text with ► arrow
Other stations: Green numbers, white text
Transition: Instant on selection
```

### 4. Player Appearance

```
Slides in from bottom-right
Fade in: 0.3 seconds
Box shadow: Cyan glow effect
```

## Responsive Design

### Desktop (1920x1080)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Teletext Page (centered)                          │
│                                                     │
│                                                     │
│                                                     │
│                                    ┌──────────┐    │
│                                    │  Player  │    │
│                                    └──────────┘    │
└─────────────────────────────────────────────────────┘
```

### Tablet (768x1024)

```
┌───────────────────────────────┐
│                               │
│  Teletext Page (full width)  │
│                               │
│                               │
│                               │
│  ┌──────────────────────┐    │
│  │      Player          │    │
│  └──────────────────────┘    │
└───────────────────────────────┘
```

### Mobile (375x667)

```
┌─────────────────┐
│                 │
│  Teletext Page  │
│  (scrollable)   │
│                 │
│                 │
│ ┌─────────────┐ │
│ │   Player    │ │
│ └─────────────┘ │
└─────────────────┘
```

## Keyboard Shortcuts Reference

```
╔═══════════════════════════════════════════════════════╗
║              RADIO PLAYER SHORTCUTS                   ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  1-9        Select radio station                      ║
║  SPACE      Play / Pause                              ║
║  M          Mute / Unmute                             ║
║                                                       ║
║  R (RED)    Return to index (page 100)               ║
║  G (GREEN)  Return to services menu                   ║
║  ← (LEFT)   Go back in history                        ║
║  → (RIGHT)  Go forward in history                     ║
║                                                       ║
║  BACKSPACE  Remove last digit / Go back               ║
║  ENTER      Confirm page number                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## State Diagram

```
┌─────────────┐
│   STOPPED   │ ◄─────────────────────┐
└──────┬──────┘                       │
       │ Press SPACE                  │
       ↓                              │
┌─────────────┐                       │
│   LOADING   │                       │
└──────┬──────┘                       │
       │ Stream ready                 │
       ↓                              │
┌─────────────┐                       │
│   PLAYING   │ ──────────────────────┤
└──────┬──────┘  Press SPACE          │
       │                              │
       │ Change station               │
       ↓                              │
┌─────────────┐                       │
│   LOADING   │                       │
└──────┬──────┘                       │
       │ Stream ready                 │
       ↓                              │
┌─────────────┐                       │
│   PLAYING   │                       │
└──────┬──────┘                       │
       │                              │
       │ Stream error                 │
       ↓                              │
┌─────────────┐                       │
│    ERROR    │ ──────────────────────┘
└─────────────┘  Try another station
```

## Example User Journey

### Scenario: Listening to Jazz

```
Step 1: User on page 100 (Index)
        Types: 4 7 1
        Presses: ENTER

Step 2: Page 471 loads
        Shows: BBC Radio 1 (default)
        Status: Stopped

Step 3: User wants Radio Swiss Pop
        Presses: 5

Step 4: Page updates
        Shows: Radio Swiss Pop highlighted
        Status: Loading...

Step 5: Stream connects
        Status: ♪ Now Playing
        Audio: Pop music plays

Step 6: User adjusts volume
        Clicks: Volume slider
        Drags: To 50%
        Audio: Volume decreases

Step 7: User takes a break
        Presses: SPACE
        Status: ⏸ Stopped
        Audio: Pauses

Step 8: User returns
        Presses: SPACE
        Status: ♪ Now Playing
        Audio: Resumes

Step 9: User explores other pages
        Presses: R (RED button)
        Returns: To page 100
        Audio: Continues playing in background!

Step 10: User returns to radio
         Types: 4 7 1
         Presses: ENTER
         Shows: Radio Swiss Pop still playing
```

## Technical Details

### Audio Element

```html
<audio
  ref={audioRef}
  src="http://edge-bauerall-01-gos2.sharp-stream.com/jazz.mp3"
  preload="none"
  onCanPlay={handleCanPlay}
  onError={handleError}
  onWaiting={handleWaiting}
  onPlaying={handlePlaying}
/>
```

### Player Component Structure

```
RadioPlayer
├── Audio Element (hidden)
├── Player UI Container
│   ├── Status Display
│   │   ├── Loading Spinner
│   │   ├── Playing Indicator
│   │   ├── Stopped Message
│   │   └── Error Message
│   └── Volume Control
│       ├── Mute Button
│       └── Volume Slider
└── Styles (CSS-in-JS)
```

### Data Flow

```
RADIO_STATIONS (data)
        ↓
createRadioListingsPage()
        ↓
TeletextPage (with metadata)
        ↓
PageRouter (navigation)
        ↓
RadioPlayer (component)
        ↓
HTML5 Audio (playback)
        ↓
Speakers (output)
```

---

**This visual demo shows the complete user experience of the Radio Listings page!** 📻🎵
