"use client";
import { useState, useEffect, useCallback } from "react";

const NAV_LINKS = [
  { label: "Attractions", href: "#attractions" },
  { label: "Birthday Parties", href: "#parties" },
  { label: "Group Events", href: "#groups" },
  { label: "Blog", href: "#blog" },
  { label: "Locations", href: "#locations" },
];

export default function CorporateNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const linkStyle = (href) => ({
    fontSize: 13,
    fontWeight: 700,
    color: hoveredLink === href ? "#c8ff00" : "rgba(255,255,255,0.7)",
    textDecoration: "none",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    transition: "color 0.2s",
    cursor: "pointer",
  });

  return (
    <nav
      suppressHydrationWarning
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s",
        background: mounted && scrolled ? "rgba(8,11,24,0.97)" : "rgba(8,11,24,0.85)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
        padding: mounted && scrolled ? "10px 0" : "18px 0",
        borderBottom: "1px solid rgba(200,255,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            background: "#c8ff00",
            padding: "8px 20px",
            borderRadius: 6,
            textDecoration: "none",
            transition: "filter 0.2s",
          }}
        >
          <img
            src="https://storage.googleapis.com/aerosports/webp/oakville/logo_white.webp"
            alt="AeroSports Logo"
            style={{
              height: 40,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </a>

        {/* Desktop nav */}
        <div
          suppressHydrationWarning
          style={{
            display: mounted && isMobile ? "none" : "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  style={linkStyle(l.href)}
                  onMouseEnter={() => setHoveredLink(l.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#locations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: "#ff2d87",
              color: "#fff",
              transition: "all 0.2s",
              boxShadow: "0 0 16px rgba(255,45,135,0.35)",
            }}
          >
            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Book Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          suppressHydrationWarning
          style={{
            display: mounted && isMobile ? "block" : "none",
            background: "none",
            border: "none",
            color: "#fff",
            padding: 8,
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          <svg
            style={{ width: 24, height: 24 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mounted && isMobile && mobileOpen && (
        <div
          style={{
            background: "rgba(8,11,24,0.98)",
            borderTop: "1px solid rgba(200,255,0,0.1)",
            padding: "0 24px 16px",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#locations"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 12,
              padding: "9px 20px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: "#ff2d87",
              color: "#fff",
              boxShadow: "0 0 12px rgba(255,45,135,0.3)",
            }}
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
