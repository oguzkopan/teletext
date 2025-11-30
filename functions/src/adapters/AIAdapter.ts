// AI adapter for pages 500-599
// Integrates with Google Vertex AI (Gemini) for AI-powered interactions

import * as admin from 'firebase-admin';
import { VertexAI } from '@google-cloud/vertexai';
import { ContentAdapter, TeletextPage } from '../types';

/**
 * Conversation state stored in Firestore
 */
interface ConversationState {
  contextId: string;
  mode: string;
  history: Array<{
    role: 'user' | 'model';
    content: string;
    pageId: string;
  }>;
  parameters: Record<string, any>;
  createdAt: FirebaseFirestore.Timestamp;
  lastAccessedAt: FirebaseFirestore.Timestamp;
}

/**
 * AIAdapter serves AI Oracle pages (500-599)
 * Integrates with Google Vertex AI (Gemini) for conversational AI
 */
interface QueuedRequest {
  prompt: string;
  conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>;
  resolve: (value: string) => void;
  reject: (error: Error) => void;
  retryCount: number;
}

interface CachedResponse {
  response: string;
  timestamp: number;
  prompt: string;
}

export class AIAdapter implements ContentAdapter {
  private vertexAI: VertexAI | null = null;
  private firestore: FirebaseFirestore.Firestore;
  private projectId: string;
  private location: string;
  private configValidated: boolean = false;
  private configError: string | null = null;
  private requestQueue: QueuedRequest[] = [];
  private isProcessingQueue: boolean = false;
  private rateLimitDelay: number = 0; // milliseconds to wait before next request
  private responseCache: Map<string, CachedResponse> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private cacheCleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.firestore = admin.firestore();
    
    // Get project configuration from environment
    // GOOGLE_CLOUD_PROJECT is automatically set by Firebase Functions
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
    this.location = process.env.VERTEX_LOCATION || 'us-central1';

    // Validate configuration on startup
    this.validateConfiguration();
    
    // Start cache cleanup interval (every minute)
    // Only start in production, not in tests
    if (process.env.NODE_ENV !== 'test') {
      this.startCacheCleanup();
    }
  }

  /**
   * Validates AI service configuration
   * Requirements: 7.1
   */
  private validateConfiguration(): void {
    const errors: string[] = [];

    // Check for required environment variables
    if (!this.projectId) {
      errors.push('GOOGLE_CLOUD_PROJECT or GCLOUD_PROJECT environment variable is required');
    }

    if (!this.location) {
      errors.push('VERTEX_LOCATION environment variable is required');
    }

    // Log configuration status
    if (errors.length > 0) {
      this.configError = errors.join('; ');
      console.error('AI Service Configuration Error:', this.configError);
      console.error('AI features will be unavailable until configuration is fixed');
      this.configValidated = false;
    } else {
      console.log('AI Service Configuration Valid:', {
        projectId: this.projectId,
        location: this.location
      });
      this.configValidated = true;
      this.configError = null;
    }
  }

  /**
   * Checks if AI service is properly configured
   * Requirements: 7.1
   */
  private isConfigured(): boolean {
    return this.configValidated && this.configError === null;
  }

  /**
   * Lazily initializes Vertex AI only when needed
   */
  private getVertexAI(): VertexAI {
    if (!this.vertexAI) {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
    }
    return this.vertexAI;
  }

  /**
   * Retrieves an AI page
   * @param pageId - The page ID to retrieve (500-599)
   * @param params - Optional parameters including contextId for conversation continuity
   * @returns A TeletextPage object with AI content
   */
  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Route to specific AI pages
    if (pageNumber === 500) {
      return this.getAIIndexPage();
    } else if (pageNumber === 505) {
      return this.getSpookyStoryMenuPage();
    } else if (pageNumber === 506) {
      // Haunted House theme
      return this.getSpookyStoryInputPage('1', 'Haunted House');
    } else if (pageNumber === 507) {
      // Ghost Story theme
      return this.getSpookyStoryInputPage('2', 'Ghost Story');
    } else if (pageNumber === 508) {
      // Monster Tale theme
      return this.getSpookyStoryInputPage('3', 'Monster Tale');
    } else if (pageNumber === 509) {
      // Psychological Horror theme
      return this.getSpookyStoryInputPage('4', 'Psychological Horror');
    } else if (pageNumber >= 530 && pageNumber <= 534) {
      // Generated spooky story pages (530-534 for themes 1-5)
      const themeId = (pageNumber - 529).toString();
      // Theme names for reference (not currently used in generation)
      // const themeNames: Record<string, string> = {
      //   '1': 'Haunted House',
      //   '2': 'Ghost Story',
      //   '3': 'Monster Tale',
      //   '4': 'Psychological Horror',
      //   '5': 'Cursed Object'
      // };
      
      // Generate the story
      const pages = await this.processSpookyStoryRequest({
        theme: themeId,
        length: '2', // Medium length
        contextId: params?.contextId
      });
      
      // Return the first page of the generated story
      return pages[0];
    } else if (pageNumber >= 535 && pageNumber <= 549) {
      // Continuation pages for generated stories
      // These would be accessed via NEXT button from previous pages
      // For now, return placeholder
      return this.getPlaceholderPage(pageId);
    } else if (pageNumber === 520) {
      // Surprise Me / Conversation History
      return this.getConversationHistoryPage();
    } else if (pageNumber === 510) {
      return this.getQATopicSelectionPage();
    } else if (pageNumber === 511) {
      // News & Current Events topic
      return this.getQAQuestionInputPage('1', 'News & Current Events');
    } else if (pageNumber === 512) {
      // Technology & Science topic
      return this.getQAQuestionInputPage('2', 'Technology & Science');
    } else if (pageNumber === 513) {
      // Career & Education topic
      return this.getQAQuestionInputPage('3', 'Career & Education');
    } else if (pageNumber === 514) {
      // Health & Wellness topic
      return this.getQAQuestionInputPage('4', 'Health & Wellness');
    } else if (pageNumber === 515) {
      // General Knowledge topic
      return this.getQAQuestionInputPage('5', 'General Knowledge');
    } else if (pageNumber >= 516 && pageNumber <= 519) {
      // Q&A response pages - these are generated dynamically
      // In a real implementation, these would be retrieved from cache or regenerated
      return this.getPlaceholderPage(pageId);
    } else if (pageNumber === 520) {
      return this.getConversationHistoryPage();
    } else if (pageNumber >= 521 && pageNumber <= 529) {
      // Individual conversation pages
      return this.getConversationDetailPage(pageId, params);
    } else if (pageNumber >= 500 && pageNumber < 600) {
      return this.getPlaceholderPage(pageId);
    }

    throw new Error(`Invalid AI page: ${pageId}`);
  }



  /**
   * Creates the AI Oracle index page (500)
   */
  private getAIIndexPage(): TeletextPage {
    const rows = [
      'AI ORACLE                    P500',
      '════════════════════════════════════',
      '',
      'WELCOME TO THE AI ORACLE',
      '',
      'Menu-driven AI assistance powered',
      'by Google Gemini.',
      '',
      'AVAILABLE SERVICES:',
      '',
      '1. Q&A Assistant (Page 510)',
      '   Ask questions on various topics',
      '',
      '2. Conversation History (Page 520)',
      '   View past AI interactions',
      '',
      '3. Spooky Stories (Page 505)',
      '   Generate horror stories',
      '',
      'Enter a page number to continue',
      '',
      '',
      '',
      'INDEX   Q&A     HISTORY',
      ''
    ];

    return {
      id: '500',
      title: 'AI Oracle Index',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'Q&A', targetPage: '510', color: 'green' },
        { label: 'HISTORY', targetPage: '520', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates the spooky story generator menu page (505)
   */
  private getSpookyStoryMenuPage(): TeletextPage {
    const rows = [
      'SPOOKY STORY GENERATOR       P505',
      '════════════════════════════════════',
      '',
      '🎃 KIROWEEN SPECIAL 🎃',
      '',
      'Generate spine-chilling horror',
      'stories powered by AI.',
      '',
      'SELECT A THEME:',
      '',
      '1. Haunted House',
      '2. Ghost Story',
      '3. Monster Tale',
      '4. Psychological Horror',
      '5. Cursed Object',
      '6. Surprise Me!',
      '',
      'Enter a number (1-6) to select',
      'your horror theme.',
      '',
      '',
      '',
      'INDEX   AI      BACK',
      ''
    ];

    return {
      id: '505',
      title: 'Spooky Story Generator',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '500', color: 'yellow' },
        { label: '1', targetPage: '506', color: undefined }, // Option 1
        { label: '2', targetPage: '507', color: undefined }, // Option 2
        { label: '3', targetPage: '508', color: undefined }, // Option 3
        { label: '4', targetPage: '509', color: undefined }, // Option 4
        { label: '5', targetPage: '520', color: undefined }, // Option 5
        { label: '6', targetPage: '520', color: undefined }  // Option 6
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4', '5', '6']
      }
    };
  }

  /**
   * Creates a spooky story input page for a specific theme using layout engine
   */
  private getSpookyStoryInputPage(themeId: string, themeName: string): TeletextPage {
    const pageNumber = 505 + parseInt(themeId);
    
    // Build header (4 rows)
    const headerRows = [
      this.padText(`${this.truncateText(themeName.toUpperCase(), 28).padEnd(28)} P${pageNumber}`, 40),
      this.padText('════════════════════════════════════════', 40),
      this.padText('', 40),
      this.centerText('🎃 KIROWEEN SPECIAL 🎃', 40)
    ];
    
    // Build content (single-column layout with clear prompt display)
    const contentRows = [
      this.padText('', 40),
      this.padText(`Theme: ${themeName}`, 40),
      this.padText('', 40),
      this.padText('Ready to generate a spine-chilling', 40),
      this.padText('horror story?', 40),
      this.padText('', 40),
      this.padText('The AI will create a unique', 40),
      this.padText(`${themeName.toLowerCase()} tale`, 40),
      this.padText('formatted for teletext display.', 40),
      this.padText('', 40),
      this.padText('Story length: Medium (600-800 words)', 40),
      this.padText('Reading time: ~5-7 minutes', 40),
      this.padText('', 40),
      this.padText('Press GREEN button to generate', 40),
      this.padText('your personalized horror story!', 40),
      this.padText('', 40)
    ];
    
    // Pad content to 18 rows (24 - 4 header - 2 footer)
    while (contentRows.length < 18) {
      contentRows.push(' '.repeat(40));
    }
    
    // Build footer (2 rows)
    const footerRows = [
      this.padText('', 40),
      this.centerText('INDEX   GENERATE THEMES  AI', 40)
    ];
    
    // Combine all rows
    const rows = [
      ...headerRows,
      ...contentRows,
      ...footerRows
    ];

    // Calculate the story result page (530 + theme offset)
    const storyPageNumber = 530 + parseInt(themeId) - 1;

    return {
      id: pageNumber.toString(),
      title: `${themeName} Story`,
      rows: this.normalizeRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'GENERATE', targetPage: storyPageNumber.toString(), color: 'green' },
        { label: 'THEMES', targetPage: '505', color: 'yellow' },
        { label: 'AI', targetPage: '500', color: 'blue' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        haunting: true, // Enable spooky effects
        storyTheme: themeId,
        themeName: themeName
      }
    };
  }

  /**
   * Creates the Q&A topic selection page (510)
   */
  private getQATopicSelectionPage(): TeletextPage {
    const rows = [
      'Q&A ASSISTANT                P510',
      '════════════════════════════════════',
      this.centerText('Step 1 of 2'),
      this.centerText('▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░'),
      '',
      'SELECT A TOPIC:',
      '',
      '1. News & Current Events',
      '2. Technology & Science',
      '3. Career & Education',
      '4. Health & Wellness',
      '5. General Knowledge',
      '',
      'Enter a number (1-5) to select',
      'your topic.',
      '',
      'You will then be asked to provide',
      'additional details to help the AI',
      'provide a relevant response.',
      '',
      '',
      '',
      'INDEX   AI      BACK',
      ''
    ];

    return {
      id: '510',
      title: 'Q&A Topic Selection',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '500', color: 'yellow' },
        { label: '1', targetPage: '511', color: undefined }, // Option 1
        { label: '2', targetPage: '512', color: undefined }, // Option 2
        { label: '3', targetPage: '513', color: undefined }, // Option 3
        { label: '4', targetPage: '514', color: undefined }, // Option 4
        { label: '5', targetPage: '515', color: undefined }  // Option 5
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'single',
        inputOptions: ['1', '2', '3', '4', '5'],
        progress: {
          current: 1,
          total: 2,
          label: 'Step'
        }
      }
    };
  }

  /**
   * Centers text within a given width
   */
  private centerText(text: string, width: number = 40): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    
    const leftPadding = Math.floor((width - text.length) / 2);
    const rightPadding = width - text.length - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
  }

  /**
   * Creates a question input page for a specific topic using layout engine
   */
  private getQAQuestionInputPage(topicId: string, topicName: string): TeletextPage {
    const pageNumber = 510 + parseInt(topicId);
    
    // Build header (4 rows with progress indicator)
    const headerRows = [
      this.padText(`${this.truncateText(topicName.toUpperCase(), 28).padEnd(28)} P${pageNumber}`, 40),
      this.padText('════════════════════════════════════════', 40),
      this.centerText('Step 2 of 2', 40),
      this.centerText('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓', 40)
    ];
    
    // Build content (single-column layout)
    const contentRows = [
      this.padText('', 40),
      this.padText(`Topic: ${topicName}`, 40),
      this.padText('', 40),
      this.padText('Type your question below and press', 40),
      this.padText('ENTER to submit.', 40),
      this.padText('', 40),
      this.padText('The AI will provide a detailed', 40),
      this.padText('answer formatted for teletext', 40),
      this.padText('display.', 40),
      this.padText('', 40),
      this.padText('Examples:', 40),
      this.padText(`• What are the latest trends in`, 40),
      this.padText(`  ${topicName.toLowerCase()}?`, 40),
      this.padText(`• How does [topic] work?`, 40),
      this.padText(`• What should I know about...?`, 40),
      this.padText('', 40),
      this.padText('Your question:', 40),
      this.padText('', 40)
    ];
    
    // Pad content to 18 rows (24 - 4 header - 2 footer)
    while (contentRows.length < 18) {
      contentRows.push(' '.repeat(40));
    }
    
    // Build footer (2 rows)
    const footerRows = [
      this.padText('', 40),
      this.centerText('INDEX   TOPICS  AI', 40)
    ];
    
    // Combine all rows
    const rows = [
      ...headerRows,
      ...contentRows,
      ...footerRows
    ];

    return {
      id: pageNumber.toString(),
      title: `${topicName} Q&A`,
      rows: this.normalizeRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TOPICS', targetPage: '510', color: 'green' },
        { label: 'AI', targetPage: '500', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        inputMode: 'text',
        topicId: topicId,
        topicName: topicName,
        progress: {
          current: 2,
          total: 2,
          label: 'Step'
        }
      }
    };
  }

  /**
   * Processes a spooky story request and generates horror story
   */
  async processSpookyStoryRequest(params: Record<string, any>): Promise<TeletextPage[]> {
    try {
      const { theme, length, contextId } = params;

      // Build spooky story prompt
      const prompt = this.buildSpookyStoryPrompt(theme, length);

      // Get or create conversation context
      let conversation: ConversationState | null = null;
      let newContextId = contextId;

      if (contextId) {
        conversation = await this.getConversation(contextId);
      }

      if (!conversation) {
        newContextId = await this.createConversation('spooky_story', {
          theme,
          length
        });
        conversation = await this.getConversation(newContextId);
      }

      // Generate AI response with conversation context
      const conversationHistory = conversation?.history.map(entry => ({
        role: entry.role,
        content: entry.content
      })) || [];

      const aiResponse = await this.generateAIResponse(prompt, conversationHistory);

      // Update conversation with new interaction
      if (newContextId) {
        await this.updateConversation(
          newContextId,
          prompt,
          aiResponse,
          '507'
        );
      }

      // Format response into teletext pages with haunting mode
      // Use page 530+ for generated stories
      const startPage = (530 + parseInt(theme) - 1).toString();
      const pages = this.formatSpookyStoryResponse(aiResponse, startPage, newContextId || '', theme);

      return pages;
    } catch (error) {
      console.error('Error processing spooky story request:', error);
      return [this.getErrorPage('507', 'Spooky Story', error)];
    }
  }

  /**
   * Builds a spooky story prompt from menu selections
   */
  private buildSpookyStoryPrompt(theme: string, length: string): string {
    const themeMap: Record<string, string> = {
      '1': 'a haunted house with creaking floors, mysterious shadows, and unexplained phenomena',
      '2': 'a ghost story featuring a restless spirit seeking revenge or redemption',
      '3': 'a monster tale with a terrifying creature lurking in the darkness',
      '4': 'psychological horror that plays with the mind and blurs reality',
      '5': 'a cursed object that brings misfortune to all who possess it',
      '6': 'a surprise horror theme of your choice - be creative and terrifying'
    };

    const lengthMap: Record<string, string> = {
      '1': '300-400 words',
      '2': '600-800 words',
      '3': '1000-1200 words'
    };

    const themeText = themeMap[theme] || 'a terrifying horror scenario';
    const lengthText = lengthMap[length] || '400-600 words';

    const prompt = `Write a spine-chilling horror story about ${themeText}.

The story should be approximately ${lengthText} long.

Requirements:
- Create a genuinely scary and atmospheric narrative
- Build tension and suspense throughout
- Include vivid, unsettling descriptions
- End with a disturbing or shocking conclusion
- Use simple, clear language suitable for teletext display (no special formatting or markdown)
- Write in paragraphs with clear breaks between them
- Make it genuinely creepy and memorable

Remember: This is for Halloween entertainment, so make it properly scary!`;

    return prompt;
  }

  /**
   * Formats spooky story response into teletext pages with haunting effects using layout engine
   */
  formatSpookyStoryResponse(
    response: string,
    startPageId: string,
    contextId: string,
    theme: string
  ): TeletextPage[] {
    const pages: TeletextPage[] = [];
    
    // Use layout engine to wrap text properly (40 chars wide)
    const wrappedLines = this.wrapText(response, 40);
    
    // Calculate content area: 24 rows - 4 header - 2 footer = 18 rows
    const linesPerPage = 18;
    const pageCount = Math.ceil(wrappedLines.length / linesPerPage);
    
    const themeNames: Record<string, string> = {
      '1': 'HAUNTED HOUSE',
      '2': 'GHOST STORY',
      '3': 'MONSTER TALE',
      '4': 'PSYCHOLOGICAL HORROR',
      '5': 'CURSED OBJECT',
      '6': 'HORROR STORY'
    };
    const themeTitle = themeNames[theme] || 'HORROR STORY';
    
    for (let i = 0; i < pageCount; i++) {
      const pageNumber = parseInt(startPageId, 10) + i;
      const pageId = pageNumber.toString();
      const startLine = i * linesPerPage;
      const endLine = Math.min(startLine + linesPerPage, wrappedLines.length);
      const pageLines = wrappedLines.slice(startLine, endLine);
      
      // Build header (4 rows for spooky stories)
      const headerRows = [
        this.padText(`${this.truncateText(themeTitle, 28).padEnd(28, ' ')} P${pageId}`, 40),
        this.padText('════════════════════════════════════════', 40),
        this.centerText('🎃 KIROWEEN SPECIAL 🎃', 40),
        this.padText('', 40)
      ];
      
      // Build content rows (single-column layout)
      const contentRows: string[] = [];
      
      // Add story content
      for (const line of pageLines) {
        contentRows.push(this.padText(line, 40));
      }
      
      // Pad to fill content area (18 rows)
      while (contentRows.length < linesPerPage) {
        contentRows.push(' '.repeat(40));
      }
      
      // Build footer (2 rows)
      const footerRows: string[] = [];
      
      // Add navigation hint
      if (i < pageCount - 1) {
        footerRows.push(this.centerText('>>> TURN THE PAGE IF YOU DARE >>>', 40));
      } else {
        footerRows.push(this.centerText('═══════ THE END ═══════', 40));
      }
      
      // Navigation hints
      const hints: string[] = ['INDEX', 'AI'];
      if (i < pageCount - 1) {
        hints.push('NEXT');
      } else {
        hints.push('AGAIN');
      }
      const hintsText = hints.join('  ');
      footerRows.push(this.centerText(hintsText, 40));
      
      // Combine all rows
      const rows = [
        ...headerRows,
        ...contentRows,
        ...footerRows
      ];
      
      // Build links
      const links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [
        { label: 'INDEX', targetPage: '100', color: 'red' as const },
        { label: 'AI', targetPage: '500', color: 'green' as const }
      ];
      
      if (i < pageCount - 1) {
        links.push({ label: 'NEXT', targetPage: (pageNumber + 1).toString(), color: 'yellow' as const });
      } else {
        links.push({ label: 'AGAIN', targetPage: '505', color: 'yellow' as const });
      }
      
      // Create continuation metadata for multi-page responses
      // Requirements: 10.5
      const continuation = pageCount > 1 ? {
        currentPage: pageId,
        nextPage: i < pageCount - 1 ? (pageNumber + 1).toString() : undefined,
        previousPage: i > 0 ? (pageNumber - 1).toString() : undefined,
        totalPages: pageCount,
        currentIndex: i
      } : undefined;
      
      pages.push({
        id: pageId,
        title: themeTitle,
        rows: this.normalizeRows(rows),
        links,
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: contextId,
          aiGenerated: true,
          haunting: true, // Enable spooky effects
          continuation
        }
      });
    }
    
    return pages;
  }

  /**
   * Processes a text question from Q&A pages and generates AI response
   */
  async processQATextQuestion(params: Record<string, any>): Promise<TeletextPage[]> {
    try {
      const { question, topicId, topicName, contextId } = params;

      // Validate question is not empty
      if (!question || question.trim().length === 0) {
        return [this.getErrorPage('516', 'Q&A Response', new Error('Question cannot be empty'))];
      }

      // Build prompt with topic context
      const prompt = this.buildQATextPrompt(question, topicId, topicName);

      // Get or create conversation context
      let conversation: ConversationState | null = null;
      let newContextId = contextId;

      if (contextId) {
        conversation = await this.getConversation(contextId);
      }

      if (!conversation) {
        newContextId = await this.createConversation('qa', {
          topicId,
          topicName
        });
        conversation = await this.getConversation(newContextId);
      }

      // Generate AI response with conversation context
      const conversationHistory = conversation?.history.map(entry => ({
        role: entry.role,
        content: entry.content
      })) || [];

      const aiResponse = await this.generateAIResponse(prompt, conversationHistory);

      // Update conversation with new interaction
      if (newContextId) {
        await this.updateConversation(
          newContextId,
          question,
          aiResponse,
          '516'
        );
      }

      // Format response into teletext pages starting at 516
      const pages = this.formatAIResponse(aiResponse, '516', newContextId || '');

      return pages;
    } catch (error) {
      console.error('Error processing Q&A text question:', error);
      return [this.getErrorPage('516', 'Q&A Response', error)];
    }
  }

  /**
   * Builds a prompt for text-based Q&A questions
   */
  private buildQATextPrompt(question: string, topicId: string, topicName: string): string {
    const prompt = `You are an AI assistant helping with questions about ${topicName}.

User's question: ${question}

Please provide a clear, informative answer suitable for display on a teletext screen. 
Keep your response concise (approximately 300-500 words) and format it in clear paragraphs without special formatting or markdown.
Focus on providing accurate, helpful information that directly addresses the question.`;

    return prompt;
  }

  /**
   * Processes the Q&A request and generates AI response
   */
  async processQARequest(params: Record<string, any>): Promise<TeletextPage[]> {
    try {
      const { topic, region, questionType, contextId } = params;

      // Build structured prompt from menu selections
      const prompt = this.buildQAPrompt(topic, region, questionType);

      // Get or create conversation context
      let conversation: ConversationState | null = null;
      let newContextId = contextId;

      if (contextId) {
        conversation = await this.getConversation(contextId);
      }

      if (!conversation) {
        newContextId = await this.createConversation('qa', {
          topic,
          region,
          questionType
        });
        conversation = await this.getConversation(newContextId);
      }

      // Generate AI response with conversation context
      const conversationHistory = conversation?.history.map(entry => ({
        role: entry.role,
        content: entry.content
      })) || [];

      const aiResponse = await this.generateAIResponse(prompt, conversationHistory);

      // Update conversation with new interaction
      if (newContextId) {
        await this.updateConversation(
          newContextId,
          prompt,
          aiResponse,
          '513'
        );
      }

      // Format response into teletext pages
      const pages = this.formatAIResponse(aiResponse, '513', newContextId || '');

      return pages;
    } catch (error) {
      console.error('Error processing Q&A request:', error);
      return [this.getErrorPage('513', 'Q&A Response', error)];
    }
  }

  /**
   * Builds a structured prompt from menu selections
   */
  private buildQAPrompt(topic: string, region: string, questionType: string): string {
    const topicMap: Record<string, string> = {
      '1': 'news and current events',
      '2': 'technology and science',
      '3': 'career and education',
      '4': 'health and wellness',
      '5': 'general knowledge'
    };

    const regionMap: Record<string, string> = {
      '1': 'United States',
      '2': 'United Kingdom',
      '3': 'Europe',
      '4': 'Asia',
      '5': 'global/international'
    };

    const questionTypeMap: Record<string, string> = {
      '1': 'Provide the latest updates on',
      '2': 'Explain how to understand or work with',
      '3': 'Give recommendations about',
      '4': 'Compare different aspects of',
      '5': 'Answer a general question about'
    };

    const topicText = topicMap[topic] || 'general topics';
    const regionText = regionMap[region] || 'global';
    const questionTypeText = questionTypeMap[questionType] || 'Provide information about';

    const prompt = `${questionTypeText} ${topicText} with a focus on ${regionText} context. 
Please provide a concise, informative response suitable for display on a teletext screen (approximately 300-400 words). 
Format your response in clear paragraphs without special formatting or markdown.`;

    return prompt;
  }

  /**
   * Creates the conversation history index page (520)
   */
  private async getConversationHistoryPage(): Promise<TeletextPage> {
    try {
      // Retrieve recent conversations from Firestore (last 10)
      const conversationsSnapshot = await this.firestore
        .collection('conversations')
        .orderBy('lastAccessedAt', 'desc')
        .limit(10)
        .get();

      const rows = [
        'CONVERSATION HISTORY         P520',
        '════════════════════════════════════',
        '',
        'RECENT AI INTERACTIONS:',
        ''
      ];

      if (conversationsSnapshot.empty) {
        rows.push('No conversations yet.');
        rows.push('');
        rows.push('Start a new conversation from');
        rows.push('the AI Oracle index (page 500).');
        rows.push('');
        rows.push('Available AI services:');
        rows.push('• Q&A Assistant (510)');
        rows.push('• Spooky Stories (505)');
      } else {
        rows.push('Enter page number to view details:');
        rows.push('');
        
        conversationsSnapshot.docs.forEach((doc, index) => {
          const data = doc.data() as ConversationState;
          const date = data.lastAccessedAt.toDate();
          const dateStr = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
          });
          const timeStr = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const pageNum = 521 + index;
          
          // Format mode name for display
          const modeNames: Record<string, string> = {
            'qa': 'Q&A',
            'spooky_story': 'Spooky Story',
            'story': 'Story',
            'chat': 'Chat'
          };
          const modeName = modeNames[data.mode] || data.mode;
          const modeDisplay = this.truncateText(modeName, 12);
          
          // Get topic from parameters if available
          let topic = '';
          if (data.parameters?.topic) {
            const topicNames: Record<string, string> = {
              '1': 'News',
              '2': 'Tech',
              '3': 'Career',
              '4': 'Health',
              '5': 'General'
            };
            topic = topicNames[data.parameters.topic] || '';
          } else if (data.parameters?.theme) {
            const themeNames: Record<string, string> = {
              '1': 'Haunted',
              '2': 'Ghost',
              '3': 'Monster',
              '4': 'Psych',
              '5': 'Cursed',
              '6': 'Surprise'
            };
            topic = themeNames[data.parameters.theme] || '';
          }
          
          // Format: "521. 18 Nov 14:30 Q&A (Tech)"
          const topicStr = topic ? ` (${topic})` : '';
          const line = `${pageNum}. ${dateStr} ${timeStr} ${modeDisplay}${topicStr}`;
          rows.push(this.truncateText(line, 40));
        });
        
        rows.push('');
        rows.push('Note: Only last 10 conversations');
        rows.push('are stored. Older ones are deleted.');
      }

      return {
        id: '520',
        title: 'Conversation History',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'AI', targetPage: '500', color: 'green' },
          { label: 'REFRESH', targetPage: '520', color: 'yellow' }
        ],
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return this.getErrorPage('520', 'Conversation History', error);
    }
  }

  /**
   * Creates a conversation detail page (521-529)
   */
  private async getConversationDetailPage(
    pageId: string,
    params?: Record<string, any>
  ): Promise<TeletextPage> {
    try {
      // Get the index from page number (521 = index 0, 522 = index 1, etc.)
      const pageNumber = parseInt(pageId, 10);
      const conversationIndex = pageNumber - 521;
      
      // Retrieve conversations to find the one at this index
      const conversationsSnapshot = await this.firestore
        .collection('conversations')
        .orderBy('lastAccessedAt', 'desc')
        .limit(10)
        .get();

      if (conversationIndex < 0 || conversationIndex >= conversationsSnapshot.docs.length) {
        // No conversation at this index
        const rows = [
          `CONVERSATION                 P${pageId}`,
          '════════════════════════════════════',
          '',
          'NO CONVERSATION FOUND',
          '',
          'This conversation slot is empty.',
          '',
          'Return to conversation history',
          'to view available conversations.',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'INDEX   HISTORY',
          ''
        ];

        return {
          id: pageId,
          title: 'Conversation',
          rows: this.padRows(rows),
          links: [
            { label: 'INDEX', targetPage: '100', color: 'red' },
            { label: 'HISTORY', targetPage: '520', color: 'green' }
          ],
          meta: {
            source: 'AIAdapter',
            lastUpdated: new Date().toISOString(),
          }
        };
      }

      const conversationDoc = conversationsSnapshot.docs[conversationIndex];
      const conversation = conversationDoc.data() as ConversationState;
      const contextId = conversationDoc.id;
      
      const rows = [
        `CONVERSATION                 P${pageId}`,
        '════════════════════════════════════'
      ];

      // Display conversation metadata
      const date = conversation.lastAccessedAt.toDate();
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const modeNames: Record<string, string> = {
        'qa': 'Q&A Assistant',
        'spooky_story': 'Spooky Story',
        'story': 'Story Generator',
        'chat': 'Chat'
      };
      const modeName = modeNames[conversation.mode] || conversation.mode;
      
      rows.push(`Mode: ${this.truncateText(modeName, 30)}`);
      rows.push(`Date: ${dateStr} ${timeStr}`);
      rows.push('');

      // Display conversation history
      if (conversation.history.length === 0) {
        rows.push('No messages in this conversation.');
      } else {
        let remainingRows = 24 - rows.length - 2; // Reserve 2 for footer
        
        for (const entry of conversation.history) {
          if (remainingRows <= 1) {
            rows.push('... (conversation continues)');
            break;
          }
          
          const role = entry.role === 'user' ? 'YOU' : 'AI';
          rows.push(`[${role}]`);
          remainingRows--;
          
          // Wrap content to fit 40 characters
          const wrappedContent = this.wrapText(entry.content, 38);
          const linesToShow = Math.min(wrappedContent.length, remainingRows - 1);
          
          for (let i = 0; i < linesToShow; i++) {
            rows.push(`  ${wrappedContent[i]}`);
            remainingRows--;
          }
          
          if (wrappedContent.length > linesToShow) {
            rows.push('  ...');
            remainingRows--;
          }
          
          if (remainingRows > 0) {
            rows.push('');
            remainingRows--;
          }
        }
      }

      return {
        id: pageId,
        title: 'Conversation',
        rows: this.padRows(rows),
        links: [
          { label: 'INDEX', targetPage: '100', color: 'red' },
          { label: 'HISTORY', targetPage: '520', color: 'green' },
          { label: 'DELETE', targetPage: `${pageId}`, color: 'blue' }
        ],
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: contextId
        }
      };
    } catch (error) {
      console.error('Error loading conversation detail:', error);
      return this.getErrorPage(pageId, 'Conversation', error);
    }
  }

  /**
   * Creates or retrieves a conversation context
   * @param mode - The conversation mode (qa, story, etc.)
   * @param parameters - Additional parameters
   * @returns The context ID
   */
  async createConversation(
    mode: string,
    parameters: Record<string, any> = {}
  ): Promise<string> {
    const contextId = this.generateContextId();
    const now = admin.firestore.Timestamp.now();
    
    // Set expiration to 24 hours from now
    const expiresAt = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + 24 * 60 * 60 * 1000
    );

    const conversationState: ConversationState = {
      contextId,
      mode,
      history: [],
      parameters,
      createdAt: now,
      lastAccessedAt: now
    };

    await this.firestore
      .collection('conversations')
      .doc(contextId)
      .set({
        ...conversationState,
        expiresAt
      });

    return contextId;
  }

  /**
   * Retrieves a conversation context
   * @param contextId - The context ID
   * @returns The conversation state or null if not found
   */
  async getConversation(contextId: string): Promise<ConversationState | null> {
    try {
      const doc = await this.firestore
        .collection('conversations')
        .doc(contextId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as ConversationState & { expiresAt: FirebaseFirestore.Timestamp };
      
      // Check if expired
      const now = admin.firestore.Timestamp.now();
      if (data.expiresAt.toMillis() < now.toMillis()) {
        // Delete expired conversation
        await this.firestore.collection('conversations').doc(contextId).delete();
        return null;
      }

      // Update last accessed time
      await this.firestore
        .collection('conversations')
        .doc(contextId)
        .update({
          lastAccessedAt: now
        });

      return {
        contextId: data.contextId,
        mode: data.mode,
        history: data.history,
        parameters: data.parameters,
        createdAt: data.createdAt,
        lastAccessedAt: data.lastAccessedAt
      };
    } catch (error) {
      console.error('Error retrieving conversation:', error);
      return null;
    }
  }

  /**
   * Updates a conversation with new messages
   * @param contextId - The context ID
   * @param userMessage - The user's message
   * @param aiResponse - The AI's response
   * @param pageId - The page ID where this interaction occurred
   */
  async updateConversation(
    contextId: string,
    userMessage: string,
    aiResponse: string,
    pageId: string
  ): Promise<void> {
    try {
      const conversationRef = this.firestore.collection('conversations').doc(contextId);
      
      await conversationRef.update({
        history: admin.firestore.FieldValue.arrayUnion(
          {
            role: 'user',
            content: userMessage,
            pageId
          },
          {
            role: 'model',
            content: aiResponse,
            pageId
          }
        ),
        lastAccessedAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Deletes a conversation from Firestore
   * @param contextId - The context ID to delete
   */
  async deleteConversation(contextId: string): Promise<void> {
    try {
      await this.firestore
        .collection('conversations')
        .doc(contextId)
        .delete();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Generates AI response using Vertex AI with rate limiting and queueing
   * @param prompt - The prompt to send to the AI
   * @param conversationHistory - Optional conversation history for context
   * @returns The AI response text
   */
  async generateAIResponse(
    prompt: string,
    conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>
  ): Promise<string> {
    // Check configuration before making AI call
    // Requirements: 7.1
    if (!this.isConfigured()) {
      throw new Error(`AI service not configured: ${this.configError}`);
    }

    // Check cache first
    // Requirements: 7.6
    const cacheKey = this.generateCacheKey(prompt, conversationHistory);
    const cachedResponse = this.getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      console.log('Returning cached AI response');
      return cachedResponse;
    }

    // Queue the request if we're rate limited
    // Requirements: 7.5
    if (this.rateLimitDelay > 0) {
      return this.queueRequest(prompt, conversationHistory);
    }

    const response = await this.executeAIRequest(prompt, conversationHistory, 0);
    
    // Cache the response
    // Requirements: 7.6
    this.cacheResponse(cacheKey, response, prompt);
    
    return response;
  }

  /**
   * Queues an AI request when rate limited
   * Requirements: 7.5
   */
  private queueRequest(
    prompt: string,
    conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        prompt,
        conversationHistory,
        resolve,
        reject,
        retryCount: 0
      });

      console.log(`Request queued. Queue length: ${this.requestQueue.length}`);

      // Start processing queue if not already processing
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Processes queued requests with rate limiting
   * Requirements: 7.5
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      // Wait for rate limit delay if needed
      if (this.rateLimitDelay > 0) {
        console.log(`Rate limited. Waiting ${this.rateLimitDelay}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
      }

      const request = this.requestQueue.shift();
      if (!request) continue;

      try {
        const response = await this.executeAIRequest(
          request.prompt,
          request.conversationHistory,
          request.retryCount
        );
        request.resolve(response);
      } catch (error) {
        request.reject(error as Error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Executes an AI request with retry logic for rate limiting
   * Requirements: 7.5
   */
  private async executeAIRequest(
    prompt: string,
    conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>,
    retryCount: number = 0
  ): Promise<string> {
    try {
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
      });

      // Build conversation context with teletext formatting instructions
      // Requirements: 7.2
      const contents = [];
      
      // Add system-level formatting instructions as first user message
      const formattingInstructions = this.getTeletextFormattingInstructions();
      contents.push({
        role: 'user',
        parts: [{ text: formattingInstructions }]
      });
      
      // Add a model acknowledgment
      contents.push({
        role: 'model',
        parts: [{ text: 'I understand. I will format all responses for teletext display with 40-character line width, no special formatting, and clear paragraph breaks.' }]
      });
      
      // Include conversation history for context
      // Requirements: 7.2
      if (conversationHistory && conversationHistory.length > 0) {
        // Limit to last 10 exchanges to avoid token limits
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(entry => {
          contents.push({
            role: entry.role,
            parts: [{ text: entry.content }]
          });
        });
      }

      // Add current prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const result = await model.generateContent({
        contents
      });

      const response = result.response;
      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      // Parse and format the response for teletext display
      // Requirements: 7.3
      const formattedText = this.parseAndFormatAIResponse(rawText);
      
      // Reset rate limit delay on success
      this.rateLimitDelay = 0;
      
      return formattedText;
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      
      // Check if this is a rate limit error
      // Requirements: 7.5
      if (this.isRateLimitError(error)) {
        const maxRetries = 3;
        if (retryCount < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          this.rateLimitDelay = Math.pow(2, retryCount) * 1000;
          console.log(`Rate limit detected. Retry ${retryCount + 1}/${maxRetries} after ${this.rateLimitDelay}ms`);
          
          await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
          return this.executeAIRequest(prompt, conversationHistory, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }
      
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Checks if an error is a rate limit error
   * Requirements: 7.5
   */
  private isRateLimitError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code || '';
    
    // Check for common rate limit indicators
    return (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('quota exceeded') ||
      errorMessage.includes('too many requests') ||
      errorCode === 'RESOURCE_EXHAUSTED' ||
      errorCode === 429
    );
  }

  /**
   * Parses and formats AI response for teletext display
   * Requirements: 7.3
   */
  private parseAndFormatAIResponse(rawText: string): string {
    let text = rawText;

    // Remove markdown formatting
    // Remove bold: **text** or __text__
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    
    // Remove italic: *text* or _text_
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');
    
    // Remove headers: # Header, ## Header, etc.
    text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    
    // Remove code blocks: ```code```
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, '');
    
    // Remove bullet points and list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    
    // Normalize whitespace
    text = text.replace(/\r\n/g, '\n'); // Normalize line endings
    text = text.replace(/\t/g, '  '); // Replace tabs with spaces
    
    // Remove excessive blank lines (more than 2 consecutive)
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Trim leading/trailing whitespace
    text = text.trim();
    
    return text;
  }

  /**
   * Returns teletext formatting instructions for AI prompts
   * Requirements: 7.2
   */
  private getTeletextFormattingInstructions(): string {
    return `You are an AI assistant providing responses for a teletext/Ceefax-style display system.

CRITICAL FORMATTING REQUIREMENTS:
- Maximum line width: 40 characters
- Use simple, clear language
- NO markdown formatting (no **, __, ##, etc.)
- NO HTML tags
- NO special characters or emojis (except basic punctuation)
- Use plain text only
- Separate paragraphs with blank lines
- Keep responses concise and readable
- Avoid long sentences that are hard to wrap

Your responses will be displayed on a retro teletext screen, so clarity and simplicity are essential.`;
  }

  /**
   * Generates a cache key for a prompt and conversation history
   * Requirements: 7.6
   */
  private generateCacheKey(
    prompt: string,
    conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>
  ): string {
    // Create a simple hash of the prompt and history
    const historyStr = conversationHistory
      ? JSON.stringify(conversationHistory.slice(-5)) // Only last 5 for cache key
      : '';
    return `${prompt}:${historyStr}`;
  }

  /**
   * Gets a cached response if available and not expired
   * Requirements: 7.6
   */
  private getCachedResponse(cacheKey: string): string | null {
    const cached = this.responseCache.get(cacheKey);
    
    if (!cached) {
      return null;
    }

    const now = Date.now();
    const age = now - cached.timestamp;

    // Check if cache is expired
    if (age > this.CACHE_TTL) {
      this.responseCache.delete(cacheKey);
      return null;
    }

    return cached.response;
  }

  /**
   * Caches an AI response
   * Requirements: 7.6
   */
  private cacheResponse(cacheKey: string, response: string, prompt: string): void {
    this.responseCache.set(cacheKey, {
      response,
      timestamp: Date.now(),
      prompt
    });

    console.log(`Cached AI response. Cache size: ${this.responseCache.size}`);
  }

  /**
   * Clears expired cache entries
   * Requirements: 7.6
   */
  private cleanupCache(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, cached] of this.responseCache.entries()) {
      const age = now - cached.timestamp;
      if (age > this.CACHE_TTL) {
        this.responseCache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} expired cache entries. Cache size: ${this.responseCache.size}`);
    }
  }

  /**
   * Starts periodic cache cleanup
   * Requirements: 7.6
   */
  private startCacheCleanup(): void {
    // Clean up cache every minute
    this.cacheCleanupInterval = setInterval(() => {
      this.cleanupCache();
    }, 60 * 1000);
  }

  /**
   * Stops cache cleanup interval (useful for testing)
   * Requirements: 7.6
   */
  stopCacheCleanup(): void {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
      this.cacheCleanupInterval = null;
    }
  }

  /**
   * Clears all cached responses (useful for new requests)
   * Requirements: 7.6
   */
  clearCache(): void {
    this.responseCache.clear();
    console.log('AI response cache cleared');
  }

  /**
   * Formats AI response into teletext pages using the layout engine
   * @param response - The AI response text
   * @param startPageId - The starting page ID
   * @param contextId - The conversation context ID
   * @returns Array of TeletextPage objects
   */
  formatAIResponse(
    response: string,
    startPageId: string,
    contextId: string
  ): TeletextPage[] {
    const pages: TeletextPage[] = [];
    
    // Use layout engine to wrap text properly (40 chars wide)
    const wrappedLines = this.wrapText(response, 40);
    
    // Calculate content area: 24 rows - 2 header - 2 footer = 20 rows
    const linesPerPage = 20;
    const pageCount = Math.ceil(wrappedLines.length / linesPerPage);
    
    for (let i = 0; i < pageCount; i++) {
      const pageNumber = parseInt(startPageId, 10) + i;
      const pageId = pageNumber.toString();
      const startLine = i * linesPerPage;
      const endLine = Math.min(startLine + linesPerPage, wrappedLines.length);
      const pageLines = wrappedLines.slice(startLine, endLine);
      
      // Build content rows (single-column layout)
      const contentRows: string[] = [];
      
      // Add content lines
      for (const line of pageLines) {
        contentRows.push(this.padText(line, 40));
      }
      
      // Pad to fill content area (20 rows)
      while (contentRows.length < linesPerPage) {
        contentRows.push(' '.repeat(40));
      }
      
      // Build header (2 rows)
      const headerRows = [
        this.padText(`AI RESPONSE                  P${pageId}`, 40),
        this.padText('════════════════════════════════════════', 40)
      ];
      
      // Build footer (2 rows)
      const footerRows: string[] = [];
      footerRows.push(' '.repeat(40)); // Empty separator
      
      // Navigation hints
      const hints: string[] = ['INDEX', 'AI'];
      if (i < pageCount - 1) {
        hints.push('NEXT');
      }
      const hintsText = hints.join('  ');
      footerRows.push(this.centerText(hintsText, 40));
      
      // Combine all rows
      const rows = [
        ...headerRows,
        ...contentRows,
        ...footerRows
      ];
      
      // Build links
      const links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [
        { label: 'INDEX', targetPage: '100', color: 'red' as const },
        { label: 'AI', targetPage: '500', color: 'green' as const }
      ];
      
      if (i < pageCount - 1) {
        links.push({ label: 'NEXT', targetPage: (pageNumber + 1).toString(), color: 'yellow' as const });
      }
      
      // Create continuation metadata for multi-page responses
      // Requirements: 10.5
      const continuation = pageCount > 1 ? {
        currentPage: pageId,
        nextPage: i < pageCount - 1 ? (pageNumber + 1).toString() : undefined,
        previousPage: i > 0 ? (pageNumber - 1).toString() : undefined,
        totalPages: pageCount,
        currentIndex: i
      } : undefined;
      
      pages.push({
        id: pageId,
        title: 'AI Response',
        rows: this.normalizeRows(rows),
        links,
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
          aiContextId: contextId,
          aiGenerated: true,
          continuation
        }
      });
    }
    
    return pages;
  }

  /**
   * Generates a unique context ID
   */
  private generateContextId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Creates a loading page to display while AI is generating a response
   * Requirements: 1.3
   */
  getLoadingPage(pageId: string, title: string, prompt: string): TeletextPage {
    // Build header (2 rows)
    const headerRows = [
      this.padText(`AI GENERATING...             P${pageId}`, 40),
      this.padText('════════════════════════════════════════', 40)
    ];
    
    // Build content (single-column layout)
    const contentRows = [
      this.padText('', 40),
      this.centerText('⏳ GENERATING RESPONSE ⏳', 40),
      this.padText('', 40),
      this.padText('Your prompt:', 40),
      this.padText('', 40)
    ];
    
    // Add wrapped prompt text
    const promptLines = this.wrapText(prompt, 38);
    for (const line of promptLines.slice(0, 8)) { // Limit to 8 lines
      contentRows.push(this.padText(`  ${line}`, 40));
    }
    
    contentRows.push(this.padText('', 40));
    contentRows.push(this.centerText('Please wait...', 40));
    contentRows.push(this.padText('', 40));
    
    // Pad content to 20 rows (24 - 2 header - 2 footer)
    while (contentRows.length < 20) {
      contentRows.push(' '.repeat(40));
    }
    
    // Build footer (2 rows)
    const footerRows = [
      this.padText('', 40),
      this.centerText('Generating AI response...', 40)
    ];
    
    // Combine all rows
    const rows = [
      ...headerRows,
      ...contentRows,
      ...footerRows
    ];

    return {
      id: pageId,
      title: title,
      rows: this.normalizeRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        loading: true
      }
    };
  }

  /**
   * Creates an error page when operations fail using layout engine
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    // Build header (2 rows)
    const headerRows = [
      this.padText(`${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`, 40),
      this.padText('════════════════════════════════════════', 40)
    ];
    
    // Build content (single-column layout)
    const contentRows = [
      this.padText('', 40),
      this.centerText('SERVICE UNAVAILABLE', 40),
      this.padText('', 40),
      this.padText('Unable to process AI request.', 40),
      this.padText('', 40),
      this.padText('This could be due to:', 40),
      this.padText('• AI service is temporarily down', 40),
      this.padText('• Network connectivity issues', 40),
      this.padText('• Invalid conversation context', 40),
      this.padText('', 40),
      this.padText('Please try again in a few moments.', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('Press 500 for AI index', 40),
      this.padText('Press 100 for main index', 40),
      this.padText('', 40),
      this.padText('', 40)
    ];
    
    // Pad content to 20 rows (24 - 2 header - 2 footer)
    while (contentRows.length < 20) {
      contentRows.push(' '.repeat(40));
    }
    
    // Build footer (2 rows)
    const footerRows = [
      this.padText('', 40),
      this.centerText('INDEX   AI', 40)
    ];
    
    // Combine all rows
    const rows = [
      ...headerRows,
      ...contentRows,
      ...footerRows
    ];

    return {
      id: pageId,
      title: title,
      rows: this.normalizeRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented using layout engine
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    // Build header (2 rows)
    const headerRows = [
      this.padText(`AI PAGE ${pageId}                P${pageId}`, 40),
      this.padText('════════════════════════════════════════', 40)
    ];
    
    // Build content (single-column layout)
    const contentRows = [
      this.padText('', 40),
      this.centerText('COMING SOON', 40),
      this.padText('', 40),
      this.padText(`AI page ${pageId} is under construction.`, 40),
      this.padText('', 40),
      this.padText('This page will be available when', 40),
      this.padText('the full AI features are implemented.', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('Press 500 for AI index', 40),
      this.padText('Press 100 for main index', 40),
      this.padText('', 40),
      this.padText('', 40),
      this.padText('', 40)
    ];
    
    // Pad content to 20 rows (24 - 2 header - 2 footer)
    while (contentRows.length < 20) {
      contentRows.push(' '.repeat(40));
    }
    
    // Build footer (2 rows)
    const footerRows = [
      this.padText('', 40),
      this.centerText('INDEX   AI', 40)
    ];
    
    // Combine all rows
    const rows = [
      ...headerRows,
      ...contentRows,
      ...footerRows
    ];

    return {
      id: pageId,
      title: `AI Page ${pageId}`,
      rows: this.normalizeRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
      }
    };
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Wraps text to fit within specified width
   */
  private wrapText(text: string, width: number): string[] {
    if (!text) return [];
    
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (word.length > width) {
        // Word is too long, hard wrap it
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        
        for (let i = 0; i < word.length; i += width) {
          lines.push(word.slice(i, i + width));
        }
      } else if ((currentLine + ' ' + word).trim().length <= width) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Pads text to exactly the specified width
   */
  private padText(text: string, width: number = 40): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }
    return text + ' '.repeat(width - text.length);
  }

  /**
   * Normalizes rows to exactly 24 rows, each exactly 40 characters
   */
  private normalizeRows(rows: string[]): string[] {
    const normalized: string[] = [];

    // Take first 24 rows (or fewer if input is shorter)
    const rowsToProcess = rows.slice(0, 24);

    // Pad each row to exactly 40 characters
    for (const row of rowsToProcess) {
      normalized.push(this.padText(row, 40));
    }

    // Add empty rows if we have fewer than 24
    while (normalized.length < 24) {
      normalized.push(' '.repeat(40));
    }

    return normalized;
  }

  /**
   * Pads rows array to exactly 24 rows, each max 60 characters
   * @deprecated Use normalizeRows instead for 40-character layout
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 60) {
        return row.substring(0, 60);
      }
      return row.padEnd(60, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(60, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
