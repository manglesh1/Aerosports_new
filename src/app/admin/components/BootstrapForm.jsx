// components/BootstrapForm.jsx
'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';            // Quill styles
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { withTheme } from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';

// Dynamically load react-quill on client only
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Use ReactQuill for very long text, else a textarea with maxlength
const RichTextWidget = ({ schema, id, value, onChange }) => {
  if (schema.maxLength > 2000) {
    return <ReactQuill theme="snow" value={value || ''} onChange={onChange} />;
  }
  return (
    <textarea
      id={id}
      className="form-control"
      maxLength={schema.maxLength}
      rows={Math.min(10, Math.ceil((schema.maxLength||0)/100))}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  );
};

// Wrap the core Form with the Bootstrap-4 theme and our widget override
const BootstrapForm = withTheme(Bootstrap4Theme, {
  widgets: { TextWidget: RichTextWidget }
});

export default BootstrapForm;
