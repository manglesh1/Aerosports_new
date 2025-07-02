import { Poppins } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
const GoogleAnalytics = dynamic(()=> import('./components/GoogleAnalytics'));
import { Suspense } from "react";
import Loading from "./loading";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
        url: "https://storage.googleapis.com/aerosports/logo_white.png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />{" "}
        {/* Render the client-side Google Analytics component */}
        <Suspense fallback={<Loading />}>{children}</Suspense>
        
      </body>
    </html>
  );
}
