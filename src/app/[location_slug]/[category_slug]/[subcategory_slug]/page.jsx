import React from "react";
import "../../../styles/subcategory.css";
import "../../../styles/category.css";
import "../../../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import MotionImage from "@/components/MotionImage";
import ImageMarquee from "@/components/ImageMarquee";
import SubCategoryCard from "@/components/smallComponents/SubCategoryCard"
import FaqCard from "@/components/smallComponents/FaqCard";
import { fetchsheetdata,fetchMenuData, generateMetadataLib,getWaiverLink,generateSchema,fetchPageData } from "@/lib/sheets";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug, category_slug } = params;
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: category_slug,
    page: subcategory_slug
  });
  return metadata;
}


const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug,category_slug } = params;
  const [p0, p1, p2, p3, p4] = await Promise.allSettled([
  fetchPageData(location_slug, subcategory_slug),
  fetchsheetdata("config", location_slug),
  fetchMenuData(location_slug),
  fetchsheetdata("locations", location_slug),
  getWaiverLink(location_slug),
]);

const pageData      = p0.status === "fulfilled" ? p0.value : {};
const dataconfig    = p1.status === "fulfilled" ? p1.value : {};
const menudata      = p2.status === "fulfilled" ? p2.value : [];
const locationData  = p3.status === "fulfilled" ? p3.value : {};
const waiverLink    = p4.status === "fulfilled" ? p4.value : null;

    const categoryData = (await getDataByParentId(menudata,category_slug))[0]?.children?.filter(child => child.path !== subcategory_slug && child.isactive==1);
console.log('param ',location_slug,subcategory_slug,category_slug);
 
const jsonLDschema = await generateSchema(pageData,locationData,subcategory_slug,category_slug);
  return (
    <main>
      <section>
        <MotionImage pageData={pageData} waiverLink={waiverLink} locationData={locationData}/>
      </section>

     

      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{
              __html: pageData.section1 || "",
            }}
          />
         
        </section>
       <SubCategoryCard attractionsData={categoryData} location_slug={location_slug} theme={'default'} title={`Other ${pageData.parentid}`} text={[pageData.metadescription]} />
      </section>
      
        <ImageMarquee imagesString={pageData.headerimage}  />
      
      

      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{
              __html: pageData.seosection || "",
            }}
          />
        </section>
      </section>
      <FaqCard page={subcategory_slug} location_slug={location_slug} />
     <script type="application/ld+json" suppressHydrationWarning
  dangerouslySetInnerHTML={{ __html: jsonLDschema }}
/>
     
    </main>
  );
};

export default Subcategory;
