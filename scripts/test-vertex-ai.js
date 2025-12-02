/**
 * Test script for Vertex AI Gemini integration
 */

const { VertexAI } = require('@google-cloud/vertexai');

async function testVertexAI() {
  console.log('🧪 Testing Vertex AI Gemini Model...\n');
  
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.VERTEX_LOCATION || 'us-central1';
  
  console.log(`📋 Configuration:`);
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Location: ${location}\n`);
  
  if (!projectId) {
    console.error('❌ ERROR: GOOGLE_CLOUD_PROJECT or NEXT_PUBLIC_FIREBASE_PROJECT_ID not set');
    process.exit(1);
  }
  
  try {
    console.log('🔄 Initializing Vertex AI...');
    const vertexAI = new VertexAI({
      project: projectId,
      location: location
    });
    
    console.log('✅ Vertex AI initialized\n');
    
    console.log('🔄 Getting Gemini model...');
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('✅ Model loaded\n');
    
    const testQuestion = 'What is teletext? Answer in one sentence.';
    console.log(`📝 Test Question: "${testQuestion}"\n`);
    
    console.log('🔄 Generating response...');
    const startTime = Date.now();
    
    const result = await model.generateContent(testQuestion);
    const response = result.response;
    const candidates = response.candidates;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
      throw new Error('No response from AI');
    }
    
    const text = candidates[0].content.parts[0].text || '';
    
    console.log('✅ Response received\n');
    console.log('📊 Results:');
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response length: ${text.length} characters`);
    console.log(`\n💬 AI Response:\n   ${text}\n`);
    
    console.log('✅ Vertex AI test PASSED!');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testVertexAI();
