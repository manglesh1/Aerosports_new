"use client";

import { useState, useEffect } from "react";
import { sendWebsiteEmail } from "@/utils/sendWebsiteEmail";
import "../styles/mobile-action-bar.css";

const REASONS = [
  "General Enquiry",
  "Birthday Party",
  "Group or Event",
  "Membership",
];

const MobileActionBar = ({ waiverUrl, locationName }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const displayName = locationName || "AeroSports";
  const safeWaiverUrl = waiverUrl || "#";
  const isExternal = typeof safeWaiverUrl === "string" && safeWaiverUrl.startsWith("http");

  // Lock body scroll while modal open + close on Escape
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const reason = String(formData.get("reason") || "General Enquiry").trim();
    const msg = String(formData.get("message") || "").trim();

    setStatus("loading");
    setMessage("");

    try {
      await sendWebsiteEmail({
        fullName: name,
        email,
        phone,
        date: "",
        time: "",
        selectedEvent: reason,
        message: msg,
        location: displayName,
        subject: `${displayName} enquiry from ${name}`,
      });

      form.reset();
      setStatus("success");
      setMessage("Thanks! Your enquiry has been sent. We'll be in touch shortly.");
    } catch (error) {
      setStatus("error");
      setMessage("Sorry, your enquiry could not be sent right now. Please call us or try again.");
    }
  }

  return (
    <>
      {/* Mobile-only fixed bottom bar */}
      <div className="v11_mab_bar">
        <a
          href={safeWaiverUrl}
          className="v11_mab_book"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <svg className="v11_mab_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Sign Your Waiver</span>
        </a>
        <button
          type="button"
          className="v11_mab_enquire"
          onClick={() => setOpen(true)}
        >
          <svg className="v11_mab_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-4A7.9 7.9 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Enquire</span>
        </button>
      </div>

      {/* Enquire modal */}
      {open && (
        <div
          className="v11_mab_overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire — ${displayName}`}
        >
          <div className="v11_mab_modal">
            <button
              type="button"
              className="v11_mab_close"
              onClick={() => setOpen(false)}
              aria-label="Close enquiry form"
            >
              &times;
            </button>
            <h2 className="v11_mab_title">Enquire — {displayName}</h2>
            <p className="v11_mab_subtitle">Send us a message and our team will reach out.</p>

            <form className="v11_mab_form" onSubmit={handleSubmit}>
              <label className="v11_mab_label">
                Name
                <input name="name" type="text" required autoComplete="name" placeholder="Your full name" />
              </label>
              <label className="v11_mab_label">
                Email
                <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              </label>
              <label className="v11_mab_label">
                Phone
                <input name="phone" type="tel" required autoComplete="tel" placeholder="(000) 000-0000" />
              </label>
              <label className="v11_mab_label">
                Reason
                <select name="reason" defaultValue={REASONS[0]}>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="v11_mab_label">
                Message
                <textarea name="message" required rows={4} placeholder="How can we help?" />
              </label>

              <button className="v11_mab_submit" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Enquiry"}
              </button>

              {message && (
                <p className={`v11_mab_msg v11_mab_${status}`}>{message}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileActionBar;
