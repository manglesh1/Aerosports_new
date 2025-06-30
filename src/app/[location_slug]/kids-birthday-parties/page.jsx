import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import ImageMarquee from "@/components/ImageMarquee";
import { fetchsheetdata,  fetchPageData,generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: "kids-birthday-parties"
  });
  return metadata;
}

const Page = async ({ params }) => {
  const location_slug = params.location_slug;

  const [data, birthdaydata, dataconfig] = await Promise.all([
     fetchPageData(location_slug,'kids-birthday-parties'),
     fetchsheetdata('birthday packages',location_slug),
     fetchsheetdata('config', location_slug),
  
  ]);

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = data?.filter(
    (item) => item.path === "kids-birthday-parties"
  );

  return (
    <main>
      <section>
        <MotionImage header_image={header_image} waiver={waiver} />
      </section>
      <section>
        <ImageMarquee imagesString={header_image[0].headerimage} />
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
      <section className="aero_home_article_section">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{ __html: data[0]?.section1 || "" }}
          />
        </section>
      </section>
      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{ __html: data[0]?.seosection || "" }}
          />
        </section>
      </section>
    </main>
  );
};

export default Page;
