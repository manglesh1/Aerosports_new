import React from "react";
import "../../styles/category.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchmenudata?location=${location_slug}`
  );

  const attractionsData = getDataByParentId(data, category_slug)?.map(
    (item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    })
  );
  return {
    title: attractionsData[0]?.title,
    description: attractionsData[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug + "/" + category_slug,
    },
  };
}

const Category = async ({ params }) => {
  const { location_slug, category_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata?location=${location_slug}`),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const booknow = dataconfig?.filter((item) => item.key === "estorebase");
  const attractionsData = getDataByParentId(data, category_slug);

  return (
    <main>
      <Header location_slug={location_slug} booknow={booknow} />
      <section>
        <h1 className="aero_category_main_heading d-flex-center">
          {category_slug?.replace("-", " ")?.toUpperCase()}
        </h1>
        <section className="aero_category_section_wrapper">
          <section className="aero-max-container">
            <section className="aero_category_section_card_wrapper">
              {attractionsData[0]?.children?.map((item, i) => {
                return (
                  item?.isactive == 1 && (
                    <Link
                      href={`/${location_slug}/${category_slug}/${item?.path}`}
                      key={i}
                    >
                      <article className="aero_category_section_card_wrap">
                        <Image
                          src={item?.smallimage}
                          width={150}
                          height={150}
                          alt={item?.title}
                          title={item?.title}
                          className="aero_category_section_card_img"
                        />
                        <div className="aero_category_section_card_desc">
                          <h2>{item?.desc}</h2>
                          <p>
                            {item?.smalltext?.slice(0, 50) + "..."}{" "}
                            <span>READ MORE</span>
                          </p>
                        </div>
                      </article>
                    </Link>
                  )
                );
              })}
            </section>
          </section>
        </section>
      </section>
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Category;
