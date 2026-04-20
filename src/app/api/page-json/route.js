import { NextResponse } from "next/server";
import { fetchHomePageJsonData, fetchsheetdata, getLastSheetError } from "../../lib/sheets";

export const dynamic = "force-dynamic";

// GET /api/page-json?location=<slug>
// Diagnostic endpoint: returns the parsed page-json-data object for a given
// location, plus the raw string from the sheet so you can spot JSON errors.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    if (!location) {
      return NextResponse.json({ error: "Missing ?location" }, { status: 400 });
    }

    const dataRowsAll = await fetchsheetdata("Data", "all");
    const dataRows = await fetchsheetdata("Data", location);
    const locationsAll = await fetchsheetdata("locations", "all");
    const sample = Array.isArray(dataRows) ? dataRows.slice(0, 3) : [];
    const sampleKeys = sample[0] ? Object.keys(sample[0]) : [];
    const paths = Array.isArray(dataRows)
      ? dataRows.map((r) => r.path).filter(Boolean).slice(0, 30)
      : [];
    // Find ALL rows for this location that have any page-json-data, so we
    // can see if the user pasted into a row other than `path === "home"`.
    const allHomeRows = Array.isArray(dataRows)
      ? dataRows.filter((r) => r.path === "home")
      : [];
    const rowsWithJson = Array.isArray(dataRows)
      ? dataRows
          .filter((r) => r["page-json-data"] && String(r["page-json-data"]).trim())
          .map((r) => ({
            path: r.path,
            location: r.location,
            len: String(r["page-json-data"]).length,
          }))
      : [];
    const homeRow = Array.isArray(dataRows)
      ? dataRows.find((r) => r.path === "home" && r.location === location)
      : null;
    const homeVideo = homeRow?.video || null;
    const homeImage = homeRow?.headerimage || null;

    const raw = homeRow ? homeRow["page-json-data"] : null;
    let parsed = null;
    let parseError = null;
    if (raw) {
      try {
        parsed = JSON.parse(String(raw).trim());
      } catch (e) {
        parseError = e.message;
      }
    }

    const fromHelper = await fetchHomePageJsonData(location);
    const dataconfig = await fetchsheetdata("config", location);
    const estore = Array.isArray(dataconfig)
      ? dataconfig.find((c) => c.key === "estorebase")?.value
      : null;

    return NextResponse.json({
      location,
      lastError: getLastSheetError(),
      dataAllCount: Array.isArray(dataRowsAll) ? dataRowsAll.length : 0,
      locationsAllCount: Array.isArray(locationsAll) ? locationsAll.length : 0,
      locationsSampleKeys: locationsAll?.[0] ? Object.keys(locationsAll[0]) : [],
      locationsSlugs: Array.isArray(locationsAll) ? locationsAll.map((l) => l.location) : [],
      dataAllSampleKeys: dataRowsAll?.[0] ? Object.keys(dataRowsAll[0]) : [],
      rowCount: Array.isArray(dataRows) ? dataRows.length : 0,
      sampleKeys,
      paths,
      homeRowCount: allHomeRows.length,
      rowsWithJson,
      hasHomeRow: !!homeRow,
      homeVideo,
      homeImage,
      rawLength: raw ? String(raw).length : 0,
      rawHead: raw ? String(raw).slice(0, 300) : null,
      parseError,
      topLevelKeys: parsed ? Object.keys(parsed) : null,
      heroKeys: parsed?.hero ? Object.keys(parsed.hero) : null,
      heroCta: parsed?.hero?.cta || null,
      estoreFromConfig: estore,
      socialKeys: parsed?.social ? Object.keys(parsed.social) : null,
      planKeys: parsed?.plan ? Object.keys(parsed.plan) : null,
      partyKeys: parsed?.party ? Object.keys(parsed.party) : null,
      whyChooseKeys: parsed?.whyChoose ? Object.keys(parsed.whyChoose) : null,
      helperReturnedNull: fromHelper === null,
    });
  } catch (error) {
    console.error("GET /api/page-json error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed" },
      { status: 500 }
    );
  }
}
