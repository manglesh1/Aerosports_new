import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import MotionImage from "@/components/MotionImage";
import ImageMarquee from "@/components/ImageMarquee";
import { fetchsheetdata,  fetchPageData,generateMetadataLib } from "@/lib/sheets";
import FaqCard from "@/components/smallComponents/FaqCard"

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
    <main >
     
        <MotionImage header_image={header_image} waiver={waiver} />
     
    
      <section className="subcategory_main_section-bg">
     
        <section className="aero-max-container">
        <center><h2 style={{paddingTop: '20px'}}>Birthday Party Packages & Pricing</h2></center>
        <p>
         At AeroSports {location_slug}, we offer competitively priced birthday party packages in our private party rooms—perfectly located near you. Choose the package that fits your budget and guest list:
      </p>
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
     
      
      <section  className="aero-max-container">
  <h2>Games &amp; Activities</h2>
  <p>
    Keep the energy high with our selection of top-rated <strong>birthday celebration games</strong>
    and <strong>children’s birthday party games</strong>. Whether you’re planning party games for
    birthday party fun or looking for something new, we’ve got you covered!
  </p>
  <ul class="games-list">
    <li>
      <strong>Foam Pit Dodgeball</strong><br/>
      Fast-paced fun meets soft landings—one of our most popular party games for birthday parties.
    </li>
    <li>
      <strong>Glow Mini-Golf</strong><br/>
      Putt your way through neon obstacles on our blacklight course—perfect for a memorable birthday celebration game.
    </li>
    <li>
      <strong>Ninja Warrior Challenges</strong><br/>
      Test balance and agility across warped walls, swinging rings and cargo nets in this ultimate kids’ birthday party game.
    </li>
    <li>
      <strong>Trampoline Basketball</strong><br/>
      Slam-dunk in mid-air for a high-flying twist on classic basketball—great for active birthday parties near me.
    </li>
    <li>
      <strong>Obstacle Course Relay</strong><br/>
      Team up for relay races through hurdles, tunnels and balance beams—ideal for group birthday party games.
    </li>
    <li>
      <strong>Foam Pit Treasure Hunt</strong><br/>
      Dive into our foam pit to uncover hidden prizes—an exciting addition to any children’s birthday party.
    </li>
  </ul>
</section>

        <FaqCard page={'kids-birthday-parties'} location_slug={location_slug} />
        <section>
        <ImageMarquee imagesString={header_image[0].headerimage} />
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
