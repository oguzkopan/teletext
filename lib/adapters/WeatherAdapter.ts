// Weather adapter for pages 420-449
// Fetches weather data from OpenWeatherMap

import { TeletextPage } from '@/types/teletext';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  name: string;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    dt_txt: string;
  }>;
}

export class WeatherAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    if (pageId.includes('-')) {
      return this.getWeatherDetailArticlePage(pageId);
    }

    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 420) {
      return this.getWeatherIndexPage();
    } else if (pageNumber === 421) {
      return this.getCityWeatherPage('London', 'GB');
    } else if (pageNumber === 422) {
      return this.getCityWeatherPage('Manchester', 'GB');
    } else if (pageNumber === 423) {
      return this.getCityWeatherPage('Birmingham', 'GB');
    } else if (pageNumber === 424) {
      return this.getCityWeatherPage('Edinburgh', 'GB');
    } else if (pageNumber === 425) {
      return this.getCityWeatherPage('New York', 'US');
    } else if (pageNumber === 426) {
      return this.getCityWeatherPage('Tokyo', 'JP');
    } else if (pageNumber === 427) {
      return this.getCityWeatherPage('Paris', 'FR');
    } else if (pageNumber === 430) {
      return this.getForecastPage('London', 'GB');
    } else if (pageNumber >= 428 && pageNumber <= 449) {
      return this.getWeatherCategoryPage(pageId);
    }

    throw new Error(`Invalid weather page: ${pageId}`);
  }

  private async getWeatherIndexPage(): Promise<TeletextPage> {
    try {
      // Fetch weather for London as preview
      const response = await fetch(
        `${this.apiUrl}/weather?q=London,GB&units=metric&appid=${this.apiKey}`,
        { next: { revalidate: 600 } }
      );

      const weatherData: WeatherData = response.ok ? await response.json() : null;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const temp = weatherData ? Math.round(weatherData.main.temp) : '--';
      const desc = weatherData ? weatherData.weather[0].description : 'N/A';
      const icon = this.getWeatherIcon(weatherData?.weather[0].main || '');

      const rows = [
        `{cyan}420 {yellow}${icon} WEATHER FORECAST ${icon} {cyan}${dateStr} ${timeStr}                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
        '{yellow}║  {red}LIVE WEATHER{yellow}  {white}░▒▓█▓▒░  {cyan}Real-time Weather Data  {white}░▒▓█▓▒░  {yellow}Live from OpenWeatherMap{yellow}                                        ║',
        '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{cyan}▓▓▓ CURRENT CONDITIONS ▓▓▓',
        `{yellow}London:{white} ${temp}°C, ${desc}`,
        '',
        '{cyan}▓▓▓ UK CITIES ▓▓▓',
        '{green}421{white} London Weather                       {green}422{white} Manchester Weather                   {green}423{white} Birmingham Weather',
        '{green}424{white} Edinburgh Weather                    {green}430{white} 5-Day Forecast                       ',
        '',
        '{cyan}▓▓▓ WORLD CITIES ▓▓▓',
        '{green}425{white} New York Weather                     {green}426{white} Tokyo Weather                        {green}427{white} Paris Weather',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=LONDON {yellow}YELLOW{white}=MANCHESTER {blue}BLUE{white}=FORECAST',
        ''
      ];

      return {
        id: '420',
        title: 'Weather Forecast',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'LONDON', targetPage: '421', color: 'green' },
          { label: 'MANCHESTER', targetPage: '422', color: 'yellow' },
          { label: 'FORECAST', targetPage: '430', color: 'blue' }
        ],
        meta: {
          source: 'WeatherAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching weather index:', error);
      return this.getErrorPage('420', 'Weather Forecast');
    }
  }

  private async getCityWeatherPage(city: string, country: string): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.apiUrl}/weather?q=${city},${country}&units=metric&appid=${this.apiKey}`,
        { next: { revalidate: 600 } }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }

      const weatherData: WeatherData = await response.json();

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const temp = Math.round(weatherData.main.temp);
      const feelsLike = Math.round(weatherData.main.feels_like);
      const tempMin = Math.round(weatherData.main.temp_min);
      const tempMax = Math.round(weatherData.main.temp_max);
      const humidity = weatherData.main.humidity;
      const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
      const description = weatherData.weather[0].description;
      const icon = this.getWeatherIcon(weatherData.weather[0].main);
      const asciiIcon = this.getAsciiWeatherIcon(weatherData.weather[0].main);
      const tempColor = this.getTemperatureColor(temp);

      const pageId = this.getCityPageId(city);

      const rows = [
        `{cyan}${pageId} {yellow}${icon} ${city} Weather ${icon} {cyan}${timeStr}                                                                                                        {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        `{white}Updated: {green}${timeStr} {white}• Live weather from OpenWeatherMap                                                                                        `,
        `{white}Current conditions for ${city}`,
        '',
        '{cyan}▓▓▓ CURRENT CONDITIONS ▓▓▓',
        `{white}${asciiIcon[0]}      {yellow}Temperature:{white} {${tempColor}}${temp}°C`,
        `{white}${asciiIcon[1]}      {yellow}Feels Like:{white} {${tempColor}}${feelsLike}°C`,
        `{white}${asciiIcon[2]}      {yellow}Conditions:{white} ${description}`,
        `{white}${asciiIcon[3]}`,
        `{white}${asciiIcon[4]}      {cyan}▓▓▓ DETAILS ▓▓▓`,
        `                  {yellow}High/Low:{white} ${tempMax}°C / ${tempMin}°C`,
        `                  {yellow}Humidity:{white} ${humidity}%`,
        `                  {yellow}Wind Speed:{white} ${windSpeed} km/h`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=WEATHER {yellow}YELLOW{white}=FORECAST {blue}BLUE{white}=OTHER CITIES',
        ''
      ];

      return {
        id: pageId,
        title: `${city} Weather`,
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'WEATHER', targetPage: '420', color: 'green' },
          { label: 'FORECAST', targetPage: '430', color: 'yellow' },
          { label: 'CITIES', targetPage: '420', color: 'blue' }
        ],
        meta: {
          source: 'WeatherAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return this.getErrorPage(this.getCityPageId(city), `${city} Weather`);
    }
  }

  private async getForecastPage(city: string, country: string): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.apiUrl}/forecast?q=${city},${country}&units=metric&appid=${this.apiKey}`,
        { next: { revalidate: 3600 } }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const forecastData: ForecastData = await response.json();

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Get daily forecasts (one per day at noon)
      const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

      const forecastLines: string[] = [];
      dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
        const temp = Math.round(forecast.main.temp);
        const desc = forecast.weather[0].main;
        const icon = this.getWeatherIcon(desc);
        
        forecastLines.push(`{yellow}${dayName}:{white} ${icon} ${temp}°C, ${forecast.weather[0].description}`);
      });

      const rows = [
        `{cyan}430 {yellow}☀️ 5-Day Forecast ${city} ☀️ {cyan}${timeStr}                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        `{white}Updated: {green}${timeStr} {white}• 5-day forecast from OpenWeatherMap                                                                                      `,
        `{white}Weather forecast for ${city}`,
        '',
        '{cyan}▓▓▓ 5-DAY FORECAST ▓▓▓',
        ...forecastLines,
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
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=WEATHER {yellow}YELLOW{white}=LONDON {blue}BLUE{white}=MANCHESTER',
        ''
      ];

      return {
        id: '430',
        title: '5-Day Forecast',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'WEATHER', targetPage: '420', color: 'green' },
          { label: 'LONDON', targetPage: '421', color: 'yellow' },
          { label: 'MANCHESTER', targetPage: '422', color: 'blue' }
        ],
        meta: {
          source: 'WeatherAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return this.getErrorPage('430', '5-Day Forecast');
    }
  }

  private async getWeatherCategoryPage(pageId: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rows = [
      `{cyan}${pageId} {yellow}Weather Category {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{yellow}║  {white}COMING SOON{yellow}  {white}░▒▓█▓▒░  {cyan}Additional weather features under development  {white}░▒▓█▓▒░{yellow}                                            ║',
      '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{white}Check out our current weather pages:',
      '',
      '{green}421{white} - London Weather',
      '{green}422{white} - Manchester Weather',
      '{green}423{white} - Birmingham Weather',
      '{green}424{white} - Edinburgh Weather',
      '{green}425{white} - New York Weather',
      '{green}426{white} - Tokyo Weather',
      '{green}427{white} - Paris Weather',
      '{green}430{white} - 5-Day Forecast',
      '',
      '',
      '',
      '',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=WEATHER {yellow}YELLOW{white}=LONDON {blue}BLUE{white}=FORECAST',
      ''
    ];

    return {
      id: pageId,
      title: 'Weather Category',
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'WEATHER', targetPage: '420', color: 'green' },
        { label: 'LONDON', targetPage: '421', color: 'yellow' },
        { label: 'FORECAST', targetPage: '430', color: 'blue' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private async getWeatherDetailArticlePage(pageId: string): Promise<TeletextPage> {
    return this.getErrorPage(pageId, 'Weather Detail');
  }

  private getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
  }

  private getAsciiWeatherIcon(condition: string): string[] {
    const weatherMap: Record<string, string[]> = {
      'Clear': [
        '    \\   /    ',
        '     .-.     ',
        '  ― (   ) ―  ',
        '     `-\'     ',
        '    /   \\    '
      ],
      'Clouds': [
        '             ',
        '    .--.     ',
        ' .-(    ).   ',
        '(___.__)__)  ',
        '             '
      ],
      'Rain': [
        '    .--.     ',
        ' .-(    ).   ',
        '(___.__)__)  ',
        ' ʻ ʻ ʻ ʻ ʻ   ',
        '  ʻ ʻ ʻ ʻ    '
      ],
      'Drizzle': [
        '    .--.     ',
        ' .-(    ).   ',
        '(___.__)__)  ',
        '  ʻ  ʻ  ʻ    ',
        '   ʻ  ʻ      '
      ],
      'Thunderstorm': [
        '    .--.     ',
        ' .-(    ).   ',
        '(___.__)__)  ',
        '  ⚡ ʻ ʻ ʻ   ',
        ' ʻ ʻ ʻ ʻ     '
      ],
      'Snow': [
        '    .--.     ',
        ' .-(    ).   ',
        '(___.__)__)  ',
        ' * * * * *   ',
        '  * * * *    '
      ],
      'Mist': [
        '             ',
        ' ≈ ≈ ≈ ≈ ≈   ',
        '  ≈ ≈ ≈ ≈    ',
        ' ≈ ≈ ≈ ≈ ≈   ',
        '  ≈ ≈ ≈ ≈    '
      ],
      'Fog': [
        '             ',
        ' ≡ ≡ ≡ ≡ ≡   ',
        '  ≡ ≡ ≡ ≡    ',
        ' ≡ ≡ ≡ ≡ ≡   ',
        '  ≡ ≡ ≡ ≡    '
      ]
    };

    return weatherMap[condition] || weatherMap['Clouds'];
  }

  private getTemperatureColor(temp: number): string {
    if (temp < 10) return 'blue';
    if (temp >= 10 && temp < 25) return 'yellow';
    return 'red';
  }

  private getCityPageId(city: string): string {
    const cityIds: Record<string, string> = {
      'London': '421',
      'Manchester': '422',
      'Birmingham': '423',
      'Edinburgh': '424',
      'New York': '425',
      'Tokyo': '426',
      'Paris': '427'
    };
    return cityIds[city] || '420';
  }

  private getErrorPage(pageId: string, title: string): TeletextPage {
    const rows = [
      `{cyan}${pageId} {yellow}${title} {cyan}ERROR                                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{red}SERVICE UNAVAILABLE',
      '',
      '{white}Unable to load weather data at this time.',
      '',
      '{white}Please try again later.',
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
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=WEATHER',
      ''
    ];

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'WEATHER', targetPage: '420', color: 'green' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }
}
