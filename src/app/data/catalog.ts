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

export const catalog: Movie[] = tmdbData as Movie[];
