# Firestore Quick Reference

Quick reference for working with Firestore in the Modern Teletext application.

## Collections

### pages_cache
**Purpose:** Cache teletext pages from external APIs  
**Access:** Public read, Cloud Functions write only  
**TTL:** Varies by content type (1-30 minutes)

```typescript
// Read a cached page
const pageRef = firestore.collection('pages_cache').doc('201');
const doc = await pageRef.get();
if (doc.exists) {
  const page = doc.data().page;
}

// Write from Cloud Function (Admin SDK only)
await firestore.collection('pages_cache').doc('201').set({
  pageId: '201',
  page: { id: '201', title: 'News', rows: [...], links: [] },
  source: 'NewsAdapter',
  cachedAt: Timestamp.now(),
  expiresAt: Timestamp.fromMillis(Date.now() + 300000), // 5 min
  accessCount: 0
});
```

### conversations
**Purpose:** Store AI conversation state and history  
**Access:** User-specific (own conversations only)  
**TTL:** 24 hours

```typescript
// Create a conversation
await firestore.collection('conversations').doc(contextId).set({
  contextId: contextId,
  userId: auth.currentUser.uid,
  state: {
    contextId: contextId,
    mode: 'qa',
    history: [],
    parameters: {}
  },
  createdAt: Timestamp.now(),
  lastAccessedAt: Timestamp.now(),
  expiresAt: Timestamp.fromMillis(Date.now() + 86400000) // 24 hours
});

// Query user's conversations
const conversations = await firestore
  .collection('conversations')
  .where('userId', '==', auth.currentUser.uid)
  .orderBy('lastAccessedAt', 'desc')
  .limit(10)
  .get();
```

### user_preferences
**Purpose:** Store user settings and preferences  
**Access:** User-specific (own preferences only)  
**TTL:** None

```typescript
// Save user preferences
await firestore.collection('user_preferences').doc(userId).set({
  userId: userId,
  theme: 'ceefax',
  favoritePages: ['100', '201', '301'],
  settings: {
    scanlines: true,
    curvature: true,
    noise: false
  },
  updatedAt: Timestamp.now()
});

// Read user preferences
const prefs = await firestore
  .collection('user_preferences')
  .doc(auth.currentUser.uid)
  .get();
```

### analytics
**Purpose:** Track page views and performance metrics  
**Access:** Public read, Cloud Functions write only  
**TTL:** None

```typescript
// Read analytics (anyone)
const analytics = await firestore
  .collection('analytics')
  .doc('2024-01-01')
  .get();

// Write analytics (Cloud Function only)
await firestore.collection('analytics').doc(dateStr).set({
  date: dateStr,
  pageViews: { '100': 50, '201': 30 },
  totalRequests: 80,
  errorCount: 2,
  avgLoadTime: 250
});
```

## Common Queries

### Get recent conversations
```typescript
const recent = await firestore
  .collection('conversations')
  .where('userId', '==', userId)
  .orderBy('lastAccessedAt', 'desc')
  .limit(10)
  .get();
```

### Get most popular cached pages
```typescript
const popular = await firestore
  .collection('pages_cache')
  .where('source', '==', 'NewsAdapter')
  .orderBy('accessCount', 'desc')
  .limit(10)
  .get();
```

### Get expired documents (for cleanup)
```typescript
const expired = await firestore
  .collection('pages_cache')
  .where('expiresAt', '<', Timestamp.now())
  .get();
```

## Testing Locally

```bash
# Start emulators
npm run emulators:start

# Run security rules tests
npm run test:firestore-rules

# Access emulator UI
open http://localhost:4000
```

## Deployment

```bash
# Deploy rules and indexes
firebase deploy --only firestore

# Deploy rules only
firebase deploy --only firestore:rules

# Deploy indexes only
firebase deploy --only firestore:indexes
```

## Security Rules Summary

| Collection | Read | Write | Validation |
|------------|------|-------|------------|
| pages_cache | Public | Functions only | Page ID 100-899, 24 rows |
| conversations | Own only | Own only | Valid structure, timestamps |
| user_preferences | Own only | Own only | Max 10 favorites, valid settings |
| analytics | Public | Functions only | None |

## TTL Configuration

| Collection | Field | Duration | Purpose |
|------------|-------|----------|---------|
| conversations | expiresAt | 24 hours | Auto-delete old conversations |
| pages_cache | expiresAt | 1-30 min | Keep cache fresh |

## Error Handling

```typescript
try {
  const doc = await firestore.collection('pages_cache').doc('201').get();
  if (!doc.exists) {
    // Handle missing document
  }
} catch (error) {
  if (error.code === 'permission-denied') {
    // Handle permission error
  } else if (error.code === 'unavailable') {
    // Handle offline/network error
  }
}
```

## Best Practices

1. ✅ Always check `doc.exists` before accessing data
2. ✅ Use TTL for temporary data (conversations, cache)
3. ✅ Validate data structure in security rules
4. ✅ Use composite indexes for complex queries
5. ✅ Handle permission errors gracefully
6. ✅ Test rules locally before deploying
7. ✅ Monitor usage in Firebase Console
8. ✅ Set up billing alerts

## Troubleshooting

**"Missing or insufficient permissions"**
- Check user is authenticated for user-specific collections
- Verify userId matches authenticated user
- Ensure security rules are deployed

**"The query requires an index"**
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Wait a few minutes for indexes to build
- Check Firebase Console for index status

**"Document not found"**
- Check document ID is valid (e.g., page ID 100-899)
- Verify document hasn't expired (TTL)
- Check document exists in Firestore

## Resources

- [Full Documentation](./FIRESTORE_SETUP.md)
- [Security Rules](./firestore.rules)
- [Indexes Configuration](./firestore.indexes.json)
- [Test Suite](./firestore-rules.test.ts)
