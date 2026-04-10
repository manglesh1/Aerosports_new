"use client";

import { useEffect, useCallback, useRef, useState } from "react";

/**
 * Thin client wrapper that auto-cycles the party image carousel rendered by
 * the server component (PartyV2). It finds slides via `data-party-slide` and
 * dots via `data-dot` attributes so no React re-render is needed — just
 * direct DOM toggling for best perf.
 *
 * Props:
 *   count  – number of slides (must match the server-rendered count)
 *   interval – ms between auto-advances (default 4 000)
 */
const PartyCarousel = ({ count, interval = 4000 }) => {
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (idx) => {
      const el = containerRef.current?.closest(".hv2-party-visual");
      if (!el) return;

      // Toggle slides
      const slides = el.querySelectorAll("[data-party-slide]");
      slides.forEach((s, i) => {
        s.style.display = i === idx ? "block" : "none";
      });

      // Toggle active dot
      const dots = el.querySelectorAll("[data-dot]");
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === idx);
      });

      setCurrent(idx);
    },
    []
  );

  // Auto-advance timer
  useEffect(() => {
    if (count <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % count;
        goTo(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [count, interval, goTo]);

  // Dot click handler (delegated)
  useEffect(() => {
    const el = containerRef.current?.closest(".hv2-party-visual");
    if (!el || count <= 1) return;

    const handleClick = (e) => {
      const dot = e.target.closest("[data-dot]");
      if (!dot) return;
      const idx = Number(dot.dataset.dot);
      if (Number.isNaN(idx)) return;

      // Reset auto-advance timer on manual click
      clearInterval(timerRef.current);
      goTo(idx);
      timerRef.current = setInterval(() => {
        setCurrent((prev) => {
          const next = (prev + 1) % count;
          goTo(next);
          return next;
        });
      }, interval);
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [count, interval, goTo]);

  // Invisible marker element so we can find the container
  return <span ref={containerRef} style={{ display: "none" }} />;
};

export default PartyCarousel;
