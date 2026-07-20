import type { ServiceType } from './data/catalog';
import netflixLogo from '../assets/logos/netflix_logo.svg';
import hboMaxLogo from '../assets/logos/hbo_max_logo.png';
import disneyPlusLogo from '../assets/logos/Disney_plus_logo.png';
import primeVideoLogo from '../assets/logos/prime_video_logo.png';
import appleTvLogo from '../assets/logos/apple_tv_logo.png';
import skyshowtimeLogo from '../assets/logos/skyshowtime_logo.png';
import oneplayLogo from '../assets/logos/oneplay_logo.png';
import primaPlusLogo from '../assets/logos/prima_plus.png';

export const AVAILABLE_SERVICES: { id: ServiceType; name: string; logoUrl: string; color: string }[] = [
  { id: 'Netflix', name: 'Netflix', logoUrl: netflixLogo, color: '#e50914' },
  { id: 'HBO Max', name: 'HBO Max', logoUrl: hboMaxLogo, color: '#7c3aed' },
  { id: 'Disney Plus', name: 'Disney Plus', logoUrl: disneyPlusLogo, color: '#0063e5' },
  { id: 'Prime Video', name: 'Prime Video', logoUrl: primeVideoLogo, color: '#00a8e1' },
  { id: 'Apple TV', name: 'Apple TV', logoUrl: appleTvLogo, color: '#444444' },
  { id: 'SkyShowtime', name: 'SkyShowtime', logoUrl: skyshowtimeLogo, color: '#4f46e5' },
  { id: 'Oneplay', name: 'Oneplay', logoUrl: oneplayLogo, color: '#F2B705' },
  { id: 'Prima+', name: 'Prima+', logoUrl: primaPlusLogo, color: '#04BFAD' }
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
