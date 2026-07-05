import crypto from "crypto";

/**
 * Auth admin par cookie de session SIGNÉ (HMAC-SHA256).
 *
 * L'ancien mécanisme reposait sur un cookie `admin=true` — une valeur statique
 * devinable, donc falsifiable (`curl -H "Cookie: admin=true"`). Désormais le
 * cookie contient un jeton `admin:<issuedAt>.<hmac>` qu'un tiers ne peut pas
 * forger sans le secret serveur.
 *
 * Ce module tourne côté Node (runtime des routes API). Le middleware (Edge)
 * refait la MÊME vérification via Web Crypto — format de jeton identique.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

function getSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    null
  );
}

function sign(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

/** Émet un jeton signé pour la session admin (ou null si aucun secret). */
export function signAdminToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Vérifie un jeton de session admin en temps constant. */
export function verifyAdminToken(token?: string | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;

  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);

  if (!payload.startsWith("admin:")) return false;

  const expected = sign(payload, secret);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

function readCookie(header: string, name: string): string | null {
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}

/** True uniquement si la requête porte un cookie de session admin VALIDE. */
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("cookie") || "";
  const token = readCookie(header, ADMIN_SESSION_COOKIE);
  return verifyAdminToken(token);
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "Accès admin refusé" },
    { status: 401 }
  );
}
