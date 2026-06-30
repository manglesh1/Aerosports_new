import { getPlaiceholder } from "plaiceholder";

export async function getImageWithBlur(src) {
  try {
    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    const { base64 } = await getPlaiceholder(buffer);
    return { src, base64 };
  } catch {
    return { src, base64: null };
  }
}
