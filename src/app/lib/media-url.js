const GCS_MEDIA_PREFIX = "https://storage.googleapis.com/aerosports/";
const CDN_MEDIA_PREFIX = "https://media.aerosportsparks.ca/";

export function toMediaUrl(src) {
  if (typeof src !== "string") return src;
  if (src.startsWith(GCS_MEDIA_PREFIX)) {
    return `${CDN_MEDIA_PREFIX}${src.slice(GCS_MEDIA_PREFIX.length)}`;
  }
  return src;
}

export function mediaBackgroundImage(src) {
  const url = toMediaUrl(src);
  if (!url) return undefined;
  return `url('${String(url).replace(/'/g, "%27")}')`;
}

export function nextOptimizedImageUrl(src, width = 1200, quality = 75) {
  const url = toMediaUrl(src);
  if (!url || typeof url !== "string") return undefined;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
