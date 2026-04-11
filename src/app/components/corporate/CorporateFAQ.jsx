"use client";
import { useState } from "react";

const DEFAULT_FAQS = [
  {
    question: "What is AeroSports?",
    answer: "AeroSports is Ontario's premier indoor adventure park featuring wall-to-wall trampolines, ninja courses, climbing walls, dodgeball courts, arcades, and more. We offer activities for all ages, birthday party packages, and group event hosting.",
  },
  {
    question: "Do attractions vary by location?",
    answer: "Yes, each AeroSports location has a unique mix of attractions. While core experiences like trampolines and ninja courses are available at all parks, some locations feature exclusive attractions like Valo Arena or mega slides. Check your local park's page for details.",
  },
  {
    question: "Are waivers required?",
    answer: "Yes — every guest must have a signed waiver before entering the park. Parents or legal guardians can sign for minors. Save time by signing online before you arrive!",
  },
  {
    question: "Can I host a party here?",
    answer: "Absolutely! Our all-inclusive birthday packages cover jump time, a dedicated party host, private party room, setup & cleanup, and food & drinks. Premium packages add extras like extended jump time and goodie bags.",
  },
  {
    question: "Do I need to select a park before booking?",
    answer: "Yes, since attractions and availability vary by location, you'll need to select your preferred park first. Use our location finder to choose the nearest AeroSports, then book directly through that park's page.",
  },
  {
    question: "Do you have age or height requirements?",
    answer: "Our parks welcome guests of all ages! We have dedicated toddler zones for kids under 5, main attraction areas for ages 6+, and activities that adults love too. Some attractions may have minimum height requirements for safety.",
  },
];

export default function CorporateFAQ({ faqs }) {
  const [open, setOpen] = useState(null);

  // Use sheet data if available, otherwise fall back to defaults
  const faqList = faqs && faqs.length > 0
    ? faqs.map(f => ({ question: f.question, answer: f.answer }))
    : DEFAULT_FAQS;

  return (
    <div style={{ maxWidth: 768, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      {faqList.map((f, i) => (
        <div
          key={i}
          style={{
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#fff",
            overflow: "hidden",
            transition: "box-shadow 0.3s",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "20px 24px",
              textAlign: "left",
              fontWeight: 600,
              color: "#080B18",
              fontSize: 17,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span>{f.question}</span>
            <svg
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                color: "#9ca3af",
                transition: "transform 0.3s",
                transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            style={{
              overflow: "hidden",
              transition: "all 0.3s",
              maxHeight: open === i ? 300 : 0,
              opacity: open === i ? 1 : 0,
            }}
          >
            <p style={{ padding: "0 24px 20px", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>{f.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
