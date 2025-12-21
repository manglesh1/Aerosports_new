export default function BirthdayPartySection({ locationData }) {
	const phone = locationData?.[0]?.phone || "(905) 829-2989";
	const address = locationData?.[0]?.address || "2679 Bristol Cir, Oakville, ON L6H 6Z8";
	const location = locationData?.[0]?.location || "Oakville";

	return (
		<section style={styles.section}>
			<div style={styles.container}>
				{/* Section Header */}
				<div style={styles.header}>
					<div style={styles.badge}>
						<span>🎂 Ultimate Birthday Experience</span>
					</div>
					<h2 style={styles.title}>
						Kids&apos; Birthday Parties at <span style={styles.titleAccent}>AeroSports {location}</span>
					</h2>
					<p style={styles.subtitle}>
						Looking for the best place to celebrate your child&apos;s birthday? Look no further than AeroSports Trampoline Park {location}! Our facility offers an exhilarating environment where kids can jump, play, and enjoy their special day. We proudly serve families in Oakville, Mississauga, Brampton, Burlington, Etobicoke, Toronto, Georgetown, Milton, and surrounding areas, making us a top choice for birthday celebrations in the Greater Toronto Area (GTA).
					</p>
				</div>

				{/* Why Choose Us Section */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>
						Why Choose Us for Your Kids&apos; Birthday Party?
					</h3>

					<p style={styles.introText}>
						At AeroSports, we understand the importance of making every birthday a memorable experience. Here are some reasons why we are the best venue for kids&apos; birthday parties:
					</p>

					<div style={styles.grid} className="gap-6 sm:gap-8 md:gap-10 lg:gap-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						{/* Exciting Party Packages */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Exciting Party Packages</h4>
							<p style={styles.cardText}>
								Our customizable birthday party packages are designed to fit every child&apos;s interests, providing endless fun and excitement.
							</p>
						</div>

						{/* Expert Party Planners */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Expert Party Planners</h4>
							<p style={styles.cardText}>
								Our dedicated event planners will help you organize the perfect celebration, from start to finish, ensuring a stress-free experience for parents.
							</p>
						</div>

						{/* Variety of Activities */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Variety of Activities</h4>
							<p style={styles.cardText}>
								Enjoy our trampoline courts, dodgeball arena, and foam pits—everything you need for a fun-filled birthday celebration.
							</p>
						</div>

						{/* Safety First */}
						<div style={styles.cardFeatured}>
							<div style={styles.priorityBadge}>Priority!</div>
							<h4 style={styles.cardTitle}>Safety First</h4>
							<p style={styles.cardText}>
								Our trained staff oversee all activities, ensuring a safe environment for kids to enjoy their party to the fullest.
							</p>
						</div>
					</div>
				</div>

				{/* Planning & Contact Section */}
				
			</div>
		</section>
	);
}

const styles = {
	section: {
		background: "#000000",
		padding: "3rem 0",
		position: "relative",
		overflow: "hidden",
	},
	container: {
		maxWidth: "1400px",
		margin: "0 auto",
		// padding: "0 2rem",
		position: "relative",
		zIndex: 1,
	},
	header: {
		textAlign: "center",
		marginBottom: "4rem",
		maxWidth: "1000px",
		margin: "0 auto 4rem",
	},
	badge: {
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
	title: {
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
	titleAccent: {
		color: "#ff1152",
	},
	subtitle: {
		fontSize: "1.1rem",
		color: "rgba(255, 255, 255, 0.8)",
		lineHeight: "1.7",
		fontWeight: "700",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	contentSection: {
		marginBottom: "4rem",
	},
	sectionTitle: {
		fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
		fontWeight: "900",
		textTransform: "uppercase",
		color: "#ffffff",
		marginBottom: "1.5rem",
		textAlign: "center",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	introText: {
		fontSize: "1.1rem",
		color: "rgba(255, 255, 255, 0.8)",
		lineHeight: "1.7",
		fontWeight: "600",
		marginBottom: "2rem",
		textAlign: "center",
		maxWidth: "900px",
		margin: "0 auto 2rem",
	},
	grid: {
		animation: "fadeInUp 0.8s ease-out",
	},
	card: {
		background: "rgba(255, 255, 255, 0.05)",
		borderRadius: "1rem",
		padding: "2rem",
		border: "2px solid rgba(255, 255, 255, 0.1)",
		transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
		boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
	},
	cardFeatured: {
		background: "rgba(57, 255, 20, 0.08)",
		borderRadius: "1rem",
		padding: "2rem",
		border: "2px solid #39FF14",
		transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
		boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
		position: "relative",
	},
	priorityBadge: {
		position: "absolute",
		top: "-10px",
		right: "1rem",
		background: "#39FF14",
		color: "#000000",
		padding: "0.3rem 0.8rem",
		borderRadius: "12px",
		fontSize: "0.65rem",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: "0.5px",
	},
	cardTitle: {
		fontSize: "1.2rem",
		fontWeight: "900",
		color: "#ffffff",
		marginBottom: "1rem",
		textTransform: "uppercase",
		letterSpacing: "0.5px",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	cardText: {
		fontSize: "0.95rem",
		lineHeight: "1.7",
		color: "rgba(255, 255, 255, 0.7)",
		fontWeight: "600",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	contactGrid: {
		marginTop: "2rem",
	},
	contactCard: {
		background: "rgba(255, 255, 255, 0.05)",
		borderRadius: "1rem",
		padding: "2rem",
		border: "2px solid rgba(255, 255, 255, 0.1)",
		textAlign: "center",
		boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
	},
	contactIcon: {
		fontSize: "3rem",
		marginBottom: "1rem",
	},
	contactTitle: {
		fontSize: "1.2rem",
		fontWeight: "900",
		color: "#ffffff",
		marginBottom: "1rem",
		textTransform: "uppercase",
		letterSpacing: "0.5px",
	},
	contactPhone: {
		fontSize: "1.5rem",
		fontWeight: "700",
		color: "#ff1152",
		marginBottom: "0.5rem",
	},
	contactAddress: {
		fontSize: "1.1rem",
		fontWeight: "600",
		color: "#39FF14",
		lineHeight: "1.6",
	},
	contactSubtext: {
		fontSize: "0.9rem",
		color: "rgba(255, 255, 255, 0.6)",
		fontWeight: "600",
	},
};
