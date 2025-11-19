# API Documentation

Complete API reference for Modern Teletext Cloud Functions.

## Base URL

```
Production: https://us-central1-{project-id}.cloudfunctions.net
Local: http://localhost:5001/{project-id}/us-central1
```

## Authentication

Currently, all endpoints are publicly accessible. Future versions may implement:
- API key authentication for rate limiting
- Firebase Authentication for user-specific features
- CORS restrictions for production domains

## Endpoints

### GET /api/page/:id

Retrieves a teletext page by ID with automatic Firestore caching.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | string | path | Yes | Three-digit page number (100-899) |

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "page": {
    "id": "201",
    "title": "Top Headlines",
    "rows": [
      "TOP HEADLINES                    201",
      "────────────────────────────────────",
      "1. Breaking news headline here...",
      "   Source: BBC News",
      "",
      "2. Another important story...",
      "   Source: Reuters"
    ],
    "links": [
      {
        "label": "Index",
        "targetPage": "200",
        "color": "red"
      }
    ],
    "meta": {
      "source": "NewsAdapter",
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "cacheStatus": "fresh"
    }
  }
}
```

**Error Responses:**

```json
// Invalid page number (400 Bad Request)
{
  "success": false,
  "error": "Invalid page number: 999. Must be between 100-899.",
  "code": "INVALID_PAGE"
}

// Page not found (404 Not Found)
{
  "success": false,
  "error": "Page 555 not found",
  "code": "PAGE_NOT_FOUND"
}

// External API failure (502 Bad Gateway)
{
  "success": false,
  "error": "Failed to fetch news data",
  "code": "EXTERNAL_API_ERROR"
}

// Internal error (500 Internal Server Error)
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

#### Examples

```bash
# Get main index
curl https://us-central1-{project-id}.cloudfunctions.net/api/page/100

# Get news headlines
curl https://us-central1-{project-id}.cloudfunctions.net/api/page/201

# Get sports scores
curl https://us-central1-{project-id}.cloudfunctions.net/api/page/301

# Invalid page number
curl https://us-central1-{project-id}.cloudfunctions.net/api/page/999
```

#### Caching Behavior

| Page Range | Content Type | Cache TTL | Notes |
|------------|--------------|-----------|-------|
| 100-199 | Static | 1 year | System pages, rarely change |
| 200-299 | News | 5 minutes | News headlines and articles |
| 300-399 | Sports | 2 minutes | Live scores (1 min during events) |
| 400-419 | Markets | 1 minute | Real-time market data |
| 420-449 | Weather | 30 minutes | Weather forecasts |
| 500-599 | AI | Session | AI-generated content |
| 600-699 | Games | No cache | Interactive content |
| 700-799 | Settings | 1 hour | Configuration pages |
| 800-899 | Dev Tools | No cache | Dynamic developer info |

### POST /api/ai

Processes AI requests and returns formatted teletext pages.

#### Request Body

```json
{
  "mode": "qa",
  "parameters": {
    "topic": "technology",
    "region": "global",
    "previousPageId": "510",
    "contextId": "conv-uuid-here"
  }
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mode | string | Yes | AI interaction mode: "qa", "story", "summarize" |
| parameters | object | Yes | Mode-specific parameters |
| parameters.topic | string | No | Topic for Q&A mode |
| parameters.region | string | No | Region for localized content |
| parameters.previousPageId | string | No | Previous page for context |
| parameters.contextId | string | No | Conversation context ID |

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "pages": [
    {
      "id": "511",
      "title": "AI Response",
      "rows": [
        "AI ORACLE - TECHNOLOGY Q&A     511",
        "────────────────────────────────────",
        "",
        "Q: What are the latest trends in",
        "   AI development?",
        "",
        "A: Current AI trends include:",
        "",
        "1. Large Language Models (LLMs)",
        "   - GPT-4, Claude, Gemini",
        "   - Multimodal capabilities",
        "",
        "2. AI Safety & Alignment",
        "   - Responsible AI development",
        "   - Bias mitigation",
        "",
        "3. Edge AI",
        "   - On-device processing",
        "   - Privacy-focused solutions",
        "",
        "",
        "GREEN:Next YELLOW:Menu RED:Back"
      ],
      "links": [
        {
          "label": "Next",
          "targetPage": "512",
          "color": "green"
        },
        {
          "label": "Menu",
          "targetPage": "500",
          "color": "yellow"
        },
        {
          "label": "Back",
          "targetPage": "510",
          "color": "red"
        }
      ],
      "meta": {
        "source": "AIAdapter",
        "aiContextId": "conv-uuid-here",
        "lastUpdated": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "contextId": "conv-uuid-here"
}
```

**Error Responses:**

```json
// Invalid mode (400 Bad Request)
{
  "success": false,
  "error": "Invalid mode: invalid. Must be one of: qa, story, summarize",
  "code": "INVALID_MODE"
}

// Missing parameters (400 Bad Request)
{
  "success": false,
  "error": "Missing required parameter: topic",
  "code": "MISSING_PARAMETER"
}

// AI API failure (502 Bad Gateway)
{
  "success": false,
  "error": "Failed to generate AI response",
  "code": "AI_API_ERROR"
}

// Rate limit exceeded (429 Too Many Requests)
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

#### AI Modes

##### Q&A Mode (`qa`)

Interactive question and answer flow.

**Parameters:**
- `topic`: "technology", "news", "career", "health", "general"
- `region`: "global", "us", "uk", "eu", etc.
- `contextId`: Optional conversation ID for follow-ups

**Example:**
```json
{
  "mode": "qa",
  "parameters": {
    "topic": "technology",
    "region": "global"
  }
}
```

##### Story Mode (`story`)

Generate spooky stories for entertainment.

**Parameters:**
- `theme`: "haunted_house", "ghost", "monster", "psychological", "cosmic"
- `length`: "short", "medium", "long"

**Example:**
```json
{
  "mode": "story",
  "parameters": {
    "theme": "haunted_house",
    "length": "medium"
  }
}
```

##### Summarize Mode (`summarize`)

Summarize content or conversations.

**Parameters:**
- `content`: Text to summarize
- `maxLength`: Maximum length in characters

**Example:**
```json
{
  "mode": "summarize",
  "parameters": {
    "content": "Long text to summarize...",
    "maxLength": 500
  }
}
```

#### Rate Limiting

- **Per IP**: 100 requests per minute
- **Per User**: 1000 requests per hour
- **Burst**: Up to 10 concurrent requests

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345678
```

#### Examples

```bash
# Q&A request
curl -X POST https://us-central1-{project-id}.cloudfunctions.net/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "qa",
    "parameters": {
      "topic": "technology",
      "region": "global"
    }
  }'

# Story generation
curl -X POST https://us-central1-{project-id}.cloudfunctions.net/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "story",
    "parameters": {
      "theme": "haunted_house",
      "length": "medium"
    }
  }'

# Continue conversation
curl -X POST https://us-central1-{project-id}.cloudfunctions.net/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "qa",
    "parameters": {
      "topic": "technology",
      "contextId": "conv-uuid-here",
      "previousPageId": "511"
    }
  }'
```

## Data Types

### TeletextPage

```typescript
interface TeletextPage {
  id: string;              // Three-digit page number (100-899)
  title: string;           // Page title (max 40 characters)
  rows: string[];          // Exactly 24 strings, each ≤40 characters
  links: PageLink[];       // Navigation links
  meta?: PageMeta;         // Optional metadata
}
```

### PageLink

```typescript
interface PageLink {
  label: string;           // Display text for the link
  targetPage: string;      // Target page number
  color?: 'red' | 'green' | 'yellow' | 'blue';  // Fastext color
  position?: number;       // Row number for inline links (optional)
}
```

### PageMeta

```typescript
interface PageMeta {
  source?: string;         // Adapter name (e.g., "NewsAdapter")
  lastUpdated?: string;    // ISO 8601 timestamp
  aiContextId?: string;    // Conversation context ID for AI pages
  cacheStatus?: 'fresh' | 'cached' | 'stale';
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_PAGE | 400 | Page number out of valid range (100-899) |
| INVALID_MODE | 400 | Invalid AI mode specified |
| MISSING_PARAMETER | 400 | Required parameter missing from request |
| PAGE_NOT_FOUND | 404 | Requested page does not exist |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |
| EXTERNAL_API_ERROR | 502 | External API failure |
| AI_API_ERROR | 502 | AI service failure |

## Content Adapters

### Adapter Interface

All adapters implement this interface:

```typescript
interface ContentAdapter {
  getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage>;
  getCacheKey(pageId: string): string;
  getCacheDuration(): number;  // Seconds
}
```

### Available Adapters

| Adapter | Page Range | Description | External API |
|---------|------------|-------------|--------------|
| StaticAdapter | 100-199 | System pages | None (Firebase Storage) |
| NewsAdapter | 200-299 | News content | NewsAPI |
| SportsAdapter | 300-399 | Sports scores | API-Football |
| MarketsAdapter | 400-419 | Market data | CoinGecko, Alpha Vantage |
| WeatherAdapter | 420-449 | Weather forecasts | OpenWeatherMap |
| AIAdapter | 500-599 | AI interactions | Vertex AI (Gemini) |
| GamesAdapter | 600-699 | Interactive games | Open Trivia DB |
| SettingsAdapter | 700-799 | Settings pages | None (static) |
| DevAdapter | 800-899 | Developer tools | None (dynamic) |

## Performance

### Response Times

| Scenario | Target | Typical |
|----------|--------|---------|
| Cached page | <100ms | 50-80ms |
| Uncached static page | <200ms | 100-150ms |
| Uncached API page | <500ms | 200-400ms |
| AI generation | <3s | 1-2s |

### Optimization Strategies

1. **Firestore Caching**: Reduces API calls and improves response times
2. **CDN Caching**: Static pages cached at edge locations
3. **Lazy Loading**: Adapters loaded on-demand
4. **Request Cancellation**: Pending requests cancelled on new navigation
5. **Page Preloading**: Frequently accessed pages preloaded

## Monitoring

### Metrics

- Request count per endpoint
- Response time percentiles (p50, p95, p99)
- Error rate by error code
- Cache hit rate
- External API latency

### Logging

All requests are logged with:
- Timestamp
- Page ID
- Adapter used
- Response time
- Cache status
- Error details (if applicable)

View logs:
```bash
firebase functions:log
firebase functions:log --only getPage
firebase functions:log --follow
```

## Security

### CORS

Configured to allow requests from:
- Production domain
- Development localhost
- Firebase hosting domains

### Rate Limiting

Implemented at multiple levels:
- Cloud Functions (100 req/min per IP)
- External APIs (varies by provider)
- AI service (1000 req/hour per user)

### Input Validation

All inputs are validated:
- Page numbers: 100-899 range
- AI modes: Whitelist of valid modes
- Parameters: Type checking and sanitization

### Content Sanitization

HTML content is sanitized to prevent:
- XSS attacks
- Script injection
- Malformed markup

See [HTML_SANITIZATION.md](./HTML_SANITIZATION.md) for details.

## Versioning

Current version: **1.0.0**

Future versions will use semantic versioning:
- Major: Breaking API changes
- Minor: New features, backward compatible
- Patch: Bug fixes

API versioning strategy:
- `/api/v1/page/:id` (future)
- `/api/v2/page/:id` (future)
- Current endpoints remain unversioned for simplicity

## Support

For API issues:
1. Check error code and message
2. Review this documentation
3. Check Firebase logs
4. Open an issue on GitHub

---

**Last Updated**: January 2024
**API Version**: 1.0.0
