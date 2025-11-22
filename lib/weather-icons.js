"use strict";
/**
 * Weather Icons and Animations
 *
 * Provides ASCII art weather icons with animation frames and color coding
 * for temperature displays in the Modern Teletext application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEATHER_ICONS = void 0;
exports.mapWeatherCondition = mapWeatherCondition;
exports.getTemperatureColor = getTemperatureColor;
exports.getTemperatureRange = getTemperatureRange;
exports.getTemperatureTrend = getTemperatureTrend;
exports.formatTemperature = formatTemperature;
exports.createForecastTimeline = createForecastTimeline;
exports.getWeatherIconFrame = getWeatherIconFrame;
exports.formatWeatherIcon = formatWeatherIcon;
exports.createCompactWeatherDisplay = createCompactWeatherDisplay;
/**
 * ASCII art weather icons with animation frames
 */
exports.WEATHER_ICONS = {
    clear: {
        frames: [
            // Frame 1: Sun
            '    \\   /    \n' +
                '     .-.     \n' +
                '  ― (   ) ―  \n' +
                '     `-\'     \n' +
                '    /   \\    ',
            // Frame 2: Sun with rays slightly rotated
            '   \\  |  /   \n' +
                '    \\ . /    \n' +
                ' ―  (   )  ― \n' +
                '    / \' \\    \n' +
                '   /  |  \\   '
        ],
        width: 13,
        height: 5,
        animationDuration: 1000
    },
    clouds: {
        frames: [
            // Frame 1: Clouds
            '             \n' +
                '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '             ',
            // Frame 2: Clouds slightly shifted
            '             \n' +
                '     .--.    \n' +
                '  .-(    ).  \n' +
                ' (___.__)__) \n' +
                '             ',
            // Frame 3: Clouds shifted more
            '             \n' +
                '      .--.   \n' +
                '   .-(    ). \n' +
                '  (___.__)__)\n' +
                '             '
        ],
        width: 13,
        height: 5,
        animationDuration: 800
    },
    rain: {
        frames: [
            // Frame 1: Rain falling
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                ' ʻ ʻ ʻ ʻ ʻ   \n' +
                '  ʻ ʻ ʻ ʻ    ',
            // Frame 2: Rain drops shifted
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '  ʻ ʻ ʻ ʻ    \n' +
                ' ʻ ʻ ʻ ʻ ʻ   ',
            // Frame 3: Rain drops shifted again
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                ' ʻ ʻ ʻ ʻ ʻ   \n' +
                '   ʻ ʻ ʻ ʻ   '
        ],
        width: 13,
        height: 5,
        animationDuration: 400
    },
    snow: {
        frames: [
            // Frame 1: Snow falling
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                ' * * * * *   \n' +
                '  * * * *    ',
            // Frame 2: Snow shifted
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '  * * * *    \n' +
                ' * * * * *   ',
            // Frame 3: Snow shifted again
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                ' * * * * *   \n' +
                '   * * * *   '
        ],
        width: 13,
        height: 5,
        animationDuration: 600
    },
    thunderstorm: {
        frames: [
            // Frame 1: Storm cloud
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '  ⚡ ʻ ʻ ʻ   \n' +
                ' ʻ ʻ ʻ ʻ     ',
            // Frame 2: Lightning flash
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '   ⚡ ʻ ʻ    \n' +
                ' ʻ ʻ ⚡ ʻ    ',
            // Frame 3: Back to normal
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                ' ʻ ʻ ʻ ⚡ ʻ  \n' +
                '  ʻ ʻ ʻ ʻ    '
        ],
        width: 13,
        height: 5,
        animationDuration: 500
    },
    drizzle: {
        frames: [
            // Frame 1: Light drizzle
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '  ʻ  ʻ  ʻ    \n' +
                '   ʻ  ʻ      ',
            // Frame 2: Drizzle shifted
            '    .--.     \n' +
                ' .-(    ).   \n' +
                '(___.__)__)  \n' +
                '   ʻ  ʻ      \n' +
                '  ʻ  ʻ  ʻ    '
        ],
        width: 13,
        height: 5,
        animationDuration: 500
    },
    mist: {
        frames: [
            // Frame 1: Mist
            '             \n' +
                ' ≈ ≈ ≈ ≈ ≈   \n' +
                '  ≈ ≈ ≈ ≈    \n' +
                ' ≈ ≈ ≈ ≈ ≈   \n' +
                '  ≈ ≈ ≈ ≈    ',
            // Frame 2: Mist shifted
            '             \n' +
                '  ≈ ≈ ≈ ≈    \n' +
                ' ≈ ≈ ≈ ≈ ≈   \n' +
                '  ≈ ≈ ≈ ≈    \n' +
                ' ≈ ≈ ≈ ≈ ≈   '
        ],
        width: 13,
        height: 5,
        animationDuration: 1000
    },
    fog: {
        frames: [
            // Frame 1: Fog
            '             \n' +
                ' ≡ ≡ ≡ ≡ ≡   \n' +
                '  ≡ ≡ ≡ ≡    \n' +
                ' ≡ ≡ ≡ ≡ ≡   \n' +
                '  ≡ ≡ ≡ ≡    ',
            // Frame 2: Fog shifted
            '             \n' +
                '  ≡ ≡ ≡ ≡    \n' +
                ' ≡ ≡ ≡ ≡ ≡   \n' +
                '  ≡ ≡ ≡ ≡    \n' +
                ' ≡ ≡ ≡ ≡ ≡   '
        ],
        width: 13,
        height: 5,
        animationDuration: 1200
    }
};
/**
 * Maps OpenWeatherMap condition codes to our weather conditions
 */
function mapWeatherCondition(description) {
    const lower = description.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) {
        return 'clear';
    }
    else if (lower.includes('thunder') || lower.includes('storm')) {
        return 'thunderstorm';
    }
    else if (lower.includes('drizzle')) {
        return 'drizzle';
    }
    else if (lower.includes('rain')) {
        return 'rain';
    }
    else if (lower.includes('snow') || lower.includes('sleet')) {
        return 'snow';
    }
    else if (lower.includes('mist')) {
        return 'mist';
    }
    else if (lower.includes('fog') || lower.includes('haze')) {
        return 'fog';
    }
    else if (lower.includes('cloud')) {
        return 'clouds';
    }
    return 'clouds'; // Default
}
/**
 * Gets temperature color coding based on Celsius temperature
 */
function getTemperatureColor(tempCelsius) {
    if (tempCelsius < 10) {
        return { color: 'blue', symbol: '❄' };
    }
    else if (tempCelsius >= 10 && tempCelsius < 25) {
        return { color: 'yellow', symbol: '☀' };
    }
    else {
        return { color: 'red', symbol: '🔥' };
    }
}
/**
 * Gets temperature range classification
 */
function getTemperatureRange(tempCelsius) {
    if (tempCelsius < 10) {
        return 'cold';
    }
    else if (tempCelsius >= 10 && tempCelsius < 25) {
        return 'moderate';
    }
    else {
        return 'hot';
    }
}
/**
 * Gets a temperature trend indicator (rising/falling arrows)
 */
function getTemperatureTrend(current, previous) {
    const diff = current - previous;
    if (diff > 1) {
        return '↑'; // Rising
    }
    else if (diff < -1) {
        return '↓'; // Falling
    }
    else {
        return '→'; // Stable
    }
}
/**
 * Formats a temperature with color coding
 */
function formatTemperature(tempCelsius, showSymbol = true) {
    const rounded = Math.round(tempCelsius);
    const { symbol } = getTemperatureColor(tempCelsius);
    if (showSymbol) {
        return `${rounded}°C ${symbol}`;
    }
    return `${rounded}°C`;
}
/**
 * Creates a visual timeline for multi-day forecast
 */
function createForecastTimeline(forecasts) {
    const lines = [];
    // Header
    lines.push('FORECAST TIMELINE');
    lines.push('════════════════════════════════════');
    lines.push('');
    // Each forecast entry
    forecasts.forEach(forecast => {
        const icon = exports.WEATHER_ICONS[forecast.condition];
        const iconLine = icon.frames[0].split('\n')[2]; // Middle line of icon
        const tempRange = `${Math.round(forecast.tempLow)}°-${Math.round(forecast.tempHigh)}°C`;
        const { symbol: highSymbol } = getTemperatureColor(forecast.tempHigh);
        lines.push(`${forecast.day.padEnd(10)} ${iconLine.trim().padEnd(15)} ${tempRange} ${highSymbol}`);
    });
    return lines;
}
/**
 * Gets the current animation frame for a weather condition
 */
function getWeatherIconFrame(condition, timestamp) {
    const icon = exports.WEATHER_ICONS[condition];
    const frameIndex = Math.floor(timestamp / icon.animationDuration) % icon.frames.length;
    return icon.frames[frameIndex];
}
/**
 * Formats a weather icon for display in teletext (splits into lines)
 */
function formatWeatherIcon(condition, frameIndex = 0) {
    const icon = exports.WEATHER_ICONS[condition];
    const frame = icon.frames[frameIndex % icon.frames.length];
    return frame.split('\n');
}
/**
 * Creates a compact weather display with icon and details
 */
function createCompactWeatherDisplay(condition, temp, description, frameIndex = 0) {
    const iconLines = formatWeatherIcon(condition, frameIndex);
    const { symbol } = getTemperatureColor(temp);
    const tempStr = `${Math.round(temp)}°C ${symbol}`;
    const descStr = description.substring(0, 20);
    // Combine icon with text
    const lines = [];
    lines.push(iconLines[0] + '  ' + tempStr);
    lines.push(iconLines[1] + '  ' + descStr);
    lines.push(iconLines[2]);
    lines.push(iconLines[3]);
    lines.push(iconLines[4]);
    return lines;
}
//# sourceMappingURL=weather-icons.js.map