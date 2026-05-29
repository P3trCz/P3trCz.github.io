import type { ServiceType } from './catalog';

export const AVAILABLE_SERVICES: { id: ServiceType; name: string; logoUrl: string; color: string }[] = [
  { id: 'Netflix', name: 'Netflix', logoUrl: '/src/app/Logos/netflix_logo.svg', color: '#e50914' },
  { id: 'HBO Max', name: 'HBO Max', logoUrl: '/src/app/Logos/hbo_max_logo.png', color: '#7c3aed' },
  { id: 'Disney Plus', name: 'Disney Plus', logoUrl: '/src/app/Logos/Disney_plus_logo.png', color: '#0063e5' },
  { id: 'Prime Video', name: 'Prime Video', logoUrl: '/src/app/Logos/prime_video_logo.png', color: '#00a8e1' },
  { id: 'Apple TV', name: 'Apple TV', logoUrl: '/src/app/Logos/apple_tv_logo.png', color: '#444444' },
  { id: 'SkyShowtime', name: 'SkyShowtime', logoUrl: '/src/app/Logos/skyshowtime_logo.png', color: '#4f46e5' },
  { id: 'Oneplay', name: 'Oneplay', logoUrl: '/src/app/Logos/oneplay_logo.png', color: '#F2B705' },
  { id: 'Prima+', name: 'Prima+', logoUrl: '/src/app/Logos/prima_plus.png', color: '#04BFAD' }
];

export const TITLE_TYPES = ['Film', 'Seriál'] as const;

export const TITLE_FILTER_OPTIONS = [
  { value: 'Vše', label: 'Vše' },
  { value: 'Film', label: 'Filmy' },
  { value: 'Seriál', label: 'Seriály' }
] as const;

export const TIME_RANGES = [
  '5 minut',
  '10 minut',
  '1 hodina',
  '1 den',
  'Týden',
  'Měsíc',
  '3 měsíce',
  '6 měsíců',
  'Rok',
  'Celá doba',
  'Vlastní rozsah'
] as const;
