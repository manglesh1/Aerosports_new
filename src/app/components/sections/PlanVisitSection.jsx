import Link from "next/link";

const PlanVisitSection = ({ seosection, locationSlug, estoreConfig }) => {
	if (!seosection) return null;

	return (
		<section className="v11_bp_cta_section">
			<div className="v11_bp_container">
				<div className="v11_bp_cta_card">
					{/* Decorative background */}
					<div className="v11_bp_cta_decor">
						<div className="v11_bp_cta_glow_orange" />
						<div className="v11_bp_cta_glow_blue" />
						<div className="v11_bp_cta_ring" />
					</div>

					<p className="v11_bp_cta_eyebrow">Plan Your Visit</p>
					<h2 className="v11_bp_cta_heading">
						Ready For<br />
						<span className="v11_bp_heading_accent_light">AeroSports?</span>
					</h2>
					<p className="v11_bp_cta_desc">
						Searching for indoor activities? Look no further! AeroSports is
						the best place for indoor fun, whether you&apos;re planning an
						unforgettable kids&apos; birthday party, a family outing, or an
						exciting group event.
					</p>

					<div className="v11_bp_cta_buttons">
						<Link href={`/${locationSlug}/pricing-promos`} className="v11_bp_cta_btn v11_bp_cta_btn_call">
							View Pricing &amp; Promos
						</Link>
						{estoreConfig?.value && (
							<a href={estoreConfig.value} target="_blank" rel="noopener noreferrer" className="v11_bp_cta_btn v11_bp_cta_btn_book">
								Buy Your Tickets →
							</a>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default PlanVisitSection;
