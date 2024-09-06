import React from "react";
import "../../../styles/subcategory.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(
    `${apiUrl}/fetchsheetdata?sheetname=Data&location=${location_slug}`
  );

  const attractionsData = getDataByParentId(data, subcategory_slug);

  return (
    <main>
      <Header location_slug={location_slug} />
      <div
        className="subcategory_main_section"
        dangerouslySetInnerHTML={{ __html: attractionsData[0].section1 }}
      ></div>
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Subcategory;
