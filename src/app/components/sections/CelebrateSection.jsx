import "../../styles/attractions.css";
import Link from "next/link";

const CelebrateSection = ({ locationSlug }) => {
	const eventsList = [
  {
    title: "Team Building",
    image:
      `https://storage.googleapis.com/aerosports/webp/${locationSlug}/team-building-aerosports-trampoline-park.webp`,
    text: "Promote collaboration and problem-solving with our engaging team-based attractions.",
    href: "groups-events/corporate-parties-events-groups",
  },
  {
    title: "Birthday Parties",
    image:
      `https://storage.googleapis.com/aerosports/webp/${locationSlug}/celeberate-your-birthday-parties-at-aerosports.webp`,
    text: "All-inclusive packages with private room, host, pizza, and open-jump access.",
    href: "kids-birthday-parties",
  },
  {
    title: "Field Trips",
    image:
      `https://storage.googleapis.com/aerosports/webp/${locationSlug}/schools-field-trips-at-aerosports.webp`,
    text: "Special group rates for schools and educational organizations.",
    href: "groups-events/school-groups",
  },
	];
	
	return (
		<>
			
			<section style={styles.celebrateSection}>
			<div style={styles.celebrateContainer} >
				{/* Section Header */}
				<div style={styles.celebrateHeader}>
					<div style={styles.celebrateBadge}>
						<span>Celebrate</span>
					</div>
					<h2 style={styles.celebrateTitle}>
						Elevate Your{" "}
						<span style={styles.celebrateTitleAccent}>Event</span>
					</h2>
					<p style={styles.celebrateSubtitle}>
						Turn any occasion into an unforgettable adventure at AeroSports
					</p>
				</div>

				{/* Events Grid */}
				<div
				style={styles.celebrateGrid}
						className="gap-6 sm:gap-8 md:gap-10 lg:gap-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
						{eventsList.map((event, index) => <article key={index} className="flex flex-col shadow-[0_15px_50px_rgba(0,0,0,0.4)] hover:shadow-neon-pink-lg border-2 border-white hover:border-neon-pink-light rounded-xl h-full overflow-hidden transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)]">
						<div
							style={{
								backgroundImage: `url('${event.image}')`,
							}}
							className="relative flex justify-start items-end bg-cover bg-center p-4 w-full h-[200px] sm:h-56 md:h-[200px] event-card-image hover:"
							role="img"
							aria-label={event.title}
							>
							<h3 className="[webkit-font-smoothing:antialiased] font-black text-[1.3rem] text-white sm:text-base md:text-xl uppercase leading-[1.2] tracking-[1.2px] [text-shadow:0_2px_8px_rgba(0,0,0,0.3)] [text-rendering:geometricPrecision]">
								{event.title}
							</h3>
						</div>
						<div style={styles.eventCardBody} className="p-4 sm:p-5 md:p-8">
							<p style={styles.eventCardText}>
								{event.text}
							</p>
							<Link
								href={`/${locationSlug}/${event.href}`}
								className="aero_attraction_card_cta"
								style={{ width: "fit-content" }}
							>
								More Info
							</Link>
						</div>
					</article>)}

						
				</div>
			</div>
		</section>
		</>
	);
};

const styles = {
	celebrateSection: {
		background: "#000000",
		padding: "3rem 0",
		position: "relative",
		overflow: "hidden",
	},
	celebrateContainer: {
		maxWidth: "1400px",
		margin: "0 auto",
		padding: "0 2rem",
		position: "relative",
		zIndex: 1,
	},
	celebrateHeader: {
		textAlign: "center",
		marginBottom: "4rem",
		maxWidth: "800px",
		margin: "0 auto 4rem",
	},
	celebrateBadge: {
		display: "inline-block",
		background: "#39FF14",
		color: "#000000",
		padding: "0.6rem 1.5rem",
		borderRadius: "50px",
		fontSize: "0.75rem",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: "1.25px",
		marginBottom: "1.5rem",
	},
	celebrateTitle: {
		fontSize: "clamp(2.5rem, 8vw, 4rem)",
		fontWeight: "900",
		textTransform: "uppercase",
		lineHeight: "0.95",
		marginBottom: "1.5rem",
		color: "#ffffff",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	celebrateTitleAccent: {
		color: "#ff1152",
	},
	celebrateSubtitle: {
		fontSize: "1.1rem",
		color: "rgba(255, 255, 255, 0.8)",
		lineHeight: "1.7",
		fontWeight: "700",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	celebrateGrid: {
		animation: "fadeInUp 0.8s ease-out",
	},
	eventCard: {
		// background: "#ffffff",
		borderRadius: "1rem",
		overflow: "hidden",
		boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
		transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
		display: "flex",
		flexDirection: "column",
		border: "2px solid #39FF14",
	},
	eventCardImage: {
		width: "100%",
		height: "200px",
		backgroundSize: "cover",
		backgroundPosition: "center",
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		// color: "#ffffff",
		textAlign: "center",
		padding: "2rem",
		// backgroundBlendMode: "multiply",
	},
	eventCardTitle: {
		fontSize: "1.3rem",
		fontWeight: "900",
		textTransform: "uppercase",
		letterSpacing: "1.2px",
		color: "#ffffff",
		lineHeight: "1.2",
		textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	eventCardBody: {
		padding: "2rem",
		flex: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
	},
	eventCardText: {
		fontSize: "0.95rem",
		lineHeight: "1.7",
		color: "#ffffff",
		marginBottom: "1.5rem",
		flex: 1,
		fontWeight: "600",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	eventCardLink: {
		fontSize: "0.85rem",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: "1px",
		color: "#ff1152",
		textDecoration: "none",
		transition: "all 0.3s ease",
		display: "inline-block",
		padding: "0.5rem 0",
		position: "relative",
	},
};

export default CelebrateSection;
