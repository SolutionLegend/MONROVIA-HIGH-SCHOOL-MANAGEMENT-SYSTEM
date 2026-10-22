import React, { useState } from 'react';
import {
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Calendar,
  BookOpen,
  DollarSign,
  MessageSquare,
  Sparkles,
  Phone,
  FileText,
  Send,
  Heart,
  TrendingUp,
  X,
  CreditCard,
  Copy,
  Check,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { ParentRecommendation } from '../types';

export const ParentPortalView: React.FC = () => {
  const {
    students,
    grades,
    activeChildId,
    setActiveChildId,
    parentRecommendations,
    dailyRoutine,
    recordPayment,
    currentTenant,
    setSelectedStudentIdForReport,
    setCurrentTab,
    addActivityLog,
    currentUser,
    getStudentRoutine,
    setIsAddRecModalOpen,
  } = useSchool();
  const { tactileClick } = useTactileFeedback();

  // Active child lookup
  const child = students.find((s) => s.id === activeChildId) || students[0];
  const studentGrades = grades[child.id]?.subjects || {};

  // Dynamic routine for child's specific grade & stream
  const routineForChild = getStudentRoutine ? getStudentRoutine(child.grade) : dailyRoutine;
  const isJuniorHigh = child.grade === 'Grade 7' || child.grade === 'Grade 8' || child.grade === 'Grade 9';
  const isSeniorArts = child.grade.includes('Arts');
  const divisionLabel = isJuniorHigh
    ? 'Junior High Division (Grades 7 - 9)'
    : isSeniorArts
    ? 'Senior High • Arts Stream'
    : 'Senior High • Science Stream';

  // Local state for interactive features
  const [activeTab, setActiveTab] = useState<'routine' | 'academics' | 'recommendations' | 'tuition'>('routine');
  const [recommendationFilter, setRecommendationFilter] = useState<'all' | 'high' | 'academic' | 'wellbeing'>('all');
  const [acknowledgedRecs, setAcknowledgedRecs] = useState<Record<string, boolean>>({});

  // Absence excuse modal
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [excuseDate, setExcuseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [excuseReason, setExcuseReason] = useState('Medical clinic appointment in Sinkor');
  const [excuseSentNotice, setExcuseSentNotice] = useState<string | null>(null);

  // Quick Mobile Money Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(child.tuitionBalanceLRD.toString());
  const [payProvider, setPayProvider] = useState<'Lonestar MoMo' | 'Orange Money'>('Lonestar MoMo');
  const [payReceiptMsg, setPayReceiptMsg] = useState<string | null>(null);
  const [copiedUSSD, setCopiedUSSD] = useState(false);

  // Compute child average
  const subjectsArray = Object.values(studentGrades);
  const overallAvg =
    subjectsArray.length > 0
      ? Math.round(subjectsArray.reduce((acc, curr) => acc + curr.total, 0) / subjectsArray.length)
      : 84;

  const handleCopyUSSD = () => {
    tactileClick('tap');
    navigator.clipboard.writeText('*156*4*2*0880123456#');
    setCopiedUSSD(true);
    setTimeout(() => setCopiedUSSD(false), 2500);
  };

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tactileClick('success');
    setExcuseSentNotice(`Official excuse note submitted to Class Master for ${excuseDate}!`);
    setIsExcuseModalOpen(false);

    // Audit log
    addActivityLog({
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      actorName: currentUser.name || child.parentName,
      actorRole: 'parent',
      actionCategory: 'ACADEMIC',
      severity: 'info',
      title: `Parent Excuse Note Submitted: ${child.name}`,
      description: `Parent submitted absence notice for ${excuseDate}. Reason: "${excuseReason}".`,
    });

    setTimeout(() => setExcuseSentNotice(null), 4000);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(payAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) return;

    tactileClick('success');
    recordPayment(child.id, amountNum);
    setPayReceiptMsg(`Payment of ${amountNum.toLocaleString()} LRD via ${payProvider} verified! Receipt generated.`);
    setIsPayModalOpen(false);
    setTimeout(() => setPayReceiptMsg(null), 4000);
  };

  const handleViewReportCard = () => {
    tactileClick('tap');
    setSelectedStudentIdForReport(child.id);
    setCurrentTab('report-card');
  };

  // WhatsApp chat with class teacher
  const handleWhatsAppTeacher = () => {
    tactileClick('success');
    const teacherPhone = '231770123456';
    const msg = `Good day Class Master,\n\nI am ${child.parentName}, parent of ${child.name} (${child.grade}) at ${currentTenant.name}.\n\nI am contacting you regarding my child's academic routine and welfare. Thank you.`;
    window.open(`https://wa.me/${teacherPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const childRecommendations = parentRecommendations.filter(
    (rec) => rec.studentId === child.id || (!parentRecommendations.some((r) => r.studentId === child.id) && rec.studentId === 'STD-1001')
  );

  const filteredRecs = childRecommendations.filter((rec) => {
    if (recommendationFilter === 'high') return rec.priority === 'high';
    if (recommendationFilter === 'academic') return rec.category === 'academic';
    if (recommendationFilter === 'wellbeing') return rec.category === 'wellbeing' || rec.category === 'discipline';
    return true;
  });

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Parent Welcome & Child Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-600/60 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Student Avatar */}
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-700 flex items-center justify-center font-extrabold text-white text-base shadow-md border-2 border-emerald-400 shrink-0">
              {child.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL PARENT PORTAL &bull; {currentTenant.name}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{child.name}</h2>
              <p className="text-xs text-slate-300">
                Roll: <strong className="text-white font-mono">{child.rollNumber}</strong> &bull;{' '}
                {child.grade} &bull; Parent:{' '}
                <strong className="text-slate-200">{child.parentName}</strong>
              </p>
            </div>
          </div>

          {/* Child Switcher Dropdown (for parents with multiple children) */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 p-1.5 rounded-xl self-start sm:self-auto">
            <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={activeChildId}
              onChange={(e) => {
                tactileClick('tap');
                setActiveChildId(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-white pr-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <optgroup label="🎓 Junior High (Grades 7, 8, 9)">
                {students
                  .filter((s) => s.grade === 'Grade 7' || s.grade === 'Grade 8' || s.grade === 'Grade 9')
                  .map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🎨 Senior High - Arts (10, 11, 12)">
                {students
                  .filter((s) => s.grade.includes('Arts'))
                  .map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🔬 Senior High - Science (10, 11, 12)">
                {students
                  .filter((s) => s.grade.includes('Science'))
                  .map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Live Daily Status Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">
              Today&apos;s Attendance:{' '}
              <strong className="text-emerald-400 font-bold uppercase">
                {child.attendanceStatus === 'present'
                  ? 'Present at 7:42 AM'
                  : child.attendanceStatus === 'late'
                  ? 'Marked Late (08:15 AM)'
                  : 'Absent Today'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">
              Academic Year: 2025/2026 Term 1
            </span>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {(excuseSentNotice || payReceiptMsg) && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{excuseSentNotice || payReceiptMsg}</span>
        </div>
      )}

      {/* Tactical KPI Cards for Parent */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Cumulative GPA */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-between">
            <span>Average</span>
            <Award className="w-3.5 h-3.5 text-blue-400" />
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {overallAvg}%
          </span>
          <span className="text-[10px] text-slate-400">Distinction Grade</span>
        </div>

        {/* Attendance Rate */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-between">
            <span>Punctuality</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <span className="text-2xl font-black font-mono text-white mt-1">
            96%
          </span>
          <span className="text-[10px] text-emerald-400">On-Time Morning Roll</span>
        </div>

        {/* Tuition Due */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-between">
            <span>Balance</span>
            <DollarSign className="w-3.5 h-3.5 text-red-400" />
          </span>
          <span className="text-lg xs:text-xl font-black font-mono text-red-400 mt-1 truncate">
            {child.tuitionBalanceLRD.toLocaleString()} LRD
          </span>
          <span className="text-[10px] text-slate-400">
            {child.tuitionBalanceLRD === 0 ? 'Fully Cleared' : `~$${child.tuitionBalanceUSD} USD`}
          </span>
        </div>
      </div>

      {/* Tab Navigation for Parent Portal */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            tactileClick('tap');
            setActiveTab('routine');
          }}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'routine'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Daily Routine</span>
        </button>

        <button
          onClick={() => {
            tactileClick('tap');
            setActiveTab('academics');
          }}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'academics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Grades &amp; Report</span>
        </button>

        <button
          onClick={() => {
            tactileClick('tap');
            setActiveTab('recommendations');
          }}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'recommendations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Teacher Advice</span>
        </button>

        <button
          onClick={() => {
            tactileClick('tap');
            setActiveTab('tuition');
          }}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'tuition'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tuition &amp; MoMo</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: DAILY ROUTINE & TIMETABLE TRACKER
          ========================================================================= */}
      {activeTab === 'routine' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono px-1 gap-1">
            <span>
              Today&apos;s Class Schedule &bull; <strong className="text-white">{child.grade}</strong>{' '}
              <span className="text-emerald-400 font-bold">({divisionLabel})</span>
            </span>
            <span className="text-emerald-400 font-bold self-start sm:self-auto">LIVE PROGRESSION</span>
          </div>

          <div className="space-y-2">
            {routineForChild.map((period, idx) => {
              const isCompleted = period.status === 'completed';
              const isInProgress = period.status === 'in_progress';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all ${
                    isInProgress
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-600/20'
                      : isCompleted
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                          isInProgress
                            ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {typeof period.period === 'number' ? `P${period.period}` : period.period[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white">
                            {period.subject}
                          </h4>
                          {isInProgress && (
                            <span className="px-2 py-0.2 rounded-full bg-blue-500 text-white font-mono text-[9px] font-bold animate-pulse">
                              CURRENT PERIOD
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {period.teacher} &bull; <strong className="text-slate-300">{period.room}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-200 block">
                        {period.time}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          isInProgress
                            ? 'text-blue-400 font-bold'
                            : isCompleted
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {period.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Absence Notice Button */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Need to Report an Upcoming Absence?</span>
              <span className="text-slate-400 text-[11px]">
                Submit medical or family leave notices directly to the attendance office.
              </span>
            </div>
            <button
              onClick={() => {
                tactileClick('tap');
                setIsExcuseModalOpen(true);
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs border border-slate-700 shrink-0"
            >
              Submit Excuse
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACADEMIC PERFORMANCE & SUBJECT GRADES
          ========================================================================= */}
      {activeTab === 'academics' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Subject Grade Records &bull; 20% Quiz / 30% Test / 50% Exam</span>
            <button
              onClick={handleViewReportCard}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Report Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(studentGrades).map(([subjectName, subj]) => {
              const isPass = subj.total >= 70;
              const isBorderline = subj.total >= 60 && subj.total < 70;

              return (
                <div
                  key={subjectName}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{subjectName}</h4>
                      <p className="text-[11px] text-slate-400 italic mt-0.5">&ldquo;{subj.remarks}&rdquo;</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xl font-black font-mono ${
                          isPass
                            ? 'text-emerald-400'
                            : isBorderline
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {subj.total}%
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        Grade {subj.gradeLetter}
                      </span>
                    </div>
                  </div>

                  {/* Component Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 block">QUIZ (20%)</span>
                      <span className="text-white font-bold">{subj.quiz}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">TEST (30%)</span>
                      <span className="text-white font-bold">{subj.test}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">EXAM (50%)</span>
                      <span className="text-emerald-400 font-bold">{subj.exam}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Card CTA */}
          <button
            onClick={handleViewReportCard}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 border border-blue-400 active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Open &amp; Print Official Terminal Report Card</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TEACHER RECOMMENDATIONS & STUDY COACH
          ========================================================================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Faculty Guidance for {child.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">{filteredRecs.length} Actionable Items</span>
              {(currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'super_admin') && (
                <button
                  onClick={() => setIsAddRecModalOpen(true)}
                  className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm"
                >
                  + Add Advice
                </button>
              )}
            </div>
          </div>

          {/* Recommendation Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'high', 'academic', 'wellbeing'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => {
                  tactileClick('tap');
                  setRecommendationFilter(filterKey);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
                  recommendationFilter === filterKey
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>

          {/* Recommendation Cards */}
          <div className="space-y-2.5">
            {filteredRecs.map((rec) => {
              const isAcknowledged = acknowledgedRecs[rec.id];

              return (
                <div
                  key={rec.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isAcknowledged
                      ? 'bg-slate-900/60 border-slate-800 opacity-70'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold font-mono uppercase px-2 py-0.2 rounded-md ${
                            rec.priority === 'high'
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-blue-950 text-blue-300 border border-blue-700'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {rec.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">&bull; {rec.date}</span>
                      </div>

                      <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{rec.recommendation}</p>

                      <p className="text-[10px] text-slate-400 pt-1">
                        By: <strong className="text-slate-200">{rec.author}</strong> ({rec.authorRole})
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        tactileClick('success');
                        setAcknowledgedRecs((prev) => ({ ...prev, [rec.id]: !prev[rec.id] }));
                      }}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                        isAcknowledged
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                      title={isAcknowledged ? 'Reviewed and Acknowledged' : 'Mark as Reviewed'}
                    >
                      {isAcknowledged ? <Check className="w-4 h-4 text-emerald-400" /> : 'Acknowledge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Communication Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Speak Directly with Class Master</span>
              <span className="text-slate-300 text-[11px]">
                Rev. J. Kollie is available for WhatsApp parent consultation daily 2:30 - 4:00 PM.
              </span>
            </div>
            <button
              onClick={handleWhatsAppTeacher}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/40 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TUITION FEE & MOBILE MONEY PAYMENT
          ========================================================================= */}
      {activeTab === 'tuition' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Tuition Account Status
                </span>
                <span className="text-2xl font-black font-mono text-red-400">
                  {child.tuitionBalanceLRD.toLocaleString()} LRD
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Equivalent to ~${child.tuitionBalanceUSD} USD
                </span>
              </div>

              {child.tuitionBalanceLRD > 0 ? (
                <button
                  onClick={() => {
                    tactileClick('tap');
                    setIsPayModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/40 border border-emerald-400"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with MoMo</span>
                </button>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 font-bold font-mono text-xs border border-emerald-700">
                  CLEARED
                </span>
              )}
            </div>

            {/* Mobile Money USSD Copy Instruction Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
                <span>Lonestar Cell MTN MoMo USSD:</span>
                <button
                  onClick={handleCopyUSSD}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  {copiedUSSD ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUSSD ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <p className="font-mono text-emerald-400 font-bold bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                *156*4*2*0880123456#
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Dial the USSD code on your Lonestar MTN phone, enter your child&apos;s Student ID{' '}
                <strong className="text-white font-mono">{child.id}</strong> as the reference, and confirm payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Excuse Modal */}
      {isExcuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Submit Absence Excuse Note</h3>
                <p className="text-xs text-slate-400">For {child.name} &bull; {child.grade}</p>
              </div>
              <button
                onClick={() => setIsExcuseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExcuseSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Absence Date</label>
                <input
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  placeholder="e.g. Fever clinic visit, family bereavement, road blockage..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsExcuseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Submit Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Pay Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Mobile Money Payment</h3>
                <p className="text-xs text-slate-400">Student: {child.name} ({child.rollNumber})</p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Payment Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayProvider('Lonestar MoMo')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      payProvider === 'Lonestar MoMo'
                        ? 'bg-amber-500 text-slate-950 border-amber-300'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Lonestar MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayProvider('Orange Money')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      payProvider === 'Orange Money'
                        ? 'bg-orange-600 text-white border-orange-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Orange Money
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Amount to Settle (LRD)</label>
                <input
                  type="number"
                  min="1"
                  max={child.tuitionBalanceLRD}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/40"
                >
                  Confirm &amp; Settle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
