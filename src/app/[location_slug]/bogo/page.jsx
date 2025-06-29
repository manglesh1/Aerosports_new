import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchsheetdata,fetchPageData, generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'bogo'
  });
  return metadata;
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
