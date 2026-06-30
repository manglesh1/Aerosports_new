"use client";

import { useState } from "react";

export default function BirthdayFAQ({ faqData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqData || faqData.length === 0) return null;

  return (
    <div className="v11_bp_faq_list">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="v11_bp_faq_item"
        >
          <button
            className="v11_bp_faq_question"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <svg
              className={`v11_bp_faq_chevron ${openIndex === index ? "v11_bp_faq_chevron_open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            className="v11_bp_faq_answer"
            style={{
              maxHeight: openIndex === index ? "500px" : "0",
              opacity: openIndex === index ? 1 : 0,
              padding: openIndex === index ? "0 1.5rem 1.25rem" : "0 1.5rem",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: item.answer }} />
          </div>
        </div>
      ))}
    </div>
  );
}
