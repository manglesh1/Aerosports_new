import { Poppins } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from  './components/GoogleAnalytics' // Import the GoogleAnalytics component

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Aerosports Trampoline Park Mississauga, St-Catharines, Niagara Falls, Windsor,London, Oakville | Birthday Parties Indoor Playground",
  description: "One of the Ontario's top spots for fun: A massive trampoline park featuring climbing walls, giant slides, a jungle gym, Mini Golf, obstacle courses, dodgeball, and more. Perfect for birthday parties!",
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
    title: "AeroSports Trampoline Park Locations: Mississauga, St. Catharines, Niagara Falls, Windsor, London, Oakville | Perfect for Birthday Parties and Indoor Playground Fun!",
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
        <GoogleAnalytics /> {/* Render the client-side Google Analytics component */}
        {children}
      </body>
    </html>
  );
}
