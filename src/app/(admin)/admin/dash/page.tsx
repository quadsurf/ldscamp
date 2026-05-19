import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ClipboardList, ShieldAlert, Users, FolderHeart, Activity } from 'lucide-react';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Run counts in parallel
  const [
    { count: formsCount },
    { count: groupsCount },
    { count: submissionsCount }
  ] = await Promise.all([
    supabase.from('forms').select('*', { count: 'exact', head: true }),
    supabase.from('groups').select('*', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true })
  ]);

  const stats = [
    {
      name: 'Dynamic Templates',
      value: formsCount || 0,
      icon: ClipboardList,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      name: 'Camp Groups (Tenants)',
      value: groupsCount || 0,
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      name: 'Total Form Submissions',
      value: submissionsCount || 0,
      icon: FolderHeart,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-400" />
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your Summer Camp multi-tenant SaaS indicators, dynamic form definitions, and submissions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div
            key={stat.name}
            className="p-6 bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800 flex items-center justify-between shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.name}
              </span>
              <span className="text-3xl font-black text-slate-100 tracking-tight">
                {stat.value}
              </span>
            </div>
            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/dash/forms-manager"
            className="p-4 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 transition-all flex flex-col gap-1 text-left"
          >
            <span className="text-sm font-semibold text-slate-200">Manage Form Templates</span>
            <span className="text-xs text-slate-500">
              Create, edit, and configure dynamic fields, validations, and conditional logic for youth registration, medical waiver, and adult leader signups.
            </span>
          </Link>
          <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 text-left flex flex-col gap-1 opacity-60">
            <span className="text-sm font-semibold text-slate-400">System Logs & Metrics</span>
            <span className="text-xs text-slate-600">
              Review and audit database queries, active websocket channels, and performance benchmarks for active camp tenants (Coming soon).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
