import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

/**
 * Health check endpoint for Vertex AI configuration
 * GET /api/vertex-ai-health
 * 
 * This endpoint helps diagnose Vertex AI configuration issues in production
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Collect environment information
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    hasGoogleCloudProject: !!process.env.GOOGLE_CLOUD_PROJECT,
    hasGoogleCloudLocation: !!process.env.GOOGLE_CLOUD_LOCATION,
    hasVertexProjectId: !!process.env.VERTEX_PROJECT_ID,
    hasVertexLocation: !!process.env.VERTEX_LOCATION,
    hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '(not set)',
    location: process.env.GOOGLE_CLOUD_LOCATION || process.env.VERTEX_LOCATION || 'us-central1'
  };

  // Check if project ID is configured
  if (!envInfo.projectId || envInfo.projectId === '(not set)') {
    return NextResponse.json({
      status: 'error',
      message: 'GOOGLE_CLOUD_PROJECT environment variable is not set',
      environment: envInfo,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }

  // Try to initialize Vertex AI
  try {
    console.log('[VertexAI Health] Initializing Vertex AI...');
    const vertexAI = new VertexAI({
      project: envInfo.projectId,
      location: envInfo.location
    });

    console.log('[VertexAI Health] Getting model...');
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Try a simple test query
    console.log('[VertexAI Health] Testing model with simple query...');
    const result = await model.generateContent('Say "OK" in one word.');
    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates in response');
    }

    const text = candidates[0].content.parts[0].text || '';
    const endTime = Date.now();

    console.log('[VertexAI Health] Test successful');

    return NextResponse.json({
      status: 'healthy',
      message: 'Vertex AI is configured correctly and responding',
      environment: envInfo,
      test: {
        responseTime: `${endTime - startTime}ms`,
        responseLength: text.length,
        responsePreview: text.substring(0, 50)
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('[VertexAI Health] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    let diagnosis = 'Unknown error';
    let solution = 'Check logs for details';

    if (errorMessage.includes('403') || errorMessage.includes('permission')) {
      diagnosis = 'Permission denied - Service account lacks Vertex AI permissions';
      solution = 'Grant roles/aiplatform.user to the App Hosting service account';
    } else if (errorMessage.includes('404')) {
      diagnosis = 'Resource not found - API may not be enabled or model unavailable';
      solution = 'Enable Vertex AI API: gcloud services enable aiplatform.googleapis.com';
    } else if (errorMessage.includes('GOOGLE_CLOUD_PROJECT')) {
      diagnosis = 'Missing GOOGLE_CLOUD_PROJECT environment variable';
      solution = 'Add GOOGLE_CLOUD_PROJECT to apphosting.yaml';
    }

    return NextResponse.json({
      status: 'unhealthy',
      message: 'Vertex AI configuration error',
      error: errorMessage,
      diagnosis,
      solution,
      environment: envInfo,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Mark as dynamic to allow runtime generation
export const dynamic = 'force-dynamic';
