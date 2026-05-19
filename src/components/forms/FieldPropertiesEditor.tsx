import React from 'react';
import { FormField } from '../../types/forms';
import { useTranslation } from 'react-i18next';
import { Settings, Trash2, PlusCircle } from 'lucide-react';

interface FieldPropertiesEditorProps {
  selectedField: FormField | undefined;
  fields: FormField[];
  updateSelectedField: (updated: Partial<FormField>) => void;
}

export function FieldPropertiesEditor({ selectedField, fields, updateSelectedField }: FieldPropertiesEditorProps) {
  const { t } = useTranslation();

  // Filter possible fields that can be used as dependencies for conditional logic (must be before current field)
  const getConditionalFieldOptions = (currentFieldId: string) => {
    const currentIndex = fields.findIndex(f => f.id === currentFieldId);
    return fields.slice(0, currentIndex).filter(f => ['select', 'radio_group'].includes(f.type));
  };

  return (
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
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">{t('forms.builder.key_help', 'Alpha-numeric characters and underscores only.')}</span>
          </div>

          {['text', 'email', 'textarea', 'number', 'date'].includes(selectedField.type) && (
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
                {t('forms.builder.conditional_help', 'Requires at least one radio or dropdown selector field preceding this field to set conditional visibility rules.')}
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{t('forms.builder.if_this_field', 'If this field...')}</label>
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{t('forms.builder.is', 'Is...')}</label>
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
                          <option value="equals">{t('forms.builder.equals', 'Equals')}</option>
                          <option value="not_equals">{t('forms.builder.not_equals', 'Does Not Equal')}</option>
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
                            )) || <option value="Yes">{t('common.yes', 'Yes')}</option>}
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
  );
}
