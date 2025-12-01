// Sports adapter for pages 300-399
// Fetches sports data from API-Football

import { TeletextPage } from '@/types/teletext';

interface FootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  league: {
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface FootballAPIResponse {
  response: FootballFixture[];
}

export class SportsAdapter {
  private apiKey: string;
  private apiUrl: string = 'https://v3.football.api-sports.io';

  constructor() {
    this.apiKey = process.env.SPORTS_API_KEY || '';
  }

  async getPage(pageId: string): Promise<TeletextPage> {
    // Check for article detail pages FIRST (before parsing as integer)
    if (pageId.includes('-')) {
      // Article detail pages like 300-1, 301-2, etc.
      return this.getSportsArticleDetailPage(pageId);
    }

    // Now parse as integer for main pages
    const pageNumber = parseInt(pageId, 10);

    if (pageNumber === 300) {
      return this.getSportsIndexPage();
    } else if (pageNumber === 301) {
      return this.getFootballLiveScoresPage();
    } else if (pageNumber === 302) {
      return this.getPremierLeagueTablePage();
    } else if (pageNumber === 303) {
      return this.getFootballFixturesPage();
    } else if (pageNumber === 304) {
      return this.getLiveScoresAllSportsPage();
    } else if (pageNumber >= 305 && pageNumber <= 309) {
      return this.getSportsCategoryPage(pageId);
    }

    throw new Error(`Invalid sports page: ${pageId}`);
  }

  private async getSportsIndexPage(): Promise<TeletextPage> {
    try {
      // Fetch live matches to show on index
      const response = await fetch(
        `${this.apiUrl}/fixtures?live=all`,
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          next: { revalidate: 60 } // Cache for 1 minute
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch live scores');
      }

      const data: FootballAPIResponse = await response.json();
      const liveMatches = data.response || [];

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      });
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      const rows = [
        `{cyan}300 {yellow}⚽ SPORT HEADLINES & LIVE SCORES ⚽ {cyan}${dateStr} ${timeStr}                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
        '{yellow}║  {red}LIVE SPORT{yellow}  {white}░▒▓█▓▒░  {cyan}Latest Scores & Results  {white}░▒▓█▓▒░  {yellow}Live from API-Football{yellow}                                              ║',
        '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{cyan}▓▓▓ LIVE MATCHES ▓▓▓',
        ...this.formatLiveMatches(liveMatches.slice(0, 5)),
        '',
        '{cyan}▓▓▓ SPORT CATEGORIES ▓▓▓',
        '{green}301{white} Football Live Scores                 {green}302{white} Premier League Table                 {green}303{white} Football Fixtures',
        '{green}304{white} Live Scores All Sports               {green}305{white} Rugby Union & League                 {green}306{white} Golf Championships',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-5{white} for matches • {red}RED{white}=INDEX {green}GREEN{white}=LIVE {yellow}YELLOW{white}=TABLE {blue}BLUE{white}=FIXTURES',
        ''
      ];

      return {
        id: '300',
        title: 'Sport Headlines',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'LIVE', targetPage: '301', color: 'green' },
          { label: 'TABLE', targetPage: '302', color: 'yellow' },
          { label: 'FIXTURES', targetPage: '303', color: 'blue' },
          ...liveMatches.slice(0, 5).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `300-${index + 1}`
          }))
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5']
        }
      };
    } catch (error) {
      console.error('Error fetching sports index:', error);
      return this.getErrorPage('300', 'Sport Headlines');
    }
  }

  private async getFootballLiveScoresPage(): Promise<TeletextPage> {
    try {
      const response = await fetch(
        `${this.apiUrl}/fixtures?live=all`,
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          next: { revalidate: 60 }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch live scores');
      }

      const data: FootballAPIResponse = await response.json();
      const liveMatches = data.response || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}301 {yellow}Football Live Scores {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Live football scores from API-Football                                                                                  ',
        '{white}All live matches currently in progress',
        '',
        ...this.formatLiveMatchesList(liveMatches.slice(0, 8)),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-8{white} for match details • {red}RED{white}=INDEX {green}GREEN{white}=SPORT {yellow}YELLOW{white}=TABLE {blue}BLUE{white}=FIXTURES',
        ''
      ];

      return {
        id: '301',
        title: 'Football Live Scores',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'TABLE', targetPage: '302', color: 'yellow' },
          { label: 'FIXTURES', targetPage: '303', color: 'blue' },
          ...liveMatches.slice(0, 8).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `301-${index + 1}`
          }))
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      };
    } catch (error) {
      console.error('Error fetching live scores:', error);
      return this.getErrorPage('301', 'Football Live Scores');
    }
  }

  private async getPremierLeagueTablePage(): Promise<TeletextPage> {
    try {
      // Premier League ID is 39, use current year
      const currentYear = new Date().getFullYear();
      const response = await fetch(
        `${this.apiUrl}/standings?league=39&season=${currentYear}`,
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch league table');
      }

      const data = await response.json();
      const standings = data.response?.[0]?.league?.standings?.[0] || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}302 {yellow}Premier League Table {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Premier League standings from API-Football                                                                              ',
        '{white}Season 2024/25 - Current standings',
        '',
        '{cyan}Pos  Team                           Pld  Pts  GD',
        '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
        ...this.formatLeagueTable(standings.slice(0, 10)),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=SPORT {yellow}YELLOW{white}=LIVE {blue}BLUE{white}=FIXTURES',
        ''
      ];

      return {
        id: '302',
        title: 'Premier League Table',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'LIVE', targetPage: '301', color: 'yellow' },
          { label: 'FIXTURES', targetPage: '303', color: 'blue' }
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching league table:', error);
      return this.getErrorPage('302', 'Premier League Table');
    }
  }

  private async getFootballFixturesPage(): Promise<TeletextPage> {
    try {
      // Get today's fixtures
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${this.apiUrl}/fixtures?date=${today}`,
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fixtures');
      }

      const data: FootballAPIResponse = await response.json();
      const fixtures = data.response || [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const rows = [
        `{cyan}303 {yellow}Football Fixtures {cyan}${timeStr}                                                                                                                     {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        '{white}Updated: {green}' + timeStr + ' {white}• Today\'s football fixtures from API-Football                                                                            ',
        `{white}Fixtures for ${today}`,
        '',
        ...this.formatFixturesList(fixtures.slice(0, 8)),
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '{cyan}NAVIGATION: Press {yellow}1-8{white} for match details • {red}RED{white}=INDEX {green}GREEN{white}=SPORT {yellow}YELLOW{white}=LIVE {blue}BLUE{white}=TABLE',
        ''
      ];

      return {
        id: '303',
        title: 'Football Fixtures',
        rows,
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'SPORT', targetPage: '300', color: 'green' },
          { label: 'LIVE', targetPage: '301', color: 'yellow' },
          { label: 'TABLE', targetPage: '302', color: 'blue' },
          ...fixtures.slice(0, 8).map((_, index) => ({
            label: (index + 1).toString(),
            targetPage: `303-${index + 1}`
          }))
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true,
          inputMode: 'single',
          inputOptions: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      };
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      return this.getErrorPage('303', 'Football Fixtures');
    }
  }

  private async getLiveScoresAllSportsPage(): Promise<TeletextPage> {
    // For now, show football live scores (can be extended to other sports)
    return this.getFootballLiveScoresPage();
  }

  private async getSportsCategoryPage(pageId: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit'
    });

    const categories: Record<string, string> = {
      '305': 'Rugby Union & League',
      '306': 'Golf Championships',
      '307': 'Tennis Tournaments',
      '308': 'Cricket Scores',
      '309': 'Motor Racing'
    };

    const title = categories[pageId] || 'Sport Category';

    const rows = [
      `{cyan}${pageId} {yellow}${title} {cyan}${timeStr}                                                                                                                     {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{yellow}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{yellow}║  {white}COMING SOON{yellow}  {white}░▒▓█▓▒░  {cyan}This sport category is under development  {white}░▒▓█▓▒░{yellow}                                                  ║',
      '{yellow}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      `{white}${title} content will be available soon.`,
      '',
      '{white}In the meantime, check out our football coverage:',
      '',
      '{green}301{white} - Football Live Scores',
      '{green}302{white} - Premier League Table',
      '{green}303{white} - Football Fixtures',
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
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=SPORT {yellow}YELLOW{white}=LIVE {blue}BLUE{white}=TABLE',
      ''
    ];

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' },
        { label: 'LIVE', targetPage: '301', color: 'yellow' },
        { label: 'TABLE', targetPage: '302', color: 'blue' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private async getSportsArticleDetailPage(pageId: string): Promise<TeletextPage> {
    const [parentPage, articleNumStr] = pageId.split('-');
    const articleNum = parseInt(articleNumStr, 10) - 1;

    try {
      let endpoint = '';
      
      if (parentPage === '300' || parentPage === '301') {
        endpoint = `${this.apiUrl}/fixtures?live=all`;
      } else if (parentPage === '303') {
        const today = new Date().toISOString().split('T')[0];
        endpoint = `${this.apiUrl}/fixtures?date=${today}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch match details');
      }

      const data: FootballAPIResponse = await response.json();
      const matches = data.response || [];
      const match = matches[articleNum];

      if (!match) {
        return this.getErrorPage(pageId, 'Match Not Found');
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });

      const matchTitle = `${match.teams.home.name} vs ${match.teams.away.name}`;
      const score = match.goals.home !== null && match.goals.away !== null
        ? `${match.goals.home} - ${match.goals.away}`
        : 'vs';

      const rows = [
        `{cyan}${pageId} {yellow}${this.truncateText(matchTitle, 60)} {cyan}${timeStr}                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        '',
        `{white}${match.league.name} - ${match.league.country}`,
        '',
        `{cyan}${match.fixture.status.long}`,
        '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
        '',
        `{yellow}${match.teams.home.name}`,
        `{white}${match.goals.home !== null ? match.goals.home : '-'}`,
        '',
        `{yellow}${match.teams.away.name}`,
        `{white}${match.goals.away !== null ? match.goals.away : '-'}`,
        '',
        '{blue}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
        '',
        match.score.halftime.home !== null
          ? `{white}Half Time: ${match.score.halftime.home} - ${match.score.halftime.away}`
          : '{white}Match not started',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
        `{cyan}NAVIGATION: {red}BACK{white}=Return to ${parentPage} {green}INDEX{white}=Main Index {yellow}PREV{white}=Previous {blue}NEXT{white}=Next Match`,
        ''
      ];

      return {
        id: pageId,
        title: this.truncateText(matchTitle, 30),
        rows,
        links: [
          { label: 'BACK', targetPage: parentPage, color: 'red' },
          { label: 'INDEX', targetPage: '100', color: 'green' },
          { label: 'PREV', targetPage: articleNum > 0 ? `${parentPage}-${articleNum}` : parentPage, color: 'yellow' },
          { label: 'NEXT', targetPage: `${parentPage}-${articleNum + 2}`, color: 'blue' }
        ],
        meta: {
          source: 'SportsAdapter',
          lastUpdated: new Date().toISOString(),
          fullScreenLayout: true,
          useLayoutManager: true,
          renderedWithLayoutEngine: true
        }
      };
    } catch (error) {
      console.error('Error fetching match details:', error);
      return this.getErrorPage(pageId, 'Match Details');
    }
  }

  private formatLiveMatches(matches: FootballFixture[]): string[] {
    const lines: string[] = [];
    
    if (matches.length === 0) {
      lines.push('{white}No live matches at the moment');
      lines.push('');
      return lines;
    }

    matches.forEach((match, index) => {
      const score = match.goals.home !== null && match.goals.away !== null
        ? `${match.goals.home}-${match.goals.away}`
        : 'vs';
      
      lines.push(`{red}🔴 LIVE:{white} ${this.truncateText(match.teams.home.name, 25)} ${score} ${this.truncateText(match.teams.away.name, 25)}`);
      lines.push(`{white}   {cyan}${match.league.name} • ${match.fixture.status.long}`);
      if (index < matches.length - 1) lines.push('');
    });
    
    return lines;
  }

  private formatLiveMatchesList(matches: FootballFixture[]): string[] {
    const lines: string[] = [];
    
    if (matches.length === 0) {
      lines.push('{white}No live matches at the moment');
      lines.push('{white}Check back soon for live scores!');
      return lines;
    }

    matches.forEach((match, index) => {
      const score = match.goals.home !== null && match.goals.away !== null
        ? `${match.goals.home}-${match.goals.away}`
        : 'vs';
      
      lines.push(`{yellow}${index + 1}. {white}${this.truncateText(match.teams.home.name, 20)} ${score} ${this.truncateText(match.teams.away.name, 20)}`);
      lines.push(`{white}   {cyan}${this.truncateText(match.league.name, 30)} • ${match.fixture.status.short}`);
      if (index < matches.length - 1) lines.push('');
    });
    
    return lines;
  }

  private formatFixturesList(fixtures: FootballFixture[]): string[] {
    const lines: string[] = [];
    
    if (fixtures.length === 0) {
      lines.push('{white}No fixtures scheduled for today');
      return lines;
    }

    fixtures.forEach((fixture, index) => {
      const matchTime = new Date(fixture.fixture.date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      lines.push(`{yellow}${index + 1}. {white}${matchTime} - ${this.truncateText(fixture.teams.home.name, 20)} vs ${this.truncateText(fixture.teams.away.name, 20)}`);
      lines.push(`{white}   {cyan}${this.truncateText(fixture.league.name, 40)}`);
      if (index < fixtures.length - 1) lines.push('');
    });
    
    return lines;
  }

  private formatLeagueTable(standings: any[]): string[] {
    const lines: string[] = [];
    
    standings.forEach((team) => {
      const pos = team.rank.toString().padStart(2, ' ');
      const name = this.truncateText(team.team.name, 25).padEnd(25, ' ');
      const played = team.all.played.toString().padStart(3, ' ');
      const points = team.points.toString().padStart(3, ' ');
      const gd = team.goalsDiff >= 0 
        ? `+${team.goalsDiff}`.padStart(4, ' ')
        : team.goalsDiff.toString().padStart(4, ' ');
      
      lines.push(`{white}${pos}   ${name}  ${played}  ${points}  ${gd}`);
    });
    
    return lines;
  }

  private getErrorPage(pageId: string, title: string): TeletextPage {
    const rows = [
      `{cyan}${pageId} {yellow}${title} {cyan}ERROR                                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{red}SERVICE UNAVAILABLE',
      '',
      '{white}Unable to load sports data at this time.',
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
      '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=SPORT',
      ''
    ];

    return {
      id: pageId,
      title,
      rows,
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'SPORT', targetPage: '300', color: 'green' }
      ],
      meta: {
        source: 'SportsAdapter',
        lastUpdated: new Date().toISOString(),
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }
}
