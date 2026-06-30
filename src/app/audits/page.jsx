import "./audits.css";

export const metadata = {
  title: "Website Audit | AeroSports Parks",
  description: "Internal website audit action list for AeroSports Parks.",
  robots: {
    index: false,
    follow: false,
  },
};

const doneItems = [
  "Hero headline, badge, subtext, CTAs and trust items",
  "Attractions heading, descriptive subtext and stronger CTA",
  "Plan Your Visit CTAs and action-driven labels",
  "Party headline, social proof and stronger CTA",
  "Reviews truncation, review count and trust context",
  "Why Choose differentiation cards",
  "Promos urgency ticker and action CTA",
  "Location urgency signals and trust rating",
  "Final CTA headline, party priority and urgency copy",
];

const waitingItems = [
  {
    title: "Attraction card descriptions",
    status: "Sheet data needed",
    copy: "Add desc, audience and priority columns to attraction rows so cards can show better scan-friendly context.",
  },
  {
    title: "Party image carousel",
    status: "Sheet data needed",
    copy: "Add partyImages in page-json-data. Code reads the array and falls back to the current image when it is missing.",
  },
];

const openItems = [
  {
    title: "User journey segmentation",
    page: "Audit p3",
    copy: "Add clear entry points for birthday parties, family visits and group or corporate bookings.",
  },
  {
    title: "Structured promo cards",
    page: "Audit p17",
    copy: "Promotions need price, timing, eligibility and expiry fields before the page can show stronger urgency.",
  },
  {
    title: "Video or image testimonials",
    page: "Audit p13-14",
    copy: "Google Places reviews do not provide usable customer media, so this needs a curated testimonial source.",
  },
  {
    title: "Footer SEO links",
    page: "Audit p21-22",
    copy: "Prioritize high-intent footer links and improve anchor text across shared footer navigation.",
  },
  {
    title: "Internal linking",
    page: "Audit p8, p22",
    copy: "Confirm every attraction has a destination page and link key pages with keyword-rich anchor text.",
  },
  {
    title: "H1 optimization",
    page: "Audit p3",
    copy: "Current location H1 is keyword-rich, but it does not exactly match the audit recommendation.",
  },
];

export default function AuditsPage() {
  return (
    <>
      <header className="audit_topbar">
        <a href="/" className="audit_logo" aria-label="AeroSports home">
          AERO<span>SPORTS</span>
        </a>
        <nav aria-label="Audit navigation">
          <a href="/">Home</a>
          <a href="/blogs">Blogs</a>
          <a href="/contact-us">Contact</a>
        </nav>
      </header>
      <main className="audit_page">
        <section className="audit_hero">
          <p className="audit_kicker">Internal QA</p>
          <h1>AeroSports Website Audit</h1>
          <p>
            A quick working view of the audit items already handled, the sheet
            data still needed, and the next site-wide improvements to tackle.
          </p>
        </section>

        <section className="audit_summary" aria-label="Audit status summary">
          <article>
            <strong>{doneItems.length}</strong>
            <span>Done</span>
          </article>
          <article>
            <strong>{waitingItems.length}</strong>
            <span>Waiting on sheet data</span>
          </article>
          <article>
            <strong>{openItems.length}</strong>
            <span>Open work items</span>
          </article>
        </section>

        <section className="audit_section audit_done">
          <div className="audit_section_head">
            <p className="audit_kicker">Completed</p>
            <h2>Code and copy updates already applied</h2>
          </div>
          <div className="audit_done_grid">
            {doneItems.map((item) => (
              <div className="audit_done_item" key={item}>
                <span aria-hidden="true">OK</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="audit_section">
          <div className="audit_section_head">
            <p className="audit_kicker">Ready Next</p>
            <h2>Code is ready, sheet data is needed</h2>
          </div>
          <div className="audit_cards two_col">
            {waitingItems.map((item) => (
              <article className="audit_card waiting" key={item.title}>
                <span>{item.status}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="audit_section">
          <div className="audit_section_head">
            <p className="audit_kicker">Still Open</p>
            <h2>Remaining recommendations</h2>
          </div>
          <div className="audit_cards">
            {openItems.map((item) => (
              <article className="audit_card" key={item.title}>
                <span>{item.page}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="audit_footer">
        <p>AeroSports internal audit notes. This page is no-indexed.</p>
      </footer>
    </>
  );
}
