#!/usr/bin/env node

/**
 * Test script to verify Sports API integration
 */

const SPORTS_API_KEY = process.env.SPORTS_API_KEY || '603eb2b3d41f4993fac3dc7713474cf0';
const API_URL = 'https://v3.football.api-sports.io';

async function testSportsAPI() {
  console.log('🧪 Testing Sports API Integration...\n');

  // Test 1: Live Matches
  console.log('⚽ Test 1: Fetching Live Football Matches (Page 300, 301)');
  try {
    const response = await fetch(
      `${API_URL}/fixtures?live=all`,
      {
        headers: {
          'x-rapidapi-key': SPORTS_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.response) {
      console.log(`✅ Success! Found ${data.response.length} live matches`);
      if (data.response.length > 0) {
        const match = data.response[0];
        console.log(`   First match: "${match.teams.home.name} vs ${match.teams.away.name}"`);
        console.log(`   League: ${match.league.name}`);
        console.log(`   Status: ${match.fixture.status.long}`);
      } else {
        console.log(`   No live matches at the moment`);
      }
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 2: Premier League Table
  console.log('🏆 Test 2: Fetching Premier League Table (Page 302)');
  try {
    const response = await fetch(
      `${API_URL}/standings?league=39&season=2024`,
      {
        headers: {
          'x-rapidapi-key': SPORTS_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.response && data.response.length > 0) {
      const standings = data.response[0].league.standings[0];
      console.log(`✅ Success! Found ${standings.length} teams`);
      console.log(`   Top team: ${standings[0].team.name} (${standings[0].points} pts)`);
      console.log(`   2nd place: ${standings[1].team.name} (${standings[1].points} pts)`);
      console.log(`   3rd place: ${standings[2].team.name} (${standings[2].points} pts)`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 3: Today's Fixtures
  console.log('📅 Test 3: Fetching Today\'s Fixtures (Page 303)');
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${API_URL}/fixtures?date=${today}`,
      {
        headers: {
          'x-rapidapi-key': SPORTS_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.response) {
      console.log(`✅ Success! Found ${data.response.length} fixtures for ${today}`);
      if (data.response.length > 0) {
        const fixture = data.response[0];
        console.log(`   First fixture: "${fixture.teams.home.name} vs ${fixture.teams.away.name}"`);
        console.log(`   League: ${fixture.league.name}`);
        const matchTime = new Date(fixture.fixture.date).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });
        console.log(`   Time: ${matchTime}`);
      } else {
        console.log(`   No fixtures scheduled for today`);
      }
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('\n✨ Sports API testing complete!\n');
}

testSportsAPI();
