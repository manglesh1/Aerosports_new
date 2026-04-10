import Link from "next/link";

// "Plan Your Visit" section. Label + items are hardcoded (same for every
// location), only the URLs come from data:
//   - View Pricing   → /<location>/pricing-promos (always exists)
//   - Book a Party   → /<location>/kids-birthday-parties (always exists)
//   - Buy Jump Passes → config.estorebase (external)
//   - Sign Waiver    → waiver link from config (external)
// A button is hidden only if its URL is missing.
const PlanV2 = ({ locationSlug, estoreConfig, waiverLink }) => {
  // Audit: prioritize party booking as primary CTA, make labels more
  // action-driven, de-emphasize waiver.
  const items = [
    {
      icon: "🎂",
      title: "Book a Stress-Free Birthday Party",
      subtitle: "All-inclusive packages — takes 2 min to book",
      href: `/${locationSlug}/kids-birthday-parties`,
      external: false,
    },
    {
      icon: "🎟",
      title: "Book Your Jump Time",
      subtitle: "Reserve online & skip the line",
      href: estoreConfig?.value || null,
      external: true,
    },
    {
      icon: "💰",
      title: "Explore Pricing & Packages",
      subtitle: "Jump passes, memberships & group rates",
      href: `/${locationSlug}/pricing-promos`,
      external: false,
    },
    {
      icon: "📝",
      title: "Sign Before You Arrive",
      subtitle: "Save time — complete your waiver online",
      href: waiverLink || null,
      external: true,
    },
  ].filter((it) => !!it.href);

  if (items.length === 0) return null;

  return (
    <section className="hv2-plan" id="plan">
      <div className="hv2-plan-inner">
        <div className="hv2-plan-label">Plan Your Visit</div>
        <div className="hv2-plan-nav">
          {items.map((it, i) => {
            const Comp = it.external ? "a" : Link;
            const props = it.external
              ? { href: it.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: it.href };
            return (
              <Comp key={i} className="hv2-plan-btn" {...props}>
                <div className="hv2-plan-btn-icon">{it.icon}</div>
                <div className="hv2-plan-btn-text">
                  <strong>{it.title}</strong>
                  <span>{it.subtitle}</span>
                </div>
              </Comp>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlanV2;
