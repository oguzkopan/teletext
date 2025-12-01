#!/usr/bin/env node

/**
 * Test script to verify Markets API integration
 */

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'AYRJJ62J7Y352BVY';
const COINGECKO_KEY = process.env.COINGECKO_API_KEY || 'CG-N9UYbRozChXq8Kjo1EJM3NMY';

async function testMarketsAPI() {
  console.log('🧪 Testing Markets API Integration...\n');

  // Test 1: Alpha Vantage - Stock Quote
  console.log('📈 Test 1: Fetching Stock Quote (Alpha Vantage - Page 401)');
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      console.log(`✅ Success! Got quote for ${quote['01. symbol']}`);
      console.log(`   Price: $${quote['05. price']}`);
      console.log(`   Change: ${quote['09. change']} (${quote['10. change percent']})`);
    } else if (data.Note) {
      console.log(`⚠️  API Limit: ${data.Note}`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 2: CoinGecko - Crypto Prices
  console.log('💰 Test 2: Fetching Crypto Prices (CoinGecko - Page 402)');
  try {
    const headers = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {};
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.bitcoin) {
      console.log(`✅ Success! Got crypto prices`);
      console.log(`   Bitcoin: $${data.bitcoin.usd.toLocaleString()} (${data.bitcoin.usd_24h_change >= 0 ? '+' : ''}${data.bitcoin.usd_24h_change.toFixed(2)}%)`);
      console.log(`   Ethereum: $${data.ethereum.usd.toLocaleString()} (${data.ethereum.usd_24h_change >= 0 ? '+' : ''}${data.ethereum.usd_24h_change.toFixed(2)}%)`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 3: CoinGecko - Top Cryptocurrencies
  console.log('🪙 Test 3: Fetching Top Cryptocurrencies (CoinGecko - Page 402)');
  try {
    const headers = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {};
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1',
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`✅ Success! Found ${data.length} cryptocurrencies`);
      console.log(`   Top 3:`);
      data.slice(0, 3).forEach((crypto, index) => {
        console.log(`   ${index + 1}. ${crypto.name} (${crypto.symbol.toUpperCase()}): $${crypto.current_price.toLocaleString()}`);
      });
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('\n✨ Markets API testing complete!\n');
}

testMarketsAPI();
