import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/page/[pageNumber]
 * 
 * This route proxies requests to Firebase Functions
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  try {
    // Determine if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Use local emulator in development, production functions in production
    const functionUrl = isDevelopment
      ? `http://127.0.0.1:5001/teletext-eacd0/us-central1/getPage/${pageNumber}`
      : `https://getpage-q6w32usldq-uc.a.run.app/${pageNumber}`;
    
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
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
    
    // Check if this is a connection error (emulator not running)
    const isConnectionError = error instanceof Error && 
      (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed'));
    
    // In development, if emulator is not running, use fallback pages
    if (process.env.NODE_ENV === 'development' && isConnectionError) {
      const { getFallbackPage } = await import('@/lib/fallback-pages');
      const fallbackPage = getFallbackPage(pageNumber);
      
      if (fallbackPage) {
        return NextResponse.json(
          { 
            success: true, 
            page: fallbackPage,
            fallback: true
          },
          { status: 200 }
        );
      }
    }
    
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

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// This is required for static export - generate paths for common pages
export async function generateStaticParams() {
  // Generate static params for common pages
  const pages = [];
  for (let i = 100; i <= 899; i++) {
    pages.push({ pageNumber: i.toString() });
  }
  return pages;
}

// Mark as dynamic to allow runtime generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
