import { FieldConfig } from '@/common/form/types';

import { InputWithAdornments } from '../ui/input-with-adornments';
import { Label } from '../ui/label';
import { FieldEditorProps } from './FieldEditor';

export interface EditInputFieldProps extends FieldEditorProps {
  disabled?: boolean;
  fieldKey: keyof FieldConfig;
  label: string;
}

export function EditInputField(props: EditInputFieldProps) {
  return (
    <div className="flex flex-col mx-8 mt-4 space-y-2">
      <Label>{props.label}</Label>
      <InputWithAdornments
        disabled={props.disabled}
        value={props.field[props.fieldKey] as string}
        maxLength={255}
        autoCapitalize="off"
        type="text"
        onChange={(e) => {
          if (props.onChange) {
            props.onChange({
              ...props.field,
              [props.fieldKey]: e.target.value
            });
          }
        }}
      />
    </div>
  );
}
