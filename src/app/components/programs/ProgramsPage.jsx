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

const HERO_DEFAULT = "https://media.aerosportsparks.ca/webp/common/camps.webp";
const GALLERY_DEFAULTS = [
  "https://media.aerosportsparks.ca/webp/common/camps.webp",
  "https://media.aerosportsparks.ca/home-experience/gallery.webp",
  "https://media.aerosportsparks.ca/home-experience/group-events.webp",
];

function toDisplayName(slug) {
  return String(slug || "")
    .split("-")
    .map((w) => (w === "st" ? "St." : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const WHAT_YOULL_GAIN = [
  "Improved coordination and balance",
  "Increased physical activity",
  "Confidence and social interaction",
  "Guided learning in a fun environment",
];

const WHY_CHOOSE = [
  ["Expert Guidance", "Trained staff"],
  ["Structured Learning", "Planned sessions"],
  ["Fun Environment", "Engaging & active"],
  ["Consistent Progress", "Designed for improvement"],
];

const FLEXIBLE_SCHEDULING = [
  "Multiple time slots available",
  "Weekday and weekend options",
  "Designed for convenience",
];

// Program Types cards are driven by the "programs" children in the Data sheet
// (each card links to its child page). These supply a friendly sub-line by type.
const TYPE_DESCRIPTIONS = [
  [/kids|camp/i, "Skill-building, fun, structured activities"],
  [/fitness|training|aero[\s-]?fit|\bfit\b/i, "Active sessions for movement & strength"],
  [/skill|development/i, "Coordination, agility & confidence"],
  [/glow/i, "After-dark glow sessions"],
  [/toddler/i, "Safe play for little ones"],
  [/lock[\s-]?in/i, "After-hours private group lock-ins"],
];
const typeDesc = (s) => (TYPE_DESCRIPTIONS.find(([re]) => re.test(s)) || [])[1] || "";
const isLegacyBrokenImage = (src) =>
  typeof src === "string" && src.includes("storage.googleapis.com/msgsndr/");
const getProgramCardImage = (program) => {
  const primary = program.smallimage || program.smallimage_media?.desktop_url;
  if (primary && !isLegacyBrokenImage(primary)) return primary;

  const fallback = program.headerimage || program.headerimage_media?.desktop_url;
  if (fallback && !isLegacyBrokenImage(fallback)) return fallback;

  return HERO_DEFAULT;
};

// v11 tile color classes: orange => green #B7E600, blue => blue, lime => pink.
const HOW_IT_WORKS = [
  { title: "Choose Your Program", description: "Select based on age or interest", color: "orange" },
  { title: "Enroll", description: "Register for your preferred schedule", color: "blue" },
  { title: "Attend Sessions", description: "Participate in guided activities", color: "lime" },
  { title: "Track Progress", description: "Build skills over time", color: "orange" },
];

const TESTIMONIALS = [
  "My kids look forward to every session — they've grown so much in confidence.",
  "Great structured programs and friendly staff. Highly recommend.",
];

const ProgramsPage = async ({ params }) => {
  const location_slug = params.location_slug;

  const [menudata, locationData, config, pageData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("locations", location_slug),
    fetchsheetdata("config", location_slug),
    fetchPageData(location_slug, "programs"),
  ]);

  const waiverLink = await getWaiverLink(location_slug);
  // FAQ: prefer programs rows; fall back to the sheet's general FAQ
  // (empty-path rows) since there are no program-specific FAQs in the sheet yet.
  let faqs = await fetchFaqData(location_slug, "programs");
  if (!Array.isArray(faqs) || faqs.length === 0) {
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
  const programsJson = json?.programs || {};

  const heroImage = programsJson.heroImage || HERO_DEFAULT;
  const gallery =
    Array.isArray(programsJson.gallery) && programsJson.gallery.length > 0
      ? programsJson.gallery.slice(0, 3)
      : GALLERY_DEFAULTS;

  const displayName =
    locationData?.[0]?.displayName || toDisplayName(location_slug);
  const pageTitle =
    pageData?.title || `Learn, Play & Grow at AeroSports ${displayName}`;
  const pageSmallText =
    pageData?.smalltext ||
    pageData?.metadescription ||
    "Discover structured programs designed to build skills, confidence, and fitness through fun.";
  const pageEyebrow = pageData?.desc || "Programs";

  // CTA: estorebase -> rollerurl -> waiverLink -> #programs-types anchor
  const estoreConfig = Array.isArray(config)
    ? config.find((item) => item.key === "estorebase")
    : null;
  const bookingLink =
    estoreConfig?.value ||
    locationData?.[0]?.rollerurl ||
    waiverLink ||
    "#";
  const isExternalBooking = bookingLink.startsWith("http");

  // Program Types: active children of "programs" from the Data sheet.
  // Each card links to its child page (/{location}/programs/{child.path}).
  const programsNode = getDataByParentId(menudata, "programs")?.[0];
  const programTypes = (programsNode?.children || [])
    .filter((c) => String(c.isactive) === "1" && c.path)
    .map((c) => {
      const title = String(c.desc || c.title || c.path)
        .replace(/\s*\/\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        title,
        desc: typeDesc(`${c.path} ${title}`),
        href: `/${location_slug}/programs/${c.path}`,
        image: getProgramCardImage(c),
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
              <Link href="#programs-types" className="g1ge_btn g1ge_btn_green">
                Explore Programs
              </Link>
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_outline"
                {...(isExternalBooking
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Enroll Now
              </Link>
            </div>
            <p className="g1ge_hero_note">
              Fun meets learning. Every session counts.
            </p>
          </div>
          <div className="g1ge_hero_visual">
            <div className="g1ge_hero_img">
              <AppImage
                src={heroImage}
                alt={`Programs at AeroSports ${displayName}`}
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
            <strong>10,000+</strong> Participants
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

      {/* 3. PROGRAM TYPES */}
      <section className="g1ge_section g1ge_section_white" id="programs-types">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Programs</span>
            <h2 className="g1ge_h2">Our Programs</h2>
          </div>
          <div className="g1ge_grid4">
            {programTypes.map((t) => (
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

      {/* 4. WHAT YOU'LL GAIN */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">What You&apos;ll Gain</span>
            <h2 className="g1ge_h2">Build More Than Skills</h2>
          </div>
          <div className="g1ge_included_grid">
            {WHAT_YOULL_GAIN.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE OUR PROGRAMS */}
      <section className="g1ge_section g1ge_section_dark">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Why Choose Us</span>
            <h2 className="g1ge_h2 g1ge_h2_light">Why Choose Our Programs</h2>
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

      {/* 6. HOW IT WORKS — v11 numbered cards (v11_bp_* via kidsparty.css). */}
      <section className="v11_bp_steps_section">
        <div className="v11_bp_steps_decor">
          <div className="v11_bp_steps_glow_orange" />
          <div className="v11_bp_steps_glow_blue" />
          <svg className="v11_bp_steps_dots_pattern" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="programsStepsDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#programsStepsDots)" />
          </svg>
        </div>
        <div className="v11_bp_container" style={{ position: "relative", zIndex: 10 }}>
          <div className="v11_bp_steps_header">
            <span className="v11_bp_steps_badge">How It Works</span>
            <h2 className="v11_bp_heading v11_bp_heading_light">
              Plan Your
              <span className="v11_bp_heading_accent_light"> Program Journey</span>
            </h2>
            <p className="v11_bp_subtext v11_bp_subtext_light">
              Simple steps to get started at AeroSports {displayName}.
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

      {/* 7. FLEXIBLE SCHEDULING */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Scheduling</span>
            <h2 className="g1ge_h2">Flexible Scheduling</h2>
          </div>
          <div className="g1ge_included_grid">
            {FLEXIBLE_SCHEDULING.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
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
            <h2 className="g1ge_h2">See Our Programs in Action</h2>
          </div>
          <div className="g1ge_gallery_grid">
            {gallery.map((src, i) => (
              <div className="g1ge_gallery_tile" key={`${src}-${i}`}>
                <AppImage
                  src={src}
                  alt={`AeroSports ${displayName} program ${i + 1}`}
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
            <h2 className="g1ge_h2">What Families Say</h2>
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

      {/* 10. CTA BLOCK (quote styling, buttons not form) */}
      <section className="g1ge_quote" id="programs-cta">
        <div className="g1ge_quote_bg" />
        <div className="g1ge_quote_inner" style={{ gridTemplateColumns: "1fr" }}>
          <div className="g1ge_quote_intro" style={{ textAlign: "center" }}>
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              Get Started
            </span>
            <h2 className="g1ge_h2 g1ge_h2_light">Ready to Get Started?</h2>
            <p>Enroll in a program and start building skills today.</p>
            <div
              className="g1ge_hero_actions"
              style={{ justifyContent: "center", marginTop: "24px", marginBottom: 0 }}
            >
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_green"
                {...(isExternalBooking
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Enroll Now
              </Link>
              <Link href="#programs-types" className="g1ge_btn g1ge_btn_outline">
                Explore Programs
              </Link>
            </div>
          </div>
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
            Start Learning While <em>Having Fun</em>
          </h2>
          <Link
            href={bookingLink}
            className="g1ge_btn g1ge_btn_green"
            {...(isExternalBooking
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Enroll Today
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProgramsPage;
