import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/studio-auth";
import {
  listTabs,
  getSheetData,
  addSheetRow,
  updateSheetRow,
  deleteSheetRow,
} from "@/lib/google-sheets";
import { fetchsheetdata } from "@/lib/sheets";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Clear the public site's in-memory read cache so edits show up immediately.
function bustReadCache() {
  try {
    fetchsheetdata("refresh");
  } catch {
    /* non-fatal */
  }
}

// Map a Google quota (429) error to a friendly, correctly-statused response.
function errorResponse(e) {
  const msg = String(e?.message || e);
  if (/quota|rate limit|429|RESOURCE_EXHAUSTED/i.test(msg)) {
    return NextResponse.json(
      { error: "Google Sheets rate limit hit. Wait a few seconds and try again." },
      { status: 429 }
    );
  }
  return NextResponse.json({ error: msg }, { status: 500 });
}

// GET /api/studio/sheet              -> list all tabs
// GET /api/studio/sheet?tab=Data     -> headers + rows for one tab (cached ~20s)
// GET /api/studio/sheet?tab=Data&fresh=1 -> bypass the cache (Refresh button)
export async function GET(request) {
  if (!getApiSession(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");
  const fresh = searchParams.get("fresh") === "1";
  try {
    if (!tab) return NextResponse.json({ tabs: await listTabs() });
    return NextResponse.json(await getSheetData(tab, { fresh }));
  } catch (e) {
    return errorResponse(e);
  }
}

// PUT /api/studio/sheet?tab=Data&row=New   -> add row
// PUT /api/studio/sheet?tab=Data&row=3     -> update row index 3
export async function PUT(request) {
  if (!getApiSession(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");
  const row = searchParams.get("row");
  if (!tab) return NextResponse.json({ error: "Missing tab" }, { status: 400 });

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    if (row === "New" || row == null) await addSheetRow(tab, data);
    else await updateSheetRow(tab, Number(row), data);
    bustReadCache();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

// DELETE /api/studio/sheet?tab=Data&rowIndex=3
export async function DELETE(request) {
  if (!getApiSession(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");
  const rowIndex = Number(searchParams.get("rowIndex"));
  if (!tab || Number.isNaN(rowIndex)) {
    return NextResponse.json({ error: "Missing tab or rowIndex" }, { status: 400 });
  }
  try {
    await deleteSheetRow(tab, rowIndex);
    bustReadCache();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
