import React from 'react';
import { SuperAdminNav } from '../components/SuperAdminNav';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { OfflineBanner } from '../components/OfflineBanner';
import { SchoolProvider, useSchool } from '../context/SchoolContext';

export function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSchool();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* 
        Super Admin Top Navigation Bar:
        Sticky bar at the very top of the viewport (above main school header).
        Conditionally rendered ONLY if the mock user's role is 'super_admin'.
      */}
      {currentUser.role === 'super_admin' && <SuperAdminNav />}

      <Header />
      <OfflineBanner />

      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 py-4">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SchoolProvider>
      <RootLayoutInner>{children}</RootLayoutInner>
    </SchoolProvider>
  );
}
