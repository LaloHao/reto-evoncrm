'use client';

import { useCallback, useState } from 'react';
import { FieldConfig, FormConfig } from './types';
import update from 'immutability-helper';
import { useEffect, useRef } from 'react';

export function createSimpleForm(): FormConfig {
  return {
    steps: [
      {
        title: 'First step',
        fields: [],
      },
    ],
    type: 'simple',
    title: 'Simple form',
    description: 'A very simple form',
  };
}

// Main hook
export function useFormBuilder() {
  const [form, setForm] = useState<FormConfig>(createSimpleForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // TODO: Auto-save every 2s if there are changes
  useAutoSave(form, isDirty)

  useEffect(() => {
    const savedForm = localStorage.getItem('form-builder-draft');
    if (savedForm) {
      trySetForm(savedForm);
    }
    setIsLoadingForm(false);
  }, []);

  const clearForm = useCallback(() => {
    setForm(createSimpleForm());
    setCurrentStep(0);
    setIsDirty(false);
  }, []);

  const addField = useCallback(
    (field: FieldConfig) => {
      const step = update(form.steps[currentStep], {
        fields: { $push: [field] },
      });
      const steps = update(form.steps, {
        [currentStep]: { $set: step },
      });
      setForm({
        ...form,
        steps,
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
        [currentStep]: { fields: { $set: fields } },
      });
      setForm({
        ...form,
        steps,
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
            [currentStep]: { fields: { $set: fields } },
          },
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
  }, [])

  const updateField = useCallback((updatedField: FieldConfig) => {
    setForm((prevForm) => {
      const step = update(prevForm.steps[currentStep], {
        fields: {
          $apply: (fields: FieldConfig[]) =>
            fields.map((field) =>
              field.id === updatedField.id
                ? {
                    ...updatedField,
                    name: kebabCase(updatedField.label),
                  }
                : field
            ),
        },
      });
      const steps = update(prevForm.steps, {
        [currentStep]: { $set: step },
      });
      return {
        ...prevForm,
        steps,
      };
    });
  }, [currentStep]);

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
    editingFieldIndex,
  };
}

const kebabCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

function useAutoSave(form: FormConfig, isDirty: boolean) {
  const throttledSave = useThrottledFunction((form: FormConfig) => {
    localStorage.setItem('form-builder-draft', JSON.stringify(form));
  }, 2000);

  useEffect(() => {
    // if (!isDirty) return;
    throttledSave(form);
  }, [form, isDirty]);
}

function useThrottledFunction(f: (...args: any[]) => void, delay: number) {
  const lastRan = useRef(Date.now());
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const throttled = useCallback((...args: any[]) => {
    const now = Date.now();

    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      f(...args);
    } else {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        lastRan.current = Date.now();
        f(...args);
      }, delay - (now - lastRan.current));
    }
  }, [f, delay]);

  return throttled;
}