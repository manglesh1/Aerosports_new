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
import LocationV2 from "@/components/home-v2/LocationV2";
import FinalCtaV2 from "@/components/home-v2/FinalCtaV2";

import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  getReviewsData,
  generateMetadataLib,
  generateSchema,
  fetchHomePageJsonData,
} from "@/lib/sheets";

// Group2 (oakville/london/scarborough) renders its own ported design + sheet.
import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2LocationHome from "@g2/pages/Group2LocationHome";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const location = params.location_slug;
  const metaLib = isGroup2(location) ? generateMetadataLibG2 : generateMetadataLib;
  const metadata = await metaLib({ location, category: "", page: "" });
  return metadata;
}

const Home = async ({ params }) => {
  const location_slug = params?.location_slug;

  // Group2 cities render the ported group2 home (own components + own sheet).
  if (isGroup2(location_slug)) {
    return <Group2LocationHome location_slug={location_slug} />;
  }

  const [
    data,
    dataconfig,
    locationData,
    waiverLink,
    popupData,
    pageJson,
  ] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("config", location_slug),
    fetchsheetdata("locations", location_slug),
    getWaiverLink(location_slug),
    fetchsheetdata("popups", location_slug),
    fetchHomePageJsonData(location_slug),
  ]);

  // page-json-data holds per-location overrides as JSON.
  // Schema: { attractions: { "<path>": { desc, audience, priority } },
  //           partyImages: ["url1","url2"], promoMeta: { ... } }
  const pj = pageJson || {};

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
          locationDisplay={displayName}
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
        locationDisplay={displayName}
        partyImages={pj.partyImages}
      />

      <SocialProofV2
        reviewdata={reviewdata}
        locationData={locationData}
      />

      <WhyChooseV2 locationDisplay={displayName} />

      <LocationV2 locationData={locationData} reviewdata={reviewdata} />

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
