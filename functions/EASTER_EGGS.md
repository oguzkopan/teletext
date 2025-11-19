# Easter Egg Pages Documentation

This document describes the special Easter egg pages implemented in the Modern Teletext system.

## Page 404 - The Glitch

**Page Number:** 404  
**Theme:** Horror/Glitch  
**Requirements:** 13.1

### Description
The 404 error page has been transformed into a horror-themed Easter egg with animated glitch effects and disturbing ASCII art. When users navigate to a non-existent page or explicitly enter 404, they encounter this unsettling experience.

### Features
- Horror-themed ASCII art with glitch text effects
- Haunting mode automatically enabled (glitch effects, screen shake, color distortion)
- Cryptic messages suggesting something is wrong
- Navigation link to page 666 for those who dare
- Maintains the authentic teletext aesthetic while adding atmospheric horror

### Visual Elements
- Glitched "404" header with special characters
- Box-drawing characters creating ominous frames
- Strikethrough text effects (P̷A̷G̷E̷ ̴N̷O̷T̷ ̴F̷O̷U̷N̷D̷)
- Message: "The void stares back..."
- Teaser: "Try 666 if you dare..."

### Technical Implementation
- Sets `meta.haunting = true` to trigger frontend glitch effects
- Includes navigation links to safety (INDEX, HELP) and danger (666)
- All content respects the 40×24 character grid constraint

## Page 666 - The Cursed Page

**Page Number:** 666  
**Theme:** Horror/Cursed  
**Requirements:** 13.5

### Description
The ultimate horror Easter egg - page 666 features AI-generated disturbing content combined with maximum visual effects. This page represents the pinnacle of the haunting mode experience.

### Features
- **AI-Generated Horror Content**: Uses Google Gemini to generate unique, cryptic horror messages
- **Maximum Glitch Effects**: Applies the most intense screen shake, color distortion, and noise
- **Atmospheric ASCII Art**: Features occult symbols (⸸), disturbing patterns, and ominous frames
- **Dynamic Content**: Each visit can generate new horror content (when AI is enabled)
- **Fallback Content**: Static horror message when AI generation fails or is disabled

### Visual Elements
- Occult symbols border (⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸⸸)
- Triple "666" ASCII art header
- "THE CURSED PAGE" title with glitch effects
- AI-generated horror message (2-3 sentences)
- Warning message: "YOU HAVE BEEN WARNED"
- Geometric patterns (◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤)
- Cryptic closing messages about numbers and the void

### AI Integration
The page uses Google Vertex AI (Gemini Pro) to generate unique horror content:

```typescript
const prompt = `Generate a short, disturbing horror message (2-3 sentences, max 120 characters total) for a cursed teletext page 666. Make it cryptic, unsettling, and atmospheric. No formatting, just plain text.`;
```

**Example AI-Generated Content:**
- "They are watching. They have always been watching. And now they see you."
- "The numbers whisper secrets. You shouldn't have come here."
- "Something followed you from the last page. It's still here."

### Parameters
- `generateNew: boolean` - Controls whether to generate new AI content or use fallback
  - `true` (default): Attempts to generate new content via AI
  - `false`: Uses static fallback content

### Technical Implementation
- Sets `meta.haunting = true` for maximum glitch effects
- Sets `meta.aiGenerated = true/false` based on content source
- Wraps AI-generated text to fit 38-character width (with 2-char indent)
- Handles AI failures gracefully with fallback content
- All content respects the 40×24 character grid constraint
- Provides multiple "ESCAPE" links for users to leave

### Safety Features
- Multiple escape routes (ESCAPE, INDEX, BACK buttons)
- All links lead back to safe pages (page 100)
- Content is atmospheric but not genuinely harmful
- Respects the playful horror theme without being traumatic

## Frontend Integration

### Haunting Mode Detection
The frontend detects the `meta.haunting` flag and automatically enables glitch effects:

```typescript
useEffect(() => {
  if (currentPage?.meta?.haunting) {
    setTheme(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        glitch: true,
        noise: true
      }
    }));
  }
}, [currentPage]);
```

### Visual Effects Applied
When `haunting: true` is detected:
- **Screen Shake**: Periodic screen shake animation
- **Color Distortion**: Hue rotation and saturation effects
- **Increased Noise**: Higher static/noise overlay
- **Glitch Animation**: Random glitches every few seconds

## Router Configuration

Both Easter egg pages are handled as special cases in the router:

```typescript
// Special cases handled by StaticAdapter
if (pageNumber === 999 || pageNumber === 404 || pageNumber === 666) {
  return new StaticAdapter();
}
```

This ensures they work even when navigating from outside their normal magazine range.

## Testing

Comprehensive tests verify:
- Page structure (24 rows × 40 characters)
- Haunting mode flag is set
- Horror-themed content is present
- Navigation links work correctly
- AI generation can be disabled
- Fallback content works when AI fails

## Usage Examples

### Accessing Page 404
1. Navigate to any non-existent page (e.g., 150, 250)
2. Directly enter "404" on the remote
3. Follow the "404" link from page 404 itself

### Accessing Page 666
1. Directly enter "666" on the remote
2. Follow the "666" link from page 404
3. Navigate from any page that links to it

### Disabling AI Generation (for testing)
```typescript
const page = await adapter.getPage('666', { generateNew: false });
```

## Future Enhancements

Potential improvements for future versions:
- Sound effects (optional, user-controlled)
- More varied AI prompts based on time of day
- Additional Easter egg pages (e.g., 13, 313)
- User-submitted horror stories
- Seasonal variations (Halloween special content)
- Achievement system for finding all Easter eggs

## Credits

Inspired by:
- Classic teletext error pages
- Creepypasta and internet horror culture
- The "haunted technology" aesthetic
- Kiroween (Halloween) special event
