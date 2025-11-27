import { NextRequest, NextResponse } from 'next/server';
import { TeletextPage } from '@/types/teletext';

/**
 * Helper function to get static index pages for development fallback
 */
async function getStaticIndexPage(pageNumber: string): Promise<TeletextPage | null> {
  const pageNum = parseInt(pageNumber, 10);
  
  // System pages (1xx)
  if (pageNum === 101) {
    const { createSystemStatusPage } = await import('@/lib/system-pages');
    return createSystemStatusPage();
  }
  
  // News pages (2xx)
  if (pageNum === 200) {
    const { createNewsIndexPage } = await import('@/lib/news-pages');
    return createNewsIndexPage();
  }
  if (pageNum === 201) {
    const { createUKNewsPage } = await import('@/lib/news-pages');
    return createUKNewsPage();
  }
  if (pageNum === 202) {
    const { createWorldNewsPage } = await import('@/lib/news-pages');
    return createWorldNewsPage();
  }
  if (pageNum === 203) {
    const { createLocalNewsPage } = await import('@/lib/news-pages');
    return createLocalNewsPage();
  }
  
  // Sports pages (3xx)
  if (pageNum === 300) {
    const { createSportsIndexPage } = await import('@/lib/sports-pages');
    return createSportsIndexPage();
  }
  
  // Markets pages (4xx)
  if (pageNum === 400) {
    const { createMarketsIndexPage } = await import('@/lib/markets-pages');
    return createMarketsIndexPage();
  }
  
  // AI pages (5xx)
  if (pageNum === 500) {
    const { createAIOraclePage } = await import('@/lib/services-pages');
    return createAIOraclePage();
  }
  
  // Games pages (6xx)
  if (pageNum === 600) {
    const { createGamesIndexPage } = await import('@/lib/services-pages');
    return createGamesIndexPage();
  }
  
  // Settings pages (7xx)
  if (pageNum === 700) {
    const { createSettingsIndexPage } = await import('@/lib/services-pages');
    return createSettingsIndexPage();
  }
  
  // Developer tools (8xx)
  if (pageNum === 800) {
    const { createDevToolsIndexPage } = await import('@/lib/services-pages');
    return createDevToolsIndexPage();
  }
  
  return null;
}

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

  // Always return static index page for page 100
  if (pageNumber === '100') {
    const { createIndexPage } = await import('@/lib/index-page');
    const indexPage = createIndexPage(false); // No welcome message when navigating
    return NextResponse.json(
      { 
        success: true, 
        page: indexPage
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  }

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
    
    // In development, if emulator is not running, use static index pages
    if (process.env.NODE_ENV === 'development' && isConnectionError) {
      const fallbackPage = await getStaticIndexPage(pageNumber);
      
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
