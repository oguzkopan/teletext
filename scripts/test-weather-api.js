#!/usr/bin/env node

/**
 * Test script to verify Weather API integration
 */

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'cd269e8361d204e1419a10c3fcc4df90';
const API_URL = 'https://api.openweathermap.org/data/2.5';

async function testWeatherAPI() {
  console.log('🧪 Testing Weather API Integration...\n');

  // Test 1: Current Weather for London
  console.log('🌤️  Test 1: Fetching Current Weather for London (Page 421)');
  try {
    const response = await fetch(
      `${API_URL}/weather?q=London,GB&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.main) {
      console.log(`✅ Success! Weather for ${data.name}`);
      console.log(`   Temperature: ${Math.round(data.main.temp)}°C`);
      console.log(`   Conditions: ${data.weather[0].description}`);
      console.log(`   Humidity: ${data.main.humidity}%`);
      console.log(`   Wind Speed: ${Math.round(data.wind.speed * 3.6)} km/h`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 2: Current Weather for Manchester
  console.log('🌧️  Test 2: Fetching Current Weather for Manchester (Page 422)');
  try {
    const response = await fetch(
      `${API_URL}/weather?q=Manchester,GB&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.main) {
      console.log(`✅ Success! Weather for ${data.name}`);
      console.log(`   Temperature: ${Math.round(data.main.temp)}°C`);
      console.log(`   Conditions: ${data.weather[0].description}`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 3: 5-Day Forecast for London
  console.log('📅 Test 3: Fetching 5-Day Forecast for London (Page 430)');
  try {
    const response = await fetch(
      `${API_URL}/forecast?q=London,GB&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.list) {
      const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
      console.log(`✅ Success! 5-day forecast for London`);
      dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
        const temp = Math.round(forecast.main.temp);
        console.log(`   ${dayName}: ${temp}°C, ${forecast.weather[0].description}`);
      });
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('\n✨ Weather API testing complete!\n');
}

testWeatherAPI();
