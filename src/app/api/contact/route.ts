import { NextResponse } from "next/server";

import {
  anonymousContactPolicy,
  applyRateLimit,
  applyRateLimits,
} from "@/lib/server/rate-limit";
import {
  buildRequestIdentity,
  createRequestId,
  getConfiguredOriginAllowList,
  hashValue,
  isAllowedOrigin,
} from "@/lib/server/request-identity";
import {
  logServerEvent,
  recordEndpointObservation,
} from "@/lib/server/observability";

const endpointName = "contact";
const endpointPath = "/api/contact";
const maxBodyBytes = 8_192;
const maxEmailLength = 254;
const maxMessageLength = 1_500;
const maxNameLength = 80;
const maxWebsiteLength = 120;

const emailPattern = /\S+@\S+\.\S+/;
const contactIngressPolicy = {
  burstLimit: 4,
  burstWindowMs: 60_000,
  windowLimit: 12,
  windowMs: 15 * 60_000,
  cooldownMs: 15 * 60_000,
} as const;

export const runtime = "nodejs";

type ContactPayload = {
  email: string;
  message: string;
  name: string;
  website: string;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  requestId: string,
  extraHeaders: HeadersInit = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "x-request-id": requestId,
      ...extraHeaders,
    },
  });
}

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(input: unknown) {
  if (!input || typeof input !== "object") {
    return { code: "invalid_payload", ok: false as const, status: 400 };
  }

  const payload = input as Record<string, unknown>;
  const data: ContactPayload = {
    email: normalizeField(payload.email).slice(0, maxEmailLength),
    message: normalizeField(payload.message),
    name: normalizeField(payload.name).slice(0, maxNameLength),
    website: normalizeField(payload.website).slice(0, maxWebsiteLength),
  };

  if (!data.name || !data.email || !data.message) {
    return { code: "missing_fields", ok: false as const, status: 400 };
  }

  if (!emailPattern.test(data.email)) {
    return { code: "invalid_email", ok: false as const, status: 400 };
  }

  if (data.message.length > maxMessageLength) {
    return { code: "message_too_long", ok: false as const, status: 400 };
  }

  return { data, ok: true as const };
}

async function handleContact(request: Request) {
  const requestId = createRequestId(request);
  const identity = await buildRequestIdentity(request);
  const allowedOrigins = getConfiguredOriginAllowList();
  const logBase = {
    endpoint: endpointName,
    ipHash: identity.ipHash,
    method: request.method,
    path: endpointPath,
    requestId,
    sessionHash: identity.sessionHash ?? "none",
    userAgentFamily: identity.userAgentFamily,
  };

  if (!isAllowedOrigin(request, allowedOrigins)) {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: "invalid_origin",
      status: 403,
    });
    recordEndpointObservation(endpointName, 403, "invalid_origin");

    return jsonResponse({ error: "forbidden" }, 403, requestId);
  }

  if (identity.userAgentFamily === "automation") {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: "automation_user_agent",
      status: 403,
    });
    recordEndpointObservation(endpointName, 403, "automation_user_agent");

    return jsonResponse({ error: "forbidden" }, 403, requestId);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maxBodyBytes) {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: "payload_too_large",
      status: 413,
    });
    recordEndpointObservation(endpointName, 413, "payload_too_large");

    return jsonResponse({ error: "payload_too_large" }, 413, requestId);
  }

  const coarseLimit = applyRateLimit(
    `contact:ingress:ip:${identity.ipHash}`,
    contactIngressPolicy,
  );

  if (coarseLimit.degraded) {
    logServerEvent("warn", "rate_limit_store_degraded", {
      ...logBase,
      remaining: coarseLimit.remaining,
    });
  }

  if (!coarseLimit.allowed) {
    const retryAfterSeconds = Math.max(Math.ceil(coarseLimit.retryAfterMs / 1000), 1);

    logServerEvent("warn", "contact_rate_limited", {
      ...logBase,
      reason: coarseLimit.reason ?? "rate_limited",
      retryAfterSeconds,
      status: 429,
    });
    recordEndpointObservation(endpointName, 429, coarseLimit.reason ?? "rate_limited");

    return jsonResponse(
      {
        error: "rate_limited",
        retryAfterSeconds,
      },
      429,
      requestId,
      {
        "Retry-After": String(retryAfterSeconds),
      },
    );
  }

  const rawBody = await request.text();

  if (rawBody.length > maxBodyBytes) {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: "payload_too_large",
      status: 413,
    });
    recordEndpointObservation(endpointName, 413, "payload_too_large");

    return jsonResponse({ error: "payload_too_large" }, 413, requestId);
  }

  let parsedInput: unknown;

  try {
    parsedInput = JSON.parse(rawBody);
  } catch {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: "invalid_json",
      status: 400,
    });
    recordEndpointObservation(endpointName, 400, "invalid_json");

    return jsonResponse({ error: "invalid_payload" }, 400, requestId);
  }

  const parsed = validateContactPayload(parsedInput);

  if (!parsed.ok) {
    logServerEvent("warn", "contact_rejected", {
      ...logBase,
      reason: parsed.code,
      status: parsed.status,
    });
    recordEndpointObservation(endpointName, parsed.status, parsed.code);

    return jsonResponse({ error: parsed.code }, parsed.status, requestId);
  }

  if (parsed.data.website) {
    logServerEvent("warn", "contact_honeypot_triggered", {
      ...logBase,
      reason: "honeypot",
      status: 202,
    });
    recordEndpointObservation(endpointName, 202, "honeypot");

    return jsonResponse({ ok: true }, 202, requestId);
  }

  const rateLimitKeys = [`contact:ip:${identity.ipHash}`];

  if (identity.sessionHash) {
    rateLimitKeys.push(`contact:session:${identity.sessionHash}`);
  }

  const rateLimit = applyRateLimits(rateLimitKeys, anonymousContactPolicy);

  if (rateLimit.degraded) {
    logServerEvent("warn", "rate_limit_store_degraded", {
      ...logBase,
      remaining: rateLimit.remaining,
    });
  }

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(Math.ceil(rateLimit.retryAfterMs / 1000), 1);

    logServerEvent("warn", "contact_rate_limited", {
      ...logBase,
      reason: rateLimit.reason ?? "rate_limited",
      retryAfterSeconds,
      status: 429,
    });
    recordEndpointObservation(endpointName, 429, rateLimit.reason ?? "rate_limited");

    return jsonResponse(
      {
        error: "rate_limited",
        retryAfterSeconds,
      },
      429,
      requestId,
      {
        "Retry-After": String(retryAfterSeconds),
      },
    );
  }

  const emailDomain = parsed.data.email.split("@")[1]?.toLowerCase() ?? "unknown";
  const emailDomainHash = await hashValue(emailDomain);
  const messageFingerprint = await hashValue(parsed.data.message.toLowerCase());

  logServerEvent("info", "contact_submission_accepted", {
    ...logBase,
    emailDomainHash,
    messageFingerprint,
    messageLength: parsed.data.message.length,
    nameLength: parsed.data.name.length,
    remaining: rateLimit.remaining,
    status: 202,
  });
  recordEndpointObservation(endpointName, 202);

  return jsonResponse({ ok: true }, 202, requestId);
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "x-request-id": createRequestId(request),
    },
  });
}

export async function POST(request: Request) {
  try {
    return await handleContact(request);
  } catch (error) {
    const requestId = createRequestId(request);

    logServerEvent("error", "contact_handler_failed", {
      endpoint: endpointName,
      error:
        error instanceof Error
          ? error.message.slice(0, 180)
          : "unknown_contact_handler_failure",
      method: request.method,
      path: endpointPath,
      requestId,
      status: 500,
    });
    recordEndpointObservation(endpointName, 500, "handler_failure");

    return jsonResponse({ error: "internal_error" }, 500, requestId);
  }
}
