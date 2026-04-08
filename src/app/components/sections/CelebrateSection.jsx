import Link from "next/link";

const CelebrateSection = ({ locationSlug }) => {
	const eventsList = [
		{
			title: "Team Building",
			image: `https://storage.googleapis.com/aerosports/webp/${locationSlug}/team-building-aerosports-trampoline-park.webp`,
			text: "Promote collaboration and problem-solving with our engaging team-based attractions.",
			href: "groups-events/corporate-parties-events-groups",
		},
		{
			title: "Birthday Parties",
			image: `https://storage.googleapis.com/aerosports/webp/${locationSlug}/celeberate-your-birthday-parties-at-aerosports.webp`,
			text: "All-inclusive packages with private room, host, pizza, and open-jump access.",
			href: "kids-birthday-parties",
		},
		{
			title: "Field Trips",
			image: `https://storage.googleapis.com/aerosports/webp/${locationSlug}/schools-field-trips-at-aerosports.webp`,
			text: "Special group rates for schools and educational organizations.",
			href: "groups-events/school-groups",
		},
	];

	return (
		<section className="v11_bp_packages_section" style={{ padding: "5rem 1rem" }}>
			<div className="v11_bp_container">
				{/* Section Header */}
				<div className="text-center mb-10">
					<p className="v11_bp_packages_eyebrow">Celebrate</p>
					<h2 className="v11_bp_heading v11_bp_heading_light">
						Elevate Your
						<span className="v11_bp_heading_accent_light"> Event</span>
					</h2>
					<p className="v11_bp_packages_subtitle">
						Turn any occasion into an unforgettable adventure at AeroSports
					</p>
				</div>

				{/* Events Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
					{eventsList.map((event, index) => (
						<Link
							key={index}
							href={`/${locationSlug}/${event.href}`}
							className="group block bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:border-[#FF174A]/30"
						>
							<div
								className="relative w-full h-[200px] sm:h-56 md:h-[200px] bg-cover bg-center overflow-hidden"
								style={{ backgroundImage: `url('${event.image}')` }}
								role="img"
								aria-label={event.title}
							>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
								<h3
									className="absolute bottom-4 left-4 font-black text-[1.2rem] text-white uppercase leading-[1.2] tracking-[1px]"
									style={{ fontFamily: "var(--font-roboto-condensed, 'Roboto Condensed', sans-serif)", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
								>
									{event.title}
								</h3>
							</div>
							<div className="p-5 md:p-6">
								<p className="text-white/60 text-sm leading-relaxed mb-4">
									{event.text}
								</p>
								<span className="inline-block text-[#FF174A] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
									More Info →
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default CelebrateSection;
