import "../styles/home-v2.css";
import "../styles/promotions.css";
import "../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import LocationPopupModal from "@/components/model/LocationPopupModal";

import HeroV2 from "@/components/home-v2/HeroV2";
import HighlightsV2 from "@/components/home-v2/HighlightsV2";
import AttractionsV2 from "@/components/home-v2/AttractionsV2";
import PlanV2 from "@/components/home-v2/PlanV2";
import PartyV2 from "@/components/home-v2/PartyV2";
import SocialProofV2 from "@/components/home-v2/SocialProofV2";
import WhyChooseV2 from "@/components/home-v2/WhyChooseV2";
import PromoV2 from "@/components/home-v2/PromoV2";
import LocationV2 from "@/components/home-v2/LocationV2";
import FinalCtaV2 from "@/components/home-v2/FinalCtaV2";

import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  getReviewsData,
  generateMetadataLib,
  generateSchema,
} from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "",
  });
  return metadata;
}

const Home = async ({ params }) => {
  const location_slug = params?.location_slug;

  const [
    data,
    dataconfig,
    promotions,
    locationData,
    waiverLink,
    popupData,
  ] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("config", location_slug),
    fetchsheetdata("promotions", location_slug),
    fetchsheetdata("locations", location_slug),
    getWaiverLink(location_slug),
    fetchsheetdata("popups", location_slug),
  ]);

  const locationid = locationData?.[0]?.locationid || null;
  const reviewdata = locationid ? await getReviewsData(locationid) : [];

  const estoreConfig = Array.isArray(dataconfig)
    ? dataconfig.find((item) => item.key === "estorebase")
    : null;

  const header_image = Array.isArray(data)
    ? data.filter((item) => item.path === "home")
    : [];

  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, "attractions") || []
    : [];

  const attractions = attractionsData?.[0]?.children || [];

  const jsonLDschema = await generateSchema(
    header_image?.[0],
    locationData,
    "",
    ""
  );

  // Build a human-readable location display name from the slug/locations sheet.
  // Used for hero badge, highlights card and why-choose headline interpolation.
  const rawLocation = locationData?.[0]?.location || location_slug || "";
  const displayName = rawLocation
    .split("-")
    .map((w) => (w === "st" ? "St." : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

  return (
    <main className="hv2" style={{ margin: 0, padding: 0 }}>
      <LocationPopupModal popupData={popupData} />

      <HeroV2
        headerImage={header_image}
        locationData={locationData}
        estoreConfig={estoreConfig}
        waiverLink={waiverLink}
        locationSlug={location_slug}
        locationDisplay={displayName}
      />

      <HighlightsV2
        reviewdata={reviewdata}
        attractionsCount={attractions.length}
        locationDisplay={displayName}
      />

      {attractions.length > 0 && (
        <AttractionsV2
          attractions={attractions}
          locationSlug={location_slug}
        />
      )}

      <PlanV2
        locationSlug={location_slug}
        estoreConfig={estoreConfig}
        waiverLink={waiverLink}
      />

      <PartyV2
        locationSlug={location_slug}
        locationData={locationData}
      />

      <SocialProofV2
        reviewdata={reviewdata}
        locationData={locationData}
      />

      <WhyChooseV2 locationDisplay={displayName} />

      <PromoV2
        promotions={promotions}
        locationSlug={location_slug}
      />

      <LocationV2 locationData={locationData} />

      <FinalCtaV2
        locationSlug={location_slug}
        estoreConfig={estoreConfig}
        waiverLink={waiverLink}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default Home;
