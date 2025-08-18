// components/EditRowModal.jsx
'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';   // ⬅️ add this
import BootstrapForm from './BootstrapForm';
import schema from './schema.json';
import uiSchema from './uischema.json';

export default function EditRowModal({ show, rowData, onSave, onCancel }) {
  const [formData, setFormData] = React.useState(rowData || {});

  // Reset whenever a new row is selected
  React.useEffect(() => {
    setFormData(rowData || {});
  }, [rowData]);

  const formId = 'edit-row-form';

  return (
    <Modal
      show={show}
      onHide={onCancel}
      size="lg"
      centered
      scrollable
      dialogClassName="modal-dialog-scrollable"
      aria-labelledby="edit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-modal">Edit Row</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="container-fluid">
          <BootstrapForm
            id={formId}                         // ⬅️ give the form an id
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            omitExtraData
            onChange={({ formData }) => setFormData(formData)}
            onSubmit={({ formData }) => onSave(formData)}
            showErrorList
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        {/* Submit the RJSF form without DOM queries */}
        <Button variant="primary" type="submit" form={formId}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
