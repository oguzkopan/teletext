/**
 * Tests for weather icons and animations
 */

import {
  WEATHER_ICONS,
  mapWeatherCondition,
  getTemperatureColor,
  getTemperatureRange,
  getTemperatureTrend,
  formatTemperature,
  createForecastTimeline,
  getWeatherIconFrame,
  formatWeatherIcon,
  createCompactWeatherDisplay,
  type WeatherCondition,
  type TemperatureRange
} from '../weather-icons';

describe('Weather Icons', () => {
  describe('WEATHER_ICONS', () => {
    it('should have icons for all weather conditions', () => {
      const conditions: WeatherCondition[] = [
        'clear', 'clouds', 'rain', 'snow', 'thunderstorm', 
        'drizzle', 'mist', 'fog'
      ];
      
      conditions.forEach(condition => {
        expect(WEATHER_ICONS[condition]).toBeDefined();
        expect(WEATHER_ICONS[condition].frames).toBeInstanceOf(Array);
        expect(WEATHER_ICONS[condition].frames.length).toBeGreaterThan(0);
      });
    });

    it('should have valid animation properties', () => {
      Object.values(WEATHER_ICONS).forEach(icon => {
        expect(icon.width).toBeGreaterThan(0);
        expect(icon.height).toBeGreaterThan(0);
        expect(icon.animationDuration).toBeGreaterThan(0);
        expect(icon.frames.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent frame dimensions', () => {
      Object.entries(WEATHER_ICONS).forEach(([condition, icon]) => {
        icon.frames.forEach((frame, index) => {
          const lines = frame.split('\n');
          expect(lines.length).toBe(icon.height);
          // All lines should have similar length (within reason for ASCII art)
          lines.forEach(line => {
            expect(line.length).toBeLessThanOrEqual(icon.width + 2);
          });
        });
      });
    });
  });

  describe('mapWeatherCondition', () => {
    it('should map clear sky descriptions', () => {
      expect(mapWeatherCondition('clear sky')).toBe('clear');
      expect(mapWeatherCondition('sunny')).toBe('clear');
      expect(mapWeatherCondition('Clear')).toBe('clear');
    });

    it('should map cloud descriptions', () => {
      expect(mapWeatherCondition('few clouds')).toBe('clouds');
      expect(mapWeatherCondition('scattered clouds')).toBe('clouds');
      expect(mapWeatherCondition('broken clouds')).toBe('clouds');
      expect(mapWeatherCondition('overcast clouds')).toBe('clouds');
    });

    it('should map rain descriptions', () => {
      expect(mapWeatherCondition('light rain')).toBe('rain');
      expect(mapWeatherCondition('moderate rain')).toBe('rain');
      expect(mapWeatherCondition('heavy rain')).toBe('rain');
    });

    it('should map snow descriptions', () => {
      expect(mapWeatherCondition('light snow')).toBe('snow');
      expect(mapWeatherCondition('heavy snow')).toBe('snow');
      expect(mapWeatherCondition('sleet')).toBe('snow');
    });

    it('should map thunderstorm descriptions', () => {
      expect(mapWeatherCondition('thunderstorm')).toBe('thunderstorm');
      expect(mapWeatherCondition('thunderstorm with rain')).toBe('thunderstorm');
    });

    it('should map drizzle descriptions', () => {
      expect(mapWeatherCondition('light drizzle')).toBe('drizzle');
      expect(mapWeatherCondition('drizzle')).toBe('drizzle');
    });

    it('should map mist and fog descriptions', () => {
      expect(mapWeatherCondition('mist')).toBe('mist');
      expect(mapWeatherCondition('fog')).toBe('fog');
      expect(mapWeatherCondition('haze')).toBe('fog');
    });

    it('should default to clouds for unknown conditions', () => {
      expect(mapWeatherCondition('unknown')).toBe('clouds');
      expect(mapWeatherCondition('')).toBe('clouds');
    });
  });

  describe('getTemperatureColor', () => {
    it('should return blue for cold temperatures', () => {
      expect(getTemperatureColor(-5).color).toBe('blue');
      expect(getTemperatureColor(0).color).toBe('blue');
      expect(getTemperatureColor(5).color).toBe('blue');
      expect(getTemperatureColor(9).color).toBe('blue');
    });

    it('should return yellow for moderate temperatures', () => {
      expect(getTemperatureColor(10).color).toBe('yellow');
      expect(getTemperatureColor(15).color).toBe('yellow');
      expect(getTemperatureColor(20).color).toBe('yellow');
      expect(getTemperatureColor(24).color).toBe('yellow');
    });

    it('should return red for hot temperatures', () => {
      expect(getTemperatureColor(25).color).toBe('red');
      expect(getTemperatureColor(30).color).toBe('red');
      expect(getTemperatureColor(35).color).toBe('red');
    });

    it('should include appropriate symbols', () => {
      expect(getTemperatureColor(5).symbol).toBe('❄');
      expect(getTemperatureColor(15).symbol).toBe('☀');
      expect(getTemperatureColor(30).symbol).toBe('🔥');
    });
  });

  describe('getTemperatureRange', () => {
    it('should classify cold temperatures', () => {
      expect(getTemperatureRange(-10)).toBe('cold');
      expect(getTemperatureRange(0)).toBe('cold');
      expect(getTemperatureRange(9)).toBe('cold');
    });

    it('should classify moderate temperatures', () => {
      expect(getTemperatureRange(10)).toBe('moderate');
      expect(getTemperatureRange(15)).toBe('moderate');
      expect(getTemperatureRange(24)).toBe('moderate');
    });

    it('should classify hot temperatures', () => {
      expect(getTemperatureRange(25)).toBe('hot');
      expect(getTemperatureRange(30)).toBe('hot');
      expect(getTemperatureRange(40)).toBe('hot');
    });
  });

  describe('getTemperatureTrend', () => {
    it('should return rising arrow for increasing temperature', () => {
      expect(getTemperatureTrend(20, 15)).toBe('↑');
      expect(getTemperatureTrend(15, 10)).toBe('↑');
      expect(getTemperatureTrend(25, 20)).toBe('↑');
    });

    it('should return falling arrow for decreasing temperature', () => {
      expect(getTemperatureTrend(15, 20)).toBe('↓');
      expect(getTemperatureTrend(10, 15)).toBe('↓');
      expect(getTemperatureTrend(20, 25)).toBe('↓');
    });

    it('should return stable arrow for similar temperatures', () => {
      expect(getTemperatureTrend(20, 20)).toBe('→');
      expect(getTemperatureTrend(20, 21)).toBe('→');
      expect(getTemperatureTrend(20, 19)).toBe('→');
    });

    it('should use threshold of 1 degree for trend detection', () => {
      expect(getTemperatureTrend(20, 18.5)).toBe('↑');
      expect(getTemperatureTrend(20, 21.5)).toBe('↓');
      expect(getTemperatureTrend(20, 19.5)).toBe('→');
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature with symbol by default', () => {
      expect(formatTemperature(5)).toContain('5°C');
      expect(formatTemperature(5)).toContain('❄');
      
      expect(formatTemperature(15)).toContain('15°C');
      expect(formatTemperature(15)).toContain('☀');
      
      expect(formatTemperature(30)).toContain('30°C');
      expect(formatTemperature(30)).toContain('🔥');
    });

    it('should format temperature without symbol when requested', () => {
      expect(formatTemperature(15, false)).toBe('15°C');
      expect(formatTemperature(15, false)).not.toContain('☀');
    });

    it('should round temperatures', () => {
      expect(formatTemperature(15.4, false)).toBe('15°C');
      expect(formatTemperature(15.6, false)).toBe('16°C');
    });
  });

  describe('createForecastTimeline', () => {
    it('should create a timeline with header', () => {
      const forecasts = [
        { day: 'Monday', condition: 'clear' as WeatherCondition, tempHigh: 22, tempLow: 15 }
      ];
      
      const timeline = createForecastTimeline(forecasts);
      expect(timeline[0]).toBe('FORECAST TIMELINE');
      expect(timeline[1]).toContain('═');
    });

    it('should include all forecast entries', () => {
      const forecasts = [
        { day: 'Monday', condition: 'clear' as WeatherCondition, tempHigh: 22, tempLow: 15 },
        { day: 'Tuesday', condition: 'rain' as WeatherCondition, tempHigh: 18, tempLow: 12 },
        { day: 'Wednesday', condition: 'clouds' as WeatherCondition, tempHigh: 20, tempLow: 14 }
      ];
      
      const timeline = createForecastTimeline(forecasts);
      expect(timeline.some(line => line.includes('Monday'))).toBe(true);
      expect(timeline.some(line => line.includes('Tuesday'))).toBe(true);
      expect(timeline.some(line => line.includes('Wednesday'))).toBe(true);
    });

    it('should include temperature ranges', () => {
      const forecasts = [
        { day: 'Monday', condition: 'clear' as WeatherCondition, tempHigh: 22, tempLow: 15 }
      ];
      
      const timeline = createForecastTimeline(forecasts);
      const forecastLine = timeline.find(line => line.includes('Monday'));
      expect(forecastLine).toContain('15°-22°C');
    });
  });

  describe('getWeatherIconFrame', () => {
    it('should return a frame for any condition', () => {
      const conditions: WeatherCondition[] = ['clear', 'rain', 'snow', 'clouds'];
      
      conditions.forEach(condition => {
        const frame = getWeatherIconFrame(condition, Date.now());
        expect(frame).toBeDefined();
        expect(typeof frame).toBe('string');
        expect(frame.length).toBeGreaterThan(0);
      });
    });

    it('should cycle through frames based on timestamp', () => {
      const condition: WeatherCondition = 'rain';
      const icon = WEATHER_ICONS[condition];
      
      // Get frames at different timestamps
      const frame1 = getWeatherIconFrame(condition, 0);
      const frame2 = getWeatherIconFrame(condition, icon.animationDuration);
      const frame3 = getWeatherIconFrame(condition, icon.animationDuration * 2);
      
      // Should cycle through different frames
      expect(frame1).toBe(icon.frames[0]);
      expect(frame2).toBe(icon.frames[1 % icon.frames.length]);
    });
  });

  describe('formatWeatherIcon', () => {
    it('should return an array of lines', () => {
      const lines = formatWeatherIcon('clear', 0);
      expect(Array.isArray(lines)).toBe(true);
      expect(lines.length).toBe(5);
    });

    it('should handle different frame indices', () => {
      const condition: WeatherCondition = 'rain';
      const icon = WEATHER_ICONS[condition];
      
      const lines1 = formatWeatherIcon(condition, 0);
      const lines2 = formatWeatherIcon(condition, 1);
      
      expect(lines1).not.toEqual(lines2);
    });

    it('should wrap frame index', () => {
      const condition: WeatherCondition = 'clear';
      const icon = WEATHER_ICONS[condition];
      
      const lines1 = formatWeatherIcon(condition, 0);
      const lines2 = formatWeatherIcon(condition, icon.frames.length);
      
      expect(lines1).toEqual(lines2);
    });
  });

  describe('createCompactWeatherDisplay', () => {
    it('should create a 5-line display', () => {
      const lines = createCompactWeatherDisplay('clear', 20, 'Clear sky', 0);
      expect(lines.length).toBe(5);
    });

    it('should include temperature', () => {
      const lines = createCompactWeatherDisplay('clear', 20, 'Clear sky', 0);
      const tempLine = lines[0];
      expect(tempLine).toContain('20°C');
    });

    it('should include description', () => {
      const lines = createCompactWeatherDisplay('clear', 20, 'Clear sky', 0);
      const descLine = lines[1];
      expect(descLine).toContain('Clear sky');
    });

    it('should truncate long descriptions', () => {
      const longDesc = 'This is a very long weather description that should be truncated';
      const lines = createCompactWeatherDisplay('clear', 20, longDesc, 0);
      const descLine = lines[1];
      expect(descLine.length).toBeLessThanOrEqual(40);
    });
  });

  describe('Animation consistency', () => {
    it('should have at least 2 frames for animated conditions', () => {
      const animatedConditions: WeatherCondition[] = [
        'clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'drizzle'
      ];
      
      animatedConditions.forEach(condition => {
        expect(WEATHER_ICONS[condition].frames.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should have reasonable animation durations', () => {
      Object.entries(WEATHER_ICONS).forEach(([condition, icon]) => {
        expect(icon.animationDuration).toBeGreaterThanOrEqual(100);
        expect(icon.animationDuration).toBeLessThanOrEqual(2000);
      });
    });
  });

  describe('Temperature color boundaries', () => {
    it('should handle boundary temperatures correctly', () => {
      // Test exact boundaries
      expect(getTemperatureColor(9.9).color).toBe('blue');
      expect(getTemperatureColor(10).color).toBe('yellow');
      expect(getTemperatureColor(24.9).color).toBe('yellow');
      expect(getTemperatureColor(25).color).toBe('red');
    });
  });

  describe('Edge cases', () => {
    it('should handle extreme temperatures', () => {
      expect(formatTemperature(-50)).toContain('°C');
      expect(formatTemperature(50)).toContain('°C');
    });

    it('should handle empty or invalid descriptions', () => {
      expect(mapWeatherCondition('')).toBe('clouds');
      expect(mapWeatherCondition('   ')).toBe('clouds');
    });

    it('should handle case-insensitive condition mapping', () => {
      expect(mapWeatherCondition('CLEAR SKY')).toBe('clear');
      expect(mapWeatherCondition('Clear Sky')).toBe('clear');
      expect(mapWeatherCondition('clear sky')).toBe('clear');
    });
  });
});
