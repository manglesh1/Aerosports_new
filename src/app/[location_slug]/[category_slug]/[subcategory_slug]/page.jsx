import React from "react";
import "../../../styles/subcategory.css";
import "../../../styles/kidsparty.css";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import MotionImage from "@/components/MotionImage";
import ImageMarquee from "@/components/ImageMarquee";

// Page metadata generation
export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug, category_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const data = await fetchData(
    `${API_URL}/fetchpagedata?location=${location_slug}&page=${subcategory_slug}`
  );

  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, subcategory_slug)?.map((item) => ({
        title: item?.metatitle || "",
        description: item?.metadescription || "",
      }))
    : [];

  return {
    title: attractionsData?.[0]?.title || "Aerosports",
    description: attractionsData?.[0]?.description || "Explore fun attractions!",
    alternates: {
      canonical: `${BASE_URL}/${location_slug}/${category_slug}/${subcategory_slug}`,
    },
  };
}

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(`${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`),
    fetchData(`${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`),
  ]);

  const waiver = Array.isArray(dataconfig)
    ? dataconfig.find((item) => item.key === "waiver")
    : null;

  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, subcategory_slug)
    : [];

  const header_image = attractionsData; // Reusing attractionsData

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>

      {header_image?.[0]?.headerimage && (
        <ImageMarquee imagesString={header_image[0].headerimage} />
      )}

      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{
              __html: attractionsData?.[0]?.section1 || "",
            }}
          />
        </section>
      </section>

      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{
              __html: attractionsData?.[0]?.seosection || "",
            }}
          />
        </section>
      </section>
    </main>
  );
};

export default Subcategory;
