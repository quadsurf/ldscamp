'use client';

import React, { useState } from 'react';
import { FormField, FormFieldType } from '../../types/forms';
import { useTranslation } from 'react-i18next';
import { Check, Eye, Plus, PlusCircle, Settings, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { FormGenerator } from './FormGenerator';
import { FieldPropertiesEditor } from './FieldPropertiesEditor';

interface FormBuilderProps {
  initialFields: FormField[];
  onSave: (fields: FormField[]) => void;
  isLoading?: boolean;
}

export function FormBuilder({ initialFields, onSave, isLoading = false }: FormBuilderProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const fieldTypes: { type: FormFieldType; label: string }[] = [
    { type: 'text', label: t('forms.types.text', 'Text') },
    { type: 'email', label: t('forms.types.email', 'Email Address') },
    { type: 'textarea', label: t('forms.types.textarea', 'Text Area') },
    { type: 'number', label: t('forms.types.number', 'Number') },
    { type: 'select', label: t('forms.types.select', 'Select Dropdown') },
    { type: 'checkbox_group', label: t('forms.types.checkbox_group', 'Checkbox Group') },
    { type: 'radio_group', label: t('forms.types.radio_group', 'Radio Group') },
    { type: 'date', label: t('forms.types.date', 'Date Selector') },
    { type: 'file', label: t('forms.types.file', 'File Upload') },
    { type: 'signature', label: t('forms.types.signature', 'Digital Signature') },
  ];

  const addField = (type: FormFieldType) => {
    const defaultLabel = `${type.charAt(0).toUpperCase() + type.slice(1)} Field`;
    const baseName = type + Math.floor(Math.random() * 1000);
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      name: baseName,
      label: defaultLabel,
      required: false,
      options: ['select', 'checkbox_group', 'radio_group'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const updateSelectedField = (updated: Partial<FormField>) => {
    if (!selectedFieldId) return;
    setFields(fields.map(f => (f.id === selectedFieldId ? { ...f, ...updated } as FormField : f)));
  };

  // Filter possible fields that can be used as dependencies for conditional logic (must be before current field)
  const getConditionalFieldOptions = (currentFieldId: string) => {
    const currentIndex = fields.findIndex(f => f.id === currentFieldId);
    return fields.slice(0, currentIndex).filter(f => ['select', 'radio_group'].includes(f.type));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
      {/* Left panel: Toolbox & Fields Canvas */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Toolbox */}
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">{t('forms.builder.toolbox', 'Add Form Fields')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {fieldTypes.map(ft => (
              <button
                key={ft.type}
                type="button"
                onClick={() => addField(ft.type)}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900 text-xs font-semibold transition-all text-left"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields Canvas */}
        <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex-1 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200">{t('forms.builder.canvas', 'Form Layout Canvas')}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                disabled={fields.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                {t('forms.builder.preview', 'Live Preview')}
              </button>
              <button
                type="button"
                onClick={() => onSave(fields)}
                disabled={isLoading || fields.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isLoading ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
              </button>
            </div>
          </div>

          {fields.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20">
              <PlusCircle className="w-12 h-12 stroke-[1.5] mb-2 text-slate-600" />
              <p className="text-sm">{t('forms.builder.empty', 'No fields added yet. Select a field type above to begin.')}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {fields.map((field, index) => {
                const isSelected = selectedFieldId === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-600/5'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {field.type}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">{field.label}</span>
                      <span className="text-xs text-slate-500 font-mono">key: {field.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === fields.length - 1}
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`p-1.5 rounded border transition-colors ${
                          isSelected ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Selected Field Properties Editor */}
      <div className="lg:col-span-5">
        <FieldPropertiesEditor 
          selectedField={selectedField}
          fields={fields}
          updateSelectedField={updateSelectedField}
        />
      </div>

      {/* Dynamic Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  {t('forms.builder.preview_mode', 'Live Form Preview Mode')}
                </h3>
                <p className="text-xs text-slate-500">Test field validators, error states, and conditional rendering live.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
              <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
                <FormGenerator
                  fields={fields}
                  onSubmit={(data) => {
                    alert(`🚀 Valid Form Submission Caught!\n\nPayload:\n${JSON.stringify(data, null, 2)}`);
                  }}
                  submitLabel={t('forms.builder.submit_test', 'Test Submit')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default FormBuilder;
