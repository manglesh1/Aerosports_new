"use client";
import { useState } from "react";

export default function LocationSelector({ locations }) {
  const [selected, setSelected] = useState("");

  const handleGo = () => {
    if (selected) {
      window.location.href = `/${selected}`;
    }
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          flex: 1, background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
          padding: "12px 16px", fontSize: 14,
          color: selected ? "#fff" : "rgba(255,255,255,0.5)",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="" disabled style={{ background: "#181D35", color: "rgba(255,255,255,0.5)" }}>
          Select a park...
        </option>
        {locations.map((loc) => (
          <option
            key={loc.locations}
            value={loc.locations}
            style={{ background: "#181D35", color: "#fff" }}
          >
            {loc.location || loc.desc}
          </option>
        ))}
      </select>
      <button
        onClick={handleGo}
        disabled={!selected}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 20px", borderRadius: 6,
          fontSize: 13, fontWeight: 700, letterSpacing: "0.05em",
          textTransform: "uppercase", border: "none", cursor: selected ? "pointer" : "not-allowed",
          background: selected ? "var(--hv2-red, #F5163B)" : "rgba(255,255,255,0.1)",
          color: selected ? "#fff" : "rgba(255,255,255,0.3)",
          transition: "all 0.2s",
        }}
      >
        Go
      </button>
    </div>
  );
}
