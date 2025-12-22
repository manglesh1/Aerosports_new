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

									// Brand color palette for packages
									const packageColors = [
										{ bg: '#FF1152', bgLight: 'rgba(255, 17, 82, 0.25)', border: '#FF1152', glow: 'rgba(255, 17, 82, 0.6)' }, // Neon Pink
										{ bg: '#39FF14', bgLight: 'rgba(57, 255, 20, 0.25)', border: '#39FF14', glow: 'rgba(57, 255, 20, 0.6)' }, // Neon Green
										{ bg: '#9D4EDD', bgLight: 'rgba(157, 78, 221, 0.25)', border: '#9D4EDD', glow: 'rgba(157, 78, 221, 0.6)' }, // Neon Purple
										{ bg: '#00D9FF', bgLight: 'rgba(0, 217, 255, 0.25)', border: '#00D9FF', glow: 'rgba(0, 217, 255, 0.6)' }, // Neon Blue
										{ bg: '#FF6B35', bgLight: 'rgba(255, 107, 53, 0.25)', border: '#FF6B35', glow: 'rgba(255, 107, 53, 0.6)' }, // Neon Orange
										{ bg: '#F00C74', bgLight: 'rgba(240, 12, 116, 0.25)', border: '#F00C74', glow: 'rgba(240, 12, 116, 0.6)' }, // Neon Pink Dark
										{ bg: '#CAFF1A', bgLight: 'rgba(202, 255, 26, 0.25)', border: '#CAFF1A', glow: 'rgba(202, 255, 26, 0.6)' }, // Neon Green Bright
									];

									// Assign colors to packages
									const getPackageColor = (index) => packageColors[index % packageColors.length];

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
											{packageNames.map((packageName, index) => {
												const color = getPackageColor(index);
												return (
													<div
														key={packageName}
														className="[-webkit-font-smoothing:antialiased] font-black text-white text-base uppercase tracking-wide aero_bp_grid_header aero_bp_grid_header_package [text-rendering:geometricPrecision]"
														style={{
															animationDelay: `${index * 0.1}s`,
															background: `linear-gradient(135deg, ${color.bgLight} 0%, rgba(0, 0, 0, 0.3) 100%)`,
															borderBottom: `4px solid ${color.border}`,
															borderRight: `2px solid ${color.border}`,
															boxShadow: `0 0 20px ${color.glow}`,
														}}
													>
														{packageName}
													</div>
												);
											})}

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
													{packageNames.map((packageName, pkgIndex) => {
														const value = birthdayPartyJson.party_packages[packageName][feature];
														const color = getPackageColor(pkgIndex);

														return (
															<div
																key={`${feature}-${packageName}`}
																className="[-webkit-font-smoothing:antialiased] font-semibold text-[0.95rem] text-white/80 aero_bp_grid_cell aero_bp_grid_cell_value [text-rendering:geometricPrecision]"
																style={{
																	animationDelay: `${rowIndex * 0.05}s`,
																	borderRight: `1px solid ${color.border}30`,
																	background: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, ${color.bgLight}15 100%)`,
																}}
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
								<div className="mt-8 text-center">
									<a
										href={locData.birthdaypartyurl}
										target="_blank"
										className="inline-block bg-neon-green hover:bg-neon-green/90 px-8 py-4 rounded-xl font-extrabold text-black text-base uppercase tracking-wider hover:scale-105 transition-all duration-300"
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
				<div className="mb-16">
					<h3 className="mb-6 [-webkit-font-smoothing:antialiased] font-black text-[clamp(1.8rem,5vw,2.5rem)] text-white text-center uppercase [text-rendering:geometricPrecision]">
						Plan Your Birthday Celebration Today!
					</h3>

					<p className="mx-auto mb-8 max-w-[900px] font-semibold text-white/80 text-lg text-center leading-relaxed">
						Planning a birthday celebration at AeroSports is easy! Choose your package and let our event planners handle the details. With various options tailored to different age groups, we ensure every child has a fantastic time.
					</p>

					<div className="gap-6 sm:gap-8 grid grid-cols-1 sm:grid-cols-2 mt-8">
						{/* Contact Info */}
						<div className="bg-white/5 shadow-[0_15px_50px_rgba(0,0,0,0.4)] p-8 border-2 border-white/10 rounded-2xl text-center">
							<div className="mb-4 text-5xl">📞</div>
							<h4 className="mb-4 font-black text-white text-xl uppercase tracking-wide">Contact Us</h4>
							<p className="mb-2 font-bold text-neon-pink text-2xl">{locData.phone}</p>
							<p className="font-semibold text-white/60 text-sm">Call us directly to book your event!</p>
						</div>

						{/* Location */}
						<div className="bg-white/5 shadow-[0_15px_50px_rgba(0,0,0,0.4)] p-8 border-2 border-white/10 rounded-2xl text-center">
							<div className="mb-4 text-5xl">📍</div>
							<h4 className="mb-4 font-black text-white text-xl uppercase tracking-wide">Find Us At</h4>
							<p className="font-semibold text-neon-green text-lg leading-relaxed">{locData.address}</p>
						</div>
					</div>

					{/* Birthday Invitation Button */}
					{locData.birthdaypartyurl && (
						<div className="flex justify-center mt-12">
							<Button variant="primary" size="lg" asChild>
								<a href={locData.birthdayurlz} target="_blank">
									Book Your Party
								</a>
							</Button>
						</div>
					)}
				</div>
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
