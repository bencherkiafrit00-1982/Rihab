import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  Users, CheckCircle2, TrendingUp, Award, 
  Printer, BookOpen, Mic, Headphones, PenTool, 
  RefreshCcw, Sparkles, HeartHandshake, ShieldCheck 
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface TeacherParentDashboardProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onResetProgress: () => void;
}

export const TeacherParentDashboard: React.FC<TeacherParentDashboardProps> = ({
  userStats,
  onUpdateStats,
  onResetProgress,
}) => {
  const [schoolName, setSchoolName] = useState('مدرسة الأمير عبد القادر الابتدائية');
  const [className, setClassName] = useState('السنة الرابعة ابتدائي (فوج 1)');
  const [teacherNotes, setTeacherNotes] = useState(
    'التلميذ يظهر اهتماماً متميزاً بالصوتيات الإنجليزية وتعلّم أسماء المهن وأفراد العائلة، مع ثقة عالية في نطق العبارات.'
  );

  const handlePrint = () => {
    playSound.click();
    window.print();
  };

  // Determine overall proficiency grade
  const avgProficiency = Math.round(
    (userStats.skillProficiency.listening +
      userStats.skillProficiency.speaking +
      userStats.skillProficiency.reading +
      userStats.skillProficiency.writing) /
      4
  );

  const getEvaluationLabel = (score: number) => {
    if (score >= 85) return { text: 'تحكم أقصى (ممتاز) ★★★', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 70) return { text: 'تحكم مقبول (جيد جداً) ★★☆', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (score >= 50) return { text: 'تحكم جزئي (حسن) ★☆☆', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { text: 'في طريق الاكتساب (يحتاج مرافقة)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const evalLabel = getEvaluationLabel(avgProficiency);

  return (
    <div className="max-w-4xl mx-auto py-3 sm:py-6 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-700 text-white shadow-lg border-b-4 border-emerald-900 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-yellow-300 text-teal-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              بوابة الأساتذة وأولياء الأمور
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md font-english">
              Teacher & Parent Portal
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            لوحة المتابعة التربوية والتقييم المستمر
          </h2>
          <p className="text-emerald-100 text-xs md:text-sm mt-1 max-w-xl">
            متابعة دقيقة لمستوى التلميذ في الكفاءات اللغوية الأربع وفق المعايير الرسمية لوزارة التربية الوطنية الجزائرية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-duo-yellow text-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-md hover:brightness-105"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة بطاقة التقييم 🖨️</span>
          </button>
        </div>
      </div>

      {/* Pupil Identity & School Config */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs mb-6">
        <h3 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <span>بيانات التلميذ والمؤسسة التعليمية</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">اسم ولقب التلميذ:</label>
            <input
              type="text"
              value={userStats.name}
              onChange={(e) => onUpdateStats({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">المدرسة الابتدائية:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">القسم / الفوج:</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Core Language Skills Diagnostic (The 4 Skills) */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span>تشخيص الكفاءات اللغوية الأربع (Language Skills Breakdown)</span>
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${evalLabel.color}`}>
            {evalLabel.text}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Skill 1: Listening */}
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
            <div className="flex items-center justify-between text-sky-800 mb-2">
              <Headphones className="w-6 h-6" />
              <span className="font-english font-black text-lg">{userStats.skillProficiency.listening}%</span>
            </div>
            <h4 className="font-black text-sm text-slate-800">الاستماع والفهم الشفهي</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Listening & Comprehension</p>
            <div className="w-full bg-sky-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${userStats.skillProficiency.listening}%` }}
              />
            </div>
            <span className="text-[10px] text-sky-700 font-bold mt-2 block">
              وزن المنهاج: كبير جداً (صفحة 3)
            </span>
          </div>

          {/* Skill 2: Speaking */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center justify-between text-purple-800 mb-2">
              <Mic className="w-6 h-6" />
              <span className="font-english font-black text-lg">{userStats.skillProficiency.speaking}%</span>
            </div>
            <h4 className="font-black text-sm text-slate-800">التحدث والنطق والصوتيات</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Speaking & Phonics Lab</p>
            <div className="w-full bg-purple-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${userStats.skillProficiency.speaking}%` }}
              />
            </div>
            <span className="text-[10px] text-purple-700 font-bold mt-2 block">
              مخارج الحروف: /θ/, /ð/, /tʃ/, /ʃ/
            </span>
          </div>

          {/* Skill 3: Reading */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <BookOpen className="w-6 h-6" />
              <span className="font-english font-black text-lg">{userStats.skillProficiency.reading}%</span>
            </div>
            <h4 className="font-black text-sm text-slate-800">القراءة والاستيعاب</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Reading & Text Discovery</p>
            <div className="w-full bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${userStats.skillProficiency.reading}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-700 font-bold mt-2 block">
              نصوص الكتاب وحوارات التعارف
            </span>
          </div>

          {/* Skill 4: Writing */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <PenTool className="w-6 h-6" />
              <span className="font-english font-black text-lg">{userStats.skillProficiency.writing}%</span>
            </div>
            <h4 className="font-black text-sm text-slate-800">الكتابة وإعادة الترتيب</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Writing & Word Bank</p>
            <div className="w-full bg-emerald-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${userStats.skillProficiency.writing}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-700 font-bold mt-2 block">
              ترتيب الجمل وكتابة الأعداد
            </span>
          </div>
        </div>
      </div>

      {/* Official Competency Checklist according to Algerian Ministry */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs mb-6">
        <h3 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>شبكة الكفاءات الختامية للسنة الرابعة ابتدائي (وزارة التربية الوطنية)</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-black text-xs md:text-sm text-slate-800">
                الكفاءة الشاملة 1: التفاعل والتواصل الشفهي اليومي (Oral Interaction)
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">
                القدرة على إلقاء التحية، تقديم النفس (الاسم، العمر، البلد، الجنسية)، السؤال عن المهن والصحة والتعبير عن الرغبات البسيطة.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-black text-xs md:text-sm text-slate-800">
                الكفاءة الشاملة 2: الفهم القرائي للنصوص القصيرة واللافتات (Reading Comprehension)
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">
                التعرف على مرافق المدرسة، الأكلات الصحية وغير الصحية، حيوانات المزرعة وصغارها، والتمييز بين الأعياد الوطنية والدينية في الجزائر.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-black text-xs md:text-sm text-slate-800">
                الكفاءة الشاملة 3: الإنتاج الكتابي البسيط والتهجئة السليمة (Written Production)
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">
                إعادة ترتيب الكلمات المشوشة لتكوين جمل ذات معنى، كتابة الأرقام بالإنجليزية من 1 إلى 30، وإكمال الفراغات بالكلمات المناسبة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher / Parent Notes Area */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs mb-6">
        <h3 className="font-black text-slate-800 text-base mb-2">
          ملاحظات وتوجيهات الأستاذ / الولي:
        </h3>
        <textarea
          rows={3}
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs md:text-sm text-slate-700 font-medium focus:border-emerald-500 outline-none leading-relaxed"
          placeholder="اكتب ملاحظاتك التشجيعية للتلميذ هنا..."
        />
      </div>

      {/* Reset Progress / Data Management */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4 text-slate-400" />
          <span>إدارة بيانات الحساب والتقدم</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين التقدم لغرض التجربة والبدء من جديد؟')) {
              onResetProgress();
            }
          }}
          className="text-rose-600 hover:text-rose-800 font-bold hover:underline"
        >
          إعادة تعيين التقدم 🔄
        </button>
      </div>
    </div>
  );
};
