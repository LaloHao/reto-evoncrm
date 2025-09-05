import { FieldConfig } from '@/common/form/types';

import { Label } from '../ui/label';
import { FieldEditorProps } from './FieldEditor';

export interface EditBooleanFieldProps extends FieldEditorProps {
  fieldKey: keyof FieldConfig;
  label: string;
}

export function EditBooleanField(props: EditBooleanFieldProps) {
  return (
    <div className="flex items-center mx-8 mt-4 space-x-2">
      <input
        type="checkbox"
        checked={props.field[props.fieldKey] as boolean}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange({
              ...props.field,
              [props.fieldKey]: e.target.checked
            });
          }
        }}
      />
      <Label>{props.label}</Label>
    </div>
  );
}
