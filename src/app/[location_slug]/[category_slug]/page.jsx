import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "../../styles/category.css";
import "../../styles/attractions.css";
import "../../styles/kidsparty.css";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import {
  fetchMenuData,
  generateMetadataLib,
  fetchPageData,
  getWaiverLink,
  fetchsheetdata,
  generateSchema,
} from "@/lib/sheets";
import MotionImage from "@/components/MotionImage";
import AttractionsGrid from "@/components/AttractionsGrid";
import SickKidsSection from "@/components/sections/SickKidsSection";
import BlogSection from "@/components/sections/BlogSection";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
  // Validate page data exists before generating metadata
  const pageData = await fetchPageData(location_slug, category_slug);
  if (!pageData || !pageData.path) {
    notFound();
  }
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: "",
    page: category_slug,
  });
  return metadata;
}

const Category = async ({ params }) => {
  const { location_slug, category_slug } = params;
  if (category_slug === "refresh") {
    await fetchsheetdata("refresh", location_slug);
    return "data refreshed";
  }

  const [data, pageData, waiverLink, locationData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchPageData(location_slug, category_slug),
    getWaiverLink(location_slug),
    fetchsheetdata("locations", location_slug),
  ]);

  // Return 404 if page data doesn't exist for this category
  if (!pageData || (typeof pageData === 'object' && Object.keys(pageData).length === 0 && !pageData.path)) {
    notFound();
  }

  const jsonLDschema = await generateSchema(
    pageData,
    locationData,
    "",
    category_slug
  );
  //console.log('pagedata',pageData);
  const attractionsData = getDataByParentId(data, category_slug);
  const blogsData = getDataByParentId(data, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  //console.log('waiverLink',waiverLink);
  // Filter active attractions
  const activeAttractions =
    attractionsData[0]?.children?.filter((item) => item?.isactive == 1) || [];

  // Check if pageData has a video
  const hasVideo = pageData?.video || (Array.isArray(pageData) && pageData[0]?.video);

  // Stats bar data per category
  const categoryStats = {
    attractions: [
      { number: "8+", label: "Attractions" },
      { number: "All Ages", label: "Welcome" },
      { number: "10,000+", label: "Sq Ft of Fun" },
      { number: "4.7★", label: "Rated Experience" },
    ],
    "groups-events": [
      { number: "50+", label: "Groups Monthly" },
      { number: "Custom", label: "Packages" },
      { number: "All Ages", label: "Welcome" },
      { number: "100%", label: "Hassle-Free" },
    ],
    membership: [
      { number: "Unlimited", label: "Visits" },
      { number: "Best", label: "Value" },
      { number: "Exclusive", label: "Perks" },
      { number: "All Ages", label: "Welcome" },
    ],
    programs: [
      { number: "Weekly", label: "Sessions" },
      { number: "Expert", label: "Instructors" },
      { number: "All Ages", label: "Welcome" },
      { number: "100%", label: "Fun Guaranteed" },
    ],
  };

  const stats = categoryStats[category_slug] || [
    { number: "8+", label: "Attractions" },
    { number: "All Ages", label: "Welcome" },
    { number: "5★", label: "Rated" },
    { number: "100%", label: "Fun Guaranteed" },
  ];

  return (
    <main className={robotoCondensed.variable}>
      {hasVideo && (
        <div style={{ position: 'relative', height: '100vh', minHeight: '600px', width: '100%' }}>
          <MotionImage
            pageData={pageData}
            waiverLink={waiverLink}
            locationData={locationData}
          />
        </div>
      )}
      {!hasVideo && (
        <MotionImage
          pageData={pageData}
          waiverLink={waiverLink}
          locationData={locationData}
        />
      )}

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

      <div className="v11_cat_wrapper">
        {/* Attractions / Content Section */}
        <section className="v11_cat_container">
          {category_slug === "sickkids" ? (
            <SickKidsSection locationData={locationData} />
          ) : (
            <AttractionsGrid
              attractionsData={activeAttractions}
              waiverLink={waiverLink}
              locationSlug={location_slug}
            />
          )}
        </section>

        {/* SEO Content Section */}
        {(pageData?.section1 || pageData?.seosection) && (
          <section className="v11_cat_seo_section">
            <div className="v11_cat_container">
              {pageData?.section1 && (
                <div
                  className="v11_cat_seo_content"
                  dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData.section1) }}
                />
              )}
              {pageData?.seosection && (
                <div
                  className="v11_cat_seo_content"
                  dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData.seosection) }}
                />
              )}
            </div>
          </section>
        )}
      </div>

      {/* Blog Section */}
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory={category_slug}
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

export default Category;
