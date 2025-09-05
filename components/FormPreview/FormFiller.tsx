'use client';

import { useMemo } from 'react';
import { useFormBuilder } from '@/common/form/form';
import { FormConfig } from '@/common/form/types';

import { FieldFiller } from './FieldFiller';
import { StepManager } from './StepManager';

export interface FormFillerProps {
  form: FormConfig;
}

export function FormFiller(props: FormFillerProps) {
  const formBuilder = useFormBuilder(props.form);

  const currentStep = useMemo(() => {
    return formBuilder.form.steps[formBuilder.currentStep];
  }, [formBuilder]);

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg h-full overflow-y-auto">
      <h1 className="text-2xl font-bold my-2">{formBuilder.form.title}</h1>
      <p className="mb-4">{formBuilder.form.description}</p>
      <StepManager formBuilder={formBuilder}>
        <h2 className="text-xl font-bold my-2">{currentStep.title}</h2>
        <p className="mb-8">{currentStep.description}</p>
        {currentStep.fields.map((field, index) => (
          <FieldFiller
            index={index}
            key={field.id}
            field={field}
            formBuilder={formBuilder}
          />
        ))}
      </StepManager>
    </div>
  );
}
