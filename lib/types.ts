export interface Question {
  id: string
  category: string
  question: string
  answer: string
  code?: string
  media?: {
    type: 'image' | 'video' | 'audio' | 'youtube'
    url: string
  }
}

export interface Team {
  name: string
  correct: number
  wrong: number
}

export interface GameState {
  team1: Team
  team2: Team
  currentTeam: 1 | 2
  questions: Question[]
  usedQuestions: string[]
  currentQuestionIndex: number | null
  currentQuestion: Question | null
  gamePhase: 'waiting' | 'playing' | 'answerReveal' | 'results'
  timer: {
    timeLeft: number
    isPaused: boolean
    isRunning: boolean
  }
  viewMode: 'public' | 'moderator'
}

export const CATEGORIES = [
  'العلوم والاختراعات',
  'جغرافيا العالم',
  'جغرافيا قطر',
  'تاريخ العالم',
  'تاريخ قطر',
  'الفضاء والفلك',
  'الجسم البشري والصحة',
  'الرياضيات والمنطق',
  'شركات الهواتف',
  'ماركات الساعات',
  'ماركات العطور',
  'ماركات السيارات والشعارات',
  'الأزياء والماركات الفاخرة',
  'حقائق الحيوانات',
  'النباتات والطبيعة',
  'الوعي البيئي',
  'الأنمي',
  'الأفلام والمسلسلات',
  'الموسيقى والمطربين',
  'الرسوم المتحركة',
  'ألعاب الفيديو والإلكترونية',
  'الأطعمة والمشروبات حول العالم',
  'الرياضة والرياضيين',
  'التكنولوجيا والأجهزة',
  'برمجة',
  'معلومات عامة وممتعة',
]

export const CATEGORIES_EN = [
  'Science & Inventions',
  'World Geography',
  'Qatar Geography',
  'World History',
  'Qatar History',
  'Space & Astronomy',
  'Human Body & Health',
  'Mathematics & Logic',
  'Phone Companies',
  'Watch Brands',
  'Perfume Brands',
  'Car Brands & Logos',
  'Fashion & Luxury Brands',
  'Animal Facts',
  'Plants & Nature',
  'Environmental Awareness',
  'Anime',
  'Movies & TV Shows',
  'Music & Singers',
  'Animation & Cartoons',
  'Video Games & Esports',
  'Foods & Drinks Around the World',
  'Sports & Athletes',
  'Technology & Devices',
  'Programming',
  'General Facts & Fun Information',
]

