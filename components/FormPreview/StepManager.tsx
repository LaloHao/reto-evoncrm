import { useCallback, useMemo } from 'react';
import { useFormBuilder } from '@/common/form/form';
import { toast } from 'sonner';

import { Button } from '../ui/button';

export interface StepManagerProps {
  children: React.ReactNode;
  formBuilder: ReturnType<typeof useFormBuilder>;
}

export function StepManager(props: StepManagerProps) {
  const { formBuilder } = props;

  const canSubmit = useMemo(() => {
    return (
      Object.keys(formBuilder.fieldErrors).length === 0 && formBuilder.isDirty
    );
  }, [formBuilder.fieldErrors, formBuilder.isDirty]);

  const onSubmit = useCallback(() => {
    console.log('Form submitted with values:', formBuilder.fieldValues);
    toast.success('Form submitted successfully!');
  }, [formBuilder.fieldValues]);

  return (
    <div className="flex flex-col">
      {props.children}
      <div className="mt-8 flex justify-end gap-2">
        {formBuilder.currentStep !== 0 && (
          <Button
            type="button"
            onClick={() => formBuilder.prevStep()}
            aria-label="Previous Step"
            disabled={formBuilder.currentStep === 0}
            className="btn btn-ghost"
          >
            Previous step
          </Button>
        )}
        {formBuilder.currentStep < formBuilder.form.steps.length - 1 && (
          <Button
            type="button"
            onClick={() => formBuilder.nextStep()}
            aria-label="Next Step"
            className="btn btn-primary"
          >
            Next step
          </Button>
        )}
        {formBuilder.currentStep === formBuilder.form.steps.length - 1 && (
          <Button
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
