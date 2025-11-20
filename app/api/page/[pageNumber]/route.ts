import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/page/[pageNumber]
 * 
 * This route handles page requests.
 * 
 * In production: Calls deployed Firebase Functions
 * In development: Calls adapters directly (no emulator needed!)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  try {
    // Always use deployed Firebase Functions in production builds
    // This prevents webpack from trying to bundle the functions directory
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'teletext-eacd0';
    const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/getPage`;
    
    const response = await fetch(`${functionUrl}/${pageNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    // Disable caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    
    return NextResponse.json(data, { 
      status: 200,
      headers 
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch page',
        details: error instanceof Error ? error.message : 'Unknown error',
        pageNumber
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
