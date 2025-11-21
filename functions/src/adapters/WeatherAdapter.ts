// Weather adapter for pages 420-449
// Integrates with OpenWeatherMap API to provide weather forecasts

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';
import { getApiKey } from '../utils/config';

interface CityConfig {
  name: string;
  country: string;
  lat: number;
  lon: number;
  pageId: string;
}

/**
 * WeatherAdapter serves weather pages (420-449)
 * Integrates with OpenWeatherMap API for weather forecasts
 */
export class WeatherAdapter implements ContentAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';
  
  // Major cities with their coordinates and page assignments
  private cities: CityConfig[] = [
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, pageId: '421' },
    { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060, pageId: '422' },
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, pageId: '423' },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, pageId: '424' },
    { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093, pageId: '425' },
    { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708, pageId: '426' },
    { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198, pageId: '427' },
    { name: 'Hong Kong', country: 'HK', lat: 22.3193, lon: 114.1694, pageId: '428' },
    { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777, pageId: '429' },
    { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784, pageId: '430' },
    { name: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173, pageId: '431' },
    { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437, pageId: '432' },
    { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050, pageId: '433' },
    { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832, pageId: '434' },
    { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038, pageId: '435' },
    { name: 'Rome', country: 'IT', lat: 41.9028, lon: 12.4964, pageId: '436' },
    { name: 'Amsterdam', country: 'NL', lat: 52.3676, lon: 4.9041, pageId: '437' },
    { name: 'Seoul', country: 'KR', lat: 37.5665, lon: 126.9780, pageId: '438' },
    { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018, pageId: '439' },
    { name: 'Mexico City', country: 'MX', lat: 19.4326, lon: -99.1332, pageId: '440' },
    { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333, pageId: '441' },
    { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357, pageId: '442' }
  ];

  constructor() {
    // Get API key from environment variable or Firebase config
    this.apiKey = getApiKey('OPENWEATHER_API_KEY', 'openweather.api_key');
  }

  /**
   * Retrieves a weather page
   * @param pageId - The page ID to retrieve (420-449)
   * @returns A TeletextPage object with weather content
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific weather pages
    if (pageNumber === 420) {
      return this.getWeatherIndex();
    } else if (pageNumber >= 421 && pageNumber <= 449) {
      return this.getCityWeather(pageId);
    }

    throw new Error(`Invalid weather page: ${pageId}`);
  }



  /**
   * Creates the weather index page (420)
   */
  private getWeatherIndex(): TeletextPage {
    const rows = [
      'WEATHER INDEX                P420',
      '════════════════════════════════════',
      '',
      'SELECT A CITY:',
      ''
    ];

    // Add cities in two columns
    const citiesPerColumn = Math.ceil(this.cities.length / 2);
    for (let i = 0; i < citiesPerColumn; i++) {
      const leftCity = this.cities[i];
      const rightCity = this.cities[i + citiesPerColumn];
      
      const leftText = `${leftCity.pageId} ${leftCity.name}`;
      const rightText = rightCity ? `${rightCity.pageId} ${rightCity.name}` : '';
      
      const line = `${leftText.padEnd(20)}${rightText}`;
      rows.push(this.truncateText(line, 40));
    }

    // Fill remaining rows
    while (rows.length < 22) {
      rows.push('');
    }

    rows.push('Updated every 30 minutes');

    return {
      id: '420',
      title: 'Weather Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'LONDON', targetPage: '421', color: 'green' },
        { label: 'NYC', targetPage: '422', color: 'yellow' },
        { label: 'TOKYO', targetPage: '423', color: 'blue' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a city-specific weather page
   */
  private async getCityWeather(pageId: string): Promise<TeletextPage> {
    const city = this.cities.find(c => c.pageId === pageId);
    
    if (!city) {
      return this.getPlaceholderPage(pageId);
    }

    try {
      const weatherData = await this.fetchWeatherData(city);
      return this.formatWeatherPage(city, weatherData);
    } catch (error) {
      return this.getErrorPage(pageId, city.name, error);
    }
  }

  /**
   * Fetches weather data from OpenWeatherMap API
   */
  private async fetchWeatherData(city: CityConfig): Promise<any> {
    if (!this.apiKey) {
      // Return mock data if no API key configured
      return this.getMockWeatherData(city);
    }

    try {
      // Fetch current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/weather`, {
          params: {
            lat: city.lat,
            lon: city.lon,
            appid: this.apiKey,
            units: 'metric'
          },
          timeout: 5000
        }),
        axios.get(`${this.baseUrl}/forecast`, {
          params: {
            lat: city.lat,
            lon: city.lon,
            appid: this.apiKey,
            units: 'metric',
            cnt: 8 // Next 24 hours (3-hour intervals)
          },
          timeout: 5000
        })
      ]);

      return {
        current: currentResponse.data,
        forecast: forecastResponse.data
      };
    } catch (error) {
      // Fallback to mock data on error
      return this.getMockWeatherData(city);
    }
  }

  /**
   * Formats weather data into a teletext page
   */
  private formatWeatherPage(city: CityConfig, weatherData: any): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const current = weatherData.current;
    const forecast = weatherData.forecast;

    const rows = [
      `${this.truncateText(city.name.toUpperCase(), 28).padEnd(28, ' ')} P${city.pageId}`,
      '════════════════════════════════════',
      `Updated: ${timeStr}`,
      ''
    ];

    // Current conditions
    rows.push('CURRENT CONDITIONS');
    rows.push('');
    
    const temp = Math.round(current.main?.temp || 0);
    const feelsLike = Math.round(current.main?.feels_like || 0);
    const condition = this.capitalizeWords(current.weather?.[0]?.description || 'Unknown');
    const humidity = Math.round(current.main?.humidity || 0);
    const windSpeed = Math.round((current.wind?.speed || 0) * 3.6); // m/s to km/h
    
    rows.push(`Temperature:     ${temp}°C`);
    rows.push(`Feels like:      ${feelsLike}°C`);
    rows.push(`Conditions:      ${this.truncateText(condition, 20)}`);
    rows.push(`Humidity:        ${humidity}%`);
    rows.push(`Wind:            ${windSpeed} km/h`);
    rows.push('');

    // Forecast
    rows.push('FORECAST (3-HOUR INTERVALS)');
    rows.push('');
    
    if (forecast?.list && forecast.list.length > 0) {
      forecast.list.slice(0, 4).forEach((item: any) => {
        const forecastTime = new Date(item.dt * 1000);
        const timeStr = forecastTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const forecastTemp = Math.round(item.main?.temp || 0);
        const forecastCondition = this.truncateText(
          this.capitalizeWords(item.weather?.[0]?.description || ''),
          15
        );
        
        rows.push(`${timeStr}  ${forecastTemp}°C  ${forecastCondition}`);
      });
    } else {
      rows.push('Forecast not available');
    }

    return {
      id: city.pageId,
      title: `Weather - ${city.name}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '420', color: 'red' },
        { label: 'REFRESH', targetPage: city.pageId, color: 'green' },
        { label: 'NEXT', targetPage: this.getNextCityPage(city.pageId), color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Gets the next city page ID for navigation
   */
  private getNextCityPage(currentPageId: string): string {
    const currentIndex = this.cities.findIndex(c => c.pageId === currentPageId);
    if (currentIndex === -1 || currentIndex === this.cities.length - 1) {
      return '421'; // Loop back to first city
    }
    return this.cities[currentIndex + 1].pageId;
  }

  /**
   * Returns mock weather data for testing/demo
   */
  private getMockWeatherData(city: CityConfig): any {
    // Generate realistic mock data based on city location
    const baseTemp = city.lat > 0 ? 15 : 25; // Cooler in northern hemisphere
    const temp = baseTemp + Math.random() * 10;
    
    const conditions = [
      'clear sky',
      'few clouds',
      'scattered clouds',
      'broken clouds',
      'light rain',
      'moderate rain',
      'overcast clouds'
    ];
    
    return {
      current: {
        main: {
          temp: temp,
          feels_like: temp - 2,
          humidity: 60 + Math.random() * 30
        },
        weather: [
          {
            description: conditions[Math.floor(Math.random() * conditions.length)]
          }
        ],
        wind: {
          speed: 3 + Math.random() * 5
        }
      },
      forecast: {
        list: [
          {
            dt: Date.now() / 1000 + 3 * 3600,
            main: { temp: temp + 1 },
            weather: [{ description: conditions[Math.floor(Math.random() * conditions.length)] }]
          },
          {
            dt: Date.now() / 1000 + 6 * 3600,
            main: { temp: temp + 2 },
            weather: [{ description: conditions[Math.floor(Math.random() * conditions.length)] }]
          },
          {
            dt: Date.now() / 1000 + 9 * 3600,
            main: { temp: temp + 1 },
            weather: [{ description: conditions[Math.floor(Math.random() * conditions.length)] }]
          },
          {
            dt: Date.now() / 1000 + 12 * 3600,
            main: { temp: temp - 1 },
            weather: [{ description: conditions[Math.floor(Math.random() * conditions.length)] }]
          }
        ]
      }
    };
  }

  /**
   * Capitalizes the first letter of each word
   */
  private capitalizeWords(text: string): string {
    if (!text) return '';
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Creates an error page when API fails
   */
  private getErrorPage(pageId: string, cityName: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(cityName.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to fetch weather data at this',
      'time.',
      '',
      'This could be due to:',
      '• API service is down',
      '• Network connectivity issues',
      '• Rate limit exceeded',
      '',
      'Please try again in a few minutes.',
      '',
      '',
      '',
      '',
      'Press 420 for weather index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   WEATHER',
      ''
    ];

    return {
      id: pageId,
      title: `Weather - ${cityName}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'WEATHER', targetPage: '420', color: 'green' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `WEATHER PAGE ${pageId}           P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Weather page ${pageId} is under`,
      'construction.',
      '',
      'This page will be available in a',
      'future update.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 420 for weather index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   WEATHER',
      ''
    ];

    return {
      id: pageId,
      title: `Weather Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'WEATHER', targetPage: '420', color: 'green' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
