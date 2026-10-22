import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  AttendanceStatus,
  StudentGradeRecord,
  ViewTab,
  User,
  UserRole,
  SchoolTenant,
  SystemActivityLog,
  DailyRoutinePeriod,
  ParentRecommendation,
  ParentAccount,
} from '../types';
import {
  user as DEFAULT_USER,
  schools as MOCK_SCHOOLS,
  DETAILED_SCHOOLS,
  GLOBAL_SYSTEM_METRICS,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_PARENTS,
  DEFAULT_DAILY_ROUTINE,
  INITIAL_PARENT_RECOMMENDATIONS,
  calculateGrade,
  getRoutineForGrade,
  CLASSES,
  SUBJECTS,
  TERMS,
} from '../mockData';

interface SchoolContextType {
  // Authentication & RBAC
  currentUser: User;
  switchTenant: (tenantId: number) => void;
  login: (role: UserRole, tenantId?: number, linkedStudentId?: string) => void;
  logout: () => void;
  schools: Array<{ id: number; name: string }>;
  detailedSchools: SchoolTenant[];
  currentTenant: SchoolTenant;

  // Super Admin Navigation Quick Modal Triggers
  isManageSchoolsOpen: boolean;
  setIsManageSchoolsOpen: (open: boolean) => void;
  isSystemSettingsOpen: boolean;
  setIsSystemSettingsOpen: (open: boolean) => void;

  // Parent Management for School Admins
  parentAccounts: ParentAccount[];
  addParentAccount: (parent: Omit<ParentAccount, 'id' | 'dateAdded'>) => void;
  isAddParentModalOpen: boolean;
  setIsAddParentModalOpen: (open: boolean) => void;
  isAddRecModalOpen: boolean;
  setIsAddRecModalOpen: (open: boolean) => void;

  // Navigation & UI
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  selectedStudentIdForReport: string | null;
  setSelectedStudentIdForReport: (id: string | null) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Parent Portal State
  activeChildId: string;
  setActiveChildId: (id: string) => void;
  parentRecommendations: ParentRecommendation[];
  addRecommendation: (rec: Omit<ParentRecommendation, 'id' | 'date'>) => void;
  dailyRoutine: DailyRoutinePeriod[];
  getStudentRoutine: (grade: string) => DailyRoutinePeriod[];

  // Super Admin System Activity Logs
  activityLogs: SystemActivityLog[];
  addActivityLog: (log: Omit<SystemActivityLog, 'id' | 'timestamp'>) => void;
  clearActivityLogs: () => void;

  // Selected Filters
  selectedClass: string;
  setSelectedClass: (grade: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedTerm: string;
  setSelectedTerm: (term: string) => void;
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;

  // Data State
  students: Student[];
  allStudents: Student[];
  grades: Record<string, StudentGradeRecord>;

  // Actions
  markAllPresent: (gradeClass?: string) => void;
  setStudentAttendance: (studentId: string, status: AttendanceStatus) => void;
  submitAttendance: () => { success: boolean; count: number };
  updateStudentGrade: (
    studentId: string,
    subject: string,
    field: 'quiz' | 'test' | 'exam',
    value: number
  ) => void;
  recordPayment: (studentId: string, amountLRD: number) => void;
  resetToDefaults: () => void;

  // Metrics
  stats: {
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    attendanceRate: number;
    totalDebtors: number;
    outstandingLRD: number;
    outstandingUSD: number;
  };
  globalMetrics: typeof GLOBAL_SYSTEM_METRICS;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'mhs_user_v1',
  STUDENTS: 'mhs_students_v1',
  GRADES: 'mhs_grades_v1',
  CONTRAST: 'mhs_high_contrast_v1',
  LOGS: 'mhs_logs_v1',
  RECOMMENDATIONS: 'mhs_recommendations_v1',
  PARENTS: 'mhs_parents_v1',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & RBAC User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // fallback to default
        }
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // System Activity Logs State (persisted)
  const [activityLogs, setActivityLogs] = useState<SystemActivityLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
    }
  }, [activityLogs]);

  const addActivityLog = (logData: Omit<SystemActivityLog, 'id' | 'timestamp'>) => {
    const newLog: SystemActivityLog = {
      ...logData,
      id: `LOG-${Math.floor(8000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  // Parent Management for School Admins (persisted)
  const [parentAccounts, setParentAccounts] = useState<ParentAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PARENTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_PARENTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(parentAccounts));
    }
  }, [parentAccounts]);

  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [isAddRecModalOpen, setIsAddRecModalOpen] = useState(false);

  const addParentAccount = (parentData: Omit<ParentAccount, 'id' | 'dateAdded'>) => {
    const newParent: ParentAccount = {
      ...parentData,
      id: `PAR-${Math.floor(100 + Math.random() * 900)}`,
      dateAdded: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
    };
    setParentAccounts((prev) => [newParent, ...prev]);

    // Record audit activity log for Parent Provisioning
    addActivityLog({
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionCategory: 'RBAC',
      severity: 'success',
      title: `Parent Access Account Created: ${newParent.name}`,
      description: `School Admin provisioned portal credential for parent of ${newParent.studentName} (${newParent.studentGrade}). Phone: ${newParent.phone}`,
      ipAddress: '197.231.14.92',
      details: { parentPhone: newParent.phone, linkedStudentId: newParent.linkedStudentId },
    });
  };

  // Parent Portal State
  const [activeChildId, setActiveChildId] = useState<string>('STD-1001');
  const [dailyRoutine] = useState<DailyRoutinePeriod[]>(DEFAULT_DAILY_ROUTINE);
  const [parentRecommendations, setParentRecommendations] = useState<ParentRecommendation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_PARENT_RECOMMENDATIONS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(parentRecommendations));
    }
  }, [parentRecommendations]);

  const addRecommendation = (rec: Omit<ParentRecommendation, 'id' | 'date'>) => {
    const newRec: ParentRecommendation = {
      ...rec,
      id: `REC-${Math.floor(10 + Math.random() * 90)}`,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
    };
    setParentRecommendations((prev) => [newRec, ...prev]);

    // Log faculty academic feedback dispatch
    addActivityLog({
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionCategory: 'ACADEMIC',
      severity: 'info',
      title: `Faculty Guidance Dispatched: ${rec.title}`,
      description: `New ${rec.priority} priority guidance posted for student by ${rec.author} (${rec.authorRole}).`,
      ipAddress: '197.231.14.92',
    });
  };

  const getStudentRoutine = (grade: string) => {
    return getRoutineForGrade(grade);
  };

  // Modals for Quick Links
  const [isManageSchoolsOpen, setIsManageSchoolsOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);

  // Active School Tenant computation
  const currentTenant =
    DETAILED_SCHOOLS.find((s) => s.id === currentUser.currentTenantId) || DETAILED_SCHOOLS[0];

  const switchTenant = (tenantId: number) => {
    const targetSchool = DETAILED_SCHOOLS.find((s) => s.id === tenantId);
    setCurrentUser((prev) => ({
      ...prev,
      currentTenantId: tenantId,
    }));

    // Record system audit log for configuration switch
    addActivityLog({
      tenantId,
      tenantName: targetSchool?.name || `Tenant #${tenantId}`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionCategory: 'CONFIG',
      severity: 'info',
      title: `Tenant Context Switched to ${targetSchool?.name}`,
      description: `Super Admin navigated active operational session to ${targetSchool?.name} (${targetSchool?.county}).`,
      ipAddress: '197.231.14.92',
    });
  };

  const login = (role: UserRole, tenantId = 1, linkedStudentId = 'STD-1001') => {
    const newUser: User = {
      id:
        role === 'super_admin'
          ? 'USR-001'
          : role === 'admin'
          ? 'USR-002'
          : role === 'parent'
          ? 'USR-PAR-01'
          : 'USR-003',
      name:
        role === 'super_admin'
          ? 'System Admin'
          : role === 'admin'
          ? 'Dr. Patricia Weah'
          : role === 'parent'
          ? 'Jeremiah Kollie (Parent)'
          : 'Emmanuel Flomo',
      role,
      currentTenantId: tenantId,
      email:
        role === 'super_admin'
          ? 'admin@system.gov.lr'
          : role === 'admin'
          ? 'principal@monroviahigh.edu.lr'
          : role === 'parent'
          ? 'jkollie@gmail.com'
          : 'flomo@monroviahigh.edu.lr',
      linkedStudentIds: role === 'parent' ? [linkedStudentId] : undefined,
    };
    setCurrentUser(newUser);

    if (role === 'parent') {
      setActiveChildId(linkedStudentId);
      setCurrentTab('parent-portal');
    } else {
      setCurrentTab('dashboard');
    }

    addActivityLog({
      tenantId,
      tenantName: currentTenant.name,
      actorName: newUser.name,
      actorRole: role,
      actionCategory: 'RBAC',
      severity: role === 'super_admin' ? 'warning' : 'info',
      title: `User Authentication Session: ${role.toUpperCase()}`,
      description: `Authenticated as ${newUser.name} into ${currentTenant.name} workspace.`,
      ipAddress: '197.231.14.92',
    });
  };

  const logout = () => {
    setCurrentTab('login');
  };

  // Navigation
  const [currentTab, setCurrentTabState] = useState<ViewTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ViewTab;
      if (
        [
          'dashboard',
          'attendance',
          'grades',
          'finance',
          'report-card',
          'login',
          'activity-logs',
          'parent-portal',
        ].includes(hash)
      ) {
        return hash;
      }
      const pathname = window.location.pathname.replace('/', '') as ViewTab;
      if (
        [
          'dashboard',
          'attendance',
          'grades',
          'finance',
          'report-card',
          'login',
          'activity-logs',
          'parent-portal',
        ].includes(pathname)
      ) {
        return pathname;
      }
    }
    return 'dashboard';
  });

  const [selectedStudentIdForReport, setSelectedStudentIdForReport] = useState<string | null>(
    'STD-1001'
  );

  const setCurrentTab = (tab: ViewTab) => {
    setCurrentTabState(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', tab === 'dashboard' ? '/' : `/${tab}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace('/', '') as ViewTab;
      if (
        [
          'dashboard',
          'attendance',
          'grades',
          'finance',
          'report-card',
          'login',
          'activity-logs',
          'parent-portal',
        ].includes(pathname)
      ) {
        setCurrentTabState(pathname);
      } else {
        setCurrentTabState('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Tactical Sunlight High-Contrast mode
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.CONTRAST) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONTRAST, String(highContrast));
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  }, [highContrast]);

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>(CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [selectedTerm, setSelectedTerm] = useState<string>(TERMS[0]);
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Students state with localStorage
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return INITIAL_STUDENTS;
  });

  // Active students for current tenant
  const activeStudents = allStudents.filter(
    (s) => s.tenantId === currentUser.currentTenantId || !s.tenantId
  );

  // Grades state with localStorage
  const [grades, setGrades] = useState<Record<string, StudentGradeRecord>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return INITIAL_GRADES;
  });

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));
    }
  }, [allStudents]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    }
  }, [grades]);

  // Actions
  const markAllPresent = (gradeClass = selectedClass) => {
    setAllStudents((prev) =>
      prev.map((s) => {
        const matchesTenant = s.tenantId === currentUser.currentTenantId || !s.tenantId;
        if (matchesTenant && s.grade === gradeClass) {
          return { ...s, attendanceStatus: 'present' };
        }
        return s;
      })
    );
  };

  const setStudentAttendance = (studentId: string, status: AttendanceStatus) => {
    setAllStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  const submitAttendance = () => {
    const classStudents = activeStudents.filter((s) => s.grade === selectedClass);
    return {
      success: true,
      count: classStudents.length,
    };
  };

  const updateStudentGrade = (
    studentId: string,
    subject: string,
    field: 'quiz' | 'test' | 'exam',
    value: number
  ) => {
    setGrades((prev) => {
      const studentRecord = prev[studentId] || {
        studentId,
        grade: selectedClass,
        term: selectedTerm,
        subjects: {},
      };

      const currentSubj = studentRecord.subjects[subject] || {
        subject,
        quiz: 0,
        test: 0,
        exam: 0,
        total: 0,
        gradeLetter: 'F',
        remarks: 'Needs Improvement',
      };

      const updatedVals = {
        quiz: field === 'quiz' ? value : currentSubj.quiz,
        test: field === 'test' ? value : currentSubj.test,
        exam: field === 'exam' ? value : currentSubj.exam,
      };

      const computed = calculateGrade(updatedVals.quiz, updatedVals.test, updatedVals.exam);

      return {
        ...prev,
        [studentId]: {
          ...studentRecord,
          subjects: {
            ...studentRecord.subjects,
            [subject]: {
              ...currentSubj,
              ...computed,
            },
          },
        },
      };
    });
  };

  const recordPayment = (studentId: string, amountLRD: number) => {
    setAllStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newLRD = Math.max(0, s.tuitionBalanceLRD - amountLRD);
          const newUSD = Math.round(newLRD / 195);
          return {
            ...s,
            tuitionBalanceLRD: newLRD,
            tuitionBalanceUSD: newUSD,
          };
        }
        return s;
      })
    );

    const paidStudent = allStudents.find((s) => s.id === studentId);
    addActivityLog({
      tenantId: currentUser.currentTenantId,
      tenantName: currentTenant.name,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionCategory: 'FINANCE',
      severity: 'success',
      title: `Tuition Payment Receipt Logged`,
      description: `Collected ${amountLRD.toLocaleString()} LRD payment for ${paidStudent?.name || studentId} (${paidStudent?.grade}).`,
      ipAddress: '197.231.14.92',
    });
  };

  const resetToDefaults = () => {
    setAllStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setCurrentUser(DEFAULT_USER);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setParentRecommendations(INITIAL_PARENT_RECOMMENDATIONS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.GRADES);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
    }
  };

  // Real-time metrics for current tenant
  const totalStudents = activeStudents.length;
  const presentToday = activeStudents.filter((s) => s.attendanceStatus === 'present').length;
  const absentToday = activeStudents.filter((s) => s.attendanceStatus === 'absent').length;
  const lateToday = activeStudents.filter((s) => s.attendanceStatus === 'late').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

  const debtors = activeStudents.filter((s) => s.tuitionBalanceLRD > 0);
  const totalDebtors = debtors.length;
  const outstandingLRD = debtors.reduce((acc, curr) => acc + curr.tuitionBalanceLRD, 0);
  const outstandingUSD = debtors.reduce((acc, curr) => acc + curr.tuitionBalanceUSD, 0);

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        switchTenant,
        login,
        logout,
        schools: MOCK_SCHOOLS,
        detailedSchools: DETAILED_SCHOOLS,
        currentTenant,
        isManageSchoolsOpen,
        setIsManageSchoolsOpen,
        isSystemSettingsOpen,
        setIsSystemSettingsOpen,
        parentAccounts,
        addParentAccount,
        isAddParentModalOpen,
        setIsAddParentModalOpen,
        isAddRecModalOpen,
        setIsAddRecModalOpen,
        currentTab,
        setCurrentTab,
        selectedStudentIdForReport,
        setSelectedStudentIdForReport,
        highContrast,
        setHighContrast,
        activeChildId,
        setActiveChildId,
        parentRecommendations,
        addRecommendation,
        dailyRoutine,
        getStudentRoutine,
        activityLogs,
        addActivityLog,
        clearActivityLogs,
        selectedClass,
        setSelectedClass,
        selectedSubject,
        setSelectedSubject,
        selectedTerm,
        setSelectedTerm,
        attendanceDate,
        setAttendanceDate,
        students: activeStudents,
        allStudents,
        grades,
        markAllPresent,
        setStudentAttendance,
        submitAttendance,
        updateStudentGrade,
        recordPayment,
        resetToDefaults,
        stats: {
          totalStudents,
          presentToday,
          absentToday,
          lateToday,
          attendanceRate,
          totalDebtors,
          outstandingLRD,
          outstandingUSD,
        },
        globalMetrics: GLOBAL_SYSTEM_METRICS,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
