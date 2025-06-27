"use client"; // Ensure it's a client component

import { useRouter } from "next/navigation"; // Use from next/navigation for App Router
import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const [locationTrackingId, setLocationTrackingId] = useState("");
  const router = useRouter();
  const globalTrackingId = "G-1TETQERPZN"; // Global Google Analytics ID

  useEffect(() => {
    const pathname = window.location.pathname; // Use window for client-side pathname
    const locationSlug = pathname.split("/")[1];

    // console.log("Current path: ", pathname, " | Location: ", locationSlug);

    // Dynamically set Google Analytics ID based on location
    switch (locationSlug) {
      case "london":
        // console.log("Tracking for London");
        setLocationTrackingId("G-L59BND7FS0");
        break;
      case "windsor":
        // console.log("Tracking for Windsor");
        setLocationTrackingId("G-KWJLE4VJRW");
        break;
      case "st-catharines":
        // console.log("Tracking for St. Catharines");
        setLocationTrackingId("G-CJJLRQ2Q2Y");
        break;
      case "oakville":
        // console.log("Tracking for Oakville");
        setLocationTrackingId("G-D5W5H2N64H");
        break;
        case "scarborough":
          // console.log("Tracking for Oakville");
          setLocationTrackingId("G-D5W5H2N64H");
          break;
      default:
        // console.log("No location-specific tracking");
        setLocationTrackingId(""); // Fallback if no valid location is found
        break;
    }

    // Track page view with global GA ID
    if (window.gtag) {
      window.gtag("config", globalTrackingId, {
        page_path: pathname,
      });

      // Track page view with location-specific GA ID (if set)
      if (locationTrackingId) {
        window.gtag("config", locationTrackingId, {
          page_path: pathname,
        });
      }
    }
  }, [router.pathname, locationTrackingId, globalTrackingId]);

  return (
    <>
      {/* Load Global Google Analytics */}
      <Script async 
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${globalTrackingId}`}
      />
      <Script  async 
        id="google-analytics-global"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${globalTrackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Only render location-specific tracking if there is a locationTrackingId */}
      {locationTrackingId && (
        <Script async 
          id="google-analytics-location"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.gtag('config', '${locationTrackingId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      )}
    </>
  );
}
