import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ScrollableModal = ({ show, onHide, children }) => (
  <Modal show={show} onHide={onHide} centered scrollable size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Edit/View Form</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ScrollableModal;
