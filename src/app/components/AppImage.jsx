import NextImage from "next/image";
import { toMediaUrl } from "@/lib/media-url";

const IMAGE_EXTENSION_RE = /\.(?:avif|webp|png|jpe?g|gif|svg)(?:[?#].*)?$/i;
const RESIZABLE_IMAGE_EXTENSION_RE = /\.(?:avif|webp|png|jpe?g)(?:[?#].*)?$/i;
const NON_IMAGE_HOSTS = new Set(["ecom.roller.app"]);
const RESIZABLE_IMAGE_HOSTS = new Set(["media.aerosportsparks.ca"]);
const RESPONSIVE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1440, 1920];

function isRenderableImageSrc(src) {
  if (typeof src !== "string") return false;

  const value = src.trim();
  if (!value) return false;
  if (value.startsWith("/") || value.startsWith("data:image/") || value.startsWith("blob:")) return true;

  try {
    const url = new URL(value);
    if (NON_IMAGE_HOSTS.has(url.hostname)) return false;

    return IMAGE_EXTENSION_RE.test(url.pathname);
  } catch {
    return false;
  }
}

function isCloudflareResizableImage(src) {
  if (typeof src !== "string") return false;

  try {
    const url = new URL(src);
    return RESIZABLE_IMAGE_HOSTS.has(url.hostname) && RESIZABLE_IMAGE_EXTENSION_RE.test(url.pathname);
  } catch {
    return false;
  }
}

function cloudflareImageUrl(src, width, quality = 75) {
  const url = new URL(src);
  const path = `${url.pathname}${url.search}`;
  const params = [`width=${width}`, `quality=${quality}`, "format=auto"];
  return `${url.origin}/cdn-cgi/image/${params.join(",")}${path}`;
}

function getResponsiveWidths(width, fill) {
  if (fill || !width) return RESPONSIVE_WIDTHS;

  const numericWidth = Number(width);
  if (!Number.isFinite(numericWidth) || numericWidth <= 0) return RESPONSIVE_WIDTHS;

  const candidates = [numericWidth, numericWidth * 2]
    .map((value) => Math.ceil(value))
    .filter((value) => value > 0);

  return Array.from(new Set(candidates));
}

export default function AppImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  unoptimized,
  blurDataURL,
  className,
  fill = false,
  style,
  ...props
}) {
  const resolvedSrc = toMediaUrl(src);

  if (!isRenderableImageSrc(resolvedSrc)) {
    return null;
  }

  const canResize = isCloudflareResizableImage(resolvedSrc);
  const shouldOptimize = canResize && unoptimized !== true;

  if (shouldOptimize) {
    const widths = getResponsiveWidths(width, fill);
    const fallbackWidth = widths[Math.min(1, widths.length - 1)];
    const imgStyle = fill
      ? {
          position: "absolute",
          height: "100%",
          width: "100%",
          inset: 0,
          color: "transparent",
          objectFit: "cover",
          ...style,
        }
      : { objectFit: "cover", color: "transparent", ...style };

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={cloudflareImageUrl(resolvedSrc, fallbackWidth)}
        srcSet={widths.map((candidate) => `${cloudflareImageUrl(resolvedSrc, candidate)} ${candidate}w`).join(", ")}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={className}
        style={imgStyle}
      />
    );
  }

  return (
    <NextImage
      {...props}
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized ?? true}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={className}
      style={{ objectFit: "cover", ...style }}
    />
  );
}
