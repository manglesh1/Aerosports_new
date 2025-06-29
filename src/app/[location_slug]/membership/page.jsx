import React from "react";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import { fetchsheetdata, generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [data, dataconfig] = await Promise.all([
    fetchsheetdata('Data',location_slug),
    fetchsheetdata('config', location_slug),
    
  ]);
 

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = getDataByParentId(data, "membership");
  const memberData = getDataByParentId(data, "membership");

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{ __html: memberData[0]?.section1 || "" }}
          ></div>
        </section>
      </section>
    </main>
  );
};

export default page;
