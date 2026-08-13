import Link from "next/link";
import CorporateNav from "../components/corporate/CorporateNav";
import { fetchPageData, fetchsheetdata, generateMetadataLib } from "../lib/sheets";
import "../styles/home-v2.css";

const fallbackTitle = "Summer Pass 2026";
const fallbackText =
  "Keep kids active all summer with flexible AeroSports play passes, indoor attractions, and location-specific pass options for 2026.";

const locationSlug = (loc) => loc?.locations || loc?.location_slug || loc?.slug || "";

const passHighlights = [
  {
    title: "Built for repeat visits",
    text: "AeroSports Summer Pass 2026 is designed for families who want more than a one-time day out. It gives kids a reason to stay active, practice new skills, and come back for more indoor fun throughout the summer.",
  },
  {
    title: "Indoor summer activity",
    text: "Rain, heat, or changing plans do not have to cancel the day. AeroSports parks offer climate-controlled indoor play with trampolines, attractions, games, and high-energy activities for kids and teens.",
  },
  {
    title: "Easy family planning",
    text: "Choose your nearest AeroSports location to see pass details, pricing, booking links, and any location-specific inclusions before you buy.",
  },
];

const passFaqs = [
  {
    question: "What is the AeroSports Summer Pass 2026?",
    answer:
      "The Summer Pass 2026 is a seasonal AeroSports offer for families who want regular indoor play during the summer. Pass details, pricing, and inclusions may vary by location.",
  },
  {
    question: "Is the summer pass available at every AeroSports location?",
    answer:
      "Availability can vary by park. Select your nearest AeroSports location on this page to view accurate Summer Pass 2026 details and booking information.",
  },
  {
    question: "Who is the summer pass best for?",
    answer:
      "It is best for kids, teens, and families who plan to visit AeroSports more than once during the summer and want an active indoor option.",
  },
  {
    question: "Where can I see current summer pass pricing?",
    answer:
      "Choose your location from the cards on this page. Each location page shows the latest pass details from AeroSports data.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: passFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export async function generateMetadata() {
  const metadata = await generateMetadataLib({ location: "", category: "", page: "summer-pass-2026" });
  const title = metadata?.title === "AeroSports Trampoline Park" ? `${fallbackTitle} | AeroSports Parks` : metadata?.title;
  const description = metadata?.description === "Fun for all ages at AeroSports!" ? fallbackText : metadata?.description;

  return {
    ...metadata,
    title,
    description,
    alternates: {
      ...(metadata?.alternates || {}),
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/summer-pass-2026`,
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

export default async function SummerPass2026Hub() {
  const [pageData, locationRows] = await Promise.all([
    fetchPageData("", "summer-pass-2026"),
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
          <span className="hv2-section-tag">Active Summer Plans</span>
          <h2 className="hv2-section-h2" style={{ fontSize: 40, margin: "14px 0 16px", color: "#071024" }}>
            More active days, less summer boredom.
          </h2>
          <p style={{ maxWidth: 850, color: "#40516a", fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            The AeroSports Summer Pass 2026 page helps families quickly find the right pass for their closest park. Use it to compare
            location options, check current booking details, and plan repeat visits for indoor trampoline park fun all summer long.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {passHighlights.map((item) => (
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
              Why families search for a summer pass
            </h2>
            <p style={{ color: "#40516a", lineHeight: 1.75 }}>
              Summer can fill up fast with camps, travel, and changing schedules. A local AeroSports pass gives families a flexible indoor
              option for energetic kids, weekend outings, playdates, and last-minute plans when outdoor activities are not ideal.
            </p>
          </div>
          <div>
            <h2 className="hv2-section-h2" style={{ fontSize: 34, marginBottom: 14, color: "#071024" }}>
              Questions before you choose
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {passFaqs.map((faq) => (
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
            Pass details can vary by park, so pick your location for accurate pricing and booking.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {locations.map((loc) => {
              const slug = locationSlug(loc);
              return (
                <Link
                  key={slug}
                  href={`/${slug}/summer-pass-2026`}
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
                  <span style={{ display: "inline-block", marginTop: 18, fontWeight: 900, color: "#5c7f00" }}>View summer pass</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
