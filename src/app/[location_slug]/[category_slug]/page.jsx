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

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Category from "@g2/pages/Group2Category";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";
import GroupsEventsPage from "@/components/groups-events/GroupsEventsPage";
import ProgramsPage from "@/components/programs/ProgramsPage";
import AboutUsPage from "@/components/about/AboutUsPage";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

// The group1/main-site Groups & Events marketing page is matched by slug.
const GROUPS_EVENTS_SLUGS = new Set(["groups-events", "groups", "group-events"]);
const isGroupsEventsSlug = (slug) =>
  GROUPS_EVENTS_SLUGS.has(String(slug || "").toLowerCase());

// The group1/main-site Programs marketing page is matched by slug.
const PROGRAMS_SLUGS = new Set(["programs"]);
const isProgramsSlug = (slug) =>
  PROGRAMS_SLUGS.has(String(slug || "").toLowerCase());

// The group1/main-site About Us marketing page is matched by slug.
const ABOUT_SLUGS = new Set(["about-us"]);
const isAboutSlug = (slug) =>
  ABOUT_SLUGS.has(String(slug || "").toLowerCase());

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
  if (isGroup2(location_slug)) {
    return await generateMetadataLibG2({
      location: location_slug,
      category: "",
      page: category_slug,
    });
  }
  // group1 Groups & Events page is not backed by a Data-sheet row, so skip the
  // pageData 404 guard for it and generate metadata directly.
  if (isGroupsEventsSlug(category_slug) || isProgramsSlug(category_slug)) {
    return await generateMetadataLib({
      location: location_slug,
      category: "",
      page: category_slug,
    });
  }
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
  if (isGroup2(params?.location_slug)) {
    return <Group2Category params={params} />;
  }

  const { location_slug, category_slug } = params;
  if (category_slug === "refresh") {
    await fetchsheetdata("refresh", location_slug);
    return "data refreshed";
  }

  // group1/main-site Groups & Events marketing page (not group2).
  if (isGroupsEventsSlug(category_slug)) {
    return <GroupsEventsPage params={params} />;
  }

  // group1/main-site Programs marketing page (not group2).
  if (isProgramsSlug(category_slug)) {
    return <ProgramsPage params={params} />;
  }

  // group1/main-site About Us marketing page (not group2). about-us HAS a
  // Data row, so generateMetadata still works via the existing path.
  if (isAboutSlug(category_slug)) {
    return <AboutUsPage params={params} />;
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


  return (
    <main className={robotoCondensed.variable}>
      <MotionImage
        pageData={pageData}
        waiverLink={waiverLink}
        locationData={locationData}
      />


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
