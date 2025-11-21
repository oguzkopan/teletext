// Configuration utility for accessing environment variables and Firebase config
import * as functions from 'firebase-functions';

/**
 * Gets an API key from environment variables or Firebase config
 * Tries process.env first (for local development), then Firebase config (for production)
 */
export function getApiKey(envVarName: string, configPath: string): string {
  // Try environment variable first (local development)
  const envValue = process.env[envVarName];
  if (envValue) {
    return envValue;
  }

  // Try Firebase config (production)
  try {
    const configParts = configPath.split('.');
    let config: any = functions.config();
    
    for (const part of configParts) {
      if (config && typeof config === 'object' && part in config) {
        config = config[part];
      } else {
        return '';
      }
    }
    
    return typeof config === 'string' ? config : '';
  } catch (error) {
    console.warn(`Failed to get config for ${configPath}:`, error);
    return '';
  }
}

/**
 * Gets all API keys for the application
 */
export function getApiKeys() {
  return {
    newsApiKey: getApiKey('NEWS_API_KEY', 'news.api_key'),
    sportsApiKey: getApiKey('SPORTS_API_KEY', 'sports.api_key'),
    alphaVantageApiKey: getApiKey('ALPHA_VANTAGE_API_KEY', 'alphavantage.api_key'),
    coinGeckoApiKey: getApiKey('COINGECKO_API_KEY', 'coingecko.api_key'),
    openWeatherApiKey: getApiKey('OPENWEATHER_API_KEY', 'openweather.api_key'),
  };
}
