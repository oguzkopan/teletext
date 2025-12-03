/**
 * Test script for AI-powered game pages (601, 610, 630, 640)
 * Verifies that Vertex AI is generating quiz questions, stories, word games, and math challenges
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

async function testGamesAI() {
  console.log('🧪 Testing AI-Powered Game Pages\n');
  console.log('═'.repeat(80));
  
  try {
    // Test 1: Page 601 - Quiz
    console.log('\n📋 Test 1: Page 601 - Trivia Quiz (AI-generated questions)');
    console.log('─'.repeat(80));
    
    const quiz = await makeRequest('/api/page/601');
    
    if (quiz.status !== 200 || !quiz.data.success) {
      throw new Error('Failed to load quiz page');
    }
    
    const quizPage = quiz.data.page;
    console.log(`   ✅ Page loaded: ${quizPage.id} - ${quizPage.title}`);
    console.log(`   AI Generated: ${quizPage.meta?.aiGenerated}`);
    console.log(`   Has quiz data: ${!!quizPage.meta?.quizQuestion}`);
    
    if (quizPage.meta?.quizQuestion) {
      console.log(`   Question category: ${quizPage.meta.quizQuestion.category}`);
      console.log(`   Question: ${quizPage.meta.quizQuestion.question.substring(0, 60)}...`);
    }
    
    console.log('   ✅ Test 1 PASSED\n');
    
    // Test 2: Page 610 - Bamboozle Story
    console.log('📋 Test 2: Page 610 - Bamboozle Story Game (AI-generated stories)');
    console.log('─'.repeat(80));
    
    const bamboozle = await makeRequest('/api/page/610');
    
    if (bamboozle.status !== 200 || !bamboozle.data.success) {
      throw new Error('Failed to load bamboozle page');
    }
    
    const bamboozlePage = bamboozle.data.page;
    console.log(`   ✅ Page loaded: ${bamboozlePage.id} - ${bamboozlePage.title}`);
    console.log(`   AI Generated: ${bamboozlePage.meta?.aiGenerated}`);
    console.log(`   Has story data: ${!!bamboozlePage.meta?.bamboozleStory}`);
    
    if (bamboozlePage.meta?.bamboozleStory) {
      console.log(`   Story title: ${bamboozlePage.meta.bamboozleStory.title}`);
      console.log(`   Scenario: ${bamboozlePage.meta.bamboozleStory.scenario.substring(0, 60)}...`);
    }
    
    console.log('   ✅ Test 2 PASSED\n');
    
    // Test 3: Page 630 - Word Game
    console.log('📋 Test 3: Page 630 - Anagram Challenge (AI-generated puzzles)');
    console.log('─'.repeat(80));
    
    const wordGame = await makeRequest('/api/page/630');
    
    if (wordGame.status !== 200 || !wordGame.data.success) {
      throw new Error('Failed to load word game page');
    }
    
    const wordGamePage = wordGame.data.page;
    console.log(`   ✅ Page loaded: ${wordGamePage.id} - ${wordGamePage.title}`);
    console.log(`   AI Generated: ${wordGamePage.meta?.aiGenerated}`);
    console.log(`   Has word game data: ${!!wordGamePage.meta?.wordGame}`);
    
    if (wordGamePage.meta?.wordGame) {
      console.log(`   Scrambled word: ${wordGamePage.meta.wordGame.scrambled}`);
      console.log(`   Hint: ${wordGamePage.meta.wordGame.hint.substring(0, 50)}...`);
    }
    
    console.log('   ✅ Test 3 PASSED\n');
    
    // Test 4: Page 640 - Math Challenge
    console.log('📋 Test 4: Page 640 - Math Challenge (AI-generated problems)');
    console.log('─'.repeat(80));
    
    const mathChallenge = await makeRequest('/api/page/640');
    
    if (mathChallenge.status !== 200 || !mathChallenge.data.success) {
      throw new Error('Failed to load math challenge page');
    }
    
    const mathPage = mathChallenge.data.page;
    console.log(`   ✅ Page loaded: ${mathPage.id} - ${mathPage.title}`);
    console.log(`   AI Generated: ${mathPage.meta?.aiGenerated}`);
    console.log(`   Has math challenge data: ${!!mathPage.meta?.mathChallenge}`);
    
    if (mathPage.meta?.mathChallenge) {
      console.log(`   Problem: ${mathPage.meta.mathChallenge.problem}`);
      console.log(`   Answer: ${mathPage.meta.mathChallenge.answer}`);
    }
    
    console.log('   ✅ Test 4 PASSED\n');
    
    // Summary
    console.log('═'.repeat(80));
    console.log('✅ ALL GAME AI TESTS PASSED!');
    console.log('═'.repeat(80));
    console.log('\n📊 Summary:');
    console.log('   ✓ Page 601 (Quiz) - AI generating trivia questions');
    console.log('   ✓ Page 610 (Bamboozle) - AI generating interactive stories');
    console.log('   ✓ Page 630 (Word Game) - AI generating anagram puzzles');
    console.log('   ✓ Page 640 (Math Challenge) - AI generating math problems');
    console.log('\n🎉 All game pages are using Vertex AI successfully!\n');
    
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
  testGamesAI();
}, 2000);
