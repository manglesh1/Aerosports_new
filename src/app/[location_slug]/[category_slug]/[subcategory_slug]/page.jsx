import React from "react";
import "../../../styles/subcategory.css";
import "../../../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import MotionImage from "@/components/MotionImage";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug,category_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const data = await fetchData(
    `${API_URL}/fetchpagedata?location=${location_slug}&page=${subcategory_slug}`
  );

  const attractionsData = getDataByParentId(data, subcategory_slug)?.map(
    (item) => ({
      title: item?.metatitle,
      description: item?.metadescription
      

    })
  );
  return {
    title: attractionsData[0]?.title,
    description: attractionsData[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/" + category_slug + "/" + subcategory_slug,
    },
  };
}

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
    ),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const attractionsData = getDataByParentId(data, subcategory_slug);
  console.log(attractionsData);
  const header_image = getDataByParentId(data, subcategory_slug);

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="subcategory_main_section-bg">
       <section className="aero-max-container">
      <div dangerouslySetInnerHTML={{ __html: data[0]?.section1 || '' }} />
    </section>
  </section>
  <section className="aero_home_article_section">
    <section className="aero-max-container">
      <div dangerouslySetInnerHTML={{ __html: data[0]?.seosection || '' }} />
    </section>
  </section>

      
    </main>
  );
};

export default Subcategory;
