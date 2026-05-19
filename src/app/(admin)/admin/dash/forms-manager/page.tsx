'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ClipboardList, Plus, Trash2, Edit2, AlertCircle, X, Search, FileJson } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormDefinition } from '@/types/forms';

export default function FormsManagerPage() {
  const { t } = useTranslation();
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormSlug, setNewFormSlug] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setForms(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch forms.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim() || !newFormSlug.trim()) return;

    setIsCreating(true);
    setError(null);

    const formattedSlug = newFormSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-]/g, '-');

    try {
      const { data, error: createErr } = await supabase
        .from('forms')
        .insert({
          title: newFormTitle.trim(),
          slug: formattedSlug,
          description: newFormDesc.trim() || null,
          fields: [], // Start empty
        })
        .select()
        .single();

      if (createErr) throw createErr;

      setForms([data, ...forms]);
      setIsModalOpen(false);
      setNewFormTitle('');
      setNewFormSlug('');
      setNewFormDesc('');
    } catch (err: any) {
      setError(err.message || 'Failed to create form.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteForm = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete the form "${slug}"?\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const { error: deleteErr } = await supabase.from('forms').delete().eq('id', id);
      if (deleteErr) throw deleteErr;
      setForms(forms.filter(f => f.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete form.');
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
            {t('forms.manager.title', 'Forms Manager')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build and publish dynamic form templates populated dynamically to multi-tenant registration portals.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 self-start"
        >
          <Plus className="w-4 h-4" />
          {t('forms.manager.new_form', 'Create New Form')}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder={t('forms.manager.search_placeholder', 'Search templates by title or slug...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Forms List Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-slate-800 border-t-indigo-500 rounded-full mb-3" />
          <p className="text-sm">Retrieving templates from remote database...</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-800/80 rounded-xl text-slate-500">
          <ClipboardList className="w-12 h-12 stroke-[1.5] mb-2 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No form templates found</p>
          <p className="text-xs text-slate-500 mt-1">Add a new template or refine your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map(form => (
            <div
              key={form.id}
              className="bg-slate-900/30 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group hover:bg-slate-900/50 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider font-mono">
                    {form.slug}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {form.fields?.length || 0} fields
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-200 group-hover:text-slate-100 transition-colors">
                  {form.title}
                </h3>
                {form.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {form.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-5">
                <span className="text-[10px] text-slate-600">
                  Updated {new Date(form.updated_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/dash/forms-manager/${form.id}`}
                    className="p-2 rounded bg-slate-950 border border-slate-850 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 transition-all flex items-center justify-center"
                    title="Edit Visual Layout Builder"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteForm(form.id, form.slug)}
                    className="p-2 rounded bg-slate-950 border border-slate-850 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center"
                    title="Delete Form Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-slate-100">{t('forms.manager.new_form', 'Create New Form')}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="p-5 space-y-4 text-slate-300">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Form Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youth Activity Waiver"
                  value={newFormTitle}
                  onChange={e => {
                    setNewFormTitle(e.target.value);
                    if (!newFormSlug) {
                      setNewFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Slug Path</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. youth-waiver"
                  value={newFormSlug}
                  onChange={e => setNewFormSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  placeholder="Summarize the intent and content of this form..."
                  value={newFormDesc}
                  onChange={e => setNewFormDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 mt-2"
              >
                {isCreating ? t('common.creating', 'Creating...') : t('common.create', 'Create Form')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
