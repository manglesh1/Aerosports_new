// components/EditRowModal.jsx
'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import BootstrapForm from './BootstrapForm';
import schema from './schema.json';
import uiSchema from './uischema.json';
import validator from '@rjsf/validator-ajv8';

export default function EditRowModal({ show, rowData, onSave, onCancel }) {
  const [formData, setFormData] = React.useState(rowData || {});

  // Reset whenever a new row is selected
  React.useEffect(() => {
    setFormData(rowData || {});
  }, [rowData]);

  return (
    <Modal
      show={show}
      onHide={onCancel}
      size="lg"                    // contained width
      centered                     // vertical centering
      scrollable                   // body scroll only
      dialogClassName="modal-dialog-scrollable"
      aria-labelledby="edit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-modal">Edit Row</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="container-fluid">
          <BootstrapForm
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            validator={validator}
             omitExtraData={true}    
            onChange={({ formData }) => setFormData(formData)}
            onSubmit={({ formData }) => onSave(formData)}
            showErrorList={true}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => document.querySelector('form').requestSubmit()}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
