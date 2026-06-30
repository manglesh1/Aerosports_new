import "../../styles/sickkids.css";

export default function SickKidsSection({ locationData }) {
	const phone = locationData?.[0]?.phone || "(905) 829-2989";
	const address = locationData?.[0]?.address || "2679 Bristol Cir, Oakville, ON L6H 6Z8";
	const location = locationData?.[0]?.location || "Oakville";

	return (
		<section style={styles.section}>
			<div style={styles.container}>
				{/* Section Header */}
				<div style={styles.header}>
					<div style={styles.badge}>
						<span>💚 Charity Partnership</span>
					</div>
					<h2 style={styles.title}>
						Jump for a Cause - <span style={styles.titleAccent}>Support SickKids</span> with Every Bounce!
					</h2>
					<p style={styles.subtitle}>
						Ready to make a difference while having fun? Join us at AeroSports {location} and help us support the SickKids Foundation with every jump! Every time you bounce, you&apos;re contributing to the health and well-being of children in need.
					</p>
					<p style={styles.subtitle}>
						At AeroSports {location}, we&apos;re dedicated to not only providing thrilling fun for all ages but also giving back to our community. We&apos;ve partnered with SickKids to raise funds for the healthcare and treatment of children, because every child deserves a chance to grow healthy and strong.
					</p>
				</div>

				{/* How You Can Help Section */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>How You Can Help</h3>

					<div style={styles.grid} className="gap-6 sm:gap-8 md:gap-10 lg:gap-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{/* SickKids Night */}
						<div style={styles.cardFeatured}>
							<div style={styles.priorityBadge}>Monthly Event!</div>
							<h4 style={styles.cardTitle}>SickKids Night</h4>
							<p style={styles.cardText}>
								Join us the first Wednesday of every month from 5:00 PM to 8:00 PM, where $10 from every jump pass sold will be donated to the SickKids Foundation.
							</p>
						</div>

						{/* Bounce for a Cause */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Bounce for a Cause</h4>
							<p style={styles.cardText}>
								Every jump you take is a step towards better health for a sick child. Your fun makes a real difference.
							</p>
						</div>

						{/* Family-Friendly Fun */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Family-Friendly Fun</h4>
							<p style={styles.cardText}>
								Our park offers attractions for everyone in the family, from toddlers to adults. All ages can participate in making a difference.
							</p>
						</div>
					</div>
				</div>

				{/* Special Event Section */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>Special Event - SickKids Night</h3>

					<div style={styles.eventCard}>
						<div style={styles.eventDetails}>
							<div style={styles.eventItem}>
								<div style={styles.eventIcon}>📅</div>
								<h4 style={styles.eventItemTitle}>First Wednesday of Every Month</h4>
							</div>
							<div style={styles.eventItem}>
								<div style={styles.eventIcon}>🕔</div>
								<h4 style={styles.eventItemTitle}>5:00 PM - 8:00 PM</h4>
							</div>
							<div style={styles.eventItem}>
								<div style={styles.eventIcon}>💚</div>
								<h4 style={styles.eventItemTitle}>$10 from every jump pass donated to SickKids</h4>
							</div>
						</div>
						<p style={styles.eventDescription}>
							Bring your family and friends to make a difference. Whether you&apos;re celebrating a special occasion or just looking for a fun night out, your support means the world to children in need.
						</p>
					</div>
				</div>

				{/* Why You'll Love Supporting SickKids */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>Why You&apos;ll Love Supporting SickKids</h3>

					<div style={styles.grid} className="gap-6 sm:gap-8 md:gap-10 lg:gap-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{/* Giving Back */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Giving Back</h4>
							<p style={styles.cardText}>
								Your fun night out makes a real impact on the lives of children and their families. Every bounce matters.
							</p>
						</div>

						{/* Safe and Clean */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>Safe and Clean</h4>
							<p style={styles.cardText}>
								We prioritize your safety, while ensuring every jump is full of excitement and fun for the whole family.
							</p>
						</div>

						{/* All Ages Welcome */}
						<div style={styles.card}>
							<h4 style={styles.cardTitle}>All Ages Welcome</h4>
							<p style={styles.cardText}>
								Whether you&apos;re 3 or 63, there&apos;s something for everyone in our trampoline park. Everyone can help make a difference.
							</p>
						</div>
					</div>
				</div>

				{/* About SickKids Foundation */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>About SickKids Foundation</h3>
					<p style={styles.introText}>
						SickKids Foundation is one of the largest and most dynamic charitable organizations in Canada, dedicated to advancing children&apos;s health through the support of SickKids Hospital. Every year, the foundation funds critical programs, cutting-edge research, and life-saving treatments for children in need. Your participation helps us provide brighter futures for young patients and their families.
					</p>
				</div>

				{/* Don't Miss Out Section */}
				<div style={styles.contentSection}>
					<h3 style={styles.sectionTitle}>Don&apos;t Miss Out!</h3>
					<p style={styles.introText}>
						Join us on the first Wednesday of every month for SickKids Night and make every bounce count!
					</p>

					<div style={styles.grid} className="gap-6 sm:gap-8 md:gap-10 grid grid-cols-1 md:grid-cols-3">
						{/* When */}
						<div style={styles.contactCard}>
							<div style={styles.contactIcon}>📅</div>
							<h4 style={styles.contactTitle}>When</h4>
							<p style={styles.contactHighlight}>First Wednesday Monthly</p>
							<p style={styles.contactSubtext}>5:00 PM - 8:00 PM</p>
						</div>

						{/* Donation */}
						<div style={styles.contactCard}>
							<div style={styles.contactIcon}>💚</div>
							<h4 style={styles.contactTitle}>Donation</h4>
							<p style={styles.contactHighlight}>$10 per jump pass</p>
							<p style={styles.contactSubtext}>Goes to SickKids Foundation</p>
						</div>

						{/* Contact */}
						<div style={styles.contactCard}>
							<div style={styles.contactIcon}>📞</div>
							<h4 style={styles.contactTitle}>Contact Us for Details</h4>
							<p style={styles.contactPhone}>{phone}</p>
						</div>
					</div>

					<p style={styles.disclaimer}>
						*Terms and conditions apply. SickKids Night runs from 5:00 PM to 8:00 PM on the first Wednesday of each month. A portion of proceeds from jump passes will be donated to the SickKids Foundation.
					</p>
				</div>
			</div>
		</section>
	);
}

const styles = {
	section: {
		background: "#000000",
		padding: "3rem 1.5rem",
		position: "relative",
		overflow: "hidden",
	},
	container: {
		maxWidth: "1400px",
		margin: "0 auto",
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
		marginBottom: "1rem",
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
		MozOsxFontSmoothing: "grayscale",
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
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
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
		MozOsxFontSmoothing: "grayscale",
	},
	cardText: {
		fontSize: "0.95rem",
		lineHeight: "1.7",
		color: "rgba(255, 255, 255, 0.7)",
		fontWeight: "600",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	eventCard: {
		background: "rgba(255, 255, 255, 0.05)",
		borderRadius: "1rem",
		padding: "2.5rem",
		border: "2px solid rgba(255, 255, 255, 0.1)",
		boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
		maxWidth: "900px",
		margin: "0 auto",
	},
	eventDetails: {
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
		marginBottom: "2rem",
	},
	eventItem: {
		display: "flex",
		alignItems: "center",
		gap: "1rem",
	},
	eventIcon: {
		fontSize: "2rem",
	},
	eventItemTitle: {
		fontSize: "1.1rem",
		fontWeight: "700",
		color: "#ffffff",
		margin: 0,
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
	},
	eventDescription: {
		fontSize: "1rem",
		color: "rgba(255, 255, 255, 0.8)",
		lineHeight: "1.7",
		fontWeight: "600",
		textAlign: "center",
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
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
		textRendering: "geometricPrecision",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
	contactPhone: {
		fontSize: "1.5rem",
		fontWeight: "700",
		color: "#ff1152",
		marginBottom: "0.5rem",
	},
	contactHighlight: {
		fontSize: "1.3rem",
		fontWeight: "700",
		color: "#39FF14",
		marginBottom: "0.5rem",
	},
	contactSubtext: {
		fontSize: "0.9rem",
		color: "rgba(255, 255, 255, 0.6)",
		fontWeight: "600",
	},
	disclaimer: {
		fontSize: "0.85rem",
		color: "rgba(255, 255, 255, 0.6)",
		fontWeight: "600",
		textAlign: "center",
		marginTop: "2rem",
		fontStyle: "italic",
		maxWidth: "800px",
		margin: "2rem auto 0",
	},
};
