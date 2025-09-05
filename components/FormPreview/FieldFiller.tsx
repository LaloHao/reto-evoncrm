import { JSX, useMemo, useRef } from 'react';
import { useFormBuilder } from '@/common/form/form';
import {
  FieldConfig,
  FieldType,
  RenderedFieldProps
} from '@/common/form/types';

import { Label } from '@/components/ui/label';

import { DateInputField } from '../FormComponents/DateInputField';
import { TextAreaField } from '../FormComponents/TextAreaField';
import { TextInputField } from '../FormComponents/TextInputField';

export interface FieldRendererProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  field: FieldConfig;
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function FieldFiller(props: FieldRendererProps) {
  const Component = useMemo<
    ((props: RenderedFieldProps) => JSX.Element) | null
  >(() => {
    switch (props.field.type) {
      case FieldType.TextInput:
        return TextInputField;
      case FieldType.DateInput:
        return DateInputField;
      case FieldType.TextArea:
        return TextAreaField;
      default:
        return null;
    }
  }, [props.field.type]);

  const hasError = !!props.formBuilder.fieldErrors[props.field.name];
  const textColor = hasError ? 'text-red-500' : 'text-gray-500';

  return (
    <div className={`flex flex-col mb-5 transition-all`}>
      <Label
        htmlFor={props.field.id}
        className={`mb-3 block text-base font-medium ${textColor}`}
      >
        {props.field.label}
      </Label>
      {Component && (
        <Component
          hasError={hasError}
          field={props.field}
          value={props.formBuilder.fieldValues[props.field.name] || ''}
          onChange={props.formBuilder.onChange}
        />
      )}
      {hasError && (
        <span className="text-sm text-red-500 mt-1">
          {props.formBuilder.fieldErrors[props.field.name]}
        </span>
      )}
      {props.field.helpText && !hasError && (
        <span className="text-sm text-gray-500 mt-1">
          {props.field.helpText}
        </span>
      )}
    </div>
  );
}
