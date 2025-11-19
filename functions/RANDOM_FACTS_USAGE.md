# Random Facts Feature

## Overview

The Random Facts feature (page 620) displays interesting and surprising facts from various categories. Each time the page is loaded, a new random fact is displayed.

## Page Number

- **Page 620**: Random Fact Display

## Features

### Fact Categories

The system includes facts from the following categories:
- **Science**: Natural phenomena, biology, chemistry
- **History**: Historical events and timelines
- **Technology**: Computing, inventions, and innovations
- **Nature**: Animals, plants, and ecosystems
- **Space**: Astronomy and space exploration
- **General**: Miscellaneous interesting facts

### API Integration

The adapter attempts to fetch facts from the API Ninjas Facts API:
- **Endpoint**: `https://api.api-ninjas.com/v1/facts`
- **Authentication**: Requires `API_NINJAS_KEY` environment variable
- **Timeout**: 3 seconds
- **Fallback**: If API fails, uses curated database

### Curated Database

The system includes 30+ curated facts covering all categories. These are used when:
- The API is unavailable
- The API key is not configured
- The API request times out

## Usage

### Accessing Random Facts

1. Navigate to page 620 from the games index (page 600)
2. Each page load displays a new random fact
3. Reload the page to see a different fact

### Navigation

From page 620, users can:
- Press RED button or navigate to page 100 for main index
- Press GREEN button or navigate to page 601 for quiz
- Press YELLOW button or navigate to page 600 for games index

## Configuration

### Environment Variables

To enable API integration, set:

```bash
API_NINJAS_KEY=your_api_key_here
```

Get your API key from: https://api-ninjas.com/

### Without API Key

The feature works perfectly without an API key using the curated database of facts.

## Implementation Details

### Fact Format

Each fact includes:
- **text**: The fact content (formatted to fit 40×24 constraint)
- **category**: The topic category

### Text Formatting

- Facts are automatically wrapped to fit within 40 characters per line
- Long facts span multiple rows
- All pages maintain the 24-row constraint

### Caching

Random facts pages are not cached (cache duration: 0 seconds) to ensure a new fact on each visit.

## Example Facts

### Science
"Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible."

### Technology
"The first teletext service, BBC Ceefax, launched in 1974 and ran until 2012. It displayed 40 characters by 24 rows."

### Space
"A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun."

## Requirements Validation

This implementation satisfies the following requirements:

- **25.1**: Page 620 displays random facts ✓
- **25.2**: Integrates with facts API with curated fallback ✓
- **25.3**: New fact on each page reload ✓
- **25.4**: Facts formatted to fit 40×24 constraint ✓
- **25.5**: Facts categorized by topic ✓

## Testing

The feature includes comprehensive unit tests covering:
- Page rendering with correct format
- Text wrapping and formatting
- Navigation links
- Error handling

Run tests with:
```bash
cd functions
npm test -- GamesAdapter.test.ts
```

## Future Enhancements

Potential improvements:
- User preference for specific categories
- Fact rating system
- Share facts functionality
- Daily fact of the day
- Fact history tracking
