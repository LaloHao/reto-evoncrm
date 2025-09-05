import { useFormBuilder } from '@/common/form/form';

export interface StepManagerProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  children: React.ReactNode;
}

export function StepManager(props: StepManagerProps) {
  return (
    <div className="flex items-center">
      {props.formBuilder.currentStep === 0 ? (
        <span className="btn btn-ghost invisible">←</span>
      ) : (
        <button
          type="button"
          onClick={() => props.formBuilder.prevStep()}
          aria-label="Previous Step"
          className="btn btn-ghost"
        >
          ←
        </button>
      )}
      <div className="flex-1 mx-4">{props.children}</div>
      {props.formBuilder.currentStep ===
      props.formBuilder.form.steps.length - 1 ? (
        <span className="btn btn-ghost invisible">→</span>
      ) : (
        <button
          type="button"
          onClick={() => props.formBuilder.nextStep()}
          aria-label="Next Step"
          className="btn btn-ghost"
        >
          →
        </button>
      )}
    </div>
  );
}
