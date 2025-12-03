# Halloween Snake Game 🐍👻🎃

A spooky offline snake game for the Kiroween Teletext application!

## Features

### Game Mechanics
- **Classic Snake Gameplay**: Guide a ghostly snake to collect pumpkins
- **5 Haunted Levels**: Progress through increasingly difficult stages
- **Offline Play**: No internet connection required
- **ASCII Art Design**: Perfect for teletext aesthetic

### Levels
1. **Graveyard** (Speed: 200ms) - Target: 5 pumpkins
2. **Haunted House** (Speed: 150ms) - Target: 10 pumpkins, 2 obstacles
3. **Cursed Forest** (Speed: 120ms) - Target: 15 pumpkins, 3 obstacles
4. **Ghost Town** (Speed: 100ms) - Target: 20 pumpkins, 4 obstacles
5. **Demon Realm** (Speed: 80ms) - Target: 30 pumpkins, 5 obstacles

### Controls
- **Arrow Keys** or **WASD** - Move the snake
- **SPACE** - Pause/Resume
- **ENTER** or **S** - Start/Restart game

### Halloween Theme
- 👻 Ghost snake (you!)
- 🎃 Pumpkins (food)
- █ Red obstacles
- ▓ Green snake body
- Spooky level names

## Pages

### Page 650 - Game Instructions
- Full game description
- Level information
- Controls guide
- How to play

### Page 650-play - Game Play
- Interactive game board
- Real-time gameplay
- Score tracking
- Level progression

## Files Created

1. **lib/halloween-snake-game.ts** - Core game logic
   - Game state management
   - Snake movement
   - Collision detection
   - Level progression
   - Food generation

2. **components/HalloweenSnakeGame.tsx** - React component
   - Game rendering
   - Keyboard controls
   - Game loop
   - UI display

3. **lib/snake-game-page.ts** - Teletext pages
   - Instructions page (650)
   - Play page (650-play)
   - Themed design

## Integration

The game is integrated into:
- **Page 600** (Games Hub) - Listed as option 650
- **Page Registry** - Registered for navigation
- **Full theme support** - Uses app colors and design

## How to Play

1. Navigate to page **600** (Games Hub)
2. Select **650** for Halloween Snake Game
3. Read the instructions
4. Press **PLAY** or navigate to **650-play**
5. Press **ENTER** or **S** to start
6. Use arrow keys to move
7. Collect pumpkins and avoid obstacles!

## Technical Details

- **Pure TypeScript/React** - No external game libraries
- **State Management** - React hooks for game state
- **Keyboard Events** - Native browser keyboard handling
- **Game Loop** - setInterval for smooth gameplay
- **Responsive** - Adapts to different speeds per level

## Future Enhancements

Possible additions:
- High score tracking (localStorage)
- Sound effects
- More levels
- Power-ups
- Different snake skins
- Multiplayer mode

Enjoy the spooky snake adventure! 🎃👻🐍
