import Link from "next/link";
import React from "react";
import "../../styles/category.css";
import "../../styles/attractions.css";
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

export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
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

  return (
    <main>
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

      <section className="aero_attractions_wrapper">
        <section className="aero-max-container">
          

          {/* Title Section with Gradient and Animations */}
          {/* <div className="aero_attractions_title_wrapper">
            <div className="aero_attractions_title_content">
              <div className="aero_attractions_title_badge">
                <span>✨ EXPLORE OUR ATTRACTIONS ✨</span>
              </div>
              <h1 className="aero_attractions_gradient_title">
                {pageData?.title || "Amazing Adventures Await"}
              </h1>
              {pageData?.description && (
                <p className="aero_attractions_description">
                  {pageData.description}
                </p>
              )}
            </div>
          </div> */}
        {/* </section> */}

          {/* Conditional Content - SickKids or Attractions Grid */}

          {category_slug === "sickkids" ? (
            <SickKidsSection locationData={locationData} />
          ) : (
            <AttractionsGrid
              attractionsData={activeAttractions}
              waiverLink={waiverLink}
              locationSlug={location_slug}
            />
          )}

        {/* SEO Content Section */}
        {/* <section className="aero_home_article_section"> */}
          {/* <section className="aero-max-container aero_home_seo_section"> */}
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData?.section1) }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData?.seosection) }}
            />
          {/* </section> */}
        </section>
      </section>

      {/* Blog Section - Show 3 relevant blog cards */}
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
