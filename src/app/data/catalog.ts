import tmdbData from './complete_tmdb_data.json';

export type ServiceType = 'Netflix' | 'HBO Max' | 'Disney Plus' | 'Prime Video' | 'Apple TV' | 'SkyShowtime' | 'Oneplay' | 'Prima+';

export type Title = {
  id: number;
  type: "Film" | "Seriál";
  title: string;
  title_en: string;
  rating: number;
  overview: string;
  cast: string[];
  runtime: number;
  release_year: string;
  genres: string[];
  episodes: number | null;
  streaming_services: ServiceType[] | null;
  watch_link: string;
  poster_url: string | undefined;
  backdrop_url: string | undefined;
  origin_countries: string[];
};

export const serviceLogos: Record<ServiceType, string> = {
  'Netflix': '/src/app/Logos/netflix_logo.svg',
  'HBO Max': '/src/app/Logos/hbo_max_logo.png',
  'Disney Plus': '/src/app/Logos/Disney_plus_logo.png',
  'Prime Video': '/src/app/Logos/prime_video_logo.png',
  'Apple TV': '/src/app/Logos/apple_tv_logo.png',
  'SkyShowtime': '/src/app/Logos/skyshowtime_logo.png',
  'Oneplay': '/src/app/Logos/oneplay_logo.png',
  'Prima+': '/src/app/Logos/prima_plus.png'
};

export const serviceColors: Record<ServiceType, string> = {
  'Netflix': '#e50914',
  'HBO Max': '#7c3aed',
  'Disney Plus': '#0063e5',
  'Prime Video': '#00a8e1',
  'Apple TV': '#444444',
  'SkyShowtime': '#4f46e5',
  'Oneplay': '#F2B705',
  'Prima+': '#04BFAD'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawData = tmdbData as any[];
const uniqueDataMap = new Map<string, Title>();

const regionNames = new Intl.DisplayNames(['cs'], { type: 'region' });
const getCountryName = (code: string) => {
  try {
    return regionNames.of(code) || code;
  } catch (e) {
    return code;
  }
};

rawData.forEach(m => {
  // Normalizace názvů a ošetření null
  const services = m.streaming_services
    ? (m.streaming_services as string[]).map(s => {
      if (s === 'Amazon Prime Video') return 'Prime Video';
      if (s === 'Prima Plus') return 'Prima+';
      return s;
    }) as ServiceType[]
    : null;

  const countries = m.origin_countries
    ? (m.origin_countries as string[]).map(getCountryName)
    : [];

  const title: Title = {
    ...m,
    poster_url: m.poster_url || undefined,
    backdrop_url: m.backdrop_url || undefined,
    title_en: m.title_en || "",
    episodes: m.episodes || null,
    streaming_services: services,
    origin_countries: countries
  };

  // Zajistí, že ID budou unikátní (kombinace typu a ID pro jistotu)
  uniqueDataMap.set(`${title.type}-${title.id}`, title);
});

export const catalog: Title[] = Array.from(uniqueDataMap.values());
