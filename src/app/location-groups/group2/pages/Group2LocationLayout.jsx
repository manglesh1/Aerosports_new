// Group2 city layout shell (oakville/london/scarborough) — ported from the
// former oakville-group / rajan codebase. Uses the group2 Header/Footer and the
// group2 sheet. Dispatched from src/app/[location_slug]/layout.js for group2.
import "../styles/group2-overrides.css";
import Header from "@g2/components/Header";
import Footer from "@g2/components/Footer";
import PathGallerySection from "@/components/PathGallerySection";
import {
  fetchMenuData,
  fetchsheetdata,
  getReviewsData,
  fetchPricingTableData,
} from "@g2/lib/sheets";

export default async function Group2LocationLayout({ children, location_slug }) {
  const [menudata, configdata, locationData, pricingData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("config", location_slug),
    fetchsheetdata("locations", location_slug),
    fetchPricingTableData(location_slug),
  ]);

  const locationid = locationData?.[0]?.locationid || null;
  const reviewdata = locationid ? await getReviewsData(locationid) : [];

  return (
    <div className="group2-scope">
      <Header
        location_slug={location_slug}
        configdata={configdata}
        menudata={menudata}
        pricingData={pricingData}
      />
      {children}
      <PathGallerySection locationSlug={location_slug} />
      <Footer
        location_slug={location_slug}
        configdata={configdata}
        menudata={menudata}
        reviewdata={reviewdata}
        locationData={locationData}
      />
      <div id="modal-root"></div>
    </div>
  );
}
