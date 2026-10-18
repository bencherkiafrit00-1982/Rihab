import React, { useState } from 'react';
import { Volume2, Sparkles, X, MessageCircle, Heart, Star, Award, Mic } from 'lucide-react';
import { speakEnglish, SpeakerPersona } from '../utils/speech';
import { playSound } from '../utils/soundEffects';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface InteractiveMascotProps {
  currentMascot: 'nadjib' | 'rehab';
  onSwitchMascot: (mascot: 'nadjib' | 'rehab') => void;
  onRewardBonusXp: (xp: number) => void;
  studentName: string;
  hidden?: boolean;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  currentMascot,
  onSwitchMascot,
  onRewardBonusXp,
  studentName,
  hidden = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [hasReceivedGift, setHasReceivedGift] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  if (hidden) return null;

  // Authentic phrases from the 4PS Algerian textbook (Page 4, 14, 20, 62, 73, 95)
  const phrases = currentMascot === 'nadjib' ? [
    {
      en: "Hello! My name is Nadjib. I am Algerian and I am 9 years old. Happy to meet you!",
      ar: "مرحباً! اسمي نجيب. أنا جزائري وعمري 9 سنوات. سعيد بلقائك يا صديقي!",
      page: "صفحة 4 من كتابك المدرسي",
      mood: "👋"
    },
    {
      en: "I live in Chlef. I love my family, my school, and I like English so much!",
      ar: "أسكن في الشلف. أحب عائلتي ومدرستي، وأحب اللغة الإنجليزية كثيراً!",
      page: "صفحة 95 من كتابك المدرسي",
      mood: "🇩🇿"
    },
    {
      en: "My mother prepares delicious couscous with vegetables and meat on Friday. It is healthy!",
      ar: "أمي تحضّر كسكسي لذيذ بالخضر واللحم يوم الجمعة. إنه طعام صحي ومغذٍ!",
      page: "صفحة 61 من كتابك المدرسي",
      mood: "🍲"
    },
    {
      en: "We are celebrating Martyr’s Day at school on February 18th. I love Algeria!",
      ar: "نحن نحتفل بيوم الشهيد في المدرسة يوم 18 فيفري. أنا أحب وطني الجزائر!",
      page: "صفحة 73 من كتابك المدرسي",
      mood: "🕊️"
    },
    {
      en: `Keep learning English every day, ${studentName}! You are doing a fantastic job!`,
      ar: `واصل تعلّم الإنجليزية كل يوم يا ${studentName}! أنت بطل رائع وذكي جداً!`,
      page: "نصيحة تشجيعية خاصة",
      mood: "⭐"
    }
  ] : [
    {
      en: `Hi ${studentName}! I am Rehab, your study buddy! Let’s win all the gems together!`,
      ar: `أهلاً يا ${studentName}! أنا رحاب، رفيقتك في المذاكرة! هيا نجمع كل التيجان والجواهر معاً!`,
      page: "رحلة رحاب لتعلم الإنجليزية",
      mood: "👧🏻"
    },
    {
      en: "Listen carefully to the sounds: Three has /θ/ sound, and Father has /ð/ sound!",
      ar: "استمع جيداً للصوتيات: كلمة Three بصوت الثاء /θ/، وكلمة Father بصوت الذال /ð/!",
      page: "صفحة 11 و 17 (Phonics)",
      mood: "🎧"
    },
    {
      en: "Remember: We say 'Good morning' in the morning and 'Good night' before sleeping!",
      ar: "تذكّر: نقول Good morning في الصباح، ونقول Good night قبل الذهاب للنوم!",
      page: "صفحة 6 (Greetings)",
      mood: "🌅"
    }
  ];

  const currentPhrase = phrases[activePhraseIndex % phrases.length];
  const mascotImgSrc = currentMascot === 'nadjib' ? nadjibImg : rehabImg;
  const mascotNameAr = currentMascot === 'nadjib' ? 'نجيب (Nadjib)' : 'رحاب (Rehab)';
  const currentPersona: SpeakerPersona = currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl';

  const handleOpen = () => {
    playSound.click();
    setIsOpen(true);
    setShowSpeechBubble(false);
    speakEnglish(currentPhrase.en, 0.9, currentPersona);
  };

  const handleSpeakPhrase = (text: string) => {
    playSound.click();
    speakEnglish(text, 0.9, currentPersona);
  };

  const handleNextPhrase = () => {
    playSound.click();
    const nextIdx = (activePhraseIndex + 1) % phrases.length;
    setActivePhraseIndex(nextIdx);
    speakEnglish(phrases[nextIdx].en, 0.9, currentPersona);
  };

  const handleClaimBonus = () => {
    if (!hasReceivedGift) {
      playSound.gem();
      setHasReceivedGift(true);
      onRewardBonusXp(10);
    }
  };

  return (
    <>
      {/* FLOATING INTERACTIVE MASCOT BUTTON */}
      <div className="fixed bottom-5 left-5 z-40 flex items-end gap-2 select-none">
        {/* Floating Speech Bubble Callout */}
        {showSpeechBubble && (
          <div 
            onClick={handleOpen}
            className="cursor-pointer bg-white text-slate-800 p-2.5 px-3.5 rounded-2xl rounded-bl-xs shadow-xl border-2 border-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce max-w-[200px]"
          >
            <span>✨</span>
            <span className="leading-tight">
              اضغط على {currentMascot === 'nadjib' ? 'نجيب' : 'رحاب'} للتحدث بالإنجليزية!
            </span>
          </div>
        )}

        {/* Mascot Avatar Icon Button */}
        <button
          onClick={handleOpen}
          className="group relative w-16 h-16 md:w-18 md:h-18 rounded-3xl bg-white p-1 shadow-2xl border-4 border-emerald-500 hover:border-emerald-400 hover:scale-108 active:scale-95 transition-all flex items-center justify-center overflow-hidden ring-4 ring-emerald-200"
          title={`اضغط للتحدث مع ${mascotNameAr}`}
        >
          <img 
            src={mascotImgSrc} 
            alt={mascotNameAr} 
            className="w-full h-full object-cover rounded-2xl group-hover:rotate-3 transition-transform"
          />

          {/* Online / Active Pulse indicator */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      </div>

      {/* INTERACTIVE MASCOT MODAL / DIALOGUE POPUP */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 md:p-6 shadow-2xl border-4 border-emerald-400 relative text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">
            
            {/* Close button */}
            <button
              onClick={() => {
                playSound.click();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot Toggle (Nadjib / Rehab) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
              <button
                onClick={() => {
                  playSound.click();
                  onSwitchMascot('nadjib');
                  setActivePhraseIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  currentMascot === 'nadjib'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>👦🏻</span>
                <span>نجيب (بطل الكتاب)</span>
              </button>
              <button
                onClick={() => {
                  playSound.click();
                  onSwitchMascot('rehab');
                  setActivePhraseIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  currentMascot === 'rehab'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>👧🏻</span>
                <span>رحاب (الرفيقة الذكية)</span>
              </button>
            </div>

            {/* Mascot Large Illustrated Avatar */}
            <div className="relative mb-3">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-xl ring-4 ring-emerald-100">
                <img 
                  src={mascotImgSrc} 
                  alt={mascotNameAr} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md border-2 border-white">
                {currentPhrase.mood} 4PS
              </div>
            </div>

            {/* Name and Tag */}
            <div className="mb-3">
              <h3 className="text-xl font-black text-slate-800">
                {mascotNameAr}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                {currentPhrase.page}
              </span>
            </div>

            {/* Interactive Speech Bubble */}
            <div className="w-full bg-gradient-to-tr from-emerald-50 to-teal-50 p-4 rounded-2xl border-2 border-emerald-200 text-right space-y-2 mb-4 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800">باللغة الإنجليزية:</span>
                <button
                  onClick={() => handleSpeakPhrase(currentPhrase.en)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors shadow-2xs"
                  title="استمع إلى نطق العبارة"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>نطق بالإنجليزية</span>
                </button>
              </div>

              <p className="font-english font-bold text-slate-900 text-sm md:text-base leading-relaxed text-left">
                "{currentPhrase.en}"
              </p>

              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">الترجمة بالعربية:</span>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {currentPhrase.ar}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextPhrase}
                  className="flex-1 btn-duo-green text-white py-2.5 px-4 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>عبارة أخرى من الكتاب 🔄</span>
                </button>

                <button
                  onClick={() => handleSpeakPhrase(currentPhrase.en)}
                  className="btn-duo-blue text-white py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>إعادة النطق</span>
                </button>
              </div>

              {/* Bonus XP Gift from Nadjib */}
              {!hasReceivedGift ? (
                <button
                  onClick={handleClaimBonus}
                  className="w-full py-2 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-800 font-black text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>خذ هدية تشجيعية من {currentMascot === 'nadjib' ? 'نجيب' : 'رحاب'}: +10 XP مجاناً! 🎁</span>
                </button>
              ) : (
                <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                  تم استلام الهدية بنجاح! أحسنت يا بطل! 🌟
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
