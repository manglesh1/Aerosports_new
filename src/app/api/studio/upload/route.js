import { NextResponse } from "next/server";
import sharp from "sharp";
import { getApiSession } from "@/lib/studio-auth";
import { uploadToGcs } from "@/lib/gcs";

export const runtime = "nodejs";

const MAX_WIDTH = 1920;
const QUALITY = 80;

function slugify(name) {
  return (
    String(name || "")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

// POST multipart/form-data: { file, folder? }
// -> { desktop_url, width, height }
export async function POST(request) {
  if (!getApiSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const folder = slugify(form.get("folder") || "uploads");

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const base = `${slugify(file.name)}-${Date.now().toString(36)}`;

    // One optimized WebP served to everyone (no mobile/desktop split).
    const optimized = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    const meta = await sharp(optimized).metadata();

    const url = await uploadToGcs(optimized, `webp/uploads/${folder}/${base}.webp`);

    return NextResponse.json({
      desktop_url: url,
      width: meta.width || "",
      height: meta.height || "",
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
