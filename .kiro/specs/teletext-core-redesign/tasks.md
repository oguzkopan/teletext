# Implementation Plan

- [x] 1. Create new Layout Engine core
  - Create `lib/layout-engine.ts` with basic text formatting functions
  - Implement `wrapText()` for 40-character wrapping
  - Implement `padText()` for exact 40-character rows
  - Implement `truncateText()` for overflow handling
  - Add validation to ensure all output is exactly 40 chars × 24 rows
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 2. Implement single-column layout rendering
  - Add `renderSingleColumn()` method to layout engine
  - Implement header rendering with page number and title
  - Implement footer rendering with navigation hints
  - Calculate content area (24 - header - footer rows)
  - Ensure content fills available space without cutoff
  - _Requirements: 1.1, 1.5, 2.1, 2.2, 13.1_

- [x] 3. Implement multi-column layout rendering
  - Add `calculateColumnWidths()` for 2 and 3 column layouts
  - Implement `flowTextToColumns()` to distribute text across columns
  - Implement `mergeColumns()` to combine columns horizontally
  - Add column gutter spacing (2 characters between columns)
  - Test with news and sports content
  - _Requirements: 1.2, 1.3, 12.1, 12.2, 12.3_

- [x] 4. Create Navigation Router core
  - Create `lib/navigation-router.ts` with navigation state management
  - Implement `navigateToPage()` with page number validation
  - Implement navigation history (back/forward)
  - Add `isValidPageNumber()` validation (100-899)
  - Implement error handling for invalid pages
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 14.1, 14.2, 14.3_

- [x] 5. Implement input mode detection
  - Add `getPageInputMode()` to detect single/double/triple digit input
  - Check page metadata for explicit input mode
  - Detect single-digit mode from numbered options (1-9)
  - Detect from page type (AI pages 500-599, Games 600-699)
  - Default to 3-digit mode for standard navigation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Create Input Handler
  - Create `lib/input-handler.ts` for keyboard input processing
  - Implement `handleDigitInput()` with mode-aware logic
  - For single-digit mode: navigate immediately on valid option
  - For multi-digit mode: add to buffer and auto-navigate when full
  - Implement `renderInputBuffer()` to show [___] with entered digits
  - Add `clearInputBuffer()` and `removeLastDigit()` methods
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Fix AI page navigation
  - Update AIAdapter to set `inputMode: 'single'` for selection pages
  - Add `inputOptions` array to page metadata (e.g., ['1', '2', '3', '4', '5'])
  - Ensure all AI selection pages (500, 505, 510) have proper metadata
  - Test navigation from AI index to sub-pages
  - Verify no page refresh loops
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 8. Fix game page navigation
  - Update GamesAdapter to set `inputMode: 'single'` for game selection
  - Add `inputOptions` for quiz answer selection (e.g., ['1', '2', '3', '4'])
  - Ensure quiz pages navigate to next question after answer
  - Maintain quiz state across page transitions
  - Test complete quiz flow from start to finish
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Redesign main index page (100)
  - Use new layout engine with 2-column layout
  - Display all major sections with clear page numbers
  - Left-align all page numbers in first column
  - Use colors to distinguish section types
  - Add welcome message or ASCII logo at top
  - Ensure all sections fit on one screen
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 10. Update news pages layout
  - Use single-column layout for readability
  - Number each headline clearly (1-9)
  - Show source and timestamp for each headline
  - Enable navigation to full articles by number
  - Format full articles with proper wrapping
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [x] 11. Update sports pages layout
  - Use tabular layout with aligned columns
  - Right-align numeric values (scores, points)
  - Truncate long team names to fit columns
  - Add column headers for standings
  - Use color coding for live matches
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 12. Update market pages layout
  - Use tabular layout with aligned columns
  - Right-align prices with consistent decimal places
  - Use color coding (green=up, red=down)
  - Display percentage changes alongside absolute changes
  - Add timestamp showing data freshness
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 13. Update AI pages layout
  - Use single-column layout for prompts and responses
  - Display AI prompt clearly at top
  - Show loading indicator during generation
  - Format responses with proper wrapping
  - Display navigation options after response
  - Split long responses across multiple pages
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Update quiz pages layout
  - Display question text prominently
  - Number answer options 1-4 with clear alignment
  - Show feedback (correct/incorrect) after selection
  - Display question counter (e.g., "Question 3/10")
  - Clear previous question before showing next
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Implement navigation hints system
  - Create `generateNavigationHints()` function
  - For selection pages: "Enter number to select"
  - For content pages: "100=INDEX BACK=PREVIOUS"
  - For pages with colored buttons: show colored button hints
  - Update hints based on current page context
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 16. Integrate layout engine with PageRouter
  - Update PageRouter to use new layout engine for all pages
  - Pass page content through layout engine before rendering
  - Apply appropriate column count based on content type
  - Ensure headers and footers are consistent
  - Remove old layout code
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 17. Integrate navigation router with frontend
  - Update KeyboardHandler to use new navigation router
  - Connect digit input to input handler
  - Display input buffer in UI
  - Show expected input length hint
  - Update TeletextScreen to show navigation state
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 18. Update all page adapters
  - Update NewsAdapter to provide content for layout engine
  - Update SportsAdapter to provide tabular data
  - Update MarketsAdapter to provide tabular data
  - Update AIAdapter to set proper input modes
  - Update GamesAdapter to set proper input modes
  - Update WeatherAdapter to use new layout
  - Update StaticAdapter for system pages
  - _Requirements: All requirements_

- [x] 19. Test and fix navigation flows
  - Test navigation from index to all major sections
  - Test AI page selection and navigation (verify no loops)
  - Test game page selection and quiz flow
  - Test back button from all page types
  - Test invalid page number handling
  - Fix any navigation bugs found
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 20. Test and fix layout rendering
  - Test single-column layout with various content lengths
  - Test multi-column layout (2 and 3 columns)
  - Test header formatting on all page types
  - Test footer hints on all page types
  - Verify no text cutoff issues
  - Verify all pages use full 40×24 grid
  - Fix any layout bugs found
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 21. Polish and final testing
  - Test complete user flows (index → news → article → back)
  - Test AI interactions (index → AI → topic → question → response)
  - Test quiz gameplay (index → games → quiz → questions → results)
  - Verify all navigation hints are correct
  - Verify all page numbers are properly aligned
  - Test error recovery (invalid pages, back to index)
  - Ensure app compiles without errors
  - _Requirements: All requirements_
