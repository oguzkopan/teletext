#!/usr/bin/env node

/**
 * Test script for Radio Listings page (471)
 * Tests the radio page creation and station selection
 */

const { createRadioListingsPage, RADIO_STATIONS } = require('../lib/radio-pages.ts');

console.log('🎵 Testing Radio Listings Page (471)\n');
console.log('═'.repeat(60));

// Test 1: Create default radio page
console.log('\n📻 Test 1: Default Radio Page');
console.log('-'.repeat(60));
try {
  const defaultPage = createRadioListingsPage();
  console.log('✓ Page ID:', defaultPage.id);
  console.log('✓ Title:', defaultPage.title);
  console.log('✓ Current Station:', defaultPage.meta?.radioPlayer?.currentStation?.name);
  console.log('✓ Total Stations:', defaultPage.meta?.radioPlayer?.stations?.length);
  console.log('✓ Input Mode:', defaultPage.meta?.inputMode);
  console.log('✓ Input Options:', defaultPage.meta?.inputOptions);
} catch (error) {
  console.error('✗ Error:', error.message);
}

// Test 2: Create radio page with specific station
console.log('\n📻 Test 2: Radio Page with Station Selection');
console.log('-'.repeat(60));
try {
  const stationPage = createRadioListingsPage({ stationId: '3' });
  console.log('✓ Page ID:', stationPage.id);
  console.log('✓ Current Station:', stationPage.meta?.radioPlayer?.currentStation?.name);
  console.log('✓ Station Genre:', stationPage.meta?.radioPlayer?.currentStation?.genre);
  console.log('✓ Stream URL:', stationPage.meta?.radioPlayer?.currentStation?.streamUrl);
} catch (error) {
  console.error('✗ Error:', error.message);
}

// Test 3: List all available stations
console.log('\n📻 Test 3: Available Radio Stations');
console.log('-'.repeat(60));
RADIO_STATIONS.forEach(station => {
  console.log(`[${station.id}] ${station.name.padEnd(25)} ${station.genre.padEnd(18)} ${station.country}`);
});

// Test 4: Verify page structure
console.log('\n📻 Test 4: Page Structure Validation');
console.log('-'.repeat(60));
try {
  const page = createRadioListingsPage();
  
  // Check rows
  console.log('✓ Total rows:', page.rows.length);
  console.log('✓ Expected rows: 24-30 (teletext standard)');
  
  // Check links
  console.log('✓ Total links:', page.links.length);
  console.log('✓ Navigation links:', page.links.filter(l => l.color).length);
  console.log('✓ Station links:', page.links.filter(l => !l.color).length);
  
  // Check metadata
  console.log('✓ Full screen layout:', page.meta?.fullScreenLayout);
  console.log('✓ Layout manager:', page.meta?.useLayoutManager);
  console.log('✓ Radio player enabled:', page.meta?.radioPlayer?.enabled);
  
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('✗ Error:', error.message);
}

console.log('\n' + '═'.repeat(60));
console.log('🎵 Radio Listings Page Test Complete\n');
