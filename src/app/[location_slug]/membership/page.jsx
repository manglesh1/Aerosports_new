import React from "react";
import MotionImage from "@/components/MotionImage";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
  );

  const membershipmetadata = data
    ?.filter((item) => item?.path === "membership")
    ?.map((item) => ({
      title: item?.metatitle?.replace(/windsor|oakville/gi, location_slug),
      description: item?.metadescription?.replace(
        /windsor|oakville/gi,
        location_slug
      ),
    }));

  return {
    title: membershipmetadata[0]?.title,
    description: membershipmetadata[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/" + subcategory_slug,
    },
  };
}

const page = async ({ params }) => {
  const { location_slug } = params;
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
  const header_image = getDataByParentId(data, "membership");
  const memberData = getDataByParentId(data, "membership");

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="aero-max-container">
        <div
          className="subcategory_main_section"
          dangerouslySetInnerHTML={{ __html: memberData[0]?.section1 || "" }}
        ></div>
      </section>
    </main>
  );
};

export default page;
