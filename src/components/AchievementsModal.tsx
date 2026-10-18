import React from 'react';
import { UserStats } from '../types';
import { BADGES_DATA } from '../data/curriculumData';
import { Award, CheckCircle, Lock, Sparkles, Flame, Star, Target } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface AchievementsModalProps {
  userStats: UserStats;
  onClaimQuest?: (questId: string, rewardGems: number) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  userStats,
  onClaimQuest,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg border-b-4 border-purple-800 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-yellow-300 text-purple-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              لوحة المكافآت والشارات
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            الأوسمة والمهام اليومية
          </h2>
          <p className="text-purple-100 text-xs md:text-sm mt-1">
            كلما واظبت على التعلم والممارسة، فتحت أوسمة جديدة وحصدت جواهر ثمينة!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/20">
          <div className="text-center px-3 border-l border-white/20">
            <span className="text-xs text-purple-200 block">الأوسمة المفتوحة</span>
            <span className="font-english font-black text-lg text-yellow-300">
              {userStats.badgesUnlocked.length}/{BADGES_DATA.length}
            </span>
          </div>
          <div className="text-center px-3">
            <span className="text-xs text-purple-200 block">الجواهر المتوفرة</span>
            <span className="font-english font-black text-lg text-sky-300">
              {userStats.gems} 💎
            </span>
          </div>
        </div>
      </div>

      {/* Daily Quests Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-black text-base text-slate-800">
            المهام اليومية (Daily Quests)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userStats.dailyQuests.map((quest) => {
            const isDone = quest.completed || quest.current >= quest.target;
            const pct = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-extrabold text-slate-800">{quest.titleAr}</span>
                    <span className="text-sky-600 font-bold font-english">+{quest.rewardGems} 💎</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                    <span>التقدم:</span>
                    <span className="font-english">{quest.current}/{quest.target}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  {isDone ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-black bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle className="w-4 h-4" />
                      <span>مكتملة!</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium block text-center">
                      واصل الدروس لإكمال المهمة
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-base text-slate-800">
            أوسمة الشرف والإنجاز (Badges)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = userStats.badgesUnlocked.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                  isUnlocked
                    ? 'bg-amber-100 border-amber-300 shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-xs md:text-sm text-slate-800">
                      {badge.titleAr}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md font-bold">
                        مفتوح
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-english text-slate-500 font-semibold">
                    {badge.titleEn}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {badge.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold">
                    الشرط: {badge.requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
