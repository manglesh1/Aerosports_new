import React from "react";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import BlogSection from "@/components/sections/BlogSection";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import { fetchsheetdata, fetchMenuData, generateMetadataLib,getWaiverLink,generateSchema,fetchPageData } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  const { location_slug } = params;
  
  const [pagedata,waiverLink, locationData, menuData] = await Promise.all([
    fetchPageData(location_slug,"membership"),getWaiverLink(location_slug),
     fetchsheetdata('locations',location_slug),
     fetchMenuData(location_slug),
  ]);
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
 
    
  
const jsonLDschema = await generateSchema(pagedata,locationData,'',"membership");
  return (
    <main>
      <section>
        <MotionImage pageData={pagedata}  waiverLink={waiverLink} locationData={locationData} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pagedata?.section1) }}
          ></div>
        </section>
      </section>
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory="membership"
        />
      )}
    <script type="application/ld+json" suppressHydrationWarning
  dangerouslySetInnerHTML={{ __html: jsonLDschema }}
/>
    </main>
  );
};

export default page;
