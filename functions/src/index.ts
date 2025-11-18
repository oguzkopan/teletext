import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getCachedPage, setCachedPage } from './utils/cache';
import { routeToAdapter, isValidPageId } from './utils/router';
import { createLogger } from './utils/logger';
import {
  InvalidPageError,
  PageNotFoundError,
  createErrorResponse,
  createAIErrorResponse,
  getStatusCode
} from './utils/errors';
import { PageResponse, AIResponse } from './types';

// Initialize Firebase Admin
admin.initializeApp();

const pageLogger = createLogger('getPage');
const aiLogger = createLogger('processAI');

/**
 * GET /api/page/:id
 * Retrieves a teletext page by ID with Firestore caching
 */
export const getPage = functions.https.onRequest(async (req, res) => {
  const startTime = Date.now();
  
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Extract page ID from path or query parameter
    const pathParts = req.path.split('/');
    const pageId = pathParts[pathParts.length - 1] || req.query.id as string;

    if (!pageId) {
      throw new InvalidPageError('No page ID provided');
    }

    pageLogger.logRequest('GET', `/api/page/${pageId}`);

    // Validate page ID
    if (!isValidPageId(pageId)) {
      throw new InvalidPageError(pageId);
    }

    // Check cache first
    const cachedPage = await getCachedPage(pageId);
    if (cachedPage) {
      const duration = Date.now() - startTime;
      pageLogger.info('Cache hit', { pageId, duration });
      
      const response: PageResponse = {
        success: true,
        page: cachedPage
      };
      
      res.status(200).json(response);
      return;
    }

    pageLogger.info('Cache miss', { pageId });

    // Route to appropriate adapter
    const adapter = routeToAdapter(pageId);
    const page = await adapter.getPage(pageId);

    if (!page) {
      throw new PageNotFoundError(pageId);
    }

    // Cache the page
    const cacheDuration = adapter.getCacheDuration();
    await setCachedPage(pageId, page, cacheDuration);

    const duration = Date.now() - startTime;
    pageLogger.logResponse(200, duration, { pageId, source: page.meta?.source });

    const response: PageResponse = {
      success: true,
      page
    };

    res.status(200).json(response);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = getStatusCode(error);
    
    pageLogger.error('Request failed', error, { duration });
    
    const response = createErrorResponse(error);
    res.status(statusCode).json(response);
  }
});

/**
 * POST /api/ai
 * Processes AI requests and returns formatted teletext pages
 * This is a placeholder implementation that will be expanded in later tasks
 */
export const processAI = functions.https.onRequest(async (req, res) => {
  const startTime = Date.now();

  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    if (req.method !== 'POST') {
      res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST.'
      });
      return;
    }

    const { mode } = req.body;

    aiLogger.logRequest('POST', '/api/ai', { mode });

    // Placeholder response - actual AI integration will be implemented in later tasks
    const response: AIResponse = {
      success: true,
      pages: [
        {
          id: '500',
          title: 'AI Oracle',
          rows: [
            'AI ORACLE                    P500',
            '════════════════════════════════════',
            '',
            'AI service is being configured.',
            '',
            'This endpoint will be fully',
            'implemented in a future task.',
            '',
            'Available modes:',
            '• Q&A',
            '• Summarization',
            '• Story generation',
            '',
            '',
            '',
            '',
            '',
            '',
            'Press 100 to return to index',
            '',
            '',
            '',
            'INDEX',
            ''
          ],
          links: [
            { label: 'INDEX', targetPage: '100', color: 'red' }
          ],
          meta: {
            source: 'AIAdapter',
            lastUpdated: new Date().toISOString(),
            cacheStatus: 'fresh'
          }
        }
      ],
      contextId: 'placeholder-context-id'
    };

    const duration = Date.now() - startTime;
    aiLogger.logResponse(200, duration, { mode });

    res.status(200).json(response);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = getStatusCode(error);
    
    aiLogger.error('AI request failed', error, { duration });
    
    const response = createAIErrorResponse(error);
    res.status(statusCode).json(response);
  }
});
