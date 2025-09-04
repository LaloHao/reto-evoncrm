import { FieldRegexType } from '@/common/form/types';

import { InputWithAdornments } from '../ui/input-with-adornments';
import { Label } from '../ui/label';
import { FieldEditorProps } from './FieldEditor';

export interface EditRegexProps extends FieldEditorProps {}

export function EditRegex(props: EditRegexProps) {
  return (
    <div className="flex flex-row mx-8 items-center space-x-4">
      <Label>Regex</Label>
      <select
        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={props.field.validations?.regex ?? ''}
        onChange={(e) => {
          let validations = props.field.validations || {};
          if (!e.target.value || e.target.value === '') {
            const { regex, customRegex, ...v } = validations;
            validations = v;
          } else {
            if (e.target.value !== FieldRegexType.Custom) {
              delete validations.customRegex;
            }
            validations.regex = e.target.value as FieldRegexType;
          }
          props.onChange?.({
            ...props.field,
            validations
          });
        }}
      >
        <option value="">No validation</option>
        <option value={FieldRegexType.Phone}>Phone</option>
        <option value={FieldRegexType.Email}>Email</option>
        <option value={FieldRegexType.Curp}>CURP</option>
        <option value={FieldRegexType.Custom}>Custom</option>
      </select>
      {/* TODO: validate custom regex */}
      {props.field.validations?.regex === FieldRegexType.Custom && (
        <InputWithAdornments
          value={props.field.validations.customRegex || ''}
          maxLength={255}
          autoCapitalize="off"
          type="text"
          onChange={(e) => {
            if (props.onChange) {
              let validations = props.field.validations || {};
              if (!e.target.value || e.target.value === '') {
                const { customRegex, ...v } = validations;
                validations = v;
              } else {
                validations.customRegex = e.target.value;
              }
              props.onChange({
                ...props.field,
                validations
              });
            }
          }}
        />
      )}
    </div>
  );
}
