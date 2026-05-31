'use client';

import React, { useState, useEffect } from 'react';
import { inviteLeader } from '@/app/actions/invite-leader';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';

export default function InviteLeaderPage() {
  const { stakeSlug } = useParams() as { stakeSlug: string };
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadRoles() {
      const { data } = await supabase.from('roles').select('id, name')
        .not('name', 'eq', 'super_admin')
        .not('name', 'eq', 'admin');
      if (data) {
        setAvailableRoles(data);
      }
    }
    loadRoles();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || selectedRoles.length === 0) {
      setError('Please fill in all fields and select at least one role.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const domain = window.location.origin;
      await inviteLeader(stakeSlug, firstName, email, selectedRoles, domain);
      setSuccess(true);
      setFirstName('');
      setEmail('');
      setSelectedRoles([]);
    } catch (err: any) {
      setError(err.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-slate-100 mt-10">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Invite Adult Leader</h2>
      <p className="text-slate-600 mb-8">
        Send an invitation email with a secure signup link to a new adult leader. They will automatically be assigned the selected roles upon registration.
      </p>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">Invitation sent successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Invitee First Name</label>
          <input 
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="John"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Invitee Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Roles for Invitee</label>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            {availableRoles.map(role => (
              <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => toggleRole(role.name)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 capitalize">{role.name.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
          {availableRoles.length === 0 && <p className="text-sm text-slate-500 italic mt-2">Loading available roles...</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending Invite...' : 'Send Invitation Email'}
        </button>
      </form>
    </div>
  );
}
