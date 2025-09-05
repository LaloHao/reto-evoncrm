import { useFormBuilder } from '@/common/form/form';

import { InputWithAdornments } from '../ui/input-with-adornments';
import { Label } from '../ui/label';

export interface FormConfigEditorProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
}

export function FormConfigEditor(props: FormConfigEditorProps) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg overflow-y-auto">
      <div className="flex flex-col mb-4 space-y-2">
        <Label>Form title</Label>
        <InputWithAdornments
          value={props.formBuilder.form.title}
          onChange={(e) =>
            props.formBuilder.setForm({
              ...props.formBuilder.form,
              title: e.target.value
            })
          }
        />
      </div>
      <div className="flex flex-col mb-4 space-y-2">
        <Label>Form Description</Label>
        <InputWithAdornments
          value={props.formBuilder.form.description}
          onChange={(e) =>
            props.formBuilder.setForm({
              ...props.formBuilder.form,
              description: e.target.value
            })
          }
        />
      </div>
      <div className="flex flex-col mb-4 space-y-2">
        <Label>Step title</Label>
        <InputWithAdornments
          value={
            props.formBuilder.form.steps[props.formBuilder.currentStep].title
          }
          onChange={(e) =>
            props.formBuilder.setForm({
              ...props.formBuilder.form,
              steps: props.formBuilder.form.steps.map((step, index) =>
                index === props.formBuilder.currentStep
                  ? { ...step, title: e.target.value }
                  : step
              )
            })
          }
        />
      </div>
      <div className="flex flex-col mb-4 space-y-2">
        <Label>Step Description</Label>
        <InputWithAdornments
          value={
            props.formBuilder.form.steps[props.formBuilder.currentStep]
              .description
          }
          onChange={(e) =>
            props.formBuilder.setForm({
              ...props.formBuilder.form,
              steps: props.formBuilder.form.steps.map((step, index) =>
                index === props.formBuilder.currentStep
                  ? { ...step, description: e.target.value }
                  : step
              )
            })
          }
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={props.formBuilder.addStep}
        >
          Add step
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={props.formBuilder.removeCurrentStep}
        >
          Remove step
        </button>
      </div>
    </div>
  );
}
