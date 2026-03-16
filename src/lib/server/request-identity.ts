import { siteOrigin } from "@/lib/site";

const automationAgentPattern =
  /(axios|curl|go-http-client|headlesschrome|httpie|insomnia|node-fetch|okhttp|playwright|postmanruntime|puppeteer|python-requests|undici|wget)/i;
const crawlerAgentPattern =
  /(bot|crawl|discordbot|facebookexternalhit|preview|slurp|spider|telegrambot|whatsapp)/i;

export function createRequestId(request: Request) {
  const forwardedId = request.headers.get("x-request-id")?.trim();

  if (forwardedId) {
    return forwardedId.slice(0, 64);
  }

  return crypto.randomUUID();
}

export function getClientIp(request: Request) {
  const directIp = request.headers.get("cf-connecting-ip")?.trim();

  if (directIp) {
    return directIp;
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwarded || null;
}

export function getConfiguredOriginAllowList() {
  return (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getRequestOrigin(request: Request) {
  return request.headers.get("origin")?.trim() ?? null;
}

export function getSessionIdFromHeader(request: Request) {
  const sessionId = request.headers.get("x-client-session")?.trim() ?? "";

  return /^[A-Za-z0-9_-]{16,128}$/.test(sessionId) ? sessionId : null;
}

export function classifyUserAgent(userAgent: string) {
  if (!userAgent.trim()) {
    return "unknown";
  }

  if (automationAgentPattern.test(userAgent)) {
    return "automation";
  }

  if (crawlerAgentPattern.test(userAgent)) {
    return "crawler";
  }

  return "browser";
}

export function isAllowedOrigin(request: Request, extraOrigins: string[] = []) {
  const origin = getRequestOrigin(request);

  if (!origin) {
    return false;
  }

  const allowedOrigins = new Set<string>([
    siteOrigin,
    new URL(request.url).origin,
    ...extraOrigins,
  ]);

  return allowedOrigins.has(origin);
}

export async function hashValue(value: string) {
  const hashSalt = process.env.RATE_LIMIT_SALT?.trim() || siteOrigin;
  const bytes = new TextEncoder().encode(`${hashSalt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((chunk) => chunk.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

export async function buildRequestIdentity(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const ip = getClientIp(request) ?? "unknown";
  const sessionId = getSessionIdFromHeader(request);

  return {
    ipHash: await hashValue(ip),
    origin: getRequestOrigin(request),
    sessionHash: sessionId ? await hashValue(sessionId) : null,
    sessionId,
    userAgentFamily: classifyUserAgent(userAgent),
  };
}
