import { WeeklyChallenge } from '../types';

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const DEFAULT_WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'wc-1-lessons',
    titleAr: 'قاهر الدروس الأسبوعي',
    titleEn: 'Weekly Lesson Master',
    descriptionAr: 'أكمل 4 دروس من المنهاج الرسمي هذا الأسبوع لترسيخ المفردات والقواعد.',
    category: 'lessons',
    target: 4,
    current: 1,
    completed: false,
    claimed: false,
    rewardXp: 75,
    rewardGems: 20,
    icon: '📚',
    accentColor: 'emerald',
  },
  {
    id: 'wc-2-xp',
    titleAr: 'سيل نقاط الخبرة (+120 XP)',
    titleEn: 'XP Rush Champion',
    descriptionAr: 'اجمع 120 نقطة خبرة XP خلال الأسبوع من خلال التمارين والنشاطات.',
    category: 'xp',
    target: 120,
    current: 45,
    completed: false,
    claimed: false,
    rewardXp: 100,
    rewardGems: 25,
    icon: '⚡',
    accentColor: 'amber',
  },
  {
    id: 'wc-3-accuracy',
    titleAr: 'علامة كاملة 100%',
    titleEn: 'Flawless Learner',
    descriptionAr: 'حقق نسبة إجابة كاملة 100% في درسين مختلفين دون أخطاء.',
    category: 'accuracy',
    target: 2,
    current: 1,
    completed: false,
    claimed: false,
    rewardXp: 80,
    rewardGems: 20,
    icon: '🎯',
    accentColor: 'purple',
  },
  {
    id: 'wc-4-dictionary',
    titleAr: 'رحالة القاموس المصور (ص 96)',
    titleEn: 'Bilingual Word Explorer',
    descriptionAr: 'تصفح واستمع إلى نطق 6 كلمات جديدة من القاموس المصور المعتمد.',
    category: 'dictionary',
    target: 6,
    current: 2,
    completed: false,
    claimed: false,
    rewardXp: 60,
    rewardGems: 15,
    icon: '📖',
    accentColor: 'blue',
  },
  {
    id: 'wc-5-phonics',
    titleAr: 'خبير النطق والصوتيات 4PS',
    titleEn: 'Phonics & Pronunciation Pro',
    descriptionAr: 'تمرّن على نطق مخارج الحروف الإنجليزية (/θ/, /ð/, /tʃ/) عبر الميكروفون.',
    category: 'phonics',
    target: 3,
    current: 1,
    completed: false,
    claimed: false,
    rewardXp: 90,
    rewardGems: 30,
    icon: '🎙️',
    accentColor: 'rose',
  },
];

// Generate refreshed weekly challenges with zeroed progress
export function generateRefreshedWeeklyChallenges(): WeeklyChallenge[] {
  return DEFAULT_WEEKLY_CHALLENGES.map(ch => ({
    ...ch,
    current: 0,
    completed: false,
    claimed: false,
  }));
}

// Format remaining time in Arabic
export function getRemainingTimeInArabic(startDateIso: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedText: string;
} {
  const start = new Date(startDateIso).getTime();
  const now = Date.now();
  const elapsed = now - start;
  const remainingMs = SEVEN_DAYS_MS - elapsed;

  if (remainingMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedText: 'حان موعد التجديد التلقائي للأسبوع الجديد!',
    };
  }

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

  const formattedText = `${days} أيام و ${hours} ساعة و ${minutes} دقيقة`;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formattedText,
  };
}
