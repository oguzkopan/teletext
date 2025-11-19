# Games Adapter Setup and Usage

## Overview

The Games Adapter provides interactive quiz functionality for pages 600-699. It integrates with the Open Trivia Database API for quiz questions and uses Google Vertex AI (Gemini) to generate witty commentary on quiz results.

## Features

- **Quiz of the Day (Page 601)**: Multiple-choice trivia quiz with 5 questions
- **AI-Generated Commentary**: Personalized feedback based on quiz performance
- **Session Management**: Quiz state stored in Firestore with 1-hour expiration
- **HTML Entity Decoding**: Properly handles special characters in questions
- **Fallback Questions**: Built-in teletext-themed questions when API is unavailable

## Page Structure

### Page 600: Games Index
Main landing page for all games with navigation to:
- Quiz of the Day (601)
- Bamboozle Quiz (610) - Coming soon
- Random Facts (620) - Coming soon

### Page 601: Quiz Intro
Introduction page that:
- Fetches 5 trivia questions from Open Trivia Database
- Creates a new quiz session in Firestore
- Displays quiz instructions
- Returns session ID in page metadata

### Pages 602-609: Quiz Questions and Results
Dynamic pages that display:
- Current question with 4 multiple-choice answers
- Shuffled answer options
- Category and difficulty information
- Answer result pages showing correct/incorrect
- Running score

### Page 603: Quiz Results
Final results page with:
- Total score and percentage
- AI-generated witty commentary
- Options to retry or return to games index

## API Integration

### Open Trivia Database

The adapter uses the Open Trivia Database API (https://opentdb.com):

```typescript
GET https://opentdb.com/api.php?amount=5&type=multiple
```

**Response Format:**
```json
{
  "response_code": 0,
  "results": [
    {
      "question": "What is the capital of France?",
      "correct_answer": "Paris",
      "incorrect_answers": ["London", "Berlin", "Madrid"],
      "category": "Geography",
      "difficulty": "easy"
    }
  ]
}
```

**No API Key Required**: The Open Trivia Database is free and doesn't require authentication.

### Fallback Questions

When the API is unavailable, the adapter uses built-in teletext-themed questions:
- Teletext history
- BBC Ceefax facts
- Technical specifications
- Historical dates

## Firestore Collections

### quiz_sessions Collection

Stores active quiz sessions:

```typescript
{
  sessionId: string;           // Unique session identifier
  questions: QuizQuestion[];   // Array of 5 questions
  currentQuestionIndex: number; // Current question (0-4)
  answers: boolean[];          // Array of correct/incorrect
  score: number;               // Current score
  createdAt: Timestamp;
  expiresAt: Timestamp;        // 1 hour from creation
}
```

**TTL Policy**: Sessions automatically expire after 1 hour.

## AI Commentary Generation

The adapter uses Vertex AI (Gemini Pro) to generate personalized commentary:

```typescript
const prompt = `Generate a short, witty, and entertaining comment about someone's quiz performance. 
They scored ${score} out of ${total} questions correct (${percentage}%).

Requirements:
- Keep it under 100 words
- Be playful and humorous
- Match the tone to their performance
- No special formatting or markdown
- Make it feel like a retro teletext message`;
```

**Fallback Commentary**: If AI generation fails, the adapter provides pre-written commentary based on score percentage.

## Usage Examples

### Starting a New Quiz

```typescript
// Navigate to page 601
const page = await gamesAdapter.getPage('601');

// Session ID is returned in metadata
const sessionId = page.meta?.aiContextId;
```

### Displaying a Question

```typescript
// Navigate to page 602 with session ID
const questionPage = await gamesAdapter.getPage('602', { 
  sessionId: 'quiz_1234567890_abc123' 
});

// Question is displayed with shuffled answers
// User selects answer 1-4
```

### Processing an Answer

```typescript
// Process the answer (this would be called by the backend)
const resultPage = await gamesAdapter.processQuizAnswer(sessionId, answerIndex);

// Result page shows if answer was correct
// Updates session with new score
```

### Viewing Results

```typescript
// After all questions answered, navigate to results
const resultsPage = await gamesAdapter.getPage('603', { sessionId });

// Results page includes:
// - Final score
// - Percentage
// - AI-generated commentary
```

## Error Handling

### Session Not Found
If session ID is invalid or expired:
```
SESSION EXPIRED              P602
════════════════════════════════════

YOUR QUIZ SESSION HAS EXPIRED

Quiz sessions expire after 1 hour
of inactivity.

Please start a new quiz to continue
playing.
```

### API Failure
If trivia API is unavailable:
- Uses fallback questions automatically
- Quiz continues normally
- No error shown to user

### AI Commentary Failure
If Vertex AI is unavailable:
- Uses pre-written commentary based on score
- Quiz results still displayed
- No error shown to user

## Testing

Run the test suite:

```bash
cd functions
npm test -- GamesAdapter.test.ts
```

**Test Coverage:**
- Page formatting (24 rows × 40 characters)
- Navigation links
- Trivia API integration
- Fallback questions
- HTML entity decoding
- Session management
- Error handling

## Future Enhancements

### Bamboozle Quiz (Page 610)
Branching quiz game where answers lead to different story paths:
- Multiple story paths
- Different endings based on choices
- Unique scoring system

### Random Facts (Page 620)
Display interesting facts from various categories:
- Science, history, technology
- Refresh on each visit
- Categorized by topic

## Configuration

No additional configuration required. The adapter uses:
- Open Trivia Database (no API key needed)
- Vertex AI (configured via environment variables)
- Firestore (automatic setup)

## Troubleshooting

### Questions Not Loading
- Check internet connectivity
- Verify Open Trivia Database is accessible
- Check Firestore permissions

### AI Commentary Not Generating
- Verify Vertex AI credentials
- Check GOOGLE_CLOUD_PROJECT environment variable
- Ensure Gemini Pro model is enabled

### Session Expired Too Quickly
- Sessions expire after 1 hour by default
- Check Firestore Timestamp configuration
- Verify system clock is accurate

## Related Files

- `functions/src/adapters/GamesAdapter.ts` - Main adapter implementation
- `functions/src/adapters/__tests__/GamesAdapter.test.ts` - Unit tests
- `functions/src/utils/router.ts` - Page routing configuration
- `.kiro/specs/modern-teletext/requirements.md` - Requirements (8.1-8.4)
- `.kiro/specs/modern-teletext/design.md` - Design specifications
