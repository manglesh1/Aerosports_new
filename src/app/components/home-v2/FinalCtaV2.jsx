import Link from "next/link";

// Final CTA banner. Headline/subtext/button labels are hardcoded.
// Only the URLs come from data:
//   - Book Jump Session → estoreConfig.value
//   - Plan a Party      → /<location>/kids-birthday-parties (always exists)
//   - Sign Waiver       → waiver link
const FinalCtaV2 = ({ locationSlug, estoreConfig, waiverLink }) => {
  return (
    <section className="hv2-final-cta">
      <div className="hv2-final-cta-bg" />
      <div className="hv2-final-cta-inner">
        <h2>Ready to Jump In?</h2>
        <p>Book your session, plan a party, or just show up — we&apos;re ready when you are.</p>
        <div className="hv2-final-cta-btns">
          {estoreConfig?.value && (
            <a href={estoreConfig.value} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-white hv2-btn-lg">
              Book Jump Session →
            </a>
          )}
          <Link href={`/${locationSlug}/kids-birthday-parties`} className="hv2-btn hv2-btn-dark hv2-btn-lg">
            Plan a Party
          </Link>
          {waiverLink && (
            <a href={waiverLink} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-dark hv2-btn-lg">
              Sign Waiver
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCtaV2;
