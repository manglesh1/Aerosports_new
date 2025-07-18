import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "./service-account-creds.json"; // adjust path
import { JWT } from "google-auth-library";
const { google } = require("googleapis");
const SPREADSHEET_ID = "1m4sAEfIJUaIdnsKYBJeMe0FeESEtGU9ISRqJ_O9TFmo";
const path = require('path');
const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function initDoc() {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}


export async function GET(request) {

      
  try {
       const { searchParams } = new URL(request.url);
    const locationFilter = searchParams.get("location");

    const doc = await initDoc();
    const sheet = doc.sheetsByTitle["Data"]; // replace with your sheet title
    if (!sheet) return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    // console.log('sheet', sheet);
    const rows = await sheet.getRows();
    let data = rows.map((row, index) => ({ ...row.toObject(), _rowIndex: index }));

    if (locationFilter && locationFilter !== "all") {
      data = data.filter((row) => row.location === locationFilter);
    }

    return NextResponse.json({ rows: data });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const rowParam = searchParams.get("row");
  console.log('put api is called:', rowParam);

  let updatedData;
  try {
    updatedData = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  if (typeof updatedData !== 'object' || updatedData === null) {
    return NextResponse.json({ error: 'Request body must be an object of updated values' }, { status: 400 });
  }

  try {
    const doc = await initDoc();
    const sheet = doc.sheetsByTitle['Data'];
    if (!sheet) {
      return NextResponse.json({ error: 'Sheet "Data" not found' }, { status: 404 });
    }

    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;

    let row;

    if (rowParam === 'New') {
      // Add new row with initial data
      row = await sheet.addRow(updatedData);
    } else {
      const rowIndex = Number(rowParam);
      if (Number.isNaN(rowIndex)) {
        return NextResponse.json({ error: 'Invalid row index' }, { status: 400 });
      }
      const rows = await sheet.getRows();
      row = rows[rowIndex];

      if (!row) {
        return NextResponse.json({ error: `Row ${rowIndex} not found` }, { status: 404 });
      }

      // Update fields of existing row
      for (const [key, value] of Object.entries(updatedData)) {
        // Only update columns that exist in header to avoid errors
        if (headers.includes(key)) {
          row[key] = value;
        }
      }
      await row.save();
    }

    return NextResponse.json({ message: `Row ${rowParam} processed successfully` });
  } catch (err) {
    console.error('PUT /api/sheet error:', err);
    return NextResponse.json({ error: 'Failed to update sheet' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rowIndex = parseInt(searchParams.get("rowIndex"));
    if (isNaN(rowIndex)) {
      return NextResponse.json({ error: "Missing rowIndex" }, { status: 400 });
    }

    const doc = await initDoc();
    const sheet = doc.sheetsByTitle["Data"];
    if (!sheet) return NextResponse.json({ error: "Sheet not found" }, { status: 404 });

    const rows = await sheet.getRows();
    const row = rows[rowIndex];
    if (!row) return NextResponse.json({ error: "Row not found" }, { status: 404 });

    await row.delete();

    return NextResponse.json({ message: "Row deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
