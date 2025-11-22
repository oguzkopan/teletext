// Sports adapter for pages 300-399
// Integrates with sports API to provide live scores and league tables

import axios from 'axios';
import { ContentAdapter, TeletextPage } from '../types';
import { getApiKey } from '../utils/config';
import {
  getMatchStatusInfo,
  formatScoreLine,
  createLiveIndicator,
  getLiveIndicatorClass,
  getScoreFlashClass,
  getFullTimeAnimationClass,
  ScoreChangeTracker
} from '../../../lib/sports-live-indicators';
import {
  applyAdapterLayout,
  createSimpleHeader,
  createSeparator,
  truncateText,
  padRows
} from '../utils/adapter-layout-helper';

/**
 * SportsAdapter serves sports pages (300-399)
 * Integrates with API-Football or similar service for live scores and tables
 */
export class SportsAdapter implements ContentAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://v3.football.api-sports.io';
  private scoreTracker: ScoreChangeTracker;

  constructor() {
    // Get API key from environment variable or Firebase config
    this.apiKey = getApiKey('SPORTS_API_KEY', 'sports.api_key');
    this.scoreTracker = new ScoreChangeTracker();
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
   * Creates the sports index page (300)
   * Classic teletext style with league table
   */
  private async getSportsIndex(): Promise<TeletextPage> {
    // Create standardized header
    const rows = [
      createSimpleHeader('SPORT INDEX', '300'),
      createSeparator(),
      '',
      '━━━━━━ PREMIER LEAGUE ━━━━━━━━━━━━━',
      '   Team            P  W  D  L  F  A Pts',
      ' 1 Liverpool      15 11  3  1 36 16 36',
      ' 2 Arsenal        15 10  4  1 33 14 34',
      ' 3 Man City       15 10  3  2 35 18 33',
      ' 4 Chelsea        15  9  4  2 35 19 31',
      ' 5 Aston Villa   15  9  3  3 32 23 30',
      ' 6 Tottenham      15  8  2  5 35 21 26',
      ' 7 Newcastle      15  7  4  4 31 21 25',
      ' 8 Man United     15  7  3  5 22 20 24',
      ' 9 Brighton       15  6  5  4 28 24 23',
      '10 West Ham       15  6  4  5 26 28 22',
      '',
      '301 Live Scores  302 Full Table',
      '310 My Teams     320 Fixtures',
      '',
      '',
      '════════════════════════════════════',
      '100=INDEX  LIVE   TABLES  FIXTURES'
    ];

    return {
      id: '300',
      title: 'Sport Index',
      rows: this.padRows(rows),
      links: [
        { label: '100=INDEX', targetPage: '100', color: 'red' },
        { label: 'LIVE', targetPage: '301', color: 'green' },
        { label: 'TABLES', targetPage: '302', color: 'yellow' },
        { label: 'FIXTURES', targetPage: '320', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        contentType: 'SPORT',
        liveIndicator: true,
        classicTeletextStyle: true
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
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
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
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'CONFIG', targetPage: '310', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
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
   * Formats live scores into a teletext page with animations
   * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5
   * Uses layout manager with live indicators
   */
  private formatLiveScoresPage(fixtures: any[]): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const contentRows = [
      createSimpleHeader('LIVE SCORES', '301'),
      createSeparator(),
      `Updated: ${timeStr}`,
      ''
    ];

    // Track if we have any live matches for the indicator
    const hasLiveMatches = fixtures.some(f => {
      const statusInfo = getMatchStatusInfo(
        f.fixture?.status?.short || '',
        f.fixture?.status?.elapsed
      );
      return statusInfo.isLive;
    });

    if (fixtures.length === 0) {
      contentRows.push('');
      contentRows.push('No live matches at this time.');
      contentRows.push('');
      contentRows.push('Check back later for live scores.');
    } else {
      // Add live indicator if there are live matches
      // Requirements: 22.1 - Pulsing LIVE indicator
      if (hasLiveMatches) {
        contentRows.push(createLiveIndicator() + ' MATCHES IN PROGRESS');
        contentRows.push('');
      }

      // Display up to 8 fixtures with enhanced formatting
      fixtures.slice(0, 8).forEach((fixture, index) => {
        const homeTeam = fixture.teams?.home?.name || 'HOME';
        const awayTeam = fixture.teams?.away?.name || 'AWAY';
        const homeScore = fixture.goals?.home ?? 0;
        const awayScore = fixture.goals?.away ?? 0;
        const statusShort = fixture.fixture?.status?.short || '';
        const elapsed = fixture.fixture?.status?.elapsed;
        
        // Get match status info with color coding
        // Requirements: 22.4 - Color coding for match status
        const statusInfo = getMatchStatusInfo(statusShort, elapsed);
        
        // Check for score changes (for animation tracking)
        // Requirements: 22.2 - Score change flash animation
        const matchId = fixture.fixture?.id?.toString() || `match-${index}`;
        const scoreChange = this.scoreTracker.checkScoreChange(matchId, homeScore, awayScore);
        
        // Format score line with proper spacing and status
        // Requirements: 22.3 - Animated time indicators
        const scoreLine = formatScoreLine(
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          statusInfo,
          {
            homeTeamWidth: 12,
            awayTeamWidth: 12,
            includeTimeIndicator: true
          }
        );
        
        // Add status indicator prefix for live/finished matches
        let prefix = '';
        if (statusInfo.isLive) {
          prefix = '● '; // Live indicator
        } else if (statusInfo.status === 'FT') {
          prefix = '✓ '; // Finished indicator
        } else if (statusInfo.status === 'HT') {
          prefix = '◐ '; // Half-time indicator
        }
        
        contentRows.push(prefix + scoreLine);
        
        // Add metadata for animations (stored in page meta)
        if (scoreChange) {
          contentRows.push(`[SCORE_FLASH:${matchId}]`);
        }
        if (statusInfo.isLive) {
          contentRows.push(`[LIVE_PULSE:${matchId}]`);
        }
        if (statusInfo.status === 'FT' && elapsed && elapsed >= 90) {
          contentRows.push(`[FULL_TIME:${matchId}]`);
        }
        
        contentRows.push('');
      });
    }

    // Add footer
    while (contentRows.length < 22) {
      contentRows.push('');
    }
    contentRows.push(createSeparator('─'));
    contentRows.push('INDEX   TABLES  REFRESH BACK');

    return applyAdapterLayout({
      pageId: '301',
      title: 'Live Scores',
      contentRows,
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'TABLES', targetPage: '302', color: 'green' },
        { label: 'REFRESH', targetPage: '301', color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        contentType: 'SPORT',
        hasLiveMatches,
        animationClasses: {
          liveIndicator: getLiveIndicatorClass(),
          scoreFlash: getScoreFlashClass(),
          fullTime: getFullTimeAnimationClass()
        }
      },
      showTimestamp: true
    });
  }

  /**
   * Formats league standings into a teletext page
   */
  private formatLeagueTablesPage(standings: any[]): TeletextPage {
    const rows = [
      createSimpleHeader('LEAGUE TABLES', '302'),
      createSeparator(),
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
        rows.push(truncateText(line, 40));
      });
    }

    return {
      id: '302',
      title: 'League Tables',
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '300', color: 'red' },
        { label: 'LIVE', targetPage: '301', color: 'green' },
        { label: 'REFRESH', targetPage: '302', color: 'yellow' },
        { label: 'BACK', targetPage: '100', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Truncates team name to fit within character limit
   * @deprecated Use truncateTeamName from sports-live-indicators instead
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
      `${truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
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
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
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
      rows: padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 60) {
        return row.substring(0, 60);
      }
      return row.padEnd(60, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(60, ' '));
    }

    return paddedRows.slice(0, 24);
  }

}
