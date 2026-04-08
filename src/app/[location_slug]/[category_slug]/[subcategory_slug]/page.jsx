import { notFound } from "next/navigation";
import React from "react";
import { Roboto_Condensed } from "next/font/google";
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

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug, category_slug } = params;
  // Validate page data exists before generating metadata
  const pageData = await fetchPageData(location_slug, subcategory_slug);
  if (!pageData || !pageData.path) {
    notFound();
  }
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

  // Return 404 if page data doesn't exist for this subcategory
  if (!pageData || !pageData.path) {
    notFound();
  }

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
    <main className={robotoCondensed.variable}>
      <section>
        <MotionImage
          pageData={pageData}
          waiverLink={waiverLink}
          locationData={locationData}
        />
      </section>

      <div className="v11_cat_wrapper">
        {/* Section 1 CMS Content */}
        {pageData.section1 && (
          <section className="v11_cat_seo_section">
            <div className="v11_cat_container">
              <div
                className="v11_cat_seo_content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(pageData.section1),
                }}
              />
            </div>
          </section>
        )}

        {/* Description */}
        {pageData?.metadescription && (
          <section className="v11_bp_intro_section">
            <div className="v11_bp_container">
              <p className="v11_bp_intro_text">
                {pageData.metadescription}
              </p>
            </div>
          </section>
        )}

        {/* Related subcategories */}
        <SubCategoryCard
          attractionsData={categoryData}
          location_slug={location_slug}
          title={`Other ${pageData.parentid}`}
        />
      </div>

      {/* SEO Content - Dark navy section */}
      {pageData.seosection && (
        <section className="v11_bp_packages_section">
          <div className="v11_bp_container">
            <div
              className="v11_subcategory_seo_content"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(pageData.seosection),
              }}
            />
          </div>
        </section>
      )}

      <FaqCard page={subcategory_slug} location_slug={location_slug} />

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

export default Subcategory;
