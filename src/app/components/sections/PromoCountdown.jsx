"use client";

import { useEffect, useState } from "react";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const pad = (n) => String(n).padStart(2, "0");

const parseDeadline = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(Date.UTC(1899, 11, 30) + value * DAY_MS);
    date.setUTCHours(23, 59, 59, 999);
    return date.getTime();
  }

  const raw = String(value).trim();
  const numericDate = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (numericDate) {
    const first = Number(numericDate[1]);
    const second = Number(numericDate[2]);
    const year = Number(numericDate[3].length === 2 ? `20${numericDate[3]}` : numericDate[3]);
    const dayFirst = first > 12 || raw.includes("-");
    const date = new Date(year, (dayFirst ? second : first) - 1, dayFirst ? first : second, 23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(23, 59, 59, 999);
  return parsed.getTime();
};

export default function PromoCountdown({ hours = 3, deadline, storageKey = "aero_promo_deadline" }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const fixedDeadline = parseDeadline(deadline);
    const durationMs = hours * HOUR_MS;

    const readDeadline = () => {
      if (fixedDeadline) return fixedDeadline;

      let storedDeadline = 0;
      try {
        storedDeadline = Number(localStorage.getItem(storageKey)) || 0;
      } catch {
        storedDeadline = 0;
      }

      const now = Date.now();
      if (!storedDeadline || storedDeadline <= now) {
        storedDeadline = now + durationMs;
        try {
          localStorage.setItem(storageKey, String(storedDeadline));
        } catch {
          /* ignore */
        }
      }

      return storedDeadline;
    };

    let activeDeadline = readDeadline();

    const tick = () => {
      const now = Date.now();
      let ms = activeDeadline - now;

      if (ms <= 0) {
        if (fixedDeadline) {
          setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        activeDeadline = now + durationMs;
        try {
          localStorage.setItem(storageKey, String(activeDeadline));
        } catch {
          /* ignore */
        }
        ms = durationMs;
      }

      const totalSeconds = Math.floor(ms / 1000);
      setRemaining({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline, hours, storageKey]);

  const display = remaining || { days: 0, hours, minutes: 0, seconds: 0 };

  return (
    <div className="landing_discount_timer">
      <span>Sale ends in</span>
      <strong>{pad(display.days || 0)}d</strong>
      <strong>{pad(display.hours)}h</strong>
      <strong>{pad(display.minutes)}m</strong>
      <strong>{pad(display.seconds)}s</strong>
    </div>
  );
}
