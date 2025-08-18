// components/BootstrapForm.jsx
'use client';

import Form from '@rjsf/react-bootstrap';
import validator from '@rjsf/validator-ajv8';
import dynamic from 'next/dynamic';

// Load ReactQuill only on the client
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Custom rich text widget: uses Quill for very long text; otherwise a textarea
const RichTextWidget = (props) => {
  const {
    id,
    schema,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    placeholder,
    disabled,
    readonly,
    required,
  } = props;

  const v = value ?? '';
  const useQuill = (schema?.maxLength ?? 0) > 2000 || options?.useQuill;

  const handleQuillChange = (content) => onChange(content ?? '');
  const handleBlur = (val) => onBlur && onBlur(id, val);
  const handleFocus = (val) => onFocus && onFocus(id, val);

  if (useQuill) {
    return (
      <div>
        <ReactQuill
          theme="snow"
          value={v}
          onChange={handleQuillChange}
          onBlur={() => handleBlur(v)}
          onFocus={() => handleFocus(v)}
          readOnly={disabled || readonly}
        />
        {schema?.maxLength && (
          <small className="text-muted">Max {schema.maxLength} characters</small>
        )}
      </div>
    );
  }

  return (
    <textarea
      id={id}
      className="form-control"
      maxLength={schema?.maxLength}
      rows={Math.min(10, Math.ceil((schema?.maxLength || 200) / 100))}
      value={v}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => handleBlur(e.target.value)}
      onFocus={(e) => handleFocus(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      required={required}
    />
  );
};

export default function BootstrapForm(props) {
  return (
    <Form
      {...props}
      validator={validator}
      // Override both text + textarea so long fields pick up the rich widget too
      widgets={{
        TextWidget: RichTextWidget,
        TextareaWidget: RichTextWidget,
        ...(props.widgets || {}),
      }}
    />
  );
}
