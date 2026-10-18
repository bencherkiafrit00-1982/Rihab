import React, { useState } from 'react';
import { DifficultWord, UserStats } from '../types';
import { speakEnglish, startSpeechRecognition } from '../utils/speech';
import { playSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Zap, Volume2, Mic, MicOff, CheckCircle2, RotateCcw, 
  Sparkles, Award, ArrowRight, ArrowLeft, Trophy, X, 
  HelpCircle, Eye, EyeOff, Star, ShieldAlert, BookOpen
} from 'lucide-react';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface QuickReviewModalProps {
  difficultWords: DifficultWord[];
  userStats: UserStats;
  onClose: () => void;
  onMarkWordMastered: (wordId: string, earnedXp: number) => void;
  onCompleteSession: (bonusXp: number, bonusGems: number) => void;
  currentMascot?: 'nadjib' | 'rehab';
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  difficultWords,
  userStats,
  onClose,
  onMarkWordMastered,
  onCompleteSession,
  currentMascot = 'nadjib',
}) => {
  const [activeMode, setActiveMode] = useState<'flashcards' | 'quiz' | 'mic'>('flashcards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedInSessionCount, setReviewedInSessionCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Quiz state
  const [quizSelectedOpt, setQuizSelectedOpt] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Mic state
  const [isRecording, setIsRecording] = useState(false);
  const [micTranscript, setMicTranscript] = useState('');
  const [micScore, setMicScore] = useState<number | null>(null);
  const [micFeedback, setMicFeedback] = useState('');

  const words = difficultWords.length > 0 ? difficultWords : [];
  const currentWord: DifficultWord | undefined = words[currentIndex] || words[0];

  const masteredCount = words.filter(w => w.mastered).length;
  const progressPct = words.length > 0 ? Math.round((masteredCount / words.length) * 100) : 0;

  const handleSpeak = (text: string, rate: number = 0.88) => {
    playSound.click();
    speakEnglish(text, rate, currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl');
  };

  const handleNextWord = () => {
    playSound.click();
    setIsFlipped(false);
    setQuizSelectedOpt(null);
    setQuizAnswered(false);
    setMicTranscript('');
    setMicScore(null);
    setMicFeedback('');

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed round
      setSessionCompleted(true);
      playSound.fanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteSession(35, 10);
    }
  };

  const handlePrevWord = () => {
    playSound.click();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setQuizSelectedOpt(null);
      setQuizAnswered(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleMarkMastered = () => {
    if (!currentWord) return;
    playSound.correct();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    onMarkWordMastered(currentWord.id, 10);
    setReviewedInSessionCount(prev => prev + 1);
    handleNextWord();
  };

  // Generate 3 choices for quiz mode
  const getQuizOptions = (word: DifficultWord) => {
    const wrongOptions = words
      .filter(w => w.id !== word.id)
      .slice(0, 2)
      .map(w => ({ textAr: w.wordAr, textEn: w.wordEn, isCorrect: false }));

    const correct = { textAr: word.wordAr, textEn: word.wordEn, isCorrect: true };
    const all = [...wrongOptions, correct];
    // Deterministic pseudo-shuffle
    return all.sort((a, b) => a.textEn.localeCompare(b.textEn));
  };

  const handleQuizAnswer = (isCorrect: boolean, textEn: string) => {
    if (quizAnswered) return;
    setQuizSelectedOpt(textEn);
    setQuizAnswered(true);

    if (isCorrect) {
      playSound.correct();
      onMarkWordMastered(currentWord.id, 10);
      setReviewedInSessionCount(prev => prev + 1);
    } else {
      playSound.wrong();
    }
  };

  // Mic pronunciation test
  const handleMicTest = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    playSound.click();
    setIsRecording(true);
    setMicTranscript('');
    setMicScore(null);
    setMicFeedback('استمع إليك الآن... انطق الكلمة بوضوح! 🎙️');

    startSpeechRecognition(
      currentWord.wordEn,
      (res) => {
        setIsRecording(false);
        setMicTranscript(res.transcript);
        setMicScore(res.score);

        if (res.score >= 75) {
          playSound.correct();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
          });
          setMicFeedback('ما شاء الله! نطق رائع ومخارج حروف سليمة بنسبة 100%! 🌟');
          onMarkWordMastered(currentWord.id, 10);
          setReviewedInSessionCount(prev => prev + 1);
        } else {
          playSound.wrong();
          setMicFeedback('محاولة جيدة! استمع للسلحفاة 🐢 ثم أعد المحاولة.');
        }
      },
      (err) => {
        setIsRecording(false);
        setMicFeedback(`تنبيه: ${err}`);
      }
    );
  };

  if (!currentWord) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center max-w-md space-y-4">
          <span className="text-4xl">🎉</span>
          <h3 className="font-black text-xl text-slate-800">رائع جداً! لا توجد كلمات صعبة حالياً!</h3>
          <p className="text-xs text-slate-500">لقد أتقنت جميع المفردات السابقة بنجاح باهر.</p>
          <button onClick={onClose} className="btn-duo-green text-white px-6 py-2.5 rounded-xl font-black text-sm">
            العودة للمسار
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-amber-300 overflow-hidden flex flex-col h-full sm:h-auto max-h-[98vh] sm:max-h-[95vh]">
        {/* HEADER */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-white/30 shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="bg-yellow-300 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                  كسب نقاط إضافية (+Bonus XP)
                </span>
                <span className="bg-black/20 text-white font-english font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                  Quick Review
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black mt-0.5 leading-tight">
                نمط المراجعة السريعة للكلمات الصعبة 🎯
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all relative z-10 shrink-0 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS & MODE SWITCHER */}
        <div className="p-2.5 sm:p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Progress bar */}
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 whitespace-nowrap">
              إتقان الكلمات: <strong className="text-slate-800 font-english">{masteredCount}/{words.length}</strong>
            </span>
            <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-english font-black text-slate-700">{progressPct}%</span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => {
                playSound.click();
                setActiveMode('flashcards');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'flashcards'
                  ? 'bg-amber-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بطاقة ذكية 🎴
            </button>
            <button
              onClick={() => {
                playSound.click();
                setActiveMode('quiz');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'quiz'
                  ? 'bg-amber-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اختيار متعدد ❓
            </button>
            <button
              onClick={() => {
                playSound.click();
                setActiveMode('mic');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'mic'
                  ? 'bg-amber-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              نطق بالميكروفون 🎙️
            </button>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="p-3 sm:p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 sm:space-y-6">
          {!sessionCompleted ? (
            <div className="space-y-6">
              {/* Word Card Status Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-english font-black text-xs flex items-center justify-center">
                    #{currentIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    الوحدة {currentWord.unitNumber ?? 'المنهاج'} • {currentWord.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentWord.mastered ? (
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>متقنة سابقاً ✓</span>
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>أخطأت فيها {currentWord.mistakeCount} مرات</span>
                    </span>
                  )}
                </div>
              </div>

              {/* ============ MODE 1: FLASHCARDS ============ */}
              {activeMode === 'flashcards' && (
                <div className="space-y-4">
                  <div
                    onClick={() => {
                      playSound.click();
                      setIsFlipped(!isFlipped);
                    }}
                    className={`p-8 rounded-3xl border-3 transition-all cursor-pointer text-center space-y-4 relative overflow-hidden shadow-md select-none min-h-[220px] flex flex-col justify-center ${
                      isFlipped
                        ? 'bg-gradient-to-tr from-emerald-50 via-teal-50 to-white border-emerald-400'
                        : 'bg-gradient-to-tr from-amber-50 via-orange-50 to-white border-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-4xl">{currentWord.emoji || '📖'}</span>

                    {!isFlipped ? (
                      <div className="space-y-2">
                        <h3 className="font-english font-black text-3xl md:text-4xl text-slate-900 tracking-wide">
                          {currentWord.wordEn}
                        </h3>
                        <span className="text-xs text-amber-800 font-bold bg-amber-100/80 px-3 py-1 rounded-full inline-block">
                          💡 اضغط على البطاقة لإظهار المعنى والتصحيح
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-fadeIn">
                        <h3 className="font-black text-2xl md:text-3xl text-emerald-950">
                          {currentWord.wordAr}
                        </h3>
                        <p className="font-english text-xs text-slate-500 font-bold">
                          "{currentWord.wordEn}"
                        </p>
                      </div>
                    )}

                    {currentWord.phonicsNote && (
                      <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700 font-bold max-w-md mx-auto">
                        🎯 سر النطق: {currentWord.phonicsNote}
                      </div>
                    )}
                  </div>

                  {/* Audio Listen Buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleSpeak(currentWord.wordEn, 0.88)}
                      className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>نطق طبيعي</span>
                    </button>
                    <button
                      onClick={() => handleSpeak(currentWord.wordEn, 0.6)}
                      className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1.5 border border-sky-200"
                    >
                      <span>🐢 بطيء ومخارج دقيقة</span>
                    </button>
                  </div>

                  {/* Action Decision Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleNextWord}
                      className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs md:text-sm flex items-center justify-center gap-1.5 border border-slate-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ما زلت أتدرب (تخطي)</span>
                    </button>

                    <button
                      onClick={handleMarkMastered}
                      className="p-3.5 rounded-2xl btn-duo-green text-white font-black text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>أتقنتها الآن! (+10 XP) 🌟</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ============ MODE 2: QUIZ ============ */}
              {activeMode === 'quiz' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-300 text-center space-y-2">
                    <span className="text-3xl">{currentWord.emoji || '❓'}</span>
                    <h3 className="font-english font-black text-2xl md:text-3xl text-slate-900">
                      What is the meaning of "{currentWord.wordEn}"?
                    </h3>
                    <button
                      onClick={() => handleSpeak(currentWord.wordEn)}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع للكلمة</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {getQuizOptions(currentWord).map((opt, idx) => {
                      const isSelected = quizSelectedOpt === opt.textEn;
                      let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';

                      if (quizAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-200';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-black';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(opt.isCorrect, opt.textEn)}
                          disabled={quizAnswered}
                          className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right font-black text-sm ${btnStyle}`}
                        >
                          <span>{opt.textAr}</span>
                          <span className="font-english text-xs text-slate-500">{opt.textEn}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <button
                      onClick={handleNextWord}
                      className="w-full btn-duo-yellow text-slate-950 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md animate-fadeIn"
                    >
                      <span>الكلمة التالية ➔</span>
                    </button>
                  )}
                </div>
              )}

              {/* ============ MODE 3: MIC ============ */}
              {activeMode === 'mic' && (
                <div className="space-y-4 text-center">
                  <div className="p-6 rounded-3xl bg-rose-50/70 border-2 border-rose-300 space-y-2">
                    <span className="text-3xl">🎙️</span>
                    <h3 className="font-english font-black text-2xl md:text-3xl text-slate-900">
                      "{currentWord.wordEn}"
                    </h3>
                    <p className="text-xs text-slate-600 font-bold">
                      {currentWord.wordAr}
                    </p>
                    {currentWord.phonicsNote && (
                      <p className="text-[11px] text-rose-800 font-bold bg-white/70 p-2 rounded-xl max-w-sm mx-auto">
                        🎯 {currentWord.phonicsNote}
                      </p>
                    )}
                  </div>

                  {/* Mic Button */}
                  <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={handleMicTest}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                        isRecording
                          ? 'bg-rose-600 animate-pulse ring-8 ring-rose-200 scale-110'
                          : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      {isRecording ? 'استمع لنطقك الآن...' : 'اضغط على الميكروفون وانطق الكلمة'}
                    </span>
                  </div>

                  {/* Mic Feedback */}
                  {(isRecording || micFeedback) && (
                    <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-xs font-bold space-y-1">
                      <p className="text-slate-800">{micFeedback}</p>
                      {micTranscript && (
                        <p className="font-english text-slate-500">تم سماع: "{micTranscript}"</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleSpeak(currentWord.wordEn, 0.6)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                    >
                      <span>🐢 استمع ببطء</span>
                    </button>

                    <button
                      onClick={handleNextWord}
                      className="btn-duo-yellow text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5"
                    >
                      <span>تخطي للكلمة التالية ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SESSION COMPLETED SUMMARY */
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-4xl shadow-lg ring-4 ring-amber-200 animate-bounce">
                🎉
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                أحسنت يا بطل المراجعة السريعة!
              </h3>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-bold">
                لقد راجعت وتدربت على الكلمات الصعبة وحولت نقاط ضعفك إلى نقاط قوة خارقة!
              </p>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs font-black space-y-1">
                <span className="block text-sm">مكافأة الجولة الإضافية:</span>
                <span className="text-emerald-700 text-base font-english block">+35 XP & +10 💎</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    playSound.click();
                    setSessionCompleted(false);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>مراجعة جولة أخرى</span>
                </button>

                <button
                  onClick={() => {
                    playSound.click();
                    onClose();
                  }}
                  className="btn-duo-green text-white px-6 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-md"
                >
                  العودة لمسار التعلم ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>المراجعة السريعة ترفع معدل حفظ المفردات بـ 85%</span>
          </div>

          <div className="flex items-center gap-1 font-english font-black text-amber-700">
            <span>+10 XP لكل كلمة متقنة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
