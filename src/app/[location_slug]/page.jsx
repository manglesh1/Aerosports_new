import "../styles/home.css";
import "../styles/promotions.css";
import { getDataByParentId } from "@/utils/customFunctions";
import PromotionModal from "@/components/model/PromotionModal";
import LocationPopupModal from "@/components/model/LocationPopupModal";
import ExploreAttractionsSection from "@/components/sections/ExploreAttractionsSection";
import HeroSection from "@/components/sections/HeroSection";
import SEOSection from "@/components/sections/SEOSection";
import PlanVisitSection from "@/components/sections/PlanVisitSection";
import CelebrateSection from "@/components/sections/CelebrateSection";
import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
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
  const [data, dataconfig, promotions, locationData, waiverLink, popupData] =
    await Promise.all([
      fetchMenuData(location_slug),
      fetchsheetdata("config", location_slug),
      fetchsheetdata("promotions", location_slug),
      fetchsheetdata("locations", location_slug),
      getWaiverLink(location_slug),
      fetchsheetdata("popups", location_slug),
    ]);

  const promotionPopup = Array.isArray(dataconfig)
    ? dataconfig.filter((item) => item.key === "promotion-popup")
    : [];

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
      {/* {promotionPopup.length > 0 && (
        <PromotionModal promotionPopup={promotionPopup} />
      )} */}

      {/* Location Popup - Renders HTML from Google Sheets 'popups' workbook */}
      <LocationPopupModal popupData={popupData} />

      {/* Hero Section - Full Width with Clean, Energetic Design */}
      <HeroSection
        headerImage={header_image}
        waiverLink={waiverLink}
        locationData={locationData}
        estoreConfig={estoreConfig}
        locationSlug={location_slug}
      />

      {/* SEO Section - Diagonal Split Layout */}
      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <SEOSection
          locationData={locationData}
          locationSlug={location_slug}
          estoreConfig={estoreConfig}
          seosection={seosection}
        />
      )}

      {/* Celebrate Your Event Section - Black Background */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <CelebrateSection locationSlug={location_slug} />
      )}

      {/* Explore Attractions - Black Background with Grid Layout */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <ExploreAttractionsSection
          attractions={attractionsData[0]?.children}
          location_slug={location_slug}
        />
      )}

      {/* Plan Your Visit Section - Bottom CTA Section */}
      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <PlanVisitSection seosection={seosection} locationSlug={location_slug} estoreConfig={estoreConfig} />
      )}

      {/* Statistics Section - Centered Container
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="aero_home_feature_section-bg">
          <section className="aero-max-container aero_home_feature_section">
            {[
              { num: 130, label: "Trampolines" },
              { num: 27000, label: "Square Feet" },
              { num: 4, label: "Party Rooms" },
              { num: 6, label: "Fun Attractions" }
            ].map((item, i) => (
              <article key={i} className="aero_home_feature_section-card">
                <Countup num={item.num} />
                <div>{item.label}</div>
              </article>
            ))}
          </section>
        </section>
      )} */}
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

export default Home;
