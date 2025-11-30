# Final Manual Testing Checklist

This checklist covers all critical functionality that should be manually verified before considering the teletext-complete-overhaul feature complete.

## AI Oracle Pages (500-599)

### Page 500 - AI Oracle Index
- [ ] Navigate to page 500
- [ ] Verify page displays with proper formatting (24 rows × 40 chars)
- [ ] Verify Q&A, Stories, and History options are visible
- [ ] Verify input mode is set to single-choice
- [ ] Verify theme colors are applied correctly

### Page 510 - Q&A Question Input
- [ ] Navigate to page 510 from page 500
- [ ] Verify text input mode is active
- [ ] Type a question (e.g., "What is teletext?")
- [ ] Verify input buffer displays characters in real-time
- [ ] Press backspace and verify character removal
- [ ] Press Enter to submit question
- [ ] Verify loading indicator appears

### Page 511 - AI Response Display
- [ ] Verify AI response displays correctly
- [ ] Verify response is formatted for teletext (40 chars wide)
- [ ] Verify navigation hints are present
- [ ] Verify conversation context ID is maintained
- [ ] Test asking a follow-up question
- [ ] Verify context is preserved across questions

### Page 520 - Conversation History
- [ ] Navigate to page 520
- [ ] Verify recent conversations are listed
- [ ] Verify timestamps are displayed
- [ ] Verify navigation back to main menu works

### Error Handling
- [ ] Submit empty question and verify error message
- [ ] Test with very long question (>500 chars)
- [ ] Simulate AI service failure (if possible)
- [ ] Verify graceful error messages in teletext style

## Games Pages (600-699)

### Page 600 - Games Index
- [ ] Navigate to page 600
- [ ] Verify game options are displayed
- [ ] Verify Quiz, Bamboozle, and Trivia options visible
- [ ] Verify input mode is single-choice

### Page 610 - Quiz Start
- [ ] Navigate to page 610
- [ ] Verify start options are displayed
- [ ] Select option to start quiz
- [ ] Verify quiz session is created

### Page 611 - Quiz Questions
- [ ] Verify AI-generated question displays
- [ ] Verify 4 multiple choice options (A, B, C, D)
- [ ] Verify input mode accepts A-D
- [ ] Select an answer
- [ ] Verify immediate feedback

### Page 613 - Answer Result
- [ ] Verify correct/incorrect feedback displays
- [ ] Verify score is updated correctly
- [ ] Verify option to continue or view results
- [ ] Test multiple questions in sequence

### Page 614 - Final Results
- [ ] Complete a full quiz (3+ questions)
- [ ] Verify final score displays correctly
- [ ] Verify percentage calculation is accurate
- [ ] Verify AI commentary is displayed
- [ ] Verify commentary is appropriate for score
- [ ] Verify option to play again

### Error Handling
- [ ] Test invalid answer selection
- [ ] Test session expiration (wait >1 hour)
- [ ] Verify error messages display correctly

## Settings Pages (700-799)

### Page 700 - Theme Selection
- [ ] Navigate to page 700
- [ ] Verify all 4 theme options are displayed
- [ ] Verify input mode is single-choice (1-4)

### Theme Application
- [ ] Select Ceefax theme (option 1)
  - [ ] Verify blue background with yellow text
  - [ ] Verify scanlines effect is applied
  - [ ] Verify curvature effect is applied
  - [ ] Navigate to different pages and verify theme persists

- [ ] Select ORF theme (option 2)
  - [ ] Verify black background with green text
  - [ ] Verify scanlines effect is applied
  - [ ] Navigate to different pages and verify theme persists

- [ ] Select High Contrast theme (option 3)
  - [ ] Verify black background with white text
  - [ ] Verify no visual effects
  - [ ] Navigate to different pages and verify theme persists

- [ ] Select Haunting theme (option 4)
  - [ ] Verify purple background with orange text
  - [ ] Verify all effects (scanlines, curvature, noise, glitch)
  - [ ] Navigate to different pages and verify theme persists

### Theme Persistence
- [ ] Select a theme
- [ ] Refresh the browser
- [ ] Verify theme is still applied
- [ ] Open in new tab
- [ ] Verify theme is synchronized

## Input Handling

### Numeric Input (Page Navigation)
- [ ] Type 1-3 digits for page number
- [ ] Verify input buffer displays digits
- [ ] Verify auto-submit after 3 digits
- [ ] Test backspace to remove digits
- [ ] Test invalid page numbers (e.g., 050, 1000)
- [ ] Verify error handling for out-of-range pages

### Text Input (AI Questions)
- [ ] Type letters, numbers, spaces
- [ ] Type punctuation (.,!?;:)
- [ ] Verify all characters display in buffer
- [ ] Test backspace functionality
- [ ] Test Enter to submit
- [ ] Verify empty input is rejected

### Single-Choice Input (Menus)
- [ ] Test menu selections (1, 2, 3, etc.)
- [ ] Test quiz answers (A, B, C, D)
- [ ] Verify immediate navigation on selection
- [ ] Test invalid selections
- [ ] Verify error feedback

### Buffer Display
- [ ] Verify buffer shows in monospace font
- [ ] Verify buffer clears on mode change
- [ ] Verify buffer clears on successful navigation
- [ ] Verify buffer persists on error

## Visual Consistency

### Page Rendering
- [ ] Check pages from all ranges (100s-900s)
- [ ] Verify all pages have exactly 24 rows
- [ ] Verify all rows are exactly 40 characters
- [ ] Verify monospace font rendering
- [ ] Verify character alignment

### Theme Colors
- [ ] Navigate through all page ranges with each theme
- [ ] Verify colors apply consistently
- [ ] Verify text is readable in all themes
- [ ] Verify colored text (red, green, yellow, blue) displays correctly

### CRT Effects
- [ ] Verify scanlines effect (when enabled)
- [ ] Verify screen curvature (when enabled)
- [ ] Verify noise effect (when enabled)
- [ ] Verify glitch effect (Haunting theme only)
- [ ] Verify effects can be disabled (High Contrast theme)

### Responsive Behavior
- [ ] Test on different screen sizes
- [ ] Verify teletext display scales appropriately
- [ ] Verify aspect ratio is maintained
- [ ] Verify no horizontal scrolling

## Edge Cases and Errors

### Invalid Page Numbers
- [ ] Test page 099 (below range)
- [ ] Test page 1000 (above range)
- [ ] Test page 000
- [ ] Verify 404 error page displays
- [ ] Verify navigation options on error page

### Network Errors
- [ ] Disable network (if possible)
- [ ] Verify cached content displays
- [ ] Verify offline indicator shows
- [ ] Re-enable network
- [ ] Verify content updates

### Session Expiration
- [ ] Start a quiz
- [ ] Wait for session to expire (or manipulate time)
- [ ] Attempt to continue
- [ ] Verify graceful error handling

### Rapid Navigation
- [ ] Rapidly navigate between pages
- [ ] Verify no race conditions
- [ ] Verify correct page always displays
- [ ] Verify no memory leaks

### Special Characters
- [ ] Test special characters in text input
- [ ] Test Unicode characters
- [ ] Test emoji (if supported)
- [ ] Verify proper handling or rejection

## Performance

### Page Load Times
- [ ] Measure time to load page 100
- [ ] Measure time to load page 500
- [ ] Measure time to load page 600
- [ ] Verify all pages load in <2 seconds

### AI Response Times
- [ ] Submit AI question
- [ ] Measure time to response
- [ ] Verify loading indicator during wait
- [ ] Verify timeout handling (>10 seconds)

### Theme Switching
- [ ] Switch between themes rapidly
- [ ] Verify smooth transitions
- [ ] Verify no visual glitches
- [ ] Verify CSS updates immediately

### Memory Usage
- [ ] Navigate through 50+ pages
- [ ] Check browser memory usage
- [ ] Verify no significant memory growth
- [ ] Verify cache cleanup works

## Cross-Browser Testing

### Chrome/Edge
- [ ] Test all functionality
- [ ] Verify visual consistency
- [ ] Verify performance

### Firefox
- [ ] Test all functionality
- [ ] Verify visual consistency
- [ ] Verify performance

### Safari (if available)
- [ ] Test all functionality
- [ ] Verify visual consistency
- [ ] Verify performance

## Accessibility

### Keyboard Navigation
- [ ] Navigate using only keyboard
- [ ] Verify Tab key navigation
- [ ] Verify Enter key submission
- [ ] Verify Escape key cancellation

### Screen Reader (if available)
- [ ] Test with screen reader
- [ ] Verify page content is readable
- [ ] Verify navigation hints are announced

### Reduced Motion
- [ ] Enable reduced motion preference
- [ ] Verify animations are disabled
- [ ] Verify functionality still works

## Final Verification

### Complete User Flows
- [ ] Complete AI Oracle flow (500 → 510 → 511 → 520)
- [ ] Complete Games flow (600 → 610 → 611 → 613 → 614)
- [ ] Complete Theme selection flow (700 → 701/702/703/704)
- [ ] Navigate through all major page ranges

### Data Persistence
- [ ] Set theme preference
- [ ] Complete a quiz
- [ ] Ask AI questions
- [ ] Refresh browser
- [ ] Verify all data persists correctly

### Error Recovery
- [ ] Trigger various errors
- [ ] Verify recovery options work
- [ ] Verify user can always navigate back
- [ ] Verify no broken states

## Sign-Off

Once all items are checked, the feature is ready for production deployment.

**Tested by:** _______________
**Date:** _______________
**Browser/Version:** _______________
**Notes:** _______________
