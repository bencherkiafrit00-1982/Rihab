import React, { useState } from 'react';
import { SPECIFICATIONS_DATA, SpecSection } from '../data/specsData';
import { 
  FileText, CheckCircle, ChevronDown, ChevronUp, 
  Printer, Copy, Sparkles, BookOpen, Layers, 
  Share2, ShieldCheck 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export const SpecificationsDocument: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSection = (num: number) => {
    playSound.click();
    setExpandedSection(prev => prev === num ? null : num);
  };

  const handleExpandAll = () => {
    playSound.click();
    setExpandedSection(-1); // -1 means all open
  };

  const handleCopySummary = () => {
    playSound.click();
    const fullText = SPECIFICATIONS_DATA.map(s => `[${s.number}] ${s.titleAr} (${s.titleEn}):\n${s.summary}\n${s.details}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    playSound.click();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white shadow-lg border-b-4 border-indigo-900 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-indigo-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              وثيقة المشروع الرسمية • Project Blueprint
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md font-english">
              10 Comprehensive Pillars
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            دفتر الشروط والمواصفات الفنية والتربوية الشاملة
          </h2>
          <p className="text-indigo-100 text-xs md:text-sm mt-1 max-w-xl">
            الملف المرجعي الهندسي والبيداغوجي المتكامل لتطبيق "رحلة رحاب لتعلم الإنجليزية" وفق المنهاج الجزائري للسنة الرابعة ابتدائي (4PS).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            title="نسخ ملخص المواصفات"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'تم النسخ بنجاح! ✓' : 'نسخ المواصفات'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-duo-yellow text-slate-900 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md"
            title="طباعة دفتر الشروط"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة 🖨️</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {SPECIFICATIONS_DATA.map((s) => (
          <button
            key={s.id}
            onClick={() => toggleSection(s.number)}
            className={`p-2.5 rounded-xl border-2 text-right transition-all flex flex-col justify-between ${
              expandedSection === s.number || expandedSection === -1
                ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="font-black text-slate-800 text-[11px] mt-1 line-clamp-1">
              {s.number}. {s.titleAr}
            </span>
          </button>
        ))}
      </div>

      {/* Sections Accordion / Detailed List */}
      <div className="space-y-4">
        {SPECIFICATIONS_DATA.map((section) => {
          const isOpen = expandedSection === section.number || expandedSection === -1;

          return (
            <div
              key={section.id}
              className={`rounded-3xl border-2 transition-all overflow-hidden ${
                isOpen ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-100' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.number)}
                className="p-4 md:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xl shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-english font-black text-xs flex items-center justify-center">
                        {section.number}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm md:text-base">
                        {section.titleAr}
                      </h3>
                    </div>
                    <p className="text-[11px] font-english text-slate-500 font-bold mt-0.5">
                      {section.titleEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Section Content */}
              {isOpen && (
                <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                  {/* Summary Callout */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-700 text-xs md:text-sm font-semibold leading-relaxed">
                    {section.summary}
                  </div>

                  {/* Key Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {section.keyPoints.map((kp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-xs text-slate-800 block">
                            {kp.label}
                          </span>
                          <span className="text-xs text-slate-600 mt-0.5 block leading-relaxed">
                            {kp.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* In-depth details */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {section.details}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legal & Accreditation Note */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-xs text-center leading-relaxed">
        <p className="font-bold text-slate-700">
          المصادقة البيداغوجية: تم بناء هذا المشروع استناداً إلى كتاب اللغة الإنجليزية المعتمد من وزارة التربية الوطنية الجزائرية (ONPS 2023).
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          رقم الاعتماد: 1073 / م / 23 • ردمك: 978.9947.77.346.8 • إشراف وتأليف: سميرة شريط ومحمد زيتوني.
        </p>
      </div>
    </div>
  );
};
