import tmdbData from './complete_tmdb_data.json';

export type ServiceType = 'Netflix' | 'HBO Max' | 'Disney Plus' | 'Prime Video' | 'Apple TV' | 'SkyShowtime' | 'Oneplay';

export type Title = {
  id: number;
  type: "Film" | "Seriál";
  title: string;
  rating: number; // 0-100
  overview: string;
  cast: string[];
  runtime: number; // in minutes
  release_year: string;
  genres: string[];
  streaming_services: ServiceType[];
  watch_link: string;
  poster_url: string;
  backdrop_url: string;
};

export const serviceLogos: Record<ServiceType, string> = {
  'Netflix': '/src/app/images/netflix_logo.svg',
  'HBO Max': '/src/app/images/hbo_max_logo.png',
  'Disney Plus': '/src/app/images/Disney_plus_logo.png',
  'Prime Video': '/src/app/images/prime_video_logo.png',
  'Apple TV': '/src/app/images/apple_tv_logo.png',
  'SkyShowtime': '/src/app/images/skyshowtime_logo.png',
  'Oneplay': '/src/app/images/oneplay_logo.png'
};

export const serviceColors: Record<ServiceType, string> = {
  'Netflix': '#e50914',
  'HBO Max': '#7c3aed',
  'Disney Plus': '#0063e5',
  'Prime Video': '#00a8e1',
  'Apple TV': '#444444',
  'SkyShowtime': '#4f46e5',
  'Oneplay': '#F2B705'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawData = tmdbData as any[];
const uniqueDataMap = new Map<string, Title>();

rawData.forEach(m => {
  // Normalizace názvu Prime Video
  const services = (m.streaming_services as string[]).map(s => 
    s === 'Amazon Prime Video' ? 'Prime Video' : s
  ) as ServiceType[];

  const title: Title = {
    ...m,
    streaming_services: services
  };

  // Zajistí, že ID budou unikátní (kombinace typu a ID pro jistotu)
  uniqueDataMap.set(`${title.type}-${title.id}`, title);
});

export const catalog: Title[] = Array.from(uniqueDataMap.values());
