// Group2 city homepage (oakville/london/scarborough) — ported from the former
// oakville-group / rajan codebase. Self-contained: fetches from the group2 sheet
// via @g2/lib/sheets and renders the group2 "sections" design. Rendered by
// src/app/[location_slug]/page.jsx when the slug resolves to group2.
import "../styles/home.css";
import "../styles/promotions.css";
import { getDataByParentId } from "@g2/utils/customFunctions";
import LocationPopupModal from "@g2/components/model/LocationPopupModal";
import ExploreAttractionsSection from "@g2/components/sections/ExploreAttractionsSection";
import HeroSection from "@g2/components/sections/HeroSection";
import SEOSection from "@g2/components/sections/SEOSection";
import PlanVisitSection from "@g2/components/sections/PlanVisitSection";
import CelebrateSection from "@g2/components/sections/CelebrateSection";
import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  generateSchema,
} from "@g2/lib/sheets";

const Group2LocationHome = async ({ location_slug }) => {
  const [data, dataconfig, promotions, locationData, waiverLink, popupData] =
    await Promise.all([
      fetchMenuData(location_slug),
      fetchsheetdata("config", location_slug),
      fetchsheetdata("promotions", location_slug),
      fetchsheetdata("locations", location_slug),
      getWaiverLink(location_slug),
      fetchsheetdata("popups", location_slug),
    ]);

  const estoreConfig = Array.isArray(dataconfig)
    ? dataconfig.find((item) => item.key === "estorebase")
    : null;

  const header_image = Array.isArray(data)
    ? data.filter((item) => item.path === "home")
    : [];
  const seosection = header_image?.[0]?.seosection || "";
  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, "attractions") || []
    : [];
  const jsonLDschema = await generateSchema(
    header_image?.[0],
    locationData,
    "",
    ""
  );

  return (
    <main style={styles.main}>
      <LocationPopupModal popupData={popupData} />

      <HeroSection
        headerImage={header_image}
        waiverLink={waiverLink}
        locationData={locationData}
        estoreConfig={estoreConfig}
        locationSlug={location_slug}
      />

      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <SEOSection
          locationData={locationData}
          locationSlug={location_slug}
          estoreConfig={estoreConfig}
          seosection={seosection}
        />
      )}

      {attractionsData?.[0]?.children?.length > 0 && (
        <CelebrateSection locationSlug={location_slug} />
      )}

      {attractionsData?.[0]?.children?.length > 0 && (
        <ExploreAttractionsSection
          attractions={attractionsData[0]?.children}
          location_slug={location_slug}
        />
      )}

      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <PlanVisitSection
          seosection={seosection}
          locationSlug={location_slug}
          estoreConfig={estoreConfig}
        />
      )}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

const styles = {
  main: {
    backgroundColor: "#000000",
    color: "#ffffff",
    lineHeight: "1.6",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
};

export default Group2LocationHome;
