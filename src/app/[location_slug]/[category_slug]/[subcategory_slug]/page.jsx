import React from "react";
import "../../../styles/subcategory.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
  );

  const attractionsData = getDataByParentId(data, subcategory_slug)?.map(
    (item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    })
  );
  return {
    title: attractionsData[0]?.title,
    description: attractionsData[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/" + subcategory_slug,
    },
  };
}

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
  );

  const dataconfig = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
  );

  const booknow = dataconfig?.filter((item) => item.key === "estorebase");

  const attractionsData = getDataByParentId(data, subcategory_slug);

  return (
    <main>
      <Header location_slug={location_slug} booknow={booknow} />
      <section className="aero-max-container">
        <div
          className="subcategory_main_section"
          dangerouslySetInnerHTML={{ __html: attractionsData[0].section1 }}
        ></div>
      </section>
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Subcategory;
