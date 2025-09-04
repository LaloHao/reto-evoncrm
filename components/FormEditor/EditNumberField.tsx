import { FieldConfig } from '@/common/form/types';

import { InputWithAdornments } from '../ui/input-with-adornments';
import { Label } from '../ui/label';
import { FieldEditorProps } from './FieldEditor';

export interface EditNumberFieldProps extends FieldEditorProps {
  disabled?: boolean;
  fieldKey: keyof FieldConfig | `${keyof FieldConfig}.${string}`;
  label: string;
}

export function EditNumberField(props: EditNumberFieldProps) {
  return (
    <div className="flex flex-row mx-8 mt-4 space-x-2">
      <Label>{props.label}</Label>
      <InputWithAdornments
        className="w-32"
        disabled={props.disabled}
        value={
          props.fieldKey.includes('.')
            ? String(
                (
                  props.field[
                    props.fieldKey.split('.')[0] as keyof FieldConfig
                  ] as Record<string, unknown> | undefined
                )?.[props.fieldKey.split('.')[1]] ?? ''
              )
            : (props.field[props.fieldKey as keyof FieldConfig] as string)
        }
        type="number"
        min={0}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            // allow only positive numbers and decimals
            if (props.onChange) {
              if (props.fieldKey.includes('.')) {
                const [parentKey, childKey] = props.fieldKey.split('.') as [
                  keyof FieldConfig,
                  string
                ];
                props.onChange({
                  ...props.field,
                  [parentKey]: {
                    ...((props.field[parentKey] as Record<string, unknown>) ||
                      {}),
                    [childKey]: value
                  }
                });
              } else {
                props.onChange({
                  ...props.field,
                  [props.fieldKey]: value
                });
              }
            }
          }
        }}
      />
    </div>
  );
}
