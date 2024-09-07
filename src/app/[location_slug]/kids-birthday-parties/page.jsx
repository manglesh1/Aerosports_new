import "../../styles/kidsparty.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDataByParentId } from "@/utils/customFunctions";
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

  const kidsmetadata = data?.filter(
    (item) => item.pageid === "kids-birthday-parties"
  )?.map((item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    }));

  return {
    title: kidsmetadata[0]?.title,
    description: kidsmetadata[0]?.description,
    alternates: {
      canonical: BASE_URL + '/' + location_slug + '/' + subcategory_slug,
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

  const header_image = data?.filter(
    (item) => item.pageid === "kids-birthday-parties"
  );

  return (
    <main>
      <Header location_slug={location_slug} />
      <section className="aero_home-headerimg-wrapper">
        {header_image &&
          header_image.map((item, i) => {
            return (
              <div key={i}>
                <Image
                  src={item.headerimage}
                  alt="header - image"
                  width={1200}
                  height={600}
                  title="header image for more info about the image"
                />

                <article className="aero_kids_party">
                  <section>
                    <h1>{item.title}</h1>
                    <p>{item.smalltext}</p>
                    <div className="aero-btn-booknow">
                      <button>WAIVER</button>
                    </div>
                  </section>
                </article>
              </div>
            );
          })}
      </section>
      <section className="aero-max-container">
        <article className="aero_bp_2_main_section">
          {birthdaydata.map((item, i) => {
            const includedata = item.includes.split(";");
            return (
              <div key={i}>
                <h2 className="d-flex-center">{item?.plantitle}</h2>
                <ul>
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
