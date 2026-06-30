import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import BlogSection from "@/components/sections/BlogSection";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import { fetchsheetdata, fetchPageData, fetchMenuData, generateMetadataLib, getWaiverLink } from "@/lib/sheets";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Bogo from "@g2/pages/Group2Bogo";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

export async function generateMetadata({ params }) {
  if (isGroup2(params.location_slug)) {
    return await generateMetadataLibG2({
      location: params.location_slug,
      category: '',
      page: 'bogo'
    });
  }
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'bogo'
  });
  return metadata;
}

const page = async ({ params }) => {
  if (isGroup2(params?.location_slug)) return <Group2Bogo params={params} />;

  const { location_slug } = params;
  const waiverLink = await getWaiverLink(location_slug);
  const [data, dataconfig, menuData, locationData] = await Promise.all([
    fetchPageData(location_slug,'bogo'),
    fetchsheetdata('config',location_slug),
    fetchMenuData(location_slug),
    fetchsheetdata('locations',location_slug),
  ]);

  const pageData = data;
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  
  return (
    <main>
      <section>
        <MotionImage pageData={pageData} waiverLink={waiverLink} locationData={locationData} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="bogo_main_section"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData?.section1) }}
          ></div>
        </section>
      </section>

      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory="bogo"
        />
      )}
    </main>
  );
};

export default page;
