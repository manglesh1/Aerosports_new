import { sanitizeCmsHtml } from "@/utils/customFunctions";

const SEOSection = ({ locationData, locationSlug, estoreConfig, seosection }) => {
	if (!seosection) return null;

	return (
		<section className="v11_bp_intro_section" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
			<div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
				{/* Left Side - CMS Content */}
				<div
					className="flex flex-col gap-4 [&_h1]:text-[clamp(2rem,5vw,3rem)] [&_h1]:font-black [&_h1]:uppercase [&_h1]:leading-[1.15] [&_h1]:text-[#0f172a] [&_h2]:text-[clamp(1.5rem,4vw,2.2rem)] [&_h2]:font-black [&_h2]:uppercase [&_h2]:leading-[1.15] [&_h2]:text-[#0f172a] [&_p]:text-[#475569] [&_p]:leading-[1.8] [&_p]:text-base [&_strong]:text-[#c8ff00] [&_strong]:font-bold"
					style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}
					dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(seosection) }}
				/>

				{/* Right Side - Map & Location Info */}
				<div>
					<div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#e2e8f0]">
						<div className="p-6 pb-4">
							<h2
								className="text-xl font-black text-[#0f172a] uppercase tracking-[1px] mb-4"
								style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)" }}
							>
								Where are we located?
							</h2>
						</div>
						<div className="px-6">
							<div className="rounded-xl overflow-hidden mb-4">
								<iframe
									src={`https://maps.google.com/maps?width=720&height=600&hl=en&q=Aerosports+${locationData?.[0]?.location}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
									title={`AeroSports ${locationData?.[0]?.location || ''} location map`}
									loading="lazy"
									className="w-full h-[350px] border-none"
								/>
							</div>
						</div>
						<div className="px-6 pb-6">
							<p className="text-base font-bold text-[#c8ff00] mb-1">
								{locationData?.[0]?.address || "Visit our location"}
							</p>
							<p className="text-sm text-[#64748b] leading-relaxed">
								We have locations all over Ontario. You can find your
								local park using our park locator on our website.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SEOSection;
