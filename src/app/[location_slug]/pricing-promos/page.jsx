import React from "react";
import { Roboto_Condensed } from "next/font/google";
import "../../styles/subcategory.css";
import "../../styles/kidsparty.css";
import BlogSection from "@/components/sections/BlogSection";
import { generateMetadataLib, fetchPricingTableData, fetchPageData, fetchsheetdata, fetchMenuData } from "@/lib/sheets";
import { getDataByParentId, sanitizeCmsHtml } from "@/utils/customFunctions";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export async function generateMetadata({ params }) {
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
  const { location_slug } = params;

  const [pricingData, , promotions, menuData] = await Promise.all([
    fetchPricingTableData(location_slug),
    fetchPageData(location_slug, 'home'),
    fetchsheetdata("promotions", location_slug),
    fetchMenuData(location_slug),
  ]);
  const blogsData = getDataByParentId(menuData, "blogs");
  const blogChildren = blogsData?.[0]?.children || [];

  let headerHTML = '';
  let footerHTML = '';

  if (pricingData && pricingData.header && typeof pricingData.header === 'string') {
    headerHTML = pricingData.header;
  }

  if (pricingData && pricingData.footer && typeof pricingData.footer === 'string') {
    footerHTML = pricingData.footer.replace(/\n/g, '<br />');
  }

  // Package column accent colors (matching v11 birthday party design)
  const packageColors = [
    { bg: "#c8ff00", light: "rgba(255, 23, 74, 0.06)", border: "rgba(255, 23, 74, 0.2)" },
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
      <section className="relative bg-[#0a0a1a] overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-[20%] -right-[10%] w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(255, 17, 74, 0.1)", filter: "blur(90px)" }} />
        <div className="absolute -bottom-[20%] -left-[10%] w-80 h-80 rounded-full pointer-events-none" style={{ background: "rgba(59, 130, 246, 0.05)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-xs font-black text-[#c8ff00] uppercase tracking-[3px] mb-3">
            Value & Savings
          </p>
          <h1 className="v11_bp_heading v11_bp_heading_light" style={{ fontStyle: "italic", fontSize: "clamp(2.5rem, 7vw, 4rem)", marginBottom: "1.5rem" }}>
            Pricing &amp;
            <span className="v11_bp_heading_accent_light"> Promotions</span>
          </h1>
          <p className="text-base text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
            Don&apos;t miss out on our special deals designed to bring more fun, more value,
            and unforgettable experiences for everyone.
          </p>
        </div>
      </section>

      <div className="v11_bp_wrapper">
        {/* ══════════════════════════════════════════════
            SECTION 2: Promotions Grid
            ══════════════════════════════════════════════ */}
        {promotions && promotions.length > 0 && (
          <section className="py-16 md:py-20 px-4">
            <div className="v11_bp_container">
              <div className="text-center mb-12">
                <p className="v11_bp_packages_eyebrow" style={{ color: "#c8ff00" }}>Limited-Time Offers</p>
                <h2 className="v11_bp_heading">
                  Exclusive
                  <span className="v11_bp_heading_accent"> Promotions</span>
                </h2>
                <p className="v11_bp_subtext">
                  Grab these deals before they&apos;re gone — more fun, more savings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo, index) => (
                  <article
                    key={index}
                    className="relative bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:border-[#c8ff00]/30"
                  >
                    {/* Top accent bar */}
                    <div className="h-1" style={{ background: packageColors[index % packageColors.length].bg }} />

                    <div className="p-6 md:p-8">
                      {/* Badge */}
                      {promo.badge && (
                        <span className="inline-block bg-[#c8ff00] text-white text-[0.65rem] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                          {promo.badge}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}>
                        {promo.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[#64748b] leading-relaxed mb-5">
                        {promo.description}
                      </p>

                      {/* Details */}
                      <div className="flex flex-col gap-1.5 mb-6 text-sm">
                        <time className="text-[#475569] font-semibold">{promo.validity}</time>
                        {promo.code && (
                          <span className="text-[#c8ff00] font-bold uppercase tracking-wide">
                            Code: {promo.code}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <a
                        href={promo.link}
                        className="block w-full text-center bg-[#c8ff00] hover:bg-[#cc0e3e] text-white text-sm font-black uppercase tracking-wider px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,23,74,0.3)]"
                      >
                        {promo.linktext}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            SECTION 3: Header CMS Content (Info)
            ══════════════════════════════════════════════ */}
        {headerHTML && (
          <section className="v11_bp_intro_section">
            <div className="v11_bp_container">
              <div
                className="v11_bp_intro_text"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(headerHTML) }}
              />
            </div>
          </section>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 4: Pricing Table (Dark Navy)
          ══════════════════════════════════════════════ */}
      {pricingData?.table && (
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
                const allFeatures = Array.from(allFeaturesSet);

                return (
                  <div key={categoryName} className="mb-12">
                    <h3 className="text-center text-white font-black text-xl uppercase tracking-widest mb-6" style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}>
                      {categoryName}
                    </h3>

                    <div
                      className="v11_bp_pkg_grid"
                      style={{
                        gridTemplateColumns: `minmax(180px, 1.2fr) repeat(${packageNames.length}, minmax(130px, 1fr))`,
                      }}
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
                                className={`v11_bp_pkg_cell v11_bp_pkg_value v11_bp_pkg_row_hover ${rowIdx % 2 === 0 ? "v11_bp_pkg_row_alt" : ""}`}
                                style={{ borderLeft: `2px solid ${color.border}` }}
                              >
                                {value === undefined || value === null ? (
                                  <span className="v11_bp_pkg_na">&mdash;</span>
                                ) : value === 'X' || value === '✗' ? (
                                  <span className="v11_bp_pkg_cross">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </span>
                                ) : value === '✓' || value === '✔' ? (
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* No Pricing Data Message */}
      {!pricingData?.table && (
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

      {/* ══════════════════════════════════════════════
          SECTION 5: Footer CMS Content
          ══════════════════════════════════════════════ */}
      {footerHTML && (
        <div className="v11_bp_wrapper">
          <section className="v11_bp_intro_section" style={{ paddingBottom: "4rem" }}>
            <div className="v11_bp_container">
              <div
                className="v11_bp_intro_text"
                style={{ textAlign: "left" }}
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(footerHTML) }}
              />
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 6: Blog
          ══════════════════════════════════════════════ */}
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
