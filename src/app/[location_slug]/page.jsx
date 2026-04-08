import { notFound } from "next/navigation";
import { Roboto_Condensed } from "next/font/google";
import "../styles/home.css";
import "../styles/promotions.css";
import "../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import PromotionModal from "@/components/model/PromotionModal";
import LocationPopupModal from "@/components/model/LocationPopupModal";
import ExploreAttractionsSection from "@/components/sections/ExploreAttractionsSection";
import HeroSection from "@/components/sections/HeroSection";
import SEOSection from "@/components/sections/SEOSection";
import PlanVisitSection from "@/components/sections/PlanVisitSection";
import CelebrateSection from "@/components/sections/CelebrateSection";
import BlogSection from "@/components/sections/BlogSection";
import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  generateMetadataLib,
  generateSchema,
} from "@/lib/sheets";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

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
  const blogsData = getDataByParentId(data, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];

  const jsonLDschema = await generateSchema(
    header_image?.[0],
    locationData,
    "",
    ""
  );

  const stats = [
    { number: "8+", label: "Attractions" },
    { number: "All Ages", label: "Welcome" },
    { number: "10,000+", label: "Sq Ft of Fun" },
    { number: "4.7★", label: "Rated Experience" },
  ];

  return (
    <main className={robotoCondensed.variable} style={{ overflow: "hidden", margin: 0, padding: 0 }}>
      {/* Location Popup */}
      <LocationPopupModal popupData={popupData} />

      {/* Hero Section */}
      <HeroSection
        headerImage={header_image}
        waiverLink={waiverLink}
        locationData={locationData}
        estoreConfig={estoreConfig}
        locationSlug={location_slug}
      />

      {/* Stats Bar */}
      <section className="v11_bp_stats_section">
        <div className="v11_bp_container">
          <div className="v11_bp_stats_grid">
            {stats.map((stat, index) => (
              <div key={index} className="v11_bp_stat_item">
                <span className="v11_bp_stat_number">{stat.number}</span>
                <span className="v11_bp_stat_label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Section */}
      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <SEOSection
          locationData={locationData}
          locationSlug={location_slug}
          estoreConfig={estoreConfig}
          seosection={seosection}
        />
      )}

      {/* Celebrate Your Event Section */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <CelebrateSection locationSlug={location_slug} />
      )}

      {/* Explore Attractions */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <ExploreAttractionsSection
          attractions={attractionsData[0]?.children}
          location_slug={location_slug}
        />
      )}

      {/* Plan Your Visit Section */}
      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <PlanVisitSection seosection={seosection} locationSlug={location_slug} estoreConfig={estoreConfig} />
      )}

      {/* Blog Section */}
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory="home"
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

export default Home;
