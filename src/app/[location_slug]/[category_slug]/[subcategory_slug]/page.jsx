import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "../../../styles/subcategory.css";
import "../../../styles/category.css";
import "../../../styles/kidsparty.css";
import "../../../styles/attractions.css";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";
import MotionImage from "@/components/MotionImage";
import AppImage from "@/components/AppImage";
import SubCategoryCard from "@/components/smallComponents/SubCategoryCard";
import FaqCard from "@/components/smallComponents/FaqCard";
import CommonFAQList from "@/components/sections/CommonFAQList";
import {
  fetchsheetdata,
  fetchMenuData,
  generateMetadataLib,
  getWaiverLink,
  generateSchema,
  fetchPageData,
  fetchAttractionContent,
  fetchFaqData,
  fetchGalleryData,
  getReviewsData,
} from "@/lib/sheets";
import BlogSection from "@/components/sections/BlogSection";
import PageGallerySection from "@/components/PageGallerySection";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2Subcategory from "@g2/pages/Group2Subcategory";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

const isAttractionsCategory = (slug) => String(slug || "").toLowerCase() === "attractions";

function toTitleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function splitList(value) {
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTitleBody(value) {
  const text = String(value || "").trim();
  const index = text.indexOf(":");
  if (index === -1) return { title: text, body: "" };
  return {
    title: text.slice(0, index).trim(),
    body: text.slice(index + 1).trim(),
  };
}

function getAttractionCards(value) {
  return splitList(value).map((item, index) => ({
    id: `${item}-${index}`,
    ...splitTitleBody(item),
  }));
}

function getAttractionSteps(value) {
  return splitList(value).map((item, index) => {
    const cleaned = item.replace(/^\d+\.\s*/, "");
    return {
      id: `${cleaned}-${index}`,
      number: index + 1,
      ...splitTitleBody(cleaned),
    };
  });
}

function parseCtaCopy(value, fallbackTitle) {
  const text = String(value || "").replace(/Buttons?:.*$/i, "").trim();
  const buttonMatch = String(value || "").match(/Buttons?:\s*(.+)$/i);
  const buttonText = buttonMatch ? buttonMatch[1].split("|")[0].trim() : "Book Now";
  const questionIndex = text.indexOf("?");

  if (questionIndex >= 0) {
    return {
      title: text.slice(0, questionIndex + 1).trim(),
      body: text.slice(questionIndex + 1).trim(),
      buttonText,
    };
  }

  const periodIndex = text.indexOf(".");
  if (periodIndex >= 0) {
    return {
      title: text.slice(0, periodIndex + 1).trim(),
      body: text.slice(periodIndex + 1).trim(),
      buttonText,
    };
  }

  return {
    title: text || fallbackTitle,
    body: "",
    buttonText,
  };
}

function getLocationDisplay(locationSlug, locationData) {
  const row = Array.isArray(locationData) ? locationData[0] : locationData;
  return row?.displayname || row?.name || toTitleCase(locationSlug);
}

function getLocationId(locationData) {
  const row = Array.isArray(locationData) ? locationData[0] : locationData;
  return row?.locationid || row?.id || row?.place_id || row?.google_place_id || null;
}

function getReviewRating(reviewdata) {
  const rating = Number(reviewdata?.rating);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "4.8";
}

function getTrustItems(trust, reviewdata) {
  const ratingText = `${getReviewRating(reviewdata)}★ Rated`;
  const items = splitList(trust);
  let hasRating = false;
  const updatedItems = items.map((item) => {
    if (/rated/i.test(item)) {
      hasRating = true;
      return ratingText;
    }
    return item;
  });

  if (!hasRating) {
    updatedItems.splice(Math.min(1, updatedItems.length), 0, ratingText);
  }

  return updatedItems;
}

function getFirstGalleryImage(galleryData) {
  const groups = Object.values(galleryData || {}).flat();
  const firstGroup = groups.find((group) => Array.isArray(group?.urls) && group.urls.length > 0);
  return firstGroup?.urls?.[0] || "";
}

function getPageImage(pageData, galleryData) {
  return (
    pageData?.headerimage_media?.desktop_url ||
    pageData?.headerimage ||
    pageData?.smallimage_media?.desktop_url ||
    pageData?.smallimage ||
    getFirstGalleryImage(galleryData)
  );
}

function getFallbackAttractionContent(title, locationDisplay, pageData) {
  const description =
    pageData?.smalltext ||
    pageData?.metadescription ||
    pageData?.text ||
    `Experience ${title} at AeroSports ${locationDisplay}.`;

  return {
    headerintend: `Perfect for families, friends, groups and active fun`,
    trust: "50,000+ Visitors|Rated|All Ages|Indoor Fun",
    what_is: description,
    why_you_will_love:
      `High-Energy Fun:${title} keeps the action moving from start to finish|` +
      `Great for Groups:Easy to enjoy with friends, families and parties|` +
      `All-Weather Play:Indoor attraction built for year-round fun|` +
      `Memorable Experience:A signature AeroSports activity guests come back for`,
    how_it_works:
      `1. Enter the Attraction:Step into the ${title} play area|` +
      `2. Get Ready:Follow posted rules and crew guidance|` +
      `3. Play Your Way:Enjoy the activity at your own pace|` +
      `4. Celebrate the Moment:Make it part of your visit, party or group event`,
    who_is_for: "Kids & Families|Friends & Groups|Birthday Parties|First-Time Visitors",
    cta_block: `Ready to Play? Book your ${title} experience today Buttons: Book Now`,
    cta_footer: `Make Your Next Visit More Exciting. Book Your Session Now Buttons: Book Now`,
  };
}

function AttractionDetailPage({
  attractionContent,
  pageData,
  location_slug,
  category_slug,
  subcategory_slug,
  locationData,
  dataconfig,
  waiverLink,
  faqData,
  galleryData,
  blogChildren,
  jsonLDschema,
  reviewdata,
}) {
  const title = pageData?.desc || pageData?.metatitle || toTitleCase(subcategory_slug);
  const locationDisplay = getLocationDisplay(location_slug, locationData);
  const content =
    attractionContent || getFallbackAttractionContent(title, locationDisplay, pageData || {});
  const heroImage = getPageImage(pageData, galleryData);
  const heroAlt = pageData?.headerimage_media?.alt || `${title} at AeroSports ${locationDisplay}`;
  const trustItems = getTrustItems(content.trust, reviewdata);
  const whyCards = getAttractionCards(content.why_you_will_love);
  const steps = getAttractionSteps(content.how_it_works);
  const audiences = splitList(content.who_is_for);
  const highlights = whyCards.map((card) => card.body || card.title).filter(Boolean);
  const cta = parseCtaCopy(content.cta_block, `Ready to try ${title}?`);
  const footerCta = parseCtaCopy(content.cta_footer, `Book ${title} today`);
  const estoreConfig = Array.isArray(dataconfig)
    ? dataconfig.find((item) => String(item.key || "").toLowerCase() === "estore")
    : null;
  const bookHref = estoreConfig?.value || waiverLink || `/${location_slug}/pricing-promos`;
  const pricingHref = `/${location_slug}/pricing-promos`;

  return (
    <main className={`${robotoCondensed.variable} aero_attraction_detail_page`}>
      <section className="aero_detail_hero_section">
        <div className="aero_detail_container aero_detail_hero_grid">
          <div className="aero_detail_hero_copy">
            <span className="aero_detail_eyebrow">AeroSports Attraction</span>
            <h1 className="aero_detail_hero_title">
              {title}
              <span>{locationDisplay}</span>
            </h1>
            {content.what_is && (
              <p className="aero_detail_hero_text">{content.what_is}</p>
            )}
            <div className="aero_detail_actions" aria-label={`${title} actions`}>
              <Link className="aero_detail_btn aero_detail_btn_primary" href={bookHref}>
                Book Now
              </Link>
              <Link className="aero_detail_btn aero_detail_btn_secondary" href={pricingHref}>
                View Pricing
              </Link>
            </div>
            {content.headerintend && (
              <p className="aero_detail_tagline">{content.headerintend}</p>
            )}
          </div>
          {heroImage && (
            <div className="aero_detail_hero_media">
              <AppImage
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>
          )}
        </div>
      </section>

      {trustItems.length > 0 && (
        <section className="aero_detail_trust_section" aria-label="Attraction highlights">
          <div className="aero_detail_container aero_detail_trust_bar">
            {trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      )}

      <PageGallerySection
        galleryData={galleryData}
        heading={`See ${title} in Action`}
        className="aero_detail_gallery_section"
      />

      <section className="aero_detail_section aero_detail_intro_section">
        <div className="aero_detail_container aero_detail_panel">
          <span className="aero_detail_section_label">What Is {title}</span>
          <h2>{title} at AeroSports</h2>
          <p>{content.what_is}</p>
        </div>
      </section>

      {whyCards.length > 0 && (
        <section className="aero_detail_section">
          <div className="aero_detail_container">
            <span className="aero_detail_section_label">Why You Will Love It</span>
            <div className="aero_detail_card_grid">
              {whyCards.map((card) => (
                <article className="aero_detail_feature_card" key={card.id}>
                  <h3>{card.title}</h3>
                  {card.body && <p>{card.body}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="aero_detail_section aero_detail_steps_section">
          <div className="aero_detail_container">
            <span className="aero_detail_section_label">How It Works</span>
            <div className="aero_detail_steps">
              {steps.map((step) => (
                <article className="aero_detail_step" key={step.id}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    {step.body && <p>{step.body}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {audiences.length > 0 && (
        <section className="aero_detail_section">
          <div className="aero_detail_container aero_detail_audience_panel">
            <span className="aero_detail_section_label">Who It Is For</span>
            <div className="aero_detail_audience_list">
              {audiences.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {highlights.length > 0 && (
        <section className="aero_detail_section">
          <div className="aero_detail_container aero_detail_highlight_panel">
            <span className="aero_detail_section_label">Experience Highlights</span>
            <h2>What Makes This Special</h2>
            <ul>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="aero_detail_section">
        <div className="aero_detail_container aero_detail_cta_panel">
          <div>
            <span className="aero_detail_section_label">Ready To Play?</span>
            <h2>{cta.title}</h2>
            {cta.body && <p>{cta.body}</p>}
          </div>
          <div className="aero_detail_actions">
            <Link className="aero_detail_btn aero_detail_btn_primary" href={bookHref}>
              {cta.buttonText}
            </Link>
            <Link className="aero_detail_btn aero_detail_btn_secondary" href={pricingHref}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {faqData?.length > 0 && (
        <section className="aero_detail_section aero_detail_faq_section">
          <div className="aero_detail_container">
            <span className="aero_detail_section_label">FAQs</span>
            <h2>Questions Before You Visit?</h2>
            <CommonFAQList faqs={faqData} />
          </div>
        </section>
      )}

      <section className="aero_detail_final_cta">
        <div className="aero_detail_container">
          <h2>{footerCta.title}</h2>
          {footerCta.body && <p>{footerCta.body}</p>}
          <Link className="aero_detail_btn aero_detail_btn_primary" href={bookHref}>
            {footerCta.buttonText}
          </Link>
        </div>
      </section>

      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory={category_slug}
        />
      )}

      {jsonLDschema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonLDschema }}
        />
      )}
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { location_slug, subcategory_slug, category_slug } = params;
  if (isGroup2(location_slug) && !isAttractionsCategory(category_slug)) {
    return await generateMetadataLibG2({
      location: location_slug,
      category: category_slug,
      page: subcategory_slug,
    });
  }
  // Validate page data exists before generating metadata
  const pageData = await fetchPageData(location_slug, subcategory_slug);
  if ((!pageData || !pageData.path) && isAttractionsCategory(category_slug)) {
    const attractionContent = await fetchAttractionContent(location_slug, subcategory_slug);
    if (!attractionContent) {
      notFound();
    }

    const title = toTitleCase(subcategory_slug);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const canonical = `${BASE_URL}/${location_slug}/${category_slug}/${subcategory_slug}`;

    return {
      title: `${title} | AeroSports ${toTitleCase(location_slug)}`,
      description: attractionContent.what_is || `Experience ${title} at AeroSports ${toTitleCase(location_slug)}.`,
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${title} | AeroSports ${toTitleCase(location_slug)}`,
        description: attractionContent.what_is || `Experience ${title} at AeroSports ${toTitleCase(location_slug)}.`,
        url: canonical,
        siteName: "AeroSports Trampoline Park",
        locale: "en_CA",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | AeroSports ${toTitleCase(location_slug)}`,
        description: attractionContent.what_is || `Experience ${title} at AeroSports ${toTitleCase(location_slug)}.`,
      },
    };
  }
  if (!pageData || !pageData.path) {
    notFound();
  }
  const metadata = await generateMetadataLib({
    location: location_slug,
    category: category_slug,
    page: subcategory_slug,
  });
  return metadata;
}

const Subcategory = async ({ params }) => {
  const { location_slug, subcategory_slug, category_slug } = params;
  const attractionPage = isAttractionsCategory(category_slug);
  if (isGroup2(location_slug) && !attractionPage) return <Group2Subcategory params={params} />;

  const [p0, p1, p2, p3, p4, p5, p6, p7] = await Promise.allSettled([
    fetchPageData(location_slug, subcategory_slug),
    fetchsheetdata("config", location_slug),
    fetchMenuData(location_slug),
    fetchsheetdata("locations", location_slug),
    getWaiverLink(location_slug),
    attractionPage ? fetchAttractionContent(location_slug, subcategory_slug) : Promise.resolve(null),
    attractionPage ? fetchFaqData(location_slug, subcategory_slug) : Promise.resolve([]),
    attractionPage
      ? fetchGalleryData(location_slug, [`${category_slug}/${subcategory_slug}`, subcategory_slug])
      : Promise.resolve({}),
  ]);

  const pageData = p0.status === "fulfilled" ? p0.value : {};
  const dataconfig = p1.status === "fulfilled" ? p1.value : {};
  const menudata = p2.status === "fulfilled" ? p2.value : [];
  const locationData = p3.status === "fulfilled" ? p3.value : {};
  const waiverLink = p4.status === "fulfilled" ? p4.value : null;
  const attractionContent = p5.status === "fulfilled" ? p5.value : null;
  const faqData = p6.status === "fulfilled" ? p6.value : [];
  const galleryData = p7.status === "fulfilled" ? p7.value : {};
  const locationid = getLocationId(locationData);
  const reviewdata =
    attractionPage && locationid
      ? await getReviewsData(locationid)
      : null;

  // Return 404 if page data doesn't exist for this subcategory
  if ((!pageData || !pageData.path) && !(attractionPage && attractionContent)) {
    notFound();
  }

  const categoryData = (
    await getDataByParentId(menudata, category_slug)
  )[0]?.children?.filter(
    (child) => child.path !== subcategory_slug && child.isactive == 1
  );

  // console.log("param ", location_slug, subcategory_slug, category_slug);

  const blogsData = getDataByParentId(menudata, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];

  const jsonLDschema = pageData?.path
    ? await generateSchema(
        pageData,
        locationData,
        category_slug,
        subcategory_slug
      )
    : "";

  if (attractionPage && (attractionContent || pageData?.path)) {
    return (
      <AttractionDetailPage
        attractionContent={attractionContent}
        pageData={pageData || {}}
        location_slug={location_slug}
        category_slug={category_slug}
        subcategory_slug={subcategory_slug}
        locationData={locationData}
        dataconfig={dataconfig}
        waiverLink={waiverLink}
        faqData={faqData}
        galleryData={galleryData}
        blogChildren={blogChildren}
        jsonLDschema={jsonLDschema}
        reviewdata={reviewdata}
      />
    );
  }

  return (
    <main className={robotoCondensed.variable}>
      <section>
        <MotionImage
          pageData={pageData}
          waiverLink={waiverLink}
          locationData={locationData}
        />
      </section>

      <div className="v11_cat_wrapper">
        {/* Section 1 CMS Content */}
        {pageData.section1 && (
          <section className="v11_cat_seo_section">
            <div className="v11_cat_container">
              <div
                className="v11_cat_seo_content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(pageData.section1),
                }}
              />
            </div>
          </section>
        )}

        {/* Description */}
        {pageData?.metadescription && (
          <section className="v11_bp_intro_section">
            <div className="v11_bp_container">
              <p className="v11_bp_intro_text">
                {pageData.metadescription}
              </p>
            </div>
          </section>
        )}

        {/* Related subcategories */}
        <SubCategoryCard
          attractionsData={categoryData}
          location_slug={location_slug}
          title={`Other ${pageData.parentid}`}
        />
      </div>

      {/* SEO Content - Dark navy section */}
      {pageData.seosection && (
        <section className="v11_bp_packages_section">
          <div className="v11_bp_container">
            <div
              className="v11_subcategory_seo_content"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(pageData.seosection),
              }}
            />
          </div>
        </section>
      )}

      <FaqCard page={subcategory_slug} location_slug={location_slug} />

      {/* Blog Section */}
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory={category_slug}
        />
      )}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
    </main>
  );
};

export default Subcategory;
