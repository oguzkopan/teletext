# Requirements Document

## Introduction

Modern Teletext (working title: "DeadText") resurrects the classic teletext broadcast technology as a modern web application. This system combines the nostalgic 40×24 character grid interface and three-digit page navigation of 1970s-era teletext services (like BBC Ceefax and ORACLE) with contemporary capabilities including live API integrations, AI-powered assistance, and interactive features. The application serves as a low-bandwidth, distraction-free information hub that demonstrates how "dead" technology can be reimagined for modern use cases including accessibility, emergency information systems, and focused content consumption.

## Glossary

- **Teletext System**: The web application that emulates classic teletext broadcast services, built with Next.js and Firebase
- **Teletext Page**: A single screen of information displayed in a 40-column by 24-row character grid
- **Magazine**: A collection of related pages grouped by their first digit (e.g., 2xx for news, 3xx for sports)
- **Page Router**: The component responsible for mapping three-digit page numbers to content sources
- **Remote Interface**: The on-screen numeric keypad and control buttons for navigation
- **CRT Frame**: The visual container that emulates a cathode ray tube television display
- **Fastext**: The colored button navigation system (RED, GREEN, YELLOW, BLUE) for quick page jumps
- **Content Adapter**: A Firebase Cloud Function that transforms external API data into teletext page format
- **AI Oracle**: The conversational AI assistant powered by Google Gemini via Vertex AI, accessible through menu-driven keypad navigation
- **Page Model**: The data structure representing a teletext page's content and metadata
- **Firestore**: Firebase's NoSQL database used for caching pages and storing conversation state
- **Firebase Storage**: Cloud storage service used for static page content and theme assets

## Requirements

### Requirement 1

**User Story:** As a user, I want to navigate between pages using three-digit page numbers, so that I can access information with the authentic teletext experience.

#### Acceptance Criteria

1. WHEN a user enters a three-digit page number (100-899) THEN the Teletext System SHALL display the corresponding page within 500 milliseconds
2. WHEN a user enters an invalid page number THEN the Teletext System SHALL display an error message and remain on the current page
3. WHEN a page is loading THEN the Teletext System SHALL display a loading indicator with green text animation mimicking broadcast delay
4. WHEN a user presses the BACK button THEN the Teletext System SHALL navigate to the previously viewed page
5. WHEN a user presses channel up or down THEN the Teletext System SHALL navigate to the next or previous page in sequence

### Requirement 2

**User Story:** As a user, I want to see content displayed in an authentic 40×24 character grid with monospaced font, so that I experience the classic teletext aesthetic.

#### Acceptance Criteria

1. THE Teletext System SHALL render all pages as exactly 40 characters wide by 24 rows tall
2. WHEN content exceeds 40 characters in width THEN the Teletext System SHALL wrap or truncate the text at the 40-character boundary
3. THE Teletext System SHALL use a monospaced font for all page content
4. WHEN rendering a page THEN the Teletext System SHALL support the seven standard teletext colors (red, green, yellow, blue, magenta, cyan, white) plus black
5. THE Teletext System SHALL display pages within a CRT-style frame with optional scanline effects

### Requirement 3

**User Story:** As a user, I want to access an index page that shows available content categories, so that I can discover what information is available.

#### Acceptance Criteria

1. WHEN a user navigates to page 100 THEN the Teletext System SHALL display the main index with all available magazines
2. THE Teletext System SHALL organize the index into magazines: 1xx (System), 2xx (News), 3xx (Sport), 4xx (Markets), 5xx (AI), 6xx (Games), 7xx (Settings), 8xx (Dev)
3. WHEN displaying the index THEN the Teletext System SHALL show colored Fastext navigation options at the bottom
4. WHEN a user presses a colored button THEN the Teletext System SHALL navigate to the corresponding magazine index page
5. THE Teletext System SHALL display the current date and time in the header of page 100

### Requirement 4

**User Story:** As a user, I want to view live news headlines from external sources, so that I can stay informed through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 200 THEN the Teletext System SHALL display the news index with available news categories
2. WHEN a user navigates to page 201 THEN the Teletext System SHALL display top headlines from a news API formatted as teletext rows
3. WHEN news content exceeds 24 rows THEN the Teletext System SHALL provide navigation to continuation pages (202, 203, etc.)
4. THE Teletext System SHALL update news content at least every 5 minutes
5. WHEN a news API is unavailable THEN the Teletext System SHALL display a service unavailable message on the news pages

### Requirement 5

**User Story:** As a user, I want to view live sports scores and league tables, so that I can follow my favorite teams through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 300 THEN the Teletext System SHALL display the sports index with available sports categories
2. WHEN a user navigates to page 301 THEN the Teletext System SHALL display live scores from a sports API formatted as teletext rows
3. WHEN a user navigates to page 302 THEN the Teletext System SHALL display league tables with team rankings
4. THE Teletext System SHALL format scores with team names truncated to fit within 40-character rows
5. THE Teletext System SHALL update sports data at least every 2 minutes during live events

### Requirement 6

**User Story:** As a user, I want to view market data including cryptocurrency and stock prices, so that I can monitor financial information through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 400 THEN the Teletext System SHALL display the markets index with available market categories
2. WHEN a user navigates to page 401 THEN the Teletext System SHALL display cryptocurrency prices with percentage changes
3. WHEN a user navigates to page 402 THEN the Teletext System SHALL display stock market data formatted as teletext rows
4. THE Teletext System SHALL format market data with aligned columns for prices and percentage changes
5. THE Teletext System SHALL update market data at least every 60 seconds

### Requirement 7

**User Story:** As a user, I want to interact with an AI assistant using only numeric keypad input, so that I can access AI capabilities while maintaining the authentic teletext interaction model.

#### Acceptance Criteria

1. WHEN a user navigates to page 500 THEN the Teletext System SHALL display the AI Oracle index with numbered service options
2. WHEN a user selects an AI service option THEN the Teletext System SHALL present a menu-driven flow using only numeric choices
3. WHEN the AI Oracle generates a response THEN the Teletext System SHALL format the response as one or more teletext pages
4. WHEN an AI response exceeds 24 rows THEN the Teletext System SHALL split the response across multiple pages with navigation links
5. THE Teletext System SHALL maintain conversation context across multiple AI interaction pages within a session

### Requirement 8

**User Story:** As a user, I want to play interactive quiz games, so that I can be entertained through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 600 THEN the Teletext System SHALL display the games index with available games
2. WHEN a user navigates to page 601 THEN the Teletext System SHALL present a multiple-choice quiz with numeric answer options
3. WHEN a user selects an answer THEN the Teletext System SHALL navigate to a result page showing whether the answer was correct
4. WHEN a quiz is completed THEN the Teletext System SHALL display a score summary page
5. THE Teletext System SHALL support branching quiz flows where different answers lead to different page sequences

### Requirement 9

**User Story:** As a user, I want to customize the visual appearance with different themes and effects, so that I can personalize my teletext experience.

#### Acceptance Criteria

1. WHEN a user navigates to page 700 THEN the Teletext System SHALL display the settings index with available customization options
2. WHEN a user selects a theme option THEN the Teletext System SHALL apply the selected color palette to all pages
3. THE Teletext System SHALL support at least three theme options: Classic Ceefax, High Contrast, and Haunting Mode
4. WHEN a user enables scanline effects THEN the Teletext System SHALL overlay CRT-style scanlines on the display
5. WHEN a user enables Haunting Mode THEN the Teletext System SHALL apply glitch effects and horror-themed visual elements

### Requirement 10

**User Story:** As a developer, I want to view the raw JSON data behind any page, so that I can understand the page model and debug content issues.

#### Acceptance Criteria

1. WHEN a user navigates to page 800 THEN the Teletext System SHALL display the developer tools index
2. WHEN a user navigates to page 801 THEN the Teletext System SHALL display the raw JSON representation of the current page
3. THE Teletext System SHALL format JSON data to fit within the 40-character width constraint
4. WHEN JSON data exceeds 24 rows THEN the Teletext System SHALL provide navigation to continuation pages
5. THE Teletext System SHALL include metadata such as source adapter, last updated timestamp, and cache status

### Requirement 11

**User Story:** As a system architect, I want content to be fetched from external APIs through adapter services, so that the system can integrate diverse data sources while maintaining a consistent page format.

#### Acceptance Criteria

1. THE Teletext System SHALL route page requests to the appropriate Content Adapter based on page number ranges
2. WHEN a Content Adapter receives a page request THEN the Content Adapter SHALL fetch data from the external API and transform it into a Page Model
3. WHEN an external API request fails THEN the Content Adapter SHALL return an error page in teletext format
4. THE Teletext System SHALL cache adapter responses in Firestore for configurable time periods to reduce API calls
5. WHEN a Content Adapter transforms data THEN the Content Adapter SHALL ensure all text rows are exactly 40 characters or less

### Requirement 12

**User Story:** As a user, I want to use keyboard shortcuts and an on-screen remote, so that I can navigate efficiently using either input method.

#### Acceptance Criteria

1. THE Teletext System SHALL provide an on-screen Remote Interface with digits 0-9, colored buttons, and navigation controls
2. WHEN a user presses a keyboard number key THEN the Teletext System SHALL register the digit as part of a page number entry
3. WHEN a user presses Enter THEN the Teletext System SHALL navigate to the entered page number
4. WHEN a user clicks an on-screen button THEN the Teletext System SHALL perform the same action as the corresponding keyboard input
5. THE Teletext System SHALL display the currently entered page number digits before navigation occurs

### Requirement 13

**User Story:** As a user, I want the system to handle edge cases gracefully and include hidden Easter eggs, so that I have a reliable and entertaining experience.

#### Acceptance Criteria

1. WHEN a user enters page 404 THEN the Teletext System SHALL display a "Page not found" error with animated glitch effects and horror-themed ASCII art
2. WHEN API content is empty THEN the Teletext System SHALL display a "No content available" message
3. WHEN API content contains special characters THEN the Teletext System SHALL sanitize or escape characters to prevent display issues
4. WHEN network connectivity is lost THEN the Teletext System SHALL display cached content with a "Cached" indicator
5. WHEN a user enters page 666 THEN the Teletext System SHALL display a hidden horror-themed Easter egg page with AI-generated spooky story and disturbing visual effects

### Requirement 14

**User Story:** As a content provider, I want the system to parse and format text content automatically, so that external data can be displayed correctly in the teletext format.

#### Acceptance Criteria

1. WHEN content exceeds 40 characters THEN the Teletext System SHALL wrap text at word boundaries when possible
2. WHEN a word exceeds 40 characters THEN the Teletext System SHALL hard-wrap the word at the 40-character boundary
3. WHEN formatting tabular data THEN the Teletext System SHALL align columns using spaces to fit within 40 characters
4. WHEN parsing HTML content THEN the Teletext System SHALL strip HTML tags and extract plain text
5. WHEN content contains multiple consecutive spaces THEN the Teletext System SHALL preserve spacing for layout purposes

### Requirement 15

**User Story:** As a user, I want pages to load quickly and the interface to be responsive, so that I have a smooth navigation experience.

#### Acceptance Criteria

1. WHEN a user navigates to a cached page THEN the Teletext System SHALL display the page within 100 milliseconds
2. WHEN a user navigates to an uncached page THEN the Teletext System SHALL display the page within 500 milliseconds
3. WHEN a page is loading THEN the Teletext System SHALL remain responsive to user input
4. THE Teletext System SHALL preload the index page (100) and frequently accessed pages on application startup
5. WHEN multiple rapid page navigation requests occur THEN the Teletext System SHALL cancel pending requests and prioritize the most recent request


### Requirement 16

**User Story:** As a user, I want to view weather information for different cities, so that I can check forecasts through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 420 THEN the Teletext System SHALL display the weather index with city selection options
2. WHEN a user navigates to a city-specific weather page (e.g., 420-34) THEN the Teletext System SHALL display current weather and forecast for that city
3. THE Teletext System SHALL format weather data with temperature, conditions, and forecast in teletext rows
4. THE Teletext System SHALL support at least 20 major cities with dedicated weather pages
5. THE Teletext System SHALL update weather data at least every 30 minutes

### Requirement 17

**User Story:** As an emergency services coordinator, I want to display breaking alerts and emergency bulletins, so that critical information can be disseminated quickly in a low-bandwidth format.

#### Acceptance Criteria

1. WHEN a user navigates to page 120 THEN the Teletext System SHALL display the emergency bulletin and breaking alerts page
2. WHEN breaking news occurs THEN the Teletext System SHALL update page 120 within 60 seconds
3. THE Teletext System SHALL highlight emergency content with red text and flashing indicators
4. WHEN no emergency alerts are active THEN the Teletext System SHALL display "No active alerts" message
5. THE Teletext System SHALL maintain a history of recent alerts accessible through sub-pages (121-129)

### Requirement 18

**User Story:** As a user, I want to see detailed information about how the system works and credits, so that I can understand the technology and its creators.

#### Acceptance Criteria

1. WHEN a user navigates to page 101 THEN the Teletext System SHALL display a "How it works" page explaining the teletext concept
2. WHEN a user navigates to page 199 THEN the Teletext System SHALL display credits and about information
3. WHEN a user navigates to page 999 THEN the Teletext System SHALL display a help page with navigation instructions
4. THE Teletext System SHALL format help content with clear examples of page navigation
5. THE Teletext System SHALL include links to source code repository and documentation

### Requirement 19

**User Story:** As a user, I want to experience a boot sequence when first loading the application, so that I feel the nostalgic CRT television startup experience.

#### Acceptance Criteria

1. WHEN a user first loads the application THEN the Teletext System SHALL display a CRT warm-up animation
2. WHEN the boot sequence plays THEN the Teletext System SHALL show static noise transitioning to the index page
3. THE Teletext System SHALL complete the boot sequence within 3 seconds
4. WHEN the boot sequence completes THEN the Teletext System SHALL display page 100 with a welcome message
5. THE Teletext System SHALL allow users to skip the boot sequence by pressing any key

### Requirement 20

**User Story:** As a user, I want to access a spooky story generator for Halloween entertainment, so that I can enjoy horror-themed AI-generated content.

#### Acceptance Criteria

1. WHEN a user navigates to page 505 THEN the Teletext System SHALL display the spooky story generator menu
2. WHEN a user selects a story theme THEN the Teletext System SHALL use Gemini AI to generate a horror story
3. THE Teletext System SHALL format the generated story across multiple pages with "NEXT PAGE" links
4. WHEN a story is generated THEN the Teletext System SHALL apply haunting mode visual effects
5. THE Teletext System SHALL save generated stories to conversation history for later recall

### Requirement 21

**User Story:** As a user, I want to play a Bamboozle-style branching quiz game, so that I can enjoy interactive entertainment through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 610 THEN the Teletext System SHALL display the Bamboozle game introduction
2. WHEN a user selects an answer THEN the Teletext System SHALL navigate to a different page based on the answer choice
3. THE Teletext System SHALL support at least 3 different story paths through the quiz
4. WHEN a user completes a path THEN the Teletext System SHALL display an ending page with score and commentary
5. THE Teletext System SHALL allow users to restart the game from page 610

### Requirement 22

**User Story:** As a user, I want to view my conversation history with the AI Oracle, so that I can review previous interactions.

#### Acceptance Criteria

1. WHEN a user navigates to page 520 THEN the Teletext System SHALL display a conversation index with recent AI interactions
2. WHEN a user selects a conversation from the index THEN the Teletext System SHALL display the full conversation thread
3. THE Teletext System SHALL store at least the last 10 conversations in Firestore
4. WHEN displaying conversation history THEN the Teletext System SHALL show timestamps and conversation topics
5. THE Teletext System SHALL allow users to delete individual conversations from history

### Requirement 23

**User Story:** As a user, I want to access keyboard shortcuts and help documentation, so that I can navigate efficiently.

#### Acceptance Criteria

1. WHEN a user navigates to page 720 THEN the Teletext System SHALL display a keyboard shortcuts reference
2. THE Teletext System SHALL document all keyboard shortcuts including digits, Enter, arrow keys, and colored buttons
3. WHEN a user navigates to page 710 THEN the Teletext System SHALL display custom shortcut configuration options
4. THE Teletext System SHALL support keyboard shortcuts for quick access to favorite pages
5. THE Teletext System SHALL allow users to save up to 10 favorite pages with single-key access

### Requirement 24

**User Story:** As a developer, I want to explore the API and see raw data, so that I can understand the system architecture and build extensions.

#### Acceptance Criteria

1. WHEN a user navigates to page 800 THEN the Teletext System SHALL display the API explorer index
2. WHEN a user navigates to page 801 THEN the Teletext System SHALL display the raw JSON of the currently viewed page
3. WHEN a user navigates to page 802 THEN the Teletext System SHALL display API endpoint documentation
4. THE Teletext System SHALL format JSON data with syntax highlighting using teletext colors
5. THE Teletext System SHALL include example API requests and responses on page 803

### Requirement 25

**User Story:** As a user, I want to see a random interesting fact, so that I can discover new information through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 620 THEN the Teletext System SHALL display a random fact
2. THE Teletext System SHALL fetch facts from an external API or curated database
3. WHEN a user refreshes page 620 THEN the Teletext System SHALL display a different random fact
4. THE Teletext System SHALL format facts to fit within the 40×24 constraint
5. THE Teletext System SHALL categorize facts by topic (science, history, technology, etc.)

### Requirement 26

**User Story:** As a user, I want to access different teletext color palettes inspired by classic services, so that I can customize the visual experience.

#### Acceptance Criteria

1. WHEN a user navigates to page 700 THEN the Teletext System SHALL display theme options including Ceefax, ORF, and custom palettes
2. WHEN a user selects the Ceefax theme THEN the Teletext System SHALL apply yellow text on blue background with classic BBC colors
3. WHEN a user selects the ORF theme THEN the Teletext System SHALL apply the Austrian teletext color scheme
4. THE Teletext System SHALL persist theme selection in Firestore user preferences
5. THE Teletext System SHALL provide a preview of each theme before selection

### Requirement 27

**User Story:** As a user, I want to adjust CRT visual effects intensity, so that I can balance authenticity with readability.

#### Acceptance Criteria

1. WHEN a user navigates to page 701 THEN the Teletext System SHALL display CRT effect controls
2. THE Teletext System SHALL provide sliders for scanline intensity, screen curvature, and noise level
3. WHEN a user adjusts an effect setting THEN the Teletext System SHALL apply changes in real-time
4. THE Teletext System SHALL save effect preferences to Firestore
5. THE Teletext System SHALL provide a "reset to defaults" option on page 701

### Requirement 28

**User Story:** As a user, I want to view detailed sports league tables and team statistics, so that I can follow my favorite teams.

#### Acceptance Criteria

1. WHEN a user navigates to page 302 THEN the Teletext System SHALL display league tables with team rankings
2. WHEN a user navigates to page 310 THEN the Teletext System SHALL display a team watchlist configuration page
3. THE Teletext System SHALL allow users to add up to 5 favorite teams to their watchlist
4. WHEN a user navigates to pages 311-315 THEN the Teletext System SHALL display dedicated pages for each watchlist team
5. THE Teletext System SHALL format team statistics including wins, losses, goals, and points

### Requirement 29

**User Story:** As a user, I want to view foreign exchange rates, so that I can monitor currency markets through the teletext interface.

#### Acceptance Criteria

1. WHEN a user navigates to page 410 THEN the Teletext System SHALL display major currency exchange rates
2. THE Teletext System SHALL show rates for at least 10 major currency pairs (USD, EUR, GBP, JPY, etc.)
3. THE Teletext System SHALL format exchange rates with 4 decimal precision
4. THE Teletext System SHALL display percentage changes over 24 hours
5. THE Teletext System SHALL update forex data at least every 5 minutes

### Requirement 30

**User Story:** As a user, I want to access topic-specific news deep dives, so that I can read detailed coverage of specific subjects.

#### Acceptance Criteria

1. WHEN a user navigates to pages 210-219 THEN the Teletext System SHALL display topic-specific news categories
2. THE Teletext System SHALL support categories including technology, business, entertainment, and science
3. WHEN a user selects a category THEN the Teletext System SHALL display the top 5 stories in that category
4. THE Teletext System SHALL format each story with headline, summary, and source
5. THE Teletext System SHALL provide navigation links between related stories

### Requirement 31

**User Story:** As a developer, I want clear error messages and fallback behavior when services are unavailable, so that I can quickly diagnose and fix issues during development.

#### Acceptance Criteria

1. WHEN Firebase emulators are not running THEN the Teletext System SHALL display a helpful error message with instructions to start the emulators
2. WHEN an API key is missing or invalid THEN the Teletext System SHALL display an error page indicating which configuration is missing
3. WHEN a page adapter fails THEN the Teletext System SHALL provide fallback static content with error details
4. WHEN in development mode THEN the Teletext System SHALL validate all required environment variables on startup
5. WHEN network requests fail THEN the Teletext System SHALL log detailed error information for debugging

### Requirement 32

**User Story:** As a user, I want clear navigation instructions on the main index page, so that I understand how to access different sections.

#### Acceptance Criteria

1. WHEN viewing page 100 THEN the Teletext System SHALL display specific page numbers (e.g., "200", "300") instead of range notation (e.g., "2xx", "3xx")
2. WHEN a magazine section has multiple pages THEN the Teletext System SHALL provide a sub-index page listing all available pages
3. WHEN a user navigates to a magazine index THEN the Teletext System SHALL display numbered options for each available page
4. THE Teletext System SHALL provide examples of page numbers to try (e.g., "Try 200 for News Headlines")
5. WHEN colored buttons are pressed THEN the Teletext System SHALL navigate to the corresponding magazine index page with detailed listings

### Requirement 33

**User Story:** As a user, I want consistent back navigation behavior, so that I can easily return to the main index from any page.

#### Acceptance Criteria

1. WHEN a user presses the back button from any page THEN the Teletext System SHALL navigate to the previously viewed page
2. WHEN a user enters page number 100 THEN the Teletext System SHALL always navigate to the main index regardless of current location
3. WHEN navigation history is empty THEN the back button SHALL navigate to page 100
4. WHEN a user navigates 100 → 200 → 201 and presses back twice THEN the Teletext System SHALL return to page 100
5. THE Teletext System SHALL treat page 100 as the home page in all navigation contexts

### Requirement 34

**User Story:** As a user, I want the main index page to display actual page numbers with full-screen layout, so that I can easily navigate to specific content sections.

#### Acceptance Criteria

1. WHEN viewing page 100 THEN the Teletext System SHALL display specific page numbers (e.g., "101 System Info", "200 News Headlines") instead of range notation
2. WHEN displaying the index THEN the Teletext System SHALL use the full 40-character width for content display
3. WHEN content is displayed THEN the Teletext System SHALL center or justify text to utilize the entire screen width
4. WHEN magazine sections are listed THEN the Teletext System SHALL provide clear page number examples for each section
5. THE Teletext System SHALL display navigation instructions that reference specific page numbers

### Requirement 35

**User Story:** As a user, I want to navigate through multi-page content using arrow keys, so that I can read all available information without manually entering page numbers.

#### Acceptance Criteria

1. WHEN content exceeds 24 rows THEN the Teletext System SHALL display a "MORE" indicator at the bottom of the page
2. WHEN a user presses the down arrow key on a page with more content THEN the Teletext System SHALL navigate to the next continuation page
3. WHEN a user presses the up arrow key on a continuation page THEN the Teletext System SHALL navigate to the previous page
4. WHEN on the last page of multi-page content THEN the down arrow SHALL display "END OF CONTENT" message
5. THE Teletext System SHALL display page indicators showing current position (e.g., "Page 1/3")

### Requirement 36

**User Story:** As a user, I want an enhanced Halloween-themed visual mode, so that I can experience a spooky atmosphere for the Kiroween hackathon.

#### Acceptance Criteria

1. WHEN Haunting Mode is enabled THEN the Teletext System SHALL apply Halloween-themed color palette with orange, purple, and green accents
2. WHEN Haunting Mode is active THEN the Teletext System SHALL display animated glitch effects and screen distortions
3. WHEN viewing pages in Haunting Mode THEN the Teletext System SHALL show Halloween-themed decorative elements (pumpkins, ghosts, bats)
4. WHEN Haunting Mode is enabled THEN the Teletext System SHALL apply eerie CRT effects including flickering and chromatic aberration
5. THE Teletext System SHALL persist Haunting Mode selection across page navigations

### Requirement 37

**User Story:** As a user, I want theme selection to work interactively on page 700, so that I can switch between visual themes by pressing number keys.

#### Acceptance Criteria

1. WHEN a user navigates to page 700 THEN the Teletext System SHALL display numbered theme options (1-4)
2. WHEN a user presses a number key (1-4) on page 700 THEN the Teletext System SHALL immediately apply the selected theme
3. WHEN a theme is applied THEN the Teletext System SHALL show visual confirmation of the theme change
4. WHEN a theme is selected THEN the Teletext System SHALL save the preference to Firestore
5. THE Teletext System SHALL load the user's saved theme preference on application startup

### Requirement 38

**User Story:** As a developer, I want clear error messages when environment variables are missing, so that I can quickly identify and fix configuration issues.

#### Acceptance Criteria

1. WHEN NEWS_API_KEY is not configured THEN the Teletext System SHALL display a specific error message on news pages indicating the missing key
2. WHEN any required API key is missing THEN the Teletext System SHALL display the environment variable name and setup instructions
3. WHEN environment validation fails THEN the Teletext System SHALL log detailed error information to the console
4. WHEN in development mode THEN the Teletext System SHALL validate all required environment variables on startup
5. THE Teletext System SHALL provide a link to configuration documentation in error messages

### Requirement 39

**User Story:** As a user, I want all content sections to have meaningful content, so that I can explore the full functionality of the application.

#### Acceptance Criteria

1. WHEN a user navigates to page 400 THEN the Teletext System SHALL display market data including cryptocurrency and stock prices
2. WHEN a user navigates to page 500 THEN the Teletext System SHALL display the AI Oracle menu with working Vertex AI integration
3. WHEN a user navigates to any section index page THEN the Teletext System SHALL display at least 3 available sub-pages
4. WHEN API data is unavailable THEN the Teletext System SHALL display sample data or helpful placeholder content
5. THE Teletext System SHALL ensure every magazine section (1xx-8xx) has at least one working content page
