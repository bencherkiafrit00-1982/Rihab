import React, { useState, useEffect } from 'react';
import { Unit, Lesson, UserStats, LeaderboardUser } from './types';
import { UNITS_DATA, LEADERBOARD_INITIAL, BADGES_DATA } from './data/curriculumData';
import { 
  DEFAULT_WEEKLY_CHALLENGES, 
  generateRefreshedWeeklyChallenges, 
  SEVEN_DAYS_MS 
} from './data/weeklyChallengesData';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { LearningPath } from './components/LearningPath';
import { WeeklyChallenges } from './components/WeeklyChallenges';
import { UnitReadingCharismaModal } from './components/UnitReadingCharismaModal';
import { TextbookScenesExplorer } from './components/TextbookScenesExplorer';
import { QuickReviewModal } from './components/QuickReviewModal';
import { DEFAULT_DIFFICULT_WORDS } from './data/quickReviewData';
import { LessonModal } from './components/LessonModal';
import { MiniDictionary } from './components/MiniDictionary';
import { Leaderboard } from './components/Leaderboard';
import { AchievementsModal } from './components/AchievementsModal';
import { TeacherParentDashboard } from './components/TeacherParentDashboard';
import { SpecificationsDocument } from './components/SpecificationsDocument';
import { InteractiveMascot } from './components/InteractiveMascot';
import { MultiplayerArena } from './components/MultiplayerArena';
import { playSound } from './utils/soundEffects';

const STORAGE_KEY = 'rehab_english_4ps_v1';

const INITIAL_USER_STATS: UserStats = {
  name: 'رحاب البطلة',
  avatar: '👧🏻',
  xp: 45,
  gems: 25,
  hearts: 5,
  maxHearts: 5,
  streakDays: 3,
  lastActiveDate: new Date().toISOString(),
  completedLessonIds: ['lesson-0-1'], // Start with first lesson completed or unlocked
  unitCrowns: { 'unit-0': 1 },
  badgesUnlocked: ['first_lesson', 'streak_3'],
  difficultWords: DEFAULT_DIFFICULT_WORDS,
  weeklyCycleStartDate: new Date().toISOString(),
  weeklyChallenges: DEFAULT_WEEKLY_CHALLENGES,
  dailyQuests: [
    { id: 'q-1', titleAr: 'أكمل درسين اليوم', target: 2, current: 1, completed: false, rewardGems: 10 },
    { id: 'q-2', titleAr: 'حقق نسبة دقة 100%', target: 1, current: 1, completed: true, rewardGems: 15 },
    { id: 'q-3', titleAr: 'تدرّب على النطق بالميكروفون', target: 2, current: 1, completed: false, rewardGems: 10 },
  ],
  skillProficiency: {
    listening: 85,
    speaking: 78,
    reading: 82,
    writing: 70,
    phonics: 80,
  },
};

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserStats = JSON.parse(saved);
        
        // Ensure weekly challenges exist
        if (!parsed.weeklyChallenges || parsed.weeklyChallenges.length === 0) {
          parsed.weeklyChallenges = DEFAULT_WEEKLY_CHALLENGES;
          parsed.weeklyCycleStartDate = new Date().toISOString();
        }

        // Ensure difficult words exist
        if (!parsed.difficultWords || parsed.difficultWords.length === 0) {
          parsed.difficultWords = DEFAULT_DIFFICULT_WORDS;
        }

        // Check if the 7-day cycle has expired
        const start = new Date(parsed.weeklyCycleStartDate || Date.now()).getTime();
        if (Date.now() - start >= SEVEN_DAYS_MS) {
          // Automatic 7-day renewal
          parsed.weeklyCycleStartDate = new Date().toISOString();
          parsed.weeklyChallenges = generateRefreshedWeeklyChallenges();
        }

        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_USER_STATS;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('path');
  const [activeLessonSession, setActiveLessonSession] = useState<{ lesson: Lesson; unit: Unit } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(LEADERBOARD_INITIAL);
  const [currentMascot, setCurrentMascot] = useState<'nadjib' | 'rehab'>('nadjib');
  const [activeReadingModalUnitId, setActiveReadingModalUnitId] = useState<string | null>(null);
  const [isQuickReviewOpen, setIsQuickReviewOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  // Periodic check for 7-day renewal (checks every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStats(prev => {
        const start = new Date(prev.weeklyCycleStartDate || Date.now()).getTime();
        if (Date.now() - start >= SEVEN_DAYS_MS) {
          return {
            ...prev,
            weeklyCycleStartDate: new Date().toISOString(),
            weeklyChallenges: generateRefreshedWeeklyChallenges(),
          };
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const handleSelectLesson = (lesson: Lesson, unit: Unit) => {
    setActiveLessonSession({ lesson, unit });
  };

  const handleCloseLesson = () => {
    setActiveLessonSession(null);
  };

  const handleDeductHeart = () => {
    setUserStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const handleCompleteLesson = (
    lessonId: string,
    earnedXp: number,
    earnedGems: number,
    accuracy: number
  ) => {
    setUserStats(prev => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const nextCompleted = alreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const newXp = prev.xp + earnedXp;
      const newGems = prev.gems + earnedGems;

      // 1. Update Daily Quests
      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'q-1') {
          const nextCur = Math.min(q.target, q.current + 1);
          return { ...q, current: nextCur, completed: nextCur >= q.target };
        }
        if (q.id === 'q-2' && accuracy >= 95) {
          return { ...q, current: q.target, completed: true };
        }
        return q;
      });

      // 2. Update 7-Day Weekly Challenges
      const updatedWeeklyChallenges = (prev.weeklyChallenges || DEFAULT_WEEKLY_CHALLENGES).map(ch => {
        let newCurrent = ch.current;

        if (ch.category === 'lessons') {
          newCurrent = Math.min(ch.target, ch.current + 1);
        } else if (ch.category === 'xp') {
          newCurrent = Math.min(ch.target, ch.current + earnedXp);
        } else if (ch.category === 'accuracy' && accuracy >= 95) {
          newCurrent = Math.min(ch.target, ch.current + 1);
        } else if (ch.category === 'phonics') {
          newCurrent = Math.min(ch.target, ch.current + 1);
        }

        const isCompleted = newCurrent >= ch.target;
        return {
          ...ch,
          current: newCurrent,
          completed: ch.completed || isCompleted,
        };
      });

      // 3. Update Badges
      const newBadges = [...prev.badgesUnlocked];
      if (newGems >= 50 && !newBadges.includes('gem_collector')) {
        newBadges.push('gem_collector');
      }
      if (newXp >= 100 && !newBadges.includes('algeria_champion')) {
        newBadges.push('algeria_champion');
      }
      if (nextCompleted.length >= 4 && !newBadges.includes('phonics_master')) {
        newBadges.push('phonics_master');
      }
      if (nextCompleted.length >= 6 && !newBadges.includes('honor_pupil')) {
        newBadges.push('honor_pupil');
      }

      // 4. Increase Skills
      const newProf = {
        listening: Math.min(100, prev.skillProficiency.listening + 2),
        speaking: Math.min(100, prev.skillProficiency.speaking + 2),
        reading: Math.min(100, prev.skillProficiency.reading + 2),
        writing: Math.min(100, prev.skillProficiency.writing + 2),
        phonics: Math.min(100, prev.skillProficiency.phonics + 2),
      };

      return {
        ...prev,
        xp: newXp,
        gems: newGems,
        completedLessonIds: nextCompleted,
        dailyQuests: updatedQuests,
        weeklyChallenges: updatedWeeklyChallenges,
        badgesUnlocked: newBadges,
        skillProficiency: newProf,
      };
    });
  };

  // Claim XP from a completed Weekly Challenge
  const handleClaimWeeklyChallenge = (challengeId: string) => {
    setUserStats(prev => {
      const ch = prev.weeklyChallenges.find(c => c.id === challengeId);
      if (!ch || !ch.completed || ch.claimed) return prev;

      const updatedChallenges = prev.weeklyChallenges.map(c => 
        c.id === challengeId ? { ...c, claimed: true } : c
      );

      return {
        ...prev,
        xp: prev.xp + ch.rewardXp,
        gems: prev.gems + ch.rewardGems,
        weeklyChallenges: updatedChallenges,
      };
    });
  };

  // Advance dictionary word review challenge
  const handleWordReviewed = (_word: string) => {
    setUserStats(prev => {
      const updated = (prev.weeklyChallenges || DEFAULT_WEEKLY_CHALLENGES).map(ch => {
        if (ch.category === 'dictionary') {
          const nextCur = Math.min(ch.target, ch.current + 1);
          return {
            ...ch,
            current: nextCur,
            completed: ch.completed || nextCur >= ch.target,
          };
        }
        return ch;
      });

      return {
        ...prev,
        weeklyChallenges: updated,
      };
    });
  };

  // Award XP & Charisma elocution recognition
  const handleAwardReadingXp = (unitId: string, earnedXp: number, earnedGems: number) => {
    setUserStats(prev => {
      const alreadyDone = prev.completedReadingUnitIds?.includes(unitId);
      const nextDone = alreadyDone
        ? prev.completedReadingUnitIds || []
        : [...(prev.completedReadingUnitIds || []), unitId];

      const newXp = prev.xp + earnedXp;
      const newGems = prev.gems + earnedGems;

      // Unlock orator badge
      const newBadges = [...prev.badgesUnlocked];
      if (!newBadges.includes('orator_master')) {
        newBadges.push('orator_master');
      }

      // Progress phonics and xp challenges
      const updatedWeeklyChallenges = (prev.weeklyChallenges || DEFAULT_WEEKLY_CHALLENGES).map(ch => {
        let newCur = ch.current;
        if (ch.category === 'phonics') {
          newCur = Math.min(ch.target, ch.current + 1);
        } else if (ch.category === 'xp') {
          newCur = Math.min(ch.target, ch.current + earnedXp);
        }
        return {
          ...ch,
          current: newCur,
          completed: ch.completed || newCur >= ch.target,
        };
      });

      // Update daily quests (e.g. mic training)
      const updatedDailyQuests = prev.dailyQuests.map(q => {
        if (q.id === 'q-3') {
          const nextC = Math.min(q.target, q.current + 1);
          return { ...q, current: nextC, completed: nextC >= q.target };
        }
        return q;
      });

      // Skills proficiency boost
      const newProf = {
        ...prev.skillProficiency,
        reading: Math.min(100, prev.skillProficiency.reading + 4),
        speaking: Math.min(100, prev.skillProficiency.speaking + 4),
        phonics: Math.min(100, prev.skillProficiency.phonics + 3),
      };

      return {
        ...prev,
        xp: newXp,
        gems: newGems,
        completedReadingUnitIds: nextDone,
        badgesUnlocked: newBadges,
        weeklyChallenges: updatedWeeklyChallenges,
        dailyQuests: updatedDailyQuests,
        skillProficiency: newProf,
      };
    });
  };

  // Record mistaken word/sentence from exercises into Difficult Words vault
  const handleRecordMistake = (wordOrTarget: string, promptAr?: string, unitNumber?: number) => {
    setUserStats(prev => {
      const existing = prev.difficultWords || DEFAULT_DIFFICULT_WORDS;
      const clean = wordOrTarget.trim();
      const foundIndex = existing.findIndex(w => w.wordEn.toLowerCase() === clean.toLowerCase());

      if (foundIndex >= 0) {
        const updated = [...existing];
        updated[foundIndex] = {
          ...updated[foundIndex],
          mistakeCount: updated[foundIndex].mistakeCount + 1,
          mastered: false,
        };
        return { ...prev, difficultWords: updated };
      } else {
        const newWord = {
          id: `diff-${Date.now()}`,
          wordEn: clean,
          wordAr: promptAr || clean,
          category: 'Lesson Review',
          mistakeCount: 1,
          mastered: false,
          unitNumber,
          emoji: '🎯',
        };
        return { ...prev, difficultWords: [newWord, ...existing] };
      }
    });
  };

  // Mark difficult word as mastered and award XP
  const handleMarkWordMastered = (wordId: string, earnedXp: number) => {
    setUserStats(prev => {
      const updated = (prev.difficultWords || DEFAULT_DIFFICULT_WORDS).map(w => 
        w.id === wordId ? { ...w, mastered: true, lastReviewedDate: new Date().toISOString() } : w
      );
      return {
        ...prev,
        xp: prev.xp + earnedXp,
        difficultWords: updated,
      };
    });
  };

  // Complete quick review session and award bonus XP and gems
  const handleCompleteQuickReviewSession = (bonusXp: number, bonusGems: number) => {
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + bonusXp,
      gems: prev.gems + bonusGems,
    }));
  };

  // Manual reset of the 7-day cycle for testing
  const handleResetWeeklyCycle = () => {
    setUserStats(prev => ({
      ...prev,
      weeklyCycleStartDate: new Date().toISOString(),
      weeklyChallenges: generateRefreshedWeeklyChallenges(),
    }));
  };

  const handleResetProgress = () => {
    setUserStats(INITIAL_USER_STATS);
    localStorage.removeItem(STORAGE_KEY);
    playSound.click();
  };

  // Count unclaimed completed challenges for the badge
  const unclaimedChallengesCount = (userStats.weeklyChallenges || [])
    .filter(c => c.completed && !c.claimed).length;

  const isAnyModalOpen = !!activeLessonSession || !!activeReadingModalUnitId || isQuickReviewOpen || activeTab === 'unit_reading';

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-800 flex flex-col font-sans">
      {/* Top Bar with Hearts, Gems, Streak, and Name */}
      <div className="sticky top-0 z-30 bg-white shadow-2xs">
        <Header
          userStats={userStats}
          onUpdateStats={handleUpdateStats}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          onOpenAchievements={() => setActiveTab('achievements')}
          onOpenParentDashboard={() => setActiveTab('parent_dashboard')}
          onOpenSpecs={() => setActiveTab('specs')}
          currentMascot={currentMascot}
        />

        {/* Navigation tabs */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          unclaimedChallengesCount={unclaimedChallengesCount}
        />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'path' && (
          <LearningPath
            units={UNITS_DATA}
            userStats={userStats}
            onSelectLesson={handleSelectLesson}
            currentMascot={currentMascot}
            onNavigateToWeeklyChallenges={() => setActiveTab('weekly_challenges')}
            onOpenReadingPassage={(unitId) => setActiveReadingModalUnitId(unitId)}
            onNavigateToScenesExplorer={() => setActiveTab('scenes_explorer')}
            onOpenQuickReview={() => setIsQuickReviewOpen(true)}
            onNavigateToMultiplayer={() => setActiveTab('multiplayer')}
          />
        )}

        {activeTab === 'multiplayer' && (
          <MultiplayerArena
            userStats={userStats}
            onAwardXp={(earnedXp, earnedGems) => {
              handleUpdateStats({
                xp: userStats.xp + earnedXp,
                gems: userStats.gems + earnedGems,
              });
            }}
            onReturnToPath={() => setActiveTab('path')}
            currentMascot={currentMascot}
          />
        )}

        {activeTab === 'scenes_explorer' && (
          <TextbookScenesExplorer
            onAwardBonusXp={(xp, gems) => {
              handleUpdateStats({ xp: userStats.xp + xp, gems: userStats.gems + gems });
            }}
            currentMascot={currentMascot}
            onSelectCharacterMascot={(m) => setCurrentMascot(m)}
          />
        )}

        {activeTab === 'unit_reading' && (
          <UnitReadingCharismaModal
            initialUnitId="unit-0"
            userStats={userStats}
            onClose={() => setActiveTab('path')}
            onAwardReadingXp={handleAwardReadingXp}
            currentMascot={currentMascot}
          />
        )}

        {activeTab === 'weekly_challenges' && (
          <WeeklyChallenges
            userStats={userStats}
            onClaimChallenge={handleClaimWeeklyChallenge}
            onResetWeeklyCycle={handleResetWeeklyCycle}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            currentMascot={currentMascot}
          />
        )}

        {activeTab === 'dictionary' && (
          <MiniDictionary onWordReviewed={handleWordReviewed} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            users={leaderboardUsers}
            currentUserName={userStats.name}
            currentUserXp={userStats.xp}
            currentUserStreak={userStats.streakDays}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsModal
            userStats={userStats}
          />
        )}

        {activeTab === 'parent_dashboard' && (
          <TeacherParentDashboard
            userStats={userStats}
            onUpdateStats={handleUpdateStats}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeTab === 'specs' && (
          <SpecificationsDocument />
        )}
      </main>

      {/* Floating Interactive Mascot (Nadjib / Rehab) */}
      <InteractiveMascot
        currentMascot={currentMascot}
        onSwitchMascot={(m) => setCurrentMascot(m)}
        onRewardBonusXp={(bonusXp) => {
          handleUpdateStats({ xp: userStats.xp + bonusXp, gems: userStats.gems + 5 });
        }}
        studentName={userStats.name}
        hidden={isAnyModalOpen}
      />

      {/* Interactive Duolingo Lesson Session Modal */}
      {activeLessonSession && (
        <LessonModal
          lesson={activeLessonSession.lesson}
          unit={activeLessonSession.unit}
          userStats={userStats}
          onClose={handleCloseLesson}
          onCompleteLesson={handleCompleteLesson}
          onDeductHeart={handleDeductHeart}
          onRecordMistake={handleRecordMistake}
          currentMascot={currentMascot}
        />
      )}

      {/* Quick Review Mode Modal */}
      {isQuickReviewOpen && (
        <QuickReviewModal
          difficultWords={userStats.difficultWords || DEFAULT_DIFFICULT_WORDS}
          userStats={userStats}
          onClose={() => setIsQuickReviewOpen(false)}
          onMarkWordMastered={handleMarkWordMastered}
          onCompleteSession={handleCompleteQuickReviewSession}
          currentMascot={currentMascot}
        />
      )}

      {/* Unit Reading & Charisma Elocution Modal */}
      {activeReadingModalUnitId && (
        <UnitReadingCharismaModal
          initialUnitId={activeReadingModalUnitId}
          userStats={userStats}
          onClose={() => setActiveReadingModalUnitId(null)}
          onAwardReadingXp={handleAwardReadingXp}
          currentMascot={currentMascot}
        />
      )}
    </div>
  );
}
