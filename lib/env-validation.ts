/**
 * Environment variable validation utility
 * Validates required environment variables on startup
 * Requirements: 31.5, 4.1, 4.5
 */

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates required environment variables
 * @returns Validation result with missing and warning variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Required Firebase Client Configuration
  const requiredFirebaseClient = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  for (const key of requiredFirebaseClient) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Required Google Cloud Configuration (for AI features)
  const requiredGoogleCloud = [
    'GOOGLE_CLOUD_PROJECT'
  ];

  for (const key of requiredGoogleCloud) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Optional but recommended API keys
  const optionalApiKeys = [
    { key: 'NEWS_API_KEY', feature: 'News pages (200-299)' },
    { key: 'SPORTS_API_KEY', feature: 'Sports pages (300-399)' },
    { key: 'ALPHA_VANTAGE_API_KEY', feature: 'Stock market data (402)' },
    { key: 'OPENWEATHER_API_KEY', feature: 'Weather pages (420-449)' }
  ];

  for (const { key, feature } of optionalApiKeys) {
    if (!process.env[key]) {
      warnings.push(`${key} not set - ${feature} will have limited functionality`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Logs environment validation results
 * @param result - Validation result
 */
export function logEnvironmentValidation(result: EnvValidationResult): void {
  if (result.valid) {
    console.log('✅ Environment variables validated successfully');
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Optional API keys not configured:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
      console.log('\n   See .env.example for setup instructions');
    }
  } else {
    console.error('❌ Missing required environment variables:');
    result.missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('\nPlease configure these variables in .env.local');
    console.error('See .env.example for reference');
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Optional API keys not configured:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }
  }
}

/**
 * Validates environment variables and throws if required ones are missing
 * Use this in production to fail fast
 */
export function validateEnvironmentVariablesOrThrow(): void {
  const result = validateEnvironmentVariables();
  logEnvironmentValidation(result);
  
  if (!result.valid) {
    throw new Error(`Missing required environment variables: ${result.missing.join(', ')}`);
  }
}

/**
 * Validates environment variables and logs warnings
 * Use this in development to allow running with missing optional keys
 */
export function validateEnvironmentVariablesWithWarnings(): void {
  const result = validateEnvironmentVariables();
  logEnvironmentValidation(result);
}

/**
 * Checks if a specific API key is configured
 * @param key - Environment variable key
 * @returns True if the key is set and not empty
 */
export function isApiKeyConfigured(key: string): boolean {
  const value = process.env[key];
  return !!value && value.trim() !== '' && !value.includes('your_') && !value.includes('_here');
}

/**
 * Gets a helpful error message for a missing API key
 * @param key - Environment variable key
 * @returns Error message with setup instructions
 */
export function getMissingApiKeyMessage(key: string): string {
  const messages: Record<string, string> = {
    'NEWS_API_KEY': 'NEWS_API_KEY is not configured. Get a free key from https://newsapi.org/ and add it to .env.local',
    'SPORTS_API_KEY': 'SPORTS_API_KEY is not configured. Get a key from https://www.api-football.com/ and add it to .env.local',
    'ALPHA_VANTAGE_API_KEY': 'ALPHA_VANTAGE_API_KEY is not configured. Get a free key from https://www.alphavantage.co/ and add it to .env.local',
    'OPENWEATHER_API_KEY': 'OPENWEATHER_API_KEY is not configured. Get a free key from https://openweathermap.org/api and add it to .env.local'
  };

  return messages[key] || `${key} is not configured. See .env.example for setup instructions.`;
}
