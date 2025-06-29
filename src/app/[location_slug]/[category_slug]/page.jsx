import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../../styles/category.css";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchMenuData, generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const { location_slug, category_slug } = params;
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: '',
    page: category_slug
  });
  return metadata;
}



const Category = async ({ params }) => {
  const { location_slug, category_slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
const data = await fetchMenuData(location_slug);
 // const data = await fetchData(
  //fetchMenuData(location_slug)
   // `${API_URL}/fetchmenudata?location=${location_slug}`
  //);
 // console.log(data);

  const attractionsData = getDataByParentId(data, category_slug);
  const seosection = data?.filter((item) => item.path === category_slug)?.[0]?.seosection;
  const sectiontt = data?.filter((item) => item.path === category_slug)?.[0]?.section1;
  return (
    <main>
      <section>
        <section className="aero_category_section_wrapper">
          <section className="aero-max-container">
            <h1 className="aero_category_main_heading d-flex-center">
              {category_slug?.replace("-", " ")?.toUpperCase()}
            </h1>
            <section className="aero_category_section_card_wrapper">
              {attractionsData[0]?.children?.map((item, i) => {
                return (
                  item?.isactive == 1 && (
                    <Link
                      href={`${category_slug}/${item?.path}`}
                      prefetch
                      key={i}
                    >
                      <article className="aero_category_section_card_wrap">
                        <img
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
        <section className="aero_home_article_section">
          <section className="aero-max-container aero_home_seo_section">
            <div dangerouslySetInnerHTML={{ __html: sectiontt || "" }} />
            <div dangerouslySetInnerHTML={{ __html: seosection || "" }} />
          </section>
        </section>
      </section>
    </main>
  );
};

export default Category;
