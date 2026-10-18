import React from 'react';
import { Map, BookOpen, Trophy, Award, FileText, Users, Zap, Mic, Palette, Swords } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export type NavTab = 'path' | 'multiplayer' | 'scenes_explorer' | 'unit_reading' | 'weekly_challenges' | 'dictionary' | 'leaderboard' | 'achievements' | 'parent_dashboard' | 'specs';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unclaimedChallengesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onSelectTab,
  unclaimedChallengesCount = 0,
}) => {
  const navItems = [
    { id: 'path' as NavTab, label: 'مسار التعلم', icon: Map, color: 'text-emerald-600', activeBg: 'bg-emerald-100 text-emerald-800 border-emerald-400' },
    { 
      id: 'multiplayer' as NavTab, 
      label: 'تحدي التلاميذ المباشر ⚔️', 
      icon: Swords, 
      color: 'text-violet-600', 
      activeBg: 'bg-violet-100 text-violet-900 border-violet-400',
      badge: 'مباشر 🔴'
    },
    { 
      id: 'scenes_explorer' as NavTab, 
      label: 'مشاهد ورسومات الكتاب 🏛️', 
      icon: Palette, 
      color: 'text-cyan-600', 
      activeBg: 'bg-cyan-100 text-cyan-900 border-cyan-400' 
    },
    { 
      id: 'unit_reading' as NavTab, 
      label: 'نصوص القراءة والإلقاء 🎙️', 
      icon: Mic, 
      color: 'text-rose-600', 
      activeBg: 'bg-rose-100 text-rose-800 border-rose-400' 
    },
    { 
      id: 'weekly_challenges' as NavTab, 
      label: 'التحديات الأسبوعية ⚡', 
      icon: Zap, 
      color: 'text-amber-600', 
      activeBg: 'bg-amber-100 text-amber-900 border-amber-400',
      badge: unclaimedChallengesCount > 0 ? unclaimedChallengesCount : undefined,
    },
    { id: 'dictionary' as NavTab, label: 'القاموس المصور (ص 96)', icon: BookOpen, color: 'text-blue-600', activeBg: 'bg-blue-100 text-blue-800 border-blue-400' },
    { id: 'leaderboard' as NavTab, label: 'لوحة الشرف', icon: Trophy, color: 'text-amber-600', activeBg: 'bg-amber-100 text-amber-800 border-amber-400' },
    { id: 'achievements' as NavTab, label: 'الأوسمة والمهام', icon: Award, color: 'text-purple-600', activeBg: 'bg-purple-100 text-purple-800 border-purple-400' },
    { id: 'parent_dashboard' as NavTab, label: 'لوحة الولي والمعلم', icon: Users, color: 'text-rose-600', activeBg: 'bg-rose-100 text-rose-800 border-rose-400' },
    { id: 'specs' as NavTab, label: 'دليل المواصفات (1-10)', icon: FileText, color: 'text-indigo-600', activeBg: 'bg-indigo-100 text-indigo-800 border-indigo-400' },
  ];

  const handleTabClick = (id: NavTab) => {
    playSound.click();
    onSelectTab(id);
  };

  return (
    <nav className="bg-white border-b border-slate-200 overflow-x-auto touch-pan-x no-scrollbar">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center justify-start sm:justify-center gap-1 sm:gap-2 md:gap-3 py-1.5 sm:py-2 flex-nowrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all border-2 relative shrink-0 min-h-[38px] cursor-pointer ${
                isActive
                  ? `${item.activeBg} shadow-xs scale-102`
                  : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span>{item.label}</span>

              {item.badge && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center animate-bounce -mr-1">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

