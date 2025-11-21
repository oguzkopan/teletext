# Sports Live Indicators Usage Guide

This document describes how to use the sports live indicators and animations system for displaying live match information with visual enhancements.

## Overview

The sports live indicators system provides:
- Pulsing "LIVE" indicators for ongoing matches (Requirement 22.1)
- Score change flash animations (Requirement 22.2)
- Animated time indicators with soccer ball emoji (Requirement 22.3)
- Color coding for match status (Requirement 22.4)
- "FULL TIME" animation when matches end (Requirement 22.5)

## Requirements Addressed

- **22.1**: Pulsing "LIVE" indicator for ongoing matches
- **22.2**: Score change flash animation when scores update
- **22.3**: Animated time indicators (e.g., "87' ⚽")
- **22.4**: Color coding for match status (green=live, yellow=half-time, white=finished)
- **22.5**: "FULL TIME" animation when matches end

## Core Functions

### Match Status Information

```typescript
import { getMatchStatusInfo } from './sports-live-indicators';

const statusInfo = getMatchStatusInfo('2H', 87);
// Returns:
// {
//   status: 'LIVE',
//   elapsed: 87,
//   color: 'green',
//   displayText: "87'",
//   isLive: true
// }
```

### Score Line Formatting

```typescript
import { formatScoreLine } from './sports-live-indicators';

const scoreLine = formatScoreLine(
  'Manchester United',
  'Chelsea',
  2,
  1,
  statusInfo,
  {
    homeTeamWidth: 12,
    awayTeamWidth: 12,
    includeTimeIndicator: true
  }
);
// Returns: "MAN UTD      2 - 1  CHELSEA      87' ⚽"
```

### Live Indicator

```typescript
import { createLiveIndicator } from './sports-live-indicators';

const liveText = createLiveIndicator();
// Returns: "● LIVE"
```

### Full Time Indicator

```typescript
import { createFullTimeIndicator } from './sports-live-indicators';

const fullTimeText = createFullTimeIndicator();
// Returns: "✓ FULL TIME"
```

## Score Change Tracking

Track score changes for animation purposes:

```typescript
import { ScoreChangeTracker } from './sports-live-indicators';

const tracker = new ScoreChangeTracker();

// Check if score changed
const change = tracker.checkScoreChange('match-123', 2, 1);
if (change) {
  console.log('Home score changed:', change.homeScoreChanged);
  console.log('Away score changed:', change.awayScoreChanged);
  // Trigger flash animation
}

// Check if animation should still be active
if (tracker.isAnimationActive('match-123')) {
  // Apply flash animation class
}
```

## CSS Classes

### Match Status Color Coding

```html
<!-- Live match (green) -->
<div class="match-status-live">87' ⚽</div>

<!-- Half-time (yellow) -->
<div class="match-status-halftime">HT</div>

<!-- Finished (white) -->
<div class="match-status-finished">FT</div>

<!-- Postponed (red) -->
<div class="match-status-postponed">PST</div>
```

### Live Indicator Pulsing

```html
<span class="live-indicator-pulse">● LIVE</span>
```

### Score Flash Animation

```html
<span class="score-flash">2 - 1</span>
```

### Full Time Animation

```html
<div class="full-time-animation">✓ FULL TIME</div>
```

## Integration with SportsAdapter

The SportsAdapter automatically uses these utilities:

```typescript
// In formatLiveScoresPage method
const statusInfo = getMatchStatusInfo(statusShort, elapsed);
const scoreLine = formatScoreLine(homeTeam, awayTeam, homeScore, awayScore, statusInfo);

// Track score changes
const scoreChange = this.scoreTracker.checkScoreChange(matchId, homeScore, awayScore);

// Add animation metadata
if (statusInfo.isLive) {
  rows.push(`[LIVE_PULSE:${matchId}]`);
}
if (scoreChange) {
  rows.push(`[SCORE_FLASH:${matchId}]`);
}
```

## Color Coding Reference

| Status | Color | CSS Class | Description |
|--------|-------|-----------|-------------|
| LIVE (1H, 2H) | Green | `match-status-live` | Match in progress |
| HT | Yellow | `match-status-halftime` | Half-time |
| FT | White | `match-status-finished` | Match finished |
| PST, CANCELLED | Red | `match-status-postponed` | Postponed/Cancelled |

## Animation Timing

- **Live Pulse**: 1.5s cycle, continuous
- **Score Flash**: 0.5s duration, triggered on change
- **Full Time**: 1s reveal animation
- **Time Indicator**: 2s bounce cycle

## Accessibility

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .live-indicator-pulse,
  .score-flash,
  .full-time-animation {
    animation: none;
  }
}
```

## Example: Complete Match Display

```typescript
import {
  getMatchStatusInfo,
  formatScoreLine,
  createLiveIndicator,
  ScoreChangeTracker
} from './sports-live-indicators';

const tracker = new ScoreChangeTracker();

function displayMatch(fixture: any) {
  const statusInfo = getMatchStatusInfo(
    fixture.status.short,
    fixture.status.elapsed
  );
  
  const scoreLine = formatScoreLine(
    fixture.teams.home.name,
    fixture.teams.away.name,
    fixture.goals.home,
    fixture.goals.away,
    statusInfo
  );
  
  // Check for score changes
  const change = tracker.checkScoreChange(
    fixture.id,
    fixture.goals.home,
    fixture.goals.away
  );
  
  // Build display with appropriate classes
  let classes = [];
  if (statusInfo.isLive) {
    classes.push('match-status-live', 'live-indicator-pulse');
  }
  if (change) {
    classes.push('score-flash');
  }
  if (statusInfo.status === 'FT') {
    classes.push('full-time-animation');
  }
  
  return {
    text: scoreLine,
    classes: classes.join(' '),
    statusInfo
  };
}
```

## Testing

Test files are located at:
- `lib/__tests__/sports-live-indicators.test.ts`

Run tests:
```bash
npm test -- sports-live-indicators
```
