import React from 'react';
import { LeaderboardUser } from '../types';
import { Trophy, Flame, Sparkles, MapPin, Medal } from 'lucide-react';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserName: string;
  currentUserXp: number;
  currentUserStreak: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserName,
  currentUserXp,
  currentUserStreak,
}) => {
  // Merge current user with the leaderboard and sort by XP
  const updatedUsers: LeaderboardUser[] = users.map(u => {
    if (!u.isNpc) {
      return {
        ...u,
        name: currentUserName,
        xp: Math.max(u.xp, currentUserXp),
        streak: currentUserStreak,
      };
    }
    return u;
  }).sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg border-b-4 border-amber-700 mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center text-3xl shadow-inner mb-3 border border-white/30 animate-duo-bounce">
          🏆
        </div>
        <span className="text-xs font-black uppercase text-amber-950 bg-yellow-300 px-3 py-1 rounded-full border border-yellow-400">
          دوري النخبة للسنة الرابعة ابتدائي • 4PS Champions
        </span>
        <h2 className="text-xl md:text-2xl font-black mt-2">
          لوحة الشرف وتحدي الأصدقاء
        </h2>
        <p className="text-amber-100 text-xs md:text-sm mt-1">
          تنافس في جو من المرح والتشجيع مع نجيب وأصدقائه من مختلف ربوع الجزائر الحبيبة!
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-2 mb-6 items-end">
        {/* 2nd Place */}
        {updatedUsers[1] && (
          <div className="p-3 rounded-2xl bg-white border-2 border-slate-200 text-center shadow-xs">
            <div className="text-xl mb-1">{updatedUsers[1].avatar}</div>
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs mx-auto flex items-center justify-center mb-1">
              2
            </div>
            <p className="font-extrabold text-xs text-slate-800 truncate">{updatedUsers[1].name}</p>
            <p className="font-english font-bold text-xs text-amber-600">{updatedUsers[1].xp} XP</p>
          </div>
        )}

        {/* 1st Place */}
        {updatedUsers[0] && (
          <div className="p-4 rounded-3xl bg-amber-50 border-3 border-amber-400 text-center shadow-md -translate-y-2">
            <div className="text-3xl mb-1 animate-pulse">👑 {updatedUsers[0].avatar}</div>
            <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-sm mx-auto flex items-center justify-center mb-1 shadow-xs">
              1
            </div>
            <p className="font-black text-sm text-slate-900 truncate">{updatedUsers[0].name}</p>
            <p className="font-english font-black text-sm text-amber-600">{updatedUsers[0].xp} XP</p>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
              المتصدر الحالي!
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {updatedUsers[2] && (
          <div className="p-3 rounded-2xl bg-white border-2 border-slate-200 text-center shadow-xs">
            <div className="text-xl mb-1">{updatedUsers[2].avatar}</div>
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs mx-auto flex items-center justify-center mb-1">
              3
            </div>
            <p className="font-extrabold text-xs text-slate-800 truncate">{updatedUsers[2].name}</p>
            <p className="font-english font-bold text-xs text-amber-600">{updatedUsers[2].xp} XP</p>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {updatedUsers.map((user, index) => {
          const isMe = !user.isNpc;
          const rank = index + 1;

          return (
            <div
              key={user.id}
              className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                isMe ? 'bg-emerald-50/80 border-r-4 border-r-emerald-500 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-english font-black text-xs ${
                  rank === 1 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                  rank === 2 ? 'bg-slate-300 text-slate-800' :
                  rank === 3 ? 'bg-amber-200 text-amber-900' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {rank}
                </span>

                <div className="text-2xl">{user.avatar}</div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm ${isMe ? 'text-emerald-900 font-black' : 'text-slate-800 font-extrabold'}`}>
                      {user.name}
                    </p>
                    {isMe && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">
                        أنت
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{user.city}</span>
                  </div>
                </div>
              </div>

              {/* Stats (Streak & XP) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-orange-600 font-english font-bold text-xs bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{user.streak}d</span>
                </div>

                <div className="text-right min-w-[65px]">
                  <span className="font-english font-black text-sm text-slate-800">
                    {user.xp}
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-1 font-bold">XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
