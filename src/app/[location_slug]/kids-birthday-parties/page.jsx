import React, { Children } from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import { fetchsheetdata, fetchPageData, generateMetadataLib, fetchMenuData, getWaiverLink, generateSchema, fetchBirthdayPartyJson } from "@/lib/sheets";
import MotionImage from "@/components/MotionImage";
import TermsModal from "@/components/TermsModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
		fetchPageData(location_slug, 'kids-birthday-parties'),
		fetchsheetdata('birthday packages', location_slug),
		fetchBirthdayPartyJson(location_slug),
		fetchMenuData(location_slug),
		getWaiverLink(location_slug),
		fetchsheetdata('locations', location_slug),
	]);
	const attractions = menudata?.filter((item) => item.path == "attractions")[0];
	const jsonLDschema = await generateSchema(data, locationData, '', "kids-birthday-parties");
	const pageData = data;
		 const locData = locationData[0];
  const toTelHref = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "tel:";
    // North America: add +1 if missing, keep leading 1 if present
    const e164 =
      digits.length === 11 && digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;
    return `tel:${e164}`;
  };
	return (
		<main>

			<MotionImage pageData={data} waiverLink={waiverLink} locationData={locationData} />


			<section className="subcategory_main_section-bg aero_bp_main_bg">

				<section className="aero-max-container">

					{/* <div
              dangerouslySetInnerHTML={{ __html: pageData?.section1 || "" }}
            /> */}
            
						

					{birthdayPartyJson?.party_packages ? (
						<article className="aero_bp_pricing_table_wrapper">
							<div className="aero_bp_section_header">
								<h3 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'rgb(255, 255, 255)', marginBottom: '1.5rem', textAlign: 'center', textRendering: 'geometricPrecision', WebkitFontSmoothing: 'antialiased' }}>
									Pick the Perfect Party
								</h3>
								<p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7, fontWeight: 600, margin: '0 auto 2rem', textAlign: 'center', maxWidth: '900px' }}>
									Choose the perfect party experience for your celebration
								</p>
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
											className="bg-white/5 shadow-[0_15px_50px_rgba(0,0,0,0.4)] border-2 border-white/10 rounded-2xl overflow-hidden aero_bp_grid_table"
											style={{
												gridTemplateColumns: `minmax(200px, 1fr) repeat(${packageNames.length}, minmax(150px, 1fr))`
											}}
										>
											{/* Header Row */}
											<div className="[-webkit-font-smoothing:antialiased] font-black text-white text-base uppercase tracking-wide aero_bp_grid_header aero_bp_grid_header_feature [text-rendering:geometricPrecision]">
												FEATURES
											</div>
											{packageNames.map((packageName, index) => (
												<div
													key={packageName}
													className="[-webkit-font-smoothing:antialiased] font-black text-white text-base uppercase tracking-wide aero_bp_grid_header aero_bp_grid_header_package [text-rendering:geometricPrecision]"
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
														className="[-webkit-font-smoothing:antialiased] font-bold text-[0.95rem] text-white/90 aero_bp_grid_cell aero_bp_grid_cell_feature [text-rendering:geometricPrecision]"
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
																className="[-webkit-font-smoothing:antialiased] font-semibold text-[0.95rem] text-white/80 aero_bp_grid_cell aero_bp_grid_cell_value [text-rendering:geometricPrecision]"
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

							{/* View Packages Detail Button */}
							{pageData?.section2 && (
								<TermsModal
									content={pageData.section2}
									buttonText="View Packages Detail"
									title="Package Details"
									showAsButton={true}
								/>
							)}

							{/* Birthday Invitation Button */}
							{locData.birthdaypartyurl && (
								<div className="text-center mt-8">
									<a
										href={locData.birthdaypartyurl}
										target="_blank"
										className="inline-block bg-neon-green hover:bg-neon-green/90 px-8 py-4 rounded-xl font-extrabold text-black text-base uppercase tracking-wider transition-all duration-300 hover:scale-105"
									>
										Generate Your Custom Birthday Invitation
									</a>
								</div>
							)}
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
<div
              dangerouslySetInnerHTML={{ __html: pageData?.seosection || "" }}
            />
				</section>
			</section>
			  <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLDschema }}
      />
		</main>
	);
};

export default Page;
