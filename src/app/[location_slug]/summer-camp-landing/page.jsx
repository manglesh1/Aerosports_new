import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";
import AppImage from "@/components/AppImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
import DiscountPromoSlot from "@/components/sections/DiscountPromoSlot";
import { toMediaUrl } from "@/lib/media-url";
import CampLandingForm from "./CampLandingForm";
import "../../styles/birthday-landing.css";
import "../../styles/camp-landing.css";
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

const appliesToLocation = (rowLocation, locationSlug) => {
  const locations = text(rowLocation)
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return locations.includes("all") || locations.includes(text(locationSlug).toLowerCase());
};

const exactlyAppliesToLocation = (rowLocation, locationSlug) =>
  text(rowLocation)
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(text(locationSlug).toLowerCase());

const sortRows = (rows) =>
  [...rows].sort((a, b) => Number(a.sort || a.Sort || 999) - Number(b.sort || b.Sort || 999));

const rowsBySection = (rows, locationSlug, section) => {
  const sectionRows = (Array.isArray(rows) ? rows : []).filter((row) => key(row.section) === section);
  const exactRows = sectionRows.filter((row) => exactlyAppliesToLocation(row.location || row.Location, locationSlug));
  return sortRows(exactRows.length ? exactRows : sectionRows.filter((row) => appliesToLocation(row.location || row.Location, locationSlug)));
};

const contentMapFromRows = (rows, locationSlug) =>
  rowsBySection(rows, locationSlug, "content").reduce((acc, row) => {
    const rowKey = key(row.title);
    if (rowKey) acc[rowKey] = text(row.detail || row.subtitle || row.value);
    return acc;
  }, {});

const contentValue = (content, mapKey, fallback) => content[key(mapKey)] || fallback;
const isExternalUrl = (value) => /^https?:\/\//i.test(text(value));

const getPriceOptions = (value) => {
  const raw = text(value);
  if (!raw) return [{ label: "Pricing", amount: "Call for pricing" }];

  return raw
    .split(/\s*\|\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.*?)(\$[\d.,]+(?:\s*\+?\s*tax)?).*$/i);
      if (!match) return { label: "Option", amount: part };

      return {
        label: text(match[1]) || "Camp option",
        amount: match[2].replace(/\s+/g, ""),
      };
    });
};
const fallbackImage = "https://media.aerosportsparks.ca/webp/camp.webp";

const CAMP_ACTIVITY_MEDIA = [
  "camp_landing_activity_trampoline_group",
  "camp_landing_activity_foam_climb",
  "camp_landing_activity_creative_break",
  "camp_landing_activity_friends",
  "camp_landing_activity_foam_pit",
];

const SUMMER_CAMP_DATES = "July 28 - Sept 4";

const buildMediaMap = (rows) =>
  new Map(
    (Array.isArray(rows) ? rows : [])
      .filter((row) => row?.id && row?.desktop_url)
      .map((row) => [String(row.id).trim(), row])
  );

const mediaById = (mediaMap, id) => {
  const media = mediaMap.get(id);
  if (!media) return null;
  return {
    src: media.desktop_url,
    alt: media.alt || media.title || "AeroSports summer camp activity",
  };
};

const packageSchedule = (item) =>
  key(item?.title).includes("summer camp") ? SUMMER_CAMP_DATES : item?.schedule;

const getBookingUrl = (configData, locationSlug) => {
  const rows = Array.isArray(configData) ? configData : [];
  return (
    rows.find((item) => item.key === "campbooking")?.value ||
    rows.find((item) => item.key === "estorebase")?.value ||
    `/${locationSlug}/programs/camps`
  );
};

const toTelHref = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "tel:+19057602922";
  return digits.length === 11 && digits.startsWith("1") ? `tel:+${digits}` : `tel:+1${digits}`;
};

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "summer-camp-landing",
  });

  return {
    ...metadata,
    title: metadata?.title || `Summer Camp - ${toTitle(params.location_slug)} | AeroSports`,
    description: metadata?.description || `Check AeroSports summer camp availability in ${toTitle(params.location_slug)}.`,
  };
}

export default async function SummerCampLandingPage({ params }) {
  const locationSlug = params.location_slug;
  const [pageData, campPageData, campsRows, locationData, configData, mediaRows, promotions] = await Promise.all([
    fetchPageData(locationSlug, "summer-camp-landing"),
    fetchPageData(locationSlug, "camps"),
    fetchsheetdata("camps", "all"),
    fetchsheetdata("locations", locationSlug),
    fetchsheetdata("config", locationSlug),
    fetchsheetdata("media", "all"),
    fetchsheetdata("promotions", locationSlug),
  ]);

  const page = Array.isArray(pageData) && pageData.length ? pageData[0] : Array.isArray(campPageData) ? campPageData[0] : campPageData;
  const loc = Array.isArray(locationData) ? locationData[0] : locationData;
  const locationName = loc?.location ? toTitle(loc.location) : toTitle(locationSlug);
  const phone = loc?.phone || "905-760-2922";
  const bookingUrl = getBookingUrl(configData, locationSlug);
  const content = contentMapFromRows(campsRows, locationSlug);
  const packages = rowsBySection(campsRows, locationSlug, "package");
  const activities = rowsBySection(campsRows, locationSlug, "activity").slice(0, 6);
  const schedule = rowsBySection(campsRows, locationSlug, "schedule").slice(0, 4);
  const whyReasons = rowsBySection(campsRows, locationSlug, "why").slice(0, 4);
  const heroImage = page?.headerimage || page?.smallimage || contentValue(content, "hero-image", fallbackImage);
  const heroVideo = toMediaUrl(page?.video || page?.headervideo || page?.video_url || page?.videourl || "");
  const activityImage = contentValue(content, "activities-image", heroImage);
  const mediaMap = buildMediaMap(mediaRows);
  const activityCards = (activities.length ? activities : [
    { title: "Trampolines", detail: "Open jump and active movement." },
    { title: "Group games", detail: "Team challenges and guided play." },
    { title: "Creative breaks", detail: "A balanced day with recharge moments." },
    { title: "Foam pit fun", detail: "Big energy moments with supervised active play." },
    { title: "Camp friends", detail: "Shared experiences that make the day memorable." },
  ]).map((item, index) => ({
    ...item,
    media: mediaById(mediaMap, CAMP_ACTIVITY_MEDIA[index % CAMP_ACTIVITY_MEDIA.length]),
  }));

  return (
    <main className={`birthday_ad_page camp_ad_page ${robotoCondensed.variable}`}>
      <section className="birthday_ad_hero camp_ad_hero" id="top">
        <div className="birthday_ad_hero_media" aria-hidden="true">
          {heroVideo ? (
            <ResponsiveVideo
              src={heroVideo}
              posterSrc={heroImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <AppImage src={heroImage} alt="" fill priority sizes="100vw" />
          )}
        </div>
        <div className="birthday_ad_hero_overlay" />
        <div className="birthday_ad_nav">
          <Link href={`/${locationSlug}`} className="birthday_ad_logo">AeroSports</Link>
          <nav>
            <a href="#camp-form">Check Dates</a>
            <a href="#packages">Camp Options</a>
            <a href="#activities">Activities</a>
          </nav>
          <a href={toTelHref(phone)} className="birthday_ad_call">Call {phone}</a>
        </div>

        <div className="birthday_ad_hero_inner camp_ad_hero_inner">
          <div className="birthday_ad_hero_copy">
            <span className="birthday_ad_eyebrow">Summer camp in {locationName}</span>
            <h1>{page?.title || "Keep kids active all summer."}</h1>
            <p>
              {page?.smalltext || contentValue(content, "hero-copy", "A high-energy indoor camp with trampolines, games, team activities, supervised play, and easy planning for parents.")}
            </p>
            <div className="birthday_ad_actions">
              <a href="#camp-form" className="birthday_ad_primary">Check Camp Availability</a>
              <a href="#packages" className="birthday_ad_secondary">View Camp Options</a>
            </div>
            <div className="birthday_ad_stats camp_ad_stats">
              <span><strong>All</strong> summer long</span>
              <span><strong>Active</strong> indoor days</span>
              <span><strong>{locationName}</strong> camp venue</span>
            </div>
          </div>
          <CampLandingForm locationName={locationName} packages={packages} />
        </div>
      </section>

      <DiscountPromoSlot
        promotions={promotions}
        locationSlug={locationSlug}
        path="summer-camp-landing"
        variant="landing"
        primaryHref={bookingUrl}
      />

      <section className="camp_ad_band" id="packages">
        <div className="birthday_ad_section_head">
          <span>Camp options</span>
          <h2>Pick the schedule that works for your family.</h2>
          <p>Use this page for quick availability. Our team can confirm dates, age fit, and booking details.</p>
        </div>
        <div className="camp_ad_package_grid">
          {(packages.length ? packages : [{ title: "Summer Camp", subtitle: "Active indoor camp days", price: "Call for pricing", detail: "Jumping, games, activities, and supervised fun", schedule: "Flexible dates", ages: "Kids" }]).map((item, index) => (
            <article className="camp_ad_package" key={`${item.title}-${index}`}>
              <h3>{item.title}</h3>
              {item.subtitle && <p>{item.subtitle}</p>}
              <div className="camp_ad_price_list">
                {getPriceOptions(item.price).map((priceOption, priceIndex) => (
                  <div className="camp_ad_price_row" key={`${item.title}-price-${priceIndex}`}>
                    <span>{priceOption.label}</span>
                    <strong>{priceOption.amount}</strong>
                  </div>
                ))}
              </div>
              <ul>
                {packageSchedule(item) && <li><span>Schedule</span><b>{packageSchedule(item)}</b></li>}
                {item.ages && <li><span>Ages</span><b>{item.ages}</b></li>}
                {item.detail && <li><span>Includes</span><b>{item.detail}</b></li>}
              </ul>
              <a href={isExternalUrl(item.cta) ? item.cta : "#camp-form"} className="birthday_ad_package_btn">
                Check Dates
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="camp_ad_split" id="activities">
        <div className="camp_ad_split_media">
          <AppImage src={activityImage} alt="AeroSports summer camp activities" fill sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <div className="camp_ad_split_copy">
          <span>Why parents book it</span>
          <h2>{contentValue(content, "why-heading", "A camp day that burns energy, not parent patience.")}</h2>
          <p>{contentValue(content, "why-copy", "Kids stay moving with structured indoor fun while parents get a simple, supervised camp option.")}</p>
          <div className="camp_ad_reason_grid">
            {(whyReasons.length ? whyReasons : [
              { title: "Active play", detail: "Trampolines, dodgeball, and group games." },
              { title: "Supervised flow", detail: "Staff keep the day moving safely." },
              { title: "Indoor comfort", detail: "Weather does not cancel the fun." },
              { title: "Easy planning", detail: "One place for play, breaks, and pickup." },
            ]).map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <span>{item.icon || String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                {item.detail && <p>{item.detail}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="camp_ad_band camp_ad_dark">
        <div className="birthday_ad_section_head">
          <span>What they do</span>
          <h2>Activities that keep the day moving.</h2>
        </div>
        <div className="camp_ad_activity_grid">
          {activityCards.map((item, index) => (
            <article key={`${item.title}-${index}`}>
              {item.media?.src && (
                <div className="camp_ad_activity_media">
                  <AppImage src={item.media.src} alt={item.media.alt} fill sizes="(max-width: 900px) 100vw, 25vw" />
                </div>
              )}
              <div className="camp_ad_activity_body">
                <span>{item.icon || String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                {item.detail && <p>{item.detail}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {schedule.length > 0 && (
        <section className="camp_ad_band">
          <div className="birthday_ad_section_head">
            <span>Camp flow</span>
            <h2>A day at camp.</h2>
          </div>
          <ol className="camp_ad_timeline">
            {schedule.map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <time>{item.schedule}</time>
                <div>
                  <h3>{item.title}</h3>
                  {item.detail && <p>{item.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="birthday_ad_final camp_ad_final">
        <h2>Ready to check summer camp dates?</h2>
        <p>Send a quick request and our team will confirm availability for {locationName}.</p>
        <div>
          <a href="#camp-form" className="birthday_ad_primary">Check Availability</a>
          <a href={bookingUrl} className="birthday_ad_secondary" target={isExternalUrl(bookingUrl) ? "_blank" : undefined} rel={isExternalUrl(bookingUrl) ? "noopener noreferrer" : undefined}>Book Online</a>
        </div>
      </section>

      <div className="birthday_ad_mobile_sticky">
        <a href="#camp-form">Check Dates</a>
        <a href={bookingUrl} target={isExternalUrl(bookingUrl) ? "_blank" : undefined} rel={isExternalUrl(bookingUrl) ? "noopener noreferrer" : undefined}>Book Camp</a>
      </div>
    </main>
  );
}
