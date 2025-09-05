'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import update from 'immutability-helper';

import { generateFormSchema } from '@/schemas/forms/generate-form-schema';

import { FieldConfig, FormConfig } from './types';

export function createSimpleForm(): FormConfig {
  return {
    steps: [
      {
        title: 'First step',
        fields: []
      }
    ],
    type: 'simple',
    title: 'Simple form',
    description: 'A very simple form'
  };
}

// Main hook
export function useFormBuilder(initialForm?: FormConfig) {
  const [form, setForm] = useState<FormConfig>(initialForm || createSimpleForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // auto-save form every 2 seconds if there are changes
  useAutoSaveForm(form, !initialForm);
  // auto-save form values every 2 seconds if there are changes
  useAutoSaveValues(initialForm?.id, fieldValues, isDirty);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, form.steps.length - 1));
  }, [form]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const addStep = useCallback(() => {
    setForm((prevForm) => ({
      ...prevForm,
      steps: [
        ...prevForm.steps,
        { title: `Step ${prevForm.steps.length + 1}`, fields: [] }
      ]
    }));
    setCurrentStep(form.steps.length); // move to the new step
  }, [form]);

  const removeStep = useCallback(
    (index: number) => {
      if (form.steps.length === 1) return; // always keep at least one step
      setForm((prevForm) => {
        const steps = prevForm.steps.filter((_, i) => i !== index);
        return {
          ...prevForm,
          steps
        };
      });
      setCurrentStep((prev) => Math.max(0, prev - 1));
    },
    [form]
  );

  const removeCurrentStep = useCallback(() => {
    removeStep(currentStep);
  }, [currentStep, removeStep]);

  // State to hold field values
  const validateFieldChanges = useCallback(
    (fieldName: string, value: any) => {
      const schema = generateFormSchema(form.steps[currentStep].fields);
      const result = schema.safeParse({ [fieldName]: value });
      if (result.success) {
        setFieldErrors({}); // clear all errors
        // console.log(`${fieldName} is valid`);
      } else {
        const error = result.error.errors.find(
          (err) => err.path[0] === fieldName
        );

        // console.log(error);
        if (!error) {
          setFieldErrors((prev) => {
            const { [fieldName]: _, ...rest } = prev;
            return rest;
          });
        } else {
          // debugger;
          setFieldErrors((prev) => ({
            ...prev,
            [fieldName]: error!.message
          }));
          // console.log('Validation errors:', result.error.errors);
        }
      }
    },
    [form, currentStep, fieldValues, setFieldErrors]
  );

  // Generic onChange handler for fields
  const onChange = useCallback(
    (fieldName: string, value: any) => {
      setFieldValues((prev) => ({
        ...prev,
        [fieldName]: value || ''
      }));
      setIsDirty(true);
      // throttledValidation(fieldName);
      validateFieldChanges(fieldName, value);
    },
    [setFieldValues, validateFieldChanges, setIsDirty]
  );

  // TODO: reconsider using a throttled function for validation
  // to avoid excessive validations on fast typing
  // const throttledValidation = useThrottledFunction(validateFieldChanges, 1000);

  // Load form from localStorage on mount
  useEffect(() => {
    // don't load anything from local storage if we already have an initial form
    if (initialForm) {
      setIsLoadingForm(false);
      return;
    }
    const savedForm = localStorage.getItem('form-builder-draft');
    if (savedForm) {
      trySetForm(savedForm);
    }
    setIsLoadingForm(false);
  }, []);

  // Load form values from localStorage on mount
  useEffect(() => {
    if (!initialForm) return;
    const savedValues = localStorage.getItem(`form-${initialForm.id}`);
    if (savedValues) {
      try {
        const parsed = JSON.parse(savedValues);
        if (typeof parsed === 'object' && parsed !== null) {
          setFieldValues(parsed);
        }
      } catch (e) {
        console.error('Invalid saved form values', e);
      }
    }
  }, [initialForm]);

  const clearForm = useCallback(() => {
    setForm(createSimpleForm());
    localStorage.removeItem('form-builder-draft');
    setCurrentStep(0);
    setIsDirty(false);
  }, []);

  const addField = useCallback(
    (field: FieldConfig) => {
      const step = update(form.steps[currentStep], {
        fields: { $push: [field] }
      });
      const steps = update(form.steps, {
        [currentStep]: { $set: step }
      });
      setForm({
        ...form,
        steps
      });
    },
    [currentStep, form]
  );

  const removeField = useCallback(
    (field: FieldConfig) => {
      const fields = form.steps[currentStep].fields.filter(
        (f) => f.id !== field.id
      );
      const steps = update(form.steps, {
        [currentStep]: { fields: { $set: fields } }
      });
      setForm({
        ...form,
        steps
      });
    },
    [currentStep, form]
  );

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setForm((prevForm) => {
        const fields = [...prevForm.steps[currentStep].fields];
        const [removed] = fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, removed);
        return update(prevForm, {
          steps: {
            [currentStep]: { fields: { $set: fields } }
          }
        });
      });
    },
    [currentStep]
  );

  const trySetForm = useCallback((newForm: string) => {
    try {
      const parsed = JSON.parse(newForm);
      // Basic runtime check to ensure parsed is a FormConfig
      if (
        typeof parsed !== 'object' ||
        !parsed ||
        !Array.isArray(parsed.steps) ||
        typeof parsed.type !== 'string' ||
        typeof parsed.title !== 'string' ||
        typeof parsed.description !== 'string'
      ) {
        throw new Error('Parsed object is not a valid FormConfig');
      }
      setForm(parsed);
      setIsDirty(false);
    } catch (e) {
      // TODO: dispatch a toast/notification instead
      console.error('Invalid JSON', e);
    }
  }, []);

  const editField = useCallback((index: number | null) => {
    setEditingFieldIndex(index);
  }, []);

  const updateField = useCallback(
    (updatedField: FieldConfig) => {
      setForm((prevForm) => {
        const step = update(prevForm.steps[currentStep], {
          fields: {
            $apply: (fields: FieldConfig[]) =>
              fields.map((field) =>
                field.id === updatedField.id
                  ? {
                      ...updatedField,
                      name: kebabCase(updatedField.label)
                    }
                  : field
              )
          }
        });
        const steps = update(prevForm.steps, {
          [currentStep]: { $set: step }
        });
        return {
          ...prevForm,
          steps
        };
      });
    },
    [currentStep]
  );

  return {
    form,
    currentStep,
    isDirty,
    isLoading: isLoadingForm,
    clearForm,
    addField,
    removeField,
    moveField,
    trySetForm,
    updateField,
    editField,
    setForm,
    fieldValues,
    fieldErrors,
    onChange,
    editingFieldIndex,
    nextStep,
    prevStep,
    addStep,
    removeStep,
    removeCurrentStep
  };
}

const kebabCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

function useAutoSaveForm(form: FormConfig, enabled: boolean) {
  const throttledSave = useThrottledFunction((form: FormConfig) => {
    localStorage.setItem('form-builder-draft', JSON.stringify(form));
  }, 2000);

  useEffect(() => {
    if (!enabled) return;
    throttledSave(form);
  }, [form, enabled]);
}

function useAutoSaveValues(
  formId: string | undefined,
  formValues: Record<string, any>,
  isDirty: boolean
) {
  const throttledSave = useThrottledFunction(
    (formValues: Record<string, any>) => {
      localStorage.setItem(`form-${formId}`, JSON.stringify(formValues));
    },
    2000
  );

  useEffect(() => {
    if (!formId) return;
    throttledSave(formValues);
  }, [formValues, isDirty, formId]);
}

function useThrottledFunction(f: (...args: any[]) => void, delay: number) {
  const lastRan = useRef(Date.now());
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const throttled = useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (now - lastRan.current >= delay) {
        lastRan.current = now;
        f(...args);
      } else {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(
          () => {
            lastRan.current = Date.now();
            f(...args);
          },
          delay - (now - lastRan.current)
        );
      }
    },
    [f, delay]
  );

  return throttled;
}
