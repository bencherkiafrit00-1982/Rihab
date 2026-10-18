import React, { useState, useEffect } from 'react';
import { WeeklyChallenge, UserStats } from '../types';
import { getRemainingTimeInArabic, SEVEN_DAYS_MS } from '../data/weeklyChallengesData';
import { 
  Zap, Clock, Trophy, CheckCircle2, Gift, 
  Sparkles, RefreshCw, Flame, ArrowRight, 
  Star, Lock, BookOpen, Target, Mic 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface WeeklyChallengesProps {
  userStats: UserStats;
  onClaimChallenge: (challengeId: string) => void;
  onResetWeeklyCycle: () => void;
  onNavigateToTab: (tab: any) => void;
  currentMascot?: 'nadjib' | 'rehab';
}

export const WeeklyChallenges: React.FC<WeeklyChallengesProps> = ({
  userStats,
  onClaimChallenge,
  onResetWeeklyCycle,
  onNavigateToTab,
  currentMascot = 'nadjib',
}) => {
  const [timeLeft, setTimeLeft] = useState(() => 
    getRemainingTimeInArabic(userStats.weeklyCycleStartDate || new Date().toISOString())
  );

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTimeInArabic(userStats.weeklyCycleStartDate || new Date().toISOString()));
    }, 1000);
    return () => clearInterval(timer);
  }, [userStats.weeklyCycleStartDate]);

  const challenges = userStats.weeklyChallenges || [];
  const completedCount = challenges.filter(c => c.completed).length;
  const claimedCount = challenges.filter(c => c.claimed).length;
  const totalXpAvailable = challenges.reduce((sum, c) => sum + c.rewardXp, 0);
  const totalEarnedXp = challenges.filter(c => c.claimed).reduce((sum, c) => sum + c.rewardXp, 0);

  // Calculate 7-day progress percentage
  const startMs = new Date(userStats.weeklyCycleStartDate || new Date().toISOString()).getTime();
  const elapsedMs = Math.max(0, Date.now() - startMs);
  const cyclePercent = Math.min(100, Math.round((elapsedMs / SEVEN_DAYS_MS) * 100));

  const handleClaim = (ch: WeeklyChallenge) => {
    if (!ch.completed || ch.claimed) return;
    playSound.fanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClaimChallenge(ch.id);
  };

  const allCompleted = challenges.length > 0 && completedCount === challenges.length;

  return (
    <div className="max-w-4xl mx-auto py-3 sm:py-6 px-2 sm:px-4 space-y-4 sm:space-y-6">
      {/* HERO BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl border-b-4 border-amber-700 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-yellow-300 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-950" />
                <span>تتجدد كل 7 أيام تلقائياً 🔄</span>
              </span>
              <span className="bg-black/20 text-white text-xs font-bold px-2.5 py-1 rounded-full font-english">
                Weekly Quest Master
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              التحديات الأسبوعية الكبرى ⚡
            </h2>

            <p className="text-amber-100 text-xs md:text-sm max-w-xl leading-relaxed">
              أكمل التحديات قبل انتهاء مهلة الـ 7 أيام واحصد مئات نقاط الـ <span className="font-english font-black text-yellow-300">XP</span> الإضافية والجواهر لتتصدر لوحة شرف أبطال السنة الرابعة ابتدائي!
            </p>
          </div>

          {/* Mascot cheering card */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 shrink-0 shadow-lg">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img 
                src={currentMascot === 'nadjib' ? nadjibImg : rehabImg} 
                alt="المساعد التشجيعي" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-yellow-200 block">نصيحة الأسبوع:</span>
              <p className="text-xs font-black text-white max-w-[140px] leading-snug mt-0.5">
                "تحديات الأسبوع ترفع رتبتك في الدوري أسرع بـ 3 أضعاف!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-DAY LIVE COUNTDOWN TIMER & SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Countdown Box */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">الوقت المتبقي لانتهاء دورة الـ 7 أيام:</h4>
                <p className="text-[11px] text-slate-500">تُستبدل التحديات وتُصفّر العدادات عند الصفر</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('هل تريد تجديد وتصفير الأسبوع الآن تجريبياً لاختبار التجديد التلقائي؟')) {
                  onResetWeeklyCycle();
                  playSound.click();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="تجديد يدوي اختباري"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تجديد الأسبوع (اختباري)</span>
            </button>
          </div>

          {/* Clock Digits */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="font-english font-black text-xl md:text-2xl text-amber-700 block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-amber-900">أيام (Days)</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200">
              <span className="font-english font-black text-xl md:text-2xl text-orange-700 block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-orange-900">ساعة (Hours)</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="font-english font-black text-xl md:text-2xl text-rose-700 block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-rose-900">دقيقة (Mins)</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="font-english font-black text-xl md:text-2xl text-purple-700 block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-purple-900">ثانية (Secs)</span>
            </div>
          </div>

          {/* Progress bar of current 7-day cycle */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 font-bold mb-1">
              <span>انقضاء أيام الأسبوع:</span>
              <span className="font-english">{cyclePercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${cyclePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Stats Overview */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5 mb-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>إحصائيات إنجاز الأسبوع</span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-600 font-bold">التحديات المنجزة:</span>
                <span className="font-english font-black text-sm text-emerald-600">
                  {completedCount} / {challenges.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50">
                <span className="text-xs text-amber-800 font-bold">نقاط XP المكتسبة:</span>
                <span className="font-english font-black text-sm text-amber-600">
                  +{totalEarnedXp} / {totalXpAvailable} XP
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50">
                <span className="text-xs text-sky-800 font-bold">الجوائز المستلمة:</span>
                <span className="font-english font-black text-sm text-sky-600">
                  {claimedCount} مستلمة
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-bold">
              مجموع المكافآت الأسبوعية: <span className="text-amber-600 font-english font-black">+{totalXpAvailable} XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* LIST OF WEEKLY CHALLENGES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>قائمة تحديات الأسبوع الـ 5 (Weekly Quest List)</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            اضغط على الزر لاستلام نقاط XP فور الإكمال
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const isCompleted = ch.completed || ch.current >= ch.target;
            const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));

            return (
              <div
                key={ch.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between relative overflow-hidden shadow-xs ${
                  ch.claimed
                    ? 'bg-slate-50 border-slate-200 opacity-90'
                    : isCompleted
                    ? 'bg-gradient-to-tr from-emerald-50 to-teal-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header of challenge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center text-2xl shrink-0">
                        {ch.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm md:text-base text-slate-900 leading-tight">
                          {ch.titleAr}
                        </h4>
                        <span className="text-[11px] font-english text-slate-500 font-bold block mt-0.5">
                          {ch.titleEn}
                        </span>
                      </div>
                    </div>

                    {/* Reward Pill */}
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 font-english font-black text-xs px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        <span>+{ch.rewardXp} XP</span>
                      </span>
                      <span className="text-[10px] text-sky-600 font-bold block mt-1 font-english">
                        +{ch.rewardGems} 💎
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 my-2 leading-relaxed">
                    {ch.descriptionAr}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>التقدم الأسبوعي:</span>
                      <span className="font-english">
                        {ch.current} / {ch.target} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ch.claimed
                            ? 'bg-slate-400'
                            : isCompleted
                            ? 'bg-[#58CC02]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  {ch.claimed ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تم استلام +{ch.rewardXp} XP بنجاح ✓</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(ch)}
                      className="w-full btn-duo-green text-white py-3 rounded-xl font-black text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 animate-bounce"
                    >
                      <Gift className="w-4 h-4" />
                      <span>استلم جائزتك الآن (+{ch.rewardXp} XP) 🎁</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        playSound.click();
                        if (ch.category === 'dictionary') {
                          onNavigateToTab('dictionary');
                        } else {
                          onNavigateToTab('path');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>واصل التعلم لإكمال التحدي</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GRAND WEEKLY CHEST MILESTONE */}
      <div className={`p-6 rounded-3xl border-3 transition-all text-center space-y-4 ${
        allCompleted
          ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-amber-500 shadow-xl'
          : 'bg-white border-dashed border-slate-300'
      }`}>
        <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner bg-white/80 border-2 border-amber-300">
          {allCompleted ? '🎉' : '🔒'}
        </div>

        <div>
          <span className="text-xs font-black uppercase text-amber-950 bg-yellow-200 px-3 py-1 rounded-full border border-amber-300">
            الجائزة الأسبوعية الكبرى • Grand Weekly Chest
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-2">
            صندوق بطل الأسبوع الذهبي (+150 XP و +50 💎)
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
            يُفتح هذا الصندوق الاستثنائي تلقائياً عندما تكمل جميع التحديات الـ 5 لهذا الأسبوع!
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>إجمالي الإنجاز:</span>
            <span className="font-english">{completedCount} من {challenges.length} تحديات</span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / Math.max(1, challenges.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
