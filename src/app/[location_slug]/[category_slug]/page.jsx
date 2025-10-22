import Link from "next/link";
import React from "react";
import "../../styles/category.css";
import "../../styles/attractions.css";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchMenuData, generateMetadataLib, fetchPageData,getWaiverLink, fetchsheetdata,generateSchema} from "@/lib/sheets";
import MotionImage from "@/components/MotionImage";
import AttractionsGrid from "../../components/AttractionsGrid";
export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: '',
    page: category_slug
  });
  return metadata;
}



const Category = async ({ params }) => {
  const { location_slug, category_slug } = params;
if(category_slug === 'refresh'){
  await fetchsheetdata('refresh',location_slug);
  return 'data refreshed';
}

 const [data,pageData, waiverLink, locationData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchPageData(location_slug,category_slug),
    getWaiverLink(location_slug),
    fetchsheetdata('locations',location_slug),
    
  ]);

const jsonLDschema = await generateSchema(pageData,locationData,'',category_slug);
//console.log('pagedata',pageData);
  const attractionsData = getDataByParentId(data, category_slug);
  //console.log('waiverLink',waiverLink);
  // Filter active attractions
  const activeAttractions = attractionsData[0]?.children?.filter(item => item?.isactive == 1) || [];

  return (
    <main>
      <section className="aero_attractions_wrapper">
        <section className="aero-max-container">
          <MotionImage pageData={pageData} waiverLink={waiverLink} locationData={locationData}/>

          {/* Title Section with Gradient and Animations */}
          <div className="aero_attractions_title_wrapper">
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
          </div>

          {/* Attractions Grid with Modal */}
          <AttractionsGrid
            attractionsData={activeAttractions}
            waiverLink={waiverLink}
            locationSlug={location_slug}
          />
        </section>

        {/* SEO Content Section */}
        <section className="aero_home_article_section">
          <section className="aero-max-container aero_home_seo_section">
            <div dangerouslySetInnerHTML={{ __html: pageData?.section1 || "" }} />
            <div dangerouslySetInnerHTML={{ __html: pageData?.seosection || "" }} />
          </section>
        </section>
      </section>
      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default Category;
