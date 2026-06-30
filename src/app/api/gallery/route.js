import { NextResponse } from "next/server";
import { fetchGalleryData } from "@/lib/sheets";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "";
  const path = searchParams.get("path") || "";

  if (!location || !path) {
    return NextResponse.json({});
  }

  const galleryData = await fetchGalleryData(location, [
    path,
    `/${location}/${path}`,
  ]);

  return NextResponse.json(galleryData || {});
}
