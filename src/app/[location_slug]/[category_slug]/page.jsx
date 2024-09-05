import "../../styles/category.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Category = async ({ params }) => {
  const { location_slug, category_slug } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(
    `${apiUrl}/fetchmenudata?location=${location_slug}`
  );

  const attractionsData = getDataByParentId(data, category_slug);

  return (
    <main>
      <Header location_slug={location_slug} />
      <section className="aero_category_section_wrapper">
        <section className="aero-max-container">
          <h1 className="aero_category_main_heading">
            {category_slug?.toUpperCase()}
          </h1>
          <section className="aero_category_section_card_wrapper">
            {attractionsData[0]?.children?.map((item, i) => {
              return (
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
                      <p>{item?.smalltext}</p>
                      <span>READ MORE</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        </section>
      </section>
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Category;
