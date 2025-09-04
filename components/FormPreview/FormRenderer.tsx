import { useMemo, useRef, useState } from 'react';
import { useFormBuilder } from '@/common/form/form';

import { FieldRenderer } from './FieldRenderer';

export interface FormRendererProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
}

export function FormRenderer(props: FormRendererProps) {
  const { formBuilder } = props;

  const currentStep = useMemo(() => {
    return formBuilder.form.steps[formBuilder.currentStep];
  }, [formBuilder]);

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg h-full overflow-y-auto">
      <h1 className="text-2xl font-bold my-2">{formBuilder.form.title}</h1>
      <p className="mb-4">{formBuilder.form.description}</p>
      <h2 className="text-xl font-bold my-2">{currentStep.title}</h2>
      <p className="mb-8">{currentStep.description}</p>
      {currentStep.fields.map((field, index) => (
        <FieldRenderer
          index={index}
          key={field.id}
          field={field}
          formBuilder={formBuilder}
        />
      ))}
    </div>
  );
}
