import { JSX, useMemo, useRef } from 'react';
import { useFormBuilder } from '@/common/form/form';
import {
  FieldConfig,
  FieldType,
  RenderedFieldProps
} from '@/common/form/types';
import type { Identifier } from 'dnd-core';
import { useDrag, useDragLayer, useDrop, XYCoord } from 'react-dnd';

import { Label } from '@/components/ui/label';

import { DateInputField } from '../FormComponents/DateInputField';
import { TextAreaField } from '../FormComponents/TextAreaField';
import { TextInputField } from '../FormComponents/TextInputField';
import { FieldEditor } from '../FormEditor/FieldEditor';

export interface RenderFieldProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  field: FieldConfig;
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableTypes = {
  FIELD: 'field'
};

export function FieldRenderer(props: RenderFieldProps) {
  // Globally detect if field is being dragged
  const { draggedId, isDraggingAny } = useDragLayer((monitor) => ({
    draggedId: monitor.getItem()?.id,
    isDraggingAny: monitor.isDragging()
  }));

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

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DraggableTypes.FIELD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      // hide edit form when dragging
      props.formBuilder.editField(null);

      const dragIndex = item.index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.formBuilder.moveField(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [, drag] = useDrag({
    type: DraggableTypes.FIELD,
    item: () => {
      return { id: props.field.id, index: props.index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  // Use global monitor to customize original rendering
  const isThisDragged = isDraggingAny && draggedId === props.field.id;
  const opacity = isThisDragged ? 'opacity-30' : 'opacity-100';
  const isEditing = props.formBuilder.editingFieldIndex === props.index;
  const height = isEditing ? '' : '';
  const hasError = !!props.formBuilder.fieldErrors[props.field.name];
  const textColor = hasError ? 'text-red-500' : 'text-gray-500';
  const borderColor = hasError ? 'border-red-500' : 'border-transparent';

  return (
    <FieldEditor
      field={props.field}
      onChange={(field) => props.formBuilder.updateField(field)}
      isEditing={isEditing}
      onEdit={() => {
        if (isEditing) {
          return props.formBuilder.editField(null);
        }
        return props.formBuilder.editField(props.index);
      }}
      onDelete={() => props.formBuilder.removeField(props.field)}
      onBlur={() => props.formBuilder.editField(null)}
    >
      <div
        className={`flex flex-col mb-5 ${opacity} ${height} transition-all`}
        ref={ref}
        data-handler-id={handlerId}
      >
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
    </FieldEditor>
  );
}
