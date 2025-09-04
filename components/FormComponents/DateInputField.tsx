import { RenderedFieldProps } from '@/common/form/types';

import { InputWithAdornments } from '../ui/input-with-adornments';

export function DateInputField(props: RenderedFieldProps) {
  return (
    <InputWithAdornments
      type="date"
      id={props.field.name}
      name={props.field.name}
      required={props.field.required}
      value={props.value}
      onChange={
        props.onChange
          ? (e) => props.onChange?.(props.field.name, e.target.value)
          : undefined
      }
      className={props.hasError ? 'border-red-500' : ''}
    />
  );
}
