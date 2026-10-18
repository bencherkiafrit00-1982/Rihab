export type SkillType = 'listening' | 'speaking' | 'reading' | 'writing' | 'phonics';

export type QuestionType = 
  | 'multiple_choice' 
  | 'listen_and_choose' 
  | 'word_reorder' 
  | 'pronounce_mic' 
  | 'sound_match' 
  | 'fill_blank'
  | 'dialogue_roleplay';

export interface ExerciseOption {
  id: string;
  text: string;
  arabicTranslation?: string;
  image?: string;
  emoji?: string;
  phoneticNote?: string;
}

export interface Exercise {
  id: string;
  type: QuestionType;
  skill: SkillType;
  promptAr: string;
  promptEn: string;
  audioPrompt?: string; // English phrase to speak aloud
  targetWordOrSentence?: string; // The correct sentence or word
  options?: ExerciseOption[];
  correctAnswer: string | string[]; // Single id/text or sequence of words
  scrambledWords?: string[]; // for word_reorder
  explanation?: string;
  phonicsTarget?: string; // e.g. /θ/ or /ð/ or /tʃ/
  mascotTip?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  titleEn: string;
  titleAr: string;
  description: string;
  icon: string;
  xpReward: number;
  gemReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  unitNumber: number; // 0 for Back to School, 1 to 8
  titleEn: string;
  titleAr: string;
  themeColor: string; // e.g. emerald, blue, amber, violet
  bgGradient: string;
  badgeIcon: string;
  songTitle?: string;
  songLyrics?: string[];
  grammarFocus: string;
  phonicsFocus: string;
  algerianCultureTouch: string;
  lessons: Lesson[];
  textbookPages: string; // e.g. "الصفحات 8 - 20"
}

export interface CharismaTip {
  titleAr: string;
  tipAr: string;
  type: 'intonation' | 'pause' | 'emotion' | 'posture';
  icon: string;
}

export interface ReadingSentence {
  id: string;
  textEn: string;
  textAr: string;
  phonicsFocus?: string;
  charismaNoteAr?: string;
  speakerName?: string;
  audioSpeed?: number;
}

export interface UnitReadingPassage {
  unitId: string;
  unitNumber: number;
  titleEn: string;
  titleAr: string;
  textbookPageRef: string;
  themeColor: string;
  icon: string;
  genre: 'presentation' | 'dialogue' | 'story' | 'speech';
  contextAr: string;
  sentences: ReadingSentence[];
  fullTextEn: string;
  fullTextAr: string;
  keyPhonicsTarget: string;
  charismaTips: CharismaTip[];
}

export interface WeeklyChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  category: 'lessons' | 'xp' | 'accuracy' | 'dictionary' | 'phonics' | 'streak';
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewardXp: number;
  rewardGems: number;
  icon: string;
  accentColor: string;
}

export interface DifficultWord {
  id: string;
  wordEn: string;
  wordAr: string;
  phonicsNote?: string;
  category: string;
  mistakeCount: number;
  mastered: boolean;
  lastReviewedDate?: string;
  unitNumber?: number;
  exampleSentenceEn?: string;
  exampleSentenceAr?: string;
  emoji?: string;
}

export interface UserStats {
  name: string;
  avatar: string;
  xp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  unitCrowns: Record<string, number>; // unitId -> crowns
  badgesUnlocked: string[];
  completedReadingUnitIds?: string[]; // unitIds where reading passage elocution was completed
  difficultWords?: DifficultWord[]; // Words pupil struggled with or needs quick review on
  weeklyCycleStartDate: string; // ISO date of the start of the 7-day cycle
  weeklyChallenges: WeeklyChallenge[];
  dailyQuests: {
    id: string;
    titleAr: string;
    target: number;
    current: number;
    completed: boolean;
    rewardGems: number;
  }[];
  skillProficiency: {
    listening: number; // 0-100%
    speaking: number;
    reading: number;
    writing: number;
    phonics: number;
  };
}

export interface DictionaryItem {
  id: string;
  unitNumber: number;
  english: string;
  arabic: string;
  pronunciationHint?: string;
  category: string;
  exampleSentenceEn?: string;
  exampleSentenceAr?: string;
  emoji?: string;
}

export interface Badge {
  id: string;
  titleAr: string;
  titleEn: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'unit' | 'skill';
  requirement: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  city: string;
  isNpc?: boolean;
}
