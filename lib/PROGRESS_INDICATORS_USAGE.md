# Progress Indicators Usage Guide

This module provides utilities for displaying progress indicators in multi-step processes, including step counters, ASCII progress bars, question counters, and completion animations.

## Requirements

Implements requirements 19.1, 19.2, 19.3, 19.4, 19.5 from the Teletext UX Redesign specification.

## Features

- **Step Counters**: Display current step in multi-step processes (e.g., "Step 2 of 4")
- **Question Counters**: Display current question in quizzes (e.g., "Question 3/10")
- **ASCII Progress Bars**: Visual progress representation using block characters (e.g., "▓▓▓▓▓░░░░░")
- **Completion Animations**: Checkmarks and celebration messages for completed processes
- **Flexible Formatting**: Centered display, custom widths, and teletext-optimized layouts

## Basic Usage

### Step Counter

```typescript
import { renderStepCounter } from './progress-indicators';

// Basic step counter
const step = renderStepCounter({ current: 2, total: 4 });
// Returns: "Step 2 of 4"

// With custom label
const phase = renderStepCounter({ current: 3, total: 5, label: 'Phase' });
// Returns: "Phase 3 of 5"

// With percentage
const stepWithPercent = renderStepCounter({ 
  current: 2, 
  total: 4, 
  showPercentage: true 
});
// Returns: "Step 2 of 4 (50%)"
```

### Question Counter

```typescript
import { renderQuestionCounter } from './progress-indicators';

const question = renderQuestionCounter(3, 10);
// Returns: "Question 3/10"
```

### Progress Bar

```typescript
import { renderProgressBar } from './progress-indicators';

// Basic progress bar (default width: 10)
const bar = renderProgressBar({ current: 5, total: 10 });
// Returns: "▓▓▓▓▓░░░░░"

// Custom width
const wideBar = renderProgressBar({ current: 5, total: 10, width: 20 });
// Returns: "▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░"

// With percentage label
const barWithLabel = renderProgressBar({ 
  current: 7, 
  total: 10, 
  showLabel: true 
});
// Returns: "▓▓▓▓▓▓▓░░░ 70%"

// Custom characters
const customBar = renderProgressBar({
  current: 3,
  total: 10,
  filledChar: '█',
  emptyChar: '─'
});
// Returns: "███───────"
```

### Completion Animation

```typescript
import { renderCompletionAnimation } from './progress-indicators';

// Simple checkmark
const checkmark = renderCompletionAnimation({ type: 'checkmark' });
// Returns: ["✓ COMPLETE!"]

// Checkmark with message
const checkmarkMsg = renderCompletionAnimation({
  type: 'checkmark',
  message: 'Well done!'
});
// Returns: ["✓ COMPLETE!", "Well done!"]

// Celebration
const celebration = renderCompletionAnimation({ 
  type: 'celebration',
  message: 'Quiz Finished!'
});
// Returns: ["🎉 Quiz Finished! 🎉", "✓ COMPLETE!"]

// Custom symbol
const custom = renderCompletionAnimation({
  type: 'custom',
  customSymbol: '★',
  message: 'Perfect Score!'
});
// Returns: ["★ Perfect Score! ★"]
```

## Advanced Usage

### Combined Progress Display

```typescript
import { renderCombinedProgress } from './progress-indicators';

const combined = renderCombinedProgress({ current: 2, total: 4 });
// Returns: ["Step 2 of 4", "▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░"]

const customCombined = renderCombinedProgress(
  { current: 3, total: 5, label: 'Question' },
  30  // bar width
);
// Returns: ["Question 3 of 5", "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░"]
```

### Full Progress Display for Teletext

```typescript
import { createProgressDisplay } from './progress-indicators';

// Complete progress display (centered, with bar and percentage)
const display = createProgressDisplay({ current: 3, total: 5 });
// Returns: [
//   "        Step 3 of 5         ",
//   "      ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░      ",
//   "             60%                "
// ]

// Custom options
const customDisplay = createProgressDisplay(
  { current: 2, total: 4, label: 'Question' },
  {
    showBar: true,
    showPercentage: true,
    barWidth: 30,
    centered: true
  }
);
```

### Centered Display

```typescript
import { centerProgressIndicator } from './progress-indicators';

// Center in 40-character width (teletext standard)
const centered = centerProgressIndicator('Step 2 of 4');
// Returns: "              Step 2 of 4              "

// Custom width
const custom = centerProgressIndicator('Progress', 20);
// Returns: "      Progress      "
```

### Confetti Animation

```typescript
import { createConfettiAnimation } from './progress-indicators';

const confetti = createConfettiAnimation();
// Returns: [
//   "    *  ·  *  ·  *  ·  *  ·  *    ",
//   "  ·  *  ·  *  ·  *  ·  *  ·  *  ",
//   "    *  ·  *  ·  *  ·  *  ·  *    "
// ]
```

## Integration Examples

### Quiz Page with Progress

```typescript
import { 
  renderQuestionCounter, 
  renderProgressBar,
  createProgressDisplay 
} from './progress-indicators';

function createQuizPage(currentQuestion: number, totalQuestions: number) {
  const rows = [
    'QUIZ OF THE DAY              P602',
    '════════════════════════════════════',
    '',
    ...createProgressDisplay({
      current: currentQuestion,
      total: totalQuestions,
      label: 'Question'
    }),
    '',
    'What is the capital of France?',
    '',
    'A. London',
    'B. Paris',
    'C. Berlin',
    'D. Madrid',
    // ... rest of page
  ];
  
  return rows;
}
```

### AI Multi-Step Flow

```typescript
import { renderStepCounter, renderProgressBar } from './progress-indicators';

function createAIFlowPage(step: number, totalSteps: number) {
  const rows = [
    'AI ASSISTANT                 P510',
    '════════════════════════════════════',
    '',
    centerProgressIndicator(renderStepCounter({ current: step, total: totalSteps })),
    centerProgressIndicator(renderProgressBar({ current: step, total: totalSteps, width: 20 })),
    '',
    'Please select your topic:',
    '',
    '1. News & Current Events',
    '2. Technology & Science',
    '3. Career & Education',
    // ... rest of page
  ];
  
  return rows;
}
```

### Completion Page

```typescript
import { 
  renderCompletionAnimation, 
  createConfettiAnimation 
} from './progress-indicators';

function createCompletionPage(score: number, total: number) {
  const percentage = Math.round((score / total) * 100);
  const completion = renderCompletionAnimation({
    type: 'celebration',
    message: 'Quiz Complete!'
  });
  const confetti = createConfettiAnimation();
  
  const rows = [
    'QUIZ RESULTS                 P603',
    '════════════════════════════════════',
    '',
    ...confetti,
    '',
    ...completion.map(line => centerProgressIndicator(line)),
    '',
    `Final Score: ${score}/${total} (${percentage}%)`,
    '',
    // ... rest of page
  ];
  
  return rows;
}
```

## Utility Functions

### Calculate Percentage

```typescript
import { calculateProgressPercentage } from './progress-indicators';

const percentage = calculateProgressPercentage(7, 10);
// Returns: 70
```

### Validate Progress Values

```typescript
import { validateProgressValues } from './progress-indicators';

try {
  validateProgressValues(5, 10);  // OK
  validateProgressValues(11, 10); // Throws error
} catch (error) {
  console.error('Invalid progress values:', error.message);
}
```

## Best Practices

1. **Always validate inputs**: Use `validateProgressValues()` before rendering progress indicators
2. **Use appropriate widths**: For teletext (40 chars), use bar widths of 20-30 for best visual balance
3. **Center important indicators**: Use `centerProgressIndicator()` for headers and key information
4. **Combine elements**: Use `createProgressDisplay()` for complete, ready-to-use progress sections
5. **Match theme**: Choose completion animation types that match your page theme (celebration for success, checkmark for completion)

## Error Handling

All functions validate their inputs and throw descriptive errors:

```typescript
// Invalid current value (must be 1-based)
renderStepCounter({ current: 0, total: 4 });
// Throws: "Invalid progress values: current must be between 1 and total"

// Current exceeds total
renderQuestionCounter(11, 10);
// Throws: "Invalid question values: current must be between 1 and total"

// Invalid width
renderProgressBar({ current: 5, total: 10, width: 0 });
// Throws: "Width must be at least 1"
```

## TypeScript Types

```typescript
interface ProgressConfig {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

interface ProgressBarConfig {
  current: number;
  total: number;
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  showLabel?: boolean;
}

interface CompletionConfig {
  type: 'checkmark' | 'celebration' | 'custom';
  message?: string;
  customSymbol?: string;
}
```

## Testing

The module includes comprehensive unit tests covering:
- All rendering functions
- Edge cases (first/last steps, empty/full progress)
- Error conditions
- Integration scenarios

Run tests with:
```bash
npm test -- lib/__tests__/progress-indicators.test.ts
```

## Related Modules

- `layout-manager.ts`: For overall page layout
- `navigation-indicators.ts`: For navigation-specific indicators
- `animation-engine.ts`: For animated progress effects
