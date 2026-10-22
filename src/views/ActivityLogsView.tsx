import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  RotateCw,
  PlusCircle,
  Server,
  Layers,
  ChevronDown,
  Terminal,
  FileText,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { SystemActivityLog } from '../types';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs, addActivityLog, clearActivityLogs, schools, currentUser } = useSchool();
  const { tactileClick } = useTactileFeedback();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Filtered logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.ipAddress && log.ipAddress.includes(searchQuery));

    const matchesTenant =
      selectedTenantFilter === 'ALL' ||
      log.tenantId.toString() === selectedTenantFilter;

    const matchesCategory =
      selectedCategoryFilter === 'ALL' || log.actionCategory === selectedCategoryFilter;

    const matchesSeverity =
      selectedSeverityFilter === 'ALL' || log.severity === selectedSeverityFilter;

    return matchesSearch && matchesTenant && matchesCategory && matchesSeverity;
  });

  // Category counts
  const configCount = activityLogs.filter((l) => l.actionCategory === 'CONFIG').length;
  const rbacCount = activityLogs.filter((l) => l.actionCategory === 'RBAC').length;
  const financeCount = activityLogs.filter((l) => l.actionCategory === 'FINANCE').length;
  const criticalCount = activityLogs.filter((l) => l.severity === 'critical' || l.severity === 'warning').length;

  // Simulate a live event
  const handleSimulateEvent = () => {
    tactileClick('success');
    const randomTenant = schools[Math.floor(Math.random() * schools.length)];
    const mockEvents: Array<Omit<SystemActivityLog, 'id' | 'timestamp'>> = [
      {
        tenantId: randomTenant.id,
        tenantName: randomTenant.name,
        actorName: 'System Admin',
        actorRole: 'super_admin',
        actionCategory: 'CONFIG',
        severity: 'warning',
        title: `SMS Notification Gateway Restructured`,
        description: `Updated SMS API credentials and webhook dispatch rate-limiting on ${randomTenant.name}.`,
        ipAddress: '197.231.14.92',
        details: { provider: 'Orange SMS Hub', maxBurstRate: '50/sec' },
      },
      {
        tenantId: randomTenant.id,
        tenantName: randomTenant.name,
        actorName: 'Faculty Registrar',
        actorRole: 'admin',
        actionCategory: 'ACADEMIC',
        severity: 'info',
        title: `WAEC Syllabus Standard Synchronized`,
        description: `Imported updated Liberian National Exam Mathematics learning objectives for Grade 10.`,
        ipAddress: '197.231.11.45',
        details: { modulesAdded: 6, subject: 'Mathematics' },
      },
      {
        tenantId: randomTenant.id,
        tenantName: randomTenant.name,
        actorName: 'Security Daemon',
        actorRole: 'super_admin',
        actionCategory: 'SECURITY',
        severity: 'critical',
        title: `Super Admin Credential Elevation Detected`,
        description: `Audited privileged access token generated from Monrovia Central Hub.`,
        ipAddress: '197.231.02.19',
        details: { tokenLifetimeMinutes: 60, scope: 'system:super_admin' },
      },
    ];

    const chosen = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    addActivityLog(chosen);
    setFeedbackToast(`Simulated event: "${chosen.title}" added to log stream!`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleExportCSV = () => {
    tactileClick('tap');
    const headers = ['Log ID', 'Timestamp', 'Tenant', 'Actor', 'Category', 'Severity', 'Title', 'Description', 'IP'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.tenantName}"`,
      `"${l.actorName}"`,
      l.actionCategory,
      l.severity,
      `"${l.title}"`,
      `"${l.description}"`,
      l.ipAddress || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `system-activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackToast(`Exported ${filteredLogs.length} audit logs to CSV.`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-black via-slate-950 to-red-950/80 border-2 border-red-700/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>CROSS-TENANT SECURITY &amp; CONFIG AUDIT TRAIL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              System Activity &amp; Configuration Logs
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Immutable audit ledger tracking policy revisions, RBAC assignments, and fee schedule updates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Simulate Event Button */}
            <button
              onClick={handleSimulateEvent}
              className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 border border-red-400 active:scale-95 transition-all"
              title="Inject simulated system event"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Event</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
              title="Download audit records as CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {feedbackToast && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
            <span>Total Events</span>
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-2xl font-black font-mono text-white mt-1 block">
            {activityLogs.length}
          </span>
          <span className="text-[10px] text-slate-400">All 3 active tenants</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
            <span>Config Changes</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
            {configCount}
          </span>
          <span className="text-[10px] text-slate-400">Policy &amp; fee structures</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
            <span>RBAC &amp; Auth</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <span className="text-2xl font-black font-mono text-red-400 mt-1 block">
            {rbacCount}
          </span>
          <span className="text-[10px] text-slate-400">Privilege assignments</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
            <span>Critical Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
            {criticalCount}
          </span>
          <span className="text-[10px] text-slate-400">Requiring oversight</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Tenant Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter By Tenant
            </label>
            <select
              value={selectedTenantFilter}
              onChange={(e) => setSelectedTenantFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Schools &amp; Core</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id.toString()}>
                  {s.name} (ID: {s.id})
                </option>
              ))}
            </select>
          </div>

          {/* Action Category Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Action Category
            </label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Categories</option>
              <option value="CONFIG">CONFIG (Policy/Fee Changes)</option>
              <option value="RBAC">RBAC (Roles &amp; Access)</option>
              <option value="FINANCE">FINANCE (Payments &amp; Alerts)</option>
              <option value="ACADEMIC">ACADEMIC (Curriculum/Grades)</option>
              <option value="SECURITY">SECURITY (Encryptions &amp; Snapshots)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Severity Level
            </label>
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Severities</option>
              <option value="critical">Critical (Red)</option>
              <option value="warning">Warning (Amber)</option>
              <option value="success">Success (Emerald)</option>
              <option value="info">Info (Blue)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action title, user actor, tenant, IP, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Log Feed Items */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Displaying {filteredLogs.length} System Log Entries</span>
          <span>Click to Inspect Metadata</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-4">
            <CheckCircle2 className="w-9 h-9 text-slate-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">No Matching Activity Records</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the tenant or category filters above.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            // Severity styling
            const badgeClasses =
              log.severity === 'critical'
                ? 'bg-red-950 text-red-300 border-red-600'
                : log.severity === 'warning'
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : log.severity === 'success'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-blue-950 text-blue-300 border-blue-600';

            return (
              <div
                key={log.id}
                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isExpanded
                    ? 'bg-slate-900 border-red-500 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Log ID */}
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {log.id}
                      </span>

                      {/* Severity Pill */}
                      <span
                        className={`text-[9px] font-extrabold font-mono uppercase px-2 py-0.2 rounded-md border ${badgeClasses}`}
                      >
                        {log.severity}
                      </span>

                      {/* Action Category */}
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {log.actionCategory}
                      </span>

                      {/* Tenant Tag */}
                      <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-red-400" />
                        <strong className="text-white">{log.tenantName}</strong>
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-white">{log.title}</h4>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.description}
                    </p>
                  </div>

                  {/* Actor & Timestamp */}
                  <div className="text-right shrink-0">
                    <span className="block text-[11px] font-mono text-slate-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-400 mt-1">
                      By: <strong className="text-slate-200">{log.actorName}</strong>
                    </span>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-2 text-xs animate-in fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Actor Role</span>
                        <span className="text-red-400 font-bold uppercase">{log.actorRole}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Client IP Address</span>
                        <span className="text-slate-300">{log.ipAddress || '197.231.14.92'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Audit Signature</span>
                        <span className="text-emerald-400">VERIFIED_IMMUTABLE</span>
                      </div>
                    </div>

                    {log.details && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                          Payload Diff Metadata
                        </span>
                        <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
