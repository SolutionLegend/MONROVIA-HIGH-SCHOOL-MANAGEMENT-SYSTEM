import React, { useState } from 'react';
import {
  GraduationCap,
  Save,
  FileText,
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { CLASSES, SUBJECTS, TERMS } from '../mockData';

export const GradesView: React.FC = () => {
  const {
    students,
    grades,
    selectedClass,
    setSelectedClass,
    selectedSubject,
    setSelectedSubject,
    selectedTerm,
    setSelectedTerm,
    updateStudentGrade,
    setSelectedStudentIdForReport,
    setCurrentTab,
  } = useSchool();

  const { tactileClick } = useTactileFeedback();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const classStudents = students.filter((s) => s.grade === selectedClass);
  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    studentId: string,
    field: 'quiz' | 'test' | 'exam',
    valueStr: string
  ) => {
    // Only numbers
    const num = valueStr === '' ? 0 : Math.min(100, Math.max(0, parseInt(valueStr, 10) || 0));
    tactileClick('tap');
    updateStudentGrade(studentId, selectedSubject, field, num);
  };

  const handleSaveAll = () => {
    tactileClick('success');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleOpenReport = (studentId: string) => {
    tactileClick('tap');
    setSelectedStudentIdForReport(studentId);
    setCurrentTab('report-card');
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Tactical Filter Panel */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-3.5 space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Class Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                tactileClick('tap');
                setSelectedClass(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <optgroup label="🎓 Junior High (Grades 7, 8, 9)">
                {CLASSES.filter((c) => c === 'Grade 7' || c === 'Grade 8' || c === 'Grade 9').map((c) => (
                  <option key={c} value={c}>
                    {c} (Junior High)
                  </option>
                ))}
              </optgroup>
              <optgroup label="🎨 Senior High - Arts Stream">
                {CLASSES.filter((c) => c.includes('Arts')).map((c) => (
                  <option key={c} value={c}>
                    {c} (Arts Stream)
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔬 Senior High - Science Stream">
                {CLASSES.filter((c) => c.includes('Science')).map((c) => (
                  <option key={c} value={c}>
                    {c} (Science Stream)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                tactileClick('tap');
                setSelectedSubject(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Term Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Academic Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => {
                tactileClick('tap');
                setSelectedTerm(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Explainer Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono bg-blue-950/60 border border-blue-800/60 p-2.5 rounded-xl text-blue-300">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Formula: [Quiz × 20%] + [Test × 30%] + [Exam × 50%]</span>
          </div>
          <span className="hidden xs:inline font-bold text-emerald-400">Pass: ≥ 70%</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student in this grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Save Toast */}
      {savedFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Grades for {selectedSubject} saved to local device memory!</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300">
            AUTO-SYNCED
          </span>
        </div>
      )}

      {/* Grade Table / Card List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>{filteredStudents.length} Students in {selectedClass}</span>
          <span className="text-emerald-400">{selectedSubject}</span>
        </div>

        {filteredStudents.map((student) => {
          const studentRecord = grades[student.id];
          const subjectGrade = studentRecord?.subjects?.[selectedSubject] || {
            quiz: 0,
            test: 0,
            exam: 0,
            total: 0,
            gradeLetter: 'F',
            remarks: 'Needs Improvement',
          };

          const isPass = subjectGrade.total >= 70;
          const isBorderline = subjectGrade.total >= 60 && subjectGrade.total < 70;

          return (
            <div
              key={student.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3"
            >
              {/* Student Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {student.rollNumber}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white block truncate">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {student.id}
                    </span>
                  </div>
                </div>

                {/* Tactical Live Average & Letter Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] font-mono uppercase text-slate-400">
                      Total Avg
                    </span>
                    <span
                      className={`text-lg font-extrabold font-mono transition-colors ${
                        isPass
                          ? 'text-emerald-400'
                          : isBorderline
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {subjectGrade.total}%
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border shadow-sm ${
                      isPass
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                        : isBorderline
                        ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                        : 'bg-red-950/80 text-red-300 border-red-600'
                    }`}
                  >
                    {subjectGrade.gradeLetter}
                  </span>
                </div>
              </div>

              {/* Tactical Inputs Row (Large Touch Targets for Mobile) */}
              <div className="grid grid-cols-3 gap-2">
                {/* Quiz (20%) */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-blue-500">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>QUIZ</span>
                    <span className="text-slate-500">20%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    value={subjectGrade.quiz || ''}
                    placeholder="0"
                    onChange={(e) => handleInputChange(student.id, 'quiz', e.target.value)}
                    className="w-full bg-transparent text-lg font-bold font-mono text-white focus:outline-none text-center"
                  />
                </div>

                {/* Test (30%) */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-blue-500">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>TEST</span>
                    <span className="text-slate-500">30%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    value={subjectGrade.test || ''}
                    placeholder="0"
                    onChange={(e) => handleInputChange(student.id, 'test', e.target.value)}
                    className="w-full bg-transparent text-lg font-bold font-mono text-white focus:outline-none text-center"
                  />
                </div>

                {/* Exam (50%) */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>EXAM</span>
                    <span className="text-emerald-400 font-bold">50%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    value={subjectGrade.exam || ''}
                    placeholder="0"
                    onChange={(e) => handleInputChange(student.id, 'exam', e.target.value)}
                    className="w-full bg-transparent text-lg font-bold font-mono text-emerald-400 focus:outline-none text-center"
                  />
                </div>
              </div>

              {/* Bottom Quick Row */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">
                  Status:{' '}
                  <strong
                    className={
                      isPass
                        ? 'text-emerald-400'
                        : isBorderline
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }
                  >
                    {subjectGrade.remarks}
                  </strong>
                </span>

                <button
                  onClick={() => handleOpenReport(student.id)}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Report Card</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Save / Action Bar */}
      <div className="fixed bottom-[64px] left-0 right-0 z-30 p-3 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md print:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-mono font-bold text-emerald-400 block">
              Auto-Calculated
            </span>
            <span className="text-[10px] text-slate-400">
              Live weighted averages
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 border border-emerald-400 flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[50px]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save All Grades</span>
          </button>
        </div>
      </div>
    </div>
  );
};
