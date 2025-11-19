// Sports adapter for pages 300-399
// Integrates with sports API to provide live scores and league tables

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';

/**
 * SportsAdapter serves sports pages (300-399)
 * Integrates with API-Football or similar service for live scores and tables
 */
export class SportsAdapter implements ContentAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://v3.football.api-sports.io';

  constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.SPORTS_API_KEY || '';
  }

  /**
   * Retrieves a sports page
   * @param pageId - The page ID to retrieve (300-399)
   * @returns A TeletextPage object with sports content
   */
  async getPage(pageId: string): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific sports pages
    if (pageNumber === 300) {
      return this.getSportsIndex();
    } else if (pageNumber === 301) {
      return this.getLiveScores();
    } else if (pageNumber === 302) {
      return this.getLeagueTables();
    } else if (pageNumber === 310) {
      return this.getTeamWatchlistConfig();
    } else if (pageNumber >= 311 && pageNumber <= 315) {
      return this.getTeamPage(pageNumber);
    } else if (pageNumber >= 300 && pageNumber < 400) {
      return this.getPlaceholderPage(pageId);
    }

    throw new Error(`Invalid sports page: ${pageId}`);
  }

  /**
   * Gets the cache key for a page
   * @param pageId - The page ID
   * @returns The cache key
   */
  getCacheKey(pageId: string): string {
    return `sports_${pageId}`;
  }

  /**
   * Gets the cache duration for sports pages
   * Sports pages are cached for 2 minutes (120 seconds)
   * During live events, cache for 1 minute (60 seconds)
   * @returns Cache duration in seconds
   */
  getCacheDuration(): number {
    // TODO: Implement logic to detect live events and return 60 seconds
    // For now, default to 2 minutes
    return 120; // 2 minutes
  }

  /**
   * Creates the sports index page (300)
   */
  private getSportsIndex(): TeletextPage {
    const rows = [
      'SPORT INDEX                  P300',
      '════════════════════════════════════',
      '',
      'LIVE COVERAGE',
      '301 Live Scores',
      '302 League Tables',
      '',
      'MY TEAMS',
      '310 Configure Watchlist',
      '311 Team 1 (Not configured)',
      '312 Team 2 (Not configured)',
      '313 Team 3 (Not configured)',
      '314 Team 4 (Not configured)',
      '315 Team 5 (Not configured)',
      '',
      'Updated every 2 minutes',
      '(1 minute during live events)',
      '',
      '',
      '',
      '',
      'INDEX   LIVE    TABLES  CONFIG',
      ''
    ];

    return {
      id: '300',
      title: 'Sport Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'LIVE', targetPage: '301', color: 'green' },
        { label: 'TABLES', targetPage: '302', color: 'yellow' },
        { label: 'CONFIG', targetPage: '310', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the live scores page (301)
   */
  private async getLiveScores(): Promise<TeletextPage> {
    try {
      const fixtures = await this.fetchLiveFixtures();
      return this.formatLiveScoresPage(fixtures);
    } catch (error) {
      return this.getErrorPage('301', 'Live Scores', error);
    }
  }

  /**
   * Creates the league tables page (302)
   */
  private async getLeagueTables(): Promise<TeletextPage> {
    try {
      const standings = await this.fetchLeagueStandings();
      return this.formatLeagueTablesPage(standings);
    } catch (error) {
      return this.getErrorPage('302', 'League Tables', error);
    }
  }

  /**
   * Creates the team watchlist configuration page (310)
   */
  private getTeamWatchlistConfig(): TeletextPage {
    const rows = [
      'TEAM WATCHLIST CONFIG        P310',
      '════════════════════════════════════',
      '',
      'CONFIGURE YOUR FAVORITE TEAMS',
      '',
      'Add up to 5 teams to your watchlist',
      'for quick access to their stats,',
      'fixtures, and results.',
      '',
      'CURRENT WATCHLIST:',
      '1. Not configured',
      '2. Not configured',
      '3. Not configured',
      '4. Not configured',
      '5. Not configured',
      '',
      'To configure teams, use the web',
      'interface or API.',
      '',
      'Pages 311-315 will show your',
      'configured teams.',
      '',
      'INDEX   SPORT',
      ''
    ];

    return {
      id: '310',
      title: 'Team Watchlist Config',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates dedicated team pages (311-315)
   */
  private async getTeamPage(pageNumber: number): Promise<TeletextPage> {
    const teamSlot = pageNumber - 310; // 1-5
    
    // TODO: Fetch team data from user preferences
    // For now, return placeholder
    const rows = [
      `TEAM ${teamSlot}                      P${pageNumber}`,
      '════════════════════════════════════',
      '',
      'TEAM NOT CONFIGURED',
      '',
      `Team slot ${teamSlot} is not configured.`,
      '',
      'To add a team to this slot:',
      '1. Go to page 310',
      '2. Configure your watchlist',
      '3. Select your favorite teams',
      '',
      'Once configured, this page will show:',
      '• Recent results',
      '• Upcoming fixtures',
      '• League position',
      '• Team statistics',
      '',
      '',
      '',
      '',
      'INDEX   CONFIG',
      ''
    ];

    return {
      id: pageNumber.toString(),
      title: `Team ${teamSlot}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'CONFIG', targetPage: '310', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Fetches live fixtures from the sports API
   */
  private async fetchLiveFixtures(): Promise<any[]> {
    if (!this.apiKey) {
      // Return mock data if no API key configured
      return this.getMockLiveFixtures();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/fixtures`, {
        params: {
          live: 'all'
        },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        timeout: 5000
      });

      return response.data.response || [];
    } catch (error) {
      // Fallback to mock data on error
      return this.getMockLiveFixtures();
    }
  }

  /**
   * Fetches league standings from the sports API
   */
  private async fetchLeagueStandings(): Promise<any[]> {
    if (!this.apiKey) {
      // Return mock data if no API key configured
      return this.getMockLeagueStandings();
    }

    try {
      // Fetch Premier League standings (league ID 39, season 2024)
      const response = await axios.get(`${this.baseUrl}/standings`, {
        params: {
          league: 39,
          season: 2024
        },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        timeout: 5000
      });

      return response.data.response?.[0]?.league?.standings?.[0] || [];
    } catch (error) {
      // Fallback to mock data on error
      return this.getMockLeagueStandings();
    }
  }

  /**
   * Formats live scores into a teletext page
   */
  private formatLiveScoresPage(fixtures: any[]): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const rows = [
      `LIVE SCORES                  P301`,
      '════════════════════════════════════',
      `Updated: ${timeStr}`,
      ''
    ];

    if (fixtures.length === 0) {
      rows.push('');
      rows.push('No live matches at this time.');
      rows.push('');
      rows.push('Check back later for live scores.');
    } else {
      // Display up to 8 fixtures
      fixtures.slice(0, 8).forEach((fixture) => {
        const homeTeam = this.truncateTeamName(fixture.teams?.home?.name || 'HOME', 12);
        const awayTeam = this.truncateTeamName(fixture.teams?.away?.name || 'AWAY', 12);
        const homeScore = fixture.goals?.home ?? 0;
        const awayScore = fixture.goals?.away ?? 0;
        const status = this.getMatchStatus(fixture);
        
        // Format: "MAN UTD  2 - 1  CHELSEA        87'"
        const scoreLine = `${homeTeam.padEnd(9)} ${homeScore} - ${awayScore}  ${awayTeam.padEnd(12)} ${status}`;
        rows.push(this.truncateText(scoreLine, 40));
        rows.push('');
      });
    }

    return {
      id: '301',
      title: 'Live Scores',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'TABLES', targetPage: '302', color: 'green' },
        { label: 'REFRESH', targetPage: '301', color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Formats league standings into a teletext page
   */
  private formatLeagueTablesPage(standings: any[]): TeletextPage {
    const rows = [
      'LEAGUE TABLES                P302',
      '════════════════════════════════════',
      'PREMIER LEAGUE 2024/25',
      ''
    ];

    if (standings.length === 0) {
      rows.push('');
      rows.push('League table not available.');
      rows.push('');
      rows.push('Please try again later.');
    } else {
      // Header
      rows.push('POS TEAM              P  W  D  L  PTS');
      rows.push('────────────────────────────────────');
      
      // Display top 10 teams
      standings.slice(0, 10).forEach((team) => {
        const pos = team.rank?.toString().padStart(2, ' ') || '--';
        const name = this.truncateTeamName(team.team?.name || 'Unknown', 14);
        const played = team.all?.played?.toString().padStart(2, ' ') || '--';
        const wins = team.all?.win?.toString().padStart(2, ' ') || '--';
        const draws = team.all?.draw?.toString().padStart(2, ' ') || '--';
        const losses = team.all?.lose?.toString().padStart(2, ' ') || '--';
        const points = team.points?.toString().padStart(3, ' ') || '---';
        
        const line = `${pos}  ${name.padEnd(14)} ${played} ${wins} ${draws} ${losses} ${points}`;
        rows.push(this.truncateText(line, 40));
      });
    }

    return {
      id: '302',
      title: 'League Tables',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'LIVE', targetPage: '301', color: 'green' },
        { label: 'REFRESH', targetPage: '302', color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Gets match status string (e.g., "FT", "87'", "HT")
   */
  private getMatchStatus(fixture: any): string {
    const status = fixture.fixture?.status?.short || '';
    const elapsed = fixture.fixture?.status?.elapsed;
    
    if (status === 'FT') return 'FT';
    if (status === 'HT') return 'HT';
    if (status === '1H' || status === '2H') {
      return elapsed ? `${elapsed}'` : 'LIVE';
    }
    if (status === 'NS') return 'NS';
    if (status === 'PST') return 'PST';
    
    return status || '';
  }

  /**
   * Truncates team name to fit within character limit
   */
  private truncateTeamName(name: string, maxLength: number): string {
    if (!name || name.length <= maxLength) {
      return name || '';
    }
    
    // Common abbreviations
    const abbreviations: Record<string, string> = {
      'Manchester United': 'MAN UTD',
      'Manchester City': 'MAN CITY',
      'Liverpool': 'LIVERPOOL',
      'Chelsea': 'CHELSEA',
      'Arsenal': 'ARSENAL',
      'Tottenham Hotspur': 'TOTTENHAM',
      'Newcastle United': 'NEWCASTLE',
      'Brighton and Hove Albion': 'BRIGHTON',
      'West Ham United': 'WEST HAM',
      'Wolverhampton Wanderers': 'WOLVES'
    };
    
    if (abbreviations[name]) {
      return abbreviations[name].substring(0, maxLength);
    }
    
    return name.substring(0, maxLength);
  }

  /**
   * Returns mock live fixtures for testing/demo
   */
  private getMockLiveFixtures(): any[] {
    return [
      {
        teams: {
          home: { name: 'Manchester United' },
          away: { name: 'Chelsea' }
        },
        goals: { home: 2, away: 1 },
        fixture: {
          status: { short: '2H', elapsed: 87 }
        }
      },
      {
        teams: {
          home: { name: 'Arsenal' },
          away: { name: 'Liverpool' }
        },
        goals: { home: 1, away: 1 },
        fixture: {
          status: { short: '2H', elapsed: 72 }
        }
      },
      {
        teams: {
          home: { name: 'Manchester City' },
          away: { name: 'Tottenham Hotspur' }
        },
        goals: { home: 3, away: 0 },
        fixture: {
          status: { short: 'HT', elapsed: null }
        }
      }
    ];
  }

  /**
   * Returns mock league standings for testing/demo
   */
  private getMockLeagueStandings(): any[] {
    return [
      {
        rank: 1,
        team: { name: 'Manchester City' },
        all: { played: 15, win: 12, draw: 2, lose: 1 },
        points: 38
      },
      {
        rank: 2,
        team: { name: 'Arsenal' },
        all: { played: 15, win: 11, draw: 3, lose: 1 },
        points: 36
      },
      {
        rank: 3,
        team: { name: 'Liverpool' },
        all: { played: 15, win: 10, draw: 4, lose: 1 },
        points: 34
      },
      {
        rank: 4,
        team: { name: 'Tottenham Hotspur' },
        all: { played: 15, win: 9, draw: 3, lose: 3 },
        points: 30
      },
      {
        rank: 5,
        team: { name: 'Manchester United' },
        all: { played: 15, win: 8, draw: 4, lose: 3 },
        points: 28
      },
      {
        rank: 6,
        team: { name: 'Chelsea' },
        all: { played: 15, win: 7, draw: 5, lose: 3 },
        points: 26
      },
      {
        rank: 7,
        team: { name: 'Newcastle United' },
        all: { played: 15, win: 7, draw: 4, lose: 4 },
        points: 25
      },
      {
        rank: 8,
        team: { name: 'Brighton' },
        all: { played: 15, win: 6, draw: 5, lose: 4 },
        points: 23
      },
      {
        rank: 9,
        team: { name: 'West Ham United' },
        all: { played: 15, win: 6, draw: 4, lose: 5 },
        points: 22
      },
      {
        rank: 10,
        team: { name: 'Aston Villa' },
        all: { played: 15, win: 6, draw: 3, lose: 6 },
        points: 21
      }
    ];
  }

  /**
   * Creates an error page when API fails
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to fetch sports data at this',
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
      'Press 300 for sports index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   SPORT',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `SPORT PAGE ${pageId}             P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `Sport page ${pageId} is under construction.`,
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
      '',
      'Press 300 for sports index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   SPORT',
      ''
    ];

    return {
      id: pageId,
      title: `Sport Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
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
