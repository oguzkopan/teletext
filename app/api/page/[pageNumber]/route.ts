import { NextRequest, NextResponse } from 'next/server';
import { getPageByNumber, hasPage, get404Page, getComingSoonPage } from '@/lib/page-registry';

/**
 * API Route: GET /api/page/[pageNumber]
 * 
 * This route proxies requests to Firebase Functions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  // Validate page number range (100-999)
  // Requirements: 6.1, 6.3, 6.4 - Page number validation
  const pageNum = parseInt(pageNumber, 10);
  if (isNaN(pageNum) || pageNum < 100 || pageNum > 999) {
    const error404Page = get404Page(pageNumber);
    return NextResponse.json(
      { 
        success: true, 
        page: error404Page
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  }

  // Check if this is a static page that should be served from lib/
  // These pages are defined in the page registry
  if (hasPage(pageNumber)) {
    const staticPage = getPageByNumber(pageNumber);
    if (staticPage) {
      return NextResponse.json(
        { 
          success: true, 
          page: staticPage
        },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
          }
        }
      );
    }
  }

  // For all other pages, forward to Firebase Functions for data fetching
  try {
    // Determine if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Get query parameters from the request (e.g., sessionId, aiContextId)
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Use local emulator in development, production functions in production
    const baseUrl = isDevelopment
      ? `http://127.0.0.1:5001/teletext-eacd0/us-central1/getPage/${pageNumber}`
      : `https://getpage-q6w32usldq-uc.a.run.app/${pageNumber}`;
    
    // Append query parameters if they exist
    const functionUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      // If it's a 404, return a "coming soon" page for valid page numbers
      // Requirements: 6.5 - Handle unimplemented pages gracefully
      if (response.status === 404) {
        const comingSoonPage = getComingSoonPage(pageNumber);
        return NextResponse.json(
          { 
            success: true, 
            page: comingSoonPage
          },
          { 
            status: 200,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
            }
          }
        );
      }
      
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
    
    // In development, if emulator is not running, use static pages as fallback
    if (process.env.NODE_ENV === 'development' && isConnectionError) {
      const fallbackPage = getPageByNumber(pageNumber);
      
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

/**
 * API Route: POST /api/page/[pageNumber]
 * 
 * Handles form submissions and text input for interactive pages
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  try {
    // Parse the request body
    const body = await request.json();
    
    // Determine if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Use local emulator in development, production functions in production
    const baseUrl = isDevelopment
      ? `http://127.0.0.1:5001/teletext-eacd0/us-central1/getPage/${pageNumber}`
      : `https://getpage-q6w32usldq-uc.a.run.app/${pageNumber}`;
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // Longer timeout for AI generation
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
    console.error('Error processing POST request:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// This is required for static export - generate paths for common pages
export async function generateStaticParams() {
  // Generate static params for common pages (100-999)
  // Requirements: 6.1 - Handle all page numbers correctly
  const pages = [];
  for (let i = 100; i <= 999; i++) {
    pages.push({ pageNumber: i.toString() });
  }
  return pages;
}

// Mark as dynamic to allow runtime generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
