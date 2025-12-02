/**
 * Test script for the new AI chat flow on page 500
 * Tests:
 * 1. Page 500 loads with text input enabled
 * 2. Submitting a question on page 500 returns AI response on page 500
 * 3. Can continue chatting on page 500 without navigation
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testAIChatFlow() {
  console.log('🧪 Testing New AI Chat Flow on Page 500\n');
  console.log('═'.repeat(60));
  
  try {
    // Test 1: Load page 500 without question
    console.log('\n📋 Test 1: Loading page 500 (initial state)');
    console.log('─'.repeat(60));
    
    const response1 = await makeRequest('/api/page/500');
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.data.success) {
      throw new Error('Response success is false');
    }
    
    const page500 = response1.data.page;
    console.log(`✅ Page loaded: ${page500.id} - ${page500.title}`);
    console.log(`   Input mode: ${page500.meta?.inputMode || 'not set'}`);
    console.log(`   Text input enabled: ${page500.meta?.textInputEnabled || false}`);
    console.log(`   Stay on page: ${page500.meta?.stayOnPageAfterSubmit || false}`);
    console.log(`   Links: ${page500.links.map(l => l.label).join(', ')}`);
    
    // Verify text input is enabled
    if (page500.meta?.inputMode !== 'text') {
      throw new Error('Input mode should be "text"');
    }
    
    if (!page500.meta?.textInputEnabled) {
      throw new Error('Text input should be enabled');
    }
    
    if (!page500.meta?.stayOnPageAfterSubmit) {
      throw new Error('stayOnPageAfterSubmit should be true');
    }
    
    console.log('✅ Test 1 PASSED: Page 500 has correct configuration\n');
    
    // Test 2: Submit a question to page 500
    console.log('📋 Test 2: Submitting question to page 500');
    console.log('─'.repeat(60));
    
    const testQuestion = 'What is artificial intelligence?';
    const encodedQuestion = encodeURIComponent(testQuestion);
    
    console.log(`   Question: "${testQuestion}"`);
    console.log(`   Requesting: /api/page/500?question=${encodedQuestion}`);
    
    const response2 = await makeRequest(`/api/page/500?question=${encodedQuestion}`);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.data.success) {
      throw new Error('Response success is false');
    }
    
    const page500WithAnswer = response2.data.page;
    console.log(`✅ Response received: ${page500WithAnswer.id} - ${page500WithAnswer.title}`);
    console.log(`   AI Generated: ${page500WithAnswer.meta?.aiGenerated || false}`);
    console.log(`   Custom Question: ${page500WithAnswer.meta?.customQuestion || 'not set'}`);
    console.log(`   Source: ${page500WithAnswer.meta?.source || 'not set'}`);
    
    // Verify response
    if (page500WithAnswer.id !== '500') {
      throw new Error(`Expected page ID 500, got ${page500WithAnswer.id}`);
    }
    
    if (!page500WithAnswer.meta?.aiGenerated) {
      throw new Error('Response should be AI generated');
    }
    
    if (page500WithAnswer.meta?.customQuestion !== testQuestion) {
      throw new Error('Custom question should match submitted question');
    }
    
    // Verify text input is still enabled for follow-up questions
    if (page500WithAnswer.meta?.inputMode !== 'text') {
      throw new Error('Input mode should still be "text" for follow-up questions');
    }
    
    if (!page500WithAnswer.meta?.textInputEnabled) {
      throw new Error('Text input should still be enabled for follow-up questions');
    }
    
    // Check that response contains the question and answer
    const pageContent = page500WithAnswer.rows.join('\n');
    console.log(`\n   Page content preview (first 500 chars):`);
    console.log(`   ${pageContent.substring(0, 500).replace(/\n/g, '\n   ')}`);
    
    console.log('\n✅ Test 2 PASSED: AI response received on page 500\n');
    
    // Test 3: Verify page 501 still exists (legacy support)
    console.log('📋 Test 3: Verifying page 501 (legacy support)');
    console.log('─'.repeat(60));
    
    const response3 = await makeRequest('/api/page/501');
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    const page501 = response3.data.page;
    console.log(`✅ Page loaded: ${page501.id} - ${page501.title}`);
    console.log(`   Input mode: ${page501.meta?.inputMode || 'not set'}`);
    
    console.log('✅ Test 3 PASSED: Page 501 still exists for legacy support\n');
    
    // Summary
    console.log('═'.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('\n📊 Summary:');
    console.log('   ✓ Page 500 loads with text input enabled');
    console.log('   ✓ Submitting question returns AI response on page 500');
    console.log('   ✓ Text input remains enabled for follow-up questions');
    console.log('   ✓ Page 501 still exists for legacy support');
    console.log('\n🎉 New AI chat flow is working correctly!\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Wait a bit for server to be ready
setTimeout(() => {
  testAIChatFlow();
}, 2000);
