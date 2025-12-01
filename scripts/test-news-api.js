#!/usr/bin/env node

/**
 * Test script to verify News API integration
 */

const NEWS_API_KEY = process.env.NEWS_API_KEY || '44c30f5450634eaeaa9eea6e0cbde0d0';
const API_URL = 'https://newsapi.org/v2';

async function testNewsAPI() {
  console.log('🧪 Testing News API Integration...\n');

  // Test 1: Top Headlines (UK)
  console.log('📰 Test 1: Fetching UK Top Headlines (Page 200, 201)');
  try {
    const response = await fetch(
      `${API_URL}/top-headlines?country=gb&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Success! Found ${data.totalResults} articles`);
      console.log(`   First article: "${data.articles[0]?.title?.substring(0, 60)}..."`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 2: General News (World)
  console.log('🌍 Test 2: Fetching World News (Page 202)');
  try {
    const response = await fetch(
      `${API_URL}/top-headlines?category=general&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Success! Found ${data.totalResults} articles`);
      console.log(`   First article: "${data.articles[0]?.title?.substring(0, 60)}..."`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 3: US News (Local)
  console.log('🏠 Test 3: Fetching Local News (Page 203)');
  try {
    const response = await fetch(
      `${API_URL}/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Success! Found ${data.totalResults} articles`);
      console.log(`   First article: "${data.articles[0]?.title?.substring(0, 60)}..."`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 4: Technology News (Page 205)
  console.log('💻 Test 4: Fetching Technology News (Page 205)');
  try {
    const response = await fetch(
      `${API_URL}/top-headlines?category=technology&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Success! Found ${data.totalResults} articles`);
      console.log(`   First article: "${data.articles[0]?.title?.substring(0, 60)}..."`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('');

  // Test 5: Business News (Page 204)
  console.log('💼 Test 5: Fetching Business News (Page 204)');
  try {
    const response = await fetch(
      `${API_URL}/top-headlines?category=business&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Success! Found ${data.totalResults} articles`);
      console.log(`   First article: "${data.articles[0]?.title?.substring(0, 60)}..."`);
    } else {
      console.log(`❌ API Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }

  console.log('\n✨ News API testing complete!\n');
}

testNewsAPI();
