import { Button } from "@/components/ui/button";
import Link from "next/link";

const PlanVisitSection = ({ seosection, locationSlug, estoreConfig }) => {
	if (!seosection) return null;

	return (
		<section style={styles.planVisitSection}>
			{/* Responsive diagonal background with clip-path */}
			<div style={styles.planVisitDiagonalBg}></div>

			<div style={styles.planContentWrapper}>
				{/* Section Header */}
				<div style={styles.planHeader}>
					<div style={styles.planBadge}>
						<span>✨ Plan Your Visit</span>
					</div>
					<h2 style={styles.planTitle}>
						Ready For
						<br />
						<span style={styles.planTitleAccent}>AeroSports?</span>
					</h2>
					<p style={styles.planSubtitle}>
						Searching for indoor activities? Look no further! AeroSports is
						the best place for indoor fun, whether you&apos;re planning an
						unforgettable kids&apos; birthday party, a family outing, or an
						exciting group event.
					</p>

					<div style={styles.planButtonGroup}>
						<Button variant="accent" size="md" asChild>
							<Link href={`/${locationSlug}/pricing-promos`}>View Pricing & Promos</Link>
						</Button>
						{estoreConfig?.value && (
							<Button variant="accentOutline" size="md" asChild>
								<a href={estoreConfig.value} target="_blank">
									Buy Your Tickets
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

const styles = {
	planVisitSection: {
		position: "relative",
		background: "#000000",
		padding: "2rem 0 0rem",
		overflow: "hidden",
	},
	planVisitDiagonalBg: {
		position: "absolute",
		top: "-5rem",
		left: 0,
		right: 0,
		height: "25rem",
		// background: "linear-gradient(135deg, #ff1152 0%, #ff4d7d 100%)",
		// clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)",
		zIndex: 0,
	},
	planContentWrapper: {
		position: "relative",
		zIndex: 1,
		maxWidth: "1400px",
		margin: "0 auto",
		padding: "0 2rem",
	},
	planHeader: {
		marginBottom: "3.75rem",
		maxWidth: "50rem",
	},
	planBadge: {
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
	planTitle: {
		fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
		fontWeight: "900",
		textTransform: "uppercase",
		lineHeight: "0.95",
		marginBottom: "1.5rem",
		color: "#ffffff",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	planTitleAccent: {
		color: "#39FF14",
	},
	planSubtitle: {
		fontSize: "1.1rem",
		color: "rgba(255, 255, 255, 0.8)",
		lineHeight: "1.7",
		fontWeight: "700",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		marginBottom: "2rem",
	},
	planButtonGroup: {
		display: "flex",
		gap: "1rem",
		flexWrap: "wrap",
	},
};

export default PlanVisitSection;
