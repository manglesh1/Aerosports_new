import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import { fetchData } from "@/utils/fetchData";

export async function generateMetadata({ params }) {
  const { location_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchpagedata?location=${location_slug}&page=kids-birthday-parties`
  );

  const kidsmetadata = data
    ?.filter((item) => item.pageid === "kids-birthday-parties")
    ?.map((item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    }));

  return {
    title: kidsmetadata[0]?.title,
    description: kidsmetadata[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/kids-birthday-parties",
    },
  };
}

const Page = async ({ params }) => {
  const location_slug = params.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, birthdaydata, dataconfig] = await Promise.all([
    fetchData(
      `${API_URL}/fetchpagedata?location=${location_slug}&page=kids-birthday-parties`
    ),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=birthday%20packages&location=${location_slug}`
    ),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = data?.filter(
    (item) => item.pageid === "kids-birthday-parties"
  );

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="subcategory_main_section-bg">
        <section className="aero-max-container">
          <article className="aero_bp_2_main_section">
            {birthdaydata.map((item, i) => {
              const includedata = item.includes.split(";");
              return (
                <div key={i} className="aero_bp_card_wrap">
                  <div className="aero-bp-boxcircle-wrap">
                    <span className="aero-bp-boxcircle">${item?.price}</span>
                  </div>
                  <div className="aero-bp-boxcircle-wrap">{item?.category}</div>
                  <h2 className="d-flex-center aero_bp_card_wrap_heading">
                    {item?.plantitle}
                  </h2>
                  <ul className="aero_bp_card_wrap_list">
                    {includedata?.map((item, i) => {
                      return <li key={i}>{item}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </article>
        </section>
      </section>
    </main>
  );
};

export default Page;
