import { z } from 'zod';

export const FieldTypeEnum = z.enum(['TextInput', 'DateInput', 'TextArea']);

export const FieldConfigSchema = z.object({
  id: z.string().uuid(),
  type: FieldTypeEnum,
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean(),
  validations: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      regex: z.enum(['phone', 'email', 'curp', 'custom']).optional(),
      customRegex: z.string().optional()
    })
    .optional()
});

export const FormStepSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(FieldConfigSchema)
});

export const FormConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  infoTop: z.string().nullish(),
  infoBottom: z.string().nullish(),
  type: z.enum(['simple', 'multi-step']),
  steps: z.array(FormStepSchema)
});
