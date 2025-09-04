import { RenderedFieldProps } from '@/common/form/types';

import { InputWithAdornments } from '@/components/ui/input-with-adornments';

export function TextInputField(props: RenderedFieldProps) {
  return (
    <InputWithAdornments
      id={props.field.id}
      name={props.field.name}
      type="text"
      placeholder={props.field.placeholder}
      value={props.value}
      onChange={
        props.onChange
          ? (e) => props.onChange?.(props.field.name, e.target.value)
          : undefined
      }
      className={props.hasError ? 'border-red-500' : ''}
      required={props.field.required}
    />
  );
}
