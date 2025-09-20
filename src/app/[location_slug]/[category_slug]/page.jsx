import Link from "next/link";
import React from "react";
import "../../styles/category.css";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchMenuData, generateMetadataLib, fetchPageData,getWaiverLink, fetchsheetdata,generateSchema} from "@/lib/sheets";
import MotionImage from "@/components/MotionImage";
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
  return (
    <main>
      <section>
        <section className="aero_category_section_wrapper">
          
          <section className="aero-max-container">
          <MotionImage pageData={pageData} waiverLink={waiverLink} locationData={locationData}/>
            
            <section className="aero_category_section_card_wrapper">
              {attractionsData[0]?.children?.map((item, i) => {
                return (
                  item?.isactive == 1 && (
                    <Link
                      href={`${category_slug}/${item?.path}`}
                      prefetch
                      key={i}
                    >
                      <article className="aero_category_section_card_wrap">
                        <img
                          src={item?.smallimage}
                          width={150}
                          height={150}
                          alt={item?.title}
                          title={item?.title}
                          className="aero_category_section_card_img"
                        />
                        <div className="aero_category_section_card_desc">
                          <h2>{item?.desc}</h2>
                          <p>
                            {item?.smalltext?.slice(0, 50) + "..."}{" "}
                            <span>READ MORE</span>
                          </p>
                        </div>
                      </article>
                    </Link>
                  )
                );
              })}
            </section>
          </section>
        </section>
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
