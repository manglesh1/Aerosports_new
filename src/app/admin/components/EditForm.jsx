"use client";

import React, { useState, useEffect } from "react";

export default function EditForm({ row, onClose, onUpdated, onDeleted }) {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(row || {});
  }, [row]);

  if (!row) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/sheet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex: row._rowIndex, updatedData: formData }),
      });
      if (!res.ok) throw new Error("Failed to save");
      onUpdated();
      onClose();
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this row?")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/sheet?rowIndex=${row._rowIndex}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      onDeleted();
      onClose();
    } catch (e) {
      setError(e.message);
    }
    setDeleting(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px", marginTop: "1rem", background: "#fff" }}>
      
      <h3>Edit Row</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {Object.entries(formData).map(([key, value]) => {
        if (key === "_rowIndex") return null; // hide internal index
        return (
          <div key={key} style={{ marginBottom: "0.5rem" }}>
            <label htmlFor={key} style={{ fontWeight: "bold" }}>{key}</label>
            <input
              id={key}
              name={key}
              value={value || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.3rem", marginTop: "0.2rem" }}
            />
          </div>
        );
      })}
      <button onClick={handleSave} disabled={saving} style={{ marginRight: "1rem" }}>
        {saving ? "Saving..." : "Save"}
      </button>
      <button onClick={handleDelete} disabled={deleting} style={{ backgroundColor: "red", color: "white" }}>
        {deleting ? "Deleting..." : "Delete"}
      </button>
      <button onClick={onClose} style={{ marginLeft: "1rem" }}>
        Cancel
      </button>
    </div>
  );
}
