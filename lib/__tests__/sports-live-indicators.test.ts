/**
 * Tests for Sports Live Indicators
 * 
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5
 */

import {
  getMatchStatusInfo,
  formatMatchTime,
  createLiveIndicator,
  createFullTimeIndicator,
  formatScoreLine,
  truncateTeamName,
  getMatchStatusClass,
  getLiveIndicatorClass,
  getScoreFlashClass,
  getFullTimeAnimationClass,
  ScoreChangeTracker,
  getTeletextColorCode,
  applyColorCoding,
  MatchStatusInfo
} from '../sports-live-indicators';

describe('Sports Live Indicators', () => {
  
  describe('getMatchStatusInfo', () => {
    it('should return live status for 1H matches', () => {
      const result = getMatchStatusInfo('1H', 35);
      
      expect(result.status).toBe('LIVE');
      expect(result.elapsed).toBe(35);
      expect(result.color).toBe('green');
      expect(result.displayText).toBe("35'");
      expect(result.isLive).toBe(true);
    });

    it('should return live status for 2H matches', () => {
      const result = getMatchStatusInfo('2H', 87);
      
      expect(result.status).toBe('LIVE');
      expect(result.elapsed).toBe(87);
      expect(result.color).toBe('green');
      expect(result.displayText).toBe("87'");
      expect(result.isLive).toBe(true);
    });

    it('should return half-time status with yellow color', () => {
      const result = getMatchStatusInfo('HT');
      
      expect(result.status).toBe('HT');
      expect(result.color).toBe('yellow');
      expect(result.displayText).toBe('HT');
      expect(result.isLive).toBe(false);
    });

    it('should return full-time status with white color', () => {
      const result = getMatchStatusInfo('FT');
      
      expect(result.status).toBe('FT');
      expect(result.color).toBe('white');
      expect(result.displayText).toBe('FT');
      expect(result.isLive).toBe(false);
    });

    it('should return postponed status with red color', () => {
      const result = getMatchStatusInfo('PST');
      
      expect(result.status).toBe('PST');
      expect(result.color).toBe('red');
      expect(result.displayText).toBe('PST');
      expect(result.isLive).toBe(false);
    });

    it('should return cancelled status with red color', () => {
      const result = getMatchStatusInfo('CANCELLED');
      
      expect(result.status).toBe('CANCELLED');
      expect(result.color).toBe('red');
      expect(result.displayText).toBe('CANC');
      expect(result.isLive).toBe(false);
    });

    it('should handle LIVE status without elapsed time', () => {
      const result = getMatchStatusInfo('LIVE');
      
      expect(result.status).toBe('LIVE');
      expect(result.displayText).toBe('LIVE');
      expect(result.isLive).toBe(true);
    });
  });

  describe('formatMatchTime', () => {
    it('should format live match time with soccer ball emoji', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'LIVE',
        elapsed: 87,
        color: 'green',
        displayText: "87'",
        isLive: true
      };
      
      const result = formatMatchTime(statusInfo);
      expect(result).toBe("87' ⚽");
    });

    it('should return display text for non-live matches', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'FT',
        color: 'white',
        displayText: 'FT',
        isLive: false
      };
      
      const result = formatMatchTime(statusInfo);
      expect(result).toBe('FT');
    });

    it('should return LIVE for live matches without elapsed time', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'LIVE',
        color: 'green',
        displayText: 'LIVE',
        isLive: true
      };
      
      const result = formatMatchTime(statusInfo);
      expect(result).toBe('LIVE');
    });
  });

  describe('createLiveIndicator', () => {
    it('should create live indicator text', () => {
      const result = createLiveIndicator();
      expect(result).toBe('● LIVE');
    });
  });

  describe('createFullTimeIndicator', () => {
    it('should create full time indicator text', () => {
      const result = createFullTimeIndicator();
      expect(result).toBe('✓ FULL TIME');
    });
  });

  describe('formatScoreLine', () => {
    it('should format score line with all components', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'LIVE',
        elapsed: 87,
        color: 'green',
        displayText: "87'",
        isLive: true
      };
      
      const result = formatScoreLine(
        'Manchester United',
        'Chelsea',
        2,
        1,
        statusInfo
      );
      
      expect(result).toContain('MAN UTD');
      expect(result).toContain('2 - 1');
      expect(result).toContain('Chelsea'); // Team names are not uppercased by default
      expect(result).toContain("87' ⚽");
      expect(result.length).toBeLessThanOrEqual(40);
    });

    it('should format score line without time indicator', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'FT',
        color: 'white',
        displayText: 'FT',
        isLive: false
      };
      
      const result = formatScoreLine(
        'Arsenal',
        'Liverpool',
        1,
        1,
        statusInfo,
        { includeTimeIndicator: false }
      );
      
      expect(result).toContain('Arsenal'); // Team names are not uppercased by default
      expect(result).toContain('1 - 1');
      expect(result).toContain('Liverpool');
      expect(result).not.toContain('FT');
    });

    it('should respect custom team widths', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'HT',
        color: 'yellow',
        displayText: 'HT',
        isLive: false
      };
      
      const result = formatScoreLine(
        'Manchester City',
        'Tottenham Hotspur',
        3,
        0,
        statusInfo,
        {
          homeTeamWidth: 10,
          awayTeamWidth: 10
        }
      );
      
      expect(result.length).toBeLessThanOrEqual(40);
    });

    it('should truncate to 40 characters', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'LIVE',
        elapsed: 90,
        color: 'green',
        displayText: "90'",
        isLive: true
      };
      
      const result = formatScoreLine(
        'Very Long Team Name That Exceeds Limit',
        'Another Very Long Team Name',
        5,
        4,
        statusInfo
      );
      
      expect(result.length).toBeLessThanOrEqual(40);
    });
  });

  describe('truncateTeamName', () => {
    it('should return name unchanged if within limit', () => {
      const result = truncateTeamName('Arsenal', 10);
      expect(result).toBe('Arsenal');
    });

    it('should use abbreviation for Manchester United', () => {
      const result = truncateTeamName('Manchester United', 10);
      expect(result).toBe('MAN UTD');
    });

    it('should use abbreviation for Manchester City', () => {
      const result = truncateTeamName('Manchester City', 10);
      expect(result).toBe('MAN CITY');
    });

    it('should truncate unknown team names', () => {
      const result = truncateTeamName('Unknown Team Name', 8);
      expect(result).toBe('Unknown ');
      expect(result.length).toBe(8);
    });

    it('should handle empty names', () => {
      const result = truncateTeamName('', 10);
      expect(result).toBe('');
    });

    it('should truncate abbreviation if still too long', () => {
      const result = truncateTeamName('Manchester United', 5);
      expect(result).toBe('MAN U');
      expect(result.length).toBe(5);
    });
  });

  describe('CSS class helpers', () => {
    it('should return correct class for live status', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'LIVE',
        color: 'green',
        displayText: 'LIVE',
        isLive: true
      };
      
      expect(getMatchStatusClass(statusInfo)).toBe('match-status-live');
    });

    it('should return correct class for half-time status', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'HT',
        color: 'yellow',
        displayText: 'HT',
        isLive: false
      };
      
      expect(getMatchStatusClass(statusInfo)).toBe('match-status-halftime');
    });

    it('should return correct class for finished status', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'FT',
        color: 'white',
        displayText: 'FT',
        isLive: false
      };
      
      expect(getMatchStatusClass(statusInfo)).toBe('match-status-finished');
    });

    it('should return correct class for postponed status', () => {
      const statusInfo: MatchStatusInfo = {
        status: 'PST',
        color: 'red',
        displayText: 'PST',
        isLive: false
      };
      
      expect(getMatchStatusClass(statusInfo)).toBe('match-status-postponed');
    });

    it('should return live indicator class', () => {
      expect(getLiveIndicatorClass()).toBe('live-indicator-pulse');
    });

    it('should return score flash class', () => {
      expect(getScoreFlashClass()).toBe('score-flash');
    });

    it('should return full time animation class', () => {
      expect(getFullTimeAnimationClass()).toBe('full-time-animation');
    });
  });

  describe('ScoreChangeTracker', () => {
    let tracker: ScoreChangeTracker;

    beforeEach(() => {
      tracker = new ScoreChangeTracker();
    });

    it('should return null for first score check', () => {
      const result = tracker.checkScoreChange('match-1', 0, 0);
      expect(result).toBeNull();
    });

    it('should detect home score change', () => {
      tracker.checkScoreChange('match-1', 0, 0);
      const result = tracker.checkScoreChange('match-1', 1, 0);
      
      expect(result).not.toBeNull();
      expect(result?.homeScoreChanged).toBe(true);
      expect(result?.awayScoreChanged).toBe(false);
    });

    it('should detect away score change', () => {
      tracker.checkScoreChange('match-1', 1, 0);
      const result = tracker.checkScoreChange('match-1', 1, 1);
      
      expect(result).not.toBeNull();
      expect(result?.homeScoreChanged).toBe(false);
      expect(result?.awayScoreChanged).toBe(true);
    });

    it('should detect both scores changing', () => {
      tracker.checkScoreChange('match-1', 1, 1);
      const result = tracker.checkScoreChange('match-1', 2, 2);
      
      expect(result).not.toBeNull();
      expect(result?.homeScoreChanged).toBe(true);
      expect(result?.awayScoreChanged).toBe(true);
    });

    it('should return null when scores unchanged', () => {
      tracker.checkScoreChange('match-1', 2, 1);
      const result = tracker.checkScoreChange('match-1', 2, 1);
      
      expect(result).toBeNull();
    });

    it('should track multiple matches independently', () => {
      tracker.checkScoreChange('match-1', 0, 0);
      tracker.checkScoreChange('match-2', 1, 1);
      
      const result1 = tracker.checkScoreChange('match-1', 1, 0);
      const result2 = tracker.checkScoreChange('match-2', 1, 1);
      
      expect(result1).not.toBeNull();
      expect(result2).toBeNull();
    });

    it('should indicate animation is active immediately after change', () => {
      tracker.checkScoreChange('match-1', 0, 0);
      tracker.checkScoreChange('match-1', 1, 0);
      
      expect(tracker.isAnimationActive('match-1')).toBe(true);
    });

    it('should indicate animation is not active for unchanged match', () => {
      tracker.checkScoreChange('match-1', 0, 0);
      
      expect(tracker.isAnimationActive('match-1')).toBe(false);
    });

    it('should clear specific match tracking', () => {
      tracker.checkScoreChange('match-1', 1, 0);
      tracker.clearMatch('match-1');
      
      const result = tracker.checkScoreChange('match-1', 2, 0);
      expect(result).toBeNull(); // Should be treated as first check
    });

    it('should clear all match tracking', () => {
      tracker.checkScoreChange('match-1', 1, 0);
      tracker.checkScoreChange('match-2', 2, 1);
      tracker.clearAll();
      
      const result1 = tracker.checkScoreChange('match-1', 2, 0);
      const result2 = tracker.checkScoreChange('match-2', 3, 1);
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('Teletext color codes', () => {
    it('should return correct color code for green', () => {
      const code = getTeletextColorCode('green');
      expect(code).toBe('\x1b[32m');
    });

    it('should return correct color code for yellow', () => {
      const code = getTeletextColorCode('yellow');
      expect(code).toBe('\x1b[33m');
    });

    it('should return correct color code for red', () => {
      const code = getTeletextColorCode('red');
      expect(code).toBe('\x1b[31m');
    });

    it('should return correct color code for white', () => {
      const code = getTeletextColorCode('white');
      expect(code).toBe('\x1b[37m');
    });

    it('should apply color coding to text', () => {
      const result = applyColorCoding('LIVE', 'green');
      expect(result).toContain('\x1b[32m');
      expect(result).toContain('LIVE');
      expect(result).toContain('\x1b[0m');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete live match display', () => {
      const statusInfo = getMatchStatusInfo('2H', 87);
      const scoreLine = formatScoreLine(
        'Manchester United',
        'Chelsea',
        2,
        1,
        statusInfo
      );
      const liveIndicator = createLiveIndicator();
      const statusClass = getMatchStatusClass(statusInfo);
      
      expect(statusInfo.isLive).toBe(true);
      expect(scoreLine).toContain("87' ⚽");
      expect(liveIndicator).toBe('● LIVE');
      expect(statusClass).toBe('match-status-live');
    });

    it('should handle half-time match display', () => {
      const statusInfo = getMatchStatusInfo('HT');
      const scoreLine = formatScoreLine(
        'Arsenal',
        'Liverpool',
        1,
        1,
        statusInfo
      );
      const statusClass = getMatchStatusClass(statusInfo);
      
      expect(statusInfo.isLive).toBe(false);
      expect(statusInfo.color).toBe('yellow');
      expect(scoreLine).toContain('HT');
      expect(statusClass).toBe('match-status-halftime');
    });

    it('should handle finished match display', () => {
      const statusInfo = getMatchStatusInfo('FT');
      const scoreLine = formatScoreLine(
        'Manchester City',
        'Tottenham Hotspur',
        3,
        0,
        statusInfo
      );
      const fullTimeIndicator = createFullTimeIndicator();
      const statusClass = getMatchStatusClass(statusInfo);
      
      expect(statusInfo.isLive).toBe(false);
      expect(statusInfo.color).toBe('white');
      expect(fullTimeIndicator).toBe('✓ FULL TIME');
      expect(statusClass).toBe('match-status-finished');
    });

    it('should handle score change detection and animation', () => {
      const tracker = new ScoreChangeTracker();
      
      // Initial state
      tracker.checkScoreChange('match-1', 0, 0);
      
      // Score changes
      const change = tracker.checkScoreChange('match-1', 1, 0);
      
      expect(change).not.toBeNull();
      expect(change?.homeScoreChanged).toBe(true);
      expect(tracker.isAnimationActive('match-1')).toBe(true);
      
      const flashClass = getScoreFlashClass();
      expect(flashClass).toBe('score-flash');
    });
  });
});
