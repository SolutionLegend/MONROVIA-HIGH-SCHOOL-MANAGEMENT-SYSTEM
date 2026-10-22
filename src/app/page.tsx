import React from 'react';
import { DashboardView } from '../views/DashboardView';

/**
 * Dashboard Page component with role-based conditional logic:
 * - If role === 'super_admin': Displays the Global Overview
 *   (Total Schools: 3, Total Students: 1,500, Total Revenue: $50,000).
 * - If role === 'teacher' | 'admin': Displays the regular school-specific dashboard.
 * - Super Admin can also toggle and view the operational dashboard for the selected tenant.
 */
export default function Page() {
  return <DashboardView />;
}
