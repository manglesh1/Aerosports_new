import React from "react";
import "../../../styles/subcategory.css";
import "../../../styles/category.css";
import "../../../styles/kidsparty.css";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import MotionImage from "@/components/MotionImage";
import SubCategoryCard from "@/components/smallComponents/SubCategoryCard";
import FaqCard from "@/components/smallComponents/FaqCard";
import {
  fetchsheetdata,
  fetchMenuData,
  generateMetadataLib,
  getWaiverLink,
  generateSchema,
  fetchPageData,
} from "@/lib/sheets";
import BlogSection from "@/components/sections/BlogSection";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug, category_slug } = params;
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: category_slug,
    page: subcategory_slug,
  });
  return metadata;
}

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug, category_slug } = params;
  const [p0, p1, p2, p3, p4] = await Promise.allSettled([
    fetchPageData(location_slug, subcategory_slug),
    fetchsheetdata("config", location_slug),
    fetchMenuData(location_slug),
    fetchsheetdata("locations", location_slug),
    getWaiverLink(location_slug),
  ]);

  const pageData = p0.status === "fulfilled" ? p0.value : {};
  const dataconfig = p1.status === "fulfilled" ? p1.value : {};
  const menudata = p2.status === "fulfilled" ? p2.value : [];
  const locationData = p3.status === "fulfilled" ? p3.value : {};
  const waiverLink = p4.status === "fulfilled" ? p4.value : null;

  const categoryData = (
    await getDataByParentId(menudata, category_slug)
  )[0]?.children?.filter(
    (child) => child.path !== subcategory_slug && child.isactive == 1
  );

  // console.log("param ", location_slug, subcategory_slug, category_slug);

  const blogsData = getDataByParentId(menudata, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];

  const jsonLDschema = await generateSchema(
    pageData,
    locationData,
    subcategory_slug,
    category_slug
  );

  return (
    <main>
      <section>
        <MotionImage
          pageData={pageData}
          waiverLink={waiverLink}
          locationData={locationData}
        />
      </section>

      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{
              __html: sanitizeCmsHtml(pageData.section1),
            }}
          />
{/* <h2
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.95,
            marginBottom: "1.5rem",
            color: "#fff",
            textRendering: "geometricprecision",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <span style={{ color: "rgb(255, 255, 255)" }}>
            {pageData?.desc}
          </span> */}
        {/* </h2> */}

        {/* Description */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.7,
            fontWeight: 700,
            textRendering: "geometricprecision",
            WebkitFontSmoothing: "antialiased",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {pageData?.metadescription}
        </p>
      

<SubCategoryCard
          attractionsData={categoryData}
          location_slug={location_slug}
          theme={"default"}
          title={`Other ${pageData.parentid}`}
          text={[pageData.metadescription]}
        />
        </section>
        
      </section>

      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeCmsHtml(pageData.seosection),
            }}
          />
        </section>
      </section>
      <FaqCard page={subcategory_slug} location_slug={location_slug} />

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

export default Subcategory;
