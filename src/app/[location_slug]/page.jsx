import "../styles/home.css";
import Image from "next/image";
import birthday_img from "@public/assets/images/home/birthday_img_home_page.svg";
import birthday_m_img from "@public/assets/images/home/birthday_img_home_mobile.svg";
import line_pattern from "@public/assets/images/home/line_pattern.svg";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import { fetchData } from "@/utils/fetchData";
import Countup from "@/components/Countup";
import MotionImage from "@/components/MotionImage";
import PromotionModal from "@/components/model/PromotionModal";
import BlogCard from "@/components/smallComponents/BlogCard";

export async function generateMetadata({ params }) {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const data = await fetchData(`${API_URL}/fetchpagedata?location=${location_slug}&page=home`);
  console.log(`${API_URL}/fetchpagedata?location=${location_slug}&page=home`);
  console.log("home page data");

  const header_image = data
    ?.filter((item) => item.path === "home")
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
          url: "https://storage.googleapis.com/aerosports/logo_white.png",
        },
      ],
    },
  };
}

const Home = async ({ params }) => {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, dataconfig] = await Promise.all([
    fetchData(`${API_URL}/fetchmenudata1?location=${location_slug}`),
    fetchData(
      `${API_URL}/fetchsheetdata?sheetname=config&location=${location_slug}`
    ),
  ]);

  console.log(`${API_URL}/fetchpagedata?location=${location_slug}&page=home`);
  console.log("home page data");

  const waiver = dataconfig?.filter((item) => item.key === "waiver");
  const homepageSection1 =
    dataconfig?.filter((item) => item.key === "homepageSection1")?.[0]?.value ??
    "";

  const promotionPopup = dataconfig?.filter(
    (item) => item.key === "promotion-popup"
  );
  const header_image = data?.filter((item) => item.path === "home");
  const seosection = data?.filter((item) => item.path === "home")?.[0]
    ?.seosection;
  const attractionsData = getDataByParentId(data, "attractions");
  const blogsData = getDataByParentId(data, "blogs");

  const stCatharinesSchema = {
    "@context": "https://schema.org",
    "@type": "AmusementPark",
    additionalType: [
      "https://schema.org/SportsActivityLocation",
      "https://schema.org/EntertainmentBusiness",
      "https://schema.org/GolfCourse",
      "https://schema.org/TouristAttraction",
    ],
    name: "AeroSports Trampoline Park",
    description:
      "A fun-filled trampoline park offering amusement, activities, mini golf, and kids' party services.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "333 Ontario Street",
      addressLocality: "St. Catharines",
      addressRegion: "ON",
      postalCode: "L2R 5L3",
      addressCountry: "Canada",
    },
    telephone: "+1-905-123-4567",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.159374,
      longitude: -79.246862,
    },
    openingHours: [
      "Mo-Th 10:00-20:00",
      "Fr 10:00-21:00",
      "Sa 10:00-21:00",
      "Su 10:00-20:00",
    ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "150",
    },
    sameAs: [
      "https://www.facebook.com/AeroSportsTrampolinePark",
      "https://www.instagram.com/aerosportspark",
    ],
  };

  return (
    <main>
      {promotionPopup[0] !== undefined && (
        <PromotionModal promotionPopup={promotionPopup} />
      )}
      <MotionImage header_image={header_image} waiver={waiver} />
      <section className="aero_home-actionbtn-bg">
        <section className="aero-max-container aero_home-actionbtn">
          <h2 className="d-flex-center">JUMP STRAIGHT TO</h2>
          <section className="aero_home-actionbtn-wrap">
            <Link
              href={`${location_slug}/attractions`}
              className="aero-btn-booknow"
              prefetch
            >
              <div>
                <button>ATTRACTIONS</button>
              </div>
            </Link>
            <Link
              href={`${location_slug}/programs`}
              className="aero-btn-booknow"
              prefetch
            >
              <div>
                <button>PROGRAMS</button>
              </div>
            </Link>
            <Link
              href={`${location_slug}/kids-birthday-parties`}
              className="aero-btn-booknow"
              prefetch
            >
              <div>
                <button>BIRTHDAY PARTIES</button>
              </div>
            </Link>
            <Link
              href={`${location_slug}/groups-events`}
              className="aero-btn-booknow"
              prefetch
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
            <p>{homepageSection1}</p>
            <h2>Explore attractions</h2>
          </section>
        </section>
        <section className="aero_home-actionbtn-bg">
          <section className="aero-max-container aero_home-playsection-2 ">
            {attractionsData[0]?.children &&
              attractionsData[0]?.children?.map((item, i) => {
                return (
                  <Link
                    href={`${location_slug}/${item?.parentid}/${item?.path}`}
                    prefetch
                    key={i}
                  >
                    <article className="d-flex-dir-col">
                      <Image
                        src={item?.smallimage}
                        width={120}
                        height={120}
                        alt={item?.title}
                        unoptimized
                      />
                      <figure className="aero_home-play-small-img">
                        <Image
                          src={line_pattern}
                          width={120}
                          height={120}
                          alt={item?.title}
                          unoptimized
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
          unoptimized
        />
        <Image
          className="app-container"
          src={birthday_m_img}
          width={220}
          height={120}
          alt="birthday img"
          unoptimized
        />
        <Link
          href={`${location_slug}/kids-birthday-parties`}
          prefetch
          className="aero-btn-booknow aero-btn-kidslearnmore"
        >
          <div>
            <button>Learn More</button>
          </div>
        </Link>
      </section>
      <section className="aero_home_article_section">
        <section className="aero-max-container">
          <p>POPULAR STORIES</p>
          <h2>Every Updated Article</h2>
          <BlogCard blogsData={blogsData[0]} location_slug={location_slug} />
          <Link
            href={`${location_slug}/blogs`}
            prefetch
            className="aero-btn-booknow aero-btn-article-section"
          >
            <div>
              <button>View All</button>
            </div>
          </Link>
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
      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div dangerouslySetInnerHTML={{ __html: seosection || "" }} />
        </section>
      </section>
      {location_slug === "st-catharines" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(stCatharinesSchema),
          }}
        />
      )}
    </main>
  );
};

export default Home;
