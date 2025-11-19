# Conversation History and Recall System

## Overview

The conversation history system allows users to view and manage their past AI interactions through the teletext interface. This feature stores the last 10 conversations in Firestore and provides an intuitive interface for browsing and deleting them.

## Pages

### Page 520: Conversation History Index

The main conversation history page displays a list of recent AI interactions.

**Features:**
- Shows last 10 conversations ordered by most recent first
- Displays timestamp (date and time) for each conversation
- Shows conversation mode (Q&A, Spooky Story, etc.)
- Shows topic/theme when available
- Empty state message when no conversations exist
- Refresh button to reload the list

**Example Display:**
```
CONVERSATION HISTORY         P520
════════════════════════════════════

RECENT AI INTERACTIONS:

Enter page number to view details:

521. 18 Nov 14:30 Q&A (Tech)
522. 18 Nov 12:15 Spooky Story (Ghost)
523. 17 Nov 22:45 Q&A (Health)
524. 17 Nov 18:20 Q&A (News)

Note: Only last 10 conversations
are stored. Older ones are deleted.




INDEX   AI      REFRESH
```

### Pages 521-529: Conversation Detail Pages

Individual conversation pages show the full conversation thread.

**Features:**
- Displays conversation metadata (mode, date, time)
- Shows full conversation history with user and AI messages
- Truncates long messages to fit teletext format
- Delete button to remove the conversation
- Navigation back to history index

**Example Display:**
```
CONVERSATION                 P521
════════════════════════════════════
Mode: Q&A Assistant
Date: 18 Nov 2024 14:30

[YOU]
  Provide the latest updates on
  technology and science with a
  focus on United Kingdom context.

[AI]
  Here are the latest tech updates
  from the UK: The government has
  announced new AI regulations...
  (continues)

INDEX   HISTORY DELETE
```

## Data Storage

### Firestore Collection: `conversations`

Each conversation is stored as a document with the following structure:

```typescript
{
  contextId: string;           // Unique conversation ID
  mode: string;                // 'qa', 'spooky_story', etc.
  history: Array<{
    role: 'user' | 'model';
    content: string;
    pageId: string;
  }>;
  parameters: {                // Menu selections
    topic?: string;
    region?: string;
    theme?: string;
    length?: string;
  };
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expiresAt: Timestamp;        // Auto-delete after 24 hours
}
```

### Automatic Cleanup

- Conversations expire after 24 hours
- Only the last 10 conversations are kept
- Expired conversations are automatically deleted when accessed

## API Endpoints

### GET /api/page/520

Retrieves the conversation history index page.

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "520",
    "title": "Conversation History",
    "rows": [...],
    "links": [...]
  }
}
```

### GET /api/page/521-529

Retrieves a specific conversation detail page.

**Query Parameters:**
- `contextId` (optional): The conversation context ID

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "521",
    "title": "Conversation",
    "rows": [...],
    "links": [...],
    "meta": {
      "aiContextId": "ctx_123..."
    }
  }
}
```

### DELETE /api/conversation/:contextId

Deletes a conversation from Firestore.

**Request:**
```
DELETE /api/conversation/ctx_1234567890_abc123
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

## Usage Flow

### Viewing Conversation History

1. User navigates to page 520
2. System queries Firestore for last 10 conversations
3. Conversations are displayed with page numbers 521-529
4. User enters a page number to view details

### Viewing Conversation Details

1. User navigates to page 521-529
2. System retrieves the conversation at that index
3. Full conversation thread is displayed
4. User can delete the conversation or return to history

### Deleting a Conversation

1. User views a conversation detail page (521-529)
2. User presses the BLUE button (DELETE)
3. Frontend calls DELETE /api/conversation/:contextId
4. Conversation is removed from Firestore
5. User is redirected to page 520 (history index)

## Implementation Details

### AIAdapter Methods

**`getConversationHistoryPage()`**
- Queries Firestore for recent conversations
- Formats them into a teletext page
- Handles empty state

**`getConversationDetailPage(pageId, params)`**
- Maps page number to conversation index
- Retrieves conversation from Firestore
- Formats conversation thread for display
- Handles missing conversations

**`createConversation(mode, parameters)`**
- Creates a new conversation document
- Sets expiration to 24 hours
- Returns context ID

**`getConversation(contextId)`**
- Retrieves conversation from Firestore
- Checks expiration and deletes if expired
- Updates last accessed timestamp

**`updateConversation(contextId, userMessage, aiResponse, pageId)`**
- Adds new messages to conversation history
- Updates last accessed timestamp

**`deleteConversation(contextId)`**
- Removes conversation document from Firestore

## Requirements Validation

This implementation satisfies the following requirements:

**Requirement 22.1:** ✓ Page 520 displays conversation index with recent AI interactions

**Requirement 22.2:** ✓ Selecting a conversation displays the full conversation thread

**Requirement 22.3:** ✓ Last 10 conversations are stored in Firestore

**Requirement 22.4:** ✓ Conversation history shows timestamps and topics

**Requirement 22.5:** ✓ Users can delete individual conversations

## Testing

Unit tests cover:
- Page 520 returns conversation history with empty state
- Pages 521-529 return conversation detail pages
- Delete functionality exists
- All pages maintain 40×24 format
- Navigation links are present

Integration tests should verify:
- Conversations are properly stored in Firestore
- Conversation history displays actual data
- Delete operation removes conversations
- Expired conversations are cleaned up
- Last 10 limit is enforced

## Future Enhancements

Potential improvements:
- Search/filter conversations by mode or topic
- Export conversation as text file
- Share conversation via link
- Conversation tagging/categorization
- Pagination for more than 10 conversations
- Conversation analytics (most used topics, etc.)
