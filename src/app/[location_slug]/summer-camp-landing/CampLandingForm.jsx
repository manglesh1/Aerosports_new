"use client";

import { useState } from "react";
import { buildCampLeadEmailPayload, sendWebsiteEmail } from "@/utils/sendWebsiteEmail";

export default function CampLandingForm({ locationName, packages = [] }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const parentName = String(formData.get("parentName") || "").trim();
    const childName = String(formData.get("childName") || "").trim();
    const childAge = String(formData.get("childAge") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const selectedCamp = String(formData.get("selectedCamp") || "Summer Camp").trim();
    const preferredWeek = String(formData.get("preferredWeek") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    setStatus("loading");
    setMessage("");

    try {
      await sendWebsiteEmail(
        buildCampLeadEmailPayload({
          locationName,
          parentName,
          childName,
          childAge,
          email,
          phone,
          selectedCamp,
          preferredWeek,
          message: notes,
        })
      );

      form.reset();
      setStatus("success");
      setMessage("Request sent. Our team will follow up with camp availability.");
    } catch (error) {
      setStatus("error");
      setMessage("Request could not be sent right now. Please try again or use the chat option.");
    }
  }

  return (
    <form id="camp-form" className="birthday_ad_form camp_ad_form" onSubmit={handleSubmit}>
      <div className="birthday_ad_form_header">
        <span>Camp callback</span>
        <h2>Check camp availability</h2>
        <p>Tell us your preferred week and our team will help with options.</p>
      </div>

      <div className="birthday_ad_form_grid">
        <label>
          Parent name
          <input name="parentName" type="text" required autoComplete="name" />
        </label>
        <label>
          Child&apos;s name
          <input name="childName" type="text" autoComplete="off" />
        </label>
        <label>
          Child&apos;s age
          <input name="childAge" type="number" min="4" max="15" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Preferred week
          <input name="preferredWeek" type="text" placeholder="Week of July 8, full summer..." />
        </label>
        <label className="birthday_ad_form_full">
          Camp option
          <select name="selectedCamp" defaultValue={packages[0]?.title || packages[0]?.name || "Summer Camp"}>
            {packages.length > 0 ? (
              packages.map((item) => (
                <option key={item.title || item.name} value={item.title || item.name}>
                  {item.title || item.name}
                </option>
              ))
            ) : (
              <option>Summer Camp</option>
            )}
          </select>
        </label>
        <label className="birthday_ad_form_full">
          Notes
          <textarea name="notes" rows="3" placeholder="Dates, number of kids, lunch needs, questions..." />
        </label>
      </div>

      <button className="birthday_ad_submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Camp Request"}
      </button>
      {message && <p className={`birthday_ad_form_message birthday_ad_form_${status}`}>{message}</p>}
      <p className="birthday_ad_form_note">Camp spots can fill quickly. Earlier requests get better date choices.</p>
    </form>
  );
}
