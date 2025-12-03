#!/usr/bin/env node

/**
 * Test script to verify Vertex AI configuration in deployment
 * This can be run locally to simulate the production environment
 */

const { VertexAI } = require('@google-cloud/vertexai');

async function testVertexAI() {
  console.log('🧪 Testing Vertex AI Configuration\n');
  console.log('================================\n');

  // Check environment variables
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.VERTEX_LOCATION || 'us-central1';

  console.log('Environment Variables:');
  console.log(`  GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT || '(not set)'}`);
  console.log(`  GOOGLE_CLOUD_LOCATION: ${process.env.GOOGLE_CLOUD_LOCATION || '(not set)'}`);
  console.log(`  VERTEX_LOCATION: ${process.env.VERTEX_LOCATION || '(not set)'}`);
  console.log(`  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '(not set)'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
  console.log('');

  console.log('Configuration:');
  console.log(`  Project ID: ${projectId}`);
  console.log(`  Location: ${location}`);
  console.log('');

  if (!projectId) {
    console.error('❌ ERROR: No project ID found!');
    console.error('   Set GOOGLE_CLOUD_PROJECT environment variable');
    process.exit(1);
  }

  try {
    console.log('🔄 Initializing Vertex AI...');
    const vertexAI = new VertexAI({
      project: projectId,
      location: location
    });

    console.log('✅ Vertex AI initialized successfully\n');

    console.log('🔄 Testing model access...');
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('✅ Model loaded successfully\n');

    console.log('🔄 Generating test response...');
    const prompt = 'Say "Hello from Vertex AI!" in exactly 5 words.';
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const endTime = Date.now();
    
    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates in response');
    }

    const text = candidates[0].content.parts[0].text || '';
    
    console.log('✅ Response generated successfully\n');
    console.log('Response Details:');
    console.log(`  Time taken: ${endTime - startTime}ms`);
    console.log(`  Response length: ${text.length} characters`);
    console.log(`  Response: "${text}"`);
    console.log('');

    console.log('================================');
    console.log('✅ All tests passed!');
    console.log('   Vertex AI is configured correctly');
    console.log('================================\n');

  } catch (error) {
    console.error('\n❌ ERROR: Vertex AI test failed\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Name: ${error.name}`);
    
    if (error.message.includes('403')) {
      console.error('\n💡 Possible causes:');
      console.error('  1. Vertex AI API is not enabled');
      console.error('     Run: gcloud services enable aiplatform.googleapis.com');
      console.error('  2. Service account lacks permissions');
      console.error('     Run: ./scripts/verify-vertex-ai-setup.sh');
    } else if (error.message.includes('404')) {
      console.error('\n💡 Possible causes:');
      console.error('  1. Project ID is incorrect');
      console.error('  2. Model name is incorrect or not available in this region');
      console.error('  3. Location is incorrect');
    } else if (error.message.includes('GOOGLE_CLOUD_PROJECT')) {
      console.error('\n💡 Solution:');
      console.error('  Set GOOGLE_CLOUD_PROJECT environment variable');
      console.error('  Example: export GOOGLE_CLOUD_PROJECT=teletext-eacd0');
    }
    
    console.error('\nFull error:');
    console.error(error);
    console.error('');
    
    process.exit(1);
  }
}

// Run the test
testVertexAI().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
