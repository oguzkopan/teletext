# Implementation Plan

- [x] 1. Set up Firebase project and Next.js application structure
  - Initialize Firebase project with App Hosting, Firestore, Storage, and Cloud Functions
  - Create Next.js 14 application with TypeScript
  - Configure Firebase SDK for client and server
  - Set up environment variables for Firebase configuration
  - Create basic folder structure: components/, lib/, functions/, types/
  - _Requirements: All requirements depend on this foundation_

- [x] 2. Implement core teletext data models and utilities
  - Define TypeScript interfaces for TeletextPage, PageLink, PageMeta, ThemeConfig
  - Create Firestore data model interfaces (PageCacheDocument, ConversationDocument, UserPreferencesDocument)
  - Implement text wrapping function that respects 40-character width with word boundary detection
  - Implement text truncation and padding utilities for teletext format
  - Create page validation function to ensure 24 rows × 40 characters
  - _Requirements: 2.1, 2.2, 14.1, 14.2, 14.5_

- [ ]* 2.1 Write property test for text wrapping
  - **Property 5: Text wrapping correctness**
  - **Validates: Requirements 14.1**

- [ ]* 2.2 Write property test for page dimension invariant
  - **Property 1: Page dimension invariant**
  - **Validates: Requirements 2.1, 2.2, 11.5**

- [x] 3. Build frontend teletext rendering components
  - Create TeletextScreen component that renders 40×24 character grid
  - Implement color code parsing for seven teletext colors plus black
  - Create CRTFrame component with scanline, curvature, and noise effects
  - Implement RemoteInterface component with numeric keypad and colored buttons
  - Add keyboard event listeners for digits, Enter, arrows, and colored buttons
  - Create loading animation with green text for page transitions
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 12.1, 12.2_

- [ ]* 3.1 Write property test for color code support
  - **Property 6: Color code support**
  - **Validates: Requirements 2.4**

- [x] 4. Implement page routing and navigation system
  - Create PageRouter component to manage navigation state
  - Implement navigation history stack with back/forward functionality
  - Add page number input buffer (3 digits) with display
  - Implement channel up/down for sequential page navigation
  - Create Fastext colored button navigation system
  - Add page number validation (100-899 range)
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 3.4, 12.3, 12.5_

- [ ]* 4.1 Write property test for navigation history consistency
  - **Property 4: Navigation history consistency**
  - **Validates: Requirements 1.4**

- [ ]* 4.2 Write property test for invalid input handling
  - **Property 3: Invalid input handling**
  - **Validates: Requirements 1.2, 13.1**

- [ ]* 4.3 Write property test for input method equivalence
  - **Property 24: Input method equivalence**
  - **Validates: Requirements 12.4**

- [x] 5. Set up Firebase Cloud Functions infrastructure
  - Create Cloud Functions project structure in functions/ directory
  - Implement GET /api/page/:id endpoint with Firestore caching
  - Implement POST /api/ai endpoint for AI interactions
  - Create router function to map page ranges to adapters
  - Implement Firestore cache functions (getCachedPage, setCachedPage)
  - Add error handling and logging for all endpoints
  - _Requirements: 11.1, 11.4, 15.1, 15.2_

- [ ]* 5.1 Write property test for magazine routing correctness
  - **Property 7: Magazine routing correctness**
  - **Validates: Requirements 3.2, 11.1**

- [ ]* 5.2 Write property test for cache behavior
  - **Property 22: Cache behavior**
  - **Validates: Requirements 11.4**

- [x] 6. Create static pages adapter and initial pages
  - Implement StaticAdapter for pages 100-199
  - Create page 100 (main index) with magazine listings and Fastext links
  - Create page 101 (how it works) explaining teletext concept
  - Create page 120 (emergency bulletins) with breaking alerts
  - Create page 199 (about/credits) with project information
  - Create page 999 (help) with navigation instructions
  - Store static pages in Firebase Storage as JSON files
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 17.1, 18.1, 18.2, 18.3_

- [x] 7. Implement boot sequence and initial loading experience
  - Create CRT warm-up animation with static noise
  - Implement transition from boot sequence to page 100
  - Add skip functionality for boot sequence (any key press)
  - Ensure boot sequence completes within 3 seconds
  - Display welcome message on page 100 after boot
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 8. Build news adapter with external API integration
  - Implement NewsAdapter for pages 200-299
  - Integrate with NewsAPI or similar service
  - Create page 200 (news index) with category links
  - Create page 201 (top headlines) with latest news
  - Create pages 202-203 (world/local news)
  - Create pages 210-219 (topic-specific news: tech, business, entertainment, science)
  - Implement headline truncation to 38 characters
  - Add pagination for content exceeding 24 rows
  - Cache news pages in Firestore with 5-minute TTL
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 30.1, 30.2, 30.3, 30.4, 30.5_

- [ ]* 8.1 Write property test for content pagination
  - **Property 9: Content pagination**
  - **Validates: Requirements 4.3, 7.4, 10.4**

- [ ]* 8.2 Write property test for API failure graceful degradation
  - **Property 10: API failure graceful degradation**
  - **Validates: Requirements 4.5, 11.3**

- [x] 9. Build sports adapter with live scores and tables
  - Implement SportsAdapter for pages 300-399
  - Integrate with sports API (API-Football or ESPN)
  - Create page 300 (sports index)
  - Create page 301 (live scores) with real-time updates
  - Create page 302 (league tables) with team rankings
  - Create page 310 (team watchlist configuration)
  - Create pages 311-315 (dedicated team pages for watchlist)
  - Format scores with team name truncation for 40-character rows
  - Cache sports pages with 2-minute TTL (1 minute during live events)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ]* 9.1 Write property test for data formatting constraints
  - **Property 11: Data formatting constraints**
  - **Validates: Requirements 5.4, 6.4**

- [ ]* 9.2 Write property test for tabular data alignment
  - **Property 26: Tabular data alignment**
  - **Validates: Requirements 14.3**

- [x] 10. Build markets adapter for crypto and stocks
  - Implement MarketsAdapter for pages 400-499
  - Integrate with CoinGecko API for cryptocurrency data
  - Integrate with Alpha Vantage or similar for stock data
  - Create page 400 (markets summary)
  - Create page 401 (cryptocurrency prices with % changes)
  - Create page 402 (stock market data)
  - Create page 410 (foreign exchange rates for 10 major pairs)
  - Format market data with aligned columns for prices and percentages
  - Cache market pages with 1-minute TTL
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 29.1, 29.2, 29.3, 29.4, 29.5_

- [x] 11. Implement AI adapter with Vertex AI integration
  - Implement AIAdapter for pages 500-599
  - Set up Vertex AI client with Gemini Pro model
  - Create page 500 (AI Oracle index) with service options
  - Implement menu-driven AI interaction flow (no free text input)
  - Create conversation state management in Firestore
  - Implement conversation context retrieval and storage
  - Add automatic conversation expiration after 24 hours
  - _Requirements: 7.1, 7.2, 7.5, 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ]* 11.1 Write property test for AI menu numeric-only constraint
  - **Property 12: AI menu numeric-only constraint**
  - **Validates: Requirements 7.2**

- [ ]* 11.2 Write property test for conversation context preservation
  - **Property 14: Conversation context preservation**
  - **Validates: Requirements 7.5**

- [x] 12. Build AI Q&A flow with topic selection
  - Create page 510 (topic selection: news, tech, career, health, free)
  - Implement multi-step parameter collection using numeric menus
  - Create country/region selection pages with numeric options
  - Build structured prompt from menu selections
  - Call Gemini API with conversation context
  - Format AI responses as teletext pages (40×24 constraint)
  - Split long responses across multiple pages with navigation links
  - _Requirements: 7.2, 7.3, 7.4_

- [ ]* 12.1 Write property test for AI response formatting
  - **Property 13: AI response formatting**
  - **Validates: Requirements 7.3**

- [x] 13. Implement spooky story generator for Kiroween
  - Create page 505 (spooky story generator menu)
  - Implement horror story theme selection (haunted house, ghost, monster, etc.)
  - Generate horror stories using Gemini with spooky prompts
  - Apply haunting mode visual effects during story display
  - Format stories across multiple pages with atmospheric presentation
  - Save generated stories to conversation history
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 14. Build conversation history and recall system
  - Create page 520 (conversation index) listing recent AI interactions
  - Display conversation timestamps and topics
  - Implement conversation thread display with full history
  - Store last 10 conversations in Firestore
  - Add delete functionality for individual conversations
  - Create pages 521-529 for displaying conversation details
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [x] 15. Implement games adapter with quiz functionality
  - Implement GamesAdapter for pages 600-699
  - Create page 600 (games index)
  - Build quiz of the day (page 601) with trivia API integration
  - Implement multiple-choice quiz with numeric answers (1-4)
  - Create result pages showing correct/incorrect answers
  - Display score summary with AI-generated witty commentary
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 15.1 Write property test for quiz answer validation
  - **Property 15: Quiz answer validation**
  - **Validates: Requirements 8.3**

- [ ]* 15.2 Write property test for quiz score calculation
  - **Property 16: Quiz score calculation**
  - **Validates: Requirements 8.4**

- [x] 16. Build Bamboozle-style branching quiz game
  - Create page 610 (Bamboozle game introduction)
  - Implement branching logic where answers lead to different pages
  - Create at least 3 different story paths through the quiz
  - Build ending pages for each path with scores and commentary
  - Add restart functionality returning to page 610
  - Store quiz state in session for path tracking
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ]* 16.1 Write property test for branching navigation consistency
  - **Property 17: Branching navigation consistency**
  - **Validates: Requirements 8.5**

- [x] 17. Implement random facts feature
  - Create page 620 (random fact display)
  - Integrate with facts API or create curated database
  - Implement fact refresh on page reload
  - Format facts to fit 40×24 constraint
  - Categorize facts by topic (science, history, technology)
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [x] 18. Build weather adapter with city forecasts
  - Implement WeatherAdapter for pages 420-449
  - Integrate with weather API (OpenWeatherMap or similar)
  - Create page 420 (weather index) with city selection
  - Create city-specific pages (e.g., 420-34 for Istanbul)
  - Support at least 20 major cities with dedicated pages
  - Format weather data with temperature, conditions, and forecast
  - Cache weather pages with 30-minute TTL
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 19. Implement theme system with classic palettes
  - Create SettingsAdapter for pages 700-799
  - Create page 700 (theme selection) with available palettes
  - Implement Ceefax theme (yellow on blue, BBC colors)
  - Implement ORF theme (Austrian teletext colors)
  - Implement High Contrast theme (white on black)
  - Implement Haunting Mode theme (green on black with glitch effects)
  - Store theme selection in Firestore user preferences
  - Provide theme preview before selection
  - _Requirements: 9.1, 9.2, 9.3, 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ]* 19.1 Write property test for theme application consistency
  - **Property 18: Theme application consistency**
  - **Validates: Requirements 9.2**

- [x] 20. Build CRT effects control panel
  - Create page 701 (CRT effects controls)
  - Implement sliders for scanline intensity (0-100%)
  - Implement slider for screen curvature (0-10px)
  - Implement slider for noise level (0-100%)
  - Apply effect changes in real-time as user adjusts
  - Save effect preferences to Firestore
  - Add "reset to defaults" button
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [x] 21. Implement keyboard shortcuts and help system
  - Create page 710 (custom shortcut configuration)
  - Create page 720 (keyboard shortcuts reference)
  - Document all keyboard shortcuts (digits, Enter, arrows, colors)
  - Implement favorite pages system (up to 10 pages)
  - Add single-key access to favorite pages (F1-F10)
  - Store shortcuts in Firestore user preferences
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [x] 22. Build developer tools and API explorer
  - Implement DevAdapter for pages 800-899
  - Create page 800 (API explorer index)
  - Create page 801 (raw JSON of current page)
  - Create page 802 (API endpoint documentation)
  - Create page 803 (example API requests and responses)
  - Implement JSON formatting with syntax highlighting using teletext colors
  - Format JSON to fit 40-character width
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ]* 22.1 Write property test for JSON formatting constraint
  - **Property 19: JSON formatting constraint**
  - **Validates: Requirements 10.3**

- [ ]* 22.2 Write property test for metadata completeness
  - **Property 20: Metadata completeness**
  - **Validates: Requirements 10.5**

- [x] 23. Implement special Easter egg pages (404 and 666)
  - Create page 404 with animated glitch effects and horror ASCII art
  - Create page 666 with AI-generated horror content and disturbing visuals
  - Implement glitch animation effects (screen shake, color distortion)
  - Add spooky sound effects (optional, with user control)
  - Use Gemini to generate unique horror content for page 666
  - Apply maximum haunting mode effects on these pages
  - _Requirements: 13.1, 13.5_

- [x] 24. Implement HTML sanitization and content parsing
  - Create HTML tag stripping function for news content
  - Implement special character sanitization
  - Add whitespace preservation for layout formatting
  - Handle empty content gracefully with appropriate messages
  - Test with various HTML inputs and edge cases
  - _Requirements: 13.2, 13.3, 14.4, 14.5_

- [ ]* 24.1 Write property test for HTML sanitization
  - **Property 27: HTML sanitization**
  - **Validates: Requirements 14.4**

- [ ]* 24.2 Write property test for whitespace preservation
  - **Property 28: Whitespace preservation**
  - **Validates: Requirements 14.5**

- [x] 25. Implement offline support and cache fallback
  - Add service worker for offline page caching
  - Implement network connectivity detection
  - Display "Cached" indicator when serving offline content
  - Cache previously viewed pages in browser storage
  - Implement graceful degradation when APIs are unavailable
  - _Requirements: 13.4, 15.3_

- [ ]* 25.1 Write property test for offline cache fallback
  - **Property 25: Offline cache fallback**
  - **Validates: Requirements 13.4**

- [x] 26. Implement performance optimizations
  - Add page preloading for index (100) and frequently accessed pages
  - Implement request cancellation for rapid navigation
  - Add debouncing for keyboard input (100ms)
  - Implement memoization for page rendering
  - Add code splitting by magazine (lazy load adapters)
  - Optimize bundle size to < 200KB initial load
  - _Requirements: 15.4, 15.5_

- [ ]* 26.1 Write property test for preload behavior
  - **Property 29: Preload behavior**
  - **Validates: Requirements 15.4**

- [ ]* 26.2 Write property test for request cancellation
  - **Property 30: Request cancellation**
  - **Validates: Requirements 15.5**

- [x] 27. Set up Firestore security rules and indexes
  - Write security rules for pages_cache collection (public read, function write)
  - Write security rules for conversations collection (user-specific access)
  - Write security rules for user_preferences collection (user-specific access)
  - Create composite indexes for conversation queries
  - Set up TTL policy for automatic conversation expiration
  - Test security rules with Firebase emulator
  - _Requirements: All requirements involving Firestore_

- [x] 28. Deploy to Firebase and configure production environment
  - Configure Firebase App Hosting for Next.js deployment
  - Set up production environment variables
  - Configure Cloud Functions for production region
  - Set up Firebase CDN and caching rules
  - Configure custom domain (if applicable)
  - Set up Firebase Performance Monitoring
  - Deploy and test in production environment
  - _Requirements: All requirements_

- [x] 29. Create comprehensive documentation
  - Write README with project overview and setup instructions
  - Document all page numbers and their purposes
  - Create API documentation for Cloud Functions
  - Document Firestore data models and collections
  - Write contribution guidelines
  - Create demo video (3 minutes) showing key features
  - Document Kiro usage (specs, hooks, steering, MCP)
  - _Requirements: 18.5_

- [x] 30. Final testing and polish
  - Test all page navigation flows
  - Verify all adapters work with real APIs
  - Test theme switching and effect controls
  - Verify AI conversations work end-to-end
  - Test offline functionality
  - Verify all Easter eggs (404, 666)
  - Test on multiple browsers and devices
  - Fix any remaining bugs or visual issues
  - _Requirements: All requirements_

- [x] 31. Fix critical navigation and API issues
  - Fix Firebase emulator connection errors causing 500 responses
  - Improve main index page (100) to show actual page numbers instead of "1xx", "2xx" notation
  - Fix back navigation from any page to return to page 100
  - Add better error handling and user feedback for missing pages
  - Ensure NEWS_API_KEY environment variable is properly configured
  - _Requirements: 1.1, 1.2, 1.4, 3.1, 3.2, 4.1_

- [x] 31.1 Fix Firebase emulator connection and error handling
  - Add better error messages when Firebase emulators are not running
  - Create fallback static pages for development when emulators are offline
  - Add startup check script to verify emulators are running
  - Update documentation with clear emulator setup instructions
  - _Requirements: 1.1, 4.5, 11.3_

- [x] 31.2 Improve main index page navigation clarity
  - Replace "1xx", "2xx" notation with specific page numbers (e.g., "101", "200", "300")
  - Add sub-menu pages for each magazine showing available pages
  - Create page 110 (System Pages index) with list of 1xx pages
  - Create page 200 (News index) with list of 2xx pages
  - Update colored button links to point to magazine index pages
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 31.3 Fix back button navigation to always return to index
  - Modify navigation history to treat page 100 as home
  - Add special handling for "back to 100" navigation
  - Ensure pressing 100 always navigates to main index
  - Test navigation flow: 100 → 200 → 201 → back → back → 100
  - _Requirements: 1.4, 3.1_

- [x] 31.4 Add development mode fallback pages
  - Create static fallback pages for common pages (100, 200, 300, 400, 500, 600, 700, 800)
  - Display helpful error messages when APIs are unavailable
  - Add "emulator not running" detection and user-friendly message
  - Create offline-first development experience
  - _Requirements: 4.5, 13.2, 13.4_

- [x] 31.5 Fix environment variable configuration
  - Verify NEWS_API_KEY is loaded from .env.local
  - Add environment variable validation on startup
  - Create .env.example with all required variables
  - Add helpful error messages for missing API keys
  - Document API key setup in README
  - _Requirements: 4.1, 4.5_

- [x] 32. Enhance Halloween theme and full-screen layout for Kiroween
  - Enhance Haunting Mode with Halloween-specific color palette (orange, purple, green)
  - Add animated glitch effects and chromatic aberration to Haunting Mode
  - Implement Halloween decorative elements (ASCII pumpkins, bats, ghosts, skulls)
  - Add screen flicker and shake effects for spooky atmosphere
  - Implement full-width text layout system with centering and justification
  - Update page 100 to use full 40-character width with centered titles
  - Add CSS particle effects for floating ghosts/bats in Haunting Mode
  - _Requirements: 34.2, 34.3, 36.1, 36.2, 36.3, 36.4, 36.5_

- [ ]* 32.1 Write property test for full-width content display
  - **Property 31: Full-width content display**
  - **Validates: Requirements 34.2, 34.3**

- [x] 33. Implement interactive theme selection on page 700
  - Modify page 700 to display numbered theme options (1-4)
  - Add keyboard event listener for number keys (1-4) on page 700
  - Implement immediate theme application without page reload
  - Add visual confirmation message when theme is applied
  - Save theme selection to Firestore user_preferences
  - Load saved theme preference on application startup
  - Test theme switching between all four themes
  - _Requirements: 37.1, 37.2, 37.3, 37.4, 37.5_

- [ ]* 33.1 Write property test for theme persistence
  - **Property 33: Theme persistence**
  - **Validates: Requirements 37.4, 37.5**

- [x] 34. Implement multi-page navigation with arrow keys
  - Add PageContinuation metadata to TeletextPage model
  - Implement arrow key handlers for up/down navigation
  - Add "MORE" indicator at bottom of pages with continuation
  - Add "BACK" indicator at top of continuation pages
  - Display page counter (e.g., "Page 2/3") in page headers
  - Update all adapters to generate continuation page metadata
  - Test arrow navigation on news, sports, and AI response pages
  - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5_

- [ ]* 34.1 Write property test for multi-page navigation consistency
  - **Property 32: Multi-page navigation consistency**
  - **Validates: Requirements 35.2, 35.3**

- [x] 35. Enhance environment variable validation and error messages
  - Create comprehensive environment variable validation function
  - Add startup check for all required API keys
  - Implement specific error pages for each missing API key
  - Display environment variable name and setup instructions in errors
  - Add links to API provider websites in error messages
  - Log detailed environment validation errors to console
  - Update NEWS_API_KEY error page with clear instructions
  - Test with missing API keys to verify error messages
  - _Requirements: 38.1, 38.2, 38.3, 38.4, 38.5_

- [ ]* 35.1 Write property test for environment variable validation
  - **Property 34: Environment variable validation**
  - **Validates: Requirements 38.1, 38.2**

- [x] 36. Ensure all content sections have meaningful content
  - Verify page 400 (Markets) displays cryptocurrency and stock data
  - Verify page 500 (AI Oracle) has working Vertex AI integration
  - Add sample/placeholder data for sections when APIs are unavailable
  - Create at least 3 sub-pages for each magazine section
  - Test all magazine index pages (100, 200, 300, 400, 500, 600, 700, 800)
  - Add fallback content for development mode when APIs are offline
  - Document all available pages in PAGE_DIRECTORY.md
  - _Requirements: 39.1, 39.2, 39.3, 39.4, 39.5_

- [x] 37. Update main index page with specific page numbers
  - Redesign page 100 to show specific page numbers instead of "1xx", "2xx"
  - Add clear examples like "101 System Info", "200 News Headlines"
  - Use full 40-character width for index content
  - Center section titles and align page numbers
  - Add helpful navigation instructions with specific page examples
  - Update colored button links to point to detailed magazine indexes
  - Test navigation from index to all major sections
  - _Requirements: 34.1, 34.4, 34.5_

- [x] 38. Final Kiroween polish and testing
  - Test all Halloween theme effects and animations
  - Verify theme selection works on page 700
  - Test arrow key navigation on multi-page content
  - Verify all API error messages are clear and helpful
  - Test full-screen layout on different screen sizes
  - Verify NEWS_API_KEY configuration and error handling
  - Test all content sections have working pages
  - Record 3-minute demo video showcasing Kiroween features
  - _Requirements: All new requirements 34-39_

- [ ] 39. Document Kiro usage for Kiroween submission
  - Document how specs were used to develop the application
  - Explain the iterative requirements → design → tasks workflow
  - Document any agent hooks used during development
  - Document any steering files used to guide Kiro
  - Explain how Kiro helped with Halloween theme implementation
  - Create KIRO_USAGE_GUIDE.md with detailed examples
  - Prepare submission materials highlighting Kiro features
  - _Requirements: Kiroween hackathon submission requirements_
