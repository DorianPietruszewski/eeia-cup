export type QuizQuestion = {
  prompt: string;
  answers: string[];
  correctIndex: number;
  flavor: string;
};

export type GameMode = {
  slug: 'lol' | 'cs2';
  title: string;
  subtitle: string;
  themeClass: string;
  image: string;
  questions: QuizQuestion[];
};

export const GAME_MODES: Record<'lol' | 'cs2', GameMode> = {
  lol: {
    slug: 'lol',
    title: 'League of Legends',
    subtitle: 'Szybkie skojarzenia: umiejetnosci, przedmioty i bohaterowie.',
    themeClass: 'from-cyan-400/35 to-indigo-500/25',
    image: '/images/inspiracja/Liga_git_1.png',
    questions: [
      {
        prompt: 'Ktora umiejetnosc NIE nalezy do Ahri?',
        answers: ['Orb of Deception', 'Fox-Fire', 'Spirit Rush', 'Chronobreak'],
        correctIndex: 3,
        flavor: 'Jedna z opcji pochodzi od postaci z zupelnie innej roli.'
      },
      {
        prompt: 'Do ktorej postaci pasuje ultimate "Unstoppable Force"?',
        answers: ['Malphite', 'Garen', 'Lux', 'Ezreal'],
        correctIndex: 0,
        flavor: 'Ikoniczne wejscie tanka startujacego teamfight.'
      },
      {
        prompt: 'Ktory przedmiot jest typowo marksmanowy?',
        answers: ['Infinity Edge', 'Rabadons Deathcap', 'Sunfire Aegis', 'Warmogs Armor'],
        correctIndex: 0,
        flavor: 'Krytyki i AD to glowny trop.'
      },
      {
        prompt: 'Ktora para jest poprawna?',
        answers: ['Zed - assassin', 'Soraka - jungler', 'Sion - enchanter', 'Jinx - tank'],
        correctIndex: 0,
        flavor: 'Rola musi byc zgodna z najbardziej klasycznym zastosowaniem.'
      },
      {
        prompt: 'Ktora umiejetnosc to tarcza dla sojusznika od Lulu?',
        answers: ['Help, Pix!', 'Glitterlance', 'Whimsy', 'Wild Growth'],
        correctIndex: 0,
        flavor: 'Supportowy shield plus utility.'
      }
    ]
  },
  cs2: {
    slug: 'cs2',
    title: 'Counter-Strike 2',
    subtitle: 'Mapy, skiny i esportowe skojarzenia pod presja czasu.',
    themeClass: 'from-orange-400/35 to-amber-600/25',
    image: '/images/inspiracja/cs_win_fajny.png',
    questions: [
      {
        prompt: 'Na ktorej mapie znajduje sie miejscowka "Banana"?',
        answers: ['Mirage', 'Inferno', 'Nuke', 'Vertigo'],
        correctIndex: 1,
        flavor: 'Klasyczny callout z side B.'
      },
      {
        prompt: 'Ktory skin jest skojarzony z AWP?',
        answers: ['Asiimov', 'Hyper Beast', 'Dragon Lore', 'Redline'],
        correctIndex: 2,
        flavor: 'To jeden z najbardziej kultowych skinow w historii CS.'
      },
      {
        prompt: 'Ktory granat sluzy glownie do odcinania wizji?',
        answers: ['HE', 'Flashbang', 'Smoke', 'Decoy'],
        correctIndex: 2,
        flavor: 'Najczesciej uzywany do wykonania wejscia na bombsite.'
      },
      {
        prompt: 'Na jakiej mapie spotkasz callout "Heaven" nad B site?',
        answers: ['Nuke', 'Ancient', 'Dust2', 'Office'],
        correctIndex: 0,
        flavor: 'Mapa o wyraznej grze wertykalnej.'
      },
      {
        prompt: 'Ktory zawodnik zaslynal z legendarnej akcji "falling AWP"?',
        answers: ['s1mple', 'NiKo', 'olofmeister', 'device'],
        correctIndex: 0,
        flavor: 'To kultowy moment z ery turniejow Major.'
      }
    ]
  }
};
