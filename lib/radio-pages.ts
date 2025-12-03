/**
 * Radio Pages (471)
 * Radio Listings with integrated media player
 */

import { TeletextPage } from '@/types/teletext';

/**
 * Radio station data structure
 */
export interface RadioStation {
  id: string;
  name: string;
  country: string;
  genre: string;
  streamUrl: string;
  bitrate?: number;
}

/**
 * Popular radio stations from around the world
 * Using reliable streaming URLs that support CORS
 */
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: '1',
    name: 'Radio Swiss Jazz',
    country: 'Switzerland',
    genre: 'Jazz',
    streamUrl: 'https://stream.srg-ssr.ch/m/rsj/mp3_128',
    bitrate: 128
  },
  {
    id: '2',
    name: 'Radio Swiss Classic',
    country: 'Switzerland',
    genre: 'Classical',
    streamUrl: 'https://stream.srg-ssr.ch/m/rsc_de/mp3_128',
    bitrate: 128
  },
  {
    id: '3',
    name: 'Radio Paradise',
    country: 'USA',
    genre: 'Eclectic',
    streamUrl: 'https://stream.radioparadise.com/aac-320',
    bitrate: 320
  },
  {
    id: '4',
    name: 'Classic FM',
    country: 'UK',
    genre: 'Classical',
    streamUrl: 'http://media-ice.musicradio.com/ClassicFMMP3',
    bitrate: 128
  },
  {
    id: '5',
    name: 'Radio Swiss Pop',
    country: 'Switzerland',
    genre: 'Pop',
    streamUrl: 'https://stream.srg-ssr.ch/m/rsp/mp3_128',
    bitrate: 128
  },
  {
    id: '6',
    name: 'FIP Radio',
    country: 'France',
    genre: 'Eclectic/World',
    streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    bitrate: 128
  },
  {
    id: '7',
    name: 'Capital FM',
    country: 'UK',
    genre: 'Pop/Dance',
    streamUrl: 'http://media-ice.musicradio.com/CapitalMP3',
    bitrate: 128
  },
  {
    id: '8',
    name: 'Heart FM',
    country: 'UK',
    genre: 'Pop',
    streamUrl: 'http://media-ice.musicradio.com/HeartLondonMP3',
    bitrate: 128
  },
  {
    id: '9',
    name: 'Smooth Radio',
    country: 'UK',
    genre: 'Easy Listening',
    streamUrl: 'http://media-ice.musicradio.com/SmoothLondonMP3',
    bitrate: 128
  }
];

/**
 * Creates page 471 - Radio Listings with integrated player
 * Can be called with a station ID parameter to select a specific station
 */
export function createRadioListingsPage(params?: { stationId?: string }): TeletextPage {
  const selectedStation = params?.stationId;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const currentStation = selectedStation || '1';
  const station = RADIO_STATIONS.find(s => s.id === currentStation) || RADIO_STATIONS[0];
  
  const rows = [
    `{cyan}471 {yellow}📻 RADIO LISTINGS 📻 {cyan}${timeStr}                                                                                                                    {red}🔴{green}🟢{yellow}🟡{blue}🔵`,
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '',
    '{cyan}▓▓▓ NOW PLAYING ▓▓▓',
    `{yellow}► {white}${station.name.padEnd(35)} {green}[${station.id}]`,
    `{white}  ${station.genre.padEnd(20)} {cyan}${station.country}`,
    `{white}  Quality: {green}${station.bitrate || 128}kbps`,
    '',
    '{cyan}▓▓▓ AVAILABLE STATIONS ▓▓▓',
    ...RADIO_STATIONS.map(s => {
      const isPlaying = s.id === currentStation;
      const prefix = isPlaying ? '{yellow}►' : '{white} ';
      const color = isPlaying ? '{yellow}' : '{green}';
      return `${prefix} {green}[${s.id}]{white} ${s.name.padEnd(25)} ${color}${s.genre.padEnd(18)}{cyan}${s.country}`;
    }),
    '',
    '{cyan}▓▓▓ CONTROLS ▓▓▓',
    '{white}Press {green}1-9{white} to select a station',
    '{white}Press {yellow}SPACE{white} to play/pause',
    '{white}Press {red}M{white} to mute/unmute',
    '',
    '{magenta}╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗',
    '{magenta}║ {yellow}💡 TIP:{white} Use number keys to quickly switch between stations. Audio plays in background!                          {magenta}║',
    '{magenta}╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝',
    '',
    '{blue}═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════',
    '{cyan}NAVIGATION: {red}RED{white}=INDEX {green}GREEN{white}=SERVICES {yellow}1-9{white}=SELECT STATION {blue}SPACE{white}=PLAY/PAUSE',
    ''
  ];
  
  return {
    id: '471',
    title: 'Radio Listings',
    rows,
    links: [
      { label: 'INDEX', targetPage: '100', color: 'red' },
      { label: 'SERVICES', targetPage: '100', color: 'green' },
      ...RADIO_STATIONS.map(s => ({ 
        label: s.id, 
        targetPage: `471?station=${s.id}` 
      }))
    ],
    meta: {
      source: 'StaticAdapter',
      lastUpdated: new Date().toISOString(),
      cacheStatus: 'fresh',
      fullScreenLayout: true,
      useLayoutManager: true,
      renderedWithLayoutEngine: true,
      inputMode: 'single',
      inputOptions: RADIO_STATIONS.map(s => s.id),
      radioPlayer: {
        enabled: true,
        currentStation: station,
        stations: RADIO_STATIONS
      }
    }
  };
}
