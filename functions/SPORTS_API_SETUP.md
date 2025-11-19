# Sports API Setup Guide

This document explains how to set up the Sports API integration for the Modern Teletext application.

## API Provider

The SportsAdapter uses **API-Football** (https://www.api-football.com/) to fetch live scores, league tables, and team statistics.

### Why API-Football?

- Comprehensive football/soccer data coverage
- Live match updates
- League standings and statistics
- Team and player information
- Free tier available for development/testing

## Getting an API Key

### Option 1: API-Football (Recommended)

1. Visit https://www.api-football.com/
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key from the dashboard
5. Free tier includes:
   - 100 requests per day
   - Access to all endpoints
   - Live scores and standings

### Option 2: Mock Data (Development)

If you don't have an API key, the SportsAdapter will automatically use mock data for development and testing purposes. This allows you to develop and test the application without an API key.

## Configuration

### Local Development

Add your API key to the `.env.local` file in the `functions` directory:

```bash
SPORTS_API_KEY=your_api_key_here
```

### Firebase Functions (Production)

Set the API key using Firebase CLI:

```bash
firebase functions:config:set apis.sports_key="your_api_key_here"
```

Then access it in your code:

```typescript
const apiKey = functions.config().apis.sports_key;
```

Or use environment variables:

```bash
firebase functions:config:set sports.api_key="your_api_key_here"
```

## API Endpoints Used

The SportsAdapter uses the following API-Football endpoints:

### 1. Live Fixtures
- **Endpoint**: `GET /fixtures?live=all`
- **Purpose**: Fetch currently live matches
- **Cache**: 1 minute during live events, 2 minutes otherwise

### 2. League Standings
- **Endpoint**: `GET /standings?league={id}&season={year}`
- **Purpose**: Fetch league tables and team rankings
- **Cache**: 2 minutes
- **Default**: Premier League (ID: 39)

### 3. Team Fixtures (Future)
- **Endpoint**: `GET /fixtures?team={id}&last={n}`
- **Purpose**: Fetch recent results for specific teams
- **Cache**: 2 minutes

## Rate Limiting

API-Football free tier limits:
- 100 requests per day
- Rate limit: 10 requests per minute

The application implements caching to minimize API calls:
- Live scores: 1-2 minute cache
- League tables: 2 minute cache
- Team pages: 2 minute cache

## Testing Without API Key

The SportsAdapter includes mock data that will be used automatically if no API key is configured. This allows you to:

1. Develop and test the UI
2. Test the teletext formatting
3. Verify page navigation
4. Demo the application

Mock data includes:
- 3 sample live fixtures
- Premier League top 10 standings
- Realistic team names and scores

## Supported Leagues

The current implementation focuses on:
- Premier League (England)
- Future: La Liga, Serie A, Bundesliga, Ligue 1

To add more leagues, modify the `fetchLeagueStandings()` method in `SportsAdapter.ts`.

## Common Issues

### Issue: "API service is down"
**Solution**: Check your API key is correct and you haven't exceeded rate limits.

### Issue: "No live matches"
**Solution**: This is normal when no matches are currently being played. The page will show "No live matches at this time."

### Issue: Mock data always showing
**Solution**: Ensure your API key is properly set in environment variables and the functions are redeployed.

## API Response Format

### Fixtures Response
```json
{
  "response": [
    {
      "fixture": {
        "id": 12345,
        "status": {
          "short": "2H",
          "elapsed": 87
        }
      },
      "teams": {
        "home": { "name": "Manchester United" },
        "away": { "name": "Chelsea" }
      },
      "goals": {
        "home": 2,
        "away": 1
      }
    }
  ]
}
```

### Standings Response
```json
{
  "response": [
    {
      "league": {
        "standings": [
          [
            {
              "rank": 1,
              "team": { "name": "Manchester City" },
              "all": {
                "played": 15,
                "win": 12,
                "draw": 2,
                "lose": 1
              },
              "points": 38
            }
          ]
        ]
      }
    }
  ]
}
```

## Future Enhancements

- User-configurable team watchlist (stored in Firestore)
- Multiple league support
- Player statistics
- Match highlights and commentary
- Push notifications for favorite teams
- Historical match data

## Resources

- API-Football Documentation: https://www.api-football.com/documentation-v3
- API-Football Dashboard: https://dashboard.api-football.com/
- Support: https://www.api-football.com/contact
