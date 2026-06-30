"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import Script from "next/script";

const globalTrackingId = "G-1TETQERPZN";

const locationTrackingIds = {
  london: "G-L59BND7FS0",
  windsor: "G-KWJLE4VJRW",
  "st-catharines": "G-CJJLRQ2Q2Y",
  oakville: "G-D5W5H2N64H",
  scarborough: "G-D5W5H2N64H",
};

function normalizeTrackingIds(value) {
  if (Array.isArray(value)) return value.flatMap(normalizeTrackingIds);
  return String(value || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id, index, ids) => id && ids.indexOf(id) === index);
}

export default function GoogleAnalytics({ sheetLocationTrackingIds = {} }) {
  const pathname = usePathname();
  const initialized = useRef(false);

  const locationSlug = pathname?.split("/")[1] || "";
  const mergedLocationTrackingIds = useMemo(
    () => ({
      ...locationTrackingIds,
      ...sheetLocationTrackingIds,
    }),
    [sheetLocationTrackingIds]
  );
  const pageTrackingIds = useMemo(
    () => normalizeTrackingIds([globalTrackingId, mergedLocationTrackingIds[locationSlug]]),
    [locationSlug, mergedLocationTrackingIds]
  );
  const initialLocationTrackingMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(mergedLocationTrackingIds).map(([slug, ids]) => [
          slug,
          normalizeTrackingIds(ids),
        ])
      ),
    [mergedLocationTrackingIds]
  );

  useEffect(() => {
    if (!initialized.current && window.gtag) {
      initialized.current = true;
    }

    if (window.gtag) {
      pageTrackingIds.forEach((trackingId) => {
        window.gtag("config", trackingId, { page_path: pathname });
      });
    }
  }, [pathname, pageTrackingIds]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${globalTrackingId}`}
        strategy="afterInteractive"
        async
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          var locationTrackingMap = ${JSON.stringify(initialLocationTrackingMap)};
          var currentLocationSlug = window.location.pathname.split('/')[1] || '';
          var initialTrackingIds = ${JSON.stringify([globalTrackingId])}.concat(locationTrackingMap[currentLocationSlug] || []);
          initialTrackingIds
            .filter(function(id, index, ids) { return id && ids.indexOf(id) === index; })
            .forEach(function(id) {
              gtag('config', id, { page_path: window.location.pathname });
            });
        `,
        }}
      />
    </>
  );
}
