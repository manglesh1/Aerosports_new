import React from "react";
import { notFound } from "next/navigation";
import "../styles/category.css";
import "../styles/attractions.css";
import { getDataByParentId } from "@g2/utils/customFunctions";
import {
  fetchMenuData,
  fetchPageData,
  getWaiverLink,
  fetchsheetdata,
  generateSchema,
} from "@g2/lib/sheets";
import MotionImage from "@g2/components/MotionImage";
import AttractionsGrid from "@g2/components/AttractionsGrid";
import SickKidsSection from "@g2/components/sections/SickKidsSection";

const normalizeSlug = (value) => String(value || "").trim().toLowerCase();

const isTopLevelPageRow = (row) => {
  const parentSlug = normalizeSlug(row?.parentid);
  return !parentSlug || parentSlug === normalizeSlug(row?.path);
};

const Group2Category = async ({ params }) => {
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
  const attractionsData = getDataByParentId(data, category_slug);
  // Filter active attractions
  const activeAttractions =
    attractionsData[0]?.children?.filter((item) => item?.isactive == 1) || [];

  if (!pageData || !pageData.path) {
    notFound();
  }
  if (!isTopLevelPageRow(pageData)) {
    notFound();
  }

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

          <div
            dangerouslySetInnerHTML={{ __html: pageData?.section1 || "" }}
          />
          <div
            dangerouslySetInnerHTML={{ __html: pageData?.seosection || "" }}
          />
        </section>
      </section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default Group2Category;
