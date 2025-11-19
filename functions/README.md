# Firebase Cloud Functions - Modern Teletext

This directory contains the Firebase Cloud Functions implementation for the Modern Teletext application.

## Structure

```
functions/
├── src/
│   ├── index.ts              # Main entry point with HTTP endpoints
│   ├── types.ts              # TypeScript type definitions
│   ├── adapters/
│   │   ├── StaticAdapter.ts  # Static page adapter (100-199)
│   │   ├── NewsAdapter.ts    # News adapter (200-299)
│   │   └── SportsAdapter.ts  # Sports adapter (300-399)
│   └── utils/
│       ├── cache.ts          # Firestore caching utilities
│       ├── router.ts         # Page routing logic
│       ├── logger.ts         # Structured logging
│       └── errors.ts         # Error handling utilities
├── lib/                      # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

## Endpoints

### GET /api/page/:id

Retrieves a teletext page by ID with Firestore caching.

**Request:**
```
GET /api/page/100
```

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "100",
    "title": "Main Index",
    "rows": ["...", "..."],
    "links": [...],
    "meta": {
      "source": "StaticAdapter",
      "lastUpdated": "2024-01-01T00:00:00.000Z",
      "cacheStatus": "fresh"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid page number: 999. Must be between 100-899."
}
```

### POST /api/ai

Processes AI requests and returns formatted teletext pages.

**Request:**
```json
{
  "mode": "qa",
  "parameters": {
    "topic": "technology",
    "context": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "pages": [...],
  "contextId": "uuid-here"
}
```

## Page Routing

Pages are routed to adapters based on their magazine number (first digit):

- **1xx**: StaticAdapter (System pages)
- **2xx**: NewsAdapter (News and current affairs)
- **3xx**: SportsAdapter (Live scores and league tables)
- **4xx**: MarketsAdapter (to be implemented)
- **5xx**: AIAdapter (to be implemented)
- **6xx**: GamesAdapter (to be implemented)
- **7xx**: SettingsAdapter (to be implemented)
- **8xx**: DevAdapter (to be implemented)

## Caching Strategy

Pages are cached in Firestore with configurable TTL:

- **Static pages**: 1 year (effectively permanent)
- **News**: 5 minutes
- **Sports**: 2 minutes (1 minute during live events)
- **Markets**: 1 minute (to be configured)
- **AI responses**: Session duration (to be configured)

Cache entries include:
- Page data
- Source adapter name
- Cache timestamp
- Expiration timestamp
- Access count

## Error Handling

All errors are handled consistently with:
- Appropriate HTTP status codes
- Structured error messages
- Detailed logging
- Graceful degradation

Error types:
- `InvalidPageError` (400): Invalid page number
- `PageNotFoundError` (404): Page doesn't exist
- `AdapterError` (500): Adapter failure
- `ExternalAPIError` (502): External API failure

## Development

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

### Local Testing with Emulator
```bash
npm run serve
```

### View Logs
```bash
npm run logs
```

## Implementation Status

✅ **Completed:**
- Cloud Functions project structure
- GET /api/page/:id endpoint with Firestore caching
- POST /api/ai endpoint (placeholder)
- Router function to map page ranges to adapters
- Firestore cache functions (getCachedPage, setCachedPage)
- Error handling and logging for all endpoints
- StaticAdapter for basic pages (100, 404, placeholders)
- NewsAdapter with NewsAPI integration (200-299)
- SportsAdapter with API-Football integration (300-399)

🚧 **To be implemented in later tasks:**
- MarketsAdapter (400-499)
- AIAdapter with Vertex AI integration (500-599)
- GamesAdapter (600-699)
- SettingsAdapter (700-799)
- DevAdapter (800-899)
- Static page content from Firebase Storage
- User preferences for team watchlist

## Requirements Validation

This implementation satisfies:
- **Requirement 11.1**: Routes page requests to appropriate adapters based on page number ranges
- **Requirement 11.4**: Caches adapter responses in Firestore with configurable TTL
- **Requirement 15.1**: Cached pages display within 100ms (Firestore read latency)
- **Requirement 15.2**: Uncached pages display within 500ms (adapter processing time)
