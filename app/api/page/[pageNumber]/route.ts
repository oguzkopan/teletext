import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/page/[pageNumber]
 * 
 * This route handles page requests and proxies them to Firebase Functions.
 * 
 * In production: Calls deployed Firebase Functions
 * In development: Calls Firebase emulator (must be running on port 5001)
 * 
 * To start emulators: npm run emulators:start
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  try {
    // Determine the Firebase Functions URL
    const isProduction = process.env.NODE_ENV === 'production';
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'teletext-eacd0';
    
    let functionUrl: string;
    
    if (isProduction) {
      // Production: Use deployed Firebase Functions
      functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/getPage`;
    } else {
      // Development: Use Firebase emulator
      // Check if custom URL is provided, otherwise use default emulator URL
      functionUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
                   `http://127.0.0.1:5001/${projectId}/us-central1/getPage`;
    }
    
    // Call the Firebase Function
    const response = await fetch(`${functionUrl}/${pageNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to fail fast if emulator isn't running
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    // Pass through cache headers from the function
    const headers = new Headers();
    const cacheControl = response.headers.get('Cache-Control');
    if (cacheControl) {
      headers.set('Cache-Control', cacheControl);
    }
    
    return NextResponse.json(data, { 
      status: 200,
      headers 
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    
    // Provide helpful error message if emulator isn't running
    const isDevelopment = process.env.NODE_ENV !== 'production';
    let errorMessage = 'Failed to fetch page';
    
    if (isDevelopment && error instanceof Error) {
      // Check for common connection errors
      if (error.message.includes('ECONNREFUSED') || 
          error.message.includes('fetch failed') ||
          error.name === 'AbortError') {
        errorMessage = 'Firebase emulator is not running. Start it with: npm run emulators:start';
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        pageNumber,
        hint: isDevelopment ? 'Make sure Firebase emulators are running on port 5001' : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
