import React, { Children } from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";

import ImageMarquee from "@/components/ImageMarquee";
import { fetchsheetdata,  fetchPageData,generateMetadataLib, fetchMenuData,getWaiverLink,generateSchema, fetchBirthdayPartyJson } from "@/lib/sheets";
import FaqCard from "@/components/smallComponents/FaqCard"
import SubCategoryCard from "@/components/smallComponents/SubCategoryCard"
import MotionImage from "@/components/MotionImage";
export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: '',
    page: "kids-birthday-parties"
  });
  return metadata;
}

const Page = async ({ params }) => {
  const location_slug = params.location_slug;

  const [data, birthdaydata, birthdayPartyJson, menudata, waiverLink, locationData] = await Promise.all([
     fetchPageData(location_slug,'kids-birthday-parties'),
     fetchsheetdata('birthday packages',location_slug),
     fetchBirthdayPartyJson(location_slug),
     fetchMenuData(location_slug),
     getWaiverLink(location_slug),
      fetchsheetdata('locations',location_slug),
  ]);
  const attractions = menudata?.filter((item)=> item.path=="attractions")[0];
  const jsonLDschema = await generateSchema(data,locationData,'',"kids-birthday-parties");
  return (
    <main >
     
        <MotionImage pageData={data} waiverLink={waiverLink} locationData={locationData}/>
     
    
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

        {/* Animated Title Section */}
        <div className="aero_bp_title_wrapper">
          <div className="aero_bp_title_floating_bg">
            <div className="aero_bp_float_emoji" style={{top: '8%', left: '5%', animationDelay: '0s'}}>🎂</div>
            <div className="aero_bp_float_emoji" style={{top: '15%', right: '10%', animationDelay: '2s'}}>🎈</div>
            <div className="aero_bp_float_emoji" style={{top: '25%', left: '8%', animationDelay: '4s'}}>🎉</div>
            <div className="aero_bp_float_emoji" style={{top: '35%', right: '5%', animationDelay: '1s'}}>🎁</div>
            <div className="aero_bp_float_emoji" style={{top: '50%', left: '3%', animationDelay: '2.5s'}}>🎪</div>
            <div className="aero_bp_float_emoji" style={{bottom: '30%', left: '12%', animationDelay: '3s'}}>🦘</div>
            <div className="aero_bp_float_emoji" style={{bottom: '20%', right: '15%', animationDelay: '5s'}}>🌟</div>
            <div className="aero_bp_float_emoji" style={{top: '60%', right: '8%', animationDelay: '1.5s'}}>🎊</div>
          </div>

          <div className="aero_bp_gradient_orb aero_bp_gradient_orb_1"></div>
          <div className="aero_bp_gradient_orb aero_bp_gradient_orb_2"></div>
          <div className="aero_bp_gradient_orb aero_bp_gradient_orb_3"></div>

          <div className="aero_bp_title_content">
            <div className="aero_bp_title_badge">
              <span>🎂 ULTIMATE BIRTHDAY EXPERIENCE</span>
            </div>
            <h2 className="aero_bp_gradient_title">
              <span className="aero_bp_title_glitch" data-text="Birthday Party">Birthday Party</span>
              <br />
              Packages & Pricing
            </h2>
            {birthdayPartyJson?.location && (
              <p className="aero_bp_title_description">{birthdayPartyJson.location.description}</p>
            )}
            {!birthdayPartyJson && (
              <p className="aero_bp_title_description">
                At AeroSports {location_slug}, we offer competitively priced birthday party packages in our private party rooms—perfectly located near you. Choose the package that fits your budget and guest list:
              </p>
            )}
          </div>
        </div>

          {birthdayPartyJson?.party_packages ? (
            <article className="aero_bp_pricing_table_wrapper">
              <div className="aero_bp_section_header">
                <div className="aero_bp_section_icon">🎯</div>
                <h3 className="aero_bp_section_title">Compare Our Packages</h3>
                <p className="aero_bp_section_subtitle">Choose the perfect party experience for your celebration</p>
              </div>

              <div className="aero_bp_pricing_table_container">
                {(() => {
                  // Get package names
                  const packageNames = Object.keys(birthdayPartyJson.party_packages);

                  // Collect all unique features from all packages in a deterministic order
                  const allFeaturesSet = new Set();
                  const firstPackage = birthdayPartyJson.party_packages[packageNames[0]];

                  // First, add features from the first package to maintain order
                  if (firstPackage) {
                    Object.keys(firstPackage).forEach(feature => allFeaturesSet.add(feature));
                  }

                  // Then add any additional features from other packages
                  Object.values(birthdayPartyJson.party_packages).forEach(packageData => {
                    Object.keys(packageData).forEach(feature => allFeaturesSet.add(feature));
                  });

                  const allFeatures = Array.from(allFeaturesSet);

                  return (
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
                            const value = birthdayPartyJson.party_packages[packageName][feature];

                            return (
                              <div
                                key={`${feature}-${packageName}`}
                                className="aero_bp_grid_cell aero_bp_grid_cell_value"
                                style={{ animationDelay: `${rowIndex * 0.05}s` }}
                              >
                                {value === undefined || value === null ? (
                                  <span className="aero_bp_na">—</span>
                                ) : typeof value === 'boolean' ? (
                                  value ? (
                                    <span className="aero_bp_check">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </span>
                                  ) : (
                                    <span className="aero_bp_cross">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                      </svg>
                                    </span>
                                  )
                                ) : (
                                  <span className="aero_bp_text_value">{value}</span>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </article>
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
                    <h2 className="d-flex-center aero_bp_card_wrap_heading">
                      {item?.plantitle}
                    </h2>
                    <ul className="aero_bp_card_wrap_list">
                      {includedata?.map((item, i) => {
                        return <li key={i}>{item}</li>;
                      })}
                    </ul>
                  </div>
                );
              })}
            </article>
          )}
        </section>
      </section>
     
      
      {/* <SubCategoryCard attractionsData={attractions.children} location_slug={location_slug} theme={'default'} title={`Activities & Attractions`} text={[attractions.metadescription]} /> */}

        {/* <FaqCard page={'kids-birthday-parties'} location_slug={location_slug} /> */}
      
    
     
{/* <section className="aero_home_article_section">
        <section className="aero-max-container">
          <div
            className="subcategory_main_section"
            dangerouslySetInnerHTML={{ __html: data?.section1 || "" }}
          />
        </section>
      </section>
      <section className="aero_home_article_section">
        <section className="aero-max-container aero_home_seo_section">
          <div
            dangerouslySetInnerHTML={{ __html: data?.seosection || "" }}
          />
        </section>
      </section>
     <script type="application/ld+json" suppressHydrationWarning
  dangerouslySetInnerHTML={{ __html: jsonLDschema }}
/> */}
    </main>
  );
};

export default Page;
