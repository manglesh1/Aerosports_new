import "../../styles/seo-section.css";

const SEOSection = ({ locationData, locationSlug, estoreConfig, seosection }) => {
	if (!seosection) return null;

	return (
		<section style={styles.seoSection}>
			<div style={styles.diagonalBg} ></div>
			<div style={styles.diagonalBgLeft} className="seo-diagonal-bg-left"></div>

			<section style={styles.seoContainer} className="gap-6 md:gap-10 grid grid-cols-1 md:grid-cols-2">
				{/* Left Side - Content */}
				<div style={styles.seoLeft}>
					<div style={styles.seoContent}>
						<div style={styles.seoBadge}>
							<span>Ultimate Indoor Entertainment</span>
						</div>
						<h1 style={styles.seoTitle}>
							Discover <span style={styles.seoTitleAccent}>AeroSports</span>{" "}
							{locationData?.[0]?.location || "Oakville"}
						</h1>
						<p style={styles.seoSubtitle}>
							The Ultimate Indoor Trampoline Park & Family Entertainment
							Center
						</p>
					</div>

					<div style={styles.seoCard}>
						<p style={styles.seoText}>
							Welcome to{" "}
							<strong style={styles.seoHighlight}>
								AeroSports {locationData?.[0]?.location || "Oakville"}
							</strong>
							, the top choice for{" "}
							<strong style={styles.seoHighlight}>indoor activities</strong>
							. Our trampoline park spans over 27,000 square feet, providing
							endless fun for kids, teens, and adults. Perfect for family
							outings and solo adventurers alike, AeroSports offers an array
							of activities including{" "}
							<strong style={styles.seoHighlight}>
								wall-to-wall trampolines
							</strong>
							, thrilling{" "}
							<strong style={styles.seoHighlight}>climbing walls</strong>,
							and an exciting{" "}
							<strong style={styles.seoHighlight}>dodgeball arena</strong>.
						</p>
					</div>
				</div>

				{/* Right Side - Map & Location Info */}
				<div style={styles.seoRight}>
					<div style={styles.mapCard}>
						<h2 style={styles.locationTitle}>Where are we located?</h2>
						<div style={styles.mapContainer}>
							<iframe
								src={`https://maps.google.com/maps?width=720&height=600&hl=en&q=Aerosports+${locationData?.[0]?.location}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
								style={{
									width: "100%",
									height: "400px",
									border: "none",
									borderRadius: "0px",
								}}
							/>
						</div>
						<div style={styles.locationInfo}>
							<p style={styles.locationAddress}>
								<strong>
									{locationData?.[0]?.address || "Visit our location"}
								</strong>
							</p>
							<p style={styles.locationDescription}>
								We have locations all over Ontario. You can find your
								local park using our park locator on our website.
							</p>
						</div>
					</div>
				</div>
			</section>
		</section>
	);
};

const styles = {
	seoSection: {
		position: "relative",
		width: "100%",
		background: "#000000",
		overflow: "visible",
		padding: "0",
		margin: "0",
	},
	diagonalBg: {
		position: "absolute",
		top: 0,
		right: 0,
		width: "55%",
		height: "100%",
		background: "linear-gradient(135deg, #ff1152 0%, #ff0066 50%, #cc0052 100%)",
		clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0% 100%)",
		zIndex: 0,
	},
	diagonalBgLeft: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: "45%",
		height: "100%",
		// background: "linear-gradient(315deg, #ff1152 0%, #ff0066 50%, #cc0052 100%)",
		// clipPath: "polygon(0 0, 100% 100%, 0 100%)",
		zIndex: 0,
		opacity: 0.25,
	},
	seoContainer: {
		position: "relative",
		zIndex: 1,
		maxWidth: "1400px",
		margin: "0 auto",
		padding: "6rem 2rem",
		alignItems: "center",
		minHeight: "65vh",
	},
	seoLeft: {
		display: "flex",
		flexDirection: "column",
		gap: "2rem",
	},
	seoContent: {
		animation: "fadeInUp 1s ease-out",
	},
	seoBadge: {
		display: "inline-block",
		background: "transparent",
		border: "2px solid #39FF14",
		color: "#39FF14",
		padding: "0.8rem 1.8rem",
		borderRadius: "50px",
		fontSize: "0.85rem",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: "1px",
		marginBottom: "1rem",
		width: "fit-content",
	},
	seoTitle: {
		fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
		fontWeight: "900",
		textTransform: "uppercase",
		letterSpacing: "2px",
		lineHeight: "1.1",
		marginBottom: "1.5rem",
		color: "#ffffff",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	seoTitleAccent: {
		color: "#ff1152",
	},
	seoSubtitle: {
		fontSize: "1.1rem",
		color: "#e0e0e0",
		lineHeight: "1.8",
		fontWeight: "700",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	seoCard: {
		background: "rgba(255, 255, 255, 0.95)",
		color: "#000000",
		padding: "2rem",
		borderRadius: "12px",
		boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
		animation: "fadeInUp 1s ease-out 0.2s backwards",
	},
	seoText: {
		fontSize: "1rem",
		lineHeight: "1.8",
		color: "#000000",
		fontWeight: "600",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	seoHighlight: {
		color: "#ff1152",
		fontWeight: "700",
	},
	seoButtonGroup: {
		display: "flex",
		gap: "1rem",
		flexWrap: "wrap",
		animation: "fadeInUp 1s ease-out 0.4s backwards",
	},
	seoBtn: {
		padding: "1rem 2rem",
		fontSize: "0.95rem",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: "1px",
		border: "2px solid #ff1152",
		background: "#ff1152",
		color: "white",
		borderRadius: "8px",
		cursor: "pointer",
		textDecoration: "none",
		transition: "all 0.3s ease",
		display: "inline-block",
		boxShadow: "0 6px 20px rgba(255, 17, 82, 0.4)",
	},
	seoBtnSecondary: {
		background: "transparent",
		color: "#ff1152",
		border: "2px solid #ff1152",
	},
	seoRight: {
		animation: "slideInRight 1s ease-out",
	},
	mapCard: {
		background: "rgba(255, 255, 255, 0.95)",
		padding: "2rem",
		borderRadius: "12px",
		boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
	},
	locationTitle: {
		fontSize: "1.8rem",
		fontWeight: "900",
		color: "#000000",
		marginBottom: "1.5rem",
		textTransform: "uppercase",
		letterSpacing: "1px",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	mapContainer: {
		marginBottom: "1.5rem",
		borderRadius: "8px",
		overflow: "hidden",
	},
	locationInfo: {
		color: "#000000",
	},
	locationAddress: {
		fontSize: "1.1rem",
		color: "#ff1152",
		marginBottom: "0.5rem",
		fontWeight: "800",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	locationDescription: {
		fontSize: "0.95rem",
		color: "#666666",
		lineHeight: "1.6",
		fontWeight: "600",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
};

export default SEOSection;
