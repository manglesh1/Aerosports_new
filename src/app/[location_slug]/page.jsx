import "../styles/home.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import birthday_img from "@public/assets/images/home/birthday_img_home_page.svg";
import birthday_m_img from "@public/assets/images/home/birthday_img_home_mobile.svg";
import line_pattern from "@public/assets/images/home/line_pattern.svg";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import Countup from "@/components/Countup";
import MotionImage from "@/components/MotionImage";

export async function generateMetadata({ params }) {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(
    `${API_URL}/fetchmenudata?location=${location_slug}`
  );

  const header_image = data
    ?.filter((item) => item.pageid === "home")
    ?.map((item) => ({
      title: item?.metatitle,
      description: item?.metadescription,
    }));
  return {
    title: header_image[0]?.title,
    description: header_image[0]?.description,
    alternates: {
      canonical: BASE_URL + "/" + location_slug,
    },
    openGraph: {
      type: "website",
      url: BASE_URL + `/${location_slug}`,
      title: header_image[0]?.title,
      description: header_image[0]?.description,
      images: [
        {
          url: "https://www.aerosportsparks.ca/assets/image/logo/logo_white.png",
        },
      ],
    },
  };
}

const Home = async ({ params }) => {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata?location=${location_slug}`),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  const booknow = dataconfig?.filter((item) => item.key === "estorebase");
  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const header_image = data?.filter((item) => item.pageid === "home");
  const attractionsData = getDataByParentId(data, "attractions");
  const blogsData = getDataByParentId(data, "blogs");

  return (
    <main>
      <Header location_slug={location_slug} booknow={booknow} />
      <MotionImage header_image={header_image} waiver={waiver} />
      <section className="aero_home-actionbtn-bg">
        <section className="aero-max-container aero_home-actionbtn">
          <h2 className="d-flex-center">JUMP STRIGHT TO</h2>
          <section className="aero_home-actionbtn-wrap">
            <Link
              href={`/${location_slug}/attractions`}
              className="aero-btn-booknow"
            >
              <div>
                <button>ATTRACTIONS</button>
              </div>
            </Link>
            <Link
              href={`/${location_slug}/programs`}
              className="aero-btn-booknow"
            >
              <div>
                <button>PROGRAMS</button>
              </div>
            </Link>
            <Link
              href={`/${location_slug}/kids-birthday-parties`}
              className="aero-btn-booknow"
            >
              <div>
                <button>BIRTHDAY PARTIES</button>
              </div>
            </Link>
            <Link
              href={`/${location_slug}/groups-events`}
              className="aero-btn-booknow"
            >
              <div>
                <button>GROUPS & EVENTS</button>
              </div>
            </Link>
          </section>
        </section>
        <div className="aero_home_triangle"></div>
      </section>
      <section className="aero_home-playsection">
        <section className="aero_home-playsection-bg">
          <section className="aero-max-container aero_home-playsection-1 d-flex-dir-col">
            <h2>THERE IS SO MUCH TO DO AT AEROSPORTS!</h2>
            <p>
              Every park feature and all the fun includes in your Aerosports
              hourly or multi visit pass. Prepare yourself to fly over our huge
              trampoline areas. duck and dive through extreme dodgeball and dunk
              your heart out in the slam zone.
            </p>
            <h2>Explore attractions</h2>
          </section>
        </section>
        <section className="aero_home-actionbtn-bg">
          <section className="aero-max-container aero_home-playsection-2 ">
            {attractionsData[0]?.children &&
              attractionsData[0]?.children?.map((item, i) => {
                return (
                  <Link
                    href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                    key={i}
                  >
                    <article className="d-flex-dir-col">
                      <Image
                        src={item?.smallimage}
                        width={120}
                        height={120}
                        alt={item?.title}
                      />
                      <figure className="aero_home-play-small-img">
                        <Image
                          src={line_pattern}
                          width={120}
                          height={120}
                          alt={item?.title}
                        />
                        <span>{item?.desc}</span>
                      </figure>
                    </article>
                  </Link>
                );
              })}
          </section>
        </section>
      </section>
      <section className="aero_home_birthday_section">
        <Image
          className="desktop-container"
          src={birthday_img}
          width={220}
          height={120}
          alt="birthday img"
        />
        <Image
          className="app-container"
          src={birthday_m_img}
          width={220}
          height={120}
          alt="birthday img"
        />
      </section>
      <section className="aero_home_article_section">
        <section className="aero-max-container">
          <p>POPULAR STORIES</p>
          <h2>Every Updated Article</h2>
          <section className="aero_home_article_card-wrapper">
            {blogsData[0]?.children &&
              blogsData[0]?.children.map((item, i) => {
                return (
                  <Link
                    key={i}
                    href={`/${location_slug}/${item?.parentid}/${item?.path}`}
                  >
                    <article className="aero_home_article_card">
                      <Image
                        src={item?.smallimage}
                        width={120}
                        height={120}
                        alt="article image"
                        title="article image"
                      />
                      <div className="aero_home_article_desc">
                        <div>{i + 1}</div>
                        <h3>{item?.title}</h3>
                        <p>Continue Reading...</p>
                      </div>
                    </article>
                  </Link>
                );
              })}
          </section>
        </section>
      </section>
      <section className="aero_home_feature_section-bg">
        <section className="aero-max-container aero_home_feature_section">
          <article className="aero_home_feature_section-card">
            <Countup num={130} />
            <div>Trampolines</div>
          </article>
          <article className="aero_home_feature_section-card">
            <Countup num={27000} />
            <div>Square Feet</div>
          </article>
          <article className="aero_home_feature_section-card">
            <Countup num={4} />
            <div>Party Rooms</div>
          </article>
          <article className="aero_home_feature_section-card">
            <Countup num={6} />
            <div>Fun Attractions</div>
          </article>
        </section>
      </section>
      <Footer location_slug={location_slug} />
    </main>
  );
};

export default Home;
