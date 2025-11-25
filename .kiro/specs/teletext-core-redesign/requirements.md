# Requirements Document

## Introduction

This specification defines a complete redesign of the Modern Teletext application's core layout and navigation systems. The current implementation has critical issues: text is cut off mid-screen, layouts are poorly structured, and navigation is broken on AI and game pages. This redesign will rebuild the layout engine and navigation logic from scratch, using professional teletext services like BBC Ceefax as the reference design. The goal is to create a professional, multi-column layout system with pixel-perfect text rendering and bulletproof navigation that works consistently across all page types.

## Glossary

- **Teletext System**: The Modern Teletext web application
- **Layout Engine**: Core system responsible for rendering text in proper columns and rows
- **Navigation Router**: System that handles page transitions and input routing
- **Page Adapter**: Backend component that generates page content for specific sections (News, Sports, AI, Games, etc.)
- **Input Handler**: Component that processes keyboard input and routes to appropriate pages
- **Multi-Column Layout**: Text arranged in multiple vertical columns like professional teletext
- **Page Index**: Numeric identifier for pages (100-899)
- **Selection Page**: Page that displays options for user to choose from
- **Content Page**: Page that displays actual content (news, scores, AI responses, etc.)
- **3-Digit Navigation**: Pages that require exactly 3 digits to navigate (e.g., 100, 200, 301)
- **1-Digit Navigation**: Pages that accept single digit selections (e.g., 1-9 for menu options)

## Requirements

### Requirement 1

**User Story:** As a user, I want text to display in properly formatted columns that use the full screen width, so that content is readable and professional-looking like BBC Ceefax.

#### Acceptance Criteria

1. WHEN displaying any page THEN the Teletext System SHALL render text in columns that span the full 40-character width
2. WHEN text exceeds a single column THEN the Teletext System SHALL flow content into multiple columns automatically
3. WHEN displaying multi-column content THEN the Teletext System SHALL maintain consistent column widths and spacing
4. THE Teletext System SHALL prevent text from being cut off in the middle of the screen
5. WHEN rendering text THEN the Teletext System SHALL use the full 24-row height without leaving large empty spaces

### Requirement 2

**User Story:** As a user, I want page headers to display consistently with page numbers, titles, and timestamps, so that I always know what page I'm viewing.

#### Acceptance Criteria

1. WHEN viewing any page THEN the Teletext System SHALL display the page number in the top-left corner
2. WHEN viewing any page THEN the Teletext System SHALL display the page title centered in the header
3. WHEN viewing time-sensitive content THEN the Teletext System SHALL display a timestamp in the top-right corner
4. THE Teletext System SHALL format headers consistently across all page types
5. WHEN displaying headers THEN the Teletext System SHALL use appropriate colors for different content types

### Requirement 3

**User Story:** As a user, I want navigation options to be clearly displayed with their corresponding page numbers, so that I know exactly what to type to access each option.

#### Acceptance Criteria

1. WHEN displaying navigation options THEN the Teletext System SHALL show each option with its page number left-aligned
2. WHEN options require 3-digit navigation THEN the Teletext System SHALL display all three digits (e.g., "100 Main Index")
3. WHEN options require 1-digit navigation THEN the Teletext System SHALL display single digits (e.g., "1. Play Quiz")
4. THE Teletext System SHALL align all page numbers in the same column regardless of digit count
5. WHEN displaying options THEN the Teletext System SHALL use clear visual separators between options

### Requirement 4

**User Story:** As a user, I want to navigate to AI pages by entering numbers, so that I can access AI features without getting stuck on selection pages.

#### Acceptance Criteria

1. WHEN on an AI selection page THEN the Teletext System SHALL accept numeric input for option selection
2. WHEN a valid option number is entered THEN the Teletext System SHALL navigate to the corresponding AI page
3. WHEN an invalid option number is entered THEN the Teletext System SHALL display an error message and remain on the current page
4. THE Teletext System SHALL clear the input buffer after successful navigation
5. WHEN navigating to AI pages THEN the Teletext System SHALL not refresh the same page repeatedly

### Requirement 5

**User Story:** As a user, I want to navigate to game pages by entering numbers, so that I can play games without navigation breaking.

#### Acceptance Criteria

1. WHEN on a game selection page THEN the Teletext System SHALL accept numeric input for game selection
2. WHEN a valid game number is entered THEN the Teletext System SHALL navigate to the corresponding game page
3. WHEN playing a quiz THEN the Teletext System SHALL accept numeric input for answer selection
4. WHEN in a quiz THEN the Teletext System SHALL navigate to the next question after answer submission
5. THE Teletext System SHALL maintain quiz state across page transitions

### Requirement 6

**User Story:** As a user, I want the navigation system to distinguish between 1-digit and 3-digit page numbers, so that navigation works correctly for all page types.

#### Acceptance Criteria

1. WHEN on a page requiring 3-digit input THEN the Teletext System SHALL wait for 3 digits before navigating
2. WHEN on a page requiring 1-digit input THEN the Teletext System SHALL navigate immediately after 1 digit is entered
3. WHEN on a selection page THEN the Teletext System SHALL determine input length based on the number of options
4. THE Teletext System SHALL display the expected input format to the user
5. WHEN input buffer contains digits THEN the Teletext System SHALL show the digits being entered

### Requirement 7

**User Story:** As a user, I want to see my input as I type page numbers, so that I know what I've entered before navigating.

#### Acceptance Criteria

1. WHEN a digit key is pressed THEN the Teletext System SHALL display the digit in an input buffer
2. WHEN multiple digits are entered THEN the Teletext System SHALL display all digits in sequence
3. WHEN the input buffer is full THEN the Teletext System SHALL automatically navigate to the entered page
4. WHEN the backspace key is pressed THEN the Teletext System SHALL remove the last digit from the buffer
5. THE Teletext System SHALL clear the input buffer after successful navigation

### Requirement 8

**User Story:** As a user, I want navigation to work consistently across all page types, so that I never get stuck or confused.

#### Acceptance Criteria

1. WHEN on any page THEN the Teletext System SHALL accept numeric input for page navigation
2. WHEN entering a valid page number THEN the Teletext System SHALL navigate to that page
3. WHEN entering an invalid page number THEN the Teletext System SHALL display an error and remain on the current page
4. THE Teletext System SHALL support the back button to return to the previous page
5. WHEN navigation fails THEN the Teletext System SHALL log the error and display a helpful message

### Requirement 9

**User Story:** As a user, I want selection pages to display options in a clear, organized layout, so that I can easily choose what I want.

#### Acceptance Criteria

1. WHEN displaying a selection page THEN the Teletext System SHALL list all options with numbers
2. WHEN options fit on one screen THEN the Teletext System SHALL display them in a single column or multiple columns
3. WHEN options exceed one screen THEN the Teletext System SHALL indicate more options are available
4. THE Teletext System SHALL group related options together visually
5. WHEN displaying options THEN the Teletext System SHALL use consistent formatting and spacing

### Requirement 10

**User Story:** As a user, I want AI interaction pages to display prompts and responses clearly, so that I can have meaningful conversations.

#### Acceptance Criteria

1. WHEN on an AI page THEN the Teletext System SHALL display the AI prompt or question clearly
2. WHEN AI is generating a response THEN the Teletext System SHALL display a loading indicator
3. WHEN AI response is ready THEN the Teletext System SHALL display the full response with proper formatting
4. THE Teletext System SHALL display navigation options after the AI response
5. WHEN AI response is too long THEN the Teletext System SHALL split it across multiple pages

### Requirement 11

**User Story:** As a user, I want quiz pages to display questions and answer options clearly, so that I can play quizzes without confusion.

#### Acceptance Criteria

1. WHEN displaying a quiz question THEN the Teletext System SHALL show the question text prominently
2. WHEN displaying answer options THEN the Teletext System SHALL number them 1-4 and align them consistently
3. WHEN an answer is selected THEN the Teletext System SHALL display feedback (correct/incorrect)
4. WHEN moving to the next question THEN the Teletext System SHALL clear the previous question and display the new one
5. THE Teletext System SHALL display the current question number and total questions

### Requirement 12

**User Story:** As a user, I want the layout system to handle different content types appropriately, so that news, sports, markets, and other content display optimally.

#### Acceptance Criteria

1. WHEN displaying news articles THEN the Teletext System SHALL use a single-column layout for readability
2. WHEN displaying sports scores THEN the Teletext System SHALL use a tabular layout with aligned columns
3. WHEN displaying market data THEN the Teletext System SHALL use a tabular layout with right-aligned numbers
4. WHEN displaying lists THEN the Teletext System SHALL use consistent indentation and spacing
5. THE Teletext System SHALL adapt layout based on content type automatically

### Requirement 13

**User Story:** As a user, I want page footers to display navigation hints, so that I always know how to navigate.

#### Acceptance Criteria

1. WHEN viewing any page THEN the Teletext System SHALL display navigation hints in the footer
2. WHEN on a selection page THEN the Teletext System SHALL display "Enter number to select"
3. WHEN on a content page THEN the Teletext System SHALL display "100=INDEX BACK=PREVIOUS"
4. WHEN colored buttons are available THEN the Teletext System SHALL display colored button hints
5. THE Teletext System SHALL update footer hints based on the current page context

### Requirement 14

**User Story:** As a user, I want the system to handle navigation errors gracefully, so that I don't get stuck on broken pages.

#### Acceptance Criteria

1. WHEN a page fails to load THEN the Teletext System SHALL display an error page with navigation options
2. WHEN an invalid page number is entered THEN the Teletext System SHALL display "Page not found" and suggest alternatives
3. WHEN navigation logic fails THEN the Teletext System SHALL log the error and provide a way to return to the index
4. THE Teletext System SHALL never leave the user on a blank or broken page
5. WHEN errors occur THEN the Teletext System SHALL provide clear instructions for recovery

### Requirement 15

**User Story:** As a developer, I want the layout engine to be modular and testable, so that I can easily fix bugs and add features.

#### Acceptance Criteria

1. THE Teletext System SHALL separate layout logic from content generation
2. THE Teletext System SHALL provide a clear API for rendering text in columns
3. THE Teletext System SHALL include unit tests for layout calculations
4. THE Teletext System SHALL include integration tests for navigation flows
5. THE Teletext System SHALL log layout and navigation decisions for debugging

### Requirement 16

**User Story:** As a developer, I want the navigation router to be centralized and consistent, so that all pages use the same navigation logic.

#### Acceptance Criteria

1. THE Teletext System SHALL implement a single navigation router for all pages
2. THE Teletext System SHALL define clear navigation rules for each page type
3. THE Teletext System SHALL validate all navigation inputs before processing
4. THE Teletext System SHALL maintain navigation history for back button functionality
5. THE Teletext System SHALL provide hooks for page-specific navigation logic

### Requirement 17

**User Story:** As a user, I want the main index page (100) to display all available sections clearly, so that I can navigate to any part of the system.

#### Acceptance Criteria

1. WHEN viewing page 100 THEN the Teletext System SHALL display all major sections with page numbers
2. WHEN displaying sections THEN the Teletext System SHALL use a multi-column layout for space efficiency
3. THE Teletext System SHALL display sections in a logical order (News, Sports, Markets, Weather, AI, Games, etc.)
4. WHEN displaying the index THEN the Teletext System SHALL use colors to distinguish different section types
5. THE Teletext System SHALL display a welcome message or logo at the top of the index

### Requirement 18

**User Story:** As a user, I want news pages to display headlines in a readable format, so that I can quickly scan the news.

#### Acceptance Criteria

1. WHEN displaying news headlines THEN the Teletext System SHALL number each headline
2. WHEN displaying headlines THEN the Teletext System SHALL show the source and timestamp
3. THE Teletext System SHALL allow navigation to full articles by entering the headline number
4. WHEN displaying full articles THEN the Teletext System SHALL format text for readability
5. THE Teletext System SHALL indicate when articles continue on multiple pages

### Requirement 19

**User Story:** As a user, I want sports pages to display scores and standings in clear tables, so that I can quickly find the information I need.

#### Acceptance Criteria

1. WHEN displaying sports scores THEN the Teletext System SHALL use a tabular layout with aligned columns
2. WHEN displaying team names THEN the Teletext System SHALL truncate long names to fit the column width
3. WHEN displaying scores THEN the Teletext System SHALL right-align numeric values
4. THE Teletext System SHALL use color coding to highlight live matches or important information
5. WHEN displaying standings THEN the Teletext System SHALL include column headers

### Requirement 20

**User Story:** As a user, I want market pages to display stock prices and changes clearly, so that I can track market movements.

#### Acceptance Criteria

1. WHEN displaying market data THEN the Teletext System SHALL use a tabular layout with aligned columns
2. WHEN displaying prices THEN the Teletext System SHALL right-align numeric values with consistent decimal places
3. WHEN displaying price changes THEN the Teletext System SHALL use color coding (green=up, red=down)
4. THE Teletext System SHALL display percentage changes alongside absolute changes
5. WHEN displaying market data THEN the Teletext System SHALL include a timestamp showing data freshness
