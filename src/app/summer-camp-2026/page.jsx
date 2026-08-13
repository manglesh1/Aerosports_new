import Link from "next/link";
import CorporateNav from "../components/corporate/CorporateNav";
import { fetchPageData, fetchsheetdata, generateMetadataLib } from "../lib/sheets";
import "../styles/home-v2.css";

const fallbackTitle = "Summer Camp 2026";
const fallbackText =
  "AeroSports Summer Camp 2026 keeps kids moving with indoor jumping, games, activities, supervised play, and easy planning for parents.";

const locationSlug = (loc) => loc?.locations || loc?.location_slug || loc?.slug || "";

const campHighlights = [
  {
    title: "Active indoor camp days",
    text: "AeroSports summer camps are built around movement, play, and supervised indoor activities, giving kids a high-energy break from screens and a place to burn off summer energy.",
  },
  {
    title: "Simple planning for parents",
    text: "Find your nearest location, review camp information, and use the location page for current dates, pricing, booking links, and park-specific details.",
  },
  {
    title: "Fun for different ages",
    text: "Campers can enjoy trampoline park attractions, games, group activities, and structured play in a setting designed for active kids and social summer memories.",
  },
];

const campFaqs = [
  {
    question: "What is AeroSports Summer Camp 2026?",
    answer:
      "AeroSports Summer Camp 2026 is an indoor day camp experience with active play, trampoline park attractions, games, activities, and supervised camp time. Details may vary by location.",
  },
  {
    question: "Which AeroSports locations offer summer camp?",
    answer:
      "Camp availability can vary by park. Select your closest AeroSports location on this page to view accurate Summer Camp 2026 details.",
  },
  {
    question: "Is AeroSports summer camp good for active kids?",
    answer:
      "Yes. AeroSports camps are designed for kids who enjoy movement, games, jumping, and group activities in an indoor environment.",
  },
  {
    question: "Where do I find camp dates and pricing?",
    answer:
      "Choose a location from this page. The location-specific summer camp page shows the latest camp details and booking information from AeroSports data.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: campFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export async function generateMetadata() {
  const metadata = await generateMetadataLib({ location: "", category: "", page: "summer-camp-2026" });
  const title = metadata?.title === "AeroSports Trampoline Park" ? `${fallbackTitle} | AeroSports Parks` : metadata?.title;
  const description = metadata?.description === "Fun for all ages at AeroSports!" ? fallbackText : metadata?.description;

  return {
    ...metadata,
    title,
    description,
    alternates: {
      ...(metadata?.alternates || {}),
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/summer-camp-2026`,
    },
    openGraph: {
      ...(metadata?.openGraph || {}),
      title,
      description,
    },
    twitter: {
      ...(metadata?.twitter || {}),
      title,
      description,
    },
  };
}

export default async function SummerCamp2026Hub() {
  const [pageData, locationRows] = await Promise.all([
    fetchPageData("", "summer-camp-2026"),
    fetchsheetdata("locations"),
  ]);
  const locations = (Array.isArray(locationRows) ? locationRows : []).filter((loc) => locationSlug(loc));

  return (
    <main className="hv2" style={{ background: "#f4f7fb", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CorporateNav />
      <section style={{ padding: "96px 20px 56px", background: "#070b15", color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <span className="hv2-section-tag">Summer 2026</span>
          <h1 className="hv2-section-h2" style={{ marginTop: 16, color: "#fff" }}>
            {pageData?.title || fallbackTitle}
          </h1>
          <p style={{ maxWidth: 760, margin: "18px auto 0", color: "rgba(255,255,255,0.76)", fontSize: 18, lineHeight: 1.7 }}>
            {pageData?.smalltext || pageData?.metadescription || fallbackText}
          </p>
        </div>
      </section>
      <section style={{ padding: "64px 20px 28px", background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <span className="hv2-section-tag">Summer Camp Planning</span>
          <h2 className="hv2-section-h2" style={{ fontSize: 40, margin: "14px 0 16px", color: "#071024" }}>
            A more active summer camp option for kids.
          </h2>
          <p style={{ maxWidth: 850, color: "#40516a", fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            AeroSports Summer Camp 2026 gives families a local indoor camp option with active play, supervised activities, and easy
            access to location-specific camp details. Pick your nearest park to see the most accurate dates, pricing, and booking links.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {campHighlights.map((item) => (
              <article
                key={item.title}
                style={{
                  padding: 24,
                  borderRadius: 14,
                  border: "1px solid #dde5f0",
                  background: "#f7f9fd",
                }}
              >
                <h3 style={{ margin: "0 0 10px", fontSize: 21, color: "#071024" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "#526174", lineHeight: 1.65 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "28px 20px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          <div>
            <h2 className="hv2-section-h2" style={{ fontSize: 34, marginBottom: 14, color: "#071024" }}>
              Why parents choose indoor summer camp
            </h2>
            <p style={{ color: "#40516a", lineHeight: 1.75 }}>
              Indoor camp helps families plan around hot weather, rainy days, and busy summer schedules. AeroSports gives campers a
              place to move, play, meet other kids, and enjoy structured activities without relying on outdoor conditions.
            </p>
          </div>
          <div>
            <h2 className="hv2-section-h2" style={{ fontSize: 34, marginBottom: 14, color: "#071024" }}>
              Summer camp questions
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {campFaqs.map((faq) => (
                <details key={faq.question} style={{ border: "1px solid #dde5f0", borderRadius: 12, padding: "16px 18px", background: "#fff" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 900, color: "#071024" }}>{faq.question}</summary>
                  <p style={{ margin: "12px 0 0", color: "#526174", lineHeight: 1.6 }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "56px 20px 84px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2 className="hv2-section-h2" style={{ fontSize: 42, textAlign: "center", marginBottom: 12 }}>
            Choose Your AeroSports Location
          </h2>
          <p style={{ textAlign: "center", color: "#526174", marginBottom: 30 }}>
            Camp dates and packages can vary by park, so pick your location for accurate details.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {locations.map((loc) => {
              const slug = locationSlug(loc);
              return (
                <Link
                  key={slug}
                  href={`/${slug}/summer-camp-2026`}
                  style={{
                    display: "block",
                    padding: 24,
                    borderRadius: 14,
                    background: "#fff",
                    color: "#071024",
                    textDecoration: "none",
                    border: "1px solid #dde5f0",
                    boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: 22, marginBottom: 8 }}>{loc.location || loc.desc || slug}</strong>
                  {loc.address && <span style={{ display: "block", color: "#65758b", fontSize: 14, lineHeight: 1.5 }}>{loc.address}</span>}
                  <span style={{ display: "inline-block", marginTop: 18, fontWeight: 900, color: "#5c7f00" }}>View summer camp</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
