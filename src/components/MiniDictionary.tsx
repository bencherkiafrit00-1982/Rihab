import React, { useState } from 'react';
import { BILINGUAL_DICTIONARY } from '../data/curriculumData';
import { DictionaryItem } from '../types';
import { Search, Volume2, Sparkles, Filter, BookA, Shuffle } from 'lucide-react';
import { speakEnglish } from '../utils/speech';
import { playSound } from '../utils/soundEffects';

interface MiniDictionaryProps {
  onWordReviewed?: (word: string) => void;
}

export const MiniDictionary: React.FC<MiniDictionaryProps> = ({ onWordReviewed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flashcardIndex, setFlashcardIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filtered dictionary
  const filteredWords = BILINGUAL_DICTIONARY.filter(item => {
    const matchesUnit = selectedUnit === 'all' || item.unitNumber === selectedUnit;
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      item.english.toLowerCase().includes(q) || 
      item.arabic.includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesUnit && matchesCategory && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    playSound.click();
    speakEnglish(text, 0.9);
    if (onWordReviewed) {
      onWordReviewed(text);
    }
  };

  const handleStartFlashcard = () => {
    playSound.click();
    if (filteredWords.length > 0) {
      setFlashcardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleNextFlashcard = () => {
    playSound.click();
    if (flashcardIndex !== null) {
      setFlashcardIndex((flashcardIndex + 1) % filteredWords.length);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white shadow-lg border-b-4 border-blue-800 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-yellow-400 text-yellow-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              صفحة 96 من الكتاب المدرسي 📖
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md font-english">
              Official Bilingual Dictionary
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            القاموس المصور الثنائي (إنجليزي - عربي)
          </h2>
          <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-xl">
            جميع مفردات كتاب السنة الرابعة ابتدائي المعتمدة وزارياً، مع النطق الإنجليزي السليم والترجمة العربية الدقيقة.
          </p>
        </div>

        <button
          onClick={handleStartFlashcard}
          className="btn-duo-yellow text-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-md hover:brightness-105 shrink-0"
        >
          <Shuffle className="w-4 h-4" />
          <span>تحدي البطاقات التفاعلية 🃏</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالإنجليزية أو العربية (مثل: Doctor, طعام, Couscous)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none font-bold"
            />
          </div>

          {/* Unit Filter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> الوحدة:
            </span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedUnit(val === 'all' ? 'all' : Number(val));
              }}
              className="px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">جميع الوحدات (1 - 8)</option>
              <option value="1">الوحدة 1: العائلة والأصدقاء</option>
              <option value="2">الوحدة 2: المهن والوظائف</option>
              <option value="3">الوحدة 3: المدرسة</option>
              <option value="4">الوحدة 4: الصحة والعافية</option>
              <option value="5">الوحدة 5: الأغذية</option>
              <option value="6">الوحدة 6: الألعاب والرياضة</option>
              <option value="7">الوحدة 7: الاحتفالات والمناسبات</option>
              <option value="8">الوحدة 8: الحيوانات</option>
            </select>
          </div>
        </div>

        {/* Category Quick Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-bold">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">التصنيف:</span>
          {[
            { id: 'all', label: 'الكل (All)' },
            { id: 'Cities', label: '🏛️ المدن الجزائرية' },
            { id: 'Characters', label: '👦🏻 شخصيات الكتاب' },
            { id: 'Classroom', label: '🎒 أدوات القسم' },
            { id: 'Food', label: '🍲 الأطعمة والتقاليد' },
            { id: 'Animals', label: '🦊 الحيوانات والمزرعة' },
            { id: 'Jobs', label: '👨‍⚕️ المهن والأدوات' },
            { id: 'Health', label: '🍎 الصحة والعافية' },
            { id: 'Sports', label: '⚽ الألعاب الشعبية' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                playSound.click();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Unit Tag */}
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                الوحدة {item.unitNumber}
              </span>
              <span className="text-slate-400 font-bold font-english">
                {item.category}
              </span>
            </div>

            {/* Word Display */}
            <div className="flex items-center gap-3 my-2">
              {item.emoji && (
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
              )}
              <div className="flex-1">
                <div className="font-english font-black text-slate-800 text-lg flex items-center gap-1.5">
                  <span>{item.english}</span>
                </div>
                <div className="text-slate-600 font-bold text-sm text-emerald-700">
                  {item.arabic}
                </div>
              </div>
            </div>

            {/* Listen Button */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleSpeak(item.english)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs transition-colors"
                title="استمع للنطق"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>نطق الكلمة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <BookA className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-600">لم يتم العثور على كلمات مطابقة لبحثك</p>
          <p className="text-xs text-slate-400 mt-1">جرّب كتابة كلمة أخرى أو تغيير خيار الوحدة</p>
        </div>
      )}

      {/* FLASHCARD MODAL */}
      {flashcardIndex !== null && filteredWords.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-yellow-300 relative text-center">
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              بطاقة المراجعة الذكية ({flashcardIndex + 1}/{filteredWords.length})
            </span>

            {/* Flashcard Body (Flip on click) */}
            <div
              onClick={() => {
                playSound.click();
                setIsFlipped(!isFlipped);
              }}
              className="my-6 p-8 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-50 border-3 border-amber-300 shadow-md cursor-pointer min-h-[200px] flex flex-col items-center justify-center transition-all hover:scale-102"
            >
              <div className="text-5xl mb-3">
                {filteredWords[flashcardIndex].emoji || '📖'}
              </div>

              {!isFlipped ? (
                <>
                  <div className="text-2xl font-black font-english text-slate-800">
                    {filteredWords[flashcardIndex].english}
                  </div>
                  <p className="text-xs text-amber-700 font-bold mt-2">
                    اضغط هنا لكشف المعنى باللغة العربية 🔄
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-black text-emerald-800">
                    {filteredWords[flashcardIndex].arabic}
                  </div>
                  <p className="text-xs font-english text-slate-500 font-bold mt-2">
                    Unit {filteredWords[flashcardIndex].unitNumber} • {filteredWords[flashcardIndex].category}
                  </p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleSpeak(filteredWords[flashcardIndex].english)}
                className="btn-duo-blue text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>نطق</span>
              </button>
              <button
                onClick={handleNextFlashcard}
                className="btn-duo-green text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                البطاقة التالية ➔
              </button>
              <button
                onClick={() => setFlashcardIndex(null)}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
