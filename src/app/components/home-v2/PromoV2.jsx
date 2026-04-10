import Link from "next/link";

// Deals & Upcoming Events section.
// - Tag, headline, ticker items are hardcoded (same for every location).
// - Promo CARDS come from the Promotions sheet for this location.
//   Cards are hidden entirely if there are no promotions.
const TICKER = [
  "Birthday Discounts Available — Book Early",
  "Toddler Time Every Saturday 9–10 AM",
  "Glow Night Coming Soon — Stay Tuned",
  "Group Rates for Schools & Camps",
  "SickKids Charity Night — Watch for Dates",
  "Members Get 20% Off Every Visit",
];

const PromoV2 = ({ promotions, locationSlug }) => {
  const cards = Array.isArray(promotions)
    ? promotions.slice(0, 3).map((p, i) => ({
        title: p.title,
        desc: p.description,
        badge: p.badge || p.code || null,
        link: p.link || `/${locationSlug}/pricing-promos`,
        style: ["pink", "green", "navy"][i % 3],
      }))
    : [];

  // Duplicate ticker for seamless scroll
  const tickerLoop = [...TICKER, ...TICKER];

  return (
    <section className="hv2-promo" id="promo">
      <div className="hv2-promo-inner">
        <div className="hv2-section-tag">Current Offers</div>
        <h2 className="hv2-section-h2" style={{ marginBottom: 24 }}>
          Deals & Upcoming Events
        </h2>
        <div className="hv2-ticker-wrap">
          <div className="hv2-ticker">
            {tickerLoop.map((t, i) => (
              <span className="hv2-ticker-item" key={i}>
                <span className="hv2-ticker-dot" />
                {t}
              </span>
            ))}
          </div>
        </div>
        {cards.length > 0 && (
          <div className="hv2-promo-grid">
            {cards.map((c, i) => {
              const styleCls = c.style === "navy" ? "hv2-promo-navy" : c.style === "green" ? "hv2-promo-green" : "hv2-promo-pink";
              const badgeCls = c.style === "navy" ? "hv2-badge-star" : c.style === "green" ? "hv2-badge-lime" : "hv2-badge-red";
              const isExternal = c.link && c.link.startsWith("http");
              const Comp = isExternal ? "a" : Link;
              const linkProps = isExternal
                ? { href: c.link, target: "_blank", rel: "noopener noreferrer" }
                : { href: c.link };
              return (
                <div key={i} className={`hv2-promo-card ${styleCls}`}>
                  {c.badge && <div className={`hv2-promo-badge ${badgeCls}`}>{c.badge}</div>}
                  {c.title && <h3>{c.title}</h3>}
                  {c.desc && <p>{c.desc}</p>}
                  <Comp className="hv2-btn hv2-btn-red" style={{ fontSize: 13, padding: "10px 20px" }} {...linkProps}>
                    Claim Offer →
                  </Comp>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoV2;
