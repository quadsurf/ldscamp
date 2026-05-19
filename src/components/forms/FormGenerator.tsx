'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '../../types/forms';
import { compileFormSchema } from '../../utils/formSchemaCompiler';
import { SignaturePad } from './SignaturePad';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface FormGeneratorProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
  submitLabel?: string;
  isLoading?: boolean;
}

export function FormGenerator({
  fields,
  onSubmit,
  defaultValues = {},
  submitLabel,
  isLoading = false,
}: FormGeneratorProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = { ...defaultValues };
    fields.forEach(f => {
      if (initial[f.name] !== undefined) return;
      
      if (f.type === 'checkbox_group') {
        initial[f.name] = [];
      } else if (f.type === 'number') {
        initial[f.name] = undefined;
      } else {
        initial[f.name] = '';
      }
    });
    return initial;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to check if a field is conditionally visible
  const isFieldVisible = (field: FormField) => {
    const conditional = field.conditional;
    if (!conditional) return true;

    const watchedValue = values[conditional.fieldName];
    if (conditional.operator === 'equals') {
      return String(watchedValue) === String(conditional.value);
    } else if (conditional.operator === 'not_equals') {
      return String(watchedValue) !== String(conditional.value);
    }
    return true;
  };

  // Clean up values and errors of conditionally hidden fields (similar to shouldUnregister: true)
  useEffect(() => {
    let stateChanged = false;
    const nextValues = { ...values };
    const nextErrors = { ...errors };

    fields.forEach(field => {
      if (!isFieldVisible(field)) {
        if (field.name in nextValues) {
          delete nextValues[field.name];
          stateChanged = true;
        }
        if (field.name in nextErrors) {
          delete nextErrors[field.name];
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      setValues(nextValues);
      setErrors(nextErrors);
    }
  }, [values, fields]);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field dynamically
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Get currently visible fields
    const visibleFields = fields.filter(isFieldVisible);

    // 2. Compile schema only for currently visible fields
    const schema = compileFormSchema(visibleFields);

    // 3. Validate values
    const result = schema.safeParse(values);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        const fieldName = err.path[0] as string;
        newErrors[fieldName] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    // 4. Submit parsed data
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(field => {
        if (!isFieldVisible(field)) return null;

        const value = values[field.name];
        const hasError = !!errors[field.name];
        const errorMessage = errors[field.name];

        return (
          <div key={field.id} className="flex flex-col gap-1.5">
            {(() => {
              switch (field.type) {
                case 'textarea':
                  return (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <textarea
                        id={field.id}
                        value={value || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-lg p-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                          hasError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                        }`}
                        rows={4}
                      />
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );

                case 'select':
                  return (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <select
                        id={field.id}
                        value={value || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        className={`w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-lg p-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                          hasError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                        }`}
                      >
                        <option value="" className="text-slate-500">
                          {t('common.select_option', 'Select an option...')}
                        </option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );

                case 'radio_group':
                  return (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-4 mt-1">
                        {field.options?.map(option => {
                          const isSelected = value === option;
                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-slate-900/50 cursor-pointer transition-all hover:bg-slate-800/50 ${
                                isSelected 
                                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                                  : 'border-slate-700 text-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={option}
                                checked={isSelected}
                                onChange={() => handleChange(field.name, option)}
                                className="hidden"
                              />
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-indigo-500' : 'border-slate-500'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                              </div>
                              <span className="text-sm font-medium">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );

                case 'checkbox_group':
                  const currentValues = Array.isArray(value) ? value : [];
                  return (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <div className="flex flex-col gap-2 mt-1">
                        {field.options?.map(option => {
                          const isChecked = currentValues.includes(option);
                          const toggleOption = () => {
                            if (isChecked) {
                              handleChange(field.name, currentValues.filter((v: string) => v !== option));
                            } else {
                              handleChange(field.name, [...currentValues, option]);
                            }
                          };
                          return (
                            <label
                              key={option}
                              className={`flex items-start gap-3 px-4 py-3 rounded-lg border bg-slate-900/50 cursor-pointer transition-all hover:bg-slate-800/50 ${
                                isChecked 
                                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                                  : 'border-slate-700 text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={toggleOption}
                                className="hidden"
                              />
                              <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 ${
                                isChecked ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 text-slate-900 stroke-[3]" />}
                              </div>
                              <span className="text-sm font-medium">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );

                case 'file':
                  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleChange(field.name, reader.result as string); // base64 representation
                      };
                      reader.readAsDataURL(file);
                    } else {
                      handleChange(field.name, '');
                    }
                  };

                  return (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <div className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all bg-slate-900/40 hover:bg-slate-900/60 ${
                        hasError ? 'border-rose-500/50' : 'border-slate-700 hover:border-slate-600'
                      }`}>
                        <input
                          id={field.id}
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,application/pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {value ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              <Check className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-emerald-400">{t('common.file_ready', 'File Loaded Successfully')}</span>
                            {typeof value === 'string' && value.startsWith('data:image/') && (
                              <img src={value} alt="Preview" className="h-16 mt-2 rounded border border-slate-700 object-contain bg-slate-950" />
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">{t('common.drag_upload', 'Click or drag file here to upload')}</span>
                            <span className="text-xs text-slate-500">{field.helpText || t('common.file_limit', 'PDF, PNG, JPG up to 5MB')}</span>
                          </div>
                        )}
                      </div>
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );

                case 'signature':
                  return (
                    <SignaturePad
                      value={value}
                      onChange={val => handleChange(field.name, val)}
                      label={field.label}
                      required={field.required}
                      error={errorMessage}
                    />
                  );

                default:
                  return (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-200">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        value={value || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-lg p-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                          hasError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                        }`}
                      />
                      {errorMessage && <span className="text-xs text-rose-500 font-medium">{errorMessage}</span>}
                    </div>
                  );
              }
            })()}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 mt-4"
      >
        {isLoading ? t('common.loading', 'Processing...') : (submitLabel || t('common.submit', 'Submit Form'))}
      </button>
    </form>
  );
}
export default FormGenerator;
