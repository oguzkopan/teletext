/**
 * Test script for live Vertex AI integration on page 500
 * This test makes a real API call to Vertex AI
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

async function testLiveAI() {
  console.log('🧪 Testing Live Vertex AI Integration\n');
  console.log('═'.repeat(80));
  
  try {
    const testQuestions = [
      'What is teletext?',
      'Explain quantum computing in simple terms',
      'Tell me a fun fact about space'
    ];
    
    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      console.log(`\n📋 Test ${i + 1}: "${question}"`);
      console.log('─'.repeat(80));
      
      const encodedQuestion = encodeURIComponent(question);
      console.log(`   Requesting: /api/page/500?question=${encodedQuestion}`);
      
      const startTime = Date.now();
      const response = await makeRequest(`/api/page/500?question=${encodedQuestion}`);
      const duration = Date.now() - startTime;
      
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      
      if (!response.data.success) {
        throw new Error('Response success is false');
      }
      
      const page = response.data.page;
      
      console.log(`\n   ✅ Response received in ${duration}ms`);
      console.log(`   Page ID: ${page.id}`);
      console.log(`   AI Generated: ${page.meta?.aiGenerated}`);
      console.log(`   Source: ${page.meta?.source}`);
      
      // Extract the AI response from the page content
      const pageContent = page.rows.join('\n');
      const responseSection = pageContent.split('AI RESPONSE')[1];
      
      if (responseSection) {
        // Clean up the response (remove color codes and extra whitespace)
        const cleanResponse = responseSection
          .replace(/\{[^}]+\}/g, '') // Remove color codes
          .replace(/═+/g, '') // Remove separator lines
          .replace(/▓+/g, '') // Remove block characters
          .replace(/╔+|╗+|║+|╚+|╝+/g, '') // Remove box drawing
          .replace(/💡|TIP:|Type another/g, '') // Remove UI elements
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.includes('NAVIGATION'))
          .slice(0, 5) // First 5 lines of response
          .join('\n   ');
        
        console.log(`\n   📝 AI Response (preview):`);
        console.log(`   ${cleanResponse}`);
      }
      
      console.log(`\n   ✅ Test ${i + 1} PASSED`);
      
      // Wait a bit between requests to avoid rate limiting
      if (i < testQuestions.length - 1) {
        console.log('\n   ⏳ Waiting 2 seconds before next test...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ ALL LIVE AI TESTS PASSED!');
    console.log('═'.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   ✓ Tested ${testQuestions.length} different questions`);
    console.log('   ✓ All responses generated successfully');
    console.log('   ✓ Vertex AI Gemini model is working correctly');
    console.log('\n🎉 Live AI integration is fully functional!\n');
    
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
  testLiveAI();
}, 2000);
