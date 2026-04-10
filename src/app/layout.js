import { Poppins, Bebas_Neue, Roboto } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
const GoogleAnalytics = dynamic(()=> import('./components/GoogleAnalytics'));
import { Suspense } from "react";
import Loading from "./loading";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inter = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Bebas Neue is used by the home-v2 hero headline (.hv2-hero-h1) and other
// display headings. Exposed as the CSS variable --font-bebas so home-v2.css
// can reference it without needing to import next/font directly.
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bebas",
});

// Roboto is used by the V11 header. Loaded here instead of a render-blocking
// CSS @import so Next.js can inline-preload the font files.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export const metadata = {
  title: "Discover Fun-Filled Adventures with ONE PASS in Ontario",
  description: "Explore the thrill of Aero Sports Trampoline Parks in Ontario, offering diverse activities in multiple locations for family-friendly fun and adventure.",
  robots: {
    index: true,
  },
  "google-site-verification": "SJEMRcmJ9QPGTx8rq7FFoeypG8tObUDWFunTqQXgRx8",
  alternates: {
    canonical: BASE_URL + '/',
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "AeroSports Trampoline Park Locations: St. Catharines, Niagara Falls, Windsor, London, Oakville,scarborough",
    description: "The GTA's ultimate play destination: A huge trampoline park with climbing walls, towering slides, a jungle gym, obstacle courses, dodgeball, and more. Ideal for birthday parties!",
    images: [
      {
        url: "https://storage.googleapis.com/aerosports/webp/oakville/logo_white.webp",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${roboto.variable}`}>
      <head>
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://docs.google.com" />
        <link rel="dns-prefetch" href="https://docs.google.com" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
