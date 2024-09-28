"use client";  // Ensure it's a client component

import { useRouter } from "next/navigation";  // Use from next/navigation for App Router
import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const router = useRouter();
  const [locationTrackingId, setLocationTrackingId] = useState("");
  const globalTrackingId = 'G-1TETQERPZN';  // Global Google Analytics ID
const locationTrackingId1='test' ;
  useEffect(() => {
    if (router) {  // Ensure the router is available
      const pathname = window.location.pathname;  // Use window for client-side pathname
      const locationSlug = pathname.split("/")[1];
      console.log('locationsss ' + pathname +' '+ locationSlug );
 
      // Dynamically set Google Analytics ID based on location
      switch (locationSlug) {
        case 'london':
          setLocationTrackingId('G-L59BND7FS0');
          
          break;
        case 'windsor':
          setLocationTrackingId('G-KWJLE4VJRW');
          break;
        case 'st-catharines':
          console.log('tracking stc')
          locationTrackingId1='G-CJJLRQ2Q2Y'
          setLocationTrackingId('G-CJJLRQ2Q2Y');
          break;
        case 'oakville':
          setLocationTrackingId('G-D5W5H2N64H');
          break;
        default:
          setLocationTrackingId(''); // Fallback if no valid location is found
          break;
      
      }
    }
  }, [router]);

  return (
    <>
      {/* Global Google Analytics */}
      {globalTrackingId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${globalTrackingId}`}
          />
          <Script
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
        </>
      )}

      {/* Location-specific Google Analytics */}
      {(
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${locationTrackingId}`}
          />
          <Script
            id="google-analytics-location"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${locationTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
