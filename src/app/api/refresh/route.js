import { NextResponse } from "next/server";
import { fetchsheetdata } from "../../lib/sheets";

// GET /api/refresh
// Clears the in-process Google Sheet cache so the next request re-fetches
// from the live workbook. Use this after editing the sheet during dev so
// you don't have to restart the dev server to see changes.
export async function GET() {
  try {
    await fetchsheetdata("refresh", "all");
    return NextResponse.json({ ok: true, message: "Sheet cache cleared" });
  } catch (error) {
    console.error("GET /api/refresh error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to refresh" },
      { status: 500 }
    );
  }
}
