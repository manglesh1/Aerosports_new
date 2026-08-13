import "../../styles/groups-events.css";
import Link from "next/link";
import AppImage from "@/components/AppImage";
import {
  fetchMenuData,
  fetchsheetdata,
  fetchPageData,
  getWaiverLink,
  fetchFaqData,
  fetchHomePageJsonData,
  getReviewsData,
} from "@/lib/sheets";
import { getDataByParentId } from "@/utils/customFunctions";
import GroupsEventsLeadForm from "./GroupsEventsLeadForm";

const HERO_DEFAULT =
  "https://media.aerosportsparks.ca/webp/common/groups-events-hero.webp";
const GALLERY_DEFAULTS = [
  "https://media.aerosportsparks.ca/home-experience/group-events.webp",
  "https://media.aerosportsparks.ca/home-experience/birthday-parties.webp",
  "https://media.aerosportsparks.ca/home-experience/gallery.webp",
];

function toDisplayName(slug) {
  return String(slug || "")
    .split("-")
    .map((w) => (w === "st" ? "St." : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const WHO_ITS_FOR = [
  "Corporate Team Outings",
  "School Trips & Educational Visits",
  "Friends & Social Gatherings",
  "Large Group Celebrations",
];

const INCLUDED = [
  "Access to multiple attractions",
  "Dedicated group coordination",
  "Flexible scheduling options",
  "Food & beverage options",
  "Reserved group spaces",
];

const WHY_CHOOSE = [
  ["All-in-One Venue", "Activities + food"],
  ["High Engagement", "Keeps everyone involved"],
  ["Scalable Events", "Small to large groups"],
  ["Stress-Free Planning", "We handle logistics"],
];

// Event Types cards are driven by the groups-events children in the Data sheet
// (each card links to its child page). These supply a friendly sub-line by type.
const TYPE_DESCRIPTIONS = [
  [/corporate/i, "Team-building, outings, employee engagement"],
  [/school/i, "Fun + activity-based experiences"],
  [/fund/i, "Community fundraisers & charity events"],
  [/facility|rental/i, "Private facility & space rentals"],
  [/christmas|holiday/i, "Festive holiday celebrations"],
  [/private/i, "Celebrations, reunions, social gatherings"],
];
const typeDesc = (s) => (TYPE_DESCRIPTIONS.find(([re]) => re.test(s)) || [])[1] || "";

// v11 tile color classes: orange => green #B7E600, blue => blue, lime => pink.
const HOW_IT_WORKS = [
  { title: "Submit Your Request", description: "Share your group size and requirements", color: "orange" },
  { title: "Get a Custom Plan", description: "We tailor the experience for your group", color: "blue" },
  { title: "Confirm Booking", description: "Lock your date and package", color: "lime" },
  { title: "Enjoy the Event", description: "We manage everything on-site", color: "orange" },
];

const TESTIMONIALS = [
  "Perfect for our team outing. Everything was organized and smooth.",
  "Great experience for our school trip. Kids loved it.",
];

const GroupsEventsPage = async ({ params }) => {
  const location_slug = params.location_slug;

  const [menudata, locationData, config, pageData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("locations", location_slug),
    fetchsheetdata("config", location_slug),
    fetchPageData(location_slug, "groups-events"),
  ]);

  const waiverLink = await getWaiverLink(location_slug);
  // FAQ: prefer groups-events rows; fall back to the sheet's general FAQ
  // (empty-path rows) since there are no group-specific FAQs in the sheet yet.
  let faqs = await fetchFaqData(location_slug, "groups-events");
  if (!Array.isArray(faqs) || faqs.length === 0) {
    // No group-specific FAQ rows yet — show the general FAQ (empty-path rows),
    // deduped by question and capped so the section stays focused.
    const allFaq = await fetchsheetdata("faq", location_slug);
    const seen = new Set();
    faqs = (Array.isArray(allFaq) ? allFaq : [])
      .filter((f) => !String(f.path || "").trim() && f.question && f.answer)
      .filter((f) => {
        const k = String(f.question).trim().toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 8);
  }

  // Live Google rating (same source as the home SocialProof section).
  const locationid = locationData?.[0]?.locationid;
  const reviewdata = locationid ? await getReviewsData(locationid) : null;
  const googleRating = reviewdata?.rating
    ? Number(reviewdata.rating).toFixed(1)
    : null;

  // Per-location JSON for images (optional override).
  let json = null;
  try {
    json = await fetchHomePageJsonData(location_slug);
  } catch {
    json = null;
  }
  const geJson = json?.groupsEvents || json?.["groups-events"] || {};

  const heroImage = geJson.heroImage || HERO_DEFAULT;
  const gallery =
    Array.isArray(geJson.gallery) && geJson.gallery.length > 0
      ? geJson.gallery.slice(0, 3)
      : GALLERY_DEFAULTS;

  const displayName =
    locationData?.[0]?.displayName || toDisplayName(location_slug);
  const pageTitle =
    pageData?.title || `Plan Your Next Group Event at AeroSports ${displayName}`;
  const pageSmallText =
    pageData?.smalltext ||
    pageData?.metadescription ||
    "From corporate outings to school trips, experience a high-energy event designed for groups of all sizes.";
  const pageEyebrow = pageData?.desc || "Groups & Events";

  // CTA: estorebase -> rollerurl -> waiverLink -> #g1ge-quote anchor
  const estoreConfig = Array.isArray(config)
    ? config.find((item) => item.key === "estorebase")
    : null;
  const bookingLink =
    estoreConfig?.value ||
    locationData?.[0]?.rollerurl ||
    waiverLink ||
    "#g1ge-quote";
  const isExternalBooking = bookingLink.startsWith("http");

  // Event Types: active children of "groups-events" from the Data sheet.
  // Each card links to its child page (/{location}/groups-events/{child.path}).
  const groupsNode = getDataByParentId(menudata, "groups-events")?.[0];
  const eventTypes = (groupsNode?.children || [])
    .filter((c) => String(c.isactive) === "1" && c.path)
    .map((c) => {
      const title = String(c.desc || c.title || c.path)
        .replace(/\s*\/\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        title,
        desc: typeDesc(`${c.path} ${title}`),
        href: `/${location_slug}/groups-events/${c.path}`,
        image: c.smallimage || c.headerimage || "",
        alt: c.smallimage_media?.alt || title,
      };
    });

  return (
    <main className="g1ge_page">
      {/* 1. HERO */}
      <section className="g1ge_hero">
        <div className="g1ge_hero_orb g1ge_hero_orb1" />
        <div className="g1ge_hero_orb g1ge_hero_orb2" />
        <div className="g1ge_hero_inner">
          <div className="g1ge_hero_left">
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              {pageEyebrow}
            </span>
            <h1 className="g1ge_hero_h1">{pageTitle}</h1>
            <p className="g1ge_hero_sub">{pageSmallText}</p>
            <div className="g1ge_hero_actions">
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_green"
                {...(isExternalBooking
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Book Your Event
              </Link>
              <Link href="#g1ge-quote" className="g1ge_btn g1ge_btn_outline">
                Get a Quote
              </Link>
            </div>
            <p className="g1ge_hero_note">Seamless planning. Maximum fun.</p>
          </div>
          <div className="g1ge_hero_visual">
            <div className="g1ge_hero_img">
              <AppImage
                src={heroImage}
                alt={`Group events at AeroSports ${displayName}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="g1ge_trust">
        <div className="g1ge_trust_inner">
          <span className="g1ge_trust_item">
            <strong>10,000+</strong> Events Hosted
          </span>
          <span className="g1ge_trust_sep">·</span>
          <span className="g1ge_trust_item">
            <strong>{googleRating || "4.8"}★</strong> Rated
          </span>
          <span className="g1ge_trust_sep">·</span>
          <span className="g1ge_trust_item">All Ages</span>
          <span className="g1ge_trust_sep">·</span>
          <span className="g1ge_trust_item">Safe</span>
        </div>
      </section>

      {/* 3. WHO IT'S FOR */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Who It&apos;s For</span>
            <h2 className="g1ge_h2">Perfect for Every Group</h2>
          </div>
          <div className="g1ge_grid4">
            {WHO_ITS_FOR.map((title) => (
              <div className="g1ge_card" key={title}>
                <h3>{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT'S INCLUDED */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">What&apos;s Included</span>
            <h2 className="g1ge_h2">Everything Your Group Needs</h2>
          </div>
          <div className="g1ge_included_grid">
            {INCLUDED.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE AEROSPORTS */}
      <section className="g1ge_section g1ge_section_dark">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Why AeroSports</span>
            <h2 className="g1ge_h2 g1ge_h2_light">Why Choose AeroSports</h2>
          </div>
          <div className="g1ge_grid4">
            {WHY_CHOOSE.map(([title, desc], i) => (
              <div className="g1ge_card_dark" key={title}>
                <div className="g1ge_card_dark_icon">{String(i + 1).padStart(2, "0")}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EVENT TYPES */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Event Types</span>
            <h2 className="g1ge_h2">Types of Events We Host</h2>
          </div>
          <div className="g1ge_grid4">
            {eventTypes.map((t) => (
              <Link className="g1ge_card g1ge_card_link g1ge_type_card" key={t.href} href={t.href}>
                {t.image && (
                  <div className="g1ge_type_card_img">
                    <AppImage
                      src={t.image}
                      alt={t.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 25vw"
                    />
                  </div>
                )}
                <div className="g1ge_type_card_body">
                  <h3>{t.title}</h3>
                  {t.desc && <p>{t.desc}</p>}
                </div>
                <span className="g1ge_card_arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS — v11 "Book Your Party"-style numbered cards
          (v11_bp_* classes come from kidsparty.css, loaded by the route). */}
      <section className="v11_bp_steps_section">
        <div className="v11_bp_steps_decor">
          <div className="v11_bp_steps_glow_orange" />
          <div className="v11_bp_steps_glow_blue" />
          <svg className="v11_bp_steps_dots_pattern" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="g1geStepsDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1geStepsDots)" />
          </svg>
        </div>
        <div className="v11_bp_container" style={{ position: "relative", zIndex: 10 }}>
          <div className="v11_bp_steps_header">
            <span className="v11_bp_steps_badge">How It Works</span>
            <h2 className="v11_bp_heading v11_bp_heading_light">
              Plan Your
              <span className="v11_bp_heading_accent_light"> Group Event</span>
            </h2>
            <p className="v11_bp_subtext v11_bp_subtext_light">
              Simple steps to an unforgettable group event in {displayName}.
            </p>
          </div>
          <div className="v11_bp_steps_grid">
            <div className="v11_bp_steps_connector" />
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={step.title}
                className={`v11_bp_step_card v11_bp_step_color_${step.color}`}
              >
                <div className="v11_bp_step_card_inner">
                  <div className="v11_bp_step_number_wrap">
                    <div className="v11_bp_step_number_glow" />
                    <div className="v11_bp_step_number">{index + 1}</div>
                  </div>
                  <div className="v11_bp_step_divider" />
                  <h4 className="v11_bp_step_title">{step.title}</h4>
                  <p className="v11_bp_step_desc">{step.description}</p>
                </div>
                <div className="v11_bp_step_arrow">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GALLERY */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Gallery</span>
            <h2 className="g1ge_h2">See Group Events in Action</h2>
          </div>
          <div className="g1ge_gallery_grid">
            {gallery.map((src, i) => (
              <div className="g1ge_gallery_tile" key={`${src}-${i}`}>
                <AppImage
                  src={src}
                  alt={`AeroSports ${displayName} group event ${i + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Testimonials</span>
            <h2 className="g1ge_h2">What Our Groups Say</h2>
          </div>
          <div className="g1ge_reviews">
            {TESTIMONIALS.map((quote) => (
              <div className="g1ge_review_card" key={quote}>
                <div className="g1ge_review_stars">★★★★★</div>
                <p>{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA + LEAD FORM */}
      <section className="g1ge_quote" id="g1ge-quote">
        <div className="g1ge_quote_bg" />
        <div className="g1ge_quote_inner">
          <div className="g1ge_quote_intro">
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              Get a Quote
            </span>
            <h2 className="g1ge_h2 g1ge_h2_light">Plan Your Event Today</h2>
            <p>Fill in your details and our team will get in touch.</p>
          </div>
          <GroupsEventsLeadForm locationName={displayName} />
        </div>
      </section>

      {/* 11. FAQ */}
      {Array.isArray(faqs) && faqs.length > 0 && (
        <section className="g1ge_section g1ge_section_light">
          <div className="g1ge_container">
            <div className="g1ge_section_head">
              <span className="g1ge_tag">FAQ</span>
              <h2 className="g1ge_h2">Frequently Asked Questions</h2>
            </div>
            <div className="g1ge_faq_list">
              {faqs.map((faq, i) => (
                <div className="g1ge_faq_item" key={faq.question || i}>
                  <h3>{faq.question}</h3>
                  <div>{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. FINAL CTA */}
      <section className="g1ge_final">
        <div className="g1ge_final_bg" />
        <div className="g1ge_final_inner">
          <h2>
            Let&apos;s Plan Something <em>Amazing</em>
          </h2>
          <Link
            href={bookingLink}
            className="g1ge_btn g1ge_btn_green"
            {...(isExternalBooking
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Book Your Event
          </Link>
        </div>
      </section>
    </main>
  );
};

export default GroupsEventsPage;
