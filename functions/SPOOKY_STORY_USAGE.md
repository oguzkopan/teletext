# Spooky Story Generator - Kiroween Special

## Overview

The Spooky Story Generator is a Halloween-themed feature that uses Google Gemini AI to create spine-chilling horror stories through a menu-driven interface. This feature is part of the AI Oracle (pages 500-599) and provides an atmospheric, teletext-style horror story experience.

## Page Structure

### Page 505: Spooky Story Menu
The main entry point for the spooky story generator. Users can select from 6 horror themes:

1. **Haunted House** - Creaking floors, mysterious shadows, and unexplained phenomena
2. **Ghost Story** - Restless spirits seeking revenge or redemption
3. **Monster Tale** - Terrifying creatures lurking in the darkness
4. **Psychological Horror** - Mind-bending terror that blurs reality
5. **Cursed Object** - Items that bring misfortune to all who possess them
6. **Surprise Me!** - AI chooses a creative and terrifying theme

### Page 506: Story Length Selection
After selecting a theme, users choose the story length:

1. **Short & Sweet** (1-2 pages) - ~300-400 words
2. **Medium Chill** (3-4 pages) - ~600-800 words
3. **Long & Terrifying** (5+ pages) - ~1000-1200 words

### Pages 507-509: Story Display
The generated horror story is displayed across multiple pages with:
- 🎃 KIROWEEN SPECIAL branding
- Atmospheric presentation
- "TURN THE PAGE IF YOU DARE" continuation prompts
- "THE END" marker on the final page
- Navigation links to read more or generate another story

## Features

### AI-Powered Story Generation
- Uses Google Gemini (gemini-1.5-flash) to generate unique horror stories
- Each story is tailored to the selected theme and length
- Stories are formatted for optimal teletext display (40 characters wide)

### Conversation History
- All generated stories are saved to Firestore conversation history
- Stories can be reviewed later from page 520 (Conversation History)
- Each story is tagged with its theme and generation timestamp

### Atmospheric Presentation
- Special Kiroween branding on all story pages
- Horror-themed visual elements (🎃 pumpkin emoji)
- Continuation prompts that build suspense
- Proper pagination for longer stories

## Technical Implementation

### Story Generation Prompt
The system builds structured prompts based on user selections:

```typescript
const prompt = `Write a spine-chilling horror story about ${themeText}.

The story should be approximately ${lengthText} long.

Requirements:
- Create a genuinely scary and atmospheric narrative
- Build tension and suspense throughout
- Include vivid, unsettling descriptions
- End with a disturbing or shocking conclusion
- Use simple, clear language suitable for teletext display
- Write in paragraphs with clear breaks between them
- Make it genuinely creepy and memorable
```

### Page Formatting
Stories are formatted with:
- 18 lines of content per page (leaving room for header/footer)
- Automatic text wrapping at 40 characters
- Word boundary detection for clean line breaks
- Continuation links between pages
- Context ID for conversation tracking

### Conversation Storage
Each story is stored in Firestore with:
- Unique context ID
- Mode: 'spooky_story'
- Theme and length parameters
- Full conversation history (prompt + response)
- 24-hour expiration

## Usage Flow

1. User navigates to page 500 (AI Oracle Index)
2. Selects option 3 or navigates directly to page 505
3. Chooses a horror theme (1-6)
4. Selects story length (1-3)
5. AI generates the story (may take 5-10 seconds)
6. Story is displayed starting at page 507
7. User can navigate through pages to read the full story
8. Story is saved to conversation history for later review

## Error Handling

If story generation fails:
- Error page is displayed at page 507
- User can retry by returning to page 505
- Error details are logged for debugging
- Graceful fallback ensures system remains functional

## Testing

The spooky story generator includes comprehensive tests:
- Page generation tests (505, 506)
- Story formatting tests (single and multi-page)
- Theme handling tests (all 6 themes)
- Continuation prompt tests
- Page dimension invariant tests (24 rows × 40 chars)

## Future Enhancements

Potential improvements for future versions:
- Haunting mode visual effects (glitch, screen shake)
- Sound effects (optional, user-controlled)
- More horror themes and sub-genres
- Interactive story choices (branching narratives)
- Story rating and favorites system
- Seasonal themes beyond Halloween

## Notes

- Stories are generated in real-time and may vary in quality
- The AI is instructed to create "genuinely scary" content appropriate for Halloween entertainment
- All stories respect the 40×24 teletext format constraints
- Stories are automatically cleaned of markdown and special formatting
