import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import { fetchsheetdata, fetchMenuData, fetchPageData } from "@/lib/sheets";
export async function generateMetadata({ params }) {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchPageData(location_slug,'bogo');
 // const data = await fetchData(
 //   `${API_URL}/fetchpagedata?location=${location_slug}&page=bogo`
 // );

  const membershipmetadata = data
    ?.filter((item) => item?.path === "bogo")
    ?.map((item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    }));

  return {
    title: membershipmetadata[0]?.title,
    description: membershipmetadata[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/bogo",
    },
  };
}

const page = async ({ params }) => {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchPageData(location_slug,'bogo'),
    fetchsheetdata('config',location_slug),
   // fetchData(`${API_URL}/fetchpagedata?location=${location_slug}&page=bogo`),
   // fetchData(
   //   `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
   // ),
  ]);

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = getDataByParentId(data, "bogo");
  const bogoData = getDataByParentId(data, "bogo");

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="bogo_main_section"
            dangerouslySetInnerHTML={{ __html: bogoData[0]?.section1 || "" }}
          ></div>
        </section>
      </section>
    </main>
  );
};

export default page;
