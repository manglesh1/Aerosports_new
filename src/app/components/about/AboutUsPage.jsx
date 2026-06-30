import "../../styles/groups-events.css";
import Link from "next/link";
import AppImage from "@/components/AppImage";
import {
  fetchsheetdata,
  getWaiverLink,
  getReviewsData,
  fetchPageData,
  fetchMenuData,
} from "@/lib/sheets";
import { getDataByParentId } from "@/utils/customFunctions";

const HERO_DEFAULT =
  "https://media.aerosportsparks.ca/home-experience/group-events.webp";

const GALLERY_DEFAULTS = [
  "https://media.aerosportsparks.ca/home-experience/gallery.webp",
  "https://media.aerosportsparks.ca/home-experience/group-events.webp",
  "https://media.aerosportsparks.ca/webp/common/camps.webp",
];

const WHY_CHOOSE = [
  "Wide variety of attractions",
  "All-in-one entertainment destination",
  "Safe and supervised environment",
  "Designed for all age groups",
];

// Real descriptions for the about-us child cards (the sheet `smalltext` is
// empty, which is why they otherwise fall back to generic placeholder text).
const CHILD_DESCRIPTIONS = [
  [/accessib/i, "Our commitment to a welcoming, accessible experience for everyone."],
  [/safety/i, "Court rules, safety guidelines, and everything to know before you jump."],
  [/faq|question/i, "Quick answers to common questions about visits, waivers, and booking."],
  [/contact/i, "Hours, location, and how to reach the AeroSports team."],
];
const childDesc = (s) =>
  (CHILD_DESCRIPTIONS.find(([re]) => re.test(s)) || [])[1] ||
  "Helpful information to plan your visit.";

function toDisplayName(slug) {
  return String(slug || "")
    .split("-")
    .map((w) => (w === "st" ? "St." : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const AboutUsPage = async ({ params }) => {
  const location_slug = params.location_slug;

  const [locationData, config, menudata] = await Promise.all([
    fetchsheetdata("locations", location_slug),
    fetchsheetdata("config", location_slug),
    fetchMenuData(location_slug),
  ]);

  // About-us child pages (Safety Information, FAQ, Contact Us, ...) shown as
  // cards linking to /{location}/about-us/{path}.
  const aboutChildren = (getDataByParentId(menudata, "about-us")?.[0]?.children || [])
    .filter((c) => String(c?.isactive) === "1" && c?.path)
    .map((c) => {
      const title = String(c.desc || c.title || c.path)
        .replace(/\s*\/\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        title,
        desc: childDesc(`${c.path} ${title}`),
        href: `/${location_slug}/about-us/${c.path}`,
        image: c.smallimage || c.headerimage || "",
        alt: c.smallimage_media?.alt || title,
      };
    });

  const waiverLink = await getWaiverLink(location_slug);

  // Optional hero image/title from the about-us Data row.
  let pageData = null;
  try {
    pageData = await fetchPageData(location_slug, "about-us");
  } catch {
    pageData = null;
  }

  // Live Google rating (same source as the home SocialProof section).
  const locationid = locationData?.[0]?.locationid;
  const reviewdata = locationid ? await getReviewsData(locationid) : null;
  const googleRating = reviewdata?.rating
    ? Number(reviewdata.rating).toFixed(1)
    : null;

  const displayName =
    locationData?.[0]?.displayName || toDisplayName(location_slug);

  // CTA: estorebase -> rollerurl -> waiverLink -> #
  const estoreConfig = Array.isArray(config)
    ? config.find((item) => item.key === "estorebase")
    : null;
  const bookingLink =
    estoreConfig?.value || locationData?.[0]?.rollerurl || waiverLink || "#";
  const isExternalBooking = bookingLink.startsWith("http");

  const heroImage = pageData?.smallimage || HERO_DEFAULT;
  const heroAlt =
    pageData?.smallimage_media?.alt || `AeroSports ${displayName}`;

  return (
    <main className="g1ge_page">
      {/* 1. HERO */}
      <section className="g1ge_hero">
        <div className="g1ge_hero_orb g1ge_hero_orb1" />
        <div className="g1ge_hero_orb g1ge_hero_orb2" />
        <div className="g1ge_hero_inner">
          <div className="g1ge_hero_left">
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              AeroSports {displayName}
            </span>
            <h1 className="g1ge_hero_h1">
              More Than Just <em>Fun</em>
            </h1>
            <p className="g1ge_hero_sub">
              We create high-energy experiences that bring people together
              through fun, movement, and connection.
            </p>
            <div className="g1ge_hero_actions">
              <Link
                href={`/${location_slug}/attractions`}
                className="g1ge_btn g1ge_btn_green"
              >
                Explore Attractions
              </Link>
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_outline"
                {...(isExternalBooking
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Book Now
              </Link>
            </div>
          </div>
          <div className="g1ge_hero_visual">
            <div className="g1ge_hero_img">
              <AppImage
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE + MISSION */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">About Us</span>
            <h2 className="g1ge_h2">Who We Are</h2>
          </div>
          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              textAlign: "center",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--g1ge-ink, #333)",
            }}
          >
            AeroSports {displayName} is an indoor adventure park designed to
            deliver exciting, high-energy experiences for all ages.
          </p>
          <div className="g1ge_section_head" style={{ marginTop: "48px" }}>
            <span className="g1ge_tag">Our Mission</span>
            <h2 className="g1ge_h2">Our Mission</h2>
          </div>
          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              textAlign: "center",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--g1ge-ink, #333)",
            }}
          >
            Our mission is simple — to create a space where people can stay
            active, connect with others, and enjoy unforgettable moments.
          </p>
        </div>
      </section>

      {/* 3. WHAT MAKES US DIFFERENT */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">What Makes Us Different</span>
            <h2 className="g1ge_h2">Why Choose AeroSports</h2>
          </div>
          <div className="g1ge_included_grid">
            {WHY_CHOOSE.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE AEROSPORTS EXPERIENCE */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">The Experience</span>
            <h2 className="g1ge_h2">The AeroSports Experience</h2>
          </div>
          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto 40px",
              textAlign: "center",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--g1ge-ink, #333)",
            }}
          >
            Whether you&apos;re visiting with friends, celebrating a birthday,
            or planning a group event, AeroSports {displayName} offers a space
            filled with energy, excitement, and memorable experiences.
          </p>
          <div className="g1ge_gallery_grid">
            {GALLERY_DEFAULTS.map((src, i) => (
              <div className="g1ge_gallery_tile" key={`${src}-${i}`}>
                <AppImage
                  src={src}
                  alt={`AeroSports ${displayName} experience ${i + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 HELPFUL INFORMATION (about-us children) */}
      {aboutChildren.length > 0 && (
        <section className="g1ge_section g1ge_section_light">
          <div className="g1ge_container">
            <div className="g1ge_section_head">
              <span className="g1ge_tag">Helpful Information</span>
              <h2 className="g1ge_h2">Good to Know</h2>
            </div>
            <div className="g1ge_grid4">
              {aboutChildren.map((c) => (
                <Link
                  className="g1ge_card g1ge_card_link g1ge_type_card"
                  key={c.href}
                  href={c.href}
                >
                  {c.image && (
                    <div className="g1ge_type_card_img">
                      <AppImage
                        src={c.image}
                        alt={c.alt}
                        fill
                        sizes="(max-width: 700px) 100vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="g1ge_type_card_body">
                    <h3>{c.title}</h3>
                    {c.desc && <p>{c.desc}</p>}
                  </div>
                  <span className="g1ge_card_arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TRUST + CTA */}
      <section className="g1ge_quote">
        <div className="g1ge_quote_bg" />
        <div className="g1ge_quote_inner" style={{ gridTemplateColumns: "1fr" }}>
          <div className="g1ge_quote_intro" style={{ textAlign: "center" }}>
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              Trusted by Thousands
            </span>
            <h2 className="g1ge_h2 g1ge_h2_light">Trusted by Thousands</h2>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "var(--g1ge-green)",
                margin: "12px 0",
              }}
            >
              {googleRating || "4.8"}
              <span style={{ color: "#fff" }}>★</span>
            </div>
            <p>
              Families, schools, and groups choose AeroSports {displayName} for
              safe, engaging, and high-quality entertainment.
            </p>
            <div
              className="g1ge_hero_actions"
              style={{
                justifyContent: "center",
                marginTop: "24px",
                marginBottom: 0,
              }}
            >
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_green"
                {...(isExternalBooking
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Book Now
              </Link>
              <Link
                href={`/${location_slug}`}
                className="g1ge_btn g1ge_btn_outline"
              >
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
