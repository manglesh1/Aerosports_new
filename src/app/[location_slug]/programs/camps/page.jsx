import React from "react";
import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";
import "../../../styles/kidsparty.css";
import "../../../styles/subcategory.css";
import AppImage from "@/components/AppImage";
import MotionImage from "@/components/MotionImage";
import BlogSection from "@/components/sections/BlogSection";
import CommonFAQSection from "@/components/sections/CommonFAQSection";
import DiscountPromoSlot from "@/components/sections/DiscountPromoSlot";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import {
  fetchMenuData,
  fetchPageData,
  fetchsheetdata,
  generateMetadataLib,
  generateSchema,
  getWaiverLink,
} from "@/lib/sheets";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

const text = (value) => String(value || "").trim();
const key = (value) => text(value).toLowerCase().replace(/\s+/g, " ");
const kebabToTitle = (value) =>
  text(value)
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

const exactlyAppliesToLocation = (rowLocation, locationSlug) => {
  const locations = text(rowLocation)
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return locations.includes(text(locationSlug).toLowerCase());
};

const sortRows = (rows) =>
  [...rows].sort((a, b) => {
    const aSort = Number(a.sort || a.Sort || 999);
    const bSort = Number(b.sort || b.Sort || 999);
    return aSort - bSort;
  });

const rowsBySection = (rows, locationSlug, section) =>
  {
    const sectionRows = (Array.isArray(rows) ? rows : []).filter((row) => key(row.section) === section);
    const exactRows = sectionRows.filter((row) => exactlyAppliesToLocation(row.location || row.Location, locationSlug));

    if (exactRows.length > 0) {
      return sortRows(exactRows);
    }

    return sortRows(
      sectionRows.filter((row) => appliesToLocation(row.location || row.Location, locationSlug))
    );
  };

const contentMapFromRows = (rows, locationSlug) =>
  rowsBySection(rows, locationSlug, "content").reduce((acc, row) => {
    const rowKey = key(row.title);
    if (rowKey) acc[rowKey] = text(row.detail || row.subtitle);
    return acc;
  }, {});

const contentValue = (content, mapKey, fallback) => content[key(mapKey)] || fallback;
const isExternalUrl = (value) => /^https?:\/\//i.test(text(value));
const campFallbackImage = "https://storage.googleapis.com/aerosports/webp/camp.webp";

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

const packageSchedule = (item) => text(item?.schedule || item?.dates || item?.date || item?.time);

const getBookingUrl = (configData, locationSlug) => {
  const rows = Array.isArray(configData) ? configData : [];
  return (
    rows.find((item) => item.key === "campbooking")?.value ||
    rows.find((item) => item.key === "estorebase")?.value ||
    `/${locationSlug}/pricing-promos`
  );
};

const getFallbackHero = (pageData, locationData, locationSlug) => {
  const location = Array.isArray(locationData) ? locationData[0] : locationData;
  const locationName = kebabToTitle(location?.location || locationSlug || "AeroSports");

  return {
    ...(pageData || {}),
    title: pageData?.title || `${locationName} Camps`,
    smalltext:
      pageData?.smalltext ||
      "Active, supervised camp days packed with jumping, games, activities, and easy planning for parents.",
    path: "camps",
  };
};

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "camps",
  });

  return {
    ...metadata,
    title: metadata?.title || `Camps - ${kebabToTitle(params.location_slug)} | AeroSports`,
    description:
      metadata?.description ||
      `Explore AeroSports camp packages, schedules, activities, and add-ons for ${kebabToTitle(params.location_slug)}.`,
  };
}

const CampsPage = async ({ params }) => {
  const { location_slug } = params;

  const [pageData, campsRows, menuData, waiverLink, locationData, configData, promotions] = await Promise.all([
    fetchPageData(location_slug, "camps"),
    fetchsheetdata("camps", "all"),
    fetchMenuData(location_slug),
    getWaiverLink(location_slug),
    fetchsheetdata("locations", location_slug),
    fetchsheetdata("config", location_slug),
    fetchsheetdata("promotions", location_slug),
  ]);

  const heroData = getFallbackHero(pageData, locationData, location_slug);
  const bookingUrl = getBookingUrl(configData, location_slug);
  const content = contentMapFromRows(campsRows, location_slug);
  const whyReasons = rowsBySection(campsRows, location_slug, "why");
  const packages = rowsBySection(campsRows, location_slug, "package");
  const schedule = rowsBySection(campsRows, location_slug, "schedule");
  const activities = rowsBySection(campsRows, location_slug, "activity");
  const addons = rowsBySection(campsRows, location_slug, "addon");
  const whyImage = contentValue(content, "why-image", campFallbackImage);
  const activitiesImage = contentValue(content, "activities-image", campFallbackImage);
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  const jsonLDschema = await generateSchema(pageData, locationData, "", "camps");

  return (
    <main className={`v11_camps_page ${robotoCondensed.variable}`}>
      {jsonLDschema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLDschema) }} />
      )}

      <MotionImage
        pageData={heroData}
        waiverLink={waiverLink}
        locationData={locationData}
        primaryHref={bookingUrl}
        primaryLabel="Register Now"
        secondaryHref="#camp-packages"
        secondaryLabel="View Packages"
        reviewText="Flexible camp days, active play, and a team that keeps kids moving from drop-off to pick-up."
      />
      <DiscountPromoSlot
        promotions={promotions}
        locationSlug={location_slug}
        path="camps"
        variant="light"
        primaryHref={bookingUrl}
      />

      <div className="v11_camps_body">
        {whyReasons.length > 0 && (
          <section className="v11_camps_section v11_camps_why_section">
            <div className="v11_camps_container v11_camps_media_band">
              <div className="v11_camps_media_frame">
                <AppImage
                  src={whyImage}
                  alt="AeroSports campers enjoying active indoor camp activities"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                />
              </div>

              <div className="v11_camps_media_content">
              <div className="v11_camps_section_header v11_camps_section_header_left">
                <span>Camp Confidence</span>
                <h2>{contentValue(content, "why-heading", "Why Choose AeroSports Camp?")}</h2>
                <p>
                  {contentValue(
                    content,
                    "why-copy",
                    "Camp should feel exciting for kids and easy for parents. AeroSports keeps the day active, structured, and supervised from check-in to pick-up."
                  )}
                </p>
              </div>

              <div className="v11_camps_reason_list">
                {whyReasons.map((item, index) => (
                  <article className="v11_camps_reason_item" key={`${item.title}-${index}`}>
                    <span aria-hidden="true">{item.icon || "✓"}</span>
                    <h3>{item.title}</h3>
                    {item.detail && <p>{item.detail}</p>}
                  </article>
                ))}
              </div>
              </div>
            </div>
          </section>
        )}

        <section id="camp-packages" className="v11_camps_section v11_camps_packages">
          <div className="v11_camps_container">
            <div className="v11_camps_section_header">
              <span>{contentValue(content, "eyebrow", "AeroSports Camps")}</span>
              <h2>{contentValue(content, "packages-heading", "Choose Your Camp Adventure")}</h2>
              <p>
                Compare camp options, pick the schedule that works for your family, and keep the day full of movement,
                games, and supervised fun.
              </p>
            </div>

            <div className="v11_camps_package_grid">
              {packages.map((item, index) => (
                <article className="v11_camps_package_card" key={`${item.title}-${index}`}>
                  {item.badge && <strong className="v11_camps_badge">{item.badge}</strong>}
                  <div className="v11_camps_package_icon" aria-hidden="true">
                    {item.icon || "★"}
                  </div>
                  <h3>{item.title}</h3>
                  {item.subtitle && <p className="v11_camps_package_subtitle">{item.subtitle}</p>}
                  <div className="v11_camps_price_list">
                    {getPriceOptions(item.price).map((priceOption, priceIndex) => (
                      <div className="v11_camps_price_row" key={`${item.title}-price-${priceIndex}`}>
                        <span>{priceOption.label}</span>
                        <strong>{priceOption.amount}</strong>
                      </div>
                    ))}
                  </div>
                  <ul>
                    {packageSchedule(item) && <li><span>Schedule</span><strong>{packageSchedule(item)}</strong></li>}
                    {item.ages && <li><span>Ages</span><strong>{item.ages}</strong></li>}
                    {item.detail && <li><span>Includes</span><strong>{item.detail}</strong></li>}
                  </ul>
                  <Link
                    href={isExternalUrl(item.cta) ? item.cta : bookingUrl}
                    className="v11_camps_cta"
                    target={isExternalUrl(item.cta) || isExternalUrl(bookingUrl) ? "_blank" : undefined}
                    rel={isExternalUrl(item.cta) || isExternalUrl(bookingUrl) ? "noopener noreferrer" : undefined}
                  >
                    {item.cta && !isExternalUrl(item.cta) ? item.cta : "Check Dates"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="v11_camps_section v11_camps_split_section">
          <div className="v11_camps_container v11_camps_activity_band">
            <div className="v11_camps_activity_content">
              <div className="v11_camps_section_header v11_camps_section_header_left">
                <span>{contentValue(content, "activities-eyebrow", "Active Days")}</span>
                <h2>{contentValue(content, "activities-heading", "Every Day Includes")}</h2>
                <p>
                  {contentValue(
                    content,
                    "activities-copy",
                    "Campers get a balanced mix of attraction time, group games, creative breaks, and supervised recharge moments."
                  )}
                </p>
              </div>
              <div className="v11_camps_activity_grid">
                {activities.map((item, index) => (
                  <article className="v11_camps_activity" key={`${item.title}-${index}`}>
                    <span aria-hidden="true">{item.icon || "✓"}</span>
                    <div>
                      <h3>{item.title}</h3>
                      {item.detail && <p>{item.detail}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="v11_camps_media_frame v11_camps_media_frame_tall">
              <AppImage
                src={activitiesImage}
                alt="AeroSports camp activities with kids playing indoors"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>

            <div className="v11_camps_schedule_panel">
              <div className="v11_camps_section_header v11_camps_section_header_left">
                <span>{contentValue(content, "schedule-eyebrow", "Camp Flow")}</span>
                <h2>{contentValue(content, "schedule-heading", "A Day at Camp")}</h2>
              </div>
              <ol className="v11_camps_timeline">
                {schedule.map((item, index) => (
                  <li key={`${item.title}-${index}`}>
                    <time>{item.schedule}</time>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {addons.length > 0 && (
          <section className="v11_camps_section v11_camps_addons_section">
            <div className="v11_camps_container">
              <div className="v11_camps_section_header">
                <span>Helpful Extras</span>
                <h2>Camp Add-Ons</h2>
                <p>Add the small details that make drop-off, lunch, and pick-up easier.</p>
              </div>
              <div className="v11_camps_addons_table_wrap">
                <table className="v11_camps_addons_table">
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Details</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addons.map((item, index) => (
                      <tr key={`${item.title}-${index}`}>
                        <td><span>{item.icon || "+"}</span>{item.title}</td>
                        <td>{item.detail}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <CommonFAQSection
          location_slug={location_slug}
          page="camps"
          eyebrow="Camp Questions"
          title="Camp"
          accent=" FAQs"
          subtitle="Quick answers from the FAQ sheet about camp bookings, daily prep, and policies."
        />

        {pageData?.section1 && (
          <section className="v11_camps_section v11_camps_cms_section">
            <div className="v11_camps_container">
              <div
                className="v11_camps_cms_content"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(pageData.section1) }}
              />
            </div>
          </section>
        )}
      </div>

      {blogChildren.length > 0 && (
        <BlogSection blogs={blogChildren} location_slug={location_slug} currentCategory="camps" />
      )}
    </main>
  );
};

export default CampsPage;
