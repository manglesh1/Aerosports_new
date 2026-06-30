import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "studio_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const IS_PROD = process.env.NODE_ENV === "production";

function getSecret() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (secret) return secret;
  if (IS_PROD) {
    console.error("[studio] STUDIO_SESSION_SECRET is not set — set a long random secret in production.");
  }
  return "dev-insecure-secret-change-me";
}

/**
 * Users come from the STUDIO_USERS env var as JSON, e.g.
 *   STUDIO_USERS=[{"id":"admin","password":"s3cret"},{"id":"oakville","password":"..."}]
 * In local dev it falls back to a single admin/admin login. In production that fallback is
 * DISABLED — if STUDIO_USERS is unset, login is refused (no insecure default door).
 */
export function getUsers() {
  const raw = process.env.STUDIO_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      console.error("[studio] STUDIO_USERS is not valid JSON.");
    }
  }
  if (IS_PROD) {
    console.error("[studio] STUDIO_USERS is not set — studio login is disabled in production.");
    return [];
  }
  return [{ id: "admin", password: "admin" }];
}

export function validateCredentials(id, password) {
  const user = getUsers().find((u) => u.id === id && String(u.password) === String(password));
  return user ? { id: user.id } : null;
}

export function createSessionToken(session) {
  const payload = { ...session, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** For server components / pages. */
export function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** For server components / pages — redirects to login when not authenticated. */
export function requireSession() {
  const session = getSession();
  if (!session) redirect("/studio/login");
  return session;
}

/** For API route handlers — returns the session or null (caller returns 401). */
export function getApiSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
