import { z } from 'zod';
import { FormField } from '../types/forms';

export function compileFormSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach(field => {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
        validator = z.preprocess((val) => {
          if (val === '' || val === undefined || val === null) return undefined;
          const parsed = Number(val);
          return isNaN(parsed) ? val : parsed;
        }, z.number({
          invalid_type_error: 'Must be a number',
        }));
        break;

      case 'checkbox_group':
        validator = z.array(z.string());
        break;

      case 'file':
        validator = z.any();
        break;

      case 'signature':
        validator = z.string({
          required_error: 'Signature is required and must be drawn',
          invalid_type_error: 'Signature is required and must be drawn',
        });
        break;

      default:
        validator = z.string({
          required_error: 'This field is required',
          invalid_type_error: 'This field is required',
        });
        break;
    }

    if (field.required) {
      if (field.type === 'checkbox_group') {
        validator = (validator as z.ZodArray<z.ZodString>).min(1, { 
          message: 'At least one option must be selected' 
        });
      } else if (field.type === 'number') {
        validator = z.union([
          z.number({ invalid_type_error: 'Must be a number' }),
          z.any().refine(() => false, { message: 'This field is required' })
        ]);
      } else if (field.type === 'signature') {
        validator = (validator as z.ZodString).min(10, { 
          message: 'Signature is required and must be drawn' 
        });
      } else {
        validator = (validator as z.ZodString).min(1, { 
          message: 'This field is required' 
        });
      }
    } else {
      if (field.type === 'checkbox_group') {
        validator = validator.optional();
      } else {
        validator = validator.optional().or(z.literal(''));
      }
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
}
