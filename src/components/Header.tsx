import React, { useState } from 'react';
import { UserStats } from '../types';
import { Flame, Heart, Sparkles, Volume2, VolumeX, ShieldAlert, Award, User, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface HeaderProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
  onOpenParentDashboard: () => void;
  onOpenSpecs: () => void;
  currentMascot?: 'nadjib' | 'rehab';
  onOpenMascot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userStats,
  onUpdateStats,
  soundEnabled,
  onToggleSound,
  onOpenAchievements,
  onOpenParentDashboard,
  onOpenSpecs,
  currentMascot = 'nadjib',
  onOpenMascot,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userStats.name);

  const handleRefillHearts = () => {
    playSound.gem();
    onUpdateStats({ hearts: userStats.maxHearts });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStats({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const mascotSrc = currentMascot === 'nadjib' ? nadjibImg : rehabImg;

  return (
    <div className="bg-white border-b border-slate-200 px-2 sm:px-4 py-1.5 sm:py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo and Mascot */}
        <div 
          onClick={onOpenMascot}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0"
          title="اضغط للتحدث مع صديقك نجيب / رحاب"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border-2 border-emerald-500 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <img 
                src={mascotSrc} 
                alt="نجيب ورحاب" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-[10px] bg-yellow-400 text-yellow-950 font-black rounded-full px-1 border border-white">
              🇩🇿
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-base md:text-lg text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                <span className="hidden xs:inline">رحلة رحاب لتعلم </span>الإنجليزية
              </h1>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                4PS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
              السنة الرابعة ابتدائي • بطل الكتاب: نجيب (Nadjib 4PS)
            </p>
          </div>
        </div>

        {/* Stats indicators (Duolingo Style: Streak, Gems, Hearts) */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          {/* Daily Streak */}
          <div 
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-extrabold cursor-pointer hover:bg-orange-100 transition-colors"
            title="سلسلة الأيام الحماسية"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500 animate-pulse fill-orange-500" />
            <span className="font-english text-xs sm:text-sm md:text-base">{userStats.streakDays}</span>
          </div>

          {/* Gems */}
          <div 
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200 text-sky-600 font-extrabold cursor-pointer hover:bg-blue-100 transition-colors"
            title="الجواهر المكتسبة"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-sky-500 fill-sky-400" />
            <span className="font-english text-xs sm:text-sm md:text-base">{userStats.gems}</span>
          </div>

          {/* Hearts */}
          <div 
            onClick={userStats.hearts < userStats.maxHearts ? handleRefillHearts : undefined}
            className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl border font-extrabold transition-colors ${
              userStats.hearts <= 1 
                ? 'bg-rose-100 border-rose-400 text-rose-600 animate-bounce cursor-pointer' 
                : 'bg-rose-50 border-rose-200 text-rose-500'
            }`}
            title={userStats.hearts < userStats.maxHearts ? 'اضغط لملء القلوب مجاناً!' : 'القلوب كاملة'}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-rose-500 text-rose-500" />
            <span className="font-english text-xs sm:text-sm md:text-base">
              {userStats.hearts}/{userStats.maxHearts}
            </span>
            {userStats.hearts < userStats.maxHearts && (
              <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 animate-spin" />
            )}
          </div>

          {/* XP & Level Badge */}
          <div 
            onClick={onOpenParentDashboard}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 font-bold cursor-pointer hover:bg-amber-100"
            title="مجموع نقاط الخبرة ومستوى التلميذ"
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-xs font-english">{userStats.xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button 
            onClick={() => {
              playSound.click();
              onToggleSound();
            }}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />}
          </button>

          {/* Student Profile Quick Action */}
          <div className="relative">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-24 text-xs font-bold px-2 py-1 border-2 border-emerald-400 rounded-lg outline-none"
                  autoFocus
                />
                <button type="submit" className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-lg">حفظ</button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-300"
                title="اضغط لتغيير اسم التلميذ"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[70px] truncate">{userStats.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
