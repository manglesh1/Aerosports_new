"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import AppImage from "../../components/AppImage";

export default function MediaPicker({ open, onClose, onPick, location }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  // Default to the content row's (first) location, so the picker opens pre-filtered.
  const [locFilter, setLocFilter] = useState(String(location || "").split(",")[0].trim());

  // "Upload new" panel
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ desktop_url: "", width: "", height: "", alt: "", title: "", location: "" });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    fetch("/api/studio/sheet?tab=media")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setItems(d.rows || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  function openAdd() {
    // default the new image's location to whatever the picker is filtered to
    setDraft({ desktop_url: "", width: "", height: "", alt: "", title: "", location: locFilter || "" });
    setError("");
    setAdding(true);
  }

  async function saveNew() {
    if (!draft.desktop_url) return;
    setSaving(true);
    setError("");
    try {
      const newItem = {
        id: `media_${Date.now().toString(36)}`,
        type: "image",
        desktop_url: draft.desktop_url,
        mobile_url: "",
        alt: draft.alt,
        title: draft.title,
        width: String(draft.width || ""),
        height: String(draft.height || ""),
        location: draft.location || "",
      };
      const res = await fetch("/api/studio/sheet?tab=media&row=New", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to add to library");
      onPick(newItem); // select the image we just added
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  const term = q.trim().toLowerCase();
  const locations = Array.from(
    new Set(
      items.flatMap((m) =>
        String(m.location ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    )
  ).sort();

  // Add-form location options: existing media locations, plus the pre-filled one if missing.
  const addLocations =
    locFilter && !locations.includes(locFilter) ? [locFilter, ...locations] : locations;

  const filtered = items.filter((m) => {
    if (locFilter) {
      // show common (blank location) + images for the selected location
      const mloc = String(m.location ?? "").trim();
      const matches =
        !mloc ||
        mloc
          .split(",")
          .map((s) => s.trim())
          .includes(locFilter);
      if (!matches) return false;
    }
    if (term && ![m.id, m.title, m.alt].some((f) => String(f ?? "").toLowerCase().includes(term))) {
      return false;
    }
    return true;
  });

  return (
    <div className="studio_modal_backdrop" onClick={onClose}>
      <div className="studio_modal studio_picker" onClick={(e) => e.stopPropagation()}>
        <div className="studio_picker_head">
          <h2>Media library</h2>
          <input
            className="studio_search"
            placeholder="Search id / title / alt…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {locations.length > 0 && (
            <select
              className="studio_select"
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              title="Shows this location's images plus common (un-located) ones"
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}
          <button className="studio_btn" onClick={adding ? () => setAdding(false) : openAdd}>
            {adding ? "Cancel" : "+ Upload new"}
          </button>
          <button className="studio_btn studio_btn_ghost" onClick={onClose}>
            Close
          </button>
        </div>

        {adding && (
          <div className="studio_picker_add">
            <ImageUploader
              folder={draft.location || "media"}
              onUploaded={(r) =>
                setDraft((d) => ({ ...d, desktop_url: r.desktop_url, width: r.width, height: r.height }))
              }
            />
            {draft.desktop_url && (
              <div className="studio_picker_add_form">
                <input
                  className="studio_search"
                  placeholder="Alt text — describe the image (recommended for SEO)"
                  value={draft.alt}
                  onChange={(e) => setDraft((d) => ({ ...d, alt: e.target.value }))}
                />
                <input
                  className="studio_search"
                  placeholder="Title (optional)"
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
                <select
                  className="studio_select"
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  title="Leave as Common to share this image across all locations"
                >
                  <option value="">Common (all locations)</option>
                  {addLocations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button className="studio_btn" onClick={saveNew} disabled={saving}>
                  {saving ? "Adding…" : "Add to library & use"}
                </button>
              </div>
            )}
          </div>
        )}

        {loading && <div className="studio_muted">Loading library…</div>}
        {error && <div className="studio_error">{error}</div>}
        {!loading && !error && !filtered.length && !adding && (
          <div className="studio_muted">
            {items.length === 0
              ? "No media yet — use “+ Upload new” to add one."
              : "No media match this filter."}
          </div>
        )}

        <div className="studio_picker_grid">
          {filtered.map((m) => (
            <button
              key={m._rowIndex}
              type="button"
              className="studio_picker_item"
              onClick={() => onPick(m)}
              title={m.alt || m.title || m.id}
            >
              {m.desktop_url ? (
                <AppImage src={m.desktop_url} alt={m.alt || m.id} width={260} height={180} sizes="260px" />
              ) : (
                <div className="studio_picker_noimg">no preview</div>
              )}
              <span className="studio_picker_id">{m.id || `row ${m._rowIndex}`}</span>
              {m.title && <span className="studio_muted">{m.title}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
