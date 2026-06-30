const WEBSITE_EMAIL_API = "https://websitebackend-439220.ue.r.appspot.com/api/email";
const DEFAULT_LOCATION_EMAIL = "event@aerosportsparks.ca";

export async function sendWebsiteEmail(payload) {
  const response = await fetch(WEBSITE_EMAIL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locationEmail: DEFAULT_LOCATION_EMAIL,
      ...payload,
    }),
  });

  if (!response.ok) {
    let details = "";
    try {
      details = await response.text();
    } catch {
      details = "";
    }

    throw new Error(details || `Email API failed with status ${response.status}`);
  }

  return response;
}

export function buildBirthdayLeadEmailPayload({
  locationName,
  fullName,
  childName,
  childAge,
  email,
  phone,
  date,
  time,
  selectedEvent,
  message,
}) {
  const safeLocation = locationName || "AeroSports";
  const safeEvent = selectedEvent || "Birthday Party";
  const safeName = fullName || "Website Visitor";
  const safeDate = date || "no date selected";
  const safeTime = time || "no time selected";
  const notes = [
    childName ? `Child name: ${childName}` : "",
    childAge ? `Child age: ${childAge}` : "",
    message || "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    fullName,
    email,
    phone,
    date,
    time,
    selectedEvent: safeEvent,
    message: notes,
    location: safeLocation,
    subject: `${safeLocation} ${safeEvent} from ${safeName} on ${safeDate} at ${safeTime}`,
  };
}

export function buildCampLeadEmailPayload({
  locationName,
  parentName,
  childName,
  childAge,
  email,
  phone,
  selectedCamp,
  preferredWeek,
  message,
}) {
  const safeLocation = locationName || "AeroSports";
  const safeCamp = selectedCamp || "Summer Camp";
  const safeName = parentName || "Website Visitor";
  const safeWeek = preferredWeek || "no week selected";
  const notes = [
    childName ? `Child name: ${childName}` : "",
    childAge ? `Child age: ${childAge}` : "",
    preferredWeek ? `Preferred week: ${preferredWeek}` : "",
    message || "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    fullName: parentName,
    email,
    phone,
    date: preferredWeek,
    time: "",
    selectedEvent: safeCamp,
    message: notes,
    location: safeLocation,
    subject: `${safeLocation} ${safeCamp} camp request from ${safeName} for ${safeWeek}`,
  };
}
