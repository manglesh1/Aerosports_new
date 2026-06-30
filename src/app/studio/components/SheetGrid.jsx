"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppImage from "../../components/AppImage";

function truncate(v, n) {
  const s = v == null ? "" : String(v);
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function isImageUrl(s) {
  return /^https?:\/\/\S+\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(s) || /\/webp\//i.test(s);
}

// Render a table cell: thumbnail for image URLs, truncated text otherwise.
function renderCell(val) {
  const s = val == null ? "" : String(val);
  if (!s) return "—";
  if (isImageUrl(s)) return <AppImage className="studio_table_thumb" src={s} alt="" width={96} height={72} sizes="96px" />;
  return truncate(s, 80);
}

// Columns offered as dropdown filters, shown only when present in a tab.
const FILTERS = [
  { col: "location", label: "All locations", multi: true },
  { col: "parentid", label: "All categories" },
  { col: "pageid", label: "All page ids" },
];

export default function SheetGrid({ tab }) {
  const router = useRouter();
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({});

  const load = useCallback(
    async (fresh = false) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/studio/sheet?tab=${encodeURIComponent(tab)}${fresh ? "&fresh=1" : ""}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setHeaders(data.headers || []);
        setRows(data.rows || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [tab]
  );

  useEffect(() => {
    setFilters({});
    setQ("");
    load();
  }, [load]);

  async function remove(row) {
    if (!confirm(`Delete this row from "${tab}"? This edits the live sheet.`)) return;
    setError("");
    try {
      const res = await fetch(
        `/api/studio/sheet?tab=${encodeURIComponent(tab)}&rowIndex=${row._rowIndex}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className="studio_muted">Loading {tab}…</div>;

  const term = q.trim().toLowerCase();

  const activeFilters = FILTERS.filter((f) => headers.includes(f.col)).map((f) => ({
    ...f,
    values: f.multi
      ? Array.from(
          new Set(
            rows.flatMap((r) =>
              String(r[f.col] ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          )
        ).sort()
      : Array.from(new Set(rows.map((r) => String(r[f.col] ?? "").trim()).filter(Boolean))).sort(),
  }));

  const filtered = rows.filter((r) => {
    for (const f of activeFilters) {
      const sel = filters[f.col];
      if (!sel) continue;
      if (f.multi) {
        const vals = String(r[f.col] ?? "")
          .split(",")
          .map((s) => s.trim());
        if (!vals.includes(sel)) return false;
      } else if (f.col === "parentid") {
        // a category matches its children (parentid) and its own listing page (path)
        if (String(r.parentid ?? "").trim() !== sel && String(r.path ?? "").trim() !== sel) return false;
      } else if (String(r[f.col] ?? "").trim() !== sel) {
        return false;
      }
    }
    if (term && !headers.some((h) => String(r[h] ?? "").toLowerCase().includes(term))) return false;
    return true;
  });

  const anyFilter = term || Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="studio_toolbar">
        <Link href={`/studio/${encodeURIComponent(tab)}/new`} className="studio_btn">
          + New row
        </Link>
        <button className="studio_btn studio_btn_ghost" onClick={() => load(true)}>
          Refresh
        </button>
        <input
          className="studio_search"
          placeholder="Search this tab…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {activeFilters.map((f) =>
          f.values.length > 0 ? (
            <select
              key={f.col}
              className="studio_select"
              value={filters[f.col] || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, [f.col]: e.target.value }))}
            >
              <option value="">{f.label}</option>
              {f.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          ) : null
        )}
        <span className="studio_muted">
          {filtered.length}
          {anyFilter ? ` of ${rows.length}` : ""} rows
        </span>
      </div>

      {error && <div className="studio_error studio_block">{error}</div>}

      {filtered.length ? (
        <div className="studio_table_wrap">
          <table className="studio_table">
            <thead>
              <tr>
                <th className="studio_sticky">{headers[0]}</th>
                {headers.slice(1).map((h) => (
                  <th key={h}>{h}</th>
                ))}
                <th className="studio_sticky_right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row._rowIndex}
                  className="studio_table_row"
                  onClick={() => router.push(`/studio/${encodeURIComponent(tab)}/${row._rowIndex}`)}
                >
                  <td className="studio_sticky" title={row[headers[0]]}>
                    {renderCell(row[headers[0]])}
                  </td>
                  {headers.slice(1).map((h) => (
                    <td key={h} title={row[h]}>
                      {renderCell(row[h])}
                    </td>
                  ))}
                  <td className="studio_sticky_right" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/studio/${encodeURIComponent(tab)}/${row._rowIndex}`}
                      className="studio_link"
                    >
                      Edit
                    </Link>
                    <button className="studio_link studio_danger" onClick={() => remove(row)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="studio_muted studio_block">No matching rows.</div>
      )}
    </div>
  );
}
