import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  GraduationCap,
  Award,
  CheckCircle,
  AlertTriangle,
  School,
  ChevronDown,
  User,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import {
  SCHOOL_NAME,
  SCHOOL_MOTTO,
  SCHOOL_ADDRESS,
  SCHOOL_CONTACT,
  ACADEMIC_YEAR,
  CURRENT_TERM,
  SUBJECTS,
} from '../mockData';

export const ReportCardView: React.FC = () => {
  const {
    students,
    grades,
    selectedStudentIdForReport,
    setSelectedStudentIdForReport,
  } = useSchool();
  const { tactileClick } = useTactileFeedback();

  // Selected student
  const activeStudentId = selectedStudentIdForReport || students[0]?.id || 'STD-1001';
  const student = students.find((s) => s.id === activeStudentId) || students[0];

  const studentGradeRecord = grades[student.id] || {
    studentId: student.id,
    grade: student.grade,
    term: CURRENT_TERM,
    subjects: {},
  };

  // Editable Principal remarks state
  const [principalRemarks, setPrincipalRemarks] = useState(
    'Emmanuel has demonstrated commendable focus in academic disciplines. Strong analytical capabilities in Mathematics and Science. Recommended for distinction honor roll.'
  );

  const [teacherRemarks, setTeacherRemarks] = useState(
    'Very well behaved in class, punctual, and helpful to classmates. Keep striving for excellence.'
  );

  // Compute overall average
  const subjectList = SUBJECTS.map((subName) => {
    return (
      studentGradeRecord.subjects[subName] || {
        subject: subName,
        quiz: 0,
        test: 0,
        exam: 0,
        total: 0,
        gradeLetter: 'F',
        remarks: 'No grade recorded',
      }
    );
  });

  const validSubjects = subjectList.filter((s) => s.total > 0);
  const overallAvg =
    validSubjects.length > 0
      ? Math.round(
          validSubjects.reduce((acc, curr) => acc + curr.total, 0) / validSubjects.length
        )
      : 0;

  let overallGrade = 'F';
  if (overallAvg >= 90) overallGrade = 'A';
  else if (overallAvg >= 80) overallGrade = 'B';
  else if (overallAvg >= 70) overallGrade = 'C';
  else if (overallAvg >= 60) overallGrade = 'D';

  const handlePrint = () => {
    tactileClick('success');
    window.print();
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Student Switcher & Print Controls (Hidden on Print) */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md print:hidden">
        {/* Student Selector */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <User className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Select Student Report Card
            </label>
            <select
              value={student.id}
              onChange={(e) => {
                tactileClick('tap');
                setSelectedStudentIdForReport(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNumber} - {s.grade})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action: Print / PDF Button */}
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 border border-blue-400 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Printable Report Card Document */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
        {/* Header Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center border-2 border-blue-600 shadow-sm">
              <School className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-display">
                {SCHOOL_NAME}
              </h1>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-900">
                Motto: {SCHOOL_MOTTO}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-medium">
            {SCHOOL_ADDRESS} • Tel: {SCHOOL_CONTACT}
          </p>
          <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
            Official Student Terminal Report • {CURRENT_TERM} ({ACADEMIC_YEAR})
          </div>
        </div>

        {/* Student Demographic Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-5">
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">Student Name</span>
            <span className="font-extrabold text-sm text-slate-900">{student.name}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">Student ID / Roll</span>
            <span className="font-bold font-mono text-slate-800">{student.id} ({student.rollNumber})</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">Class Grade</span>
            <span className="font-bold text-slate-800">{student.grade}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-500">Parent / Guardian</span>
            <span className="font-semibold text-slate-800">{student.parentName}</span>
          </div>
        </div>

        {/* Subject Grades Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 border border-slate-800">Subject</th>
                <th className="py-2.5 px-2 text-center border border-slate-800">Quiz (20%)</th>
                <th className="py-2.5 px-2 text-center border border-slate-800">Test (30%)</th>
                <th className="py-2.5 px-2 text-center border border-slate-800">Exam (50%)</th>
                <th className="py-2.5 px-2 text-center border border-slate-800">Total (100%)</th>
                <th className="py-2.5 px-2 text-center border border-slate-800">Grade</th>
                <th className="py-2.5 px-3 border border-slate-800">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {subjectList.map((item, idx) => (
                <tr key={item.subject} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="py-2 px-3 font-bold text-slate-900 border border-slate-200">
                    {item.subject}
                  </td>
                  <td className="py-2 px-2 text-center font-mono border border-slate-200">
                    {item.quiz}
                  </td>
                  <td className="py-2 px-2 text-center font-mono border border-slate-200">
                    {item.test}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-blue-900 border border-slate-200">
                    {item.exam}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-extrabold text-slate-950 bg-slate-100/70 border border-slate-200">
                    {item.total}%
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold border border-slate-200">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        item.total >= 70
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : item.total >= 60
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : 'bg-red-100 text-red-800 font-bold'
                      }`}
                    >
                      {item.gradeLetter}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-700 italic border border-slate-200">
                    {item.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="block text-[10px] font-bold text-blue-900 uppercase">Cumulative Average</span>
            <span className="text-xl font-black font-mono text-blue-900">{overallAvg}%</span>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="block text-[10px] font-bold text-emerald-900 uppercase">Terminal Status</span>
            <span className="text-sm font-extrabold text-emerald-800">
              {overallAvg >= 70 ? 'PROMOTED (PASS)' : overallAvg >= 60 ? 'PROBATION' : 'REPEATING'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="block text-[10px] font-bold text-slate-700 uppercase">Class Rank</span>
            <span className="text-sm font-extrabold text-slate-900">
              {overallAvg >= 85 ? 'Top 5% Rank' : 'General Standing'}
            </span>
          </div>

          <div
            className={`p-2.5 border rounded-xl ${
              student.tuitionBalanceLRD === 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <span className="block text-[10px] font-bold uppercase">Tuition Clearance</span>
            <span className="text-xs font-bold font-mono">
              {student.tuitionBalanceLRD === 0
                ? 'CLEARED'
                : `DUE: ${student.tuitionBalanceLRD.toLocaleString()} LRD`}
            </span>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="space-y-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Class Master Remarks:</span>
            <p className="text-slate-700 italic">{teacherRemarks}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Principal&apos;s Remarks:</span>
            <p className="text-slate-700 italic">{principalRemarks}</p>
          </div>
        </div>

        {/* Official Signatures & Seal */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-blue-950 font-bold">
              Rev. J. Kollie
            </div>
            <span className="font-bold text-slate-700">Class Master</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] uppercase font-bold text-slate-400 rotate-[-12deg]">
              School Seal
            </div>
          </div>

          <div>
            <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-serif italic text-blue-950 font-bold">
              Dr. Patricia Weah
            </div>
            <span className="font-bold text-slate-700">Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
