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
        <h2>Ready to Book Your Visit or Party?</h2>
        <p>Limited slots available this weekend — takes less than 2 minutes to book.</p>
        <div className="hv2-final-cta-btns">
          <Link href={`/${locationSlug}/kids-birthday-parties`} className="hv2-btn hv2-btn-white hv2-btn-lg">
            Plan a Birthday Party →
          </Link>
          {estoreConfig?.value && (
            <a href={estoreConfig.value} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-dark hv2-btn-lg">
              Book Jump Session
            </a>
          )}
          {waiverLink && (
            <a href={waiverLink} target="_blank" rel="noopener noreferrer" className="hv2-btn hv2-btn-dark hv2-btn-lg">
              Sign Before You Arrive
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCtaV2;
