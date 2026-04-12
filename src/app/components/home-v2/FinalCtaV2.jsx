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
        <div className="hv2-final-cta-badge">✦ Limited Weekend Slots Available</div>
        <h2>Ready to Plan<br /><em>Your Next Visit?</em></h2>
        <p>Join millions of thrill-seekers who&apos;ve made AeroSports their go-to destination for high-flying fun across Ontario.</p>
        <div className="hv2-final-cta-btns">
          {estoreConfig?.value && (
            <a href={estoreConfig.value} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-red hv2-btn-lg">
              Book Your Session
            </a>
          )}
          <Link href={`/${locationSlug}/kids-birthday-parties`} className="hv2-btn hv2-btn-outline-pink hv2-btn-lg">
            Find Your Location
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaV2;
