export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox_group'
  | 'radio_group'
  | 'date'
  | 'file'
  | 'signature';

export interface ConditionalRule {
  fieldName: string;
  operator: 'equals' | 'not_equals';
  value: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  conditional?: ConditionalRule;
  helpText?: string;
}

export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  slug: string;
  fields: FormField[];
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  group_id: string;
  user_id: string;
  form_type: string;
  data: Record<string, any>;
  created_at: string;
}
