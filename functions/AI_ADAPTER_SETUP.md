# AI Adapter Setup Guide

This guide explains how to set up and configure the AI Adapter for the Modern Teletext application.

## Overview

The AI Adapter (pages 500-599) integrates Google Vertex AI (Gemini) to provide AI-powered conversational features through a menu-driven interface. It manages conversation state in Firestore and automatically expires conversations after 24 hours.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with Vertex AI API enabled
2. **Firebase Project**: Your Firebase project should be linked to the Google Cloud project
3. **Vertex AI API**: Enable the Vertex AI API in your Google Cloud Console

## Setup Steps

### 1. Enable Vertex AI API

```bash
# Enable Vertex AI API in your Google Cloud project
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID
```

### 2. Configure Environment Variables

For local development, set these environment variables in your `.env.local` file:

```bash
# Google Cloud Project ID (usually same as Firebase project ID)
GOOGLE_CLOUD_PROJECT=your-project-id

# Vertex AI location (default: us-central1)
VERTEX_LOCATION=us-central1
```

For Firebase Functions deployment, these are automatically set from your Firebase project configuration.

### 3. Install Dependencies

The required dependencies are already included in `package.json`:

```bash
cd functions
npm install
```

Key dependencies:
- `@google-cloud/vertexai`: Google Vertex AI SDK
- `firebase-admin`: Firebase Admin SDK for Firestore access

### 4. Firestore Collections

The AI Adapter uses the following Firestore collection:

#### `conversations` Collection

Stores conversation state with automatic expiration:

```typescript
{
  contextId: string;           // Unique conversation ID
  mode: string;                // Conversation mode (qa, story, etc.)
  history: Array<{
    role: 'user' | 'model';
    content: string;
    pageId: string;
  }>;
  parameters: Record<string, any>;
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expiresAt: Timestamp;        // Auto-delete after 24 hours
}
```

### 5. Firestore Security Rules

Add these rules to `firestore.rules`:

```javascript
match /conversations/{conversationId} {
  // Allow users to read their own conversations
  // For now, allow all reads (can be restricted with auth)
  allow read: if true;
  
  // Only Cloud Functions can write
  allow write: if false;
}
```

### 6. Firestore TTL Policy

Set up automatic deletion of expired conversations:

1. Go to Firebase Console → Firestore → Indexes
2. Create a TTL policy for the `conversations` collection
3. Set the TTL field to `expiresAt`

Alternatively, you can run a scheduled Cloud Function to clean up expired conversations.

## Usage

### Available Pages

- **Page 500**: AI Oracle Index - Main menu for AI services
- **Page 510**: Q&A Topic Selection - Select topic (News, Tech, Career, Health, General)
- **Page 511**: Region Selection - Select region for context (US, UK, Europe, Asia, Global)
- **Page 512**: Question Type Selection - Select type of information (Updates, Explanation, Recommendations, Comparison, General)
- **Pages 513-519**: Q&A Response Pages - AI-generated responses formatted as teletext
- **Page 520**: Conversation History - View past AI interactions
- **Pages 521-529**: Individual conversation details

### API Methods

The AIAdapter provides these key methods:

#### `getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>`

Retrieves an AI page by ID.

#### `createConversation(mode: string, parameters?: Record<string, any>): Promise<string>`

Creates a new conversation context and returns the context ID.

#### `getConversation(contextId: string): Promise<ConversationState | null>`

Retrieves an existing conversation by context ID.

#### `updateConversation(contextId: string, userMessage: string, aiResponse: string, pageId: string): Promise<void>`

Updates a conversation with new messages.

#### `generateAIResponse(prompt: string, conversationHistory?: Array<{role, content}>): Promise<string>`

Generates an AI response using Vertex AI Gemini model.

#### `formatAIResponse(response: string, startPageId: string, contextId: string): TeletextPage[]`

Formats a long AI response into multiple teletext pages (40×24 format).

#### `processQARequest(params: Record<string, any>): Promise<TeletextPage[]>`

Processes a Q&A request with menu selections (topic, region, questionType) and returns formatted response pages. This method:
1. Builds a structured prompt from menu selections
2. Creates or retrieves conversation context
3. Generates AI response with conversation history
4. Updates conversation in Firestore
5. Formats response into teletext pages

## Testing

Run the AI Adapter tests:

```bash
cd functions
npm test -- AIAdapter.test.ts
```

The tests verify:
- Page generation (500, 510, 520)
- Page dimension invariants (24 rows × 40 characters)
- AI response generation
- Response formatting and pagination
- Menu numeric-only constraint

## Integration with Router

The AI Adapter is automatically registered in the router for pages 500-599:

```typescript
// functions/src/utils/router.ts
case 5:
  // 500-599: AI adapter
  return new AIAdapter();
```

## Caching

AI pages are **not cached** (cache duration = 0 seconds) because they are dynamic and conversation-dependent.

## Error Handling

The adapter handles these error scenarios:

1. **Vertex AI API Failures**: Returns error page with retry instructions
2. **Invalid Context ID**: Returns placeholder page
3. **Expired Conversations**: Automatically deleted and returns null
4. **Network Issues**: Returns service unavailable page

## Q&A Flow

The Q&A flow is a multi-step menu-driven process:

1. **Page 510**: User selects a topic (1-5)
   - News & Current Events
   - Technology & Science
   - Career & Education
   - Health & Wellness
   - General Knowledge

2. **Page 511**: User selects a region (1-5)
   - United States
   - United Kingdom
   - Europe
   - Asia
   - Global/International

3. **Page 512**: User selects question type (1-5)
   - Latest Updates
   - Explanation/How-To
   - Recommendations
   - Comparison
   - General Question

4. **API Call**: Frontend calls `/api/ai` with mode='qa' and parameters
   ```json
   {
     "mode": "qa",
     "parameters": {
       "topic": "1",
       "region": "2",
       "questionType": "3"
     }
   }
   ```

5. **Pages 513+**: AI response formatted across multiple pages with navigation links

### Example API Request

```bash
curl -X POST https://your-project.web.app/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "qa",
    "parameters": {
      "topic": "2",
      "region": "1",
      "questionType": "1"
    }
  }'
```

### Example API Response

```json
{
  "success": true,
  "pages": [
    {
      "id": "513",
      "title": "AI Response",
      "rows": ["...", "..."],
      "links": [...],
      "meta": {
        "source": "AIAdapter",
        "aiContextId": "ctx_1234567890_abc123"
      }
    }
  ],
  "contextId": "ctx_1234567890_abc123"
}
```

## Next Steps

The following features will be implemented in subsequent tasks:

1. **Task 13**: Spooky story generator for Kiroween
2. **Task 14**: Enhanced conversation history with full thread display

## Troubleshooting

### "Vertex AI API not enabled"

Enable the API:
```bash
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID
```

### "Permission denied" errors

Ensure your Firebase Functions service account has the `Vertex AI User` role:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Conversations not expiring

Verify the TTL policy is set up correctly in Firestore, or implement a scheduled function to clean up expired conversations.

## Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Firebase Firestore TTL](https://firebase.google.com/docs/firestore/ttl)
