import { Poppins } from "next/font/google";
import "./globals.css";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Aerosportspark.ca",
  description: "Aerosportspark.ca tempoline park in canada",
  robots: {
    index: true,
  },
  alternates: {
    canonical: BASE_URL + '/',
  },
    openGraph: {
      type: "website",
      url: BASE_URL,
      title: "Aerosportspark.ca",
      description: "Aerosportspark.ca tempoline park in canada",
      images: [
        {
          url: "https://www.aerosportsparks.ca/assets/image/logo/logo_white.png",
        },
      ],
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
