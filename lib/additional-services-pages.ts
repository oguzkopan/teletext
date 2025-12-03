/**
 * Additional Services Pages (450-452, 460-462, 470, 472)
 * Currency, Lottery, Horoscopes, Flights, Hotels, Restaurants, TV Guide, Cinema
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Creates page 450 - Currency Exchange Rates
 */
export function createCurrencyExchangePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  // Mock exchange rates (in production, fetch from API)
  const rates = [
    { from: 'USD', to: 'EUR', rate: '0.92', change: '+0.01' },
    { from: 'USD', to: 'GBP', rate: '0.79', change: '-0.02' },
    { from: 'USD', to: 'JPY', rate: '149.50', change: '+1.20' },
    { from: 'EUR', to: 'GBP', rate: '0.86', change: '-0.01' },
    { from: 'EUR', to: 'USD', rate: '1.09', change: '-0.01' },
    { from: 'GBP', to: 'USD', rate: '1.27', change: '+0.03' }
  ];
  
  const rows = [
    `{cyan}450 {yellow}💱 CURRENCY EXCHANGE RATES 💱 {cyan}${timeStr}                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ LIVE EXCHANGE RATES ▓▓▓',
    '{white}Updated every 60 seconds',
    '',
    '{yellow}FROM    TO      RATE        CHANGE',
    '{blue}─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    ...rates.map(r => {
      const changeColor = r.change.startsWith('+') ? '{green}' : '{red}';
      return `{white}${r.from.padEnd(8)}${r.to.padEnd(8)}${r.rate.padEnd(12)}${changeColor}${r.change}`;
    }),
    '',
    '{cyan}▓▓▓ POPULAR CURRENCIES ▓▓▓',
    '{green}•{white} USD - US Dollar          {green}•{white} EUR - Euro',
    '{green}•{white} GBP - British Pound      {green}•{white} JPY - Japanese Yen',
    '{green}•{white} CHF - Swiss Franc        {green}•{white} CAD - Canadian Dollar',
    '{green}•{white} AUD - Australian Dollar  {green}•{white} CNY - Chinese Yuan',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Rates are indicative only. Check with your bank for actual transaction rates.                           {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MARKETS {yellow}YELLOW{white}=REFRESH',
    ''
  ];
  
  return {
    id: '450',
    title: 'Currency Exchange',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'MARKETS', targetPage: '400', color: 'green' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 451 - Lottery Results
 */
export function createLotteryResultsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}451 {yellow}🎰 LOTTERY RESULTS 🎰 {cyan}${timeStr}                                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ NATIONAL LOTTERY - SATURDAY DRAW ▓▓▓',
    '{white}Draw Date: {yellow}Saturday, December 2, 2025',
    '',
    '{yellow}WINNING NUMBERS:',
    '{white}Main Numbers:  {yellow}07  {yellow}14  {yellow}23  {yellow}31  {yellow}42  {yellow}49',
    '{white}Bonus Ball:    {green}18',
    '',
    '{cyan}▓▓▓ EUROMILLIONS - TUESDAY DRAW ▓▓▓',
    '{white}Draw Date: {yellow}Tuesday, December 3, 2025',
    '',
    '{yellow}WINNING NUMBERS:',
    '{white}Main Numbers:  {yellow}05  {yellow}12  {yellow}28  {yellow}33  {yellow}47',
    '{white}Lucky Stars:   {green}03  {green}09',
    '',
    '{cyan}▓▓▓ THUNDERBALL - LATEST DRAW ▓▓▓',
    '{white}Main Numbers:  {yellow}11  {yellow}19  {yellow}27  {yellow}34  {yellow}38',
    '{white}Thunderball:   {red}06',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Always check official lottery websites for verified results.                                            {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=SERVICES',
    ''
  ];
  
  return {
    id: '451',
    title: 'Lottery Results',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'SERVICES', targetPage: '100', color: 'green' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 452 - Horoscopes & Astrology
 */
export function createHoroscopesPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}452 {yellow}⭐ HOROSCOPES & ASTROLOGY ⭐ {cyan}${timeStr}                                                                                                        {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ TODAY\'S HOROSCOPES ▓▓▓',
    '{white}Wednesday, December 3, 2025',
    '',
    '{yellow}♈ ARIES {white}(Mar 21-Apr 19)',
    '{white}Today brings new opportunities. Trust your instincts.',
    '',
    '{yellow}♉ TAURUS {white}(Apr 20-May 20)',
    '{white}Financial matters require attention. Stay focused.',
    '',
    '{yellow}♊ GEMINI {white}(May 21-Jun 20)',
    '{white}Communication is key today. Express yourself clearly.',
    '',
    '{yellow}♋ CANCER {white}(Jun 21-Jul 22)',
    '{white}Home and family take priority. Nurture relationships.',
    '',
    '{yellow}♌ LEO {white}(Jul 23-Aug 22)',
    '{white}Your creativity shines. Share your talents with others.',
    '',
    '{yellow}♍ VIRGO {white}(Aug 23-Sep 22)',
    '{white}Organization pays off. Complete pending tasks.',
    '',
    '{magenta}Press {yellow}453{white} for more signs...',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MORE SIGNS {yellow}453{white}=NEXT PAGE',
    ''
  ];
  
  return {
    id: '452',
    title: 'Horoscopes',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'MORE', targetPage: '453', color: 'green' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 460 - Flight Information
 */
export function createFlightInfoPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}460 {yellow}✈️ FLIGHT INFORMATION ✈️ {cyan}${timeStr}                                                                                                            {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ LONDON HEATHROW (LHR) - DEPARTURES ▓▓▓',
    '',
    '{yellow}TIME    FLIGHT  DESTINATION         STATUS',
    '{blue}─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    '{white}13:45   BA123   New York JFK        {green}On Time',
    '{white}14:15   VS456   Los Angeles         {green}Boarding',
    '{white}14:30   LH789   Frankfurt           {yellow}Delayed 20min',
    '{white}15:00   AF234   Paris CDG           {green}On Time',
    '{white}15:30   EK567   Dubai               {green}On Time',
    '{white}16:00   QR890   Doha                {yellow}Delayed 15min',
    '',
    '{cyan}▓▓▓ ARRIVALS ▓▓▓',
    '{yellow}TIME    FLIGHT  FROM                STATUS',
    '{blue}─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
    '{white}13:30   BA456   Singapore           {green}Landed',
    '{white}14:00   VS789   New York JFK        {green}On Time',
    '{white}14:45   LH123   Munich              {green}On Time',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Check with your airline for the most up-to-date flight information.                                    {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=REFRESH {yellow}YELLOW{white}=OTHER AIRPORTS',
    ''
  ];
  
  return {
    id: '460',
    title: 'Flight Information',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 461 - Hotel Bookings
 */
export function createHotelBookingsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}461 {yellow}🏨 HOTEL BOOKINGS 🏨 {cyan}${timeStr}                                                                                                                {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ FEATURED HOTELS - LONDON ▓▓▓',
    '',
    '{yellow}The Savoy Hotel {white}★★★★★',
    '{white}Location: Strand, Covent Garden',
    '{white}Price: {green}£450/night  {white}Rating: {yellow}9.2/10',
    '{white}Amenities: Pool, Spa, Restaurant, Bar',
    '',
    '{yellow}Hilton London Metropole {white}★★★★',
    '{white}Location: Edgware Road',
    '{white}Price: {green}£180/night  {white}Rating: {yellow}8.5/10',
    '{white}Amenities: Gym, Restaurant, WiFi',
    '',
    '{yellow}Premier Inn London City {white}★★★',
    '{white}Location: Tower Hill',
    '{white}Price: {green}£120/night  {white}Rating: {yellow}8.0/10',
    '{white}Amenities: WiFi, Breakfast, 24hr Reception',
    '',
    '{cyan}▓▓▓ SEARCH & BOOK ▓▓▓',
    '{white}Visit our booking partners:',
    '{green}•{white} Booking.com  {green}•{white} Hotels.com  {green}•{white} Expedia',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Book early for best rates. Check cancellation policies before booking.                                  {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=OTHER CITIES',
    ''
  ];
  
  return {
    id: '461',
    title: 'Hotel Bookings',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 462 - Restaurant Reviews
 */
export function createRestaurantReviewsPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}462 {yellow}🍽️ RESTAURANT REVIEWS 🍽️ {cyan}${timeStr}                                                                                                           {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ TOP RATED RESTAURANTS - LONDON ▓▓▓',
    '',
    '{yellow}Sketch {white}★★★ Michelin',
    '{white}Cuisine: Modern European  {white}Price: {yellow}££££',
    '{white}Rating: {green}9.5/10  {white}Location: Mayfair',
    '{white}"Exceptional food and unique atmosphere"',
    '',
    '{yellow}Dishoom {white}Popular',
    '{white}Cuisine: Indian  {white}Price: {green}££',
    '{white}Rating: {green}9.0/10  {white}Location: Covent Garden',
    '{white}"Best Indian food in London, great value"',
    '',
    '{yellow}Hawksmoor {white}Steakhouse',
    '{white}Cuisine: British Steakhouse  {white}Price: {yellow}£££',
    '{white}Rating: {green}8.8/10  {white}Location: Seven Dials',
    '{white}"Perfect steaks, excellent service"',
    '',
    '{cyan}▓▓▓ QUICK SEARCH ▓▓▓',
    '{green}•{white} Italian  {green}•{white} Chinese  {green}•{white} Japanese  {green}•{white} French',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Book ahead for popular restaurants, especially on weekends.                                             {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MORE REVIEWS',
    ''
  ];
  
  return {
    id: '462',
    title: 'Restaurant Reviews',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 470 - TV Guide & Schedules
 */
export function createTVGuidePage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}470 {yellow}📺 TV GUIDE & SCHEDULES 📺 {cyan}${timeStr}                                                                                                          {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ BBC ONE - TONIGHT ▓▓▓',
    '{white}18:00  {yellow}BBC News at Six',
    '{white}18:30  {yellow}EastEnders',
    '{white}19:00  {yellow}The One Show',
    '{white}19:30  {yellow}Panorama',
    '{white}20:00  {yellow}Drama: Silent Witness',
    '{white}21:00  {yellow}BBC News at Ten',
    '',
    '{cyan}▓▓▓ ITV - TONIGHT ▓▓▓',
    '{white}18:00  {yellow}ITV News',
    '{white}18:30  {yellow}Coronation Street',
    '{white}19:00  {yellow}Emmerdale',
    '{white}19:30  {yellow}The Chase',
    '{white}20:00  {yellow}Drama: Vera',
    '',
    '{cyan}▓▓▓ CHANNEL 4 - TONIGHT ▓▓▓',
    '{white}19:00  {yellow}Channel 4 News',
    '{white}20:00  {yellow}Gogglebox',
    '{white}21:00  {yellow}The Great British Bake Off',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=MORE CHANNELS {yellow}471{white}=RADIO',
    ''
  ];
  
  return {
    id: '470',
    title: 'TV Guide',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'RADIO', targetPage: '471', color: 'yellow' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}

/**
 * Creates page 472 - Cinema Showtimes
 */
export function createCinemaShowtimesPage(): TeletextPage {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const rows = [
    `{cyan}472 {yellow}🎬 CINEMA SHOWTIMES 🎬 {cyan}${timeStr}                                                                                                              {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ NOW SHOWING - ODEON LEICESTER SQUARE ▓▓▓',
    '',
    '{yellow}Dune: Part Three {white}[12A]',
    '{white}Showtimes: {green}14:00  17:30  20:45',
    '{white}Rating: {yellow}★★★★★ {white}9.2/10',
    '',
    '{yellow}The Marvels {white}[12A]',
    '{white}Showtimes: {green}13:30  16:15  19:00  21:30',
    '{white}Rating: {yellow}★★★★☆ {white}8.5/10',
    '',
    '{yellow}Wonka {white}[PG]',
    '{white}Showtimes: {green}12:00  14:30  17:00  19:30',
    '{white}Rating: {yellow}★★★★☆ {white}8.0/10',
    '',
    '{cyan}▓▓▓ COMING SOON ▓▓▓',
    '{white}Dec 15: {yellow}Avatar 3',
    '{white}Dec 22: {yellow}Mission: Impossible 8',
    '{white}Dec 25: {yellow}The Color Purple',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Book tickets online to avoid queues. Check for student/senior discounts.                                {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=OTHER CINEMAS',
    ''
  ];
  
  return {
    id: '472',
    title: 'Cinema Showtimes',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' }
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true
    }
  };
}
