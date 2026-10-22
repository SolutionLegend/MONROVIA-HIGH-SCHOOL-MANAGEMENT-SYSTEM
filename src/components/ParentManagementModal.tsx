import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  X,
  CheckCircle2,
  Phone,
  Mail,
  School,
  Share2,
  ExternalLink,
  Search,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { ParentAccount } from '../types';

export const ParentManagementModal: React.FC = () => {
  const {
    isAddParentModalOpen,
    setIsAddParentModalOpen,
    parentAccounts,
    addParentAccount,
    students,
    currentTenant,
    setCurrentTab,
    setActiveChildId,
  } = useSchool();
  const { tactileClick } = useTactileFeedback();

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+231');
  const [parentEmail, setParentEmail] = useState('');
  const [relationship, setRelationship] = useState<'Mother' | 'Father' | 'Guardian'>('Mother');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'STD-1001');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAddParentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) return;

    const student = students.find((s) => s.id === selectedStudentId);

    addParentAccount({
      name: parentName.trim(),
      phone: parentPhone.trim(),
      email: parentEmail.trim() || `${parentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      relationship,
      linkedStudentId: selectedStudentId,
      studentName: student ? student.name : 'Unknown Student',
      studentGrade: student ? student.grade : 'Grade 10',
      tenantId: currentTenant.id,
      status: 'active',
    });

    tactileClick('success');
    setSuccessToast(`Parent account for "${parentName}" created and linked to ${student?.name}!`);

    // Reset form
    setParentName('');
    setParentPhone('+231');
    setParentEmail('');

    setTimeout(() => {
      setSuccessToast(null);
      setActiveTab('list');
    }, 1800);
  };

  const handleSendWhatsAppInvite = (parent: ParentAccount) => {
    tactileClick('success');
    const cleanPhone = parent.phone.replace(/[^0-9]/g, '');
    const message = `Dear Mr./Mrs. ${parent.name},\n\nWelcome to ${currentTenant.name} Official Parent Portal.\n\nYou have been registered to track the daily routine, class timetable, and academic performance for ${parent.studentName} (${parent.studentGrade}).\n\nLogin directly via the mobile PWA: https://ais-pre-ynetmybnm3lusszzszwboh-21338341135.europe-west2.run.app/#parent-portal\n\nBest regards,\nAdministration Office`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handlePreviewAsParent = (studentId: string) => {
    tactileClick('tap');
    setActiveChildId(studentId);
    setCurrentTab('parent-portal');
    setIsAddParentModalOpen(false);
  };

  const filteredParents = parentAccounts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-600/40">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Parent Access Management</h3>
              <p className="text-xs text-slate-400">
                Register parents to track routine, attendance &amp; grades
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddParentModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 mt-4 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'add'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + Add New Parent
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Parent Directory ({parentAccounts.length})
          </button>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Form Tab */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Parent / Guardian Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sando Fahnbulleh"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  WhatsApp Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+231770123456"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as 'Mother' | 'Father' | 'Guardian')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Parent Email (Optional)</label>
              <input
                type="email"
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Link to Student (Junior or Senior High) <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                <optgroup label="🎓 Junior High (Grades 7, 8, 9)">
                  {students
                    .filter((s) => s.grade === 'Grade 7' || s.grade === 'Grade 8' || s.grade === 'Grade 9')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade} • Roll: {s.rollNumber})
                      </option>
                    ))}
                </optgroup>

                <optgroup label="🎨 Senior High - Arts Stream (10, 11, 12)">
                  {students
                    .filter((s) => s.grade.includes('Arts'))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade} • Roll: {s.rollNumber})
                      </option>
                    ))}
                </optgroup>

                <optgroup label="🔬 Senior High - Science Stream (10, 11, 12)">
                  {students
                    .filter((s) => s.grade.includes('Science'))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade} • Roll: {s.rollNumber})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Automatic Role-Based Access
              </span>
              <p>
                Adding this parent registers a client-side account with instant access to their child&apos;s live attendance, grades, and teacher recommendations.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddParentModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/40"
              >
                Save &amp; Link Parent
              </button>
            </div>
          </form>
        )}

        {/* Directory Tab */}
        {activeTab === 'list' && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by parent name, student, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {filteredParents.map((parent) => (
                <div
                  key={parent.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{parent.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {parent.relationship}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {parent.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Child: <strong className="text-white">{parent.studentName}</strong> (
                        {parent.studentGrade})
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">{parent.phone}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleSendWhatsAppInvite(parent)}
                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-colors"
                        title="Send WhatsApp Invite Link"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {/* View as Parent Button */}
                      <button
                        onClick={() => handlePreviewAsParent(parent.linkedStudentId)}
                        className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 transition-colors"
                        title="Preview Portal as this Parent"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
