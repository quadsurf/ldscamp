import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, LayoutDashboard, Settings, LogOut, ShieldAlert } from 'lucide-react';

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  // Fetch user profile and verify role is super_admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          {/* Logo / Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <ShieldAlert className="w-5 h-5" />
              <span>Antigravity Camp</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold font-mono">
              Super Admin Console
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/admin/dash"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/dash/forms-manager"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            >
              <ClipboardList className="w-4 h-4 text-indigo-400" />
              <span>Forms Manager</span>
            </Link>
          </nav>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="flex flex-col gap-4 border-t border-slate-900 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {profile.first_name?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200">
                {profile.first_name} {profile.last_name}
              </span>
              <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-900 hover:border-slate-800 bg-slate-950 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
        {children}
      </main>
    </div>
  );
}
