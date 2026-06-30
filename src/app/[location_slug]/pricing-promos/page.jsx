import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "../../styles/subcategory.css";
import "../../styles/kidsparty.css";
import AppImage from "@/components/AppImage";
import BlogSection from "@/components/sections/BlogSection";
import CommonFAQSection from "@/components/sections/CommonFAQSection";
import DiscountPromoSlot from "@/components/sections/DiscountPromoSlot";
import MotionImage from "@/components/MotionImage";
import { generateMetadataLib, fetchPricingTableData, fetchPageData, fetchsheetdata, fetchMenuData, getWaiverLink } from "@/lib/sheets";
import { getDataByParentId } from "@/utils/customFunctions";

import { resolveLocationGroup } from "@/lib/location-groups.mjs";
import Group2PricingPromos from "@g2/pages/Group2PricingPromos";
import { generateMetadataLib as generateMetadataLibG2 } from "@g2/lib/sheets";

const isGroup2 = (slug) => resolveLocationGroup(slug)?.group?.key === "group2";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

function getPackagePrice(packageData) {
  return packageData?.Price || packageData?.price || "";
}

function getPackageDetails(packageData) {
  return Object.entries(packageData || {}).filter(([feature]) => feature.toLowerCase() !== "price");
}

function getOrderedFeatures(features) {
  const uniqueFeatures = Array.from(features);
  return [
    ...uniqueFeatures.filter((feature) => feature.toLowerCase() !== "price"),
    ...uniqueFeatures.filter((feature) => feature.toLowerCase() === "price"),
  ];
}

function normalizeLabel(value) {
  return String(value || "").trim();
}

function normalizeKey(value) {
  return normalizeLabel(value).toLowerCase().replace(/\s+/g, " ");
}

function isIncludedValue(value) {
  const normalized = normalizeKey(value);
  return normalized === "yes" || normalized === "included" || normalized === "âœ“";
}

function isExcludedValue(value) {
  const normalized = normalizeKey(value);
  return normalized === "x" || normalized === "no" || normalized === "-";
}

function formatPrice(value) {
  const raw = normalizeLabel(value);
  if (!raw) return "";
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function getPricingField(row) {
  return normalizeLabel(row?.Tickets);
}

function getComparableColumns(row) {
  return Object.keys(row || {}).filter((column) => {
    const normalized = normalizeKey(column);
    return (
      normalized &&
      normalized !== "location" &&
      normalized !== "tickets" &&
      !normalized.endsWith("_media")
    );
  });
}

function parseComparablePricingRows(rows, locationSlug) {
  const locationRows = (Array.isArray(rows) ? rows : []).filter(
    (row) => normalizeKey(row.location) === normalizeKey(locationSlug)
  );
  const sections = {
    tickets: { key: "tickets", label: "Tickets", products: [], bookingUrl: "" },
    passes: { key: "passes", label: "Passes", products: [], bookingUrl: "" },
    memberships: { key: "memberships", label: "Memberships", products: [], bookingUrl: "" },
    attractions: { key: "attractions", label: "Attractions", items: [] },
  };
  const productsBySection = {
    tickets: {},
    passes: {},
    memberships: {},
  };
  const sectionColumns = {
    tickets: [],
    passes: [],
    memberships: [],
  };
  let currentSection = "tickets";
  let completedTicketsBlock = false;
  let completedPassesBlock = false;
  let completedMembershipBlock = false;
  let attractionColumns = { image: "", desc: "", price: "" };

  const ensureProduct = (sectionKey, column) => {
    if (!productsBySection[sectionKey][column]) {
      productsBySection[sectionKey][column] = {
        column,
        name: column,
        features: {},
        price: "",
        bookingUrl: "",
        isPopular: false,
      };
    }
    return productsBySection[sectionKey][column];
  };

  locationRows.forEach((row) => {
    const field = getPricingField(row);
    const key = normalizeKey(field);
    if (!field) return;

    if (key === "tickets") {
      currentSection = "tickets";
      sectionColumns[currentSection] = getComparableColumns(row);
      sectionColumns[currentSection].forEach((column) => {
        const value = normalizeLabel(row[column]);
        if (value) ensureProduct(currentSection, column).name = value;
      });
      return;
    }

    if (key === "passes") {
      currentSection = "passes";
      completedTicketsBlock = true;
      completedPassesBlock = false;
      sectionColumns[currentSection] = getComparableColumns(row);
      sectionColumns[currentSection].forEach((column) => {
        const value = normalizeLabel(row[column]);
        if (value) ensureProduct(currentSection, column).name = value;
      });
      return;
    }

    if (key === "membership" || key === "memberships") {
      currentSection = "memberships";
      completedTicketsBlock = true;
      completedMembershipBlock = false;
      sectionColumns[currentSection] = getComparableColumns(row);
      sectionColumns[currentSection].forEach((column) => {
        const value = normalizeLabel(row[column]);
        if (value) ensureProduct(currentSection, column).name = value;
      });
      return;
    }

    if (key === "attractions") {
      currentSection = "attractions";
      completedTicketsBlock = true;
      completedMembershipBlock = true;
      const attractionHeaderColumns = getComparableColumns(row);
      attractionColumns = {
        image: attractionHeaderColumns.find((column) => normalizeKey(row[column]) === "photo") || attractionHeaderColumns[0] || "",
        desc: attractionHeaderColumns.find((column) => normalizeKey(row[column]) === "desc") || attractionHeaderColumns[1] || "",
        price: attractionHeaderColumns.find((column) => normalizeKey(row[column]) === "price") || attractionHeaderColumns[2] || "",
      };
      return;
    }

    if (currentSection === "attractions") {
      sections.attractions.items.push({
        name: field,
        image: normalizeLabel(row[attractionColumns.image]),
        description: normalizeLabel(row[attractionColumns.desc]),
        price: formatPrice(row[attractionColumns.price]),
      });
      return;
    }

    if (key === "booking url") {
      const columns = sectionColumns[currentSection] || getComparableColumns(row);
      const bookingUrl = columns.map((column) => normalizeLabel(row[column])).find(Boolean) || "";
      sections[currentSection].bookingUrl = bookingUrl;
      Object.values(productsBySection[currentSection]).forEach((product) => {
        product.bookingUrl = bookingUrl;
      });
      if (currentSection === "tickets") completedTicketsBlock = true;
      if (currentSection === "passes") completedPassesBlock = true;
      if (currentSection === "memberships") completedMembershipBlock = true;
      return;
    }

    if (completedTicketsBlock && currentSection === "tickets" && (key === "price" || key === "jump time" || key === "jumptime" || key === "duration")) {
      currentSection = "passes";
    }

    if (completedPassesBlock && currentSection === "passes" && (key === "price" || key === "jump time" || key === "jumptime" || key === "duration")) {
      currentSection = "memberships";
    }

    if (
      completedMembershipBlock &&
      currentSection === "memberships" &&
      (sectionColumns.memberships || []).slice(0, 2).every((column) => !normalizeLabel(row[column])) &&
      normalizeLabel(row[(sectionColumns.memberships || [])[2]])
    ) {
      currentSection = "attractions";
      sections.attractions.items.push({
        name: field,
        image: "",
        description: "",
        price: formatPrice(row[(sectionColumns.memberships || [])[2]]),
      });
      return;
    }

    // Some blocks in the Pricing sheet have no explicit header row defining
    // their product columns (e.g. tickets start straight at "Price", and a
    // location's passes block may have no "Passes" header). Seed the columns
    // from the first data row of the block so products are still built.
    if (
      (currentSection === "tickets" ||
        currentSection === "passes" ||
        currentSection === "memberships") &&
      (sectionColumns[currentSection] || []).length === 0
    ) {
      sectionColumns[currentSection] = getComparableColumns(row);
    }

    const columns = sectionColumns[currentSection] || [];
    columns.forEach((column) => {
      const value = normalizeLabel(row[column]);
      if (!value) return;

      const product = ensureProduct(currentSection, column);
      if (key === "price") {
        product.price = formatPrice(value);
      } else if (key === "most popular") {
        product.isPopular = normalizeKey(value) === "yes";
      } else {
        const label = key === "jumptime" ? "Jump Time" : field;
        product.features[label] = value;
      }
    });
  });

  ["tickets", "passes", "memberships"].forEach((sectionKey) => {
    sections[sectionKey].products = Object.values(productsBySection[sectionKey]).filter(
      (product) => product.price || Object.keys(product.features).length > 0
    );
  });

  return sections;
}

function hasStructuredPricing(sections) {
  return Boolean(
    sections?.tickets?.products?.length ||
    sections?.passes?.products?.length ||
    sections?.memberships?.products?.length ||
    sections?.attractions?.items?.length
  );
}

function getFirstBookingUrl(sections, fallbackUrl) {
  return (
    sections?.tickets?.bookingUrl ||
    sections?.passes?.bookingUrl ||
    sections?.memberships?.bookingUrl ||
    fallbackUrl ||
    ""
  );
}

function getCategoryHeading(section) {
  if (section.key === "tickets") return "Pick Your Session";
  if (section.key === "passes") return "Play More, Save More";
  if (section.key === "memberships") return "Play Plans";
  return section.label;
}

function getCategoryDescription(section) {
  if (section.key === "tickets") return "Choose your jump time, compare inclusions, and lock in your visit.";
  if (section.key === "passes") return "Best for repeat visits, school breaks, and families planning more than one trip.";
  if (section.key === "memberships") return "Recurring value for guests who want regular play.";
  return "";
}

function getPopularProduct(section) {
  return section.products.find((product) => product.isPopular) || section.products[0];
}

export async function generateMetadata({ params }) {
  if (isGroup2(params.location_slug)) {
    return await generateMetadataLibG2({
      location: params.location_slug,
      category: '',
      page: 'pricing-promos'
    });
  }
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'pricing-promos'
  });

  return {
    ...metadata,
    title: `Pricing & Promos - ${params.location_slug} | AeroSports`,
    description: `View our pricing and promotions for ${params.location_slug} location. Compare packages and find the best deal for your adventure.`,
  };
}

const page = async ({ params }) => {
  if (isGroup2(params?.location_slug)) return <Group2PricingPromos params={params} />;

  const { location_slug } = params;

  const [pricingData, pricingRows, homePageData, pricingPageData, promotions, menuData, configData, locationData, waiverLink] = await Promise.all([
    fetchPricingTableData(location_slug).then((data) => data?.table ? { table: data.table } : null),
    // Fetch the full tab here because fetchsheetdata's location prefilter is
    // case-sensitive; the local parser below normalizes location names.
    fetchsheetdata("Pricing"),
    fetchPageData(location_slug, 'home'),
    fetchPageData(location_slug, 'pricing-promos'),
    fetchsheetdata("promotions", location_slug),
    fetchMenuData(location_slug),
    fetchsheetdata("config", location_slug),
    fetchsheetdata("locations", location_slug),
    getWaiverLink(location_slug),
  ]);
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];
  const estoreBase = Array.isArray(configData)
    ? configData.find((item) => item.key === "estorebase")?.value
    : "";
  const structuredPricing = parseComparablePricingRows(pricingRows, location_slug);
  const useStructuredPricing = hasStructuredPricing(structuredPricing);
  const primaryBookingUrl = getFirstBookingUrl(structuredPricing, estoreBase);
  const pricingHeroSource = Array.isArray(pricingPageData) && pricingPageData.length > 0
    ? pricingPageData[0]
    : Array.isArray(homePageData) && homePageData.length > 0
      ? homePageData[0]
      : homePageData || {};
  const pricingHeroData = {
    ...pricingHeroSource,
    title: "Pricing & Promotions",
    smalltext: `Compare tickets, passes, memberships, attractions, and current deals for AeroSports ${String(location_slug || "").replace(/-/g, " ")}.`,
  };

  // Package column accent colors (matching v11 birthday party design)
  const packageColors = [
    { bg: "#B7E600", light: "rgba(255, 23, 74, 0.06)", border: "rgba(255, 23, 74, 0.2)" },
    { bg: "#3B82F6", light: "rgba(59, 130, 246, 0.06)", border: "rgba(59, 130, 246, 0.2)" },
    { bg: "#8B5CF6", light: "rgba(139, 92, 246, 0.06)", border: "rgba(139, 92, 246, 0.2)" },
    { bg: "#F59E0B", light: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.2)" },
    { bg: "#10B981", light: "rgba(16, 185, 129, 0.06)", border: "rgba(16, 185, 129, 0.2)" },
  ];

  return (
    <main className={`v11_bp_page ${robotoCondensed.variable}`}>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 1: Hero Banner
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <MotionImage
        pageData={pricingHeroData}
        waiverLink={waiverLink}
        locationData={locationData}
        primaryHref={primaryBookingUrl || estoreBase || `/${location_slug}/pricing-promos#tickets`}
        primaryLabel="Book Now"
        secondaryHref="#tickets"
        secondaryLabel="Compare Prices"
        reviewText="Compare play options, current promotions, and add-ons before you book."
      />
      <DiscountPromoSlot
        promotions={promotions}
        locationSlug={location_slug}
        path="pricing-promos"
        variant="light"
        limit={4}
        className="pricing_promos_offer_slot"
        primaryHref={primaryBookingUrl || estoreBase || `/${location_slug}/pricing-promos#tickets`}
      />


      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 4: Pricing Table (Dark Navy)
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {useStructuredPricing && (
        <section className="v11_bp_packages_section v11_pricing_hub_section">
          <div className="v11_bp_container">
            <div className="v11_bp_packages_header">
              <p className="v11_bp_packages_eyebrow">Compare &amp; Choose</p>
              <h2 className="v11_bp_heading v11_bp_heading_light">
                Pick Your Session
                <span className="v11_bp_heading_accent_light"> Lock Your Spot</span>
              </h2>
              <p className="v11_bp_packages_subtitle">
                Choose your ticket, pass, membership, or attraction add-on and book in seconds.
              </p>
            </div>

            <div className="v11_pricing_lock_panel">
              <div>
                <p className="v11_pricing_lock_kicker">Plan your visit</p>
                <h3>Start with the right amount of play.</h3>
                <ul>
                  <li>Compare jump time, included attractions, and value in one place.</li>
                  <li>Use passes or memberships when you plan to visit more often.</li>
                  <li>Add attractions to build a bigger day around your jump session.</li>
                </ul>
              </div>
              {primaryBookingUrl && (
                <a href={primaryBookingUrl} target="_blank" rel="noopener noreferrer" className="v11_pricing_lock_cta">
                  Book Your Session
                </a>
              )}
            </div>

            <nav className="v11_pricing_tabs" aria-label="Pricing categories">
              {[
                structuredPricing.tickets.products.length > 0 && { href: "#tickets", label: "Tickets" },
                structuredPricing.passes.products.length > 0 && { href: "#passes", label: "Passes" },
                structuredPricing.memberships.products.length > 0 && { href: "#memberships", label: "Memberships" },
                structuredPricing.attractions.items.length > 0 && { href: "#attractions", label: "Attractions" },
              ].filter(Boolean).map((item) => (
                <a key={item.href} href={item.href} className="v11_pricing_tab">
                  {item.label}
                </a>
              ))}
            </nav>

            {[
              structuredPricing.tickets,
              structuredPricing.passes,
              structuredPricing.memberships,
            ].filter((section) => section.products.length > 0).map((section) => {
              const allFeatures = getOrderedFeatures(
                new Set(section.products.flatMap((product) => [
                  ...Object.keys(product.features),
                  ...(product.price ? ["Price"] : []),
                ]))
              );
              const bookingUrl = section.bookingUrl || estoreBase;
              const popularProduct = getPopularProduct(section);

              return (
                <div key={section.key} id={section.key} className="v11_pricing_category_block">
                  <div className="v11_pricing_category_header">
                    <p className="v11_bp_packages_eyebrow">{section.label}</p>
                    <h3>{getCategoryHeading(section)}</h3>
                    <p>{getCategoryDescription(section)}</p>
                    {popularProduct && (
                      <div className="v11_pricing_choice_hint">
                        {section.key === "tickets"
                          ? `Most guests start with ${popularProduct.name}.`
                          : `${popularProduct.name} is a strong value pick for this category.`}
                      </div>
                    )}
                  </div>

                  {section.key === "tickets" && (
                  <div className="v11_pricing_card_grid">
                    {section.products.map((product, index) => {
                      const color = packageColors[index % packageColors.length];
                      const featured = product.isPopular || index === 0;

                      return (
                        <article key={`${section.key}-${product.column}`} className={`v11_pricing_play_card ${featured ? "v11_pricing_play_card_featured" : ""}`}>
                          <div className="v11_pricing_card_bar" style={{ backgroundColor: color.bg }} />
                          <div className="v11_pricing_card_body">
                            {product.isPopular && <span className="v11_pricing_card_badge">Most Popular</span>}
                            <h4 className="v11_pricing_card_title">{product.name}</h4>
                            <ul className="v11_pricing_card_features">
                              {Object.entries(product.features).slice(0, 4).map(([feature, value]) => (
                                <li key={`${product.name}-${feature}`}>
                                  <span>{feature}</span>
                                  <strong>{isIncludedValue(value) ? "Included" : value}</strong>
                                </li>
                              ))}
                            </ul>
                            {product.price && <div className="v11_pricing_card_price">{product.price}</div>}
                            {(product.bookingUrl || bookingUrl) && (
                              <a href={product.bookingUrl || bookingUrl} className="v11_pricing_card_cta" target="_blank" rel="noopener noreferrer">
                                {section.key === "memberships" ? "Join Now" : "Book Now"}
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  )}

                  {section.key !== "tickets" && (
                  <div className="v11_bp_packages_table_wrap">
                    <div
                      className="v11_bp_pkg_grid"
                      style={{ "--v11-bp-package-count": section.products.length }}
                    >
                      <div className="v11_bp_pkg_cell v11_bp_pkg_header v11_bp_pkg_feature_label">
                        Compare
                      </div>
                      {section.products.map((product, index) => (
                        <div
                          key={`${product.name}-header`}
                          className="v11_bp_pkg_cell v11_bp_pkg_header v11_bp_pkg_name"
                          style={{ backgroundColor: packageColors[index % packageColors.length].bg }}
                        >
                          {product.name}
                        </div>
                      ))}

                      {allFeatures.map((feature, rowIdx) => (
                        <React.Fragment key={`${section.key}-${feature}`}>
                          <div className={`v11_bp_pkg_cell v11_bp_pkg_feature_label v11_bp_pkg_row_hover ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}>
                            <span className="v11_bp_pkg_feature_text">{feature}</span>
                          </div>
                          {section.products.map((product, productIdx) => {
                            const value = feature === "Price" ? product.price : product.features[feature];
                            const color = packageColors[productIdx % packageColors.length];

                            return (
                              <div
                                key={`${section.key}-${product.name}-${feature}`}
                                className={`v11_bp_pkg_cell v11_bp_pkg_value v11_bp_pkg_row_hover ${feature === "Price" ? "v11_bp_pkg_price_value" : ""} ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}
                                style={{ borderLeft: `2px solid ${color.border}` }}
                              >
                                {!value ? (
                                  <span className="v11_bp_pkg_na">&mdash;</span>
                                ) : isIncludedValue(value) ? (
                                  <span className="v11_bp_pkg_check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </span>
                                ) : isExcludedValue(value) ? (
                                  <span className="v11_bp_pkg_na">&mdash;</span>
                                ) : (
                                  <span className="v11_bp_pkg_text">{value}</span>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}

                      <div className="v11_bp_pkg_cell v11_bp_pkg_feature_label">
                        <span className="v11_bp_pkg_feature_text">Get started</span>
                      </div>
                      {section.products.map((product, productIdx) => {
                        const ctaColor = packageColors[productIdx % packageColors.length];
                        const ctaHref = product.bookingUrl || bookingUrl;
                        return (
                          <div
                            key={`${section.key}-${product.name}-cta`}
                            className="v11_bp_pkg_cell v11_bp_pkg_value v11_bp_pkg_cta_cell"
                            style={{ borderLeft: `2px solid ${ctaColor.border}` }}
                          >
                            {ctaHref && (
                              <a
                                href={ctaHref}
                                className="v11_pricing_card_cta"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {section.key === "memberships" ? "Join Now" : "Book Now"}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              );
            })}

            {structuredPricing.attractions.items.length > 0 && (
              <div id="attractions" className="v11_pricing_category_block">
                <div className="v11_pricing_category_header">
                  <p className="v11_bp_packages_eyebrow">Attractions</p>
                  <h3>Add More Play</h3>
                </div>
                <div className={`v11_pricing_attraction_grid ${structuredPricing.attractions.items.length === 1 ? "v11_pricing_attraction_grid_single" : ""}`}>
                  {structuredPricing.attractions.items.map((item, index) => (
                    <article key={`${item.name}-${index}`} className="v11_pricing_attraction_card">
                      <div className="v11_pricing_attraction_media">
                        {item.image ? (
                          <AppImage
                            src={item.image}
                            alt={item.name}
                            width={480}
                            height={300}
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="v11_pricing_attraction_placeholder">{item.name.charAt(0)}</div>
                        )}
                      </div>
                      <div className="v11_pricing_attraction_body">
                        <h4>{item.name}</h4>
                        {item.description && <p>{item.description}</p>}
                        {item.price && <div className="v11_pricing_attraction_price">{item.price}</div>}
                        {estoreBase && (
                          <a href={estoreBase} target="_blank" rel="noopener noreferrer" className="v11_pricing_card_cta">
                            Add to Visit
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {!useStructuredPricing && pricingData?.table && (
        <section className="v11_bp_packages_section">
          <div className="v11_bp_container">
            <div className="v11_bp_packages_header">
              <p className="v11_bp_packages_eyebrow">Compare &amp; Choose</p>
              <h2 className="v11_bp_heading v11_bp_heading_light">
                {pricingData.table.title || "Pricing"}
                <span className="v11_bp_heading_accent_light"> &amp; Packages</span>
              </h2>
              <p className="v11_bp_packages_subtitle">
                Find the perfect package for your next adventure
              </p>
            </div>

            <div className="v11_bp_packages_table_wrap">
              {Object.entries(pricingData.table.categories).map(([categoryName, packages]) => {
                const packageNames = Object.keys(packages);
                const allFeaturesSet = new Set();
                Object.values(packages).forEach(packageData => {
                  Object.keys(packageData).forEach(feature => allFeaturesSet.add(feature));
                });
                const allFeatures = getOrderedFeatures(allFeaturesSet);

                return (
                  <div key={categoryName} className="mb-12">
                    <h3 className="text-center text-white font-black text-xl uppercase tracking-widest mb-6" style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}>
                      {categoryName}
                    </h3>

                    <div className="v11_pricing_card_grid">
                      {packageNames.map((name, i) => {
                        const packageData = packages[name] || {};
                        const price = getPackagePrice(packageData);
                        const details = getPackageDetails(packageData);
                        const color = packageColors[i % packageColors.length];

                        return (
                          <article key={`${categoryName}-${name}`} className="v11_pricing_play_card">
                            <div className="v11_pricing_card_bar" style={{ backgroundColor: color.bg }} />
                            <div className="v11_pricing_card_body">
                              {i === 0 && <span className="v11_pricing_card_badge">Popular</span>}
                              <h4 className="v11_pricing_card_title">{name}</h4>
                              {details.length > 0 && (
                                <ul className="v11_pricing_card_features">
                                  {details.slice(0, 3).map(([feature, value]) => (
                                    <li key={`${name}-${feature}`}>
                                      <span>{feature}</span>
                                      <strong>{value}</strong>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {price && <div className="v11_pricing_card_price">{price}</div>}
                              {estoreBase && (
                                <a href={estoreBase} className="v11_pricing_card_cta" target="_blank" rel="noopener noreferrer">
                                  Jump Now
                                </a>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div
                      className="v11_bp_pkg_grid"
                      style={{ "--v11-bp-package-count": packageNames.length }}
                    >
                      {/* Header row */}
                      <div className="v11_bp_pkg_cell v11_bp_pkg_header v11_bp_pkg_feature_label">
                        Features
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
                            <span className="v11_bp_pkg_feature_text">{feature}</span>
                          </div>
                          {packageNames.map((packageName, pkgIdx) => {
                            const value = packages[packageName][feature];
                            const color = packageColors[pkgIdx % packageColors.length];
                            return (
                              <div
                                key={`${feature}-${packageName}`}
                                className={`v11_bp_pkg_cell v11_bp_pkg_value v11_bp_pkg_row_hover ${feature.toLowerCase() === "price" ? "v11_bp_pkg_price_value" : ""} ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}
                                style={{ borderLeft: `2px solid ${color.border}` }}
                              >
                                {value === undefined || value === null ? (
                                  <span className="v11_bp_pkg_na">&mdash;</span>
                                ) : value === 'X' || value === 'âœ—' ? (
                                  <span className="v11_bp_pkg_cross">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </span>
                                ) : value === 'âœ“' || value === 'âœ”' ? (
                                  <span className="v11_bp_pkg_check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="v11_bp_pkg_text">{value}</span>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}

                      {estoreBase && (
                        <>
                          <div className="v11_bp_pkg_cell v11_bp_pkg_cta_label">
                            Book Online
                          </div>
                          {packageNames.map((packageName, pkgIdx) => {
                            const color = packageColors[pkgIdx % packageColors.length];
                            return (
                              <div key={`${packageName}-cta`} className="v11_bp_pkg_cell v11_bp_pkg_cta">
                                <a
                                  href={estoreBase}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="v11_bp_pkg_book_btn"
                                  style={{ backgroundColor: color.bg, color: pkgIdx === 0 ? "#0f172a" : "#fff" }}
                                >
                                  Jump Now
                                </a>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* No Pricing Data Message */}
      {!useStructuredPricing && !pricingData?.table && (
        <section className="v11_bp_packages_section">
          <div className="v11_bp_container">
            <div className="v11_bp_packages_header">
              <h2 className="v11_bp_heading v11_bp_heading_light">
                Pricing
                <span className="v11_bp_heading_accent_light"> Table</span>
              </h2>
            </div>
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">Pricing information is currently being updated.</p>
              <p className="text-white/50 text-base mt-3">
                Please contact us for the latest pricing details.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 5: FAQ
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <CommonFAQSection
        location_slug={location_slug}
        page="pricing-promos"
        eyebrow="Pricing FAQ"
        title="Before You"
        accent=" Book"
        subtitle="Quick answers about socks, waivers, spectators, taxes, and reservation changes."
      />

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 6: Blog
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {blogChildren.length > 0 && (
        <BlogSection
          blogs={blogChildren}
          location_slug={location_slug}
          currentCategory="pricing-promos"
        />
      )}
    </main>
  );
};

export default page;

