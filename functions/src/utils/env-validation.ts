/**
 * Environment variable validation utility for Cloud Functions
 * Validates required environment variables and creates error pages
 * Requirements: 38.1, 38.2, 38.3, 38.4, 38.5
 */

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
  },
  'GOOGLE_CLOUD_PROJECT': {
    key: 'GOOGLE_CLOUD_PROJECT',
    description: 'Google Cloud project ID for Vertex AI',
    setupUrl: 'https://console.cloud.google.com/',
    setupInstructions: 'Your Google Cloud project ID (usually same as Firebase project ID)',
    affectedPages: 'AI Oracle pages (500-599)',
    category: 'google-cloud'
  }
};

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
 * Creates a teletext-formatted error page for a missing API key
 * @param key - Environment variable key
 * @param pageId - The page ID that requires this key
 * @returns Array of 24 rows (40 chars each) for teletext display
 * Requirements: 38.1, 38.2, 38.4, 38.5
 */
export function createMissingApiKeyPage(key: string, pageId: string): string[] {
  const envVar = ENV_VAR_CONFIG[key];
  
  if (!envVar) {
    return [
      `API KEY NOT CONFIGURED         ${pageId}`,
      '════════════════════════════════════════',
      '',
      `⚠ ${key} is not set.`,
      '',
      'See .env.example for setup instructions.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 100 for INDEX',
      'Press 999 for HELP',
      '',
      ''
    ];
  }
  
  const rows: string[] = [
    `API KEY NOT CONFIGURED         ${pageId}`,
    '════════════════════════════════════════',
    '',
    `⚠ ${envVar.key} is not set.`,
    '',
    'DESCRIPTION:',
    wrapText(envVar.description, 40)[0] || '',
    '',
    'AFFECTED PAGES:',
    wrapText(envVar.affectedPages || '', 40)[0] || '',
    '',
    'TO FIX THIS:',
  ];
  
  // Add setup instructions (split into lines)
  if (envVar.setupInstructions) {
    const instructions = envVar.setupInstructions.split('\n');
    instructions.forEach(line => {
      const wrapped = wrapText(line, 40);
      wrapped.forEach(wrappedLine => rows.push(wrappedLine));
    });
  }
  
  rows.push('');
  
  // Add setup URL (split if needed)
  if (envVar.setupUrl) {
    rows.push('GET API KEY:');
    const urlLines = wrapText(envVar.setupUrl, 40);
    urlLines.forEach(line => rows.push(line));
  }
  
  // Pad to 24 rows
  while (rows.length < 22) {
    rows.push('');
  }
  
  rows.push('Press 100 for INDEX');
  rows.push('See .env.example for reference');
  
  // Ensure exactly 24 rows, each padded to 40 chars
  const finalRows = rows.slice(0, 24).map(row => padText(row, 40));
  while (finalRows.length < 24) {
    finalRows.push(padText('', 40));
  }
  
  return finalRows;
}

/**
 * Wraps text to fit within specified width
 * @param text - Text to wrap
 * @param width - Maximum width
 * @returns Array of wrapped lines
 */
function wrapText(text: string, width: number): string[] {
  if (!text) return [''];
  if (text.length <= width) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      if (word.length > width) {
        // Hard wrap long words
        let remaining = word;
        while (remaining.length > width) {
          lines.push(remaining.substring(0, width));
          remaining = remaining.substring(width);
        }
        currentLine = remaining;
      } else {
        currentLine = word;
      }
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [''];
}

/**
 * Pads text to specified width
 * @param text - Text to pad
 * @param width - Target width
 * @returns Padded text
 */
function padText(text: string, width: number): string {
  if (text.length >= width) return text.substring(0, width);
  return text + ' '.repeat(width - text.length);
}

/**
 * Logs detailed error information for missing API key
 * @param key - Environment variable key
 * Requirements: 38.3
 */
export function logMissingApiKey(key: string): void {
  const envVar = ENV_VAR_CONFIG[key];
  
  if (!envVar) {
    console.error(`❌ ${key} is not configured`);
    return;
  }
  
  console.error('\n' + '═'.repeat(60));
  console.error(`❌ MISSING API KEY: ${envVar.key}`);
  console.error('═'.repeat(60));
  console.error(`\nDescription: ${envVar.description}`);
  console.error(`Affected pages: ${envVar.affectedPages}`);
  console.error(`\nSetup instructions:`);
  console.error(envVar.setupInstructions);
  console.error(`\nGet your API key: ${envVar.setupUrl}`);
  console.error('\n' + '═'.repeat(60) + '\n');
}
