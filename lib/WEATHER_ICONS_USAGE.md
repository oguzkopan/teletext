# Weather Icons Usage Guide

This module provides ASCII art weather icons with animations and temperature color coding for the Modern Teletext application.

## Features

- **Animated ASCII Weather Icons**: Sun, clouds, rain, snow, thunderstorm, drizzle, mist, and fog
- **Temperature Color Coding**: Blue (cold), yellow (moderate), red (hot)
- **Temperature Trend Indicators**: Rising (↑), falling (↓), stable (→) arrows
- **Forecast Timeline**: Visual multi-day forecast display
- **Animation Support**: Frame-by-frame animation for dynamic weather displays

## Weather Conditions

Supported weather conditions:
- `clear` - Sunny/clear sky with animated sun rays
- `clouds` - Moving cloud formations
- `rain` - Falling rain animation
- `snow` - Falling snow animation
- `thunderstorm` - Lightning bolts with rain
- `drizzle` - Light rain animation
- `mist` - Horizontal mist waves
- `fog` - Dense fog layers

## Temperature Color Coding

Temperature ranges and their colors:
- **Cold** (< 10°C): Blue with ❄ symbol
- **Moderate** (10-24°C): Yellow with ☀ symbol
- **Hot** (≥ 25°C): Red with 🔥 symbol

## Basic Usage

### Display a Weather Icon

```typescript
import { formatWeatherIcon, mapWeatherCondition } from '@/lib/weather-icons';

// Map API description to condition
const condition = mapWeatherCondition('scattered clouds');

// Get icon lines for display
const iconLines = formatWeatherIcon(condition, 0);
iconLines.forEach(line => console.log(line));
```

### Animate Weather Icons

```typescript
import { getWeatherIconFrame, WEATHER_ICONS } from '@/lib/weather-icons';

// Get current frame based on timestamp
const condition = 'rain';
const currentFrame = getWeatherIconFrame(condition, Date.now());
console.log(currentFrame);

// Or manually cycle through frames
const icon = WEATHER_ICONS[condition];
icon.frames.forEach((frame, index) => {
  setTimeout(() => console.log(frame), index * icon.animationDuration);
});
```

### Temperature Display with Color Coding

```typescript
import { formatTemperature, getTemperatureColor } from '@/lib/weather-icons';

const temp = 15;
const formatted = formatTemperature(temp, true); // "15°C ☀"
const { color, symbol } = getTemperatureColor(temp); // { color: 'yellow', symbol: '☀' }
```

### Temperature Trends

```typescript
import { getTemperatureTrend } from '@/lib/weather-icons';

const currentTemp = 18;
const previousTemp = 15;
const trend = getTemperatureTrend(currentTemp, previousTemp); // "↑"
```

### Compact Weather Display

```typescript
import { createCompactWeatherDisplay } from '@/lib/weather-icons';

const lines = createCompactWeatherDisplay(
  'rain',
  16,
  'Light rain',
  0
);

lines.forEach(line => console.log(line));
// Output:
//     .--.       16°C ☀
//  .-(    ).     Light rain
// (___.__)__)
//  ʻ ʻ ʻ ʻ ʻ
//   ʻ ʻ ʻ ʻ
```

### Forecast Timeline

```typescript
import { createForecastTimeline } from '@/lib/weather-icons';

const forecasts = [
  { day: 'Monday', condition: 'clear', tempHigh: 22, tempLow: 15 },
  { day: 'Tuesday', condition: 'clouds', tempHigh: 20, tempLow: 14 },
  { day: 'Wednesday', condition: 'rain', tempHigh: 18, tempLow: 12 }
];

const timeline = createForecastTimeline(forecasts);
timeline.forEach(line => console.log(line));
```

## Integration with WeatherAdapter

Example of integrating weather icons into the WeatherAdapter:

```typescript
import { 
  mapWeatherCondition, 
  formatWeatherIcon,
  formatTemperature,
  getTemperatureTrend,
  createForecastTimeline
} from '@/lib/weather-icons';

// In formatWeatherPage method:
const condition = mapWeatherCondition(current.weather?.[0]?.description || '');
const iconLines = formatWeatherIcon(condition, 0);

// Add icon to page
rows.push('CURRENT CONDITIONS');
iconLines.forEach(line => rows.push(line));
rows.push('');

// Add temperature with color coding
const tempDisplay = formatTemperature(current.main?.temp || 0);
rows.push(`Temperature: ${tempDisplay}`);

// Add trend indicator if you have previous data
const trend = getTemperatureTrend(currentTemp, previousTemp);
rows.push(`Trend: ${trend}`);
```

## Animation in React Components

For animated weather icons in React:

```typescript
import { useState, useEffect } from 'react';
import { getWeatherIconFrame } from '@/lib/weather-icons';

function AnimatedWeatherIcon({ condition }: { condition: WeatherCondition }) {
  const [frame, setFrame] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(getWeatherIconFrame(condition, Date.now()));
    }, 100); // Update every 100ms
    
    return () => clearInterval(interval);
  }, [condition]);
  
  return <pre>{frame}</pre>;
}
```

## ASCII Art Icons

Each weather condition has multiple animation frames. Example for rain:

```
Frame 1:          Frame 2:          Frame 3:
    .--.              .--.              .--.
 .-(    ).         .-(    ).         .-(    ).
(___.__)__)       (___.__)__)       (___.__)__)
 ʻ ʻ ʻ ʻ ʻ          ʻ ʻ ʻ ʻ          ʻ ʻ ʻ ʻ ʻ
  ʻ ʻ ʻ ʻ          ʻ ʻ ʻ ʻ ʻ           ʻ ʻ ʻ ʻ
```

## Requirements Validation

This module validates the following requirements:

- **Requirement 20.1**: ASCII art weather icons (sun, clouds, rain, snow)
- **Requirement 20.2**: Animated weather icons (falling rain, moving clouds)
- **Requirement 20.3**: Temperature color coding (blue=cold, red=hot, yellow=moderate)
- **Requirement 20.4**: Visual timeline for multi-day forecasts
- **Requirement 20.5**: Animated temperature change indicators (rising/falling arrows)

## Performance Considerations

- Icons are pre-defined strings, no runtime generation
- Animation frames are cycled based on timestamp modulo
- Minimal memory footprint
- No external dependencies
- Suitable for server-side rendering

## Accessibility

- ASCII art is screen-reader friendly
- Color coding uses symbols in addition to colors
- Temperature trends use directional arrows
- All text-based, no images required
