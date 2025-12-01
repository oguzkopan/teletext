import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
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

// Set global options for all Cloud Functions (v2)
// These settings optimize for production performance and cost
setGlobalOptions({
  region: 'us-central1',           // Primary region for low latency
  maxInstances: 100,                // Scale up to 100 instances under load
  timeoutSeconds: 300,              // 5 minute timeout for functions (handles cold starts)
  memory: '1GiB',                   // 1GB memory allocation (better performance)
  concurrency: 80,                  // Handle up to 80 concurrent requests per instance
});

// Initialize Firebase Admin
admin.initializeApp();

const pageLogger = createLogger('getPage');
const aiLogger = createLogger('processAI');

/**
 * GET/POST /api/page/:id
 * Retrieves a teletext page by ID or processes text input submissions
 */
export const getPage = onRequest(async (req, res) => {
  const startTime = Date.now();
  
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Disable caching
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

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

    pageLogger.logRequest(req.method, `/api/page/${pageId}`);

    // Validate page ID
    if (!isValidPageId(pageId)) {
      throw new InvalidPageError(pageId);
    }

    // Handle POST requests for text input submissions
    if (req.method === 'POST') {
      const { textInput, topicId, topicName, contextId } = req.body;

      // Route to AI adapter for Q&A pages (511-515)
      const pageNum = parseInt(pageId, 10);
      if (pageNum >= 511 && pageNum <= 515) {
        const adapter = routeToAdapter('500'); // AI adapter
        
        // Type guard to check if adapter has processQATextQuestion method
        if (!('processQATextQuestion' in adapter)) {
          throw new Error('AI adapter not properly configured');
        }

        // Process the text question
        const pages = await (adapter as any).processQATextQuestion({
          question: textInput,
          topicId: topicId || (pageNum - 510).toString(),
          topicName: topicName || 'General',
          contextId
        });

        const duration = Date.now() - startTime;
        pageLogger.logResponse(200, duration, { pageId, pageCount: pages.length });

        // Return the first page (or all pages if needed)
        const response: PageResponse = {
          success: true,
          page: pages[0],
          additionalPages: pages.slice(1)
        };

        res.status(200).json(response);
        return;
      }

      // For other pages, just return an error
      throw new Error('POST not supported for this page');
    }

    // Handle GET requests
    // Extract query parameters to pass to adapter
    const queryParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(req.query)) {
      queryParams[key] = value;
    }
    
    // Route to appropriate adapter
    const adapter = routeToAdapter(pageId);
    const page = await adapter.getPage(pageId, queryParams);

    if (!page) {
      throw new PageNotFoundError(pageId);
    }

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
 */
export const processAI = onRequest(async (req, res) => {
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

    const { mode, parameters } = req.body;

    aiLogger.logRequest('POST', '/api/ai', { mode, parameters });

    // Get AI adapter
    const adapter = routeToAdapter('500'); // AI adapter handles 500-599
    
    // Type guard to check if adapter has processQARequest method
    if (!('processQARequest' in adapter)) {
      throw new Error('AI adapter not properly configured');
    }

    let pages;
    let contextId = parameters?.contextId;

    // Route based on mode
    if (mode === 'qa') {
      // Process Q&A request
      pages = await (adapter as any).processQARequest(parameters);
      
      // Extract contextId from the first page's metadata
      if (pages && pages.length > 0 && pages[0].meta?.aiContextId) {
        contextId = pages[0].meta.aiContextId;
      }
    } else if (mode === 'spooky_story') {
      // Process spooky story request
      pages = await (adapter as any).processSpookyStoryRequest(parameters);
      
      // Extract contextId from the first page's metadata
      if (pages && pages.length > 0 && pages[0].meta?.aiContextId) {
        contextId = pages[0].meta.aiContextId;
      }
    } else {
      // Placeholder for other modes
      pages = [
        {
          id: '500',
          title: 'AI Oracle',
          rows: [
            'AI ORACLE                    P500',
            '════════════════════════════════════',
            '',
            `Mode "${mode}" is not yet implemented.`,
            '',
            'Available modes:',
            '• qa - Q&A Assistant',
            '• spooky_story - Horror Stories',
            '',
            'More modes coming soon!',
            '',
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
      ];
    }

    const response: AIResponse = {
      success: true,
      pages,
      contextId
    };

    const duration = Date.now() - startTime;
    aiLogger.logResponse(200, duration, { mode, pageCount: pages.length });

    res.status(200).json(response);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = getStatusCode(error);
    
    aiLogger.error('AI request failed', error, { duration });
    
    const response = createAIErrorResponse(error);
    res.status(statusCode).json(response);
  }
});

/**
 * DELETE /api/conversation/:contextId
 * Deletes a conversation from Firestore
 */
export const deleteConversation = onRequest(async (req, res) => {
  const startTime = Date.now();
  const deleteLogger = createLogger('deleteConversation');

  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    if (req.method !== 'DELETE') {
      res.status(405).json({
        success: false,
        error: 'Method not allowed. Use DELETE.'
      });
      return;
    }

    // Extract contextId from path
    const pathParts = req.path.split('/');
    const contextId = pathParts[pathParts.length - 1] || req.query.contextId as string;

    if (!contextId) {
      res.status(400).json({
        success: false,
        error: 'No context ID provided'
      });
      return;
    }

    deleteLogger.logRequest('DELETE', `/api/conversation/${contextId}`);

    // Get AI adapter
    const adapter = routeToAdapter('500'); // AI adapter handles 500-599
    
    // Type guard to check if adapter has deleteConversation method
    if (!('deleteConversation' in adapter)) {
      throw new Error('AI adapter not properly configured');
    }

    // Delete the conversation
    await (adapter as any).deleteConversation(contextId);

    const duration = Date.now() - startTime;
    deleteLogger.logResponse(200, duration, { contextId });

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = getStatusCode(error);
    
    deleteLogger.error('Delete conversation failed', error, { duration });
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to delete conversation'
    });
  }
});
