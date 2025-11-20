/**
 * Environment variable validation utility
 * Validates required environment variables on startup
 * Requirements: 38.1, 38.2, 38.3, 38.4, 38.5
 */

interface EnvValidationResult {
  valid: boolean;
  missing: EnvVarInfo[];
  warnings: EnvVarInfo[];
}

interface EnvVarInfo {
  key: string;
  description: string;
  setupUrl?: string;
  setupInstructions?: string;
  affectedPages?: string;
  category: 'firebase' | 'google-cloud' | 'api-key';
}

/**
 * Comprehensive environment variable configuration
 * Maps each variable to its metadata for better error messages
 */
const ENV_VAR_CONFIG: Record<string, EnvVarInfo> = {
  // Firebase Client Configuration
  'NEXT_PUBLIC_FIREBASE_API_KEY': {
    key: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    description: 'Firebase API key for client-side authentication',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Get from Firebase Console > Project Settings > General > Web apps',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': {
    key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    description: 'Firebase authentication domain',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Format: your-project-id.firebaseapp.com',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': {
    key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    description: 'Firebase project ID',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Your Firebase project ID',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': {
    key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    description: 'Firebase Storage bucket name',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Format: your-project-id.appspot.com',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': {
    key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    description: 'Firebase Cloud Messaging sender ID',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Get from Firebase Console > Project Settings > Cloud Messaging',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  'NEXT_PUBLIC_FIREBASE_APP_ID': {
    key: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    description: 'Firebase app ID',
    setupUrl: 'https://console.firebase.google.com/project/_/settings/general',
    setupInstructions: 'Get from Firebase Console > Project Settings > General > Web apps',
    affectedPages: 'All pages (required for Firebase initialization)',
    category: 'firebase'
  },
  
  // Google Cloud Configuration
  'GOOGLE_CLOUD_PROJECT': {
    key: 'GOOGLE_CLOUD_PROJECT',
    description: 'Google Cloud project ID for Vertex AI',
    setupUrl: 'https://console.cloud.google.com/',
    setupInstructions: 'Your Google Cloud project ID (usually same as Firebase project ID)',
    affectedPages: 'AI Oracle pages (500-599)',
    category: 'google-cloud'
  },
  
  // External API Keys
  'NEWS_API_KEY': {
    key: 'NEWS_API_KEY',
    description: 'NewsAPI key for live news headlines',
    setupUrl: 'https://newsapi.org/register',
    setupInstructions: '1. Sign up at https://newsapi.org/\n2. Get your free API key\n3. Add NEWS_API_KEY=your_key to .env.local',
    affectedPages: 'News pages (200-299)',
    category: 'api-key'
  },
  'SPORTS_API_KEY': {
    key: 'SPORTS_API_KEY',
    description: 'API-Football key for live sports scores',
    setupUrl: 'https://www.api-football.com/pricing',
    setupInstructions: '1. Sign up at https://www.api-football.com/\n2. Get your API key\n3. Add SPORTS_API_KEY=your_key to .env.local',
    affectedPages: 'Sports pages (300-399)',
    category: 'api-key'
  },
  'ALPHA_VANTAGE_API_KEY': {
    key: 'ALPHA_VANTAGE_API_KEY',
    description: 'Alpha Vantage key for stock market data',
    setupUrl: 'https://www.alphavantage.co/support/#api-key',
    setupInstructions: '1. Get free key at https://www.alphavantage.co/support/#api-key\n2. Add ALPHA_VANTAGE_API_KEY=your_key to .env.local',
    affectedPages: 'Stock market pages (402)',
    category: 'api-key'
  },
  'OPENWEATHER_API_KEY': {
    key: 'OPENWEATHER_API_KEY',
    description: 'OpenWeatherMap key for weather forecasts',
    setupUrl: 'https://openweathermap.org/api',
    setupInstructions: '1. Sign up at https://openweathermap.org/api\n2. Get your free API key\n3. Add OPENWEATHER_API_KEY=your_key to .env.local',
    affectedPages: 'Weather pages (420-449)',
    category: 'api-key'
  }
};

/**
 * Validates required environment variables
 * @returns Validation result with missing and warning variables
 * Requirements: 38.1, 38.2, 38.4
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: EnvVarInfo[] = [];
  const warnings: EnvVarInfo[] = [];

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
      missing.push(ENV_VAR_CONFIG[key]);
    }
  }

  // Required Google Cloud Configuration (for AI features)
  const requiredGoogleCloud = [
    'GOOGLE_CLOUD_PROJECT'
  ];

  for (const key of requiredGoogleCloud) {
    if (!process.env[key]) {
      missing.push(ENV_VAR_CONFIG[key]);
    }
  }

  // Optional but recommended API keys
  const optionalApiKeys = [
    'NEWS_API_KEY',
    'SPORTS_API_KEY',
    'ALPHA_VANTAGE_API_KEY',
    'OPENWEATHER_API_KEY'
  ];

  for (const key of optionalApiKeys) {
    if (!process.env[key]) {
      warnings.push(ENV_VAR_CONFIG[key]);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Logs environment validation results with detailed information
 * @param result - Validation result
 * Requirements: 38.3, 38.5
 */
export function logEnvironmentValidation(result: EnvValidationResult): void {
  if (result.valid) {
    console.log('✅ Environment variables validated successfully');
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Optional API keys not configured:');
      console.log('━'.repeat(60));
      result.warnings.forEach(warning => {
        console.log(`\n📌 ${warning.key}`);
        console.log(`   Description: ${warning.description}`);
        console.log(`   Affected: ${warning.affectedPages}`);
        console.log(`   Setup: ${warning.setupUrl}`);
      });
      console.log('\n' + '━'.repeat(60));
      console.log('ℹ️  See .env.example for complete setup instructions');
      console.log('ℹ️  These features will show demo/placeholder data without API keys');
    }
  } else {
    console.error('❌ MISSING REQUIRED ENVIRONMENT VARIABLES');
    console.error('━'.repeat(60));
    console.error('\nThe application cannot start without these variables:\n');
    
    result.missing.forEach(envVar => {
      console.error(`🔴 ${envVar.key}`);
      console.error(`   Description: ${envVar.description}`);
      console.error(`   Affected: ${envVar.affectedPages}`);
      console.error(`   Setup URL: ${envVar.setupUrl}`);
      if (envVar.setupInstructions) {
        console.error(`   Instructions:\n   ${envVar.setupInstructions.replace(/\n/g, '\n   ')}`);
      }
      console.error('');
    });
    
    console.error('━'.repeat(60));
    console.error('\n📝 QUICK FIX:');
    console.error('   1. Copy .env.example to .env.local');
    console.error('   2. Fill in the required values');
    console.error('   3. Restart the development server');
    console.error('\n📖 See .env.example for complete reference');
    console.error('━'.repeat(60));
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Optional API keys also not configured:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning.key} (${warning.affectedPages})`);
      });
      console.log('   These features will have limited functionality');
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
 * Gets a comprehensive validation report for display
 * @returns Formatted validation report
 * Requirements: 38.3, 38.4
 */
export function getValidationReport(): string {
  const result = validateEnvironmentVariables();
  let report = '';
  
  report += '═'.repeat(60) + '\n';
  report += 'ENVIRONMENT VARIABLE VALIDATION REPORT\n';
  report += '═'.repeat(60) + '\n\n';
  
  if (result.valid) {
    report += '✅ All required environment variables are configured\n\n';
  } else {
    report += '❌ MISSING REQUIRED VARIABLES:\n\n';
    result.missing.forEach(envVar => {
      report += `  ${envVar.key}\n`;
      report += `    Category: ${envVar.category}\n`;
      report += `    Description: ${envVar.description}\n`;
      report += `    Affected: ${envVar.affectedPages}\n`;
      report += `    Setup: ${envVar.setupUrl}\n\n`;
    });
  }
  
  if (result.warnings.length > 0) {
    report += '⚠️  OPTIONAL VARIABLES NOT CONFIGURED:\n\n';
    result.warnings.forEach(envVar => {
      report += `  ${envVar.key}\n`;
      report += `    Description: ${envVar.description}\n`;
      report += `    Affected: ${envVar.affectedPages}\n`;
      report += `    Setup: ${envVar.setupUrl}\n\n`;
    });
  }
  
  report += '═'.repeat(60) + '\n';
  report += 'For setup instructions, see .env.example\n';
  report += '═'.repeat(60) + '\n';
  
  return report;
}

/**
 * Checks if a specific feature is available based on API key configuration
 * @param feature - Feature name ('news', 'sports', 'markets', 'weather', 'ai')
 * @returns True if the feature's API key is configured
 * Requirements: 38.1, 38.2
 */
export function isFeatureAvailable(feature: string): boolean {
  const featureKeyMap: Record<string, string> = {
    'news': 'NEWS_API_KEY',
    'sports': 'SPORTS_API_KEY',
    'stocks': 'ALPHA_VANTAGE_API_KEY',
    'weather': 'OPENWEATHER_API_KEY',
    'ai': 'GOOGLE_CLOUD_PROJECT'
  };
  
  const key = featureKeyMap[feature];
  if (!key) return false;
  
  return isApiKeyConfigured(key);
}

/**
 * Gets all missing API keys for a specific page range
 * @param pageNumber - Page number to check
 * @returns Array of missing API key information
 * Requirements: 38.1, 38.2
 */
export function getMissingKeysForPage(pageNumber: number): EnvVarInfo[] {
  const missing: EnvVarInfo[] = [];
  
  // Determine which API keys are needed for this page range
  if (pageNumber >= 200 && pageNumber < 300) {
    if (!isApiKeyConfigured('NEWS_API_KEY')) {
      missing.push(ENV_VAR_CONFIG['NEWS_API_KEY']);
    }
  } else if (pageNumber >= 300 && pageNumber < 400) {
    if (!isApiKeyConfigured('SPORTS_API_KEY')) {
      missing.push(ENV_VAR_CONFIG['SPORTS_API_KEY']);
    }
  } else if (pageNumber === 402) {
    if (!isApiKeyConfigured('ALPHA_VANTAGE_API_KEY')) {
      missing.push(ENV_VAR_CONFIG['ALPHA_VANTAGE_API_KEY']);
    }
  } else if (pageNumber >= 420 && pageNumber < 450) {
    if (!isApiKeyConfigured('OPENWEATHER_API_KEY')) {
      missing.push(ENV_VAR_CONFIG['OPENWEATHER_API_KEY']);
    }
  } else if (pageNumber >= 500 && pageNumber < 600) {
    if (!isApiKeyConfigured('GOOGLE_CLOUD_PROJECT')) {
      missing.push(ENV_VAR_CONFIG['GOOGLE_CLOUD_PROJECT']);
    }
  }
  
  return missing;
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
 * Gets detailed information about a missing API key
 * @param key - Environment variable key
 * @returns Environment variable information object
 * Requirements: 38.2, 38.5
 */
export function getEnvVarInfo(key: string): EnvVarInfo | null {
  return ENV_VAR_CONFIG[key] || null;
}

/**
 * Gets a helpful error message for a missing API key
 * @param key - Environment variable key
 * @returns Error message with setup instructions
 * Requirements: 38.1, 38.2, 38.5
 */
export function getMissingApiKeyMessage(key: string): string {
  const envVar = ENV_VAR_CONFIG[key];
  
  if (!envVar) {
    return `${key} is not configured. See .env.example for setup instructions.`;
  }
  
  return `${envVar.key} is not configured.\n\n` +
    `Description: ${envVar.description}\n` +
    `Affected pages: ${envVar.affectedPages}\n\n` +
    `Setup instructions:\n${envVar.setupInstructions}\n\n` +
    `Get your API key: ${envVar.setupUrl}\n\n` +
    `See .env.example for reference.`;
}

/**
 * Pads text to exactly 40 characters
 * @param text - Text to pad
 * @returns Padded text
 */
function padTo40(text: string): string {
  if (text.length >= 40) return text.substring(0, 40);
  return text + ' '.repeat(40 - text.length);
}

/**
 * Creates a teletext-formatted error page for a missing API key
 * @param key - Environment variable key
 * @param pageId - The page ID that requires this key
 * @returns Formatted error message for teletext display (24 rows, 40 chars each)
 * Requirements: 38.1, 38.2, 38.4, 38.5
 */
export function createMissingApiKeyPage(key: string, pageId: string): string[] {
  const envVar = ENV_VAR_CONFIG[key];
  
  if (!envVar) {
    return [
      padTo40(`API KEY NOT CONFIGURED         ${pageId}`),
      padTo40('════════════════════════════════════════'),
      padTo40(''),
      padTo40(`⚠ ${key} is not set.`),
      padTo40(''),
      padTo40('See .env.example for setup instructions.'),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40(''),
      padTo40('Press 100 for INDEX'),
      padTo40('Press 999 for HELP'),
      padTo40(''),
      padTo40('')
    ];
  }
  
  const rows: string[] = [
    padTo40(`API KEY NOT CONFIGURED         ${pageId}`),
    padTo40('════════════════════════════════════════'),
    padTo40(''),
    padTo40(`⚠ ${envVar.key} is not set.`),
    padTo40(''),
    padTo40('DESCRIPTION:'),
    padTo40(envVar.description.substring(0, 40)),
    padTo40(''),
    padTo40('AFFECTED PAGES:'),
    padTo40((envVar.affectedPages || '').substring(0, 40)),
    padTo40(''),
    padTo40('TO FIX THIS:'),
  ];
  
  // Add setup instructions (split into lines)
  if (envVar.setupInstructions) {
    const instructions = envVar.setupInstructions.split('\n');
    instructions.forEach(line => {
      if (line.length <= 40) {
        rows.push(padTo40(line));
      } else {
        // Split long lines
        const words = line.split(' ');
        let currentLine = '';
        words.forEach(word => {
          if ((currentLine + ' ' + word).length <= 40) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            if (currentLine) rows.push(padTo40(currentLine));
            currentLine = word;
          }
        });
        if (currentLine) rows.push(padTo40(currentLine));
      }
    });
  }
  
  rows.push(padTo40(''));
  
  // Add setup URL (split if needed)
  if (envVar.setupUrl) {
    rows.push(padTo40('GET API KEY:'));
    if (envVar.setupUrl.length <= 40) {
      rows.push(padTo40(envVar.setupUrl));
    } else {
      // Split URL into chunks
      const urlChunks = envVar.setupUrl.match(/.{1,40}/g) || [];
      urlChunks.forEach(chunk => rows.push(padTo40(chunk)));
    }
  }
  
  // Pad to 24 rows
  while (rows.length < 22) {
    rows.push(padTo40(''));
  }
  
  rows.push(padTo40('Press 100 for INDEX'));
  rows.push(padTo40('See .env.example for reference'));
  
  // Ensure exactly 24 rows
  while (rows.length < 24) {
    rows.push(padTo40(''));
  }
  
  return rows.slice(0, 24);
}
