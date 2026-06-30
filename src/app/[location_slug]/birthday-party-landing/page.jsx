import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";
import AppImage from "@/components/AppImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
import DiscountPromoSlot from "@/components/sections/DiscountPromoSlot";
import { toMediaUrl } from "@/lib/media-url";
import BirthdayLandingForm from "./BirthdayLandingForm";
import "../../styles/birthday-landing.css";
import {
  fetchsheetdata,
  fetchPageData,
  fetchMenuData,
  fetchBirthdayPartyJson,
  generateMetadataLib,
} from "@/lib/sheets";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
  return generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "birthday-party-landing",
  });
}

const cleanText = (value) =>
  String(value || "")
    .replace(/^\*\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

const locationMatches = (rowLocation, locationSlug) => {
  const requested = String(locationSlug || "").toLowerCase().trim();
  const locations = String(rowLocation || "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return locations.includes(requested) || locations.includes("all");
};

const formatValue = (value, feature = "") => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "boolean") return value ? "Included" : "Not included";
  if (typeof value === "number") {
    if (value > 0 && value < 1) return `${Math.round(value * 100)}%`;
    if (feature.toLowerCase().includes("price")) return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
    return String(value);
  }
  const raw = String(value).trim();
  const normalized = raw.toLowerCase();
  if (["yes", "included", "true"].includes(normalized)) return "Included";
  if (["no", "not included", "false"].includes(normalized)) return "Not included";
  if (feature.toLowerCase().includes("price") && /^\d+(\.\d+)?$/.test(raw)) return `$${raw}`;
  return raw;
};

const toTitle = (slug = "") =>
  String(slug)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toTelHref = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "tel:+19057602922";
  return digits.length === 11 && digits.startsWith("1") ? `tel:+${digits}` : `tel:+1${digits}`;
};

const pickPrice = (details) => {
  const match = Object.entries(details || {}).find(([key]) => key.toLowerCase().includes("price"));
  return match ? match[1] : "";
};

const packageFeatures = (details) =>
  Object.entries(details || {})
    .filter(([key, value]) => value !== "" && !key.toLowerCase().includes("price") && key.toLowerCase() !== "package")
    .slice(0, 5)
    .map(([key, value]) => `${key}: ${value}`);

const buildPackagesFromRows = (rows, locationSlug) => {
  const locationRows = (Array.isArray(rows) ? rows : []).filter((row) =>
    locationMatches(row.Location || row.location, locationSlug)
  );
  const packageRows = locationRows.filter((row) => String(row.section || "").toLowerCase().trim() === "package");
  const packageNameRow = packageRows.find((row) => cleanText(row.__EMPTY).toLowerCase() === "package");
  const packageColumns = Array.from(
    new Set(
      packageRows.flatMap((row) =>
        Object.keys(row).filter((key) => !["Location", "location", "section", "__EMPTY"].includes(key))
      )
    )
  ).filter((key) => packageRows.some((row) => row[key] !== "" && row[key] !== undefined && row[key] !== null));

  return packageColumns
    .map((column, index) => {
      const name = cleanText(packageNameRow?.[column] || column);
      if (!name) return null;
      const details = {};
      packageRows.forEach((row) => {
        const feature = cleanText(row.__EMPTY);
        if (!feature || feature.toLowerCase() === "package") return;
        const value = formatValue(row[column], feature);
        if (value) details[feature] = value;
      });
      return {
        name,
        price: pickPrice(details) || "Call for pricing",
        features: packageFeatures(details),
        popular: index === 1,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
};

const buildPackagesFromJson = (jsonData) => {
  const raw = jsonData?.party_packages || jsonData?.packages || {};
  if (Array.isArray(raw)) {
    return raw.slice(0, 4).map((item, index) => ({
      name: item.name || item.title || `Party Package ${index + 1}`,
      price: item.price || item.value || "Call for pricing",
      features: Array.isArray(item.features) ? item.features.slice(0, 5) : [],
      popular: Boolean(item.popular) || index === 1,
    }));
  }

  return Object.entries(raw)
    .slice(0, 4)
    .map(([name, details], index) => ({
      name,
      price: pickPrice(details) || details?.price || "Call for pricing",
      features: packageFeatures(details),
      popular: index === 1,
    }));
};

const fallbackPackages = [
  {
    name: "Classic Birthday",
    price: "Call for pricing",
    features: ["Jump time included", "Party room time", "Dedicated party host", "Food and drink options"],
    popular: false,
  },
  {
    name: "Premium Birthday",
    price: "Call for pricing",
    features: ["More play time", "Party room included", "Dedicated party host", "Great for bigger groups"],
    popular: true,
  },
  {
    name: "Ultimate Birthday",
    price: "Call for pricing",
    features: ["Maximum celebration time", "Attractions and activities", "Easy setup and cleanup", "Stress-free planning"],
    popular: false,
  },
];

export default async function BirthdayAdLandingPage({ params }) {
  const locationSlug = params.location_slug;
  const [pageData, locationData, menuData, birthdayRows, birthdayJson, promotions] = await Promise.all([
    fetchPageData(locationSlug, "kids-birthday-parties"),
    fetchsheetdata("locations", locationSlug),
    fetchMenuData(locationSlug),
    fetchsheetdata("birthday", "all"),
    fetchBirthdayPartyJson(locationSlug),
    fetchsheetdata("promotions", locationSlug),
  ]);

  const page = Array.isArray(pageData) ? pageData[0] : pageData;
  const loc = Array.isArray(locationData) ? locationData[0] : locationData;
  const locationName = loc?.location ? toTitle(loc.location) : toTitle(locationSlug);
  const phone = loc?.phone || "905-760-2922";
  const bookingUrl = loc?.birthdayurlz || `/${locationSlug}/kids-birthday-parties`;
  const isExternalBooking = /^https?:\/\//i.test(bookingUrl);
  const attractionsParent = menuData?.find((item) => item.path === "attractions");
  const attractions = (attractionsParent?.children || [])
    .filter((item) => item?.title)
    .slice(0, 6);
  const heroVideo = toMediaUrl(
    page?.video ||
    page?.headervideo ||
    page?.headerVideo ||
    page?.video_url ||
    page?.videourl ||
    page?.backgroundvideo ||
    ""
  );
  const heroImage =
    page?.headerimage ||
    page?.smallimage ||
    loc?.smallimage ||
    attractions[0]?.smallimage ||
    "https://media.aerosportsparks.ca/webp/camp.webp";
  const packages =
    buildPackagesFromRows(birthdayRows, locationSlug).length > 0
      ? buildPackagesFromRows(birthdayRows, locationSlug)
      : buildPackagesFromJson(birthdayJson).length > 0
        ? buildPackagesFromJson(birthdayJson)
        : fallbackPackages;

  const highlights = [
    ["Interactive attractions", "Trampolines, ninja challenges, dodgeball, climbing, and active games keep the whole group moving."],
    ["Party hosts", "Our team helps run the flow so parents can actually enjoy the birthday."],
    ["Private party rooms", "Time to eat, sing, take photos, and reset before the next burst of fun."],
    ["Easy planning", "Pick a package, choose a date, and we help with the details."],
    ["Indoor all-season fun", "Rain, snow, or heat outside, the party stays active inside."],
    ["Photo-ready moments", "Bright attractions, big energy, and a birthday kid who feels like the star."],
  ];

  return (
    <main className={`birthday_ad_page ${robotoCondensed.variable}`}>
      <section className="birthday_ad_hero" id="top">
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
            <a href="#highlights">Highlights</a>
            <a href="#games">Attractions</a>
            <a href="#packages">Packages</a>
          </nav>
          <a href={toTelHref(phone)} className="birthday_ad_call">Call {phone}</a>
        </div>
        <div className="birthday_ad_hero_inner">
          <div className="birthday_ad_hero_copy">
            <span className="birthday_ad_eyebrow">Birthday parties in {locationName}</span>
            <h1>Stress-free kids birthday parties.</h1>
            <p>
              Jump, play, eat, and celebrate. We handle the party flow so parents can actually enjoy the day.
            </p>
            <div className="birthday_ad_actions">
              <a href="#packages" className="birthday_ad_primary">Check birthday availability</a>
              <a href="#party-form" className="birthday_ad_secondary">Get a callback</a>
            </div>
            <div className="birthday_ad_stats">
              <span><strong>50K+</strong> parties hosted</span>
              <span><strong>Host</strong> guided party flow</span>
              <span><strong>{locationName}</strong> indoor venue</span>
            </div>
          </div>
          <BirthdayLandingForm locationName={locationName} packages={packages} />
        </div>
      </section>

      <DiscountPromoSlot
        promotions={promotions}
        locationSlug={locationSlug}
        path="birthday-party-landing"
        variant="landing"
        primaryHref={bookingUrl}
      />

      <section className="birthday_ad_packages" id="packages">
        <div className="birthday_ad_section_head">
          <span>Party packages</span>
          <h2>Pick the birthday package that fits your group.</h2>
          <p>Choose a package and check availability while weekend slots are still open.</p>
        </div>
        <div className="birthday_ad_package_grid">
          {packages.map((item) => (
            <article className={`birthday_ad_package ${item.popular ? "birthday_ad_package_popular" : ""}`} key={item.name}>
              {item.popular && <span className="birthday_ad_badge">Most Popular</span>}
              <h3>{item.name}</h3>
              <p className="birthday_ad_price">{item.price}</p>
              <ul>
                {(item.features.length ? item.features : fallbackPackages[0].features).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={bookingUrl}
                className="birthday_ad_package_btn"
                target={isExternalBooking ? "_blank" : undefined}
                rel={isExternalBooking ? "noopener noreferrer" : undefined}
              >
                Check availability
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="birthday_ad_private">
        <div>
          <h2>Planning a private party?</h2>
          <p>Bring the crew for a bigger celebration with more room, more play, and easier planning.</p>
        </div>
        <div className="birthday_ad_private_actions">
          <a href={toTelHref(phone)}>Call: {phone}</a>
          <a href="#party-form">Inquire now</a>
        </div>
      </section>

      <section className="birthday_ad_reviews">
        <div className="birthday_ad_section_head">
          <span>Families love it</span>
          <h2>Birthday planning that feels lighter.</h2>
        </div>
        <div className="birthday_ad_review_grid">
          {[
            "The kids had a blast and the host kept everything moving.",
            "Easy setup, active play, and no stress for the parents.",
            "A perfect indoor birthday when you want more than cake and chairs.",
          ].map((quote, index) => (
            <article key={quote}>
              <span>5 star review</span>
              <p>&quot;{quote}&quot;</p>
              <strong>{["Sarah M.", "Jessica T.", "Amanda L."][index]}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="birthday_ad_highlights" id="highlights">
        <div className="birthday_ad_section_head birthday_ad_section_head_left">
          <span>Why parents choose us</span>
          <h2>Built for active kids and easy planning.</h2>
        </div>
        <div className="birthday_ad_highlight_grid">
          {highlights.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="birthday_ad_split">
        <div className="birthday_ad_split_media">
          <AppImage src={attractions[0]?.smallimage || heroImage} alt="AeroSports birthday attractions" fill sizes="(max-width: 900px) 100vw, 48vw" />
        </div>
        <div className="birthday_ad_split_copy">
          <span>Why AeroSports</span>
          <h2>Not another sit-still birthday party.</h2>
          <p>
            Kids move through high-energy attractions, team challenges, and celebration time while parents get a smoother plan from arrival to cleanup.
          </p>
          <ul>
            <li>Active play for kids, tweens, and teens.</li>
            <li>Indoor venue built for all-weather celebrations.</li>
            <li>Simple booking, clear packages, and friendly support.</li>
          </ul>
          <a href="#packages" className="birthday_ad_primary birthday_ad_primary_dark">Check available packages</a>
        </div>
      </section>

      <section className="birthday_ad_games" id="games">
        <div className="birthday_ad_section_head">
          <span>Birthday attractions</span>
          <h2>A few favorites they can jump into.</h2>
        </div>
        <div className="birthday_ad_game_grid">
          {(attractions.length ? attractions : [{ title: "Trampolines", smallimage: heroImage }, { title: "Ninja Course", smallimage: heroImage }, { title: "Dodgeball", smallimage: heroImage }]).map((item) => (
            <article className="birthday_ad_game" key={item.title}>
              <AppImage
                src={item.smallimage || item.headerimage || heroImage}
                alt={item.smallimage_media?.alt || item.title}
                fill
                sizes="(max-width: 700px) 50vw, 25vw"
              />
              <div>
                <h3>{item.title}</h3>
                {item.desc && <p>{item.desc}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="birthday_ad_experience">
        <div>
          <span>Party experience</span>
          <h2>We handle the chaos while you enjoy the celebration.</h2>
          <p>
            From check-in to play time to food and birthday photos, AeroSports keeps the day organized, active, and easy for families.
          </p>
        </div>
        <div className="birthday_ad_checklist">
          {["Guided party flow", "Party room time", "Food and add-ons", "Easy online booking", "Great for kids and teens", "Indoor all-season fun"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="birthday_ad_final">
        <h2>Ready to check your birthday party date?</h2>
        <div>
          <Link
            href={bookingUrl}
            className="birthday_ad_primary"
            target={isExternalBooking ? "_blank" : undefined}
            rel={isExternalBooking ? "noopener noreferrer" : undefined}
          >
            Check availability
          </Link>
          <a href={toTelHref(phone)} className="birthday_ad_secondary">Call now</a>
        </div>
      </section>
    
      <div className="birthday_ad_mobile_cta" aria-label="Birthday party quick actions">
        <a href="#packages">Packages</a>
        <a href="#top">Check Date</a>
      </div>
    </main>
  );
}
