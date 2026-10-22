export type AttendanceStatus = 'present' | 'absent' | 'late';

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  currentTenantId: number;
  email?: string;
  linkedStudentIds?: string[]; // For parent accounts
}

export interface SystemActivityLog {
  id: string;
  timestamp: string;
  tenantId: number;
  tenantName: string;
  actorName: string;
  actorRole: UserRole;
  actionCategory: 'CONFIG' | 'RBAC' | 'FINANCE' | 'ACADEMIC' | 'SECURITY';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
}

export interface DailyRoutinePeriod {
  period: number | string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  status: 'completed' | 'in_progress' | 'upcoming';
}

export interface ParentRecommendation {
  id: string;
  studentId: string;
  category: 'academic' | 'attendance' | 'discipline' | 'wellbeing';
  title: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  author: string;
  authorRole: string;
  date: string;
}

export interface ParentAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: 'Mother' | 'Father' | 'Guardian';
  linkedStudentId: string;
  studentName: string;
  studentGrade: string;
  tenantId: number;
  dateAdded: string;
  status: 'active' | 'invited';
}

export interface SchoolTenant {
  id: number;
  name: string;
  county: string;
  address: string;
  motto: string;
  contact: string;
  totalStudents: number;
  totalRevenueUSD: number;
  totalRevenueLRD: number;
  attendanceRate: number;
  activeStatus: boolean;
  principal: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string; // e.g. "Grade 10A"
  gender: 'M' | 'F';
  parentName: string;
  parentPhone: string;
  tuitionBalanceLRD: number;
  tuitionBalanceUSD: number;
  attendanceStatus?: AttendanceStatus;
  avatarUrl?: string;
  tenantId?: number;
}

export interface SubjectGrade {
  subject?: string;
  quiz: number; // 20%
  test: number; // 30%
  exam: number; // 50%
  total: number;
  gradeLetter: string;
  remarks: string;
}

export interface StudentGradeRecord {
  studentId: string;
  grade: string; // class
  term: string; // "Term 1" | "Term 2" | "Term 3"
  subjects: Record<string, SubjectGrade>;
}

export interface AttendanceRecord {
  date: string;
  grade: string;
  records: Record<string, AttendanceStatus>; // studentId -> status
  submittedAt?: string;
}

export type ViewTab =
  | 'dashboard'
  | 'attendance'
  | 'grades'
  | 'finance'
  | 'report-card'
  | 'login'
  | 'manage-schools'
  | 'system-settings'
  | 'activity-logs'
  | 'parent-portal';
