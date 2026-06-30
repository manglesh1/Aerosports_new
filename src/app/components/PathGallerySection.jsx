"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import PageGallerySection from "@/components/PageGallerySection";

function getRelativePath(pathname, locationSlug) {
  const parts = String(pathname || "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts[0] === locationSlug) {
    return parts.slice(1).join("/") || "home";
  }

  return parts.join("/") || "home";
}

export default function PathGallerySection({ locationSlug }) {
  const pathname = usePathname();
  const [galleryData, setGalleryData] = useState({});

  const relativePath = useMemo(
    () => getRelativePath(pathname, locationSlug),
    [pathname, locationSlug]
  );

  useEffect(() => {
    if (!locationSlug || !relativePath || relativePath === "gallery") {
      setGalleryData({});
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      location: locationSlug,
      path: relativePath,
    });

    fetch(`/api/gallery?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => setGalleryData(data || {}))
      .catch((error) => {
        if (error.name !== "AbortError") setGalleryData({});
      });

    return () => controller.abort();
  }, [locationSlug, relativePath]);

  return <PageGallerySection galleryData={galleryData} />;
}
