import SummerPassLandingPage, { generateMetadata as generateLandingMetadata } from "../summer-pass-landing/page";

export async function generateMetadata({ params }) {
  const metadata = await generateLandingMetadata({ params });
  return {
    ...metadata,
    alternates: {
      ...(metadata?.alternates || {}),
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${params.location_slug}/summer-pass-2026`,
    },
  };
}

export default SummerPassLandingPage;
