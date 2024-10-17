import { Poppins } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from  './components/GoogleAnalytics' // Import the GoogleAnalytics component

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Aerosportspark.ca",
  description: "Aerosportspark.ca trampoline park in Canada",
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
    title: "Aerosportspark.ca",
    description: "Aerosportspark.ca trampoline park in Canada",
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
        <GoogleAnalytics /> {/* Render the client-side Google Analytics component */}
        {children}
      </body>
    </html>
  );
}
