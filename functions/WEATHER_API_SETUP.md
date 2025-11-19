# Weather API Setup Guide

This guide explains how to set up the OpenWeatherMap API integration for the Weather Adapter (pages 420-449).

## Overview

The Weather Adapter provides weather forecasts for 22 major cities around the world. It integrates with the OpenWeatherMap API to fetch current conditions and forecasts.

## API Provider

**OpenWeatherMap API**
- Website: https://openweathermap.org/api
- Free tier: 1,000 calls/day, 60 calls/minute
- Data: Current weather, 5-day forecast, historical data

## Getting an API Key

1. Go to https://openweathermap.org/
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Go to https://home.openweathermap.org/api_keys
5. Copy your API key (it may take a few hours to activate)

## Configuration

### Local Development

Add the API key to your `.env.local` file:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

### Firebase Functions (Production)

Set the API key using Firebase CLI:

```bash
firebase functions:config:set openweather.api_key="your_api_key_here"
```

Or set it as an environment variable in the Firebase Console:
1. Go to Firebase Console > Functions
2. Click on "Environment variables"
3. Add: `OPENWEATHER_API_KEY` = `your_api_key_here`

## Supported Cities

The Weather Adapter supports 22 major cities:

| Page | City | Country |
|------|------|---------|
| 421 | London | United Kingdom |
| 422 | New York | United States |
| 423 | Tokyo | Japan |
| 424 | Paris | France |
| 425 | Sydney | Australia |
| 426 | Dubai | United Arab Emirates |
| 427 | Singapore | Singapore |
| 428 | Hong Kong | Hong Kong |
| 429 | Mumbai | India |
| 430 | Istanbul | Turkey |
| 431 | Moscow | Russia |
| 432 | Los Angeles | United States |
| 433 | Berlin | Germany |
| 434 | Toronto | Canada |
| 435 | Madrid | Spain |
| 436 | Rome | Italy |
| 437 | Amsterdam | Netherlands |
| 438 | Seoul | South Korea |
| 439 | Bangkok | Thailand |
| 440 | Mexico City | Mexico |
| 441 | São Paulo | Brazil |
| 442 | Cairo | Egypt |

## API Endpoints Used

### Current Weather
```
GET https://api.openweathermap.org/data/2.5/weather
Parameters:
  - lat: Latitude
  - lon: Longitude
  - appid: API key
  - units: metric (for Celsius)
```

### 5-Day Forecast
```
GET https://api.openweathermap.org/data/2.5/forecast
Parameters:
  - lat: Latitude
  - lon: Longitude
  - appid: API key
  - units: metric (for Celsius)
  - cnt: 8 (next 24 hours in 3-hour intervals)
```

## Caching Strategy

Weather data is cached for **30 minutes** to:
- Reduce API calls and stay within rate limits
- Improve response times
- Reduce costs

Cache is stored in Firestore with the key format: `weather_{pageId}`

## Mock Data

If no API key is configured, the adapter will use mock weather data for testing and development. This allows the system to work without an API key during development.

## Rate Limits

**Free Tier Limits:**
- 1,000 calls per day
- 60 calls per minute

**Estimated Usage:**
- 22 cities × 2 API calls (current + forecast) = 44 calls per refresh
- With 30-minute cache: ~1,056 calls per day (within free tier)
- Peak usage: ~88 calls per minute (exceeds limit)

**Recommendation:** 
- Use the 30-minute cache to stay within limits
- Consider upgrading to a paid plan for high-traffic deployments
- Implement request queuing if needed

## Error Handling

The adapter handles errors gracefully:

1. **API Key Missing**: Falls back to mock data
2. **API Unavailable**: Returns error page in teletext format
3. **Rate Limit Exceeded**: Returns cached data if available
4. **Network Timeout**: Falls back to mock data after 5 seconds

## Testing

Run the tests:

```bash
cd functions
npm test -- WeatherAdapter.test.ts
```

## Example Usage

### Navigate to Weather Index
```
Page 420: Weather index with city selection
```

### View City Weather
```
Page 421: London weather
Page 422: New York weather
Page 430: Istanbul weather
```

### Navigation
- RED button: Return to main index (100)
- GREEN button: Refresh current page
- YELLOW button: Next city
- BLUE button: Return to main index

## Data Format

Weather pages display:
- Current temperature (°C)
- Feels like temperature (°C)
- Weather conditions (e.g., "Clear Sky", "Light Rain")
- Humidity (%)
- Wind speed (km/h)
- 3-hour forecast intervals (next 12 hours)

All data is formatted to fit the 40×24 character teletext grid.

## Troubleshooting

### API Key Not Working
- Wait a few hours after creating the key (activation delay)
- Check that the key is correctly set in environment variables
- Verify the key at https://home.openweathermap.org/api_keys

### Rate Limit Errors
- Increase cache duration
- Reduce the number of cities
- Upgrade to a paid plan

### No Data Displayed
- Check API key configuration
- Check network connectivity
- Review Firebase Functions logs
- Verify mock data is working (remove API key temporarily)

## Alternative APIs

If OpenWeatherMap doesn't meet your needs, consider:

1. **WeatherAPI.com** - 1M calls/month free tier
2. **Tomorrow.io** - 500 calls/day free tier
3. **Visual Crossing** - 1,000 calls/day free tier

To switch APIs, modify the `fetchWeatherData` method in `WeatherAdapter.ts`.

## Resources

- OpenWeatherMap API Docs: https://openweathermap.org/api
- OpenWeatherMap FAQ: https://openweathermap.org/faq
- Firebase Functions Config: https://firebase.google.com/docs/functions/config-env
