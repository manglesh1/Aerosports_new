"use client";

import { useState } from "react";

export default function BirthdayLandingForm({ locationName, packages = [] }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const childName = String(formData.get("childName") || "").trim();
    const childAge = String(formData.get("childAge") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const partyPackage = String(formData.get("partyPackage") || "Birthday Party").trim();
    const notes = String(formData.get("notes") || "").trim();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/prebooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          preferredDate: formData.get("preferredDate"),
          groupSize: childAge ? `Child age: ${childAge}` : "",
          interests: [partyPackage],
          specialRequests: [
            childName ? `Child name: ${childName}` : "",
            formData.get("preferredTime") ? `Preferred time: ${formData.get("preferredTime")}` : "",
            notes,
          ].filter(Boolean).join("\n"),
          location: locationName,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send request");
      }

      form.reset();
      setStatus("success");
      setMessage("Request sent. Our team will follow up with birthday availability.");
    } catch (error) {
      setStatus("error");
      setMessage("Request could not be sent right now. Please call us or try again.");
    }
  }

  return (
    <form className="birthday_ad_form" onSubmit={handleSubmit}>
      <div className="birthday_ad_form_header">
        <span>Birthday callback</span>
        <h2>Get party availability</h2>
        <p>Tell us the basics and our team will help lock in the best package.</p>
      </div>

      <div className="birthday_ad_form_grid">
        <label>
          Your name
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          Child&apos;s name
          <input name="childName" type="text" autoComplete="off" />
        </label>
        <label>
          Child&apos;s age
          <input name="childAge" type="number" min="1" max="18" />
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
          Preferred date
          <input name="preferredDate" type="date" />
        </label>
        <label>
          Preferred time
          <input name="preferredTime" type="text" placeholder="Afternoon, evening..." />
        </label>
        <label>
          Package
          <select name="partyPackage" defaultValue={packages[0]?.name || "Birthday Party"}>
            {packages.length > 0 ? (
              packages.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))
            ) : (
              <option>Birthday Party</option>
            )}
          </select>
        </label>
        <label className="birthday_ad_form_full">
          Party notes
          <textarea name="notes" rows="3" placeholder="Guest count, food needs, special requests..." />
        </label>
      </div>

      <button className="birthday_ad_submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Birthday Request"}
      </button>
      {message && <p className={`birthday_ad_form_message birthday_ad_form_${status}`}>{message}</p>}
      <p className="birthday_ad_form_note">Weekend spots move quickly. Earlier requests get better time choices.</p>
    </form>
  );
}
