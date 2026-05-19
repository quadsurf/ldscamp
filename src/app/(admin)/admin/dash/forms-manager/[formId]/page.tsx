'use client';

import React, { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, AlertCircle, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormDefinition, FormField } from '@/types/forms';
import { FormBuilder } from '@/components/forms/FormBuilder';

interface FormBuilderPageProps {
  params: Promise<{
    formId: string;
  }>;
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { formId } = use(params);
  const { t } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchForm = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .single();

        if (fetchErr) throw fetchErr;
        setForm(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch form details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSaveFields = async (fields: FormField[]) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: saveErr } = await supabase
        .from('forms')
        .update({
          fields,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formId);

      if (saveErr) throw saveErr;

      setSuccess(true);
      if (form) {
        setForm({ ...form, fields });
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save form layout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back navigation & Actions header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dash/forms-manager"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-400" />
              {form ? form.title : 'Loading Form...'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {form ? `Customize dynamic fields and validation properties for slug: /${form.slug}` : 'Retrieving schema configuration...'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
          <Check className="w-5 h-5 shrink-0" />
          <span>{t('forms.builder.save_success', 'Form template updated successfully and published live.')}</span>
        </div>
      )}

      {/* Builder Wrapper */}
      {isLoading ? (
        <div className="text-center py-24 text-slate-500">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-slate-800 border-t-indigo-500 rounded-full mb-3" />
          <p className="text-sm">Fetching builder configurations...</p>
        </div>
      ) : form ? (
        <FormBuilder
          initialFields={form.fields || []}
          onSave={handleSaveFields}
          isLoading={isSaving}
        />
      ) : (
        <div className="text-center py-20 text-slate-500">
          <AlertCircle className="w-12 h-12 stroke-[1.5] mb-2 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">Form Template Not Found</p>
          <p className="text-xs text-slate-500 mt-1">Please verify the route URL or return to forms manager.</p>
        </div>
      )}
    </div>
  );
}
