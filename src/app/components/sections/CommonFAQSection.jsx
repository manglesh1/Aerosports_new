import { fetchFaqData } from "@/lib/sheets";
import CommonFAQList from "./CommonFAQList";

export default async function CommonFAQSection({
  location_slug,
  page,
  eyebrow = "Questions & Answers",
  title = "Frequently Asked",
  accent = " Questions",
  subtitle = "Have questions? We have answers. Check the details below before your visit.",
}) {
  const faqData = await fetchFaqData(location_slug, page);

  if (!faqData || faqData.length === 0) return null;

  return (
    <section className="v11_bp_faq_section">
      <div className="v11_bp_container">
        <div className="text-center mb-12">
          <p className="v11_bp_packages_eyebrow">{eyebrow}</p>
          <h2 className="v11_bp_heading">
            {title}
            <span className="v11_bp_heading_accent">{accent}</span>
          </h2>
          {subtitle && <p className="v11_bp_subtext">{subtitle}</p>}
        </div>

        <CommonFAQList faqs={faqData} />
      </div>
    </section>
  );
}
