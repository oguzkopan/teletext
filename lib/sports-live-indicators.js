"use strict";
/**
 * Sports Live Indicators and Animations
 *
 * Provides utilities for displaying live match indicators, score animations,
 * and match status visualizations for sports pages.
 *
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreChangeTracker = void 0;
exports.getMatchStatusInfo = getMatchStatusInfo;
exports.formatMatchTime = formatMatchTime;
exports.createLiveIndicator = createLiveIndicator;
exports.createFullTimeIndicator = createFullTimeIndicator;
exports.formatScoreLine = formatScoreLine;
exports.truncateTeamName = truncateTeamName;
exports.getMatchStatusClass = getMatchStatusClass;
exports.getLiveIndicatorClass = getLiveIndicatorClass;
exports.getScoreFlashClass = getScoreFlashClass;
exports.getFullTimeAnimationClass = getFullTimeAnimationClass;
exports.getTeletextColorCode = getTeletextColorCode;
exports.applyColorCoding = applyColorCoding;
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
function getMatchStatusInfo(statusShort, elapsed) {
    const status = statusShort.toUpperCase();
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
function formatMatchTime(statusInfo) {
    if (statusInfo.isLive && statusInfo.elapsed) {
        return `${statusInfo.elapsed}' ⚽`;
    }
    return statusInfo.displayText;
}
/**
 * Create pulsing LIVE indicator text
 * Returns the text with appropriate spacing for animation
 */
function createLiveIndicator() {
    return '● LIVE';
}
/**
 * Create FULL TIME animation text
 */
function createFullTimeIndicator() {
    return '✓ FULL TIME';
}
// ============================================================================
// Score Formatting Functions
// ============================================================================
/**
 * Format score line with team names and scores
 * Includes proper spacing and truncation for 40-character width
 */
function formatScoreLine(homeTeam, awayTeam, homeScore, awayScore, statusInfo, options) {
    const homeTeamWidth = (options === null || options === void 0 ? void 0 : options.homeTeamWidth) || 12;
    const awayTeamWidth = (options === null || options === void 0 ? void 0 : options.awayTeamWidth) || 12;
    const includeTime = (options === null || options === void 0 ? void 0 : options.includeTimeIndicator) !== false;
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
function truncateTeamName(name, maxLength) {
    if (!name || name.length <= maxLength) {
        return name || '';
    }
    // Common abbreviations
    const abbreviations = {
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
function getMatchStatusClass(statusInfo) {
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
function getLiveIndicatorClass() {
    return 'live-indicator-pulse';
}
/**
 * Get CSS class for score change flash animation
 */
function getScoreFlashClass() {
    return 'score-flash';
}
/**
 * Get CSS class for full time animation
 */
function getFullTimeAnimationClass() {
    return 'full-time-animation';
}
// ============================================================================
// Animation State Management
// ============================================================================
/**
 * Track score changes for animation purposes
 */
class ScoreChangeTracker {
    constructor() {
        this.previousScores = new Map();
        this.changeTimestamps = new Map();
    }
    /**
     * Check if score has changed and update tracking
     * Returns animation info if score changed
     */
    checkScoreChange(matchId, homeScore, awayScore) {
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
    isAnimationActive(matchId) {
        const timestamp = this.changeTimestamps.get(matchId);
        if (!timestamp)
            return false;
        const elapsed = Date.now() - timestamp;
        return elapsed < 3000; // 3 second animation duration
    }
    /**
     * Clear tracking for a specific match
     */
    clearMatch(matchId) {
        this.previousScores.delete(matchId);
        this.changeTimestamps.delete(matchId);
    }
    /**
     * Clear all tracking
     */
    clearAll() {
        this.previousScores.clear();
        this.changeTimestamps.clear();
    }
}
exports.ScoreChangeTracker = ScoreChangeTracker;
// ============================================================================
// Teletext Color Codes
// ============================================================================
/**
 * Get teletext color code for match status
 * Uses standard teletext color control codes
 */
function getTeletextColorCode(color) {
    switch (color) {
        case 'green':
            return '\x1b[32m'; // Green text
        case 'yellow':
            return '\x1b[33m'; // Yellow text
        case 'red':
            return '\x1b[31m'; // Red text
        case 'white':
        default:
            return '\x1b[37m'; // White text
    }
}
/**
 * Apply color coding to text for teletext display
 */
function applyColorCoding(text, color) {
    const colorCode = getTeletextColorCode(color);
    const resetCode = '\x1b[0m';
    return `${colorCode}${text}${resetCode}`;
}
//# sourceMappingURL=sports-live-indicators.js.map