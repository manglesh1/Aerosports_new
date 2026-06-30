import NextImage from "next/image";
import { toMediaUrl } from "@/lib/media-url";

const IMAGE_EXTENSION_RE = /\.(?:avif|webp|png|jpe?g|gif|svg)(?:[?#].*)?$/i;
const NON_IMAGE_HOSTS = new Set(["ecom.roller.app"]);

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

export default function AppImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
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
      loading={priority ? undefined : "lazy"}
      decoding="async"
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={className}
      style={{ objectFit: "cover", ...style }}
    />
  );
}
