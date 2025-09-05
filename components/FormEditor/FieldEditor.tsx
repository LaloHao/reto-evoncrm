import { ReactNode, useState } from 'react';
import { FieldConfig } from '@/common/form/types';

import { Label } from '../ui/label';
import { EditBooleanField } from './EditBooleanField';
import { EditInputField } from './EditInputField';
import { EditNumberField } from './EditNumberField';
import { EditRegex } from './EditRegex';

export interface FieldEditorProps {
  children: ReactNode;
  onChange?: (field: FieldConfig) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  field: FieldConfig;
  onBlur?: () => void;
}

export function FieldEditor(props: FieldEditorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const style = props.isEditing
    ? 'border-2 border-dashed border-blue-400' // hover
    : '';

  return (
    <div
      className={`relative ${style}`}
      // onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onBlur={(e) => {
        // Only call onBlur if focus moves outside this div (not to a child)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          props.onBlur?.();
        }
      }}
      // onFocusCapture={(e) => e.preventDefault()} // Prevent focus bubbling to children
    >
      {props.children}
      {props.isEditing && (
        <div className="shadow-lg rounded-lg pt-8 mb-4 bg-gray-50">
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-border h-px w-full"
          ></div>
          <div className="flex flex-col space-y-2">
            <EditBooleanField
              fieldKey="required"
              label="Required"
              {...props}
            />
            <EditInputField
              fieldKey="label"
              label="Label"
              {...props}
            />
            <EditInputField
              disabled
              fieldKey="name"
              label="Name"
              {...props}
            />
            <EditInputField
              fieldKey="placeholder"
              label="Placeholder"
              {...props}
            />
            <EditInputField
              fieldKey="helpText"
              label="Help Text"
              {...props}
            />
            <div className="flex items-center mx-8 mt-4 space-x-2">
              <input
                name="validations"
                type="checkbox"
                checked={!!props.field.validations}
                onChange={(e) => {
                  if (props.onChange) {
                    props.onChange({
                      ...props.field,
                      validations: e.target.checked ? {} : undefined
                    });
                  }
                }}
              />
              <Label htmlFor="validations">Validate</Label>
            </div>
            {props.field.validations && (
              <>
                <div className="flex items-center mx-8 mt-4 space-x-2">
                  <input
                    name="minLength"
                    type="checkbox"
                    checked={!!props.field.validations.minLength}
                    onChange={(e) => {
                      if (props.onChange) {
                        props.onChange({
                          ...props.field,
                          validations: {
                            ...props.field.validations,
                            minLength: e.target.checked ? 1 : undefined
                          }
                        });
                      }
                    }}
                  />
                  <Label htmlFor="minLength">Min Length</Label>
                  {props.field.validations.minLength && (
                    <EditNumberField
                      fieldKey="validations.minLength"
                      {...props}
                    />
                  )}
                </div>
                <div className="flex items-center mx-8 space-x-2">
                  <input
                    name="maxLength"
                    type="checkbox"
                    checked={!!props.field.validations.maxLength}
                    onChange={(e) => {
                      if (props.onChange) {
                        props.onChange({
                          ...props.field,
                          validations: {
                            ...props.field.validations,
                            maxLength: e.target.checked ? 255 : undefined
                          }
                        });
                      }
                    }}
                  />
                  <Label htmlFor="maxLength">Max Length</Label>
                  {props.field.validations.maxLength && (
                    <EditNumberField
                      fieldKey="validations.maxLength"
                      {...props}
                    />
                  )}
                </div>
                <EditRegex {...props} />
              </>
            )}
          </div>
          <div className="my-4">&nbsp;</div>
        </div>
      )}
      {isHovered && (
        <div className="absolute right-2 top-0 flex gap-2 bg-white rounded shadow-lg p-1 z-1000">
          {props.onEdit && (
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit"
              onClick={props.onEdit}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-9.3 9.3-2.3.7.7-2.3 9.3-9.3z"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </button>
          )}
          {props.onDelete && (
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              title="Delete"
              onClick={props.onDelete}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  d="M6 6l8 8M6 14L14 6"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
