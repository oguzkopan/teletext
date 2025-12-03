// AI adapter for pages 500-599
// Provides AI-powered Q&A using Vertex AI

import { TeletextPage } from '@/types/teletext';
import { VertexAI } from '@google-cloud/vertexai';

export class AIAdapter {
  private vertexAI: VertexAI | null = null;
  private projectId: string;
  private location: string;

  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || process.env.VERTEX_LOCATION || 'us-central1';
    
    // Log configuration for debugging
    console.log('[AIAdapter] Initialized with:', {
      projectId: this.projectId,
      location: this.location,
      hasGoogleCloudProject: !!process.env.GOOGLE_CLOUD_PROJECT,
      hasVertexLocation: !!process.env.VERTEX_LOCATION,
      hasGoogleCloudLocation: !!process.env.GOOGLE_CLOUD_LOCATION
    });
  }

  private getVertexAI(): VertexAI {
    if (!this.vertexAI) {
      if (!this.projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT environment variable is not set');
      }
      
      console.log('[AIAdapter] Creating VertexAI instance:', {
        project: this.projectId,
        location: this.location
      });
      
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
    }
    return this.vertexAI;
  }

  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Page 500 with question - handles direct chat on page 500
    if (pageNumber === 500) {
      const question = params?.question || params?.q || '';
      if (!question) {
        // Return error or empty state - should not happen as page 500 is static
        throw new Error('Page 500 should be served from page registry');
      }
      return await this.getAIChatResponsePage(question);
    }

    // Custom question page (502) - handles user text input (legacy)
    if (pageNumber === 502) {
      const question = params?.question || params?.q || '';
      if (!question) {
        return this.getErrorPage('502', 'No question provided');
      }
      return await this.getCustomQuestionPage(question);
    }

    // AI answer pages (511-516) - pre-set questions
    if (pageNumber >= 511 && pageNumber <= 516) {
      return await this.getAIAnswerPage(pageNumber);
    }

    throw new Error(`Invalid AI page: ${pageId}`);
  }

  private async getAIAnswerPage(pageNumber: number): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Map page numbers to questions
    const questions: Record<number, string> = {
      511: 'Explain artificial intelligence in simple terms',
      512: 'What are the latest technology trends?',
      513: 'Tell me an interesting historical fact',
      514: 'Explain how the internet works',
      515: 'Tell me a joke',
      516: 'Write a short poem about teletext'
    };

    const question = questions[pageNumber];
    
    console.log(`[AIAdapter] Generating AI response for: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    // Wrap answer to fit 40-character width
    const wrappedAnswer = this.wrapText(answer, 40);

    const rows = [
      `${pageNumber} AI Answer ${timeStr}            P${pageNumber}`,
      '════════════════════════════════════════',
      '',
      'QUESTION:',
      ...this.wrapText(question, 40),
      '',
      'AI RESPONSE:',
      ...wrappedAnswer.slice(0, 10), // Limit to 10 lines
      '',
      '',
      '',
      'INDEX   ASK AGAIN   GAMES',
      ''
    ];

    return {
      id: pageNumber.toString(),
      title: 'AI Answer',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'ASK AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        aiGenerated: true
      }
    };
  }

  private async getAIChatResponsePage(question: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    console.log(`[AIAdapter] Generating AI response for question on page 500: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    // Wrap text to fit full-width layout (120 chars)
    const wrappedQuestion = this.wrapText(question, 120);
    const wrappedAnswer = this.wrapText(answer, 120);

    const rows = [
      `{cyan}500 {yellow}🤖 AI ORACLE CHAT 🤖 {cyan}${timeStr}                                                                                                                  {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{cyan}▓▓▓ YOUR QUESTION ▓▓▓',
      ...wrappedQuestion.slice(0, 3).map(line => `{yellow}${line}`),
      '',
      '{cyan}▓▓▓ AI RESPONSE ▓▓▓',
      ...wrappedAnswer.slice(0, 12).map(line => `{white}${line}`),
      '',
      '',
      '',
      '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{magenta}║ {yellow}💡 TIP:{white} Type another question and press ENTER to continue chatting                                                     {magenta}║',
      '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {yellow}BACK (←){white}=RETURN TO INDEX • Type another question and press {green}ENTER{white} to continue',
      ''
    ];

    return {
      id: '500',
      title: 'AI Oracle Chat',
      rows: this.padRows(rows, 28),
      links: [],  // No color button links - use back button to avoid conflicts with text input
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        aiGenerated: true,
        customQuestion: question,
        fullScreenLayout: true,
        useLayoutManager: true,
        renderedWithLayoutEngine: true,
        inputMode: 'text',
        textInputEnabled: true,
        textInputPrompt: 'Type another question:',
        textInputPlaceholder: 'Ask me anything...',
        aiChatPage: true,
        stayOnPageAfterSubmit: true
      }
    };
  }

  private async getCustomQuestionPage(question: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    console.log(`[AIAdapter] Generating AI response for custom question: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    // Wrap answer to fit 40-character width
    const wrappedAnswer = this.wrapText(answer, 40);

    const rows = [
      `502 AI Answer ${timeStr}               P502`,
      '════════════════════════════════════════',
      '',
      'YOUR QUESTION:',
      ...this.wrapText(question, 40).slice(0, 2),
      '',
      'AI RESPONSE:',
      ...wrappedAnswer.slice(0, 10), // Limit to 10 lines
      '',
      '',
      '',
      'INDEX   ASK AGAIN   GAMES',
      ''
    ];

    return {
      id: '502',
      title: 'AI Answer',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'ASK AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        aiGenerated: true,
        customQuestion: question
      }
    };
  }

  private getErrorPage(pageId: string, message: string): TeletextPage {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const rows = [
      `${pageId} AI Error ${timeStr}             P${pageId}`,
      '════════════════════════════════════════',
      '',
      'ERROR',
      '',
      ...this.wrapText(message, 40),
      '',
      'Please try again or select a',
      'pre-set question.',
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
      'INDEX   TRY AGAIN   GAMES',
      ''
    ];

    return {
      id: pageId,
      title: 'AI Error',
      rows: this.padRows(rows),
      links: [
        { label: 'INDEX', targetPage: '100', color: 'red' },
        { label: 'TRY AGAIN', targetPage: '501', color: 'green' },
        { label: 'GAMES', targetPage: '600', color: 'yellow' }
      ],
      meta: {
        source: 'AIAdapter',
        lastUpdated: new Date().toISOString(),
        error: message
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength - 3) + '...';
  }

  private wrapText(text: string, width: number): string[] {
    if (!text) return [''];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
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

    return lines.length > 0 ? lines : [''];
  }

  private padRows(rows: string[], targetRows: number = 24, targetWidth: number = 40): string[] {
    const paddedRows = rows.map(row => {
      // Don't truncate rows with color codes - they need extra space
      if (row.includes('{')) {
        return row;
      }
      if (row.length > targetWidth) {
        return row.substring(0, targetWidth);
      }
      return row.padEnd(targetWidth, ' ');
    });

    while (paddedRows.length < targetRows) {
      paddedRows.push(''.padEnd(targetWidth, ' '));
    }

    return paddedRows.slice(0, targetRows);
  }

  private async generateAIAnswer(question: string): Promise<string> {
    try {
      console.log('[AIAdapter] Initializing Vertex AI...');
      console.log('[AIAdapter] Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        hasGoogleCloudProject: !!process.env.GOOGLE_CLOUD_PROJECT,
        projectId: this.projectId,
        location: this.location
      });
      
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Answer this question in a concise, informative way suitable for a teletext display (max 400 characters):

Question: ${question}

Requirements:
- Keep answer under 400 characters
- Be clear and concise
- Use simple language
- No special formatting or markdown
- Make it interesting and engaging

Provide only the answer, no preamble.`;

      console.log('[AIAdapter] Calling Vertex AI with model: gemini-2.0-flash-exp');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      console.log('[AIAdapter] AI response received successfully');
      
      // Truncate if too long
      return text.length > 400 ? text.substring(0, 397) + '...' : text;
    } catch (error) {
      console.error('[AIAdapter] AI generation failed:', error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('[AIAdapter] Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      // Check for specific error types
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        console.error('[AIAdapter] Permission denied - Vertex AI API may not be enabled or service account lacks permissions');
        return 'AI service configuration error. Please contact administrator.';
      }
      
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        console.error('[AIAdapter] Resource not found - Check project ID and model availability');
        return 'AI model not available. Please try again later.';
      }
      
      if (errorMessage.includes('GOOGLE_CLOUD_PROJECT')) {
        console.error('[AIAdapter] Missing GOOGLE_CLOUD_PROJECT environment variable');
        return 'AI service not configured. Please contact administrator.';
      }
      
      // Fallback answer
      return 'AI service temporarily unavailable. Please try again later.';
    }
  }
}
