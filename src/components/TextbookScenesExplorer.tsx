import React, { useState } from 'react';
import { 
  TEXTBOOK_CHARACTERS, 
  ALGERIAN_CITIES, 
  TEXTBOOK_OBJECT_SCENES, 
  TextbookCharacter, 
  AlgerianCity, 
  TextbookObjectScene 
} from '../data/textbookScenesData';
import { speakEnglish } from '../utils/speech';
import { playSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Users, MapPin, Sparkles, Volume2, Search, 
  BookOpen, Star, Trophy, Award, CheckCircle2, 
  Compass, Flag, Layers, ArrowRight, Heart, Zap, HelpCircle
} from 'lucide-react';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

interface TextbookScenesExplorerProps {
  onAwardBonusXp?: (xp: number, gems: number) => void;
  currentMascot?: 'nadjib' | 'rehab';
  onSelectCharacterMascot?: (m: 'nadjib' | 'rehab') => void;
}

export const TextbookScenesExplorer: React.FC<TextbookScenesExplorerProps> = ({
  onAwardBonusXp,
  currentMascot = 'nadjib',
  onSelectCharacterMascot,
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'cities' | 'scenes' | 'quiz'>('characters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string>('city-algiers');
  const [selectedSceneId, setSelectedSceneId] = useState<string>('scene-u0-classroom');
  const [selectedCharId, setSelectedCharId] = useState<string>('char-nadjib');

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [selectedAnswerOpt, setSelectedAnswerOpt] = useState<string | null>(null);

  // Quick audio speak
  const handleSpeak = (text: string, persona?: 'nadjib_boy' | 'rehab_girl') => {
    playSound.click();
    speakEnglish(text, 0.88, persona || (currentMascot === 'nadjib' ? 'nadjib_boy' : 'rehab_girl'));
  };

  // 5 Iconic textbook questions
  const QUIZ_QUESTIONS = [
    {
      id: 'q1',
      questionAr: 'في أي مدينة جزائرية تنمو تمور دقلة نور الذهبية المذكورة في نصوص طعام الكتاب المدرسي (الوحدة 5)؟',
      questionEn: 'Where do sweet Deglet Nour dates grow in Algeria?',
      options: [
        { id: 'opt1', textAr: 'بسكرة (Biskra)', textEn: 'Biskra' },
        { id: 'opt2', textAr: 'وهران (Oran)', textEn: 'Oran' },
        { id: 'opt3', textAr: 'الجزائر العاصمة (Algiers)', textEn: 'Algiers' },
      ],
      correctId: 'opt1',
      factAr: 'بسكرة عروس الزيبان تشتهر بأجود تمور دقلة نور في العالم وتظهر في صفحة 54 من الكتاب.',
    },
    {
      id: 'q2',
      questionAr: 'ما اسم صغير الحصان بالإنجليزية كما ورد في رسومات وحدة الحيوانات (صفحة 82)؟',
      questionEn: 'What is a baby horse called in the textbook?',
      options: [
        { id: 'opt1', textAr: 'Foal (مُهْر)', textEn: 'Foal' },
        { id: 'opt2', textAr: 'Calf (عِجْل)', textEn: 'Calf' },
        { id: 'opt3', textAr: 'Chick (كَتْكُوت)', textEn: 'Chick' },
      ],
      correctId: 'opt1',
      factAr: 'صغير الحصان يسمى Foal، وصغير البقرة Calf، وصغير الدجاجة Chick.',
    },
    {
      id: 'q3',
      questionAr: 'ما هي المدينة الجزائرية الشهيرة بجسورها المعلقة فوق وادي الرمال (الوحدة 1 و 3)؟',
      questionEn: 'Which Algerian city is famous for its suspension bridges?',
      options: [
        { id: 'opt1', textAr: 'قسنطينة (Constantine)', textEn: 'Constantine' },
        { id: 'opt2', textAr: 'سطيف (Setif)', textEn: 'Setif' },
        { id: 'opt3', textAr: 'تلمسان (Tlemcen)', textEn: 'Tlemcen' },
      ],
      correctId: 'opt1',
      factAr: 'قسنطينة مدينة الجسور المعلقة مثل جسر سيدي مسيد المعلق العظيم.',
    },
    {
      id: 'q4',
      questionAr: 'ما هي الأداة التي يستعملها الطبيب لفحص نبضات القلب في رسومات المهن (صفحة 22)؟',
      questionEn: 'What tool does a doctor use to check heartbeats?',
      options: [
        { id: 'opt1', textAr: 'Stethoscope (سَمَّاعَةُ الطَّبِيب)', textEn: 'Stethoscope' },
        { id: 'opt2', textAr: 'Tractor (جَرَّار)', textEn: 'Tractor' },
        { id: 'opt3', textAr: 'Ruler (مِسْطَرَة)', textEn: 'Ruler' },
      ],
      correctId: 'opt1',
      factAr: 'سماعة الطبيب (Stethoscope) تظهر في القاموس المصور ورسومات العيادة الطبية.',
    },
    {
      id: 'q5',
      questionAr: 'ما هو الحيوان الصحراوي اللطيف ذو الأذنين الكبيرتين الذي يرمز لتميمة الكتاب؟',
      questionEn: 'Which desert animal with large ears is the textbook mascot?',
      options: [
        { id: 'opt1', textAr: 'Fennec Fox (الفَنَك الصَّحْرَاوِي)', textEn: 'Fennec fox' },
        { id: 'opt2', textAr: 'Camel (الجَمَل)', textEn: 'Camel' },
        { id: 'opt3', textAr: 'Sheep (الخَرُوف)', textEn: 'Sheep' },
      ],
      correctId: 'opt1',
      factAr: 'ثعلب الفنك ذو الأذنين الكبيرتين يرافق فقرات الاستماع والصوتيات (Phonics) في كل وحدة.',
    },
  ];

  const handleQuizAnswer = (optId: string) => {
    if (quizAnswered) return;
    setSelectedAnswerOpt(optId);
    setQuizAnswered(true);

    const isCorrect = optId === QUIZ_QUESTIONS[currentQuizIndex].correctId;
    if (isCorrect) {
      playSound.correct();
      setQuizScore(prev => prev + 1);
    } else {
      playSound.wrong();
    }
  };

  const handleNextQuiz = () => {
    playSound.click();
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
      setSelectedAnswerOpt(null);
    } else {
      setQuizCompleted(true);
      playSound.fanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onAwardBonusXp) {
        onAwardBonusXp(40, 15);
      }
    }
  };

  const handleResetQuiz = () => {
    playSound.click();
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setSelectedAnswerOpt(null);
    setQuizCompleted(false);
  };

  const activeChar = TEXTBOOK_CHARACTERS.find(c => c.id === selectedCharId) || TEXTBOOK_CHARACTERS[0];
  const activeCity = ALGERIAN_CITIES.find(c => c.id === selectedCityId) || ALGERIAN_CITIES[0];
  const activeScene = TEXTBOOK_OBJECT_SCENES.find(s => s.id === selectedSceneId) || TEXTBOOK_OBJECT_SCENES[0];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* HERO BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl border-b-4 border-emerald-800 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-yellow-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-red-600" />
                <span>كتاب الإنجليزية للسنة الرابعة ابتدائي 4PS 🇩🇿</span>
              </span>
              <span className="bg-black/20 text-white text-xs font-bold px-2.5 py-1 rounded-full font-english">
                Characters, Cities & Textbook Vault
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              عالم الكتاب المدرسي: الشخصيات، المدن ورسومات المشاهد 🎨
            </h2>

            <p className="text-emerald-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              تجسيد حي ودقيق لشخصيات الكتاب (نجيب، رحاب، ماسيل، مريم، ياسين)، والمدن والولايات الجزائرية الـ 12، ومئات الأشياء والأدوات المصورة في صفحات المنهاج من الوحدة 0 إلى 8!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 shrink-0 shadow-lg">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img 
                src={currentMascot === 'nadjib' ? nadjibImg : rehabImg} 
                alt="المساعد" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-yellow-200 block">مرشد الكتاب:</span>
              <p className="text-xs font-black text-white max-w-[140px] leading-snug mt-0.5">
                "كل مثال ورسمة هنا مقتبسة حرفياً من كتابك المدرسي!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            playSound.click();
            setActiveTab('characters');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all ${
            activeTab === 'characters'
              ? 'bg-blue-500 text-white shadow-md scale-102'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>شخصيات الكتاب المدرسي (Characters) 👦🏻👧🏻</span>
        </button>

        <button
          onClick={() => {
            playSound.click();
            setActiveTab('cities');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all ${
            activeTab === 'cities'
              ? 'bg-emerald-600 text-white shadow-md scale-102'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>المدن والولايات الجزائرية الـ 12 (Cities) 🇩🇿</span>
        </button>

        <button
          onClick={() => {
            playSound.click();
            setActiveTab('scenes');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all ${
            activeTab === 'scenes'
              ? 'bg-purple-600 text-white shadow-md scale-102'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>رسومات وأدوات المشاهد (Vault of Objects) 🎒</span>
        </button>

        <button
          onClick={() => {
            playSound.click();
            setActiveTab('quiz');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-700" />
          <span>تحدي مشاهد الكتاب (+40 XP) 🏆</span>
        </button>
      </div>

      {/* ================= TAB 1: CHARACTERS ================= */}
      {activeTab === 'characters' && (
        <div className="space-y-6">
          {/* Character Quick Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {TEXTBOOK_CHARACTERS.map(c => {
              const isSelected = c.id === selectedCharId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    playSound.click();
                    setSelectedCharId(c.id);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200 scale-105'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-3xl">{c.avatarEmoji}</span>
                  <span className="font-black text-xs text-slate-800 line-clamp-1">{c.nameAr}</span>
                  <span className="font-english font-bold text-[10px] text-slate-400">{c.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE CHARACTER SPOTLIGHT CARD */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 pb-6">
              <div 
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-5xl shadow-lg border-4 border-white shrink-0 relative"
                style={{ backgroundColor: activeChar.accentColor + '20' }}
              >
                {activeChar.avatarEmoji}
                {activeChar.age && (
                  <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-english font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
                    {activeChar.age} yo
                  </span>
                )}
              </div>

              <div className="space-y-2 text-center md:text-right flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="font-black text-2xl text-slate-900">{activeChar.nameAr}</span>
                  <span className="font-english font-black text-lg text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-xl">
                    {activeChar.nameEn}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-xl">
                    📍 {activeChar.hometown} ({activeChar.hometownEn})
                  </span>
                </div>

                <p className="text-xs md:text-sm font-black text-slate-700">
                  {activeChar.roleAr} • <span className="font-english font-normal text-slate-500">{activeChar.roleEn}</span>
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>ظهوره بالكتاب: {activeChar.textbookAppearance}</span>
                </div>
              </div>

              {/* Set as Mascot button */}
              {(activeChar.id === 'char-nadjib' || activeChar.id === 'char-rehab') && onSelectCharacterMascot && (
                <button
                  onClick={() => {
                    const mascotKey = activeChar.id === 'char-nadjib' ? 'nadjib' : 'rehab';
                    onSelectCharacterMascot(mascotKey);
                    playSound.fanfare();
                  }}
                  className="btn-duo-green text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm hover:scale-102"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تعيين كمساعد رئيسي</span>
                </button>
              )}
            </div>

            {/* QUOTE WITH AUDIO */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-[11px] font-bold text-blue-600 block">عبارة التلميذ الإنجليزية:</span>
                <p className="font-english font-black text-lg md:text-xl text-slate-900">
                  "{activeChar.quoteEn}"
                </p>
                <p className="text-xs md:text-sm text-slate-600 font-bold">
                  {activeChar.quoteAr}
                </p>
              </div>

              <button
                onClick={() => handleSpeak(
                  activeChar.quoteEn, 
                  activeChar.id === 'char-nadjib' ? 'nadjib_boy' : 'rehab_girl'
                )}
                className="btn-duo-blue text-white px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shrink-0 shadow-md"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمع للصوت 🔊</span>
              </button>
            </div>

            {/* DESCRIPTION & DETAIL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>نبذة عن الشخصية ودورها المدرسي:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeChar.descriptionAr}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                  <span>النشاط والهواية المفضلة في المدرسة:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  {activeChar.favoriteActivity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CITIES ================= */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          {/* City Carousel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {ALGERIAN_CITIES.map(c => {
              const isSelected = c.id === selectedCityId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    playSound.click();
                    setSelectedCityId(c.id);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2 text-right ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200 scale-102'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="overflow-hidden">
                    <span className="font-black text-xs text-slate-800 block truncate">{c.nameAr}</span>
                    <span className="font-english font-bold text-[10px] text-slate-400 block truncate">{c.nameEn}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE CITY SPOTLIGHT CARD */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl shadow-inner border border-emerald-200">
                  {activeCity.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">{activeCity.nameAr}</h3>
                    <span className="font-english font-black text-base text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-xl">
                      {activeCity.nameEn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    {activeCity.nicknameAr} • {activeCity.regionAr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-50 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-200">
                  {activeCity.textbookLessonRef}
                </span>
                <button
                  onClick={() => handleSpeak(`${activeCity.nameEn}. ${activeCity.introEn}`)}
                  className="btn-duo-green text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>نطق المدينة والتعريف</span>
                </button>
              </div>
            </div>

            {/* City Introduction */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="font-english font-black text-base md:text-lg text-slate-900 leading-snug">
                "{activeCity.introEn}"
              </p>
              <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed">
                {activeCity.introAr}
              </p>
            </div>

            {/* City Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  🏛️ المعلم والرمز في الكتاب:
                </span>
                <p className="text-xs text-amber-950 font-black">
                  {activeCity.famousLandmarkAr}
                </p>
                <span className="font-english text-[11px] text-amber-800 font-bold block pt-1">
                  {activeCity.famousLandmarkEn}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                  🌟 التراث والثقافة المذكورة:
                </span>
                <p className="text-xs text-emerald-950 font-bold">
                  {activeCity.culturalElementAr}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1">
                <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                  🎯 دليل النطق الصوتي (Phonics):
                </span>
                <p className="text-xs text-sky-950 font-bold font-english">
                  {activeCity.phonicsGuide}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: OBJECT SCENES VAULT ================= */}
      {activeTab === 'scenes' && (
        <div className="space-y-6">
          {/* Unit Scene Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {TEXTBOOK_OBJECT_SCENES.map(s => {
              const isSelected = s.id === selectedSceneId;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    playSound.click();
                    setSelectedSceneId(s.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-700 shadow-sm scale-102'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{s.sceneIcon}</span>
                  <span>وحدة {s.unitNumber}: {s.sceneTitleAr.split(' ')[1] || s.sceneTitleAr}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE SCENE DETAILS */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl">
                  {activeScene.sceneIcon}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{activeScene.sceneTitleAr}</h3>
                  <span className="text-xs font-english text-slate-500 font-bold">{activeScene.sceneTitleEn}</span>
                </div>
              </div>

              <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full">
                كتاب التلميذ: {activeScene.textbookPageRef}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeScene.sceneDescriptionAr}
            </p>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeScene.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSpeak(item.english)}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="text-[10px] font-english text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-lg">
                        {item.phonetics}
                      </span>
                    </div>

                    <h4 className="font-english font-black text-base text-slate-900">
                      {item.english}
                    </h4>

                    <p className="text-xs font-bold text-slate-700">
                      {item.arabic}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="line-clamp-1">{item.textbookDrawingNoteAr}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.english);
                      }}
                      className="p-1 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                      title="استمع للنطق"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: QUIZ ================= */}
      {activeTab === 'quiz' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-6">
          {!quizCompleted ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 font-english font-black text-xs px-2.5 py-1 rounded-xl">
                    سؤال {currentQuizIndex + 1} من {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-xs font-bold text-slate-500">اختبر معلوماتك في مشاهد الكتاب</span>
                </div>

                <span className="font-english font-black text-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  النقاط: {quizScore}
                </span>
              </div>

              {/* Question Card */}
              <div className="p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-2 text-center">
                <h3 className="text-lg md:text-xl font-black text-slate-900">
                  {QUIZ_QUESTIONS[currentQuizIndex].questionAr}
                </h3>
                <p className="font-english text-sm text-slate-600 font-bold">
                  "{QUIZ_QUESTIONS[currentQuizIndex].questionEn}"
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuizIndex].options.map(opt => {
                  const isSelected = selectedAnswerOpt === opt.id;
                  const isCorrect = opt.id === QUIZ_QUESTIONS[currentQuizIndex].correctId;

                  let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400';
                  if (quizAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-black';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleQuizAnswer(opt.id)}
                      disabled={quizAnswered}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right font-black text-sm ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-english text-xs text-slate-700">
                          {opt.id.replace('opt', '')}
                        </span>
                        <span>{opt.textAr}</span>
                      </div>
                      <span className="font-english text-xs text-slate-500">{opt.textEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fact Explanation Box */}
              {quizAnswered && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-bold flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="font-black block">معلومة من الكتاب:</span>
                    <span>{QUIZ_QUESTIONS[currentQuizIndex].factAr}</span>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {quizAnswered && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full btn-duo-yellow text-slate-950 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all"
                >
                  <span>{currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي ➔' : 'عرض النتيجة النهائية واستلام (+40 XP) 🏆'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-4xl shadow-lg ring-4 ring-amber-200 animate-bounce">
                🎉
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                مبروك! أكملت تحدي مشاهد الكتاب!
              </h3>

              <p className="text-sm text-slate-600 font-bold">
                أجبت بشكل صحيح على <span className="text-emerald-600 font-black font-english">{quizScore} من 5</span> أسئلة من رسومات المنهاج الجزائري!
              </p>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs font-black">
                تمت إضافة +40 XP و +15 💎 إلى رصيدك الدراسي! ⚡
              </div>

              <button
                onClick={handleResetQuiz}
                className="btn-duo-blue text-white px-6 py-3 rounded-2xl font-black text-xs md:text-sm shadow-md"
              >
                إعادة التحدي مرة أخرى 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
