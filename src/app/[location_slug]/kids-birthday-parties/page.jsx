import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import {
  fetchsheetdata,
  fetchPageData,
  generateMetadataLib,
  fetchMenuData,
  getWaiverLink,
  generateSchema,
  fetchBirthdayPartyJson,
  fetchFaqData,
} from "@/lib/sheets";
import MotionImage from "@/components/MotionImage";
import dynamic from "next/dynamic";
const TermsModal = dynamic(() => import("@/components/TermsModal"));
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"));
const BirthdayFAQ = dynamic(() => import("./BirthdayFAQ"));
import Link from "next/link";
import { sanitizeCmsHtml } from "@/utils/customFunctions";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "kids-birthday-parties",
  });
  return metadata;
}

const Page = async ({ params }) => {
  const location_slug = params.location_slug;

  const [
    data,
    birthdaydata,
    birthdayPartyJson,
    menudata,
    waiverLink,
    locationData,
    faqData,
  ] = await Promise.all([
    fetchPageData(location_slug, "kids-birthday-parties"),
    fetchsheetdata("birthday packages", location_slug),
    fetchBirthdayPartyJson(location_slug),
    fetchMenuData(location_slug),
    getWaiverLink(location_slug),
    fetchsheetdata("locations", location_slug),
    fetchFaqData(location_slug, "kids-birthday-parties"),
  ]);

  const attractions = menudata?.filter((item) => item.path == "attractions")[0];
  const blogsData = menudata?.filter((item) => item.path === "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  const jsonLDschema = await generateSchema(
    data,
    locationData,
    "",
    "kids-birthday-parties"
  );
  console.log("locationData", locationData);
  const pageData = data;
  const locData = locationData[0];
  const birthdayUrl = locationData[0]?.birthdayurlz || `/${location_slug}/kids-birthday-parties`;
  console.log("birthdayUrl", birthdayUrl);
  const locationName =
    locData?.location?.charAt(0).toUpperCase() +
    locData?.location?.slice(1) || "Our Location";

  const toTelHref = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "tel:";
    const e164 =
      digits.length === 11 && digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;
    return `tel:${e164}`;
  };

  // ── Pull dynamic content from birthdayPartyJson (Google Sheet) ──
  const defaultStats = [
    { number: "5,000+", label: "Parties Hosted" },
    { number: "4.8", label: "Average Rating" },
    { number: "2+ hrs", label: "Of Non-Stop Fun" },
    { number: "100%", label: "Stress-Free Planning" },
  ];
  const stats = birthdayPartyJson?.stats || defaultStats;

  const defaultFeatures = [
    { title: "Safety First", description: "Certified safety standards, padded equipment, and trained staff ensure every child has a safe adventure.", icon: "shield" },
    { title: "Dedicated Party Hosts", description: "Our expert hosts handle everything so parents can relax and enjoy the celebration alongside their kids.", icon: "users" },
    { title: "All-Inclusive Packages", description: "Food, drinks, party room, and unlimited attractions access — all bundled so there are no surprise costs.", icon: "star" },
    { title: "Easy Online Booking", description: "Book your party in minutes online or by phone. Choose your package, pick a date, and we take care of the rest.", icon: "calendar" },
    { title: "Ages 4 to 17", description: "Activities designed for every age group — from gentle bounce zones for little ones to extreme challenges for teens.", icon: "smile" },
    { title: "Unforgettable Memories", description: "From the moment they arrive to the last jump, every guest leaves with an experience they will talk about for weeks.", icon: "heart" },
  ];
  const features = birthdayPartyJson?.features || defaultFeatures;

  const defaultSteps = [
    { title: "Choose a Package", description: "Browse our 3-tier system — Premium, VIP, or Ultimate — and pick what fits your group.", color: "orange" },
    { title: "Call or Book Online", description: "", color: "blue" },
    { title: "We Handle the Rest", description: "Your host contacts you to finalize décor, food preferences, and party timing.", color: "lime" },
    { title: "Party Time!", description: "Arrive, jump, celebrate — and let us make it the birthday they'll never forget.", color: "orange", isEmoji: true },
  ];
  // Always use V11-style 4-step flow (overrides sheet data which had old 3-step)
  const stepColors = ["orange", "blue", "lime", "orange"];
  const steps = defaultSteps;

  // Default testimonials data
  const defaultTestimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "The best birthday party my daughter has ever had! The staff handled everything from setup to cleanup. All the kids had an absolute blast on the trampolines and obstacle courses.",
      verified: true,
      featured: false,
    },
    {
      name: "James R.",
      rating: 5,
      text: "We've hosted three parties here now and each one has been incredible. The dedicated party host made everything seamless — we just showed up and enjoyed the celebration with our son.",
      verified: true,
      featured: true,
    },
    {
      name: "Priya K.",
      rating: 5,
      text: "Amazing value for money. The all-inclusive package meant zero stress for us. Every child left with a huge smile. Already planning next year's party here!",
      verified: true,
      featured: false,
    },
  ];
  const testimonials = birthdayPartyJson?.testimonials || defaultTestimonials;

  // Feature tooltip descriptions for the package table
  const featureTooltips = {
    "Jump Time": "Total time your group gets on trampolines and attractions",
    "Party Room": "Private decorated room for cake, food, and presents",
    "Total Experience": "Combined jump time plus party room time",
    "Private Party Room": "Exclusive room reserved only for your group",
    "Digital Attractions": "Access to VR games, arcade, and digital experiences",
    "Free SkySocks": "Complimentary grip socks for all party guests",
    "Pizza": "Freshly made pizza included for all guests",
    "Bowls of Chips & Popcorn": "Snack bowls of chips and popcorn for the group",
    "Outside Food": "Permission to bring your own food and drinks",
    "Valo Arena & Arcade Game Cards": "Includes Valo Arena session and arcade credits",
    "Birthday T-Shirt": "Special birthday t-shirt for the guest of honour",
    "Free 30 Day Pass": "Free 30-day return pass for the birthday child",
  };

  // Feature icons for the package table (SVG paths)
  const featureIconMap = {
    "Jump Time": <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    "Party Room": <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    "Total Experience": <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>,
    "Private Party Room": <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></>,
    "Digital Attractions": <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
    "Free SkySocks": <path d="M20.38 3.46L16 2 10.12 8.88a3.5 3.5 0 0 0 4.95 4.95L20.38 3.46zM7.1 11.5l-4.6 4.6a2 2 0 0 0 2.83 2.83l4.6-4.6" />,
    "Pizza": <><path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><path d="M2 16l20-12L18 20 2 16z" /></>,
    "Bowls of Chips & Popcorn": <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>,
    "Outside Food": <><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
    "Valo Arena & Arcade Game Cards": <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    "Birthday T-Shirt": <><path d="M20.38 3.46L16 2 10.12 8.88a3.5 3.5 0 0 0 4.95 4.95L20.38 3.46zM7.1 11.5l-4.6 4.6a2 2 0 0 0 2.83 2.83l4.6-4.6" /></>,
    "Free 30 Day Pass": <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  };

  // Build FAQ schema for SEO
  const faqSchema =
    faqData && faqData.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqData.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        })
      : null;

  // Icon SVG map for features
  const iconMap = {
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    smile: <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  };

  // Feature icon accent colors (v11 style)
  const featureAccents = [
    { bg: "rgba(255, 23, 74, 0.08)", color: "#FF174A", border: "rgba(255, 23, 74, 0.15)" },
    { bg: "rgba(59, 130, 246, 0.08)", color: "#3B82F6", border: "rgba(59, 130, 246, 0.15)" },
    { bg: "rgba(245, 158, 11, 0.08)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.15)" },
    { bg: "rgba(16, 185, 129, 0.08)", color: "#10B981", border: "rgba(16, 185, 129, 0.15)" },
    { bg: "rgba(139, 92, 246, 0.08)", color: "#8B5CF6", border: "rgba(139, 92, 246, 0.15)" },
    { bg: "rgba(236, 72, 153, 0.08)", color: "#EC4899", border: "rgba(236, 72, 153, 0.15)" },
  ];

  // Package column accent colors
  const packageColors = [
    { bg: "#FF174A", light: "rgba(255, 23, 74, 0.06)", border: "rgba(255, 23, 74, 0.2)" },
    { bg: "#3B82F6", light: "rgba(59, 130, 246, 0.06)", border: "rgba(59, 130, 246, 0.2)" },
    { bg: "#8B5CF6", light: "rgba(139, 92, 246, 0.06)", border: "rgba(139, 92, 246, 0.2)" },
    { bg: "#F59E0B", light: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.2)" },
    { bg: "#10B981", light: "rgba(16, 185, 129, 0.06)", border: "rgba(16, 185, 129, 0.2)" },
  ];

  return (
    <main className={`v11_bp_page ${robotoCondensed.variable}`}>
      {/* ══════════════════════════════════════════════
          SECTION 1: Hero Banner
          ══════════════════════════════════════════════ */}
      <MotionImage
        pageData={data}
        waiverLink={waiverLink}
        locationData={locationData}
        headingAs="h1"
      />

      {/* ══════════════════════════════════════════════
          V11-STYLE LIGHT THEME BIRTHDAY PAGE
          ══════════════════════════════════════════════ */}
      <div className="v11_bp_wrapper">

        {/* ── SECTION 2: Stats Bar ── */}
        <section className="v11_bp_stats_section">
          <div className="v11_bp_container">
            <div className="v11_bp_stats_grid">
              {stats.map((stat, index) => (
                <div key={index} className="v11_bp_stat_item">
                  <span className="v11_bp_stat_number">{stat.number}</span>
                  <span className="v11_bp_stat_label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Location Intro ── */}
        <section className="v11_bp_intro_section">
          <div className="v11_bp_container">
            <h2 className="v11_bp_heading">
              Kids Birthday Parties
              <span className="v11_bp_heading_accent">in {locationName}</span>
            </h2>
            <p className="v11_bp_intro_text">
              {birthdayPartyJson?.location?.description ||
                `Looking for the best place to celebrate your child's birthday? Look no further than AeroSports Trampoline Park ${locationName}. With wall-to-wall trampolines, obstacle courses, and dedicated party rooms, every birthday becomes an unforgettable adventure.`}
            </p>
          </div>
        </section>

        {/* ── SECTION 4: Package Comparison (Dark Navy) ── */}
        <section className="v11_bp_packages_section">
          <div className="v11_bp_container">
            <div className="v11_bp_packages_header">
              <p className="v11_bp_packages_eyebrow">Customized Experiences</p>
              <h2 className="v11_bp_heading v11_bp_heading_light">
                Built for Pure
                <span className="v11_bp_heading_accent_light"> Excitement</span>
              </h2>
              <p className="v11_bp_packages_subtitle">
                All-inclusive experiences — designed for every celebration
              </p>
            </div>

            {birthdayPartyJson?.party_packages ? (
              <div className="v11_bp_packages_table_wrap">
                {(() => {
                  const packageNames = Object.keys(birthdayPartyJson.party_packages);
                  const allFeaturesSet = new Set();
                  Object.values(birthdayPartyJson.party_packages).forEach(
                    (pkg) => Object.keys(pkg).forEach((f) => allFeaturesSet.add(f))
                  );
                  const allFeatures = Array.from(allFeaturesSet);

                  return (
                    <div
                      className="v11_bp_pkg_grid"
                      style={{
                        gridTemplateColumns: `minmax(180px, 1.2fr) repeat(${packageNames.length}, minmax(130px, 1fr))`,
                      }}
                    >
                      {/* Header row */}
                      <div className="v11_bp_pkg_cell v11_bp_pkg_header v11_bp_pkg_feature_label">
                        What&apos;s Included
                      </div>
                      {packageNames.map((name, i) => (
                        <div
                          key={name}
                          className="v11_bp_pkg_cell v11_bp_pkg_header v11_bp_pkg_name"
                          style={{ backgroundColor: packageColors[i % packageColors.length].bg }}
                        >
                          {name}
                        </div>
                      ))}

                      {/* Data rows */}
                      {allFeatures.map((feature, rowIdx) => (
                        <React.Fragment key={feature}>
                          <div className={`v11_bp_pkg_cell v11_bp_pkg_feature_label v11_bp_pkg_row_hover ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}>
                            <span className="v11_bp_pkg_feature_icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {featureIconMap[feature] || <circle cx="12" cy="12" r="10" />}
                              </svg>
                            </span>
                            <span className="v11_bp_pkg_feature_text">{feature}</span>
                            {featureTooltips[feature] && (
                              <span className="v11_bp_pkg_tooltip_wrap">
                                <span className="v11_bp_pkg_info_icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                  </svg>
                                </span>
                                <span className="v11_bp_pkg_tooltip">{featureTooltips[feature]}</span>
                              </span>
                            )}
                          </div>
                          {packageNames.map((pkgName, pkgIdx) => {
                            const value = birthdayPartyJson.party_packages[pkgName][feature];
                            const color = packageColors[pkgIdx % packageColors.length];
                            return (
                              <div
                                key={`${feature}-${pkgName}`}
                                className={`v11_bp_pkg_cell v11_bp_pkg_value v11_bp_pkg_row_hover ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}
                                style={{ borderLeft: `2px solid ${color.border}` }}
                              >
                                {value === undefined || value === null ? (
                                  <span className="v11_bp_pkg_na">&mdash;</span>
                                ) : typeof value === "boolean" ? (
                                  value ? (
                                    <span className="v11_bp_pkg_check">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </span>
                                  ) : (
                                    <span className="v11_bp_pkg_cross">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </svg>
                                    </span>
                                  )
                                ) : (
                                  <span className="v11_bp_pkg_text">{value}</span>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}

                      {/* CTA row */}
                      <div className="v11_bp_pkg_cell v11_bp_pkg_cta_label" />
                      {packageNames.map((name, i) => (
                        <div key={`cta-${name}`} className="v11_bp_pkg_cell v11_bp_pkg_cta">
                          <a
                            href={birthdayUrl || `/${location_slug}/kids-birthday-parties`}
                            className="v11_bp_pkg_book_btn"
                            style={{ backgroundColor: packageColors[i % packageColors.length].bg }}
                            target={birthdayUrl ? "_blank" : undefined}
                            rel={birthdayUrl ? "noopener noreferrer" : undefined}
                          >
                            Book {name.split(" ")[0]}
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* View details + invitation links */}
                <div className="v11_bp_packages_actions">
                  {pageData?.section2 && (
                    <TermsModal
                      content={pageData.section2}
                      buttonText="View Packages Detail"
                      title="Package Details"
                      showAsButton={true}
                    />
                  )}
                  <Link
                    href={`/${location_slug}/kids-birthday-parties/invitations`}
                    className="v11_bp_invite_btn"
                  >
                    Generate Your Custom Birthday Invitation
                  </Link>
                </div>

                {locData?.phone && (
                  <p className="v11_bp_packages_phone">
                    Call for Custom Group Quotes —{" "}
                    <a href={toTelHref(locData.phone)}>{locData.phone}</a>
                  </p>
                )}
              </div>
            ) : (
              <article className="aero_bp_2_main_section">
                {birthdaydata.map((item, i) => {
                  const includedata = item.includes.split(";");
                  return (
                    <div key={i} className="aero_bp_card_wrap">
                      <div className="aero-bp-boxcircle-wrap">
                        <span className="aero-bp-boxcircle">${item?.price}</span>
                      </div>
                      <div className="aero-bp-boxcircle-wrap">{item?.category}</div>
                      <h2 className="d-flex-center aero_bp_card_wrap_heading">{item?.plantitle}</h2>
                      <ul className="aero_bp_card_wrap_list">
                        {includedata?.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </article>
            )}
          </div>
        </section>

        {/* ── SECTION 5: Why AeroSports (Features) ── */}
        <section className="v11_bp_features_section">
          <div className="v11_bp_container">
            <h2 className="v11_bp_heading">
              Everything You Need
              <span className="v11_bp_heading_accent">for the Perfect Party</span>
            </h2>
            <p className="v11_bp_subtext">
              A complete, elevated experience — designed so parents can relax and kids can have the time of their lives.
            </p>

            <div className="v11_bp_features_grid">
              {features.map((feature, index) => {
                const accent = featureAccents[index % featureAccents.length];
                return (
                  <div key={index} className="v11_bp_feature_card">
                    <div
                      className="v11_bp_feature_icon"
                      style={{ backgroundColor: accent.bg, color: accent.color, border: `1px solid ${accent.border}` }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {iconMap[feature.icon] || iconMap.star}
                      </svg>
                    </div>
                    <h3 className="v11_bp_feature_title">{feature.title}</h3>
                    <p className="v11_bp_feature_desc">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 6: Attractions Grid ── */}
        {attractions?.children && attractions.children.length > 0 && (
          <section className="v11_bp_attractions_section">
            <div className="v11_bp_container">
              <h2 className="v11_bp_heading">
                All Park Attractions
                <span className="v11_bp_heading_accent"> Available to Your Party Guests</span>
              </h2>
              <p className="v11_bp_subtext">
                Every package grants your entire group  access to all our core attractions at no cost and additional attractions — at discounted rates!
              </p>

              <div className="v11_bp_attractions_grid">
                {attractions.children.slice(0, 12).map((attraction, index) => (
                  <Link
                    key={index}
                    href={`/${location_slug}/attractions/${attraction.path}`}
                    className="v11_bp_attraction_card"
                  >
                    <div className="v11_bp_attraction_img">
                      {attraction.headerimage ? (
                        <img
                          src={attraction.headerimage}
                          alt={attraction.name || attraction.path?.replace(/-/g, " ")}
                          loading="lazy"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="v11_bp_attraction_placeholder" />
                      )}
                    </div>
                    <div className="v11_bp_attraction_overlay">
                      <h3 className="v11_bp_attraction_name">
                        {attraction.name || attraction.path?.replace(/-/g, " ")}
                      </h3>
                      <span className="v11_bp_attraction_more">More</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 7: How to Book (Dark Navy) ── */}
        <section className="v11_bp_steps_section">
          {/* Decorative backgrounds */}
          <div className="v11_bp_steps_decor">
            <div className="v11_bp_steps_glow_orange" />
            <div className="v11_bp_steps_glow_blue" />
            <svg className="v11_bp_steps_dots_pattern" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="stepsDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stepsDots)" />
            </svg>
          </div>

          <div className="v11_bp_container" style={{ position: 'relative', zIndex: 10 }}>
            <div className="v11_bp_steps_header">
              <span className="v11_bp_steps_badge">Booking Process</span>
              <h2 className="v11_bp_heading v11_bp_heading_light">
                How to
                <span className="v11_bp_heading_accent_light"> Book Your Party</span>
              </h2>
              <p className="v11_bp_subtext v11_bp_subtext_light">
                Simple steps to the most unforgettable birthday in {locationName}.
              </p>
            </div>

            <div className="v11_bp_steps_grid">
              {/* Connector line (desktop) */}
              <div className="v11_bp_steps_connector" />

              {steps.map((step, index) => {
                const colorClass = `v11_bp_step_color_${step.color || 'orange'}`;
                return (
                  <div key={index} className={`v11_bp_step_card ${colorClass}`}>
                    <div className="v11_bp_step_card_inner">
                      <div className="v11_bp_step_number_wrap">
                        <div className="v11_bp_step_number_glow" />
                        <div className="v11_bp_step_number">
                          {step.isEmoji ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="v11_bp_step_emoji_icon">
                              <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>
                      <div className="v11_bp_step_divider" />
                      <h4 className="v11_bp_step_title">{step.title}{step.isEmoji ? " 🎉" : ""}</h4>
                      <p className="v11_bp_step_desc">
                        {index === 1 ? (
                          <>
                            Reach us at{" "}
                            <a href={toTelHref(locData?.phone)} className="v11_bp_step_phone">
                              {locData?.phone || "us"}
                            </a>{" "}or use our online form to lock in your date.
                          </>
                        ) : (
                          step.description
                        )}
                      </p>
                    </div>
                    {/* Arrow indicator at bottom */}
                    <div className="v11_bp_step_arrow">
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA bar under steps */}
            {locData?.phone && (
              <div className="v11_bp_steps_cta_bar">
                <div className="v11_bp_steps_cta_bar_inner">
                  <div className="v11_bp_steps_cta_text">
                    <h3>Ready to Get Started?</h3>
                    <p>Call our team — we&apos;ll walk you through every step.</p>
                  </div>
                  <a href={toTelHref(locData.phone)} className="v11_bp_steps_call_btn">
                    Call {locData.phone} &rarr;
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 8: Testimonials / Reviews ── */}
        <section className="v11_bp_testimonials_section">
          <div className="v11_bp_container">
            <div className="v11_bp_testimonials_header">
              <h2 className="v11_bp_heading">
                What Our Party Guests
                <span className="v11_bp_heading_accent"> Say</span>
              </h2>
              <div className="v11_bp_rating_badge">
                <svg className="v11_bp_rating_star" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="v11_bp_rating_score">4.9</span>
                <span className="v11_bp_rating_label">500+ Google Reviews</span>
              </div>
            </div>

            <div className="v11_bp_testimonials_grid">
              {testimonials.map((review, index) => (
                <div
                  key={index}
                  className={`v11_bp_review_card ${review.featured ? "v11_bp_review_featured" : ""}`}
                >
                  <div className="v11_bp_review_accent" />
                  <div className="v11_bp_review_quote">
                    <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <div className="v11_bp_review_stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="v11_bp_star_icon">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="v11_bp_review_text">{review.text}</p>
                  <div className="v11_bp_review_author">
                    <div className="v11_bp_review_avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div className="v11_bp_review_meta">
                      <span className="v11_bp_review_name">{review.name}</span>
                      {review.verified && (
                        <span className="v11_bp_review_verified">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {review.featured && (
                    <span className="v11_bp_review_featured_badge">Featured</span>
                  )}
                </div>
              ))}
            </div>

            <div className="v11_bp_trust_bar">
              <div className="v11_bp_trust_item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                All Reviews Verified
              </div>
              <div className="v11_bp_trust_item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                500+ Google Reviews
              </div>
              <div className="v11_bp_trust_item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                  <path d="M4 22H2V11h2" />
                </svg>
                98% Would Recommend
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 9: FAQ ── */}

        {faqData && faqData.length > 0 && (
          <section className="v11_bp_faq_section">
            <div className="v11_bp_container">
              <h2 className="v11_bp_heading">
                Frequently
                <span className="v11_bp_heading_accent"> Asked Questions</span>
              </h2>
              <BirthdayFAQ faqData={faqData} />
            </div>
          </section>
        )}

        {/* ── SECTION 10: SEO Content ── */}
        {pageData?.seosection && (
          <section className="v11_bp_seo_section">
            <div className="v11_bp_container">
              <div
                className="v11_bp_seo_content"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData.seosection) }}
              />
            </div>
          </section>
        )}

        {/* ── SECTION 11: Final CTA + Location ── */}
        <section className="v11_bp_cta_section">
          <div className="v11_bp_container">
            <div className="v11_bp_cta_card">
              {/* Decorative background */}
              <div className="v11_bp_cta_decor">
                <div className="v11_bp_cta_glow_orange" />
                <div className="v11_bp_cta_glow_blue" />
                <div className="v11_bp_cta_ring" />
              </div>

              <p className="v11_bp_cta_eyebrow">Ready? Let&apos;s Go!</p>
              <h2 className="v11_bp_cta_heading">
                Book an Ultimate<br />
                <span className="v11_bp_heading_accent_light">Birthday</span> Party!
              </h2>
              <p className="v11_bp_cta_desc">
                Our team is ready to help you plan the most unforgettable celebration.
                Experience the thrill of {locationName}&apos;s premier trampoline park today.
              </p>

              <div className="v11_bp_cta_buttons">
                {locData?.phone && (
                  <a href={toTelHref(locData.phone)} className="v11_bp_cta_btn v11_bp_cta_btn_call">
                    Call {locData.phone}
                  </a>
                )}

              <a
                href={locData?.birthdayurlz || `/${location_slug}/kids-birthday-parties`}
                className="v11_bp_cta_btn v11_bp_cta_btn_book"
                target={locData?.birthdayurlz ? "_blank" : undefined}
                rel={locData?.birthdayurlz ? "noopener noreferrer" : undefined}
              >
                Book Online Now &rarr;
              </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════
          JSON-LD Structured Data
          ══════════════════════════════════════════════ */}
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory="kids-birthday-parties"
        />
      )}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
    </main>
  );
};

export default Page;
