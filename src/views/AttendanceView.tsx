import React, { useState } from 'react';
import {
  CheckCheck,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { CLASSES } from '../mockData';
import { AttendanceStatus } from '../types';

export const AttendanceView: React.FC = () => {
  const {
    students,
    selectedClass,
    setSelectedClass,
    attendanceDate,
    setAttendanceDate,
    markAllPresent,
    setStudentAttendance,
    submitAttendance,
  } = useSchool();

  const { tactileClick } = useTactileFeedback();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  const [divisionFilter, setDivisionFilter] = useState<'ALL' | 'JUNIOR' | '10' | '11' | '12'>('ALL');

  const displayedClasses = CLASSES.filter((cls) => {
    if (divisionFilter === 'JUNIOR') return cls === 'Grade 7' || cls === 'Grade 8' || cls === 'Grade 9';
    if (divisionFilter === '10') return cls.startsWith('Grade 10');
    if (divisionFilter === '11') return cls.startsWith('Grade 11');
    if (divisionFilter === '12') return cls.startsWith('Grade 12');
    return true;
  });

  // Filter students by selected class and search
  const classStudents = students.filter((s) => s.grade === selectedClass);
  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Class summary counters
  const presentCount = classStudents.filter((s) => s.attendanceStatus === 'present').length;
  const absentCount = classStudents.filter((s) => s.attendanceStatus === 'absent').length;
  const lateCount = classStudents.filter((s) => s.attendanceStatus === 'late').length;

  const handleMarkAll = () => {
    tactileClick('success');
    markAllPresent(selectedClass);
    setSubmitFeedback(`All ${classStudents.length} students in ${selectedClass} marked PRESENT.`);
    setTimeout(() => setSubmitFeedback(null), 3000);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    tactileClick(status === 'present' ? 'tap' : 'alert');
    setStudentAttendance(studentId, status);
  };

  const handleSubmit = () => {
    tactileClick('success');
    const res = submitAttendance();
    if (res.success) {
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Class & Date Selector Header */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-3.5 space-y-3 shadow-md">
        {/* Division Quick Filter Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-700/70 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            High School Level:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All (9)' },
              { id: 'JUNIOR', label: 'Junior (7-9)' },
              { id: '10', label: '10 Art & Sci' },
              { id: '11', label: '11 Art & Sci' },
              { id: '12', label: '12 Art & Sci' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  tactileClick('tap');
                  setDivisionFilter(d.id as any);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all shrink-0 ${
                  divisionFilter === d.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {displayedClasses.map((cls) => {
              const isSelected = selectedClass === cls;
              const isArt = cls.includes('Arts');
              const isScience = cls.includes('Science');
              const isJunior = cls.startsWith('Grade 7') || cls.startsWith('Grade 8') || cls.startsWith('Grade 9');

              return (
                <button
                  key={cls}
                  onClick={() => {
                    tactileClick('tap');
                    setSelectedClass(cls);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400'
                      : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isArt ? 'bg-amber-400' : isScience ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}
                  />
                  <span>{cls}</span>
                </button>
              );
            })}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Tactical Search & Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* TACTICAL SUPER FEATURE: Huge "Mark All Present" Button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleMarkAll}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:from-emerald-700 active:to-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/30 border-2 border-emerald-400/80 active:scale-[0.98] transition-all touch-manipulation min-h-[58px]"
        >
          <CheckCheck className="w-6 h-6 stroke-[2.5]" />
          <span>MARK ALL {selectedClass.toUpperCase()} PRESENT</span>
        </button>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          💡 Tap to set all students Present, then just switch the 1 or 2 absent students below.
        </p>
      </div>

      {/* Feedback Toast */}
      {submitFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submitFeedback}</span>
        </div>
      )}

      {/* Class Live Counter Ticker */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
          <span className="block text-[10px] uppercase font-bold text-emerald-400">Present</span>
          <span className="text-xl font-bold font-mono text-emerald-300">{presentCount}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
          <span className="block text-[10px] uppercase font-bold text-amber-400">Late</span>
          <span className="text-xl font-bold font-mono text-amber-300">{lateCount}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/60">
          <span className="block text-[10px] uppercase font-bold text-red-400">Absent</span>
          <span className="text-xl font-bold font-mono text-red-300">{absentCount}</span>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>{filteredStudents.length} Students in {selectedClass}</span>
          <span>Status Selection</span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 bg-slate-800/40 rounded-2xl border border-slate-700/60">
            <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-300">No students found matching your search</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const status = student.attendanceStatus || 'present';

            return (
              <div
                key={student.id}
                className={`p-3 rounded-2xl border transition-all ${
                  status === 'present'
                    ? 'bg-slate-900/90 border-slate-800'
                    : status === 'late'
                    ? 'bg-amber-950/20 border-amber-800/50'
                    : 'bg-red-950/20 border-red-800/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Tactical Photo / Initials Placeholder */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        status === 'present'
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : status === 'late'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-red-950 text-red-300 border-red-700'
                      }`}
                    >
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white truncate">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {student.rollNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Parent: {student.parentName}
                      </p>
                    </div>
                  </div>

                  {/* High-Contrast Large Touch Tri-Button (Present / Late / Absent) */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {/* PRESENT Button */}
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 touch-manipulation min-h-[44px] ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/40 border border-emerald-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      aria-label={`Mark ${student.name} Present`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    {/* LATE Button */}
                    <button
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 touch-manipulation min-h-[44px] ${
                        status === 'late'
                          ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40 border border-amber-300 font-extrabold'
                          : 'text-slate-400 hover:text-amber-300'
                      }`}
                      aria-label={`Mark ${student.name} Late`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>

                    {/* ABSENT Button */}
                    <button
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 touch-manipulation min-h-[44px] ${
                        status === 'absent'
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/40 border border-red-400'
                          : 'text-slate-400 hover:text-red-400'
                      }`}
                      aria-label={`Mark ${student.name} Absent`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Bar with Submit Button */}
      <div className="fixed bottom-[64px] left-0 right-0 z-30 p-3 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md print:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-mono font-bold text-white block">
              {presentCount + lateCount} / {classStudents.length} Active
            </span>
            <span className="text-[10px] text-slate-400">
              {absentCount > 0 ? `${absentCount} Absent today` : 'Full Attendance'}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 border border-blue-400 flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[50px]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Submit Roll ({classStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="font-bold text-lg text-white">Attendance Recorded!</h3>
            <p className="text-xs text-slate-300 mt-1">
              Roll call for <span className="font-bold text-white">{selectedClass}</span> on{' '}
              <span className="font-mono text-emerald-400">{attendanceDate}</span> has been locally saved.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-3 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Present</span>
                <span className="font-mono font-bold text-emerald-400 text-base">{presentCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Late</span>
                <span className="font-mono font-bold text-amber-400 text-base">{lateCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Absent</span>
                <span className="font-mono font-bold text-red-400 text-base">{absentCount}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs active:scale-95 transition-all"
            >
              Continue Working
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
