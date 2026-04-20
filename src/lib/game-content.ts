export type GameMode = {
  slug: 'lol' | 'cs2';
  title: string;
  subtitle: string;
  themeClass: string;
  image: string;
  questionsTable: string;
};

export const GAME_MODES: Record<'lol' | 'cs2', GameMode> = {
  lol: {
    slug: 'lol',
    title: 'League of Legends',
    subtitle: 'Szybkie skojarzenia: umiejętności, przedmioty i bohaterowie.',
    themeClass: 'from-cyan-400/35 to-indigo-500/25',
    image: '/images/inspiracja/lol_photo.png',
    questionsTable: 'LOL_questions'
  },
  cs2: {
    slug: 'cs2',
    title: 'Counter-Strike 2',
    subtitle: 'Mapy, skiny i esportowe skojarzenia pod presją czasu.',
    themeClass: 'from-orange-400/35 to-amber-600/25',
    image: '/images/inspiracja/cs2_photo.png',
    questionsTable: 'CS2_questions'
  }
};
