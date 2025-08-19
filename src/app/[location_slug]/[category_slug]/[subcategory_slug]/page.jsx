import React from "react";
import "../../../styles/subcategory.css";
import "../../../styles/category.css";
import "../../../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import MotionImage from "@/components/MotionImage";
import ImageMarquee from "@/components/ImageMarquee";
import SubCategoryCard from "@/components/smallComponents/SubCategoryCard"
import FaqCard from "@/components/smallComponents/FaqCard";
import { fetchsheetdata,fetchMenuData, generateMetadataLib,getWaiverLink,generateSchema } from "@/lib/sheets";
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
  const [data, dataconfig, menudata,locationData,waiverLink] = await Promise.all([
    fetchsheetdata('Data', location_slug),
    fetchsheetdata('config', location_slug),
    fetchMenuData(location_slug),
     fetchsheetdata('locations',location_slug),
     getWaiverLink(location_slug),
  
  ]);

    const categoryData = (await getDataByParentId(menudata,category_slug))[0]?.children?.filter(child => child.path !== subcategory_slug && child.isactive==1);

  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, subcategory_slug)
    : [];

  const pagedata = attractionsData?.[0]; // Reusing attractionsData
  if(!pagedata) return;

const jsonLDschema = await generateSchema(pagedata,locationData,subcategory_slug,category_slug);
  return (
    <main>
      <section>
        <MotionImage pageData={attractionsData} waiverLink={waiverLink} locationData={locationData}/>
      </section>

     

      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{
              __html: pagedata.section1 || "",
            }}
          />
         
        </section>
       <SubCategoryCard attractionsData={categoryData} location_slug={location_slug} theme={'default'} title={`Other ${pagedata.parentid}`} text={[pagedata.metadescription]} />
      </section>
      
        <ImageMarquee imagesString={pagedata.headerimage}  />
      
      

      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{
              __html: pagedata.seosection || "",
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
