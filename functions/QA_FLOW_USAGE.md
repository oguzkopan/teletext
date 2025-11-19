# Q&A Flow Usage Guide

This guide explains how to use the AI Q&A flow that was implemented in Task 12.

## Overview

The Q&A flow is a multi-step menu-driven process that allows users to ask questions through numeric menu selections. The flow collects parameters through three pages, then generates an AI response using Google Vertex AI (Gemini).

## User Flow

### Step 1: Topic Selection (Page 510)

Navigate to page 510 to select a topic:

```
Q&A ASSISTANT                P510
════════════════════════════════════

SELECT A TOPIC:

1. News & Current Events
2. Technology & Science
3. Career & Education
4. Health & Wellness
5. General Knowledge

Enter a number (1-5) to select
your topic.
```

User enters: `1` (for News & Current Events)

### Step 2: Region Selection (Page 511)

After selecting a topic, the user is shown page 511:

```
SELECT REGION                P511
════════════════════════════════════

Topic: News & Current Events

SELECT YOUR REGION:

1. United States
2. United Kingdom
3. Europe
4. Asia
5. Global/International

This helps the AI provide
region-specific information.
```

User enters: `2` (for United Kingdom)

### Step 3: Question Type Selection (Page 512)

After selecting a region, the user is shown page 512:

```
QUESTION TYPE                P512
════════════════════════════════════

Topic: News
Region: UK

WHAT WOULD YOU LIKE?

1. Latest Updates
2. Explanation/How-To
3. Recommendations
4. Comparison
5. General Question

Select the type of information
you need.
```

User enters: `1` (for Latest Updates)

### Step 4: AI Response (Pages 513+)

The frontend calls the `/api/ai` endpoint with the collected parameters:

```json
POST /api/ai
{
  "mode": "qa",
  "parameters": {
    "topic": "1",
    "region": "2",
    "questionType": "1"
  }
}
```

The API returns formatted teletext pages with the AI response:

```
AI RESPONSE                  P513
════════════════════════════════════

[AI-generated response about latest
news updates in the UK, formatted to
fit the 40×24 teletext constraint]

>>> CONTINUED ON PAGE 514 >>>
```

## API Integration

### Request Format

```bash
curl -X POST https://your-project.web.app/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "qa",
    "parameters": {
      "topic": "2",
      "region": "1",
      "questionType": "3"
    }
  }'
```

### Response Format

```json
{
  "success": true,
  "pages": [
    {
      "id": "513",
      "title": "AI Response",
      "rows": [
        "AI RESPONSE                  P513",
        "════════════════════════════════════",
        "",
        "Here is the AI-generated response...",
        "..."
      ],
      "links": [
        { "label": "INDEX", "targetPage": "100", "color": "red" },
        { "label": "AI", "targetPage": "500", "color": "green" },
        { "label": "NEXT", "targetPage": "514", "color": "yellow" }
      ],
      "meta": {
        "source": "AIAdapter",
        "lastUpdated": "2024-01-15T10:30:00.000Z",
        "cacheStatus": "fresh",
        "aiContextId": "ctx_1705315800000_abc123"
      }
    }
  ],
  "contextId": "ctx_1705315800000_abc123"
}
```

## Parameter Mappings

### Topic Codes

- `1`: News & Current Events
- `2`: Technology & Science
- `3`: Career & Education
- `4`: Health & Wellness
- `5`: General Knowledge

### Region Codes

- `1`: United States
- `2`: United Kingdom
- `3`: Europe
- `4`: Asia
- `5`: Global/International

### Question Type Codes

- `1`: Latest Updates
- `2`: Explanation/How-To
- `3`: Recommendations
- `4`: Comparison
- `5`: General Question

## Prompt Generation

The system builds a structured prompt from the menu selections:

```
[Question Type Text] [Topic Text] with a focus on [Region Text] context.
Please provide a concise, informative response suitable for display on a 
teletext screen (approximately 300-400 words). Format your response in 
clear paragraphs without special formatting or markdown.
```

Example:
```
Provide the latest updates on news and current events with a focus on 
United Kingdom context. Please provide a concise, informative response 
suitable for display on a teletext screen (approximately 300-400 words). 
Format your response in clear paragraphs without special formatting or 
markdown.
```

## Conversation Context

Each Q&A interaction creates a conversation context that is stored in Firestore:

```typescript
{
  contextId: "ctx_1705315800000_abc123",
  mode: "qa",
  history: [
    {
      role: "user",
      content: "Provide the latest updates on...",
      pageId: "513"
    },
    {
      role: "model",
      content: "Here are the latest updates...",
      pageId: "513"
    }
  ],
  parameters: {
    topic: "1",
    region: "2",
    questionType: "1"
  },
  createdAt: Timestamp,
  lastAccessedAt: Timestamp,
  expiresAt: Timestamp  // 24 hours from creation
}
```

## Response Formatting

Long AI responses are automatically split across multiple pages:

- Each page contains up to 20 rows of content (leaving 4 for header/footer)
- Pages are numbered sequentially (513, 514, 515, etc.)
- Navigation links are added between pages
- Each row is wrapped to fit within 40 characters
- Word boundaries are respected when wrapping

## Frontend Implementation Notes

The frontend should:

1. Display page 510 when user navigates to Q&A
2. Capture numeric input (1-5) for topic selection
3. Navigate to page 511 with `?topic=X` parameter
4. Capture numeric input for region selection
5. Navigate to page 512 with `?topic=X&region=Y` parameters
6. Capture numeric input for question type
7. Call `/api/ai` with all parameters
8. Display the returned pages starting at 513
9. Store the contextId for potential follow-up questions

## Testing

Run the tests to verify the Q&A flow:

```bash
cd functions
npm test -- AIAdapter.test.ts
```

The tests verify:
- Page generation for 510, 511, 512
- Parameter passing between pages
- Prompt building from menu selections
- AI response generation
- Response formatting and pagination
- Error handling

## Next Steps

Future enhancements could include:

1. Follow-up questions using the conversation context
2. More granular topic selections
3. Custom question input (while maintaining numeric-only constraint)
4. Response quality ratings
5. Conversation branching based on user feedback
