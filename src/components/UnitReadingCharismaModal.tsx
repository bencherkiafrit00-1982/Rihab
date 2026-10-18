import React, { useState, useEffect, useRef } from 'react';
import { UnitReadingPassage, ReadingSentence, UserStats } from '../types';
import { UNIT_READING_PASSAGES } from '../data/unitReadingData';
import { speakEnglish, SpeakerPersona, startSpeechRecognition } from '../utils/speech';
import { playSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Volume2, Mic, MicOff, Sparkles, CheckCircle2, 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw, 
  Award, Star, Zap, BookOpen, MessageCircle, Heart,
  Flame, HelpCircle, Layers, Maximize2, Share2, X, Target
} from 'lucide-react';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface UnitReadingCharismaModalProps {
  initialUnitId?: string;
  userStats: UserStats;
  onClose?: () => void;
  onAwardReadingXp: (unitId: string, earnedXp: number, earnedGems: number) => void;
  currentMascot?: 'nadjib' | 'rehab';
}

export const UnitReadingCharismaModal: React.FC<UnitReadingCharismaModalProps> = ({
  initialUnitId = 'unit-0',
  userStats,
  onClose,
  onAwardReadingXp,
  currentMascot = 'nadjib',
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId);
  const [activeMode, setActiveMode] = useState<'read_along' | 'charisma_studio' | 'stage_podium'>('charisma_studio');
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number>(0);
  const [isPlayingFullText, setIsPlayingFullText] = useState<boolean>(false);
  const [currentPlayingSentenceId, setCurrentPlayingSentenceId] = useState<string | null>(null);
  const [preferredPersona, setPreferredPersona] = useState<SpeakerPersona>(
    currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl'
  );
  const [speechRate, setSpeechRate] = useState<number>(0.9); // 0.9 normal, 0.6 turtle

  // Microphone recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoMicEnabled, setAutoMicEnabled] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [sentenceScores, setSentenceScores] = useState<Record<string, number>>({});
  const [showPodiumApplause, setShowPodiumApplause] = useState<boolean>(false);
  const [isCompletedForUnit, setIsCompletedForUnit] = useState<boolean>(false);

  const activePassage: UnitReadingPassage = 
    UNIT_READING_PASSAGES.find(p => p.unitId === selectedUnitId) || UNIT_READING_PASSAGES[0];

  const currentSentence: ReadingSentence = 
    activePassage.sentences[selectedSentenceIndex] || activePassage.sentences[0];

  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Stop speech when changing unit or closing
  useEffect(() => {
    setSelectedSentenceIndex(0);
    setSpokenTranscript('');
    setPronunciationScore(null);
    setFeedbackMessage('');
    setIsPlayingFullText(false);
    setCurrentPlayingSentenceId(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const alreadyDone = userStats.completedReadingUnitIds?.includes(selectedUnitId);
    setIsCompletedForUnit(!!alreadyDone);
  }, [selectedUnitId, userStats.completedReadingUnitIds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-activate microphone when autoMicEnabled is true on sentence change
  useEffect(() => {
    if (autoMicEnabled && activeMode === 'charisma_studio') {
      const timer = setTimeout(() => {
        handleDeliverSentenceWithMic();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [selectedSentenceIndex, autoMicEnabled, activeMode]);

  // Play single sentence
  const handlePlaySentence = (sentence: ReadingSentence, rateOverride?: number) => {
    playSound.click();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentPlayingSentenceId(sentence.id);
    speakEnglish(sentence.textEn, rateOverride || speechRate, preferredPersona).then(() => {
      setCurrentPlayingSentenceId(null);
    });
  };

  // Play full passage continuously
  const handleTogglePlayFull = async () => {
    if (isPlayingFullText) {
      setIsPlayingFullText(false);
      isPlayingRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setCurrentPlayingSentenceId(null);
      return;
    }

    playSound.click();
    setIsPlayingFullText(true);
    isPlayingRef.current = true;

    for (let i = 0; i < activePassage.sentences.length; i++) {
      if (!isPlayingRef.current) break;
      const s = activePassage.sentences[i];
      setSelectedSentenceIndex(i);
      setCurrentPlayingSentenceId(s.id);
      await speakEnglish(s.textEn, speechRate, preferredPersona);
      // Small natural pause between sentences
      await new Promise(r => setTimeout(r, 400));
    }

    setIsPlayingFullText(false);
    isPlayingRef.current = false;
    setCurrentPlayingSentenceId(null);
  };

  // Microphone recording & pronunciation analysis
  const handleStartMic = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    playSound.click();
    setIsRecording(true);
    setSpokenTranscript('');
    setPronunciationScore(null);
    setFeedbackMessage('استمع إليك الآن... تحدث بصوت واثق ومخارج واضحة! 🎙️');

    recognitionRef.current = startSpeechRecognition(
      currentSentence.textEn,
      (result) => {
        setIsRecording(false);
        setSpokenTranscript(result.transcript);
        setPronunciationScore(result.score);

        // Record sentence score
        setSentenceScores(prev => ({
          ...prev,
          [currentSentence.id]: Math.max(prev[currentSentence.id] || 0, result.score),
        }));

        if (result.score >= 80) {
          playSound.correct();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
          });
          setFeedbackMessage('ما شاء الله! نطق متقن، مخارج حروف واضحة، وكاريزمة إلقاء متميزة! 🌟');
        } else if (result.score >= 60) {
          playSound.correct();
          setFeedbackMessage('إلقاء جيد جداً! حاول ضبط وقفات التنفس والضغط على الكلمات المفتاحية! 👍');
        } else {
          playSound.wrong();
          setFeedbackMessage('محاولة مشجعة! اضغط على السلحفاة 🐢 للاستماع البطيء ثم أعد التسجيل!');
        }
      },
      (err) => {
        setIsRecording(false);
        setFeedbackMessage(`تنبيه: ${err}`);
      }
    );
  };

  // Deliver sentence and immediately activate microphone
  const handleDeliverSentenceWithMic = (targetSentence?: ReadingSentence) => {
    const target = targetSentence || currentSentence;
    if (targetSentence && targetSentence.id !== currentSentence.id) {
      const idx = activePassage.sentences.findIndex(s => s.id === targetSentence.id);
      if (idx !== -1) {
        setSelectedSentenceIndex(idx);
      }
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    playSound.click();
    setIsRecording(true);
    setSpokenTranscript('');
    setPronunciationScore(null);
    setFeedbackMessage('🎙️ الميكروفون نشط الآن! ألقِ الجملة بثقة ووضوح...');

    recognitionRef.current = startSpeechRecognition(
      target.textEn,
      (result) => {
        setIsRecording(false);
        setSpokenTranscript(result.transcript);
        setPronunciationScore(result.score);

        setSentenceScores(prev => ({
          ...prev,
          [target.id]: Math.max(prev[target.id] || 0, result.score),
        }));

        if (result.score >= 80) {
          playSound.correct();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
          });
          setFeedbackMessage('ما شاء الله! نطق متقن، مخارج حروف واضحة، وكاريزمة إلقاء متميزة! 🌟');
        } else if (result.score >= 60) {
          playSound.correct();
          setFeedbackMessage('إلقاء جيد جداً! حاول ضبط وقفات التنفس والضغط على الكلمات المفتاحية! 👍');
        } else {
          playSound.wrong();
          setFeedbackMessage('محاولة مشجعة! اضغط على السلحفاة 🐢 للاستماع البطيء ثم أعد التسجيل!');
        }
      },
      (err) => {
        setIsRecording(false);
        setFeedbackMessage(`تنبيه: ${err}`);
      }
    );
  };

  // Finish unit training and claim reward
  const handleFinishTraining = () => {
    playSound.fanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });
    setShowPodiumApplause(true);
    setIsCompletedForUnit(true);
    onAwardReadingXp(activePassage.unitId, 35, 10);
  };

  // Calculate overall Charisma & Elocution readiness score
  const totalSentences = activePassage.sentences.length;
  const scoredCount = Object.keys(sentenceScores).filter(k => 
    activePassage.sentences.some(s => s.id === k && sentenceScores[k] >= 60)
  ).length;
  const overallProgressPct = Math.min(100, Math.round((scoredCount / totalSentences) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 md:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-slate-200 overflow-hidden flex flex-col h-full sm:h-auto max-h-[98vh] sm:max-h-[94vh]">
        {/* MODAL HEADER WITH RETURN OUTLET */}
        <div 
          className="p-3 sm:p-4 md:p-5 text-white flex items-center justify-between relative overflow-hidden transition-all duration-300 shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${activePassage.themeColor} 0%, #1E293B 100%)` 
          }}
        >
          <div className="flex items-center gap-2.5 sm:gap-4 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl sm:text-3xl shadow-md border border-white/30 shrink-0">
              {activePassage.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="bg-yellow-300 text-slate-950 font-black text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
                  {activePassage.textbookPageRef}
                </span>
                <span className="bg-white/20 text-white font-english font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                  Unit {activePassage.unitNumber} Reading
                </span>
                {isCompletedForUnit && (
                  <span className="bg-emerald-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hidden xs:inline">تم تدريب الإلقاء ✓</span>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black mt-0.5 sm:mt-1 tracking-tight leading-tight">
                {activePassage.titleAr}
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 font-english font-semibold">
                "{activePassage.titleEn}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 shrink-0">
            {/* Mascot Voice Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/20">
              <button
                onClick={() => {
                  setPreferredPersona('nadjib_boy');
                  playSound.click();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  preferredPersona === 'nadjib_boy' 
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs scale-102' 
                    : 'text-white/80 hover:text-white'
                }`}
                title="صوت التلميذ نجيب (ذكوري)"
              >
                <img src={nadjibImg} alt="نجيب" className="w-4 h-4 rounded-full object-cover" />
                <span>نجيب 👦🏻</span>
              </button>

              <button
                onClick={() => {
                  setPreferredPersona('rehab_girl');
                  playSound.click();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  preferredPersona === 'rehab_girl' 
                    ? 'bg-pink-400 text-slate-950 font-black shadow-xs scale-102' 
                    : 'text-white/80 hover:text-white'
                }`}
                title="صوت التلميذة رحاب (أنثوي)"
              >
                <img src={rehabImg} alt="رحاب" className="w-4 h-4 rounded-full object-cover" />
                <span>رحاب 👧🏻</span>
              </button>
            </div>

            {/* منفذ العودة للصفحة السابقة (Back button outlet) */}
            {onClose && (
              <button
                onClick={() => {
                  playSound.click();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs md:text-sm border border-white/30 transition-all shadow-xs shrink-0 cursor-pointer"
                title="الرجوع للصفحة السابقة"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                <span>العودة للمسار</span>
              </button>
            )}

            {onClose && (
              <button
                onClick={() => {
                  playSound.click();
                  onClose();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 9-UNITS CAROUSEL SELECTOR */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-xs font-black text-slate-600 px-2 shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>نصوص الوحدات:</span>
          </span>
          {UNIT_READING_PASSAGES.map((u) => {
            const isSelected = u.unitId === selectedUnitId;
            const isDone = userStats.completedReadingUnitIds?.includes(u.unitId);

            return (
              <button
                key={u.unitId}
                onClick={() => {
                  playSound.click();
                  setSelectedUnitId(u.unitId);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 shrink-0 ${
                  isSelected
                    ? 'bg-white text-slate-900 border-blue-500 shadow-sm scale-102'
                    : 'bg-white/60 text-slate-600 border-transparent hover:bg-white hover:text-slate-800'
                }`}
              >
                <span className="text-sm">{u.icon}</span>
                <span>وحدة {u.unitNumber}</span>
                {isDone && <span className="text-emerald-600 text-xs">✓</span>}
              </button>
            );
          })}
        </div>

        {/* MODE TABS (Read-Along / Charisma Studio / Stage Podium) */}
        <div className="bg-white px-4 md:px-6 pt-3 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound.click();
                setActiveMode('charisma_studio');
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-3 font-black text-xs md:text-sm transition-all ${
                activeMode === 'charisma_studio'
                  ? 'border-amber-500 text-amber-700 bg-amber-50/60 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mic className="w-4 h-4 text-amber-500" />
              <span>أستوديو كاريزمة الإلقاء والنطق 🎙️</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveMode('read_along');
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-3 font-black text-xs md:text-sm transition-all ${
                activeMode === 'read_along'
                  ? 'border-blue-500 text-blue-700 bg-blue-50/60 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span>القراءة التفاعلية والاستماع الكامل 📖</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveMode('stage_podium');
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-3 font-black text-xs md:text-sm transition-all ${
                activeMode === 'stage_podium'
                  ? 'border-purple-500 text-purple-700 bg-purple-50/60 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-purple-500" />
              <span>منبر الخطابة والإلقاء المسرحي 🎭</span>
            </button>
          </div>

          {/* Charisma & Pronunciation Meter */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500">جاهزية الإلقاء:</span>
            <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${overallProgressPct}%` }}
              />
            </div>
            <span className="text-xs font-english font-black text-slate-700">{overallProgressPct}%</span>
          </div>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* ================= MODE 1: CHARISMA STUDIO (Step-by-step) ================= */}
          {activeMode === 'charisma_studio' && (
            <div className="space-y-6">
              {/* Sentence Progress Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-slate-500">الجملة:</span>
                  <div className="flex items-center gap-1.5">
                    {activePassage.sentences.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          playSound.click();
                          setSelectedSentenceIndex(idx);
                          setSpokenTranscript('');
                          setPronunciationScore(null);
                          setFeedbackMessage('');
                        }}
                        className={`w-7 h-7 rounded-xl font-english font-bold text-xs flex items-center justify-center transition-all ${
                          idx === selectedSentenceIndex
                            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300 scale-110'
                            : sentenceScores[s.id]
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sentenceScores[s.id] ? '✓' : idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Auto-mic toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors select-none shadow-2xs">
                    <input 
                      type="checkbox" 
                      checked={autoMicEnabled} 
                      onChange={(e) => {
                        setAutoMicEnabled(e.target.checked);
                        if (e.target.checked) {
                          handleDeliverSentenceWithMic();
                        }
                      }} 
                      className="accent-emerald-600 rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span>🎙️ تفعيل الميكروفون تلقائياً عند الإلقاء</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (selectedSentenceIndex > 0) {
                          playSound.click();
                          setSelectedSentenceIndex(prev => prev - 1);
                        }
                      }}
                      disabled={selectedSentenceIndex === 0}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                      title="الجملة السابقة"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSentenceIndex < activePassage.sentences.length - 1) {
                          playSound.click();
                          setSelectedSentenceIndex(prev => prev + 1);
                        }
                      }}
                      disabled={selectedSentenceIndex === activePassage.sentences.length - 1}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                      title="الجملة التالية"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTIVE SENTENCE PRESENTATION CARD */}
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4 sm:space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-english font-black flex items-center justify-center text-xs">
                      #{selectedSentenceIndex + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-500">
                      المتحدث: <strong className="text-slate-800">{currentSentence.speakerName || 'التلميذ'}</strong>
                    </span>
                  </div>

                  {currentSentence.phonicsFocus && (
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-sky-600" />
                      <span>{currentSentence.phonicsFocus}</span>
                    </span>
                  )}
                </div>

                {/* English Text Box */}
                <div className="text-center py-2 sm:py-4 space-y-2 sm:space-y-3">
                  <p className="font-english font-black text-xl sm:text-2xl md:text-3xl text-slate-900 leading-snug tracking-wide">
                    "{currentSentence.textEn}"
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base md:text-lg font-bold">
                    {currentSentence.textAr}
                  </p>
                </div>

                {/* Charisma & Elocution Guidance Box */}
                {currentSentence.charismaNoteAr && (
                  <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs">
                      🎭
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-amber-900 flex items-center gap-1.5">
                        <span>سر كاريزمة الإلقاء لهذه الجملة:</span>
                      </h4>
                      <p className="text-xs md:text-sm text-amber-950 font-bold mt-1 leading-relaxed">
                        {currentSentence.charismaNoteAr}
                      </p>
                    </div>
                  </div>
                )}

                {/* AUDIO & MIC ACTION BUTTONS */}
                <div className="pt-2 space-y-3">
                  {/* Primary Glowing Mic Delivery Button */}
                  <button
                    onClick={() => handleDeliverSentenceWithMic()}
                    className={`w-full p-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300 scale-101'
                        : 'btn-duo-green text-white hover:scale-101'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
                    <span>
                      {isRecording 
                        ? 'جاري الاستماع لإلقائك الآن... اضغط لإنهاء التسجيل والتقييم 🎙️' 
                        : 'ألقِ هذه الجملة الآن بالميكروفون (تفعيل مباشر مع التقييم) 🎙️'}
                    </span>
                  </button>

                  {/* Audio Listen Buttons (Normal & Turtle Slow) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handlePlaySentence(currentSentence, 0.9)}
                      className="p-3 rounded-xl btn-duo-blue text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>استمع بالنطق السليم (طبيعي)</span>
                    </button>

                    <button
                      onClick={() => handlePlaySentence(currentSentence, 0.6)}
                      className="p-3 rounded-xl bg-white border-2 border-sky-300 text-sky-700 hover:bg-sky-50 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="text-base">🐢</span>
                      <span>استماع بطيء ومخارج نقية</span>
                    </button>
                  </div>
                </div>

                {/* Live Mic Feedback & Charisma Score Box */}
                {(isRecording || feedbackMessage) && (
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    pronunciationScore && pronunciationScore >= 80
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : pronunciationScore && pronunciationScore < 60
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>تقييم النطق وكاريزمة الصوت:</span>
                      </span>
                      {pronunciationScore !== null && (
                        <span className="font-english font-black text-sm px-2.5 py-0.5 rounded-full bg-white shadow-xs">
                          {pronunciationScore}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm font-bold mt-1">
                      {feedbackMessage}
                    </p>

                    {spokenTranscript && (
                      <p className="text-xs text-slate-600 mt-2 bg-white/70 p-2 rounded-xl font-english">
                        ما تم التقاطه: "{spokenTranscript}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 4 GENERAL CHARISMA TIPS OF THE UNIT */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>قواعد الإلقاء المسرحي والخطابة لهذه الوحدة (Charisma Rules)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activePassage.charismaTips.map((tip, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                        {tip.icon}
                      </div>
                      <div>
                        <h5 className="font-black text-xs text-slate-900">{tip.titleAr}</h5>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{tip.tipAr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM NAVIGATION & FINISH BUTTON */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    if (selectedSentenceIndex < activePassage.sentences.length - 1) {
                      playSound.click();
                      setSelectedSentenceIndex(prev => prev + 1);
                    }
                  }}
                  disabled={selectedSentenceIndex >= activePassage.sentences.length - 1}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  الجملة التالية ➔
                </button>

                <button
                  onClick={handleFinishTraining}
                  className="btn-duo-yellow text-slate-950 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md hover:scale-102 transition-all"
                >
                  <Award className="w-5 h-5 text-amber-800" />
                  <span>إتمام تدريب الوحدة واستلام (+35 XP و +10 💎) 🎉</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE 2: READ-ALONG (Continuous Full Passage) ================= */}
          {activeMode === 'read_along' && (
            <div className="space-y-6">
              {/* Audio Controls Bar */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlayFull}
                    className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-sm transition-all ${
                      isPlayingFullText
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'btn-duo-green text-white'
                    }`}
                  >
                    {isPlayingFullText ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isPlayingFullText ? 'إيقاف القراءة مؤقتاً' : 'استمع للنص كاملاً بالصوت المتقن'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound.click();
                      setSpeechRate(prev => (prev === 0.9 ? 0.6 : 0.9));
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                      speechRate === 0.6 
                        ? 'bg-sky-100 border-sky-400 text-sky-800' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🐢 بطيء (0.6x)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>الصوت المعتمد:</span>
                  <span className="font-english font-black text-blue-600">
                    {preferredPersona === 'nadjib_boy' ? 'Nadjib (Boy Pupil)' : 'Rehab (Girl Mascot)'}
                  </span>
                </div>
              </div>

              {/* Full Text Interactive Cards */}
              <div className="space-y-3">
                {activePassage.sentences.map((sentence, idx) => {
                  const isCurrent = currentPlayingSentenceId === sentence.id;

                  return (
                    <div
                      key={sentence.id}
                      onClick={() => handlePlaySentence(sentence)}
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isCurrent
                          ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-200 scale-101'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-8 h-8 rounded-xl font-english font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isCurrent ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>

                        <div className="space-y-1">
                          <p className={`font-english text-lg md:text-xl font-black ${
                            isCurrent ? 'text-amber-950' : 'text-slate-800'
                          }`}>
                            {sentence.textEn}
                          </p>
                          <p className="text-xs md:text-sm text-slate-500 font-bold">
                            {sentence.textAr}
                          </p>
                          {sentence.charismaNoteAr && (
                            <span className="text-[11px] text-amber-800 font-bold block pt-1">
                              💡 نبرة الإلقاء: {sentence.charismaNoteAr}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySentence(sentence);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                        }`}
                        title="استمع لهذه الجملة فقط"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= MODE 3: STAGE & PODIUM (Orator Teleprompter) ================= */}
          {activeMode === 'stage_podium' && (
            <div className="space-y-6">
              {/* Podium Visual Banner */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white text-center shadow-xl border-4 border-amber-400 relative overflow-hidden">
                <div className="absolute top-2 left-4 text-xs font-black text-amber-300 font-english uppercase tracking-widest">
                  🎙️ The Young Algerian Orator Stage
                </div>

                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-300/40 mb-3 animate-pulse">
                  🎤
                </div>

                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-yellow-300">
                  منبر خطيب الصف المتميز!
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                  قف مستقيماً، انظر بثقة في عيون زملائك ومعلمك، وألقِ النص كاملاً بلغة إنجليزية متقنة وكاريزمة تأسر الحضور!
                </p>

                {/* Teleprompter Scroll Box */}
                <div className="my-6 p-6 rounded-2xl bg-black/40 border border-white/20 text-right backdrop-blur-md max-w-2xl mx-auto space-y-4">
                  <p className="font-english text-xl md:text-2xl font-black text-white leading-loose tracking-wide text-center">
                    "{activePassage.fullTextEn}"
                  </p>
                  <div className="h-px bg-white/20 my-2" />
                  <p className="text-sm md:text-base text-yellow-200 font-bold leading-relaxed text-center">
                    {activePassage.fullTextAr}
                  </p>
                </div>

                {/* Podium Stage Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleDeliverSentenceWithMic()}
                    className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300'
                        : 'btn-duo-green text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span>{isRecording ? 'جاري الاستماع لإلقائك على المنصة... 🎙️' : '🎙️ ألقِ الخطاب بالميكروفون على المنصة'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound.fanfare();
                      confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.5 },
                      });
                      setShowPodiumApplause(true);
                    }}
                    className="btn-duo-yellow text-slate-950 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>👏 تصفيق الجمهور وهتاف الفصل!</span>
                  </button>

                  <button
                    onClick={handleTogglePlayFull}
                    className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>مرافقة صوتية نموذجية</span>
                  </button>
                </div>

                {showPodiumApplause && (
                  <div className="mt-4 p-3 bg-yellow-400 text-slate-950 rounded-2xl font-black text-xs animate-bounce max-w-md mx-auto">
                    🎉 أحسنت صنعاً يا بطل الإلقاء! لقد أبهرت الفصل بكاريزمتك وشجاعتك! 🌟
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <span>الهدف الصوتي للوحدة:</span>
            <span className="text-slate-800 font-black">{activePassage.keyPhonicsTarget}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-amber-700 font-black">مكافأة الإلقاء: +35 XP و +10 💎</span>
            {onClose && (
              <button
                onClick={() => {
                  playSound.click();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black transition-all"
              >
                إغلاق النافذة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
