'use client';

import React, { useState } from 'react';
import { FormField, FormFieldType } from '../../types/forms';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ArrowUp, ArrowDown, Settings, Eye, FileJson, X, PlusCircle, Check } from 'lucide-react';
import { FormGenerator } from './FormGenerator';

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
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800 min-h-[500px]">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 pb-3 border-b border-slate-800 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-400" />
            {t('forms.builder.properties', 'Field Properties')}
          </h3>

          {!selectedField ? (
            <div className="flex flex-col items-center justify-center text-slate-500 py-20 text-center">
              <Settings className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-sm">{t('forms.builder.select_field', 'Select a field from the canvas to edit its properties.')}</p>
            </div>
          ) : (
            <div className="space-y-4 text-slate-300">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('forms.builder.label', 'Field Label')}</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={e => updateSelectedField({ label: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('forms.builder.name', 'JSON Key Name')}</label>
                <input
                  type="text"
                  value={selectedField.name}
                  onChange={e => updateSelectedField({ name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Alpha-numeric characters and underscores only.</span>
              </div>

              {['text', 'textarea', 'number', 'date'].includes(selectedField.type) && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">{t('forms.builder.placeholder', 'Placeholder Text')}</label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ''}
                    onChange={e => updateSelectedField({ placeholder: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              {selectedField.type === 'file' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">{t('forms.builder.help_text', 'Help Text')}</label>
                  <input
                    type="text"
                    value={selectedField.helpText || ''}
                    onChange={e => updateSelectedField({ helpText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              {/* Options Editor for dropdowns, checkbox group, and radio group */}
              {['select', 'checkbox_group', 'radio_group'].includes(selectedField.type) && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1">{t('forms.builder.options', 'Options')}</label>
                  <div className="space-y-1.5">
                    {selectedField.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const newOptions = [...(selectedField.options || [])];
                            newOptions[optIdx] = e.target.value;
                            updateSelectedField({ options: newOptions });
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = (selectedField.options || []).filter((_, idx) => idx !== optIdx);
                            updateSelectedField({ options: newOptions });
                          }}
                          disabled={(selectedField.options?.length || 0) <= 1}
                          className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                        updateSelectedField({ options: newOptions });
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      {t('forms.builder.add_option', 'Add Option')}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 py-3 border-t border-b border-slate-800 my-4">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedField.required || false}
                    onChange={e => updateSelectedField({ required: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-white" />
                  <span className="ml-3 text-xs font-bold uppercase tracking-wider text-slate-200">
                    {t('forms.builder.required', 'Required Field')}
                  </span>
                </label>
              </div>

              {/* Conditional Visibility Section */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  {t('forms.builder.conditional_visibility', 'Conditional Visibility')}
                </label>
                {getConditionalFieldOptions(selectedField.id).length === 0 ? (
                  <span className="text-[10px] text-slate-500 italic">
                    Requires at least one radio or dropdown selector field preceding this field to set conditional visibility rules.
                  </span>
                ) : (
                  <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <label className="relative flex items-center cursor-pointer select-none mb-1">
                      <input
                        type="checkbox"
                        checked={!!selectedField.conditional}
                        onChange={e => {
                          if (e.target.checked) {
                            const condFields = getConditionalFieldOptions(selectedField.id);
                            updateSelectedField({
                              conditional: {
                                fieldName: condFields[0].name,
                                operator: 'equals',
                                value: condFields[0].options?.[0] || 'Yes',
                              },
                            });
                          } else {
                            updateSelectedField({ conditional: undefined });
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-400 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-white" />
                      <span className="ml-3.5 text-xs text-slate-300 font-semibold">
                        {t('forms.builder.enable_conditional', 'Show field conditionally')}
                      </span>
                    </label>

                    {selectedField.conditional && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-900">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">If this field...</label>
                          <select
                            value={selectedField.conditional.fieldName}
                            onChange={e => {
                              const targetField = fields.find(f => f.name === e.target.value);
                              updateSelectedField({
                                conditional: {
                                  fieldName: e.target.value,
                                  operator: selectedField.conditional!.operator,
                                  value: targetField?.options?.[0] || 'Yes',
                                },
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                          >
                            {getConditionalFieldOptions(selectedField.id).map(f => (
                              <option key={f.id} value={f.name}>
                                {f.label} ({f.name})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Is...</label>
                          <div className="flex gap-2">
                            <select
                              value={selectedField.conditional.operator}
                              onChange={e => {
                                updateSelectedField({
                                  conditional: {
                                    ...selectedField.conditional!,
                                    operator: e.target.value as 'equals' | 'not_equals',
                                  },
                                });
                              }}
                              className="w-1/3 bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="equals">Equals</option>
                              <option value="not_equals">Does Not Equal</option>
                            </select>

                            <select
                              value={selectedField.conditional.value}
                              onChange={e => {
                                updateSelectedField({
                                  conditional: {
                                    ...selectedField.conditional!,
                                    value: e.target.value,
                                  },
                                });
                              }}
                              className="w-2/3 bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                            >
                              {fields
                                .find(f => f.name === selectedField.conditional!.fieldName)
                                ?.options?.map(o => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                )) || <option value="Yes">Yes</option>}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
