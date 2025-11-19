# Firestore Security Rules and Indexes Setup

This document describes the Firestore security rules, indexes, and TTL policies for the Modern Teletext application.

## Overview

The application uses three main Firestore collections:
- `pages_cache`: Stores cached teletext pages from external APIs
- `conversations`: Stores AI conversation state and history
- `user_preferences`: Stores user settings and preferences

## Security Rules

### Pages Cache Collection

**Access Control:**
- **Read**: Public (anyone can read cached pages)
- **Write**: Cloud Functions only (via Admin SDK)

**Validation:**
- Page IDs must be 3 digits between 100-899
- Page data must include all required fields (pageId, page, source, cachedAt, expiresAt, accessCount)
- Page structure must have exactly 24 rows

**Use Cases:**
- Frontend reads cached pages to display content
- Cloud Functions write/update cache after fetching from external APIs
- Automatic expiration via TTL policy

### Conversations Collection

**Access Control:**
- **Read**: Users can only read their own conversations
- **Write**: Users can only create/update/delete their own conversations
- **Anonymous**: Anonymous users can create and manage conversations (session-based)

**Validation:**
- Must include contextId, state, createdAt, lastAccessedAt, expiresAt
- State must include contextId, mode, history (array), parameters
- All timestamps must be valid Firestore timestamps

**Use Cases:**
- AI adapter stores conversation context for multi-turn interactions
- Users can view conversation history
- Automatic cleanup after 24 hours via TTL policy

### User Preferences Collection

**Access Control:**
- **Read**: Users can only read their own preferences
- **Write**: Users can only create/update/delete their own preferences

**Validation:**
- Must include userId, theme, favoritePages, settings, updatedAt
- favoritePages array limited to 10 items
- Settings must include scanlines, curvature, noise booleans

**Use Cases:**
- Store theme selection (Ceefax, High Contrast, Haunting Mode)
- Store CRT effect preferences
- Store favorite pages for quick access

### Analytics Collection

**Access Control:**
- **Read**: Public (anyone can view analytics)
- **Write**: Cloud Functions only (via Admin SDK)

**Use Cases:**
- Track page views and performance metrics
- Monitor error rates
- Analyze usage patterns

## Indexes

### Composite Indexes

1. **Conversations by User and Last Access**
   - Fields: `userId` (ASC), `lastAccessedAt` (DESC)
   - Use: Query user's recent conversations

2. **Conversations by User and Creation Date**
   - Fields: `userId` (ASC), `createdAt` (DESC)
   - Use: Query user's conversations chronologically

3. **Conversations by Expiration**
   - Fields: `expiresAt` (ASC)
   - Use: TTL cleanup queries

4. **Pages Cache by Source and Cache Time**
   - Fields: `source` (ASC), `cachedAt` (DESC)
   - Use: Query recent pages by adapter

5. **Pages Cache by Expiration**
   - Fields: `expiresAt` (ASC)
   - Use: TTL cleanup queries

6. **Pages Cache by Source and Access Count**
   - Fields: `source` (ASC), `accessCount` (DESC)
   - Use: Find most popular pages by adapter

7. **User Preferences by User and Update Time**
   - Fields: `userId` (ASC), `updatedAt` (DESC)
   - Use: Query user preferences with update tracking

### TTL (Time-To-Live) Policies

**Automatic Document Expiration:**

1. **Conversations Collection**
   - Field: `expiresAt`
   - Policy: Documents automatically deleted when `expiresAt` timestamp is reached
   - Default: 24 hours after creation
   - Purpose: Prevent conversation data from accumulating indefinitely

2. **Pages Cache Collection**
   - Field: `expiresAt`
   - Policy: Documents automatically deleted when `expiresAt` timestamp is reached
   - TTL varies by content type:
     - News: 5 minutes
     - Sports: 2 minutes (1 minute during live events)
     - Markets: 1 minute
     - Weather: 30 minutes
     - Static pages: No expiration
   - Purpose: Keep cache fresh and reduce storage costs

**How TTL Works:**
- Firestore automatically monitors documents with TTL fields
- When current time exceeds the `expiresAt` timestamp, the document is deleted
- Deletion typically occurs within 72 hours of expiration
- No manual cleanup required

## Testing Security Rules

### Using Firebase Emulator

1. **Start the emulator:**
   ```bash
   npm run emulators:start
   ```

2. **Run security rules tests:**
   ```bash
   npm run test:firestore-rules
   ```

3. **Access Emulator UI:**
   - Open http://localhost:4000
   - View Firestore data
   - Test queries manually

### Test Coverage

The test suite (`firestore-rules.test.ts`) covers:

**Pages Cache:**
- ✓ Public read access for valid page IDs
- ✓ Deny read for invalid page IDs (< 100, > 899, non-numeric)
- ✓ Deny all write operations from users

**Conversations:**
- ✓ Users can create their own conversations
- ✓ Users cannot create conversations for others
- ✓ Users can read their own conversations
- ✓ Users cannot read other users' conversations
- ✓ Users can update their own conversations
- ✓ Users cannot update other users' conversations
- ✓ Users can delete their own conversations
- ✓ Invalid conversation data is rejected

**User Preferences:**
- ✓ Users can create their own preferences
- ✓ Users cannot create preferences for others
- ✓ Users can read their own preferences
- ✓ Users cannot read other users' preferences
- ✓ Users can update their own preferences
- ✓ Users cannot update other users' preferences
- ✓ Favorite pages limited to 10 items
- ✓ Invalid preferences data is rejected

**Analytics:**
- ✓ Public read access
- ✓ Deny all write operations from users

## Deployment

### Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

### Deploy Everything

```bash
firebase deploy
```

## Data Models

### PageCacheDocument

```typescript
interface PageCacheDocument {
  pageId: string;           // Document ID (3 digits: 100-899)
  page: TeletextPage;       // Full page data
  source: string;           // Adapter name (NewsAdapter, SportsAdapter, etc.)
  cachedAt: Timestamp;      // When cached
  expiresAt: Timestamp;     // When to expire (TTL field)
  accessCount: number;      // Number of times accessed
}
```

### ConversationDocument

```typescript
interface ConversationDocument {
  contextId: string;        // Document ID (UUID)
  userId?: string;          // Optional user ID (for authenticated users)
  state: ConversationState; // Full conversation state
  createdAt: Timestamp;     // When created
  lastAccessedAt: Timestamp;// Last access time
  expiresAt: Timestamp;     // When to expire (TTL field, default: 24 hours)
}

interface ConversationState {
  contextId: string;
  mode: string;             // 'qa', 'story', 'summarize', etc.
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    pageId: string;
  }>;
  parameters: Record<string, any>;
}
```

### UserPreferencesDocument

```typescript
interface UserPreferencesDocument {
  userId: string;           // Document ID (user's auth UID)
  theme: string;            // 'ceefax', 'high-contrast', 'haunting'
  favoritePages: string[];  // Max 10 page IDs
  settings: {
    scanlines: boolean;
    curvature: boolean;
    noise: boolean;
  };
  updatedAt: Timestamp;     // Last update time
}
```

### AnalyticsDocument

```typescript
interface AnalyticsDocument {
  date: string;             // Document ID (YYYY-MM-DD)
  pageViews: Record<string, number>; // Page ID -> view count
  totalRequests: number;
  errorCount: number;
  avgLoadTime: number;
}
```

## Best Practices

### Security

1. **Never expose Admin SDK credentials** in client code
2. **Always validate data structure** in security rules
3. **Use authentication** for user-specific data
4. **Limit array sizes** to prevent abuse (e.g., max 10 favorite pages)
5. **Test rules thoroughly** before deploying to production

### Performance

1. **Use composite indexes** for complex queries
2. **Enable TTL** to automatically clean up old data
3. **Cache frequently accessed data** in pages_cache
4. **Monitor index usage** in Firebase Console
5. **Optimize query patterns** to use existing indexes

### Cost Optimization

1. **Set appropriate TTL values** to reduce storage costs
2. **Use caching** to reduce read operations
3. **Batch writes** when possible
4. **Monitor usage** in Firebase Console
5. **Set up billing alerts** to avoid surprises

## Troubleshooting

### Common Issues

**"Missing or insufficient permissions"**
- Check that security rules are deployed
- Verify user authentication state
- Ensure userId matches authenticated user

**"The query requires an index"**
- Deploy the indexes from firestore.indexes.json
- Wait a few minutes for indexes to build
- Check Firebase Console for index status

**"Document not found"**
- Check that document ID is valid (e.g., page ID 100-899)
- Verify document exists in Firestore
- Check TTL hasn't expired the document

**Tests failing**
- Ensure Firebase emulator is running
- Check that firestore.rules file is valid
- Verify test data matches validation rules

## Monitoring

### Firebase Console

Monitor your Firestore usage:
- **Usage tab**: View read/write/delete operations
- **Indexes tab**: Check index build status
- **Rules tab**: View and edit security rules
- **Data tab**: Browse collections and documents

### Logging

Cloud Functions automatically log:
- Security rule violations
- Failed queries
- TTL deletions
- Index usage

Access logs in Firebase Console > Functions > Logs

## References

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firestore TTL Documentation](https://firebase.google.com/docs/firestore/ttl)
- [Firebase Rules Unit Testing](https://firebase.google.com/docs/rules/unit-tests)
