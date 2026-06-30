"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import MediaPicker from "./MediaPicker";
import AppImage from "../../components/AppImage";

function textareaRows(v) {
  const s = String(v ?? "");
  const byLen = Math.ceil(s.length / 70);
  const byLines = s.split("\n").length;
  return Math.min(18, Math.max(3, Math.max(byLen, byLines)));
}

function isImageUrl(s) {
  return /^https?:\/\/\S+\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(s) || /\/webp\//i.test(s);
}

function isJsonString(s) {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

// Pretty-print JSON; returns the input unchanged if it doesn't parse.
function formatJsonString(value) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

// Pretty-print HTML via js-beautify (loaded on demand). wrap_line_length:0 keeps
// long inline runs / style="…" on one line so rendering is unchanged.
async function beautifyHtmlString(value) {
  const mod = await import("js-beautify");
  const beautify = mod.html || mod.default?.html || mod.default;
  return beautify(String(value ?? ""), {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    end_with_newline: false,
  });
}

// Fields that likely reference an image — show a "Pick from library" affordance.
function isMediaField(name) {
  return /image|img|photo|media|banner|logo|icon|poster|thumb|gallery|hero/i.test(String(name));
}

// Decide which editor a field gets, from its name + current value.
function kindOf(name, value, mediaById) {
  const s = String(value ?? "").trim();
  if (mediaById && s && !/\s/.test(s) && mediaById.has(s)) return "imageId";
  if (/json/i.test(name) || ((s.startsWith("{") || s.startsWith("[")) && isJsonString(s))) return "json";
  if (/<[a-z!/][\s\S]*>/i.test(s)) return "html";
  if (isImageUrl(s)) return "imageUrl";
  if (/^https?:\/\//i.test(s)) return "url";
  if (s.includes("\n") || s.length > 80) return "long";
  return "short";
}

function JsonEditor({ id, value, onChange }) {
  const t = String(value ?? "").trim();
  let valid = true;
  let err = "";
  if (t) {
    try {
      JSON.parse(t);
    } catch (e) {
      valid = false;
      err = e.message;
    }
  }
  return (
    <div className="studio_editor">
      <div className="studio_editor_bar">
        <span className="studio_editor_tag">JSON</span>
        <button
          type="button"
          className="studio_link"
          disabled={!valid || !t}
          onClick={() => onChange(formatJsonString(value))}
        >
          Format
        </button>
        {t && (
          <span className={valid ? "studio_editor_ok" : "studio_editor_bad"}>
            {valid ? "✓ valid" : `✗ ${err}`}
          </span>
        )}
      </div>
      <textarea
        id={id}
        className="studio_code"
        rows={textareaRows(value)}
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function HtmlEditor({ id, value, onChange }) {
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);

  async function format() {
    setBusy(true);
    try {
      onChange(await beautifyHtmlString(value));
    } catch {
      /* leave value unchanged if the formatter fails to load/run */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="studio_editor">
      <div className="studio_editor_bar">
        <span className="studio_editor_tag">HTML</span>
        <button
          type="button"
          className="studio_link"
          onClick={format}
          disabled={busy || preview || !String(value ?? "").trim()}
        >
          {busy ? "Formatting…" : "Format"}
        </button>
        <button type="button" className="studio_link" onClick={() => setPreview((p) => !p)}>
          {preview ? "✎ Edit code" : "👁 Preview"}
        </button>
      </div>
      {preview ? (
        <iframe className="studio_html_preview" title="HTML preview" srcDoc={value} sandbox="" />
      ) : (
        <textarea
          id={id}
          className="studio_code"
          rows={textareaRows(value)}
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// Resolve a media id to its image + metadata, instead of showing the raw id.
function ImageIdField({ value, media, onPick, onClear }) {
  return (
    <div className="studio_imgid">
      {media?.desktop_url ? (
        <AppImage className="studio_imgid_thumb" src={media.desktop_url} alt={media.alt || value} width={180} height={120} sizes="180px" />
      ) : (
        <div className="studio_imgid_missing">⚠ not in library</div>
      )}
      <div className="studio_imgid_meta">
        <code className="studio_imgid_id">{value}</code>
        {media?.alt && <div className="studio_muted">alt: {media.alt}</div>}
        {media?.title && <div className="studio_muted">title: {media.title}</div>}
        {(media?.width || media?.height) && (
          <div className="studio_muted">
            {media.width} × {media.height}
          </div>
        )}
        {media?.location && <div className="studio_muted">location: {media.location}</div>}
        <div className="studio_imgid_actions">
          <button type="button" className="studio_link" onClick={onPick}>
            Change
          </button>
          <button type="button" className="studio_link studio_danger" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RowEditor({ tab, row }) {
  const router = useRouter();
  const isNew = row === "new";

  const [headers, setHeaders] = useState([]);
  const [values, setValues] = useState({});
  const [mediaById, setMediaById] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickerField, setPickerField] = useState(null);

  const backToTab = `/studio/${encodeURIComponent(tab)}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [res, mediaRes] = await Promise.all([
        fetch(`/api/studio/sheet?tab=${encodeURIComponent(tab)}`),
        tab === "media" ? Promise.resolve(null) : fetch(`/api/studio/sheet?tab=media`),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const hdrs = data.headers || [];
      setHeaders(hdrs);

      if (mediaRes) {
        const md = await mediaRes.json().catch(() => ({}));
        const map = new Map();
        (md.rows || []).forEach((r) => {
          if (r.id) map.set(String(r.id).trim(), r);
        });
        setMediaById(map);
      } else {
        setMediaById(null);
      }

      const init = {};
      if (isNew) {
        hdrs.forEach((h) => (init[h] = ""));
      } else {
        const found = (data.rows || []).find((r) => String(r._rowIndex) === String(row));
        if (!found) throw new Error(`Row ${row} not found`);
        hdrs.forEach((h) => (init[h] = found[h] ?? ""));
        // Open tidy: pretty-print JSON & HTML fields up front (non-destructive).
        for (const h of hdrs) {
          const kind = kindOf(h, init[h], null);
          if (kind === "json") init[h] = formatJsonString(init[h]);
          else if (kind === "html") {
            try {
              init[h] = await beautifyHtmlString(init[h]);
            } catch {
              /* keep raw on failure */
            }
          }
        }
      }
      setValues(init);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab, row, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  function setField(h, val) {
    setValues((v) => ({ ...v, [h]: val }));
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/studio/sheet?tab=${encodeURIComponent(tab)}&row=${isNew ? "New" : row}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push(backToTab);
      router.refresh();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew) return;
    if (!confirm("Delete this row? This edits the live sheet.")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/studio/sheet?tab=${encodeURIComponent(tab)}&rowIndex=${row}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.push(backToTab);
      router.refresh();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  if (loading) return <div className="studio_muted">Loading…</div>;

  const title = headers.length ? values[headers[0]] : "";

  return (
    <div className="studio_pp">
      <div className="studio_pp_head">
        <h1 className="studio_pp_title">{isNew ? `New row in ${tab}` : title || `Row #${row}`}</h1>
        <p className="studio_muted">
          {isNew ? "Fill in the fields and create the row." : `Editing ${tab} · row #${row}`} · saves to the live sheet
        </p>
      </div>

      {error && <div className="studio_error studio_block">{error}</div>}

      {tab === "media" && (
        <ImageUploader
          folder={values.id || values.title || "media"}
          onUploaded={(r) => {
            setField("desktop_url", r.desktop_url);
            if (r.width) setField("width", String(r.width));
            if (r.height) setField("height", String(r.height));
            setValues((v) => (v.id ? v : { ...v, id: `media_${Date.now().toString(36)}` }));
            if (!values.type) setField("type", "image");
          }}
        />
      )}

      <div className="studio_pp_grid">
        {headers.map((h) => {
          const v = values[h] ?? "";
          const kind = kindOf(h, v, mediaById);
          const full = kind === "json" || kind === "html" || kind === "long" || kind === "imageId";
          return (
            <div key={h} className={`studio_pp_field ${full ? "studio_pp_full" : ""}`}>
              <label className="studio_pp_label" htmlFor={`f_${h}`}>
                {h}
              </label>

              {kind === "imageId" ? (
                <ImageIdField
                  value={v}
                  media={mediaById?.get(String(v).trim())}
                  onPick={() => setPickerField(h)}
                  onClear={() => setField(h, "")}
                />
              ) : kind === "json" ? (
                <JsonEditor id={`f_${h}`} value={v} onChange={(val) => setField(h, val)} />
              ) : kind === "html" ? (
                <HtmlEditor id={`f_${h}`} value={v} onChange={(val) => setField(h, val)} />
              ) : kind === "long" ? (
                <textarea
                  id={`f_${h}`}
                  rows={textareaRows(v)}
                  value={v}
                  onChange={(e) => setField(h, e.target.value)}
                />
              ) : (
                <input id={`f_${h}`} value={v} onChange={(e) => setField(h, e.target.value)} />
              )}

              {kind === "imageUrl" && v && <AppImage className="studio_pp_img" src={v} alt={h} width={600} height={400} sizes="600px" />}
              {kind === "url" && (
                <a className="studio_pp_link" href={v} target="_blank" rel="noreferrer">
                  Open link ↗
                </a>
              )}

              {tab !== "media" && kind !== "imageId" && isMediaField(h) && (
                <button type="button" className="studio_link" onClick={() => setPickerField(h)}>
                  📷 Pick from library
                </button>
              )}
            </div>
          );
        })}
      </div>

      {pickerField && (
        <MediaPicker
          open
          location={values.location}
          onClose={() => setPickerField(null)}
          onPick={(m) => {
            setField(pickerField, m.id || m.desktop_url || "");
            // Make a just-picked / just-uploaded media id resolve immediately
            // (its thumbnail + alt) without needing a reload.
            if (m && m.id) {
              setMediaById((prev) => {
                const next = new Map(prev || []);
                next.set(String(m.id).trim(), m);
                return next;
              });
            }
            setPickerField(null);
          }}
        />
      )}

      <div className="studio_form_actions">
        <button
          className="studio_btn studio_btn_ghost"
          onClick={() => router.push(backToTab)}
          disabled={saving}
        >
          Cancel
        </button>
        {!isNew && (
          <button className="studio_btn studio_btn_danger" onClick={remove} disabled={saving}>
            Delete row
          </button>
        )}
        <button className="studio_btn" onClick={save} disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create row" : "Save to sheet"}
        </button>
      </div>
    </div>
  );
}
