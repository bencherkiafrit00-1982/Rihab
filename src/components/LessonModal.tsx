import React, { useState, useEffect } from 'react';
import { Lesson, Unit, Exercise, UserStats } from '../types';
import { 
  X, Heart, Volume2, Turtle, CheckCircle2, 
  XCircle, Mic, MicOff, Sparkles, ArrowRight, 
  HelpCircle, RotateCcw, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/soundEffects';
import { speakEnglish, startSpeechRecognition } from '../utils/speech';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface LessonModalProps {
  lesson: Lesson;
  unit: Unit;
  userStats: UserStats;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number, earnedGems: number, accuracy: number) => void;
  onDeductHeart: () => void;
  onRecordMistake?: (wordOrPhrase: string, arabicTranslation?: string, unitNumber?: number) => void;
  currentMascot?: 'nadjib' | 'rehab';
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  unit,
  userStats,
  onClose,
  onCompleteLesson,
  onDeductHeart,
  onRecordMistake,
  currentMascot = 'nadjib',
}) => {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  
  // Evaluation state
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  // Mic state for speaking exercises
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);

  // Lesson finished state
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise: Exercise = lesson.exercises[currentExIndex];
  const progressPercent = Math.round((currentExIndex / lesson.exercises.length) * 100);

  // Initialize exercise state
  useEffect(() => {
    setSelectedAnswer(null);
    setIsEvaluated(false);
    setIsCorrect(false);
    setMicError(null);
    setRecognizedText('');

    if (currentExercise.type === 'word_reorder') {
      const words = currentExercise.scrambledWords || [];
      // clone and shuffle
      setAvailableWords([...words]);
      setReorderedWords([]);
    }

    // Auto-speak English prompt if listening or multiple choice with audio
    if (currentExercise.audioPrompt) {
      const timer = setTimeout(() => {
        const persona = currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl';
        speakEnglish(currentExercise.audioPrompt!, 0.9, persona);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentExIndex, currentExercise]);

  const handleWordBankClick = (word: string, indexInAvailable: number) => {
    playSound.click();
    setReorderedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== indexInAvailable));
  };

  const handleRemoveFromSentence = (word: string, indexInSentence: number) => {
    playSound.click();
    setReorderedWords(prev => prev.filter((_, i) => i !== indexInSentence));
    setAvailableWords(prev => [...prev, word]);
  };

  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setMicError(null);
    setIsRecording(true);
    playSound.click();

    const targetPhrase = currentExercise.targetWordOrSentence || currentExercise.audioPrompt || '';
    const recognizer = startSpeechRecognition(
      targetPhrase,
      (res) => {
        setIsRecording(false);
        setRecognizedText(res.transcript);
        if (res.isCorrect) {
          setSelectedAnswer(res.transcript);
        } else {
          setSelectedAnswer(res.transcript);
        }
      },
      (err) => {
        setIsRecording(false);
        setMicError(err);
      }
    );

    // Timeout safety
    setTimeout(() => {
      recognizer.stop();
      setIsRecording(false);
    }, 6000);
  };

  const handleCheckAnswer = () => {
    let correct = false;

    if (currentExercise.type === 'word_reorder') {
      const targetSeq = Array.isArray(currentExercise.correctAnswer)
        ? currentExercise.correctAnswer
        : [currentExercise.correctAnswer];
      correct = JSON.stringify(reorderedWords) === JSON.stringify(targetSeq);
    } else if (currentExercise.type === 'pronounce_mic') {
      // In speaking mode, if recognized matches or user practiced
      const target = (currentExercise.targetWordOrSentence || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const spoken = (recognizedText || selectedAnswer || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      correct = spoken.includes(target) || target.includes(spoken) || spoken.length > 3;
    } else {
      correct = selectedAnswer === currentExercise.correctAnswer;
    }

    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      playSound.correct();
      setTotalCorrect(prev => prev + 1);
      setCorrectStreak(prev => prev + 1);
    } else {
      playSound.wrong();
      setCorrectStreak(0);
      onDeductHeart();

      if (onRecordMistake) {
        const target = currentExercise.targetWordOrSentence || currentExercise.audioPrompt || '';
        if (target) {
          onRecordMistake(target, currentExercise.promptAr, unit.unitNumber);
        }
      }
    }
  };

  const handleNextExercise = () => {
    playSound.click();
    if (currentExIndex + 1 < lesson.exercises.length) {
      setCurrentExIndex(prev => prev + 1);
    } else {
      // Complete Lesson!
      setIsFinished(true);
      playSound.fanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const accuracy = Math.round(((totalCorrect + (isCorrect ? 1 : 0)) / lesson.exercises.length) * 100);
      onCompleteLesson(lesson.id, lesson.xpReward, lesson.gemReward, accuracy);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-4 border-slate-200">
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/80">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            title="خروج من الدرس"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Duolingo Progress Bar */}
          <div className="flex-1 mx-2">
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="bg-[#58CC02] h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Hearts Indicator */}
          <div className="flex items-center gap-1 text-rose-500 font-black font-english text-sm px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>{userStats.hearts}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 md:p-6 pb-6">
          {!isFinished ? (
            <div className="space-y-5">
              {/* Skill & Lesson Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span>{lesson.icon}</span>
                  <span>{lesson.titleAr}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400 font-english uppercase tracking-wider">
                  Question {currentExIndex + 1} of {lesson.exercises.length}
                </span>
              </div>

              {/* Prompts in Arabic and English */}
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-black text-slate-800">
                  {currentExercise.promptAr}
                </h3>
                <p className="text-xs md:text-sm font-english text-slate-500 font-semibold">
                  {currentExercise.promptEn}
                </p>
              </div>

              {/* Audio Listen Buttons (Normal + Slow Turtle) */}
              {currentExercise.audioPrompt && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-200">
                  <button
                    onClick={() => {
                      playSound.click();
                      const persona = currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl';
                      speakEnglish(currentExercise.audioPrompt!, 0.9, persona);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl btn-duo-blue text-white font-bold text-xs"
                    title="استمع بالنطق الإنجليزي السليم"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound.click();
                      const persona = currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl';
                      speakEnglish(currentExercise.audioPrompt!, 0.6, persona);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-sky-300 text-sky-700 font-bold text-xs hover:bg-sky-100"
                    title="استماع بطيء على طريقة السلحفاة 🐢"
                  >
                    <Turtle className="w-4 h-4 text-emerald-600" />
                    <span>بطيء 🐢</span>
                  </button>

                  <span className="text-xs font-english text-sky-900 font-semibold truncate flex-1">
                    "{currentExercise.audioPrompt}"
                  </span>
                </div>
              )}

              {/* Mascot Helpful Tip */}
              {currentExercise.mascotTip && (
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-300 shadow-xs">
                    <img 
                      src={currentMascot === 'nadjib' ? nadjibImg : rehabImg} 
                      alt="نصيحة" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="font-bold">نصيحة {currentMascot === 'nadjib' ? 'نجيب' : 'رحاب'}: </span>
                    <span>{currentExercise.mascotTip}</span>
                  </div>
                </div>
              )}

              {/* EXERCISE CONTENT AREA */}
              
              {/* MODE 1: Multiple Choice or Listen & Choose or Sound Match */}
              {(currentExercise.type === 'multiple_choice' || 
                currentExercise.type === 'listen_and_choose' || 
                currentExercise.type === 'sound_match' ||
                currentExercise.type === 'fill_blank') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentExercise.options?.map((opt) => {
                    const isSelected = selectedAnswer === opt.id || selectedAnswer === opt.text;
                    return (
                      <button
                        key={opt.id}
                        disabled={isEvaluated}
                        onClick={() => {
                          playSound.click();
                          setSelectedAnswer(opt.id);
                          if (opt.text) {
                            speakEnglish(opt.text, 0.9);
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-300 shadow-md scale-101'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                          <div>
                            <div className="font-english font-black text-slate-800 text-base">
                              {opt.text}
                            </div>
                            {opt.arabicTranslation && (
                              <div className="text-xs text-slate-500 font-medium">
                                {opt.arabicTranslation}
                              </div>
                            )}
                            {opt.phoneticNote && (
                              <div className="text-[11px] font-english text-purple-600 font-bold">
                                {opt.phoneticNote}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <span className="text-xs font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: Word Reorder (Sentence Builder / Duolingo style) */}
              {currentExercise.type === 'word_reorder' && (
                <div className="space-y-6 pt-2">
                  {/* Slots / Target Sentence Area */}
                  <div className="min-h-[70px] p-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 flex flex-wrap gap-2 items-center">
                    {reorderedWords.length === 0 ? (
                      <span className="text-xs text-slate-400 font-bold px-2">
                        اضغط على الكلمات بالترتيب الصحيح لتكوين الجملة...
                      </span>
                    ) : (
                      reorderedWords.map((word, idx) => (
                        <button
                          key={idx}
                          disabled={isEvaluated}
                          onClick={() => handleRemoveFromSentence(word, idx)}
                          className="px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-800 font-english font-bold text-sm shadow-xs hover:border-rose-400 hover:text-rose-600 transition-all"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Word Bank */}
                  <div className="flex flex-wrap gap-2.5 justify-center p-3 rounded-2xl bg-slate-100 border border-slate-200">
                    {availableWords.map((word, idx) => (
                      <button
                        key={idx}
                        disabled={isEvaluated}
                        onClick={() => handleWordBankClick(word, idx)}
                        className="px-4 py-2.5 rounded-xl btn-duo-neutral border-2 border-slate-300 text-slate-800 font-english font-black text-sm shadow-xs hover:border-emerald-400 transition-all active:scale-95"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE 3: Pronounce & Mic (Speaking) */}
              {currentExercise.type === 'pronounce_mic' && (
                <div className="text-center py-6 space-y-4">
                  <div className="p-4 rounded-3xl bg-purple-50 border-2 border-purple-200 inline-block max-w-sm">
                    <p className="text-xs text-purple-600 font-bold mb-1">العبارة المطلوب نطقها:</p>
                    <p className="text-xl md:text-2xl font-black font-english text-purple-900">
                      "{currentExercise.targetWordOrSentence}"
                    </p>
                  </div>

                  {/* Mic Button */}
                  <div>
                    <button
                      disabled={isEvaluated}
                      onClick={handleToggleMic}
                      className={`w-24 h-24 rounded-full mx-auto flex flex-col items-center justify-center transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                          : 'btn-duo-purple text-white shadow-xl hover:scale-105'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                      <span className="text-[11px] font-bold mt-1">
                        {isRecording ? 'استماع...' : 'تحدث الآن'}
                      </span>
                    </button>
                  </div>

                  {/* Live Feedback / Transcript */}
                  {recognizedText && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto">
                      <p className="text-xs text-emerald-800 font-bold">سمعنا نطقك كالتالي:</p>
                      <p className="font-english font-bold text-slate-800 text-base">"{recognizedText}"</p>
                    </div>
                  )}

                  {micError && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-xs text-amber-800">
                      {micError}
                      <p className="mt-1 font-bold">يمكنك الضغط على زر التحقق للاستمرار!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* LESSON COMPLETED CELEBRATION SCREEN */
            <div className="text-center py-6 px-4 space-y-5">
              <div className="relative inline-block mx-auto">
                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 ring-4 ring-amber-100 animate-duo-bounce">
                  <img 
                    src={currentMascot === 'nadjib' ? nadjibImg : rehabImg} 
                    alt="احتفال" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white animate-pulse">
                  🏆
                </div>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  درس مكتمل بنجاح باهر!
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  تهانينا يا بطل 4PS!
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {currentMascot === 'nadjib' ? 'نجيب' : 'رحاب'} فخور جداً بإنجازك في درس "{lesson.titleAr}"!
                </p>
              </div>

              {/* Reward stats cards */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center">
                  <span className="text-amber-600 font-english font-black text-lg">+{lesson.xpReward}</span>
                  <div className="text-[11px] text-amber-800 font-bold">نقاط XP</div>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-300 text-center">
                  <span className="text-sky-600 font-english font-black text-lg">+{lesson.gemReward}</span>
                  <div className="text-[11px] text-sky-800 font-bold">جواهر 💎</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center">
                  <span className="text-emerald-600 font-english font-black text-lg">100%</span>
                  <div className="text-[11px] text-emerald-800 font-bold">دقة الإجابة</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full max-w-xs btn-duo-green text-white py-3.5 rounded-2xl font-black text-base shadow-lg hover:brightness-105"
                >
                  العودة إلى مسار التعلم 🚀
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STICKY DUOLINGO EVALUATION DRAWER */}
        {!isFinished && (
          <div className={`p-4 border-t-2 transition-all ${
            isEvaluated
              ? isCorrect
                ? 'bg-[#D7FFB8] border-[#A5ED6E]'
                : 'bg-[#FFDFE0] border-[#FF9999]'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Feedback text */}
              {isEvaluated && (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-[#58CC02] shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-[#FF4B4B] shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-black text-base ${isCorrect ? 'text-[#2E7A00]' : 'text-[#EA2B2B]'}`}>
                      {isCorrect ? 'أحسنت يا بطل! إجابة صحيحة ممتاز! 🌟' : 'إجابة غير صحيحة، لا تقلق وتعلّم منها!'}
                    </h4>
                    {currentExercise.explanation && (
                      <p className="text-xs text-slate-700 mt-0.5 max-w-md">
                        {currentExercise.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button: Check or Continue */}
              <div className="w-full sm:w-auto flex justify-end">
                {!isEvaluated ? (
                  <button
                    disabled={
                      currentExercise.type === 'word_reorder' 
                        ? reorderedWords.length === 0 
                        : currentExercise.type === 'pronounce_mic'
                        ? false
                        : !selectedAnswer
                    }
                    onClick={handleCheckAnswer}
                    className={`w-full sm:w-44 py-3 rounded-2xl font-black text-base shadow-md transition-all ${
                      (currentExercise.type === 'word_reorder' && reorderedWords.length > 0) ||
                      (currentExercise.type === 'pronounce_mic') ||
                      selectedAnswer
                        ? 'btn-duo-green text-white hover:brightness-105'
                        : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    تَحَقَّقْ / Check
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className={`w-full sm:w-44 py-3 rounded-2xl font-black text-base text-white shadow-md transition-all ${
                      isCorrect ? 'btn-duo-green' : 'btn-duo-red'
                    }`}
                  >
                    وَاصِلْ / Continue ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
