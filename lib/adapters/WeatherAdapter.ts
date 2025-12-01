// Weather adapter for pages 420-449
// Fetches weather data from OpenWeatherMap

import { TeletextPage } from '@/types/teletext';

export class WeatherAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 420) {
      return this.getWeatherIndexPage();
    } else if (pageNumber >= 421 && pageNumber <= 449) {
      return this.getWeatherDetailPage(pageId);
    }

    throw new Error(`Invalid weather page: ${pageId}`);
  }

  private async getWeatherIndexPage(): Promise<TeletextPage> {
    const rows = [
      'WEATHER                      P420',
      '════════════════════════════════════',
      '',
      'UK WEATHER',
      '  421 - London',
      '  422 - Manchester',
      '  423 - Birmingham',
      '  424 - Edinburgh',
      '',
      'FORECASTS',
      '  430 - 5-Day Forecast',
      '  431 - Weekend Forecast',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'INDEX   LONDON  FORECAST',
      ''
    ];

    return {
      id: '420',
      title: 'Weather',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'LONDON', targetPage: '421', color: 'green' },
        { label: 'FORECAST', targetPage: '430', color: 'yellow' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private async getWeatherDetailPage(pageId: string): Promise<TeletextPage> {
    const rows = [
      `WEATHER                      P${pageId}`,
      '════════════════════════════════════',
      '',
      'Weather data coming soon...',
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
      'INDEX   BACK',
      ''
    ];

    return {
      id: pageId,
      title: 'Weather',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'BACK', targetPage: '420', color: 'green' }
      ],
      meta: {
        source: 'WeatherAdapter',
        lastUpdated: new Date().toISOString()
      }
    };
  }

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
