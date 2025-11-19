# Bamboozle Game Usage Guide

## Overview

The Bamboozle game is a branching story quiz where player choices determine the path through the narrative and lead to different endings. It's accessible through pages 610-619 in the teletext system.

## Game Structure

### Page 610: Introduction
- Presents the game premise: "The Mystery of the Lost Artifact"
- Explains the branching nature of the game
- Lists the 3 possible endings
- Provides a START button to begin

### Page 611: Question 1 - The Temple Entrance
The first decision point that determines the main path:
- **Option 1**: Study the symbols (→ Scholar Path, page 612)
- **Option 2**: Rush in boldly (→ Adventurer Path, page 613)
- **Option 3**: Search for hidden entrance (→ Cursed Path, page 614)

### Pages 612-614: Question 2 (Path-Specific)

#### Page 612: The Ancient Chamber (Scholar Path)
- Choose between golden amulet, dusty book, or crystal orb
- Best choice: dusty book (option 2) for maximum score

#### Page 613: The Trap Room (Adventurer Path)
- Choose between left door, middle door, or right door
- Best choice: middle door (option 2) for maximum score

#### Page 614: The Hidden Passage (Cursed Path)
- Choose between sword statue, shield statue, or crown statue
- Worst choice: crown statue (option 3) for lowest score

### Pages 615-617: Endings

#### Page 615: The Scholar Ending
- Achieved by taking the scholar path
- Rewards wisdom and knowledge
- Score: 75-85 points

#### Page 616: The Adventurer Ending
- Achieved by taking the adventurer path
- Rewards bravery and action
- Score: 70-80 points

#### Page 617: The Cursed Ending
- Achieved by taking the cursed path
- Consequences of disturbing ancient forces
- Score: 35-55 points

## Scoring System

The game uses a point-based scoring system:

### Question 1 Points:
- Scholar path (option 1): +30 points
- Adventurer path (option 2): +25 points
- Cursed path (option 3): +20 points

### Question 2 Points:
- Scholar path best answer: +40 points
- Scholar path other answers: +30 points
- Adventurer path best answer: +45 points
- Adventurer path other answers: +35 points
- Cursed path worst answer: +15 points
- Cursed path other answers: +25 points

### Ending Bonuses:
- Completion bonus: +10 points
- Scholar path bonus: +5 points
- Adventurer path bonus: +10 points

### Maximum Scores:
- Scholar path: 85 points (30 + 40 + 10 + 5)
- Adventurer path: 80 points (25 + 45 + 10)
- Cursed path: 55 points (20 + 25 + 10)

## Session Management

### Session Creation
- Sessions are created automatically when starting the game (page 611)
- Session ID format: `bamboozle_[timestamp]_[random]`
- Sessions expire after 1 hour of inactivity

### Session Data
Each session stores:
- `sessionId`: Unique identifier
- `currentPage`: Current page in the game
- `path`: Array of pages visited
- `score`: Current score
- `choices`: Record of answers selected
- `createdAt`: Session creation timestamp
- `expiresAt`: Session expiration timestamp

### Firestore Collection
Sessions are stored in the `bamboozle_sessions` collection with automatic expiration.

## Navigation

### During Game:
- **INDEX** (Red): Return to main index (page 100)
- **QUIT** (Blue): Return to game intro (page 610)

### At Endings:
- **INDEX** (Red): Return to main index (page 100)
- **RETRY** (Green): Restart the game (page 610)
- **GAMES** (Yellow): Return to games index (page 600)

## Implementation Details

### Branching Logic
The `processBamboozleAnswer()` method handles navigation:
```typescript
if (pageNumber === 611) {
  // Question 1: determines main path
  if (answerIndex === 1) nextPage = '612'; // Scholar
  else if (answerIndex === 2) nextPage = '613'; // Adventurer
  else if (answerIndex === 3) nextPage = '614'; // Cursed
}
```

### Story Nodes
Each page is defined as a story node with:
- Title
- Content rows (24 rows × 40 characters)
- Navigation links

### Session Tracking
The system tracks:
- Which pages have been visited
- Which choices were made at each decision point
- Current score based on choices
- Time remaining before session expiration

## Testing

The Bamboozle game includes comprehensive unit tests covering:
- Intro page display
- Session creation and management
- All three story paths
- All three endings
- Session expiration handling
- Restart functionality

## Future Enhancements

Potential improvements:
- Additional story branches
- More complex scoring algorithms
- Multiple story themes
- Leaderboard integration
- Achievement system
- Story variations based on time of day or season
