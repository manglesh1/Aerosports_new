"use client";

import { useState } from "react";

export default function CommonFAQList({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="v11_bp_faq_list">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={`${item.question}-${index}`} className="v11_bp_faq_item">
            <button
              type="button"
              className="v11_bp_faq_question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                className={`v11_bp_faq_chevron ${isOpen ? "v11_bp_faq_chevron_open" : ""}`}
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
                maxHeight: isOpen ? "500px" : "0",
                opacity: isOpen ? 1 : 0,
                padding: isOpen ? "0 1.5rem 1.25rem" : "0 1.5rem",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
