import { FieldConfig, VALIDATION_PATTERNS } from '@/common/form/types';
import { z } from 'zod';

// Generar schema dinámicamente
export const generateFormSchema = (fields: FieldConfig[]) => {
  const schemaObject = fields.reduce(
    (acc: { [key: string]: z.ZodTypeAny }, field) => {
      let validation = z.string();

      // Required field
      if (field.required)
        validation = validation.min(0, 'This field is required');

      // Min length
      if (field.validations?.minLength)
        validation = validation.min(field.validations.minLength);

      // Max length
      if (field.validations?.maxLength)
        validation = validation.max(field.validations.maxLength);

      // Regex validation
      if (field.validations?.regex)
        if (field.validations.regex !== 'custom') {
          // Only apply predefined patterns if not custom
          validation = validation.regex(
            VALIDATION_PATTERNS[field.validations.regex].pattern,
            VALIDATION_PATTERNS[field.validations.regex].message
          );
        } else if (field.validations.customRegex) {
          // Custom regex
          validation = validation.regex(
            new RegExp(field.validations.customRegex),
            `Invalid value, does not match the pattern \`${field.validations.customRegex}\``
          );
        }

      // Add to schema object
      acc[field.name] = validation;
      return acc;
    },
    {}
  );

  return z.object(schemaObject);
};
