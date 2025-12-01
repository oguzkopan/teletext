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
    this.location = process.env.VERTEX_LOCATION || 'us-central1';
  }

  private getVertexAI(): VertexAI {
    if (!this.vertexAI) {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.location
      });
    }
    return this.vertexAI;
  }

  async getPage(pageId: string, params?: Record<string, any>): Promise<TeletextPage> {
    const pageNumber = parseInt(pageId, 10);

    // Custom question page (502) - handles user text input
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

    const rows = [
      `{cyan}${pageNumber} {yellow}🤖 AI ANSWER 🤖 {cyan}${timeStr}                                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{yellow}QUESTION:',
      `{cyan}${question}`,
      '',
      '{yellow}AI RESPONSE:',
      `{white}${answer}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{magenta}║ {yellow}💡 TIP:{white} Go back to page 501 to ask another question!                                                                {magenta}║',
      '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}100{white}=INDEX {green}501{white}=ASK AGAIN {yellow}600{white}=GAMES',
      ''
    ];

    return {
      id: pageNumber.toString(),
      title: 'AI Answer',
      rows,
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

  private async getCustomQuestionPage(question: string): Promise<TeletextPage> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    console.log(`[AIAdapter] Generating AI response for custom question: ${question}`);
    const answer = await this.generateAIAnswer(question);
    console.log(`[AIAdapter] AI response generated, length: ${answer.length} chars`);

    const rows = [
      `{cyan}502 {yellow}🤖 AI ANSWER 🤖 {cyan}${timeStr}                                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{yellow}YOUR QUESTION:',
      `{cyan}${this.truncateText(question, 120)}`,
      '',
      '{yellow}AI RESPONSE:',
      `{white}${answer}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
      '{magenta}║ {yellow}💡 TIP:{white} Go back to page 501 to ask another question!                                                                {magenta}║',
      '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}100{white}=INDEX {green}501{white}=ASK AGAIN {yellow}600{white}=GAMES',
      ''
    ];

    return {
      id: '502',
      title: 'AI Answer',
      rows,
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
      `{cyan}${pageId} {yellow}🤖 AI ERROR 🤖 {cyan}${timeStr}                                                                                                                     {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '',
      '{red}ERROR',
      '',
      `{white}${message}`,
      '',
      '{white}Please try again or select a pre-set question.',
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
      '',
      '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
      '{cyan}NAVIGATION: {red}100{white}=INDEX {green}501{white}=TRY AGAIN {yellow}600{white}=GAMES',
      ''
    ];

    return {
      id: pageId,
      title: 'AI Error',
      rows,
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

  private async generateAIAnswer(question: string): Promise<string> {
    try {
      console.log('[AIAdapter] Initializing Vertex AI...');
      const vertexAI = this.getVertexAI();
      const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Answer this question in a concise, informative way suitable for a teletext display (max 500 characters):

Question: ${question}

Requirements:
- Keep answer under 500 characters
- Be clear and concise
- Use simple language
- No special formatting or markdown
- Make it interesting and engaging

Provide only the answer, no preamble.`;

      console.log('[AIAdapter] Calling Vertex AI...');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0 || !candidates[0].content.parts.length) {
        throw new Error('No response from AI');
      }

      const text = candidates[0].content.parts[0].text || '';
      console.log('[AIAdapter] AI response received');
      
      // Truncate if too long
      return text.length > 500 ? text.substring(0, 497) + '...' : text;
    } catch (error) {
      console.error('[AIAdapter] ERROR generating AI answer:', error);
      console.error('[AIAdapter] Using fallback answer');
      
      // Fallback answers
      const fallbackAnswers: Record<string, string> = {
        'Explain artificial intelligence in simple terms': 'Artificial Intelligence (AI) is when computers are programmed to think and learn like humans. They can recognize patterns, make decisions, and improve over time. Examples include voice assistants, recommendation systems, and self-driving cars. AI uses algorithms and data to solve problems that normally require human intelligence.',
        'What are the latest technology trends?': 'Current tech trends include: AI and machine learning becoming mainstream, cloud computing growth, 5G networks expanding, electric vehicles adoption, renewable energy advances, quantum computing research, blockchain applications, and augmented reality experiences. Remote work technology continues to evolve rapidly.',
        'Tell me an interesting historical fact': 'The first computer programmer was Ada Lovelace in 1843. She wrote the first algorithm intended for a machine - Charles Babbage\'s Analytical Engine. Her notes included what is now considered the first computer program, making her a pioneer in computing over 100 years before modern computers existed.',
        'Explain how the internet works': 'The internet is a global network of connected computers. When you visit a website, your computer sends a request through your internet provider to a server hosting that site. The server sends back the data, which your browser displays. This happens through cables, routers, and wireless signals, all using standardized protocols like TCP/IP.',
        'Tell me a joke': 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
        'Write a short poem about teletext': 'Pixels dance in rows of forty,\nTwenty-four lines, crisp and sporty.\nColors bright on CRT screens,\nTeletext shows what information means.\nPress a number, watch it flow,\nRetro tech from long ago! 📺'
      };

      return fallbackAnswers[question] || 'I apologize, but I am unable to generate a response at this time. Please try again later or try one of the other games!';
    }
  }
}
