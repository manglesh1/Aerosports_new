import "../../styles/kidsparty.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionImage from "@/components/MotionImage";
import { fetchData } from "@/utils/fetchData";
import Image from "next/image";
import React from "react";

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=Data&location=${location_slug}`
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
      canonical: BASE_URL + "/" + location_slug + "/" + subcategory_slug,
    },
  };
}

const Page = async ({ params }) => {
  const location_slug = params.location_slug;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(
    `${API_URL}/fetchmenudata?location=${location_slug}`
  );

  const birthdaydata = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=birthday%20packages&location=${location_slug}`
  );

  const dataconfig = await fetchData(
    `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
  );

  const booknow = dataconfig?.filter(
    (item) => item.key === "kids-birthday-parties-roller-url"
  );
  const waiver = dataconfig?.filter((item) => item.key === "waiver");

  const header_image = data?.filter(
    (item) => item.pageid === "kids-birthday-parties"
  );

  return (
    <main>
      <Header location_slug={location_slug} booknow={booknow} />
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section className="aero-max-container">
        <article className="aero_bp_2_main_section">
          {birthdaydata.map((item, i) => {
            const includedata = item.includes.split(";");
            return (
              <div key={i} className="aero_bp_card_wrap">
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
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Page;
