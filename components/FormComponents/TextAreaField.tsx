import React, { useEffect, useRef } from 'react';
import { RenderedFieldProps } from '@/common/form/types';

import { Textarea } from '../ui/textarea';

export function TextAreaField(props: RenderedFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <Textarea
      ref={textareaRef}
      id={props.field.id}
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.value}
      onChange={
        props.onChange
          ? (e) => props.onChange?.(props.field.name, e.target.value)
          : undefined
      }
      onInput={handleInput}
      required={props.field.required}
      className={props.hasError ? 'border-red-500' : ''}
    />
  );
}
