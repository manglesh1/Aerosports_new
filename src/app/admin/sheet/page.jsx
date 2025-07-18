'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import EditRowModal from '../components/EditRowModal';
import TruncatedText from '../components/TruncatedText';
import "../style.css";

export default function SheetAdminPage() {
  const [location, setLocation] = useState('all');
  const [locations] = useState(['all','oakville','london','windsor','st-catharines']);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  async function fetchSheetData(loc) {
    setLoading(true);
    setError(null);
    try {
      const query = loc !== 'all' ? `?location=${encodeURIComponent(loc)}` : '';
      const res = await fetch(`/api/sheet${query}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setRows(data.rows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSheetData(location);
    setSelectedRow(null);
  }, [location]);

  const dataKeys = rows.length > 0
    ? Object.keys(rows[0]).filter(k => {
        const lower = k.toLowerCase();
        return k !== '_rowIndex'
          && !lower.includes('sec')
          && !lower.includes('icon')
          && !lower.includes('ima')
          && !lower.includes('url')
          && !lower.includes('descrip')
          && !lower.includes('ld_')
          && !lower.includes('seo');
      })
    : [];

  const handleLocationChange = e => setLocation(e.target.value);

  const handleEditClick = row => {
    setSelectedRow(row);
    setShowEditModal(true);
  };

  // Open modal with a blank row for new record creation
  const handleNewRecord = () => {
    setSelectedRow({});  // empty object or initialize default keys
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setSelectedRow(null);
    setShowEditModal(false);
  };

  const handleEditSave = async (updatedData) => {
    try {
      let url = '/api/sheet';
      let method = 'POST'; // for new record
      console.log(selectedRow);
      if (selectedRow && selectedRow._rowIndex !== undefined && selectedRow._rowIndex !== null) {
        url += `?row=${selectedRow._rowIndex}`;
        console.log('inside clause', url);
      }else{
             url += `?row=New`;

      }
       method = 'PUT'; // for existing record update
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(`Save failed: ${result.error || result}`);
        return;
      }

      handleEditCancel();
      fetchSheetData(location);
    } catch (networkError) {
      console.error('Network or parsing error:', networkError);
    }
  };

  const handleViewMore = content => {
    setModalContent(content);
    setShowViewModal(true);
  };

  const closeViewModal = () => setShowViewModal(false);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="p-4">
      
     
      <div className="d-flex align-items-center mb-3 gap-3">
        <div>
          <label htmlFor="location-select" className="form-label">Filter by Location:</label>
          <select
            id="location-select"
            className="form-select w-auto"
            value={location}
            onChange={handleLocationChange}
          >
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <h1 className="h4 mb-4"><Button variant="success" onClick={handleNewRecord} className="ms-auto">
          + New Record
        </Button></h1>
        </div>

      
      </div>

      {/* Data grid */}
      <div style={{ maxHeight: '800px', overflowY: 'auto', width: '90vw' }}>
        <div
          style={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: `min-content repeat(${dataKeys.length}, minmax(0, 1fr))`,
            gridAutoRows: 'minmax(2rem, auto)',
          }}
        >
          {/* Headers */}
          <div className="border px-3 py-2 bg-light text-muted sticky-top" style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
            Actions
          </div>
          {dataKeys.map(key => (
            <div
              key={key}
              className="border px-3 py-2 bg-light sticky-top"
              style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
            >
              {key}
            </div>
          ))}

          {/* Data Rows */}
          {rows.map((row, i) => {
            const stripe = i % 2 === 0 ? 'bg-white' : 'bg-light';
            return (
              <React.Fragment key={i}>
                <div
                  className={`border px-2 py-2 ${stripe} text-center`}
                  onClick={() => handleEditClick(row)}
                  style={{ cursor: 'pointer', whiteSpace: 'normal', overflowWrap: 'break-word' }}
                >
                  <Button variant="link" size="sm">Edit</Button>
                </div>
                {dataKeys.map(k => (
                  <div
                    key={k}
                    className={`border px-2 py-2 ${stripe}`}
                    onClick={() => handleViewMore(row[k])}
                    style={{ cursor: 'pointer', whiteSpace: 'normal', overflowWrap: 'break-word' }}
                  >
                    {typeof row[k] === 'string' && row[k].length > 20
                      ? <TruncatedText text={row[k]} onViewMore={() => handleViewMore(row[k])} />
                      : row[k]
                    }
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      <EditRowModal
        show={showEditModal}
        rowData={selectedRow}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />

      {/* View-More modal */}
      <Modal
        show={showViewModal}
        onHide={closeViewModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Content</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <pre>{modalContent}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeViewModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
