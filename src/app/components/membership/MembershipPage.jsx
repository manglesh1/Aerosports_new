import "../../styles/groups-events.css";
import Link from "next/link";
import AppImage from "@/components/AppImage";
import {
  fetchMenuData,
  fetchsheetdata,
  getWaiverLink,
  fetchPageData,
  fetchFaqData,
} from "@/lib/sheets";

const HERO_DEFAULT =
  "https://media.aerosportsparks.ca/home-experience/gallery.webp";

function toDisplayName(slug) {
  return String(slug || "")
    .split("-")
    .map((w) => (w === "st" ? "St." : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const CORE_VALUE = [
  "Unlimited or discounted access",
  "Better value than single visits",
  "Priority access and perks",
  "Ideal for regular visitors and families",
];

const WHAT_YOU_GET = [
  "More visits for less",
  "Consistent access to all attractions",
  "Special member-only offers",
  "Seamless and quick entry",
];

const WHO_ITS_FOR = [
  "Families who visit regularly",
  "Kids and teens who love active play",
  "Fitness and activity seekers",
  "Anyone looking for better value per visit",
];

const PLANS = [
  {
    name: "Basic Plan",
    featured: false,
    features: ["Access to attractions", "Member pricing", "Flexible usage"],
  },
  {
    name: "Premium Plan",
    featured: true,
    features: [
      "All Basic features",
      "Priority access",
      "Exclusive perks",
      "Better savings",
    ],
  },
];

// v11 tile color classes: orange => green, blue => blue, lime => pink.
const HOW_IT_WORKS = [
  {
    title: "Choose Your Plan",
    description: "Select the membership that fits your needs",
    color: "orange",
  },
  { title: "Sign Up", description: "Quick and simple registration", color: "blue" },
  {
    title: "Start Visiting",
    description: "Use your membership anytime",
    color: "lime",
  },
];

const FALLBACK_FAQS = [
  {
    question: "Is membership worth it?",
    answer:
      "Yes — if you visit more than once, it offers better value than single visits.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "This depends on the plan selected — ask our team for details.",
  },
  {
    question: "Are all attractions included?",
    answer: "Most attractions are included; check plan details.",
  },
  {
    question: "Can multiple people share a membership?",
    answer: "Memberships are typically individual.",
  },
];

const MembershipPage = async ({ params }) => {
  const location_slug = params.location_slug;

  const [menudata, locationData, config, pageData] = await Promise.all([
    fetchMenuData(location_slug),
    fetchsheetdata("locations", location_slug),
    fetchsheetdata("config", location_slug),
    fetchPageData(location_slug, "membership"),
  ]);

  const waiverLink = await getWaiverLink(location_slug);

  let faqs = await fetchFaqData(location_slug, "membership");
  if (!Array.isArray(faqs) || faqs.length === 0) {
    faqs = FALLBACK_FAQS;
  }

  const displayName =
    locationData?.[0]?.displayName || toDisplayName(location_slug);

  // CTA: estorebase -> rollerurl -> waiverLink -> #
  const estoreConfig = Array.isArray(config)
    ? config.find((item) => item.key === "estorebase")
    : null;
  const bookingLink =
    estoreConfig?.value || locationData?.[0]?.rollerurl || waiverLink || "#";
  const isExternalBooking = bookingLink.startsWith("http");
  const bookingProps = isExternalBooking
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const heroImage = pageData?.smallimage || HERO_DEFAULT;

  return (
    <main className="g1ge_page">
      {/* 1. HERO */}
      <section className="g1ge_hero">
        <div className="g1ge_hero_orb g1ge_hero_orb1" />
        <div className="g1ge_hero_orb g1ge_hero_orb2" />
        <div className="g1ge_hero_inner">
          <div className="g1ge_hero_left">
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              Membership
            </span>
            <h1 className="g1ge_hero_h1">
              Unlimited Fun, One Simple{" "}
              <em style={{ color: "var(--g1ge-green)", fontStyle: "normal" }}>
                Membership
              </em>
            </h1>
            <p className="g1ge_hero_sub">
              Visit more, play more, and get exclusive benefits every time you
              step in.
            </p>
            <div className="g1ge_hero_actions">
              <Link
                href={bookingLink}
                className="g1ge_btn g1ge_btn_green"
                {...bookingProps}
              >
                Get Membership
              </Link>
              <Link
                href="#membership-plans"
                className="g1ge_btn g1ge_btn_outline"
              >
                View Benefits
              </Link>
            </div>
            <p className="g1ge_hero_note">
              Memberships at AeroSports {displayName}.
            </p>
          </div>
          <div className="g1ge_hero_visual">
            <div className="g1ge_hero_img">
              <AppImage
                src={heroImage}
                alt={`Membership at AeroSports ${displayName}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE — Why Membership Makes Sense */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Membership</span>
            <h2 className="g1ge_h2">Why Membership Makes Sense</h2>
          </div>
          <div className="g1ge_included_grid">
            {CORE_VALUE.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PLANS — Choose Your Membership */}
      <section className="g1ge_section g1ge_section_white" id="membership-plans">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Plans</span>
            <h2 className="g1ge_h2">Choose Your Membership</h2>
          </div>
          <div
            className="g1ge_grid3"
            style={{
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            {PLANS.map((plan) => (
              <div
                className="g1ge_card"
                key={plan.name}
                style={
                  plan.featured
                    ? {
                        borderTopColor: "var(--g1ge-green)",
                        boxShadow: "0 18px 44px rgba(8,11,24,0.12)",
                      }
                    : undefined
                }
              >
                {plan.featured && (
                  <span
                    className="g1ge_tag"
                    style={{
                      color: "var(--g1ge-green)",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Most Popular
                  </span>
                )}
                <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: "22px" }}>
                  {plan.features.map((f) => (
                    <div className="g1ge_include_item" key={f}>
                      <span className="g1ge_include_check">✓</span>
                      <span className="g1ge_include_text">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={bookingLink}
                  className={`g1ge_btn ${
                    plan.featured ? "g1ge_btn_green" : "g1ge_btn_dark"
                  }`}
                  {...bookingProps}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU GET */}
      <section className="g1ge_section g1ge_section_light">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Benefits</span>
            <h2 className="g1ge_h2">What You Get</h2>
          </div>
          <div className="g1ge_included_grid">
            {WHAT_YOU_GET.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHO IT'S FOR */}
      <section className="g1ge_section g1ge_section_white">
        <div className="g1ge_container">
          <div className="g1ge_section_head">
            <span className="g1ge_tag">Membership</span>
            <h2 className="g1ge_h2">Who Is This For?</h2>
          </div>
          <div className="g1ge_included_grid">
            {WHO_ITS_FOR.map((item) => (
              <div className="g1ge_include_item" key={item}>
                <span className="g1ge_include_check">✓</span>
                <span className="g1ge_include_text">{item}</span>
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
          <svg
            className="v11_bp_steps_dots_pattern"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="membershipStepsDots"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#membershipStepsDots)" />
          </svg>
        </div>
        <div
          className="v11_bp_container"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="v11_bp_steps_header">
            <span className="v11_bp_steps_badge">How It Works</span>
            <h2 className="v11_bp_heading v11_bp_heading_light">
              How
              <span className="v11_bp_heading_accent_light"> Membership</span>{" "}
              Works
            </h2>
            <p className="v11_bp_subtext v11_bp_subtext_light">
              Get started at AeroSports {displayName} in three simple steps.
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
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
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

      {/* 8. FINAL CTA — quote styling, button not form */}
      <section className="g1ge_quote" id="membership-cta">
        <div className="g1ge_quote_bg" />
        <div
          className="g1ge_quote_inner"
          style={{ gridTemplateColumns: "1fr" }}
        >
          <div className="g1ge_quote_intro" style={{ textAlign: "center" }}>
            <span className="g1ge_tag" style={{ color: "var(--g1ge-green)" }}>
              Get Started
            </span>
            <h2 className="g1ge_h2 g1ge_h2_light">
              Start Playing More, Spend Less
            </h2>
            <p>Join today and make every visit count.</p>
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
                {...bookingProps}
              >
                Get Your Membership Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MembershipPage;
