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
export class AIAdapter implements ContentAdapter {
  private vertexAI: VertexAI;
  private firestore: FirebaseFirestore.Firestore;
  private projectId: string;
  private location: string;

  constructor() {
    this.firestore = admin.firestore();
    
    // Get project configuration from environment
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID || '';
    this.location = process.env.VERTEX_LOCATION || 'us-central1';

    // Initialize Vertex AI
    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location
    });
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
      return this.getSpookyStoryLengthPage(params);
    } else if (pageNumber >= 507 && pageNumber <= 509) {
      // Spooky story response pages - generated dynamically
      return this.getPlaceholderPage(pageId);
    } else if (pageNumber === 510) {
      return this.getQATopicSelectionPage();
    } else if (pageNumber === 511) {
      return this.getCountrySelectionPage(params);
    } else if (pageNumber === 512) {
      return this.getQuestionTypeSelectionPage(params);
    } else if (pageNumber >= 513 && pageNumber <= 519) {
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
   * Gets the cache key for a page
   * @param pageId - The page ID
   * @returns The cache key
   */
  getCacheKey(pageId: string): string {
    return `ai_${pageId}`;
  }

  /**
   * Gets the cache duration for AI pages
   * AI pages are not cached (0 seconds) as they are dynamic
   * @returns Cache duration in seconds
   */
  getCacheDuration(): number {
    return 0; // Don't cache AI pages
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
        cacheStatus: 'fresh'
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
        { label: 'BACK', targetPage: '500', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the story length selection page (506)
   */
  private getSpookyStoryLengthPage(params?: Record<string, any>): TeletextPage {
    const theme = params?.theme || 'unknown';
    const themeNames: Record<string, string> = {
      '1': 'Haunted House',
      '2': 'Ghost Story',
      '3': 'Monster Tale',
      '4': 'Psychological Horror',
      '5': 'Cursed Object',
      '6': 'Surprise Me!'
    };
    const themeName = themeNames[theme] || 'Unknown Theme';

    const rows = [
      'STORY LENGTH                 P506',
      '════════════════════════════════════',
      '',
      `Theme: ${this.truncateText(themeName, 30)}`,
      '',
      'SELECT STORY LENGTH:',
      '',
      '1. Short & Sweet (1-2 pages)',
      '2. Medium Chill (3-4 pages)',
      '3. Long & Terrifying (5+ pages)',
      '',
      'Longer stories provide more',
      'atmospheric detail and suspense.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'INDEX   AI      BACK',
      ''
    ];

    return {
      id: '506',
      title: 'Story Length',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '505', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
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
        { label: 'BACK', targetPage: '500', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the country/region selection page (511)
   */
  private getCountrySelectionPage(params?: Record<string, any>): TeletextPage {
    const topic = params?.topic || 'unknown';
    const topicNames: Record<string, string> = {
      '1': 'News & Current Events',
      '2': 'Technology & Science',
      '3': 'Career & Education',
      '4': 'Health & Wellness',
      '5': 'General Knowledge'
    };
    const topicName = topicNames[topic] || 'Unknown Topic';

    const rows = [
      'SELECT REGION                P511',
      '════════════════════════════════════',
      '',
      `Topic: ${this.truncateText(topicName, 30)}`,
      '',
      'SELECT YOUR REGION:',
      '',
      '1. United States',
      '2. United Kingdom',
      '3. Europe',
      '4. Asia',
      '5. Global/International',
      '',
      'This helps the AI provide',
      'region-specific information.',
      '',
      '',
      '',
      '',
      '',
      '',
      'INDEX   AI      BACK',
      ''
    ];

    return {
      id: '511',
      title: 'Region Selection',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '510', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates the question type selection page (512)
   */
  private getQuestionTypeSelectionPage(params?: Record<string, any>): TeletextPage {
    const topic = params?.topic || 'unknown';
    const region = params?.region || 'unknown';
    
    const topicNames: Record<string, string> = {
      '1': 'News',
      '2': 'Tech',
      '3': 'Career',
      '4': 'Health',
      '5': 'General'
    };
    const regionNames: Record<string, string> = {
      '1': 'US',
      '2': 'UK',
      '3': 'Europe',
      '4': 'Asia',
      '5': 'Global'
    };

    const rows = [
      'QUESTION TYPE                P512',
      '════════════════════════════════════',
      '',
      `Topic: ${topicNames[topic] || 'Unknown'}`,
      `Region: ${regionNames[region] || 'Unknown'}`,
      '',
      'WHAT WOULD YOU LIKE?',
      '',
      '1. Latest Updates',
      '2. Explanation/How-To',
      '3. Recommendations',
      '4. Comparison',
      '5. General Question',
      '',
      'Select the type of information',
      'you need.',
      '',
      '',
      '',
      '',
      '',
      'INDEX   AI      BACK',
      ''
    ];

    return {
      id: '512',
      title: 'Question Type',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' },
        { label: 'BACK', targetPage: '511', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
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
      const pages = this.formatSpookyStoryResponse(aiResponse, '507', newContextId || '', theme);

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
   * Formats spooky story response into teletext pages with haunting effects
   */
  formatSpookyStoryResponse(
    response: string,
    startPageId: string,
    contextId: string,
    theme: string
  ): TeletextPage[] {
    const pages: TeletextPage[] = [];
    const wrappedLines = this.wrapText(response, 40);
    
    // Split into pages of 18 rows (leaving 6 for header/footer/effects)
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
      
      const rows = [
        `${this.truncateText(themeTitle, 28).padEnd(28, ' ')} P${pageId}`,
        '════════════════════════════════════',
        '🎃 KIROWEEN SPECIAL 🎃',
        '',
        ...pageLines
      ];
      
      // Add navigation hint if there are more pages
      if (i < pageCount - 1) {
        rows.push('');
        rows.push('>>> TURN THE PAGE IF YOU DARE >>>');
      } else {
        rows.push('');
        rows.push('═══════ THE END ═══════');
      }
      
      const links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [
        { label: 'INDEX', targetPage: '100', color: 'red' as const },
        { label: 'AI', targetPage: '500', color: 'green' as const }
      ];
      
      if (i < pageCount - 1) {
        links.push({ label: 'NEXT', targetPage: (pageNumber + 1).toString(), color: 'yellow' as const });
      } else {
        links.push({ label: 'AGAIN', targetPage: '505', color: 'yellow' as const });
      }
      
      pages.push({
        id: pageId,
        title: themeTitle,
        rows: this.padRows(rows),
        links,
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh',
          aiContextId: contextId
        }
      });
    }
    
    return pages;
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
          cacheStatus: 'fresh'
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
            cacheStatus: 'fresh'
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
          cacheStatus: 'fresh',
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
   * Generates AI response using Vertex AI
   * @param prompt - The prompt to send to the AI
   * @param conversationHistory - Optional conversation history for context
   * @returns The AI response text
   */
  async generateAIResponse(
    prompt: string,
    conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>
  ): Promise<string> {
    try {
      const model = this.vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
      });

      // Build conversation context
      const contents = [];
      
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(entry => {
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
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Formats AI response into teletext pages
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
    const wrappedLines = this.wrapText(response, 40);
    
    // Split into pages of 20 rows (leaving 4 for header/footer)
    const linesPerPage = 20;
    const pageCount = Math.ceil(wrappedLines.length / linesPerPage);
    
    for (let i = 0; i < pageCount; i++) {
      const pageNumber = parseInt(startPageId, 10) + i;
      const pageId = pageNumber.toString();
      const startLine = i * linesPerPage;
      const endLine = Math.min(startLine + linesPerPage, wrappedLines.length);
      const pageLines = wrappedLines.slice(startLine, endLine);
      
      const rows = [
        `AI RESPONSE                  P${pageId}`,
        '════════════════════════════════════',
        '',
        ...pageLines
      ];
      
      // Add navigation hint if there are more pages
      if (i < pageCount - 1) {
        rows.push('');
        rows.push(`>>> CONTINUED ON PAGE ${pageNumber + 1} >>>`);
      }
      
      const links: Array<{ label: string; targetPage: string; color?: 'red' | 'green' | 'yellow' | 'blue' }> = [
        { label: 'INDEX', targetPage: '100', color: 'red' as const },
        { label: 'AI', targetPage: '500', color: 'green' as const }
      ];
      
      if (i < pageCount - 1) {
        links.push({ label: 'NEXT', targetPage: (pageNumber + 1).toString(), color: 'yellow' as const });
      }
      
      pages.push({
        id: pageId,
        title: 'AI Response',
        rows: this.padRows(rows),
        links,
        meta: {
          source: 'AIAdapter',
          lastUpdated: new Date().toISOString(),
          cacheStatus: 'fresh',
          aiContextId: contextId
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
   * Creates an error page when operations fail
   */
  private getErrorPage(pageId: string, title: string, error: any): TeletextPage {
    const rows = [
      `${this.truncateText(title.toUpperCase(), 28).padEnd(28, ' ')} P${pageId}`,
      '════════════════════════════════════',
      '',
      'SERVICE UNAVAILABLE',
      '',
      'Unable to process AI request.',
      '',
      'This could be due to:',
      '• AI service is temporarily down',
      '• Network connectivity issues',
      '• Invalid conversation context',
      '',
      'Please try again in a few moments.',
      '',
      '',
      '',
      '',
      '',
      'Press 500 for AI index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   AI',
      ''
    ];

    return {
      id: pageId,
      title: title,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
      }
    };
  }

  /**
   * Creates a placeholder page for pages not yet implemented
   */
  private getPlaceholderPage(pageId: string): TeletextPage {
    const rows = [
      `AI PAGE ${pageId}                P${pageId}`,
      '════════════════════════════════════',
      '',
      'COMING SOON',
      '',
      `AI page ${pageId} is under construction.`,
      '',
      'This page will be available when',
      'the full AI features are implemented.',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Press 500 for AI index',
      'Press 100 for main index',
      '',
      '',
      'INDEX   AI',
      ''
    ];

    return {
      id: pageId,
      title: `AI Page ${pageId}`,
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'AI', targetPage: '500', color: 'green' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh'
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
   * Pads rows array to exactly 24 rows, each max 40 characters
   */
  private padRows(rows: string[]): string[] {
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    return paddedRows.slice(0, 24);
  }
}
