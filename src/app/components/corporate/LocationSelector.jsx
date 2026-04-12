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
    <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 10 }}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          flex: 1, background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(200,255,0,0.3)", borderRadius: 8,
          padding: "12px 36px 12px 16px", fontSize: 14,
          color: selected ? "#fff" : "rgba(255,255,255,0.5)",
          cursor: "pointer",
          outline: "none",
          overflow: "visible",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c8ff00' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="" disabled style={{ background: "#0a0a0a", color: "rgba(255,255,255,0.5)" }}>
          Select a park...
        </option>
        {locations.map((loc) => (
          <option
            key={loc.locations}
            value={loc.locations}
            style={{ background: "#0a0a0a", color: "#fff", padding: "8px" }}
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
          background: selected ? "#c8ff00" : "rgba(255,255,255,0.1)",
          color: selected ? "#000" : "rgba(255,255,255,0.3)",
          transition: "all 0.2s",
          boxShadow: selected ? "0 0 12px rgba(200,255,0,0.3)" : "none",
        }}
      >
        Go
      </button>
    </div>
  );
}
