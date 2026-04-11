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

  const linkStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    transition: "color 0.2s",
  };

  // Compute dynamic styles only after mount to avoid hydration mismatches
  const navBg = mounted && scrolled ? "rgba(8,11,24,0.95)" : "transparent";
  const navBlur = mounted && scrolled ? "blur(12px)" : "none";
  const navPad = mounted && scrolled ? "12px 0" : "24px 0";

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
        background: navBg,
        WebkitBackdropFilter: navBlur,
        backdropFilter: navBlur,
        padding: navPad,
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
            gap: 4,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
              fontSize: 28,
              color: "#fff",
              letterSpacing: "0.02em",
            }}
          >
            AERO
            <span style={{ color: "var(--hv2-red, #F5163B)" }}>SPORTS</span>
          </span>
        </a>

        {/* Desktop nav — always rendered, hidden via CSS on mobile */}
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
                <a href={l.href} style={linkStyle}>
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
              background: "var(--hv2-red, #F5163B)",
              color: "#fff",
              transition: "all 0.2s",
              border: "1.5px solid var(--hv2-red, #F5163B)",
            }}
          >
            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Find Your Park
          </a>
        </div>

        {/* Mobile hamburger — always rendered, hidden via CSS on desktop */}
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
            background: "#080B18",
            borderTop: "1px solid rgba(255,255,255,0.1)",
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
                ...linkStyle,
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
              background: "var(--hv2-red, #F5163B)",
              color: "#fff",
            }}
          >
            Find Your Park
          </a>
        </div>
      )}
    </nav>
  );
}
