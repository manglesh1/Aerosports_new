
import "../styles/home.css";
import "../styles/promotions.css";
import Image from "next/image";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import Countup from "@/components/Countup";
import MotionImage from "@/components/MotionImage";
import PromotionModal from "@/components/model/PromotionModal";
import { fetchsheetdata, fetchMenuData, getWaiverLink,generateMetadataLib,generateSchema } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: ''
  });
  return metadata;
}
  


const Home = async ({ params }) => {
  const location_slug = params?.location_slug;
  const [data, dataconfig,promotions, locationData,waiverLink] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata('config', location_slug),
    fetchsheetdata('promotions',location_slug),
    fetchsheetdata('locations',location_slug),
    getWaiverLink(location_slug)
  ]);

  

  const homepageSection1 = Array.isArray(dataconfig)
    ? dataconfig.find((item) => item.key === "homepageSection1")?.value ?? ""
    : "";

  const promotionPopup = Array.isArray(dataconfig)
    ? dataconfig.filter((item) => item.key === "promotion-popup")
    : [];

    
  const header_image = Array.isArray(data) ? data.filter((item) => item.path === "home") : [];
  const seosection = header_image?.[0]?.seosection || "";
  const attractionsData = Array.isArray(data) ? getDataByParentId(data, "attractions") || [] : [];
  const jsonLDschema = await generateSchema( header_image?.[0],locationData,'','');
 
//console.log(jsonLDschema);
  return (
    <main>
      {promotionPopup.length > 0 && <PromotionModal promotionPopup={promotionPopup} />}

      {/* Hero Section - Full Width */}
      <MotionImage pageData={header_image}  waiverLink={waiverLink} locationData={locationData} />

      {/* Jump Straight To - Centered Container */}
      {attractionsData?.[0]?.children?.length > 0 && (
      <section className="aero_home-actionbtn-bg">
        <section className="aero-max-container aero_home-actionbtn">
          <h2 className="d-flex-center">JUMP STRAIGHT TO</h2>
          <section className="aero_home-actionbtn-wrap">
            <Link href={`/${location_slug}/attractions`} className="aero-btn-booknow" prefetch>
              <button>ATTRACTIONS</button>
            </Link>
            <Link href={`/${location_slug}/programs`} className="aero-btn-booknow" prefetch>
              <button>PROGRAMS</button>
            </Link>
            <Link href={`/${location_slug}/kids-birthday-parties`} className="aero-btn-booknow" prefetch>
              <button>BIRTHDAY PARTIES</button>
            </Link>
            <Link href={`/${location_slug}/groups-events`} className="aero-btn-booknow" prefetch>
              <button>GROUPS & EVENTS</button>
            </Link>
          </section>
        </section>
        <div className="aero_home_triangle"></div>
      </section>
      )}

      {/* About Section with Google Sheets Content - Centered Container */}
      <section className="aero_home-playsection-bg">
        <section className="aero-max-container aero_home-playsection-1">
          <h2 className="heading-with-icon">
            <svg
              className="promotions__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            THERE IS SO MUCH TO DO AT AEROSPORTS!
          </h2>
          <div className="aero_home_content_section" dangerouslySetInnerHTML={{ __html: homepageSection1 }} />
        </section>
      </section>

      {/* Current Promotions - Centered Container */}
      {attractionsData?.[0]?.children?.length > 0 && promotions.length > 0 && (
        <section className="aero_home_article_section">
          <section className="aero-max-container">
            <h2 className="heading-with-icon">
              <svg
                className="promotions__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                <path d="M12 8v13"></path>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
              </svg>
              Current Promotions
            </h2>
            <p>Do not miss out on these amazing deals! Save big on your next visit.</p>

            <div className="promotions__grid">
              {promotions.map((promo, index) => (
                <article key={index} className="promotion-card">
                  <span className="promotion-card__badge">{promo.badge}</span>
                  <h3 className="promotion-card__title">{promo.title}</h3>
                  <p className="promotion-card__description">{promo.description}</p>
                  <div className="promotion-card__details">
                    <time className="promotion-card__validity">{promo.validity}</time>
                    <span className="promotion-card__code">Code: {promo.code}</span>
                  </div>
                  <a href={promo.link} className="promotion-card__btn">{promo.linktext}</a>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {/* Event Celebration Cards - Centered Container */}
      <section className="aero_home-playsection-bg">
        <section className="aero-max-container">
          <h2 className="heading-with-icon">
            <svg
              className="promotions__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="4" rx="1"></rect>
              <path d="M12 8v13"></path>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
            </svg>
            Celebrate Your Event
          </h2>
          <p className="aero_section_subtitle">Elevate your event to the next level at Aerosports!</p>

          <div className="offer-section__inner">
            <article className="offer-card">
              <div
                className="offer-card__img"
                style={{ backgroundImage: "url('https://storage.googleapis.com/aerosports/team-building-aerosports-trampoline-park.png')" }}
                role="img"
                aria-label="Team Building Events"
              >
                <h3 className="offer-card__title">Team Building Events</h3>
              </div>
              <div className="offer-card__body">
                <p>Host your next team building day at Aerosports and turn work into play! Our team-based attractions promote collaboration, problem-solving, and laughter. Teamwork has never been this much fun!</p>
                <Link href={`/${location_slug}/groups-events/corporate-parties-events-groups`} className="sigma_btn-custom">
                  More Info →
                </Link>
              </div>
            </article>

            <article className="offer-card">
              <div
                className="offer-card__img"
                style={{ backgroundImage: "url('https://storage.googleapis.com/aerosports/celeberate-your-birthday-parties-at-aerosports.png')" }}
                role="img"
                aria-label="Birthday Parties"
              >
                <h3 className="offer-card__title">BIRTHDAY PARTIES</h3>
              </div>
              <div className="offer-card__body">
                <p>Epic for them. Easy for you. All-inclusive party packages with private room, host, pizza, open-jump & more.</p>
                <Link href={`/${location_slug}/kids-birthday-parties`} className="sigma_btn-custom">
                  COMPARE PACKAGES →
                </Link>
              </div>
            </article>

            <article className="offer-card">
              <div
                className="offer-card__img"
                style={{ backgroundImage: "url('https://storage.googleapis.com/aerosports/schools-field-trips-at-aerosports.png')" }}
                role="img"
                aria-label="Field Trips"
              >
                <h3 className="offer-card__title">Field Trips</h3>
              </div>
              <div className="offer-card__body">
                <p>We offer special Field Trip rates for groups of 10–29 jumpers. For 30+ or to book space and food, please call us!</p>
                <Link href={`/${location_slug}/groups-events/school-groups`} className="sigma_btn-custom">
                  More Info →
                </Link>
              </div>
            </article>
          </div>
        </section>
      </section>

      {/* Explore Attractions - Full Width Background with Centered Content */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="aero_home_article_section">
          <section className="aero-max-container">
            <div className="aero_section_header">
              <h2 className="heading-with-icon">
                <svg
                  className="promotions__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Explore Attractions
              </h2>
              <Link href={`/${location_slug}/attractions`} className="aero-btn-booknow" prefetch>
                <button>View All</button>
              </Link>
            </div>

            <ul className="attractions-grid">
              {attractionsData[0]?.children?.map((item, i) => (
                <li key={i}>
                  <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                    <article className="attraction-figure">
                      <figure>
                        <Image
                          src={item?.smallimage}
                          width={330}
                          height={200}
                          alt={item?.iconalttextforhomepage}
                          unoptimized
                        />
                        <figcaption className="figcaption-bg">
                          <h3>{item?.desc}</h3>
                        </figcaption>
                      </figure>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      )}

      {/* Statistics Section - Centered Container */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="aero_home_feature_section-bg">
          <section className="aero-max-container aero_home_feature_section">
            {[
              { num: 130, label: "Trampolines" },
              { num: 27000, label: "Square Feet" },
              { num: 4, label: "Party Rooms" },
              { num: 6, label: "Fun Attractions" }
            ].map((item, i) => (
              <article key={i} className="aero_home_feature_section-card">
                <Countup num={item.num} />
                <div>{item.label}</div>
              </article>
            ))}
          </section>
        </section>
      )}

      {/* SEO Section - Centered Container */}
      {attractionsData?.[0]?.children?.length > 0 && seosection && (
        <section className="aero_home_article_section">
          <section className="aero-max-container aero_home_seo_section">
            <div dangerouslySetInnerHTML={{ __html: seosection }} />
          </section>
        </section>
      )}

      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default Home;
