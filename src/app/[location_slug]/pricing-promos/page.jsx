import React from "react";
import "../../styles/subcategory.css";
import "../../styles/kidsparty.css";
import MotionImage from "@/components/MotionImage";

import { getWaiverLink, fetchPageData, generateMetadataLib, generateSchema, fetchPricingTableData } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: 'pricing-promos'
  });
  return metadata;
}

const page = async ({ params }) => {
  const { location_slug } = params;
  const [memberData, waiverLink, locationData, pricingData] = await Promise.all([
    fetchPageData(location_slug, 'pricing-promos'),
    getWaiverLink(location_slug),
    fetchPageData(location_slug, 'home'),
    fetchPricingTableData(location_slug),
  ]);

  const jsonLDschema = await generateSchema(memberData, locationData, '', 'pricing-promos');

  // Safely prepare header and footer HTML - ensure they're always strings
  let headerHTML = '';
  let footerHTML = '';

  if (pricingData && pricingData.header && typeof pricingData.header === 'string') {
    headerHTML = pricingData.header;
  }

  if (pricingData && pricingData.footer && typeof pricingData.footer === 'string') {
    footerHTML = pricingData.footer.replace(/\n/g, '<br />');
  }

  return (
    <main>
      <section>
        <MotionImage pageData={memberData} waiverLink={waiverLink} locationData={locationData} />
      </section>

      <section className="subcategory_main_section-bg aero_bp_main_bg">
        {/* Decorative Background Graphics */}
        <div className="aero_bp_decorative_bg">
          <div className="aero_bp_confetti aero_bp_confetti_1"></div>
          <div className="aero_bp_confetti aero_bp_confetti_2"></div>
          <div className="aero_bp_confetti aero_bp_confetti_3"></div>
          <div className="aero_bp_confetti aero_bp_confetti_4"></div>
          <div className="aero_bp_confetti aero_bp_confetti_5"></div>
          <div className="aero_bp_confetti aero_bp_confetti_6"></div>

          <div className="aero_bp_circle_decoration aero_bp_circle_1"></div>
          <div className="aero_bp_circle_decoration aero_bp_circle_2"></div>
          <div className="aero_bp_circle_decoration aero_bp_circle_3"></div>

          <div className="aero_bp_star_decoration aero_bp_star_1">★</div>
          <div className="aero_bp_star_decoration aero_bp_star_2">★</div>
          <div className="aero_bp_star_decoration aero_bp_star_3">★</div>
          <div className="aero_bp_star_decoration aero_bp_star_4">★</div>
        </div>

        <section className="aero-max-container">
          {/* Header Section */}
          {headerHTML && (
            <div className="aero_bp_title_wrapper">
              <div className="aero_bp_title_floating_bg">
                <div className="aero_bp_float_emoji" style={{ top: '8%', left: '5%', animationDelay: '0s' }}>💰</div>
                <div className="aero_bp_float_emoji" style={{ top: '15%', right: '10%', animationDelay: '2s' }}>🎟️</div>
                <div className="aero_bp_float_emoji" style={{ top: '25%', left: '8%', animationDelay: '4s' }}>🎉</div>
                <div className="aero_bp_float_emoji" style={{ top: '35%', right: '5%', animationDelay: '1s' }}>⭐</div>
                <div className="aero_bp_float_emoji" style={{ top: '50%', left: '3%', animationDelay: '2.5s' }}>🎪</div>
                <div className="aero_bp_float_emoji" style={{ bottom: '30%', left: '12%', animationDelay: '3s' }}>🦘</div>
                <div className="aero_bp_float_emoji" style={{ bottom: '20%', right: '15%', animationDelay: '5s' }}>🌟</div>
                <div className="aero_bp_float_emoji" style={{ top: '60%', right: '8%', animationDelay: '1.5s' }}>🎊</div>
              </div>

              <div className="aero_bp_gradient_orb aero_bp_gradient_orb_1"></div>
              <div className="aero_bp_gradient_orb aero_bp_gradient_orb_2"></div>
              <div className="aero_bp_gradient_orb aero_bp_gradient_orb_3"></div>

              <div className="aero_bp_title_content">
                <div
                  className="aero_bp_title_description"
                  dangerouslySetInnerHTML={{ __html: headerHTML }}
                />
              </div>
            </div>
          )}

          {/* Pricing Table */}
          {pricingData?.table && (
            <article className="aero_bp_pricing_table_wrapper">
              <div className="aero_bp_section_header">
                <div className="aero_bp_section_icon">🎯</div>
                <h3 className="aero_bp_section_title">{pricingData.table.title}</h3>
              </div>

              <div className="aero_bp_pricing_table_container">
                {Object.entries(pricingData.table.categories).map(([categoryName, packages]) => {
                  const packageNames = Object.keys(packages);
                  const allFeaturesSet = new Set();

                  // Collect all unique features
                  Object.values(packages).forEach(packageData => {
                    Object.keys(packageData).forEach(feature => allFeaturesSet.add(feature));
                  });

                  const allFeatures = Array.from(allFeaturesSet);

                  return (
                    <div key={categoryName} style={{ marginBottom: '3em' }}>
                      <h4 className="aero_bp_section_subtitle" style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '1.5em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {categoryName}
                      </h4>

                      <div
                        className="aero_bp_grid_table"
                        style={{
                          gridTemplateColumns: `minmax(200px, 1fr) repeat(${packageNames.length}, minmax(150px, 1fr))`
                        }}
                      >
                        {/* Header Row */}
                        <div className="aero_bp_grid_header aero_bp_grid_header_feature">
                          FEATURES
                        </div>
                        {packageNames.map((packageName, index) => (
                          <div
                            key={packageName}
                            className="aero_bp_grid_header aero_bp_grid_header_package"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {packageName}
                          </div>
                        ))}

                        {/* Data Rows */}
                        {allFeatures.map((feature, rowIndex) => (
                          <React.Fragment key={feature}>
                            {/* Feature Name Cell */}
                            <div
                              className="aero_bp_grid_cell aero_bp_grid_cell_feature"
                              style={{ animationDelay: `${rowIndex * 0.05}s` }}
                            >
                              {feature}
                            </div>

                            {/* Package Value Cells */}
                            {packageNames.map((packageName) => {
                              const value = packages[packageName][feature];

                              return (
                                <div
                                  key={`${feature}-${packageName}`}
                                  className="aero_bp_grid_cell aero_bp_grid_cell_value"
                                  style={{ animationDelay: `${rowIndex * 0.05}s` }}
                                >
                                  {value === undefined || value === null ? (
                                    <span className="aero_bp_na">—</span>
                                  ) : value === 'X' || value === '✗' ? (
                                    <span className="aero_bp_cross">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                      </svg>
                                    </span>
                                  ) : value === '✓' || value === '✔' ? (
                                    <span className="aero_bp_check">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </span>
                                  ) : (
                                    <span className="aero_bp_text_value">{value}</span>
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
            </article>
          )}

          {/* Footer Section */}
          {footerHTML && (
            <div className="aero_bp_location_description">
              <div
                dangerouslySetInnerHTML={{ __html: footerHTML }}
              />
            </div>
          )}
        </section>
      </section>

      {jsonLDschema && (
        <script type="application/ld+json" suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonLDschema }}
        />
      )}
    </main>
  );
};

export default page;
