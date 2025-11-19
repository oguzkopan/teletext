# Page Directory

Complete reference of all teletext pages in Modern Teletext.

## Quick Navigation

- [System Pages (100-199)](#system-pages-100-199)
- [News (200-299)](#news-200-299)
- [Sports (300-399)](#sports-300-399)
- [Markets (400-419)](#markets-400-419)
- [Weather (420-449)](#weather-420-449)
- [AI Oracle (500-599)](#ai-oracle-500-599)
- [Games (600-699)](#games-600-699)
- [Settings (700-799)](#settings-700-799)
- [Developer Tools (800-899)](#developer-tools-800-899)
- [Easter Eggs](#easter-eggs)

## System Pages (100-199)

### 100 - Main Index
**Description**: Primary landing page with magazine listings and Fastext navigation  
**Content**: 
- Welcome message
- Magazine directory (News, Sports, Markets, AI, Games, Settings, Dev)
- Current date and time
- Fastext links to major sections

**Navigation**:
- RED: News (200)
- GREEN: Sports (300)
- YELLOW: Markets (400)
- BLUE: AI Oracle (500)

---

### 101 - How It Works
**Description**: Explanation of teletext concept and navigation  
**Content**:
- Brief history of teletext
- How to navigate using page numbers
- Keyboard shortcuts
- Fastext button explanation

**Navigation**:
- RED: Back to Index (100)
- GREEN: Help (999)

---

### 120 - Emergency Bulletins
**Description**: Breaking alerts and emergency information  
**Content**:
- Active emergency alerts (if any)
- Breaking news notifications
- Weather warnings
- System announcements

**Update Frequency**: Real-time (60 seconds)  
**Cache TTL**: 1 minute

**Sub-pages**:
- 121-129: Alert history

---

### 199 - About/Credits
**Description**: Project information and credits  
**Content**:
- Project description
- Technology stack
- Source code repository
- Contributors
- License information

**Navigation**:
- RED: Back to Index (100)
- GREEN: Developer Tools (800)

---

### 404 - Error Page
**Description**: Page not found with horror theme  
**Content**:
- Animated glitch effects
- Horror-themed ASCII art
- Error message
- Navigation suggestions

**Special Effects**: Glitch animation, screen shake

---

### 999 - Help
**Description**: Navigation instructions and keyboard shortcuts  
**Content**:
- How to enter page numbers
- Keyboard shortcuts reference
- Fastext button guide
- Tips and tricks

**Navigation**:
- RED: Back to Index (100)
- GREEN: Keyboard Shortcuts (720)

---

## News (200-299)

### 200 - News Index
**Description**: News category selection menu  
**Content**:
- Top Headlines (201)
- World News (202)
- Local News (203)
- Topic categories (210-219)

**Navigation**:
- RED: Index (100)
- GREEN: Top Headlines (201)
- YELLOW: World (202)
- BLUE: Tech (210)

---

### 201 - Top Headlines
**Description**: Latest breaking news from multiple sources  
**Content**:
- 6-8 top headlines
- Source attribution
- Brief summaries
- Continuation links

**Update Frequency**: 5 minutes  
**Cache TTL**: 5 minutes  
**API**: NewsAPI

**Navigation**:
- RED: News Index (200)
- GREEN: Next Page (202)

---

### 202 - World News
**Description**: International news coverage  
**Content**:
- Global news stories
- International affairs
- Regional conflicts
- Diplomatic news

**Update Frequency**: 5 minutes  
**Cache TTL**: 5 minutes

---

### 203 - Local News
**Description**: Regional and local news  
**Content**:
- Local headlines
- Community news
- Regional events

**Update Frequency**: 5 minutes  
**Cache TTL**: 5 minutes

---

### 210-219 - Topic-Specific News

#### 210 - Technology News
**Content**: Tech industry news, product launches, innovations

#### 211 - Business News
**Content**: Markets, economy, corporate news

#### 212 - Entertainment News
**Content**: Movies, TV, music, celebrity news

#### 213 - Science News
**Content**: Scientific discoveries, research, space

#### 214 - Health News
**Content**: Medical news, health tips, wellness

#### 215 - Politics News
**Content**: Political developments, elections, policy

#### 216 - Sports News
**Content**: Sports news (different from live scores)

#### 217 - Environment News
**Content**: Climate, sustainability, conservation

#### 218 - Education News
**Content**: Schools, universities, learning

#### 219 - Travel News
**Content**: Tourism, destinations, travel tips

**Update Frequency**: 5 minutes  
**Cache TTL**: 5 minutes

---

## Sports (300-399)

### 300 - Sports Index
**Description**: Sports section menu  
**Content**:
- Live Scores (301)
- League Tables (302)
- Team Watchlist (310)
- Sport categories

**Navigation**:
- RED: Index (100)
- GREEN: Live Scores (301)
- YELLOW: Tables (302)
- BLUE: Watchlist (310)

---

### 301 - Live Scores
**Description**: Real-time match scores and updates  
**Content**:
- Ongoing matches with live scores
- Match status (1st half, HT, 2nd half, FT)
- Recent results
- Upcoming fixtures

**Update Frequency**: 2 minutes (1 minute during live events)  
**Cache TTL**: 2 minutes  
**API**: API-Football

**Format**:
```
LIVE SCORES                    301
────────────────────────────────────
MAN UTD  2 - 1  CHELSEA        FT
ARSENAL  1 - 1  LIVERPOOL      87'
BAYERN   3 - 0  DORTMUND       HT
```

---

### 302 - League Tables
**Description**: Team rankings and standings  
**Content**:
- League positions
- Points, wins, draws, losses
- Goals for/against
- Form guide

**Update Frequency**: 2 minutes  
**Cache TTL**: 2 minutes

**Format**:
```
PREMIER LEAGUE TABLE           302
────────────────────────────────────
Pos Team            P  W  D  L  Pts
 1  Man City       20 15  3  2  48
 2  Arsenal        20 14  4  2  46
 3  Liverpool      20 13  5  2  44
```

---

### 310 - Team Watchlist Configuration
**Description**: Configure favorite teams  
**Content**:
- Add/remove teams from watchlist
- Up to 5 favorite teams
- Quick access to team pages

**Navigation**:
- RED: Sports Index (300)
- GREEN: Team 1 (311)

---

### 311-315 - Dedicated Team Pages
**Description**: Detailed information for watchlist teams  
**Content**:
- Team statistics
- Recent results
- Upcoming fixtures
- Squad information
- League position

**Update Frequency**: 2 minutes  
**Cache TTL**: 2 minutes

---

## Markets (400-419)

### 400 - Markets Summary
**Description**: Financial markets overview  
**Content**:
- Major indices (S&P 500, NASDAQ, FTSE)
- Top movers
- Market sentiment
- Quick links to crypto, stocks, forex

**Update Frequency**: 1 minute  
**Cache TTL**: 1 minute

**Navigation**:
- RED: Index (100)
- GREEN: Crypto (401)
- YELLOW: Stocks (402)
- BLUE: Forex (410)

---

### 401 - Cryptocurrency Prices
**Description**: Real-time cryptocurrency market data  
**Content**:
- Top 10-15 cryptocurrencies
- Current prices in USD
- 24h percentage changes
- Market cap rankings

**Update Frequency**: 1 minute  
**Cache TTL**: 1 minute  
**API**: CoinGecko

**Format**:
```
CRYPTOCURRENCY PRICES          401
────────────────────────────────────
BTC  $43,250.00        +2.5%  ↑
ETH   $2,280.50        +1.8%  ↑
BNB     $315.20        -0.5%  ↓
```

---

### 402 - Stock Market Data
**Description**: Major stock indices and individual stocks  
**Content**:
- S&P 500, NASDAQ, DOW
- Top gainers/losers
- Popular stocks (AAPL, GOOGL, MSFT, etc.)
- Percentage changes

**Update Frequency**: 1 minute  
**Cache TTL**: 1 minute  
**API**: Alpha Vantage

---

### 410 - Foreign Exchange Rates
**Description**: Currency exchange rates  
**Content**:
- 10 major currency pairs
- USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, CNY
- 4 decimal precision
- 24h percentage changes

**Update Frequency**: 5 minutes  
**Cache TTL**: 5 minutes

**Format**:
```
FOREIGN EXCHANGE RATES         410
────────────────────────────────────
EUR/USD  1.0850        +0.2%  ↑
GBP/USD  1.2650        -0.1%  ↓
USD/JPY  148.50        +0.3%  ↑
```

---

## Weather (420-449)

### 420 - Weather Index
**Description**: City selection for weather forecasts  
**Content**:
- List of 20+ major cities
- Quick access to city forecasts
- Regional groupings

**Navigation**:
- RED: Index (100)
- GREEN: London (420-01)
- YELLOW: New York (420-02)

---

### 420-01 to 420-34 - City Weather Pages
**Description**: Detailed weather for specific cities  
**Content**:
- Current conditions
- Temperature (°C and °F)
- Humidity, wind speed
- 5-day forecast
- Sunrise/sunset times

**Update Frequency**: 30 minutes  
**Cache TTL**: 30 minutes  
**API**: OpenWeatherMap

**Major Cities**:
- 420-01: London
- 420-02: New York
- 420-03: Paris
- 420-04: Tokyo
- 420-05: Sydney
- 420-06: Berlin
- 420-07: Madrid
- 420-08: Rome
- 420-09: Amsterdam
- 420-10: Dubai
- 420-11: Singapore
- 420-12: Hong Kong
- 420-13: Toronto
- 420-14: Los Angeles
- 420-15: Chicago
- 420-16: San Francisco
- 420-17: Miami
- 420-18: Seattle
- 420-19: Boston
- 420-20: Washington DC

**Format**:
```
LONDON WEATHER              420-01
────────────────────────────────────
Current: Partly Cloudy
Temp: 15°C (59°F)
Humidity: 65%
Wind: 12 km/h NW

5-Day Forecast:
Mon: ☁️  16°C  Rain likely
Tue: ⛅  14°C  Partly cloudy
Wed: ☀️  18°C  Sunny
```

---

## AI Oracle (500-599)

### 500 - AI Index
**Description**: AI service selection menu  
**Content**:
- Q&A Service (510)
- Spooky Story Generator (505)
- Conversation History (520)
- Service descriptions

**Navigation**:
- RED: Index (100)
- GREEN: Q&A (510)
- YELLOW: Stories (505)
- BLUE: History (520)

---

### 505 - Spooky Story Generator
**Description**: AI-generated horror stories  
**Content**:
- Theme selection menu
- Story length options
- Generated stories with atmospheric presentation

**Themes**:
1. Haunted House
2. Ghost Story
3. Monster Tale
4. Psychological Horror
5. Cosmic Horror

**Special Effects**: Haunting mode visual effects

**Navigation**:
- RED: AI Index (500)
- GREEN: Generate Story

---

### 510-519 - Q&A Flows

#### 510 - Topic Selection
**Description**: Choose Q&A topic  
**Content**:
1. News & Current Events
2. Technology
3. Career Advice
4. Health & Wellness
5. General Knowledge

#### 511-519 - Q&A Response Pages
**Description**: AI-generated answers  
**Content**:
- Question recap
- Detailed answer
- Follow-up options
- Navigation to next page if answer is long

**AI Model**: Google Gemini Pro via Vertex AI

---

### 520 - Conversation History Index
**Description**: List of recent AI conversations  
**Content**:
- Last 10 conversations
- Timestamps
- Conversation topics
- Quick access links

**Navigation**:
- RED: AI Index (500)
- GREEN: Conversation 1 (521)

---

### 521-529 - Conversation Detail Pages
**Description**: Full conversation thread display  
**Content**:
- Complete conversation history
- User questions and AI responses
- Timestamps
- Delete option

---

## Games (600-699)

### 600 - Games Index
**Description**: Games section menu  
**Content**:
- Quiz of the Day (601)
- Bamboozle Game (610)
- Random Facts (620)
- Game descriptions

**Navigation**:
- RED: Index (100)
- GREEN: Quiz (601)
- YELLOW: Bamboozle (610)
- BLUE: Facts (620)

---

### 601 - Quiz of the Day
**Description**: Daily trivia challenge  
**Content**:
- 10 multiple-choice questions
- Numeric answer selection (1-4)
- Immediate feedback
- Score tracking

**API**: Open Trivia Database

**Flow**:
1. Question display
2. Answer selection (1-4)
3. Result page (correct/incorrect)
4. Next question
5. Final score with AI commentary

---

### 610 - Bamboozle Game
**Description**: Branching quiz adventure  
**Content**:
- Story-driven quiz
- Choices affect story path
- 3+ different endings
- Restart option

**Paths**:
- Path A: Correct answers lead to success
- Path B: Mixed answers lead to partial success
- Path C: Wrong answers lead to humorous failure

**Pages**: 610-619 (branching structure)

---

### 620 - Random Facts
**Description**: Interesting facts from various topics  
**Content**:
- Random fact display
- Fact categories (science, history, technology)
- Refresh for new fact

**API**: Facts API or curated database

**Categories**:
- Science
- History
- Technology
- Nature
- Space
- Human Body
- Geography

---

## Settings (700-799)

### 700 - Theme Selection
**Description**: Choose visual theme  
**Content**:
- Available themes with previews
- Theme descriptions
- Apply button

**Themes**:
1. Classic Ceefax (Yellow on blue, BBC colors)
2. ORF (Austrian teletext colors)
3. High Contrast (White on black)
4. Haunting Mode (Green on black with glitch effects)

**Navigation**:
- RED: Index (100)
- GREEN: CRT Effects (701)
- YELLOW: Shortcuts (710)

---

### 701 - CRT Effects Controls
**Description**: Adjust visual effects  
**Content**:
- Scanline intensity slider (0-100%)
- Screen curvature slider (0-10px)
- Noise level slider (0-100%)
- Real-time preview
- Reset to defaults button

**Settings Saved**: Firestore user_preferences

---

### 710 - Custom Shortcuts Configuration
**Description**: Configure keyboard shortcuts  
**Content**:
- Favorite pages (up to 10)
- F1-F10 key assignments
- Add/remove favorites

---

### 720 - Keyboard Shortcuts Reference
**Description**: Complete keyboard shortcuts guide  
**Content**:
- Digits 0-9: Enter page numbers
- Enter: Navigate to entered page
- Arrow keys: Navigate history
- Colored buttons: Fastext navigation
- F1-F10: Favorite pages
- Escape: Cancel input

---

## Developer Tools (800-899)

### 800 - API Explorer Index
**Description**: Developer tools menu  
**Content**:
- Raw JSON (801)
- API Documentation (802)
- Example Requests (803)
- System Status

**Navigation**:
- RED: Index (100)
- GREEN: Raw JSON (801)
- YELLOW: API Docs (802)

---

### 801 - Raw JSON
**Description**: Current page's JSON representation  
**Content**:
- Full page data structure
- Syntax highlighting using teletext colors
- Formatted to 40-character width
- Metadata included

**Format**:
```
RAW JSON - PAGE 201            801
────────────────────────────────────
{
  "id": "201",
  "title": "Top Headlines",
  "rows": [...],
  "links": [...],
  "meta": {
    "source": "NewsAdapter",
    "lastUpdated": "2024-01-15...",
    "cacheStatus": "fresh"
  }
}
```

---

### 802 - API Documentation
**Description**: API endpoint reference  
**Content**:
- GET /api/page/:id documentation
- POST /api/ai documentation
- Request/response examples
- Error codes

---

### 803 - Example Requests/Responses
**Description**: API usage examples  
**Content**:
- cURL examples
- JavaScript fetch examples
- Response samples
- Error handling examples

---

## Easter Eggs

### 666 - Horror Page
**Description**: Hidden horror-themed page  
**Content**:
- AI-generated spooky content
- Disturbing visuals
- Maximum haunting mode effects
- Unique content on each visit

**Special Effects**:
- Glitch animations
- Screen shake
- Color distortion
- Eerie atmosphere

**AI Generation**: Uses Gemini to create unique horror content

---

## Page Number Conventions

### Format
- All page numbers are exactly 3 digits
- Valid range: 100-899
- Leading zeros not required for entry (e.g., "100" not "0100")

### Magazine System
- First digit indicates magazine (content category)
- Second and third digits indicate page within magazine
- Sub-pages use hyphen notation (e.g., 420-01)

### Special Pages
- 100: Always the main index
- 404: Error page
- 666: Easter egg
- 999: Help page

### Navigation Patterns
- x00: Magazine index (200, 300, 400, etc.)
- x01: Primary content page
- x02-x09: Related content
- x10-x19: Sub-categories or special features
- x20-x99: Extended content

---

## Quick Reference

| Magazine | Range | Content | Update Freq |
|----------|-------|---------|-------------|
| 1xx | 100-199 | System | Static |
| 2xx | 200-299 | News | 5 min |
| 3xx | 300-399 | Sports | 2 min |
| 4xx | 400-419 | Markets | 1 min |
| 4xx | 420-449 | Weather | 30 min |
| 5xx | 500-599 | AI | Dynamic |
| 6xx | 600-699 | Games | Dynamic |
| 7xx | 700-799 | Settings | Static |
| 8xx | 800-899 | Dev Tools | Dynamic |

---

**Last Updated**: January 2024  
**Total Pages**: 100+ active pages  
**Special Pages**: 4 (100, 404, 666, 999)
