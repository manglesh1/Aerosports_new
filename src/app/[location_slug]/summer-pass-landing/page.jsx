import React from "react";
import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";
import AppImage from "@/components/AppImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
import DiscountPromoSlot from "@/components/sections/DiscountPromoSlot";
import { toMediaUrl } from "@/lib/media-url";
import "../../styles/birthday-landing.css";
import "../../styles/summer-pass-landing.css";
import { fetchPageData, fetchsheetdata, generateMetadataLib } from "@/lib/sheets";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

const text = (value) => String(value || "").trim();
const key = (value) => text(value).toLowerCase().replace(/\s+/g, " ");
const toTitle = (slug = "") =>
  text(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const isExternalUrl = (value) => /^https?:\/\//i.test(text(value));
const formatPrice = (value) => {
  const raw = text(value);
  if (!raw) return "";
  return raw.startsWith("$") ? raw : `$${raw}`;
};

const displayText = (value) =>
  text(value)
    .replace(/tranpolines/gi, "Trampolines")
    .replace(/tranpoline/gi, "Trampoline")
    .replace(/\s{2,}/g, " ")
    .trim();


const isIncludedValue = (value) => {
  const normalized = key(value);
  return normalized === "yes" || normalized === "included" || normalized === "true" || normalized === "?";
};

const isExcludedValue = (value) => {
  const normalized = key(value);
  return normalized === "x" || normalized === "no" || normalized === "-" || normalized === "not included" || normalized === "false";
};

const getCompareFeatures = (passes) => {
  const seen = new Set();
  const features = [];

  passes.forEach((pass) => {
    (pass.features || []).forEach((feature) => {
      const label = displayText(feature.label);
      const id = key(label);
      if (!id || seen.has(id)) return;
      seen.add(id);
      features.push(label);
    });
  });

  if (passes.some((pass) => pass.price)) features.push("Price");
  return features;
};

const getFeatureValue = (pass, feature) => {
  if (key(feature) === "price") return pass.price;
  const match = (pass.features || []).find((item) => key(item.label) === key(feature));
  return match?.value || "";
};

const normalizePasses = (passes) =>
  passes.map((pass) => ({
    ...pass,
    name: displayText(pass.name),
    price: displayText(pass.price),
    features: (pass.features || []).map((feature) => ({
      label: displayText(feature.label),
      value: displayText(feature.value),
    })),
  }));

const appliesToLocation = (row, locationSlug) => key(row?.location).includes(key(locationSlug));
const getPricingField = (row) => text(row?.Tickets);
const getComparableColumns = (row) =>
  Object.keys(row || {}).filter((column) => {
    const normalized = key(column);
    return (
      normalized &&
      normalized !== "location" &&
      normalized !== "tickets" &&
      !normalized.endsWith("_media")
    );
  });

function parsePassRows(rows, locationSlug) {
  const locationRows = (Array.isArray(rows) ? rows : []).filter((row) => appliesToLocation(row, locationSlug));
  const passes = {};
  let columns = [];
  let inPasses = false;
  let bookingUrl = "";

  const ensurePass = (column) => {
    if (!passes[column]) {
      passes[column] = { column, name: column, price: "", features: [], bookingUrl: "" };
    }
    return passes[column];
  };

  for (const row of locationRows) {
    const field = getPricingField(row);
    const rowKey = key(field);
    if (!field) continue;

    if (rowKey === "passes" || rowKey === "summer pass" || rowKey === "summer passes") {
      inPasses = true;
      columns = getComparableColumns(row);
      columns.forEach((column) => {
        const value = text(row[column]);
        if (value) ensurePass(column).name = displayText(value);
      });
      continue;
    }

    if (inPasses && (rowKey === "membership" || rowKey === "memberships" || rowKey === "attractions" || rowKey === "tickets")) {
      break;
    }

    if (!inPasses) continue;

    if (rowKey === "booking url") {
      const urlColumns = columns.length ? columns : getComparableColumns(row);
      bookingUrl = urlColumns.map((column) => text(row[column])).find(Boolean) || bookingUrl;
      Object.values(passes).forEach((pass) => {
        pass.bookingUrl = bookingUrl;
      });
      continue;
    }

    const rowColumns = columns.length ? columns : getComparableColumns(row);
    rowColumns.forEach((column) => {
      const value = text(row[column]);
      if (!value) return;
      const pass = ensurePass(column);
      if (rowKey === "price") {
        pass.price = formatPrice(value);
      } else if (rowKey !== "most popular") {
        pass.features.push({ label: displayText(field), value: displayText(value) });
      }
    });
  }

  return {
    bookingUrl,
    passes: Object.values(passes).filter((pass) =>
      key(pass.name).includes("summer pass") && (pass.price || pass.features.length)
    ),
  };
}

function getBookingUrl(configData, passData, locationSlug) {
  const rows = Array.isArray(configData) ? configData : [];
  return (
    passData.bookingUrl ||
    rows.find((item) => item.key === "summerpassbooking")?.value ||
    rows.find((item) => item.key === "passbooking")?.value ||
    rows.find((item) => item.key === "estorebase")?.value ||
    `/${locationSlug}/pricing-promos#passes`
  );
}

function getHeroMedia(page, homePage, location, fallback) {
  const source = page || homePage || location || {};
  return {
    image: source.headerimage || source.smallimage || fallback,
    video: toMediaUrl(source.video || source.headervideo || source.video_url || source.videourl || ""),
  };
}

const fallbackPasses = [
  {
    name: "Basic Summer Pass",
    price: "$60",
    features: [
      { label: "Jump Time in Min", value: "60" },
      { label: "Trampolines", value: "yes" },
      { label: "Validity", value: "From purchase - 4th Sept" },
      { label: "Value", value: "More play for less than repeat day tickets" },
    ],
  },
  {
    name: "Elite Summer Pass",
    price: "$99",
    features: [
      { label: "Jump Time in Min", value: "120" },
      { label: "Trampolines", value: "yes" },
      { label: "Pixel games", value: "yes" },
      { label: "ninja Tag", value: "yes" },
      { label: "Validity", value: "From purchase - 4th Sept" },
    ],
  },
];

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "summer-pass-landing",
  });

  return {
    ...metadata,
    title: metadata?.title || `Summer Pass - ${toTitle(params.location_slug)} | AeroSports`,
    description: metadata?.description || `Buy an AeroSports summer pass for ${toTitle(params.location_slug)} and keep kids active all summer.`,
  };
}

export default async function SummerPassLandingPage({ params }) {
  const locationSlug = params.location_slug;
  const [pageData, homePageData, pricingRows, configData, locationData, promotions] = await Promise.all([
    fetchPageData(locationSlug, "summer-pass-landing"),
    fetchPageData(locationSlug, "home"),
    fetchsheetdata("Pricing", locationSlug),
    fetchsheetdata("config", locationSlug),
    fetchsheetdata("locations", locationSlug),
    fetchsheetdata("promotions", locationSlug),
  ]);

  const page = Array.isArray(pageData) ? pageData[0] : pageData;
  const homePage = Array.isArray(homePageData) ? homePageData[0] : homePageData;
  const loc = Array.isArray(locationData) ? locationData[0] : locationData;
  const locationName = loc?.location ? toTitle(loc.location) : toTitle(locationSlug);
  const passData = parsePassRows(pricingRows, locationSlug);
  const passes = normalizePasses(passData.passes.length ? passData.passes : fallbackPasses);
  const buyUrl = getBookingUrl(configData, passData, locationSlug);
  const hero = getHeroMedia(page, homePage, loc, "https://media.aerosportsparks.ca/webp/camp.webp");
  const targetAttrs = isExternalUrl(buyUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const bestPass = passes[passes.length > 1 ? 1 : 0];
  const compareFeatures = getCompareFeatures(passes);

  return (
    <main className={`pass_ad_page ${robotoCondensed.variable}`}>
      <section className="pass_ad_hero" id="top">
        <div className="pass_ad_hero_media" aria-hidden="true">
          {hero.video ? (
            <ResponsiveVideo
              src={hero.video}
              posterSrc={hero.image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <AppImage src={hero.image} alt="" fill priority sizes="100vw" />
          )}
        </div>
        <div className="pass_ad_overlay" />
        <nav className="pass_ad_nav">
          <Link href={`/${locationSlug}`}>AeroSports</Link>
          <a href={buyUrl} className="pass_ad_nav_cta" {...targetAttrs}>Buy Pass</a>
        </nav>

        <div className="pass_ad_hero_inner">
          <div>
            <span className="pass_ad_eyebrow">Limited summer deal in {locationName}</span>
            <h1>{page?.title || "Buy the summer pass before the kids ask again."}</h1>
            <p>
              {page?.smalltext || "One pass. More active days. Less screen time. Lock in summer play now and use it when the weather, boredom, or cousins show up."}
            </p>
            <div className="pass_ad_actions">
              <a href={buyUrl} className="pass_ad_primary" {...targetAttrs}>Buy Summer Pass</a>
              <a href="#compare" className="pass_ad_secondary">Compare Passes</a>
            </div>
            <div className="pass_ad_proof">
              <span><strong>Summer</strong> ready</span>
              <span><strong>Indoor</strong> active play</span>
              <span><strong>{locationName}</strong> location</span>
            </div>
          </div>

          <aside className="pass_ad_buy_box">
            <span>Best value pick</span>
            <h2>{bestPass.name}</h2>
            <p className="pass_ad_buy_price">{bestPass.price || "See price"}</p>
            <ul>
              {(bestPass.features || []).slice(0, 4).map((feature) => (
                <li key={`${feature.label}-${feature.value}`}><b>{feature.label}</b><span>{feature.value}</span></li>
              ))}
            </ul>
            <a href={buyUrl} className="pass_ad_primary" {...targetAttrs}>Buy This Pass</a>
            <small>Buying online is the fastest way to secure the deal.</small>
          </aside>
        </div>
      </section>

      <DiscountPromoSlot
        promotions={promotions}
        locationSlug={locationSlug}
        path="summer-pass-landing"
        variant="landing"
        primaryHref={buyUrl}
      />

      <section className="pass_ad_strip" aria-label="Summer pass benefits">
        <span>More visits</span>
        <span>More movement</span>
        <span>More value</span>
        <span>Less planning</span>
      </section>

      <section className="pass_ad_compare" id="compare">
        <div className="pass_ad_section_head">
          <span>Pick your pass</span>
          <h2>Choose once. Play all summer.</h2>
          <p>For ad traffic, the job is simple: pick the pass that fits your family and buy before the deal disappears.</p>
        </div>
        <div className="pass_ad_compare_shell">
          <div
            className="pass_ad_compare_grid"
            style={{ "--pass-ad-plan-count": passes.length }}
          >
            <div className="pass_ad_compare_cell pass_ad_compare_header pass_ad_compare_feature">Compare</div>
            {passes.map((pass, index) => (
              <div className={`pass_ad_compare_cell pass_ad_compare_header pass_ad_compare_plan pass_ad_compare_plan_${index}`} key={`${pass.name}-header`}>
                {pass.name}
              </div>
            ))}

            {compareFeatures.map((feature, rowIndex) => (
              <React.Fragment key={feature}>
                <div className={`pass_ad_compare_cell pass_ad_compare_feature ${rowIndex % 2 === 0 ? "pass_ad_compare_alt" : ""}`}>
                  {feature}
                </div>
                {passes.map((pass, passIndex) => {
                  const value = getFeatureValue(pass, feature);
                  return (
                    <div className={`pass_ad_compare_cell pass_ad_compare_value ${rowIndex % 2 === 0 ? "pass_ad_compare_alt" : ""}`} key={`${pass.name}-${feature}`}>
                      {!value || isExcludedValue(value) ? (
                        <span className="pass_ad_dash">{"\u2013"}</span>
                      ) : isIncludedValue(value) ? (
                        <span className="pass_ad_check">{"\u2713"}</span>
                      ) : (
                        <strong className={key(feature) === "price" ? "pass_ad_compare_price" : ""}>{value}</strong>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="pass_ad_compare_ctas" style={{ "--pass-ad-plan-count": passes.length }}>
            <span />
            {passes.map((pass) => (
              <a href={pass.bookingUrl || buyUrl} className="pass_ad_card_cta" key={`${pass.name}-cta`} {...(isExternalUrl(pass.bookingUrl || buyUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                Buy Pass
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pass_ad_reason_section">
        <div className="pass_ad_reason_copy">
          <span>Why buy now</span>
          <h2>Summer gets expensive when every outing is a separate ticket.</h2>
          <p>A pass turns repeat visits into an easy yes. It is built for school break energy, rainy days, hot days, and Ã¢â‚¬Å“what are we doing today?Ã¢â‚¬Â days.</p>
          <a href={buyUrl} className="pass_ad_primary" {...targetAttrs}>Get The Pass</a>
        </div>
        <div className="pass_ad_reason_grid">
          {[
            ["Repeat value", "The more you come, the smarter the pass feels."],
            ["Indoor backup plan", "Weather does not decide whether the kids get moving."],
            ["Easy gift", "Great for grandparents, cousins, and summer birthdays."],
            ["Fast checkout", "Buy online and keep the summer plan simple."],
          ].map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pass_ad_final">
        <h2>Don&apos;t make every visit a new decision.</h2>
        <p>Buy the summer pass now and turn active play into the default plan.</p>
        <a href={buyUrl} className="pass_ad_primary" {...targetAttrs}>Buy Summer Pass</a>
      </section>

      <div className="pass_ad_sticky">
        <a href={buyUrl} {...targetAttrs}>Buy Summer Pass</a>
      </div>
    </main>
  );
}


