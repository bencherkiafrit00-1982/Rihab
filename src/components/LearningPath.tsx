import React, { useState } from 'react';
import { Unit, Lesson, UserStats } from '../types';
import { Star, CheckCircle, Lock, Music, Sparkles, BookOpen, Volume2, Compass, MessageCircle, Mic, Zap } from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import { speakEnglish } from '../utils/speech';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface LearningPathProps {
  units: Unit[];
  userStats: UserStats;
  onSelectLesson: (lesson: Lesson, unit: Unit) => void;
  currentMascot?: 'nadjib' | 'rehab';
  onOpenMascot?: () => void;
  onNavigateToWeeklyChallenges?: () => void;
  onOpenReadingPassage?: (unitId: string) => void;
  onNavigateToScenesExplorer?: () => void;
  onOpenQuickReview?: () => void;
  onNavigateToMultiplayer?: () => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  units,
  userStats,
  onSelectLesson,
  currentMascot = 'nadjib',
  onOpenMascot,
  onNavigateToWeeklyChallenges,
  onOpenReadingPassage,
  onNavigateToScenesExplorer,
  onOpenQuickReview,
  onNavigateToMultiplayer,
}) => {
  const [selectedSongUnit, setSelectedSongUnit] = useState<Unit | null>(null);

  const handlePlaySong = (unit: Unit) => {
    playSound.click();
    setSelectedSongUnit(unit);
    if (unit.songLyrics && unit.songLyrics.length > 0) {
      speakEnglish(unit.songLyrics.join('. '), 0.9, currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl');
    }
  };

  const isLessonUnlocked = (lessonIndexInAll: number, lessonId: string) => {
    if (lessonIndexInAll === 0) return true;
    if (userStats.completedLessonIds.includes(lessonId)) return true;

    const allLessons = units.flatMap(u => u.lessons);
    const currIdx = allLessons.findIndex(l => l.id === lessonId);
    if (currIdx <= 0) return true;
    const prevLessonId = allLessons[currIdx - 1].id;
    return userStats.completedLessonIds.includes(prevLessonId);
  };

  const allLessons = units.flatMap(u => u.lessons);
  const mascotImgSrc = currentMascot === 'nadjib' ? nadjibImg : rehabImg;
  const mascotName = currentMascot === 'nadjib' ? 'نجيب' : 'رحاب';

  return (
    <div className="max-w-3xl mx-auto py-3 sm:py-6 px-2 sm:px-4">
      {/* Welcome Mascot Banner - Rehab & Nadjib */}
      <div className="mb-8 p-4 md:p-5 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-lg border-b-4 border-emerald-700 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenMascot}
              className="relative group shrink-0"
              title="اضغط للتحدث معي بالإنجليزية!"
            >
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-white p-1 shadow-md border-2 border-white/80 group-hover:scale-108 group-hover:rotate-2 transition-transform overflow-hidden">
                <img 
                  src={mascotImgSrc} 
                  alt={mascotName} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-1 -left-1 bg-yellow-400 text-yellow-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                تحدث معي ✨
              </span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-yellow-950 font-black text-xs px-2 py-0.5 rounded-full uppercase">
                  مرحباً بك {userStats.name}!
                </span>
                <span className="text-xs bg-emerald-800/50 px-2 py-0.5 rounded-md font-english font-bold">
                  Level {Math.floor(userStats.xp / 50) + 1}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black mt-1">
                {mascotName} يقول لك: "أهلاً بك في رحلة الإنجليزية الممتعة!"
              </h2>
              <p className="text-emerald-100 text-xs md:text-sm mt-0.5">
                تعلّم مع نجيب وأصدقائه خطوة بخطوة وفق كتابك المدرسي للسنة الرابعة ابتدائي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-800/40 p-2 rounded-2xl border border-white/20">
            <div className="text-center px-2 border-l border-emerald-400/30">
              <div className="text-xs text-emerald-200">الدروس المنجزة</div>
              <div className="font-english font-black text-base">
                {userStats.completedLessonIds.length}/{allLessons.length}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-xs text-emerald-200">النقاط الإجمالية</div>
              <div className="font-english font-black text-base text-yellow-300">
                {userStats.xp} XP
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Live Multiplayer Battle Banner (ساحة التحدي المباشر بين التلاميذ) */}
      {onNavigateToMultiplayer && (
        <div 
          onClick={onNavigateToMultiplayer}
          className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white shadow-xl border-b-4 border-violet-900 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:brightness-105 active:scale-99 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition-transform shadow-xs border border-white/30">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-base sm:text-lg">ساحة التحدي والتنافس المباشر 🔴</span>
                <span className="bg-yellow-300 text-purple-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                  متعدد التلاميذ في نفس الوقت!
                </span>
                <span className="bg-black/25 text-purple-200 font-bold text-[10px] px-2 py-0.5 rounded-full font-english">
                  Real-Time Multiplayer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 font-bold mt-1 max-w-xl leading-relaxed">
                اشترك مع عدة تلاميذ متنافسين من مختلف ولايات الجزائر في نفس اللحظة! تنافس على المراتب الأولى وناقش في غرفة المحادثة المباشرة!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <span className="btn-duo-yellow text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
              <span>دخول ساحة التحدي ➔</span>
            </span>
          </div>
        </div>
      )}

      {/* Quick Review Mode Banner (نمط المراجعة السريعة) */}
      {onOpenQuickReview && (
        <div 
          onClick={onOpenQuickReview}
          className="mb-6 p-4 md:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl border-b-4 border-amber-700 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:brightness-105 active:scale-99 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition-transform shadow-xs border border-white/30">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-base md:text-lg">نمط المراجعة السريعة (Quick Review) ⚡</span>
                <span className="bg-yellow-300 text-amber-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                  {(userStats.difficultWords || []).filter(w => !w.mastered).length > 0 
                    ? `${(userStats.difficultWords || []).filter(w => !w.mastered).length} كلمات صعبة للمراجعة` 
                    : 'كل الكلمات متقنة ✓'}
                </span>
                <span className="bg-black/20 text-yellow-200 font-black text-[10px] px-2.5 py-0.5 rounded-full font-english">
                  +35 Bonus XP
                </span>
              </div>
              <p className="text-xs md:text-sm text-amber-100 font-bold mt-1 max-w-xl leading-relaxed">
                تدرّب على الكلمات الصعبة التي أخطأت فيها سابقاً لتثبيتها في ذاكرتك وتحويلها إلى نقاط خبرة وجواهر إضافية!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <span className="btn-duo-yellow text-slate-950 font-black text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>ابدأ المراجعة الآن ➔</span>
            </span>
          </div>
        </div>
      )}

      {/* Weekly Challenges Quick Banner */}
      {onNavigateToWeeklyChallenges && (
        <div 
          onClick={onNavigateToWeeklyChallenges}
          className="mb-8 p-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md border-b-4 border-amber-700 flex items-center justify-between gap-3 cursor-pointer hover:brightness-105 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm">التحديات الأسبوعية نشطة الآن!</span>
                <span className="bg-yellow-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  تتجدد كل 7 أيام 🔄
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                أكمل التحديات قبل انقضاء الأسبوع لكسب حتى +400 XP وجواهر إضافية!
              </p>
            </div>
          </div>
          <span className="btn-duo-yellow text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shrink-0 shadow-xs">
            عرض التحديات ➔
          </span>
        </div>
      )}

      {/* Textbook Characters & Algerian Cities Showcase Banner */}
      {onNavigateToScenesExplorer && (
        <div 
          onClick={onNavigateToScenesExplorer}
          className="mb-8 p-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-md border-b-4 border-teal-800 flex items-center justify-between gap-3 cursor-pointer hover:brightness-105 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm">عالم ورسومات الكتاب المدرسي 🇩🇿</span>
                <span className="bg-yellow-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  12 مدينة جزائرية • 9 شخصيات • مئات المشاهد
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                تصفح تجسيد شخصيات نجيب ورحاب وأصدقائهما، والمدن والولايات، وأدوات ورسومات كل وحدة!
              </p>
            </div>
          </div>
          <span className="bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs px-3.5 py-2 rounded-xl shrink-0 shadow-xs">
            استكشف المشاهد 🎨 ➔
          </span>
        </div>
      )}

      {/* Interactive Units Road */}
      <div className="space-y-12">
        {units.map((unit) => {
          return (
            <div key={unit.id} className="relative">
              {/* Unit Header Card */}
              <div 
                className={`p-4 md:p-5 rounded-2xl text-white shadow-md bg-gradient-to-r ${unit.bgGradient} border-b-4 border-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-black/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                      {unit.unitNumber === 0 ? 'الوحدة التمهيدية' : `الوحدة ${unit.unitNumber}`}
                    </span>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md font-english">
                      {unit.textbookPages}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-2">
                    <span>{unit.badgeIcon}</span>
                    <span>{unit.titleAr}</span>
                    <span className="font-english font-bold text-sm text-white/90 hidden sm:inline">
                      ({unit.titleEn})
                    </span>
                  </h3>
                  <p className="text-xs text-white/90 mt-1 max-w-xl">
                    <span className="font-bold">التركيز: </span>{unit.grammarFocus} • <span className="font-bold">الصوتيات: </span>{unit.phonicsFocus}
                  </p>
                  <p className="text-[11px] text-amber-200 mt-1 flex items-center gap-1">
                    <span>🇩🇿</span>
                    <span>{unit.algerianCultureTouch}</span>
                  </p>
                </div>

                {/* Unit Action Buttons (Reading Passage + Song) */}
                <div className="self-end md:self-auto flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      playSound.click();
                      onOpenReadingPassage?.(unit.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-amber-50 hover:text-amber-800 transition-all border-b-2 border-slate-300"
                    title="نص القراءة وتدريب كاريزمة الإلقاء"
                  >
                    <Mic className="w-4 h-4 text-rose-500" />
                    <span>نص القراءة وكاريزمة الإلقاء 🎙️</span>
                  </button>

                  {unit.songTitle && (
                    <button
                      onClick={() => handlePlaySong(unit)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-800 font-bold text-xs shadow-md hover:bg-yellow-50 hover:text-amber-700 transition-all border-b-2 border-slate-300"
                      title="أنشودة الوحدة الرسمية"
                    >
                      <Music className="w-4 h-4 text-purple-600 animate-bounce" />
                      <span>أنشودة: {unit.songTitle}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Stepping Stones Path */}
              <div className="py-6 flex flex-col items-center relative">
                {/* Connecting SVG Path Line */}
                <div className="w-1.5 bg-slate-300 absolute top-0 bottom-0 z-0 rounded-full" />

                <div className="space-y-6 w-full flex flex-col items-center z-10">
                  {unit.lessons.map((lesson, lIdx) => {
                    const lessonGlobalIdx = allLessons.findIndex(l => l.id === lesson.id);
                    const unlocked = isLessonUnlocked(lessonGlobalIdx, lesson.id);
                    const completed = userStats.completedLessonIds.includes(lesson.id);

                    // Alternate positions slightly left and right for Duolingo curve feel
                    const offsetClass = lIdx % 2 === 0 ? 'translate-x-3 md:translate-x-6' : '-translate-x-3 md:-translate-x-6';

                    return (
                      <div key={lesson.id} className={`flex flex-col items-center transition-transform ${offsetClass}`}>
                        {/* Stepping Stone Node Button */}
                        <div className="relative group">
                          {/* Crown or Star indicator */}
                          {completed && (
                            <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-950 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white z-20 animate-pulse font-bold">
                              👑
                            </div>
                          )}

                          <button
                            disabled={!unlocked}
                            onClick={() => {
                              playSound.click();
                              onSelectLesson(lesson, unit);
                            }}
                            className={`w-20 h-20 md:w-22 md:h-22 rounded-full flex flex-col items-center justify-center relative transition-all ${
                              completed
                                ? 'bg-amber-400 border-b-6 border-amber-600 shadow-lg text-white hover:brightness-110'
                                : unlocked
                                ? 'bg-[#58CC02] border-b-6 border-[#46A302] shadow-xl text-white hover:scale-105 active:translate-y-1 active:border-b-2 ring-4 ring-emerald-200'
                                : 'bg-slate-200 border-b-6 border-slate-300 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {completed ? (
                              <CheckCircle className="w-8 h-8 text-amber-900" />
                            ) : unlocked ? (
                              <>
                                <span className="text-2xl">{lesson.icon}</span>
                                <div className="flex gap-0.5 mt-0.5">
                                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                                </div>
                              </>
                            ) : (
                              <Lock className="w-7 h-7 text-slate-400" />
                            )}
                          </button>
                        </div>

                        {/* Lesson Label */}
                        <div className="mt-2 text-center max-w-[200px]">
                          <p className={`font-extrabold text-xs md:text-sm ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                            {lesson.titleAr}
                          </p>
                          <p className="text-[11px] font-english text-slate-500 font-bold truncate">
                            {lesson.titleEn}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px]">
                            <span className="text-amber-600 font-bold font-english">+{lesson.xpReward} XP</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sky-600 font-bold font-english">+{lesson.gemReward} 💎</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Song Modal / Popup when user clicks on a Unit Song */}
      {selectedSongUnit && selectedSongUnit.songLyrics && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-purple-300 relative text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
              🎵
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              أنشودة الكتاب المدرسي (I sing and have fun)
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-2 font-english">
              "{selectedSongUnit.songTitle}"
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              الوحدة: {selectedSongUnit.titleAr}
            </p>

            <div className="bg-purple-50/70 p-4 rounded-2xl text-slate-700 space-y-2 font-english text-sm font-semibold border border-purple-100 text-left">
              {selectedSongUnit.songLyrics.map((line, idx) => (
                <p key={idx} className="leading-relaxed">
                  🎶 {line}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => {
                  playSound.click();
                  speakEnglish(selectedSongUnit.songLyrics!.join('. '), 0.9, currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl');
                }}
                className="btn-duo-purple text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمع للأنشودة كاملة</span>
              </button>
              <button
                onClick={() => setSelectedSongUnit(null)}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
