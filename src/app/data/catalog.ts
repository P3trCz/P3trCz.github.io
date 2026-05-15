export type ServiceType = 'Netflix' | 'HBO Max' | 'Disney+' | 'Prime' | 'Apple TV+' | 'SkyShowtime' | 'Oneplay';

export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  rating: number; // 0-100
  duration: string;
  description: string;
  cast: string[];
  posterUrl: string;
  availableOn: ServiceType[];
};

export const catalog: Movie[] = [
  {
    id: 'm1',
    title: 'Duna: Část druhá',
    year: 2024,
    genres: ['Sci-Fi', 'Akční'],
    rating: 84,
    duration: '2h 46m',
    description: 'V druhé části Duny se Paul Atreides spojí s Chani a Fremeny a zároveň se vydá na válečnou stezku pomsty proti spiklencům, kteří zničili jeho rodinu. Čelí volbě mezi svou životní láskou a osudem známého vesmíru a snaží se zabránit strašlivé budoucnosti, kterou může předvídat jen on.',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80', // Placeholder
    availableOn: ['HBO Max']
  },
  {
    id: 'm2',
    title: 'Šílený Max: Zběsilá cesta',
    year: 2015,
    genres: ['Akční', 'Sci-Fi'],
    rating: 81,
    duration: '2h 0m',
    description: 'V postapokalyptickém světě plném krve a ohně spojí své síly samotářský bojovník a odvážná žena, aby unikli z tyranie nebezpečného vůdce.',
    cast: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult'],
    posterUrl: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix', 'HBO Max', 'Prime']
  },
  {
    id: 'm3',
    title: 'Vykoupení z věznice Shawshank',
    year: 1994,
    genres: ['Drama'],
    rating: 93,
    duration: '2h 22m',
    description: 'Bývalý bankéř Andy Dufresne je neprávem odsouzen k doživotí. Ve vězení se spřátelí s dlouholetým vězněm Redem a společně nacházejí naději.',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime']
  },
  {
    id: 'm4',
    title: 'Temný rytíř',
    year: 2008,
    genres: ['Akční', 'Drama'],
    rating: 90,
    duration: '2h 32m',
    description: 'Batman se spojí s poručíkem Gordonem a státním návladním Harvey Dentem, aby zastavili šíleného zločince známého jako Joker.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max']
  },
  {
    id: 'm5',
    title: 'Na nože',
    year: 2019,
    genres: ['Komedie', 'Drama'],
    rating: 79,
    duration: '2h 10m',
    description: 'Detektiv Benoit Blanc vyšetřuje smrt patriarchy excentrické rodiny Thrombeyových. Každý má motiv.',
    cast: ['Daniel Craig', 'Chris Evans', 'Ana de Armas'],
    posterUrl: 'https://images.unsplash.com/photo-1584661156681-540e140faa3f?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix', 'Prime']
  },
  {
    id: 'm6',
    title: 'Blade Runner 2049',
    year: 2017,
    genres: ['Sci-Fi', 'Drama'],
    rating: 80,
    duration: '2h 44m',
    description: 'Mladý blade runner objevuje dlouho pohřbené tajemství, které má potenciál uvrhnout zbytek společnosti do chaosu.',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    posterUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Disney+']
  },
  {
    id: 'm7',
    title: 'Strážci Galaxie',
    year: 2014,
    genres: ['Akční', 'Sci-Fi', 'Komedie'],
    rating: 80,
    duration: '2h 1m',
    description: 'Skupina vesmírných vyvrhelů se musí spojit, aby zabránila fanatickému válečníkovi ve zničení vesmíru.',
    cast: ['Chris Pratt', 'Zoe Saldana', 'Dave Bautista'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Disney+']
  },
  {
    id: 'm8',
    title: 'Počátek',
    year: 2010,
    genres: ['Sci-Fi', 'Akční'],
    rating: 88,
    duration: '2h 28m',
    description: 'Zloděj, který krade tajemství z podvědomí lidí, dostane šanci vymazat svou kriminální minulost výměnou za implantování myšlenky.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    posterUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix', 'HBO Max']
  },
  {
    id: 'm9',
    title: 'Pulp Fiction: Historky z podsvětí',
    year: 1994,
    genres: ['Krimi', 'Drama'],
    rating: 89,
    duration: '2h 34m',
    description: 'Životy dvou mafiánských zabijáků, boxera, manželky gangstera a dvojice zlodějů se proplétají ve čtyřech historkách plných násilí a vykoupení.',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80',
    availableOn: ['SkyShowtime']
  },
  {
    id: 'm10',
    title: 'Interstellar',
    year: 2014,
    genres: ['Sci-Fi', 'Drama'],
    rating: 86,
    duration: '2h 49m',
    description: 'Tým výzkumníků se vydává skrz červí díru ve snaze zajistit přežití lidstva.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max', 'Prime']
  },
  {
    id: 'm11',
    title: 'Matrix',
    year: 1999,
    genres: ['Sci-Fi', 'Akční'],
    rating: 87,
    duration: '2h 16m',
    description: 'Počítačový hacker se od tajuplných rebelů dozvídá pravdu o realitě a připojuje se k nim v boji proti inteligentním strojům.',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix', 'HBO Max']
  },
  {
    id: 'm12',
    title: 'Pán prstenů: Návrat krále',
    year: 2003,
    genres: ['Fantasy', 'Dobrodružný'],
    rating: 90,
    duration: '3h 21m',
    description: 'Gandalf a Aragorn vedou Svět lidí proti Sauronově armádě, zatímco Frodo a Sam se blíží k Hoře osudu.',
    cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
    posterUrl: 'https://images.unsplash.com/photo-1462759353907-b04e95096f94?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max']
  },
  {
    id: 'm13',
    title: 'Kmotr',
    year: 1972,
    genres: ['Krimi', 'Drama'],
    rating: 92,
    duration: '2h 55m',
    description: 'Stárnoucí hlava mafiánské rodiny předává kontrolu nad svým impériem svému neochotnému synovi.',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80',
    availableOn: ['SkyShowtime', 'Prime']
  },
  {
    id: 'm14',
    title: 'Parazit',
    year: 2019,
    genres: ['Thriller', 'Komedie'],
    rating: 85,
    duration: '2h 12m',
    description: 'Chudá rodina postupně infiltruje domácnost zámožné rodiny, ale jejich plán se začne vymykat kontrole.',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    posterUrl: 'https://images.unsplash.com/photo-1510215643446-2f09975f9a65?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Oneplay', 'Apple TV+']
  },
  {
    id: 'm15',
    title: 'Sedm',
    year: 1995,
    genres: ['Krimi', 'Thriller'],
    rating: 86,
    duration: '2h 7m',
    description: 'Dva detektivové pátrají po sériovém vrahovi, jehož zločiny jsou inspirovány sedmi smrtelnými hříchy.',
    cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey'],
    posterUrl: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max']
  },
  {
    id: 'm16',
    title: 'Mlčení jehňátek',
    year: 1991,
    genres: ['Thriller', 'Horor'],
    rating: 86,
    duration: '1h 58m',
    description: 'Mladá agentka FBI musí hledat pomoc u uvězněného a manipulativního kanibala.',
    cast: ['Jodie Foster', 'Anthony Hopkins', 'Lawrence A. Bonney'],
    posterUrl: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime']
  },
  {
    id: 'm17',
    title: 'Hvězdné války: Epizoda V - Impérium vrací úder',
    year: 1980,
    genres: ['Sci-Fi', 'Akční'],
    rating: 87,
    duration: '2h 4m',
    description: 'Zatímco Luke Skywalker trénuje s mistrem Yodou, jeho přátelé jsou pronásledováni Darth Vaderem.',
    cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
    posterUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Disney+']
  },
  {
    id: 'm18',
    title: 'Město bohů',
    year: 2002,
    genres: ['Krimi', 'Drama'],
    rating: 86,
    duration: '2h 10m',
    description: 'Dva chlapci vyrůstají v drsných slumech Ria de Janeira a vydávají se každý na jinou životní cestu.',
    cast: ['Alexandre Rodrigues', 'Leandro Firmino', 'Matheus Nachtergaele'],
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime', 'Apple TV+']
  },
  {
    id: 'm19',
    title: 'Spirited Away',
    year: 2001,
    genres: ['Animovaný', 'Fantasy'],
    rating: 86,
    duration: '2h 5m',
    description: 'Během stěhování se mladá dívka ocitne ve světě duchů, kde musí najít způsob, jak zachránit své rodiče.',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    posterUrl: 'https://images.unsplash.com/photo-1578589318433-39b5de440c3f?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix']
  },
  {
    id: 'm20',
    title: 'Lví král',
    year: 1994,
    genres: ['Animovaný', 'Rodinný'],
    rating: 85,
    duration: '1h 28m',
    description: 'Lví princ je donucen opustit svou rodinu po tragické smrti svého otce a musí zjistit, kým skutečně je.',
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Disney+']
  },
  {
    id: 'm21',
    title: 'Přelet nad kukaččím hnízdem',
    year: 1975,
    genres: ['Drama'],
    rating: 87,
    duration: '2h 13m',
    description: 'Trestanec simuluje šílenství, aby se vyhnul práci, a rozpoutá revoltu v psychiatrické léčebně.',
    cast: ['Jack Nicholson', 'Louise Fletcher', 'Will Sampson'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max']
  },
  {
    id: 'm22',
    title: 'Návrat do budoucnosti',
    year: 1985,
    genres: ['Sci-Fi', 'Komedie'],
    rating: 85,
    duration: '1h 56m',
    description: 'Středoškolák je nešťastnou náhodou poslán třicet let do minulosti a musí zajistit, aby se jeho rodiče setkali.',
    cast: ['Michael J. Fox', 'Christopher Lloyd', 'Lea Thompson'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime', 'SkyShowtime']
  },
  {
    id: 'm23',
    title: 'Gladiátor',
    year: 2000,
    genres: ['Akční', 'Drama'],
    rating: 85,
    duration: '2h 35m',
    description: 'Římský generál je zrazen a jeho rodina vyvražděna. Stává se gladiátorem, aby se pomstil.',
    cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    posterUrl: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime', 'Netflix']
  },
  {
    id: 'm24',
    title: 'Mizerové navždy',
    year: 2020,
    genres: ['Akční', 'Komedie'],
    rating: 66,
    duration: '2h 4m',
    description: 'Mike a Marcus se znovu spojují, když je Mike na seznamu obětí.',
    cast: ['Will Smith', 'Martin Lawrence', 'Vanessa Hudgens'],
    posterUrl: 'https://images.unsplash.com/photo-1584661156681-540e140faa3f?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Netflix', 'Oneplay']
  },
  {
    id: 'm25',
    title: 'Město',
    year: 2010,
    genres: ['Krimi', 'Thriller'],
    rating: 75,
    duration: '2h 5m',
    description: 'Skupina zlodějů plánuje svou další velkou loupež v Bostonu.',
    cast: ['Ben Affleck', 'Rebecca Hall', 'Jon Hamm'],
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max', 'Apple TV+']
  },
  {
    id: 'm26',
    title: 'Top Gun: Maverick',
    year: 2022,
    genres: ['Akční', 'Drama'],
    rating: 83,
    duration: '2h 10m',
    description: 'Pete Mitchell se vrací do Top Gunu, aby vycvičil novou generaci pilotů.',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80',
    availableOn: ['SkyShowtime']
  },
  {
    id: 'm27',
    title: 'Terminátor 2: Den zúčtování',
    year: 1991,
    genres: ['Akční', 'Sci-Fi'],
    rating: 86,
    duration: '2h 17m',
    description: 'Kyborg z budoucnosti je vyslán, aby ochránil mladého Johna Connora.',
    cast: ['Arnold Schwarzenegger', 'Linda Hamilton', 'Edward Furlong'],
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Prime', 'Apple TV+']
  },
  {
    id: 'm28',
    title: 'Osvícení',
    year: 1980,
    genres: ['Horor', 'Thriller'],
    rating: 84,
    duration: '2h 26m',
    description: 'Rodina se stěhuje do izolovaného hotelu, kde začínají pociťovat vliv zlověstných sil.',
    cast: ['Jack Nicholson', 'Shelley Duvall', 'Danny Lloyd'],
    posterUrl: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max']
  },
  {
    id: 'm29',
    title: 'Avengers: Infinity War',
    year: 2018,
    genres: ['Akční', 'Sci-Fi'],
    rating: 84,
    duration: '2h 29m',
    description: 'Avengers a jejich spojenci musí být ochotni obětovat vše, aby porazili mocného Thanose.',
    cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
    posterUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80',
    availableOn: ['Disney+']
  },
  {
    id: 'm30',
    title: 'Joker',
    year: 2019,
    genres: ['Krimi', 'Drama'],
    rating: 84,
    duration: '2h 2m',
    description: 'Ignorován společností se Arthur Fleck propadá do šílenství a stává se kriminálním mozkem.',
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
    posterUrl: 'https://images.unsplash.com/photo-1510215643446-2f09975f9a65?auto=format&fit=crop&w=800&q=80',
    availableOn: ['HBO Max', 'Netflix']
  }
];
