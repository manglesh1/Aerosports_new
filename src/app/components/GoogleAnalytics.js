"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

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

function classifyTrackingId(id) {
  const normalizedId = String(id || "").trim().toUpperCase();

  if (normalizedId.startsWith("GTM-")) return "gtm";
  if (normalizedId.startsWith("G-")) return "ga4";

  return "unknown";
}

function ensureScript({ id, src }) {
  if (typeof document === "undefined" || !src) return;
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function ensureGtmContainer(containerId) {
  if (typeof document === "undefined" || !containerId) return;

  const loaderId = `google-tag-manager-loader-${containerId}`;
  if (!document.getElementById(loaderId)) {
    const script = document.createElement("script");
    script.id = loaderId;
    script.text = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${containerId}');
    `;
    document.head.appendChild(script);
  }

  const noscriptId = `google-tag-manager-noscript-${containerId}`;
  if (!document.getElementById(noscriptId) && document.body) {
    const noscript = document.createElement("noscript");
    noscript.id = noscriptId;
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(noscript);
  }
}

export default function GoogleAnalytics({ sheetLocationTrackingIds = {} }) {
  const pathname = usePathname();
  const bootstrappedRef = useRef(false);
  const lastConfigKey = useRef("");

  const locationSlug = pathname?.split("/")[1] || "";
  const mergedLocationTrackingIds = useMemo(
    () => ({
      ...locationTrackingIds,
      ...sheetLocationTrackingIds,
    }),
    [sheetLocationTrackingIds]
  );
  const trackingEntries = useMemo(
    () => normalizeTrackingIds([globalTrackingId, mergedLocationTrackingIds[locationSlug]]),
    [locationSlug, mergedLocationTrackingIds]
  );
  const gaTrackingIds = useMemo(
    () =>
      trackingEntries.filter((trackingId) => classifyTrackingId(trackingId) === "ga4"),
    [trackingEntries]
  );
  const gtmContainerIds = useMemo(
    () =>
      trackingEntries.filter((trackingId) => classifyTrackingId(trackingId) === "gtm"),
    [trackingEntries]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    if (!bootstrappedRef.current) {
      window.gtag("js", new Date());
      bootstrappedRef.current = true;
    }

    if (gaTrackingIds.length > 0) {
      ensureScript({
        id: `google-analytics-loader-${gaTrackingIds[0]}`,
        src: `https://www.googletagmanager.com/gtag/js?id=${gaTrackingIds[0]}`,
      });
    }

    gtmContainerIds.forEach((containerId) => {
      ensureGtmContainer(containerId);
    });
  }, [gaTrackingIds, gtmContainerIds]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function" || gaTrackingIds.length === 0) {
      return;
    }

    const pagePath = pathname || window.location.pathname;
    const configKey = `${pagePath}::${gaTrackingIds.join(",")}`;
    if (lastConfigKey.current === configKey) {
      return;
    }

    lastConfigKey.current = configKey;
    gaTrackingIds.forEach((trackingId) => {
      window.gtag("config", trackingId, { page_path: pagePath });
    });
  }, [pathname, gaTrackingIds]);

  return null;
}
