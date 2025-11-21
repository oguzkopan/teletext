/**
 * Sports Live Indicators and Animations
 * 
 * Provides utilities for displaying live match indicators, score animations,
 * and match status visualizations for sports pages.
 * 
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5
 */

// ============================================================================
// Type Definitions
// ============================================================================

export type MatchStatus = 'LIVE' | '1H' | '2H' | 'HT' | 'FT' | 'NS' | 'PST' | 'CANCELLED';

export interface MatchStatusInfo {
  status: MatchStatus;
  elapsed?: number;  // Minutes elapsed
  color: 'green' | 'yellow' | 'white' | 'red';
  displayText: string;
  isLive: boolean;
}

export interface ScoreChangeAnimation {
  homeScoreChanged: boolean;
  awayScoreChanged: boolean;
  timestamp: number;
}

// ============================================================================
// Match Status Functions
// ============================================================================

/**
 * Get match status information with color coding
 * 
 * Color coding:
 * - green: Live matches (1H, 2H)
 * - yellow: Half-time
 * - white: Finished matches
 * - red: Postponed/Cancelled
 */
export function getMatchStatusInfo(
  statusShort: string,
  elapsed?: number
): MatchStatusInfo {
  const status = statusShort.toUpperCase() as MatchStatus;

  switch (status) {
    case 'LIVE':
    case '1H':
    case '2H':
      return {
        status: 'LIVE',
        elapsed,
        color: 'green',
        displayText: elapsed ? `${elapsed}'` : 'LIVE',
        isLive: true
      };

    case 'HT':
      return {
        status: 'HT',
        color: 'yellow',
        displayText: 'HT',
        isLive: false
      };

    case 'FT':
      return {
        status: 'FT',
        color: 'white',
        displayText: 'FT',
        isLive: false
      };

    case 'PST':
      return {
        status: 'PST',
        color: 'red',
        displayText: 'PST',
        isLive: false
      };

    case 'CANCELLED':
      return {
        status: 'CANCELLED',
        color: 'red',
        displayText: 'CANC',
        isLive: false
      };

    case 'NS':
    default:
      return {
        status: 'NS',
        color: 'white',
        displayText: 'NS',
        isLive: false
      };
  }
}

/**
 * Format match time with animated indicator for live matches
 * Adds soccer ball emoji for live matches
 */
export function formatMatchTime(statusInfo: MatchStatusInfo): string {
  if (statusInfo.isLive && statusInfo.elapsed) {
    return `${statusInfo.elapsed}' ⚽`;
  }
  return statusInfo.displayText;
}

/**
 * Create pulsing LIVE indicator text
 * Returns the text with appropriate spacing for animation
 */
export function createLiveIndicator(): string {
  return '● LIVE';
}

/**
 * Create FULL TIME animation text
 */
export function createFullTimeIndicator(): string {
  return '✓ FULL TIME';
}

// ============================================================================
// Score Formatting Functions
// ============================================================================

/**
 * Format score line with team names and scores
 * Includes proper spacing and truncation for 40-character width
 */
export function formatScoreLine(
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  statusInfo: MatchStatusInfo,
  options?: {
    homeTeamWidth?: number;
    awayTeamWidth?: number;
    includeTimeIndicator?: boolean;
  }
): string {
  const homeTeamWidth = options?.homeTeamWidth || 12;
  const awayTeamWidth = options?.awayTeamWidth || 12;
  const includeTime = options?.includeTimeIndicator !== false;

  const homeTruncated = truncateTeamName(homeTeam, homeTeamWidth);
  const awayTruncated = truncateTeamName(awayTeam, awayTeamWidth);
  
  const scoreSection = `${homeScore} - ${awayScore}`;
  const timeIndicator = includeTime ? formatMatchTime(statusInfo) : '';
  
  // Format: "HOME_TEAM   2 - 1  AWAY_TEAM      87' ⚽"
  const line = `${homeTruncated.padEnd(homeTeamWidth)} ${scoreSection}  ${awayTruncated.padEnd(awayTeamWidth)} ${timeIndicator}`;
  
  return line.substring(0, 40);
}

/**
 * Truncate team name to fit within character limit
 * Uses common abbreviations for well-known teams
 */
export function truncateTeamName(name: string, maxLength: number): string {
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
    'Wolverhampton Wanderers': 'WOLVES',
    'Leicester City': 'LEICESTER',
    'Aston Villa': 'ASTON VILLA',
    'Crystal Palace': 'PALACE',
    'Nottingham Forest': 'FOREST',
    'Everton': 'EVERTON',
    'Brentford': 'BRENTFORD',
    'Fulham': 'FULHAM',
    'Bournemouth': 'BOURNEMOUTH',
    'Luton Town': 'LUTON',
    'Burnley': 'BURNLEY',
    'Sheffield United': 'SHEFF UTD'
  };
  
  if (abbreviations[name]) {
    const abbr = abbreviations[name];
    return abbr.length <= maxLength ? abbr : abbr.substring(0, maxLength);
  }
  
  return name.substring(0, maxLength);
}

// ============================================================================
// CSS Class Helpers
// ============================================================================

/**
 * Get CSS class for match status color coding
 */
export function getMatchStatusClass(statusInfo: MatchStatusInfo): string {
  switch (statusInfo.color) {
    case 'green':
      return 'match-status-live';
    case 'yellow':
      return 'match-status-halftime';
    case 'white':
      return 'match-status-finished';
    case 'red':
      return 'match-status-postponed';
    default:
      return '';
  }
}

/**
 * Get CSS class for live indicator pulsing animation
 */
export function getLiveIndicatorClass(): string {
  return 'live-indicator-pulse';
}

/**
 * Get CSS class for score change flash animation
 */
export function getScoreFlashClass(): string {
  return 'score-flash';
}

/**
 * Get CSS class for full time animation
 */
export function getFullTimeAnimationClass(): string {
  return 'full-time-animation';
}

// ============================================================================
// Animation State Management
// ============================================================================

/**
 * Track score changes for animation purposes
 */
export class ScoreChangeTracker {
  private previousScores: Map<string, { home: number; away: number }>;
  private changeTimestamps: Map<string, number>;

  constructor() {
    this.previousScores = new Map();
    this.changeTimestamps = new Map();
  }

  /**
   * Check if score has changed and update tracking
   * Returns animation info if score changed
   */
  checkScoreChange(
    matchId: string,
    homeScore: number,
    awayScore: number
  ): ScoreChangeAnimation | null {
    const previous = this.previousScores.get(matchId);
    
    if (!previous) {
      // First time seeing this match
      this.previousScores.set(matchId, { home: homeScore, away: awayScore });
      return null;
    }

    const homeChanged = previous.home !== homeScore;
    const awayChanged = previous.away !== awayScore;

    if (homeChanged || awayChanged) {
      const timestamp = Date.now();
      this.previousScores.set(matchId, { home: homeScore, away: awayScore });
      this.changeTimestamps.set(matchId, timestamp);

      return {
        homeScoreChanged: homeChanged,
        awayScoreChanged: awayChanged,
        timestamp
      };
    }

    return null;
  }

  /**
   * Check if a score change animation should still be active
   * Animations last for 3 seconds
   */
  isAnimationActive(matchId: string): boolean {
    const timestamp = this.changeTimestamps.get(matchId);
    if (!timestamp) return false;

    const elapsed = Date.now() - timestamp;
    return elapsed < 3000; // 3 second animation duration
  }

  /**
   * Clear tracking for a specific match
   */
  clearMatch(matchId: string): void {
    this.previousScores.delete(matchId);
    this.changeTimestamps.delete(matchId);
  }

  /**
   * Clear all tracking
   */
  clearAll(): void {
    this.previousScores.clear();
    this.changeTimestamps.clear();
  }
}

// ============================================================================
// Teletext Color Codes
// ============================================================================

/**
 * Get teletext color code for match status
 * Uses standard teletext color control codes
 */
export function getTeletextColorCode(color: 'green' | 'yellow' | 'white' | 'red'): string {
  switch (color) {
    case 'green':
      return '\x1b[32m';  // Green text
    case 'yellow':
      return '\x1b[33m';  // Yellow text
    case 'red':
      return '\x1b[31m';  // Red text
    case 'white':
    default:
      return '\x1b[37m';  // White text
  }
}

/**
 * Apply color coding to text for teletext display
 */
export function applyColorCoding(text: string, color: 'green' | 'yellow' | 'white' | 'red'): string {
  const colorCode = getTeletextColorCode(color);
  const resetCode = '\x1b[0m';
  return `${colorCode}${text}${resetCode}`;
}
