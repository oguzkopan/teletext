import { NextRequest, NextResponse } from 'next/server';
import { getPageByNumber, hasPage, get404Page, getComingSoonPage } from '@/lib/page-registry';
import { NewsAdapter } from '@/lib/adapters/NewsAdapter';
import { SportsAdapter } from '@/lib/adapters/SportsAdapter';
import { MarketsAdapter } from '@/lib/adapters/MarketsAdapter';
import { WeatherAdapter } from '@/lib/adapters/WeatherAdapter';
import { GamesAdapter } from '@/lib/adapters/GamesAdapter';
import { AIAdapter } from '@/lib/adapters/AIAdapter';

/**
 * API Route: GET /api/page/[pageNumber]
 * 
 * This route serves teletext pages using adapters
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  const { pageNumber } = params;

  // Extract base page number (handle hyphenated IDs like "203-3")
  const basePageNumber = pageNumber.split('-')[0];
  const pageNum = parseInt(basePageNumber, 10);
  
  // Validate page number range (100-999)
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

  // For dynamic pages, use adapters
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    let page;
    const magazine = Math.floor(pageNum / 100);

    switch (magazine) {
      case 2: // News (200-299)
        const newsAdapter = new NewsAdapter();
        page = await newsAdapter.getPage(pageNumber);
        break;
      
      case 3: // Sports (300-399)
        const sportsAdapter = new SportsAdapter();
        page = await sportsAdapter.getPage(pageNumber);
        break;
      
      case 4: // Markets & Weather (400-499)
        if (pageNum >= 420 && pageNum <= 449) {
          const weatherAdapter = new WeatherAdapter();
          page = await weatherAdapter.getPage(pageNumber);
        } else {
          const marketsAdapter = new MarketsAdapter();
          page = await marketsAdapter.getPage(pageNumber);
        }
        break;
      
      case 5: // AI (500-599)
        // All AI pages are handled by AIAdapter or page registry
        // Pages 500, 501 are static (from registry)
        // Pages 502, 511-516 are dynamic (from AIAdapter)
        if (pageNum === 502 || (pageNum >= 511 && pageNum <= 516)) {
          const aiAdapter = new AIAdapter();
          page = await aiAdapter.getPage(pageNumber, queryParams);
        } else if (hasPage(pageNumber)) {
          // Static pages like 500, 501 from page registry
          page = getPageByNumber(pageNumber);
        } else {
          page = getComingSoonPage(pageNumber);
        }
        break;
      
      case 6: // Games (600-699)
        // All game pages are handled by GamesAdapter
        const gamesAdapter = new GamesAdapter();
        page = await gamesAdapter.getPage(pageNumber, queryParams);
        break;
      
      default:
        // Return coming soon page for unimplemented sections
        page = getComingSoonPage(pageNumber);
    }

    if (!page) {
      page = getComingSoonPage(pageNumber);
    }

    return NextResponse.json(
      { 
        success: true, 
        page
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
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
    
    // For now, POST is not implemented
    // Future: Handle quiz answers, form submissions, etc.
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'POST not yet implemented for this page',
        pageNumber
      },
      { status: 501 }
    );
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
