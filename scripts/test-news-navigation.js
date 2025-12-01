#!/usr/bin/env node

/**
 * Test script to verify news navigation is working correctly
 * Tests both main pages and article detail pages
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testPage(pageId, expectedId, description) {
  try {
    const response = await fetch(`${BASE_URL}/api/page/${pageId}`);
    const data = await response.json();
    
    if (data.success && data.page) {
      const actualId = data.page.id;
      const match = actualId === expectedId;
      
      console.log(`${match ? '✅' : '❌'} ${description}`);
      console.log(`   Requested: ${pageId}, Expected: ${expectedId}, Got: ${actualId}`);
      
      if (!match) {
        console.log(`   ⚠️  MISMATCH! Page ID doesn't match expected value`);
      }
      
      return match;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing News Navigation...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  // Test main news pages
  console.log('📰 Testing Main News Pages:');
  results.push(await testPage('200', '200', 'Page 200 - News Headlines'));
  results.push(await testPage('201', '201', 'Page 201 - UK News'));
  results.push(await testPage('202', '202', 'Page 202 - World News'));
  results.push(await testPage('203', '203', 'Page 203 - Local News'));
  results.push(await testPage('204', '204', 'Page 204 - Business News'));
  results.push(await testPage('205', '205', 'Page 205 - Technology News'));
  
  console.log('');
  
  // Test article detail pages (the critical fix)
  console.log('📄 Testing Article Detail Pages (Critical):');
  results.push(await testPage('200-1', '200-1', 'Page 200-1 - Article 1 from Headlines'));
  results.push(await testPage('200-2', '200-2', 'Page 200-2 - Article 2 from Headlines'));
  results.push(await testPage('201-1', '201-1', 'Page 201-1 - Article 1 from UK News'));
  results.push(await testPage('201-3', '201-3', 'Page 201-3 - Article 3 from UK News'));
  results.push(await testPage('202-1', '202-1', 'Page 202-1 - Article 1 from World News'));
  results.push(await testPage('203-1', '203-1', 'Page 203-1 - Article 1 from Local News'));
  results.push(await testPage('203-3', '203-3', 'Page 203-3 - Article 3 from Local News'));
  results.push(await testPage('204-1', '204-1', 'Page 204-1 - Article 1 from Business'));
  results.push(await testPage('205-1', '205-1', 'Page 205-1 - Article 1 from Technology'));
  
  console.log('');
  
  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  const failed = total - passed;
  
  console.log('═══════════════════════════════════════');
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  
  if (failed > 0) {
    console.log(`❌ ${failed} test(s) failed`);
    console.log('');
    console.log('💡 Make sure the development server is running:');
    console.log('   npm run dev');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    console.log('');
    console.log('🎉 News navigation is working correctly!');
    process.exit(0);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/page/100`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running at', BASE_URL);
    console.log('');
    console.log('Please start the development server:');
    console.log('   npm run dev');
    console.log('');
    console.log('Or specify a different URL:');
    console.log('   BASE_URL=http://localhost:3000 node scripts/test-news-navigation.js');
    process.exit(1);
  }
  
  await runTests();
})();
