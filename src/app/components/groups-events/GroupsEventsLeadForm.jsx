"use client";

import { useState } from "react";
import { sendWebsiteEmail } from "@/utils/sendWebsiteEmail";

const EVENT_TYPES = [
  "Corporate Event",
  "School Group",
  "Private Event",
  "Other",
];

export default function GroupsEventsLeadForm({ locationName }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const displayName = locationName || "AeroSports";

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const groupSize = String(formData.get("groupSize") || "").trim();
    const eventType = String(formData.get("eventType") || "Group Event").trim();

    setStatus("loading");
    setMessage("");

    try {
      await sendWebsiteEmail({
        fullName: name,
        email,
        phone,
        date: "",
        time: "",
        selectedEvent: eventType,
        message: `Group size: ${groupSize}\nEvent type: ${eventType}`,
        location: displayName,
        subject: `${displayName} ${eventType} inquiry from ${name}`,
      });

      form.reset();
      setStatus("success");
      setMessage("Request sent. Our events team will be in touch shortly.");
    } catch (error) {
      setStatus("error");
      setMessage("Request could not be sent right now. Please call us or try again.");
    }
  }

  return (
    <form className="g1ge_form" onSubmit={handleSubmit}>
      <div className="g1ge_form_grid">
        <label>
          Name
          <input name="name" type="text" required autoComplete="name" placeholder="Your full name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" placeholder="(000) 000-0000" />
        </label>
        <label>
          Group Size
          <input name="groupSize" type="text" required placeholder="e.g. 25 people" />
        </label>
        <label className="g1ge_form_full">
          Event Type
          <select name="eventType" defaultValue={EVENT_TYPES[0]}>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <button className="g1ge_form_submit" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Request Your Quote"}
        </button>

        {message && (
          <p className={`g1ge_form_msg g1ge_form_${status}`}>{message}</p>
        )}
      </div>
    </form>
  );
}
