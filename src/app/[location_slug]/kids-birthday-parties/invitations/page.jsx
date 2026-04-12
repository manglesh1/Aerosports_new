"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy-load html2canvas to avoid SSR issues
const html2canvasImport = () => import("html2canvas-pro");

// ─── Image paths ───
const INVITE_ASSET_BASE = "/invitations";

const backgrounds = Array.from({ length: 7 }, (_, i) => `${INVITE_ASSET_BASE}/background${i + 1}.png`);
const foregrounds = Array.from({ length: 7 }, (_, i) => `${INVITE_ASSET_BASE}/foreground${i + 1}.png`);

// ─── Helpers ───
const dateFormat = (dateStr) => {
  try {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
  } catch {
    return "MM/DD/YY";
  }
};

const ageFormat = (x) => {
  const age = parseInt(x);
  if (isNaN(age)) return "_ᵗʰ";
  if (age % 10 === 1 && age !== 11) return `${age}ˢᵗ`;
  if (age % 10 === 2 && age !== 12) return `${age}ⁿᵈ`;
  if (age % 10 === 3 && age !== 13) return `${age}ʳᵈ`;
  return `${age}ᵗʰ`;
};

const calculateEndTime = (hour, minute) => {
  let h = parseInt(hour) + 2;
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, "0")}:${minute}`;
};

// ─── Sub-components ───

function TemplateSelector({ label, items, selected, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {items.map((src, idx) => (
          <button
            key={idx}
            className={`w-14 h-14 lg:w-20 lg:h-20 bg-cover bg-center rounded-xl border-2 transition-all duration-200 ${
              selected === src
                ? "border-[#c8ff00] ring-2 ring-[#c8ff00]/40 scale-105"
                : "border-white/20 hover:border-white/50"
            }`}
            style={{ backgroundImage: `url(${src})` }}
            onClick={() => onSelect(src)}
          />
        ))}
      </div>
    </div>
  );
}

function InvitationForm({ details, onChange, checkInTime, onTimeChange }) {
  const inputClass =
    "mt-1 w-full p-2.5 bg-black/30 border border-white/20 text-white placeholder-white/40 rounded-lg focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00]/30 focus:outline-none transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-300 mb-1";
  const selectClass =
    "p-2.5 bg-black/30 border border-white/20 text-white rounded-lg focus:border-[#c8ff00] focus:outline-none appearance-none";

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>What are you celebrating?</label>
          <input type="text" name="event" value={details.event} onChange={onChange} placeholder="e.g. Maya's Birthday" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Age turning</label>
          <input type="text" name="age" value={details.age} onChange={onChange} placeholder="e.g. 7" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" name="date" value={details.date} onChange={onChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Check-In Time</label>
          <div className="flex items-center gap-3 mt-1">
            <select name="hour" value={checkInTime.hour} onChange={onTimeChange} className={selectClass}>
              <option value="00" disabled>Hour</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-white/50 text-lg">:</span>
            <select name="minute" value={checkInTime.minute} onChange={onTimeChange} className={selectClass}>
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m.toString().padStart(2, "0")}>{m.toString().padStart(2, "0")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>RSVP Contact</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" name="name" value={details.name} onChange={onChange} placeholder="First Name" className={inputClass} />
          <input type="text" name="lastName" value={details.lastName} onChange={onChange} placeholder="Last Name" className={inputClass} />
        </div>
        <input type="text" name="phoneNumber" value={details.phoneNumber} onChange={onChange} placeholder="Phone Number" className={`${inputClass} mt-3`} />
        <input type="email" name="email" value={details.email} onChange={onChange} placeholder="Email Address" className={`${inputClass} mt-3`} />
      </div>
    </form>
  );
}

function InvitationPreview({ cardRef, bgImage, fgImage, details, checkInTime, onDownload }) {
  return (
    <div className="w-full h-[600px] lg:h-[700px] rounded-2xl shadow-2xl relative overflow-hidden">
      <div ref={cardRef} className="relative overflow-hidden w-full h-full rounded-2xl">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        {/* Foreground overlay */}
        <div className="absolute inset-0 m-1 bg-cover bg-center" style={{ backgroundImage: `url(${fgImage})` }} />
        {/* Logo */}
        <div className="absolute top-3 left-3 w-20 h-20 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${INVITE_ASSET_BASE}/aerosportslogo.png)` }} />
        {/* Text content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-white text-center" style={{ fontFamily: "'Segoe Script', cursive, sans-serif" }}>
            <p className="text-xl font-bold mt-2">
              Join us for {details.event ? `${details.event}'s` : "___'s"}
              <br />
              {details.age ? `${ageFormat(details.age)} Birthday Party!` : "Birthday Party!"}
            </p>
            <p className="mt-4">Date: {details.date ? dateFormat(details.date) : "TBD"}</p>
            <p className="mt-1">Check-In: {checkInTime.hour}:{checkInTime.minute.toString().padStart(2, "0")}</p>
            <p className="mt-1">End Time: {calculateEndTime(checkInTime.hour, checkInTime.minute)}</p>
            <p className="mt-4 font-semibold">Aerosports Trampoline Park</p>
            <p className="italic text-sm">{details.address}</p>
            <p className="mt-4 text-sm">
              Please RSVP by contacting {details.name || "___"} {details.lastName || ""} at
              <br />
              {details.phoneNumber || "XXX-XXX-XXXX"} or {details.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>
      {/* Download button */}
      <button
        onClick={onDownload}
        className="absolute top-3 right-3 bg-[#c8ff00] hover:bg-[#e00e47] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        title="Download Invitation"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Page Component ───

export default function InvitationsPage() {
  const params = useParams();
  const location_slug = params?.location_slug || "oakville";
  const cardRef = useRef(null);

  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const [fgImage, setFgImage] = useState(foregrounds[0]);

  const locationAddresses = {
    oakville: "2501 Third Line, Oakville, ON L6M 0S1",
    windsor: "7654 Tecumseh Rd E, Windsor, ON N8T 1E9",
    // add more locations as needed
  };

  const [invitationDetails, setInvitationDetails] = useState({
    name: "",
    lastName: "",
    address: locationAddresses[location_slug] || locationAddresses.oakville,
    date: "",
    time: "",
    event: "",
    checkInTime: "",
    length: "",
    phoneNumber: "",
    email: "",
    age: "",
  });

  const [checkInTime, setCheckInTime] = useState({ hour: "00", minute: "00" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvitationDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setCheckInTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await html2canvasImport()).default;
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "aerosports_invitation.png";
        link.click();
        URL.revokeObjectURL(link.href);
      });
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-[#c8ff00]/20 to-[#c8ff00]/10 border-b border-white/10 px-6 py-8 text-center">
        <span className="inline-block mb-3 px-4 py-1.5 border border-[#c8ff00] rounded-full text-[#c8ff00] text-xs font-bold uppercase tracking-widest">
          Birthday Parties
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
          Create Your <span className="text-[#c8ff00]">Party Invitation</span>
        </h1>
        <p className="text-gray-400 mt-2 max-w-lg mx-auto">
          Design a custom digital invitation for your AeroSports birthday party and share it with your guests.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Left panel: Form + selectors */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-6">
            <h2 className="text-xl font-bold text-white mb-1">Invitation Generator</h2>
            <p className="text-gray-400 text-sm mb-5">Customize your party invitation below</p>

            <TemplateSelector label="Select a border" items={backgrounds} selected={bgImage} onSelect={setBgImage} />
            <TemplateSelector label="Select an overlay image" items={foregrounds} selected={fgImage} onSelect={setFgImage} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-950 text-gray-400 text-sm font-semibold uppercase tracking-wider">Party Details</span>
              </div>
            </div>

            <InvitationForm
              details={invitationDetails}
              onChange={handleChange}
              checkInTime={checkInTime}
              onTimeChange={handleTimeChange}
            />
          </div>

          {/* Right panel: Preview */}
          <div className="lg:col-span-2">
            <p className="text-gray-400 text-sm mb-3 text-center lg:text-left">Live Preview</p>
            <InvitationPreview
              cardRef={cardRef}
              bgImage={bgImage}
              fgImage={fgImage}
              details={invitationDetails}
              checkInTime={checkInTime}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
