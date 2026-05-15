import tmdbData from './complete_tmdb_data.json';

export type ServiceType = 'Netflix' | 'HBO Max' | 'Disney Plus' | 'Amazon Prime Video' | 'Apple TV' | 'SkyShowtime' | 'Oneplay';

export type Movie = {
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

const rawData = tmdbData as Movie[];
const uniqueDataMap = new Map<string, Movie>();

rawData.forEach(m => {
  // Zajistí, že ID budou unikátní (kombinace typu a ID pro jistotu)
  uniqueDataMap.set(`${m.type}-${m.id}`, m);
});

export const catalog: Movie[] = Array.from(uniqueDataMap.values());
