# NewsAPI Setup Guide

The NewsAdapter requires a NewsAPI key to fetch live news headlines.

## Getting a NewsAPI Key

1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key" and sign up for a free account
3. The free tier includes:
   - 100 requests per day
   - Access to top headlines and everything endpoints
   - Perfect for development and testing

## Configuration

### Local Development

Add your API key to `.env.local`:

```bash
NEWS_API_KEY=your_newsapi_key_here
```

### Firebase Functions (Production)

Set the environment variable using Firebase CLI:

```bash
firebase functions:config:set news.api_key="your_newsapi_key_here"
```

Then deploy your functions:

```bash
firebase deploy --only functions
```

### Accessing in Code

The NewsAdapter automatically reads the API key from `process.env.NEWS_API_KEY`.

## News Pages

The NewsAdapter serves the following pages:

- **200**: News Index - Main navigation page for all news categories
- **201**: Top Headlines - Latest breaking news
- **202**: World News - International news stories
- **203**: Local News - US-based news (configurable)
- **210**: Technology - Tech industry news
- **211**: Business - Business and finance news
- **212**: Entertainment - Entertainment and celebrity news
- **213**: Science - Scientific discoveries and research
- **214**: Health - Health and medical news
- **215**: Sports News - Sports-related news stories

## Caching

News pages are cached in Firestore for 5 minutes (300 seconds) to:
- Reduce API calls and stay within rate limits
- Improve response times
- Provide offline fallback

## Error Handling

If the NewsAPI is unavailable or returns an error, the adapter will:
1. Display a "SERVICE UNAVAILABLE" page
2. Provide helpful error information
3. Suggest trying again later
4. Maintain the teletext page format (40×24 grid)

## Testing

Run the NewsAdapter tests:

```bash
cd functions
npm test -- NewsAdapter.test.ts
```

The tests use mocked API responses, so no actual API key is needed for testing.

## API Limits

The free NewsAPI tier has the following limits:
- 100 requests per day
- Rate limit: 1 request per second
- Historical data: Last 30 days only

With 5-minute caching, you can serve approximately:
- 288 unique page requests per day (24 hours × 12 requests per hour)
- Unlimited cached page views

## Troubleshooting

### "NEWS_API_KEY not configured" Error

Make sure you've set the environment variable correctly:
- For local development: Check `.env.local`
- For production: Run `firebase functions:config:get` to verify

### Rate Limit Exceeded

If you hit the rate limit:
1. The adapter will return an error page
2. Cached pages will still be served
3. Wait for the rate limit to reset (usually 24 hours)
4. Consider upgrading to a paid NewsAPI plan for higher limits

### No Articles Returned

If the API returns empty results:
- Check that your API key is valid
- Verify the category/country parameters are correct
- Check NewsAPI status at [https://newsapi.org/status](https://newsapi.org/status)

## Alternative News Sources

If you prefer a different news API, you can modify the NewsAdapter to use:
- The Guardian API
- New York Times API
- BBC News API
- Any other REST-based news API

Simply update the `fetchTopHeadlines`, `fetchNewsByCategory`, and `fetchNewsByCountry` methods in `NewsAdapter.ts`.
