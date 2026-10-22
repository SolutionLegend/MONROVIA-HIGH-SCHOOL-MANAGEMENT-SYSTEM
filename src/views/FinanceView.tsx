import React, { useState } from 'react';
import {
  AlertCircle,
  MessageSquare,
  Phone,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  TrendingDown,
  X,
  CreditCard,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { SCHOOL_NAME } from '../mockData';
import { Student } from '../types';

export const FinanceView: React.FC = () => {
  const { students, recordPayment, stats } = useSchool();
  const { tactileClick } = useTactileFeedback();

  const [currency, setCurrency] = useState<'LRD' | 'USD'>('LRD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Modal for logging payment
  const [paymentModalStudent, setPaymentModalStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Filter only debtors (tuition_balance > 0)
  const debtors = students.filter((s) => s.tuitionBalanceLRD > 0);

  const filteredDebtors = debtors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone.includes(searchQuery);

    const matchesClass = selectedClassFilter === 'ALL' || s.grade === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  const handleWhatsAppClick = (student: Student) => {
    tactileClick('success');
    const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
    const amountStr =
      currency === 'LRD'
        ? `${student.tuitionBalanceLRD.toLocaleString()} LRD`
        : `$${student.tuitionBalanceUSD} USD`;

    const message = `Dear Mr./Mrs. ${student.parentName},\n\nThis is an urgent tuition balance reminder from ${SCHOOL_NAME}.\n\nStudent: ${student.name} (${student.grade})\nOutstanding Balance: ${amountStr}\n\nPlease settle this balance today to avoid classroom & exam hall restriction. Mobile payment options:\n• Lonestar Cell MTN MoMo: 0880123456\n• Orange Money: 0770123456\n\nThank you for your prompt cooperation.\nBusiness & Finance Office, ${SCHOOL_NAME}`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCallParent = (phone: string) => {
    tactileClick('tap');
    window.location.href = `tel:${phone}`;
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalStudent) return;
    const amount = parseInt(paymentAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    tactileClick('success');
    recordPayment(paymentModalStudent.id, amount);
    setPaymentSuccessMsg(
      `Received ${amount.toLocaleString()} LRD payment for ${paymentModalStudent.name}!`
    );
    setPaymentModalStudent(null);
    setPaymentAmount('');
    setTimeout(() => setPaymentSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Finance Overview Stats Card */}
      <div className="rounded-2xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900 border border-red-900/60 p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>COLLECTIONS & RECOVERY DIRECTORY</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Outstanding Tuition Debtors
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              1-Tap WhatsApp mobile notifications with direct MoMo payment coordinates.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-700 p-0.5 rounded-xl shrink-0">
            <button
              onClick={() => {
                tactileClick('tap');
                setCurrency('LRD');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'LRD'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LRD
            </button>
            <button
              onClick={() => {
                tactileClick('tap');
                setCurrency('USD');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Big Balance Callout */}
        <div className="mt-4 pt-3 border-t border-red-900/40 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Total Outstanding Balance
            </span>
            <span className="text-3xl font-extrabold font-mono text-red-400 tracking-tight">
              {currency === 'LRD'
                ? `${stats.outstandingLRD.toLocaleString()} LRD`
                : `$${stats.outstandingUSD.toLocaleString()} USD`}
            </span>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-red-900/60 border border-red-700/80 text-white text-xs font-mono font-bold">
              {stats.totalDebtors} Students Overdue
            </span>
          </div>
        </div>
      </div>

      {/* Payment Success Toast */}
      {paymentSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-3 space-y-2.5">
        <div className="flex gap-2">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Classes (Junior &amp; Senior)</option>
            <optgroup label="Junior High (Grades 7 - 9)">
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
            </optgroup>
            <optgroup label="Senior High (Arts &amp; Science)">
              <option value="Grade 10 Arts">Grade 10 Arts</option>
              <option value="Grade 10 Science">Grade 10 Science</option>
              <option value="Grade 11 Arts">Grade 11 Arts</option>
              <option value="Grade 11 Science">Grade 11 Science</option>
              <option value="Grade 12 Arts">Grade 12 Arts</option>
              <option value="Grade 12 Science">Grade 12 Science</option>
            </optgroup>
          </select>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search debtor or parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Debtor List Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Showing {filteredDebtors.length} Debtor(s)</span>
          <span>Click WhatsApp for Instant Alert</span>
        </div>

        {filteredDebtors.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">All Clear!</h4>
            <p className="text-xs text-slate-400 mt-1">
              No students found with outstanding tuition balance in this category.
            </p>
          </div>
        ) : (
          filteredDebtors.map((student) => {
            const amountFormatted =
              currency === 'LRD'
                ? `${student.tuitionBalanceLRD.toLocaleString()} LRD`
                : `$${student.tuitionBalanceUSD} USD`;

            return (
              <div
                key={student.id}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3 hover:border-slate-700 transition-all"
              >
                {/* Header: Student Name & Bold Red Amount */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white truncate">
                        {student.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {student.grade}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Parent / Guardian: <strong className="text-slate-200">{student.parentName}</strong>
                    </p>
                  </div>

                  {/* Amount Owed in Bold Red */}
                  <div className="text-right shrink-0">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">
                      Amount Due
                    </span>
                    <span className="text-lg xs:text-xl font-extrabold font-mono text-red-500 tracking-tight">
                      {amountFormatted}
                    </span>
                  </div>
                </div>

                {/* Phone & Payment Channel Info */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center gap-2 min-w-0 font-mono text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{student.parentPhone}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    MoMo &amp; Orange active
                  </span>
                </div>

                {/* Action Buttons: WhatsApp Alert (Huge Emerald Green) + Direct Call + Record Payment */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 pt-1">
                  {/* WhatsApp Alert Button (Tactical Hero Feature) */}
                  <button
                    onClick={() => handleWhatsAppClick(student)}
                    className="xs:col-span-2 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:from-emerald-700 active:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/30 border border-emerald-400 active:scale-95 transition-all min-h-[46px]"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                    <span>WhatsApp Alert</span>
                  </button>

                  {/* Record Payment Button */}
                  <button
                    onClick={() => {
                      tactileClick('tap');
                      setPaymentModalStudent(student);
                      setPaymentAmount(student.tuitionBalanceLRD.toString());
                    }}
                    className="py-3 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all min-h-[46px]"
                    title="Log student payment"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Payment Modal */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Record Tuition Payment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {paymentModalStudent.name} • {paymentModalStudent.grade}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalStudent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex justify-between">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-mono font-bold text-red-400">
                  {paymentModalStudent.tuitionBalanceLRD.toLocaleString()} LRD
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Amount Received (LRD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    LRD
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={paymentModalStudent.tuitionBalanceLRD}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Quick shortcut buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentAmount((paymentModalStudent.tuitionBalanceLRD / 2).toString())}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700"
                >
                  50% Half
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(paymentModalStudent.tuitionBalanceLRD.toString())}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700"
                >
                  Full Clearance
                </button>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalStudent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
