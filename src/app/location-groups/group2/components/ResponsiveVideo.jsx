"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { nextOptimizedImageUrl, toMediaUrl } from "@/lib/media-url";

const IMAGE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1440, 1920];

function pickImageWidth(renderedWidth) {
  if (!renderedWidth || renderedWidth <= 0) return 640;
  const dpr = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const target = Math.ceil(renderedWidth * dpr);
  return IMAGE_WIDTHS.find((width) => width >= target) || IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
}

export default function ResponsiveVideo({
  src,
  type = "video/mp4",
  sourceMedia,
  posterSrc,
  posterQuality = 75,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [posterWidth, setPosterWidth] = useState(640);
  const normalizedPoster = useMemo(() => toMediaUrl(posterSrc), [posterSrc]);
  const normalizedSrc = useMemo(() => toMediaUrl(src), [src]);
  const poster = normalizedPoster
    ? nextOptimizedImageUrl(normalizedPoster, posterWidth, posterQuality)
    : undefined;

  useEffect(() => {
    const element = ref.current;
    if (!element || !normalizedPoster) return undefined;

    const updatePosterWidth = () => {
      const width = element.getBoundingClientRect().width || element.clientWidth || window.innerWidth;
      const nextWidth = pickImageWidth(width);
      setPosterWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    updatePosterWidth();
    const observer = new ResizeObserver(updatePosterWidth);
    observer.observe(element);
    window.addEventListener("orientationchange", updatePosterWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updatePosterWidth);
    };
  }, [normalizedPoster]);

  return (
    <video ref={ref} poster={poster || normalizedPoster || undefined} {...props}>
      {normalizedSrc && <source src={normalizedSrc} type={type} media={sourceMedia} />}
      {children}
    </video>
  );
}
