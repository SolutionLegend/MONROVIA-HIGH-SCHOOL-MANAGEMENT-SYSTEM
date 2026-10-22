import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';

export const AddRecommendationModal: React.FC = () => {
  const {
    isAddRecModalOpen,
    setIsAddRecModalOpen,
    students,
    addRecommendation,
    currentUser,
  } = useSchool();
  const { tactileClick } = useTactileFeedback();

  const [studentId, setStudentId] = useState(students[0]?.id || 'STD-1001');
  const [category, setCategory] = useState<'academic' | 'attendance' | 'discipline' | 'wellbeing'>('academic');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [title, setTitle] = useState('');
  const [recommendationText, setRecommendationText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser.name || 'Class Master');
  const [authorRole, setAuthorRole] = useState(currentUser.role === 'admin' ? 'Principal' : 'Senior Teacher');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isAddRecModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !recommendationText.trim()) return;

    const student = students.find((s) => s.id === studentId);

    addRecommendation({
      studentId,
      category,
      priority,
      title: title.trim(),
      recommendation: recommendationText.trim(),
      author: authorName.trim(),
      authorRole: authorRole.trim(),
    });

    tactileClick('success');
    setToastMsg(`Recommendation for ${student?.name} dispatched to Parent Portal!`);

    setTitle('');
    setRecommendationText('');

    setTimeout(() => {
      setToastMsg(null);
      setIsAddRecModalOpen(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-600/40">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Add Parent Guidance Note</h3>
              <p className="text-xs text-slate-400">
                Post academic &amp; routine guidance to Parent Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddRecModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Student <span className="text-red-400">*</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <optgroup label="🎓 Junior High (Grades 7, 8, 9)">
                {students
                  .filter((s) => s.grade === 'Grade 7' || s.grade === 'Grade 8' || s.grade === 'Grade 9')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>

              <optgroup label="🎨 Senior High - Arts (10, 11, 12)">
                {students
                  .filter((s) => s.grade.includes('Arts'))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>

              <optgroup label="🔬 Senior High - Science (10, 11, 12)">
                {students
                  .filter((s) => s.grade.includes('Science'))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="academic">Academic Prep</option>
                <option value="attendance">Punctuality / Attendance</option>
                <option value="discipline">Leadership / Conduct</option>
                <option value="wellbeing">Health &amp; Welfare</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-blue-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Recommendation Headline <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. WAEC Math Trigonometry Practice or Reading Focus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Detailed Advice for Parent <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain actionable steps the parent can take at home..."
              value={recommendationText}
              onChange={(e) => setRecommendationText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Author Title</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddRecModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30"
            >
              Publish to Parent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
