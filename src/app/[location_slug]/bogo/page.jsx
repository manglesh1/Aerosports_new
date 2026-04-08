import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import BlogSection from "@/components/sections/BlogSection";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import { fetchsheetdata, fetchPageData, fetchMenuData, generateMetadataLib, getWaiverLink } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'bogo'
  });
  return metadata;
}

const page = async ({ params }) => {
  const { location_slug } = params;
  const waiverLink = await getWaiverLink(location_slug);
  const [data, dataconfig, menuData] = await Promise.all([
    fetchPageData(location_slug,'bogo'),
    fetchsheetdata('config',location_slug),
    fetchMenuData(location_slug),
  ]);

  const pageData = getDataByParentId(data, "bogo");
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  
  return (
    <main>
      <section>
        <MotionImage pageData={pageData} waiverLink={waiverLink} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="bogo_main_section"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData[0]?.section1) }}
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
